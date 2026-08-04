import { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactSales.css";

function ContactSales() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-sales-page">
      <header className="contact-sales-header">
        <Link className="contact-sales-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>Contact Sales</small>
          </div>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/stores">Product Demo</Link>
        </nav>
      </header>

      <main>
        <section className="contact-sales-hero">
          <div className="contact-sales-copy">
            <span>Ready Market Pilot</span>

            <h1>Bring modern online ordering to your grocery store.</h1>

            <p>
              Ready Market is designed to help independent grocery stores sell
              online, manage pickup and delivery, track inventory, and understand
              business performance from one platform.
            </p>

            <div className="contact-benefits">
              <article>
                <strong>Customer storefront</strong>
                <p>Give customers a simple way to browse and order groceries.</p>
              </article>

              <article>
                <strong>Merchant dashboard</strong>
                <p>Manage orders, products, inventory, customers, and reports.</p>
              </article>

              <article>
                <strong>Flexible fulfillment</strong>
                <p>Support pickup, local delivery, or both.</p>
              </article>
            </div>
          </div>

          <div className="contact-form-wrapper">
            {!submitted ? (
              <form className="sales-form" onSubmit={handleSubmit}>
                <span>Request Information</span>
                <h2>Schedule a Ready Market demo</h2>

                <label>
                  Full name
                  <input
                    name="name"
                    placeholder="Your full name"
                    required
                    type="text"
                  />
                </label>

                <label>
                  Business name
                  <input
                    name="business"
                    placeholder="Your grocery store or organization"
                    required
                    type="text"
                  />
                </label>

                <div className="sales-form-grid">
                  <label>
                    Email
                    <input
                      name="email"
                      placeholder="you@example.com"
                      required
                      type="email"
                    />
                  </label>

                  <label>
                    Phone
                    <input
                      name="phone"
                      placeholder="Phone number"
                      type="tel"
                    />
                  </label>
                </div>

                <label>
                  Business type
                  <select defaultValue="Independent grocery store" name="type">
                    <option>Independent grocery store</option>
                    <option>Specialty food market</option>
                    <option>Meat or produce market</option>
                    <option>Multi-location grocery business</option>
                    <option>Startup or funding organization</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  What are you interested in?
                  <select defaultValue="Ready Market pilot" name="interest">
                    <option>Ready Market pilot</option>
                    <option>Product demonstration</option>
                    <option>Pricing information</option>
                    <option>Partnership opportunity</option>
                    <option>Funding or accelerator discussion</option>
                  </select>
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    placeholder="Tell us about your store, organization, or interest in Ready Market."
                    rows="5"
                  />
                </label>

                <button type="submit">Submit Request</button>

                <small>
                  This is currently a prototype form. We will connect it to email
                  or a database during the production phase.
                </small>
              </form>
            ) : (
              <div className="sales-success">
                <span>✓</span>

                <h2>Thank you for your interest.</h2>

                <p>
                  Your request has been recorded in this demonstration. Ready
                  Technologies will connect this form to real email notifications
                  during the next development phase.
                </p>

                <Link to="/stores">Explore Ready Market</Link>
                <button onClick={() => setSubmitted(false)} type="button">
                  Submit Another Request
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="contact-sales-details">
          <div>
            <span>Who We Work With</span>
            <h2>Built for independent grocery businesses.</h2>
          </div>

          <div className="contact-audience-grid">
            <article>
              <strong>Independent Grocers</strong>
              <p>
                Stores that need an affordable digital storefront and order
                management system.
              </p>
            </article>

            <article>
              <strong>Specialty Markets</strong>
              <p>
                Ethnic, organic, produce, meat, bakery, and neighborhood food
                retailers.
              </p>
            </article>

            <article>
              <strong>Community Partners</strong>
              <p>
                Economic-development groups and organizations supporting local
                business growth.
              </p>
            </article>

            <article>
              <strong>Startup Programs</strong>
              <p>
                Accelerators, grant programs, and innovation partners interested
                in scalable Minnesota technology.
              </p>
            </article>
          </div>
        </section>

        <section className="contact-sales-cta">
          <div>
            <span>See the Product</span>
            <h2>Explore the complete Ready Market experience.</h2>
            <p>
              View the customer marketplace, merchant dashboard, pricing, and
              platform administration prototype.
            </p>
          </div>

          <div>
            <Link to="/stores">Customer Demo</Link>
            <Link to="/dashboard">Merchant Dashboard</Link>
          </div>
        </section>
      </main>

      <footer className="contact-sales-footer">
        <Link className="contact-sales-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>St. Cloud, Minnesota</small>
          </div>
        </Link>

        <p>Practical software for independent business growth.</p>

        <span>© 2026 Ready Technologies</span>
      </footer>
    </div>
  );
}

export default ContactSales;