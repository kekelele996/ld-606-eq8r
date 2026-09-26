import { mockData } from "../mocks/seedData";
import { LOG_TEMPLATES } from "../constants/logTemplates";
import type { BerthBlockade } from "../types/BerthBlockade";
import type { BerthPlanAdjustment } from "../types/BerthPlanAdjustment";
import type { BlockadeSummary } from "../types/BlockadeSummary";
import type { BerthBlockadeForm } from "../constructors/BerthBlockadeConstructor";

const endpoint = "/api/berth-blockade";

export interface BlockadeResult {
  blockade: BerthBlockade;
  adjustments: BerthPlanAdjustment[];
}

export interface LiftResult {
  blockade: BerthBlockade;
  restored: BerthPlanAdjustment[];
}

export async function listBerthBlockade(): Promise<BerthBlockade[]> {
  try {
    const res = await fetch(endpoint);
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return [...(mockData.berthBlockade as unknown as BerthBlockade[])];
}

export async function fetchBlockadeSummary(): Promise<BlockadeSummary> {
  try {
    const res = await fetch(`${endpoint}/summary`);
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return {
    active_blockades: (mockData.berthBlockade as unknown as BerthBlockade[]).filter((row) => row.status === "ACTIVE").length,
    pending_adjust: (mockData.berthPlan as unknown as { status: string }[]).filter((row) => row.status === "PENDING_ADJUST").length,
    adjustments_total: mockData.berthPlanAdjustment.length
  };
}

export async function listBerthPlanAdjustment(): Promise<BerthPlanAdjustment[]> {
  try {
    const res = await fetch(`${endpoint}/adjustments`);
    if (res.ok) return await res.json();
  } catch {
    // Local mock fallback keeps the UI available during offline review.
  }
  return [...(mockData.berthPlanAdjustment as unknown as BerthPlanAdjustment[])];
}

export async function createBerthBlockade(payload: BerthBlockadeForm): Promise<BlockadeResult | null> {
  console.info(LOG_TEMPLATES.BerthBlockade[0], payload);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) return await res.json();
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  } catch (err) {
    console.error("createBerthBlockade failed", err);
    throw err;
  }
}

export async function liftBerthBlockade(id: number): Promise<LiftResult | null> {
  console.info(LOG_TEMPLATES.BerthBlockade[1], id);
  try {
    const res = await fetch(`${endpoint}/${id}/lift`, { method: "POST" });
    if (res.ok) return await res.json();
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  } catch (err) {
    console.error("liftBerthBlockade failed", err);
    throw err;
  }
}
