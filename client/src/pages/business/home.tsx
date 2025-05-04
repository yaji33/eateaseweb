/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import Banner from "@/assets/home-bg-img.jpg";
import axios from "axios";
import {
  CheckCircle,
  Circle,
  ChevronRight,
  //Clock,
  TrendingUp,
  ShoppingBag,
  Settings,
  Calendar,
  AlertCircle,
  Award,
  HelpCircle,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [businessName, setBusinessName] = useState(null);
  const [businessProgress, setBusinessProgress] = useState(0);
  const [bannerHovered, setBannerHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showTip, setShowTip] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [businessProfile, setBusinessProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [businessStatus, setBusinessStatus] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          setLoading(false);
          return;
        }

        // Fetch business profile
        const profileResponse = await axios.get(
          "http://localhost:5001/api/restaurants/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBusinessName(profileResponse.data.name);
        setBusinessProfile(profileResponse.data);
        setBusinessStatus(profileResponse.data.status || 0);

        // Fetch menu items
        const menuResponse = await axios.get("http://localhost:5001/api/menu", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMenuItems(menuResponse.data);

        // Calculate onboarding progress based on completed steps
        calculateProgress(profileResponse.data, menuResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Auto-hide tip after 10 seconds
    const tipTimer = setTimeout(() => {
      setShowTip(false);
    }, 10000);

    return () => clearTimeout(tipTimer);
  }, []);

  // Calculate progress based on completed steps
  const calculateProgress = (profile: { name: any; address: any; isVerified: any; status: number; }, menu: string | any[]) => {
    let completedSteps = 0;
    const totalSteps = 4;

    // Step 1: Business profile completion
    if (profile.name && profile.address) {
      completedSteps++;
    }

    // Step 2: Menu items
    if (menu && menu.length > 0) {
      completedSteps++;
    }

    // Step 3: Business verification
    if (profile.isVerified) {
      completedSteps++;
    }

    // Step 4: Business launch (status 2 means live)
    if (profile.status === 2) {
      completedSteps++;
    }

    setBusinessProgress(Math.round((completedSteps / totalSteps) * 100));
  };

  const handleMouseMove = (e: { currentTarget: any; clientX: number; clientY: number; }) => {
    const banner = e.currentTarget;
    const rect = banner.getBoundingClientRect();

    // Calculate relative position within the banner
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  // Get status text based on status code
  const getStatusText = (status: number) => {
    switch (status) {
      case 0:
        return "Pending Approval";
      case 1:
        return "Approved (Not Published)";
      case 2:
        return "Live";
      default:
        return "Unknown Status";
    }
  };

  // Get status color based on status code
  const getStatusColor = (status: number) => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-600";
      case 1:
        return "bg-blue-100 text-blue-600";
      case 2:
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const checklist = [
    {
      id: 1,
      label: "Complete your business profile",
      subtext: "Add your address, contact details, and business hours",
      done: businessProfile,
      link: "/business-profile",
      icon: Settings,
    },
    {
      id: 2,
      label: "Add your menu items",
      subtext: "Create your first menu with categories and items",
      done: menuItems.length > 0,
      link: "/business-menu",
      icon: ShoppingBag,
    },
    {
      id: 3,
      label: "Verify your business",
      subtext: "Submit your business documents for verification",
      //done: businessProfile.isVerified,
      link: "/business-verification",
      icon: Award,
    },
    {
      id: 4,
      label: "Launch your business",
      subtext: "Make your restaurant visible to customers",
      done: businessStatus === 2,
      link: "/business-profile",
      icon: Award,
    },
  ];

  const quickLinks = [
    {
      name: "Orders",
      icon: ShoppingBag,
      link: "/orders",
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Menu",
      icon: Calendar,
      link: "/business-menu",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Reports",
      icon: TrendingUp,
      link: "/reports",
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Help",
      icon: HelpCircle,
      link: "/support",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-16 pb-12 gap-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Banner */}
          <div
            className="relative w-full h-72 rounded-xl bg-cover bg-center shadow-md overflow-hidden transition-all duration-300"
            style={{
              backgroundImage: `url(${Banner})`,
              backgroundPosition: bannerHovered
                ? `${50 + (mousePosition.x - 50) * 0.05}% ${
                    50 + (mousePosition.y - 50) * 0.05
                  }%`
                : "50% 50%",
              transform: bannerHovered ? "scale(1.02)" : "scale(1)",
              boxShadow: bannerHovered
                ? "0 10px 30px rgba(0, 0, 0, 0.2)"
                : "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={() => setBannerHovered(true)}
            onMouseLeave={() => setBannerHovered(false)}
            onMouseMove={handleMouseMove}
          >
            <div className="absolute inset-0 bg-black opacity-40 rounded-xl"></div>
            {bannerHovered && (
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-white to-transparent opacity-10"></div>
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent opacity-10"></div>
                  <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent opacity-10"></div>
                  <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent opacity-10"></div>
                </div>
              </div>
            )}
            <div
              className="relative z-10 text-white flex flex-col justify-center h-full p-6 gap-2 transition-all duration-300"
              style={{
                transform: bannerHovered
                  ? "translateY(-4px)"
                  : "translateY(0px)",
              }}
            >
              <div className="flex items-center gap-3">
                <h1 className="text-3xl sm:text-4xl font-bold transition-all duration-300">
                  Welcome back, {businessName || "..."}!
                </h1>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    businessStatus
                  )}`}
                >
                  {getStatusText(businessStatus)}
                </div>
              </div>
              <p className="text-sm sm:text-base transition-all duration-300 max-w-md">
                Let's make today delicious. Your customers are waiting.
              </p>
              {bannerHovered && (
                <NavLink
                  to="/business-dashboard"
                  className="flex items-center gap-1 text-sm font-medium bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm mt-4 px-4 py-2 rounded-md w-fit transition-all duration-300"
                >
                  <span>Go to Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </NavLink>
              )}
            </div>
          </div>

          {/* Onboarding Progress */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Your Business Setup
              </h2>
              <div className="text-sm font-medium text-gray-500">
                {businessProgress}% Complete
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${businessProgress}%` }}
              ></div>
            </div>

            {/* Tip Box - Shows only if progress is less than 100% */}
            {showTip && businessProgress < 100 && (
              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg mb-6 animate-fadeIn">
                <div className="text-blue-500 mt-1">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-blue-800 text-sm">
                    Business Setup Tip
                  </h3>
                  <p className="text-blue-700 text-xs mt-1">
                    Complete all the onboarding steps to make your business
                    visible to customers. Each completed step brings you closer
                    to launching your restaurant!
                  </p>
                </div>
                <button
                  onClick={() => setShowTip(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Checklist */}
            <ul className="space-y-3">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-all duration-200 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 ${
                        item.done ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {item.done ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <span
                        className={`text-gray-800 font-medium ${
                          item.done ? "line-through opacity-60" : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      <p className="text-gray-500 text-xs mt-1">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                  {!item.done && (
                    <NavLink
                      to={item.link}
                      className="text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 px-5 py-2 rounded-md transition-colors duration-200 flex items-center gap-1"
                    >
                      <span>Complete</span>
                      <ChevronRight className="w-4 h-4" />
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {quickLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.link}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 flex flex-col items-center justify-center gap-2"
              >
                <div className={`p-2 rounded-full ${link.color}`}>
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {link.name}
                </span>
              </NavLink>
            ))}
          </div>

          {/* Dashboard Preview - Show actual data when status is Live 
          <div
            className={`${
              businessStatus === 2 ? "bg-white" : "bg-gray-50"
            } p-6 rounded-lg border ${
              businessStatus === 2
                ? "border-gray-200"
                : "border-dashed border-gray-300"
            } ${businessStatus === 2 ? "shadow-md" : "shadow-inner"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  {businessStatus === 2
                    ? "Your Dashboard"
                    : "Your Dashboard Preview"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {businessStatus === 2
                    ? "Track your restaurant's performance"
                    : "Once your business is live, you'll see your performance metrics here."}
                </p>
              </div>
              {businessStatus !== 2 && (
                <div className="flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Coming Soon</span>
                </div>
              )}
              {businessStatus === 2 && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Live</span>
                </div>
              )}
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-4 ${
                businessStatus !== 2 ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Revenue</span>
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                  {businessStatus === 2 ? "₱ 0.00" : "₱ ---,---"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Orders</span>
                  <ShoppingBag className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                  {businessStatus === 2 ? "0" : "---"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
              <div className="bg-white rounded-md p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 text-sm">Customers</span>
                  <Award className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl font-semibold text-gray-700">
                  {businessStatus === 2 ? "0" : "---"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Last 30 days</p>
              </div>
            </div>
          </div> */}

          {/* Footer */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Need help? Contact our support team</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
