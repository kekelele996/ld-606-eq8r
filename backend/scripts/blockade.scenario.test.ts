import { berthBlockadeService } from "../src/services/BerthBlockadeService";
import { berthPlanRepository } from "../src/repositories/BerthPlanRepository";
import { berthReassignmentRepository } from "../src/repositories/BerthReassignmentRepository";
import { dashboardService } from "../src/services/DashboardService";

const assert = (cond: boolean, msg: string) => { if (!cond) { console.error("FAIL:", msg); process.exit(1); } console.log("ok:", msg); };

// 1. 调度封锁 B1：2026-09-27 ~ 2026-09-29 检修
const result = berthBlockadeService.create({ berth_id: 1, block_start: "2026-09-27T00:00:00+08:00", block_end: "2026-09-29T23:59:59+08:00", reason: "B1 泊位吊机检修", dispatcher_id: 1 });
assert(result.blockade.status === "ACTIVE", "blockade created ACTIVE");
assert(result.affected.length === 2, `two plans affected (got ${result.affected.length})`);

const plan1 = berthPlanRepository.findById(1)!;
const plan2 = berthPlanRepository.findById(2)!;
const plan4 = berthPlanRepository.findById(4)!;
assert(plan1.berth_id === 4 && plan1.status === "APPROVED", "plan1 reassigned to B4, stays APPROVED");
assert(plan2.berth_id === 1 && plan2.status === "PENDING_ADJUSTMENT", "plan2 keeps B1, marked PENDING_ADJUSTMENT");
assert(plan4.berth_id === 1 && plan4.status === "DEPARTED", "plan4 (departed) untouched");

const rec1 = berthReassignmentRepository.findAll().find((r) => r.berth_plan_id === 1)!;
const rec2 = berthReassignmentRepository.findAll().find((r) => r.berth_plan_id === 2)!;
assert(rec1.action === "REASSIGNED" && rec1.to_berth_id === 4 && rec1.vessel_name === "远洋之星", "rec1 REASSIGNED -> B4 with vessel name");
assert(rec2.action === "PENDING_ADJUSTMENT" && rec2.to_berth_id === null && rec2.vessel_name === "海丰66" && rec2.prev_status === "APPROVED", "rec2 PENDING_ADJUSTMENT records conflict vessel 海丰66");

let summary = dashboardService.summary();
assert(summary.pendingAdjustmentPlans === 1 && summary.activeBlockades === 1 && summary.reassignmentRecords === 2, "dashboard: 1 pending, 1 active blockade, 2 records");

// 2. 解除封锁：只恢复仍待调整的计划，已改派不回滚
const lift = berthBlockadeService.lift(result.blockade.id);
assert(lift.restored.length === 1, "one plan restored on lift");
assert(berthPlanRepository.findById(2)!.status === "APPROVED", "plan2 restored to APPROVED");
assert(berthPlanRepository.findById(1)!.berth_id === 4, "plan1 NOT rolled back, still on B4");
assert(berthReassignmentRepository.findById(rec2.id)!.restored_at !== null, "rec2 restored_at set");
assert(berthReassignmentRepository.findById(rec1.id)!.restored_at === null, "rec1 (reassigned) not restored");

summary = dashboardService.summary();
assert(summary.pendingAdjustmentPlans === 0 && summary.activeBlockades === 0, "dashboard: 0 pending, 0 active blockades after lift");

// 3. 异常分支
const expectFail = (fn: () => void, code: string, msg: string) => {
  try { fn(); } catch (err) { assert((err as { code?: string }).code === code, msg); return; }
  console.error("FAIL: expected throw", msg); process.exit(1);
};
expectFail(() => berthBlockadeService.lift(result.blockade.id), "BLOCKADE_ALREADY_LIFTED", "double lift rejected");
expectFail(() => berthBlockadeService.lift(999), "BLOCKADE_NOT_FOUND", "lift unknown blockade rejected");
expectFail(() => berthBlockadeService.create({ berth_id: 999, block_start: "2026-09-27T00:00:00+08:00", block_end: "2026-09-28T00:00:00+08:00", reason: "x" }), "BERTH_NOT_FOUND", "unknown berth rejected");
expectFail(() => berthBlockadeService.create({ berth_id: 1, block_start: "2026-09-29T00:00:00+08:00", block_end: "2026-09-28T00:00:00+08:00", reason: "x" }), "BLOCKADE_TIME_INVALID", "reversed time range rejected");
expectFail(() => berthBlockadeService.create({ berth_id: 1, block_start: "2026-09-27T00:00:00+08:00", block_end: "2026-09-28T00:00:00+08:00", reason: " " }), "VALIDATION_FAILED", "empty reason rejected");

console.log("ALL BLOCKADE SCENARIO TESTS PASSED");
