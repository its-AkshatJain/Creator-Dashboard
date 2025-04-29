import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  FiMenu, 
  FiX, 
  FiCreditCard, 
  FiSun, 
  FiMoon, 
  FiUser, 
  FiHome, 
  FiSave, 
  FiFlag, 
  FiGrid, 
  FiShield 
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() { // Remove props
  const { darkMode, toggleDarkMode } = useTheme(); // Add this line
  const [open, setOpen] = useState(false);
  const [credits, setCredits] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role;
    } catch {}
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // fetch credits
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCredits(data.credits);
      } catch (err) {
        console.error("Failed to load credits", err);
      }
    })();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FiGrid /> },
    { to: "/profile", label: "Profile", icon: <FiUser /> },
    { to: "/feed", label: "Feed", icon: <FiHome /> },
    { to: "/saved", label: "Saved", icon: <FiSave /> },
    { to: "/reported", label: "Reported", icon: <FiFlag /> },
  ];

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } }
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-opacity-80 backdrop-blur-lg shadow-lg" 
          : "bg-opacity-50 backdrop-blur-md"
      } ${
        darkMode 
          ? "bg-gray-900/80 text-gray-100" 
          : "bg-white/30 text-gray-800"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* logo */}
          <Link 
            to={token ? "/feed" : "/login"}
            className={`text-2xl font-bold ${
              darkMode ? "text-blue-400" : "text-blue-600"
            } transition-colors`}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              CreatorDash
            </motion.div>
          </Link>

          {/* desktop links */}
          <div className="hidden md:flex items-center space-x-6">
            {token &&
              links.map((link) => (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.to}
                    className={`flex items-center space-x-1 ${
                      darkMode 
                        ? "text-gray-300 hover:text-blue-400" 
                        : "text-gray-700 hover:text-blue-600"
                    } transition-colors`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
            {role === "admin" && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/admin-panel"
                  className={`flex items-center space-x-1 ${
                    darkMode 
                      ? "text-green-400 hover:text-green-300" 
                      : "text-green-600 hover:text-green-500"
                  } transition-colors`}
                >
                  <FiShield />
                  <span>Admin Panel</span>
                </Link>
              </motion.div>
            )}
            {token && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-1 ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                } px-3 py-1 rounded-full ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                } bg-opacity-70`}
              >
                <FiCreditCard />
                <span className="font-medium">{credits}</span>
              </motion.div>
            )}
            {token && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`ml-4 px-3 py-1 rounded-full ${
                  darkMode 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-red-500 hover:bg-red-600"
                } text-white transition-colors`}
              >
                Logout
              </motion.button>
            )}
            {/* Dark/Light mode toggle */}
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-gray-800 text-yellow-300" 
                  : "bg-gray-200 text-gray-700"
              } transition-colors`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>
          </div>

          {/* mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {token && (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className={`flex items-center space-x-1 ${
                  darkMode ? "text-yellow-300" : "text-yellow-600"
                } px-2 py-1 rounded-full ${
                  darkMode ? "bg-gray-800" : "bg-gray-200"
                } bg-opacity-70`}
              >
                <FiCreditCard />
                <span className="font-medium">{credits}</span>
              </motion.div>
            )}
            <motion.button
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode 
                  ? "bg-gray-800 text-yellow-300" 
                  : "bg-gray-200 text-gray-700"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className={darkMode ? "text-white" : "text-gray-800"}
            >
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants}
            className={`md:hidden ${
              darkMode 
                ? "bg-gray-900/90 text-gray-100" 
                : "bg-white/80 text-gray-800"
            } backdrop-blur-lg`}
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              {links.map((link) => (
                <motion.div
                  key={link.to}
                  whileHover={{ x: 5 }}
                  className="py-2"
                >
                  <Link
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 ${
                      darkMode 
                        ? "text-gray-300 hover:text-blue-400" 
                        : "text-gray-700 hover:text-blue-600"
                    } transition-colors`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </motion.div>
              ))}
              {role === "admin" && (
                <motion.div
                  whileHover={{ x: 5 }}
                  className="py-2"
                >
                  <Link
                    to="/admin-panel"
                    onClick={() => setOpen(false)}
                    className={`flex items-center space-x-3 ${
                      darkMode 
                        ? "text-green-400 hover:text-green-300" 
                        : "text-green-600 hover:text-green-500"
                    } transition-colors`}
                  >
                    <FiShield />
                    <span>Admin Panel</span>
                  </Link>
                </motion.div>
              )}
              <motion.div
                whileHover={{ x: 5 }}
                className="py-2"
              >
                <button
                  onClick={handleLogout}
                  className={`flex items-center space-x-3 w-full text-left ${
                    darkMode 
                      ? "text-red-400 hover:text-red-300" 
                      : "text-red-500 hover:text-red-600"
                  } transition-colors`}
                >
                  <FiX />
                  <span>Logout</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}