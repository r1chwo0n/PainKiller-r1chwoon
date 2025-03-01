import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  role: string;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string>(() => {
    return sessionStorage.getItem("role") || "patient"; // ✅ โหลดค่า role จาก sessionStorage ถ้าไม่มีใช้ "patient"
  });

  useEffect(() => {
    sessionStorage.setItem("role", role); // ✅ อัปเดตค่า role ทุกครั้งที่เปลี่ยน
  }, [role]);

  const login = (userRole: string) => {
    setRole(userRole);
  };

  const logout = () => {
    setRole("patient"); // ✅ กลับเป็น "patient" เมื่อ logout
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
