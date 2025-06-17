import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getEducatorEnrolledStudents,
} from "../controllers/userController.js";

const router = express.Router();

// Protected routes (auth required)
router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);
router.get("/educator/enrolled-students", getEducatorEnrolledStudents);

export default router;
