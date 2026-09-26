import type { BerthBlockade } from "../types/BerthBlockade";

export type BerthBlockadeForm = Pick<BerthBlockade, "berth_id" | "block_start" | "block_end" | "reason" | "dispatcher_id">;

export const createDefaultBerthBlockade = (overrides: Partial<BerthBlockade> = {}): BerthBlockade => ({
  id: 0,
  berth_id: 1,
  block_start: "",
  block_end: "",
  reason: "",
  status: "ACTIVE",
  dispatcher_id: 1,
  created_at: "",
  lifted_at: null,
  ...overrides
});

export const createBerthBlockadeForm = (overrides: Partial<BerthBlockadeForm> = {}): BerthBlockadeForm => ({
  berth_id: 1,
  block_start: "",
  block_end: "",
  reason: "",
  dispatcher_id: 1,
  ...overrides
});

export const createBerthBlockadeResponse = createDefaultBerthBlockade;
