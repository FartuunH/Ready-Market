import { Link, Route, Routes } from "react-router-dom";
import CustomerApp from "./pages/CustomerApp";
import OwnerDashboard from "./pages/OwnerDashboard";
import StoreSelection from "./pages/StoreSelection";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import ContactSales from "./pages/ContactSales";
import DriverSignup from "./pages/DriverSignup";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import OrderTracking from "./pages/OrderTracking";
import PlatformOverview from "./pages/PlatformOverview";
import MerchantOrders from "./pages/MerchantOrders";
import MerchantProducts from "./pages/MerchantProducts";
import MerchantCustomers from "./pages/MerchantCustomers";
import MerchantAnalytics from "./pages/MerchantAnalytics";
import InventoryManagement from "./pages/InventoryManagement";
import MerchantMarketing from "./pages/MerchantMarketing";
import MerchantReports from "./pages/MerchantReports";
import MerchantSettings from "./pages/MerchantSettings";
import DriverManagement from "./pages/DriverManagement";
import Community from "./pages/Community";
import "./App.css";


const products = [
  {
    name: "Ready Market",
    label: "Launching First",
    description:
      "A modern commerce platform that helps independent grocery stores sell online, manage orders, and grow with data.",
    features: ["Online ordering", "Pickup and delivery", "Store analytics"],
  },
  {
    name: "Ready Fit AI",
    label: "Future Product",
    description:
      "An AI-powered wellness coach designed to support healthy routines, nutrition planning, and progress tracking.",
    features: ["AI coaching", "Meal planning", "Progress insights"],
  },
  {
    name: "Ready Code AI",
    label: "Future Product",
    description:
      "A development platform that turns natural-language product ideas into working software and usable code.",
    features: ["App generation", "Code assistance", "Project automation"],
  },
];

const marketFeatures = [
  {
    number: "01",
    title: "Digital Storefront",
    description:
      "Give customers a clean, mobile-friendly way to browse products and shop from their neighborhood grocery store.",
  },
  {
    number: "02",
    title: "Pickup and Delivery",
    description:
      "Let shoppers select convenient pickup times or request local delivery during checkout.",
  },
  {
    number: "03",
    title: "Merchant Dashboard",
    description:
      "Help store owners manage products, orders, inventory, customers, and daily operations from one place.",
  },
  {
    number: "04",
    title: "Business Intelligence",
    description:
      "Turn sales and inventory data into practical insights that help independent stores make better decisions.",
  },
];

function HomePage() {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="site-shell">
      <header className="navbar">
        <a
          className="brand"
          href="#top"
          aria-label="Ready Technologies home"
        >
          <span className="brand-mark">R</span>

          <span>
            <strong>Ready</strong>
            <small>Technologies</small>
          </span>
        </a>

        <nav
          className="nav-links"
          aria-label="Main navigation"
        >
          <a href="#products">Products</a>
          <a href="#ready-market">Ready Market</a>
          <Link to="/platform">Platform</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
        </nav>

        <Link
          className="button button-small"
          to="/contact-sales"
        >
          Request a Demo
        </Link>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy">
            <span className="eyebrow">
              Minnesota Technology Startup
            </span>

            <h1>
              Practical software for
              <span> local business growth.</span>
            </h1>

            <p>
  Ready Technologies builds practical digital products that help
  independent businesses grow while making everyday services more
  accessible for customers and local communities.
</p>

            <div className="hero-actions">
              <Link className="button" to="/stores">
                Explore Ready Market
              </Link>

              <Link
                className="button button-secondary"
                to="/platform"
              >
                Platform Overview
              </Link>

              <button
                className="button button-outline"
                onClick={() => scrollToSection("contact")}
                type="button"
              >
                Join the Pilot
              </button>
            </div>

            <div className="hero-proof">
              <div>
                <strong>3</strong>
                <span>Product concepts</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Focused MVP</span>
              </div>

              <div>
                <strong>MN</strong>
                <span>Built in Minnesota</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Ready Market dashboard preview">
            <div className="preview-glow" />

            <div className="dashboard-preview">
              <div className="preview-sidebar">
                <span className="mini-logo">R</span>
                <span className="side-item active" />
                <span className="side-item" />
                <span className="side-item" />
                <span className="side-item" />
              </div>

              <div className="preview-main">
                <div className="preview-topbar">
                  <div>
                    <span className="preview-label">Ready Market</span>
                    <strong>Store Overview</strong>
                  </div>

                  <span className="preview-avatar">FM</span>
                </div>

                <div className="metric-grid">
                  <article>
                    <span>Revenue</span>
                    <strong>$18,420</strong>
                    <small>+12.4% this month</small>
                  </article>

                  <article>
                    <span>Orders</span>
                    <strong>438</strong>
                    <small>Pickup and delivery</small>
                  </article>

                  <article>
                    <span>Customers</span>
                    <strong>286</strong>
                    <small>42 new shoppers</small>
                  </article>
                </div>

                <div className="preview-content-grid">
                  <div className="chart-card">
                    <div className="card-heading">
                      <strong>Weekly sales</strong>
                      <span>Last 7 days</span>
                    </div>

                    <div className="chart-bars">
                      {[42, 62, 48, 76, 58, 88, 70].map((height, index) => (
                        <span
                          key={index}
                          style={{ height: `${height}%` }}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="orders-card">
                    <div className="card-heading">
                      <strong>Recent orders</strong>
                    </div>

                    <div className="order-row">
                      <span>#1048</span>
                      <strong>Pickup</strong>
                      <small>Ready</small>
                    </div>

                    <div className="order-row">
                      <span>#1047</span>
                      <strong>Delivery</strong>
                      <small>Processing</small>
                    </div>

                    <div className="order-row">
                      <span>#1046</span>
                      <strong>Pickup</strong>
                      <small>Completed</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="floating-card floating-card-one">
              <span>Low-stock alert</span>
              <strong>Fresh produce</strong>
            </div>

            <div className="floating-card floating-card-two">
              <span>Today</span>
              <strong>67 orders</strong>
            </div>
          </div>
        </section>

        <section className="trust-strip">
          <span>Built for independent retailers</span>
          <span>Simple merchant tools</span>
          <span>Modern customer experience</span>
          <span>Designed to scale</span>
        </section>

        <section className="section" id="products">
          <div className="section-heading">
            <span className="eyebrow">Our Product Roadmap</span>
            <h2>One company. Three practical technology products.</h2>
            <p>
              Ready Market is our first priority. Future products will expand
              Ready Technologies into wellness and software development.
            </p>
          </div>

          <div className="product-grid">
            {products.map((product, index) => (
              <article
                className={`product-card ${
                  index === 0 ? "product-card-featured" : ""
                }`}
                key={product.name}
              >
                <div className="product-card-top">
                  <span className="product-number">0{index + 1}</span>
                  <span className="product-label">{product.label}</span>
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>

                <ul>
                  {product.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                {index === 0 && (
  <div className="product-demo-links">
    <Link className="text-button" to="/stores">
  View customer experience →
</Link>

    <Link className="text-button dashboard-link" to="/dashboard">
      View owner dashboard →
    </Link>
  </div>
)}
              </article>
            ))}
          </div>
        </section>

        <section className="market-section" id="ready-market">
          <div className="section market-intro">
            <div>
              <span className="eyebrow eyebrow-light">Flagship Product</span>
              <h2>
                Ready Market gives local grocery stores a better way to sell
                online.
              </h2>
            </div>

            <p>
  Ready Market combines a customer storefront with practical tools
  for orders, products, inventory, delivery, marketing, and business
  reporting. It helps grocery stores grow while giving families,
  older adults, busy parents, and people with limited transportation
  an easier way to access groceries through pickup or delivery.
</p>
          </div>

          <div className="section feature-grid">
            {marketFeatures.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section two-column-section" id="about">
          <div className="about-panel">
            <span className="eyebrow">About Ready Technologies</span>
            <h2>Building useful technology from Minnesota.</h2>
            <p>
  Ready Technologies is an early-stage Minnesota software company
  building practical products that solve connected problems for
  businesses, customers, and local communities.
</p>

<p>
  Our first product, Ready Market, gives independent grocery stores
  affordable digital commerce tools while helping customers who may
  be unable to visit a store because of transportation limitations,
  mobility challenges, work schedules, childcare responsibilities,
  or other everyday barriers.
</p>

<p>
  By connecting stores, customers, and local delivery drivers, Ready
  Market supports neighborhood businesses, creates flexible earning
  opportunities, and improves access to essential groceries.
</p>
          </div>

          <div className="vision-panel">
            <span>Our vision</span>
            <blockquote>
              “Make modern business technology accessible to independent
              companies that are too often left behind.”
            </blockquote>
          </div>
        </section>

        <section className="community-preview-section">
  <div className="community-preview-copy">
    <span>Community Support</span>

    <h2>Supporting local communities while helping grocery stores grow.</h2>

   <p>
  Ready Market is built first to help independent grocery stores
  grow through affordable online ordering, pickup, delivery,
  inventory management, marketing tools, and business insights.
</p>

<p>
  At the same time, the platform helps address community challenges.
  It gives customers a convenient grocery option when transportation,
  mobility, work, childcare, or family responsibilities make visiting
  a store difficult.
</p>

<p>
  Ready Market also provides a small free community space where local
  farmers and food organizations can promote farmers markets,
  seasonal produce, and neighborhood food events. This helps residents
  discover local resources while keeping the platform’s main business
  focus on supporting independent grocery stores.
</p>

    <Link className="button button-secondary" to="/community">
      View Community Listings
    </Link>
  </div>

  <article className="community-event-card">
    <span>Free Community Listing</span>

    <h3>Fresh Farmers Market</h3>

    <div>
      <p>
        <strong>Location</strong>
        Lake George Park, St. Cloud
      </p>

      <p>
        <strong>Date</strong>
        Saturday
      </p>

      <p>
        <strong>Time</strong>
        8:00 AM – 1:00 PM
      </p>
    </div>

    <small>
      Fresh produce, local honey, baked goods, handcrafted foods, flowers, and
      seasonal products from local farmers.
    </small>
  </article>
</section>

<section className="section contact-section" id="contact">
  <div>
    <span className="eyebrow eyebrow-light">Become a Pilot Partner</span>

    <h2>Bring Ready Market to your grocery store.</h2>

    <p>
      We're inviting independent grocery stores to become early pilot partners.
      Help shape the future of Ready Market while giving your customers an
      easier way to shop through pickup and delivery.
    </p>
  </div>

  <form
    className="contact-form"
    onSubmit={(event) => event.preventDefault()}
  >
    <label>
      Name
      <input placeholder="Your name" type="text" />
    </label>

    <label>
      Email
      <input placeholder="you@example.com" type="email" />
    </label>

    <label>
      Grocery Store or Organization
      <input placeholder="Business name" type="text" />
    </label>

    <label>
      Message
      <textarea
        placeholder="Tell us about your grocery store or how Ready Market can help."
        rows="4"
      />
    </label>

    <button className="button button-light" type="submit">
      Request Information
    </button>

    <small>
      This contact form is currently a demonstration. Email integration will be
      added before the Ready Market pilot launch.
    </small>
  </form>
</section>
        
      </main>

  <footer>
  <a className="brand brand-footer" href="#top">
    <span className="brand-mark">R</span>

    <span>
      <strong>Ready</strong>
      <small>Technologies</small>
    </span>
  </a>

  <p>Building practical software for local business growth.</p>

  <div className="footer-driver-links">
    <Link to="/driver-signup">Become a Driver</Link>
    <Link to="/driver-login">Driver Sign In</Link>
  </div>

  <div className="footer-links">
    <Link to="/admin">Platform Admin</Link>
  </div>

  <span>© 2026 Ready Technologies. All rights reserved.</span>
</footer>
    </div>
  );
}

function App() {
  return (
  <Routes>
  <Route element={<HomePage />} path="/" />
  <Route element={<About />} path="/about" />
  <Route element={<Pricing />} path="/pricing" />
  <Route element={<ContactSales />} path="/contact-sales" />
  <Route element={<StoreSelection />} path="/stores" />
  <Route element={<CustomerApp />} path="/shop" />
  <Route element={<OwnerDashboard />} path="/dashboard" />
  <Route element={<AdminDashboard />} path="/admin" />
  <Route element={<DriverSignup />} path="/driver-signup" />
  <Route element={<DriverLogin />} path="/driver-login" />
  <Route element={<DriverDashboard />} path="/driver" />
  <Route element={<OrderTracking />} path="/track-order" />
  <Route element={<PlatformOverview />} path="/platform" />
  <Route element={<MerchantOrders />} path="/merchant-orders" />
  <Route element={<MerchantProducts />}path="/merchant-products"/>
  <Route element={<MerchantCustomers />}path="/merchant-customers"/>
  <Route element={<MerchantAnalytics />}path="/merchant-analytics"/>
  <Route element={<InventoryManagement />}path="/merchant-inventory"/>
  <Route element={<MerchantMarketing />}path="/merchant-marketing"/>
  <Route element={<MerchantReports />}path="/merchant-reports"/>
  <Route element={<MerchantSettings />}path="/merchant-settings"/>
  <Route element={<DriverManagement />}path="/merchant-drivers"/>
  <Route element={<Community />} path="/community" />
</Routes>
  );
}

export default App;