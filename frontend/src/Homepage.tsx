import React, { useEffect, useState } from "react";
import axios from "axios";
// @ts-ignore
import SwitchSelector from "react-switch-selector";
import { useNavigate } from "react-router-dom";
import useSnackbar from "./components/useSnackber";
import Sidebar from "./components/slidebar";

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

const Homepage: React.FC = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("ทั้งหมด");
  const options = ["ทั้งหมด", "ยา", "สมุนไพร", "ใกล้หมด"];
  const navigate = useNavigate();
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteDrugId, setDeleteDrugId] = useState<string | null>(null);

  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);

  const { showSnackbar, Snackbar } = useSnackbar();

  const triggerNewNotification = () => {
    setHasNewNotification(true);
    setTimeout(() => {
      setHasNewNotification(false); // Reset after animation duration
    }, 1000); // Adjust time to match the animation duration
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
          <>
            {drug.name}
            <br />
            {isLowStock ? "จำนวนคงเหลือน้อยกว่ากำหนด" : ""}
            {isLowStock && isExpired ? " และ " : ""}
            {isExpired ? "ใกล้หมดอายุ" : ""}
          </>
        );                
      })
  };

  const handleDelete = async () => {
    if (!deleteDrugId) return;

    try {
      await axios.delete(`http://localhost:3000/drugs/${deleteDrugId}`);
      setDrugs((prevDrugs) =>
        prevDrugs.filter((drug) => drug.drug_id !== deleteDrugId)
      );
      setShowDeletePopup(false);
      setDeleteDrugId(null);
      showSnackbar({
        message: "ลบข้อมูลยาสำเร็จ!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting drug:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการลบข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-4">
        {/* Header */}
        <header className="bg-white  h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="mb-2 text-4xl text-[#444444] font-bold">คลังยา</h1>
            <div className="flex items-center space-x-4">
              {/* Search Input */}
              <input
                type="text"
                placeholder="ค้นหาชื่อยา"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[330px] h-[45px] py-2 rounded-[12px] bg-[#f0f0f0] text-[#909090] pl-[20px] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
              {/* Notification Button */}
              <button
                onClick={toggleNotifications}
                className={`relative px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200`}
              >
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  className={`${hasNewNotification ? "animate-shake" : ""}`}
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
                    className="absolute right-0 top-12 w-72 bg-[#ECECEC] border border-gray-300 rounded-lg shadow-lg z-50 p-4"
                  >
                    <h3 className="font-bold text-lg mb-2 text-left text-gray-800">
                      การแจ้งเตือน
                    </h3>
                    {filterNotifications().length > 0 ? (
                      <ul className="divide-y divide-gray-300">
                        {filterNotifications().map((notification, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-700 p-2 text-left"
                          >
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
                  <div className="absolute right-0 mt-2 bg-[#ECECEC] border border-gray-200 rounded-lg shadow-lg z-50 w-48">
                    <ul className="py-2">
                      <li>
                      <button
                        onClick={() => {
                          setShowAddPopup(false);
                          navigate("/add-drug");
                        }}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
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
                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
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
                          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
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

        <div className="bg-white p-6 rounded-[12px] shadow-md">
          {/* Slider Indicator */}
          <div className="relative flex bg-gray-100 rounded-md mb-6 max-w-xl">
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
                className={`flex-1 z-10 px-6 py-2 rounded-[12px] text-base text-center transition-colors duration-200 ${
                  activeTab === option ? "text-white" : "text-[#444444]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drugs
              .filter((drug) => {
                if (activeTab === "ทั้งหมด") return true;
                if (activeTab === "ยา") return drug.detail.includes("ยา");
                if (activeTab === "สมุนไพร")
                  return drug.detail.includes("สมุนไพร");
                if (activeTab === "ใกล้หมด") return drug.stock[0]?.amount < 10;
                return false;
              })
              .filter((drug) => {
                if (!searchQuery) return true; // No search query, show all
                return drug.name.toLowerCase().includes(searchQuery.toLowerCase());
              })
              .map((drug) => (
                
                <div
                  key={drug.drug_id}
                  className="relative p-4 border border-[#f5f5f5]] rounded-[12px] bg-white shadow-md flex flex-col"
                >
                  {/* Trash Icon */}
                  <button
                    onClick={() => {
                      setDeleteDrugId(drug.drug_id);
                      setShowDeletePopup(true);
                    }}
                    className="absolute top-4 right-4 text-[#FB6F92] hover:text-[#E15873]"
                  >
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  {Snackbar}

                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-2xl">{drug.name}</h2>
                  </div>
                  <p className="text-base mb-2">รหัสยา: {drug.code}</p>
                  <p className="text-base mb-2">รายละเอียด: {drug.detail}</p>
                  <p className="text-base mb-2">ขนาดและวิธีใช้: {drug.usage}</p>
                  <p className="text-base mb-2">
                    วันหมดอายุ:{" "}
                    {drug.stock.length > 0
                      ? new Intl.DateTimeFormat("th-TH", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }).format(new Date(drug.stock[0].expired))
                      : "ไม่พบวันหมดอายุ"}
                  </p>
                  <p className="text-base mb-4">
                    จำนวนคงเหลือ:{" "}
                    {drug.stock.length > 0 ? drug.stock[0].amount : "0"}
                  </p>
                  <button
                    onClick={() => navigate(`/edit-drug/${drug.drug_id}`)}
                    className="mt-auto py-2 bg-[#FB6F92] text-white text-base text-center rounded-[12px]"
                  >
                    แก้ไข
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                ยืนยันการลบ
              </h2>
              <p className="text-base text-gray-600 mb-6">
                คุณแน่ใจว่าต้องการลบยานี้?
              </p>
              <div className="flex justify-end space-x-6">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setDeleteDrugId(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="px-6 py-3 bg-[#E57373] text-white rounded-md hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
