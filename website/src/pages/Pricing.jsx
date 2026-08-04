import { Link } from "react-router-dom";
import "./Pricing.css";

const plans = [
  {
    name: "Starter",
    price: "Free",
    description: "For small grocery stores getting started online.",
    button: "Start Free",
    featured: false,
    features: [
      "Digital storefront",
      "Product catalog",
      "Pickup ordering",
      "Basic merchant dashboard",
      "Up to 100 orders per month",
      "Email support",
    ],
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing stores that need stronger commerce tools.",
    button: "Start 14-Day Trial",
    featured: true,
    features: [
      "Unlimited customer orders",
      "Pickup and delivery management",
      "Inventory tracking",
      "Customer analytics",
      "Coupons and promotions",
      "AI-powered business insights",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For multi-location grocery stores and larger operators.",
    button: "Contact Sales",
    featured: false,
    features: [
      "Multiple store locations",
      "Advanced analytics",
      "API access",
      "White-label options",
      "Custom integrations",
      "Dedicated account manager",
      "Implementation support",
    ],
  },
];

const faqs = [
  {
    question: "Is there a long-term contract?",
    answer:
      "No. Ready Market plans are designed to be flexible, and stores can change or cancel plans as their needs change.",
  },
  {
    question: "Can stores offer both pickup and delivery?",
    answer:
      "Yes. Professional and Enterprise plans are designed to support both fulfillment options.",
  },
  {
    question: "Does Ready Market support EBT or WIC?",
    answer:
      "EBT and WIC support are planned future capabilities. Availability will depend on payment-provider certification, retailer eligibility, and applicable program requirements.",
  },
  {
    question: "Will Ready Technologies help stores get started?",
    answer:
      "Yes. Ready Technologies plans to provide onboarding assistance for product setup, store configuration, and staff training.",
  },
];

function Pricing() {
  return (
    <div className="pricing-page">
      <header className="pricing-header">
        <Link className="pricing-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>Ready Market Pricing</small>
          </div>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/stores">View Demo</Link>
          <Link className="pricing-header-button" to="/contact-sales">
  Request a Demo
</Link>
        </nav>
      </header>

      <main>
        <section className="pricing-hero">
          <span>Simple SaaS Pricing</span>

          <h1>Choose the right plan for your grocery store.</h1>

          <p>
            Start with the tools you need today and upgrade as your online
            ordering business grows.
          </p>
        </section>

        <section className="pricing-grid">
          {plans.map((plan) => (
            <article
              className={`pricing-card ${
                plan.featured ? "pricing-card-featured" : ""
              }`}
              key={plan.name}
            >
              {plan.featured && (
                <span className="pricing-popular-label">
                  Most Popular
                </span>
              )}

              <span className="pricing-plan-name">{plan.name}</span>

              <div className="pricing-price">
                <strong>{plan.price}</strong>
                {plan.period && <small>{plan.period}</small>}
              </div>

              <p>{plan.description}</p>

              <Link
                className="pricing-plan-button"
               to={
  plan.name === "Enterprise"
    ? "/contact-sales"
    : "/stores"
}
              >
                {plan.button}
              </Link>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="pricing-comparison">
          <div className="pricing-section-heading">
            <span>Compare Plans</span>
            <h2>Everything stores need to grow online.</h2>
          </div>

          <div className="comparison-table">
            <div className="comparison-header">
              <span>Feature</span>
              <strong>Starter</strong>
              <strong>Professional</strong>
              <strong>Enterprise</strong>
            </div>

            {[
              ["Digital storefront", "✓", "✓", "✓"],
              ["Pickup ordering", "✓", "✓", "✓"],
              ["Delivery management", "—", "✓", "✓"],
              ["Inventory analytics", "Basic", "Advanced", "Advanced"],
              ["AI business insights", "—", "✓", "✓"],
              ["Multiple locations", "—", "—", "✓"],
              ["Dedicated support", "—", "—", "✓"],
            ].map((row) => (
              <div className="comparison-row" key={row[0]}>
                <span>{row[0]}</span>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
                <span>{row[3]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="pricing-faq">
          <div className="pricing-section-heading">
            <span>Frequently Asked Questions</span>
            <h2>Questions from grocery store owners.</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq) => (
              <article key={faq.question}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pricing-cta">
          <div>
            <span>Ready Market Pilot</span>
            <h2>Need help choosing a plan?</h2>
            <p>
              Schedule a product demonstration and learn how Ready Market can
              support your grocery store.
            </p>
          </div>

          <div className="pricing-cta-actions">
            <Link to="/contact-sales">Contact Sales</Link>
            <Link to="/stores">Explore the Demo</Link>
          </div>
        </section>
      </main>

      <footer className="pricing-footer">
        <Link className="pricing-brand" to="/">
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

export default Pricing;