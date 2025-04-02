import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import "@/index.css";
import { loginUser } from "@/services/authService";

import { useAuthStore } from "@/state/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuthStore(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    console.log("Attempting login with:", { email, password });

    try {
      const response = await loginUser(email, password);
      console.log("Login successful:", response);

      const user = {
        id: response.id,
        name: response.name,
        role: response.role_id === 1 ? "admin" : "business",
        token: response.token,
      };
      login(user, navigate);
      //navigate(user.role === "admin" ? "/dashboard" : "/business-home");

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-white flex-col font-poppins px-4">
      {/* Logo */}
      <div className="flex items-center my-8 sm:my-12">
        <img src={Logo} alt="logo" className="w-10 sm:w-12" />
        <h1 className="font-bold text-2xl sm:text-3xl">
          <span className="text-brandPrimary">E</span>
          <span className="text-brandSecondary">Portal</span>
        </h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center sm:text-center">
        <h1 className="font-medium text-lg  my-6">Login to your account</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col w-full">
          <div className="gap-3 w-full flex flex-col text-xs">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              className="border p-4 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="border p-4 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />

            <button className="mb-6 text-right text-xs text-buttonPrimary">
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-buttonPrimary text-white py-3 rounded-md text-center w-full font-medium text-sm"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center w-full my-4">
          <span className="flex-1 border-t border-gray-300"></span>
          <span className="px-2 text-gray-500">Or</span>
          <span className="flex-1 border-t border-gray-300"></span>
        </div>

        {/* Login with Phone */}
        <button className="border border-buttonPrimary text-black py-3 rounded-md w-full font-medium text-sm">
          Login with phone number
        </button>

        {/* Terms & Policy */}
        <p className="text-xs text-center py-3 sm:w-full">
          By continuing you agree to our
          <span className="text-buttonHighlight mx-1 cursor-pointer">
            {" "}
            terms of use
          </span>
          and
          <span className="text-buttonHighlight mx-1 cursor-pointer">
            {" "}
            privacy policy
          </span>
          .
        </p>

        {/* Signup Redirect */}
        <div className="flex items-center gap-1 text-sm justify-center w-full my-4 mt-10">
          <p>Don't have an account?</p>
          <button
            className="text-buttonPrimary font-medium"
            onClick={() => navigate("/registration")}
          >
            Partner with us!
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
