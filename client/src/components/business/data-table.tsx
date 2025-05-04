import React, { useState } from "react";
import { FaCreditCard, FaPaypal, FaUniversity } from "react-icons/fa";
import { SiGoogleplay } from "react-icons/si";
import { MdPayment } from "react-icons/md";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BsSortDown, BsSortUp } from "react-icons/bs";
import { JSX } from "react/jsx-runtime";

interface Transaction {
  customerName: string;
  transactionId: string;
  totalPayment: string;
  modeOfPayment: string;
  timestamp: string;
}

interface TransactionsDataTableProps {
  transactions: Transaction[];
  data: Transaction[];
}

const paymentIcons: Record<string, JSX.Element> = {
  "Credit Card": <FaCreditCard className="text-blue-500 text-lg" />,
  "Debit Card": <FaUniversity className="text-green-500 text-lg" />,
  PayPal: <FaPaypal className="text-blue-700 text-lg" />,
  Gcash: <MdPayment className="text-blue-400 text-lg" />,
  "Grab Pay": <SiGoogleplay className="text-green-600 text-lg" />,
};

const TransactionsDataTable: React.FC<TransactionsDataTableProps> = ({

  data,
}) => {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); 

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

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-500">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto rounded-lg shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="text-left">Customer Name</TableHead>
            <TableHead className="text-left">Transaction ID</TableHead>
            <TableHead className="text-left">Total Payment</TableHead>
            <TableHead className="text-left">Mode of Payment</TableHead>
            <TableHead
              className="text-left cursor-pointer"
              onClick={toggleSortOrder}
            >
              Timestamp
              {sortOrder === "asc" ? (
                <BsSortUp className="inline-block ml-1" />
              ) : (
                <BsSortDown className="inline-block ml-1" />
              )}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          
          {data
            .sort((a, b) => {
              const dateA = new Date(a.timestamp).getTime();
              const dateB = new Date(b.timestamp).getTime();
              return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
            })
            .map((transaction, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>{transaction.customerName}</TableCell>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.totalPayment}</TableCell>
                <TableCell className="flex items-center gap-2">
                  {paymentIcons[transaction.modeOfPayment] || (
                    <MdPayment className="text-gray-500 text-lg" />
                  )}
                  {transaction.modeOfPayment}
                </TableCell>
                <TableCell>{formatDate(transaction.timestamp)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionsDataTable;
