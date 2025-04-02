import React from 'react'
import TransactionsDataTable from '@/components/business/data-table';

interface Transaction {
  customerName: string;
  transactionId: string;
  totalPayment: string;
  modeOfPayment: string;
  timestamp: string;
}

const transactions: Transaction[] = [
  {
    customerName: "John Doe",
    transactionId: "TXN12345",
    totalPayment: "2999",
    modeOfPayment: "Credit Card",
    timestamp: "2025-03-18 14:32:00",
  },
  {
    customerName: "Jane Smith",
    transactionId: "TXN67890",
    totalPayment: "1999",
    modeOfPayment: "PayPal",
    timestamp: "2025-03-18 12:15:00",
  },
  {
    customerName: "Alice Johnson",
    transactionId: "TXN54321",
    totalPayment: "99",
    modeOfPayment: "Debit Card",
    timestamp: "2025-03-18 09:45:00",
  },
];
export default function page() {
  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen bg-background font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Transactions</h1>
      <TransactionsDataTable transactions={transactions} />
    </div>
  );
}
