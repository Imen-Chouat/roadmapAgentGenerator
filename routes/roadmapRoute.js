import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roadmapController from '../controllers/roadmapController.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Roadmap route is working');
});

router.post("/create", authMiddleware, roadmapController.createRoadmap);
router.get("/getAll", authMiddleware, roadmapController.getRoadmaps);
router.get("/get/:id", authMiddleware, roadmapController.getRoadmapInfo);   // removed duplicate authMiddleware
router.put("/updateChapter/:id/:chapterId", authMiddleware, roadmapController.updateChapter);
router.delete("/delete/:id", authMiddleware, roadmapController.deleteRoadmap);
router.put("/update/:id", authMiddleware, roadmapController.updateRoadmap);

export default router;
