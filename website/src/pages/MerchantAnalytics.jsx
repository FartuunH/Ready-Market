import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantAnalytics.css";

const analyticsData = {
  "7 Days": {
    revenue: 18420,
    orders: 438,
    averageOrder: 42.05,
    customers: 286,
    growth: 12.4,
    revenueBars: [42, 58, 49, 72, 63, 91, 76],
  },
  "30 Days": {
    revenue: 74260,
    orders: 1764,
    averageOrder: 42.1,
    customers: 842,
    growth: 18.7,
    revenueBars: [35, 44, 51, 48, 62, 69, 77, 82, 74, 91],
  },
  "90 Days": {
    revenue: 218940,
    orders: 5196,
    averageOrder: 42.14,
    customers: 1948,
    growth: 24.2,
    revenueBars: [28, 37, 41, 53, 49, 61, 67, 73, 79, 88],
  },
  Year: {
    revenue: 892400,
    orders: 20814,
    averageOrder: 42.87,
    customers: 6274,
    growth: 31.6,
    revenueBars: [21, 28, 35, 39, 48, 56, 64, 72, 78, 86, 91, 96],
  },
};

const topProducts = [
  { name: "Whole Milk", revenue: 4820, units: 1381 },
  { name: "Basmati Rice", revenue: 4180, units: 279 },
  { name: "Fresh Salmon", revenue: 3890, units: 299 },
  { name: "Farm Fresh Eggs", revenue: 3210, units: 825 },
  { name: "Artisan Bread", revenue: 2740, units: 549 },
];

const categoryPerformance = [
  { name: "Fresh Produce", percent: 88, revenue: 16240 },
  { name: "Dairy & Eggs", percent: 76, revenue: 14020 },
  { name: "Pantry", percent: 69, revenue: 12680 },
  { name: "Meat & Seafood", percent: 61, revenue: 11240 },
  { name: "Bakery", percent: 48, revenue: 8840 },
  { name: "Beverages", percent: 41, revenue: 7540 },
];

const hourlyActivity = [
  { time: "8 AM", level: 35 },
  { time: "9 AM", level: 52 },
  { time: "10 AM", level: 64 },
  { time: "11 AM", level: 72 },
  { time: "12 PM", level: 87 },
  { time: "1 PM", level: 76 },
  { time: "2 PM", level: 61 },
  { time: "3 PM", level: 69 },
  { time: "4 PM", level: 82 },
  { time: "5 PM", level: 94 },
  { time: "6 PM", level: 88 },
];

