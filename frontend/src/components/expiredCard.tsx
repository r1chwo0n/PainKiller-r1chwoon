import React from "react";
import clsx from "clsx";

type DrugCardProps = {
    name: string;
    drug_type: string;
    amount: number;
    unit_type: string;
    expired: string;
    warning: boolean;
    warningMessage: string; // เพิ่มข้อความแจ้งเตือน
  };

const DrugCard: React.FC<DrugCardProps> = ({ name, drug_type, amount, unit_type, expired, warningMessage }) => {
  return (
    <div
      className="flex items-center p-4 border-b-2 border-gray-300 mb-5"
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
        <p>วันหมดอายุ: {formatThaiDate(expired)}</p>
        <p>จำนวนคงเหลือ: {amount} {unit_type}</p>
      </div>
    </div>
  );
};

function formatThaiDate(dateString: string): string {
  const monthsThai = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const date = new Date(dateString);
  const day = date.getDate();
  const month = monthsThai[date.getMonth()];
  const year = date.getFullYear() + 543; // แปลง ค.ศ. เป็น พ.ศ.

  return `${day} ${month} ${year}`;
}

export default DrugCard;