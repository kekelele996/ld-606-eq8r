export const AdjustmentAction = ["REASSIGNED","PENDING_ADJUST","RESTORED"] as const;
export type AdjustmentAction = (typeof AdjustmentAction)[number];
export const AdjustmentActionText: Record<AdjustmentAction, string> = {
  REASSIGNED: "已改派",
  PENDING_ADJUST: "待调整",
  RESTORED: "已恢复"
};
