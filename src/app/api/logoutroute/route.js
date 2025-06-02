import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import redis from "@/lib/redis";
import { verifyToken } from "@/lib/jwtfunctions";

export async function POST() {
  try {
    const cookieStore = await cookies(); // 👈 Required in Next 15
    const token = cookieStore.get("authToken")?.value;

    const isAuthentic = verifyToken(token);

    if (isAuthentic) {
      await redis.del(token);
      await redis.del("available_products");
      await redis.del(`cashierSale:${isAuthentic.email}`);
      cookieStore.delete("authToken");
    }

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}
