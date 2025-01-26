import React from "react";
import clsx from "clsx";

type LowStockCardProps = {
    name: string;
    drug_type: string;
    amount: number;
    unit_type: string;
    warning: boolean;
    warningMessage: string; // เพิ่มข้อความแจ้งเตือน
  };

const LowStockCard: React.FC<LowStockCardProps> = ({ name, drug_type, amount, unit_type, warningMessage }) => {
  return (
    <div
      className="flex items-center p-4 border-b-2 border-gray-300"
    >
      {/* Icon /} */}
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
          drug_type == "drug" ? "bg-[#ffc673]" : "bg-[#98c99f]"
        )}
      >
      </div>
      {/* {/ Content /} */}
      <div className="flex-1">
        <h2 className="text-base text-[#444444] font-semibold">{name}</h2>
        <p className="text-sm text-[#444444]]">{warningMessage}</p>
      </div>

      {/* {/ Additional Info */}
      <div className="text-right text-sm text-[#444444]">
        <p>จำนวนคงเหลือ: {amount} {unit_type}</p>
      </div>
    </div>
  );
};

export default LowStockCard;