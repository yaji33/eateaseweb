import{ useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import "@/index.css";
import axios from "axios";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const { userId, token } = useParams();
  const navigate = useNavigate();

  // Access environment variables correctly in Vite or use a default
  const API_URL =
    import.meta.env?.VITE_API_URL ||
    window.ENV_API_URL ||
    "http://localhost:5001";

  // Verify token on page load
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!userId || !token) {
          setError("Invalid reset link");
          setIsVerifying(false);
          return;
        }

        // Updated API path to match backend
        const response = await axios.get(
          `${API_URL}/api/auth/verify-reset-token/${userId}/${token}`
        );

        if (response.data.valid) {
          setIsTokenValid(true);
        } else {
          setError("This password reset link is invalid or has expired");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.error ||
              "This password reset link is invalid or has expired"
          );
        } else if (err instanceof Error) {
          setError(err.message || "An unexpected error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [userId, token, API_URL]);

  const handleResetPassword = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Updated API path to match backend
      const response = await axios.post(
        `${API_URL}/api/password/reset-password/${userId}/${token}`,
        { password }
      );

      setMessage(response.data.message || "Password reset successful!");

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Something went wrong. Please try again later."
        );
      } else if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white flex-col font-poppins px-4">
        <div className="flex items-center my-8 sm:my-12">
          <img src={Logo} alt="logo" className="w-10 sm:w-12" />
          <h1 className="font-bold text-2xl sm:text-3xl">
            <span className="text-brandPrimary">E</span>
            <span className="text-brandSecondary">Portal</span>
          </h1>
        </div>
        <p>Verifying your reset link...</p>
      </div>
    );
  }

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white flex-col font-poppins px-4">
        <div className="flex items-center my-8 sm:my-12">
          <img src={Logo} alt="logo" className="w-10 sm:w-12" />
          <h1 className="font-bold text-2xl sm:text-3xl">
            <span className="text-brandPrimary">E</span>
            <span className="text-brandSecondary">Portal</span>
          </h1>
        </div>
        <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate("/reset-password")}
            className="text-buttonPrimary"
          >
            Request a new password reset
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="font-medium text-lg mb-6">Set New Password</h1>

        {message && (
          <p className="text-green-600 text-sm text-center mb-3">{message}</p>
        )}
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        <form onSubmit={handleResetPassword} className="flex flex-col w-full">
          <input
            type="password"
            placeholder="New password"
            className="border p-4 rounded-md text-xs mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="border p-4 rounded-md text-xs mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            className="bg-buttonPrimary text-white py-3 rounded-md text-center w-full font-medium text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPasswordForm;
