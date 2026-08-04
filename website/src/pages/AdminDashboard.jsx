import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const initialStores = [
  {
    id: 1,
    name: "Neighborhood Fresh Market",
    location: "St. Cloud, MN",
    status: "Active",
    plan: "Professional",
    orders: 438,
    revenue: 18420,
  },
  {
    id: 2,
    name: "Downtown Grocery",
    location: "St. Cloud, MN",
    status: "Trial",
    plan: "Starter",
    orders: 214,
    revenue: 6420,
  },
  {
    id: 3,
    name: "Family Food Market",
    location: "Waite Park, MN",
    status: "Active",
    plan: "Professional",
    orders: 367,
    revenue: 13280,
  },
  {
    id: 4,
    name: "International Market",
    location: "St. Cloud, MN",
    status: "Pending",
    plan: "Starter",
    orders: 0,
    revenue: 0,
  },
];

const supportTickets = [
  {
    id: "#TK-204",
    store: "Downtown Grocery",
    issue: "Payment setup assistance",
    priority: "Urgent",
  },
  {
    id: "#TK-203",
    store: "Family Food Market",
    issue: "Product import question",
    priority: "Normal",
  },
  {
    id: "#TK-202",
    store: "Neighborhood Fresh Market",
    issue: "Delivery zone update",
    priority: "Normal",
  },
];

const platformDrivers = [
  { label: "Verified drivers", value: 162, detail: "12 pending review" },
  { label: "Drivers online", value: 48, detail: "Available now" },
  { label: "Completed today", value: 186, detail: "Across all stores" },
];

const communityListings = [
  {
    id: 1,
    title: "St. Cloud Farmers Market",
    location: "Lake George Park",
    schedule: "Saturday · 8:00 AM–1:00 PM",
    status: "Featured",
  },
  {
    id: 2,
    title: "Waite Park Fresh Market",
    location: "Waite Park, MN",
    schedule: "Sunday · 9:00 AM–2:00 PM",
    status: "Approved",
  },
];

const monthlyRevenue = [
  { month: "Mar", value: 38 },
  { month: "Apr", value: 48 },
  { month: "May", value: 55 },
  { month: "Jun", value: 68 },
  { month: "Jul", value: 77 },
  { month: "Aug", value: 91 },
];

