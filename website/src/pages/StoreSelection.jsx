import { Link } from "react-router-dom";
import "./StoreSelection.css";

const stores = [
  {
    id: 1,
    name: "Neighborhood Fresh Market",
    location: "St. Cloud, MN",
    rating: 4.8,
    distance: "1.2 miles",
    pickup: "20–30 min",
    delivery: true,
    status: "Open",
    category: "Local Grocery",
    icon: "🛒",
  },
  {
    id: 2,
    name: "Downtown Grocery",
    location: "St. Cloud, MN",
    rating: 4.6,
    distance: "2.1 miles",
    pickup: "25–35 min",
    delivery: true,
    status: "Open",
    category: "Neighborhood Market",
    icon: "🏪",
  },
  {
    id: 3,
    name: "Family Food Market",
    location: "Waite Park, MN",
    rating: 4.7,
    distance: "3.4 miles",
    pickup: "30–40 min",
    delivery: false,
    status: "Open",
    category: "Family Grocery",
    icon: "🥬",
  },
  {
    id: 4,
    name: "International Market",
    location: "St. Cloud, MN",
    rating: 4.9,
    distance: "2.8 miles",
    pickup: "20–30 min",
    delivery: true,
    status: "Open",
    category: "International Foods",
    icon: "🌍",
  },
];

function StoreSelection() {
  return (
    <div className="store-selection-page">
      <header className="store-selection-header">
        <Link className="store-selection-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Shop local grocery stores</small>
          </div>
        </Link>

        <Link className="merchant-link" to="/dashboard">
          Merchant Dashboard
        </Link>
      </header>

      <main>
        <section className="store-selection-hero">
          <span>Ready Market</span>

          <h1>Choose a local grocery store.</h1>

          <p>
            Shop online from independent grocery stores near St. Cloud and
            choose pickup or delivery.
          </p>

          <div className="store-location-search">
            <input
              defaultValue="St. Cloud, Minnesota"
              placeholder="Enter your city or ZIP code"
              type="text"
            />

            <button type="button">Find Stores</button>
          </div>
        </section>

        <section className="stores-section">
          <div className="stores-heading">
            <div>
              <span>Stores near you</span>
              <h2>Available local markets</h2>
            </div>

            <p>{stores.length} stores available</p>
          </div>

          <div className="stores-grid">
            {stores.map((store) => (
              <article className="store-card" key={store.id}>
                <div className="store-image">
                  <span>{store.icon}</span>

                  <small className="store-status">{store.status}</small>
                </div>

                <div className="store-card-body">
                  <span className="store-category">{store.category}</span>

                  <h3>{store.name}</h3>

                  <p>{store.location}</p>

                  <div className="store-meta">
                    <span>★ {store.rating}</span>
                    <span>{store.distance}</span>
                    <span>{store.pickup}</span>
                  </div>

                  <div className="store-services">
                    <span>Pickup available</span>

                    <span>
                      {store.delivery
                        ? "Delivery available"
                        : "Pickup only"}
                    </span>
                  </div>

                 <Link
  className="shop-store-button"
  to={`/shop?store=${encodeURIComponent(store.name)}`}
>
  Shop this store
</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default StoreSelection;