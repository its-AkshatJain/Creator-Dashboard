import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";  // Corrected import

function Dashboard() {
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Decode the token to find role
      const decoded = jwtDecode(token);
      console.log(decoded); // { id: "...", role: "user" } or { id: "...", role: "admin" }
      setRole(decoded.role);

      const res = await axios.get("http://localhost:5000/api/users/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login",{ replace: true });
  };  

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <h1 className="text-3xl mb-6">{message}</h1>
      <p className="text-lg mb-6">Role: {role}</p>

      {role === "admin" && (
        <div className="mb-4">
          <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Admin Special Option
          </button>
        </div>
      )}

      <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
