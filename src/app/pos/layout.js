import Header from "@/components/Header";
import { getUserFromRedis } from "@/lib/getUserFromRedis";
import React from "react";

const POSlayout = async ({ children }) => {
  const userData = await getUserFromRedis();

  return (
    <>
      <Header user={userData} />
      {children}
    </>
  );
};

export default POSlayout;
