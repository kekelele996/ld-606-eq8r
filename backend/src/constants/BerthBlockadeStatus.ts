export const BerthBlockadeStatus = ["ACTIVE","LIFTED"] as const;
export type BerthBlockadeStatus = (typeof BerthBlockadeStatus)[number];
