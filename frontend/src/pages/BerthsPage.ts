import { listBerth } from "../api/Berth";
import { listBerthPlan } from "../api/BerthPlan";
import { listVessel } from "../api/Vessel";
import { createBerthBlockade, liftBerthBlockade } from "../api/BerthBlockade";
import { BerthBlockadeStore } from "../stores/BerthBlockadeStore";
import { BerthReassignmentStore } from "../stores/BerthReassignmentStore";
import { createBerthBlockadeForm, type BerthBlockadeForm } from "../constructors/BerthBlockadeConstructor";
import { useBerthBlockade } from "../hooks/useBerthBlockade";
import { formatReassignmentState } from "../utils/formatters";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { Berth } from "../types/Berth";
import type { BerthPlan } from "../types/BerthPlan";
import type { Vessel } from "../types/Vessel";
import type { BerthBlockadeResult, BerthBlockadeLiftResult } from "../types/BerthBlockade";

export class BerthsPage {
  berths: Berth[] = [];
  plans: BerthPlan[] = [];
  vessels: Vessel[] = [];
  readonly blockadeStore = new BerthBlockadeStore();
  readonly reassignmentStore = new BerthReassignmentStore();
  blockadeForm: BerthBlockadeForm = createBerthBlockadeForm();
  lastMessage = "";
  readonly formatReassignmentState = formatReassignmentState;

  async load(): Promise<void> {
    [this.berths, this.plans, this.vessels] = await Promise.all([listBerth(), listBerthPlan(), listVessel()]);
    await Promise.all([this.blockadeStore.load(), this.reassignmentStore.load()]);
  }

  // 提交前预览：时间重叠且未离港的计划
  get affectedPreview() {
    return useBerthBlockade(this.plans, this.blockadeForm.berth_id, this.blockadeForm.block_start, this.blockadeForm.block_end);
  }

  get pendingAdjustmentPlans(): BerthPlan[] {
    return this.plans.filter((plan) => plan.status === "PENDING_ADJUSTMENT");
  }

  berthCodeOf(id: number): string {
    return this.berths.find((berth) => berth.id === id)?.berth_code ?? `#${id}`;
  }

  vesselNameOf(id: number): string {
    return this.vessels.find((vessel) => vessel.id === id)?.vessel_name ?? `#${id}`;
  }

  // 调度提交封锁：系统同步改派或标记待调整，并返回改派记录
  async submitBlockade(): Promise<BerthBlockadeResult> {
    const result = await createBerthBlockade(this.blockadeForm);
    console.info(LOG_TEMPLATES.BerthBlockade[0], result.blockade.id);
    const reassigned = result.affected.filter((row) => row.action === "REASSIGNED").length;
    const pending = result.affected.filter((row) => row.action === "PENDING_ADJUSTMENT").length;
    this.lastMessage = `封锁已创建：同步改派 ${reassigned} 条，待调整 ${pending} 条`;
    this.blockadeForm = createBerthBlockadeForm();
    await this.load();
    return result;
  }

  // 解除封锁：只恢复仍待调整的计划，已改派计划不回滚
  async liftBlockade(id: number): Promise<BerthBlockadeLiftResult> {
    const result = await liftBerthBlockade(id);
    console.info(LOG_TEMPLATES.BerthBlockade[1], id);
    this.lastMessage = `封锁已解除：恢复待调整计划 ${result.restored.length} 条，已改派计划保持不动`;
    await this.load();
    return result;
  }
}
