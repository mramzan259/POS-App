import { connectDB } from "@/lib/database/db_connection";
import { ProductModel } from "@/lib/model/product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const products = await ProductModel.find(); // Fetch all products
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({
      message: "Error fetching products",
      status: 500,
    });
  }
}
