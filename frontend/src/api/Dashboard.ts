import { mockData } from "../mocks/seedData";
import { createDefaultDashboardSummary } from "../constructors/DashboardConstructor";
import type { BerthBlockade } from "../types/BerthBlockade";
import type { BerthPlan } from "../types/BerthPlan";
import type { DashboardSummary } from "../types/DashboardSummary";

const endpoint = "/api/dashboard/summary";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  const plans = mockData.berthPlan as unknown as BerthPlan[];
  const blockades = mockData.berthBlockade as unknown as BerthBlockade[];
  return createDefaultDashboardSummary({
    vessels: mockData.vessel.length,
    berths: mockData.berth.length,
    berthPlans: plans.length,
    pendingAdjustmentPlans: plans.filter((plan) => plan.status === "PENDING_ADJUSTMENT").length,
    activeBlockades: blockades.filter((row) => row.status === "ACTIVE").length,
    reassignmentRecords: mockData.berthReassignment.length
  });
}
