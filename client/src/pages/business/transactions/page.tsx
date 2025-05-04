import React, { useEffect, useState } from "react";
import TransactionsDataTable from "@/components/business/data-table";
import axios from "axios";
import Search from "@/assets/search.svg";

const API_URL = import.meta.env.VITE_API_URL;

interface Transaction {
  customerName: string;
  transactionId: string;
  totalPayment: string;
  modeOfPayment: string;
  timestamp: string;
}

const ITEMS_PER_PAGE = 10;

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredData, setFilteredData] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize filtered data when transactions load
  useEffect(() => {
    setFilteredData(transactions);
    setTotalPages(Math.ceil(transactions.length / ITEMS_PER_PAGE));
  }, [transactions]);

  // Fetch transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/api/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle search function
  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);

    if (!searchTerm.trim()) {
      setFilteredData(transactions);
    } else {
      const lowercaseSearch = searchTerm.toLowerCase();
      const filtered = transactions.filter(
        (tx) =>
          tx.customerName.toLowerCase().includes(lowercaseSearch) ||
          tx.transactionId.toLowerCase().includes(lowercaseSearch) ||
          tx.modeOfPayment.toLowerCase().includes(lowercaseSearch)
      );
      setFilteredData(filtered);
      setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
      setCurrentPage(1); // Reset to first page when searching
    }
  };

  // Calculate paginated data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex w-full max-w-5xl mx-auto flex-col min-h-screen font-poppins px-4 pt-20 gap-4">
      <h1 className="font-semibold text-xl">Transactions</h1>

      <div className="relative w-full sm:max-w-xl md:max-w-2xl lg:max-w-lg block">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full border rounded-md pl-12 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
        />
        <img
          src={Search}
          alt="search"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 opacity-60"
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <TransactionsDataTable
            transactions={filteredData}
            data={paginatedData}
          />

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, array) => {
                    // Add ellipsis between non-consecutive pages
                    if (index > 0 && page - array[index - 1] > 1) {
                      return (
                        <React.Fragment key={`ellipsis-${page}`}>
                          <span className="px-3 py-1">...</span>
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "border border-gray-300"
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          <div className="text-sm text-gray-500 text-center mt-2">
            Showing {paginatedData.length} of {filteredData.length} transactions
          </div>
        </>
      )}
    </div>
  );
}
