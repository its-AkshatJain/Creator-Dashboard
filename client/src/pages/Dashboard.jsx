import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import Feed from "../components/Feed";

function Dashboard() {
  const [userInfo, setUserInfo] = useState({ message: "", role: "", credits: 0 });
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo({
        message: `Welcome ${decoded.role === "admin" ? "Admin" : "User"}`,
        role: decoded.role,
        credits: res.data.credits,
      });
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div className="flex flex-col justify-start items-center min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold mb-3">{userInfo.message}</h1>
      <p className="text-lg mb-1">Role: <strong>{userInfo.role}</strong></p>
      <p className="text-lg mb-6">Credits: <strong>{userInfo.credits}</strong></p>

      <div className="mb-8 flex gap-4">
        <button
          onClick={() => navigate("/profile")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
        >
          View Profile
        </button>
        {userInfo.role === "admin" && (
          <button
            onClick={() => navigate("/admin-panel")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
          >
            Admin Panel
          </button>
        )}
      </div>

      <div className="w-full max-w-5xl h-[600px] overflow-y-auto bg-white rounded-lg shadow-lg p-6">
        <Feed />
      </div>
    </div>

  );
}

export default Dashboard;
