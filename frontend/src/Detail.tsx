import React from "react";
// import { FaEdit, FaTrash } from "react-icons/fa";

interface DataRow {
  label: string;
  value: string;
}

const data: DataRow[] = [
  { label: "เกี่ยวกับยา (ชื่อยา)", value: "" },
  { label: "รหัสยา", value: "ข้อมูล" },
  { label: "จำนวนคงเหลือ", value: "ข้อมูล" },
  { label: "รายละเอียดยา", value: "ข้อมูล" },
  { label: "วิธีใช้", value: "ข้อมูล" },
  { label: "วันหมดอายุ", value: "ข้อมูล" },
  { label: "ผลข้างเคียง", value: "ข้อมูล" },
  { label: "อาหารแสลง", value: "ข้อมูล" },
];

const Detail: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 p-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/path-to-logo" // Replace with your logo's path
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold">มงคลสิทธิ์</h1>
        </div>
        <nav className="w-full">
          <a
            href="#"
            className="block p-2 mb-4 text-pink-500 font-medium bg-pink-100 rounded text-center">
            คลังยา
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1>ชื่อยา</h1>
          <div
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#fff",
            }}>
            {data.map((row, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "15px",
                  borderBottom:
                    index === data.length - 1 ? "none" : "1px solid #e0e0e0",
                  backgroundColor: index === 1 ? "#f4eaff" : "transparent", // Highlight for "ที่มา"
                }}>
                <span style={{ fontWeight: 500 }}>{row.label}</span>
                <span>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
