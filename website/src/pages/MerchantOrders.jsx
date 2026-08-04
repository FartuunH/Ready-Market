import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantOrders.css";

const initialOrders = [
  {
    id: "RM-1058",
    customer: "Sarah Johnson",
    phone: "(320) 555-1234",
    method: "Delivery",
    status: "Preparing",
    total: 44.6,
    address: "123 Oak Street, St. Cloud, MN",
    driver: "Ahmed Hassan",
    driverVehicle: "Silver Toyota Camry",
    driverEta: "6 minutes",
    notes: "Leave at the front door. Call upon arrival. No substitutions.",
    items: [
      { name: "Whole Milk", quantity: 1, price: 4.19 },
      { name: "Artisan Bread", quantity: 2, price: 4.99 },
      { name: "Farm Fresh Eggs", quantity: 1, price: 3.89 },
      { name: "Basmati Rice", quantity: 1, price: 14.99 },
    ],
    subtotal: 33.05,
    deliveryFee: 6.55,
    tip: 5,
    createdAt: "10:24 AM",
  },
  {
    id: "RM-1057",
    customer: "Michael Lee",
    phone: "(320) 555-8764",
    method: "Pickup",
    status: "Ready",
    total: 18.4,
    address: "Store pickup",
    driver: "Not required",
    driverVehicle: "—",
    driverEta: "—",
    notes: "Customer will arrive after 4:30 PM.",
    items: [
      { name: "Fresh Avocados", quantity: 4, price: 1.49 },
      { name: "Organic Bananas", quantity: 2, price: 2.29 },
      { name: "Orange Juice", quantity: 1, price: 5.49 },
    ],
    subtotal: 16.03,
    deliveryFee: 0,
    tip: 2.37,
    createdAt: "10:02 AM",
  },
  {
    id: "RM-1056",
    customer: "Ahmed Ali",
    phone: "(320) 555-4412",
    method: "Delivery",
    status: "On the Way",
    total: 31.2,
    address: "845 Division Street, St. Cloud, MN",
    driver: "Demo Driver",
    driverVehicle: "Blue Honda Accord",
    driverEta: "12 minutes",
    notes: "Ring the doorbell once.",
    items: [
      { name: "Fresh Salmon", quantity: 1, price: 12.99 },
      { name: "Whole Milk", quantity: 1, price: 4.19 },
      { name: "Farm Fresh Eggs", quantity: 1, price: 3.89 },
    ],
    subtotal: 21.07,
    deliveryFee: 7.13,
    tip: 3,
    createdAt: "9:46 AM",
  },
  {
    id: "RM-1055",
    customer: "Emily Brown",
    phone: "(320) 555-2298",
    method: "Pickup",
    status: "Completed",
    total: 27.8,
    address: "Store pickup",
    driver: "Not required",
    driverVehicle: "—",
    driverEta: "—",
    notes: "No customer notes.",
    items: [
      { name: "Basmati Rice", quantity: 1, price: 14.99 },
      { name: "Artisan Bread", quantity: 1, price: 4.99 },
      { name: "Organic Bananas", quantity: 1, price: 2.29 },
    ],
    subtotal: 22.27,
    deliveryFee: 0,
    tip: 5.53,
    createdAt: "9:18 AM",
  },
  {
    id: "RM-1054",
    customer: "Daniel Martinez",
    phone: "(320) 555-9134",
    method: "Delivery",
    status: "New",
    total: 51.95,
    address: "410 2nd Avenue North, Waite Park, MN",
    driver: "Unassigned",
    driverVehicle: "—",
    driverEta: "Waiting",
    notes: "Please call if any produce is unavailable.",
    items: [
      { name: "Fresh Salmon", quantity: 2, price: 12.99 },
      { name: "Fresh Avocados", quantity: 3, price: 1.49 },
      { name: "Orange Juice", quantity: 2, price: 5.49 },
    ],
    subtotal: 41.43,
    deliveryFee: 7.52,
    tip: 3,
    createdAt: "8:54 AM",
  },
  {
    id: "RM-1053",
    customer: "Mary Thompson",
    phone: "(320) 555-6671",
    method: "Pickup",
    status: "Cancelled",
    total: 12.67,
    address: "Store pickup",
    driver: "Not required",
    driverVehicle: "—",
    driverEta: "—",
    notes: "Customer cancelled before preparation.",
    items: [
      { name: "Whole Milk", quantity: 1, price: 4.19 },
      { name: "Farm Fresh Eggs", quantity: 1, price: 3.89 },
    ],
    subtotal: 8.08,
    deliveryFee: 0,
    tip: 4.59,
    createdAt: "8:22 AM",
  },
];

const filters = [
  "All",
  "New",
  "Pickup",
  "Delivery",
  "Preparing",
  "Ready",
  "On the Way",
  "Completed",
  "Cancelled",
];

function MerchantOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(
    initialOrders[0].id,
  );

  const selectedOrder = orders.find(
    (order) => order.id === selectedOrderId,
  );

  const visibleOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        normalizedSearch === "" ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.customer.toLowerCase().includes(normalizedSearch) ||
        order.status.toLowerCase().includes(normalizedSearch) ||
        order.method.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "All" ||
        order.status === selectedFilter ||
        order.method === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, selectedFilter]);

  const updateOrderStatus = (orderId, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    );
  };

  const assignDriver = (orderId) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              driver: "Ahmed Hassan",
              driverVehicle: "Silver Toyota Camry",
              driverEta: "8 minutes",
              status:
                order.status === "New" ? "Preparing" : order.status,
            }
          : order,
      ),
    );
  };

  const summary = {
    total: orders.length,
    newOrders: orders.filter((order) => order.status === "New").length,
    preparing: orders.filter(
      (order) => order.status === "Preparing",
    ).length,
    delivery: orders.filter(
      (order) => order.method === "Delivery",
    ).length,
    completed: orders.filter(
      (order) => order.status === "Completed",
    ).length,
    cancelled: orders.filter(
      (order) => order.status === "Cancelled",
    ).length,
  };

  const statusClass = (status) =>
    `merchant-order-status merchant-status-${status
      .toLowerCase()
      .replaceAll(" ", "-")}`;

  return (
    <div className="merchant-orders-page">
      <aside className="merchant-orders-sidebar">
        <Link className="merchant-orders-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Merchant Console</small>
          </div>
        </Link>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link className="merchant-sidebar-active" to="/merchant-orders">
            Orders
          </Link>
          <button type="button">Products</button>
          <Link to="/merchant-inventory">Inventory</Link>
          <Link to="/merchant-customers">Customers</Link>
          <Link to="/merchant-drivers">Drivers</Link>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="merchant-store-profile">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-orders-main">
        <header className="merchant-orders-header">
          <div>
            <span>Merchant Operations</span>
            <h1>Orders Management</h1>

            <p>
              Monitor incoming orders, preparation status, pickup, and
              delivery progress.
            </p>
          </div>

          <div className="merchant-orders-header-actions">
            <button type="button">Print Daily Summary</button>

            <Link to="/shop">
              Open Customer Store
            </Link>
          </div>
        </header>

        <section className="merchant-order-metrics">
          <article>
            <span>Total Orders</span>
            <strong>{summary.total}</strong>
            <small>Sample orders today</small>
          </article>

          <article>
            <span>New Orders</span>
            <strong>{summary.newOrders}</strong>
            <small>Waiting for acceptance</small>
          </article>

          <article>
            <span>Preparing</span>
            <strong>{summary.preparing}</strong>
            <small>Currently in progress</small>
          </article>

          <article>
            <span>Delivery</span>
            <strong>{summary.delivery}</strong>
            <small>Delivery orders</small>
          </article>

          <article>
            <span>Completed</span>
            <strong>{summary.completed}</strong>
            <small>Finished today</small>
          </article>

          <article>
            <span>Cancelled</span>
            <strong>{summary.cancelled}</strong>
            <small>Needs review</small>
          </article>
        </section>

        <section className="merchant-order-workspace">
          <div className="merchant-order-list-panel">
            <div className="merchant-order-toolbar">
              <div>
                <span>Today’s Orders</span>
                <h2>Order queue</h2>
              </div>

              <input
                aria-label="Search orders"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, customer, status..."
                type="search"
                value={search}
              />
            </div>

            <div className="merchant-order-filters">
              {filters.map((filter) => (
                <button
                  className={
                    selectedFilter === filter
                      ? "merchant-filter-active"
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

            <div className="merchant-orders-table-wrapper">
              <table className="merchant-orders-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleOrders.map((order) => (
                    <tr
                      className={
                        selectedOrderId === order.id
                          ? "merchant-order-row-selected"
                          : ""
                      }
                      key={order.id}
                    >
                      <td>
                        <strong>{order.id}</strong>
                        <small>{order.createdAt}</small>
                      </td>

                      <td>
                        <strong>{order.customer}</strong>
                        <small>{order.phone}</small>
                      </td>

                      <td>{order.method}</td>

                      <td>
                        <span className={statusClass(order.status)}>
                          {order.status}
                        </span>
                      </td>

                      <td>
                        <strong>${order.total.toFixed(2)}</strong>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            setSelectedOrderId(order.id)
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

              {visibleOrders.length === 0 && (
                <div className="merchant-orders-empty">
                  <strong>No orders found</strong>
                  <p>
                    Try another search term or change the selected filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {selectedOrder && (
            <aside className="merchant-order-details">
              <div className="merchant-order-details-heading">
                <div>
                  <span>Selected Order</span>
                  <h2>{selectedOrder.id}</h2>
                </div>

                <span className={statusClass(selectedOrder.status)}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="merchant-order-customer">
                <article>
                  <span>Customer</span>
                  <strong>{selectedOrder.customer}</strong>
                  <small>{selectedOrder.phone}</small>
                </article>

                <article>
                  <span>Method</span>
                  <strong>{selectedOrder.method}</strong>
                  <small>{selectedOrder.address}</small>
                </article>
              </div>

              <section className="merchant-order-items">
                <div>
                  <span>Order Items</span>
                  <strong>{selectedOrder.items.length} products</strong>
                </div>

                {selectedOrder.items.map((item) => (
                  <article key={item.name}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>Quantity: {item.quantity}</small>
                    </div>

                    <strong>
                      ${(item.price * item.quantity).toFixed(2)}
                    </strong>
                  </article>
                ))}
              </section>

              <section className="merchant-order-financials">
                <p>
                  <span>Subtotal</span>
                  <strong>${selectedOrder.subtotal.toFixed(2)}</strong>
                </p>

                <p>
                  <span>Delivery Fee</span>
                  <strong>
                    ${selectedOrder.deliveryFee.toFixed(2)}
                  </strong>
                </p>

                <p>
                  <span>Customer Tip</span>
                  <strong>${selectedOrder.tip.toFixed(2)}</strong>
                </p>

                <p className="merchant-order-total">
                  <span>Total</span>
                  <strong>${selectedOrder.total.toFixed(2)}</strong>
                </p>
              </section>

              <section className="merchant-driver-information">
                <span>Driver Information</span>

                <div>
                  <strong>{selectedOrder.driver}</strong>
                  <small>{selectedOrder.driverVehicle}</small>
                  <small>
                    Estimated arrival: {selectedOrder.driverEta}
                  </small>
                </div>
              </section>

              <section className="merchant-customer-notes">
                <span>Customer Notes</span>
                <p>{selectedOrder.notes}</p>
              </section>

              <section className="merchant-order-timeline">
                <span>Order Timeline</span>

                {[
                  "Order Received",
                  "Store Accepted",
                  "Preparing",
                  "Ready",
                  "Driver Assigned",
                  "Completed",
                ].map((step, index) => (
                  <div key={step}>
                    <span>{index + 1}</span>
                    <strong>{step}</strong>
                  </div>
                ))}
              </section>

              <div className="merchant-order-actions">
                {selectedOrder.status === "New" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(
                        selectedOrder.id,
                        "Preparing",
                      )
                    }
                    type="button"
                  >
                    Accept Order
                  </button>
                )}

                {selectedOrder.status === "Preparing" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "Ready")
                    }
                    type="button"
                  >
                    Mark Ready
                  </button>
                )}

                {selectedOrder.method === "Delivery" &&
                  selectedOrder.driver === "Unassigned" && (
                    <button
                      onClick={() => assignDriver(selectedOrder.id)}
                      type="button"
                    >
                      Assign Driver
                    </button>
                  )}

                {selectedOrder.status !== "Completed" &&
                  selectedOrder.status !== "Cancelled" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          selectedOrder.id,
                          "Completed",
                        )
                      }
                      type="button"
                    >
                      Complete Order
                    </button>
                  )}

                <button type="button">Print Receipt</button>

                {selectedOrder.status !== "Cancelled" &&
                  selectedOrder.status !== "Completed" && (
                    <button
                      className="merchant-order-cancel"
                      onClick={() =>
                        updateOrderStatus(
                          selectedOrder.id,
                          "Cancelled",
                        )
                      }
                      type="button"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>

              <small className="merchant-demo-disclosure">
                Demonstration orders and values are illustrative.
              </small>
            </aside>
          )}
        </section>
      </main>
    </div>
  );
}

export default MerchantOrders;