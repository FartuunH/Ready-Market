import { useState } from "react";
import { Link } from "react-router-dom";
import "./OwnerDashboard.css";

const metrics = [
  { label: "Revenue", value: "$18,420", change: "+12.4%" },
  { label: "Orders", value: "438", change: "+8.1%" },
  { label: "Customers", value: "286", change: "+14.7%" },
  { label: "Low-stock items", value: "12", change: "Needs attention" },
];

const recentOrders = [
  {
    id: "#1048",
    customer: "Amina Hassan",
    method: "Pickup",
    total: "$48.72",
    status: "Ready",
  },
  {
    id: "#1047",
    customer: "Michael Johnson",
    method: "Delivery",
    total: "$82.15",
    status: "Processing",
  },
  {
    id: "#1046",
    customer: "Maria Garcia",
    method: "Pickup",
    total: "$31.40",
    status: "Completed",
  },
  {
    id: "#1045",
    customer: "James Brown",
    method: "Delivery",
    total: "$67.89",
    status: "Processing",
  },
];

const lowStockItems = [
  { name: "Fresh Avocados", stock: 6 },
  { name: "Whole Milk", stock: 8 },
  { name: "Farm Fresh Eggs", stock: 5 },
  { name: "Artisan Bread", stock: 4 },
];

