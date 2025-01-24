import React, { useEffect, useState } from "react";
import ExpiredCard from "../components/expiredCard";
import LowStockCard from "../components/lowStockCard";
import Sidebar from "../components/slidebar";

type Drug = {
  drug_id: string;
  name: string;
  drug_type: string;
  unit_type: string;
  stock: {
    stock_id: string;
    amount: number;
    expired: string;
  }[];
};

const NotificationPage: React.FC = () => {

  const [drugs, setDrugs] = useState<Drug[]>([]);

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await fetch("http://localhost:3000/stocks"); 
        const data = await response.json();
          console.log(data);
        setDrugs(data); // ตั้งค่าข้อมูล drugs ที่ได้จาก API
      } catch (error) {
        console.error("Error fetching drugs:", error);
      }
    };
  
    fetchDrugs();
  }, []);


  const getTotalStockAmount = (drug: Drug) => {
    return drug.stock.reduce((total, stock) => total + stock.amount, 0);
  };

  const getExpiryWarnings = (drug: Drug) => {
    const today = new Date();
    const expiryWarnings = drug.stock.map((stock) => {
      const expired = new Date(stock.expired);
      const daysLeft = Math.ceil((expired.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysLeft <= 10) {
        return {
          stock_id: stock.stock_id,
          message: `หมดอายุในอีก ${daysLeft} วัน`,
          amount: stock.amount,
          unit_type: drug.unit_type,
          expired: stock.expired,
        }; // กรณีใกล้หมดอายุ
      }
      return null; // ไม่ต้องแจ้งเตือน
    }).filter(warning => warning !== null);

    return expiryWarnings;
  };

  const getLowStockWarning = (drug: Drug) => {
    const thresholdAmount = 20;
    const totalAmount = getTotalStockAmount(drug);

    if (totalAmount < thresholdAmount) {
      return "จำนวนคงเหลือน้อยกว่ากำหนด";
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar/>

      <div className="flex-1 p-4">
        {/* Header */}
        <div className="bg-white rounded-[12px] font-semibold p-6 text-4xl text-[#444444]">
          แจ้งเตือน
        </div>

        {/* Content Box */}
        <div className="bg-white h-[785px] rounded-[12px] mt-4 p-6 pl-4 pb-5 overflow-y-auto">
          {/* กรองและแสดงเฉพาะรายการที่ต้องแจ้งเตือน */}
            {drugs.flatMap((drug) => {
            const lowStockWarning = getLowStockWarning(drug);
            const expiryWarnings = getExpiryWarnings(drug);

            const notifications = [];

            if (lowStockWarning) {
              notifications.push(
                <LowStockCard
                  key={drug.drug_id}
                  name={drug.name}
                  drug_type={drug.drug_type}
                  amount={getTotalStockAmount(drug)}
                  unit_type={drug.unit_type}
                  warning={true}
                  warningMessage={lowStockWarning}
                />
              );
            }

            notifications.push(
              ...expiryWarnings.map((warning) => (
                <ExpiredCard
                  key={warning.stock_id}
                  name={drug.name}
                  drug_type={drug.drug_type}
                  amount={warning.amount}
                  unit_type={warning.unit_type}
                  expired={warning.expired}
                  warning={true}
                  warningMessage={warning.message}
                />
              ))
            );

            return notifications;
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
