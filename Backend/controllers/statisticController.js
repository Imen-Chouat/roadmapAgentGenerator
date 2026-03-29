import User from "../models/User.js";
import RoadMap from "../models/RoadMap.js";

const getStatistics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRoadmaps = await RoadMap.countDocuments();
        const averageRoadmapsPerUser = totalUsers > 0 ? (totalRoadmaps / totalUsers).toFixed(2) : 0;       
        const roadmapStatusCounts = await RoadMap.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);
        const statusDistribution = {};  
        roadmapStatusCounts.forEach(item => {
            statusDistribution[item._id] = item.count;
        }
        );
        res.status(200).json({
            totalUsers,
            totalRoadmaps,
            averageRoadmapsPerUser,
            statusDistribution
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
};

const getUserStatistics = async (req, res) => {
    try {
        const userId = req.user_id; 
        const userRoadmaps = await RoadMap.find({ user: userId });
        const totalRoadmaps = userRoadmaps.length;
        const completedRoadmaps = userRoadmaps.filter(r => r.status === "completed").length;    
        const inProgressRoadmaps = userRoadmaps.filter(r => r.status === "in-progress").length;
        const notStartedRoadmaps = userRoadmaps.filter(r => r.status === "not-started").length;
        res.status(200).json({ totalRoadmaps, completedRoadmaps, inProgressRoadmaps, notStartedRoadmaps });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }  
}; 

const getRoadmapStatistics = async (req, res) => {
    try {
        const roadmapId = req.params.id;
        const roadmap = await RoadMap.findById(roadmapId);
        if (!roadmap) {
            return res.status(404).json({ message: "Roadmap not found" });
        }
        const totalChapters = roadmap.chapters.length;
        const completedChapters = roadmap.chapters.filter(c => c.status === "completed").length;
        const inProgressChapters = roadmap.chapters.filter(c => c.status === "in-progress").length;
        const notStartedChapters = roadmap.chapters.filter(c => c.status === "not-started").length;
        res.status(200).json({ totalChapters, completedChapters, inProgressChapters, notStartedChapters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllRoadmapStatistics = async (req, res) => {
    try {
        const roadmaps = await RoadMap.find();  
        const roadmapStats = roadmaps.map(roadmap => {
            const totalChapters = roadmap.chapters.length;
            const completedChapters = roadmap.chapters.filter(c => c.status === "completed").length;    
            const inProgressChapters = roadmap.chapters.filter(c => c.status === "in-progress").length;
            const notStartedChapters = roadmap.chapters.filter(c => c.status === "not-started").length;
            return {
                roadmapId: roadmap._id,
                title: roadmap.title,
                totalChapters,
                completedChapters,
                inProgressChapters,
                notStartedChapters
            };
        });
        res.status(200).json(roadmapStats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export default {
    getStatistics ,
    getUserStatistics,
    getRoadmapStatistics,
    getAllRoadmapStatistics
}