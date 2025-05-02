  import React, { useState, useEffect } from "react";
  import axios from "axios";
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
    status: "pending" | "ongoing" | "completed" | "denied";
  }

  export default function Page() {
    const [orders, setOrders] = useState<OrderCardProps[]>([]);

    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get("http://localhost:5001/api/orders", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = res.data;
          if (!Array.isArray(data)) {
            console.error("Expected array but got:", data);
            setOrders([]);
            return;
          }
          
          const mapped = data.map((order: any) => ({
            timestamp: new Date(order.timestamp).toLocaleString(),
            customerName: order.customerName ?? "N/A",
            orderId: order.order_id,
            orderItems: Array.isArray(order.orderItems)
            ? order.orderItems.map((item: any) => ({        
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              }))
            : [],
            totalAmount: Array.isArray(order.orderItems)
            ? order.orderItems.reduce((sum: number, item: any) => sum + item.quantity * item.price, 0)
            : 0,
            status:
              order.order_status === 1
                ? "pending"
                : order.order_status === 2
                ? "ongoing"
                : order.order_status === 4
                ? "completed"
                : "denied",
          }));
          
          setOrders(mapped as OrderCardProps[]);   
        } catch (err) {
          console.error("Error fetching orders", err);
        }
      };

      fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: number) => {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(`http://localhost:5001/api/orders/${orderId}/status`, {
          status: newStatus,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        // Refresh the orders
        const updatedOrders = orders.map(order =>
          order.orderId === orderId
            ? { ...order, status: (newStatus === 1
              ? "pending"
              : newStatus === 2
              ? "ongoing"
              : newStatus === 4
              ? "completed"
              : "denied") as "pending" | "ongoing" | "completed" | "denied",
            }
            : order
        );
    
        setOrders(updatedOrders);
        alert("Order updated!");
      } catch (err) {
        console.error("Failed to update order status", err);
        alert("Failed to update order.");
      }
    };  

    return (
      <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background_1 font-poppins px-4 pt-20 gap-4">
        <h1 className="font-semibold text-xl">Orders</h1>
        <Tabs defaultValue="pending" className="w-full flex flex-col flex-grow">
          <TabsList className="flex w-full justify-start gap-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["pending", "ongoing", "completed"].map((tab) => (
            <TabsContent
              key={tab}
              value={tab}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 data-[state=inactive]:hidden my-6"
            >
              {orders
                .filter((order) => order.status === tab)
                .map((order, index) => (
                  <OrderCard key={index} {...order} onStatusChange={handleStatusChange} />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  }
