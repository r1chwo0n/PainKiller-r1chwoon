// hooks/useFetchDrugs.ts
import { useState, useEffect } from "react";
import axios from "axios";

interface Drug {
  drug_id: string;
  name: string;
  code: string;
  detail: string;
  usage: string;
  drug_type: string;
  unit_type: string;
  stock: {
    amount: number;
    expired: string;
  }[];
}

// Custom hook สำหรับดึงข้อมูลยา
const useFetchDrugs = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get("/api/drugs");
        setDrugs(response.data.data); // สมมติ API ส่งข้อมูลในรูปแบบ { data: drugs }
      } catch (err: any) {
        setError("Error fetching drugs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDrugs();
  }, []);

  return { drugs, loading, error };
};

export default useFetchDrugs;
