"use client";

import { useDispatch } from "react-redux";
import { clearCart } from "@/store/cartSlice";
import { useState } from "react";
import { setRefreshCartItems } from "@/store/refetchCartItems";

export default function CheckoutButton({
  cartItems,
  subtotal,
  discount,
  grandTotal,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      alert("Cart is empty!");
      return;
    }

    const now = new Date();
    const date = now.toLocaleDateString("en-US"); // e.g., 5/30/2025
    const time = now.toLocaleTimeString("en-US"); // e.g., 07:27:28

    const billData = {
      date,
      time,
      cartItems,
      subtotal,
      discount,
      grandTotal,
    };

    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // send cookies
        body: JSON.stringify(billData),
      });

      const data = await res.json();

      if (data.success) {
        setLoading(false);
        alert("✅ Checkout successful!");
        dispatch(clearCart());
        dispatch(setRefreshCartItems());
      } else {
        alert("❌ Checkout failed: " + data.message);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("❌ Something went wrong during checkout.");
    }
  };

  return (
    <>
      <button
        onClick={handleCheckout}
        className="cursor-pointer w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition font-semibold"
      >
        {loading ? "Checkingout..." : "Checkout"}
      </button>
    </>
  );
}
