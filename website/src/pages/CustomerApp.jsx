import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./CustomerApp.css";


import avocadoImage from "../assets/products/avocado.jpg";
import bananaImage from "../assets/products/banana.jpg";
import breadImage from "../assets/products/bread.jpg";
import eggsImage from "../assets/products/eggs.jpg";
import juiceImage from "../assets/products/juice.jpg";
import milkImage from "../assets/products/milk.jpg";
import riceImage from "../assets/products/rice.jpg";
import salmonImage from "../assets/products/salmon.jpg";

const categories = [
  "All",
  "Fresh Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Pantry",
  "Beverages",
];

const products = [
  {
    id: 1,
    name: "Fresh Avocados",
    category: "Fresh Produce",
    price: 1.49,
    originalPrice: 1.99,
    unit: "each",
    rating: 4.8,
    reviews: 126,
    stockLabel: "Popular",
    image:
      "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Organic Bananas",
    category: "Fresh Produce",
    price: 2.29,
    originalPrice: null,
    unit: "bunch",
    rating: 4.7,
    reviews: 94,
    badge: null,
    stockLabel: "Fresh Today",
    image:
      "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Whole Milk",
    category: "Dairy & Eggs",
    price: 4.19,
    originalPrice: 4.79,
    unit: "gallon",
    rating: 4.9,
    reviews: 211,
    badge: "Weekly Deal",
    stockLabel: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Farm Fresh Eggs",
    category: "Dairy & Eggs",
    price: 3.89,
    originalPrice: null,
    unit: "dozen",
    rating: 4.8,
    reviews: 187,
    badge: null,
    stockLabel: "Local Favorite",
    image:
      "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Artisan Bread",
    category: "Bakery",
    price: 4.99,
    originalPrice: 5.49,
    unit: "loaf",
    rating: 4.6,
    reviews: 73,
    badge: "Save $0.50",
    stockLabel: "Baked Today",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Fresh Salmon",
    category: "Meat & Seafood",
    price: 12.99,
    originalPrice: 15.99,
    unit: "lb",
    rating: 4.9,
    reviews: 148,
    badge: "19% Off",
    stockLabel: "Premium",
    image:
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Orange Juice",
    category: "Beverages",
    price: 5.49,
    originalPrice: null,
    unit: "bottle",
    rating: 4.7,
    reviews: 86,
    badge: null,
    stockLabel: "No Added Sugar",
    image:
      "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Basmati Rice",
    category: "Pantry",
    price: 14.99,
    originalPrice: 17.99,
    unit: "10 lb bag",
    rating: 4.8,
    reviews: 203,
    badge: "Best Value",
    stockLabel: "Family Size",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=900&q=85",
  },
];

function CustomerApp() {
  const [searchParams] = useSearchParams();

  const selectedStore =
    searchParams.get("store") || "Neighborhood Fresh Market";

  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryMiles, setDeliveryMiles] = useState(4.8);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [fulfillment, setFulfillment] = useState("Pickup");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [driverSearchStatus, setDriverSearchStatus] = useState("idle");
  useEffect(() => {
  if (!orderPlaced || fulfillment !== "Delivery") {
    setDriverSearchStatus("idle");
    return undefined;
  }

  setDriverSearchStatus("searching");

  const driverSearchTimer = window.setTimeout(() => {
    setDriverSearchStatus("found");
  }, 3500);

  return () => {
    window.clearTimeout(driverSearchTimer);
  };
}, [orderPlaced, fulfillment]);
  const visibleProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const categoryMatches =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      const searchMatches =
        normalizedSearch === "" ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [selectedCategory, search]);

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product.id,
      );

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );
  };

  const toggleFavorite = (productId) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(productId)
        ? currentFavorites.filter((id) => id !== productId)
        : [...currentFavorites, productId],
    );
  };

  const cartTotal = cart.reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0,
  );

  const cartItemCount = cart.reduce(
  (total, product) => total + product.quantity,
  0,
);

const deliveryBaseFee =
  fulfillment === "Delivery" ? 4 : 0;

const deliveryMileageFee =
  fulfillment === "Delivery" ? deliveryMiles * 1.25 : 0;

const deliveryServiceFee =
  fulfillment === "Delivery" ? 1.5 : 0;

