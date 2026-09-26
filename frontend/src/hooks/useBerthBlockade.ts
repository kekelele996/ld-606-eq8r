import { BLOCKADE_EXEMPT_STATUSES } from "../constants/BerthPlanStatus";
import { timeRangesOverlap } from "../utils/timeOverlap";
import type { BerthPlan } from "../types/BerthPlan";

// 预览封锁将影响的靠泊计划：时间重叠且未离港（不含已取消、已待调整）
export function useBerthBlockade(plans: BerthPlan[] = [], berthId: number, blockStart: string, blockEnd: string) {
  const affected = plans.filter((plan) =>
    plan.berth_id === berthId &&
    !(BLOCKADE_EXEMPT_STATUSES as readonly string[]).includes(plan.status) &&
    timeRangesOverlap(plan.planned_arrival, plan.planned_departure, blockStart, blockEnd));
  return { affected, total: affected.length };
}
