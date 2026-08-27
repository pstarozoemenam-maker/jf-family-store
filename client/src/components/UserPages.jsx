import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";

function parseOrderItems(order) {
  try {
    const parsed = JSON.parse(order?.items ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function UserSection({ title, children }) {
  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">{title}</p>
      </div>
      <div className="detail-card">{children}</div>
    </section>
  );
}

export function ProfilePage() {
  const { currentUser } = useStore();

  if (!currentUser) {
    return (
      <div className="empty-state">
        <h2>Please log in to see your profile</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <UserSection title="Your Profile">
      <div className="profile-details">
        <p>
          <strong>Name:</strong> {currentUser.name}
        </p>
        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
      </div>
    </UserSection>
  );
}

export function OrdersPage() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(
            data.filter(
              (order) =>
                order.email?.toLowerCase() === currentUser.email.toLowerCase(),
            ),
          );
        }
      })
      .catch(() => {
        setOrders([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <h2>Please log in to view your orders</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <UserSection title="Your Orders">
      {isLoading ? (
        <p>Loading orders...</p>
      ) : orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p>
                <strong>Order #{order.id}</strong>
              </p>
              <p>Email: {order.email}</p>
              <p>Total: ₦{order.total}</p>
              <p>Items: {parseOrderItems(order).length}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found yet.</p>
      )}
    </UserSection>
  );
}

export function DeliveredPage() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(
            data.filter(
              (order) =>
                order.email?.toLowerCase() === currentUser.email.toLowerCase(),
            ),
          );
        }
      })
      .catch(() => {
        setOrders([]);
      });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <h2>Please log in to view delivered orders</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <UserSection title="Delivered Orders">
      {orders.length ? (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <p>
                <strong>Order #{order.id}</strong>
              </p>
              <p>Status: Delivered</p>
              <p>Total: ₦{order.total}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>You do not have any delivered orders yet.</p>
      )}
    </UserSection>
  );
}

export function ChangePasswordPage() {
  const { currentUser, showToast } = useStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <h2>Please log in to change your password</h2>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  const handleSubmit = async (event) => {
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
  };

  return (
    <UserSection title="Change Password">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            required
            placeholder="Enter current password"
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            placeholder="Enter new password"
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            placeholder="Confirm new password"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </UserSection>
  );
}
