import { createContext, useEffect, useState } from 'react'
import { dummyCourses } from '../assets/assets';
import humanizeDuration from 'humanize-duration';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  }

  // Function to calculate average rating of a course
  const calculateRating = (course) => { 
    const ratings = course.ratings;
    if (!Array.isArray(ratings) || ratings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    ratings.forEach(rating => {
      totalRating += rating.rating;
    });
    return totalRating / ratings.length;
  }

  // Function to calculate course chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)
    return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']});
  }

  // Function to calculate the course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.map((chapter) => chapter.chapterContent.map((lecture) => time += lecture.lectureDuration))
    return humanizeDuration(time * 60 * 1000, {units: ['h', 'm']});
  }

  // Function to calulate the number of lectures in the course
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
      if(Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  }

  // Function to fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  }
 
  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  },[])

  const value = {
    allCourses, calculateRating, isEducator, setIsEducator, calculateChapterTime, calculateCourseDuration, calculateNoOfLectures, enrolledCourses, fetchUserEnrolledCourses
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>

  )
} 
