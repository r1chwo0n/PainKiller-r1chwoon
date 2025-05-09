import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../components/sidebar";
import useSnackbar from "../components/useSnackber";

const AddMedicineForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    unit: "",
    customUnit: "", // State for custom unit
    type: "",
    code: "",
    unit_price: "",
    expired: "",
    description: "",
    usage: "",
    side_effect: "",
    slang_food: "",
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
      !formData.amount ||
      (!formData.unit && !formData.customUnit) || // Check for unit or custom unit
      !formData.type ||
      !formData.code ||
      !formData.unit_price ||
      !formData.expired ||
      !formData.description ||
      !formData.usage ||
      !formData.side_effect ||
      !formData.slang_food
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
      // Construct payload
      const drugPayload = {
        name: formData.name,
        code: formData.code,
        drug_type: formData.type === "herb" ? "herb" : "drug",
        unit_type:
          formData.unit === "อื่นๆ" ? formData.customUnit : formData.unit, // Use custom unit if "อื่นๆ" is selected
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
      const response = await axios.post("/api/drugs", drugPayload, {
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
          amount: "",
          unit: "",
          customUnit: "", // Reset custom unit
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
      showSnackbar({
        message:
          error.response?.data?.error ||
          "มีข้อผิดพลาดในการบันทึกข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0] overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4">
        <header className="bg-white h-[86px] w-full p-6 rounded-[12px] shadow-md mb-6 flex items-center justify-between">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-[#444444] font-bold">เพิ่มข้อมูลยา</h1>
          </div>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-2 pr-4 pl-4 pb-5 overflow-y-auto max-h-[calc(100vh-120px)]">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 gap-5 items-start mt-2 ">
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
                  className="w-[385px] h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                />
              </div>

              {/* Quantity */}
              <div className="col-span-1">
                <div className="ml-[100px]">
                  <label
                    htmlFor="amount"
                    className="text-[16px] text-[#444444]"
                  >
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
                    className="w-[320px] h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                  />
                </div>
              </div>

              {/* Unit */}
              <div className="col-span-1">
                <div className="ml-36">
                  <label htmlFor="unit" className="text-[16px] text-[#444444]">
                    หน่วย
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-80 h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    >
                      <option value="">เลือก</option>
                      <option value="กิโลกรัม">กิโลกรัม</option>
                      <option value="กระปุก">กระปุก</option>
                      <option value="ตลับ">ตลับ</option>
                      <option value="ขวด">ขวด</option>
                      <option value="เม็ด">เม็ด</option>
                      <option value="อื่นๆ">อื่นๆ</option>
                    </select>
                    <input
                      type="text"
                      name="customUnit"
                      value={formData.customUnit}
                      onChange={handleChange}
                      placeholder="กรุณากรอกหน่วย"
                      disabled={formData.unit !== "อื่นๆ"}
                      className="w-80 h-[40px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
                    />
                  </div>
                </div>
              </div>
              {/* Type */}
              <div className="col-span-1">
                <div className="flex justify-end">
                  <div>
                    <label
                      htmlFor="type"
                      className="text-[16px] text-[#444444] block"
                    >
                      ประเภท
                    </label>
                    <div className="flex gap-2 items-center mt-1">
                      <label className="flex items-center gap-1">
                        <input
                          type="radio"
                          name="type"
                          value="drug"
                          checked={formData.type === "drug"}
                          onChange={handleChange}
                          className="focus:ring-2 focus:ring-[#FB6F92]"
                        />
                        <label className="text-[16px] text-[#444444]">ยา</label>
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
                        <label className="text-[16px] text-[#444444]">
                          สมุนไพร
                        </label>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5 items-start mt-2">
              {/* Code */}
              <div className="col-span-1">
                <label htmlFor="code" className="text-[16px] text-[#444444]">
                  รหัสยา
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
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
            </div>

            {/* Description */}
            <div className="col-span-2 mt-2">
              <label
                htmlFor="description"
                className="text-[16px] text-[#444444]"
              >
                รายละเอียดยา
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="resize-none w-full h-[80px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
            </div>

            {/* Usage */}
            <div className="col-span-2 mt-2">
              <label htmlFor="usage" className="text-[16px] text-[#444444]">
                วิธีใช้
              </label>
              <textarea
                id="usage"
                name="usage"
                value={formData.usage}
                onChange={handleChange}
                className="resize-none w-full h-[120px] py-1 px-2 rounded-[8px] bg-[#f0f0f0] focus:outline-none focus:ring-2 focus:ring-[#FB6F92] "
              />
            </div>

            {/* Side Effects */}
            <div className="col-span-2 mt-2">
              <label
                htmlFor="side_effects"
                className="text-[16px] text-[#444444]"
              >
                ผลข้างเคียง
              </label>
              <textarea
                id="side_effect"
                name="side_effect"
                value={formData.side_effect}
                onChange={handleChange}
                className="resize-none w-full h-[80px] py-1 px-2 bg-[#f0f0f0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />
            </div>

            {/* Slang Food */}
            <div className="col-span-2 mt-2">
              <label
                htmlFor="slang_food"
                className="text-[16px] text-[#444444]"
              >
                อาหารที่ห้ามทานร่วมกับยา
              </label>
              <textarea
                id="slang_food"
                name="slang_food"
                value={formData.slang_food}
                onChange={handleChange}
                className="resize-none w-full h-[80px] py-1 px-2 bg-[#f0f0f0] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
              />

              <div className="mt-3 text-center">
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

export default AddMedicineForm;
