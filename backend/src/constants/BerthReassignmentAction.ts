export const BerthReassignmentAction = ["REASSIGNED","PENDING_ADJUSTMENT"] as const;
export type BerthReassignmentAction = (typeof BerthReassignmentAction)[number];
