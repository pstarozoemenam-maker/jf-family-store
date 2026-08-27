import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../utils";
import { Icon } from "./MobileIcons";
import { MobileFooter } from "./MobileFooter";

export function MobileHome() {
  const { products, isLoading, wishlist, cart, addToCart, toggleWishlist } =
    useStore();

  const featured = useMemo(
    () => (Array.isArray(products) ? products.slice(0, 6) : []),
    [products],
  );

  return (
    <>
      <section className="m-hero">
        <p className="m-eyebrow">Premium Home Appliances</p>
        <h1>Upgrade your home with smart living</h1>
        <p>
          Shop premium kitchen, electrical and lifestyle essentials from JF
          &amp; Family.
        </p>
        <Link to="/m/shop" className="m-btn m-btn-primary m-btn-block">
          Shop Now
        </Link>
      </section>

      <section className="m-section">
        <div className="m-section-head">
          <div>
            <p className="m-eyebrow">Featured</p>
            <h2>Best Sellers</h2>
          </div>
          <Link to="/m/shop" className="m-link">
            See all
          </Link>
        </div>

        <MobileProductGrid
          products={featured}
          isLoading={isLoading}
          wishlist={wishlist}
          cart={cart}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
        />
      </section>

      <section className="m-section">
        <div className="m-section-head">
          <div>
            <p className="m-eyebrow">Why us</p>
            <h2>Shop with confidence</h2>
          </div>
        </div>
        <MobileFeatureRow />
      </section>

      <MobileFooter />
    </>
  );
}

const features = [
  { icon: "truck", title: "Fast Delivery", text: "Quick, safe delivery across Nigeria." },
  { icon: "card", title: "Secure Payments", text: "Safe checkout with multiple options." },
  { icon: "shield", title: "Genuine Warranty", text: "Quality backed by real warranties." },
];

