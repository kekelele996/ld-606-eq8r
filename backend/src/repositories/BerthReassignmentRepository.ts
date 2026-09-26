import { seed } from "../seed";
import { nextId } from "../utils/nextId";
import type { BerthReassignment } from "../models/BerthReassignment";

export const berthReassignmentRepository = {
  findAll: (): BerthReassignment[] => seed.berthReassignment,
  findById: (id: number): BerthReassignment | undefined => seed.berthReassignment.find((row) => row.id === id),
  findByBlockadeId: (blockadeId: number): BerthReassignment[] => seed.berthReassignment.filter((row) => row.blockade_id === blockadeId),
  save: (row: Omit<BerthReassignment, "id"> & { id?: number }): BerthReassignment => {
    const next = { ...row, id: row.id ? row.id : nextId(seed.berthReassignment) } as BerthReassignment;
    seed.berthReassignment.push(next);
    return next;
  },
  update: (id: number, patch: Partial<BerthReassignment>): BerthReassignment | undefined => {
    const row = seed.berthReassignment.find((item) => item.id === id);
    if (row) Object.assign(row, patch);
    return row;
  }
};
