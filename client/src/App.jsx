import { useMemo, useState } from "react";
import { Link, Route, Routes, useSearchParams } from "react-router-dom";
import "../styles.css";
import Header from "./components/Header";
import {
  InfoCardGrid,
  ProductGrid,
  ProductIcon,
} from "./components/ProductCatalog";
import { CartPage } from "./components/Cart";
import { WishlistPage } from "./components/Wishlist";
import { CheckoutPage } from "./components/Checkout";
import { LoginPage, SignupPage } from "./components/Auth";
import {
  ProfilePage,
  OrdersPage,
  DeliveredPage,
  ChangePasswordPage,
} from "./components/UserPages";
import Footer from "./components/Footer";
import { AboutPage, ContactPage, NotFoundPage } from "./pages/InfoPages";
import { formatCurrency } from "./utils";
import { StoreProvider, useStore } from "./context/StoreContext";

const choiceCards = [
  {
    icon: "🚚",
    title: "Fast Delivery",
    description:
      "Get your orders delivered quickly and safely anywhere in Nigeria.",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    description:
      "Multiple payment methods with safe and secure checkout.",
  },
  {
    icon: "⭐",
    title: "Quality Products",
    description:
      "Premium appliances carefully selected for durability and performance.",
  },
];

const promiseCards = [
  {
    icon: "🛡️",
    title: "Warranty",
    description:
      "Genuine products backed by manufacturer warranty.",
  },
  {
    icon: "📞",
    title: "Customer Support",
    description:
      "Friendly support team available to help with your orders.",
  },
  {
    icon: "🏆",
    title: "Trusted Brand",
    description:
      "Serving families with quality appliances and excellent service.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Verified Customer",
    image: "/images/customer-1.jpg",
    review:
      "JF & Family made shopping for my new kitchen appliances so easy. Everything arrived safely and on time.",
  },
  {
    name: "David Okafor",
    role: "Verified Customer",
    image: "/images/customer-2.jpg",
    review:
      "Great products and excellent customer service. I will definitely shop with JF & Family again.",
  },
  {
    name: "Amaka Williams",
    role: "Verified Customer",
    image: "/images/customer-3.jpg",
    review:
      "I love the quality of the products. The whole shopping experience was smooth from start to finish.",
  },
];
function App() {
  return (
    <StoreProvider>
      <StoreRoutes />
    </StoreProvider>
  );
}

function StoreRoutes() {
  const {
    products,
    isLoading,
    cart,
    wishlist,
    currentUser,
    toast,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    toggleWishlist,
    login,
    signup,
    logout,
    checkout,
    showToast,
  } = useStore();

  return (
    <>
      <Header
        cartCount={cartCount}
        currentUser={currentUser}
        onLogout={logout}
      />

      <main className="page-shell">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                products={products}
                isLoading={isLoading}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />

          <Route
            path="/shop"
            element={
              <ShopPage
                products={products}
                isLoading={isLoading}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />

          <Route
            path="/product"
            element={
              <ProductPage
                products={products}
                isLoading={isLoading}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                wishlist={wishlist}
              />
            }
          />

          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                products={products}
                total={cartTotal}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            }
          />

          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                total={cartTotal}
                onCheckout={checkout}
              />
            }
          />

          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={login}
                onMessage={showToast}
              />
            }
          />

          <Route
            path="/signup"
            element={
              <SignupPage
                onSignup={signup}
                onMessage={showToast}
              />
            }
          />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/delivered" element={<DeliveredPage />} />
          <Route
            path="/change-password"
            element={<ChangePasswordPage />}
          />

          <Route path="/about" element={<AboutPage />} />

          <Route
            path="/contact"
            element={<ContactPage onMessage={showToast} />}
          />

          <Route
            path="/wishlist"
            element={
              <WishlistPage
                wishlist={wishlist}
                products={products}
                isLoading={isLoading}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
              />
            }
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </main>

      <Footer />

      <div
        className={`toast ${toast ? "show" : ""}`}
        role="status"
      >
        {toast}
      </div>
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

