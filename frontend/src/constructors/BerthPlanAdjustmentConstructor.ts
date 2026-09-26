import type { BerthPlanAdjustment } from "../types/BerthPlanAdjustment";

export const createDefaultBerthPlanAdjustment = (overrides: Partial<BerthPlanAdjustment> = {}): BerthPlanAdjustment => ({
  id: 0,
  blockade_id: 0,
  berth_plan_id: 0,
  vessel_id: 0,
  vessel_name: "",
  from_berth_id: 0,
  to_berth_id: null,
  prev_status: "APPROVED",
  action: "PENDING_ADJUST",
  conflict_vessels: [],
  note: "",
  created_at: "",
  resolved_at: null,
  ...overrides
});

export const createBerthPlanAdjustmentForm = createDefaultBerthPlanAdjustment;
export const createBerthPlanAdjustmentResponse = createDefaultBerthPlanAdjustment;
