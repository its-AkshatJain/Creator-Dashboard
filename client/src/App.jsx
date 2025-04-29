import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel"; 
import Profile from "./pages/Profile"; 
import Saved     from "./pages/Saved";
import Reported  from "./pages/Reported";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Navbar
import Navbar from "./components/Navbar.jsx";
import Feed from "./pages/Feed.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Router>
      <Navbar /> {/* Navbar now included here */}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} /> 
          <Route path="/saved"     element={<Saved />} />
         <Route path="/reported"  element={<Reported />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin-panel" element={<AdminPanel />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </Router>
  );
}

export default App;
