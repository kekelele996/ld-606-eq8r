import { berthRepository } from "../repositories/BerthRepository";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { vesselRepository } from "../repositories/VesselRepository";
import { berthBlockadeRepository } from "../repositories/BerthBlockadeRepository";
import { berthPlanAdjustmentRepository } from "../repositories/BerthPlanAdjustmentRepository";
import { BERTH_PLAN_CLOSED_STATUS } from "../constants/BerthPlanStatus";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { createBerthBlockadeDto } from "../constructors/BerthBlockadeDtoFactory";
import { createBerthPlanAdjustmentDto } from "../constructors/BerthPlanAdjustmentDtoFactory";
import { toAuditTarget } from "../utils/formatters";
import type { Berth } from "../models/Berth";
import type { BerthPlan } from "../models/BerthPlan";
import type { BerthPlanAdjustment } from "../models/BerthPlanAdjustment";
import type { BerthBlockadePayload } from "../types/BerthBlockadePayload";

type ErrorCode = keyof typeof ERROR_MESSAGES;

const fail = (status: number, code: ErrorCode): never => {
  const err = new Error(ERROR_MESSAGES[code]) as Error & { status: number; code: string };
  err.status = status;
  err.code = code;
  throw err;
};

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean =>
  new Date(aStart).getTime() < new Date(bEnd).getTime() && new Date(bStart).getTime() < new Date(aEnd).getTime();

const isClosed = (plan: BerthPlan): boolean => BERTH_PLAN_CLOSED_STATUS.includes(plan.status as never);

/** 泊位在指定时间窗内是否存在生效中的封锁 */
const hasActiveBlockade = (berthId: number, start: string, end: string): boolean =>
  berthBlockadeRepository.findAll().some((blockade) =>
    blockade.berth_id === berthId && blockade.status === "ACTIVE" &&
    overlaps(blockade.block_start, blockade.block_end, start, end));

/** 泊位在指定时间窗内占用它的未离港计划 */
const occupyingPlans = (berthId: number, start: string, end: string, ignorePlanId?: number): BerthPlan[] =>
  berthPlanRepository.findAll().filter((plan) =>
    plan.berth_id === berthId && plan.id !== ignorePlanId && !isClosed(plan) &&
    overlaps(plan.planned_arrival, plan.planned_departure, start, end));

/** 长度和水深都满足船舶要求的候选泊位（不含被封锁泊位本身） */
const suitableBerths = (blockedBerthId: number, vesselId: number): Berth[] => {
  const vessel = vesselRepository.findById(vesselId);
  if (!vessel) return [];
  return berthRepository.findAll().filter((berth) =>
    berth.id !== blockedBerthId &&
    Number(berth.length_m) >= Number(vessel.length_m) &&
    Number(berth.water_depth_m) >= Number(vessel.draft_m));
};

