import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function AdminRoute() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    if (decoded.role !== "admin") {
      return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
  } catch (err) {
    console.error("Token error", err);
    return <Navigate to="/login" replace />;
  }
}

export default AdminRoute;
