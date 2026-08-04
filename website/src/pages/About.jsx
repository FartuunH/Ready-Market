import { Link } from "react-router-dom";
import "./About.css";

const values = [
  {
    title: "Practical Innovation",
    description:
      "We build technology that solves clear, everyday business problems.",
  },
  {
    title: "Local Business Growth",
    description:
      "Our products are designed to help independent businesses compete and grow.",
  },
  {
    title: "Accessible Technology",
    description:
      "Modern software should be affordable and understandable for businesses of every size.",
  },
  {
    title: "Responsible AI",
    description:
      "We use AI to support better decisions while keeping people in control.",
  },
];

const roadmap = [
  {
    year: "2026",
    title: "Ready Market MVP",
    description:
      "Launch the customer marketplace, merchant dashboard, store onboarding, and pilot program.",
  },
  {
    year: "2027",
    title: "Ready Market Growth",
    description:
      "Expand to additional Minnesota communities and introduce advanced analytics and AI inventory tools.",
  },
  {
    year: "2028",
    title: "Ready Fit AI",
    description:
      "Develop an AI-powered wellness and healthy-habit coaching platform.",
  },
  {
    year: "Future",
    title: "Ready Code AI",
    description:
      "Build a development platform that helps people turn software ideas into working applications.",
  },
];

function About() {
  return (
    <div className="about-page">
      <header className="about-header">
        <Link className="about-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>Company Overview</small>
          </div>
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/stores">Product Demo</Link>
          <Link className="about-demo-button" to="/#contact">
            Request a Demo
          </Link>
        </nav>
      </header>

      <main>
        <section className="about-hero">
          <div>
            <span>Minnesota Software Startup</span>

            <h1>
              Building practical technology for independent businesses.
            </h1>

            <p>
              Ready Technologies is an early-stage software company based in
              St. Cloud, Minnesota. We create modern digital products that help
              businesses operate more efficiently, reach customers online, and
              make better decisions using data and AI.
            </p>

            <div className="about-hero-actions">
              <Link to="/stores">Explore Ready Market</Link>
              <Link to="/pricing">View Pricing</Link>
            </div>
          </div>

          <div className="about-hero-card">
            <span>Our First Product</span>
            <h2>Ready Market</h2>

            <p>
              A digital commerce platform for independent grocery stores,
              combining online shopping, pickup, delivery, inventory tools, and
              business analytics.
            </p>

            <div>
              <strong>Customer Marketplace</strong>
              <strong>Merchant Dashboard</strong>
              <strong>Platform Administration</strong>
            </div>
          </div>
        </section>

        <section className="about-mission-section">
          <div className="about-section-heading">
            <span>Mission and Vision</span>
            <h2>Technology that helps local businesses move forward.</h2>
          </div>

          <div className="mission-grid">
            <article>
              <span>Our Mission</span>
              <h3>
                Build accessible, AI-powered software that helps independent
                businesses grow and compete.
              </h3>
            </article>

            <article>
              <span>Our Vision</span>
              <h3>
                Create a future where businesses of every size can use modern
                technology without the cost and complexity of custom software.
              </h3>
            </article>
          </div>
        </section>

        <section className="about-values-section">
          <div className="about-section-heading">
            <span>Company Values</span>
            <h2>How Ready Technologies approaches product development.</h2>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <article key={value.title}>
                <span>0{index + 1}</span>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="founder-section">
          <div className="founder-story">
            <span>Founder Story</span>

            <h2>Built from a belief that technology can create opportunity.</h2>

            <p>
              Ready Technologies was founded in Minnesota with the goal of
              building useful software products that solve real problems.
            </p>

            <p>
              The company’s first focus is helping independent grocery stores
              offer modern online ordering and business-management tools without
              needing to build expensive custom technology.
            </p>

            <p>
              The long-term plan is to grow Ready Technologies into a software
              company that develops practical AI products, creates Minnesota
              jobs, and serves businesses and individuals across multiple
              industries.
            </p>
          </div>

          <div className="founder-card">
            <span>Founder and Product Builder</span>
            <h3>Ready Technologies</h3>

            <ul>
              <li>Software development</li>
              <li>Data analytics</li>
              <li>UI and UX design</li>
              <li>Business problem solving</li>
              <li>AI product development</li>
            </ul>
          </div>
        </section>

        <section className="roadmap-section">
          <div className="about-section-heading">
            <span>Product Roadmap</span>
            <h2>One focused product at a time.</h2>
          </div>

          <div className="roadmap-grid">
            {roadmap.map((item) => (
              <article key={`${item.year}-${item.title}`}>
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-impact-section">
          <div>
            <span>Minnesota Impact</span>
            <h2>Designed to grow into a job-creating technology company.</h2>

            <p>
              Ready Technologies plans to create opportunities in software
              development, customer support, sales, implementation, data
              analytics, and product design as the company grows.
            </p>
          </div>

          <div className="impact-metrics">
            <article>
              <strong>1</strong>
              <span>Flagship MVP</span>
            </article>

            <article>
              <strong>3</strong>
              <span>Long-term products</span>
            </article>

            <article>
              <strong>MN</strong>
              <span>Company location</span>
            </article>
          </div>
        </section>

        <section className="about-cta">
          <div>
            <span>Ready Market Pilot</span>
            <h2>Help shape the future of local grocery technology.</h2>

            <p>
              We are seeking grocery-store partners, startup advisors, funding
              programs, and community organizations interested in supporting
              the Ready Market pilot.
            </p>
          </div>

          <div>
            <Link to="/stores">Explore the Demo</Link>
            <Link to="/#contact">Contact Ready Technologies</Link>
          </div>
        </section>
      </main>

      <footer className="about-footer">
        <Link className="about-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>St. Cloud, Minnesota</small>
          </div>
        </Link>

        <p>Building practical software for independent business growth.</p>

        <span>© 2026 Ready Technologies</span>
      </footer>
    </div>
  );
}

export default About;