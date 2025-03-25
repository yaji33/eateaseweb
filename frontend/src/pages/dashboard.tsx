import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { User, Utensils, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

const data = [
  { name: "Jan", users: 10, sales: 20 },
  { name: "Feb", users: 20, sales: 50 },
  { name: "Mar", users: 15, sales: 40 },
  { name: "Apr", users: 70, sales: 20 },
  { name: "May", users: 40, sales: 70 },
  { name: "Jun", users: 35, sales: 120 },
];

export default function Dashboard() {
  return (
    <div className="text-black flex flex-col min-h-screen p-5 space-y-5 font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
        <Card className="flex  items-center space-y-4 py-10 px-6 justify-center">
          <div className="flex items-center space-x-4">
            <User size={42} />
            <div className=" w-full items-center">
              <p className="text-sm text-gray-500">Total Users</p>
              <h2 className="text-xl font-medium">123,456</h2>
            </div>
          </div>
        </Card>
        <Card className="flex  items-center space-y-4 py-10 px-6 justify-center">
          <div className="flex items-center space-x-4">
            <Utensils size={42} />
            <div className=" w-full items-center">
              <p className="text-sm text-gray-500">Total Eateries</p>
              <h2 className="text-xl font-medium">123,456</h2>
            </div>
          </div>
        </Card>

        <Card className="flex  items-center space-y-4 py-10 px-6 justify-center">
          <div className="flex items-center space-x-4">
            <Coins size={42} />
            <div className=" w-full items-center">
              <p className="text-sm text-gray-500">Total Fees</p>
              <h2 className="text-xl font-medium">123,456</h2>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card className="p-5">
        <h3 className="text-lg font-semibold mb-3">Orders Analytics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#3b82f6"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#00BCFF"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-5"></Card>

        <Card className="p-5">
          <h3 className="text-lg font-semibold mb-3">
            Top Performing Eateries
          </h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span>🍽️ Fine Dining Restaurant by Jhona</span>
              <span>100,322</span>
            </li>
            <li className="flex justify-between">
              <span>🍽️ Mac&Gab FoodHub</span>
              <span>20,322</span>
            </li>

            <li className="flex justify-between">
              <span>☕ Starbucks Tabaco</span>
              <span>17,302</span>
            </li>
            <li className="flex justify-between">
              <span>🍽️ Jucel Pogi Food Hub</span>
              <span>15,432</span>
            </li>
            <li className="flex justify-between">
              <span>🍽️ Davies Choice</span>
              <span>13,132</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
