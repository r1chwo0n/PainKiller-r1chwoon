import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

const AddMedicineForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    unit: "",
    type: "",
    code: "",
    unit_price: "",
    expired: "",
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

    // Check for missing fields
    if (
      !formData.name ||
      !formData.amount ||
      !formData.unit ||
      !formData.type ||
      !formData.code ||
      !formData.unit_price ||
      !formData.expired ||
      !formData.description ||
      !formData.usage ||
      !formData.side_effect ||
      !formData.slang_food
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Format date to yyyy-mm-dd
    const formatDate = (date: string): string => {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format");
      }
      return parsedDate.toISOString().split("T")[0];
    };

    try {
      // Construct payload
      const drugPayload = {
        name: formData.name,
        code: formData.code,
        drug_type: formData.type === "herb" ? "herb" : "drug",
        unit_type: formData.unit,
        detail: formData.description,
        usage: formData.usage,
        side_effect: formData.side_effect,
        slang_food: formData.slang_food,
        stock: {
          amount: parseInt(formData.amount, 10) || 0,
          unit_price: parseFloat(formData.unit_price) || 0.0,
          expired: formatDate(formData.expired),
        },
      };

      // Send payload to the API
      const response = await axios.post(
        "http://localhost:3000/drugs",
        drugPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("บันทึกข้อมูลสำเร็จ!");
        setTimeout(() => setSuccessMessage(null), 3000);

        // Reset form
        setFormData({
          name: "",
          amount: "",
          unit: "",
          type: "",
          code: "",
          unit_price: "",
          expired: "",
          description: "",
          usage: "",
          side_effect: "",
          slang_food: "",
        });
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error adding drug:", error);
      setErrorMessage(
        error.response?.data?.message || "เกิดข้อผิดพลาด โปรดลองอีกครั้ง"
      );
      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />
      <main className="flex-1 p-2">
        <header className="bg-white h-[70px] p-4 rounded-[8px] shadow-md mb-4">
          <div className="flex justify-between items-center">
            <h1 className="mb-2 text-3xl text-[#444444]">เพิ่มข้อมูลยา</h1>
          </div>
        </header>

        <div className="bg-white shadow-md rounded-lg p-4 max-h-full overflow-hidden">
          {errorMessage && (
            <p className="text-red-500 text-center mb-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-2">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-6 items-start">
              <div className="col-span-1">
                <label htmlFor="name" className="text-sm">
                  ชื่อยา
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-1">
                <label htmlFor="amount" className="text-sm">
                  จำนวน
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Unit */}
              <div className="col-span-1">
                <label htmlFor="unit" className="text-sm">
                  หน่วย
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
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
              <div className="col-span-1">
                <label htmlFor="type" className="text-sm">
                  ประเภท
                </label>
                <div className="flex gap-4 items-center mt-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="type"
                      value="drug"
                      checked={formData.type === "drug"}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#FB6F92]"
                    />
                    ยา
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="type"
                      value="herb"
                      checked={formData.type === "herb"}
                      onChange={handleChange}
                      className="focus:ring-2 focus:ring-[#FB6F92]"
                    />
                    สมุนไพร
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 items-start mt-4">
              {/* Code */}
              <div className="col-span-1">
                <label htmlFor="code" className="text-sm">
                  รหัสยา
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Price */}
              <div className="col-span-1">
                <label htmlFor="unit_price" className="text-sm">
                  ราคาต่อหน่วย
                </label>
                <input
                  type="number"
                  id="unit_price"
                  name="unit_price"
                  value={formData.unit_price}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Expiry Date */}
              <div className="col-span-1">
                <label htmlFor="expired" className="text-sm">
                  วันหมดอายุ
                </label>
                <input
                  type="date"
                  id="expired"
                  name="expired"
                  value={formData.expired}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2 mt-4">
              <label htmlFor="description" className="text-sm">
                รายละเอียดยา
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="resize-none w-full h-[80px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
            </div>

            {/* Usage */}
            <div className="col-span-2 mt-4">
              <label htmlFor="usage" className="text-sm">
                วิธีใช้
              </label>
              <textarea
                id="usage"
                name="usage"
                value={formData.usage}
                onChange={handleChange}
                className="resize-none w-full h-[180px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
            </div>

            {/* Side Effects */}
            <div className="col-span-2 mt-4">
              <label htmlFor="side_effects" className="text-sm">
                ผลข้างเคียง
              </label>
              <textarea
                id="side_effect"
                name="side_effect"
                value={formData.side_effect}
                onChange={handleChange}
                className="resize-none w-full h-[50px] py-1 px-2 bg-[#f0f0f0] rounded-[8px] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
            </div>

            {/* Slang Food */}
            <div className="col-span-2 mt-4">
              <label htmlFor="slang_food" className="text-sm">
                อาหารที่ห้ามทานร่วมกับยา
              </label>
              <textarea
                id="slang_food"
                name="slang_food"
                value={formData.slang_food}
                onChange={handleChange}
                className="resize-none w-full h-[50px] py-1 px-2 bg-[#f0f0f0] rounded-[8px] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />

              <div className="mt-4 text-center">
                <button
                  type="submit"
                  className="bg-[#FB6F92] text-white py-2 px-20 rounded-lg hover:bg-[#e05b7f] "
                >
                  บันทึก
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddMedicineForm;