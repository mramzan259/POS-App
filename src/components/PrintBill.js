"use client";

export default function PrintBill({ bill }) {
  return (
    <div
      id="print-section"
      className="fixed top-0 left-0 p-4 bg-white text-black w-full"
    >
      <div className="max-w-xs mx-auto border border-dashed border-gray-300 p-4">
        <h2 className="text-center font-bold text-lg mb-2">🧾 Super Mart</h2>
        <p>Date: {bill?.date}</p>
        <p>Time: {bill?.time}</p>

        <div className="my-4 border-t border-b divide-y">
          {bill?.cartItems.map((item, i) => (
            <div key={i} className="flex justify-between py-1">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>Rs. {item.quantity * item.price}</span>
            </div>
          ))}
        </div>

        <div className="text-right mt-4 space-y-1">
          <p>Subtotal: Rs. {bill?.subtotal}</p>
          <p>Discount: Rs. {bill?.discount}</p>
          <p className="font-bold">Total: Rs. {bill?.grandTotal}</p>
        </div>
      </div>
    </div>
  );
}
