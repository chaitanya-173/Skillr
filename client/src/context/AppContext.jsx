import { createContext, useEffect, useState } from 'react'
import { dummyCourses } from '../assets/assets';
import humanizeDuration from 'humanize-duration';
import { useAuth, useUser } from '@clerk/clerk-react';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

  const { getToken } = useAuth();
  const { user } = useUser(); 

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  }

  const calculateRating = (course) => { 
    const ratings = course.ratings || [];
    if (ratings.length === 0) return 0;
    const total = ratings.reduce((sum, r) => sum + r.rating, 0);
    return total / ratings.length;
  }

  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.forEach(lecture => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }

  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }

  const calculateNoOfLectures = (course) => {
    return course.courseContent.reduce((total, chapter) => {
      return total + (chapter.chapterContent?.length || 0);
    }, 0);
  }

  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  }

  // 🆕 Create user in DB if not exists
  const createUserIfNotExists = async () => {
    try {
      const token = await getToken();
      await fetch('https://<your-vercel-backend-url>/webhooks/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress.emailAddress,
          imageUrl: user.imageUrl,
        }),
      });
    } catch (error) {
      console.error("User create error:", error);
    }
  }

  useEffect(() => {
    fetchAllCourses();
    fetchUserEnrolledCourses();
  }, []);

  useEffect(() => {
    if (user) {
      createUserIfNotExists();
    }
  }, [user]);

  const value = {
    allCourses,
    calculateRating,
    isEducator,
    setIsEducator,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    enrolledCourses,
    fetchUserEnrolledCourses
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
