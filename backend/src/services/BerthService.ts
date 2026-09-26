import { berthRepository } from "../repositories/BerthRepository";
import { berthPlanRepository } from "../repositories/BerthPlanRepository";
import { berthBlockadeRepository } from "../repositories/BerthBlockadeRepository";
import type { Berth } from "../models/Berth";
import type { BerthPlan } from "../models/BerthPlan";
import type { Vessel } from "../models/Vessel";

export const berthService = {
  list: () => berthRepository.findAll(),
  create: (row: Omit<Berth, "id"> & { id?: number }) => berthRepository.save(row),
  // 为受封锁影响的计划寻找改派泊位：长度和吃水都要满足，且在计划时间窗内空闲、未被其他封锁覆盖
  findReassignmentCandidate: (plan: BerthPlan, vessel: Vessel | undefined, excludeBerthId: number): Berth | undefined => {
    if (!vessel) return undefined;
    return berthRepository.findAll().find((berth) =>
      berth.id !== excludeBerthId &&
      Number(berth.length_m) >= Number(vessel.length_m) &&
      Number(berth.water_depth_m) >= Number(vessel.draft_m) &&
      berthBlockadeRepository.findActiveOverlapping(berth.id, plan.planned_arrival, plan.planned_departure).length === 0 &&
      berthPlanRepository.findActiveOverlapping(berth.id, plan.planned_arrival, plan.planned_departure).length === 0);
  }
};
