import { useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantSettings.css";

const initialSettings = {
  storeName: "Neighborhood Fresh Market",
  businessEmail: "owner@freshmarket.com",
  businessPhone: "(320) 555-0148",
  address: "1200 Division Street, St. Cloud, MN",
  description:
    "Independent neighborhood grocery store offering fresh produce, pantry products, pickup, and local delivery.",
  openingTime: "08:00",
  closingTime: "21:00",
  pickupEnabled: true,
  deliveryEnabled: true,
  minimumOrder: 15,
  deliveryRadius: 12,
  preparationTime: 30,
  orderNotifications: true,
  lowStockNotifications: true,
  driverNotifications: true,
  customerMessages: true,
};

function MerchantSettings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setSettings((currentSettings) => ({
      ...currentSettings,
      [name]: type === "checkbox" ? checked : value,
    }));

    setSaved(false);
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setSaved(true);
  };

  const resetSettings = () => {
    setSettings(initialSettings);
    setSaved(false);
  };

  return (
    <div className="merchant-settings-page">
      <aside className="merchant-settings-sidebar">
        <Link className="merchant-settings-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Merchant Console</small>
          </div>
        </Link>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/merchant-orders">Orders</Link>
          <Link to="/merchant-products">Products</Link>
          <Link to="/merchant-inventory">Inventory</Link>
          <Link to="/merchant-customers">Customers</Link>

          <Link to="/merchant-drivers">Drivers</Link>

          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>

          <Link
            className="merchant-settings-active"
            to="/merchant-settings"
          >
            Settings
          </Link>
        </nav>

        <div className="merchant-settings-store">
          <span>Current store</span>
          <strong>{settings.storeName}</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-settings-main">
        <header className="merchant-settings-header">
          <div>
            <span>Store Administration</span>
            <h1>Settings</h1>

            <p>
              Manage store details, fulfillment options, operating
              hours, and notifications.
            </p>
          </div>

          <Link to="/shop">
            Preview Customer Store
          </Link>
        </header>

        {saved && (
          <div className="merchant-settings-success">
            <span>✓</span>

            <div>
              <strong>Settings saved</strong>
              <p>
                Your demonstration store settings were updated.
              </p>
            </div>
          </div>
        )}

        <form
          className="merchant-settings-form"
          onSubmit={saveSettings}
        >
          <section className="merchant-settings-panel">
            <div className="merchant-settings-heading">
              <span>Business Profile</span>
              <h2>Store information</h2>

              <p>
                Information customers may see throughout Ready Market.
              </p>
            </div>

            <div className="merchant-settings-fields">
              <label>
                Store name
                <input
                  name="storeName"
                  onChange={handleChange}
                  required
                  type="text"
                  value={settings.storeName}
                />
              </label>

              <label>
                Business email
                <input
                  name="businessEmail"
                  onChange={handleChange}
                  required
                  type="email"
                  value={settings.businessEmail}
                />
              </label>

              <label>
                Business phone
                <input
                  name="businessPhone"
                  onChange={handleChange}
                  required
                  type="tel"
                  value={settings.businessPhone}
                />
              </label>

              <label>
                Store address
                <input
                  name="address"
                  onChange={handleChange}
                  required
                  type="text"
                  value={settings.address}
                />
              </label>

              <label className="merchant-settings-full">
                Store description
                <textarea
                  name="description"
                  onChange={handleChange}
                  rows="4"
                  value={settings.description}
                />
              </label>
            </div>
          </section>

          <section className="merchant-settings-panel">
            <div className="merchant-settings-heading">
              <span>Store Operations</span>
              <h2>Hours and preparation</h2>

              <p>
                Set demonstration operating hours and order timing.
              </p>
            </div>

            <div className="merchant-settings-fields">
              <label>
                Opening time
                <input
                  name="openingTime"
                  onChange={handleChange}
                  type="time"
                  value={settings.openingTime}
                />
              </label>

              <label>
                Closing time
                <input
                  name="closingTime"
                  onChange={handleChange}
                  type="time"
                  value={settings.closingTime}
                />
              </label>

              <label>
                Average preparation time
                <div className="merchant-settings-input-unit">
                  <input
                    min="5"
                    name="preparationTime"
                    onChange={handleChange}
                    type="number"
                    value={settings.preparationTime}
                  />

                  <span>minutes</span>
                </div>
              </label>

              <label>
                Minimum order
                <div className="merchant-settings-input-unit">
                  <span>$</span>

                  <input
                    min="0"
                    name="minimumOrder"
                    onChange={handleChange}
                    step="0.01"
                    type="number"
                    value={settings.minimumOrder}
                  />
                </div>
              </label>
            </div>
          </section>

          <section className="merchant-settings-panel">
            <div className="merchant-settings-heading">
              <span>Fulfillment</span>
              <h2>Pickup and delivery</h2>

              <p>
                Choose how customers can receive orders.
              </p>
            </div>

            <div className="merchant-settings-toggle-list">
              <label>
                <div>
                  <strong>Enable store pickup</strong>
                  <span>
                    Customers may place orders and collect them at the
                    store.
                  </span>
                </div>

                <input
                  checked={settings.pickupEnabled}
                  name="pickupEnabled"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>

              <label>
                <div>
                  <strong>Enable local delivery</strong>
                  <span>
                    Customers may request delivery within the store
                    service area.
                  </span>
                </div>

                <input
                  checked={settings.deliveryEnabled}
                  name="deliveryEnabled"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>
            </div>

            {settings.deliveryEnabled && (
              <div className="merchant-settings-delivery-fields">
                <label>
                  Delivery radius
                  <div className="merchant-settings-input-unit">
                    <input
                      min="1"
                      name="deliveryRadius"
                      onChange={handleChange}
                      type="number"
                      value={settings.deliveryRadius}
                    />

                    <span>miles</span>
                  </div>
                </label>

                <article>
                  <span>Delivery pricing</span>
                  <strong>
                    Base fee + mileage + service fee
                  </strong>

                  <small>
                    Current pricing is demonstration-only.
                  </small>
                </article>
              </div>
            )}
          </section>

          <section className="merchant-settings-panel">
            <div className="merchant-settings-heading">
              <span>Notifications</span>
              <h2>Operational alerts</h2>

              <p>
                Select the types of alerts the store should receive.
              </p>
            </div>

            <div className="merchant-settings-toggle-list">
              <label>
                <div>
                  <strong>New order notifications</strong>
                  <span>
                    Alert store staff when a new order arrives.
                  </span>
                </div>

                <input
                  checked={settings.orderNotifications}
                  name="orderNotifications"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>

              <label>
                <div>
                  <strong>Low-stock notifications</strong>
                  <span>
                    Alert staff when inventory reaches minimum levels.
                  </span>
                </div>

                <input
                  checked={settings.lowStockNotifications}
                  name="lowStockNotifications"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>

              <label>
                <div>
                  <strong>Driver notifications</strong>
                  <span>
                    Receive updates about driver assignment and pickup.
                  </span>
                </div>

                <input
                  checked={settings.driverNotifications}
                  name="driverNotifications"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>

              <label>
                <div>
                  <strong>Customer-message alerts</strong>
                  <span>
                    Notify store staff when a customer sends a message.
                  </span>
                </div>

                <input
                  checked={settings.customerMessages}
                  name="customerMessages"
                  onChange={handleChange}
                  type="checkbox"
                />
              </label>
            </div>
          </section>

          <section className="merchant-settings-panel merchant-settings-account-panel">
            <div className="merchant-settings-heading">
              <span>Subscription</span>
              <h2>Ready Market plan</h2>

              <p>
                Demonstration subscription information for this store.
              </p>
            </div>

            <div className="merchant-settings-plan">
              <div>
                <span>Current plan</span>
                <strong>Professional</strong>
                <small>$99 per month</small>
              </div>

              <div>
                <span>Status</span>
                <strong>Demo Active</strong>
                <small>No real billing is connected.</small>
              </div>

              <Link to="/pricing">
                View Pricing
              </Link>
            </div>
          </section>

          <div className="merchant-settings-actions">
            <button
              className="merchant-settings-reset"
              onClick={resetSettings}
              type="button"
            >
              Reset Changes
            </button>

            <button
              className="merchant-settings-save"
              type="submit"
            >
              Save Settings
            </button>
          </div>

          <small className="merchant-settings-disclosure">
            Settings are stored only during the current demonstration
            session and are not connected to a production database.
          </small>
        </form>
      </main>
    </div>
  );
}

export default MerchantSettings;