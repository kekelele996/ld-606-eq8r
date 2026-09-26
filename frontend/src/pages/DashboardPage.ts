import { DashboardStore } from "../stores/DashboardStore";

export class DashboardPage {
  readonly store = new DashboardStore();

  async load(): Promise<void> {
    await this.store.load();
  }

  // 总览展示待调整计划数量
  get pendingAdjustmentCount(): number {
    return this.store.summary.pendingAdjustmentPlans;
  }

  get overviewCards() {
    return [
      { label: "待调整靠泊计划", value: this.store.summary.pendingAdjustmentPlans },
      { label: "进行中的泊位封锁", value: this.store.summary.activeBlockades },
      { label: "改派记录", value: this.store.summary.reassignmentRecords },
      { label: "靠泊计划总数", value: this.store.summary.berthPlans }
    ];
  }
}
