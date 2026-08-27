import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import { Icon } from "./MobileIcons";

function MobileHeader({ cartCount, currentUser }) {
  const location = useLocation();
  const isShop = location.pathname === "/m/shop";

  return (
    <header className="m-header">
      {isShop ? (
        <div className="m-searchbar">
          <Icon name="search" size={20} />
        </div>
      ) : (
        <Link to="/m" className="m-brand" aria-label="JF & Family home">
          <span className="m-logo">
            <Logo size={40} />
          </span>
          <span className="m-brand-text">
            <strong>JF &amp; Family</strong>
            <small>Smart Living</small>
          </span>
        </Link>
      )}

      <Link to="/m/cart" className="m-cart-btn" aria-label="Open cart">
        <Icon name="cart" size={24} />
        {cartCount > 0 && (
          <span className="m-cart-badge">{cartCount}</span>
        )}
      </Link>
    </header>
  );
}

const tabs = [
  { to: "/m", label: "Home", icon: "home" },
  { to: "/m/shop", label: "Shop", icon: "shop" },
  { to: "/m/cart", label: "Cart", icon: "cart" },
  { to: "/m/profile", label: "Account", icon: "account" },
  { to: "/m/more", label: "More", icon: "more" },
];

function MobileNav({ cartCount }) {
  return (
    <nav className="m-tabbar">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === "/m"}
          className={({ isActive }) =>
            isActive ? "m-tab active" : "m-tab"
          }
        >
          <span className="m-tab-icon">
            <Icon name={tab.icon} size={22} />
            {tab.to === "/m/cart" && cartCount > 0 && (
              <span className="m-tab-badge">{cartCount}</span>
            )}
          </span>
          <span className="m-tab-label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default function MobileLayout({ cartCount, currentUser }) {
  return (
    <div className="m-shell">
      <MobileHeader cartCount={cartCount} currentUser={currentUser} />
      <main className="m-main">
        <Outlet />
      </main>
      <MobileNav cartCount={cartCount} />
    </div>
  );
}
