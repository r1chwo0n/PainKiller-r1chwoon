import React, { useEffect, useState } from "react";
import axios from "axios";
// @ts-ignore
import SwitchSelector from "react-switch-selector";
import { useNavigate } from "react-router-dom";
import useSnackbar from "./components/useSnackber";
import Sidebar from "./components/sidebar";
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
                {isLowStock ? "จำนวนคงเหลือน้อยกว่ากำหนด" : ""}
                {isLowStock && isExpired ? " และ " : ""}
                {isExpired ? "ใกล้หมดอายุ" : ""}
              </div>
            </div>
          </div>
        );
      });
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
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />
      <main className="flex-1 p-4">
        {/* Header */}
        <header className="bg-white  h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="mb-2 text-3xl text-[#444444] ">คลังยา</h1>
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-[45px] py-2 pl-[50px] pr-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
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
                  <div className="absolute right-0 top-12 w-72 bg-[#ECECEC] border border-gray-300 rounded-lg shadow-lg z-50 p-4">
                    <h3 className="font-bold text-lg mb-2 text-left text-[#444444]">
                      การแจ้งเตือน
                    </h3>
                    {filterNotifications().length > 0 ? (
                      <ul className="divide-y divide-gray-300">
                        {filterNotifications().map((notification, index) => (
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
          <div
            className="flex-1 bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 150px)", marginTop: "4px" }}
          >
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drugs
                .filter((drug) => {
                  if (activeTab === "ทั้งหมด") return true;
                  if (activeTab === "ยา") return drug.drug_type === "drug";
                  if (activeTab === "สมุนไพร") return drug.drug_type === "herb";
                  if (activeTab === "ใกล้หมด")
                    return drug.stock[0]?.amount < 10;
                  return false;
                })
                .filter((drug) => {
                  if (!searchQuery) return true; // No search query, show all
                  return drug.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
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

                    <div className="flex items-center mb-4">
                      <h2 className="font-bold text-2xl">{drug.name}</h2>
                      <p className="ml-2 mt-1 text-gray-800">
                        {" "}
                        ( {drug.unit_type} ){" "}
                      </p>
                      {/* Conditional SVG */}
                      <div className="ml-2">
                        {drug.drug_type === "herb" ? (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "24px", height: "40px" }}
                          >
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g
                              id="SVGRepo_tracerCarrier"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                              {" "}
                              <path
                                d="M14 10L4 20M20 7C20 12.5228 15.5228 17 10 17C9.08396 17 8.19669 16.8768 7.35385 16.6462C7.12317 15.8033 7 14.916 7 14C7 8.47715 11.4772 4 17 4C17.916 4 18.8033 4.12317 19.6462 4.35385C19.8768 5.19669 20 6.08396 20 7Z"
                                stroke="#98c99f"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              ></path>{" "}
                            </g>
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 -0.5 17 17"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            className="si-glyph si-glyph-pill"
                            fill="#000000"
                            style={{ width: "24px", height: "24px" }}
                          >
                            <g
                              stroke="none"
                              stroke-width="1"
                              fill="none"
                              fill-rule="evenodd"
                            >
                              <path
                                d="M15.897,1.731 L15.241,1.074 C13.887,-0.281 11.745,-0.341 10.46,0.944 L1.957,9.446 C0.673,10.731 0.733,12.871 2.09,14.228 L2.744,14.882 C4.101,16.239 6.242,16.3 7.527,15.016 L16.03,6.511 C17.314,5.229 17.254,3.088 15.897,1.731 L15.897,1.731 Z M11.086,10.164 L6.841,5.917 L11.049,1.709 C11.994,0.765 13.581,0.811 14.584,1.816 L15.188,2.417 C15.678,2.91 15.959,3.552 15.975,4.226 C15.991,4.888 15.75,5.502 15.295,5.955 L11.086,10.164 L11.086,10.164 Z"
                                fill="#ffc673" // This is the blue sky color
                                className="si-glyph-fill"
                              />
                            </g>
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-base mb-2">รหัสยา: {drug.code}</p>
                    <p className="text-base mb-2">รายละเอียด: {drug.detail}</p>
                    <p className="text-base mb-2">
                      ขนาดและวิธีใช้: {drug.usage}
                    </p>
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
                      onClick={() => navigate(`/detail/${drug.drug_id}`)}
                      className="mt-auto py-2 bg-[#FB6F92] text-white text-base text-center rounded-[12px]"
                    >
                      ดูข้อมูล
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Popup */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] p-8 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                ยืนยันการลบ
              </h2>
              <p className="text-lg text-[#444444] mb-6">
                คุณแน่ใจว่าต้องการลบยานี้?
              </p>
              <div className="flex justify-end space-x-6">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setDeleteDrugId(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="px-6 py-3 bg-[#E57373] text-white rounded-[12px] hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
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