export const berthBlockadeService = {
  list: () => berthBlockadeRepository.findAll(),

  listAdjustments: () => berthPlanAdjustmentRepository.findAll(),

  summary: () => ({
    active_blockades: berthBlockadeRepository.findAll().filter((row) => row.status === "ACTIVE").length,
    pending_adjust: berthPlanRepository.findAll().filter((plan) => plan.status === "PENDING_ADJUST").length,
    adjustments_total: berthPlanAdjustmentRepository.findAll().length
  }),

  create: (payload: BerthBlockadePayload) => {
    const berthId = Number(payload.berth_id);
    const berth = berthRepository.findById(berthId);
    if (!berth) fail(404, "BERTH_NOT_FOUND");
    const start = new Date(payload.block_start).getTime();
    const end = new Date(payload.block_end).getTime();
    if (Number.isNaN(start) || Number.isNaN(end) || !payload.reason?.trim()) fail(400, "VALIDATION_FAILED");
    if (start >= end) fail(400, "BLOCKADE_WINDOW_INVALID");

    const blockade = berthBlockadeRepository.save(createBerthBlockadeDto({
      berth_id: berthId,
      block_start: payload.block_start,
      block_end: payload.block_end,
      reason: payload.reason.trim(),
      dispatcher_id: Number(payload.dispatcher_id ?? 1),
      created_at: new Date().toISOString()
    }) as Omit<Parameters<typeof berthBlockadeRepository.save>[0], "id">);
    console.info(LOG_TEMPLATES.BerthBlockade[0], toAuditTarget("BerthBlockade", blockade.id));

    // 时间重叠且未离港的计划才需要处置
    const affected = berthPlanRepository.findAll().filter((plan) =>
      plan.berth_id === berthId && !isClosed(plan) &&
      overlaps(plan.planned_arrival, plan.planned_departure, payload.block_start, payload.block_end));

    const adjustments: BerthPlanAdjustment[] = [];
    for (const plan of affected) {
      const prevStatus = plan.status;
      const vessel = vesselRepository.findById(plan.vessel_id);
      const candidates = suitableBerths(berthId, plan.vessel_id);
      const target = candidates.find((candidate) =>
        !hasActiveBlockade(candidate.id, plan.planned_arrival, plan.planned_departure) &&
        occupyingPlans(candidate.id, plan.planned_arrival, plan.planned_departure, plan.id).length === 0);

      if (target) {
        // 找到长度/吃水都合适的空闲泊位：同步改派，计划状态保持不变
        berthPlanRepository.update(plan.id, { berth_id: target.id });
        adjustments.push(berthPlanAdjustmentRepository.save(createBerthPlanAdjustmentDto({
          blockade_id: blockade.id,
          berth_plan_id: plan.id,
          vessel_id: plan.vessel_id,
          vessel_name: vessel?.vessel_name ?? `#${plan.vessel_id}`,
          from_berth_id: berthId,
          to_berth_id: target.id,
          prev_status: prevStatus,
          action: "REASSIGNED",
          conflict_vessels: [],
          note: `改派至 ${target.berth_code}`,
          created_at: new Date().toISOString()
        }) as Omit<BerthPlanAdjustment, "id">));
        console.info(LOG_TEMPLATES.BerthBlockade[2], toAuditTarget("BerthPlan", plan.id), "->", toAuditTarget("Berth", target.id));
      } else {
        // 找不到合适泊位：保留原泊位并标为待调整，写明冲突船舶
        const conflictVessels = [...new Set(candidates.flatMap((candidate) =>
          occupyingPlans(candidate.id, plan.planned_arrival, plan.planned_departure, plan.id)
            .map((other) => vesselRepository.findById(other.vessel_id)?.vessel_name ?? `#${other.vessel_id}`)))];
        berthPlanRepository.update(plan.id, { status: "PENDING_ADJUST" });
        adjustments.push(berthPlanAdjustmentRepository.save(createBerthPlanAdjustmentDto({
          blockade_id: blockade.id,
          berth_plan_id: plan.id,
          vessel_id: plan.vessel_id,
          vessel_name: vessel?.vessel_name ?? `#${plan.vessel_id}`,
          from_berth_id: berthId,
          to_berth_id: null,
          prev_status: prevStatus,
          action: "PENDING_ADJUST",
          conflict_vessels: conflictVessels,
          note: conflictVessels.length > 0 ? "候选泊位被冲突船舶占用" : "无长度/吃水合适的备选泊位",
          created_at: new Date().toISOString()
        }) as Omit<BerthPlanAdjustment, "id">));
        console.info(LOG_TEMPLATES.BerthBlockade[3], toAuditTarget("BerthPlan", plan.id), conflictVessels.join(","));
      }
    }
    return { blockade, adjustments };
  },

  lift: (id: number) => {
    const blockade = berthBlockadeRepository.findById(id) ?? fail(404, "BLOCKADE_NOT_FOUND");
    if (blockade.status === "LIFTED") fail(409, "BLOCKADE_ALREADY_LIFTED");

    // 只恢复仍待调整的计划；已改派的计划不回滚
    const restored: BerthPlanAdjustment[] = [];
    for (const adjustment of berthPlanAdjustmentRepository.findByBlockade(id)) {
      if (adjustment.action !== "PENDING_ADJUST") continue;
      const plan = berthPlanRepository.findById(adjustment.berth_plan_id);
      if (!plan || plan.status !== "PENDING_ADJUST") continue;
      berthPlanRepository.update(plan.id, { status: adjustment.prev_status });
      const updated = berthPlanAdjustmentRepository.update(adjustment.id, {
        action: "RESTORED",
        resolved_at: new Date().toISOString(),
        note: "封锁解除，恢复原状态"
      });
      if (updated) restored.push(updated);
      console.info(LOG_TEMPLATES.BerthBlockade[4], toAuditTarget("BerthPlan", plan.id));
    }
    const lifted = berthBlockadeRepository.update(id, { status: "LIFTED", lifted_at: new Date().toISOString() }) ?? fail(404, "BLOCKADE_NOT_FOUND");
    console.info(LOG_TEMPLATES.BerthBlockade[1], toAuditTarget("BerthBlockade", id));
    return { blockade: lifted, restored };
  }
};
