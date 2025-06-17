import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    courseDescription: {
      type: String,
      required: true,
    },
    courseThumbnail: {
      type: String,
      required: true,
    },
    coursePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    discount: {
      type: Number,
      default: 0,
    },
    courseContent: [
      {
        chapterId: { type: String, required: true },
        chapterOrder: { type: Number, required: true },
        chapterTitle: { type: String, required: true },
        chapterContent: [
          {
            lectureId: { type: String, required: true },
            lectureTitle: { type: String, required: true },
            lectureDuration: { type: Number, default: 0 }, // in minutes
            lectureUrl: { type: String },
            isPreviewFree: { type: Boolean, default: false },
            lectureOrder: { type: Number, required: true },
          },
        ],
      },
    ],
    educator: {
      type: String,
      ref: "User",
      required: true,
    },
    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
    courseRatings: [
      {
        userId: {
          type: String,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    totalDuration: {
      type: Number,
      default: 0, // in minutes
    },
  },
  { timestamps: true }
);

// Calculate total duration before saving
courseSchema.pre("save", function (next) {
  if (this.courseContent && this.courseContent.length > 0) {
    this.totalDuration = this.courseContent.reduce((total, chapter) => {
      return (
        total +
        chapter.chapterContent.reduce((chapterTotal, lecture) => {
          return chapterTotal + (lecture.lectureDuration || 0);
        }, 0)
      );
    }, 0);
  }
  next();
});

export default mongoose.model("Course", courseSchema);
