import { seed } from "../seed";
import type { Vessel } from "../models/Vessel";

export const vesselRepository = {
  findAll: (): Vessel[] => seed.vessel,
  findById: (id: number): Vessel | undefined => seed.vessel.find((row) => row.id === id),
  save: (row: unknown) => row
};
