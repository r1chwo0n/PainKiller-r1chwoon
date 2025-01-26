import React, { useEffect, useState } from "react";

const EditMedicineDetail: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [drugData, setDrugData] = useState({
    name: "",
    code: "",
    detail: "",
    usage: "",
    slang_food: "",
    side_effect: "",
    unit_price: 0,
  });
  const [stockData, setStockData] = useState({
    amount: 0,
    expired: "",
  });

  const drugId = "32e420b5-ddbd-49ef-ade7-2a6a9c0aba41"; // ตัวอย่าง drug_id

  // ดึงข้อมูลยาเมื่อโหลดหน้า
  useEffect(() => {
    const fetchDrugData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/drugs/${drugId}`);
        const result = await response.json();
        if (response.ok) {
          setDrugData(result.data);
          setStockData(result.data.stock);
        } else {
          console.error(result.msg);
        }
      } catch (error) {
        console.error("Error fetching drug data:", error);
      }
    };

    fetchDrugData();
  }, [drugId]);

  const handleSaveClick = async () => {
    setShowPopup(true);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3000/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_id: drugId,
          drugData,
          stockData,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error updating drug data:", error);
    }

    setShowPopup(false);
  };

  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-6">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-4" />
          <nav className="w-full">
            <ul className="text-pink-500 font-medium">
              <li className="mb-2">
                <a href="#" className="hover:text-pink-700">
                  คลังยา
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">แก้ไขรายละเอียดยา</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">ชื่อยา</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ชื่อยา"
                  value={drugData.name}
                  onChange={(e) =>
                    setDrugData({ ...drugData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">จำนวน</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="จำนวน"
                  value={stockData.amount}
                  onChange={(e) =>
                    setStockData({ ...stockData, amount: parseInt(e.target.value) })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">วันหมดอายุ</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 bg-gray-200"
                  value={stockData.expired}
                  onChange={(e) =>
                    setStockData({ ...stockData, expired: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700">ราคาต่อหน่วย</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ราคาต่อหน่วย"
                  value={drugData.unit_price}
                  onChange={(e) =>
                    setDrugData({
                      ...drugData,
                      unit_price: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              {/* Other fields */}
              <div className="md:col-span-2">
                <label className="block text-gray-700">รายละเอียด</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-200"
                  rows={4}
                  value={drugData.detail}
                  onChange={(e) =>
                    setDrugData({ ...drugData, detail: e.target.value })
                  }
                ></textarea>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                onClick={handleSaveClick}
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4">บันทึกข้อมูล</h2>
            <p className="mb-6">ต้องการบันทึกข้อมูลใช่หรือไม่?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMedicineDetail;