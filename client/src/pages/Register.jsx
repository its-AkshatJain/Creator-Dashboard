import { useState } from "react";
import { useTheme } from "../context/ThemeContext"; // Add this import
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FiUser, FiLock, FiUserPlus, FiArrowLeft } from "react-icons/fi";

function Register() { // Remove darkMode prop
  const { darkMode } = useTheme(); // Get darkMode from context
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, { 
        username, 
        password 
      });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  // Floating elements for visual interest
  const floatingElements = [
    { size: "w-24 h-24", delay: 0, duration: 15, position: "top-1/4 -left-12" },
    { size: "w-32 h-32", delay: 2, duration: 20, position: "bottom-1/4 -right-16" },
    { size: "w-16 h-16", delay: 5, duration: 12, position: "top-3/4 left-1/4" },
    { size: "w-20 h-20", delay: 8, duration: 18, position: "top-1/3 right-1/4" },
  ];

  return (
    <div className={`flex justify-center items-center min-h-screen relative overflow-hidden py-20 ${
      darkMode 
        ? "bg-gradient-to-r from-gray-900 via-black to-gray-900" 
        : "bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50"
    }`}>
      {/* Animated floating elements in background */}
      {floatingElements.map((el, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full blur-3xl opacity-20 ${el.size} ${el.position} ${
            darkMode 
              ? index % 2 === 0 ? "bg-purple-500" : "bg-blue-500"
              : index % 2 === 0 ? "bg-indigo-300" : "bg-blue-300"
          }`}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Card with glassmorphism effect */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`glass-card relative w-full max-w-md mx-4 p-8 ${
          darkMode 
            ? "border border-white/10" 
            : "border border-white/30"
        }`}
      >
        {/* Logo/Brand */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center mb-6"
        >
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            darkMode 
              ? "bg-gradient-to-br from-purple-500 to-blue-600" 
              : "bg-gradient-to-br from-indigo-400 to-blue-500"
          }`}>
            <FiUserPlus className="text-white" size={32} />
          </div>
        </motion.div>

        <motion.h2 
          variants={itemVariants}
          className={`text-3xl mb-8 text-center font-bold ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Create Your Account
        </motion.h2>

        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit} 
          className="flex flex-col gap-6"
        >
          {/* Username field */}
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              <FiUser size={18} />
            </div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg ${
                darkMode 
                  ? "bg-gray-800/70 text-white border border-gray-700 focus:border-purple-500" 
                  : "bg-white/70 text-gray-800 border border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-2 ${
                darkMode ? "focus:ring-purple-500/30" : "focus:ring-blue-500/40"
              } transition-all duration-200`}
            />
          </div>
          
          {/* Password field */}
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              <FiLock size={18} />
            </div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pl-10 rounded-lg ${
                darkMode 
                  ? "bg-gray-800/70 text-white border border-gray-700 focus:border-purple-500" 
                  : "bg-white/70 text-gray-800 border border-gray-200 focus:border-blue-500"
              } focus:outline-none focus:ring-2 ${
                darkMode ? "focus:ring-purple-500/30" : "focus:ring-blue-500/40"
              } transition-all duration-200`}
            />
          </div>
          
          {/* Register button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg flex items-center justify-center space-x-2 ${
              darkMode 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500" 
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500"
            } text-white shadow-lg ${
              darkMode ? "shadow-purple-500/30" : "shadow-blue-500/30"
            } disabled:opacity-70 transition-all duration-200`}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <FiUserPlus size={18} />
                <span>Create Account</span>
              </>
            )}
          </motion.button>
        </motion.form>
        
        {/* Divider */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center my-6"
        >
          <div className={`flex-grow border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
          <span className={`px-4 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>OR</span>
          <div className={`flex-grow border-t ${darkMode ? "border-gray-700" : "border-gray-300"}`}></div>
        </motion.div>
        
        {/* Login link */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
            Already have an account?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/login")}
            className={`mt-3 w-full p-3 rounded-lg flex items-center justify-center space-x-2 ${
              darkMode 
                ? "bg-gray-800 hover:bg-gray-700 border border-gray-700" 
                : "bg-white hover:bg-gray-50 border border-gray-200"
            } ${
              darkMode ? "text-purple-400" : "text-blue-600"
            } transition-all duration-200`}
          >
            <FiArrowLeft size={18} />
            <span>Login Instead</span>
          </motion.button>
        </motion.div>
        
        {/* Footer text */}
        <motion.p 
          variants={itemVariants}
          className={`mt-8 text-center text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}
        >
          By registering, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}

export default Register;