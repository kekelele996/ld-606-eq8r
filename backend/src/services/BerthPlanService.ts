import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import type { BerthPlan } from "../models/BerthPlan";

export const berthPlanService = { list: () => berthPlanRepository.findAll(), create: (row: unknown) => berthPlanRepository.save(row as BerthPlan) };
