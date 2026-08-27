import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "./MobileIcons";

function parseOrderItems(order) {
  try {
    const parsed = JSON.parse(order?.items ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function MobileProfile() {
  const { currentUser, logout } = useStore();

  if (!currentUser) {
    return (
      <div className="m-empty">
        <span className="m-empty-icon">
          <Icon name="user" size={40} />
        </span>
        <h3>Please log in</h3>
        <p>Log in to see your profile, orders and more.</p>
        <Link to="/m/login" className="m-btn m-btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <section className="m-section">
      <div className="m-profile-head">
        <span className="m-avatar">
          <Icon name="user" size={34} />
        </span>
        <div>
          <h2>{currentUser.name}</h2>
          <p>{currentUser.email}</p>
        </div>
      </div>

      <div className="m-list">
        <Link to="/m/orders" className="m-list-item">
          <span className="m-list-icon">
            <Icon name="truck" size={20} />
          </span>
          <span className="m-list-label">My Orders</span>
          <Icon name="chevron" size={18} />
        </Link>
        <Link to="/m/delivered" className="m-list-item">
          <span className="m-list-icon">
            <Icon name="check" size={20} />
          </span>
          <span className="m-list-label">Delivered</span>
          <Icon name="chevron" size={18} />
        </Link>
        <Link to="/m/change-password" className="m-list-item">
          <span className="m-list-icon">
            <Icon name="shield" size={20} />
          </span>
          <span className="m-list-label">Change Password</span>
          <Icon name="chevron" size={18} />
        </Link>
        <button
          type="button"
          className="m-list-item m-list-danger"
          onClick={logout}
        >
          <span className="m-list-icon">
            <Icon name="close" size={20} />
          </span>
          <span className="m-list-label">Logout</span>
          <Icon name="chevron" size={18} />
        </button>
      </div>
    </section>
  );
}

export function MobileMore() {
  const { currentUser } = useStore();

  const accountItems = currentUser
    ? []
    : [
        { to: "/m/login", label: "Login", icon: "user" },
        { to: "/m/signup", label: "Create Account", icon: "user" },
      ];

  const storeItems = [
    { to: "/m/wishlist", label: "Wishlist", icon: "heart" },
  ];

  const infoItems = [
    { to: "/m/about", label: "About Us", icon: "fork" },
    { to: "/m/contact", label: "Contact", icon: "phone" },
    { to: "/m/faq", label: "Help & FAQ", icon: "clock" },
  ];

  return (
    <section className="m-section m-more">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Menu</p>
          <h2>More</h2>
        </div>
      </div>

      {accountItems.length > 0 && (
        <>
          <p className="m-list-title">Account</p>
          <div className="m-list">
            {accountItems.map((item) => (
              <Link key={item.to} to={item.to} className="m-list-item">
                <span className="m-list-icon">
                  <Icon name={item.icon} size={20} />
                </span>
                <span className="m-list-label">{item.label}</span>
                <Icon name="chevron" size={18} />
              </Link>
            ))}
          </div>
        </>
      )}

      <p className="m-list-title">Store</p>
      <div className="m-list">
        {storeItems.map((item) => (
          <Link key={item.to} to={item.to} className="m-list-item">
            <span className="m-list-icon">
              <Icon name={item.icon} size={20} />
            </span>
            <span className="m-list-label">{item.label}</span>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </div>

      <p className="m-list-title">Information</p>
      <div className="m-list">
        {infoItems.map((item) => (
          <Link key={item.to} to={item.to} className="m-list-item">
            <span className="m-list-icon">
              <Icon name={item.icon} size={20} />
            </span>
            <span className="m-list-label">{item.label}</span>
            <Icon name="chevron" size={18} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function MobileOrdersShell({ title, subtitle, children, emptyText }) {
  const { currentUser } = useStore();

  if (!currentUser) {
    return (
      <div className="m-empty">
        <h3>Please log in</h3>
        <p>Log in to view your orders.</p>
        <Link to="/m/login" className="m-btn m-btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">{subtitle}</p>
          <h2>{title}</h2>
        </div>
      </div>
      {children.length ? (
        <div className="m-order-list">{children}</div>
      ) : (
        <div className="m-empty">
          <h3>{emptyText}</h3>
        </div>
      )}
    </section>
  );
}

export function MobileOrders() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(
            data.filter(
              (o) => o.email?.toLowerCase() === currentUser.email.toLowerCase(),
            ),
          );
        }
      })
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">History</p>
          <h2>Your Orders</h2>
        </div>
      </div>

      {!currentUser ? (
        <div className="m-empty">
          <h3>Please log in</h3>
          <p>Log in to view your orders.</p>
          <Link to="/m/login" className="m-btn m-btn-primary">
            Login
          </Link>
        </div>
      ) : isLoading ? (
        <div className="m-loader">Loading orders...</div>
      ) : orders.length ? (
        <div className="m-order-list">
          {orders.map((order) => (
            <div className="m-order-card" key={order.id}>
              <div className="m-order-top">
                <strong>Order #{order.id}</strong>
                <span className="m-order-status">Placed</span>
              </div>
              <p>Items: {parseOrderItems(order).length}</p>
              <p>Email: {order.email}</p>
              <div className="m-order-total">₦{Number(order.total).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="m-empty">
          <h3>No orders yet</h3>
          <Link to="/m/shop" className="m-btn m-btn-primary">
            Start shopping
          </Link>
        </div>
      )}
    </section>
  );
}

export function MobileDelivered() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(
            data.filter(
              (o) => o.email?.toLowerCase() === currentUser.email.toLowerCase(),
            ),
          );
        }
      })
      .catch(() => setOrders([]));
  }, [currentUser]);

  const list = orders.map((o) => (
    <div className="m-order-card" key={o.id}>
      <div className="m-order-top">
        <strong>Order #{o.id}</strong>
        <span className="m-order-status m-order-delivered">Delivered</span>
      </div>
      <p>Total: ₦{Number(o.total).toLocaleString()}</p>
    </div>
  ));

  return (
    <MobileOrdersShell
      title="Delivered Orders"
      subtitle="Completed"
      emptyText="You do not have any delivered orders yet."
    >
      {list}
    </MobileOrdersShell>
  );
}

export function MobileChangePassword() {
  const { currentUser, showToast } = useStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="m-empty">
        <h3>Please log in</h3>
        <Link to="/m/login" className="m-btn m-btn-primary">
          Login
        </Link>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          currentPassword,
          newPassword,
        }),
      });
      const data = await response.json();
      if (data.success) {
        showToast("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        showToast(data.message || "Unable to update password");
      }
    } catch (error) {
      console.error(error);
      showToast("Unable to update password");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Security</p>
          <h2>Change Password</h2>
        </div>
      </div>

      <form className="m-form" onSubmit={handleSubmit}>
        <div className="m-field">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
        </div>
        <div className="m-field">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </div>
        <div className="m-field">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button
          type="submit"
          className="m-btn m-btn-primary m-btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </section>
  );
}