const deliveryFee =
  deliveryBaseFee + deliveryMileageFee + deliveryServiceFee;

const driverBasePay =
  fulfillment === "Delivery" ? 4.5 : 0;

const driverMileagePay =
  fulfillment === "Delivery" ? deliveryMiles * 0.75 : 0;

const driverPayout =
  driverBasePay + driverMileagePay;

const orderTotal =
  cartTotal + deliveryFee;

const estimatedSavings = cart.reduce((total, product) => {
  if (!product.originalPrice) {
    return total;
  }

  return (
    total +
    (product.originalPrice - product.price) * product.quantity
  );
}, 0);

  const placeOrder = () => {
    setOrderPlaced(true);
    setCart([]);
  };

 const closeCheckout = () => {
  setCheckoutOpen(false);
  setOrderPlaced(false);
  setDriverSearchStatus("idle");
};

  return (
    <div className="customer-page">
      <header className="customer-header">
        <Link className="customer-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>{selectedStore}</small>
          </div>
        </Link>

        <div className="delivery-location">
          <small>Shopping near</small>
          <strong>St. Cloud, Minnesota</strong>
        </div>

        <div className="header-actions">
          <button type="button">Sign In</button>

          <button className="cart-button" type="button">
            Cart
            <span>{cartItemCount}</span>
          </button>
        </div>
      </header>

      <section className="selected-store-banner">
        <div>
          <span>Shopping at</span>
          <strong>{selectedStore}</strong>
        </div>

        <Link to="/stores">Change store</Link>
      </section>

      <main>
        <section className="shopping-hero">
          <div>
            <span className="shopping-eyebrow">
              Support neighborhood stores
            </span>

            <h1>
              Fresh groceries from local stores, ready when you are.
            </h1>

            <p>
              Browse groceries online and choose convenient pickup or
              local delivery.
            </p>

            <div className="shopping-search">
              <input
                aria-label="Search products"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search fruits, dairy, meat, pantry items..."
                type="search"
                value={search}
              />

              <button type="button">Search</button>
            </div>
          </div>

          <div className="hero-offer-card">
            <span>Ready Market Savings</span>
            <strong>Free pickup on every order</strong>

            <p>
              Order online and collect your groceries at a convenient
              time.
            </p>

            <button
              onClick={() =>
                document
                  .querySelector(".shopping-content")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              type="button"
            >
              Start Shopping
            </button>
          </div>
        </section>

        <section className="shopping-content">
          <div className="category-row">
            {categories.map((category) => (
              <button
                className={
                  selectedCategory === category
                    ? "category-active"
                    : ""
                }
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-heading">
            <div>
              <span>Local favorites</span>
              <h2>Fresh groceries for your week</h2>
            </div>

            <p>{visibleProducts.length} products available</p>
          </div>

          <div className="shopping-highlight-bar">
            <div>
              <span>Weekly savings</span>
              <strong>Deals selected for local shoppers</strong>
            </div>

            <small>
              Shop pickup deals and support independent grocery stores.
            </small>
          </div>

          <div className="customer-layout">
            <div className="customer-product-grid">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <article
                    className="customer-product-card"
                    key={product.id}
                  >
                    <div className="product-image-placeholder">
                      

                      <button
                        aria-label={`Favorite ${product.name}`}
                        className={`favorite-button ${
                          favorites.includes(product.id)
                            ? "favorite-active"
                            : ""
                        }`}
                        onClick={() => toggleFavorite(product.id)}
                        type="button"
                      >
                        {favorites.includes(product.id) ? "♥" : "♡"}
                      </button>

                      <img
                        alt={product.name}
                        className="product-photo"
                        loading="lazy"
                        src={product.image}
                      />

                      <small className="product-category-label">
                        {product.category}
                      </small>
                    </div>

                    <div className="product-card-body">
                      <div className="product-card-labels">
                        <span className="product-store">
                          {selectedStore}
                        </span>

                        <span className="product-stock-label">
                          {product.stockLabel}
                        </span>
                      </div>

                      <h3>{product.name}</h3>

                      <div className="product-rating">
                        <span>★ {product.rating}</span>
                        <small>{product.reviews} reviews</small>
                      </div>

                      <div className="product-purchase-row">
                        <div className="product-price-block">
                          <div>
                            <strong>
                              ${product.price.toFixed(2)}
                            </strong>

                            <small> / {product.unit}</small>
                          </div>

                          {product.originalPrice && (
                            <span className="original-price">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => addToCart(product)}
                          type="button"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="no-products-found">
                  <strong>No products found</strong>
                  <p>
                    Try another search or choose a different category.
                  </p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                    }}
                    type="button"
                  >
                    Show All Products
                  </button>
                </div>
              )}
            </div>

            <aside className="cart-summary">
              <div>
                <span>Your order</span>
                <h2>{cartItemCount} items</h2>
              </div>

              {cart.length === 0 ? (
                <p>
                  Your cart is empty. Add products to begin an order.
                </p>
              ) : (
                <div className="cart-items">
                  {cart.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <img
                        alt={product.name}
                        className="cart-product-image"
                        src={product.image}
                      />

                      <div className="cart-item-details">
                        <strong>{product.name}</strong>

                        <small>
                          $
                          {(
                            product.price * product.quantity
                          ).toFixed(2)}
                        </small>

                        <div className="cart-quantity-controls">
                          <button
                            aria-label={`Decrease ${product.name}`}
                            onClick={() =>
                              decreaseQuantity(product.id)
                            }
                            type="button"
                          >
                            −
                          </button>

                          <span>{product.quantity}</span>

                          <button
                            aria-label={`Increase ${product.name}`}
                            onClick={() =>
                              increaseQuantity(product.id)
                            }
                            type="button"
                          >
                            +
                          </button>

                          <button
                            className="remove-cart-item"
                            onClick={() =>
                              removeFromCart(product.id)
                            }
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="fulfillment-options">
                <button
                  className={
                    fulfillment === "Pickup"
                      ? "fulfillment-active"
                      : ""
                  }
                  onClick={() => setFulfillment("Pickup")}
                  type="button"
                >
                  Pickup
                </button>

                <button
                  className={
                    fulfillment === "Delivery"
                      ? "fulfillment-active"
                      : ""
                  }
                  onClick={() => setFulfillment("Delivery")}
                  type="button"
                >
                  Delivery
                </button>
              </div>

              {estimatedSavings > 0 && (
                <div className="cart-savings">
                  <span>You save</span>
                  <strong>${estimatedSavings.toFixed(2)}</strong>
                </div>
              )}

              <div className="cart-total">
                <span>Estimated total</span>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>

              <button
                className="checkout-button"
                disabled={cart.length === 0}
                onClick={() => setCheckoutOpen(true)}
                type="button"
              >
                Continue to Checkout
              </button>
            </aside>
          </div>
        </section>
      </main>

      {checkoutOpen && (
        <div className="checkout-overlay">
          <section className="checkout-modal">
            <button
              aria-label="Close checkout"
              className="checkout-close"
              onClick={closeCheckout}
              type="button"
            >
              ×
            </button>

            {!orderPlaced ? (
              <>
                <span className="checkout-eyebrow">
                  Secure checkout
                </span>

                <h2>Complete your order</h2>

                <p className="checkout-description">
                  Review your {fulfillment.toLowerCase()} details before
                  placing your order.
                </p>

                <div className="checkout-summary">
                  <div>
                    <span>Items</span>
                    <strong>{cartItemCount}</strong>
                  </div>

                  <div>
                    <span>Method</span>
                    <strong>{fulfillment}</strong>
                  </div>

                  <div>
  <span>Total</span>
  <strong>${orderTotal.toFixed(2)}</strong>
</div>
                </div>

            {fulfillment === "Pickup" ? (
  <label className="checkout-field">
    Pickup time
    <select defaultValue="5:30 PM">
      <option>5:30 PM</option>
      <option>6:00 PM</option>
      <option>6:30 PM</option>
      <option>7:00 PM</option>
    </select>
  </label>
) : (
  <>
    <div className="delivery-checkout-fields">
      <label className="checkout-field">
        Delivery address
        <input
          onChange={(event) =>
            setDeliveryAddress(event.target.value)
          }
          placeholder="Enter your delivery address"
          required
          type="text"
          value={deliveryAddress}
        />
      </label>

      <label className="checkout-field">
        Estimated delivery distance
        <select
          onChange={(event) =>
            setDeliveryMiles(Number(event.target.value))
          }
          value={deliveryMiles}
        >
          <option value="2.5">2.5 miles</option>
          <option value="4.8">4.8 miles</option>
          <option value="6.2">6.2 miles</option>
          <option value="8.5">8.5 miles</option>
          <option value="12">12 miles</option>
        </select>
      </label>
    </div>

    <div className="delivery-fee-breakdown">
      <div>
        <span>Groceries</span>
        <strong>${cartTotal.toFixed(2)}</strong>
      </div>

      <div>
        <span>Base delivery fee</span>
        <strong>${deliveryBaseFee.toFixed(2)}</strong>
      </div>

      <div>
        <span>
          Mileage fee ({deliveryMiles.toFixed(1)} miles)
        </span>
        <strong>${deliveryMileageFee.toFixed(2)}</strong>
      </div>

      <div>
        <span>Ready Market service fee</span>
        <strong>${deliveryServiceFee.toFixed(2)}</strong>
      </div>

      <div className="delivery-fee-total">
        <span>Order total</span>
        <strong>${orderTotal.toFixed(2)}</strong>
      </div>
    </div>

    <div className="driver-payout-preview">
      <span>Driver assignment</span>

      <h3>Estimated driver payout</h3>

      <div>
        <p>
          Base pay
          <strong>${driverBasePay.toFixed(2)}</strong>
        </p>

        <p>
          Mileage pay
          <strong>${driverMileagePay.toFixed(2)}</strong>
        </p>

        <p>
          Total before tip
          <strong>${driverPayout.toFixed(2)}</strong>
        </p>
      </div>

      <small>
        Customer tips will be added separately and sent to the driver.
      </small>
    </div>
  </>
)}

                <label className="checkout-field">
                  Payment method
                  <select defaultValue="Debit or credit card">
                    <option>Debit or credit card</option>
                    <option>Pay at pickup</option>
                  </select>
                </label>

                <button
                  className="place-order-button"
                  onClick={placeOrder}
                  type="button"
                >
                  Place Order
                </button>

                <small className="checkout-note">
                  This is a prototype. No real payment will be
                  processed.
                </small>
                           </>
            ) : (
              <div className="order-success">
    <span>✓</span>

    <h2>Order confirmed</h2>

    <p>
      Your order has been received and the store will begin
      preparing it shortly.
    </p>

    {fulfillment === "Delivery" && (
      <div className="delivery-assignment-success">
        {driverSearchStatus === "searching" && (
          <div className="driver-searching-state">
            <span className="driver-search-spinner" />

            <div>
              <span>Searching for nearby drivers</span>

              <strong>
                Finding a driver near {selectedStore}
              </strong>

              <p>
                Estimated delivery distance:{" "}
                {deliveryMiles.toFixed(1)} miles
              </p>

              <p>
                Estimated driver payout: $
                {driverPayout.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {driverSearchStatus === "found" && (
          <div className="driver-found-state">
            <div className="driver-found-heading">
              <span>✓</span>

              <div>
                <small>Driver found</small>
                <strong>
                  Your delivery has been accepted
                </strong>
              </div>
            </div>

            <div className="assigned-driver-profile">
              <div className="assigned-driver-avatar">
                AH
              </div>

              <div>
                <strong>Ahmed Hassan</strong>
                <span>★ 4.9 · 328 deliveries</span>
              </div>

              <small>6 minutes away</small>
            </div>

            <div className="assigned-driver-details">
              <div>
                <span>Vehicle</span>
                <strong>Silver Toyota Camry</strong>
              </div>

              <div>
                <span>License plate</span>
                <strong>ABC-123</strong>
              </div>

              <div>
                <span>Driver earnings</span>
                <strong>
                  ${driverPayout.toFixed(2)}
                </strong>
              </div>
            </div>

            <Link to="/track-order">
              Track My Delivery
            </Link>
          </div>
        )}
      </div>
    )}

    <strong>Order #RM-1051</strong>

    <button onClick={closeCheckout} type="button">
      Continue Shopping
    </button>
  </div>
)}
</section>
</div>
)}
</div>
);
}

export default CustomerApp;