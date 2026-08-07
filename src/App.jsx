import { useEffect, useMemo, useState } from "react";
import {
    Link,
    Route,
    Routes,
    useNavigate,
    useSearchParams
} from "react-router-dom";
import "../styles.css";
import Header from "./components/Header";
import { InfoCardGrid, ProductGrid, ProductIcon } from "./components/ProductCatalog";
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

function Footer() {
    return <footer className="footer"><p>© 2025 JF & Family. All Rights Reserved.</p></footer>;
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

function CartPage({ cart, products, total, onUpdateQuantity, onRemove }) {
    const items = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);

    return (
        <section className="section">
            <SectionHeading eyebrow="Shopping Cart" title="Your Cart">Review your selected products before checkout.</SectionHeading>
            <div className="cart-layout">
                <div className="detail-card cart-items-card">
                    {!items.length ? <EmptyCart /> : items.map(({ id, quantity, product }) => (
                        <div className="cart-item" key={id}>
                            <div className="cart-icon"><ProductIcon product={product} className="cart-emoji" /></div>
                            <div className="cart-info">
                                <h3>{product.name}</h3>
                                <p>{formatCurrency(product.price)}</p>
                                <div className="cart-controls">
                                    <button onClick={() => onUpdateQuantity(id, -1)} aria-label={`Decrease ${product.name}`}>−</button>
                                    <span>{quantity}</span>
                                    <button onClick={() => onUpdateQuantity(id, 1)} aria-label={`Increase ${product.name}`}>+</button>
                                </div>
                            </div>
                            <div className="cart-right">
                                <strong>{formatCurrency(product.price * quantity)}</strong>
                                <button className="remove-btn" onClick={() => onRemove(id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="summary-box">
                    <h3>Order Summary</h3>
                    <hr className="summary-rule" />
                    <p>Total Amount</p>
                    <h2>{formatCurrency(total)}</h2>
                    {items.length ? <Link to="/checkout" className="btn btn-primary">Proceed to Checkout</Link> : <span className="btn btn-primary disabled">Proceed to Checkout</span>}
                    <Link to="/shop" className="btn btn-secondary">Continue Shopping</Link>
                </div>
            </div>
        </section>
    );
}

function EmptyCart() {
    return <div className="empty-state"><h2>Your cart is empty</h2><p>Add products from the shop.</p><Link to="/shop" className="btn btn-primary">Continue Shopping</Link></div>;
}

function CheckoutPage({ cart, total, onCheckout }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const success = await onCheckout(Object.fromEntries(formData.entries()));
        setIsSubmitting(false);
        if (success) navigate("/");
    }

    if (!cart.length) return <section className="section"><SectionHeading eyebrow="Checkout" title="Your cart is empty">Add a product before completing your order.</SectionHeading><div className="empty-state"><Link to="/shop" className="btn btn-primary">Browse Products</Link></div></section>;

    return (
        <section className="section">
            <SectionHeading eyebrow="Checkout" title="Complete Your Order">Fill in your details below to place your order.</SectionHeading>
            <div className="checkout-grid">
                <div className="auth-card">
                    <form onSubmit={handleSubmit}>
                        <FormField label="Full Name"><input type="text" name="name" placeholder="Enter your full name" required /></FormField>
                        <FormField label="Email Address"><input type="email" name="email" placeholder="Enter your email" required /></FormField>
                        <FormField label="Phone Number"><input type="tel" name="phone" placeholder="Enter your phone number" required /></FormField>
                        <FormField label="Delivery Address"><textarea name="address" rows="4" placeholder="Enter your delivery address" required /></FormField>
                        <FormField label="Payment Method"><select name="payment" defaultValue="" required><option value="">Choose Payment Method</option><option>Cash on Delivery</option><option>Bank Transfer</option><option>Card</option></select></FormField>
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Placing Order..." : "Place Order"}</button>
                    </form>
                </div>
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    <p>Total Amount</p>
                    <h1>{formatCurrency(total)}</h1>
                    <p>Your cart total will automatically appear here.</p>
                    <Link to="/cart" className="btn btn-secondary">Back to Cart</Link>
                </div>
            </div>
        </section>
    );
}

function FormField({ label, children }) {
    return <div className="form-group"><label>{label}</label>{children}</div>;
}

function LoginPage({ onLogin, onMessage }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setIsSubmitting(true);
        const formData = new FormData(event.currentTarget);
        const success = await onLogin(formData.get("email"), formData.get("password"));
        setIsSubmitting(false);
        if (success) navigate("/");
    }

    return <AuthLayout title="Welcome Back" description="Login to continue shopping with JF & Family." onSubmit={handleSubmit} submitLabel={isSubmitting ? "Logging In..." : "Login"} footer={<>Don't have an account? <Link to="/signup">Create Account</Link></>}>
        <FormField label="Email Address"><input type="email" name="email" placeholder="Enter your email" required /></FormField>
        <FormField label="Password"><input type="password" name="password" placeholder="Enter your password" required /></FormField>
    </AuthLayout>;
}

function SignupPage({ onSignup, onMessage }) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (formData.get("password") !== formData.get("confirm")) {
            onMessage("Passwords do not match");
            return;
        }
        setIsSubmitting(true);
        const success = await onSignup(formData.get("name").trim(), formData.get("email").trim(), formData.get("password"));
        setIsSubmitting(false);
        if (success) navigate("/login");
    }

    return <AuthLayout title="Create Account" description="Join JF & Family and start shopping today." onSubmit={handleSubmit} submitLabel={isSubmitting ? "Creating Account..." : "Create Account"} footer={<>Already have an account? <Link to="/login">Login</Link></>}>
        <FormField label="Full Name"><input type="text" name="name" placeholder="Enter your full name" required /></FormField>
        <FormField label="Email Address"><input type="email" name="email" placeholder="Enter your email" required /></FormField>
        <FormField label="Password"><input type="password" name="password" placeholder="Create a password" required /></FormField>
        <FormField label="Confirm Password"><input type="password" name="confirm" placeholder="Confirm your password" required /></FormField>
    </AuthLayout>;
}

function AuthLayout({ title, description, onSubmit, submitLabel, footer, children }) {
    return <section className="auth-section"><div className="auth-card"><h1>{title}</h1><p>{description}</p><form onSubmit={onSubmit}>{children}<button type="submit" className="btn btn-primary">{submitLabel}</button></form><p className="auth-link">{footer}</p></div></section>;
}

function AboutPage() {
    const missionCards = [
        { icon: "🎯", title: "Our Mission", description: "To provide affordable, durable, and innovative home appliances for every family." },
        { icon: "👁️", title: "Our Vision", description: "To become Nigeria's most trusted online appliance store." },
        { icon: "❤️", title: "Our Values", description: "Quality, integrity, customer satisfaction, and continuous innovation." }
    ];

    return <>
        <section className="section">
            <SectionHeading eyebrow="About Us" title="Welcome to JF & Family">Your trusted destination for quality home appliances, kitchen equipment, and lifestyle essentials.</SectionHeading>
            <div className="detail-card">
                <div><h2>Who We Are</h2><p>JF & Family is dedicated to providing premium home appliances that make everyday living easier, smarter, and more comfortable. We believe every home deserves reliable products at affordable prices.</p><br /><p>From modern kitchen equipment to electrical appliances and lifestyle products, our goal is to give customers the best shopping experience possible.</p></div>
                <div className="product-media"><span className="emoji">🏠</span></div>
            </div>
        </section>
        <section className="section"><SectionHeading title="Our Mission" /><InfoCardGrid cards={missionCards} /></section>
    </>;
}

function ContactPage({ onMessage }) {
    function handleSubmit(event) {
        event.preventDefault();
        event.currentTarget.reset();
        onMessage("Message sent successfully!");
    }

    const serviceCards = [
        { icon: "🚚", title: "Fast Delivery", description: "Quick nationwide delivery with secure packaging." },
        { icon: "🔒", title: "Secure Shopping", description: "Your personal information and payments are protected." },
        { icon: "⭐", title: "Quality Guarantee", description: "Only trusted brands and premium home appliances." }
    ];

    return <>
        <section className="section">
            <SectionHeading eyebrow="Contact Us" title="We're Here to Help">Have questions about our products or your order? We'd love to hear from you.</SectionHeading>
            <div className="checkout-grid">
                <div className="auth-card"><h2>Send Us a Message</h2><br /><form onSubmit={handleSubmit}><FormField label="Full Name"><input type="text" name="name" placeholder="Enter your full name" required /></FormField><FormField label="Email Address"><input type="email" name="email" placeholder="Enter your email" required /></FormField><FormField label="Subject"><input type="text" name="subject" placeholder="Subject" required /></FormField><FormField label="Message"><textarea name="message" rows="6" placeholder="Write your message..." required /></FormField><button type="submit" className="btn btn-primary">Send Message</button></form></div>
                <div className="checkout-summary"><h2>Contact Information</h2><br /><p>📍 Abuja, Nigeria</p><br /><p>📞 +234 800 123 4567</p><br /><p>✉ support@jfandfamily.com</p><br /><p>🕒 Monday - Saturday<br />9:00 AM - 6:00 PM</p><br /><Link to="/shop" className="btn btn-secondary">Continue Shopping</Link></div>
            </div>
        </section>
        <section className="section"><SectionHeading title="Why Shop With Us?" /><InfoCardGrid cards={serviceCards} /></section>
    </>;
}

function WishlistPage({ wishlist, products, isLoading, onAddToCart, onToggleWishlist }) {
    const savedProducts = wishlist.map((id) => products.find((product) => product.id === id)).filter(Boolean);
    return <section className="section"><SectionHeading eyebrow="Saved Items" title="Your Wishlist">Keep your favourite products here and add them to your cart anytime.</SectionHeading><ProductGrid products={savedProducts} isLoading={isLoading} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} emptyMessage="Your wishlist is empty." /></section>;
}

function NotFoundPage({ title = "Page not found" }) {
    return <section className="section"><div className="empty-state"><h2>{title}</h2><p>Let’s get you back to the store.</p><Link to="/shop" className="btn btn-primary">Browse Products</Link></div></section>;
}

export default App;
