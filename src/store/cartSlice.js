import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  discount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((i) => i._id === item._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
    },
    increment: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },
    decrement: (state, action) => {
      const item = state.cartItems.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    removeItem: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.discount = 0;
    },
  },
});

export const {
  addToCart,
  increment,
  decrement,
  removeItem,
  setDiscount,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
