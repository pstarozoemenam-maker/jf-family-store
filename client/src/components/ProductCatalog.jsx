import { Link } from "react-router-dom";
import { formatCurrency } from "../utils";

const productIcons = {
    1: "🍳",
    2: "🧊",
    3: "💡",
    4: "🥤",
    5: "🧺",
    6: "🌬️"
};

export function ProductIcon({ product, className = "emoji" }) {
    return <span className={className}>{productIcons[product.id] || product.icon || "🏠"}</span>;
}

export function ProductGrid({ products, isLoading, wishlist, onAddToCart, onToggleWishlist, emptyMessage = "No products found." }) {
    if (isLoading) return <div className="empty-state"><h2>Loading products...</h2></div>;
    if (!products.length) return <div className="empty-state"><h2>{emptyMessage}</h2></div>;

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

function ProductCard({ product, isWishlisted, onAddToCart, onToggleWishlist }) {
    return (
        <article className="product-card">
            <Link to={`/product?id=${product.id}`} className="product-media" aria-label={`View ${product.name}`}>
                <ProductIcon product={product} />
            </Link>
            <div className="product-content">
                <span className="pill">{product.category}</span>
                <h3><Link to={`/product?id=${product.id}`}>{product.name}</Link></h3>
                <p>{product.description}</p>
                <div className="price">{formatCurrency(product.price)}</div>
                <div className="product-actions">
                    <button className="btn btn-primary" onClick={() => onAddToCart(product.id)}>Add to Cart</button>
                    <button className="btn btn-secondary" onClick={() => onToggleWishlist(product.id)} aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}>
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
                    <div className="product-media"><span className="emoji">{card.icon}</span></div>
                    <div className="product-content">
                        <h3>{card.title}</h3>
                        <p>{card.description}</p>
                    </div>
                </article>
            ))}
        </div>
    );
}
