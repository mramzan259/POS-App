import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import cartRefetchReducer from "./refetchCartItems"


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    cartRefetch: cartRefetchReducer,
  },
});
