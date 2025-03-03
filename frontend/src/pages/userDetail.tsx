import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";

interface DataRow {
  label: string;
  value: React.ReactNode;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Extract the `id` parameter from the URL
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [infoModalContent, setInfoModalContent] = useState<React.ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchData = async (drugId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/drugs/${encodeURIComponent(drugId)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch data from API");
      }
      const result = await response.json();

      console.log("data:", result);
      const formattedData: DataRow[] = [
        { label: "ชื่อยา", value: result.data.name ?? "N/A" },
        { label: "รหัสยา", value: result.data.code ?? "N/A" },
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
    <div className="flex h-screen bg-[#f0f0f0] overflow-hidden">
      <Sidebar />

      <div className="flex-1 p-4" style={{ fontFamily: "Arial, sans-serif" }}>
        {loading && <div>กำลังโหลดข้อมูล...</div>}
        {error && <div style={{ color: "red" }}>Error: {error}</div>}

        {!loading && !error && (
          <>
            <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6 flex items-center justify-between">
              {/* Drug Name */}
              <span className="mb-2 text-4xl text-[#444444] font-bold">
                {data.find((row) => row.label === "ชื่อยา")?.value ??
                  "Drug Name Not Found"}
              </span>
            </header>

            {/* Main Data Container */}
            <div className="flex-1 bg-white h-[670px] rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-auto">
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
                    <span style={{ flex: 1 , textAlign: "right",overflow: "hidden",textOverflow: "ellipsis",cursor: "pointer",}}
                    onClick={() => {
                      setInfoModalContent(row.value); // เก็บข้อมูลใน state
                      setIsInfoModalOpen(true); // เปิด modal
                    }}
                    >{row.value}</span>
                  </div>
                  ))}
              </div>
              {/* Modal for displaying long information */}
              {isInfoModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center ">
                <div className="bg-white rounded-[20px] p-8 shadow-xl relative">            
                    <span className="close" onClick={() => setIsInfoModalOpen(false)}
                      style={{
                        cursor: "pointer",
                        fontSize: "22px", 
                        fontWeight: "bold",
                        color: "#333", 
                        position: "absolute",
                        top: "10px", 
                        right: "10px", 
                        backgroundColor: "#f0f0f0", 
                        borderRadius: "100%", 
                        padding: "8px", 
                        width: "40px", 
                        height: "40px", 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                      }}>
                      &times;
                    </span>
                    <div
                      className="modal-content"
                      style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                      dangerouslySetInnerHTML={{ __html: String(infoModalContent) }}
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Detail;
//woon
