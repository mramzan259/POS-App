import { useSelector } from "react-redux";

export default function CartSummary() {
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg mb-2">Cart Preview</h2>
      <div className="flex gap-3 flex-wrap overflow-y-auto max-h-[350px]  ">
        {cartItems.map((item) => (
          <div key={item.id} className="relative py-2 shadow-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-36 h-36 rounded-lg "
            />
            <p
              className="absolute bottom-1 w-full text-center text-md text-black 
                    bg-white/50 backdrop-blur-md rounded-b-md px-2 py-1 shadow-md"
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
