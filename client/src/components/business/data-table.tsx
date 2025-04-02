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
  "Credit Card": <FaCreditCard className="text-blue-500" />,
  PayPal: <FaPaypal className="text-blue-700" />,
  "Debit Card": <FaUniversity className="text-green-500" />,
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
    <div className="relative overflow-x-auto rounded-md shadow-sm">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="bg-pink-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
          <tr>
            <th className="px-6 py-3 font-normal">Customer Name</th>
            <th className="px-6 py-3 font-normal">Transaction ID</th>
            <th className="px-6 py-3 font-normal">Total Payment</th>
            <th className="px-6 py-3 font-normal">Mode of Payment</th>
            <th
              className="px-6 py-3 font-normal cursor-pointer flex items-center"
              onClick={toggleSortOrder}
            >
              Timestamp {sortOrder === "asc" ? <BsSortUp /> : <BsSortDown />}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((transaction, index) => (
            <tr
              key={index}
              className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {transaction.customerName}
              </td>
              <td className="px-6 py-3 font-mono">
                {transaction.transactionId}
              </td>
              <td className="px-6 py-3 font-semibold text-gray-900">
                ${transaction.totalPayment}
              </td>
              <td className="px-6 py-3 flex items-center gap-2">
                {paymentIcons[transaction.modeOfPayment] || "💰"}{" "}
                {transaction.modeOfPayment}
              </td>
              <td className="px-6 py-3">{formatDate(transaction.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsDataTable;
