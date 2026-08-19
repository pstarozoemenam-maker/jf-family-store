import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency } from "../utils";

export function AdminPage() {
  const { currentUser } = useStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!currentUser || currentUser.email !== "admin@jfandfamily.com") {
      return;
    }

    setIsLoading(true);
    fetch("/api/orders")
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((error) => {
        console.error(error);
        setOrders([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="empty-state">
        <h2>Admin Access Required</h2>
        <p>Please log in to access the admin panel.</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  if (currentUser.email !== "admin@jfandfamily.com") {
    return (
      <div className="empty-state">
        <h2>Access Denied</h2>
        <p>You do not have permission to access the admin panel.</p>
        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  // Calculate statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const getPaymentMethods = () => {
    const methods = {};
    orders.forEach((order) => {
      methods[order.payment] = (methods[order.payment] || 0) + 1;
    });
    return methods;
  };

  return (
    <section className="section">
      <div className="section-heading">
        <p className="eyebrow">Administration Panel</p>
        <h2>Welcome, Admin</h2>
        <p>Manage orders, customers, and store performance.</p>
      </div>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          📊 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          📦 Orders
        </button>
        <button
          className={`tab-btn ${activeTab === "analytics" ? "active" : ""}`}
          onClick={() => setActiveTab("analytics")}
        >
          📈 Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="admin-overview">
          <h3>Store Overview</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <p className="stat-label">Total Orders</p>
                <p className="stat-value">{totalOrders}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <p className="stat-label">Total Revenue</p>
                <p className="stat-value">{formatCurrency(totalRevenue)}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <p className="stat-label">Average Order Value</p>
                <p className="stat-value">
                  {formatCurrency(averageOrderValue)}
                </p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <p className="stat-label">Unique Customers</p>
                <p className="stat-value">
                  {new Set(orders.map((o) => o.email)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="admin-section">
            <h3>Quick Stats</h3>
            <div className="detail-card">
              <p>
                <strong>Latest Order:</strong>{" "}
                {orders.length > 0 ? orders[0].id : "None"}
              </p>
              <p>
                <strong>Today's Revenue:</strong> {formatCurrency(0)} (Live
                tracking coming soon)
              </p>
              <p>
                <strong>Pending Orders:</strong> {orders.length} (All orders
                shown)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === "orders" && (
        <div className="admin-orders">
          <h3>Recent Orders</h3>
          {isLoading ? (
            <p>Loading orders...</p>
          ) : orders.length > 0 ? (
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    let itemCount = 0;
                    try {
                      const items = JSON.parse(order.items);
                      itemCount = Array.isArray(items) ? items.length : 0;
                    } catch {
                      itemCount = 0;
                    }
                    return (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.email}</td>
                        <td>{order.phone}</td>
                        <td>{order.address}</td>
                        <td>
                          <span className="payment-badge">{order.payment}</span>
                        </td>
                        <td className="amount">
                          {formatCurrency(order.total)}
                        </td>
                        <td>{itemCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <p>No orders found.</p>
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="admin-analytics">
          <h3>Business Analytics</h3>
          <div className="analytics-grid">
            <div className="analytics-card">
              <h4>Payment Methods Distribution</h4>
              <div className="payment-stats">
                {Object.entries(getPaymentMethods()).map(([method, count]) => (
                  <div key={method} className="payment-stat">
                    <span className="method-label">{method}</span>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(count / totalOrders) * 100}%` }}
                      />
                    </div>
                    <span className="method-count">
                      {count} ({((count / totalOrders) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="analytics-card">
              <h4>Order Statistics</h4>
              <div className="stat-list">
                <div className="stat-item">
                  <span>Total Orders</span>
                  <strong>{totalOrders}</strong>
                </div>
                <div className="stat-item">
                  <span>Avg Order Value</span>
                  <strong>{formatCurrency(averageOrderValue)}</strong>
                </div>
                <div className="stat-item">
                  <span>Total Revenue</span>
                  <strong>{formatCurrency(totalRevenue)}</strong>
                </div>
                <div className="stat-item">
                  <span>Unique Customers</span>
                  <strong>{new Set(orders.map((o) => o.email)).size}</strong>
                </div>
              </div>
            </div>

            <div className="analytics-card">
              <h4>Top Customers (by Spending)</h4>
              <div className="customer-list">
                {orders
                  .reduce((acc, order) => {
                    const existing = acc.find((c) => c.email === order.email);
                    if (existing) {
                      existing.total += Number(order.total || 0);
                      existing.orders += 1;
                    } else {
                      acc.push({
                        email: order.email,
                        name: order.customer_name,
                        total: Number(order.total || 0),
                        orders: 1,
                      });
                    }
                    return acc;
                  }, [])
                  .sort((a, b) => b.total - a.total)
                  .slice(0, 5)
                  .map((customer) => (
                    <div key={customer.email} className="customer-item">
                      <div>
                        <p className="customer-name">{customer.name}</p>
                        <p className="customer-email">{customer.email}</p>
                      </div>
                      <div className="customer-stats">
                        <span>{customer.orders} orders</span>
                        <span className="customer-total">
                          {formatCurrency(customer.total)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e2e8f0;
        }

        .tab-btn {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-weight: 600;
          cursor: pointer;
          transition: 0.3s;
        }

        .tab-btn.active {
          color: var(--primary);
          border-bottom-color: var(--primary);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: var(--shadow);
          display: flex;
          gap: 16px;
        }

        .stat-icon {
          font-size: 32px;
          min-width: 50px;
          text-align: center;
        }

        .stat-label {
          color: var(--muted);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary);
        }

        .admin-section {
          margin-bottom: 30px;
        }

        .admin-section h3 {
          margin-bottom: 15px;
        }

        .orders-table-wrapper {
          overflow-x: auto;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow);
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table th {
          background: #f8fafc;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          border-bottom: 2px solid #e2e8f0;
        }

        .orders-table td {
          padding: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .orders-table tr:hover {
          background: #f8fafc;
        }

        .payment-badge {
          background: #dbeafe;
          color: #1e40af;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .amount {
          font-weight: 600;
          color: var(--primary);
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .analytics-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: var(--shadow);
        }

        .analytics-card h4 {
          margin-bottom: 20px;
          color: var(--text);
        }

        .payment-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .payment-stat {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .method-label {
          font-weight: 600;
          font-size: 14px;
        }

        .progress-bar {
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          transition: width 0.3s;
        }

        .method-count {
          font-size: 12px;
          color: var(--muted);
        }

        .stat-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .stat-item strong {
          color: var(--primary);
          font-size: 18px;
        }

        .customer-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .customer-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f8fafc;
          border-radius: 8px;
        }

        .customer-name {
          font-weight: 600;
          margin-bottom: 4px;
        }

        .customer-email {
          font-size: 12px;
          color: var(--muted);
        }

        .customer-stats {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .customer-total {
          font-weight: 700;
          color: var(--primary);
        }
      `}</style>
    </section>
  );
}
