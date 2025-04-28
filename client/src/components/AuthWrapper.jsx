import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { motion } from "framer-motion";

function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-96 flex flex-col items-center"
      >
        <h2 className="text-3xl font-bold text-white mb-6">{isLogin ? "Login" : "Register"}</h2>
        
        {isLogin ? <Login /> : <Register onSwitchToLogin={toggleForm} />}
        
        <p className="text-white mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="underline font-semibold hover:text-gray-300"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

export default AuthWrapper;
