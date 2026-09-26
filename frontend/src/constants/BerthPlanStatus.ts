export const BerthPlanStatus = ["DRAFT","CONFLICT","APPROVED","BERTHING","DEPARTED","CANCELLED","PENDING_ADJUST"] as const;
export type BerthPlanStatus = (typeof BerthPlanStatus)[number];
export const BerthPlanStatusText: Record<BerthPlanStatus, string> = {
  DRAFT: "草稿",
  CONFLICT: "冲突",
  APPROVED: "已批准",
  BERTHING: "靠泊中",
  DEPARTED: "已离港",
  CANCELLED: "已取消",
  PENDING_ADJUST: "待调整"
};
/** 这些状态视为“已离港/已终止”，封锁处置时不再影响 */
export const BERTH_PLAN_CLOSED_STATUS: BerthPlanStatus[] = ["DEPARTED", "CANCELLED"];
