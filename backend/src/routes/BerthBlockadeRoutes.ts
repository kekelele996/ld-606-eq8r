import { Router } from "express";
import { berthBlockadeController } from "../controllers/BerthBlockadeController";
import { rbacMiddleware } from "../middlewares/rbacMiddleware";

const router = Router();
router.get("/", berthBlockadeController.list);
router.post("/", rbacMiddleware(["dispatcher", "admin"]), berthBlockadeController.create);
router.post("/:id/lift", rbacMiddleware(["dispatcher", "admin"]), berthBlockadeController.lift);
export default router;