function MerchantAnalytics() {
  const [period, setPeriod] = useState("7 Days");

  const currentData = analyticsData[period];

  const returningCustomerRate = 73;
  const deliveryRate = 36;
  const pickupRate = 64;

  const revenueLabels = useMemo(() => {
    if (period === "7 Days") {
      return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }

    if (period === "Year") {
      return [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
    }

    return currentData.revenueBars.map(
      (_, index) => `P${index + 1}`,
    );
  }, [period, currentData.revenueBars]);

  return (
    <div className="merchant-analytics-page">
      <aside className="merchant-analytics-sidebar">
        <Link className="merchant-analytics-brand" to="/">
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

          <Link
            className="merchant-analytics-active"
            to="/merchant-analytics"
          >
            Analytics
          </Link>

          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="merchant-analytics-store">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-analytics-main">
        <header className="merchant-analytics-header">
          <div>
            <span>Business Intelligence</span>
            <h1>Analytics & Reports</h1>

            <p>
              Review revenue, orders, customers, products, and delivery
              performance.
            </p>
          </div>

          <div className="merchant-analytics-actions">
            <button type="button">Export Report</button>
            <button type="button">Download PDF</button>
          </div>
        </header>

        <div className="merchant-period-tabs">
          {Object.keys(analyticsData).map((periodOption) => (
            <button
              className={
                period === periodOption
                  ? "merchant-period-active"
                  : ""
              }
              key={periodOption}
              onClick={() => setPeriod(periodOption)}
              type="button"
            >
              {periodOption}
            </button>
          ))}
        </div>

        <section className="merchant-analytics-metrics">
          <article>
            <span>Revenue</span>
            <strong>
              ${currentData.revenue.toLocaleString()}
            </strong>
            <small>+{currentData.growth}% growth</small>
          </article>

          <article>
            <span>Orders</span>
            <strong>
              {currentData.orders.toLocaleString()}
            </strong>
            <small>Pickup and delivery</small>
          </article>

          <article>
            <span>Average Order</span>
            <strong>
              ${currentData.averageOrder.toFixed(2)}
            </strong>
            <small>Average basket value</small>
          </article>

          <article>
            <span>Customers</span>
            <strong>
              {currentData.customers.toLocaleString()}
            </strong>
            <small>{returningCustomerRate}% returning</small>
          </article>
        </section>

        <section className="merchant-analytics-grid">
          <article className="merchant-analytics-panel merchant-revenue-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Revenue Performance</span>
                <h2>Revenue trend</h2>
              </div>

              <strong>
                ${currentData.revenue.toLocaleString()}
              </strong>
            </div>

            <div className="merchant-revenue-chart">
              {currentData.revenueBars.map((height, index) => (
                <div key={`${period}-${index}`}>
                  <span style={{ height: `${height}%` }} />
                  <small>{revenueLabels[index]}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-health-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Store Performance</span>
                <h2>Overall health</h2>
              </div>
            </div>

            <div className="merchant-health-score">
              <strong>94%</strong>
              <span>Excellent</span>
            </div>

            <div className="merchant-health-breakdown">
              <p>
                <span>Orders</span>
                <strong>96%</strong>
              </p>

              <p>
                <span>Inventory</span>
                <strong>92%</strong>
              </p>

              <p>
                <span>Customer Satisfaction</span>
                <strong>98%</strong>
              </p>

              <p>
                <span>Delivery</span>
                <strong>91%</strong>
              </p>
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-category-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Category Performance</span>
                <h2>Revenue by category</h2>
              </div>
            </div>

            <div className="merchant-category-list">
              {categoryPerformance.map((category) => (
                <div key={category.name}>
                  <div>
                    <strong>{category.name}</strong>
                    <span>
                      ${category.revenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="merchant-category-bar">
                    <span
                      style={{ width: `${category.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-fulfillment-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Order Fulfillment</span>
                <h2>Pickup vs delivery</h2>
              </div>
            </div>

            <div className="merchant-fulfillment-circles">
              <div>
                <strong>{pickupRate}%</strong>
                <span>Pickup</span>
              </div>

              <div>
                <strong>{deliveryRate}%</strong>
                <span>Delivery</span>
              </div>
            </div>

            <div className="merchant-delivery-stats">
              <p>
                <span>Average delivery time</span>
                <strong>18 min</strong>
              </p>

              <p>
                <span>Driver rating</span>
                <strong>4.9 ★</strong>
              </p>

              <p>
                <span>Completed deliveries</span>
                <strong>42</strong>
              </p>
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-products-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Product Performance</span>
                <h2>Top-selling products</h2>
              </div>
            </div>

            <div className="merchant-top-products">
              {topProducts.map((product, index) => (
                <div key={product.name}>
                  <span>{index + 1}</span>

                  <div>
                    <strong>{product.name}</strong>
                    <small>{product.units} units sold</small>
                  </div>

                  <strong>
                    ${product.revenue.toLocaleString()}
                  </strong>
                </div>
              ))}
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-customer-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Customer Analytics</span>
                <h2>Customer engagement</h2>
              </div>
            </div>

            <div className="merchant-customer-stat-grid">
              <article>
                <span>Returning</span>
                <strong>73%</strong>
              </article>

              <article>
                <span>New</span>
                <strong>27%</strong>
              </article>

              <article>
                <span>Average rating</span>
                <strong>4.8 ★</strong>
              </article>

              <article>
                <span>Loyal customers</span>
                <strong>126</strong>
              </article>
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-hours-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Shopping Activity</span>
                <h2>Busiest hours</h2>
              </div>
            </div>

            <div className="merchant-hour-chart">
              {hourlyActivity.map((hour) => (
                <div key={hour.time}>
                  <span style={{ height: `${hour.level}%` }} />
                  <small>{hour.time}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="merchant-analytics-panel merchant-ai-panel">
            <div className="merchant-panel-heading">
              <div>
                <span>Illustrative AI Insights</span>
                <h2>Ready AI</h2>
              </div>
            </div>

            <ul>
              <li>Friday sales are higher than Monday.</li>
              <li>Fresh produce is the strongest category.</li>
              <li>Delivery orders increased during this period.</li>
              <li>Milk and bread are frequently purchased together.</li>
              <li>Returning customers spend more per order.</li>
              <li>Consider promoting eggs this weekend.</li>
            </ul>

            <small>
              These insights are demonstration examples and are not yet
              generated from live merchant data.
            </small>
          </article>
        </section>

        <section className="merchant-report-section">
          <div>
            <span>Reports</span>
            <h2>Download business reports</h2>

            <p>
              Prepare sales, inventory, customer, delivery, and monthly
              summary reports.
            </p>
          </div>

          <div className="merchant-report-grid">
            <button type="button">Sales Report</button>
            <button type="button">Inventory Report</button>
            <button type="button">Customer Report</button>
            <button type="button">Delivery Report</button>
            <button type="button">Monthly Summary</button>
            <button type="button">Tax Summary</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MerchantAnalytics;