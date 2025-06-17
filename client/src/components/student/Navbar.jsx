import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {

  const navigate = useNavigate();
  const { isEducator } = useContext(AppContext);

  const isCourseListPage = location.pathname.includes("/course-list"); // if url pathname includes '/' then it's course list page (true/false)

  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 
      ${ isCourseListPage ? "bg-white" : "bg-cyan-100/70" }`}>
      <div onClick={() => navigate('/')} className="w-28 lg:w-32 cursor-pointer flex items-center">
        <span className="ml-2 text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          UpSkillr
        </span>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex items-center gap-5 text-grey-500">
        <div className="flex items-center gap-5">
          {/* First Create Account then only access the platform. */}
          { user && 
            <> 
              <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Admin Dashboard' : 'Become Educator'}</button>
              | <Link to="/my-enrollments">My Enrollments</Link>
            </>
          }
        </div>
        {/* If user is authenticated, display user's profile picture and name */}
        { user ? <UserButton/> : 
          <button onClick={() => openSignIn()} className="bg-blue-600 text-white px-5 py-2 rounded-full">
            Create Account
          </button>
        }
      </div>

      {/* Phone view */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className="flex items-center gap=-1 sm:gap-2 max-sm:text-xs">
          { user && 
            <> 
              <button onClick={() => {navigate('/educator')}}>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              | <Link to="/my-enrollments">My Enrollments</Link>
            </>
          }
        </div>
        {
          user ? <UserButton/> : <button onClick={() => openSignIn()}><img src={assets.user_icon} alt="" /></button>
        }
      </div>

    </div>
  );
};

export default Navbar;
