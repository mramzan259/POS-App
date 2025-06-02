import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwtfunctions";
import { connectDB } from "@/lib/database/db_connection";
import CashierOrder from "@/lib/model/CashierOrder";
import redis from "@/lib/redis";

export async function GET(req) {
  await connectDB();

  try {
    const token = req.cookies.get("authToken")?.value;
    const user = verifyToken(token);

    if (!user) throw new Error("User not authenticated");

    const cached = await redis.get(`cashierSale:${user.email}`);

    if (cached) {
      return NextResponse.json({
        success: true,
        cashier: JSON.parse(cached),
      });
    }

    // Check if cashier record already exists
    let cashier = await CashierOrder.findOne({
      "cashier.email": user.email,
    });

    if (cashier) {
      await redis.set(
        `cashierSale:${user.email}`,
        JSON.stringify(cashier),
        "EX",
        60 * 60 * 24
      );

      return NextResponse.json({
        success: true,
        cashier,
      });
    } else {
      return NextResponse.json({
        success: false,
      });
    }
  } catch (err) {
    console.error("Sales fetching failed:", err.message);
    return NextResponse.json(
      { success: false, message: "Sales fetching failed" },
      { status: 500 }
    );
  }
}
