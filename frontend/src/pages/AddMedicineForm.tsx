import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

const AddMedicineForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    type: "",
    code: "",
    price: "",
    expiryDate: "",
    description: "",
    usage: "",
    side_effect: "",
    slang_food: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.name ||
      !formData.quantity ||
      !formData.unit ||
      !formData.type ||
      !formData.code ||
      !formData.price ||
      !formData.expiryDate ||
      !formData.description ||
      !formData.usage ||
      !formData.side_effect||
      !formData.slang_food 
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    try {
      // Construct the payload as required by the backend
      const payload = {
        name: formData.name,
        code: formData.code,
        drug_type: formData.type === "herbal" ? "herbal" : "drug",
        unit_type: formData.unit,
        detail: formData.description,
        usage: formData.usage,
        side_effect: formData.side_effect,
        slang_food: formData.slang_food,
        stock: [
          {
            amount: parseInt(formData.quantity, 10),
            unit_price: parseFloat(formData.price),
            expired: formData.expiryDate,
          },
        ],
      };

      // Log payload for debugging
      console.log("Payload being sent:", payload);

      // Send the POST request to the backend
      const response = await axios.post("http://localhost:3000/drugs", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccessMessage("บันทึกข้อมูลสำเร็จ!");
        setTimeout(() => setSuccessMessage(null), 3000);

        // Reset form data
        setFormData({
          name: "",
          quantity: "",
          unit: "",
          type: "",
          code: "",
          price: "",
          expiryDate: "",
          description: "",
          usage: "",
          side_effect: "",
          slang_food: "",
        });
      }
    } catch (error: any) {
      console.error("Error adding medicine:", error.response?.data || error.message);
      setErrorMessage(
        error.response?.data?.message ||
          "เกิดข้อผิดพลาดในการบันทึกข้อมูล โปรดลองอีกครั้ง"
      );

      // Log validation details from the backend if available
      if (error.response?.data?.details) {
        console.error("Validation details:", error.response.data.details);
      }

      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <main className="flex-1 p-4">
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-[#444444] font-bold">เพิ่มข้อมูลยา</h1>
          </div>
        </header>

        <div className="bg-white shadow-md rounded-lg p-6 max-h-[90vh] overflow-y-auto">
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label htmlFor="name">ชื่อยา</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Quantity */}
              <div>
                <label htmlFor="quantity">จำนวน</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Unit */}
              <div>
                <label htmlFor="unit">หน่วย</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  required
                >
                  <option value="">เลือก</option>
                  <option value="เม็ด">เม็ด</option>
                  <option value="แผง">แผง</option>
                  <option value="ซอง">ซอง</option>
                  <option value="ขวด">ขวด</option>
                  <option value="หลอด">หลอด</option>
                </select>
              </div>
              {/* Type */}
              <div>
                <label htmlFor="type">ประเภท</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="herbal">สมุนไพร</option>
                  <option value="drug">ยา</option>
                </select>
              </div>
              {/* Code */}
              <div>
                <label htmlFor="code">รหัสยา</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Price */}
              <div>
                <label htmlFor="price">ราคา</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Expiry Date */}
              <div>
                <label htmlFor="expiryDate">วันหมดอายุ</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full h-[45px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Description */}
              <div>
                <label htmlFor="description">รายละเอียด</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full h-[90px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Usage */}
              <div>
                <label htmlFor="usage">วิธีการใช้</label>
                <textarea
                  id="usage"
                  name="usage"
                  value={formData.usage}
                  onChange={handleChange}
                  className="w-full h-[90px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Side Effects */}
              <div>
                <label htmlFor="side_effect">ผลข้างเคียง</label>
                <textarea
                  id="side_effect"
                  name="side_effect"
                  value={formData.side_effect}
                  onChange={handleChange}
                  className="w-full h-[90px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Slang Food */}
              <div>
                <label htmlFor="slang_food">Slangfood</label>
                <textarea
                  id="slang_food"
                  name="slang_food"
                  value={formData.slang_food}
                  onChange={handleChange}
                  className="w-full h-[90px] py-2 px-4 rounded-[12px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
            </div>

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
      </main>
    </div>
  );
};

export default AddMedicineForm;