function MobileFeatureRow() {
  return (
    <div className="m-features">
      {features.map((f) => (
        <div className="m-feature" key={f.title}>
          <span className="m-feature-icon">
            <Icon name={f.icon} size={24} />
          </span>
          <div>
            <strong>{f.title}</strong>
            <p>{f.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileShop() {
  const { products, isLoading, wishlist, cart, addToCart, toggleWishlist } =
    useStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", "Kitchen", "Electrical", "Lifestyle"];

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (Array.isArray(products) ? products : []).filter((p) => {
      const matchesCategory =
        category === "All" || p.category === category;
      const matchesSearch =
        !keyword || p.name.toLowerCase().includes(keyword);
      return matchesCategory && matchesSearch;
    });
  }, [category, products, search]);

  return (
    <section className="m-section m-shop">
      <div className="m-searchbar m-searchbar-active">
        <Icon name="search" size={20} />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
        />
      </div>

      <div className="m-chips">
        {categories.map((item) => (
          <button
            key={item}
            className={`m-chip ${category === item ? "active" : ""}`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <MobileProductGrid
        products={filtered}
        isLoading={isLoading}
        wishlist={wishlist}
        cart={cart}
        onAddToCart={addToCart}
        onToggleWishlist={toggleWishlist}
        emptyMessage="No products found."
      />
    </section>
  );
}

export function MobileProductGrid({
  products,
  isLoading,
  wishlist,
  cart,
  onAddToCart,
  onToggleWishlist,
  emptyMessage = "Nothing here yet.",
}) {
  if (isLoading) {
    return (
      <div className="m-loader">
        <span className="m-loading">Loading products...</span>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="m-empty">
        <h3>{emptyMessage}</h3>
      </div>
    );
  }

  return (
    <div className="m-grid">
      {products.map((p) => {
        const inCart = cart.some((item) => item.id === p.id);
        return (
          <article className="m-card" key={p.id}>
            <Link to={`/m/product?id=${p.id}`} className="m-card-media">
              <img src={p.image} alt={p.name} loading="lazy" />
              {p.badge && (
                <span className={`m-badge m-badge-${p.badge.toLowerCase()}`}>
                  {p.badge}
                </span>
              )}
              <button
                type="button"
                className={`m-wish ${wishlist.includes(p.id) ? "on" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleWishlist(p.id);
                }}
                aria-label={
                  wishlist.includes(p.id)
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Icon
                  name={wishlist.includes(p.id) ? "heartFill" : "heart"}
                  size={20}
                />
              </button>
            </Link>

            <div className="m-card-body">
              <span className="m-pill">{p.category}</span>
              <div className="m-rating">
                <Icon name="star" size={14} />
                <span>{p.rating}</span>
              </div>
              <Link to={`/m/product?id=${p.id}`} className="m-card-title">
                {p.name}
              </Link>
              <div className="m-price">
                {p.oldPrice && (
                  <span className="m-price-old">
                    {formatCurrency(p.oldPrice)}
                  </span>
                )}
                {formatCurrency(p.price)}
              </div>
              <button
                type="button"
                className={`m-add ${inCart ? "m-add-on" : ""}`}
                onClick={() => onAddToCart(p.id)}
              >
                <Icon name="cart" size={18} />
                {inCart ? "In Cart" : "Add"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function MobileProduct() {
  const [searchParams] = useSearchParams();
  const { products, isLoading, wishlist, cart, addToCart, toggleWishlist } =
    useStore();
  const navigate = useNavigate();

  const product = (Array.isArray(products) ? products : []).find(
    (p) => p.id === Number(searchParams.get("id")),
  );

  const related = product
    ? (Array.isArray(products) ? products : [])
        .filter((p) => p.id !== product.id && p.category === product.category)
        .slice(0, 4)
    : [];

  const inCart = cart.some((item) => item.id === product?.id);

  if (isLoading) {
    return <div className="m-loader">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="m-empty">
        <h3>Product not found</h3>
        <Link to="/m/shop" className="m-btn m-btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="m-detail">
        <button
          type="button"
          className="m-back"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <Icon name="back" size={22} />
        </button>

        <div className="m-detail-media">
          <img src={product.image} alt={product.name} />
          <button
            type="button"
            className={`m-wish ${wishlist.includes(product.id) ? "on" : ""}`}
            onClick={() => toggleWishlist(product.id)}
            aria-label="Toggle wishlist"
          >
            <Icon
              name={wishlist.includes(product.id) ? "heartFill" : "heart"}
              size={22}
            />
          </button>
        </div>

        <div className="m-detail-body">
          <div className="m-detail-top">
            <span className="m-pill">{product.category}</span>
            <div className="m-rating">
              <Icon name="star" size={14} />
              <span>{product.rating}</span>
              {product.reviews && <em>({product.reviews})</em>}
            </div>
          </div>

          <h1>{product.name}</h1>

          <div className="m-price m-price-lg">
            {product.oldPrice && (
              <span className="m-price-old">
                {formatCurrency(product.oldPrice)}
              </span>
            )}
            {formatCurrency(product.price)}
          </div>

          <p className="m-detail-desc">{product.description}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="m-section">
          <div className="m-section-head">
            <div>
              <p className="m-eyebrow">You may also like</p>
              <h2>Related</h2>
            </div>
          </div>
          <div className="m-grid">
            {related.map((p) => (
              <article className="m-card" key={p.id}>
                <Link to={`/m/product?id=${p.id}`} className="m-card-media">
                  <img src={p.image} alt={p.name} loading="lazy" />
                </Link>
                <div className="m-card-body">
                  <span className="m-pill">{p.category}</span>
                  <Link to={`/m/product?id=${p.id}`} className="m-card-title">
                    {p.name}
                  </Link>
                  <div className="m-price">{formatCurrency(p.price)}</div>
                  <button
                    type="button"
                    className={`m-add ${cart.some((i) => i.id === p.id) ? "m-add-on" : ""}`}
                    onClick={() => addToCart(p.id)}
                  >
                    <Icon name="cart" size={18} />
                    {cart.some((i) => i.id === p.id) ? "In Cart" : "Add"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="m-buybar">
        <button
          type="button"
          className={`m-buy-big ${inCart ? "m-buy-on" : ""}`}
          onClick={() => addToCart(product.id)}
        >
          <Icon name="cart" size={20} />
          {inCart ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>

      <MobileFooter />
    </>
  );
}

export function MobileCart() {
  const { cart, products, cartTotal, updateQuantity, removeFromCart } =
    useStore();

  const items = (Array.isArray(cart) ? cart : [])
    .map((item) => ({
      ...item,
      product: (Array.isArray(products) ? products : []).find(
        (p) => p.id === item.id,
      ),
    }))
    .filter((item) => item.product);

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Shopping cart</p>
          <h2>Your Cart</h2>
        </div>
      </div>

      {!items.length ? (
        <div className="m-empty">
          <span className="m-empty-icon">
            <Icon name="cart" size={40} />
          </span>
          <h3>Your cart is empty</h3>
          <p>Add products from the shop to get started.</p>
          <Link to="/m/shop" className="m-btn m-btn-primary">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="m-cart-list">
            {items.map(({ id, quantity, product }) => (
              <div className="m-cart-item" key={id}>
                <Link to={`/m/product?id=${product.id}`} className="m-cart-thumb">
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="m-cart-info">
                  <Link to={`/m/product?id=${product.id}`} className="m-cart-name">
                    {product.name}
                  </Link>
                  <div className="m-price">{formatCurrency(product.price)}</div>
                  <div className="m-qty">
                    <button
                      onClick={() => updateQuantity(id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Icon name="minus" size={18} />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() => updateQuantity(id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Icon name="plus" size={18} />
                    </button>
                    <button
                      className="m-remove"
                      onClick={() => removeFromCart(id)}
                      aria-label="Remove item"
                    >
                      <Icon name="trash" size={18} />
                    </button>
                  </div>
                </div>
                <div className="m-cart-subtotal">
                  {formatCurrency(product.price * quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="m-summary">
            <div className="m-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
            <div className="m-summary-row">
              <span>Delivery</span>
              <strong>Calculated at checkout</strong>
            </div>
            <div className="m-summary-row m-summary-total">
              <span>Total</span>
              <strong>{formatCurrency(cartTotal)}</strong>
            </div>
            <Link to="/m/checkout" className="m-btn m-btn-primary m-btn-block">
              Proceed to Checkout
            </Link>
            <Link to="/m/shop" className="m-btn m-btn-ghost m-btn-block">
              Continue shopping
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export function MobileWishlist() {
  const { products, wishlist, cart, addToCart, toggleWishlist } = useStore();

  const items = (Array.isArray(products) ? products : []).filter((p) =>
    (Array.isArray(wishlist) ? wishlist : []).includes(p.id),
  );

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Saved for later</p>
          <h2>Your Wishlist</h2>
        </div>
      </div>

      {!items.length ? (
        <div className="m-empty">
          <span className="m-empty-icon">
            <Icon name="heart" size={40} />
          </span>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart on any product to save it here.</p>
          <Link to="/m/shop" className="m-btn m-btn-primary">
            Explore products
          </Link>
        </div>
      ) : (
        <div className="m-grid">
          {items.map((p) => (
            <article className="m-card" key={p.id}>
              <Link to={`/m/product?id=${p.id}`} className="m-card-media">
                <img src={p.image} alt={p.name} loading="lazy" />
                <button
                  type="button"
                  className="m-wish on"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(p.id);
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Icon name="heartFill" size={20} />
                </button>
              </Link>
              <div className="m-card-body">
                <span className="m-pill">{p.category}</span>
                <Link to={`/m/product?id=${p.id}`} className="m-card-title">
                  {p.name}
                </Link>
                <div className="m-price">{formatCurrency(p.price)}</div>
                <button
                  type="button"
                  className={`m-add ${cart.some((i) => i.id === p.id) ? "m-add-on" : ""}`}
                  onClick={() => addToCart(p.id)}
                >
                  <Icon name="cart" size={18} />
                  {cart.some((i) => i.id === p.id) ? "In Cart" : "Add"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function MobileCheckout() {
  const { cart, cartTotal, checkout } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function showError(message) {
    setErrorMessage(message);
    window.setTimeout(() => setErrorMessage(""), 5000);
  }

  async function payWithPaystack(customer) {
    const initResponse = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customer.email, amount: cartTotal }),
    });
    const initData = await initResponse.json();
    if (!initData.success) {
      showError(initData.message || "Unable to start payment.");
      return;
    }

    const configResponse = await fetch("/api/paystack/config");
    const configData = await configResponse.json();

    await loadPaystackScript();

    if (!window.PaystackPop) {
      showError("Paystack payment window could not be loaded.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: configData.publicKey,
      email: customer.email,
      amount: Math.round(cartTotal * 100),
      currency: "NGN",
      ref: initData.reference,
      callback: async () => {
        const verifyResponse = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: initData.reference }),
        });
        const verifyData = await verifyResponse.json();
        if (!verifyData.success) {
          showError(verifyData.message || "Payment could not be confirmed.");
          return;
        }
        const orderSuccess = await checkout(customer);
        if (orderSuccess) navigate("/m/order-confirmation");
      },
      onClose: () => {
        showError("Payment was cancelled. Your order was not placed.");
      },
    });
    handler.openIframe();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const customer = Object.fromEntries(formData.entries());
    customer.payment = "Paystack";

    try {
      await payWithPaystack(customer);
    } catch (error) {
      console.error(error);
      showError("Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!(Array.isArray(cart) && cart.length)) {
    return (
      <div className="m-empty">
        <h3>Your cart is empty</h3>
        <p>Add a product before completing your order.</p>
        <Link to="/m/shop" className="m-btn m-btn-primary">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <section className="m-section m-checkout">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Checkout</p>
          <h2>Complete your order</h2>
        </div>
      </div>

      <div className="m-summary m-summary-compact">
        <div className="m-summary-row">
          <span>Order total</span>
          <strong>{formatCurrency(cartTotal)}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="m-form">
        <Field label="Full Name">
          <input type="text" name="name" placeholder="Enter your full name" required />
        </Field>
        <Field label="Email Address">
          <input type="email" name="email" placeholder="Enter your email" required />
        </Field>
        <Field label="Phone Number">
          <input type="tel" name="phone" placeholder="Enter your phone number" required />
        </Field>
        <Field label="Delivery Address">
          <textarea name="address" rows="3" placeholder="Enter your delivery address" required />
        </Field>

        <div className="m-note">
          🔒 You will be directed to Paystack to pay with card. Your order is
          placed only after payment is confirmed.
        </div>

        {errorMessage && <p className="m-error">{errorMessage}</p>}

        <button
          type="submit"
          className="m-btn m-btn-primary m-btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Please wait..."
            : `Pay ${formatCurrency(cartTotal)} securely`}
        </button>
        <Link to="/m/cart" className="m-btn m-btn-ghost m-btn-block">
          Back to cart
        </Link>
      </form>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div className="m-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

export function MobileOrderConfirmation() {
  const { lastOrder, products } = useStore();

  if (!lastOrder || !lastOrder.items) {
    return (
      <div className="m-empty">
        <h3>No recent order</h3>
        <p>Head to the shop to place your first order.</p>
        <Link to="/m/shop" className="m-btn m-btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  const { customer, items, total } = lastOrder;

  return (
    <section className="m-confirm">
      <div className="m-confirm-icon">
        <Icon name="check" size={40} />
      </div>
      <p className="m-eyebrow">Order confirmed</p>
      <h1>Thank you, {customer?.name || "friend"}!</h1>
      <p className="m-confirm-sub">
        Your order has been placed successfully. A confirmation was sent to{" "}
        <strong>{customer?.email}</strong>.
      </p>

      <div className="m-confirm-card">
        <h3>Order summary</h3>
        {(items || []).map((item) => {
          const product = (Array.isArray(products) ? products : []).find(
            (p) => p.id === item.id,
          );
          if (!product) return null;
          return (
            <div className="m-confirm-row" key={item.id}>
              <span>
                {product.name} × {item.quantity}
              </span>
              <strong>{formatCurrency(product.price * item.quantity)}</strong>
            </div>
          );
        })}
        <div className="m-confirm-row m-confirm-total">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <div className="m-confirm-delivery">
        <p>
          <strong>Delivery address:</strong> {customer?.address}
        </p>
        <p>
          <strong>Payment:</strong> {customer?.payment}
        </p>
      </div>

      <div className="m-confirm-actions">
        <Link to="/m/shop" className="m-btn m-btn-primary m-btn-block">
          Continue shopping
        </Link>
        <Link to="/m/orders" className="m-btn m-btn-ghost m-btn-block">
          View my orders
        </Link>
      </div>
    </section>
  );
}

function loadPaystackScript() {
  return new Promise((resolve) => {
    if (window.PaystackPop) {
      resolve(true);
      return;
    }
    const existing = document.getElementById("paystack-inline-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.id = "paystack-inline-js";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
