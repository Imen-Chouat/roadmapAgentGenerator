import express from "express";
import statisticController from "../controllers/statisticController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/userStats", authMiddleware, statisticController.getUserStatistics);
router.get("/roadmapStats/:id", statisticController.getRoadmapStatistics);   // was missing :id param
router.get("/allRoadmapStats", statisticController.getAllRoadmapStatistics);
router.get("/generalStats", statisticController.getStatistics);  // was missing leading slash

export default router;
