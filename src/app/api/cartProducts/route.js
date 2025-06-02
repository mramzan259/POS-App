import { connectDB } from "@/lib/database/db_connection";
import { ProductModel } from "@/lib/model/product";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Check Redis Cache
    const cacheKey = "available_products";
    const cached = await redis.get(cacheKey);

    if (cached) {
      console.log("cahced........");
      return NextResponse.json(JSON.parse(cached), { status: 200 });
    }

    // 2. Fetch from MongoDB
    await connectDB();
    const products = await ProductModel.find({ quantity: { $gt: 0 } });
    console.log("get products........");

    // 3. Save in Redis Cache
    await redis.set(cacheKey, JSON.stringify(products));

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
