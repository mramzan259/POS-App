// const username = process.env.userName;
// const password = process.env.password;

// if (!username || !password) {
//   throw new Error("Missing MongoDB Credentials");
// }

// export const connectionString = `mongodb+srv://${username}:${password}@cluster0.w05l1.mongodb.net/employee?retryWrites=true&w=majority&appName=Cluster0`;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "❌ Missing MongoDB connection string in environment variables"
  );
}

let cached = global.mongoose || { conn: null, promise: null };

export const connectDB = async () => {
  if (cached.conn) {
    console.log("✅ Using existing MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

global.mongoose = cached;
