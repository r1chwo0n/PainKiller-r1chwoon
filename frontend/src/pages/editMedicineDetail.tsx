import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/sidebar";
import useSnackbar from "../components/useSnackber";

const EditMedicineDetail: React.FC = () => {
  const [medicineData, setMedicineData] = useState({
    name: "",
    unit_type: "",
    drug_type: "drug",
    code: "",
    detail: "",
    usage: "",
    side_effect: "",
    food_warning: "",
  });
  
  const { id } = useParams<{ id: string }>();
  const [showPopup, setShowPopup] = useState(false);
  const { showSnackbar, Snackbar } = useSnackbar();

  // ดึงข้อมูลยา
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
          food_warning: data.data.food_warning || "",
        });
      }
    } catch (error) {
      console.error("Error fetching medicine data:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);
  

  // อัปเดตค่าฟอร์ม
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMedicineData((prev) => ({ ...prev, [name]: value }));
  };

  // แสดง popup ยืนยันบันทึก
  const handleSaveClick = () => {
    console.log("Clicked Save"); // ตรวจสอบว่า function ถูกเรียก
    setShowPopup(true);
  };

  // ปิด popup
  const handleCancel = () => {
    setShowPopup(false);
  };

  // บันทึกข้อมูลยา
  const handleConfirm = async () => {
    if (!id) return;
  
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
        await fetchData(id);
        showSnackbar({
          message: "บันทึกข้อมูลยาสำเร็จ!",
          severity: "success",
        });
        setShowPopup(false);
      }
  
    } catch (error) {
      console.error("Error updating drug:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการบันทึกข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };
  

  return (
    <div className="flex h-screen overflow-hidden bg-gray-200">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden p-6">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">แก้ไขรายละเอียดยา</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 flex-1 overflow-auto">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-auto">
              <div>
                <label className="block text-gray-700">ชื่อยา</label>
                <input
                  type="text"
                  name="name"
                  value={medicineData.name}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-100"
                  placeholder="ชื่อยา"
                />
              </div>

              <div className="flex items-center space-x-20">
                <div className="relative w-24">
                  <label className="block text-gray-700 text-sm">หน่วย</label>
                  <div className="relative">
                    <select
                      name="unit_type"
                      value={medicineData.unit_type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md p-1 bg-white appearance-none text-sm"
                    >
                      <option value="">เลือก</option>
                      <option value="กิโลกรัม">กิโลกรัม</option>
                      <option value="กระปุก">กระปุก</option>
                      <option value="ขวด">ขวด</option>
                      <option value="ตลับ">ตลับ</option>
                      <option value="ซอง">ซอง</option>
                    </select>
                    <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                      ▼
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex flex-col items-center">
                    <label className="text-gray-700 text-sm mb-1">ยา</label>
                    <input
                      type="radio"
                      name="drug_type"
                      value="drug"
                      checked={medicineData.drug_type === "drug"}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex flex-col items-center">
                    <label className="text-gray-700 text-sm mb-1">
                      สมุนไพร
                    </label>
                    <input
                      type="radio"
                      name="drug_type"
                      value="herb"
                      checked={medicineData.drug_type === "herb"}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-700">รหัสยา</label>
                <input
                  type="text"
                  name="code"
                  value={medicineData.code}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-100 overflow-auto"
                  placeholder="รหัสยา"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">รายละเอียดยา</label>
                <textarea
                  name="detail"
                  value={medicineData.detail}
                  onChange={handleInputChange}
                  className="w-full border rounded p-2 bg-gray-100 overflow-auto"
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
                  className="w-full border rounded p-2 bg-gray-100 overflow-auto"
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
                  className="w-full border rounded p-2 bg-gray-100 overflow-auto"
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
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 shadow-xl max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            ยืนยันการบันทึกข้อมูล
          </h2>
            <p className="text-lg text-[#444444] mb-6">คุณต้องการบันทึกข้อมูลใช่หรือไม่?</p>
            <div className="flex justify-end space-x-6">
              <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
              >
                ยกเลิก
              </button>
              <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-pink-500 text-white rounded-[12px] hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
       {Snackbar}
    </div>
  );
};

export default EditMedicineDetail;