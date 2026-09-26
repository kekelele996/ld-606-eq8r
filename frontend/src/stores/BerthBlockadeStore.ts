import { listBerthBlockade } from "../api/BerthBlockade";
import type { BerthBlockade } from "../types/BerthBlockade";

export class BerthBlockadeStore {
  rows: BerthBlockade[] = [];

  async load(): Promise<BerthBlockade[]> {
    this.rows = await listBerthBlockade();
    return this.rows;
  }

  get activeCount(): number {
    return this.rows.filter((row) => row.status === "ACTIVE").length;
  }
}
