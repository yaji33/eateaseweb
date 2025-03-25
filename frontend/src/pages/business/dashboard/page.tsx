import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 24000 },
  { month: "May", revenue: 27000 },
  { month: "Jun", revenue: 30000 },
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
      <Tabs defaultValue="overview" className="w-full flex flex-col flex-grow">
        <TabsList className="flex w-full bg-active_bg">
          <TabsTrigger
            value="overview"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Reviews
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            About Us
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col flex-grow">
          <TabsContent value="overview" className="flex flex-col flex-grow">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 py-2">
              <div className="bg-white shadow-sm p-14 rounded-sm flex flex-col items-center">
                <p className="text-4xl font-medium">₱230,000</p>
                <p>Revenue</p>
              </div>
              <div className="bg-white shadow-sm p-14 rounded-sm flex flex-col items-center">
                <p className="text-4xl font-medium">1040</p>
                <p>Orders</p>
              </div>
            </div>
            <div className="w-full bg-white shadow-sm flex-grow my-3 rounded-sm p-6">
              <h2 className="text-lg font-semibold mb-3">
                Revenue & Orders Analytics
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={revenueData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#DD0228"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={300} className="mt-6">
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
          </TabsContent>

          <TabsContent value="reviews" className="flex-grow">
            <h1>Reviews Content</h1>
          </TabsContent>

          <TabsContent value="about" className="flex-grow">
            <h1>About Us Content</h1>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export default Page;
