import React from "react";
import { ArrowLeft, Plus, Minus, Gift, ShoppingCart } from "lucide-react";

const CheckoutPage = ({
  cartCalculations,
  addToCart,
  removeFromCart,
  setCurrentPage,
}) => {
  const subtotal = cartCalculations.cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discount = 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Groceries</h1>
          <button
            onClick={() => setCurrentPage("checkout")}
            className="relative inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart
            {cartCalculations.totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                {cartCalculations.totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center space-x-4">
          <button
            onClick={() => setCurrentPage("search")}
            className="p-2 rounded-full"
            aria-label="Back to Search"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {cartCalculations.cartItems.length === 0 &&
        cartCalculations.freeItems.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Your cart is empty.
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-8">
              {cartCalculations.cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-lg shadow p-4"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 object-contain mr-4"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded border border-gray-300 hover:bg-gray-100"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="p-2 rounded border border-gray-300 hover:bg-gray-100"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {cartCalculations.freeItems.length > 0 && (
                <>
                  <h2 className="text-xl font-semibold mb-2">Offers</h2>
                  {cartCalculations.freeItems.map((item, idx) => (
                    <div
                      key={`free-${idx}`}
                      className="flex items-center bg-green-50 rounded-lg p-4 border border-green-300"
                    >
                      <Gift className="w-6 h-6 text-green-600 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-green-700">
                          {item.offerDescription}
                        </p>
                        <p className="text-sm text-green-600 font-semibold">
                          Quantity: {item.quantity} (Free)
                        </p>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="mt-6 p-4 bg-white shadow rounded-lg text-left text-gray-800 space-y-2 max-w-md ml-auto">
              <div className="text-lg">
                Subtotal:{" "}
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="text-lg">
                Discount:{" "}
                <span className="font-medium">${discount.toFixed(2)}</span>
              </div>
              <div className="text-xl font-bold text-black">
                Total: ${total.toFixed(2)}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CheckoutPage;
