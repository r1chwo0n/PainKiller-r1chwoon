import React, { useState } from "react";

// Define interface for drug data
interface DataRow {
  label: string;
  value: string;
}

const Detail: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]); // State to store fetched data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleDelete = () => {
    console.log("Deleted!");
    setIsModalOpen(false);
  };
  // Fetch data from API
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

      //   console.log("API Response:", result); // Debugging API Response
      console.log("API Response:", result);
      console.log("API Response data:", result.data[0]);

      const formattedData: DataRow[] = [
        { label: "เกี่ยวกับยา (ชื่อยา)", value: result.data[0].name ?? "N/A" },
        { label: "รหัสยา", value: result.data[0].code ?? "N/A" },
        {
          label: "จำนวนคงเหลือ",
          value: result.data[0].stock[0]?.amount?.toString() ?? "N/A",
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

      setData(formattedData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form reload
    if (searchTerm.trim() === "") {
      setError("Please enter a search term.");
      return;
    }
    fetchData(searchTerm); // Fetch data based on search term
  };

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
      <div
        className="flex-grow p-8"
        style={{ fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <h1>ค้นหาชื่อยา</h1>
          {/* Search Form */}
          <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="กรอกชื่อยา..."
              style={{
                padding: "10px",
                width: "80%",
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
                marginRight: "10px",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 15px",
                backgroundColor: "#4caf50",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}>
              ค้นหา
            </button>
            {/* Edit Button Route this to Edit page */}
            <button
              type="submit"
              onClick={() => {
                console.log("Edit!");
              }} // Route this to Edit page
              style={{
                padding: "10px 15px",
                backgroundColor: "#00CDFF",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
                // display: "flex",
                alignItems: "center",
                gap: "5px",
              }}>
              แก้ไข
              <i className="fas fa-edit"></i>
            </button>
            {/* <button
              type="submit"
              onClick={() => {
                const confirmDelete = window.confirm(
                  "คุณต้องการลบข้อมูลนี้หรือไม่?"
                );
                if (confirmDelete) {
                  // Perform delete action here
                  console.log("Deleted!");
                } else {
                  console.log("Cancelled!");
                }
              }}
              style={{
                padding: "10px 15px",
                backgroundColor: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}>
              ลบ
              <i className="fas fa-trash-alt" style={{ marginLeft: "5px" }}></i>
            </button> */}
            <button
              type="submit"
              onClick={() => setIsModalOpen(true)}
              style={{
                padding: "10px 15px",
                backgroundColor: "#FF0000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "10px",
              }}>
              ลบ
              <i className="fas fa-trash-alt" style={{ marginLeft: "5px" }}></i>
            </button>
          </form>

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
              }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  textAlign: "center",
                }}>
                <h2>ยืนยันการลบข้อมูล</h2>
                <hr style={{ margin: "10px 0" }} />
                <p>ต้องการลบข้อมูลใช่หรือไม่</p>
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    justifyContent: "flex-end", // Align buttons to the right
                    gap: "10px", // Space between buttons
                  }}>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{
                      padding: "10px 15px",
                      backgroundColor: "#cccccc",
                      color: "#000",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}>
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
                    }}>
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading && <div>กำลังโหลดข้อมูล...</div>}
          {error && <div style={{ color: "red" }}>Error: {error}</div>}

          {/* Data Display */}
          {!loading && !error && data.length > 0 && (
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
                  }}>
                  <span style={{ fontWeight: 500 }}>{row.label}</span>
                  <span>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
