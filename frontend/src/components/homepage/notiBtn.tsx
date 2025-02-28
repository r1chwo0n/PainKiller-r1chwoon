// NotiBtn.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface NotiBtnProps {
  showNotifications: boolean;
  toggleNotifications: () => void;
  filterNotifications: () => JSX.Element[]; // This type must always return an array of JSX.Element.
}

const NotiBtn: React.FC<NotiBtnProps> = ({
  showNotifications,
  toggleNotifications,
  filterNotifications,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative px-2 py-2 bg-[#f0f0f0] text-[#8E8E8E] rounded-md hover:bg-gray-200"
      >
        {filterNotifications().length > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
            {filterNotifications().length}
          </span>
        )}
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
          />
        </svg>

        {showNotifications && (
          <div
            ref={notificationRef}
            className="absolute right-0 top-12 w-72 bg-[#ECECEC] border border-gray-300 rounded-lg shadow-lg z-50 p-4"
          >
            <h3 className="font-bold text-lg mb-2 text-left text-[#444444]">
              การแจ้งเตือน
            </h3>
            {filterNotifications().length > 0 ? (
              <ul className="divide-y divide-gray-300">
                {filterNotifications()
                  .slice(0, 3)
                  .map((notification, index) => (
                    <li key={index} className="text-base text-gray-700 p-2 text-left">
                      {notification}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-left">ไม่มีการแจ้งเตือน</p>
            )}
            <button
              onClick={() => navigate("/notification")}
              className="mt-4 py-2 bg-[#FB6F92] text-white text-base text-center rounded-[12px] w-full"
            >
              ดูทั้งหมด
            </button>
          </div>
        )}
      </button>
    </div>
  );
};

export default NotiBtn;
