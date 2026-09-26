import type { Berth } from "../types/Berth";

export const createDefaultBerth = (overrides: Partial<Berth> = {}): Berth => ({
  id: 1,
  berth_code: "B01",
  length_m: 260,
  water_depth_m: 14.5,
  berth_type: "集装箱",
  current_status: "FREE",
  safety_note: "深水泊位，可接大型集装箱船",
  ...overrides
});

export const createBerthForm = createDefaultBerth;
export const createBerthResponse = createDefaultBerth;
