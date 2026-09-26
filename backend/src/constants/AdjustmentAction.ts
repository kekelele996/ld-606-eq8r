export const AdjustmentAction = ["REASSIGNED","PENDING_ADJUST","RESTORED"] as const;
export type AdjustmentAction = (typeof AdjustmentAction)[number];
