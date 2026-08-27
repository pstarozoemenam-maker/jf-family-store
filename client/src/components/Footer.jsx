import { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const socialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1Z" fill="currentColor" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 4l7 9.5L4.3 20H7l5-4.5L16.5 20H20l-7.2-10L19.5 4H17l-4.5 4L8.5 4H4Z" fill="currentColor" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3Zm0 16.2a7.2 7.2 0 0 1-3.7-1L7.9 18l-1.9.5.5-1.9-.7-1.1a7.2 7.2 0 1 1 10.9 0l-1.1 1.4.3 2-1.9-.2-1.3.8a7.2 7.2 0 0 1-3.5.7Zm4-5.3c-.2-.1-1.3-.6-1.5-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-1.9-1.2 7 7 0 0 1-1.3-1.6c-.1-.2 0-.4.1-.5l.5-.5c.1-.2.2-.3.2-.5s0-.4-.1-.5c0-.2-.5-1.2-.7-1.6-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4 0-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.4 3.8 3.4.5.2 1 .3 1.3.4.5.2 1 .1 1.4-.1.4-.2 1.2-.5 1.4-1 .2-.5.2-.9.1-1-.1-.1-.3-.2-.5-.3Z" fill="currentColor" />
    </svg>
  ),
};

export default function Footer() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="brand footer-brand-title">
            <span className="brand-mark">
              <Logo />
            </span>
            <span>
              <strong>JF & Family</strong>
              <small>Appliances · Kitchen · Comfort</small>
            </span>
          </Link>
          <p>
            Premium home appliances, kitchen equipment, and lifestyle
            essentials delivered with care for every family.
          </p>
          <div className="footer-social">
            {Object.entries(socialIcons).map(([name, icon]) => (
              <a
                key={name}
                href="#"
                aria-label={name}
                onClick={(e) => e.preventDefault()}
                className="social-icon"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/faq">Help &amp; FAQ</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/wishlist">Wishlist</Link>
        </div>

        <div className="footer-col">
          <h4>Categories</h4>
          <Link to="/shop">Kitchen</Link>
          <Link to="/shop">Electrical</Link>
          <Link to="/shop">Lifestyle</Link>
        </div>

        <div className="footer-col">
          <h4>Get in Touch</h4>
          <p>📍 Abuja, Nigeria</p>
          <p>📞 +234 800 123 4567</p>
          <p>✉ support@jfandfamily.com</p>
        </div>

        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get exclusive deals and new arrivals straight to your inbox.</p>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
          {subscribed && (
            <span className="newsletter-note">
              Thanks for subscribing!
            </span>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 JF & Family. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
