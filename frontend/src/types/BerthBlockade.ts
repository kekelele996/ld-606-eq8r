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
