import React from 'react'

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
  onStatusChange?: (orderId: string, newStatus: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  timestamp,
  customerName,
  orderId,
  orderItems,
  totalAmount,
  status,
  onStatusChange,
}) => {


  return (
    <div className="bg-white shadow-sm rounded-md p-3 px-4">
      <p className="text-sm">
        Order ID: <span className="font-medium">{orderId}</span>
      </p>
      <p className="text-[14px]">
        Timestamp: <span className="font-medium">{timestamp}</span>
      </p>
      <p className="text-sm">
        Customer Name: <span className="font-medium">{customerName}</span>
      </p>

      <div className="border-b py-3">
        <p className="text-sm">Order Lists:</p>
        {orderItems.map((item, index) => (
          <div key={index} className="flex justify-between mt-3 font-medium">
            <p>{item.name}</p>
            <p>x{item.quantity}</p>
            <p>₱ {item.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-3 font-medium">
        <p>Total</p>
        <p>
          ₱{" "}
          {orderItems.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
          ).toLocaleString()}
        </p>
      </div>

      <div className="flex justify-between py-5 gap-3 text-sm">
        {status === "pending" && (
          <>
            <button
              className="w-full border p-2 rounded-md text-black"
              onClick={() => onStatusChange?.(orderId, 0)} // Deny
            >
              Deny
            </button>
            <button
              className="w-full bg-buttonPrimary p-2 rounded-md text-white"
              onClick={() => onStatusChange?.(orderId, 2)} // Accept
            >
              Accept
            </button>
          </>
        )}

        {status === "ongoing" && (
          <>
            <button
              className="w-full border p-2 rounded-md text-black"
              onClick={() => onStatusChange?.(orderId, 0)} // Cancel
            >
              Cancel
            </button>
            <button
              className="w-full bg-buttonPrimary p-2 rounded-md text-white"
              onClick={() => onStatusChange?.(orderId, 4)} // Complete
            >
              Complete
            </button>
          </>
        )}

        {status === "completed" && (
          <button className="w-full bg-buttonPrimary p-2 rounded-md text-white">
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard
