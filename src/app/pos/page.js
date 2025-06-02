"use client";
import ProductSearch from "@/components/ProductSearch";
import CartSummary from "@/components/CartSummary";
import BillSummary from "@/components/BillSummary";

export default function POSPage() {
  
  return (
    <>
      <div className="p-4 bg-gray-100 min-h-[530px] block print:hidden">
        <div className="flex justify-between  ">
          <div className="bg-white p-4 rounded min-h-[480px] shadow basis-[63%]  ">
            <ProductSearch />
            <CartSummary />
          </div>
          <div className="bg-white p-4 rounded shadow basis-[35%] max-h-[30%] ">
            <BillSummary />
          </div>
        </div>
      </div>
    </>
  );
}
