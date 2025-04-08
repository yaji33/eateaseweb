import React, { useState } from "react";
import { FaCreditCard, FaPaypal, FaUniversity } from "react-icons/fa";
import { BsSortDown, BsSortUp } from "react-icons/bs";

interface Transaction {
  customerName: string;
  transactionId: string;
  totalPayment: string;
  modeOfPayment: string;
  timestamp: string;
}

interface TransactionsDataTableProps {
  transactions: Transaction[];
}

const paymentIcons: Record<string, JSX.Element> = {
  "Credit Card": <FaCreditCard className="text-blue-500 text-lg" />,
  PayPal: <FaPaypal className="text-blue-700 text-lg" />,
  "Debit Card": <FaUniversity className="text-green-500 text-lg" />,
};

const TransactionsDataTable: React.FC<TransactionsDataTableProps> = ({
  transactions,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedTransactions = [...transactions].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative overflow-x-auto rounded-lg shadow-lg">
      <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
        <thead className="bg-gradient-to-r from-red-600 to-red-800 text-white text-base">
          <tr>
            <th className="px-6 py-4 font-semibold">Customer Name</th>
            <th className="px-6 py-4 font-semibold">Transaction ID</th>
            <th className="px-6 py-4 font-semibold">Total Payment</th>
            <th className="px-6 py-4 font-semibold">Mode of Payment</th>
            <th
              className="px-6 py-4 font-semibold cursor-pointer flex items-center gap-2"
              onClick={toggleSortOrder}
            >
              Timestamp{" "}
              {sortOrder === "asc" ? (
                <BsSortUp className="text-lg" />
              ) : (
                <BsSortDown className="text-lg" />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr
              key={index}
              className={`border-b ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              } dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all`}
            >
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {transaction.customerName}
              </td>
              <td className="px-6 py-4 font-mono">
                {transaction.transactionId}
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900">
                ₱ {transaction.totalPayment}
              </td>
              <td className="px-6 py-4 flex items-center gap-3">
                {paymentIcons[transaction.modeOfPayment] || "💰"}{" "}
                {transaction.modeOfPayment}
              </td>
              <td className="px-6 py-4">{formatDate(transaction.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsDataTable;
