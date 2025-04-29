// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  FiSave, 
  FiUpload, 
  FiLinkedin, 
  FiInstagram, 
  FiTwitter, 
  FiMail, 
  FiCreditCard, 
  FiUser 
} from "react-icons/fi";

const API = import.meta.env.VITE_SERVER_URL + "/api/users";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB client-side limit

export default function Profile() {
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState({
    username: "",
    profileImage: "",
    linkedin: "",
    instagram: "",
    twitter: "",
    gmail: "",
  });
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const token = localStorage.getItem("token");

  // Load on mount
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile((prev) => ({
          ...data.profile,
          username: data.username,
        }));
        setCredits(data.credits);
        if (data.dailyBonusGiven) {
          toast.success("You received 5 credits for today's login.");
        }
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);  

  // Handle image → Base64, with size check
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      return toast.error(
        `Image too large! Max ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)} MB allowed.`
      );
    }
    const reader = new FileReader();
    reader.onload = () =>
      setProfile((p) => ({ ...p, profileImage: reader.result }));
    reader.readAsDataURL(file);
  };

  // Save any field
  const handleSave = async (field) => {
    const value = profile[field];
    if (!value) return toast.error("Nothing to save.");
    
    setActiveField(field);
    try {
      const { data } = await axios.post(
        `${API}/update-profile`,
        { field, value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCredits(data.credits);
      toast.success(`Saved "${field}". Credits: ${data.credits}`);
    } catch {
      toast.error("Save failed. Try again.");
    } finally {
      setActiveField(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      darkMode 
        ? "bg-gradient-to-br from-gray-900 to-gray-800" 
        : "bg-gradient-to-br from-blue-50 to-indigo-100"
    }`}>
      {/* Animated background elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${
            darkMode ? "bg-blue-600/10" : "bg-blue-400/20"
          } blur-3xl`}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className={`absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full ${
            darkMode ? "bg-purple-600/10" : "bg-purple-400/20"
          } blur-3xl`}
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`glass-card relative overflow-hidden p-8 w-full max-w-md ${
          darkMode 
            ? "border border-white/10" 
            : "border border-white/30"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 border-4 rounded-full ${
                darkMode 
                  ? "border-blue-500 border-t-transparent" 
                  : "border-blue-600 border-t-transparent"
              }`}
            />
            <p className={`mt-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              Loading your profile...
            </p>
          </div>
        ) : (
          <>
            {/* Header with profile icon */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center mb-6 mt-16"
            >
              <div className={`p-3 rounded-full ${
                darkMode 
                  ? "bg-blue-500/20" 
                  : "bg-blue-500/10"
              }`}>
                <FiUser size={28} className={darkMode ? "text-blue-400" : "text-blue-600"} />
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className={`text-3xl font-bold text-center mb-2 ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Your Profile
            </motion.h1>
            {profile.username && (
                <p
                    variants={itemVariants}
                    className={`text-xl text-center mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                >
                    {profile.username}
                </p>
            )}
            <motion.div 
              variants={itemVariants}
              className={`flex items-center justify-center gap-2 mb-6 p-2 rounded-full w-fit mx-auto ${
                darkMode ? "bg-gray-800/70" : "bg-white/50"
              }`}
            >
              <FiCreditCard className={darkMode ? "text-yellow-300" : "text-yellow-600"} />
              <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                {credits} Credits
              </p>
            </motion.div>

            {/* Profile Image */}
            <motion.div 
              variants={itemVariants}
              className="mb-8"
            >
              <label className={`block mb-3 font-semibold ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Profile Image
              </label>
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 rounded-full overflow-hidden ${
                    darkMode 
                      ? "bg-gray-800" 
                      : "bg-white"
                  } shadow-lg border ${
                    darkMode 
                      ? "border-gray-700" 
                      : "border-gray-200"
                  }`}
                >
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiUser size={24} className={darkMode ? "text-gray-500" : "text-gray-400"} />
                    </div>
                  )}
                </motion.div>

                <div className="flex flex-col gap-2 flex-1">
                  {/* Hidden input + styled label */}
                  <motion.label 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded cursor-pointer text-sm flex items-center justify-center gap-2 ${
                      darkMode 
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-300" 
                        : "bg-white hover:bg-gray-100 text-gray-700"
                    } transition-colors shadow-md`}
                  >
                    <FiUpload size={16} />
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </motion.label>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSave("profileImage")}
                    disabled={!profile.profileImage || activeField === "profileImage"}
                    className={`flex items-center justify-center gap-2 p-2 rounded ${
                      darkMode 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white disabled:opacity-50 transition-colors shadow-md`}
                  >
                    {activeField === "profileImage" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <FiSave size={16} />
                        <span>Save Image</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
              <p className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Max file size: {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(1)} MB.
              </p>
            </motion.div>

            {/* Social Media Fields */}
            <div className="space-y-6">
              {[
                { key: "linkedin", label: "LinkedIn URL", type: "url", icon: <FiLinkedin /> },
                { key: "instagram", label: "Instagram URL", type: "url", icon: <FiInstagram /> },
                { key: "twitter", label: "Twitter URL", type: "url", icon: <FiTwitter /> },
                { key: "gmail", label: "Email Address", type: "email", icon: <FiMail /> },
              ].map(({ key, label, type, icon }) => (
                <motion.div 
                  key={key} 
                  variants={itemVariants}
                >
                  <label className={`block mb-2 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {label}
                  </label>
                  <div className="flex">
                    <div className={`px-3 flex items-center ${
                      darkMode 
                        ? "bg-gray-800 text-gray-400" 
                        : "bg-gray-100 text-gray-500"
                    } rounded-l-md border-y border-l ${
                      darkMode ? "border-gray-700" : "border-gray-300"
                    }`}>
                      {icon}
                    </div>
                    <input
                      type={type}
                      value={profile[key]}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, [key]: e.target.value }))
                      }
                      className={`flex-1 p-2 focus:outline-none focus:ring-1 ${
                        darkMode 
                          ? "bg-gray-800 text-white border-gray-700 focus:ring-blue-500" 
                          : "bg-white text-gray-800 border-gray-300 focus:ring-blue-400"
                      } border-y`}
                      placeholder={
                        type === "email"
                          ? "you@example.com"
                          : "https://example.com/…"
                      }
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSave(key)}
                      disabled={!profile[key] || activeField === key}
                      className={`px-3 rounded-r-md border-y border-r ${
                        darkMode 
                          ? "bg-green-600 hover:bg-green-700 border-green-700" 
                          : "bg-green-500 hover:bg-green-600 border-green-600"
                      } text-white disabled:opacity-50 flex items-center justify-center`}
                    >
                      {activeField === key ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                      ) : (
                        <FiSave size={18} />
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}