export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","PENDING_ADJUSTMENT","DEPARTED","CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
export const BerthPlanStatusText: Record<BerthPlanStatus, string> = Object.fromEntries(BerthPlanStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<BerthPlanStatus, string>;
// 封锁处置时不纳入受影响范围的计划状态：已标记待调整、已离港、已取消
export const BLOCKADE_EXEMPT_STATUSES: readonly BerthPlanStatus[] = ["PENDING_ADJUSTMENT", "DEPARTED", "CANCELLED"];
