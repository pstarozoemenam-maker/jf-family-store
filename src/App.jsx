import { useEffect, useMemo, useState } from "react";
import {
    Link,
    Route,
    Routes,
    useSearchParams
} from "react-router-dom";
import "../styles.css";
import Header from "./components/Header";
import { InfoCardGrid, ProductGrid, ProductIcon } from "./components/ProductCatalog";
import { CartPage } from "./components/Cart";
import { WishlistPage } from "./components/Wishlist";
import { CheckoutPage } from "./components/Checkout";
import { LoginPage, SignupPage } from "./components/Auth";
import Footer from "./components/Footer";
import { AboutPage, ContactPage, NotFoundPage } from "./pages/InfoPages";
import { formatCurrency } from "./utils";

const choiceCards = [
    {
        icon: "🚚",
        title: "Fast Delivery",
        description: "Get your orders delivered quickly and safely anywhere in Nigeria."
    },
    {
        icon: "💳",
        title: "Secure Payments",
        description: "Multiple payment methods with safe and secure checkout."
    },
    {
        icon: "⭐",
        title: "Quality Products",
        description: "Premium appliances carefully selected for durability and performance."
    }
];

const promiseCards = [
    {
        icon: "🛡️",
        title: "Warranty",
        description: "Genuine products backed by manufacturer warranty."
    },
    {
        icon: "📞",
        title: "Customer Support",
        description: "Friendly support team available to help with your orders."
    },
    {
        icon: "🏆",
        title: "Trusted Brand",
        description: "Serving families with quality appliances and excellent service."
    }
];

function useStoredState(key, initialValue) {
    const [value, setValue] = useState(() => {
        try {
            const storedValue = localStorage.getItem(key);
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

function App() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useStoredState("cart", []);
    const [wishlist, setWishlist] = useStoredState("wishlist", []);
    const [currentUser, setCurrentUser] = useStoredState("user", null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadProducts() {
            try {
                const response = await fetch("/api/products");
                if (!response.ok) throw new Error("Product request failed");
                const data = await response.json();
                if (isMounted) setProducts(data);
            } catch (error) {
                console.error(error);
                if (isMounted) setToast("Unable to load products.");
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadProducts();
        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(""), 2500);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const getProduct = (id) => products.find((product) => product.id === Number(id));
    const cartTotal = cart.reduce((total, item) => {
        const product = getProduct(item.id);
        return total + (product ? product.price * item.quantity : 0);
    }, 0);

    function showToast(message) {
        setToast(message);
    }

    function addToCart(id) {
        setCart((previousCart) => {
            const existingItem = previousCart.find((item) => item.id === id);
            if (existingItem) {
                return previousCart.map((item) =>
                    item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...previousCart, { id, quantity: 1 }];
        });
        showToast("Added to cart");
    }

    function removeFromCart(id) {
        setCart((previousCart) => previousCart.filter((item) => item.id !== id));
    }

    function updateQuantity(id, change) {
        setCart((previousCart) => previousCart
            .map((item) => item.id === id ? { ...item, quantity: item.quantity + change } : item)
            .filter((item) => item.quantity > 0));
    }

    function toggleWishlist(id) {
        setWishlist((previousWishlist) => {
            if (previousWishlist.includes(id)) {
                showToast("Removed from wishlist");
                return previousWishlist.filter((item) => item !== id);
            }
            showToast("Added to wishlist");
            return [...previousWishlist, id];
        });
    }

    async function login(email, password) {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!data.success) {
                showToast(data.message || "Invalid email or password");
                return false;
            }
            setCurrentUser(data.user);
            showToast("Login successful");
            return true;
        } catch (error) {
            console.error(error);
            showToast("Login failed");
            return false;
        }
    }

    async function signup(name, email, password) {
        try {
            const response = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            const data = await response.json();
            if (!data.success) {
                showToast(data.message || "Signup failed");
                return false;
            }
            showToast("Account created successfully");
            return true;
        } catch (error) {
            console.error(error);
            showToast("Signup failed");
            return false;
        }
    }

    function logout() {
        setCurrentUser(null);
        showToast("Logged out");
    }

    async function checkout(customer) {
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    payment: customer.payment,
                    total: cartTotal,
                    items: cart
                })
            });
            const data = await response.json();
            if (!data.success) {
                showToast("Unable to place order");
                return false;
            }
            setCart([]);
            showToast("Order placed successfully");
            return true;
        } catch (error) {
            console.error(error);
            showToast("Server error");
            return false;
        }
    }

    return (
        <>
            <Header cartCount={cartCount} currentUser={currentUser} onLogout={logout} />
            <main className="page-shell">
                <Routes>
                    <Route path="/" element={<HomePage products={products} isLoading={isLoading} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/shop" element={<ShopPage products={products} isLoading={isLoading} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/product" element={<ProductPage products={products} isLoading={isLoading} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} wishlist={wishlist} />} />
                    <Route path="/cart" element={<CartPage cart={cart} products={products} total={cartTotal} onUpdateQuantity={updateQuantity} onRemove={removeFromCart} />} />
                    <Route path="/checkout" element={<CheckoutPage cart={cart} total={cartTotal} onCheckout={checkout} />} />
                    <Route path="/login" element={<LoginPage onLogin={login} onMessage={showToast} />} />
                    <Route path="/signup" element={<SignupPage onSignup={signup} onMessage={showToast} />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage onMessage={showToast} />} />
                    <Route path="/wishlist" element={<WishlistPage wishlist={wishlist} products={products} isLoading={isLoading} onAddToCart={addToCart} onToggleWishlist={toggleWishlist} />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
            <Footer />
            <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
        </>
    );
}

