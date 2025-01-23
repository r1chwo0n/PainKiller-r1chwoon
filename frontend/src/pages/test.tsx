import React, { useEffect, useState } from "react";
import axios from "axios";
// @ts-ignore
import SwitchSelector from "react-switch-selector";
import { useNavigate } from "react-router-dom";

interface Drug {
  drug_id: string;
  name: string;
  code: string;
  detail: string;
  usage: string;
  stock: {
    amount: number;
    expired: string;
  }[];
}

const Detail: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const options = ["ทั้งหมด", "ยา", "สมุนไพร", "ใกล้หมด"];
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteDrugId, setDeleteDrugId] = useState<string | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    // Fetch drugs from API
    const fetchDrugs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/drugs");
        setDrugs(response.data.data); // Assuming API returns { data: drugs }
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    };
    fetchDrugs();
  }, []);

  const filterNotifications = () => {
    const thresholdStock = 10;
    const currentDate = new Date();
    const currentDatePlus7 = new Date();
    currentDatePlus7.setDate(currentDatePlus7.getDate() + 7);

    return drugs
      .filter((drug) =>
        drug.stock.some(
          (s) =>
            s.amount < thresholdStock || new Date(s.expired) > currentDatePlus7
        )
      )
      .map((drug) => {
        const stockInfo = drug.stock.find(
          (s) =>
            s.amount < thresholdStock || new Date(s.expired) > currentDatePlus7
        );
        if (!stockInfo) return null;

        const isLowStock = stockInfo.amount < thresholdStock;
        const isExpired = new Date(stockInfo.expired) <= currentDate;
        return `${drug.name} ${isLowStock ? "ใกล้หมดสต็อก" : ""}${
          isLowStock && isExpired ? " และ " : ""
        }${isExpired ? "ใกล้หมดอายุ" : ""}`;
      })
      .filter(Boolean);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/drugs/search?name=${searchQuery}`
      );
      setDrugs(response.data.data);
    } catch (error) {
      console.error("Error searching drugs:", error);
    }
  };

 
  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <aside className="w-1/7 h-screen bg-white p-6 ml-4 shadow-md flex flex-col items-center">
        {/* <div className="items-center"> */}
        <img
          src="/pic/logomk.jpg"
          alt="Logo"
          className="h-1/6 mb-1 rounded-full object-cover shadow-lg"
          onClick={() => navigate("/homepage")}
        />
        {/* </div> */}
        <div className="flex items-center mt-4 text-base text-[#fb6f92] ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            onClick={() => navigate("/homepage")}
          >
            <g>
              <path d="M0 0H24V24H0z" fill="none" />
              <path d="M19.778 4.222c2.343 2.343 2.343 6.142 0 8.485l-2.122 2.12-4.949 4.951c-2.343 2.343-6.142 2.343-8.485 0-2.343-2.343-2.343-6.142 0-8.485l7.07-7.071c2.344-2.343 6.143-2.343 8.486 0zm-4.95 10.606L9.172 9.172l-3.536 3.535c-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.095 1.562 5.657 0l3.535-3.536z" />
            </g>
          </svg>
          <a href="#" className="text-[#fb6f92] ">
            คลังยา
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* Header */}
        <header className="bg-white p-6 rounded-md shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">คลังยา</h1>
            <div className="flex items-center space-x-4">
              {/* ช่องค้นหา */}
              <input
                type="text"
                placeholder="ค้นหาชื่อยา"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-600"
              />

              {/* ปุ่ม Notification */}
              {/* <button
                onClick={toggleNotifications}
                className="relative px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200"
              > */}
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
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
                />
              </svg>

              {/* Notifications Panel */}
              {/* {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg border border-gray-200 rounded-md">
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">การแจ้งเตือน</h3>
                      {filterNotifications().length > 0 ? (
                        <ul className="space-y-2">
                          {filterNotifications().map((notification, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-700 bg-gray-100 p-2 rounded-md"
                            >
                              {notification}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate("/notification")}
                      className="w-full py-2 bg-gray-100 text-center text-blue-600 hover:bg-gray-200"
                    >
                      ดูทั้งหมด
                    </button>
                  </div>
                )}
              </button> */}

              {/* ปุ่ม Add Drug */}
              <button
                onClick={() => navigate("/add-drug")}
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 12h14m-7 7V5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </header>

        <div className="bg-white p-6 rounded-md shadow-md">
          {/* Slider Indicator */}
          <div className="relative flex bg-gray-100 rounded-md mb-6 max-w-xl">
            <div
              className="absolute bg-[#FB6F92] rounded-md transition-all duration-300 ease-in-out"
              style={{
                width: `${100 / options.length}%`,
                height: "100%",
                transform: `translateX(${options.indexOf(activeTab) * 100}%)`,
              }}
            />
            {/* Options */}
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setActiveTab(option)}
                className={`flex-1 z-10 px-6 py-2 rounded-md text-center transition-colors duration-200 ${
                  activeTab === option ? "text-white" : "text-gray-700"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Detail;
