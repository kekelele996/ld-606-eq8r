import { Router } from "express";
import { berthReassignmentController } from "../controllers/BerthReassignmentController";

const router = Router();
router.get("/", berthReassignmentController.list);
export default router;
