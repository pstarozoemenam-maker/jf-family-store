import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "./FormField";
import { formatCurrency } from "../utils";

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

export function CheckoutPage({ cart, total, onCheckout }) {
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
      body: JSON.stringify({ email: customer.email, amount: total }),
    });
    const initData = await initResponse.json();

    if (!initData.success) {
      showError(initData.message || "Unable to start payment.");
      return;
    }

    const configResponse = await fetch("/api/paystack/config");
    const configData = await configResponse.json();

    const loaded = await loadPaystackScript();
    if (!loaded || !window.PaystackPop) {
      showError("Paystack payment window could not be loaded.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: configData.publicKey,
      email: customer.email,
      amount: Math.round(total * 100),
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

        const orderSuccess = await onCheckout(customer);
        if (orderSuccess) {
          navigate("/order-confirmation");
        }
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

  if (!cart.length) {
    return (
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Checkout</p>
          <h2>Your cart is empty</h2>
          <p>Add a product before completing your order.</p>
        </div>
        <div className="empty-state">
          <Link to="/shop" className="btn btn-primary">
            Browse Products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Checkout</p>
        <h2>Complete Your Order</h2>
        <p>Pay securely online with Paystack to place your order.</p>
      </div>
      <div className="checkout-grid">
        <div className="auth-card">
          <form onSubmit={handleSubmit}>
            <FormField label="Full Name">
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
              />
            </FormField>
            <FormField label="Email Address">
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
            </FormField>
            <FormField label="Phone Number">
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                required
              />
            </FormField>
            <FormField label="Delivery Address">
              <textarea
                name="address"
                rows="4"
                placeholder="Enter your delivery address"
                required
              />
            </FormField>

            <div className="paystack-note">
              🔒 You will be directed to Paystack to pay card, with your order
              placed only after payment is confirmed.
            </div>

            {errorMessage && <p className="form-message error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : `Pay ${formatCurrency(total)} with Paystack`}
            </button>
          </form>
        </div>
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <p>Total Amount</p>
          <h1>{formatCurrency(total)}</h1>
          <p>Your cart total will automatically appear here.</p>
          <Link to="/cart" className="btn btn-secondary">
            Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
}
