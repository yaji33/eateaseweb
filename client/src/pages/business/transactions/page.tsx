import React, { useEffect, useState } from "react";
import TransactionsDataTable from "@/components/business/data-table";
import axios from "axios";

interface Transaction {
  customerName: string;
  transactionId: string;
  totalPayment: string;
  modeOfPayment: string;
  timestamp: string;
}

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5001/api/payments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const mapped = res.data.map((tx: any) => ({
          timestamp: new Date(tx.createdAt).toLocaleString(),
          customerName: tx.customerName ?? "N/A",
          transactionId: tx.transactionId,
          totalPayment: tx.totalPayment.toLocaleString("en-PH", {
            style: "currency",
            currency: "PHP",
          }),     
          modeOfPayment:
            tx.modeOfPayment === "gcash"
              ? "Gcash"
              : tx.modeOfPayment === "grab_pay"
              ? "Grab Pay"
              : tx.modeOfPayment === "debit_card"
              ? "Debit Card"
              : tx.modeOfPayment === "credit_card"
              ? "Credit Card"
              : tx.modeOfPayment === "paypal"
              ? "PayPal"
              : tx.modeOfPayment,
        }));                      

        setTransactions(mapped as Transaction[]);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Transactions</h1>
      <TransactionsDataTable transactions={transactions} />
    </div>
  );
}
