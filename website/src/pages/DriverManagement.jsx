import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./DriverManagement.css";

const initialDrivers = [
  {
    id: "DRV-1001",
    name: "Ahmed Hassan",
    initials: "AH",
    email: "ahmed@example.com",
    phone: "(320) 555-1024",
    status: "Online",
    approval: "Approved",
    vehicle: "Silver Toyota Camry",
    plate: "ABC-123",
    rating: 4.9,
    deliveries: 328,
    todayDeliveries: 8,
    todayEarnings: 148.25,
    weeklyEarnings: 742.4,
    monthlyEarnings: 2940.8,
    acceptanceRate: 98,
    onTimeRate: 97,
    currentOrder: "RM-1058",
    currentStore: "Neighborhood Fresh Market",
    currentCustomer: "Sarah Johnson",
    eta: "6 minutes",
    license: "Verified",
    insurance: "Verified",
    registration: "Verified",
    backgroundCheck: "Verified",
  },
  {
    id: "DRV-1002",
    name: "Fatima Ali",
    initials: "FA",
    email: "fatima@example.com",
    phone: "(320) 555-2241",
    status: "Busy",
    approval: "Approved",
    vehicle: "Blue Honda Accord",
    plate: "MNX-248",
    rating: 4.8,
    deliveries: 214,
    todayDeliveries: 6,
    todayEarnings: 112.8,
    weeklyEarnings: 631.25,
    monthlyEarnings: 2518.4,
    acceptanceRate: 95,
    onTimeRate: 96,
    currentOrder: "RM-1056",
    currentStore: "Fresh Foods",
    currentCustomer: "Michael Lee",
    eta: "12 minutes",
    license: "Verified",
    insurance: "Verified",
    registration: "Verified",
    backgroundCheck: "Verified",
  },
  {
    id: "DRV-1003",
    name: "Mohamed Noor",
    initials: "MN",
    email: "mohamed@example.com",
    phone: "(320) 555-8842",
    status: "Online",
    approval: "Approved",
    vehicle: "Black Toyota Prius",
    plate: "KLM-441",
    rating: 4.9,
    deliveries: 184,
    todayDeliveries: 5,
    todayEarnings: 94.15,
    weeklyEarnings: 548.6,
    monthlyEarnings: 2205.5,
    acceptanceRate: 97,
    onTimeRate: 98,
    currentOrder: "Available",
    currentStore: "—",
    currentCustomer: "—",
    eta: "Ready for assignment",
    license: "Verified",
    insurance: "Verified",
    registration: "Verified",
    backgroundCheck: "Verified",
  },
  {
    id: "DRV-1004",
    name: "Asha Yusuf",
    initials: "AY",
    email: "asha@example.com",
    phone: "(320) 555-6621",
    status: "Offline",
    approval: "Approved",
    vehicle: "White Ford Escape",
    plate: "JTK-308",
    rating: 4.7,
    deliveries: 129,
    todayDeliveries: 0,
    todayEarnings: 0,
    weeklyEarnings: 418.9,
    monthlyEarnings: 1864.2,
    acceptanceRate: 92,
    onTimeRate: 95,
    currentOrder: "None",
    currentStore: "—",
    currentCustomer: "—",
    eta: "Offline",
    license: "Verified",
    insurance: "Verified",
    registration: "Verified",
    backgroundCheck: "Verified",
  },
  {
    id: "DRV-1005",
    name: "Omar Ibrahim",
    initials: "OI",
    email: "omar@example.com",
    phone: "(320) 555-7702",
    status: "Pending",
    approval: "Pending",
    vehicle: "Gray Nissan Altima",
    plate: "PQR-721",
    rating: 0,
    deliveries: 0,
    todayDeliveries: 0,
    todayEarnings: 0,
    weeklyEarnings: 0,
    monthlyEarnings: 0,
    acceptanceRate: 0,
    onTimeRate: 0,
    currentOrder: "Not available",
    currentStore: "—",
    currentCustomer: "—",
    eta: "Awaiting approval",
    license: "Submitted",
    insurance: "Submitted",
    registration: "Submitted",
    backgroundCheck: "Pending",
  },
  {
    id: "DRV-1006",
    name: "Layla Ahmed",
    initials: "LA",
    email: "layla@example.com",
    phone: "(320) 555-3378",
    status: "Suspended",
    approval: "Suspended",
    vehicle: "Red Hyundai Sonata",
    plate: "RST-619",
    rating: 4.5,
    deliveries: 86,
    todayDeliveries: 0,
    todayEarnings: 0,
    weeklyEarnings: 214.35,
    monthlyEarnings: 975.6,
    acceptanceRate: 81,
    onTimeRate: 88,
    currentOrder: "None",
    currentStore: "—",
    currentCustomer: "—",
    eta: "Account suspended",
    license: "Verified",
    insurance: "Expired",
    registration: "Verified",
    backgroundCheck: "Verified",
  },
];

