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
    <div className="text-black flex flex-col min-h-screen p-5 space-y-5 font-poppins bg-gradient-to-r from-gray-100 to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-5">
        {[
          { icon: <User size={42} />, label: "Total Users", value: "123,456" },
          {
            icon: <Utensils size={42} />,
            label: "Total Eateries",
            value: "123,456",
          },
          { icon: <Coins size={42} />, label: "Total Fees", value: "123,456" },
        ].map((item, index) => (
          <Card
            key={index}
            className="flex items-center space-y-4 py-10 px-6 justify-center shadow-md rounded-xl bg-white"
          >
            <div className="flex items-center space-x-4">
              {item.icon}
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2 className="text-xl font-medium">{item.value}</h2>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 flex-grow">
        <Card className="p-5 shadow-md rounded-xl bg-white md:col-span-2">
          <h3 className="text-lg font-semibold mb-3">Orders Analytics</h3>
          <ResponsiveContainer width="100%" height={400}>
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

        <Card className="p-5 shadow-lg rounded-xl bg-white">
          <h3 className="text-lg font-semibold mb-3">
            Top Performing Eateries
          </h3>
          <ul className="space-y-3">
            {[
              { name: "🍽️ Fine Dining Restaurant by Jhona", value: "100,322" },
              { name: "🍽️ Mac&Gab FoodHub", value: "20,322" },
              { name: "☕ Starbucks Tabaco", value: "17,302" },
              { name: "🍽️ Jucel Pogi Food Hub", value: "15,432" },
              { name: "🍽️ Davies Choice", value: "13,132" },
            ].map((eatery, index) => (
              <li key={index} className="flex justify-between">
                <span>{eatery.name}</span>
                <span>{eatery.value}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
