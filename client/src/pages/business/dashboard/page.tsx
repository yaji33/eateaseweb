import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AboutUs from "@/components/business/about-us";

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
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 15200 },
  { month: "May", revenue: 21000 },
  { month: "Jun", revenue: 25000 },
];

const ordersData = [
  { month: "Jan", orders: 150 },
  { month: "Feb", orders: 180 },
  { month: "Mar", orders: 210 },
  { month: "Apr", orders: 250 },
  { month: "May", orders: 290 },
  { month: "Jun", orders: 320 },
];

function Page() {
  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Dashboard</h1>
    

        <div className="flex flex-col flex-grow">
         
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
              <div className="bg-white p-12 rounded-md flex flex-col items-center shadow-md">
                <p className="text-4xl font-medium">₱ 230,000</p>
                <p>Revenue</p>
              </div>
              <div className="bg-white p-12 rounded-md flex flex-col items-center shadow-md">
                <p className="text-4xl font-medium">1040</p>
                <p>Orders</p>
              </div>
            </div>

            <div className="w-full shadow-md bg-white flex-grow my-3 rounded-md p-6">
              <h2 className="text-lg font-semibold mb-3">Revenue Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={revenueData}
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
                      <stop offset="5%" stopColor="#DD0228" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#DD0228" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DD0228"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full bg-white shadow-md flex-grow my-3 rounded-md p-6">
              <h2 className="text-lg font-semibold mb-3">Orders Analytics</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={ordersData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#A60000" />
                </BarChart>
              </ResponsiveContainer>
            </div>
       

        </div>
    </div>
  );
}

export default Page;
