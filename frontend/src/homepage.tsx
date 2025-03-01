import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/sidebar";
import DrugCards from "./components/homepage/drugCards";
import NotificationButton from "./components/homepage/notiButton";
import AddDrugButton from "./components/homepage/addButton";

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
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);

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
              <NotificationButton
                drugs={drugs}
                showNotifications={showNotifications}
                toggleNotifications={toggleNotifications}
                setshowNotifications={setShowNotifications}
              />
              <AddDrugButton
                setShowAddPopup={setShowAddPopup}
                showAddPopup={showAddPopup}
                toggleAddPopup={toggleAddPopup}
              />
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
