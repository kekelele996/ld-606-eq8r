export const BerthReassignmentAction = ["REASSIGNED","PENDING_ADJUSTMENT"] as const;
export type BerthReassignmentAction = (typeof BerthReassignmentAction)[number];
export const BerthReassignmentActionText: Record<BerthReassignmentAction, string> = { REASSIGNED: "已改派", PENDING_ADJUSTMENT: "待调整" };
