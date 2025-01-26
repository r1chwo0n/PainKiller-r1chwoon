import React, { useState } from "react";
import Sidebar from "../components/sidebar"

const EditMedicineDetail: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleSaveClick = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirm = () => {
    setShowPopup(false);
    alert("ข้อมูลถูกบันทึกเรียบร้อยแล้ว!"); // คุณสามารถเปลี่ยนให้เป็นการเรียก API หรือ Logic อื่น
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold">แก้ไขรายละเอียดยา</h1>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form>
            {/* Grid layout for the form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700">ชื่อยา</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ชื่อยา"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-gray-700">จำนวน</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="จำนวน"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="block text-gray-700">หน่วย</label>
                <select className="w-full border rounded p-2 bg-gray-200">
                  <option value="">เลือก</option>
                  <option value="type1">เม็ด</option>
                  <option value="type2">แผง</option>
                  <option value="type3">ซอง</option>
                  <option value="type4">ขวด</option>
                  <option value="type5">หลอด</option>
                </select>
              </div>

              {/* Herbal / Non-Herbal */}
              <div>
                <label className="block text-gray-700">ประเภท</label>
                <div className="flex items-center space-x-4">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="herbal"
                      className="mr-2"
                    />{" "}
                    ยา
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value="non-herbal"
                      className="mr-2"
                    />{" "}
                    สมุนไพร
                  </label>
                </div>
              </div>

              {/* Drug Code */}
              <div>
                <label className="block text-gray-700">รหัสยา</label>
                <input
                  type="text"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="รหัสยา"
                />
              </div>


              {/* Expiry Date */}
              <div>
                <label className="block text-gray-700">วันหมดอายุ</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 bg-gray-200"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-gray-700">รายละเอียดยา</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="รายละเอียดยา"
                  rows={4}
                ></textarea>
              </div>

              {/* Usage Instructions */}
              <div className="md:col-span-2">
                <label className="block text-gray-700">วิธีใช้</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="วิธีใช้"
                  rows={4}
                ></textarea>
              </div>

              {/* Side Effects */}
              <div className="md:col-span-2">
                <label className="block text-gray-700">ผลข้างเคียง</label>
                <textarea
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ผลข้างเคียง"
                  rows={4}
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
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
                onClick={handleCancel}
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
