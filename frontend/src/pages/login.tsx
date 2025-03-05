import { useState } from "react";
import { useAuth } from "../auth/context";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleLogin = () => {
    if (password === "250919dear") {
      login("doctor");
      navigate("/doctor");
    } else {
      setError("รหัสผ่านไม่ถูกต้อง, โปรดลองใหม่อีกครั้ง!");
      return;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">เข้าสู่ระบบ</h2>
        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FB6F92]"
          placeholder="กรอกรหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        <button
          onClick={handleLogin}
          className="w-full mt-4 bg-[#FB6F92] hover:bg-[#e05c7d] text-white py-2 rounded-lg transition">
          เข้าสู่ระบบ
        </button>
        {/* Display error message below the button */}
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
