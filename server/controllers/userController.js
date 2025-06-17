import User from "../models/User.js";

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, imageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get educator's enrolled students data
export const getEducatorEnrolledStudents = async (req, res) => {
  try {
    const educator = req.user.id;

    // This would need to be implemented based on how you want to track enrollments
    // For now, returning empty array as this data structure is complex
    const enrolledStudents = [];

    res.status(200).json(enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
