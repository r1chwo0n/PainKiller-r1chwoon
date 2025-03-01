import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import useSnackbar from "../components/useSnackber";

const AddStockForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    unit_type: "",
    unit_price: "",
    amount: "",
    expired: "",
  });

  const { showSnackbar, Snackbar } = useSnackbar();

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
      !formData.unit_type ||
      !formData.unit_price ||
      !formData.amount ||
      !formData.expired
    ) {
      showSnackbar({
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        severity: "error",
      });
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
      const stockPayload = {
        name: formData.name,
        unit_type: formData.unit_type,
        unit_price: parseFloat(formData.unit_price) || 0.0,
        amount: parseInt(formData.amount, 10) || 0,
        expired: formatDate(formData.expired),
      };

      // Send payload to the API
      /* Edit This */
      const response = await axios.post("/api/stocks", stockPayload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        showSnackbar({
          message: "บันทึกข้อมูลยาสำเร็จ!",
          severity: "success",
        });

        // Reset form
        setFormData({
          name: "",
          unit_type: "",
          unit_price: "",
          amount: "",
          expired: "",
        });
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error: any) {
      console.error("Error adding drug:", error);
      showSnackbar({
        message:
          error.response?.data?.message ||
          "มีข้อผิดพลาดในการบันทึกข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />
      <main className="flex-1 p-4">
        <header className="bg-white h-[86px] w-full p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-[#444444] font-bold ">เพิ่มสต็อก</h1>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-sch">
          {/* Error and success messages */}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-5 items-start mt-2">
              {/* Drug Name */}
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
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
              {/* Unit */}
              <div className="col-span-1">
                <label htmlFor="unit" className="text-[16px] text-[#444444]">
                  หน่วย
                </label>
                <select
                  name="unit_type"
                  value={formData.unit_type}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                >
                  <option value="">เลือก</option>
                  <option value="กิโลกรัม">กิโลกรัม</option>
                  <option value="กระปุก">กระปุก</option>
                  <option value="ตลับ">ตลับ</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 items-start mt-2">
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
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0]  focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Expiry Date */}
              <div className="col-span-1">
                <label htmlFor="expired" className="text-[16px] text-[#444444]">
                  วันหมดอายุ
                </label>
                <input
                  type="date"
                  id="expired"
                  name="expired"
                  value={formData.expired}
                  onChange={handleChange}
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Price */}
              <div className="col-span-1">
                <label
                  htmlFor="unit_price"
                  className="text-[16px] text-[#444444]"
                >
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
                  className="w-full h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>
            </div>

            <div className="col-span-2 mt-2">
              <div className="mt-5 text-center">
                <button
                  type="submit"
                  className="bg-[#FB6F92] text-white py-2 px-20 rounded-lg hover:bg-[#e05b7f] "
                >
                  บันทึก
                </button>
              </div>
              {Snackbar}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddStockForm;
