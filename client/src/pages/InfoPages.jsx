import { useState } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/FormField";
import { InfoCardGrid } from "../components/ProductCatalog";

export function AboutPage() {
    const missionCards = [
        { icon: "🎯", title: "Our Mission", description: "To provide affordable, durable, and innovative home appliances for every family." },
        { icon: "👁️", title: "Our Vision", description: "To become Nigeria's most trusted online appliance store." },
        { icon: "❤️", title: "Our Values", description: "Quality, integrity, customer satisfaction, and continuous innovation." }
    ];

    return <>
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">About Us</p>
                <h2>Welcome to JF & Family</h2>
                <p>Your trusted destination for quality home appliances, kitchen equipment, and lifestyle essentials.</p>
            </div>
            <div className="detail-card">
                <div><h2>Who We Are</h2><p>JF & Family is dedicated to providing premium home appliances that make everyday living easier, smarter, and more comfortable. We believe every home deserves reliable products at affordable prices.</p><br /><p>From modern kitchen equipment to electrical appliances and lifestyle products, our goal is to give customers the best shopping experience possible.</p></div>
                <div className="product-media"><img src="/images/about.jpg" alt="JF & Family appliances" /></div>
            </div>
        </section>
        <section className="section"><div className="section-heading"><h2>Our Mission</h2></div><InfoCardGrid cards={missionCards} /></section>
    </>;
}

export function ContactPage({ onMessage }) {
    function handleSubmit(event) {
        event.preventDefault();
        event.currentTarget.reset();
        onMessage("Message sent successfully!");
    }

    const serviceCards = [
        { icon: "🚚", title: "Fast Delivery", description: "Quick nationwide delivery with secure packaging." },
        { icon: "🔒", title: "Secure Shopping", description: "Your personal information and payments are protected." },
        { icon: "⭐", title: "Quality Guarantee", description: "Only trusted brands and premium home appliances." }
    ];

    return <>
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">Contact Us</p>
                <h2>We're Here to Help</h2>
                <p>Have questions about our products or your order? We'd love to hear from you.</p>
            </div>
            <div className="checkout-grid">
                <div className="auth-card"><h2>Send Us a Message</h2><br /><form onSubmit={handleSubmit}><FormField label="Full Name"><input type="text" name="name" placeholder="Enter your full name" required /></FormField><FormField label="Email Address"><input type="email" name="email" placeholder="Enter your email" required /></FormField><FormField label="Subject"><input type="text" name="subject" placeholder="Subject" required /></FormField><FormField label="Message"><textarea name="message" rows="6" placeholder="Write your message..." required /></FormField><button type="submit" className="btn btn-primary">Send Message</button></form></div>
                <div className="checkout-summary"><h2>Contact Information</h2><br /><p>📍 Abuja, Nigeria</p><br /><p>📞 +234 800 123 4567</p><br /><p>✉ support@jfandfamily.com</p><br /><p>🕒 Monday - Saturday<br />9:00 AM - 6:00 PM</p><br /><Link to="/shop" className="btn btn-secondary">Continue Shopping</Link></div>
            </div>
        </section>
        <section className="section"><div className="section-heading"><h2>Why Shop With Us?</h2></div><InfoCardGrid cards={serviceCards} /></section>
    </>;
}

export function FaqPage() {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            q: "How long does delivery take?",
            a: "Orders are processed within 24 hours and delivered within 2–5 business days, depending on your location in Nigeria. Large appliances may take a little longer and are delivered by our logistics partners."
        },
        {
            q: "Do you offer returns or exchanges?",
            a: "Yes. You can return any product within 7 days of delivery provided it is unused and in its original packaging. If you received a damaged or faulty item, contact us and we will arrange a replacement at no cost."
        },
        {
            q: "How do I track my order?",
            a: "Once your order ships, a confirmation email with your order summary is sent to you. You can also visit the 'My Orders' page while logged in to see the status of all your purchases."
        },
        {
            q: "What payment methods do you accept?",
            a: "We currently accept pay on delivery as well as online payment options. More payment methods will be added soon for added convenience."
        },
        {
            q: "Is my personal information secure?",
            a: "Absolutely. We use secure connections to protect your data and never share your personal information with third parties. Your account details are stored safely and used only to fulfill orders."
        },
        {
            q: "How can I contact customer support?",
            a: "You can reach our support team at support@jfandfamily.com or call +234 800 123 4567, Monday to Saturday, 9:00 AM – 6:00 PM. We're always happy to help."
        }
    ];

    return <>
        <section className="section">
            <div className="section-heading">
                <p className="eyebrow">Help Center</p>
                <h2>Frequently Asked Questions</h2>
                <p>Find quick answers about ordering, delivery, returns, and more.</p>
            </div>

            <div className="faq-list">
                {faqs.map((faq, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`faq-item${isOpen ? " open" : ""}`}
                        >
                            <button
                                className="faq-question"
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                aria-expanded={isOpen}
                            >
                                <span>{faq.q}</span>
                                <span className="faq-toggle">{isOpen ? "−" : "+"}</span>
                            </button>
                            {isOpen && <div className="faq-answer"><p>{faq.a}</p></div>}
                        </div>
                    );
                })}
            </div>

            <div className="faq-footer">
                <p>Still have questions?</p>
                <Link to="/contact" className="btn btn-primary">Contact Us</Link>
            </div>
        </section>
    </>;
}

export function NotFoundPage({ title = "Page not found" }) {
    return <section className="section"><div className="empty-state"><h2>{title}</h2><p>Let’s get you back to the store.</p><Link to="/shop" className="btn btn-primary">Browse Products</Link></div></section>;
}
