import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./InventoryManagement.css";

const startingInventory = [
  {
    id: 1,
    name: "Whole Milk",
    sku: "MIL-003",
    category: "Dairy & Eggs",
    stock: 8,
    minimum: 20,
    maximum: 80,
    cost: 2.31,
    price: 4.19,
    supplier: "ABC Dairy",
    dailySales: 6,
    lastShipment: "3 days ago",
  },
  {
    id: 2,
    name: "Organic Bananas",
    sku: "BAN-002",
    category: "Fresh Produce",
    stock: 5,
    minimum: 25,
    maximum: 120,
    cost: 1.12,
    price: 2.29,
    supplier: "Fresh Produce Co.",
    dailySales: 12,
    lastShipment: "2 days ago",
  },
  {
    id: 3,
    name: "Farm Fresh Eggs",
    sku: "EGG-004",
    category: "Dairy & Eggs",
    stock: 22,
    minimum: 20,
    maximum: 90,
    cost: 2.05,
    price: 3.89,
    supplier: "Farm Fresh Foods",
    dailySales: 7,
    lastShipment: "Yesterday",
  },
  {
    id: 4,
    name: "Artisan Bread",
    sku: "BRD-005",
    category: "Bakery",
    stock: 18,
    minimum: 15,
    maximum: 60,
    cost: 2.74,
    price: 4.99,
    supplier: "Local Bakery",
    dailySales: 9,
    lastShipment: "Today",
  },
  {
    id: 5,
    name: "Fresh Avocados",
    sku: "AVO-001",
    category: "Fresh Produce",
    stock: 24,
    minimum: 18,
    maximum: 75,
    cost: 0.78,
    price: 1.49,
    supplier: "Fresh Produce Co.",
    dailySales: 8,
    lastShipment: "Yesterday",
  },
  {
    id: 6,
    name: "Fresh Salmon",
    sku: "SAL-006",
    category: "Meat & Seafood",
    stock: 0,
    minimum: 12,
    maximum: 45,
    cost: 8.15,
    price: 12.99,
    supplier: "North Shore Seafood",
    dailySales: 4,
    lastShipment: "5 days ago",
  },
  {
    id: 7,
    name: "Orange Juice",
    sku: "JUI-007",
    category: "Beverages",
    stock: 32,
    minimum: 16,
    maximum: 70,
    cost: 3.14,
    price: 5.49,
    supplier: "Midwest Beverages",
    dailySales: 5,
    lastShipment: "2 days ago",
  },
  {
    id: 8,
    name: "Basmati Rice",
    sku: "RIC-008",
    category: "Pantry",
    stock: 126,
    minimum: 30,
    maximum: 180,
    cost: 9.25,
    price: 14.99,
    supplier: "Global Foods",
    dailySales: 3,
    lastShipment: "4 days ago",
  },
];

const purchaseOrders = [
  {
    id: "PO-1008",
    supplier: "ABC Dairy",
    product: "Whole Milk",
    quantity: 60,
    status: "Pending",
  },
  {
    id: "PO-1007",
    supplier: "Farm Fresh Foods",
    product: "Farm Fresh Eggs",
    quantity: 48,
    status: "Delivered",
  },
  {
    id: "PO-1006",
    supplier: "Local Bakery",
    product: "Artisan Bread",
    quantity: 30,
    status: "Preparing",
  },
];

