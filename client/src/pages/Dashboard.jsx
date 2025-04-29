import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Feed from "./Feed";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const [me, setMe] = useState({
    credits: 0,
    savedPosts: [],
    reportedPosts: [],
    analytics: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => setMe(data))
      .catch(() => navigate("/login"));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-6`}>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* Header - Removed theme toggle button */}
        <motion.div 
          variants={itemVariants} 
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mt-16">Dashboard</h1>
        </motion.div>

        {/* Credit Stats */}
        <motion.div 
          variants={itemVariants}
          className={`backdrop-blur-lg bg-opacity-20 border border-opacity-30 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } p-6 rounded-lg shadow-lg flex justify-between backdrop-filter`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div>
            <h2 className="text-xl font-semibold">Your Credits</h2>
            <motion.p 
              className="text-3xl font-bold"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {me.credits}
            </motion.p>
          </div>
          {me.analytics && (
            <div className="text-right">
              <h2 className="text-xl font-semibold">Admin Analytics</h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p>Total Users: {me.analytics.totalUsers}</p>
                <p>Total Saves: {me.analytics.totalSaved}</p>
                <p>Total Reports: {me.analytics.totalReported}</p>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Recent Saved & Reported */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div 
            className={`backdrop-blur-lg bg-opacity-20 border border-opacity-30 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } p-6 rounded-lg shadow-lg backdrop-filter`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h3 className="font-semibold mb-4">Recent Saved Posts</h3>
            {me.savedPosts.length ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {me.savedPosts.map((p, i) => (
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={p.url}
                    target="_blank"
                    className={`block p-2 rounded mb-2 transition-all ${
                      darkMode 
                        ? "hover:bg-gray-700 hover:bg-opacity-50" 
                        : "hover:bg-gray-100"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {p.title || p.content.slice(0, 60) + "..."}
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No saved posts yet</p>
            )}
          </motion.div>
          <motion.div 
            className={`backdrop-blur-lg bg-opacity-20 border border-opacity-30 ${
              darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } p-6 rounded-lg shadow-lg backdrop-filter`}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <h3 className="font-semibold mb-4">Recent Reported Posts</h3>
            {me.reportedPosts.length ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {me.reportedPosts.map((p, i) => (
                  <motion.a
                    key={i}
                    variants={itemVariants}
                    href={p.url}
                    target="_blank"
                    className={`block p-2 rounded mb-2 transition-all ${
                      darkMode 
                        ? "hover:bg-gray-700 hover:bg-opacity-50" 
                        : "hover:bg-gray-100"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {p.title || p.content.slice(0, 60) + "..."}
                  </motion.a>
                ))}
              </motion.div>
            ) : (
              <p className={darkMode ? "text-gray-400" : "text-gray-500"}>No reported posts yet</p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}