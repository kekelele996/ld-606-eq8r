import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthRepository } from "../repositories/BerthRepository";
import { vesselRepository } from "../repositories/VesselRepository";
import { berthBlockadeRepository } from "../repositories/BerthBlockadeRepository";
import { berthReassignmentRepository } from "../repositories/BerthReassignmentRepository";

export const dashboardService = {
  summary: () => {
    const plans = berthPlanRepository.findAll();
    return {
      vessels: vesselRepository.findAll().length,
      berths: berthRepository.findAll().length,
      berthPlans: plans.length,
      pendingAdjustmentPlans: plans.filter((plan) => plan.status === "PENDING_ADJUSTMENT").length,
      activeBlockades: berthBlockadeRepository.findAll().filter((row) => row.status === "ACTIVE").length,
      reassignmentRecords: berthReassignmentRepository.findAll().length
    };
  }
};
