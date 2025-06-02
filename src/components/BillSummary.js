import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, removeItem } from "@/store/cartSlice";
import CheckoutButton from "./CheckoutButton";
import { RxCross2 } from "react-icons/rx";

export default function BillSummary() {
  const { cartItems, discount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const grandTotal = subtotal - discount;

  return (
    <div>
      <h2 className="font-bold mb-2">Bill Details</h2>
      <div className="max-h-[240px] overflow-y-auto px-2 ">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center py-3"
          >
            <div className="flex items-center gap-2">
              <img src={item.image} className="w-14 h-14 rounded-lg " />
              <div>
                <p>{item.name}</p>
                <p className="text-sm text-gray-500">Rs. {item.price}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <button
                className="text-red-500 ml-2 cursor-pointer"
                onClick={() => dispatch(removeItem(item._id))}
              >
                <RxCross2 className="text-[18px] " />
              </button>
              <div className="flex gap-3 lg:flex-row flex-col">
                <p className="ml-4 font-bold">
                  Rs. {item.price * item.quantity}
                </p>
                <div className="flex items-center xl:w-[110px] w-[85px] h-[26px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-white">
                  <button
                    onClick={() => dispatch(decrement(item._id))}
                    className="flex items-center justify-center xl:w-[40px] w-[30px] h-full bg-gradient-to-b from-gray-100 to-gray-200 text-lg text-gray-700 hover:brightness-110 border-r border-gray-300 cursor-pointer"
                  >
                    −
                  </button>

                  <div className="flex-1 text-center text-gray-800 text-base font-medium select-none">
                    {item.quantity}
                  </div>

                  <button
                    onClick={() => dispatch(increment(item._id))}
                    className=" flex items-center justify-center xl:w-[40px] w-[30px] h-full bg-gradient-to-b from-gray-100 to-gray-200 text-lg text-gray-700 hover:brightness-110 border-l border-gray-300 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 mb-5 border-t border-dashed pt-2 space-y-1">
        <p className="flex justify-between">
          <span>Subtotal: </span>
          <span>Rs. {subtotal}</span>
        </p>
        <p className="flex justify-between">
          <span>Discount:</span>
          <span>Rs. {discount}</span>
        </p>

        <p className="flex justify-between font-bold text-xl">
          <span>Grand Total: </span>
          <span>Rs. {grandTotal}</span>
        </p>
      </div>
      <CheckoutButton
        cartItems={cartItems}
        subtotal={subtotal}
        discount={discount}
        grandTotal={grandTotal}
      />
    </div>
  );
}
