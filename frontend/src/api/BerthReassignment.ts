import { mockData } from "../mocks/seedData";
import type { BerthReassignment } from "../types/BerthReassignment";

const endpoint = "/api/berth-reassignment";

export async function listBerthReassignment(blockadeId?: number): Promise<BerthReassignment[]> {
  const url = blockadeId === undefined ? endpoint : `${endpoint}?blockade_id=${blockadeId}`;
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.berthReassignment as unknown as BerthReassignment[])];
}
