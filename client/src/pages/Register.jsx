import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animation

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, { username, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <motion.div
        className="bg-black bg-opacity-50 p-10 rounded-lg shadow-xl backdrop-blur-md w-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Create Your Account</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-200"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center text-white w-full border border-green-500 rounded-md">
            Already have an account?
          <button
            onClick={() => navigate("/login")}
            className="p-3 text-green-500 hover:text-green-200 transition duration-200"
          >
             Login here
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
