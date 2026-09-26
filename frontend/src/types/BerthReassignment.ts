export interface BerthReassignment {
  id: number;
  blockade_id: number;
  berth_plan_id: number;
  vessel_id: number;
  vessel_name: string;
  from_berth_id: number;
  to_berth_id: number | null;
  prev_status: string;
  action: string;
  created_at: string;
  restored_at: string | null;
}
