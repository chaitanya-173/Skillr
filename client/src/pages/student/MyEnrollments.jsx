import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from 'react-router-dom';

const MyEnrollments = () => {
  const { enrolledCourses } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr><th className="px-4 py-3 font-semibold truncate">Course</th></tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => (
              <tr key={index} className="border-b border-gray-500/20"onClick={() => navigate('/player/' + course._id)}>
                <td className='md:px-4 pl-2 py-3 flex items-center space-x-3'>
                  <img src={course.courseThumbnail} alt="" className="w-15 sm:w-24 md:w-28"/>
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm cursor-pointer">{course.courseTitle}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyEnrollments;
