"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const route = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  console.log("1");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    console.log("2");

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Only JPEG and PNG images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image size should be less than 2MB.");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!userName || !email || !password || !image) {
      return setError("All fields including profile image are required.");
    }

    if (!validateEmail(email)) {
      return setError("Invalid email format.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    try {
      setLoading(true);
      console.log("before api call 1 ====");
      const formData = new FormData();
      formData.append("name", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      console.log("before api call ====");
      // ✅ Debug each key-value in FormData
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await fetch("http://localhost:3000/api/registerroute", {
        method: "POST",
        body: formData,
      });
      console.log("before====");

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess("Registration successful. Please login.");
      setUserName("");
      setEmail("");
      setPassword("");
      setImage(null);
      setPreview(null);
      route.push("/login");
    } catch (err) {
      setError(err.message);
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
        <h2 className="text-3xl font-bold text-black mb-6 text-center">
          Register
        </h2>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && (
          <p className="text-green-600 mb-4 text-center">{success}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          <input
            type="text"
            placeholder="User name"
            className="w-full p-3 bg-white/60 text-black placeholder-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userName}
            name="userName"
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-white/60 text-black placeholder-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white/60 text-black placeholder-black border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="w-full bg-white/60 text-black file:bg-blue-500 file:text-white file:border-0 file:px-4 file:py-2 rounded-lg"
            onChange={handleImageChange}
            name="image"
          />

          {preview && (
            <div className="text-center">
              <img
                src={preview}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mx-auto border mt-2"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-md mt-4 text-center text-black">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-800 font-semibold text-md hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
