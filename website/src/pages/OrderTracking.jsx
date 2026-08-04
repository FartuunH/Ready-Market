import { useState } from "react";
import { Link } from "react-router-dom";
import "./OrderTracking.css";

const trackingSteps = [
  {
    id: 1,
    title: "Order received",
    description: "The store received your grocery order.",
  },
  {
    id: 2,
    title: "Preparing order",
    description: "Store employees are collecting your items.",
  },
  {
    id: 3,
    title: "Driver assigned",
    description: "A Ready Market driver accepted the delivery.",
  },
  {
    id: 4,
    title: "Out for delivery",
    description: "Your driver is traveling to your address.",
  },
  {
    id: 5,
    title: "Delivered",
    description: "Your groceries have been delivered.",
  },
];

function OrderTracking() {
  const [currentStep, setCurrentStep] = useState(3);

  const advanceOrder = () => {
    setCurrentStep((step) => Math.min(step + 1, trackingSteps.length));
  };

  return (
    <div className="tracking-page">
      <header className="tracking-header">
        <Link className="tracking-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Order Tracking</small>
          </div>
        </Link>

        <Link to="/stores">Continue Shopping</Link>
      </header>

      <main className="tracking-main">
        <section className="tracking-hero">
          <div>
            <span>Order #RM-1051</span>
            <h1>Your groceries are on the way.</h1>

            <p>
              Follow your store preparation, driver assignment, and delivery
              progress.
            </p>
          </div>

          <div className="tracking-estimate">
            <span>Estimated arrival</span>
            <strong>4:45 PM–5:05 PM</strong>
            <small>Approximately 24 minutes away</small>
          </div>
        </section>

        <section className="tracking-layout">
          <article className="tracking-panel">
            <div className="tracking-panel-heading">
              <div>
                <span>Delivery progress</span>
                <h2>Order status</h2>
              </div>

              <small>
                Step {currentStep} of {trackingSteps.length}
              </small>
            </div>

            <div className="tracking-timeline">
              {trackingSteps.map((step) => {
                const isCompleted = step.id < currentStep;
                const isActive = step.id === currentStep;

                return (
                  <article
                    className={`tracking-step ${
                      isCompleted ? "tracking-step-completed" : ""
                    } ${isActive ? "tracking-step-active" : ""}`}
                    key={step.id}
                  >
                    <div className="tracking-step-marker">
                      {isCompleted ? "✓" : step.id}
                    </div>

                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            {currentStep < trackingSteps.length ? (
              <button
                className="tracking-demo-button"
                onClick={advanceOrder}
                type="button"
              >
                Advance Demo Status
              </button>
            ) : (
              <div className="tracking-delivered-message">
                <strong>Delivery completed</strong>
                <p>Thank you for shopping with a local grocery store.</p>
              </div>
            )}
          </article>

          <aside className="tracking-sidebar">
            <section className="tracking-driver-card">
              <span>Your driver</span>

              <div className="tracking-driver-profile">
                <div className="tracking-driver-avatar">DD</div>

                <div>
                  <strong>Demo Driver</strong>
                  <small>★ 4.9 · 328 deliveries</small>
                </div>
              </div>

              <div className="tracking-driver-details">
                <div>
                  <span>Vehicle</span>
                  <strong>Silver Toyota Camry</strong>
                </div>

                <div>
                  <span>License plate</span>
                  <strong>ABC 123</strong>
                </div>
              </div>

              <div className="tracking-driver-actions">
                <button type="button">Message Driver</button>
                <button type="button">Call Driver</button>
              </div>
            </section>

            <section className="tracking-order-card">
              <span>Order summary</span>
              <h2>Neighborhood Fresh Market</h2>

              <div>
                <p>
                  <span>Items</span>
                  <strong>5</strong>
                </p>

                <p>
                  <span>Groceries</span>
                  <strong>$31.85</strong>
                </p>

                <p>
                  <span>Delivery fee</span>
                  <strong>$11.50</strong>
                </p>

                <p>
                  <span>Total</span>
                  <strong>$43.35</strong>
                </p>
              </div>

              <small>
                Delivery address: St. Cloud, Minnesota
              </small>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default OrderTracking;