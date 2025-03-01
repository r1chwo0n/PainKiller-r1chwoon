import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface DataRow {
  label: string;
  value: React.ReactNode;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the `id` parameter from the URL
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const handleDelete = () => {
    console.log("Deleted!");
    setIsModalOpen(false);
  };

  const fetchData = async (drugId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/drugs/${encodeURIComponent(drugId)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const result = await response.json();

      const totalStockAmount = result.data?.stock?.reduce(
        (sum: number, stockItem: { amount: number }) =>
          sum + (stockItem.amount || 0),
        0
      );

      console.log("data:",result)
      const formattedData: DataRow[] = [
        { label: "ชื่อยา", value: result.data.name ?? "N/A" },
        { label: "รหัสยา", value: result.data.code ?? "N/A" },
        {
          label: "จำนวนคงเหลือ",
          value: totalStockAmount?.toString() ?? "N/A",
        },
        { label: "รายละเอียดยา", value: result?.data.detail ?? "N/A" },
        { label: "วิธีใช้", value: result?.data.usage ?? "N/A" },
        { label: "ผลข้างเคียง", value: result?.data.side_effect ?? "N/A" },
        { label: "อาหารที่ห้ามทานร่วมกับยา", value: result?.data.slang_food ?? "N/A" },
      ];

      const stockData: DataRow[] = result.data?.stock?.map(
        (
          stockItem: {
            expired: string;
            amount: number;
            unit_type: string;
            unit_price: number;
          },
          index: number
        ) => ({
          label: `ล็อตที่ ${index + 1}`,
          value: (
            <>
              จำนวน: {stockItem.amount} <br />
              ประเภท: {result.data.unit_type} <br />
              วันหมดอายุ: {stockItem.expired} <br />
              ราคาต่อหน่วย: {stockItem.unit_price}
            </>
          ),
        })
      );

      setData([...formattedData, ...stockData]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id); // Fetch data using the `id` from the URL
    } else {
      setError("No drug ID provided in the URL.");
    }
  }, [id]);

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />
      <div
        className="flex-1 p-4"
        style={{ fontFamily: "Arial, sans-serif" }}>
          
        {/* Delete Confirmation Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] p-8 shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                ยืนยันการลบข้อมูล
              </h2>
              <p className="text-lg text-[#444444] mb-6">
                ต้องการลบข้อมูลใช่หรือไม่?
              </p>
              <div className="flex justify-end space-x-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-3 bg-[#E57373] text-white rounded-[12px] hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        )}

      
        {loading && <div>กำลังโหลดข้อมูล...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        {!loading && !error && (
          <>
            <header className="bg-white h-[86px] w-full p-6 rounded-[12px] shadow-md mb-6 flex items-center justify-between">
              {/* Drug Name */}
              <span className="mb-2 text-4xl text-[#444444] font-bold">
                {data.find((row) => row.label === "ชื่อยา")?.value ?? "Drug Name Not Found"}
              </span>

              {/* Buttons Container */}
              <div className="flex gap-2 marginLeft">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/doctor/edit-drug/${id}`)}
              className={`relative px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200`}
                >
                  <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className={`relative px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200`}
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </div>
            </header>
            
            {/* Main Data Container */}
            
            <div className="flex-grow bg-white h-[670px] rounded-[12px] pt-2 pr-4 pl-4 pb-2 overflow-y: auto">
            <b style={{ display: "flex", gap: "20px", overflowX: "auto", marginBottom: "20px", marginTop: "20px"}}>ข้อมูลยา {data.find((row) => row.label === "ชื่อยา")?.value ?? "Drug Name Not Found"}</b>

              {/* Stock Section */}
              <div style={{ display: "flex", gap: "20px", overflowX: "auto", marginBottom: "20px" }}>
                {data
                  .filter((row) => row.label.startsWith("ล็อตที่"))
                  .map((row, index) => (
                    <div
                      key={index}
                      style={{
                        minWidth: "220px",
                        flex: "0 0 auto",
                        padding: "15px",
                        borderRadius: "8px",
                        backgroundColor: "#E9E9E9",
                        textAlign: "left",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>{row.label}</p>
                      <p>{row.value}</p>
                    </div>
                  ))}
              </div>

              {/* Main Data Section */}
              
              {data
                .filter((row) => !row.label.startsWith("ล็อตที่"))
                .slice(1)
                .map((row, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: index != 0 ? "none" : "1px solid #e0e0e0",
                      padding: "15px",
                      borderBottom: index === data.length - 1 ? "none" : "1px solid #e0e0e0",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
            
            </div>
          </>
        )}
      </div>
     
    </div>
  );
};

export default Detail;
