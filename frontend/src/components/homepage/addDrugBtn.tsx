// AddDrugBtn.tsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface AddDrugBtnProps {
  showAddPopup: boolean;
  toggleAddPopup: () => void;
}

const AddDrugBtn: React.FC<AddDrugBtnProps> = ({ showAddPopup, toggleAddPopup }) => {
  const addPopupRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  return (
    <div className="relative">
      <button
        onClick={toggleAddPopup}
        className="px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200"
      >
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
                  toggleAddPopup();
                  navigate("/add-drug");
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-[#D9D9D9] flex items-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  className="mr-2"
                >
                  <path
                    d="M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M12 13V17M14 15H10"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                เพิ่มข้อมูลยา
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  toggleAddPopup();
                  navigate("/update-stock");
                }}
                className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  width="20"
                  height="20"
                  className="mr-2"
                >
                  <path
                    stroke="#000000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h3M3 21h3m0 0h4a2 2 0 0 0 2-2V9M6 21V9m0-6h4a2 2 0 0 1 2 2v4M6 3v6M3 9h3m0 0h6m-9 6h9m3-3h3m0 0h3m-3 0v3m0-3V9"
                  />
                </svg>
                อัปเดตสต็อก
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AddDrugBtn;
