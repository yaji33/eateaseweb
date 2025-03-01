import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "@/assets/logo-1.png";
import "@/index.css";
import Illustration from "@/assets/illustration.png";
import Phone from "@/components/phone-input";
import { Label } from "recharts";

const Registration = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zip, setZip] = useState("");
  const [openTime, setOpenTime] = useState("");
  const [closeTime, setCloseTime] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/restaurants",
        {
          owner_name: fullName,
          name,
          address: { street, city, province, zip },
          contact,
          operating_hours: { open: openTime, close: closeTime },
          email,
          password,
        }
      );

      alert("Registration successful!");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full flex justify-between items-center p-3 bg-white shadow-sm px-2 sm:px-8 z-50">
        <div className="flex items-center">
          <img src={Logo} alt="logo" className="w-6" />
          <h1 className="font-bold text-xl ml-2">
            <span className="text-color_eat">Eat</span>
            <span className="text-color_ease">Ease</span>
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
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-background font-poppins px-4 pt-20">
        <div className="flex flex-col sm:flex-row gap-7 sm:justify-between w-full max-w-6xl">
          {/* Registration Form */}
          <div className="w-full sm:w-full max-w-sm bg-white p-6 rounded-lg shadow-md h-auto md:w-1/2 form-container">
            <h1 className="font-medium text-lg my-6">Create your business account</h1>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <form className="flex flex-col w-full " onSubmit={handleSubmit}>
              <div className="gap-3 w-full flex flex-col text-xs">
                <div className="flex flex-col gap-1">
                  <label>Business Name</label>
                  <input
                    type="text"
                    placeholder="Enter business name"
                    className="border p-3 rounded-md"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Street</label>
                  <input
                    type="text"
                    placeholder="Enter street"
                    className="border p-3 rounded-md"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className="border p-3 rounded-md"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Province</label>
                  <input
                    type="text"
                    placeholder="Enter province"
                    className="border p-3 rounded-md"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>ZIP Code</label>
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    className="border p-3 rounded-md"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Opening Time</label>
                  <input
                    type="time"
                    className="border p-3 rounded-md"
                    placeholder="Opening Time"
                    value={openTime}
                    onChange={(e) => setOpenTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Closing Time</label>
                  <input
                    type="time"
                    className="border p-3 rounded-md"
                    value={closeTime}
                    onChange={(e) => setCloseTime(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Owner Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter owner full name"
                    className="border p-3 rounded-md"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="border p-3 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="border p-3 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label>Phone Number</label>
                  <Phone
                    className="text-xs"
                    onChange={(value) => setContact(value || "")}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-primary_btn text-white py-3 rounded-md text-center w-full font-medium text-sm mt-14"
                disabled={loading}
              >
                {loading ? "Registering..." : "Get in touch now!"}
              </button>
            </form>
          </div>

          {/* Promotional Text Section */}
          <div className="w-full text-center sm:text-left px-4 mt-8 sm:mt-0 ">
            <p className="text-3xl font-semibold text-gray-700 mb-10">
              Your Restaurant,{" "}
              <span className="text-color_ease">Your Rules</span> – Join the
              Future of Online Ordering!
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
