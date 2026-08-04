import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./DriverPortal.css";

const initialDeliveries = [
  {
    id: "RM-2058",
    store: "Neighborhood Fresh Market",
    pickupAddress: "120 5th Avenue South, St. Cloud, MN",
    customerArea: "Waite Park, MN",
    miles: 4.8,
    estimatedMinutes: 24,
    basePay: 7.5,
    mileagePay: 3.6,
    tip: 3,
    itemCount: 14,
    status: "Available",
  },
  {
    id: "RM-2059",
    store: "International Market",
    pickupAddress: "310 Division Street, St. Cloud, MN",
    customerArea: "Sauk Rapids, MN",
    miles: 6.2,
    estimatedMinutes: 31,
    basePay: 8,
    mileagePay: 4.65,
    tip: 4,
    itemCount: 21,
    status: "Available",
  },
  {
    id: "RM-2060",
    store: "Family Food Market",
    pickupAddress: "85 2nd Avenue North, Waite Park, MN",
    customerArea: "St. Cloud, MN",
    miles: 3.4,
    estimatedMinutes: 18,
    basePay: 6.5,
    mileagePay: 2.55,
    tip: 2,
    itemCount: 9,
    status: "Available",
  },
];

function DriverDashboard() {
  const [online, setOnline] = useState(true);
  const [deliveries, setDeliveries] = useState(initialDeliveries);
  const [activeDeliveryId, setActiveDeliveryId] = useState(null);
  const [completedCount, setCompletedCount] = useState(7);

  const activeDelivery = deliveries.find(
    (delivery) => delivery.id === activeDeliveryId,
  );

  const availableDeliveries = deliveries.filter(
    (delivery) => delivery.status === "Available",
  );

  const todayEarnings = useMemo(() => 86.4 + completedCount * 0.5, [
    completedCount,
  ]);

  const calculateTotalPay = (delivery) =>
    delivery.basePay + delivery.mileagePay + delivery.tip;

  const acceptDelivery = (deliveryId) => {
    setDeliveries((currentDeliveries) =>
      currentDeliveries.map((delivery) =>
        delivery.id === deliveryId
          ? { ...delivery, status: "Accepted" }
          : delivery,
      ),
    );

    setActiveDeliveryId(deliveryId);
  };

  const markPickedUp = () => {
    setDeliveries((currentDeliveries) =>
      currentDeliveries.map((delivery) =>
        delivery.id === activeDeliveryId
          ? { ...delivery, status: "Picked Up" }
          : delivery,
      ),
    );
  };

  const completeDelivery = () => {
    setDeliveries((currentDeliveries) =>
      currentDeliveries.map((delivery) =>
        delivery.id === activeDeliveryId
          ? { ...delivery, status: "Completed" }
          : delivery,
      ),
    );

    setCompletedCount((currentCount) => currentCount + 1);
    setActiveDeliveryId(null);
  };

  return (
    <div className="driver-dashboard">
      <aside className="driver-sidebar">
        <Link className="driver-brand driver-sidebar-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Driver Portal</small>
          </div>
        </Link>

        <nav>
          <button className="driver-nav-active" type="button">
            Deliveries
          </button>
          <button type="button">Earnings</button>
          <button type="button">Schedule</button>
          <button type="button">Documents</button>
          <button type="button">Vehicle</button>
          <button type="button">Support</button>
          <button type="button">Settings</button>
        </nav>

        <div className="driver-profile-card">
          <span>Driver account</span>
          <strong>Demo Driver</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="driver-main">
        <header className="driver-dashboard-header">
          <div>
            <span>Ready Market Driver</span>
            <h1>Delivery dashboard</h1>
            <p>Review deliveries, mileage, estimated time, and earnings.</p>
          </div>

          <button
            className={`driver-status-button ${
              online ? "driver-online" : "driver-offline"
            }`}
            onClick={() => setOnline((currentStatus) => !currentStatus)}
            type="button"
          >
            {online ? "● Online" : "○ Offline"}
          </button>
        </header>

        <section className="driver-metrics">
          <article>
            <span>Today’s earnings</span>
            <strong>${todayEarnings.toFixed(2)}</strong>
            <small>Includes delivery pay and tips</small>
          </article>

          <article>
            <span>Completed today</span>
            <strong>{completedCount}</strong>
            <small>Deliveries completed</small>
          </article>

          <article>
            <span>Available orders</span>
            <strong>{availableDeliveries.length}</strong>
            <small>Near your current area</small>
          </article>

          <article>
            <span>Online status</span>
            <strong>{online ? "Online" : "Offline"}</strong>
            <small>{online ? "Receiving offers" : "Offers paused"}</small>
          </article>
        </section>

        {activeDelivery && (
          <section className="driver-active-delivery">
            <div className="driver-section-heading">
              <div>
                <span>Active Delivery</span>
                <h2>Order {activeDelivery.id}</h2>
              </div>

              <small>{activeDelivery.status}</small>
            </div>

            <div className="driver-active-grid">
              <article>
                <span>Pickup</span>
                <strong>{activeDelivery.store}</strong>
                <p>{activeDelivery.pickupAddress}</p>
              </article>

              <article>
                <span>Delivery area</span>
                <strong>{activeDelivery.customerArea}</strong>
                <p>
                  {activeDelivery.miles} miles · approximately{" "}
                  {activeDelivery.estimatedMinutes} minutes
                </p>
              </article>

              <article>
                <span>Expected earnings</span>
                <strong>
                  ${calculateTotalPay(activeDelivery).toFixed(2)}
                </strong>
                <p>Includes ${activeDelivery.tip.toFixed(2)} customer tip</p>
              </article>
            </div>

            <div className="driver-active-actions">
              {activeDelivery.status === "Accepted" && (
                <>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeDelivery.pickupAddress,
                    )}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Navigate to Store
                  </a>

                  <button onClick={markPickedUp} type="button">
                    Confirm Pickup
                  </button>
                </>
              )}

              {activeDelivery.status === "Picked Up" && (
                <>
                  <button type="button">Start Customer Navigation</button>

                  <button onClick={completeDelivery} type="button">
                    Confirm Delivery
                  </button>
                </>
              )}
            </div>
          </section>
        )}

        <section className="driver-delivery-section">
          <div className="driver-section-heading">
            <div>
              <span>Available Deliveries</span>
              <h2>Orders near St. Cloud</h2>
            </div>

            <p>
              Earnings shown include estimated delivery pay and customer tip.
            </p>
          </div>

          {!online ? (
            <div className="driver-empty-state">
              <h3>You are offline</h3>
              <p>Go online to receive available delivery offers.</p>
            </div>
          ) : availableDeliveries.length === 0 ? (
            <div className="driver-empty-state">
              <h3>No deliveries available</h3>
              <p>New local delivery offers will appear here.</p>
            </div>
          ) : (
            <div className="driver-delivery-grid">
              {availableDeliveries.map((delivery) => {
                const totalPay = calculateTotalPay(delivery);

                return (
                  <article className="driver-delivery-card" key={delivery.id}>
                    <div className="driver-delivery-top">
                      <div>
                        <span>Order {delivery.id}</span>
                        <h3>{delivery.store}</h3>
                      </div>

                      <strong>${totalPay.toFixed(2)}</strong>
                    </div>

                    <div className="driver-route-summary">
                      <div>
                        <span>Pickup</span>
                        <strong>{delivery.pickupAddress}</strong>
                      </div>

                      <div>
                        <span>Delivery area</span>
                        <strong>{delivery.customerArea}</strong>
                      </div>
                    </div>

                    <div className="driver-delivery-details">
                      <span>{delivery.miles} miles</span>
                      <span>{delivery.estimatedMinutes} minutes</span>
                      <span>{delivery.itemCount} items</span>
                    </div>

                    <div className="driver-pay-breakdown">
                      <div>
                        <span>Base pay</span>
                        <strong>${delivery.basePay.toFixed(2)}</strong>
                      </div>

                      <div>
                        <span>Mileage pay</span>
                        <strong>${delivery.mileagePay.toFixed(2)}</strong>
                      </div>

                      <div>
                        <span>Customer tip</span>
                        <strong>${delivery.tip.toFixed(2)}</strong>
                      </div>
                    </div>

                    <button
                      disabled={Boolean(activeDeliveryId)}
                      onClick={() => acceptDelivery(delivery.id)}
                      type="button"
                    >
                      {activeDeliveryId
                        ? "Complete Active Delivery First"
                        : "Accept Delivery"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="driver-payout-panel">
          <div>
            <span>Driver Payout Model</span>
            <h2>How Ready Market calculates driver earnings</h2>

            <p>
              The Phase 1 demonstration uses base pay, mileage pay, and the
              customer tip. Real rates will be finalized after legal,
              insurance, operational, and pilot-program review.
            </p>
          </div>

          <div className="driver-formula">
            <span>Example calculation</span>
            <strong>Base pay + mileage pay + 100% of tip</strong>
            <small>
              Ready Market collects payment and sends the driver payout through
              the platform.
            </small>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DriverDashboard;