import type { NextFunction, Request, Response } from "express";
import { berthBlockadeService } from "../services/BerthBlockadeService";
import { ERROR_CODES } from "../constants/errorCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const wrap = (err: unknown): Error & { status?: number; code?: string } => {
  if (err instanceof Error) return err;
  const error = new Error(ERROR_MESSAGES.VALIDATION_FAILED) as Error & { status: number; code: string };
  error.status = 400;
  error.code = ERROR_CODES.VALIDATION_FAILED;
  return error;
};

export const berthBlockadeController = {
  list: (_req: Request, res: Response) => res.json(berthBlockadeService.list()),
  create: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(berthBlockadeService.create(req.body));
    } catch (err) {
      next(wrap(err));
    }
  },
  lift: (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(berthBlockadeService.lift(Number(req.params.id)));
    } catch (err) {
      next(wrap(err));
    }
  }
};
