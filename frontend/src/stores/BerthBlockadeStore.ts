import type { BerthBlockade } from "../types/BerthBlockade";
import type { BerthPlanAdjustment } from "../types/BerthPlanAdjustment";
import type { BlockadeSummary } from "../types/BlockadeSummary";

export class BerthBlockadeStore {
  blockades: BerthBlockade[] = [];
  adjustments: BerthPlanAdjustment[] = [];
  summary: BlockadeSummary = { active_blockades: 0, pending_adjust: 0, adjustments_total: 0 };
}
