export const mockData = {
  "vessel": [
    {
      "id": 1,
      "vessel_name": "海云轮",
      "imo_no": "IMO9081234",
      "carrier": "远洋航运",
      "length_m": 220,
      "draft_m": 12.5,
      "eta": "2026-09-27T08:00:00+08:00",
      "etd": "2026-09-29T18:00:00+08:00",
      "status": "APPROVED"
    },
    {
      "id": 2,
      "vessel_name": "江河轮",
      "imo_no": "IMO9082345",
      "carrier": "江海联运",
      "length_m": 180,
      "draft_m": 10.5,
      "eta": "2026-09-26T06:00:00+08:00",
      "etd": "2026-09-28T12:00:00+08:00",
      "status": "BERTHING"
    },
    {
      "id": 3,
      "vessel_name": "小渤轮",
      "imo_no": "IMO9083456",
      "carrier": "渤海快航",
      "length_m": 120,
      "draft_m": 8,
      "eta": "2026-09-28T09:00:00+08:00",
      "etd": "2026-09-30T10:00:00+08:00",
      "status": "APPROVED"
    },
    {
      "id": 4,
      "vessel_name": "丰顺轮",
      "imo_no": "IMO9084567",
      "carrier": "顺达船务",
      "length_m": 150,
      "draft_m": 9,
      "eta": "2026-09-30T08:00:00+08:00",
      "etd": "2026-10-02T09:00:00+08:00",
      "status": "APPROVED"
    },
    {
      "id": 5,
      "vessel_name": "远航轮",
      "imo_no": "IMO9085678",
      "carrier": "远洋航运",
      "length_m": 240,
      "draft_m": 13.5,
      "eta": "2026-09-29T07:00:00+08:00",
      "etd": "2026-10-01T16:00:00+08:00",
      "status": "DRAFT"
    }
  ],
  "berth": [
    {
      "id": 1,
      "berth_code": "B01",
      "length_m": 260,
      "water_depth_m": 14.5,
      "berth_type": "集装箱",
      "current_status": "FREE",
      "safety_note": "深水泊位，可接大型集装箱船"
    },
    {
      "id": 2,
      "berth_code": "B02",
      "length_m": 200,
      "water_depth_m": 12,
      "berth_type": "散货",
      "current_status": "OCCUPIED",
      "safety_note": "注意潮汐窗口"
    },
    {
      "id": 3,
      "berth_code": "B03",
      "length_m": 150,
      "water_depth_m": 10,
      "berth_type": "件杂货",
      "current_status": "FREE",
      "safety_note": "小型船舶专用"
    },
    {
      "id": 4,
      "berth_code": "B04",
      "length_m": 180,
      "water_depth_m": 11,
      "berth_type": "集装箱",
      "current_status": "FREE",
      "safety_note": "备用集装箱泊位"
    }
  ],
  "berthPlan": [
    {
      "id": 1,
      "vessel_id": 1,
      "berth_id": 1,
      "planned_arrival": "2026-09-27T08:00:00+08:00",
      "planned_departure": "2026-09-29T18:00:00+08:00",
      "priority": "HIGH",
      "status": "APPROVED",
      "dispatcher_id": 1
    },
    {
      "id": 2,
      "vessel_id": 2,
      "berth_id": 2,
      "planned_arrival": "2026-09-26T06:00:00+08:00",
      "planned_departure": "2026-09-28T12:00:00+08:00",
      "priority": "MEDIUM",
      "status": "BERTHING",
      "dispatcher_id": 1
    },
    {
      "id": 3,
      "vessel_id": 3,
      "berth_id": 3,
      "planned_arrival": "2026-09-28T09:00:00+08:00",
      "planned_departure": "2026-09-30T10:00:00+08:00",
      "priority": "LOW",
      "status": "APPROVED",
      "dispatcher_id": 2
    },
    {
      "id": 4,
      "vessel_id": 4,
      "berth_id": 1,
      "planned_arrival": "2026-09-30T08:00:00+08:00",
      "planned_departure": "2026-10-02T09:00:00+08:00",
      "priority": "MEDIUM",
      "status": "APPROVED",
      "dispatcher_id": 2
    },
    {
      "id": 5,
      "vessel_id": 5,
      "berth_id": 2,
      "planned_arrival": "2026-09-29T07:00:00+08:00",
      "planned_departure": "2026-10-01T16:00:00+08:00",
      "priority": "HIGH",
      "status": "DRAFT",
      "dispatcher_id": 1
    },
    {
      "id": 6,
      "vessel_id": 2,
      "berth_id": 1,
      "planned_arrival": "2026-09-20T08:00:00+08:00",
      "planned_departure": "2026-09-22T09:00:00+08:00",
      "priority": "LOW",
      "status": "DEPARTED",
      "dispatcher_id": 1
    }
  ],
  "berthBlockade": [] as unknown[],
  "berthPlanAdjustment": [] as unknown[],
  "yardSlot": [
    {
      "id": 1,
      "yard_area": "yard area 1",
      "row_no": "row no 1",
      "bay_no": "bay no 1",
      "tier_no": "tier no 1",
      "container_no": "container no 1",
      "slot_status": "CONFLICT",
      "cargo_type": "CONFLICT"
    },
    {
      "id": 2,
      "yard_area": "yard area 2",
      "row_no": "row no 2",
      "bay_no": "bay no 2",
      "tier_no": "tier no 2",
      "container_no": "container no 2",
      "slot_status": "APPROVED",
      "cargo_type": "APPROVED"
    },
    {
      "id": 3,
      "yard_area": "yard area 3",
      "row_no": "row no 3",
      "bay_no": "bay no 3",
      "tier_no": "tier no 3",
      "container_no": "container no 3",
      "slot_status": "DRAFT",
      "cargo_type": "BERTHING"
    }
  ],
  "workTask": [
    {
      "id": 1,
      "berth_plan_id": 1,
      "yard_slot_id": 1,
      "task_type": "CONFLICT",
      "team_id": 1,
      "status": "CONFLICT",
      "planned_start": "planned start 1",
      "finished_at": "2026-06-11T09:00:00Z"
    },
    {
      "id": 2,
      "berth_plan_id": 2,
      "yard_slot_id": 2,
      "task_type": "APPROVED",
      "team_id": 2,
      "status": "APPROVED",
      "planned_start": "planned start 2",
      "finished_at": "2026-06-12T09:00:00Z"
    },
    {
      "id": 3,
      "berth_plan_id": 3,
      "yard_slot_id": 3,
      "task_type": "BERTHING",
      "team_id": 3,
      "status": "DRAFT",
      "planned_start": "planned start 3",
      "finished_at": "2026-06-13T09:00:00Z"
    }
  ]
} as const;
