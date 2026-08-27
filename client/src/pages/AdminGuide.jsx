import { Link } from "react-router-dom";

export default function AdminGuide() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>🔐 Admin Access Guide</h1>

      <div
        style={{
          backgroundColor: "#eff6ff",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          borderLeft: "4px solid #2563eb",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#1e40af" }}>Quick Start</h2>
        <p>
          This guide explains how to access and use the JF & Family admin panel.
        </p>
      </div>

      <section style={{ marginBottom: "30px" }}>
        <h2>Step 1: Login as Admin</h2>
        <div
          style={{
            backgroundColor: "#f1f5f9",
            padding: "15px",
            borderRadius: "6px",
            marginBottom: "15px",
          }}
        >
          <p>
            <strong>Email:</strong>
          </p>
          <code
            style={{
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "block",
              marginBottom: "10px",
              fontFamily: "monospace",
            }}
          >
            pstarozoemenam@gmail.com
          </code>
          <p>
            <strong>Password:</strong>
          </p>
          <code
            style={{
              backgroundColor: "white",
              padding: "8px 12px",
              borderRadius: "4px",
              display: "block",
              fontFamily: "monospace",
            }}
          >
            123456789
          </code>
        </div>
        <ol>
          <li>
            Go to{" "}
            <Link
              to="/login"
              style={{ color: "#2563eb", textDecoration: "none" }}
            >
              Login Page
            </Link>
          </li>
          <li>Enter the admin email and password above</li>
          <li>Click "Login"</li>
        </ol>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Step 2: Access Admin Panel</h2>
        <ol>
          <li>
            After logging in, you'll see your user icon in the top-right corner
          </li>
          <li>Click on it to open the user dropdown menu</li>
          <li>
            Select <strong>🔐 Admin Panel</strong>
          </li>
          <li>The admin dashboard will load</li>
        </ol>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Admin Panel Features</h2>
        <div style={{ display: "grid", gap: "20px" }}>
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "15px",
              borderRadius: "6px",
              borderLeft: "4px solid #22c55e",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#16a34a" }}>📊 Overview Tab</h3>
            <p>View key statistics:</p>
            <ul>
              <li>Total Orders count</li>
              <li>Total Revenue (sum of all orders)</li>
              <li>Average Order Value</li>
              <li>Unique Customers count</li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: "#fef2f2",
              padding: "15px",
              borderRadius: "6px",
              borderLeft: "4px solid #ef4444",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#dc2626" }}>📋 Orders Tab</h3>
            <p>View all customer orders with details:</p>
            <ul>
              <li>Order ID</li>
              <li>Customer name and email</li>
              <li>Phone and delivery address</li>
              <li>Payment method</li>
              <li>Order total and item count</li>
            </ul>
          </div>

          <div
            style={{
              backgroundColor: "#fef3c7",
              padding: "15px",
              borderRadius: "6px",
              borderLeft: "4px solid #f59e0b",
            }}
          >
            <h3 style={{ marginTop: 0, color: "#b45309" }}>📈 Analytics Tab</h3>
            <p>Analyze business metrics:</p>
            <ul>
              <li>Payment method distribution</li>
              <li>Order statistics by status</li>
              <li>Top 5 customers by spending</li>
              <li>Revenue trends</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h2>Important Notes</h2>
        <div
          style={{
            backgroundColor: "#fef2f2",
            padding: "15px",
            borderRadius: "6px",
            borderLeft: "4px solid #ef4444",
          }}
        >
          <ul style={{ margin: 0 }}>
            <li>
              ⚠️ Keep the admin credentials secure - do not share with
              unauthorized users
            </li>
            <li>
              ✅               Only the admin account (pstarozoemenam@gmail.com) can access the
              admin panel
            </li>
            <li>📊 All data in the admin panel is read-only for security</li>
            <li>🔄 Orders and customer data update in real-time</li>
          </ul>
        </div>
      </section>

      <section>
        <h2>Need Help?</h2>
        <p>
          For support or to report issues with the admin panel, please{" "}
          <Link
            to="/contact"
            style={{ color: "#2563eb", textDecoration: "none" }}
          >
            contact us
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
