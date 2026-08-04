import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DriverPortal.css";

function DriverSignup() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="driver-auth-page">
        <section className="driver-success-card">
          <span className="driver-success-icon">✓</span>

          <h1>Application received</h1>

          <p>
            Your driver application has been saved in this prototype. In the
            production version, Ready Market will verify your identity, vehicle,
            insurance, and driving eligibility.
          </p>

          <button onClick={() => navigate("/driver")} type="button">
            View Driver Dashboard
          </button>

          <Link to="/">Return Home</Link>
        </section>
      </div>
    );
  }

  return (
    <div className="driver-auth-page">
      <header className="driver-simple-header">
        <Link className="driver-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Driver Application</small>
          </div>
        </Link>

        <Link to="/driver-login">Driver Sign In</Link>
      </header>

      <main className="driver-auth-layout">
        <section className="driver-auth-copy">
          <span>Ready Market Drivers</span>

          <h1>Earn money delivering groceries locally.</h1>

          <p>
            Help independent grocery stores serve customers throughout the
            St. Cloud area. Drivers can review mileage, estimated delivery time,
            and expected earnings before accepting an order.
          </p>

          <div className="driver-benefit-list">
            <article>
              <strong>See earnings first</strong>
              <p>Review estimated mileage and payout before accepting.</p>
            </article>

            <article>
              <strong>Choose deliveries</strong>
              <p>Accept available orders that fit your schedule.</p>
            </article>

            <article>
              <strong>Keep customer tips</strong>
              <p>The planned model sends 100% of customer tips to drivers.</p>
            </article>
          </div>
        </section>

        <form className="driver-auth-form" onSubmit={handleSubmit}>
          <span>Driver Application</span>
          <h2>Create your driver account</h2>

          <div className="driver-form-grid">
            <label>
              First name
              <input required type="text" />
            </label>

            <label>
              Last name
              <input required type="text" />
            </label>
          </div>

          <label>
            Email address
            <input required type="email" />
          </label>

          <label>
            Phone number
            <input required type="tel" />
          </label>

          <label>
            Home address
            <input required type="text" />
          </label>

          <div className="driver-form-grid">
            <label>
              City
              <input defaultValue="St. Cloud" required type="text" />
            </label>

            <label>
              ZIP code
              <input required type="text" />
            </label>
          </div>

          <label>
            Vehicle type
            <select defaultValue="Car">
              <option>Car</option>
              <option>SUV</option>
              <option>Minivan</option>
              <option>Cargo van</option>
              <option>Pickup truck</option>
            </select>
          </label>

          <div className="driver-form-grid">
            <label>
              Vehicle make
              <input placeholder="Example: Toyota" required type="text" />
            </label>

            <label>
              Vehicle model
              <input placeholder="Example: Camry" required type="text" />
            </label>
          </div>

          <div className="driver-form-grid">
            <label>
              Vehicle year
              <input min="2000" required type="number" />
            </label>

            <label>
              License plate
              <input required type="text" />
            </label>
          </div>

          <label>
            Driver’s license number
            <input required type="text" />
          </label>

          <label className="driver-checkbox">
            <input required type="checkbox" />
            <span>
              I confirm that I have a valid driver’s license and vehicle
              insurance.
            </span>
          </label>

          <label className="driver-checkbox">
            <input required type="checkbox" />
            <span>
              I consent to identity, driving-record, and background verification
              during production onboarding.
            </span>
          </label>

          <button className="driver-primary-button" type="submit">
            Submit Driver Application
          </button>

          <small>
            This is a demonstration form. Do not upload sensitive documents
            until secure production verification is implemented.
          </small>
        </form>
      </main>
    </div>
  );
}

export default DriverSignup;