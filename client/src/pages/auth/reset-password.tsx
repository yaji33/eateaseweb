import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import "@/index.css";
// import { sendResetEmail } from "@/services/authService"; // <- Optional for backend hook

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      console.log("Sending reset email to:", email);
      // await sendResetEmail(email); // Optional: your backend call
      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      console.error("Reset error:", err);
      setError("Something went wrong. Please try again later.");
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

      {/* Reset Form */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center sm:text-center">
        <h1 className="font-medium text-lg mb-6">Reset your password</h1>

        {message && (
          <p className="text-green-600 text-sm text-center mb-3">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleReset} className="flex flex-col w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="border p-4 rounded-md text-xs mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="bg-buttonPrimary text-white py-3 rounded-md text-center w-full font-medium text-sm"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <button
          onClick={() => navigate("/login")}
          className="text-xs text-buttonPrimary mt-6"
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
