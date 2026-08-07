import { Link } from "react-router-dom";
import { ProductIcon } from "./ProductCatalog";
import { formatCurrency } from "../utils";

function EmptyCart() {
    return <div className="empty-state"><h2>Your cart is empty</h2><p>Add products from the shop.</p><Link to="/shop" className="btn btn-primary">Continue Shopping</Link></div>;
}

export function CartPage({ cart, products, total, onUpdateQuantity, onRemove }) {
    const items = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);

    return (
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">Shopping Cart</p>
                <h2>Your Cart</h2>
                <p>Review your selected products before checkout.</p>
            </div>
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
