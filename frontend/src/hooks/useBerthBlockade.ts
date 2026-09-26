import { BERTH_PLAN_CLOSED_STATUS } from "../constants/BerthPlanStatus";
import type { BerthPlan } from "../types/BerthPlan";

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string): boolean => {
  const a0 = new Date(aStart).getTime();
  const a1 = new Date(aEnd).getTime();
  const b0 = new Date(bStart).getTime();
  const b1 = new Date(bEnd).getTime();
  if ([a0, a1, b0, b1].some(Number.isNaN)) return false;
  return a0 < b1 && b0 < a1;
};

/**
 * 封锁影响预览：找出指定泊位上与封锁时间窗重叠且未离港的靠泊计划。
 * 与后端 BerthBlockadeService 的筛选口径保持一致。
 */
export function useBerthBlockade(plans: BerthPlan[], berthId: number, blockStart: string, blockEnd: string) {
  const affected = plans.filter((plan) =>
    plan.berth_id === Number(berthId) &&
    !BERTH_PLAN_CLOSED_STATUS.includes(plan.status as never) &&
    overlaps(plan.planned_arrival, plan.planned_departure, blockStart, blockEnd));
  return { affected, total: affected.length };
}
