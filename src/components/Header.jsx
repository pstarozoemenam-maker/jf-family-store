import { Link, NavLink, useLocation } from "react-router-dom";

function Header({ cartCount, currentUser, onLogout }) {
    const location = useLocation();
    const links = [
        ["/", "Home"],
        ["/shop", "Shop"],
        ["/about", "About"],
        ["/contact", "Contact"],
        ["/wishlist", "Wishlist"]
    ];

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
                    <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => isActive ? "active" : undefined}>
                        {label}
                    </NavLink>
                ))}
                {currentUser ? (
                    <button className="nav-button" onClick={onLogout}>Logout</button>
                ) : (
                    <NavLink to="/login" className={location.pathname === "/login" ? "active" : undefined}>Login</NavLink>
                )}
                <NavLink to="/cart" className={({ isActive }) => isActive ? "cart-button active" : "cart-button"}>
                    Cart <span id="cart-count">{cartCount}</span>
                </NavLink>
            </nav>
        </header>
    );
}

export default Header;
