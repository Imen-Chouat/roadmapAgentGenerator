import User from "../models/User.js";
import Roadmap from "../models/RoadMap.js";
import bcrypt from "bcryptjs";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllUsersWithRoadmaps = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const userIds = users.map((u) => u._id);
    const roadmaps = await Roadmap.find({ user: { $in: userIds } });

    const usersWithRoadmaps = users.map((user) => ({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      roadmaps: roadmaps.filter(
        (r) => r.user.toString() === user._id.toString()
      )
    }));

    return res.status(200).json(usersWithRoadmaps);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    // Support both req.body.id and req.params.id
    const id = req.body.id || req.params.id || req.user_id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user_id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const getUserRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ user: req.user_id });
    return res.status(200).json(roadmaps);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email, firstname, lastname, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user_id,
      { firstname, lastname, bio, email },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export default {
  getAllUsers,
  deleteUser,
  getUserInfo,
  getAllUsersWithRoadmaps,
  getUserRoadmaps,
  updateUser,
  changePassword
};
