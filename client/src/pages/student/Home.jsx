import React from 'react'
import Hero from '../../components/student/Hero'
import CoursesSection from '../../components/student/CoursesSection'
import Footer from '../../components/student/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y- text-center'>
      <Hero/>
      <CoursesSection/>
      <Footer/>
    </div>
  )
}

export default Home
