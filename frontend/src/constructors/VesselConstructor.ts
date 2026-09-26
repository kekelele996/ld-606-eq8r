import type { Vessel } from "../types/Vessel";

export const createDefaultVessel = (overrides: Partial<Vessel> = {}): Vessel => ({
  id: 1,
  vessel_name: "海云轮",
  imo_no: "IMO9081234",
  carrier: "远洋航运",
  length_m: 220,
  draft_m: 12.5,
  eta: "2026-09-27T08:00:00+08:00",
  etd: "2026-09-29T18:00:00+08:00",
  status: "APPROVED",
  ...overrides
});

export const createVesselForm = createDefaultVessel;
export const createVesselResponse = createDefaultVessel;
