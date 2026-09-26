import { mockData } from "../mocks/seedData";
import { createBerthBlockadeResponse, type BerthBlockadeForm } from "../constructors/BerthBlockadeConstructor";
import type { BerthBlockade, BerthBlockadeLiftResult, BerthBlockadeResult } from "../types/BerthBlockade";

const endpoint = "/api/berth-blockade";

export async function listBerthBlockade(): Promise<BerthBlockade[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.berthBlockade as unknown as BerthBlockade[])];
}

export async function createBerthBlockade(payload: BerthBlockadeForm): Promise<BerthBlockadeResult> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  const blockade = createBerthBlockadeResponse({ ...payload, id: Date.now(), status: "ACTIVE", created_at: new Date().toISOString(), lifted_at: null });
  return { blockade, affected: [] };
}

export async function liftBerthBlockade(id: number): Promise<BerthBlockadeLiftResult> {
  try {
    const res = await fetch(`${endpoint}/${id}/lift`, { method: "POST" });
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  const blockade = createBerthBlockadeResponse({ id, status: "LIFTED", lifted_at: new Date().toISOString() });
  return { blockade, restored: [] };
}
