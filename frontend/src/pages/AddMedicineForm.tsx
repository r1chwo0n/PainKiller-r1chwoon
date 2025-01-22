import React from "react";

const AddMedicineForm: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 min-h-screen">
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
      <div className="w-3/4 container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6 min-h-screen">
          <h1 className="text-2xl font-bold mb-4">เพิ่มข้อมูลยา</h1>
          <form>
            <div className="grid grid-cols-2 gap-4">
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

              {/* Type */}
              <div>
                <label className="block text-gray-700">ยา</label>
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
                <label className="block text-gray-700"></label>
                <div className="flex items-center space-x-4">
                  <label>
                    <input type="radio" name="type" value="herbal" /> ยา
                  </label>
                  <label>
                    <input type="radio" name="type" value="non-herbal" />{" "}
                    สมุนไพร
                  </label>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mt-4">
              <label className="block text-gray-700">ราคา</label>
              <input
                type="number"
                className="w-full border rounded p-2 bg-gray-200"
                placeholder="ราคา"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700">วันที่ผลิต</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 bg-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700">วันหมดอายุ</label>
                <input
                  type="date"
                  className="w-full border rounded p-2 bg-gray-200"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="mt-4">
              <label className="block text-gray-700">รายละเอียด</label>
              <textarea
                className="w-full border rounded p-2 bg-gray-200"
                placeholder="รายละเอียด"
                rows={4}
              ></textarea>
            </div>

            {/* Usage Instructions */}
            <div className="mt-4">
              <label className="block text-gray-700">วิธีใช้</label>
              <textarea
                className="w-full border rounded p-2 bg-gray-200"
                placeholder="วิธีใช้"
                rows={4}
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicineForm;
