import type { BerthPlan } from "../types/BerthPlan";

export const createDefaultBerthPlan = (overrides: Partial<BerthPlan> = {}): BerthPlan => ({
  id: 1,
  vessel_id: 1,
  berth_id: 1,
  planned_arrival: "2026-09-27T08:00:00+08:00",
  planned_departure: "2026-09-29T18:00:00+08:00",
  priority: "HIGH",
  status: "APPROVED",
  dispatcher_id: 1,
  ...overrides
});

export const createBerthPlanForm = createDefaultBerthPlan;
export const createBerthPlanResponse = createDefaultBerthPlan;
