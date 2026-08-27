import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../utils";

export function OrderConfirmationPage() {
  const { lastOrder, products } = useStore();

  if (!lastOrder || !lastOrder.items) {
    return (
      <section className="section">
        <div className="empty-state">
          <h2>No recent order</h2>
          <p>Head to the shop to place your first order.</p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  const { customer, items, total } = lastOrder;

  return (
    <section className="section">
      <div className="confirmation-card">
        <div className="confirmation-icon">✓</div>
        <p className="eyebrow">Order Confirmed</p>
        <h2>Thank you, {customer?.name || "friend"}!</h2>
        <p>
          Your order has been placed successfully. A confirmation has been sent
          to <strong>{customer?.email}</strong>.
        </p>

        <div className="confirmation-summary">
          <h3>Order Summary</h3>
          <div className="confirmation-rows">
            {items.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <div className="confirmation-row" key={item.id}>
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <strong>{formatCurrency(product.price * item.quantity)}</strong>
                </div>
              );
            })}
            <div className="confirmation-row total">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>
        </div>

        <div className="confirmation-delivery">
          <p>
            <strong>Delivery address:</strong> {customer?.address}
          </p>
          <p>
            <strong>Payment:</strong> {customer?.payment}
          </p>
        </div>

        <div className="product-actions">
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-secondary">
            View My Orders
          </Link>
        </div>
      </div>
    </section>
  );
}
