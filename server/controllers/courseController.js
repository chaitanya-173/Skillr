import Course from "../models/Course.js";
import User from "../models/User.js";

// Get all courses (for student view)
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("educator", "name imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get course by ID
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "educator",
      "name imageUrl"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new course (educator)
export const createCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      coursePrice,
      courseContent,
      courseThumbnail,
    } = req.body;
    const educator = req.user.id; // From auth middleware

    const newCourse = new Course({
      courseTitle,
      courseDescription,
      coursePrice,
      courseContent,
      courseThumbnail,
      educator,
      isPublished: false,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get educator's courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.user.id; // From auth middleware
    const courses = await Course.find({ educator }).sort({ createdAt: -1 });

    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get educator dashboard data
export const getEducatorDashboard = async (req, res) => {
  try {
    const educator = req.user.id;

    // Get all courses by this educator
    const courses = await Course.find({ educator });

    // Calculate total earnings
    const totalEarnings = courses.reduce((total, course) => {
      return total + course.enrolledStudents.length * course.coursePrice;
    }, 0);

    // Get latest enrollments with student details
    const enrolledStudentsData = [];
    for (const course of courses) {
      for (const studentId of course.enrolledStudents) {
        const student = await User.findById(studentId);
        if (student) {
          enrolledStudentsData.push({
            courseTitle: course.courseTitle,
            student: {
              _id: student._id,
              name: student.name,
              imageUrl: student.imageUrl,
            },
          });
        }
      }
    }

    // Sort by most recent (assuming course timestamps)
    enrolledStudentsData.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const dashboardData = {
      totalEarnings,
      enrolledStudentsData: enrolledStudentsData.slice(0, 10), // Latest 10
      totalCourses: courses.length,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Enroll student in course
export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    if (course.enrolledStudents.includes(studentId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Add student to enrolled list
    course.enrolledStudents.push(studentId);
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(studentId, {
      $push: { enrolledCourses: courseId },
    });

    res.status(200).json({ message: "Successfully enrolled" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's enrolled courses
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("enrolledCourses");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Rate a course
export const rateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is enrolled
    if (!course.enrolledStudents.includes(userId)) {
      return res.status(400).json({ message: "Must be enrolled to rate" });
    }

    // Check if already rated
    const existingRating = course.courseRatings.find(
      (r) => r.userId === userId
    );
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();
    res.status(200).json({ message: "Rating submitted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
