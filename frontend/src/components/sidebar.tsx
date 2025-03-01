import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/context";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const handleNavigate = () => {
    if (role === "doctor") {
      navigate("/doctor"); 
    } else {
      navigate("/patient"); 
    }
  };


  return (
    <aside className="w-1/7 h-screen bg-white p-6 ml-4 shadow-md flex flex-col items-center">
      {/* Logo */}
      <img
        src="/pic/logomk.jpg"
        alt="Logo"
        className="h-1/6 mb-1 rounded-full object-cover shadow-lg cursor-pointer"
      />

      {/* Navigation Link */}
      <div
        className="flex items-center mt-4 mr-14 text-[#fb6f92] cursor-pointer"
        onClick={handleNavigate}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 mr-2"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <g>
            <path d="M0 0H24V24H0z" fill="none" />
            <path d="M19.778 4.222c2.343 2.343 2.343 6.142 0 8.485l-2.122 2.12-4.949 4.951c-2.343 2.343-6.142 2.343-8.485 0-2.343-2.343-2.343-6.142 0-8.485l7.07-7.071c2.344-2.343 6.143-2.343 8.486 0zm-4.95 10.606L9.172 9.172l-3.536 3.535c-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.095 1.562 5.657 0l3.535-3.536z" />
          </g>
        </svg>
        <span className="text-[#fb6f92] text-base">คลังยา</span>
      </div>
    </aside>
  );
};

export default Sidebar;
