import { Link } from "react-router-dom";
import "./PlatformOverview.css";

const platformRoles = [
  {
    number: "01",
    title: "Customer",
    description:
      "Customers discover nearby grocery stores, shop products, choose pickup or delivery, and track their orders.",
    features: [
      "Browse local stores",
      "Shop grocery products",
      "Pickup or delivery",
      "Order tracking",
    ],
    link: "/stores",
    button: "Open Customer Demo",
  },
  {
    number: "02",
    title: "Grocery Store",
    description:
      "Independent grocery stores manage products, orders, inventory, customers, and business performance.",
    features: [
      "Order management",
      "Product catalog",
      "Inventory tracking",
      "Sales analytics",
    ],
    link: "/dashboard",
    button: "Merchant Dashboard",
  },
  {
    number: "03",
    title: "Driver",
    description:
      "Drivers review available deliveries, see estimated mileage and earnings, and manage delivery progress.",
    features: [
      "Available deliveries",
      "Mileage and earnings",
      "Delivery status",
      "Driver history",
    ],
    link: "/driver",
    button: "Driver Portal",
  },
  {
    number: "04",
    title: "Platform Admin",
    description:
      "Ready Technologies manages participating stores, subscriptions, support, revenue, and platform performance.",
    features: [
      "Store approvals",
      "Subscription management",
      "Platform analytics",
      "Support management",
    ],
    link: "/admin",
    button: "Platform Dashboard",
  },
];

const platformFeatures = [
  {
    number: "01",
    title: "Inventory Management",
    description:
      "Help stores organize product catalogs, monitor inventory levels, and identify low-stock items.",
  },
  {
    number: "02",
    title: "Delivery Management",
    description:
      "Connect checkout, driver assignment, delivery fees, earnings, and customer order tracking.",
  },
  {
    number: "03",
    title: "Business Analytics",
    description:
      "Give merchants practical visibility into revenue, orders, customers, and product performance.",
  },
  {
    number: "04",
    title: "Modern Commerce",
    description:
      "Provide independent stores with a professional digital storefront and streamlined checkout experience.",
  },
  {
    number: "05",
    title: "AI Ready",
    description:
      "Designed for future inventory forecasting, product recommendations, and operational insights.",
  },
  {
    number: "06",
    title: "Scalable Platform",
    description:
      "Built to support multiple stores, drivers, customers, and communities from one connected system.",
  },
];

const roadmap = [
  {
    stage: "Complete",
    title: "Pilot-Ready Demonstration",
    description:
      "Customer storefront, merchant dashboard, driver portal, admin platform, checkout, and order tracking.",
  },
  {
    stage: "Next",
    title: "Pilot Grocery Stores",
    description:
      "Partner with independent Minnesota grocery stores to test workflows and collect feedback.",
  },
  {
    stage: "Production",
    title: "Real Integrations",
    description:
      "Add authentication, database storage, payments, maps, notifications, and secure cloud infrastructure.",
  },
  {
    stage: "Growth",
    title: "Minnesota Expansion",
    description:
      "Expand Ready Market into additional Minnesota communities and independent retail networks.",
  },
  {
    stage: "Future",
    title: "Regional Growth",
    description:
      "Scale the marketplace, delivery network, analytics, and AI capabilities into additional markets.",
  },
];

const technologies = [
  "React",
  "Vite",
  "JavaScript",
  "Python",
  "FastAPI",
  "SQL",
  "Microsoft Azure",
  "Power BI",
  "AI Ready",
];

