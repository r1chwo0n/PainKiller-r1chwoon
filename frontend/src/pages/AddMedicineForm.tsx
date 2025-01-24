import React from "react";

const AddMedicineForm: React.FC = () => {
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
          <h1 className="text-2xl font-bold">เพิ่มข้อมูลยา</h1>
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

              {/* Price per Unit */}
              <div>
                <label className="block text-gray-700">ราคาต่อหน่วย</label>
                <input
                  type="number"
                  className="w-full border rounded p-2 bg-gray-200"
                  placeholder="ราคาต่อหน่วย"
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
