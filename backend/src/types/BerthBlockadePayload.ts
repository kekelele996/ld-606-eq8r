export interface BerthBlockadePayload {
  berth_id: number;
  block_start: string;
  block_end: string;
  reason: string;
  dispatcher_id?: number;
}