function PlatformOverview() {
  return (
    <div className="platform-page">
      <header className="platform-header">
        <Link className="platform-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>Ready Market Platform</small>
          </div>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/stores">Customer Demo</Link>
          <Link
            className="platform-header-button"
            to="/contact-sales"
          >
            Request a Demo
          </Link>
        </nav>
      </header>

      <main>
        <section className="platform-hero">
          <div className="platform-hero-copy">
            <span>Ready Market Platform</span>

            <h1>
              One connected platform for local grocery commerce.
            </h1>

            <p>
              Ready Market connects customers, independent grocery stores,
              delivery drivers, and platform administration through one modern
              digital system.
            </p>

            <div className="platform-hero-actions">
              <Link to="/stores">Explore Customer App</Link>
              <Link to="/contact-sales">Become a Pilot Store</Link>
            </div>

            <div className="platform-stage-label">
              <strong>Current Stage</strong>
              <span>Pilot-ready demonstration</span>
            </div>
          </div>

          <div className="platform-ecosystem-preview">
            <div className="ecosystem-center">
              <span>R</span>
              <strong>Ready Market</strong>
              <small>Connected commerce platform</small>
            </div>

            <article className="ecosystem-card ecosystem-customer">
              <span>Customer</span>
              <strong>Shop and track orders</strong>
            </article>

            <article className="ecosystem-card ecosystem-merchant">
              <span>Merchant</span>
              <strong>Manage store operations</strong>
            </article>

            <article className="ecosystem-card ecosystem-driver">
              <span>Driver</span>
              <strong>Accept local deliveries</strong>
            </article>

            <article className="ecosystem-card ecosystem-admin">
              <span>Admin</span>
              <strong>Manage the platform</strong>
            </article>
          </div>
        </section>

        <section className="platform-trust-strip">
          <span>Customer Commerce</span>
          <span>Merchant Operations</span>
          <span>Driver Delivery</span>
          <span>Platform Administration</span>
        </section>

        <section className="platform-flow-section">
          <div className="platform-section-heading">
            <span>How It Works</span>
            <h2>Every order moves through one connected system.</h2>

            <p>
              Customers place orders, stores prepare products, drivers complete
              deliveries, and Ready Technologies manages platform performance.
            </p>
          </div>

          <div className="platform-flow">
            <article>
              <span>01</span>
              <strong>Customer shops</strong>
              <p>The customer chooses a store and places an order.</p>
            </article>

            <div className="platform-flow-arrow">→</div>

            <article>
              <span>02</span>
              <strong>Store prepares</strong>
              <p>The merchant receives and prepares the grocery order.</p>
            </article>

            <div className="platform-flow-arrow">→</div>

            <article>
              <span>03</span>
              <strong>Driver delivers</strong>
              <p>A driver accepts the order and completes the delivery.</p>
            </article>

            <div className="platform-flow-arrow">→</div>

            <article>
              <span>04</span>
              <strong>Platform manages</strong>
              <p>Ready Market tracks operations, support, and performance.</p>
            </article>
          </div>
        </section>

        <section className="platform-role-section">
          <div className="platform-section-heading">
            <span>Platform Experiences</span>
            <h2>Built for every participant in local grocery delivery.</h2>
          </div>

          <div className="platform-role-grid">
            {platformRoles.map((role) => (
              <article className="platform-role-card" key={role.title}>
                <div className="platform-role-top">
                  <span>{role.number}</span>
                  <small>Ready Market</small>
                </div>

                <h3>{role.title}</h3>
                <p>{role.description}</p>

                <ul>
                  {role.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <Link to={role.link}>{role.button}</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="platform-feature-section">
          <div className="platform-section-heading platform-heading-light">
            <span>Platform Capabilities</span>
            <h2>Practical tools designed for independent grocery stores.</h2>
          </div>

          <div className="platform-feature-grid">
            {platformFeatures.map((feature) => (
              <article key={feature.title}>
                <span>{feature.number}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="platform-business-section">
          <div className="platform-business-copy">
            <span>Business Model</span>
            <h2>Flexible SaaS pricing with room to scale.</h2>

            <p>
              Ready Market is designed to combine affordable software
              subscriptions with delivery-related services, premium analytics,
              and future enterprise integrations.
            </p>

            <Link to="/pricing">View Complete Pricing</Link>
          </div>

          <div className="platform-pricing-preview">
            <article>
              <span>Starter</span>
              <strong>Free</strong>
              <small>For stores beginning online</small>
            </article>

            <article className="platform-pricing-featured">
              <span>Professional</span>
              <strong>$99</strong>
              <small>Per month</small>
            </article>

            <article>
              <span>Enterprise</span>
              <strong>Custom</strong>
              <small>For larger operations</small>
            </article>
          </div>
        </section>

        <section className="platform-roadmap-section">
          <div className="platform-section-heading">
            <span>Product Roadmap</span>
            <h2>From pilot-ready demonstration to scalable platform.</h2>
          </div>

          <div className="platform-roadmap">
            {roadmap.map((item, index) => (
              <article key={item.title}>
                <div className="roadmap-marker">
                  <span>{index + 1}</span>
                </div>

                <div>
                  <small>{item.stage}</small>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="platform-technology-section">
          <div>
            <span>Technology Foundation</span>
            <h2>Built with modern software and data technologies.</h2>

            <p>
              Ready Market uses a modern web architecture with a foundation for
              cloud infrastructure, business intelligence, automation, and
              future AI capabilities.
            </p>
          </div>

          <div className="technology-grid">
            {technologies.map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        </section>

        <section className="platform-status-section">
          <div>
            <span>Current Status</span>
            <h2>Pilot-ready demonstration.</h2>

            <p>
              Ready Market currently demonstrates the complete customer,
              merchant, driver, and administrator experience. The next phase is
              validating the platform with independent grocery-store partners
              and connecting production services.
            </p>
          </div>

          <div className="platform-status-metrics">
            <article>
              <strong>4</strong>
              <span>Connected user roles</span>
            </article>

            <article>
              <strong>1</strong>
              <span>Complete platform</span>
            </article>

            <article>
              <strong>MN</strong>
              <span>Pilot market</span>
            </article>
          </div>
        </section>

        <section className="platform-cta">
          <div>
            <span>Ready Market Pilot</span>
            <h2>Help shape the future of local grocery technology.</h2>

            <p>
              Ready Technologies is seeking independent grocery stores,
              community partners, startup programs, and funding organizations
              interested in supporting a Minnesota pilot.
            </p>
          </div>

          <div className="platform-cta-actions">
            <Link to="/contact-sales">Request a Demo</Link>
            <Link to="/stores">Explore the Platform</Link>
          </div>
        </section>
      </main>

      <footer className="platform-footer">
        <Link className="platform-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>St. Cloud, Minnesota</small>
          </div>
        </Link>

        <p>Building practical software for local business growth.</p>

        <div>
          <Link to="/driver-signup">Become a Driver</Link>
          <Link to="/contact-sales">Contact Sales</Link>
        </div>

        <span>© 2026 Ready Technologies</span>
      </footer>
    </div>
  );
}

export default PlatformOverview;