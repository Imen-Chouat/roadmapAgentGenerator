import Roadmap from "../models/RoadMap.js";

const generateRoadmap = (body) => {
  // placeholder — replace with real AI service call
  return null;
};

const createRoadmap = async (req, res) => {
  try {
    const aiData = generateRoadmap(req.body) || {
      title: "Learn Web Development",
      description: "A roadmap to become a web developer",
      field: "Web Development",
      level: "Beginner",
      duration: "5 weeks",
      chapters: [
        {
          title: "HTML & CSS",
          description: "Learn the basics of web structure and styling",
          duration: "2 weeks",
          resources: [
            "https://www.w3schools.com/html/",
            "https://www.w3schools.com/css/"
          ],
          status: "not-started"
        },
        {
          title: "JavaScript",
          description: "Learn the programming language of the web",
          duration: "3 weeks",
          resources: [
            "https://www.w3schools.com/js/",
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
          ],
          status: "not-started"
        }
      ],
      status: "not-started",
      progress: 0
    };

    const roadmap = await Roadmap.create({
      user: req.user_id,
      ...aiData
    });

    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user_id });
    return res.json(roadmaps);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { id, chapterId } = req.params;

    const roadmap = await Roadmap.findById(id);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const chapter = roadmap.chapters.id(chapterId);
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    chapter.status = "completed";

    const completed = roadmap.chapters.filter(
      (c) => c.status === "completed"
    ).length;

    roadmap.progress = (completed / roadmap.chapters.length) * 100;

    if (roadmap.progress === 100) {
      roadmap.status = "completed";
    } else if (completed > 0) {
      roadmap.status = "in-progress";
    }

    await roadmap.save();
    res.json(roadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndDelete(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    res.json({ message: "Deleted ✅" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoadmapInfo = async (req, res) => {
  try {
    const roadmap = await Roadmap.findById(req.params.id);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  createRoadmap,
  getRoadmaps,
  updateChapter,
  deleteRoadmap,
  getRoadmapInfo,
  updateRoadmap
};
