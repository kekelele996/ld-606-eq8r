import { berthBlockadeRepository } from "../repositories/BerthBlockadeRepository";
import { berthReassignmentRepository } from "../repositories/BerthReassignmentRepository";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { vesselRepository } from "../repositories/VesselRepository";
import { berthService } from "./BerthService";
import { createBerthBlockadeDto } from "../constructors/BerthBlockadeDtoFactory";
import { createBerthReassignmentDto } from "../constructors/BerthReassignmentDtoFactory";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { BLOCKADE_EXEMPT_STATUSES } from "../constants/BerthPlanStatus";
import { toAuditTarget } from "../utils/formatters";
import { isValidTimeRange, timeRangesOverlap } from "../utils/timeOverlap";
import type { BerthBlockade } from "../models/BerthBlockade";
import type { BerthReassignment } from "../models/BerthReassignment";
import type { BerthBlockadePayload } from "../types/BerthBlockadePayload";

function fail(status: number, code: string, message: string): never {
  const err = new Error(message) as Error & { status: number; code: string };
  err.status = status;
  err.code = code;
  throw err;
}

export const berthBlockadeService = {
  list: (): BerthBlockade[] => berthBlockadeRepository.findAll(),

  // 调度提交封锁：找出时间重叠且未离港的计划，能改派则同步改派，否则保留原泊位并标为待调整
  create: (payload: BerthBlockadePayload): { blockade: BerthBlockade; affected: BerthReassignment[] } => {
    const berthId = Number(payload.berth_id);
    const berth = berthRepository.findById(berthId);
    if (!berth) fail(404, ERROR_CODES.BERTH_NOT_FOUND, ERROR_MESSAGES.BERTH_NOT_FOUND);
    const blockStart = String(payload.block_start ?? "");
    const blockEnd = String(payload.block_end ?? "");
    const reason = String(payload.reason ?? "").trim();
    if (!reason) fail(400, ERROR_CODES.VALIDATION_FAILED, ERROR_MESSAGES.VALIDATION_FAILED);
    if (!isValidTimeRange(blockStart, blockEnd)) fail(400, ERROR_CODES.BLOCKADE_TIME_INVALID, ERROR_MESSAGES.BLOCKADE_TIME_INVALID);

    const blockade = berthBlockadeRepository.save(createBerthBlockadeDto({
      berth_id: berthId,
      block_start: blockStart,
      block_end: blockEnd,
      reason,
      status: "ACTIVE",
      dispatcher_id: Number(payload.dispatcher_id ?? 1),
      created_at: new Date().toISOString(),
      lifted_at: null
    }));
    console.info(LOG_TEMPLATES.BerthBlockade[0], toAuditTarget("BerthBlockade", blockade.id), reason);

    const affected = berthPlanRepository.findAll().filter((plan) =>
      plan.berth_id === berthId &&
      !(BLOCKADE_EXEMPT_STATUSES as readonly string[]).includes(plan.status) &&
      timeRangesOverlap(plan.planned_arrival, plan.planned_departure, blockStart, blockEnd));

    const records = affected.map((plan) => {
      const vessel = vesselRepository.findById(plan.vessel_id);
      const vesselName = vessel?.vessel_name ?? `vessel#${plan.vessel_id}`;
      const prevStatus = plan.status;
      const candidate = berthService.findReassignmentCandidate(plan, vessel, berthId);
      if (candidate) {
        berthPlanRepository.update(plan.id, { berth_id: candidate.id });
        console.info(LOG_TEMPLATES.BerthPlan[4], toAuditTarget("BerthPlan", plan.id), candidate.berth_code);
        return berthReassignmentRepository.save(createBerthReassignmentDto({
          blockade_id: blockade.id,
          berth_plan_id: plan.id,
          vessel_id: plan.vessel_id,
          vessel_name: vesselName,
          from_berth_id: berthId,
          to_berth_id: candidate.id,
          prev_status: prevStatus,
          action: "REASSIGNED",
          created_at: new Date().toISOString(),
          restored_at: null
        }) as Omit<BerthReassignment, "id">);
      }
      berthPlanRepository.update(plan.id, { status: "PENDING_ADJUSTMENT" });
      console.info(LOG_TEMPLATES.BerthPlan[5], toAuditTarget("BerthPlan", plan.id), vesselName);
      return berthReassignmentRepository.save(createBerthReassignmentDto({
        blockade_id: blockade.id,
        berth_plan_id: plan.id,
        vessel_id: plan.vessel_id,
        vessel_name: vesselName,
        from_berth_id: berthId,
        to_berth_id: null,
        prev_status: prevStatus,
        action: "PENDING_ADJUSTMENT",
        created_at: new Date().toISOString(),
        restored_at: null
      }) as Omit<BerthReassignment, "id">);
    });
    console.info(LOG_TEMPLATES.BerthReassignment[0], toAuditTarget("BerthBlockade", blockade.id), `affected=${records.length}`);
    return { blockade, affected: records };
  },

  // 解除封锁：只恢复仍待调整的计划，已改派的计划不回滚
  lift: (id: number): { blockade: BerthBlockade; restored: BerthReassignment[] } => {
    const blockade = berthBlockadeRepository.findById(Number(id));
    if (!blockade) fail(404, ERROR_CODES.BLOCKADE_NOT_FOUND, ERROR_MESSAGES.BLOCKADE_NOT_FOUND);
    if (blockade.status === "LIFTED") fail(409, ERROR_CODES.BLOCKADE_ALREADY_LIFTED, ERROR_MESSAGES.BLOCKADE_ALREADY_LIFTED);

    const liftedAt = new Date().toISOString();
    berthBlockadeRepository.update(blockade.id, { status: "LIFTED", lifted_at: liftedAt });
    console.info(LOG_TEMPLATES.BerthBlockade[1], toAuditTarget("BerthBlockade", blockade.id));

    const restored: BerthReassignment[] = [];
    for (const record of berthReassignmentRepository.findByBlockadeId(blockade.id)) {
      if (record.action !== "PENDING_ADJUSTMENT" || record.restored_at) continue;
      const plan = berthPlanRepository.findById(record.berth_plan_id);
      if (!plan || plan.status !== "PENDING_ADJUSTMENT") continue;
      berthPlanRepository.update(plan.id, { status: record.prev_status });
      berthReassignmentRepository.update(record.id, { restored_at: liftedAt });
      restored.push(record);
      console.info(LOG_TEMPLATES.BerthReassignment[1], toAuditTarget("BerthReassignment", record.id), record.vessel_name);
    }
    return { blockade: berthBlockadeRepository.findById(blockade.id) as BerthBlockade, restored };
  }
};
