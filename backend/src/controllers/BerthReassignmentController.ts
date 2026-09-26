import type { Request, Response } from "express";
import { berthReassignmentService } from "../services/BerthReassignmentService";

export const berthReassignmentController = {
  list: (req: Request, res: Response) => {
    const blockadeId = req.query.blockade_id;
    if (blockadeId !== undefined) return res.json(berthReassignmentService.listByBlockade(Number(blockadeId)));
    return res.json(berthReassignmentService.list());
  }
};