const filters = [
  "All",
  "Online",
  "Busy",
  "Offline",
  "Pending",
  "Suspended",
];

function DriverManagement() {
  const [drivers, setDrivers] = useState(initialDrivers);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedDriverId, setSelectedDriverId] = useState(
    initialDrivers[0].id,
  );
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState("RM-1062");

  const visibleDrivers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return drivers.filter((driver) => {
      const matchesSearch =
        normalizedSearch === "" ||
        driver.name.toLowerCase().includes(normalizedSearch) ||
        driver.email.toLowerCase().includes(normalizedSearch) ||
        driver.phone.toLowerCase().includes(normalizedSearch) ||
        driver.vehicle.toLowerCase().includes(normalizedSearch) ||
        driver.id.toLowerCase().includes(normalizedSearch);

      const matchesFilter =
        selectedFilter === "All" ||
        driver.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [drivers, search, selectedFilter]);

  const selectedDriver = drivers.find(
    (driver) => driver.id === selectedDriverId,
  );

  const summary = {
    online: drivers.filter((driver) => driver.status === "Online")
      .length,
    busy: drivers.filter((driver) => driver.status === "Busy").length,
    pending: drivers.filter((driver) => driver.status === "Pending")
      .length,
    completed: drivers.reduce(
      (total, driver) => total + driver.todayDeliveries,
      0,
    ),
    earnings: drivers.reduce(
      (total, driver) => total + driver.todayEarnings,
      0,
    ),
  };

  const updateDriver = (driverId, updates) => {
    setDrivers((currentDrivers) =>
      currentDrivers.map((driver) =>
        driver.id === driverId
          ? {
              ...driver,
              ...updates,
            }
          : driver,
      ),
    );
  };

  const approveDriver = (driverId) => {
    updateDriver(driverId, {
      status: "Online",
      approval: "Approved",
      backgroundCheck: "Verified",
    });
  };

  const rejectDriver = (driverId) => {
    updateDriver(driverId, {
      status: "Suspended",
      approval: "Rejected",
    });
  };

  const suspendDriver = (driverId) => {
    updateDriver(driverId, {
      status: "Suspended",
      approval: "Suspended",
      currentOrder: "None",
      currentStore: "—",
      currentCustomer: "—",
      eta: "Account suspended",
    });
  };

  const reactivateDriver = (driverId) => {
    updateDriver(driverId, {
      status: "Online",
      approval: "Approved",
      eta: "Ready for assignment",
    });
  };

  const assignOrder = (event) => {
    event.preventDefault();

    updateDriver(selectedDriverId, {
      status: "Busy",
      currentOrder: selectedOrder,
      currentStore: "Neighborhood Fresh Market",
      currentCustomer: "Demo Customer",
      eta: "9 minutes",
    });

    setAssignmentOpen(false);
  };

  const statusClass = (status) =>
    `driver-management-status driver-management-status-${status
      .toLowerCase()
      .replaceAll(" ", "-")}`;

  const verificationClass = (status) =>
    status === "Verified"
      ? "driver-document-verified"
      : status === "Expired"
        ? "driver-document-expired"
        : "driver-document-pending";

  return (
    <div className="driver-management-page">
      <aside className="driver-management-sidebar">
        <Link className="driver-management-brand" to="/">
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

          <Link
            className="driver-management-nav-active"
            to="/merchant-drivers"
          >
            Drivers
          </Link>

          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="driver-management-store">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="driver-management-main">
        <header className="driver-management-header">
          <div>
            <span>Delivery Operations</span>
            <h1>Driver Management</h1>

            <p>
              Review driver availability, verification, earnings,
              performance, and active assignments.
            </p>
          </div>

          <div className="driver-management-header-actions">
            <Link to="/driver-signup">Driver Application</Link>
            <Link to="/driver">Open Driver Portal</Link>
          </div>
        </header>

        <section className="driver-management-metrics">
          <article>
            <span>Online Drivers</span>
            <strong>{summary.online}</strong>
            <small>Available for delivery</small>
          </article>

          <article>
            <span>Busy Drivers</span>
            <strong>{summary.busy}</strong>
            <small>Currently assigned</small>
          </article>

          <article>
            <span>Pending Approval</span>
            <strong>{summary.pending}</strong>
            <small>Applications to review</small>
          </article>

          <article>
            <span>Completed Today</span>
            <strong>{summary.completed}</strong>
            <small>Illustrative deliveries</small>
          </article>

          <article>
            <span>Driver Earnings</span>
            <strong>${summary.earnings.toFixed(2)}</strong>
            <small>Estimated earnings today</small>
          </article>
        </section>

        <section className="driver-management-workspace">
          <div className="driver-management-list-panel">
            <div className="driver-management-toolbar">
              <div>
                <span>Driver Directory</span>
                <h2>Delivery workforce</h2>
              </div>

              <input
                aria-label="Search drivers"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search driver, vehicle, phone, or ID..."
                type="search"
                value={search}
              />
            </div>

            <div className="driver-management-filters">
              {filters.map((filter) => (
                <button
                  className={
                    selectedFilter === filter
                      ? "driver-management-filter-active"
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

            <div className="driver-management-table-wrapper">
              <table className="driver-management-table">
                <thead>
                  <tr>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Vehicle</th>
                    <th>Rating</th>
                    <th>Deliveries</th>
                    <th>Today</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleDrivers.map((driver) => (
                    <tr
                      className={
                        selectedDriverId === driver.id
                          ? "driver-management-row-selected"
                          : ""
                      }
                      key={driver.id}
                    >
                      <td>
                        <div className="driver-table-profile">
                          <span>{driver.initials}</span>

                          <div>
                            <strong>{driver.name}</strong>
                            <small>{driver.id}</small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={statusClass(driver.status)}>
                          {driver.status}
                        </span>
                      </td>

                      <td>
                        <strong>{driver.vehicle}</strong>
                        <small>{driver.plate}</small>
                      </td>

                      <td>
                        {driver.rating > 0
                          ? `${driver.rating.toFixed(1)} ★`
                          : "New"}
                      </td>

                      <td>{driver.deliveries}</td>

                      <td>
                        <strong>
                          ${driver.todayEarnings.toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            setSelectedDriverId(driver.id)
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

              {visibleDrivers.length === 0 && (
                <div className="driver-management-empty">
                  <strong>No drivers found</strong>
                  <p>Change the search or selected filter.</p>
                </div>
              )}
            </div>
          </div>

          {selectedDriver && (
            <aside className="driver-management-details">
              <div className="driver-details-profile">
                <div className="driver-details-avatar">
                  {selectedDriver.initials}
                </div>

                <div>
                  <span>Driver Profile</span>
                  <h2>{selectedDriver.name}</h2>
                  <small>{selectedDriver.id}</small>
                </div>

                <span className={statusClass(selectedDriver.status)}>
                  {selectedDriver.status}
                </span>
              </div>

              <section className="driver-contact-grid">
                <article>
                  <span>Phone</span>
                  <strong>{selectedDriver.phone}</strong>
                </article>

                <article>
                  <span>Email</span>
                  <strong>{selectedDriver.email}</strong>
                </article>
              </section>

              <section className="driver-vehicle-card">
                <span>Vehicle</span>
                <strong>{selectedDriver.vehicle}</strong>
                <p>License plate: {selectedDriver.plate}</p>
              </section>

              <section className="driver-performance-grid">
                <article>
                  <span>Rating</span>
                  <strong>
                    {selectedDriver.rating > 0
                      ? `${selectedDriver.rating.toFixed(1)} ★`
                      : "New"}
                  </strong>
                </article>

                <article>
                  <span>Deliveries</span>
                  <strong>{selectedDriver.deliveries}</strong>
                </article>

                <article>
                  <span>Acceptance</span>
                  <strong>
                    {selectedDriver.acceptanceRate}%
                  </strong>
                </article>

                <article>
                  <span>On Time</span>
                  <strong>{selectedDriver.onTimeRate}%</strong>
                </article>
              </section>

              <section className="driver-current-assignment">
                <div>
                  <span>Current Assignment</span>
                  <strong>{selectedDriver.currentOrder}</strong>
                </div>

                <div className="driver-assignment-route">
                  <article>
                    <span>Store</span>
                    <strong>{selectedDriver.currentStore}</strong>
                  </article>

                  <span>→</span>

                  <article>
                    <span>Customer</span>
                    <strong>{selectedDriver.currentCustomer}</strong>
                  </article>
                </div>

                <p>Estimated arrival: {selectedDriver.eta}</p>
              </section>

              <section className="driver-earnings-card">
                <span>Driver Earnings</span>

                <div>
                  <article>
                    <small>Today</small>
                    <strong>
                      ${selectedDriver.todayEarnings.toFixed(2)}
                    </strong>
                  </article>

                  <article>
                    <small>This Week</small>
                    <strong>
                      ${selectedDriver.weeklyEarnings.toFixed(2)}
                    </strong>
                  </article>

                  <article>
                    <small>This Month</small>
                    <strong>
                      ${selectedDriver.monthlyEarnings.toFixed(2)}
                    </strong>
                  </article>
                </div>
              </section>

              <section className="driver-documents-card">
                <span>Verification Documents</span>

                {[
                  ["Driver License", selectedDriver.license],
                  ["Insurance", selectedDriver.insurance],
                  ["Vehicle Registration", selectedDriver.registration],
                  [
                    "Background Check",
                    selectedDriver.backgroundCheck,
                  ],
                ].map(([label, status]) => (
                  <p key={label}>
                    <strong>{label}</strong>

                    <span className={verificationClass(status)}>
                      {status}
                    </span>
                  </p>
                ))}
              </section>

              <section className="driver-ai-recommendation">
                <span>Illustrative Demand Recommendation</span>

                <strong>
                  Higher delivery demand expected from 5 PM–7 PM.
                </strong>

                <p>
                  Consider keeping two additional drivers online to
                  reduce estimated customer wait times.
                </p>
              </section>

              <div className="driver-details-actions">
                {selectedDriver.approval === "Pending" && (
                  <>
                    <button
                      onClick={() =>
                        approveDriver(selectedDriver.id)
                      }
                      type="button"
                    >
                      Approve
                    </button>

                    <button
                      className="driver-action-danger"
                      onClick={() =>
                        rejectDriver(selectedDriver.id)
                      }
                      type="button"
                    >
                      Reject
                    </button>
                  </>
                )}

                {selectedDriver.status === "Online" && (
                  <button
                    onClick={() => setAssignmentOpen(true)}
                    type="button"
                  >
                    Assign Order
                  </button>
                )}

                {selectedDriver.status !== "Suspended" &&
                  selectedDriver.approval !== "Pending" && (
                    <button
                      className="driver-action-danger"
                      onClick={() =>
                        suspendDriver(selectedDriver.id)
                      }
                      type="button"
                    >
                      Suspend
                    </button>
                  )}

                {selectedDriver.status === "Suspended" && (
                  <button
                    onClick={() =>
                      reactivateDriver(selectedDriver.id)
                    }
                    type="button"
                  >
                    Reactivate
                  </button>
                )}

                <button type="button">Message</button>
              </div>

              <small className="driver-management-disclosure">
                Driver identities, earnings, verification records, and
                deliveries are demonstration data.
              </small>
            </aside>
          )}
        </section>

        <section className="driver-management-bottom-grid">
          <article className="driver-demand-panel">
            <div>
              <span>Delivery Demand</span>
              <h2>Today’s estimated activity</h2>
            </div>

            <div className="driver-demand-chart">
              {[32, 44, 51, 63, 72, 91, 84, 66].map(
                (height, index) => (
                  <article key={index}>
                    <span style={{ height: `${height}%` }} />
                    <small>
                      {
                        [
                          "10 AM",
                          "11 AM",
                          "12 PM",
                          "1 PM",
                          "3 PM",
                          "5 PM",
                          "6 PM",
                          "8 PM",
                        ][index]
                      }
                    </small>
                  </article>
                ),
              )}
            </div>
          </article>

          <article className="driver-map-demo">
            <span>Live Delivery Map</span>
            <h2>Illustrative route view</h2>

            <div className="driver-map-route">
              <article>
                <strong>Store</strong>
                <small>Neighborhood Fresh Market</small>
              </article>

              <span>→</span>

              <article>
                <strong>Driver</strong>
                <small>Current location</small>
              </article>

              <span>→</span>

              <article>
                <strong>Customer</strong>
                <small>Delivery destination</small>
              </article>
            </div>

            <p>
              Live mapping and navigation will be connected during the
              production phase.
            </p>
          </article>
        </section>
      </main>

      {assignmentOpen && selectedDriver && (
        <div className="driver-assignment-overlay">
          <form
            className="driver-assignment-modal"
            onSubmit={assignOrder}
          >
            <button
              className="driver-assignment-close"
              onClick={() => setAssignmentOpen(false)}
              type="button"
            >
              ×
            </button>

            <span>Order Assignment</span>
            <h2>Assign delivery to {selectedDriver.name}</h2>

            <label>
              Select order
              <select
                onChange={(event) =>
                  setSelectedOrder(event.target.value)
                }
                value={selectedOrder}
              >
                <option>RM-1062</option>
                <option>RM-1063</option>
                <option>RM-1064</option>
              </select>
            </label>

            <section>
              <p>
                <span>Store</span>
                <strong>Neighborhood Fresh Market</strong>
              </p>

              <p>
                <span>Estimated distance</span>
                <strong>6.2 miles</strong>
              </p>

              <p>
                <span>Estimated driver payout</span>
                <strong>$9.15</strong>
              </p>
            </section>

            <button type="submit">
              Confirm Assignment
            </button>

            <small>
              This assignment updates demonstration data only.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

export default DriverManagement;