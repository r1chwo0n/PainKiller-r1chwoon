import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AddDrugButtonProps {
  showAddPopup: boolean;
  setShowAddPopup: (value: boolean) => void;
  toggleAddPopup: () => void;
}

const AddDrugButton: React.FC<AddDrugButtonProps> = ({
  showAddPopup,
  toggleAddPopup,
  setShowAddPopup,
}) => {
  const addPopupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addPopupRef.current &&
        !addPopupRef.current.contains(event.target as Node)
      ) {
        setShowAddPopup(false);
      }
    }

    if (showAddPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddPopup]);

  return (
    <div className="relative">
      <button
        onClick={toggleAddPopup}
        className="px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200"
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12h14m-7 7V5"
          />
        </svg>
      </button>

      {showAddPopup && (
        <div
          ref={addPopupRef}
          className="absolute right-0 mt-2 bg-[#ECECEC] border border-gray-200 rounded-lg shadow-lg z-50 w-48"
        >
          <ul className="py-2">
            <li>
              <button
                onClick={() => {
                  setShowAddPopup(false);
                  navigate("/doctor/add-drug");
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#D9D9D9] flex items-center"
              >
                เพิ่มข้อมูลยา
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setShowAddPopup(false);
                  navigate("/doctor/add-stock");
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#D9D9D9] flex items-center"
              >
                เพิ่มสต็อก
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddDrugButton;
