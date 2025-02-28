import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import "@/index.css";
// import { loginUser } from "../../services/authService";
// import { useAuthStore } from "../../state/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // const { user, setUser } = useAuthStore(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); 

    try {
      
      const user = { email, role: "admin" }; 

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "business") {
        navigate("/business/dashboard");
      } else {
        navigate("/login");
      }

      // setUser(user); // Uncomment when auth store is ready
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white flex-col font-poppins px-4">
      {/* Logo */}
      <div className="flex items-center my-8 sm:my-12">
        <img src={Logo} alt="logo" className="w-10 sm:w-12" />
        <h1 className="font-bold text-2xl sm:text-3xl">
          <span className="text-color_eat">E</span>
          <span className="text-color_ease">Portal</span>
        </h1>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col items-center">
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

            <button className="mb-6 text-right text-xs text-primary_btn">
              Forgot your password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-primary_btn text-white py-3 rounded-md text-center w-full font-medium text-sm"
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
        <button className="border border-primary_btn text-black py-3 rounded-md w-full font-medium text-sm">
          Login with phone number
        </button>

        {/* Terms & Policy */}
        <p className="text-xs items-center py-3">
          By continuing you agree to our
          <span className="text-highlight_btn mx-1">terms of use</span>
          and
          <span className="text-highlight_btn mx-1">privacy policy</span>.
        </p>

        {/* Signup Redirect */}
        <div className="flex items-center gap-1 text-sm justify-center w-full my-4 mt-10">
          <p>Don't have an account?</p>
          <button
            className="text-primary_btn font-medium"
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
