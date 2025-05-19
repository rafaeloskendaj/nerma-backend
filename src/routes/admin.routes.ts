import { Router } from "express";
import { updatePlan } from "../controllers/admin.controller";

const router = Router();

router.put("/update-plans", updatePlan);

export default router;
