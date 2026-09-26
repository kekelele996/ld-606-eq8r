import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { listBerth } from "../api/Berth";
import { listBerthPlan } from "../api/BerthPlan";
import { listVessel } from "../api/Vessel";
import {
  listBerthBlockade,
  listBerthPlanAdjustment,
  createBerthBlockade,
  liftBerthBlockade
} from "../api/BerthBlockade";
import { createBerthBlockadeForm, type BerthBlockadeForm } from "../constructors/BerthBlockadeConstructor";
import { useBerthBlockade } from "../hooks/useBerthBlockade";
import { STATUS_TEXT } from "../constants/statusText";
import { formatDateTime, formatNameList } from "../utils/formatters";
import type { Berth } from "../types/Berth";
import type { BerthPlan } from "../types/BerthPlan";
import type { Vessel } from "../types/Vessel";
import type { BerthBlockade } from "../types/BerthBlockade";
import type { BerthPlanAdjustment } from "../types/BerthPlanAdjustment";

@Component({
  selector: "app-berths-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <section class="workbench">
    <div class="panel">
      <h2>泊位资源</h2>
      <table class="grid">
        <thead><tr><th>泊位</th><th>类型</th><th>长度(m)</th><th>水深(m)</th><th>状态</th></tr></thead>
        <tbody>
          <tr *ngFor="let berth of berths">
            <td><strong>{{ berth.berth_code }}</strong></td>
            <td>{{ berth.berth_type }}</td>
            <td>{{ berth.length_m }}</td>
            <td>{{ berth.water_depth_m }}</td>
            <td><span class="badge">{{ berth.current_status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="panel">
      <h2>泊位封锁处置</h2>
      <form class="blockade-form" (ngSubmit)="submitBlockade()">
        <label>封锁泊位
          <select name="berth" [(ngModel)]="form.berth_id" required>
            <option *ngFor="let berth of berths" [ngValue]="berth.id">{{ berth.berth_code }}（{{ berth.berth_type }}）</option>
          </select>
        </label>
        <label>开始时间
          <input type="datetime-local" name="start" [(ngModel)]="form.block_start" required />
        </label>
        <label>结束时间
          <input type="datetime-local" name="end" [(ngModel)]="form.block_end" required />
        </label>
        <label>封锁原因
          <input type="text" name="reason" [(ngModel)]="form.reason" placeholder="如：泊位吊机临时检修" required />
        </label>
        <div class="preview" *ngIf="preview.total > 0">
          将影响的未离港计划 {{ preview.total }} 条：
          <span *ngFor="let plan of preview.affected" class="badge warn">#{{ plan.id }} {{ vesselName(plan.vessel_id) }}</span>
        </div>
        <div class="preview" *ngIf="preview.total === 0">当前时间窗内没有受影响的未离港计划。</div>
        <button type="submit" class="primary">发起封锁并自动处置</button>
      </form>
      <p class="message" *ngIf="message" [class.error]="isError">{{ message }}</p>
    </div>
  </section>

  <section class="workbench">
    <div class="panel wide">
      <h2>封锁记录</h2>
      <table class="grid">
        <thead><tr><th>编号</th><th>泊位</th><th>封锁窗口</th><th>原因</th><th>状态</th><th>操作</th></tr></thead>
        <tbody>
          <tr *ngFor="let blockade of blockades">
            <td>#{{ blockade.id }}</td>
            <td>{{ berthCode(blockade.berth_id) }}</td>
            <td>{{ fmt(blockade.block_start) }} ~ {{ fmt(blockade.block_end) }}</td>
            <td>{{ blockade.reason }}</td>
            <td><span class="badge" [class.warn]="blockade.status === 'ACTIVE'">{{ blockadeText(blockade.status) }}</span></td>
            <td>
              <button *ngIf="blockade.status === 'ACTIVE'" (click)="lift(blockade.id)">解除封锁</button>
              <span *ngIf="blockade.status !== 'ACTIVE'">{{ fmt(blockade.lifted_at) }}</span>
            </td>
          </tr>
          <tr *ngIf="blockades.length === 0"><td colspan="6" class="empty">暂无封锁记录</td></tr>
        </tbody>
      </table>
    </div>
    <div class="panel wide">
      <h2>改派 / 待调整记录</h2>
      <table class="grid">
        <thead><tr><th>计划</th><th>船舶</th><th>泊位变更</th><th>处置</th><th>冲突船舶</th><th>说明</th><th>时间</th></tr></thead>
        <tbody>
          <tr *ngFor="let adj of adjustments">
            <td>#{{ adj.berth_plan_id }}</td>
            <td>{{ adj.vessel_name }}</td>
            <td>{{ berthCode(adj.from_berth_id) }} → {{ adj.to_berth_id ? berthCode(adj.to_berth_id!) : '保留原泊位' }}</td>
            <td><span class="badge" [class.warn]="adj.action === 'PENDING_ADJUST'">{{ actionText(adj.action) }}</span></td>
            <td>{{ names(adj.conflict_vessels) }}</td>
            <td>{{ adj.note }}</td>
            <td>{{ fmt(adj.created_at) }}</td>
          </tr>
          <tr *ngIf="adjustments.length === 0"><td colspan="7" class="empty">暂无处置记录</td></tr>
        </tbody>
      </table>
    </div>
  </section>
  `
})
export class BerthsPage implements OnInit {
  berths: Berth[] = [];
  plans: BerthPlan[] = [];
  vessels: Vessel[] = [];
  blockades: BerthBlockade[] = [];
  adjustments: BerthPlanAdjustment[] = [];
  form: BerthBlockadeForm = createBerthBlockadeForm();
  message = "";
  isError = false;

  readonly fmt = formatDateTime;
  readonly names = formatNameList;

  async ngOnInit() {
    await this.reload();
  }

  async reload() {
    [this.berths, this.plans, this.vessels, this.blockades, this.adjustments] = await Promise.all([
      listBerth(),
      listBerthPlan(),
      listVessel(),
      listBerthBlockade(),
      listBerthPlanAdjustment()
    ]);
    if (!this.form.berth_id && this.berths.length > 0) this.form.berth_id = this.berths[0].id;
  }

  get preview() {
    return useBerthBlockade(this.plans, this.form.berth_id, this.form.block_start, this.form.block_end);
  }

  berthCode(id: number) {
    return this.berths.find((berth) => berth.id === id)?.berth_code ?? `#${id}`;
  }

  vesselName(id: number) {
    return this.vessels.find((vessel) => vessel.id === id)?.vessel_name ?? `#${id}`;
  }

  blockadeText(status: string) {
    return STATUS_TEXT.BerthBlockadeStatus[status as keyof typeof STATUS_TEXT.BerthBlockadeStatus] ?? status;
  }

  actionText(action: string) {
    return STATUS_TEXT.AdjustmentAction[action as keyof typeof STATUS_TEXT.AdjustmentAction] ?? action;
  }

  async submitBlockade() {
    this.message = "";
    this.isError = false;
    try {
      const result = await createBerthBlockade({ ...this.form, berth_id: Number(this.form.berth_id) });
      if (!result) throw new Error("empty response");
      const reassigned = result.adjustments.filter((adj) => adj.action === "REASSIGNED").length;
      const pending = result.adjustments.filter((adj) => adj.action === "PENDING_ADJUST").length;
      this.message = `封锁 #${result.blockade.id} 已创建：改派 ${reassigned} 条，待调整 ${pending} 条。`;
      this.form = createBerthBlockadeForm({ berth_id: this.form.berth_id });
      await this.reload();
    } catch (err) {
      this.isError = true;
      this.message = `封锁创建失败：${err instanceof Error ? err.message : String(err)}`;
    }
  }

  async lift(id: number) {
    this.message = "";
    this.isError = false;
    try {
      const result = await liftBerthBlockade(id);
      this.message = `封锁 #${id} 已解除：恢复待调整计划 ${result?.restored.length ?? 0} 条，已改派计划不回滚。`;
      await this.reload();
    } catch (err) {
      this.isError = true;
      this.message = `解除封锁失败：${err instanceof Error ? err.message : String(err)}`;
    }
  }
}