function OwnerDashboard() {
  const [productModalOpen, setProductModalOpen] = useState(false);
const [products, setProducts] = useState([
  {
    id: 1,
    name: "Fresh Avocados",
    category: "Fresh Produce",
    price: 1.49,
    stock: 24,
  },
  {
    id: 2,
    name: "Whole Milk",
    category: "Dairy & Eggs",
    price: 4.19,
    stock: 8,
  },
  {
    id: 3,
    name: "Artisan Bread",
    category: "Bakery",
    price: 4.99,
    stock: 4,
  },
]);

const [newProduct, setNewProduct] = useState({
  name: "",
  category: "Fresh Produce",
  price: "",
  stock: "",
});

const handleProductChange = (event) => {
  const { name, value } = event.target;

  setNewProduct((currentProduct) => ({
    ...currentProduct,
    [name]: value,
  }));
};

const addProduct = (event) => {
  event.preventDefault();

  if (!newProduct.name || !newProduct.price || !newProduct.stock) {
    return;
  }

  setProducts((currentProducts) => [
    ...currentProducts,
    {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
    },
  ]);

  setNewProduct({
    name: "",
    category: "Fresh Produce",
    price: "",
    stock: "",
  });

  setProductModalOpen(false);
};
  return (
    <div className="owner-dashboard">
      <aside className="owner-sidebar">
        <Link className="owner-logo" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Merchant Portal</small>
          </div>
        </Link>

        <nav>
          <button className="sidebar-active" type="button">
            Dashboard
          </button>
          <Link to="/merchant-orders">Orders</Link>
          <Link to="/merchant-products">Products</Link>
         <Link to="/merchant-inventory">Inventory</Link>
          <Link to="/merchant-customers">Customers</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
          <Link to="/merchant-drivers">Drivers</Link>
        </nav>

        <div className="sidebar-store">
          <small>Current store</small>
          <strong>Neighborhood Fresh Market</strong>
          <span>St. Cloud, Minnesota</span>
        </div>
      </aside>

      <main className="owner-main">
        <header className="owner-header">
          <div>
            <span>Sunday, August 2, 2026</span>
            <h1>Good evening, store owner.</h1>
            <p>Here is what is happening in your store today.</p>
          </div>

          <div className="owner-header-actions">
            <Link to="/shop">View Store</Link>
           <div className="product-panel-actions">
  <Link to="/merchant-products">
    Manage Products
  </Link>

  <button
    onClick={() => setProductModalOpen(true)}
    type="button"
  >
    Add Product
  </button>
</div>
          </div>
        </header>

        <section className="owner-metric-grid">
          {metrics.map((metric) => (
            <article key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.change}</small>
            </article>
          ))}
        </section>

        <section className="owner-dashboard-grid">
          <article className="dashboard-panel sales-panel">
            <div className="panel-heading">
              <div>
                <span>Performance</span>
                <h2>Weekly sales</h2>
              </div>

              <select defaultValue="7">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>

            <div className="sales-chart">
              {[44, 63, 52, 79, 61, 91, 73].map((height, index) => (
                <div className="sales-bar-column" key={index}>
                  <span style={{ height: `${height}%` }} />
                  <small>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                  </small>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel fulfillment-panel">
            <div className="panel-heading">
              <div>
                <span>Fulfillment</span>
                <h2>Order types</h2>
              </div>
            </div>

            <div className="fulfillment-stats">
              <div>
                <span>Pickup</span>
                <strong>64%</strong>
              </div>

              <div>
                <span>Delivery</span>
                <strong>36%</strong>
              </div>
            </div>

            <div className="fulfillment-progress">
              <span />
            </div>

            <p>
              Pickup continues to be the most popular fulfillment option this
              week.
            </p>
          </article>
        </section>

        <section className="owner-bottom-grid">
          <section className="dashboard-panel product-management-panel">
  <div className="panel-heading">
    <div>
      <span>Catalog</span>
      <h2>Store products</h2>
    </div>

    <button
      onClick={() => setProductModalOpen(true)}
      type="button"
    >
      Add product
    </button>
  </div>

  <div className="product-management-table">
    <div className="product-management-header">
      <span>Product</span>
      <span>Category</span>
      <span>Price</span>
      <span>Stock</span>
      <span>Status</span>
    </div>

    {products.map((product) => (
      <div className="product-management-row" key={product.id}>
        <strong>{product.name}</strong>
        <span>{product.category}</span>
        <span>${product.price.toFixed(2)}</span>
        <span>{product.stock}</span>

        <small
          className={
            product.stock <= 8
              ? "product-stock-low"
              : "product-stock-good"
          }
        >
          {product.stock <= 8 ? "Low stock" : "Available"}
        </small>
      </div>
    ))}
  </div>
</section>
          <article className="dashboard-panel orders-panel">
            <div className="panel-heading">
              <div>
                <span>Operations</span>
                <h2>Recent orders</h2>
              </div>

              <Link to="/merchant-orders">View all</Link>
            </div>

            <div className="orders-table">
              <div className="orders-table-header">
                <span>Order</span>
                <span>Customer</span>
                <span>Method</span>
                <span>Total</span>
                <span>Status</span>
              </div>

              {recentOrders.map((order) => (
                <div className="orders-table-row" key={order.id}>
                  <strong>{order.id}</strong>
                  <span>{order.customer}</span>
                  <span>{order.method}</span>
                  <span>{order.total}</span>
                  <small className={`status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </small>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-panel inventory-panel">
            <div className="panel-heading">
              <div>
                <span>Inventory</span>
                <h2>Low-stock alerts</h2>
              </div>

              <Link to="/merchant-inventory">Manage</Link>
            </div>

            <div className="inventory-list">
              {lowStockItems.map((item) => (
                <div key={item.name}>
                  <span>{item.name}</span>
                  <strong>{item.stock} left</strong>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>

      {productModalOpen && (
  <div className="product-modal-overlay">
    <form className="product-modal" onSubmit={addProduct}>
      <button
        className="product-modal-close"
        onClick={() => setProductModalOpen(false)}
        type="button"
      >
        ×
      </button>

      <span>Product catalog</span>
      <h2>Add a new product</h2>

      <label>
        Product name
        <input
          name="name"
          onChange={handleProductChange}
          placeholder="Example: Organic Apples"
          type="text"
          value={newProduct.name}
        />
      </label>

      <label>
        Category
        <select
          name="category"
          onChange={handleProductChange}
          value={newProduct.category}
        >
          <option>Fresh Produce</option>
          <option>Meat & Seafood</option>
          <option>Dairy & Eggs</option>
          <option>Bakery</option>
          <option>Pantry</option>
          <option>Beverages</option>
        </select>
      </label>

      <div className="product-modal-grid">
        <label>
          Price
          <input
            min="0"
            name="price"
            onChange={handleProductChange}
            placeholder="0.00"
            step="0.01"
            type="number"
            value={newProduct.price}
          />
        </label>

        <label>
          Stock quantity
          <input
            min="0"
            name="stock"
            onChange={handleProductChange}
            placeholder="0"
            type="number"
            value={newProduct.stock}
          />
        </label>
      </div>

      <button className="save-product-button" type="submit">
        Save Product
      </button>
    </form>
  </div>
)}
    </div>
  );
}

export default OwnerDashboard;