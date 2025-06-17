import React from 'react'
import { assets, dummyEducatorData } from '../../assets/assets'
import { UserButton, useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const educatorData = dummyEducatorData;
  const { user } = useUser();


  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to='/'>
      <div className="w-28 lg:w-32 cursor-pointer flex items-center">
        <span className="ml-2 text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          UpSkillr
        </span>
      </div>
      </Link>
      <div className='flex items-center gap-5 text-gray-500 relative'>
        <p>Hi {user ? user.fullName : 'Developers'} !</p>
        {user ? <UserButton/> : <img src={assets.profile_img} className='max-w-8' />}
      </div>
    </div>
  )
}

export default Navbar
