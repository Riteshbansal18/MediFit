import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user: data.user, role: data.role, token: data.token },
        });

        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error logging in!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-blue-600">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-xl shadow-xl w-full max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full p-3 bg-transparent border border-white/30 rounded-md text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition-all duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-white mt-4 text-center">
          Dont have an account?{" "}
          <Link to="/Signup" className="text-green-300 hover:text-green-400 transition-all">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;