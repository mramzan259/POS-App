import { NextResponse } from "next/server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database/db_connection";
import { signToken } from "@/lib/jwtfunctions";
import User from "@/lib/model/user";
import redis from "@/lib/redis";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user._id,
      email: user.email,
      name: user.name,
    });

    // 1. Save user in Redis with token as key
    await redis.set(token, JSON.stringify(user), "EX", 60 * 60 * 24); // Expires in 24h

    const response = NextResponse.json({
      message: "Login successful",
      user: { email: user.email, name: user.name, image: user.image },
      success: true,
    });

    response.cookies.set({
      name: "authToken",
      value: token,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true, // Recommended for security
      path: "/", // Define the path for the cookie
      maxAge: 60 * 60 * 24, // Optional: Set cookie expiration (in seconds)
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
