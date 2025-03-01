import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

interface Drug {
  drug_id: string;
  name: string;
  drug_type: string;
  unit_type: string;
  stock: { amount: number; expired: string }[];
}

interface NotificationButtonProps {
  drugs: Drug[];
  showNotifications: boolean;
  setshowNotifications: (value: boolean) => void;
  toggleNotifications: () => void;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  drugs,
  showNotifications,
  setshowNotifications,
  toggleNotifications,
}) => {
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filterNotifications = () => {
    const thresholdStock = 10;
    const currentDatePlus7 = new Date();
    currentDatePlus7.setDate(currentDatePlus7.getDate() + 7);

    return drugs
      .filter((drug) =>
        drug.stock.some(
          (s) =>
            s.amount < thresholdStock || new Date(s.expired) <= currentDatePlus7
        )
      )
      .map((drug) => {
        const stockInfo = drug.stock.find(
          (s) =>
            s.amount < thresholdStock || new Date(s.expired) <= currentDatePlus7
        );
        if (!stockInfo) return null;

        return (
          <div key={drug.drug_id} className="flex items-center">
            <div
              className={clsx(
                "w-[35px] h-[35px] rounded-full flex items-center justify-center mr-4",
                drug.drug_type === "drug" ? "bg-[#ffc673]" : "bg-[#98c99f]"
              )}
            ></div>
            <div>
              <div className="text-lg text-left">{drug.name} ({drug.unit_type})</div>
              <div className="text-left">
                {stockInfo.amount < thresholdStock
                  ? "จำนวนน้อยกว่าที่กำหนด"
                  : ""}
                {new Date(stockInfo.expired) <= currentDatePlus7 ? (
                  <span className="block">ยาใกล้หมดอายุ</span>
                ) : null}
              </div>
            </div>
          </div>
        );
      });
  };

   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          notificationRef.current &&
          !notificationRef.current.contains(event.target as Node)
        ) {
          setshowNotifications(false);
        }
      }
  
      if (showNotifications) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [showNotifications]);

  return (
    <button
      onClick={toggleNotifications}
      className="relative px-2 py-2 bg-[#f0f0f0] text-[#8E8E8E] rounded-md hover:bg-gray-200"
    >
      {filterNotifications().length > 0 && (
        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
          {filterNotifications().length}
        </span>
      )}

      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
        />
      </svg>

      {showNotifications && (
        <div
          ref={notificationRef}
          className="absolute right-0 top-12 w-72 bg-[#ECECEC] border border-gray-300 rounded-lg shadow-lg z-50 p-4"
        >
          <h3 className="font-bold text-lg mb-2 text-[#444444]">
            การแจ้งเตือน
          </h3>
          {filterNotifications().length > 0 ? (
            <ul className="divide-y divide-gray-300">
              {filterNotifications()
                .slice(0, 3)
                .map((notification, index) => (
                  <li key={index} className="text-base text-gray-700 p-2">
                    {notification}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>
          )}
          <button
            onClick={() => navigate("/doctor/notification")}
            className="mt-4 py-2 bg-[#FB6F92] text-white text-base rounded-[12px] w-full"
          >
            ดูทั้งหมด
          </button>
        </div>
      )}
    </button>
  );
};

export default NotificationButton;
