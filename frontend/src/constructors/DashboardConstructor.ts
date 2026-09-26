import type { DashboardSummary } from "../types/DashboardSummary";

export const createDefaultDashboardSummary = (overrides: Partial<DashboardSummary> = {}): DashboardSummary => ({
  vessels: 0,
  berths: 0,
  berthPlans: 0,
  pendingAdjustmentPlans: 0,
  activeBlockades: 0,
  reassignmentRecords: 0,
  ...overrides
});

export const createDashboardSummaryResponse = createDefaultDashboardSummary;
