import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch (err) {
      console.error("Error decoding JWT", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <ul className="flex space-x-4">
        {/* Public Routes */}
        {!token && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}

        {/* Protected Routes */}
        {token && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            {role === "admin" && <li><Link to="/admin-panel">Admin Panel</Link></li>}
          </>
        )}
      </ul>

      {/* Logout Button */}
      {token && (
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
