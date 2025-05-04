import React from "react";

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
  status: "pending" | "ongoing" | "for pickup" | "completed" | "denied";
  onStatusChange?: (orderId: string, newStatus: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  timestamp,
  customerName,
  orderId,
  orderItems,
  //totalAmount,
  status,
  onStatusChange,
}) => {
  return (
    <div className="bg-white shadow-sm rounded-md p-3 px-4 flex flex-col h-96">
      {/* Header section */}
      <div className="mb-2">
        <p className="text-sm">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
        <p className="text-sm">
          Timestamp: <span className="font-medium">{timestamp}</span>
        </p>
        <p className="text-sm">
          Customer Name: <span className="font-medium">{customerName}</span>
        </p>
      </div>

      {/* Order list section with fixed height and scrolling */}
      <div className="border-b py-2 flex-grow overflow-hidden flex flex-col">
        <p className="text-sm mb-2">Order Lists:</p>
        <div className="overflow-y-auto flex-grow">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between mt-2 font-medium text-sm"
            >
              <p className="w-1/2 truncate pr-2">{item.name}</p>
              <p className="w-1/6 text-center">x{item.quantity}</p>
              <p className="w-1/3 text-right">₱ {item.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Total section */}
      <div className="flex justify-between mt-3 font-medium">
        <p>Total</p>
        <p>
          ₱{" "}
          {orderItems
            .reduce((acc, item) => acc + item.quantity * item.price, 0)
            .toLocaleString()}
        </p>
      </div>

      {/* Action buttons section */}
      <div className="flex justify-between py-4 gap-3 text-sm mt-auto">
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
              onClick={() => onStatusChange?.(orderId, 2)} // Accept to ongoing
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
              onClick={() => onStatusChange?.(orderId, 3)} // Set to for pickup
            >
              For Pickup
            </button>
          </>
        )}

        {status === "for pickup" && (
          <button
            className="w-full bg-buttonPrimary p-2 rounded-md text-white"
            onClick={() => onStatusChange?.(orderId, 4)} // Done
          >
            Done
          </button>
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

export default OrderCard;
