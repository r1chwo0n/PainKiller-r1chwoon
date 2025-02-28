import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar";
import DrugCards from "./components/homepage/drugCards";
import clsx from "clsx";

interface Drug {
  drug_id: string;
  name: string;
  code: string;
  detail: string;
  usage: string;
  drug_type: string;
  unit_type: string;
  stock: {
    amount: number;
    expired: string;
  }[];
}

const Homepage: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>([]);
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const options = ["ทั้งหมด", "ยา", "สมุนไพร", "ใกล้หมดคลัง", "ใกล้หมดอายุ"];
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [showNotifications, setShowNotifications] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const addPopupRef = useRef<HTMLDivElement>(null);
  // ฟังก์ชันกรองข้อมูลจาก drugs
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      const filtered = drugs.filter(
        (drug) => drug.name.toLowerCase().includes(query.toLowerCase()) // กรองชื่อยาที่ตรงกับคำค้นหา
      );
      setFilteredDrugs(filtered); // อัพเดตรายการยา
    } else {
      setFilteredDrugs([]); // หากไม่มีคำค้นหาก็ให้ซ่อน dropdown
    }
  };

  const toggleNotifications = () => {
    setShowAddPopup(false); // ปิด Pop-up ของปุ่มบวก ถ้ามันเปิดอยู่
    setShowNotifications((prev) => !prev); // สลับสถานะ Pop-up แจ้งเตือน
  };

  const toggleAddPopup = () => {
    setShowNotifications(false); // ปิด Pop-up ของปุ่มแจ้งเตือน ถ้ามันเปิดอยู่
    setShowAddPopup((prev) => !prev); // สลับสถานะ Pop-up ของปุ่มบวก
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // เช็คถ้าคลิกนอก Notification Pop-up
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }

      // เช็คถ้าคลิกนอก Add Drug Pop-up
      if (
        addPopupRef.current &&
        !addPopupRef.current.contains(event.target as Node)
      ) {
        setShowAddPopup(false);
      }
    };

    // เพิ่ม Event Listener เมื่อมีการแสดง Pop-up
    if (showNotifications || showAddPopup) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // ลบ Event Listener เมื่อ Pop-up ปิด
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications, showAddPopup]);

  useEffect(() => {
    // Fetch drugs from API
    const fetchDrugs = async () => {
      try {
        const response = await axios.get("/api/drugs");
        setDrugs(response.data.data); // Assuming API returns { data: drugs }
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    };
    fetchDrugs();
  }, []);

  const filterNotifications = () => {
    const thresholdStock = 10; // เกณฑ์จำนวนยาคงเหลือ
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

        const isLowStock = stockInfo.amount < thresholdStock;
        const isExpired = new Date(stockInfo.expired) <= currentDatePlus7;
        return (
          <div className="flex items-center">
            <div
              className={clsx(
                "w-[35px] h-[35px] rounded-full flex items-center justify-center mr-4",
                drug.drug_type === "drug" ? "bg-[#ffc673]" : "bg-[#98c99f]"
              )}
            ></div>
            <div>
              <div className="text-lg">{drug.name}</div>
              <div className="text-base">
                {isLowStock ? "จำนวนน้อยกว่าที่กำหนด" : ""}
                {isExpired ? <span className="block"> ยาใกล้หมดอายุ</span> : ""}
              </div>
            </div>
          </div>
        );
      });
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />
      <main className="flex-1 p-4">
        {/* Header */}
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="mb-2 text-4xl text-[#444444] font-bold">คลังยา</h1>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <div className="relative w-[330px]">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#909090]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  width="20"
                  height="20"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 17a6 6 0 100-12 6 6 0 000 12zM21 21l-4.35-4.35"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="ค้นหาชื่อยา"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full h-[45px] py-2 pl-[50px] pr-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
                {/* แสดง dropdown ถ้ามีการกรองรายการ */}
                {filteredDrugs.length > 0 && (
                  <ul className="absolute w-full mt-1 bg-[#f0f0f0] border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                    {filteredDrugs.map((drug) => (
                      <li
                        key={drug.drug_id} // ใช้ drug_id แทน key
                        className="px-4 py-2 cursor-pointer hover:bg-[#D9D9D9]"
                        onClick={() => {
                          setSearchQuery(drug.name); // กรอกชื่อยาเมื่อคลิก
                          setFilteredDrugs([]); // ซ่อน dropdown
                        }}
                      >
                        {drug.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notification Button */}
              <button
                onClick={toggleNotifications}
                className="relative px-2 py-2 bg-[#f0f0f0] text-[#8E8E8E] rounded-md hover:bg-gray-200"
              >
                {/* Notification Badge */}
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
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z"
                  />
                </svg>

                {/* Notifications Popup */}
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
                        {/* จำกัดการแสดงผลแค่ 3 รายการ */}
                        {filterNotifications()
                          .slice(0, 3) // แสดงรายการที่ 0 ถึง 2 (รวม 3 รายการ)
                          .map((notification, index) => (
                            <li
                              key={index}
                              className="text-base text-gray-700 p-2 text-left"
                            >
                              {notification}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-left">
                        ไม่มีการแจ้งเตือน
                      </p>
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

              {/* Add Drug Button*/}
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 12h14m-7 7V5"
                    />
                  </svg>
                </button>

                {/* Pop-up Window */}
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
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M13 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V9M13 3L19 9M13 3V8C13 8.55228 13.4477 9 14 9H19M12 13V17M14 15H10"
                                stroke="#000000"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>
                            </g>
                          </svg>
                          เพิ่มข้อมูลยา
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setShowAddPopup(false);
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
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                stroke="#000000"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 3h3M3 21h3m0 0h4a2 2 0 0 0 2-2V9M6 21V9m0-6h4a2 2 0 0 1 2 2v4M6 3v6M3 9h3m0 0h6m-9 6h9m3-3h3m0 0h3m-3 0v3m0-3V9"
                              ></path>
                            </g>
                          </svg>
                          อัปเดตสต็อก
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-sch">
          {/* Slider Indicator */}
          <div className="relative flex rounded-[12px] bg-gray-100 mb-6 mt-2 max-w-xl">
            <div
              className="absolute bg-[#FB6F92] rounded-[12px] transition-all duration-300 ease-in-out"
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
                className={`flex-1 z-10 px-3 py-3 rounded-[12px] text-base text-center transition-colors duration-200 ${
                  activeTab === option ? "text-white" : "text-[#444444]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          <div
            className="flex-1 bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - 235px)",
              marginTop: "4px",
              overflowY: "auto",
            }}
          >
            {/* Cards */}
            <DrugCards
              drugs={drugs}
              activeTab={activeTab}
              searchQuery={searchQuery}
              setShowDeletePopup={setShowDeletePopup}
              showDeletePopup={showDeletePopup}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
