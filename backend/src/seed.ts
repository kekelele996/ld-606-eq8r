import type { Vessel } from "./models/Vessel";
import type { Berth } from "./models/Berth";
import type { BerthPlan } from "./models/BerthPlan";
import type { YardSlot } from "./models/YardSlot";
import type { WorkTask } from "./models/WorkTask";
import type { BerthBlockade } from "./models/BerthBlockade";
import type { BerthReassignment } from "./models/BerthReassignment";

export interface SeedSchema {
  vessel: Vessel[];
  berth: Berth[];
  berthPlan: BerthPlan[];
  yardSlot: YardSlot[];
  workTask: WorkTask[];
  berthBlockade: BerthBlockade[];
  berthReassignment: BerthReassignment[];
}

export const seed: SeedSchema = {
  "vessel": [
    {
      "id": 1,
      "vessel_name": "远洋之星",
      "imo_no": "IMO9800001",
      "carrier": "中远海运",
      "length_m": "185.0",
      "draft_m": "9.6",
      "eta": "2026-09-27T08:00:00+08:00",
      "etd": "2026-09-28T17:00:00+08:00",
      "status": "SCHEDULED"
    },
    {
      "id": 2,
      "vessel_name": "海丰66",
      "imo_no": "IMO9800002",
      "carrier": "海丰国际",
      "length_m": "205.0",
      "draft_m": "13.8",
      "eta": "2026-09-28T18:00:00+08:00",
      "etd": "2026-09-30T08:00:00+08:00",
      "status": "SCHEDULED"
    },
    {
      "id": 3,
      "vessel_name": "长江明珠",
      "imo_no": "IMO9800003",
      "carrier": "长航集团",
      "length_m": "150.0",
      "draft_m": "8.2",
      "eta": "2026-09-27T09:00:00+08:00",
      "etd": "2026-09-29T08:00:00+08:00",
      "status": "SCHEDULED"
    },
    {
      "id": 4,
      "vessel_name": "北方先锋",
      "imo_no": "IMO9800004",
      "carrier": "北方航运",
      "length_m": "120.0",
      "draft_m": "6.5",
      "eta": "2026-09-20T08:00:00+08:00",
      "etd": "2026-09-22T10:00:00+08:00",
      "status": "DEPARTED"
    },
    {
      "id": 5,
      "vessel_name": "港湾快线",
      "imo_no": "IMO9800005",
      "carrier": "港湾船务",
      "length_m": "140.0",
      "draft_m": "7.5",
      "eta": "2026-09-26T06:00:00+08:00",
      "etd": "2026-09-27T22:00:00+08:00",
      "status": "AT_BERTH"
    },
    {
      "id": 6,
      "vessel_name": "环球货柜",
      "imo_no": "IMO9800006",
      "carrier": "环球集运",
      "length_m": "280.0",
      "draft_m": "14.0",
      "eta": "2026-09-29T06:00:00+08:00",
      "etd": "2026-09-30T18:00:00+08:00",
      "status": "SCHEDULED"
    }
  ],
  "berth": [
    {
      "id": 1,
      "berth_code": "B1",
      "length_m": "250.0",
      "water_depth_m": "13.5",
      "berth_type": "CONTAINER",
      "current_status": "FREE",
      "safety_note": "深水集装箱泊位"
    },
    {
      "id": 2,
      "berth_code": "B2",
      "length_m": "200.0",
      "water_depth_m": "11.0",
      "berth_type": "CONTAINER",
      "current_status": "FREE",
      "safety_note": "注意潮汐窗口"
    },
    {
      "id": 3,
      "berth_code": "B3",
      "length_m": "160.0",
      "water_depth_m": "9.0",
      "berth_type": "BULK",
      "current_status": "FREE",
      "safety_note": "散货泊位"
    },
    {
      "id": 4,
      "berth_code": "B4",
      "length_m": "300.0",
      "water_depth_m": "15.0",
      "berth_type": "GENERAL",
      "current_status": "FREE",
      "safety_note": "通用深水泊位"
    }
  ],
  "berthPlan": [
    {
      "id": 1,
      "vessel_id": 1,
      "berth_id": 1,
      "planned_arrival": "2026-09-27T08:00:00+08:00",
      "planned_departure": "2026-09-28T17:00:00+08:00",
      "priority": "HIGH",
      "status": "APPROVED",
      "dispatcher_id": 1
    },
    {
      "id": 2,
      "vessel_id": 2,
      "berth_id": 1,
      "planned_arrival": "2026-09-28T18:00:00+08:00",
      "planned_departure": "2026-09-30T08:00:00+08:00",
      "priority": "NORMAL",
      "status": "APPROVED",
      "dispatcher_id": 1
    },
    {
      "id": 3,
      "vessel_id": 3,
      "berth_id": 2,
      "planned_arrival": "2026-09-27T09:00:00+08:00",
      "planned_departure": "2026-09-29T08:00:00+08:00",
      "priority": "NORMAL",
      "status": "APPROVED",
      "dispatcher_id": 2
    },
    {
      "id": 4,
      "vessel_id": 4,
      "berth_id": 1,
      "planned_arrival": "2026-09-20T08:00:00+08:00",
      "planned_departure": "2026-09-22T10:00:00+08:00",
      "priority": "LOW",
      "status": "DEPARTED",
      "dispatcher_id": 1
    },
    {
      "id": 5,
      "vessel_id": 5,
      "berth_id": 3,
      "planned_arrival": "2026-09-26T06:00:00+08:00",
      "planned_departure": "2026-09-27T22:00:00+08:00",
      "priority": "NORMAL",
      "status": "BERTHING",
      "dispatcher_id": 2
    },
    {
      "id": 6,
      "vessel_id": 6,
      "berth_id": 4,
      "planned_arrival": "2026-09-29T06:00:00+08:00",
      "planned_departure": "2026-09-30T18:00:00+08:00",
      "priority": "HIGH",
      "status": "APPROVED",
      "dispatcher_id": 1
    }
  ],
  "yardSlot": [
    {
      "id": 1,
      "yard_area": "A",
      "row_no": "01",
      "bay_no": "03",
      "tier_no": "2",
      "container_no": "CSQU3054383",
      "slot_status": "OCCUPIED",
      "cargo_type": "CONTAINER"
    },
    {
      "id": 2,
      "yard_area": "A",
      "row_no": "01",
      "bay_no": "03",
      "tier_no": "3",
      "container_no": "",
      "slot_status": "EMPTY",
      "cargo_type": "CONTAINER"
    },
    {
      "id": 3,
      "yard_area": "B",
      "row_no": "02",
      "bay_no": "01",
      "tier_no": "1",
      "container_no": "TGHU1234567",
      "slot_status": "RESERVED",
      "cargo_type": "REEFER"
    }
  ],
  "workTask": [
    {
      "id": 1,
      "berth_plan_id": 5,
      "yard_slot_id": 1,
      "task_type": "DISCHARGE",
      "team_id": 1,
      "status": "IN_PROGRESS",
      "planned_start": "2026-09-26T08:00:00+08:00",
      "finished_at": ""
    },
    {
      "id": 2,
      "berth_plan_id": 1,
      "yard_slot_id": 3,
      "task_type": "LOAD",
      "team_id": 2,
      "status": "PENDING",
      "planned_start": "2026-09-27T10:00:00+08:00",
      "finished_at": ""
    },
    {
      "id": 3,
      "berth_plan_id": 4,
      "yard_slot_id": 2,
      "task_type": "INSPECTION",
      "team_id": 3,
      "status": "DONE",
      "planned_start": "2026-09-21T09:00:00+08:00",
      "finished_at": "2026-09-21T17:00:00+08:00"
    }
  ],
  "berthBlockade": [],
  "berthReassignment": []
};
