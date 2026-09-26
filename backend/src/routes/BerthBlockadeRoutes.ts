import { Router } from "express";
import { berthBlockadeController } from "../controllers/BerthBlockadeController";

const router = Router();
router.get("/", berthBlockadeController.list);
router.get("/summary", berthBlockadeController.summary);
router.get("/adjustments", berthBlockadeController.listAdjustments);
router.post("/", berthBlockadeController.create);
router.post("/:id/lift", berthBlockadeController.lift);
export default router;
