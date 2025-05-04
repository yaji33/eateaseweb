import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/state/authStore";
import { loginUser } from "@/services/authService";
//import Logo from "@/assets/logo.png";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "@/components/public/public-nav";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser(email, password);

      // Check if we have a valid role_id
      if (response.role_id === undefined) {
        throw new Error("Invalid account type received from server");
      }

      // Map role_id to role string
      let role: "admin" | "business" | "unknown" | null = null;
      if (response.role_id === 1) {
        role = "admin";
      } else if (response.role_id === 3) {
        role = "business";
      } else {
        console.warn(`Unexpected role_id received: ${response.role_id}`);
        role = "unknown";
      }

      const user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: role,
        token: response.token,
        restaurant_status: response.restaurant_status,
        restaurant_name: response.restaurant_name,
      };

      console.log(`🔑 Login successful for user: ${user.name} (${user.role})`);

      // Status-specific messaging for business accounts
      if (user.role === "business" && user.restaurant_status !== undefined) {
        switch (user.restaurant_status) {
          case 0:
            // This shouldn't happen because API blocks login for pending accounts
            console.log("Restaurant account pending approval");
            break;
          case 1:
            console.log("Restaurant account active but not launched");
            toast.success(
              "Login successful! Your restaurant is not yet launched on the app."
            );
            break;
          case 2:
            console.log("Restaurant account fully launched");
            toast.success("Login successful!");
            break;
          case 3:
            // This shouldn't happen because API blocks login for banned accounts
            console.log("Restaurant account banned");
            break;
          default:
            console.log(
              `Unexpected restaurant status: ${user.restaurant_status}`
            );
            toast.success("Login successful!");
        }
      } else {
        toast.success("Login successful!");
      }

      setTimeout(() => {
        login(user, navigate);

        // Differentiate logging based on role
        if (user.role === "business") {
          console.log(
            `🏪 Business account authenticated. Restaurant ID ${user.id}, Status: ${user.restaurant_status}`
          );
        } else if (user.role === "admin") {
          console.log(
            `👑 Admin account authenticated. Redirecting to admin dashboard.`
          );
        } else {
          console.log(
            `⚠️ Unknown role account authenticated. Check role_id mapping.`
          );
        }
      }, 500);
    } catch (err) {
      console.error("Login error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-md rounded-lg p-8"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Welcome back
                </h2>
                <p className="text-gray-600 mt-2">Sign in to your account</p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-md bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p className="text-sm font-medium">{error}</p>
                  {error.includes("pending approval") && (
                    <p className="text-xs mt-1">
                      Our team is reviewing your application. This usually takes
                      1-2 business days.
                    </p>
                  )}
                  {error.includes("suspended") && (
                    <p className="text-xs mt-1">
                      Your account has been suspended. Please contact support
                      for more information.
                    </p>
                  )}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary focus:border-transparent transition"
                    placeholder="yourname@example.com"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => navigate("/reset-password")}
                      className="text-xs text-brandPrimary hover:text-brandSecondary"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brandPrimary focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    className="h-4 w-4 text-brandPrimary border-gray-300 rounded focus:ring-brandPrimary"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-buttonPrimary hover:bg-brandPrimary text-white py-3 rounded-md font-medium transition duration-200 ease-in-out"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => navigate("/registration")}
                    className="font-medium text-brandPrimary hover:text-brandSecondary"
                  >
                    Register now
                  </button>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
