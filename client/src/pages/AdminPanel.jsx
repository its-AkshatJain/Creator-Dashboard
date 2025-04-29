import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PencilIcon, CheckIcon, UserIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

function AdminPanel() {
  const { darkMode } = useTheme(); // Only using darkMode, not toggleDarkMode
  const [users, setUsers] = useState([]);
  const [editCredits, setEditCredits] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeRow, setActiveRow] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreditChange = (id, value) => {
    setEditCredits({ ...editCredits, [id]: value });
  };

  const handleUpdateCredits = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/users/${id}/credits`,
        { credits: Number(editCredits[id]) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Credits updated successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update credits");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white" : "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-800"
    } p-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            className="text-3xl font-bold mt-16"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`mr-2 ${darkMode ? "text-purple-400" : "text-indigo-600"}`}>⚡</span>
            Admin Panel
          </motion.h1>
        </div>

        <motion.div 
          className={`backdrop-blur-lg bg-opacity-20 border border-opacity-30 rounded-xl shadow-xl overflow-hidden ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header with stats */}
          <div className={`p-6 ${darkMode ? "bg-gray-900 bg-opacity-50" : "bg-indigo-50 bg-opacity-50"}`}>
            <div className="flex flex-wrap gap-6">
              <div className={`p-4 rounded-lg backdrop-blur-md flex items-center gap-4 ${
                darkMode ? "bg-purple-900 bg-opacity-30" : "bg-indigo-100"
              }`}>
                <div className={`p-3 rounded-full ${
                  darkMode ? "bg-purple-800" : "bg-indigo-200"
                }`}>
                  <UserIcon className={`w-6 h-6 ${darkMode ? "text-purple-200" : "text-indigo-700"}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? "text-purple-200" : "text-indigo-600"}`}>Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg backdrop-blur-md flex items-center gap-4 ${
                darkMode ? "bg-blue-900 bg-opacity-30" : "bg-blue-100"
              }`}>
                <div className={`p-3 rounded-full ${
                  darkMode ? "bg-blue-800" : "bg-blue-200"
                }`}>
                  <CurrencyDollarIcon className={`w-6 h-6 ${darkMode ? "text-blue-200" : "text-blue-700"}`} />
                </div>
                <div>
                  <p className={`text-sm ${darkMode ? "text-blue-200" : "text-blue-600"}`}>Total Credits</p>
                  <p className="text-2xl font-bold">
                    {users.reduce((sum, user) => sum + user.credits, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex justify-center items-center p-12">
                <motion.div 
                  className={`w-12 h-12 rounded-full border-4 border-t-transparent ${
                    darkMode ? "border-purple-500" : "border-indigo-600"
                  }`}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <table className="min-w-full">
                <thead>
                  <tr className={darkMode ? "bg-gray-900 bg-opacity-50" : "bg-indigo-50"}>
                    <th className={`p-4 text-left ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Username</th>
                    <th className={`p-4 text-left ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Credits</th>
                    <th className={`p-4 text-left ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Role</th>
                    <th className={`p-4 text-left ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Actions</th>
                  </tr>
                </thead>
                <motion.tbody
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {users.map((user) => (
                    <motion.tr 
                      key={user._id} 
                      variants={rowVariants}
                      className={`${
                        darkMode 
                          ? "hover:bg-gray-700 hover:bg-opacity-50" 
                          : "hover:bg-indigo-50"
                      } transition-colors ${activeRow === user._id ? (darkMode ? "bg-gray-700 bg-opacity-50" : "bg-indigo-100") : ""}`}
                      onMouseEnter={() => setActiveRow(user._id)}
                      onMouseLeave={() => setActiveRow(null)}
                    >
                      <td className="p-4 border-t border-opacity-20 border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                            darkMode 
                              ? "bg-purple-900 text-purple-200" 
                              : "bg-indigo-100 text-indigo-600"
                          }`}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.username}</span>
                        </div>
                      </td>
                      <td className="p-4 border-t border-opacity-20 border-gray-200">
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            value={editCredits[user._id] ?? user.credits}
                            onChange={(e) => handleCreditChange(user._id, e.target.value)}
                            className={`w-24 p-2 rounded-md border border-opacity-50 focus:outline-none focus:ring-2 ${
                              darkMode 
                                ? "bg-gray-800 bg-opacity-70 border-gray-600 text-white focus:ring-purple-500" 
                                : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-500"
                            }`}
                          />
                        </div>
                      </td>
                      <td className="p-4 border-t border-opacity-20 border-gray-200">
                        <span className={`px-3 py-1 text-sm rounded-full ${
                          user.role === "admin" 
                            ? (darkMode ? "bg-purple-900 bg-opacity-60 text-purple-200" : "bg-indigo-100 text-indigo-800") 
                            : (darkMode ? "bg-gray-800 bg-opacity-60 text-gray-300" : "bg-gray-100 text-gray-800")
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4 border-t border-opacity-20 border-gray-200">
                        <motion.button
                          onClick={() => handleUpdateCredits(user._id)}
                          className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                            darkMode 
                              ? "bg-purple-600 hover:bg-purple-700 text-white" 
                              : "bg-indigo-600 hover:bg-indigo-700 text-white"
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <CheckIcon className="w-4 h-4" />
                          <span>Update</span>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminPanel;