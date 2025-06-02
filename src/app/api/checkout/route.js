import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwtfunctions";
import { connectDB } from "@/lib/database/db_connection";
import CashierOrder from "@/lib/model/CashierOrder";
import redis from "@/lib/redis";
import { ProductModel } from "@/lib/model/product";

export async function POST(req) {
  try {
    await connectDB();

    const token = req.cookies.get("authToken")?.value;
    const user = verifyToken(token);

    if (!user) throw new Error("User not authenticated");

    const body = await req.json();
    const { date, time, cartItems, subtotal, discount, grandTotal } = body;
    console.log(cartItems);

    // Loop through and update each product's quantity
    for (const item of cartItems) {
      const product = await ProductModel.findById(item._id);

      if (!product) continue;
      if (product.quantity < item.quantity) {
        console.log("===========2222");
        return NextResponse.json(
          { message: `Insufficient quantity for ${product.name}` },
          { status: 400 }
        );
      }
      console.log("===========3333");

      product.quantity -= item.quantity;
      await product.save();
    }

    // Update Redis cache
    const updatedProducts = await ProductModel.find({ quantity: { $gt: 0 } });
    await redis.set(
      "available_products",
      JSON.stringify(updatedProducts),
      "EX",
      60 * 5
    );

    const newCheckout = {
      date,
      time,
      items: cartItems,
      subtotal,
      discount,
      grandTotal,
    };

    // Check if cashier record already exists
    let existingCashier = await CashierOrder.findOne({
      "cashier.email": user.email,
    });

    if (existingCashier) {
      existingCashier.checkouts.push(newCheckout);
      await existingCashier.save();
    } else {
      await CashierOrder.create({
        cashier: {
          name: user.name,
          email: user.email,
        },
        checkouts: [newCheckout],
      });
    }

    await redis.del(`cashierSale:${user.email}`);

    return NextResponse.json({
      success: true,
      message: "Checkout recorded!",
      name: user.name,
    });
  } catch (err) {
    console.error("Checkout failed:", err.message);
    return NextResponse.json(
      { success: false, message: "Checkout failed" },
      { status: 500 }
    );
  }
}
