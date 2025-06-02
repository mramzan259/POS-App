"use client";
import { store } from "@/store/store";
import { Provider } from "react-redux";

const CustomLayout = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default CustomLayout;
