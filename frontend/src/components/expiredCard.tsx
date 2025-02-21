import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

type ExpiredCardProps = {
  name: string;
  drug_id: string;
  drug_type: string;
  amount: number;
  unit_type: string;
  expired: string;
  warningMessage: string;
};

const ExpiredCard: React.FC<ExpiredCardProps> = ({ name, drug_id, drug_type, amount, unit_type, expired, warningMessage }) => {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const clicked = localStorage.getItem(`clicked-${drug_id}`);
    setIsClicked(clicked === "true");
  }, []);

  const handleClick = () => {
    localStorage.setItem(`clicked-${drug_id}`, "true");
    setIsClicked(true);
    navigate(`/detail/${drug_id}`); // ไปที่หน้ารายละเอียดของยา
  };

  return (
    <div className="flex items-center p-4 border-b-2 border-gray-300 cursor-pointer hover:bg-gray-100" onClick={handleClick}>
      <div
        className={clsx(
          "relative w-10 h-10 rounded-full flex items-center justify-center mr-4",
          drug_type === "drug" ? "bg-[#ffc673]" : "bg-[#98c99f]"
        )}
      >
        {!isClicked && (
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#FB6F92] border-[3px] border-white"></div>
        )}
      </div>

      <div className="flex-1">
        <h2 className="text-base text-[#444444] font-semibold">{name}</h2>
        <p className="text-sm text-[#444444]">{warningMessage}</p>
      </div>

      <div className="text-right text-sm text-[#444444]">
        <p>วันหมดอายุ: {expired}</p>
        <p>จำนวนคงเหลือ: {amount} {unit_type}</p>
      </div>
    </div>
  );
};

export default ExpiredCard;
