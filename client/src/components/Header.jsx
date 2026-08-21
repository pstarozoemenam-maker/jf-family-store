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
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="topbar">
      {/* LOGO */}
      <Link to="/" className="brand">
        <div className="brand-mark">JF</div>

        <div>
          <strong>JF & Family</strong>
          <small>Appliances · Kitchen · Comfort</small>
        </div>
      </Link>

      {/* DESKTOP NAVIGATION */}
      <nav className="top-nav desktop-nav">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              isActive ? "active" : undefined
            }
          >
            {label}
          </NavLink>
        ))}

        <div className="nav-actions">
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              isActive
                ? "cart-button active"
                : "cart-button"
            }
          >
            Cart <span id="cart-count">{cartCount}</span>
          </NavLink>

          <div className="user-menu" ref={menuRef}>
            {currentUser ? (
              <>
                <button
                  type="button"
                  className="user-button"
                  onClick={() =>
                    setMenuOpen((open) => !open)
                  }
                  aria-expanded={menuOpen}
                  aria-haspopup="true"
                >
                  <span className="user-avatar">👤</span>
                  <span className="user-label">
                    Hi, {currentUser.name}
                  </span>
                </button>

                {menuOpen && (
                  <div className="user-dropdown">
                    <div className="user-greeting">
                      Hi, {currentUser.name}
                    </div>

                    <NavLink
                      to="/profile"
                      className="menu-item"
                    >
                      Profile
                    </NavLink>

                    <NavLink
                      to="/orders"
                      className="menu-item"
                    >
                      Orders
                    </NavLink>

                    <NavLink
                      to="/delivered"
                      className="menu-item"
                    >
                      Delivered
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      className="menu-item"
                    >
                      Change Password
                    </NavLink>

                    <button
                      type="button"
                      className="menu-item logout-button"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="user-button"
              >
                <span className="user-label">Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE HAMBURGER */}
      <button
        type="button"
        className={`hamburger ${
          menuOpen ? "open" : ""
        }`}
        onClick={() =>
          setMenuOpen((open) => !open)
        }
        aria-label={
          menuOpen
            ? "Close navigation menu"
            : "Open navigation menu"
        }
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "open" : ""
        }`}
      >
        <nav className="mobile-nav">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive ? "active" : undefined
              }
            >
              {label}
            </NavLink>
          ))}

          <NavLink
            to="/cart"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "active" : undefined
            }
          >
            Cart
            <span className="mobile-cart-count">
              {cartCount}
            </span>
          </NavLink>

          {currentUser ? (
            <>
              <div className="mobile-user-info">
                Hi, {currentUser.name}
              </div>

              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </NavLink>

              <NavLink
                to="/orders"
                onClick={() => setMenuOpen(false)}
              >
                Orders
              </NavLink>

              <NavLink
                to="/delivered"
                onClick={() => setMenuOpen(false)}
              >
                Delivered
              </NavLink>

              <NavLink
                to="/change-password"
                onClick={() => setMenuOpen(false)}
              >
                Change Password
              </NavLink>

              <button
                type="button"
                className="mobile-logout"
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="mobile-login"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;