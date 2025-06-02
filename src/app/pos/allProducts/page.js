"use client";
import React, { useEffect, useState } from "react";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  useEffect(() => {
    const fetchAllProducts = async () => {
      // setLoading(true);
      try {
        let res = await fetch("http://localhost:3000/api/getAllProducts");

        res = await res.json();

        setProducts(res.products);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllProducts();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleResetSort = () => {
    setSortConfig({ key: "name", direction: "asc" });
  };

  const filteredProducts = products.filter((product) => {
    const matchFilter =
      filter === "all" || (filter === "noQuantity" && product.quantity === 0);
    const matchSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key];
    const valB = b[sortConfig.key];

    if (typeof valA === "string") {
      return sortConfig.direction === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return sortConfig.direction === "asc" ? valA - valB : valB - valA;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  if (loading) {
    return <div className="text-center pt-3">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("noQuantity")}
            className={`px-4 py-2 rounded ${
              filter === "noQuantity"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            }`}
          >
            No Quantity
          </button>
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded border dark:bg-gray-900 dark:border-gray-600"
        />
      </div>

      {/* Reset Sort */}
      <div className="text-right mb-2">
        <button
          onClick={handleResetSort}
          className="text-sm text-blue-600 hover:underline"
        >
          Reset Sorting
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded shadow border text-center">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-sm uppercase text-gray-600 dark:text-gray-300">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th
                onClick={() => handleSort("name")}
                className="px-6 py-3 cursor-pointer hover:text-blue-600"
              >
                Name{" "}
                {sortConfig.key === "name" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("quantity")}
                className="px-6 py-3 cursor-pointer hover:text-blue-600"
              >
                Quantity{" "}
                {sortConfig.key === "quantity" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
              <th
                onClick={() => handleSort("price")}
                className="px-6 py-3 cursor-pointer hover:text-blue-600"
              >
                Price (Rs){" "}
                {sortConfig.key === "price" &&
                  (sortConfig.direction === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts?.map((product, idx) => (
                <tr
                  key={product._id}
                  className={`${
                    idx % 2 === 0
                      ? "bg-white dark:bg-gray-900"
                      : "bg-gray-50 dark:bg-gray-800"
                  } border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-6 py-3 flex justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-3">{product.name}</td>
                  <td className="px-6 py-3">{product.quantity}</td>
                  <td className="px-6 py-3 text-green-600 dark:text-green-400 font-semibold">
                    Rs {product.price}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded hover:bg-gray-300 border  border-gray-300 disabled:bg-gray-200 duration-700 dark:bg-gray-700 disabled:opacity-50 cursor-pointer "
        >
          Previous
        </button>
        <span className="text-sm text-gray-700 dark:text-gray-200">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-6 py-2 rounded hover:bg-blue-500 disabled:bg-gray-200 duration-700 dark:bg-gray-700 disabled:opacity-50 cursor-pointer border disabled:border-none border-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllProducts;
