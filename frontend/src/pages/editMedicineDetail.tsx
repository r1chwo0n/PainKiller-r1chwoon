import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";

const EditMedicineDetail: React.FC = () => {
  const [medicineData, setMedicineData] = useState({
    name: "",
    unit_type: "",
    drug_type: "drug",
    code: "",
    detail: "",
    usage: "",
    side_effect: "",
  });
  const { id } = useParams<{ id: string }>();
  const [showPopup, setShowPopup] = useState(false);

  // ฟังก์ชันดึงข้อมูลยา
  const fetchData = async (drugId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/drugs/${encodeURIComponent(drugId)}`
      );
      const data = await response.json();
      if (data.data) {
        setMedicineData({
          name: data.data.name || "",
          unit_type: data.data.unit_type || "",
          drug_type: data.data.drug_type || "drug",
          code: data.data.code || "",
          detail: data.data.detail || "",
          usage: data.data.usage || "",
          side_effect: data.data.side_effect || "",
        });
      }
    } catch (error) {
      console.error("Error fetching medicine data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id); // ดึงข้อมูลยาเมื่อเปิดหน้า
    } else {
      console.error("No drug ID provided in the URL.");
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setMedicineData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirm = async () => {
    setShowPopup(false);

    if (!id) {
      alert("ไม่พบรหัสยาสำหรับการอัปเดต");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/drugs/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drug_id: id,
          drugData: { ...medicineData },
        }),
      });

      if (response.ok) {
        alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว!");
        await fetchData(id); // ดึงข้อมูลใหม่หลังการอัปเดต
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        alert(
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล: " +
            (errorData.message || "ไม่ทราบสาเหตุ")
        );
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">แก้ไขรายละเอียดยา</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700">ชื่อยา</label>
                <input
                  type="text"
                  name="name"
                  value={medicineData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ชื่อยา"
                />
              </div>

              <div>
                <label className="block text-gray-700">ประเภท</label>
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="drug_type"
                      value="drug"
                      checked={medicineData.drug_type === "drug"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    ยา
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="drug_type"
                      value="herbal"
                      checked={medicineData.drug_type === "herb"}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    สมุนไพร
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-gray-700">หน่วย</label>
                <select
                  name="unit_type"
                  value={medicineData.unit_type}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                >
                  <option value="">เลือก</option>
                  <option value="เม็ด">เม็ด</option>
                  <option value="แผง">แผง</option>
                  <option value="ซอง">ซอง</option>
                  <option value="ขวด">ขวด</option>
                  <option value="หลอด">หลอด</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">รหัสยา</label>
                <input
                  type="text"
                  name="code"
                  value={medicineData.code}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="รหัสยา"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">รายละเอียดยา</label>
                <textarea
                  name="detail"
                  value={medicineData.detail}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="รายละเอียดยา"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">วิธีใช้</label>
                <textarea
                  name="usage"
                  value={medicineData.usage}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="วิธีใช้"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">ผลข้างเคียง</label>
                <textarea
                  name="side_effect"
                  value={medicineData.side_effect}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ผลข้างเคียง"
                  rows={4}
                />
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

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4">บันทึกข้อมูล</h2>
            <p className="mb-6">คุณต้องการบันทึกข้อมูลหรือไม่?</p>
            <div className="flex justify-between">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                onClick={handleCancel}
              >
                ยกเลิก
              </button>
              <button
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
                onClick={handleConfirm}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMedicineDetail;
