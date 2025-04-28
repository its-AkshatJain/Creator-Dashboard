import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animation

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
            username,
            password,
          });
          

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials or some error");
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
        <h2 className="text-3xl mb-6 text-center text-white font-bold">Login to Your Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full p-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center text-white w-full border border-blue-500 rounded-md">
        Don't have an account?
          <button
            onClick={() => navigate("/register")}
            className="p-3 text-blue-500 hover:text-blue-200 transition duration-200"
          >
             Register here
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
