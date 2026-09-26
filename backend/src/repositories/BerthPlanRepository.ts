import { seed } from "../seed";
import { nextId } from "../utils/nextId";
import { timeRangesOverlap } from "../utils/timeOverlap";
import { BERTH_OCCUPYING_STATUSES } from "../constants/BerthPlanStatus";
import type { BerthPlan } from "../models/BerthPlan";

export const berthPlanRepository = {
  findAll: (): BerthPlan[] => seed.berthPlan,
  findById: (id: number): BerthPlan | undefined => seed.berthPlan.find((row) => row.id === id),
  save: (row: Omit<BerthPlan, "id"> & { id?: number }): BerthPlan => {
    const next = { ...row, id: row.id ? row.id : nextId(seed.berthPlan) } as BerthPlan;
    seed.berthPlan.push(next);
    return next;
  },
  update: (id: number, patch: Partial<BerthPlan>): BerthPlan | undefined => {
    const row = seed.berthPlan.find((item) => item.id === id);
    if (row) Object.assign(row, patch);
    return row;
  },
  findActiveOverlapping: (berthId: number, start: string, end: string, statuses: readonly string[] = BERTH_OCCUPYING_STATUSES): BerthPlan[] =>
    seed.berthPlan.filter((row) => row.berth_id === berthId && statuses.includes(row.status) && timeRangesOverlap(row.planned_arrival, row.planned_departure, start, end))
};
