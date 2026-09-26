export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","DEPARTED","CANCELLED","PENDING_ADJUST"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
/** 这些状态视为“已离港/已终止”，封锁处置时不再影响 */
export const BERTH_PLAN_CLOSED_STATUS: BerthPlanStatus[] = ["DEPARTED", "CANCELLED"];
