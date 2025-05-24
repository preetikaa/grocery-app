import React, { useState, useEffect, useMemo } from "react";
import SearchResultsPage from "./components/SearchResultsPage";
import CheckoutPage from "./components/CheckoutPage";
import "./App.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState("search");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://uxdlyqjm9i.execute-api.eu-west-1.amazonaws.com/s?category=${selectedCategory}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(
          data.map((product) => ({
            ...product,
            price: parseFloat(product.price.replace("£", "")),
          }))
        );
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const cartCalculations = useMemo(() => {
    const cartItems = [];
    const freeItems = [];
    let subtotal = 0;
    let totalItems = 0;

    Object.entries(cart).forEach(([productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId));
      if (product && quantity > 0) {
        cartItems.push({
          ...product,
          quantity,
          total: product.price * quantity,
        });
        subtotal += product.price * quantity;
        totalItems += quantity;
      }
    });

    const cocaColaItem = cartItems.find((item) =>
      item.name.toLowerCase().includes("coca-cola")
    );
    if (cocaColaItem && cocaColaItem.quantity >= 6) {
      const freeQty = Math.floor(cocaColaItem.quantity / 6);
      freeItems.push({
        ...cocaColaItem,
        quantity: freeQty,
        isFree: true,
        offerDescription: "Buy 6 Coca-Cola, get 1 free",
      });
      totalItems += freeQty;
    }

    const croissantItem = cartItems.find((item) =>
      item.name.toLowerCase().includes("croissant")
    );
    if (croissantItem && croissantItem.quantity >= 3) {
      const freeQty = Math.floor(croissantItem.quantity / 3);
      const coffeeProduct = products.find((p) =>
        p.name.toLowerCase().includes("coffee")
      );
      if (coffeeProduct) {
        freeItems.push({
          ...coffeeProduct,
          quantity: freeQty,
          isFree: true,
          offerDescription: "Buy 3 Croissants, get Coffee free",
        });
        totalItems += freeQty;
      }
    }

    return {
      cartItems,
      freeItems,
      subtotal,
      totalItems,
      total: subtotal,
    };
  }, [cart, products]);

  const addToCart = (productId) =>
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));

  const removeFromCart = (productId) =>
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) newCart[productId]--;
      else delete newCart[productId];
      return newCart;
    });

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      setCart((prev) => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
    } else {
      setCart((prev) => ({
        ...prev,
        [productId]: quantity,
      }));
    }
  };

  return (
    <>
      {currentPage === "search" && (
        <SearchResultsPage
          products={filteredProducts}
          loading={loading}
          error={error}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          getCartQuantity={(id) => cart[id] || 0}
          cartCalculations={cartCalculations}
          setCurrentPage={setCurrentPage}
          getStockDisplay={(available) =>
            available >= 10 ? "Available" : `${available} left`
          }
        />
      )}
      {currentPage === "checkout" && (
        <CheckoutPage
          cartCalculations={cartCalculations}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          setCurrentPage={setCurrentPage}
        />
      )}
    </>
  );
};

export default App;
