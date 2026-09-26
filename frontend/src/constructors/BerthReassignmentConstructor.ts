import type { BerthReassignment } from "../types/BerthReassignment";

export const createDefaultBerthReassignment = (overrides: Partial<BerthReassignment> = {}): BerthReassignment => ({
  id: 0,
  blockade_id: 0,
  berth_plan_id: 0,
  vessel_id: 0,
  vessel_name: "",
  from_berth_id: 0,
  to_berth_id: null,
  prev_status: "",
  action: "PENDING_ADJUSTMENT",
  created_at: "",
  restored_at: null,
  ...overrides
});

export const createBerthReassignmentForm = createDefaultBerthReassignment;
export const createBerthReassignmentResponse = createDefaultBerthReassignment;