function SectionHeading({ eyebrow, title, children }) {
    return (
        <div className="section-heading">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2>{title}</h2>
            {children && <p>{children}</p>}
        </div>
    );
}

function HomePage({ products, isLoading, onAddToCart, onToggleWishlist, wishlist }) {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <p className="eyebrow">Premium Home Appliances</p>
                    <h1>Upgrade Your Home With Smart Living</h1>
                    <p>Shop premium kitchen appliances, electrical products, and lifestyle essentials from JF & Family.</p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                        <Link to="/about" className="btn btn-secondary">Learn More</Link>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="product-media"><span className="emoji">🏠</span></div>
                </div>
            </section>
            <section className="section">
                <SectionHeading eyebrow="Featured Products" title="Best Sellers">Explore our most popular appliances for every home.</SectionHeading>
                <ProductGrid products={products} isLoading={isLoading} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
            </section>
            <section className="section">
                <SectionHeading eyebrow="Why Choose Us" title="Everything You Need In One Store" />
                <InfoCardGrid cards={choiceCards} />
            </section>
            <section className="section">
                <SectionHeading eyebrow="Our Promise" title="Shop With Confidence" />
                <InfoCardGrid cards={promiseCards} />
            </section>
        </>
    );
}

function ShopPage({ products, isLoading, wishlist, onAddToCart, onToggleWishlist }) {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const categories = ["All", "Kitchen", "Electrical", "Lifestyle"];
    const filteredProducts = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        return products.filter((product) => {
            const matchesCategory = category === "All" || product.category === category;
            const matchesSearch = !keyword || product.name.toLowerCase().includes(keyword) || product.category.toLowerCase().includes(keyword);
            return matchesCategory && matchesSearch;
        });
    }, [category, products, search]);

    return (
        <section className="section">
            <SectionHeading eyebrow="Shop" title="Browse Our Products">Discover premium appliances for your home.</SectionHeading>
            <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products..." aria-label="Search products" className="search-box" />
            <div className="filters">
                {categories.map((item) => <button key={item} className={`filter-btn ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            <ProductGrid products={filteredProducts} isLoading={isLoading} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
        </section>
    );
}

function ProductPage({ products, isLoading, wishlist, onAddToCart, onToggleWishlist }) {
    const [searchParams] = useSearchParams();
    const product = products.find((item) => item.id === Number(searchParams.get("id")));
    const relatedProducts = product ? products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3) : [];

    if (isLoading) return <section className="section"><div className="empty-state"><h2>Loading product...</h2></div></section>;
    if (!product) return <NotFoundPage title="Product not found" />;

    return (
        <>
            <section className="section">
                <div className="detail-card">
                    <div className="product-media"><ProductIcon product={product} /></div>
                    <div>
                        <span className="pill">{product.category}</span>
                        <h1>{product.name}</h1>
                        <div className="price">{formatCurrency(product.price)}</div>
                        <p>{product.description}</p>
                        <div className="product-actions">
                            <button className="btn btn-primary" onClick={() => onAddToCart(product.id)}>Add to Cart</button>
                            <button className="btn btn-secondary" onClick={() => onToggleWishlist(product.id)}>{wishlist.includes(product.id) ? "♥ Saved" : "♡ Wishlist"}</button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section">
                <SectionHeading eyebrow="You May Also Like" title="Related Products">Explore more premium products from JF & Family.</SectionHeading>
                <ProductGrid products={relatedProducts} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} />
            </section>
        </>
    );
}

export default App;
