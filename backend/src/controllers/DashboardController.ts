import type { Request, Response } from "express";
import { dashboardService } from "../services/DashboardService";

export const dashboardController = {
  summary: (_req: Request, res: Response) => res.json(dashboardService.summary())
};
