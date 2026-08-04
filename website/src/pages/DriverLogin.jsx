import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DriverPortal.css";

function DriverLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    navigate("/driver");
  };

  return (
    <div className="driver-auth-page">
      <header className="driver-simple-header">
        <Link className="driver-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Driver Portal</small>
          </div>
        </Link>

        <Link to="/driver-signup">Become a Driver</Link>
      </header>

      <main className="driver-login-layout">
        <section className="driver-login-card">
          <span>Driver Sign In</span>
          <h1>Welcome back.</h1>

          <p>
            Sign in to view available deliveries, current orders, earnings, and
            payout history.
          </p>

          <form onSubmit={handleSubmit}>
            <label>
              Email address
              <input name="email" required type="email" />
            </label>

            <label>
              Password
              <input name="password" required type="password" />
            </label>

            {error && <p className="driver-form-error">{error}</p>}

            <button className="driver-primary-button" type="submit">
              Sign In
            </button>
          </form>

          <small>
            Prototype access: enter any email and password to open the driver
            dashboard.
          </small>

          <Link className="driver-secondary-link" to="/driver-signup">
            New driver? Create an account
          </Link>
        </section>
      </main>
    </div>
  );
}

export default DriverLogin;