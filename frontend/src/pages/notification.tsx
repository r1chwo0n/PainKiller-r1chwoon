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
        console.log(data);
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
    const expiryWarnings = drug.stock
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
      .filter((warning) => warning !== null);

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

  const handleCardClick = (drug_id: string) => {
    navigate(`/detail/${drug_id}`);
  };

  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen p-4">
        {/* Header */}
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-[#444444] font-bold">แจ้งเตือน</h1>
          </div>
        </header>

        {/* Content Box */}
        <div className="flex-1 bg-white rounded-[12px] pt-2 pb-5 pl-4 pr-4 overflow-y-scroll"> 
          {/* Adjusted padding: decreased right padding to shift scrollbar left */}
          <div className="pr-5 -mr-2"> 
            {/* Display notifications */}
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
                    onClick={() => handleCardClick(drug.drug_id)}
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
                    onClick={() => handleCardClick(drug.drug_id)}
                  />
                ))
              );

              return notifications;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
