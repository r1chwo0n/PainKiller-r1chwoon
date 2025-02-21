import React, { useEffect, useState } from "react";
import ExpiredCard from "../components/expiredCard";
import LowStockCard from "../components/lowStockCard";
import Sidebar from "../components/sidebar";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        const response = await fetch("http://localhost:3000/stocks");
        const data = await response.json();
        setDrugs(data);
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
    return drug.stock
      .map((stock) => {
        const expired = new Date(stock.expired);
        const daysLeft = Math.ceil(
          (expired.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysLeft <= 10) {
          return {
            stock_id: stock.stock_id,
            message: `หมดอายุในอีก ${daysLeft} วัน`,
            amount: stock.amount,
            unit_type: drug.unit_type,
            expired: stock.expired,
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  const getLowStockWarning = (drug: Drug) => {
    return getTotalStockAmount(drug) < 20 ? "จำนวนคงเหลือน้อยกว่ากำหนด" : null;
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen p-4">
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <h1 className="text-4xl text-[#444444] font-bold">แจ้งเตือน</h1>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-4 pr-4 pl-4 pb-5 overflow-y-auto">
          {drugs.flatMap((drug) => {
            const lowStockWarning = getLowStockWarning(drug);
            const expiryWarnings = getExpiryWarnings(drug);

            return [
              lowStockWarning && (
                <LowStockCard
                  key={`lowstock-${drug.drug_id}`}
                  name={drug.name}
                  drug_id={drug.drug_id}
                  drug_type={drug.drug_type}
                  amount={getTotalStockAmount(drug)}
                  unit_type={drug.unit_type}
                  warningMessage={lowStockWarning}
                />
              ),
              ...expiryWarnings.map((warning) => (
                <ExpiredCard
                  key={`expired-${warning.stock_id}`}
                  name={drug.name}
                  drug_id={drug.drug_id}
                  drug_type={drug.drug_type}
                  amount={warning.amount}
                  unit_type={warning.unit_type}
                  expired={warning.expired}
                  warningMessage={warning.message}
                />
              )),
            ];
          })}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