function InventoryManagement() {
  const [inventory, setInventory] = useState(startingInventory);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedItemId, setSelectedItemId] = useState(
    startingInventory[0].id,
  );
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState(20);

  const getStatus = (item) => {
    if (item.stock === 0) {
      return "Out of Stock";
    }

    if (item.stock <= item.minimum) {
      return "Low Stock";
    }

    return "Healthy";
  };

  const selectedItem = inventory.find(
    (item) => item.id === selectedItemId,
  );

  const visibleInventory = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return inventory.filter((item) => {
      const status = getStatus(item);

      const matchesSearch =
        normalizedSearch === "" ||
        item.name.toLowerCase().includes(normalizedSearch) ||
        item.sku.toLowerCase().includes(normalizedSearch) ||
        item.category.toLowerCase().includes(normalizedSearch) ||
        item.supplier.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inventory, search, statusFilter]);

  const inventoryValue = inventory.reduce(
    (total, item) => total + item.cost * item.stock,
    0,
  );

  const retailValue = inventory.reduce(
    (total, item) => total + item.price * item.stock,
    0,
  );

  const lowStockCount = inventory.filter(
    (item) => getStatus(item) === "Low Stock",
  ).length;

  const outOfStockCount = inventory.filter(
    (item) => getStatus(item) === "Out of Stock",
  ).length;

  const healthyCount = inventory.filter(
    (item) => getStatus(item) === "Healthy",
  ).length;

  const openRestock = (itemId) => {
    setSelectedItemId(itemId);
    setRestockQuantity(20);
    setRestockOpen(true);
  };

  const completeRestock = (event) => {
    event.preventDefault();

    setInventory((currentInventory) =>
      currentInventory.map((item) =>
        item.id === selectedItemId
          ? {
              ...item,
              stock: item.stock + Number(restockQuantity),
              lastShipment: "Today",
            }
          : item,
      ),
    );

    setRestockOpen(false);
  };

  const estimatedDaysRemaining = selectedItem
    ? Math.floor(
        selectedItem.stock /
          Math.max(selectedItem.dailySales, 1),
      )
    : 0;

  const grossMargin = selectedItem
    ? ((selectedItem.price - selectedItem.cost) /
        selectedItem.price) *
      100
    : 0;

  const statusClass = (status) =>
    `inventory-status inventory-status-${status
      .toLowerCase()
      .replaceAll(" ", "-")}`;

  return (
    <div className="inventory-page">
      <aside className="inventory-sidebar">
        <Link className="inventory-brand" to="/">
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

          <Link
            className="inventory-nav-active"
            to="/merchant-inventory"
          >
            Inventory
          </Link>

          <Link to="/merchant-customers">Customers</Link>
          <Link to="/merchant-drivers">Drivers</Link>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="inventory-store-card">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="inventory-main">
        <header className="inventory-header">
          <div>
            <span>Inventory Operations</span>
            <h1>Inventory Management</h1>

            <p>
              Monitor stock levels, suppliers, inventory value, and
              restocking needs.
            </p>
          </div>

          <div className="inventory-header-actions">
            <button type="button">Import CSV</button>
            <button type="button">Export Inventory</button>

            <Link to="/merchant-products">
              Add Product
            </Link>
          </div>
        </header>

        <section className="inventory-metrics">
          <article>
            <span>Inventory Cost Value</span>
            <strong>${inventoryValue.toFixed(2)}</strong>
            <small>Current wholesale value</small>
          </article>

          <article>
            <span>Retail Value</span>
            <strong>${retailValue.toFixed(2)}</strong>
            <small>Illustrative selling value</small>
          </article>

          <article>
            <span>Healthy Products</span>
            <strong>{healthyCount}</strong>
            <small>Stock above minimum</small>
          </article>

          <article>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
            <small>Needs attention</small>
          </article>

          <article>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
            <small>Immediate restock needed</small>
          </article>
        </section>

        <section className="inventory-workspace">
          <div className="inventory-list-panel">
            <div className="inventory-toolbar">
              <div>
                <span>Stock Directory</span>
                <h2>Store inventory</h2>
              </div>

              <div className="inventory-search-filters">
                <input
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search product, SKU, category, supplier..."
                  type="search"
                  value={search}
                />

                <select
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                  value={statusFilter}
                >
                  <option>All</option>
                  <option>Healthy</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="inventory-table-wrapper">
              <table className="inventory-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Stock</th>
                    <th>Minimum</th>
                    <th>Supplier</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleInventory.map((item) => {
                    const status = getStatus(item);

                    return (
                      <tr
                        className={
                          selectedItemId === item.id
                            ? "inventory-row-selected"
                            : ""
                        }
                        key={item.id}
                      >
                        <td>
                          <strong>{item.name}</strong>
                          <small>{item.category}</small>
                        </td>

                        <td>{item.sku}</td>
                        <td>
                          <strong>{item.stock}</strong>
                        </td>
                        <td>{item.minimum}</td>
                        <td>{item.supplier}</td>

                        <td>
                          <span className={statusClass(status)}>
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="inventory-table-actions">
                            <button
                              onClick={() =>
                                setSelectedItemId(item.id)
                              }
                              type="button"
                            >
                              View
                            </button>

                            <button
                              onClick={() => openRestock(item.id)}
                              type="button"
                            >
                              Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {visibleInventory.length === 0 && (
                <div className="inventory-empty-state">
                  <strong>No inventory items found</strong>
                  <p>Change your search or status filter.</p>
                </div>
              )}
            </div>
          </div>

          {selectedItem && (
            <aside className="inventory-details-panel">
              <div className="inventory-details-heading">
                <div>
                  <span>Product Details</span>
                  <h2>{selectedItem.name}</h2>
                  <small>{selectedItem.sku}</small>
                </div>

                <span
                  className={statusClass(getStatus(selectedItem))}
                >
                  {getStatus(selectedItem)}
                </span>
              </div>

              <section className="inventory-stock-summary">
                <article>
                  <span>Current Stock</span>
                  <strong>{selectedItem.stock}</strong>
                </article>

                <article>
                  <span>Minimum</span>
                  <strong>{selectedItem.minimum}</strong>
                </article>

                <article>
                  <span>Maximum</span>
                  <strong>{selectedItem.maximum}</strong>
                </article>

                <article>
                  <span>Days Remaining</span>
                  <strong>{estimatedDaysRemaining}</strong>
                </article>
              </section>

              <section className="inventory-financial-details">
                <p>
                  <span>Unit Cost</span>
                  <strong>${selectedItem.cost.toFixed(2)}</strong>
                </p>

                <p>
                  <span>Retail Price</span>
                  <strong>${selectedItem.price.toFixed(2)}</strong>
                </p>

                <p>
                  <span>Profit Per Unit</span>
                  <strong>
                    $
                    {(
                      selectedItem.price - selectedItem.cost
                    ).toFixed(2)}
                  </strong>
                </p>

                <p>
                  <span>Gross Margin</span>
                  <strong>{grossMargin.toFixed(1)}%</strong>
                </p>
              </section>

              <section className="inventory-supplier-panel">
                <span>Supplier</span>
                <strong>{selectedItem.supplier}</strong>
                <p>
                  Last shipment: {selectedItem.lastShipment}
                </p>
                <p>
                  Average daily sales: {selectedItem.dailySales}
                </p>

                <button
                  onClick={() => openRestock(selectedItem.id)}
                  type="button"
                >
                  Create Restock Order
                </button>
              </section>

              <section className="inventory-stock-chart">
                <span>Illustrative Stock Trend</span>

                <div>
                  {[82, 74, 68, 55, 47, 38, 26].map(
                    (height, index) => (
                      <article key={index}>
                        <span style={{ height: `${height}%` }} />
                        <small>
                          {
                            [
                              "Mon",
                              "Tue",
                              "Wed",
                              "Thu",
                              "Fri",
                              "Sat",
                              "Sun",
                            ][index]
                          }
                        </small>
                      </article>
                    ),
                  )}
                </div>
              </section>

              <section className="inventory-ai-panel">
                <span>Illustrative AI Recommendation</span>

                <strong>
                  {getStatus(selectedItem) === "Out of Stock"
                    ? "Immediate restocking recommended"
                    : getStatus(selectedItem) === "Low Stock"
                      ? "Product may run out soon"
                      : "Inventory level is currently healthy"}
                </strong>

                <p>
                  Based on sample sales velocity, minimum stock, and
                  current inventory levels.
                </p>
              </section>
            </aside>
          )}
        </section>

        <section className="inventory-bottom-grid">
          <article className="inventory-purchase-orders">
            <div>
              <span>Purchase Orders</span>
              <h2>Recent supplier orders</h2>
            </div>

            {purchaseOrders.map((order) => (
              <div className="inventory-po-row" key={order.id}>
                <strong>{order.id}</strong>

                <div>
                  <span>{order.product}</span>
                  <small>{order.supplier}</small>
                </div>

                <span>{order.quantity} units</span>
                <strong>{order.status}</strong>
              </div>
            ))}
          </article>

          <article className="inventory-health-card">
            <span>Inventory Health</span>
            <strong>94%</strong>
            <h2>Excellent</h2>

            <p>
              Most products are currently above their minimum stock
              level.
            </p>

            <div>
              <span>Healthy: {healthyCount}</span>
              <span>Low: {lowStockCount}</span>
              <span>Out: {outOfStockCount}</span>
            </div>
          </article>
        </section>
      </main>

      {restockOpen && selectedItem && (
        <div className="restock-overlay">
          <form
            className="restock-modal"
            onSubmit={completeRestock}
          >
            <button
              className="restock-close"
              onClick={() => setRestockOpen(false)}
              type="button"
            >
              ×
            </button>

            <span>Inventory Restock</span>
            <h2>Restock {selectedItem.name}</h2>

            <p>
              Current stock: <strong>{selectedItem.stock}</strong>
            </p>

            <label>
              Quantity received
              <input
                min="1"
                onChange={(event) =>
                  setRestockQuantity(event.target.value)
                }
                required
                type="number"
                value={restockQuantity}
              />
            </label>

            <button type="submit">
              Receive Inventory
            </button>

            <small>
              This updates demonstration inventory only.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

export default InventoryManagement;