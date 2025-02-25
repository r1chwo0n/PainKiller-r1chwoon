import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
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

  // const handleEdit = () => {
  //   console.log("Edit button clicked!");
  // };

  const fetchData = async (drugId: string) => {
    setLoading(true);
    setError(null);
    try {
      // const response = await fetch(
      //   `api/drugs/${encodeURIComponent(drugId)}`
      // );
      // if (!response.ok) {
      //   throw new Error("Failed to fetch data from API");
      // }
      // const result = await response.json();
      const response = await axios.get(
        `/api/drugs/${encodeURIComponent(drugId)}` // ใช้ /api ตาม proxy ที่ตั้งไว้ใน Vite config
      );
      const result = await response.data;
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
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Modal for Delete Confirmation */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                textAlign: "center",
              }}
            >
              <h2>ยืนยันการลบข้อมูล</h2>
              <p>ต้องการลบข้อมูลใช่หรือไม่</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#cccccc",
                    color: "#000",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#FF0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
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
              }}
            >
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
                }}
              >
                {/* Edit Button */}
                <button
                  onClick={() => navigate(`/edit-drug/${id}`)}
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
                  }}
                >
                  <FontAwesomeIcon icon={faEdit} style={{ fontSize: "16px" }} />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setIsModalOpen(true)}
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
                  }}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    style={{ fontSize: "16px" }}
                  />
                </button>
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
              }}
            >
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
                    }}
                  >
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
              }}
            >
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
                    }}
                  >
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
              }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
