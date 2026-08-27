import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "./MobileIcons";
import { MobileFooter } from "./MobileFooter";

export function MobileAbout() {
  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">About us</p>
          <h2>Welcome to JF &amp; Family</h2>
        </div>
      </div>

      <div className="m-media">
        <img src="/images/about.jpg" alt="JF & Family appliances" />
      </div>

      <div className="m-article">
        <h3>Who we are</h3>
        <p>
          JF &amp; Family is dedicated to providing premium home appliances that
          make everyday living easier, smarter and more comfortable. We believe
          every home deserves reliable products at affordable prices.
        </p>
        <p>
          From modern kitchen equipment to electrical appliances and lifestyle
          products, our goal is to give customers the best shopping experience
          possible.
        </p>
      </div>

      <div className="m-mission">
        <div className="m-mission-item">
          <span className="m-feature-icon">
            <Icon name="card" size={24} />
          </span>
          <h4>Our Mission</h4>
          <p>Affordable, durable and innovative appliances for every family.</p>
        </div>
        <div className="m-mission-item">
          <span className="m-feature-icon">
            <Icon name="eye" size={24} />
          </span>
          <h4>Our Vision</h4>
          <p>To become Nigeria's most trusted online appliance store.</p>
        </div>
        <div className="m-mission-item">
          <span className="m-feature-icon">
            <Icon name="heart" size={24} />
          </span>
          <h4>Our Values</h4>
          <p>Quality, integrity, satisfaction and continuous innovation.</p>
        </div>
      </div>

      <MobileFooter />
    </section>
  );
}

export function MobileContact() {
  const { showToast } = useStore();

  function handleSubmit(event) {
    event.preventDefault();
    event.currentTarget.reset();
    showToast("Message sent successfully!");
  }

  return (
    <section className="m-section">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Contact us</p>
          <h2>We're here to help</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="m-form">
        <div className="m-field">
          <label>Full Name</label>
          <input type="text" name="name" placeholder="Enter your full name" required />
        </div>
        <div className="m-field">
          <label>Email Address</label>
          <input type="email" name="email" placeholder="Enter your email" required />
        </div>
        <div className="m-field">
          <label>Subject</label>
          <input type="text" name="subject" placeholder="Subject" required />
        </div>
        <div className="m-field">
          <label>Message</label>
          <textarea name="message" rows="4" placeholder="Write your message..." required />
        </div>

        <button type="submit" className="m-btn m-btn-primary m-btn-block">
          Send Message
        </button>
      </form>

      <div className="m-contact-info">
        <div className="m-contact-item">
          <span className="m-list-icon">
            <Icon name="pin" size={20} />
          </span>
          <span>Abuja, Nigeria</span>
        </div>
        <div className="m-contact-item">
          <span className="m-list-icon">
            <Icon name="phone" size={20} />
          </span>
          <span>+234 800 123 4567</span>
        </div>
        <div className="m-contact-item">
          <span className="m-list-icon">
            <Icon name="mail" size={20} />
          </span>
          <span>support@jfandfamily.com</span>
        </div>
        <div className="m-contact-item">
          <span className="m-list-icon">
            <Icon name="clock" size={20} />
          </span>
          <span>Mon – Sat, 9:00 AM – 6:00 PM</span>
        </div>
      </div>

      <MobileFooter />
    </section>
  );
}

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders are processed within 24 hours and delivered within 2–5 business days, depending on your location in Nigeria. Large appliances may take a little longer.",
  },
  {
    q: "Do you offer returns or exchanges?",
    a: "Yes. You can return any product within 7 days of delivery provided it is unused and in its original packaging. Contact us about damaged or faulty items for a free replacement.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, a confirmation email is sent to you. You can also visit the 'My Orders' page while logged in to see the status of all your purchases.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We currently accept pay on delivery as well as online payment options. More payment methods will be added soon.",
  },
  {
    q: "Is my personal information secure?",
    a: "Absolutely. We use secure connections to protect your data and never share your personal information with third parties.",
  },
  {
    q: "How can I contact customer support?",
    a: "Reach us at support@jfandfamily.com or call +234 800 123 4567, Monday to Saturday, 9:00 AM – 6:00 PM.",
  },
];

export function MobileFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="m-section m-faq">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">Help center</p>
          <h2>Frequently asked questions</h2>
        </div>
      </div>

      <div className="m-faq-list">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div className={`m-faq-item ${isOpen ? "open" : ""}`} key={index}>
              <button
                className="m-faq-q"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <span className="m-faq-toggle">{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && <div className="m-faq-a">{faq.a}</div>}
            </div>
          );
        })}
      </div>

      <div className="m-faq-footer">
        <p>Still have questions?</p>
        <Link to="/m/contact" className="m-btn m-btn-primary m-btn-block">
          Contact us
        </Link>
      </div>
    </section>
  );
}

export function MobileNotFound() {
  return (
    <div className="m-empty">
      <h3>Page not found</h3>
      <p>Let's get you back to the store.</p>
      <Link to="/m/shop" className="m-btn m-btn-primary">
        Browse products
      </Link>
    </div>
  );
}
