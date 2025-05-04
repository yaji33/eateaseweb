import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//import Logo from "@/assets/logo-1.png";
import "@/index.css";
import Illustration from "@/assets/illustration.png";
import Phone from "@/components/phone-input";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import Navbar from "@/components/public/public-nav";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    email: "",
    street: "",
    city: "",
    province: "",
    zip: "",
    openTime: "",
    closeTime: "",
    contact: "",
    password: "",
  });

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePhoneChange = (value: any) => {
    setFormData((prev) => ({ ...prev, contact: value || "" }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const registrationData = {
        owner_name: formData.fullName,
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          province: formData.province,
          zip: formData.zip,
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
        contact: formData.contact,
        operating_hours: { open: formData.openTime, close: formData.closeTime },
        email: formData.email,
        password: formData.password,
      };

      await axios.post(
        "http://localhost:5001/api/restaurants",
        registrationData
      );

      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Something went wrong");
      } else if (err instanceof Error) {
        toast.error(err.message || "Something went wrong");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const canProceedStep1 =
    formData.name && formData.fullName && formData.email && formData.password;
  const canProceedStep2 =
    formData.street && formData.city && formData.province && formData.zip;

  const renderFormStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-lg font-medium mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Business Name*</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter business name"
                  className="border p-3 rounded-md"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Owner Full Name*</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter owner full name"
                  className="border p-3 rounded-md"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Email*</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="border p-3 rounded-md"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Password*</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="border p-3 rounded-md"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-lg font-medium mb-4">Location Details</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Street*</label>
                <input
                  type="text"
                  name="street"
                  placeholder="Enter street"
                  className="border p-3 rounded-md"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">City*</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    className="border p-3 rounded-md"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Province*</label>
                  <input
                    type="text"
                    name="province"
                    placeholder="Enter province"
                    className="border p-3 rounded-md"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">ZIP Code*</label>
                <input
                  type="text"
                  name="zip"
                  placeholder="Enter ZIP code"
                  className="border p-3 rounded-md"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-lg font-medium mb-4">Contact & Hours</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Phone Number*</label>
                <Phone
                  className="text-sm"
                  onChange={handlePhoneChange}
                  defaultCountry="PH"
                  value={formData.contact}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Opening Time</label>
                  <input
                    type="time"
                    name="openTime"
                    className="border p-3 rounded-md"
                    value={formData.openTime}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium">Closing Time</label>
                  <input
                    type="time"
                    name="closeTime"
                    className="border p-3 rounded-md"
                    value={formData.closeTime}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-background font-poppins px-4 pt-14">
        <div className="flex flex-col lg:flex-row gap-12 w-full max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full lg:w-2/5 bg-white p-6 rounded-lg shadow-md"
          >
            <div className="mb-6">
              <h1 className="font-semibold text-xl">
                Create your business account
              </h1>
              <p className="text-gray-500 text-sm mt-1">Step {step} of 3</p>

              <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                <div
                  className="bg-brandSecondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm p-3 bg-red-50 rounded-md mb-4">
                {error}
              </div>
            )}

            <form className="flex flex-col w-full" onSubmit={handleSubmit}>
              {renderFormStep()}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                  >
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}
                    className="ml-auto bg-buttonPrimary text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto bg-buttonPrimary text-white px-4 py-2 rounded-md text-sm font-medium"
                    disabled={loading || !formData.contact}
                  >
                    {loading ? "Registering..." : "Complete Registration"}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          <div className="w-full lg:w-3/5 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <h1 className="text-3xl font-semibold text-gray-700 mb-6">
                Your Restaurant,{" "}
                <span className="text-brandSecondary">Your Rules</span>- Join
                the Future of Online Ordering!
              </h1>

              <p className="text-gray-600 py-10">
                Take full control of your eatery with our decentralized platform
                designed for every kind of eatery - may it be big or small, we
                got you! Manage your menu, receive real-time orders, handle
                payments seamlessly, and connect directly with customers – all
                without third-party interference.
              </p>

              <img
                src={Illustration}
                alt="Restaurant management illustration"
                className="w-full mx-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
