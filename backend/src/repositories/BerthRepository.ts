import { seed } from "../seed";
import { nextId } from "../utils/nextId";
import type { Berth } from "../models/Berth";

export const berthRepository = {
  findAll: (): Berth[] => seed.berth,
  findById: (id: number): Berth | undefined => seed.berth.find((row) => row.id === id),
  save: (row: Omit<Berth, "id"> & { id?: number }): Berth => {
    const next = { ...row, id: row.id ? row.id : nextId(seed.berth) } as Berth;
    seed.berth.push(next);
    return next;
  }
};
