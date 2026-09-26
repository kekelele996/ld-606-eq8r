import { seed } from "../seed";
import { nextId } from "../utils/nextId";
import { timeRangesOverlap } from "../utils/timeOverlap";
import type { BerthBlockade } from "../models/BerthBlockade";

export const berthBlockadeRepository = {
  findAll: (): BerthBlockade[] => seed.berthBlockade,
  findById: (id: number): BerthBlockade | undefined => seed.berthBlockade.find((row) => row.id === id),
  findActiveOverlapping: (berthId: number, start: string, end: string): BerthBlockade[] =>
    seed.berthBlockade.filter((row) => row.berth_id === berthId && row.status === "ACTIVE" && timeRangesOverlap(row.block_start, row.block_end, start, end)),
  save: (row: Omit<BerthBlockade, "id"> & { id?: number }): BerthBlockade => {
    const next = { ...row, id: row.id ? row.id : nextId(seed.berthBlockade) } as BerthBlockade;
    seed.berthBlockade.push(next);
    return next;
  },
  update: (id: number, patch: Partial<BerthBlockade>): BerthBlockade | undefined => {
    const row = seed.berthBlockade.find((item) => item.id === id);
    if (row) Object.assign(row, patch);
    return row;
  }
};
