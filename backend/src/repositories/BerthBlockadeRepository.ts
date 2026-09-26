import { seed } from "../seed";
import type { BerthBlockade } from "../models/BerthBlockade";

const rows: BerthBlockade[] = seed.berthBlockade.map((row) => ({ ...(row as BerthBlockade) }));
let nextId = rows.length + 1;

export const berthBlockadeRepository = {
  findAll: (): BerthBlockade[] => rows,
  findById: (id: number): BerthBlockade | undefined => rows.find((row) => row.id === id),
  save: (row: Omit<BerthBlockade, "id">): BerthBlockade => {
    const full: BerthBlockade = { ...row, id: nextId++ };
    rows.push(full);
    return full;
  },
  update: (id: number, patch: Partial<BerthBlockade>): BerthBlockade | undefined => {
    const row = rows.find((item) => item.id === id);
    if (!row) return undefined;
    Object.assign(row, patch);
    return row;
  }
};
