import { berthReassignmentRepository } from "../repositories/BerthReassignmentRepository";
import type { BerthReassignment } from "../models/BerthReassignment";

export const berthReassignmentService = {
  list: (): BerthReassignment[] => berthReassignmentRepository.findAll(),
  listByBlockade: (blockadeId: number): BerthReassignment[] => berthReassignmentRepository.findByBlockadeId(Number(blockadeId))
};
