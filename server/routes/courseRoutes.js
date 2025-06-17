import express from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  getEducatorCourses,
  getEducatorDashboard,
  enrollInCourse,
  getUserEnrolledCourses,
  rateCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

// Protected routes (auth required)
router.post("/", createCourse);
router.get("/educator/courses", getEducatorCourses);
router.get("/educator/dashboard", getEducatorDashboard);
router.post("/:courseId/enroll", enrollInCourse);
router.get("/user/enrolled", getUserEnrolledCourses);
router.post("/:courseId/rate", rateCourse);

export default router;
