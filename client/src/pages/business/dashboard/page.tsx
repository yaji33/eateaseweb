import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  //PieChart,
  //Pie,
  //Cell,
  //Legend,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  //Users,
  Utensils,
  DollarSign,
  //Clock,
  Star,
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import { ValueType } from "recharts/types/component/DefaultTooltipContent";

interface RevenueData {
  period: string;
  revenue: number;
}

interface OrdersData {
  period: string;
  orders: number;
}

interface PeakHoursData {
  time: string;
  customers: number;
}

interface DashboardData {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  percentageChanges: {
    revenue: number;
    orders: number;
    avgOrder: number;
    rating: number;
  };
  revenueData: RevenueData[];
  ordersData: OrdersData[];
  peakHoursData: PeakHoursData[];
}

// Sample data for the pie chart - keeping this as requested
{
  /*const topDishesData = [
  { name: "Pasta Carbonara", value: 120 },
  { name: "Grilled Salmon", value: 80 },
  { name: "Chicken Parmesan", value: 70 },
  { name: "Caesar Salad", value: 50 },
  { name: "Beef Steak", value: 40 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A60000"];*/
}

const dateRangeOptions = ["Today", "This Week", "This Month", "This Year"];

function RestaurantDashboard() {
  const [dateRange, setDateRange] = useState("This Month");
  const [loading, setLoading] = useState(true);
  const [showDateRangeDropdown, setShowDateRangeDropdown] = useState(false);
  const [restaurantProfile, setRestaurantProfile] = useState({
    name: "",
    rating: 0,
    rating_count: 0,
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    percentageChanges: {
      revenue: 0,
      orders: 0,
      avgOrder: 0,
      rating: 0,
    },
    revenueData: [],
    ordersData: [],
    peakHoursData: [],
  });

  useEffect(() => {
    // Fetch restaurant profile and payment data
    Promise.all([fetchRestaurantProfile(), fetchDashboardData()]);
  }, [dateRange]);

  const fetchRestaurantProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5001/api/restaurants/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRestaurantProfile({
        name: res.data.name || "Bella Cucina",
        rating: res.data.rating || 0,
        rating_count: res.data.rating_count || 0,
      });
    } catch (err) {
      console.error("Failed to fetch restaurant profile:", err);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5001/api/payments", {
        headers: { Authorization: `Bearer ${token}` },
        params: { period: dateRange.toLowerCase().replace(" ", "_") },
      });

      // Process payment data
      const payments = res.data || [];
      const totalRevenue = payments.reduce(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sum: any, payment: { totalPayment: any }) =>
          sum + payment.totalPayment,
        0
      );
      const totalOrders = payments.length;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const revenueByPeriod = processRevenueData(payments, dateRange);
      const ordersByPeriod = processOrdersData(payments, dateRange);
      const peakHoursData = processTimeData(payments);

      setDashboardData({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        percentageChanges: {
          revenue: 0, // Will calculate if we have previous period data
          orders: 0,
          avgOrder: 0,
          rating: 0,
        },
        revenueData: revenueByPeriod,
        ordersData: ordersByPeriod,
        peakHoursData,
      });
    } catch (err) {
      console.error("Failed to fetch payments data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to process revenue data
  const processRevenueData = (
    payments: { createdAt: string; totalPayment: number }[],
    dateRange: string
  ): RevenueData[] => {
    if (!payments || payments.length === 0) return [];

    // Group payments by period based on date range
    const revenueMap = new Map();

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      let period;

      if (dateRange === "Today") {
        period = format(date, "ha");
      } else if (dateRange === "This Week") {
        period = format(date, "EEE");
      } else if (dateRange === "This Month") {
        period = format(date, "d");
      } else {
        period = format(date, "MMM"); // e.g., "Jan"
      }

      const currentAmount = revenueMap.get(period) || 0;
      revenueMap.set(period, currentAmount + payment.totalPayment);
    });

    // Convert map to array and sort by period
    const result: RevenueData[] = Array.from(
      revenueMap,
      ([period, revenue]) => ({
        period,
        revenue,
      })
    );

    // If period is numeric (day of month), sort numerically
    if (dateRange === "This Month") {
      result.sort((a, b) => parseInt(a.period) - parseInt(b.period));
    }

    return result;
  };

  // Helper function to process orders data
  const processOrdersData = (
    payments: { createdAt: string }[], // Define the type of `payments`
    dateRange: string // Define the type of `dateRange`
  ): OrdersData[] => {
    if (!payments || payments.length === 0) return [];

    // Group orders by period based on date range
    const ordersMap = new Map<string, number>();

    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      let period;

      if (dateRange === "Today") {
        period = format(date, "ha"); // e.g., "10AM"
      } else if (dateRange === "This Week") {
        period = format(date, "EEE"); // e.g., "Mon"
      } else if (dateRange === "This Month") {
        period = format(date, "d"); // e.g., "15"
      } else {
        period = format(date, "MMM"); // e.g., "Jan"
      }

      const currentCount = ordersMap.get(period) || 0;
      ordersMap.set(period, currentCount + 1);
    });

    // Convert map to array and sort by period
    const result = Array.from(ordersMap, ([period, orders]) => ({
      period,
      orders,
    }));

    // If period is numeric (day of month), sort numerically
    if (dateRange === "This Month") {
      result.sort((a, b) => parseInt(a.period) - parseInt(b.period));
    }

    return result;
  };

  const processTimeData = (
    payments: { createdAt: string }[]
  ): PeakHoursData[] => {
    if (!payments || payments.length === 0) return [];

    const timeMap = new Map<string, number>();

    // Initialize all hours (24-hour format)
    for (let i = 0; i < 24; i++) {
      const hour =
        i < 12 ? `${i === 0 ? 12 : i} AM` : `${i === 12 ? 12 : i - 12} PM`;
      timeMap.set(hour, 0);
    }

    // Count orders by hour
    payments.forEach((payment) => {
      const date = new Date(payment.createdAt);
      const hour = date.getHours();
      const timeString =
        hour < 12
          ? `${hour === 0 ? 12 : hour} AM`
          : `${hour === 12 ? 12 : hour - 12} PM`;

      const currentCount = timeMap.get(timeString) || 0;
      timeMap.set(timeString, currentCount + 1);
    });

    // Convert map to array
    const result = Array.from(timeMap, ([time, customers]) => ({
      time,
      customers,
    }));

    // Sort by time
    return result.filter((item) => item.customers > 0); // Only include hours with customers
  };

  // Format currency for display
  const formatCurrency = (value: ValueType) => {
    return value.toLocaleString("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    });
  };

  // Format rating display
  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : "0.0";
  };

  // Handle date range selection
  const handleDateRangeChange = (range: React.SetStateAction<string>) => {
    setDateRange(range);
    setShowDateRangeDropdown(false);
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-bold text-2xl text-gray-800">
            {restaurantProfile.name}
          </h1>
          <p className="text-gray-500">Restaurant Dashboard</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-md shadow-sm">
          <Calendar size={16} />
          <span className="text-sm font-medium">{dateRange}</span>
          <div className="relative inline-block">
            <button
              className="flex items-center"
              onClick={() => setShowDateRangeDropdown(!showDateRangeDropdown)}
            >
              <ChevronDown size={16} />
            </button>
            {showDateRangeDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg z-10">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => handleDateRangeChange(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="menu">Menu Analytics</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Revenue Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">Total Revenue</span>
                <div className="p-2 bg-red-50 rounded-full">
                  <DollarSign size={18} className="text-red-500" />
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              ) : (
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardData.totalRevenue)}
                </p>
              )}
              <p className="text-sm text-green-500 flex items-center mt-1">
                {dashboardData.percentageChanges.revenue > 0 &&
                  `+${dashboardData.percentageChanges.revenue}% from last period`}
              </p>
            </div>

            {/* Total Orders Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">Total Orders</span>
                <div className="p-2 bg-blue-50 rounded-full">
                  <Utensils size={18} className="text-blue-500" />
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              ) : (
                <p className="text-2xl font-bold">
                  {dashboardData.totalOrders.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-green-500 flex items-center mt-1">
                {dashboardData.percentageChanges.orders > 0 &&
                  `+${dashboardData.percentageChanges.orders}% from last period`}
              </p>
            </div>

            {/* Average Order Value Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">
                  Avg. Order Value
                </span>
                <div className="p-2 bg-green-50 rounded-full">
                  <DollarSign size={18} className="text-green-500" />
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
              ) : (
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardData.avgOrderValue)}
                </p>
              )}
              <p className="text-sm text-green-500 flex items-center mt-1">
                {dashboardData.percentageChanges.avgOrder > 0 &&
                  `+${dashboardData.percentageChanges.avgOrder}% from last period`}
              </p>
            </div>

            {/* Customer Rating Card */}
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 font-medium">
                  Customer Rating
                </span>
                <div className="p-2 bg-yellow-50 rounded-full">
                  <Star size={18} className="text-yellow-500" />
                </div>
              </div>
              {loading ? (
                <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
              ) : (
                <div>
                  <p className="text-2xl font-bold flex items-center">
                    {formatRating(restaurantProfile.rating)}/5
                    <Star size={18} className="text-yellow-500 ml-1" />
                  </p>
                  <p className="text-xs text-gray-500">
                    {restaurantProfile.rating_count}{" "}
                    {restaurantProfile.rating_count === 1
                      ? "review"
                      : "reviews"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Main Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Revenue Trend
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
                ) : dashboardData.revenueData.length > 0 ? (
                  <AreaChart
                    data={dashboardData.revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#DD0228"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#DD0228"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#DD0228"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No revenue data available for this period
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Orders Overview
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
                ) : dashboardData.ordersData.length > 0 ? (
                  <BarChart
                    data={dashboardData.ordersData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#A60000" />
                  </BarChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No order data available for this period
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Additional Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Peak Hours
              </h2>
              <ResponsiveContainer width="100%" height={250}>
                {loading ? (
                  <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
                ) : dashboardData.peakHoursData.length > 0 ? (
                  <AreaChart
                    data={dashboardData.peakHoursData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorCustomers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8884d8"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8884d8"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="customers"
                      stroke="#8884d8"
                      fillOpacity={1}
                      fill="url(#colorCustomers)"
                    />
                  </AreaChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">
                      No peak hour data available for this period
                    </p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Top Menu Items
              </h2>
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Not available at the moment</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Sales Analytics</h2>
            <p className="text-gray-500">
              Detailed sales information will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="menu">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Menu Performance</h2>
            <p className="text-gray-500">Menu analytics will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Customer Insights</h2>
            <p className="text-gray-500">Customer data will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default RestaurantDashboard;
