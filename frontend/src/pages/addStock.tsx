import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";

const AddStockForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    expired: "",
    unit_price: "",
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
      !formData.unit_price ||
      !formData.expired
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
        stock: {
          amount: parseInt(formData.amount, 10) || 0,
          unit_price: parseFloat(formData.unit_price) || 0.0,
          expired: formatDate(formData.expired),
        },
      };

      // Send payload to the API
      /* Edit This */
      const response = await axios.post(
        "http://localhost:3000/api/drugs",
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
          unit_price: "",
          expired: "",
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
            <h1 className="mb-2 text-4xl text-[#444444] font-bold ">
              เพิ่มข้อมูลยา
            </h1>
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
            <div className="grid grid-cols-4 gap-5 items-start">
              <div className="col-span-1">
                <label htmlFor="name" className="text-[16px] text-[#444444]">
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
                <label htmlFor="amount" className="text-[16px] text-[#444444]">
                  จำนวน
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      // ตรวจสอบว่าเป็นตัวเลขเต็มบวกหรือ 0
                      handleChange(e);
                    }
                  }}
                  min="0"
                  step="1"
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              <div className="grid grid-cols-3 gap-5 items-start mt-2">
                {/* Price */}
                <div className="col-span-1">
                  <label
                    htmlFor="unit_price"
                    className="text-[16px] text-[#444444]">
                    ราคาต่อหน่วย
                  </label>
                  <input
                    type="number"
                    id="unit_price"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        // ตรวจสอบว่าเป็นตัวเลขเต็มบวกหรือ 0
                        handleChange(e);
                      }
                    }}
                    min="0"
                    step="1"
                    className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  />
                </div>

                {/* Expiry Date */}
                <div className="col-span-1">
                  <label
                    htmlFor="expired"
                    className="text-[16px] text-[#444444]">
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

              <div className="mt-3 text-center">
                <button
                  type="submit"
                  className="bg-[#FB6F92] text-white py-2 px-20 rounded-lg hover:bg-[#e05b7f] ">
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

export default AddStockForm;
