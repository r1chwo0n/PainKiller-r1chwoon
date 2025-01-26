import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

// Register modules
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import useSnackbar from "../components/useSnackber";

interface DataRow {
  label: string;
  value: React.ReactNode;
}

const Detail: React.FC = () => {
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [drugs, setDrugs] = useState<DataRow[]>([]);
  const { id } = useParams<{ id: string }>(); // Extract the `id` parameter from the URL
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteDrugId, setDeleteDrugId] = useState<string | null>(null);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState<boolean>(false);

  const { showSnackbar, Snackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!deleteDrugId) return;

    try {
      await axios.delete(`http://localhost:3000/drugs/${deleteDrugId}`);
      setDrugs((prevDrugs) => prevDrugs.filter((drug) => id !== deleteDrugId));
      setIsModalOpen(false);
      setShowDeletePopup(false);
      setDeleteDrugId(null);
      setIsSuccessPopupOpen(true);

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

  const handleEdit = () => {
    console.log("Edit button clicked!");
    // Add your edit functionality here (redirect to an edit form, for example)
  };

  const fetchData = async (drugId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/drugs/${encodeURIComponent(drugId)}`
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

      console.log("data:", result);
      const formattedData: DataRow[] = [
        { label: "เกี่ยวกับยา (ชื่อยา)", value: result.data.name ?? "N/A" },
        { label: "รหัสยา", value: result.data.code ?? "N/A" },
        {
          label: "จำนวนคงเหลือ",
          value: totalStockAmount?.toString() ?? "N/A",
        },
        { label: "รายละเอียดยา", value: result?.data.detail ?? "N/A" },
        { label: "วิธีใช้", value: result?.data.usage ?? "N/A" },
        { label: "ผลข้างเคียง", value: result?.data.side_effect ?? "N/A" },
        { label: "อาหารแสลง", value: result?.data.slang_food ?? "N/A" },
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
    <div className="flex h-screen">
      <Sidebar />
      <div
        className="flex-grow p-8"
        style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Deleted Successfully Popup */}
        {isSuccessPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-[20px] p-8 shadow-xl max-w-md w-full flex flex-col items-center">
              {/* Big Green Tick Icon */}
              <FontAwesomeIcon
                icon={faCheckCircle}
                style={{
                  fontSize: "80px",
                  color: "#4CAF50",
                  marginBottom: "20px",
                }}
              />

              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                การลบสำเร็จ!
              </h2>

              <button
                onClick={() =>
                  (window.location.href = "http://localhost:5173/")
                }
                className="px-6 py-3 bg-[#4CAF50] text-white rounded-[12px] hover:bg-[#45a049] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105">
                กลับไปยังหน้าแรก
              </button>
            </div>
          </div>
        )}

        {/* Modal for Delete Confirmation */}
        {isModalOpen && (
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
                    // window.location.reload();
                    navigate(0);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105">
                  ยกเลิก
                </button>
                <button
                  onClick={() => handleDelete()}
                  className="px-6 py-3 bg-[#E57373] text-white rounded-[12px] hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105">
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
            {/* Display Drug Name and Buttons */}
            <div
              style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
              {/* Drug Name */}
              <span style={{ fontSize: "25px", fontWeight: "bold" }}>
                {data.find((row) => row.label === "เกี่ยวกับยา (ชื่อยา)")
                  ?.value ?? "Drug Name Not Found"}
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  // marginTop: "10px",
                }}>
                {/* Edit Button */}
                <button
                  onClick={() => alert("Edit button clicked!")}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#E9E9E9",
                    color: "#696969",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center", // Align icon vertically
                    justifyContent: "center", // Align icon horizontally
                  }}>
                  <FontAwesomeIcon icon={faEdit} style={{ fontSize: "16px" }} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    setDeleteDrugId(id);
                    setIsModalOpen(true);
                  }}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#E9E9E9", // Use a red color for delete button
                    color: "#696969",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center", // Align icon vertically
                    justifyContent: "center", // Align icon horizontally
                  }}>
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ fontSize: "16px" }}
                  />
                </button>
                {Snackbar}
              </div>
            </div>

            {/* Stock Display */}
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "30px",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#ffff",
              }}>
              {data
                .filter((row) => row.label.startsWith("ล็อตที่"))
                .map((row, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: "200px",
                      flex: "0 0 auto",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      padding: "20px",
                      backgroundColor: "#E9E9E9",
                    }}>
                    <p style={{ fontWeight: "bold" }}>{row.label}</p>
                    <p>{row.value}</p>
                  </div>
                ))}
            </div>

            {/* Main Data */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#ffff",
                marginBottom: "20px",
              }}>
              {data
                .filter((row) => !row.label.startsWith("ล็อตที่"))
                .map((row, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "15px",
                      borderBottom:
                        index === data.length - 1
                          ? "none"
                          : "1px solid #e0e0e0",
                    }}>
                    <span style={{ fontWeight: 500 }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
            </div>
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#ffff",
                marginBottom: "10px",
              }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
