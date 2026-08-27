import { Link } from "react-router-dom";
import { formatCurrency } from "../utils";

const featureIcons = {
  "🚚": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6Zm-8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "💳": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18M7 15h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  ),

  "⭐": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "🛡️": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6l8-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "📞": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.6 3.5 9 3l2 4.5-1.8 1.6a14 14 0 0 0 5.7 5.7l1.6-1.8 4.5 2-0.5 2.4c-.3 1.2-1.4 2-2.6 2C10.3 19.4 4.6 13.7 4.6 6.1c0-1.2.8-2.3 2-2.6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),

  "🏆": (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 4h8v5a4 4 0 0 1-8 0V4Zm4 9v4m-4 3h8M5 5H3v2a4 4 0 0 0 4 4m12-6h2v2a4 4 0 0 1-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function ProductIcon({ product, className = "emoji" }) {
  return (
    <img
      src={product.image}
      alt={product.name}
      className={className}
      loading="lazy"
    />
  );
}

export function ProductGrid({
  products,
  isLoading,
  wishlist,
  onAddToCart,
  onToggleWishlist,
  emptyMessage = "No products found.",
}) {
  if (isLoading) {
    return (
      <div className="empty-state">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="empty-state">
        <h2>{emptyMessage}</h2>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlist.includes(product.id)}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  isWishlisted,
  onAddToCart,
  onToggleWishlist,
}) {
  return (
    <article className="product-card">
        <Link
          to={`/product?id=${product.id}`}
          className="product-media"
          aria-label={`View ${product.name}`}
        >
          <ProductIcon product={product} />
          {product.badge && (
            <span
              className={`product-badge badge-${product.badge.toLowerCase()}`}
            >
              {product.badge}
            </span>
          )}
        </Link>

        <div className="product-content">
          <div className="product-meta">
            <span className="pill">{product.category}</span>
            <div className="product-rating">
              <span className="stars">
                {"★".repeat(Math.round(product.rating || 0))}
              </span>
              <span className="rating-value">{product.rating}</span>
              {product.reviews && (
                <span className="reviews">({product.reviews})</span>
              )}
            </div>
          </div>

          <h3>
            <Link to={`/product?id=${product.id}`}>
              {product.name}
            </Link>
          </h3>

          <p>{product.description}</p>

          <div className="price">
            {product.oldPrice && (
              <span className="price-old">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            {formatCurrency(product.price)}
          </div>

        <div className="product-actions">
          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(product.id)}
          >
            Add to Cart
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => onToggleWishlist(product.id)}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            {isWishlisted ? "♥ Saved" : "♡"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function InfoCardGrid({ cards }) {
  return (
    <div className="product-grid">
      {cards.map((card) => (
        <article className="product-card" key={card.title}>
          <div className="product-media feature-icon">
            {featureIcons[card.icon] || card.icon}
          </div>

          <div className="product-content">
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}