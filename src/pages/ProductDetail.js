import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById, products } from "../data/products";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

function fmt(n) { return n.toLocaleString("vi-VN") + "₫"; }
function Stars({ rating }) {
  return <span className="stars" style={{ color: "var(--amber)", fontSize: "1.1rem" }}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
  </span>;
}

export default function ProductDetail() {
  const { id } = useParams();
  const product = getProductById(id);
  const { dispatch } = useCart();
  const { addToast } = useToast();
  const [qty, setQty] = useState(product?.minOrder || 1);
  const [activeTab, setActiveTab] = useState("story");

  if (!product) {
    return (
      <div className="not-found">
        <h2>🌱 Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm này có thể không còn được bán nữa.</p>
        <Link to="/products" className="btn btn-primary">Quay Lại Cửa Hàng</Link>
      </div>
    );
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id && p.inStock)
    .slice(0, 4);

  function handleAdd() {
    dispatch({ type: "ADD", product, qty });
    dispatch({ type: "TOGGLE_OPEN" });
    addToast(`Đã thêm ${qty} × ${product.name}!`, "🛒");
  }

  return (
    <main className="product-detail">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Trang Chủ</Link>
          <span>›</span>
          <Link to="/products">Sản Phẩm</Link>
          <span>›</span>
          <Link to={"/products?category=" + product.category}>
            {product.category === "fruits"     ? "Trái Cây"         :
             product.category === "vegetables" ? "Rau Củ"           :
             product.category === "grains"     ? "Gạo & Ngũ Cốc"   :
             product.category === "herbs"      ? "Gia Vị & Thảo Mộc":
             product.category === "honey"      ? "Mật Ong"          :
             product.category === "dried"      ? "Đặc Sản Khô"      :
             product.category}
          </Link>
          <span>›</span>
          <span>{product.name}</span>
        </nav>

        {/* Bố cục sản phẩm chính */}
        <div className="pd-layout">
          {/* Hình ảnh */}
          <div className="pd-image-col">
            <div className="pd-image-wrap">
              <img src={product.image} alt={product.name} className="pd-image" />
              {product.badge && (
                <span className={"pd-badge badge badge-" + product.badgeType}>
                  {product.badge}
                </span>
              )}
              {!product.inStock && (
                <div className="pd-soldout-overlay">Hết Hàng</div>
              )}
            </div>
            {product.tags && (
              <div className="pd-tags">
                {product.tags.map(tag => (
                  <span key={tag} className="pd-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Thông tin sản phẩm */}
          <div className="pd-info">
            <p className="pd-origin">📍 {product.origin}</p>
            <h1 className="pd-name">{product.name}</h1>

            <div className="pd-rating-row">
              <Stars rating={product.rating} />
              <span className="pd-rating-num">{product.rating}</span>
              <span className="pd-rating-count">({product.reviews} đánh giá)</span>
            </div>

            <div className="pd-price-row">
              <span className="pd-price">{fmt(product.price)}</span>
              <span className="pd-unit"> / {product.unit}</span>
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Số lượng + Thêm vào giỏ */}
            {product.inStock ? (
              <div className="pd-add-section">
                <div className="pd-qty-control">
                  <button onClick={() => setQty(q => Math.max(product.minOrder || 1, q - 1))}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}>+</button>
                </div>
                <div className="pd-subtotal">
                  Thành tiền: <strong>{fmt(product.price * qty)}</strong>
                </div>
                <button className="btn btn-primary pd-add-btn" onClick={handleAdd}>
                  🛒 Thêm Vào Giỏ Hàng
                </button>
              </div>
            ) : (
              <div className="pd-oos-notice">
                <span>⚠️</span>
                <div>
                  <b>Hiện Đang Hết Hàng</b>
                  <p>Sản phẩm này sẽ có trong mùa thu hoạch tiếp theo.</p>
                </div>
              </div>
            )}

            {/* Cam kết */}
            <div className="pd-guarantees">
              <div className="pd-guarantee"><span>🌿</span><p>100% Tự Nhiên & Tươi</p></div>
              <div className="pd-guarantee"><span>🚚</span><p>Giao trong ngày</p></div>
              <div className="pd-guarantee"><span>🔄</span><p>Đảm bảo độ tươi</p></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="pd-tabs">
          <div className="pd-tabs__nav">
            {["story", "details"].map(tab => (
              <button
                key={tab}
                className={"pd-tab-btn" + (activeTab === tab ? " active" : "")}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "story" ? "🌾 Câu Chuyện Nông Trại" : "📋 Thông Tin Chi Tiết"}
              </button>
            ))}
          </div>
          <div className="pd-tabs__content">
            {activeTab === "story" && (
              <div className="pd-story">
                <p>{product.story}</p>
              </div>
            )}
            {activeTab === "details" && (
              <table className="pd-details-table">
                <tbody>
                  <tr><td>Sản phẩm</td><td>{product.name}</td></tr>
                  <tr><td>Xuất xứ</td><td>{product.origin}</td></tr>
                  <tr><td>Danh mục</td><td>{product.category}</td></tr>
                  <tr><td>Đơn vị</td><td>{product.unit}</td></tr>
                  <tr><td>Đặt hàng tối thiểu</td><td>{product.minOrder} {product.unit}</td></tr>
                  <tr><td>Tình trạng</td><td>{product.inStock ? "✅ Còn Hàng" : "❌ Hết Hàng"}</td></tr>
                  {product.tags && <tr><td>Nhãn</td><td>{product.tags.join(", ")}</td></tr>}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Sản phẩm liên quan */}
        {related.length > 0 && (
          <section className="pd-related">
            <h2 className="section-title">Sản Phẩm Tương Tự</h2>
            <p className="section-subtitle">Thêm những lựa chọn tươi ngon cùng danh mục</p>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
