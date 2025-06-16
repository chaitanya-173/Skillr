import React from 'react'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-8 mx-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
      <SearchBar/>
    </div>
  )
}

export default Hero
