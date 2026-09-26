import { seed } from "../seed";
import type { BerthPlanAdjustment } from "../models/BerthPlanAdjustment";

const rows: BerthPlanAdjustment[] = seed.berthPlanAdjustment.map((row) => ({ ...(row as BerthPlanAdjustment) }));
let nextId = rows.length + 1;

export const berthPlanAdjustmentRepository = {
  findAll: (): BerthPlanAdjustment[] => rows,
  findById: (id: number): BerthPlanAdjustment | undefined => rows.find((row) => row.id === id),
  findByBlockade: (blockadeId: number): BerthPlanAdjustment[] => rows.filter((row) => row.blockade_id === blockadeId),
  save: (row: Omit<BerthPlanAdjustment, "id">): BerthPlanAdjustment => {
    const full: BerthPlanAdjustment = { ...row, id: nextId++ };
    rows.push(full);
    return full;
  },
  update: (id: number, patch: Partial<BerthPlanAdjustment>): BerthPlanAdjustment | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
