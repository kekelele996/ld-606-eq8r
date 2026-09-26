import type { BerthBlockade } from "../types/BerthBlockade";

export interface BerthBlockadeForm {
  berth_id: number;
  block_start: string;
  block_end: string;
  reason: string;
}

export const createDefaultBerthBlockade = (overrides: Partial<BerthBlockade> = {}): BerthBlockade => ({
  id: 0,
  berth_id: 0,
  block_start: "",
  block_end: "",
  reason: "",
  status: "ACTIVE",
  dispatcher_id: 1,
  created_at: "",
  lifted_at: null,
  ...overrides
});

/** 调度员填写的封锁表单：泊位、起止时间、原因 */
export const createBerthBlockadeForm = (overrides: Partial<BerthBlockadeForm> = {}): BerthBlockadeForm => ({
  berth_id: 0,
  block_start: "",
  block_end: "",
  reason: "",
  ...overrides
});

export const createBerthBlockadeResponse = createDefaultBerthBlockade;
