"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const route = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/loginroute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Login failed.");
      } else {
        alert("Login successful!");
        route.push("/pos");
      }
    } catch (err) {
      setApiError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: "url('/superstore08.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 backdrop-blur-xs bg-white/45 border border-white/30 shadow-xl rounded-xl p-10 w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold text-black mb-8 text-center">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              autoFocus
              placeholder="Email"
              className="w-full p-3 bg-white/3 text-black placeholder-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-white/3 text-black placeholder-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {apiError && (
            <p className="text-red-700 text-center mt-2">{apiError}</p>
          )}
        </form>

        <p className="text-md mt-4 text-center text-black">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-800 font-semibold text-md hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
