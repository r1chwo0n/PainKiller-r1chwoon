import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import useSnackbar from "../useSnackber";
import axios from "axios";

interface Drug {
  drug_id: string;
  name: string;
  code: string;
  detail: string;
  usage: string;
  drug_type: string;
  unit_type: string;
  stock: {
    amount: number;
    expired: string;
  }[];
}

interface DrugCardsProps {
  drugs: Drug[];
  activeTab: string;
  searchQuery: string;
  setShowDeletePopup: (show: boolean) => void;
  showDeletePopup: boolean;
  onDrugDeleted: () => void;
}

const DrugCards: React.FC<DrugCardsProps> = ({
  drugs,
  activeTab,
  searchQuery,
  setShowDeletePopup,
  showDeletePopup,
  onDrugDeleted,
}) => {
  const navigate = useNavigate();
  const { showSnackbar, Snackbar } = useSnackbar();
  const [deleteDrugId, setDeleteDrugIdState] = useState<string | null>(null); // เพิ่ม state เพื่อเก็บ drug_id ที่จะลบ

  const filteredDrugs = drugs
    .filter((drug) => {
      if (activeTab === "ทั้งหมด") return true;
      if (activeTab === "ยา") return drug.drug_type === "drug";
      if (activeTab === "สมุนไพร") return drug.drug_type === "herb";
      if (activeTab === "ใกล้หมดคลัง") return drug.stock[0]?.amount < 10;
      if (activeTab === "ใกล้หมดอายุ") {
        const expirationDate = new Date(drug.stock[0]?.expired);
        return expirationDate.getTime() <= new Date().getTime();
      }
      return false;
    })
    .filter((drug) =>
      searchQuery
        ? drug.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true
    );

  const handleDelete = async () => {
    if (!deleteDrugId) return;

    try {
      await axios.delete(`/api/drugs/${deleteDrugId}`);

      setDeleteDrugIdState(null);
      setShowDeletePopup(false);

      showSnackbar({
        message: "ลบข้อมูลยาสำเร็จ!",
        severity: "success",
      });

      onDrugDeleted();
    } catch (error) {
      console.error("Error deleting drug:", error);
      showSnackbar({
        message: "มีข้อผิดพลาดในการลบข้อมูลยา โปรดตรวจสอบอีกครั้ง",
        severity: "error",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDrugs.map((drug) => (
        <div
          key={drug.drug_id}
          className="relative p-4 border border-[#f5f5f5] rounded-[12px] bg-white shadow-md flex flex-col"
        >
          {/* Trash Icon */}
          <button
            onClick={() => {
              setDeleteDrugIdState(drug.drug_id); // เก็บ drug_id ที่จะลบ
              setShowDeletePopup(true);
            }}
            className="absolute top-4 right-4 text-[#FB6F92] hover:text-[#E15873]"
          >
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                d="M8.586 2.586A2 2 0 0 1 10 2h4a2 2 0 0 1 2 2v2h3a1 1 0 1 1 0 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8a1 1 0 0 1 0-2h3V4a2 2 0 0 1 .586-1.414ZM10 6h4V4h-4v2Zm1 4a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Zm4 0a1 1 0 1 0-2 0v8a1 1 0 1 0 2 0v-8Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {Snackbar}

          <div className="flex items-center mb-4">
            <h2 className="font-bold text-2xl">
              {drug.name.length > 15
                ? `${drug.name.slice(0, 15)}...`
                : drug.name}
            </h2>{" "}
            <p className="ml-2 mt-1 text-gray-800">({drug.unit_type})</p>
            <div className="ml-2">
              {drug.drug_type === "herb" ? (
                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                  <path
                    d="M14 10L4 20M20 7C20 12.5228 15.5228 17 10 17C9.08396 17 8.19669 16.8768 7.35385 16.6462C7.12317 15.8033 7 14.916 7 14C7 8.47715 11.4772 4 17 4C17.916 4 18.8033 4.12317 19.6462 4.35385C19.8768 5.19669 20 6.08396 20 7Z"
                    stroke="#98c99f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 -0.5 17 17"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  className="si-glyph si-glyph-pill"
                  fill="#000000"
                  style={{ width: "24px", height: "24px" }}
                >
                  <g
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    <path
                      d="M15.897,1.731 L15.241,1.074 C13.887,-0.281 11.745,-0.341 10.46,0.944 L1.957,9.446 C0.673,10.731 0.733,12.871 2.09,14.228 L2.744,14.882 C4.101,16.239 6.242,16.3 7.527,15.016 L16.03,6.511 C17.314,5.229 17.254,3.088 15.897,1.731 L15.897,1.731 Z M11.086,10.164 L6.841,5.917 L11.049,1.709 C11.994,0.765 13.581,0.811 14.584,1.816 L15.188,2.417 C15.678,2.91 15.959,3.552 15.975,4.226 C15.991,4.888 15.75,5.502 15.295,5.955 L11.086,10.164 L11.086,10.164 Z"
                      fill="#ffc673" // This is the blue sky color
                      className="si-glyph-fill"
                    />
                  </g>
                </svg>
              )}
            </div>
          </div>

          <p className="text-base mb-2">รหัสยา: {drug.code}</p>
          <p className="text-base mb-2">
            รายละเอียด:
            {drug.detail.length > 30
              ? `${drug.detail.slice(0, 30)}...`
              : drug.detail}
          </p>

          <p className="text-base mb-2">
            ขนาดและวิธีใช้:{" "}
            {drug.usage.length > 30
              ? `${drug.usage.slice(0, 30)}...`
              : drug.usage}
          </p>
          <p className="text-base mb-2">
            วันหมดอายุ:{" "}
            {drug.stock.length > 0
              ? new Intl.DateTimeFormat("th-TH", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(new Date(drug.stock[0].expired))
              : "ไม่พบวันหมดอายุ"}
          </p>
          <p className="text-base mb-4">
            จำนวนคงเหลือ: {drug.stock.length > 0 ? drug.stock[0].amount : "0"}
          </p>
          <button
            onClick={() => navigate(`/doctor/detail/${drug.drug_id}`)}
            className="mt-auto py-2 bg-[#FB6F92] hover:bg-[#e05c7d] text-white text-base text-center rounded-[12px]"
          >
            ดูข้อมูล
          </button>
        </div>
      ))}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-[20px] p-8 rounded-lg shadow-xl max-w-md w-full">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              ยืนยันการลบ
            </h2>
            <p className="text-lg text-[#444444] mb-6">
              คุณแน่ใจว่าต้องการลบยานี้?
            </p>
            <div className="flex justify-end space-x-6">
              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteDrugIdState(null);
                }}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-300 focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 bg-[#E57373] text-white rounded-[12px] hover:bg-[#e15d5d] focus:outline-none transform transition-all duration-200 ease-in-out hover:scale-105"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugCards;
