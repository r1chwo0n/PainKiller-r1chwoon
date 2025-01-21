import React from "react";
import clsx from "clsx";

type DrugCardProps = {
    name: string;
    amount: number;
    expired: string;
    warning: boolean;
    warningMessage: string; // เพิ่มข้อความแจ้งเตือน
  };

const DrugCard: React.FC<DrugCardProps> = ({ name, amount, expired, warning, warningMessage }) => {
  return (
    <div
      className={clsx(
        "flex items-center p-4 rounded-lg shadow border mb-4",
        warning ? "bg-yellow-100 border-yellow-400" : "bg-green-100 border-green-400"
      )}
    >
      {/* Icon */}
      <div
        className={clsx(
          "w-10 h-10 rounded-full flex items-center justify-center mr-4",
          warning ? "bg-yellow-500" : "bg-green-500"
        )}
      >
        {/* Empty circle for now */}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-600">{warningMessage}</p>
      </div>

      {/* Additional Info */}
      <div className="text-right text-sm">
        <p>วันหมดอายุ: {expired}</p>
        <p>จำนวนคงเหลือ: {amount} หน่วย</p>
      </div>
    </div>
  );
};

export default DrugCard;