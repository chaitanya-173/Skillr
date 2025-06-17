import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  // Whenever allCourses will be changed, fetchCourseData() will be executed
  useEffect(() => {
    fetchCourseData();
  }, [allCourses]);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-rowflex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left">
        <div className="absolute top-0 left-0 w-full -z-1 bg-gradient-to-b from-orange-100/70 to-gray-900/5"></div>

        {/* left column */}
        <div className="max-w-xl z-10 text-gray-700 bg-gray-900/5 p-6 rounded-lg">
          {/* course heading and description */}
          <h1 className="md:text-course-details-heading-large text-3xl font-semibold text-gray-900">
            {courseData.courseTitle}
          </h1>
          <p
            className="pt-4 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          />

          {/* review and ratings */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-orange-600">
              ({courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"})
            </p>
            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "students" : "student"}{" "}
            </p>
          </div>

          {/* course structure */}
          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-900/30 bg-gray-900/5 mb-2 rounded"
                >
                  <div
                    onClick={() => toggleSection(index)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        className={`transform transition-transform ${
                          openSections[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm md:text-default">
                      {chapter.chapterContent.length} lectures -{" "}
                      {calculateChapterTime(chapter)}
                    </p>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openSections[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-disc md:pl-10 pr-4 py-2 text-gray-600 border-t border-gray-300">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li key={i} className="flex items-start gap-2 py-1">
                          <img
                            src={assets.play_icon}
                            alt="play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-default">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-2">
                              {lecture.isPreviewFree && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        .split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Preview
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* course description */}
          <div className="py-10 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            />
          </div>
        </div>

        {/* right column */}
        <div>
          {/* course thumbnail and price*/}
          <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-gray-900/5 min-w-[300px] sm:min-w-[420px]">
            {playerData ? (
              <YouTube
                videoId={playerData.videoId}
                opts={{ playerVars: { autoplay: 1 } }}
                iframeClassName="w-full aspect-video"
              />
            ) : (
              <img src={courseData.courseThumbnail} alt="" />
            )}
            <p className="md:text-3xl text-gray-500">
              {courseData.coursePrice} Rs.
            </p>
          </div>

          {/* course duration */}
          <div className="flex items-center text-sm md:text-default gap-4 pt-2 md:pt-4 text-gray-500">
            <div className="flex items-center gap-1">
              <img src={assets.star} alt="star icon" />
              <p>{calculateRating(courseData)}</p>
            </div>

            <div className="h-4 w-px bg-gray-900/40"></div>

            <div className="flex items-center gap-1">
              <img src={assets.time_clock_icon} alt="clock icon" />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>

            <div className="h-4 w-px bg-gray-900/40"></div>

            <div className="flex items-center gap-1">
              <img src={assets.lesson_icon} alt="clock icon" />
              <p>{calculateNoOfLectures(courseData)} lessons</p>
            </div>
          </div>

          {/* course enrollment button */}
          <button className="md:mt-6 mt-4 w-full py-3 rounded bg-orange-600 text-white font-medium hover:bg-orange-700">
            {isAlreadyEnrolled ? "Already Enrolled" : "Enroll now"}
          </button>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
