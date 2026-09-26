import { listBerthReassignment } from "../api/BerthReassignment";
import type { BerthReassignment } from "../types/BerthReassignment";

export class BerthReassignmentStore {
  rows: BerthReassignment[] = [];

  async load(): Promise<BerthReassignment[]> {
    this.rows = await listBerthReassignment();
    return this.rows;
  }

  forBlockade(blockadeId: number): BerthReassignment[] {
    return this.rows.filter((row) => row.blockade_id === blockadeId);
  }

  get pendingCount(): number {
    return this.rows.filter((row) => row.action === "PENDING_ADJUSTMENT" && !row.restored_at).length;
  }
}
