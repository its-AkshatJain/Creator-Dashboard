// src/pages/Saved.jsx
import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { BookmarkIcon, FlagIcon, ShareIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Saved() {
  const { darkMode } = useTheme();
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_SERVER_URL}/api/users/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => setPosts(res.data))
      .catch(() => toast.error("Failed to load saved posts"));
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

  if (!posts.length)
    return (
      <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-24 p-6 text-center text-lg"
        >
          No saved posts yet.
        </motion.p>
      </div>
    );

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-6`}>
      <motion.div 
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          variants={itemVariants}
          className="text-2xl font-bold mb-6 mt-16"
        >
          Saved Posts
        </motion.h1>

        <motion.div 
          variants={containerVariants}
          className="grid md:grid-cols-2 gap-6"
        >
          {posts.map(p => (
            <motion.div 
              key={p.id} 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className={`backdrop-blur-lg rounded-lg shadow-lg border border-opacity-30 ${
                darkMode 
                  ? "bg-gray-800 bg-opacity-20 border-gray-700" 
                  : "bg-white bg-opacity-20 border-gray-200"
              } overflow-hidden`}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">
                    {p.title || p.content.slice(0,50)+"…"}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-200 text-gray-700"
                  }`}>
                    {p.platform}
                  </span>
                </div>
                <p className={`whitespace-pre-line mb-3 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {p.content}
                </p>
                <div className="flex gap-4 text-gray-500">
                  <motion.a 
                    href={p.url} 
                    target="_blank" 
                    className={`hover:text-blue-600 transition-colors`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ShareIcon className="w-5 h-5" />
                  </motion.a>
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookmarkIcon className="w-5 h-5 text-blue-500" />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}