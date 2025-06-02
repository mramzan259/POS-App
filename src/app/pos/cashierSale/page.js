"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function CashierSales() {
  const [salesData, setSalesData] = useState(null);
  const [expandedCheckouts, setExpandedCheckouts] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSales() {
      try {
        const res = await fetch("http://localhost:3000/api/cashierSaleRoute");
        const data = await res.json();

        if (data.success) {
          setSalesData(data);
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchSales();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!salesData) {
    return <div className="text-center py-10">Sales not found</div>;
  }

  const groupedByDate = salesData?.cashier?.checkouts.reduce(
    (acc, checkout, index) => {
      if (!acc[checkout.date]) acc[checkout.date] = [];
      acc[checkout.date].push({ ...checkout, index });
      return acc;
    },
    {}
  );

  const toggleCheckout = (index) => {
    setExpandedCheckouts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getTotalByDate = (checkouts) => {
    return checkouts.reduce((total, c) => total + c.grandTotal, 0);
  };

  const matchesSearch = (checkout) => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      checkout.items.some((item) =>
        item.name.toLowerCase().includes(lowerQuery)
      ) || checkout.date.includes(lowerQuery)
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Sales Summary for {salesData.cashier.cashier.name}
      </h1>

      <input
        type="text"
        placeholder="Search by product or date..."
        className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {Object.entries(groupedByDate).map(([date, checkouts]) => {
        const filteredCheckouts = checkouts.filter(matchesSearch);
        if (filteredCheckouts.length === 0) return null;

        return (
          <div key={date} className="mb-3">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 border-b pb-2">
              📅 Date: {date}
            </h2>

            {filteredCheckouts.map((checkout) => {
              const isExpanded = expandedCheckouts[checkout.index];
              return (
                <div
                  key={checkout._id?.$oid || checkout.index}
                  className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleCheckout(checkout.index)}
                    className="w-full text-left bg-gray-100 px-4 py-3 text-sm text-gray-700 font-semibold hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                  >
                    <span>🕒 Time: {checkout.time}</span>
                    <span className="text-xs text-blue-500">
                      {isExpanded ? "Hide Details ▲" : "Show Details ▼"}
                    </span>
                  </button>

                  <div
                    className={`transition-all duration-700 ease-linear overflow-hidden ${
                      isExpanded ? "max-h-screen" : "max-h-0"
                    }`}
                  >
                    {isExpanded && (
                      <>
                        <div className="divide-y divide-gray-200 bg-white">
                          {checkout.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-4 p-4"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                width={60}
                                height={60}
                                className="rounded-md object-cover"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Quantity: {item.quantity} × Rs. {item.price}
                                </p>
                              </div>
                              <div className="font-bold text-gray-700">
                                Rs. {item.quantity * item.price}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-50 px-4 py-3 flex justify-end font-semibold text-gray-800">
                          Grand Total: Rs. {checkout.grandTotal}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="text-right text-green-700 font-bold mt-2">
              📈 Total for {date}: Rs. {getTotalByDate(filteredCheckouts)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
