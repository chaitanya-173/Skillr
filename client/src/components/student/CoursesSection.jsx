import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import CourseCard from './CourseCard';

const CoursesSection = () => {

  const { allCourses } = useContext(AppContext);

  return (
    <div className='md:px-40 px-8'>
      <h2 className='text-2xl font-medium text-gray-600 pt-5'>Top-rated courses</h2>
      
      <div className='grid grid-cols-4 px-4 md:px-0 md:my-8 my-10 gap-4' >
        {allCourses.slice(0,8).map((course, index) => <CourseCard key={index} course={course} />)}
      </div>

      <Link to={'/course-list'} onClick={() => scrollTo(0,0)} 
      className='text-gray-500 border border-gray-500/30 px-5 py-2 rounded'> Show all courses</Link>
    </div>
  )
}

export default CoursesSection
