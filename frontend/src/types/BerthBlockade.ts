import type { BerthReassignment } from "./BerthReassignment";

export interface BerthBlockade {
  id: number;
  berth_id: number;
  block_start: string;
  block_end: string;
  reason: string;
  status: string;
  dispatcher_id: number;
  created_at: string;
  lifted_at: string | null;
}

export interface BerthBlockadeResult {
  blockade: BerthBlockade;
  affected: BerthReassignment[];
}

export interface BerthBlockadeLiftResult {
  blockade: BerthBlockade;
  restored: BerthReassignment[];
}
