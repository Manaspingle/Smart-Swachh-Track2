import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import wasteRouter from "./waste";
import rewardsRouter from "./rewards";
import reportsRouter from "./reports";
import analyticsRouter from "./analytics";
import scheduleRouter from "./schedule";
import centersRouter from "./centers";
import challengesRouter from "./challenges";
import impactRouter from "./impact";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/waste", wasteRouter);
router.use("/rewards", rewardsRouter);
router.use("/reports", reportsRouter);
router.use("/analytics", analyticsRouter);
router.use("/schedule", scheduleRouter);
router.use("/centers", centersRouter);
router.use("/challenges", challengesRouter);
router.use("/impact", impactRouter);

export default router;
