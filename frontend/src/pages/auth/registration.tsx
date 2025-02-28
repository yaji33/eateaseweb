import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@/assets/logo.png";
import "@/index.css";
import Illustration from "@/assets/illustration.png";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <>
     
      <nav className="fixed top-0 w-full flex justify-between items-center p-3 bg-white shadow-sm px-2 sm:px-8 z-50">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="w-8" />
          <h1 className="font-bold text-xl ml-2">
            <span className="text-color_eat">E</span>
            <span className="text-color_ease">Portal</span>
          </h1>
        </div>

        <button
          className="bg-primary_btn text-white px-4 p-1 rounded-md text-sm font-medium"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </nav>

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen bg-background font-poppins px-4 pt-20">
        <div className="flex flex-col sm:flex-row gap-7 sm:justify-between w-full max-w-6xl">
          {/* Registration Form */}
          <div className="w-full sm:w-1/2 max-w-sm bg-white p-6 rounded-lg shadow-md">
            <h1 className="font-medium text-lg my-6">Create your account</h1>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <form className="flex flex-col w-full">
              <div className="gap-3 w-full flex flex-col text-xs">
                <input
                  type="text"
                  placeholder="Business Name"
                  className="border p-4 rounded-md"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Establishment Address"
                  className="border p-4 rounded-md"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Owner First Name"
                  className="border p-4 rounded-md"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Owner Last Name"
                  className="border p-4 rounded-md"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="border p-4 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-4 rounded-md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-primary_btn text-white py-3 rounded-md text-center w-full font-medium text-sm mt-4"
              >
                Get in touch now!
              </button>
            </form>
          </div>

          {/* Promotional Text Section */}
          <div className="w-full text-center sm:text-left px-4 mt-8 sm:mt-0 ">
            <p className="text-3xl font-semibold text-gray-700 mb-10">
              Your Restaurant, <span className="text-color_ease">Your Rules</span> – Join the Future of
              Online Ordering!
            </p>
            <p>
              Take full control of your eatery with our decentralized platform
              designed for every kind of eatery - may it be big or small, we got
              you! Manage your menu, receive real-time orders, handle payments
              seamlessly, and connect directly with customers – all without
              third-party interference.
            </p>
            <img
              src={Illustration}
              alt="illustration"
              className="w-full mt-8"  
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
