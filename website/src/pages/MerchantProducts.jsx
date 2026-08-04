import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantProducts.css";

const startingProducts = [
  {
    id: 1,
    name: "Fresh Avocados",
    sku: "AVO-001",
    category: "Fresh Produce",
    price: 1.49,
    stock: 24,
    status: "Available",
  },
  {
    id: 2,
    name: "Organic Bananas",
    sku: "BAN-002",
    category: "Fresh Produce",
    price: 2.29,
    stock: 5,
    status: "Available",
  },
  {
    id: 3,
    name: "Whole Milk",
    sku: "MIL-003",
    category: "Dairy & Eggs",
    price: 4.19,
    stock: 8,
    status: "Available",
  },
  {
    id: 4,
    name: "Farm Fresh Eggs",
    sku: "EGG-004",
    category: "Dairy & Eggs",
    price: 3.89,
    stock: 22,
    status: "Available",
  },
  {
    id: 5,
    name: "Artisan Bread",
    sku: "BRD-005",
    category: "Bakery",
    price: 4.99,
    stock: 4,
    status: "Available",
  },
  {
    id: 6,
    name: "Fresh Salmon",
    sku: "SAL-006",
    category: "Meat & Seafood",
    price: 12.99,
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: 7,
    name: "Orange Juice",
    sku: "JUI-007",
    category: "Beverages",
    price: 5.49,
    stock: 32,
    status: "Available",
  },
  {
    id: 8,
    name: "Basmati Rice",
    sku: "RIC-008",
    category: "Pantry",
    price: 14.99,
    stock: 126,
    status: "Available",
  },
];

const emptyProduct = {
  name: "",
  sku: "",
  category: "Fresh Produce",
  price: "",
  stock: "",
  status: "Available",
};

function MerchantProducts() {
  const [products, setProducts] = useState(startingProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState(emptyProduct);

  const categories = [
    "All",
    "Fresh Produce",
    "Meat & Seafood",
    "Dairy & Eggs",
    "Bakery",
    "Pantry",
    "Beverages",
  ];

  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        normalizedSearch === "" ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.sku.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 8,
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0,
  ).length;

  const totalInventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    setProductForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const openNewProductForm = () => {
    setEditingProductId(null);
    setProductForm(emptyProduct);
    setFormOpen(true);
  };

  const openEditForm = (product) => {
    setEditingProductId(product.id);

    setProductForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });

    setFormOpen(true);
  };

  const saveProduct = (event) => {
    event.preventDefault();

    if (
      !productForm.name ||
      !productForm.sku ||
      productForm.price === "" ||
      productForm.stock === ""
    ) {
      return;
    }

    const normalizedProduct = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      status:
        Number(productForm.stock) === 0
          ? "Out of Stock"
          : productForm.status,
    };

    if (editingProductId) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === editingProductId
            ? {
                ...product,
                ...normalizedProduct,
              }
            : product,
        ),
      );
    } else {
      setProducts((currentProducts) => [
        ...currentProducts,
        {
          id: Date.now(),
          ...normalizedProduct,
        },
      ]);
    }

    setFormOpen(false);
    setEditingProductId(null);
    setProductForm(emptyProduct);
  };

  const toggleAvailability = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? {
              ...product,
              status:
                product.status === "Available"
                  ? "Unavailable"
                  : product.stock === 0
                    ? "Out of Stock"
                    : "Available",
            }
          : product,
      ),
    );
  };

  const deleteProduct = (productId) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== productId,
      ),
    );
  };

  return (
    <div className="merchant-products-page">
      <aside className="merchant-products-sidebar">
        <Link className="merchant-products-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Merchant Console</small>
          </div>
        </Link>

        <nav>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/merchant-orders">Orders</Link>
          <Link
            className="merchant-products-active"
            to="/merchant-products"
          >
            Products
          </Link>
          <Link to="/merchant-inventory">Inventory</Link>
          <Link to="/merchant-customers">Customers</Link>
          <Link to="/merchant-drivers">Drivers</Link>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="merchant-products-store">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-products-main">
        <header className="merchant-products-header">
          <div>
            <span>Merchant Catalog</span>
            <h1>Products Management</h1>

            <p>
              Manage prices, inventory levels, categories, and product
              availability.
            </p>
          </div>

          <div className="merchant-products-header-actions">
            <button type="button">Import CSV</button>

            <button
              className="merchant-add-product"
              onClick={openNewProductForm}
              type="button"
            >
              + Add Product
            </button>
          </div>
        </header>

        <section className="merchant-product-metrics">
          <article>
            <span>Total Products</span>
            <strong>{products.length}</strong>
            <small>Active catalog items</small>
          </article>

          <article>
            <span>Low Stock</span>
            <strong>{lowStockCount}</strong>
            <small>Eight units or fewer</small>
          </article>

          <article>
            <span>Out of Stock</span>
            <strong>{outOfStockCount}</strong>
            <small>Needs attention</small>
          </article>

          <article>
            <span>Inventory Value</span>
            <strong>${totalInventoryValue.toFixed(2)}</strong>
            <small>Illustrative retail value</small>
          </article>
        </section>

        <section className="merchant-products-panel">
          <div className="merchant-products-toolbar">
            <input
              aria-label="Search products"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product name, SKU, or category..."
              type="search"
              value={search}
            />

            <select
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              value={categoryFilter}
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              value={statusFilter}
            >
              <option>All</option>
              <option>Available</option>
              <option>Unavailable</option>
              <option>Out of Stock</option>
            </select>
          </div>

          <div className="merchant-products-table-wrapper">
            <table className="merchant-products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.sku}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>

                    <td>
                      <strong
                        className={
                          product.stock === 0
                            ? "merchant-product-stock-out"
                            : product.stock <= 8
                              ? "merchant-product-stock-low"
                              : "merchant-product-stock-good"
                        }
                      >
                        {product.stock}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`merchant-product-status merchant-product-${product.status
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {product.status}
                      </span>
                    </td>

                    <td>
                      <div className="merchant-product-actions">
                        <button
                          onClick={() => openEditForm(product)}
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleAvailability(product.id)
                          }
                          type="button"
                        >
                          {product.status === "Available"
                            ? "Hide"
                            : "Show"}
                        </button>

                        <button
                          className="merchant-delete-product"
                          onClick={() => deleteProduct(product.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visibleProducts.length === 0 && (
              <div className="merchant-products-empty">
                <strong>No products found</strong>

                <p>
                  Change the search or filters to view other products.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {formOpen && (
        <div className="merchant-product-modal-overlay">
          <form
            className="merchant-product-modal"
            onSubmit={saveProduct}
          >
            <button
              className="merchant-product-modal-close"
              onClick={() => setFormOpen(false)}
              type="button"
            >
              ×
            </button>

            <span>Product Catalog</span>

            <h2>
              {editingProductId
                ? "Edit product"
                : "Add a new product"}
            </h2>

            <label>
              Product name
              <input
                name="name"
                onChange={handleFormChange}
                required
                type="text"
                value={productForm.name}
              />
            </label>

            <label>
              SKU
              <input
                name="sku"
                onChange={handleFormChange}
                placeholder="Example: APP-001"
                required
                type="text"
                value={productForm.sku}
              />
            </label>

            <label>
              Category
              <select
                name="category"
                onChange={handleFormChange}
                value={productForm.category}
              >
                {categories
                  .filter((category) => category !== "All")
                  .map((category) => (
                    <option key={category}>{category}</option>
                  ))}
              </select>
            </label>

            <div className="merchant-product-form-grid">
              <label>
                Price
                <input
                  min="0"
                  name="price"
                  onChange={handleFormChange}
                  required
                  step="0.01"
                  type="number"
                  value={productForm.price}
                />
              </label>

              <label>
                Stock
                <input
                  min="0"
                  name="stock"
                  onChange={handleFormChange}
                  required
                  type="number"
                  value={productForm.stock}
                />
              </label>
            </div>

            <label>
              Product status
              <select
                name="status"
                onChange={handleFormChange}
                value={productForm.status}
              >
                <option>Available</option>
                <option>Unavailable</option>
                <option>Out of Stock</option>
              </select>
            </label>

            <button
              className="merchant-save-product"
              type="submit"
            >
              {editingProductId
                ? "Save Changes"
                : "Add Product"}
            </button>

            <small>
              Demonstration product information is illustrative.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

export default MerchantProducts;