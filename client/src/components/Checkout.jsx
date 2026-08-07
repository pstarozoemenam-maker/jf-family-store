import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FormField from "./FormField";
import { formatCurrency } from "../utils";

export function CheckoutPage({ cart, total, onCheckout }) {
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

    if (!cart.length) return <section className="section"><div className="section-heading"><p className="eyebrow">Checkout</p><h2>Your cart is empty</h2><p>Add a product before completing your order.</p></div><div className="empty-state"><Link to="/shop" className="btn btn-primary">Browse Products</Link></div></section>;

    return (
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">Checkout</p>
                <h2>Complete Your Order</h2>
                <p>Fill in your details below to place your order.</p>
            </div>
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
