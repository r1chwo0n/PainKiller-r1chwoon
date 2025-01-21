// import React, { useEffect, useState } from "react";

// // Define interface for the drug data
// interface DataRow {
//   label: string;
//   value: string;
// }

// const Detail: React.FC = () => {
//   const [data, setData] = useState<DataRow[]>([]); // State to store data
//   const [loading, setLoading] = useState<boolean>(false); // Loading state
//   const [error, setError] = useState<string | null>(null); // Error state
//   const [searchTerm, setSearchTerm] = useState<string>(""); // Search term state

//   // Fetch data from API
//   const fetchData = async (name: string) => {
//     setLoading(true); // Start loading
//     setError(null); // Reset error state
//     try {
//       const response = await fetch(
//         `http://localhost:3000/drugs/search?name=${encodeURIComponent(name)}`
//       ); // Call the search endpoint with the name parameter
//       if (!response.ok) {
//         throw new Error("Failed to fetch data from API");
//       }
//       const result = await response.json();

//       // Format the data into the desired structure
//       const formattedData: DataRow[] = result.data.map((drug: any) => ({
//         label: drug.name || "N/A",
//         value: drug.detail || "N/A",
//       }));

//       setData(formattedData); // Update state with fetched data
//     } catch (err: any) {
//       setError(err.message); // Set error message
//     } finally {
//       setLoading(false); // Stop loading
//     }
//   };

//   // Handle search form submission
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent form reload
//     if (searchTerm.trim() === "") {
//       setError("Please enter a search term.");
//       return;
//     }
//     console.log("Search Term: ", searchTerm); 
//     fetchData(searchTerm); // Fetch data based on search term
//   };
//   return (
//     <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
//       <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
//         <h1>ค้นหาชื่อยา</h1>
//         {/* Search Form */}
//         <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="กรอกชื่อยา..."
//             style={{
//               padding: "10px",
//               width: "80%",
//               border: "1px solid #e0e0e0",
//               borderRadius: "4px",
//               marginRight: "10px",
//             }}
//           />
//           <button
//             type="submit"
//             style={{
//               padding: "10px 15px",
//               backgroundColor: "#4caf50",
//               color: "#fff",
//               border: "none",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             ค้นหา
//           </button>
//         </form>

//         {loading && <div>กำลังโหลดข้อมูล...</div>}
//         {error && <div style={{ color: "red" }}>Error: {error}</div>}

//         {/* Data Display */}
//         {!loading && !error && data.length > 0 && (
//           <div
//             style={{
//               border: "1px solid #e0e0e0",
//               borderRadius: "8px",
//               overflow: "hidden",
//               backgroundColor: "#fff",
//             }}
//           >
//             {data.map((row, index) => (
//               <div
//                 key={index}
//                 style={{
//                   display: "flex",
//                   justifyContent: "space-between",
//                   padding: "15px",
//                   borderBottom:
//                     index === data.length - 1
//                       ? "none"
//                       : "1px solid #e0e0e0",
//                 }}
//               >
//                 <span style={{ fontWeight: 500 }}>{row.label}</span>
//                 <span>{row.value}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Detail;














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
  
      console.log("API Response:", result); // Debugging API Response
  
      const formattedData: DataRow[] = [
        { label: "เกี่ยวกับยา (ชื่อยา)", value: result?.name ?? "N/A" },
        { label: "รหัสยา", value: result?.code ?? "N/A" },
        { label: "จำนวนคงเหลือ", value: result?.stock?.amount?.toString() ?? "N/A" },
        { label: "รายละเอียดยา", value: result?.detail ?? "N/A" },
        { label: "วิธีใช้", value: result?.usage ?? "N/A" },
        { label: "วันหมดอายุ", value: result?.stock?.expired ?? "N/A" },
        { label: "ผลข้างเคียง", value: result?.side_effect ?? "N/A" },
        { label: "อาหารแสลง", value: result?.slang_food ?? "N/A" },
      ];      

      // const formattedData: DataRow[] = [
      //   { label: "เกี่ยวกับยา (ชื่อยา)", value: result.name || "N/A"},
      //   { label: "รหัสยา", value: result?.code ?? "N/A" },
      //   { label: "จำนวนคงเหลือ", value: result?.stock?.amount?.toString() ?? "N/A" },
      //   { label: "รายละเอียดยา", value: result?.detail ?? "N/A" },
      //   { label: "วิธีใช้", value: result?.usage ?? "N/A" },
      //   { label: "วันหมดอายุ", value: result?.stock?.expired ?? "N/A" },
      //   { label: "ผลข้างเคียง", value: result?.side_effect ?? "N/A" },
      //   { label: "อาหารแสลง", value: result?.slang_food ?? "N/A" },
      // ];      
  
  
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
            className="block p-2 mb-4 text-pink-500 font-medium bg-pink-100 rounded text-center"
          >
            คลังยา
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-grow p-8" style={{ fontFamily: "Arial, sans-serif" }}>
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
              }}
            >
              ค้นหา
            </button>
          </form>

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
              }}
            >
              {data.map((row, index) => (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Detail;


