import type { Request, Response } from "express";
import { berthBlockadeService } from "../services/BerthBlockadeService";

export const berthBlockadeController = {
  list: (_req: Request, res: Response) => res.json(berthBlockadeService.list()),
  summary: (_req: Request, res: Response) => res.json(berthBlockadeService.summary()),
  listAdjustments: (_req: Request, res: Response) => res.json(berthBlockadeService.listAdjustments()),
  create: (req: Request, res: Response) => res.status(201).json(berthBlockadeService.create(req.body)),
  lift: (req: Request, res: Response) => res.json(berthBlockadeService.lift(Number(req.params.id)))
};
