import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json({
    wasteDiverted: 23.4,
    plasticRecycled: 8.7,
    co2Reduced: 15.2,
    treesEquivalent: 3,
    waterSaved: 4200,
    energySaved: 87,
  });
});

export default router;
