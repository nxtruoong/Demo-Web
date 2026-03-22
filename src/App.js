import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import "./styles/global.css";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastProvider>
          <Navbar />
          <Cart />
          <Routes>
            <Route path="/"              element={<Home />}          />
            <Route path="/products"      element={<Products />}      />
            <Route path="/product/:id"   element={<ProductDetail />} />
            <Route path="/checkout"      element={<Checkout />}      />
            <Route path="/about"         element={<About />}         />
            <Route path="*"              element={
              <div style={{ textAlign: "center", padding: "100px 20px" }}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--green-dark)" }}>
                  🌿 Page Not Found
                </h2>
                <p style={{ color: "var(--text-mid)", margin: "12px 0 24px" }}>
                  This page doesn't exist yet.
                </p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            } />
          </Routes>
          <Footer />
        </ToastProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
