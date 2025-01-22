import React, { useEffect, useState } from "react";
import NotiCard from "../components/notiCard";

type Drug = {
    drug_id: string;
    name: string;
    drug_type: string;
    stock: {
      amount: number;
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
            { stock_id: "s1", amount: 10, expired: "2025-01-25" }, // หมดอายุในอีก 4 วัน
            { stock_id: "s2", amount: 200, expired: "2026-12-31" }, // ไม่แจ้งเตือน
          ],
        },
        {
          drug_id: "2",
          name: "ขมิ้น",
          drug_type: "herb",
          stock: [
            { stock_id: "s3", amount: 30, expired: "2025-02-15" }, // จำนวนคงเหลือน้อยกว่ากำหนด
            { stock_id: "s4", amount: 100, expired: "2025-01-30" }, // หมดอายุในอีก 9 วัน
          ],
        },        
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
    const getWarning = (amount: number, expiredDate: string) => {
        const thresholdAmount = 20;
        const today = new Date();
        const expired = new Date(expiredDate);
        const daysLeft = Math.ceil((expired.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
        if (amount < thresholdAmount) {
            return "จำนวนคงเหลือน้อยกว่ากำหนด"; // กรณีสต็อกใกล้หมด
          }
        if (daysLeft <= 10) {
            return `หมดอายุในอีก ${daysLeft} วัน`; // กรณีใกล้หมดอายุ
        }
        return null; // ไม่ต้องแจ้งเตือน
      };
      
    return (
        <div className="flex h-screen w-screen bg-gray-700">
        {/* Sidebar */}
        <div className="w-1/6 bg-white p-4 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md">
            <img src="https://m.media-amazon.com/images/S/pv-target-images/b35ee2e64161c3b02194239c70b8fa1a83bd7552d4e52c927c47308659fbe005.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <a href="#" className="mt-4 text-blue-600 underline">คลังยา</a>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[#f4f4f4] p-4">
            {/* Header */}
            <div className="bg-white text-lg font-semibold p-6 rounded-md"
            style={{fontFamily: 'Noto Looped Thai, sans-serif', fontSize: '36px', color: '#444444',}}>
            แจ้งเตือน
            </div>

            {/* Content Box */}
            <div className="bg-white h-[785px] mt-4 p-6 pl-4 pb-5 rounded-md overflow-y-auto">
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
                {mockDrugs.flatMap((drug) =>
                    drug.stock
                    .map((stock) => ({
                        ...stock,
                        warningMessage: getWarning(stock.amount, stock.expired),
                    }))
                    .filter((stock) => stock.warningMessage)
                    .map((stock) => (
                        <NotiCard
                        key={stock.stock_id}
                        name={drug.name}
                        drug_type={drug.drug_type}
                        amount={stock.amount}
                        expired={stock.expired}
                        warning={true}
                        warningMessage={stock.warningMessage!}
                        />
                    ))
                )}
            </div>
        </div>
    </div>
  );
};

export default NotificationPage;
