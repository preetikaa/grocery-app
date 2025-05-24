import React from 'react';
import { ShoppingCart, Search } from 'lucide-react';

const SearchResultsPage = ({
  products,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  addToCart,
  removeFromCart,
  getCartQuantity,
  cartCalculations,
  setCurrentPage,
  getStockDisplay,
}) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Groceries</h1>
        <button
          onClick={() => setCurrentPage('checkout')}
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

    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'fruit', 'drinks', 'bakery'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border hover:bg-gray-50'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const qty = getCartQuantity(product.id);
            const isOutOfStock = product.available === 0;
            return (
              <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="relative h-36 flex items-center justify-center mb-4">
                  <img
                    src={product.img || '/placeholder.jpg'}
                    alt={product.name}
                    className="max-h-full object-contain"
                    onError={(e) => (e.target.src = '/placeholder.jpg')}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center text-red-600 font-semibold">
                      Out of Stock
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-500 mb-2 capitalize">{product.category}</p>
                <p className="text-blue-600 font-semibold mb-2">${product.price.toFixed(2)}</p>
                <p className={`mb-4 ${product.available < 10 ? 'text-red-600' : 'text-green-600'}`}>
                  {getStockDisplay(product.available)}
                </p>
                <div className="mt-auto flex items-center space-x-2">
                  <button
                    disabled={isOutOfStock}
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{qty}</span>
                  <button
                    disabled={isOutOfStock}
                    onClick={() => addToCart(product.id)}
                    className="p-2 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
);

export default SearchResultsPage;
