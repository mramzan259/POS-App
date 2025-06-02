import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  date: String,
  time: String,
  items: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    },
  ],
  subtotal: Number,
  discount: Number,
  grandTotal: Number,
});

const cashierOrderSchema = new mongoose.Schema({
  cashier: {
    name: String,
    email: String,
  },
  checkouts: [checkoutSchema],
});

export default mongoose.models.CashierOrder ||
  mongoose.model("CashierOrder", cashierOrderSchema);
