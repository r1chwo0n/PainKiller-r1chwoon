import React, { useEffect, useState } from "react";
import NotiCard from "../components/notiCard";
import LowStockCard from "../components/lowStockCard";

type Drug = {
    drug_id: string;
    name: string;
    drug_type: string;
    stock: {
      amount: number;
      unit_type: string;
      expired: string;
    }[];
  };

const NotificationPage: React.FC = () => {
    const mockDrugs = [
        {
          drug_id: "1",
          name: "Paracetamol",
          drug_type: "drug",
          stock: [
            { stock_id: "s1", amount: 10, unit_type: "แผง", expired: "2025-01-25" }, // หมดอายุในอีก 4 วัน
            { stock_id: "s2", amount: 200, unit_type: "แผง", expired: "2026-12-31" }, // ไม่แจ้งเตือน
          ],
        },
        {
          drug_id: "2",
          name: "ขมิ้น",
          drug_type: "herb",
          stock: [
            { stock_id: "s3", amount: 30, unit_type: "ซอง", expired: "2025-02-15" }, // จำนวนคงเหลือน้อยกว่ากำหนด
            { stock_id: "s4", amount: 100, unit_type: "ซอง", expired: "2025-01-30" }, // หมดอายุในอีก 9 วัน
          ],
        },  
        {
          drug_id: "3",
          name: "มะข้ามป้อม",
          drug_type: "herb",
          stock: [
            { stock_id: "s5", amount: 10, unit_type: "ขวด", expired: "2025-03-05" }, 
            { stock_id: "s6", amount: 5, unit_type: "ขวด", expired: "2025-04-20" }, 
          ],
        }      
      ];
    const [drugs, setDrugs] = useState<Drug[]>([]);
    useEffect(() => {
        const fetchDrugs = async () => {
          try {
            const response = await fetch("http://localhost:3000/drugs");
            const data = await response.json();
            setDrugs(data.data);
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
          return `หมดอายุในอีก ${daysLeft} วัน`; // กรณีใกล้หมดอายุ
        }
        return null; // ไม่ต้องแจ้งเตือน
      }).filter(message => message !== null);
  
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
        <div className="flex h-screen w-screen bg-[#f4f4f4]">
        {/* Sidebar */}
        <div className="w-1/6 ml-4 bg-white p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src="https://m.media-amazon.com/images/S/pv-target-images/b35ee2e64161c3b02194239c70b8fa1a83bd7552d4e52c927c47308659fbe005.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex items-center mt-4 text-base text-[#fb6f92]">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <g>
                <path d="M0 0H24V24H0z" fill="none"/>
                <path d="M19.778 4.222c2.343 2.343 2.343 6.142 0 8.485l-2.122 2.12-4.949 4.951c-2.343 2.343-6.142 2.343-8.485 0-2.343-2.343-2.343-6.142 0-8.485l7.07-7.071c2.344-2.343 6.143-2.343 8.486 0zm-4.95 10.606L9.172 9.172l-3.536 3.535c-1.562 1.562-1.562 4.095 0 5.657 1.562 1.562 4.095 1.562 5.657 0l3.535-3.536z"/>
              </g>
            </svg>
            <a href="#" className="text-[#fb6f92] ">คลังยา</a>
            </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f4f4f4] p-4">
            {/* Header */}
            <div className="bg-white rounded-[12px] font-semibold p-6 text-4xl text-[#444444]">
            แจ้งเตือน
            </div>

            {/* Content Box */}
            <div className="bg-white h-[785px] rounded-[12px] mt-4 p-6 pl-4 pb-5 overflow-y-auto">
                {/* {drugs.flatMap((drug) =>
                    drug.stock
                    .map((stock) => ({
                        ...stock,
                        warningMessage: getWarning(stock.amount, stock.expired), // เพิ่มข้อความแจ้งเตือน
                    }))
                    .filter((stock) => stock.warningMessage) // กรองเฉพาะที่มีข้อความแจ้งเตือน
                    .map((stock) => (
                        <NotiCard
                        key={drug.drug_id}
                        name={drug.name}
                        amount={stock.amount}
                        expired={stock.expired}
                        warning={true}
                        warningMessage={stock.warningMessage!} // ส่งข้อความแจ้งเตือน
                        />
                    ))
                )} */}
                {/* กรองและแสดงเฉพาะรายการที่ต้องแจ้งเตือน */}
                {mockDrugs.flatMap((drug) => {
                  const lowStockWarning = getLowStockWarning(drug);
                  const expiryWarnings = getExpiryWarnings(drug);

                  if (lowStockWarning) {
                    return (
                      <LowStockCard
                        key={drug.drug_id}
                        name={drug.name}
                        drug_type={drug.drug_type}
                        amount={getTotalStockAmount(drug)}
                        unit_type={drug.stock[0].unit_type}
                        warning={true}
                        warningMessage={lowStockWarning}
                      />
                    );
                  }

                  return expiryWarnings.map((message, index) => (
                    <NotiCard
                      key={`${drug.drug_id}-${index}`}
                      name={drug.name}
                      drug_type={drug.drug_type}
                      amount={drug.stock[index].amount}
                      unit_type={drug.stock[index].unit_type}
                      expired={drug.stock[index].expired}
                      warning={true}
                      warningMessage={message!}
                    />
                  ));
                })}
            </div>
        </div>
    </div>
  );
};

export default NotificationPage;