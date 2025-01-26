import React, { useState } from "react";
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
    sideEffects: "",
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
    setErrorMessage(null);
    setSuccessMessage(null);

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
      !formData.sideEffects
    ) {
      setErrorMessage("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/drugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          code: formData.code,
          drug_type: formData.type === "herbal" ? "herbal" : "drug",
          unit_type: formData.unit,
          detail: formData.description,
          usage: formData.usage,
          slang_food: "",
          side_effect: formData.sideEffects,
          stock: {
            amount: parseInt(formData.quantity, 10),
            unit_price: parseFloat(formData.price),
            expired: formData.expiryDate,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        setErrorMessage(`บันทึกข้อมูลล้มเหลว: ${error.message}`);
        return;
      }

      setSuccessMessage("บันทึกข้อมูลสำเร็จ!");
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
        sideEffects: "",
      });
    } catch (err) {
      console.error("Error adding medicine:", err);
      setErrorMessage("เกิดข้อผิดพลาด โปรดลองอีกครั้ง");
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

        <div className="bg-white shadow-md rounded-lg p-6">
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name">ชื่อยา</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="quantity">จำนวน</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="unit">หน่วย</label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
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
              <div>
                <label htmlFor="type">ประเภท</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                >
                  <option value="">เลือกประเภท</option>
                  <option value="herbal">สมุนไพร</option>
                  <option value="drug">ยา</option>
                </select>
              </div>
              <div>
                <label htmlFor="code">รหัสยา</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="price">ราคา</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="expiryDate">วันหมดอายุ</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="description">รายละเอียด</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="usage">การใช้งาน</label>
                <textarea
                  id="usage"
                  name="usage"
                  value={formData.usage}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                />
              </div>
              <div>
                <label htmlFor="sideEffects">ผลข้างเคียง</label>
                <textarea
                  id="sideEffects"
                  name="sideEffects"
                  value={formData.sideEffects}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
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
