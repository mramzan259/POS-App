"use client";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null); // <--- Input ref
  const [products, setProducts] = useState([]);
  const refreshProduts = useSelector((state) => state.cartRefetch);

  console.log(refreshProduts);

  useEffect(() => {
    const fetchAllProducts = async () => {
      let res = await fetch("http://localhost:3000/api/cartProducts");

      res = await res.json();

      setProducts(res);
    };
    fetchAllProducts();
  }, [refreshProduts]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode.includes(query)
  );

  const handleSelect = (product) => {
    dispatch(addToCart(product));
    setQuery("");
    setActiveIndex(-1);
    inputRef.current?.focus(); // <--- Auto-focus input
  };

  const handleKeyDown = (e) => {
    if (!query || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? filtered.length - 1 : prev - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setQuery("");
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    const listItems = dropdownRef.current?.querySelectorAll(".dropdown-item");
    if (listItems && listItems[activeIndex]) {
      listItems[activeIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef} // <--- Attach ref here
        type="text"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Search by name or barcode..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(-1);
        }}
        onKeyDown={handleKeyDown}
      />

      {query && (
        <div className="absolute w-full z-10">
          <div
            ref={dropdownRef}
            className="bg-white shadow-lg rounded mt-2 max-h-60 overflow-y-auto border border-gray-200"
          >
            {filtered.length > 0 ? (
              filtered.map((product, i) => (
                <div
                  key={product._id}
                  className={`dropdown-item p-2 flex items-center gap-3 cursor-pointer ${
                    activeIndex === i ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">Rs. {product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-sm text-gray-400">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
