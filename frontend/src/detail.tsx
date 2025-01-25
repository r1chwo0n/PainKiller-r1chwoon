import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

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

  const handleDelete = () => {
    console.log("Deleted!");
    setIsModalOpen(false);
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
        (sum: number, stockItem: { amount: number }) => sum + (stockItem.amount || 0),
        0
      );

      const formattedData: DataRow[] = [
        { label: "เกี่ยวกับยา (ชื่อยา)", value: result.data.name ?? "N/A" },
        { label: "รหัสยา", value: result.data.code ?? "N/A" },
        {
          label: "จำนวนคงเหลือ",
          value: totalStockAmount?.toString() ?? "N/A",
        },
        { label: "รายละเอียดยา", value: result?.data.detail ?? "N/A" },
        { label: "วิธีใช้", value: result?.data.usage ?? "N/A" },
        {
          label: "วันหมดอายุ",
          value: result?.data.stock?.expired ?? "N/A",
        },
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
      <div className="flex-grow p-8" style={{ fontFamily: "Arial, sans-serif" }}>
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
                
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                {data.find((row) => row.label === "เกี่ยวกับยา (ชื่อยา)")?.value ?? "Drug Name Not Found"}
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  // marginTop: "10px",
                }}
              >
                <button
                  onClick={handleEdit}
                  style={{
                    padding: "10px 15px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => setIsModalOpen(true)}
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

            {/* Stock Display */}
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "16px",
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
                      padding: "15px",
                      backgroundColor: "#d3d3d3",
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
                        index === data.length - 1 ? "none" : "1px solid #e0e0e0",
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
