import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    slang_food: "",
  });

  const { id } = useParams<{ id: string }>();
  const [showPopup, setShowPopup] = useState(false);
  const { showSnackbar, Snackbar } = useSnackbar();
  const navigate = useNavigate();

  // ดึงข้อมูลยา
  const fetchData = async (drugId: string) => {
    try {
      const response = await fetch(
        `/api/drugs/${encodeURIComponent(drugId)}`
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
          slang_food: data.data.slang_food || "",
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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
      const response = await fetch(`/api/drugs/update`, {
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
      navigate(`/doctor/detail/${id}`); 
    } catch (error) {
      console.error("Error updating drug:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการบันทึกข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0] overflow-hidden">
      <Sidebar />
        <div className="flex-1 flex flex-col h-screen p-4">
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <h1 className="text-4xl text-[#444444] font-bold">แก้ไขรายละเอียดยา</h1>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-4 pr-4 pl-4 overflow-y-auto">
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 overflow-auto pl-1 pr-1">
              <div>
                <label className="text-[16px] text-[#444444]">ชื่อยา</label>
                <input
                  type="text"
                  name="name"
                  value={medicineData.name}
                  onChange={handleInputChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  placeholder="ชื่อยา"
                />
              </div>

              <div className="flex items-center space-x-20">
                <div className="relative w-24">
                  <label className="text-[16px] text-[#444444]">หน่วย</label>
                  <div className="relative">
                    <select
                      name="unit_type"
                      value={medicineData.unit_type}
                      onChange={handleInputChange}
                      className="w-[150px] h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    >
                      <option value="">เลือก</option>
                      <option value="กิโลกรัม">กิโลกรัม</option>
                      <option value="กระปุก">กระปุก</option>
                      <option value="ตลับ">ตลับ</option>
                    </select>
                  </div>
                </div>

                <div className="col-span-1">
                  <label htmlFor="type" className="text-[16px] text-[#444444]">
                    ประเภท
                  </label>
                  <div className="flex gap-2 items-center mt-1">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        name="drug_type"
                        value="drug"
                        checked={medicineData.drug_type === "drug"}
                        onChange={handleInputChange}
                      />
                      <label className="text-[16px] text-[#444444]">ยา</label>
                    </label>
                    <input
                      type="radio"
                      name="drug_type"
                      value="herb"
                      checked={medicineData.drug_type === "herb"}
                      onChange={handleInputChange}
                    />
                    <label className="text-[16px] text-[#444444]">
                      สมุนไพร
                    </label>
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
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  placeholder="รหัสยา"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">รายละเอียดยา</label>
                <textarea
                  name="detail"
                  value={medicineData.detail}
                  onChange={handleInputChange}
                  className="resize-none w-full h-[80px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
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
                  className="resize-none w-full h-[120px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
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
                  className="resize-none w-full h-[80px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  placeholder="ผลข้างเคียง"
                  rows={4}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700">อาหารที่ห้ามทานร่วมกับยา</label>
                <textarea
                  name="slang_food"
                  value={medicineData.slang_food}
                  onChange={handleInputChange}
                  className="resize-none w-full h-[80px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  placeholder="อาหารที่ห้ามทานร่วมกับยา"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-3 text-center">
              <button
                type="button"
                className="bg-[#FB6F92] text-white py-2 px-20 rounded-lg hover:bg-[#e05b7f] "
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
          <div className="bg-white rounded-[20px] p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              ยืนยันการบันทึกข้อมูล
            </h2>
            <p className="text-lg text-[#444444] mb-6">
              คุณต้องการบันทึกข้อมูลใช่หรือไม่?
            </p>
            <div className="flex justify-end space-x-6">
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-3 text-white rounded-[12px] bg-[#FB6F92] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
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