function HomePage({
  products,
  isLoading,
  onAddToCart,
  onToggleWishlist,
  wishlist,
}) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">Premium Home Appliances</p>

          <h1>Upgrade Your Home With Smart Living</h1>

          <p>
            Shop premium kitchen appliances, electrical products,
            and lifestyle essentials from JF & Family.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="btn btn-primary">
              Shop Now
            </Link>

            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="product-media">
            <img
              src="/images/home-appliances.jpg"
              alt="Premium home appliances"
              className="hero-real-image"
            />
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="section">
        <SectionHeading
          eyebrow="Featured Products"
          title="Best Sellers"
        >
          Explore our most popular appliances for every home.
        </SectionHeading>

        <ProductGrid
          products={products}
          isLoading={isLoading}
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </section>

      {/* WHY CHOOSE US */}
      <section className="section">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Everything You Need In One Store"
        />

        <InfoCardGrid cards={choiceCards} />
      </section>

      {/* OUR PROMISE */}
      <section className="section">
        <SectionHeading
          eyebrow="Our Promise"
          title="Shop With Confidence"
        />

        <InfoCardGrid cards={promiseCards} />
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonials-section">
        <SectionHeading
          eyebrow="Customer Reviews"
          title="What Our Customers Say"
        >
          Real experiences from customers who shop with JF & Family.
        </SectionHeading>

        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article
              className="testimonial-card"
              key={testimonial.name}
            >
              <div className="testimonial-stars">
                ★★★★★
              </div>

              <p className="testimonial-review">
                "{testimonial.review}"
              </p>

              <div className="testimonial-author">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="testimonial-avatar"
                />

                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
function ShopPage({
  products,
  isLoading,
  wishlist,
  onAddToCart,
  onToggleWishlist,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Kitchen",
    "Electrical",
    "Lifestyle",
  ];

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category === category;

      const matchesSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Shop"
        title="Browse Our Products"
      >
        Discover premium appliances for your home.
      </SectionHeading>

      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="search-box"
      />

      <div className="filters">
        {categories.map((item) => (
          <button
            key={item}
            className={`filter-btn ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <ProductGrid
        products={filteredProducts}
        isLoading={isLoading}
        wishlist={wishlist}
        onAddToCart={onAddToCart}
        onToggleWishlist={onToggleWishlist}
      />
    </section>
  );
}

function ProductPage({
  products,
  isLoading,
  wishlist,
  onAddToCart,
  onToggleWishlist,
}) {
  const [searchParams] = useSearchParams();

  const product = products.find(
    (item) =>
      item.id === Number(searchParams.get("id"))
  );

  const relatedProducts = product
    ? products
        .filter(
          (item) =>
            item.id !== product.id &&
            item.category === product.category
        )
        .slice(0, 3)
    : [];

  if (isLoading) {
    return (
      <section className="section">
        <div className="empty-state">
          <h2>Loading product...</h2>
        </div>
      </section>
    );
  }

  if (!product) {
    return <NotFoundPage title="Product not found" />;
  }

  return (
    <>
      <section className="section">
        <div className="detail-card">
          <div className="product-media">
            <ProductIcon product={product} />
          </div>

          <div>
            <span className="pill">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="price">
              {formatCurrency(product.price)}
            </div>

            <p>{product.description}</p>

            <div className="product-actions">
              <button
                className="btn btn-primary"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </button>

              <button
                className="btn btn-secondary"
                onClick={() =>
                  onToggleWishlist(product.id)
                }
              >
                {wishlist.includes(product.id)
                  ? "♥ Saved"
                  : "♡ Wishlist"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <SectionHeading
          eyebrow="You May Also Like"
          title="Related Products"
        >
          Explore more premium products from JF & Family.
        </SectionHeading>

        <ProductGrid
          products={relatedProducts}
          wishlist={wishlist}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
        />
      </section>
    </>
  );
}

export default App;