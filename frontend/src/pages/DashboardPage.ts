import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { listBerth } from "../api/Berth";
import { listBerthPlan } from "../api/BerthPlan";
import { listVessel } from "../api/Vessel";
import { listBerthBlockade, fetchBlockadeSummary } from "../api/BerthBlockade";
import { STATUS_TEXT } from "../constants/statusText";
import { formatDateTime } from "../utils/formatters";
import type { Berth } from "../types/Berth";
import type { BerthPlan } from "../types/BerthPlan";
import type { Vessel } from "../types/Vessel";
import type { BerthBlockade } from "../types/BerthBlockade";
import type { BlockadeSummary } from "../types/BlockadeSummary";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule],
  template: `
  <section class="metrics">
    <div class="stat"><span>靠泊计划</span><strong>{{ plans.length }}</strong></div>
    <div class="stat"><span>靠泊中船舶</span><strong>{{ berthingCount }}</strong></div>
    <div class="stat warn-stat"><span>待调整计划</span><strong>{{ summary.pending_adjust }}</strong></div>
    <div class="stat"><span>生效中封锁</span><strong>{{ summary.active_blockades }}</strong></div>
  </section>

  <section class="workbench">
    <div class="panel wide">
      <h2>待调整计划（封锁处置后未找到合适泊位）</h2>
      <table class="grid">
        <thead><tr><th>计划</th><th>船舶</th><th>泊位</th><th>计划窗口</th><th>状态</th></tr></thead>
        <tbody>
          <tr *ngFor="let plan of pendingPlans">
            <td>#{{ plan.id }}</td>
            <td>{{ vesselName(plan.vessel_id) }}</td>
            <td>{{ berthCode(plan.berth_id) }}</td>
            <td>{{ fmt(plan.planned_arrival) }} ~ {{ fmt(plan.planned_departure) }}</td>
            <td><span class="badge warn">{{ planText(plan.status) }}</span></td>
          </tr>
          <tr *ngIf="pendingPlans.length === 0"><td colspan="5" class="empty">当前没有待调整计划</td></tr>
        </tbody>
      </table>
    </div>
    <div class="panel">
      <h2>生效中的泊位封锁</h2>
      <article class="row" *ngFor="let blockade of activeBlockades">
        <strong>{{ berthCode(blockade.berth_id) }}</strong>
        <span>{{ fmt(blockade.block_start) }} ~ {{ fmt(blockade.block_end) }}</span>
        <span class="badge warn">{{ blockade.reason }}</span>
      </article>
      <p class="empty" *ngIf="activeBlockades.length === 0">暂无生效中的封锁</p>
    </div>
  </section>
  `
})
export class DashboardPage implements OnInit {
  plans: BerthPlan[] = [];
  berths: Berth[] = [];
  vessels: Vessel[] = [];
  blockades: BerthBlockade[] = [];
  summary: BlockadeSummary = { active_blockades: 0, pending_adjust: 0, adjustments_total: 0 };

  readonly fmt = formatDateTime;

  async ngOnInit() {
    [this.plans, this.berths, this.vessels, this.blockades, this.summary] = await Promise.all([
      listBerthPlan(),
      listBerth(),
      listVessel(),
      listBerthBlockade(),
      fetchBlockadeSummary()
    ]);
  }

  get berthingCount() {
    return this.plans.filter((plan) => plan.status === "BERTHING").length;
  }

  get pendingPlans() {
    return this.plans.filter((plan) => plan.status === "PENDING_ADJUST");
  }

  get activeBlockades() {
    return this.blockades.filter((blockade) => blockade.status === "ACTIVE");
  }

  berthCode(id: number) {
    return this.berths.find((berth) => berth.id === id)?.berth_code ?? `#${id}`;
  }

  vesselName(id: number) {
    return this.vessels.find((vessel) => vessel.id === id)?.vessel_name ?? `#${id}`;
  }

  planText(status: string) {
    return STATUS_TEXT.BerthPlanStatus[status as keyof typeof STATUS_TEXT.BerthPlanStatus] ?? status;
  }
}
