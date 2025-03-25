import React from "react";

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

const TransactionsDataTable: React.FC<TransactionsDataTableProps> = ({ transactions }) => {
  return (
    <div className="relative overflow-x-auto rounded-md overflow-hidden shadow-sm">
      <table className="w-full rounded-3xl text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className=" text-gray-700 bg-active_bg dark:text-gray-400">
          <tr>
            <th className="px-6 py-3 font-normal">Customer Name</th>
            <th className="px-6 py-3 font-normal">Transaction ID</th>
            <th className="px-6 py-3 font-normal">Total Payment</th>
            <th className="px-6 py-3 font-normal">Mode of Payment</th>
            <th className="px-6 py-3 font-normal">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
            >
              <td className="px-6 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {transaction.customerName}
              </td>
              <td className="px-6 py-3">{transaction.transactionId}</td>
              <td className="px-6 py-3">{transaction.totalPayment}</td>
              <td className="px-6 py-3">{transaction.modeOfPayment}</td>
              <td className="px-6 py-3">{transaction.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsDataTable;