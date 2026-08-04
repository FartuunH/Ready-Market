import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantCustomers.css";

const initialCustomers = [
  {
    id: 1,
    name: "Amina Hassan",
    email: "amina@example.com",
    phone: "(320) 555-1024",
    orders: 14,
    totalSpent: 486.72,
    averageOrder: 34.77,
    lastOrder: "August 2, 2026",
    fulfillment: "Pickup",
    status: "Loyal",
    rating: 5,
    notes: "Frequently purchases produce, dairy, and pantry items.",
  },
  {
    id: 2,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "(320) 555-2240",
    orders: 8,
    totalSpent: 292.16,
    averageOrder: 36.52,
    lastOrder: "August 2, 2026",
    fulfillment: "Delivery",
    status: "Returning",
    rating: 5,
    notes: "Usually selects evening delivery.",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria@example.com",
    phone: "(320) 555-3841",
    orders: 5,
    totalSpent: 181.4,
    averageOrder: 36.28,
    lastOrder: "August 1, 2026",
    fulfillment: "Pickup",
    status: "Returning",
    rating: 4,
    notes: "Often purchases bakery and fresh produce.",
  },
  {
    id: 4,
    name: "James Brown",
    email: "james@example.com",
    phone: "(320) 555-7748",
    orders: 2,
    totalSpent: 89.35,
    averageOrder: 44.68,
    lastOrder: "July 30, 2026",
    fulfillment: "Delivery",
    status: "New",
    rating: 5,
    notes: "New delivery customer.",
  },
  {
    id: 5,
    name: "Sarah Thompson",
    email: "sarah@example.com",
    phone: "(320) 555-4432",
    orders: 18,
    totalSpent: 712.9,
    averageOrder: 39.61,
    lastOrder: "August 2, 2026",
    fulfillment: "Delivery",
    status: "Loyal",
    rating: 5,
    notes: "High-value repeat customer. Prefers contactless delivery.",
  },
  {
    id: 6,
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    phone: "(320) 555-8821",
    orders: 6,
    totalSpent: 205.12,
    averageOrder: 34.19,
    lastOrder: "July 29, 2026",
    fulfillment: "Pickup",
    status: "Returning",
    rating: 4,
    notes: "Usually purchases meat, rice, and beverages.",
  },
];

const filters = ["All", "New", "Returning", "Loyal"];

function MerchantCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    initialCustomers[0].id,
  );
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState("");

  const visibleCustomers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        normalizedSearch === "" ||
        customer.name.toLowerCase().includes(normalizedSearch) ||
        customer.email.toLowerCase().includes(normalizedSearch) ||
        customer.phone.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "All" ||
        customer.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [customers, search, selectedFilter]);

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId,
  );

  const totalRevenue = customers.reduce(
    (total, customer) => total + customer.totalSpent,
    0,
  );

  const averageCustomerValue =
    customers.length > 0 ? totalRevenue / customers.length : 0;

  const loyalCustomers = customers.filter(
    (customer) => customer.status === "Loyal",
  ).length;

  const returningCustomers = customers.filter(
    (customer) =>
      customer.status === "Returning" ||
      customer.status === "Loyal",
  ).length;

  const returningRate =
    customers.length > 0
      ? Math.round(
          (returningCustomers / customers.length) * 100,
        )
      : 0;

  const updateCustomerStatus = (customerId, status) => {
    setCustomers((currentCustomers) =>
      currentCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, status }
          : customer,
      ),
    );
  };

  const submitMessage = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setMessage("");
    setMessageOpen(false);
  };

  const statusClass = (status) =>
    `merchant-customer-status merchant-customer-${status.toLowerCase()}`;

  return (
    <div className="merchant-customers-page">
      <aside className="merchant-customers-sidebar">
        <Link className="merchant-customers-brand" to="/">
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

          <Link
            className="merchant-customers-active"
            to="/merchant-customers"
          >
            Customers
          </Link>

          <Link to="/merchant-drivers">Drivers</Link>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="merchant-customers-store">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-customers-main">
        <header className="merchant-customers-header">
          <div>
            <span>Customer Relationships</span>
            <h1>Customers</h1>

            <p>
              Review customer activity, order history, spending, and
              loyalty.
            </p>
          </div>

          <div className="merchant-customers-header-actions">
            <button type="button">Export Customers</button>

            <button
              className="merchant-customer-message-button"
              onClick={() => setMessageOpen(true)}
              type="button"
            >
              Create Message
            </button>
          </div>
        </header>

        <section className="merchant-customer-metrics">
          <article>
            <span>Total Customers</span>
            <strong>{customers.length}</strong>
            <small>Illustrative customer profiles</small>
          </article>

          <article>
            <span>Returning Rate</span>
            <strong>{returningRate}%</strong>
            <small>Returning and loyal customers</small>
          </article>

          <article>
            <span>Loyal Customers</span>
            <strong>{loyalCustomers}</strong>
            <small>Highest engagement level</small>
          </article>

          <article>
            <span>Average Customer Value</span>
            <strong>${averageCustomerValue.toFixed(2)}</strong>
            <small>Average total spending</small>
          </article>
        </section>

        <section className="merchant-customer-workspace">
          <div className="merchant-customer-list-panel">
            <div className="merchant-customer-toolbar">
              <div>
                <span>Customer Directory</span>
                <h2>Store customers</h2>
              </div>

              <input
                aria-label="Search customers"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, or phone..."
                type="search"
                value={search}
              />
            </div>

            <div className="merchant-customer-filters">
              {filters.map((filter) => (
                <button
                  className={
                    selectedFilter === filter
                      ? "merchant-customer-filter-active"
                      : ""
                  }
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  type="button"
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="merchant-customers-table-wrapper">
              <table className="merchant-customers-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Last Order</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleCustomers.map((customer) => (
                    <tr
                      className={
                        selectedCustomerId === customer.id
                          ? "merchant-customer-row-selected"
                          : ""
                      }
                      key={customer.id}
                    >
                      <td>
                        <strong>{customer.name}</strong>
                        <small>{customer.email}</small>
                      </td>

                      <td>
                        <span className={statusClass(customer.status)}>
                          {customer.status}
                        </span>
                      </td>

                      <td>{customer.orders}</td>

                      <td>
                        <strong>
                          ${customer.totalSpent.toFixed(2)}
                        </strong>
                      </td>

                      <td>{customer.lastOrder}</td>

                      <td>
                        <button
                          onClick={() =>
                            setSelectedCustomerId(customer.id)
                          }
                          type="button"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {visibleCustomers.length === 0 && (
                <div className="merchant-customers-empty">
                  <strong>No customers found</strong>
                  <p>
                    Change your search term or selected filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedCustomer && (
            <aside className="merchant-customer-details">
              <div className="merchant-customer-profile-heading">
                <div className="merchant-customer-avatar">
                  {selectedCustomer.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div>
                  <span>Customer Profile</span>
                  <h2>{selectedCustomer.name}</h2>
                  <small>{selectedCustomer.email}</small>
                </div>
              </div>

              <div className="merchant-customer-contact">
                <article>
                  <span>Phone</span>
                  <strong>{selectedCustomer.phone}</strong>
                </article>

                <article>
                  <span>Preferred Method</span>
                  <strong>{selectedCustomer.fulfillment}</strong>
                </article>
              </div>

              <section className="merchant-customer-summary">
                <article>
                  <span>Total Orders</span>
                  <strong>{selectedCustomer.orders}</strong>
                </article>

                <article>
                  <span>Total Spent</span>
                  <strong>
                    ${selectedCustomer.totalSpent.toFixed(2)}
                  </strong>
                </article>

                <article>
                  <span>Average Order</span>
                  <strong>
                    ${selectedCustomer.averageOrder.toFixed(2)}
                  </strong>
                </article>

                <article>
                  <span>Rating</span>
                  <strong>
                    {"★".repeat(selectedCustomer.rating)}
                  </strong>
                </article>
              </section>

              <section className="merchant-customer-history">
                <div>
                  <span>Recent Order History</span>
                  <Link to="/merchant-orders">View Orders</Link>
                </div>

                <article>
                  <strong>RM-1058</strong>
                  <span>{selectedCustomer.fulfillment}</span>
                  <small>$42.60</small>
                </article>

                <article>
                  <strong>RM-1049</strong>
                  <span>Pickup</span>
                  <small>$31.25</small>
                </article>

                <article>
                  <strong>RM-1038</strong>
                  <span>Delivery</span>
                  <small>$38.90</small>
                </article>
              </section>

              <section className="merchant-customer-notes-panel">
                <span>Customer Notes</span>
                <p>{selectedCustomer.notes}</p>
              </section>

              <section className="merchant-customer-insight">
                <span>Illustrative Customer Insight</span>

                <strong>
                  {selectedCustomer.status === "Loyal"
                    ? "High-value repeat customer"
                    : selectedCustomer.status === "Returning"
                      ? "Growing customer relationship"
                      : "New customer opportunity"}
                </strong>

                <p>
                  These demo insights illustrate how Ready Market could
                  help merchants understand purchasing patterns and
                  customer engagement.
                </p>
              </section>

              <div className="merchant-customer-actions">
                <button
                  onClick={() => setMessageOpen(true)}
                  type="button"
                >
                  Send Message
                </button>

                <button
                  onClick={() =>
                    updateCustomerStatus(
                      selectedCustomer.id,
                      "Loyal",
                    )
                  }
                  type="button"
                >
                  Mark Loyal
                </button>

                <button type="button">
                  Create Coupon
                </button>
              </div>

              <small className="merchant-customer-disclosure">
                Customer profiles and values are demonstration data.
              </small>
            </aside>
          )}
        </section>
      </main>

      {messageOpen && (
        <div className="merchant-message-overlay">
          <form
            className="merchant-message-modal"
            onSubmit={submitMessage}
          >
            <button
              className="merchant-message-close"
              onClick={() => setMessageOpen(false)}
              type="button"
            >
              ×
            </button>

            <span>Customer Communication</span>

            <h2>Create a customer message</h2>

            <label>
              Recipient
              <input
                readOnly
                type="text"
                value={
                  selectedCustomer
                    ? selectedCustomer.name
                    : "Selected customers"
                }
              />
            </label>

            <label>
              Message
              <textarea
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Example: Fresh produce is available this weekend."
                required
                rows="6"
                value={message}
              />
            </label>

            <button
              className="merchant-send-message"
              type="submit"
            >
              Send Demo Message
            </button>

            <small>
              This demonstration does not send a real email or SMS.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

export default MerchantCustomers;