import { useNavigate } from "react-router-dom";
import React from "react";

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
}

const DrugCards: React.FC<DrugCardsProps> = ({
  drugs,
  activeTab,
  searchQuery,
}) => {
  const navigate = useNavigate();

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredDrugs.map((drug) => (
        <div
          key={drug.drug_id}
          className="relative p-4 border border-[#f5f5f5] rounded-[12px] bg-white shadow-md flex flex-col"
        >
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
            รายละเอียด:{" "}
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
          <button
            onClick={() => navigate(`/patient/detail/${drug.drug_id}`)}
            className="mt-auto py-2 bg-[#FB6F92] hover:bg-[#e05c7d] text-white text-base text-center rounded-[12px]"
          >
            ดูข้อมูล
          </button>
        </div>
      ))}
    </div>
  );
};

export default DrugCards;
