import { ProductGrid } from "./ProductCatalog";

export function WishlistPage({ wishlist, products, isLoading, onAddToCart, onToggleWishlist }) {
    const savedProducts = wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);

    return (
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">Saved Items</p>
                <h2>Your Wishlist</h2>
                <p>Keep your favourite products here and add them to your cart anytime.</p>
            </div>
            <ProductGrid
                products={savedProducts}
                isLoading={isLoading}
                wishlist={wishlist}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                emptyMessage="Your wishlist is empty."
            />
        </section>
    );
}
