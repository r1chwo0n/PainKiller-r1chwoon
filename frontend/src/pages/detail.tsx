import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import useSnackbar from "../components/useSnackber";

interface DataRow {
  label: string;
  value: React.ReactNode;
  stockId?: string;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the `id` parameter from the URL
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState<boolean>(false);
  const [stockId, setStockId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showSnackbar, Snackbar } = useSnackbar();

  // 🌟 ใช้ state จัดการการเลื่อน stock
  const [startIndex, setStartIndex] = useState(0);
  const visibleStocks = 4; // แสดงทีละ 4 อัน

  const handleDelete = async () => {
    if (!id) return;

    try {
      const response = await fetch(`/api/drugs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSnackbar({
          message: "ลบข้อมูลยาสำเร็จ!",
          severity: "success",
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
      navigate("/doctor");
    } catch (error) {
      console.error("Error deleting drug:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการลบข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const fetchData = async (drugId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/drugs/${encodeURIComponent(drugId)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const result = await response.json();

      const totalStockAmount = result.data?.stock?.reduce(
        (sum: number, stockItem: { amount: number }) =>
          sum + (stockItem.amount || 0),
        0
      );

      // console.log("data:", result);
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
        {
          label: "อาหารที่ห้ามทานร่วมกับยา",
          value: result?.data.slang_food ?? "N/A",
        },
      ];

      const stockData: DataRow[] = result.data?.stock?.map(
        (
          stockItem: {
            stock_id: string;
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
          stockId: stockItem.stock_id,
        })
      );

      setData([...formattedData, ...stockData]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStock = async (stockId: string | null) => {
    try {
      const response = await fetch(`/api/stocks/${stockId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSnackbar({
          message: "ลบข้อมูลยาสำเร็จ!",
          severity: "success",
        });
      }
      setIsStockModalOpen(false);

      setData((prevData) => prevData.filter((row) => row.stockId !== stockId));
    } catch (error) {
      console.error("Error deleting stock:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการลบข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id); // Fetch data using the `id` from the URL
    } else {
      setError("No drug ID provided in the URL.");
    }
  }, [id]);

  // ⏩ ปุ่มเลื่อน stock
  const handleNext = () => {
    if (
      startIndex + visibleStocks <
      data.filter((row) => row.label.startsWith("ล็อตที่")).length
    ) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0] overflow-hidden">
      <Sidebar />
      <div className="flex-1 p-4" style={{ fontFamily: "Arial, sans-serif" }}>
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

        {/* Delete Stock Confirmation Popup */}
        {isStockModalOpen && (
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
                  onClick={() => setIsStockModalOpen(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDeleteStock(stockId)}
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
              <span className="mt-2 text-4xl text-[#444444] font-bold">
                {data.find((row) => row.label === "ชื่อยา")?.value ??
                  "Drug Name Not Found"}
              </span>

              {/* Buttons Container */}
              <div className="flex mt-2 items-center space-x-4">
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/doctor/edit-drug/${id}`)}
                  className="px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200"
                >
                  <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-2 py-2 bg-gray-100 text-[#8E8E8E] rounded-md hover:bg-gray-200"
                >
                  <svg
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </header>

            <div className="flex-grow bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-2">
              <b
                style={{
                  display: "flex",
                  gap: "20px",
                  overflowX: "auto",
                  marginBottom: "20px",
                  marginTop: "20px",
                }}
              >
                ข้อมูลยา{" "}
                {data.find((row) => row.label === "ชื่อยา")?.value ??
                  "Drug Name Not Found"}
              </b>

              {/* Stock Section */}
<div className="relative w-full py-4">
  {data.filter((row) => row.label.startsWith("ล็อตที่")).length > 0 && (
    <>
      <button
        onClick={handlePrev}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 px-3 py-2 rounded-full shadow-md hover:bg-gray-300 disabled:opacity-50"
        disabled={startIndex === 0}
      >
        ◀
      </button>
      <div className="flex gap-x-4 justify-center">
        {data
          .filter((row) => row.label.startsWith("ล็อตที่"))
          .slice(startIndex, startIndex + visibleStocks)
          .map((row, index) => (
            <div
              key={index}
              className="relative bg-[#E9E9E9] p-4 rounded-lg text-left shadow-md mx-2 min-w-[250px]"
            >
              <p className="font-bold">{row.label}</p>
              <p>{row.value}</p>

              {/* ปุ่มลบ Stock */}
              {row.stockId && (
                <button
                  onClick={() => {
                    setStockId(row.stockId ?? null);
                    setIsStockModalOpen(true);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-transform transform hover:scale-110"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
      </div>
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 px-3 py-2 rounded-full shadow-md hover:bg-gray-300 disabled:opacity-50"
        disabled={
          startIndex + visibleStocks >=
          data.filter((row) => row.label.startsWith("ล็อตที่")).length
        }
      >
        ▶
      </button>
    </>
  )}
</div>

              {/* Main Data Section */}

              <div className="max-h-80 overflow-y-auto">
                {data
                  .filter((row) => !row.label.startsWith("ล็อตที่"))
                  .slice(1)
                  .map((row, index) => (
                    <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: index !== 0 ? "none" : "1px solid #e0e0e0",
                      padding: "13px",
                      borderBottom: index === data.length - 1 ? "none" : "1px solid #e0e0e0",
                    }}
                  >
                    <span style={{ flex: 1, textAlign: "left", fontWeight: 500 }}>
                      {row.label}
                    </span>
                    <span style={{ flex: 1, textAlign: "right" }}>{row.value}</span>
                  </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      {Snackbar}
    </div>
  );
};

export default Detail;