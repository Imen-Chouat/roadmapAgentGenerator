import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: String,
  resources: [String],
  status: {
    type: String,
    default: "not-started"
  }
});

const roadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  description: String,
  title: String,
  field: String,
  level: String,
  duration: String,

  progress: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    default: "not-started"
  },

  chapters: [chapterSchema]
});

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;