import { getDashboardSummary } from "../api/Dashboard";
import { createDefaultDashboardSummary } from "../constructors/DashboardConstructor";
import type { DashboardSummary } from "../types/DashboardSummary";

export class DashboardStore {
  summary: DashboardSummary = createDefaultDashboardSummary();

  async load(): Promise<DashboardSummary> {
    this.summary = await getDashboardSummary();
    return this.summary;
  }
}
