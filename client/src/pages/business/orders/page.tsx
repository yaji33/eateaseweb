import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "@/components/business/OrderCard";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderCardProps {
  timestamp: string;
  customerName: string;
  orderId: string;
  orderItems: OrderItem[];
  totalAmount: number;
  status: "pending" | "ongoing" | "completed";
}

const orders: OrderCardProps[] = [
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Karel Jhona Cestina",
    orderId: "3123",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 946,
    status: "pending",
  },
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Jay Bombales",
    orderId: "1223",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 943,
    status: "pending",
  },
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Michael Cestina",
    orderId: "1253",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 943,
    status: "pending",
  },
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Michael Cestina",
    orderId: "1253",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 943,
    status: "ongoing",
  },
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Michael Cestina",
    orderId: "1253",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 943,
    status: "ongoing",
  },
  {
    timestamp: "February 26, 2025 - 4:32 PM",
    customerName: "Michael Cestina",
    orderId: "1253",
    orderItems: [
      { name: "Chicksilog", quantity: 2, price: 346 },
      { name: "Tapsilog", quantity: 1, price: 150 },
      { name: "Longsilog", quantity: 3, price: 450 },
    ],
    totalAmount: 943,
    status: "completed",
  },
];

export default function Page() {
  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Orders</h1>
      <Tabs defaultValue="pending" className="w-full flex flex-col flex-grow">
        <TabsList className="flex w-full bg-active_bg">
          <TabsTrigger
            value="pending"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="ongoing"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Ongoing
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex-1 text-center focus:ring-0 text-text_active data-[state=active]:bg-activeBackgroundDark data-[state=active]:text-white p-2"
          >
            Completed
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="pending"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 data-[state=inactive]:hidden my-6"
        >
          {orders
            .filter((order) => order.status === "pending")
            .map((order, index) => (
              <OrderCard key={index} {...order} />
            ))}
        </TabsContent>

        <TabsContent
          value="ongoing"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 data-[state=inactive]:hidden my-6"
        >
          {orders
            .filter((order) => order.status === "ongoing")
            .map((order, index) => (
              <OrderCard key={index} {...order} />
            ))}
        </TabsContent>

        <TabsContent
          value="completed"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 data-[state=inactive]:hidden my-6"
        >
          {orders
            .filter((order) => order.status === "completed")
            .map((order, index) => (
              <OrderCard key={index} {...order} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
