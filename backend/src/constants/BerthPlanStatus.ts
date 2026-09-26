export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","PENDING_ADJUSTMENT","DEPARTED","CANCELLED"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
// 封锁处置时不纳入受影响范围的计划状态：已标记待调整、已离港、已取消
export const BLOCKADE_EXEMPT_STATUSES: readonly BerthPlanStatus[] = ["PENDING_ADJUSTMENT", "DEPARTED", "CANCELLED"];
// 评估候选泊位是否空闲时视为占用泊位的计划状态
export const BERTH_OCCUPYING_STATUSES: readonly BerthPlanStatus[] = ["APPROVED", "BERTHING", "PENDING_ADJUSTMENT"];