function AdminDashboard() {
  const [stores, setStores] = useState(initialStores);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const [announcementSent, setAnnouncementSent] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: "",
    message: "",
  });

  const activeStores = useMemo(
    () => stores.filter((store) => store.status === "Active").length,
    [stores],
  );

  const pendingStores = useMemo(
    () => stores.filter((store) => store.status === "Pending").length,
    [stores],
  );

  const totalRevenue = useMemo(
    () => stores.reduce((total, store) => total + store.revenue, 0),
    [stores],
  );

  const totalOrders = useMemo(
    () => stores.reduce((total, store) => total + store.orders, 0),
    [stores],
  );

  const totalCustomers = 8246;
  const verifiedDrivers = 162;
  const monthlyGrowth = 18;
  const platformHealth = 99.98;

  const updateStoreStatus = (storeId, status) => {
    setStores((currentStores) =>
      currentStores.map((store) =>
        store.id === storeId ? { ...store, status } : store,
      ),
    );
  };

  const handleAnnouncementChange = (event) => {
    const { name, value } = event.target;

    setAnnouncement((currentAnnouncement) => ({
      ...currentAnnouncement,
      [name]: value,
    }));
  };

  const sendAnnouncement = (event) => {
    event.preventDefault();

    if (!announcement.title || !announcement.message) {
      return;
    }

    setAnnouncementSent(true);
  };

  const closeAnnouncement = () => {
    setAnnouncementOpen(false);
    setAnnouncementSent(false);
    setAnnouncement({
      title: "",
      message: "",
    });
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar">
        <Link className="admin-logo" to="/">
          <span>R</span>

          <div>
            <strong>Ready Technologies</strong>
            <small>Platform Administration</small>
          </div>
        </Link>

        <nav>
          <button className="admin-nav-active" type="button">
            Overview
          </button>
          <button type="button">Stores</button>
          <button type="button">Subscriptions</button>
          <button type="button">Customers</button>
          <button type="button">Orders</button>
          <Link to="/merchant-drivers">Drivers</Link>
          <button type="button">Support</button>
          <button type="button">Community Listings</button>
          <button type="button">Announcements</button>
          <button type="button">Platform Settings</button>
        </nav>

        <div className="admin-account-card">
          <span>Platform owner</span>
          <strong>Ready Technologies</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span>Ready Market Platform</span>
            <h1>Administration Overview</h1>
            <p>
              Monitor stores, subscriptions, orders, customers, and platform
              performance.
            </p>
          </div>

          <div className="admin-header-actions">
            <Link to="/stores">View Marketplace</Link>

            <button
              onClick={() => setAnnouncementOpen(true)}
              type="button"
            >
              Send Announcement
            </button>
          </div>
        </header>

        <section className="admin-metrics-grid">
          <article>
            <span>Total stores</span>
            <strong>{stores.length}</strong>
            <small>{activeStores} currently active</small>
          </article>

          <article>
            <span>Platform revenue</span>
            <strong>${totalRevenue.toLocaleString()}</strong>
            <small>Prototype monthly volume</small>
          </article>

          <article>
            <span>Total orders</span>
            <strong>{totalOrders.toLocaleString()}</strong>
            <small>Across all stores</small>
          </article>

          <article>
            <span>Pending approvals</span>
            <strong>{pendingStores}</strong>
            <small>Requires review</small>
          </article>

          <article>
            <span>Total customers</span>
            <strong>{totalCustomers.toLocaleString()}</strong>
            <small>Across all demo stores</small>
          </article>

          <article>
            <span>Verified drivers</span>
            <strong>{verifiedDrivers}</strong>
            <small>12 pending review</small>
          </article>

          <article>
            <span>Monthly growth</span>
            <strong>+{monthlyGrowth}%</strong>
            <small>Compared with last month</small>
          </article>

          <article>
            <span>Platform health</span>
            <strong>{platformHealth}%</strong>
            <small>All demo services online</small>
          </article>
        </section>

        <section className="admin-top-grid">
          <article className="admin-panel admin-revenue-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Financial Performance</span>
                <h2>Recurring revenue growth</h2>
              </div>

              <select defaultValue="6">
                <option value="6">Last 6 months</option>
                <option value="12">Last 12 months</option>
              </select>
            </div>

            <div className="admin-revenue-chart">
              {monthlyRevenue.map((item) => (
                <div className="admin-revenue-column" key={item.month}>
                  <span style={{ height: `${item.value}%` }} />
                  <small>{item.month}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="admin-panel admin-ai-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Ready AI</span>
                <h2>Platform insights</h2>
              </div>
            </div>

            <div className="admin-ai-insights">
              <article>
                <span>Revenue</span>
                <strong>Platform revenue increased 18% this month.</strong>
              </article>

              <article>
                <span>Inventory</span>
                <strong>
                  Three stores may experience low dairy inventory this week.
                </strong>
              </article>

              <article>
                <span>Customers</span>
                <strong>
                  Repeat customer activity increased by 9%.
                </strong>
              </article>

              <article>
                <span>Delivery demand</span>
                <strong>
                  Demand is expected to peak between 5 PM and 7 PM.
                </strong>
              </article>

              <article>
                <span>Store health</span>
                <strong>
                  One trial store may need onboarding support this week.
                </strong>
              </article>

              <article>
                <span>Risk monitoring</span>
                <strong>
                  No unusual order-volume patterns detected in this demo.
                </strong>
              </article>
            </div>

            <small>
              Illustrative AI insights based on demonstration data.
            </small>
          </article>
        </section>

        <section className="admin-panel admin-stores-panel">
          <div className="admin-panel-heading">
            <div>
              <span>Store Management</span>
              <h2>Ready Market stores</h2>
            </div>

            <button type="button">Add Store</button>
          </div>

          <div className="admin-store-table">
            <div className="admin-store-header">
              <span>Store</span>
              <span>Plan</span>
              <span>Orders</span>
              <span>Revenue</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {stores.map((store) => (
              <div className="admin-store-row" key={store.id}>
                <div>
                  <strong>{store.name}</strong>
                  <small>{store.location}</small>
                </div>

                <span>{store.plan}</span>
                <span>{store.orders}</span>
                <span>${store.revenue.toLocaleString()}</span>

                <small
                  className={`admin-status admin-status-${store.status.toLowerCase()}`}
                >
                  {store.status}
                </small>

                <div className="admin-store-actions">
                  {store.status === "Pending" && (
                    <button
                      onClick={() =>
                        updateStoreStatus(store.id, "Active")
                      }
                      type="button"
                    >
                      Approve
                    </button>
                  )}

                  {store.status === "Active" && (
                    <button
                      onClick={() =>
                        updateStoreStatus(store.id, "Suspended")
                      }
                      type="button"
                    >
                      Suspend
                    </button>
                  )}

                  {store.status === "Suspended" && (
                    <button
                      onClick={() =>
                        updateStoreStatus(store.id, "Active")
                      }
                      type="button"
                    >
                      Reactivate
                    </button>
                  )}

                  {store.status === "Trial" && (
                    <button
                      onClick={() =>
                        updateStoreStatus(store.id, "Active")
                      }
                      type="button"
                    >
                      Activate
                    </button>
                  )}

                  <Link to="/dashboard">View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>



        <section className="admin-bottom-grid">
          <article className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Driver Operations</span>
                <h2>Delivery network</h2>
              </div>

              <Link to="/merchant-drivers">Manage drivers</Link>
            </div>

            <div className="admin-ticket-list">
              {platformDrivers.map((item) => (
                <article key={item.label}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.detail}</span>
                  </div>

                  <small className="ticket-normal">{item.value}</small>
                </article>
              ))}
            </div>
          </article>

          <article className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Community Spotlight</span>
                <h2>Free local listings</h2>
              </div>

              <button type="button">Manage listings</button>
            </div>

            <div className="admin-ticket-list">
              {communityListings.map((listing) => (
                <article key={listing.id}>
                  <div>
                    <strong>{listing.title}</strong>
                    <span>
                      {listing.location} · {listing.schedule}
                    </span>
                  </div>

                  <small className="ticket-normal">
                    {listing.status}
                  </small>
                </article>
              ))}
            </div>

            <p>
              Ready Market provides a small free space for approved farmers
              markets and food-related community events.
            </p>
          </article>
        </section>

        <section className="admin-bottom-grid">
          <article className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Customer Support</span>
                <h2>Open support tickets</h2>
              </div>

              <button type="button">View all</button>
            </div>

            <div className="admin-ticket-list">
              {supportTickets.map((ticket) => (
                <article key={ticket.id}>
                  <div>
                    <strong>{ticket.issue}</strong>
                    <span>
                      {ticket.id} · {ticket.store}
                    </span>
                  </div>

                  <small
                    className={
                      ticket.priority === "Urgent"
                        ? "ticket-urgent"
                        : "ticket-normal"
                    }
                  >
                    {ticket.priority}
                  </small>
                </article>
              ))}
            </div>
          </article>

          <article className="admin-panel admin-subscription-panel">
            <div className="admin-panel-heading">
              <div>
                <span>Subscriptions</span>
                <h2>Plan distribution</h2>
              </div>
            </div>

            <div className="subscription-row">
              <div>
                <span>Professional</span>
                <strong>2 stores</strong>
              </div>

              <small>50%</small>
            </div>

            <div className="subscription-progress">
              <span style={{ width: "50%" }} />
            </div>

            <div className="subscription-row">
              <div>
                <span>Starter</span>
                <strong>2 stores</strong>
              </div>

              <small>50%</small>
            </div>

            <div className="subscription-progress">
              <span style={{ width: "50%" }} />
            </div>
          </article>
        </section>
      </main>

      {announcementOpen && (
        <div className="announcement-overlay">
          <form
            className="announcement-modal"
            onSubmit={sendAnnouncement}
          >
            <button
              className="announcement-close"
              onClick={closeAnnouncement}
              type="button"
            >
              ×
            </button>

            {!announcementSent ? (
              <>
                <span>Platform Communication</span>
                <h2>Send an announcement</h2>

                <p>
                  This message will be displayed to every participating Ready
                  Market store.
                </p>

                <label>
                  Announcement title
                  <input
                    name="title"
                    onChange={handleAnnouncementChange}
                    placeholder="Example: Scheduled maintenance"
                    type="text"
                    value={announcement.title}
                  />
                </label>

                <label>
                  Message
                  <textarea
                    name="message"
                    onChange={handleAnnouncementChange}
                    placeholder="Write your message to store owners."
                    rows="5"
                    value={announcement.message}
                  />
                </label>

                <button
                  className="announcement-send-button"
                  type="submit"
                >
                  Send to All Stores
                </button>
              </>
            ) : (
              <div className="announcement-success">
                <span>✓</span>
                <h2>Announcement sent</h2>
                <p>
                  Your message has been delivered to all Ready Market store
                  dashboards.
                </p>

                <button onClick={closeAnnouncement} type="button">
                  Close
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;