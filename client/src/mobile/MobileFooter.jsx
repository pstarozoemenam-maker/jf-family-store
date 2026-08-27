import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Icon } from "./MobileIcons";

const socials = ["facebook", "instagram", "twitter", "whatsapp"];

export function MobileFooter() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="m-footer">
      <div className="m-footer-brand">
        <span className="m-footer-logo">
          <Logo size={40} />
        </span>
        <div>
          <strong>JF &amp; Family</strong>
          <small>Appliances · Kitchen · Comfort</small>
        </div>
      </div>

      <p className="m-footer-text">
        Premium home appliances, kitchen equipment and lifestyle essentials
        delivered with care for every family.
      </p>

      <div className="m-footer-social">
        {socials.map((name) => (
          <a
            key={name}
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label={name}
            className="m-social"
          >
            <Icon name={name} size={20} />
          </a>
        ))}
      </div>

      <div className="m-footer-links">
        <Link to="/m/shop">Shop</Link>
        <Link to="/m/about">About</Link>
        <Link to="/m/faq">FAQ</Link>
        <Link to="/m/contact">Contact</Link>
        <Link to="/m/wishlist">Wishlist</Link>
      </div>

      <div className="m-contact-item m-footer-contact">
        <span className="m-list-icon">
          <Icon name="pin" size={16} />
        </span>
        <span>Abuja, Nigeria</span>
      </div>
      <div className="m-contact-item m-footer-contact">
        <span className="m-list-icon">
          <Icon name="phone" size={16} />
        </span>
        <span>+234 800 123 4567</span>
      </div>

      <form className="m-newsletter" onSubmit={handleSubscribe}>
        <input type="email" placeholder="Enter your email" required />
        <button type="submit">Subscribe</button>
      </form>
      {subscribed && <span className="m-newsletter-note">Thanks for subscribing!</span>}

      <p className="m-footer-bottom">© 2025 JF &amp; Family. All rights reserved.</p>
    </footer>
  );
}
