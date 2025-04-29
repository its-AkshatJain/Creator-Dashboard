import { motion } from "framer-motion";
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaHeart 
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

export default function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`mt-12 py-8 relative overflow-hidden ${
        darkMode 
          ? "bg-gray-900/70 text-gray-300" 
          : "bg-white/20 text-gray-700"
      } backdrop-blur-lg`}
    >
      {/* Glassmorphism effect elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -inset-[10px] backdrop-blur-xl ${
          darkMode ? "bg-gray-900/30" : "bg-white/30"
        }`}></div>
        <div className={`absolute top-0 left-0 w-32 h-32 rounded-full -translate-x-1/2 -translate-y-1/2 ${
          darkMode ? "bg-blue-500/20" : "bg-blue-300/20"
        }`}></div>
        <div className={`absolute bottom-0 right-0 w-40 h-40 rounded-full translate-x-1/3 translate-y-1/3 ${
          darkMode ? "bg-purple-500/20" : "bg-purple-300/20"
        }`}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: company info */}
          <div className="flex flex-col items-center md:items-start">
            <motion.h3 
              whileHover={{ scale: 1.05 }}
              className={`text-xl font-bold mb-2 ${
                darkMode ? "text-blue-400" : "text-blue-600"
              }`}
            >
              CreatorDash
            </motion.h3>
            <p className="text-sm text-center md:text-left">
              Empowering creators to reach new heights
            </p>
          </div>

          {/* Middle: links */}
          <div className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 mb-4"
            >
              <FaHeart className={darkMode ? "text-red-400" : "text-red-500"} />
              <span className="font-medium">Made with passion</span>
            </motion.div>
            
            <div className="text-sm flex flex-col items-center space-y-2">
              <motion.a 
                whileHover={{ x: 3 }}
                href="/privacy" 
                className={`hover:${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } transition-colors`}
              >
                Privacy Policy
              </motion.a>
              <motion.a 
                whileHover={{ x: 3 }}
                href="/terms" 
                className={`hover:${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } transition-colors`}
              >
                Terms of Service
              </motion.a>
            </div>
          </div>

          {/* Right: social icons */}
          <div className="flex flex-col items-center md:items-end">
            <h4 className="font-medium mb-3">Connect with us</h4>
            <div className="flex space-x-4">
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://github.com/its-AkshatJain"
                target="_blank"
                rel="noopener"
                className={`${
                  darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-black"
                } transition-colors`}
              >
                <FaGithub size={22} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://www.linkedin.com/in/its-akshat-jain"
                target="_blank"
                rel="noopener"
                className={`${
                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                } transition-colors`}
              >
                <FaLinkedin size={22} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="https://x.com/Akshat_Jain_04"
                target="_blank"
                rel="noopener"
                className={`${
                  darkMode ? "text-blue-400 hover:text-blue-300" : "text-blue-500 hover:text-blue-400"
                } transition-colors`}
              >
                <FaTwitter size={22} />
              </motion.a>
              <motion.a
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                href="mailto:akshat.jain.contact@gmail.com"
                className={`${
                  darkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-400"
                } transition-colors`}
              >
                <FaEnvelope size={22} />
              </motion.a>
            </div>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className={`mt-8 pt-4 border-t ${
          darkMode ? "border-gray-700/30" : "border-gray-300/50"
        } text-center text-sm`}>
          <p>
            &copy; {currentYear} CreatorDash. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}