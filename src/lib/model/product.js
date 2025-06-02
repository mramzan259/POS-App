import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    barcode: String,
    quantity: Number,
    image: String,
  },
  { timestamps: true }
);

export const ProductModel =
  mongoose.models.Inventory || mongoose.model("Inventory", productSchema);
