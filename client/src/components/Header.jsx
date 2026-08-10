import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function Header({ cartCount, currentUser, onLogout }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const links = [
    ["/", "Home"],
    ["/shop", "Shop"],
    ["/about", "About"],
    ["/contact", "Contact"],
    ["/wishlist", "Wishlist"],
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <div className="brand-mark">JF</div>
        <div>
          <strong>JF & Family</strong>
          <small>Appliances · Kitchen · Comfort</small>
        </div>
      </Link>
      <nav className="top-nav">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => (isActive ? "active" : undefined)}
          >
            {label}
          </NavLink>
        ))}
        <div className="user-menu" ref={menuRef}>
          <button
            type="button"
            className="user-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="user-avatar">👤</span>
            <span className="user-label">
              {currentUser ? `Hi, ${currentUser.name}` : "Account"}
            </span>
          </button>

          {menuOpen && (
            <div className="user-dropdown">
              {currentUser ? (
                <>
                  <div className="user-greeting">Hi, {currentUser.name}</div>
                  <NavLink to="/profile" className="menu-item">
                    Profile
                  </NavLink>
                  <NavLink to="/orders" className="menu-item">
                    Orders
                  </NavLink>
                  <NavLink to="/delivered" className="menu-item">
                    Delivered
                  </NavLink>
                  <NavLink to="/change-password" className="menu-item">
                    Change Password
                  </NavLink>
                  <button
                    type="button"
                    className="menu-item logout-button"
                    onClick={onLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" className="menu-item">
                    Login
                  </NavLink>
                  <NavLink to="/signup" className="menu-item">
                    Signup
                  </NavLink>
                </>
              )}
            </div>
          )}
        </div>
        <NavLink
          to="/cart"
          className={({ isActive }) =>
            isActive ? "cart-button active" : "cart-button"
          }
        >
          Cart <span id="cart-count">{cartCount}</span>
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
