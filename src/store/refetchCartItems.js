import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const cartRefreshSlice = createSlice({
  name: "cartRefresh",
  initialState,
  reducers: {
    setRefreshCartItems: (state, action) => {
      return state = state + 1;
    },
  },
});

export const { setRefreshCartItems } = cartRefreshSlice.actions;
export default cartRefreshSlice.reducer;
