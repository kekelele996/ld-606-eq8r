export const BerthBlockadeStatus = ["ACTIVE","LIFTED"] as const;
export type BerthBlockadeStatus = (typeof BerthBlockadeStatus)[number];
export const BerthBlockadeStatusText: Record<BerthBlockadeStatus, string> = { ACTIVE: "封锁中", LIFTED: "已解除" };
