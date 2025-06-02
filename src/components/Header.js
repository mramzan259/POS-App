"use client";

import { useState, useEffect, useRef } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineLogout } from "react-icons/md";

export default function Header({ user }) {
  const [name, setName] = useState("User");
  const [imageUrl, setImageUrl] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const router = useRouter();

  // Function to convert buffer to base64 string
  const bufferToBase64 = (bufferData) => {
    const binary = Uint8Array.from(bufferData).reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      ""
    );
    return window.btoa(binary); // base64 encoded string
  };

  useEffect(() => {
    const base64Image = bufferToBase64(user.image.data.data); // extract actual array

    setName(user?.name || "User");
    if (base64Image && user?.image?.contentType) {
      setImageUrl(`data:${user.image.contentType};base64,${base64Image}`);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/logoutroute", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
      } else {
        alert("Logout failed");
      }
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full px-6 py-3 bg-white dark:bg-gray-900 shadow-md relative z-50">
      <div className="w-full lg:max-w-[80%] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.jpg" alt="POS Logo" width={50} height={50} />
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            POS System
          </span>
        </div>

        <div className="hidden md:flex gap-6 text-lg font-medium text-gray-700 dark:text-gray-300">
          <Link href="/pos/allProducts" className="hover:text-blue-600">
            All Products
          </Link>
          <Link href="/pos" className="hover:text-blue-600">
            Cart
          </Link>
          <Link href="/pos/cashierSale" className="hover:text-blue-600">
            My Sale
          </Link>
        </div>

        <div className="flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer duration-500 transition-all"
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <FaRegCircleUser className="text-2xl" />
              )}
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50 transform transition-all duration-300 ease-in-out origin-top ${
                dropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="px-3 py-3 border-b dark:border-gray-500 border-gray-500 mx-1">
                <p className="flex gap-2 items-center text-sm font-medium text-gray-900 dark:text-white">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <FaRegCircleUser className="text-2xl" />
                  )}{" "}
                  {name}
                </p>
              </div>
              <div
                className="flex justify-between items-center cursor-pointer pe-2"
                onClick={handleLogout}
              >
                <button className="text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 dark:hover:bg-gray-700 font-medium">
                  Logout
                </button>
                <MdOutlineLogout className="text-[18px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
