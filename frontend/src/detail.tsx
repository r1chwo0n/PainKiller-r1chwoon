import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface DataRow {
  label: string;
  value: string;
}

const Detail: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const handleDelete = () => {
    console.log("Deleted!");
    setIsModalOpen(false);
  };

  const fetchData = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/drugs/search?name=${encodeURIComponent(name)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const result = await response.json();

      const totalStockAmount = result.data[0]?.stock?.reduce(
        (sum: number, stockItem: { amount: number }) => sum + (stockItem.amount || 0),
        0
      );

      const formattedData: DataRow[] = [
        { label: "เกี่ยวกับยา (ชื่อยา)", value: result.data[0].name ?? "N/A" },
        { label: "รหัสยา", value: result.data[0].code ?? "N/A" },
        {
          label: "จำนวนคงเหลือ",
          value: totalStockAmount?.toString() ?? "N/A",
        },
        { label: "รายละเอียดยา", value: result?.data[0].detail ?? "N/A" },
        { label: "วิธีใช้", value: result?.data[0].usage ?? "N/A" },
        {
          label: "วันหมดอายุ",
          value: result?.data[0].stock[0]?.expired ?? "N/A",
        },
        { label: "ผลข้างเคียง", value: result?.data[0].side_effect ?? "N/A" },
        { label: "อาหารแสลง", value: result?.data[0].slang_food ?? "N/A" },
      ];

      const stockData: DataRow[] = result.data[0]?.stock?.map(
        (stockItem: { create_date: string; amount: number; type: string }, index: number) => ({
          label: `ล็อตที่ ${index + 1}`,
          value: `จำนวน: ${stockItem.amount}, ประเภท: ${stockItem.type}, สร้างเมื่อ: ${stockItem.create_date}`,
        })
      ) ?? [];

      setData([...formattedData, ...stockData]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const drugName = searchParams.get("name");
    if (drugName) {
      fetchData(drugName);
    } else {
      setError("No drug name provided in the URL.");
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-gray-100 p-4 flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <img
            src="/path-to-logo"
            alt="Logo"
            className="w-20 h-20 mb-4"
          />
          <h1 className="text-lg font-bold">มงคลคีรี</h1>
        </div>
        <nav className="w-full">
          <a
            href="#"
            className="block p-2 mb-4 text-pink-500 font-medium bg-pink-100 rounded text-center"
          >
            คลังยา
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-8" style={{ fontFamily: "Arial, sans-serif" }}>
        {/* Drug Name with Actions */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "15px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              backgroundColor: "#fff",
            }}
          >
            <span style={{ fontSize: "20px", fontWeight: "bold" }}>
              {searchParams.get("name")}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => console.log("Edit")}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#00CDFF",
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
                  padding: "8px 12px",
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

        {/* Data Display */}
        {!loading && !error && (
          <>
            {/* Main Data */}
            <div
              style={{
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                backgroundColor: "#fff",
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
                      borderBottom: index === data.length - 1 ? "none" : "1px solid #e0e0e0",
                    }}
                  >
                    <span style={{ fontWeight: 500 }}>{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
            </div>

            {/* Stock Display with Side Slide */}
            <div
              style={{
                display: "flex",
                overflowX: "auto",
                gap: "16px",
                marginBottom: "20px",
                paddingBottom: "10px",
                borderBottom: "1px solid #e0e0e0",
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
                      backgroundColor: "#fff",
                    }}
                  >
                    <p style={{ fontWeight: "bold" }}>{row.label}</p>
                    <p>{row.value}</p>
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
