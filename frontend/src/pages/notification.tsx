import React, { useEffect, useState } from "react";
import ExpiredCard from "../components/expiredCard";
import LowStockCard from "../components/lowStockCard";
import Sidebar from "../components/sidebar";

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
  
        // ใช้ reverse() เพื่อให้ข้อมูลล่าสุดอยู่ด้านบน
        setDrugs(data.reverse());
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

        let message = '';
        
        if (daysLeft < 0) {
          message = 'หมดอายุแล้ว';
        } else if (daysLeft === 0) {
          message = 'หมดอายุวันนี้';
        } else if (daysLeft <= 10) {
          message = `หมดอายุในอีก ${daysLeft} วัน`;
        }

        return message ? {
          stock_id: stock.stock_id,
          message: message,
          amount: stock.amount,
          unit_type: drug.unit_type,
          expired: stock.expired,
        } : null;
      })
      .filter(Boolean);
};

  const getLowStockWarning = (drug: Drug) => {
    if (drug.stock.length === 0) {
      return null; // ถ้าไม่มีล็อตใดๆ ในสต็อกเลย แสดงว่ายังไม่ได้จัดซื้อ ไม่ต้องแจ้งเตือน
    }
    const totalStock = getTotalStockAmount(drug);
    
    if (totalStock === 0) {
      return "หมดสต็อกแล้ว";
    } else if (totalStock < 8) {
      return "จำนวนคงเหลือน้อยกว่ากำหนด";
    }

    return null;
  };


  return (
    <div className="flex h-screen bg-[#f0f0f0]">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen p-4">
        <header className="bg-white h-[86px] p-6 rounded-[12px] shadow-md mb-6">
          <h1 className="text-4xl text-[#444444] font-bold">แจ้งเตือน</h1>
        </header>

        <div className="flex-1 bg-white rounded-[12px] pt-4 pr-4 pl-4 overflow-y-sch">

        <div
            className="flex-1 bg-white rounded-[12px] pr-4 pl-4 overflow-y-auto"
            style={{
              maxHeight: "calc(100vh - 180px)",
              marginTop: "4px",
              overflowY: "auto",
            }}
          >
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
              ...expiryWarnings
              .filter((warning) => warning !== null)
              .map((warning) => (
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
    </div>
  );
};

export default NotificationPage;

