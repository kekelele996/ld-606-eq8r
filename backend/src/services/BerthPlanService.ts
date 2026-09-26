import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import type { BerthPlan } from "../models/BerthPlan";

export const berthPlanService = {
  list: () => berthPlanRepository.findAll(),
  create: (row: Omit<BerthPlan, "id"> & { id?: number }) => berthPlanRepository.save(row)
};
