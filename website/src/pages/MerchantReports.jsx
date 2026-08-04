import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantReports.css";

const reportTypes = [
  {
    id: 1,
    title: "Sales Report",
    description:
      "Revenue, orders, average order value, and sales trends.",
    format: "PDF / Excel",
    category: "Sales",
  },
  {
    id: 2,
    title: "Inventory Report",
    description:
      "Current stock, low-stock items, out-of-stock products, and value.",
    format: "PDF / Excel",
    category: "Inventory",
  },
  {
    id: 3,
    title: "Customer Report",
    description:
      "New, returning, and loyal customer activity.",
    format: "PDF / CSV",
    category: "Customers",
  },
  {
    id: 4,
    title: "Delivery Report",
    description:
      "Delivery orders, driver performance, distance, and completion times.",
    format: "PDF / Excel",
    category: "Delivery",
  },
  {
    id: 5,
    title: "Marketing Report",
    description:
      "Campaign reach, redemptions, conversion, and attributed revenue.",
    format: "PDF / Excel",
    category: "Marketing",
  },
  {
    id: 6,
    title: "Monthly Summary",
    description:
      "Complete overview of store operations for the selected month.",
    format: "PDF",
    category: "Summary",
  },
  {
    id: 7,
    title: "Tax Summary",
    description:
      "Illustrative sales totals and taxable transaction summaries.",
    format: "PDF / Excel",
    category: "Finance",
  },
  {
    id: 8,
    title: "Product Performance",
    description:
      "Top products, lowest-performing items, units sold, and revenue.",
    format: "PDF / Excel",
    category: "Products",
  },
];

const recentDownloads = [
  {
    id: 1,
    report: "Monthly Summary",
    period: "July 2026",
    format: "PDF",
    created: "August 1, 2026",
  },
  {
    id: 2,
    report: "Inventory Report",
    period: "Current Inventory",
    format: "Excel",
    created: "July 30, 2026",
  },
  {
    id: 3,
    report: "Sales Report",
    period: "July 2026",
    format: "PDF",
    created: "July 29, 2026",
  },
  {
    id: 4,
    report: "Customer Report",
    period: "Last 90 Days",
    format: "CSV",
    created: "July 25, 2026",
  },
];

function MerchantReports() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [period, setPeriod] = useState("This Month");
  const [selectedReport, setSelectedReport] = useState(
    reportTypes[0],
  );
  const [generatedReports, setGeneratedReports] =
    useState(recentDownloads);
  const [generating, setGenerating] = useState(false);

  const categories = [
    "All",
    "Sales",
    "Inventory",
    "Customers",
    "Delivery",
    "Marketing",
    "Summary",
    "Finance",
    "Products",
  ];

  const visibleReports = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return reportTypes.filter((report) => {
      const matchesSearch =
        normalizedSearch === "" ||
        report.title.toLowerCase().includes(normalizedSearch) ||
        report.description
          .toLowerCase()
          .includes(normalizedSearch) ||
        report.category.toLowerCase().includes(normalizedSearch);

      const matchesCategory =
        category === "All" || report.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const generateReport = () => {
    if (!selectedReport || generating) {
      return;
    }

    setGenerating(true);

    window.setTimeout(() => {
      const newReport = {
        id: Date.now(),
        report: selectedReport.title,
        period,
        format: selectedReport.format.split(" / ")[0],
        created: "Just now",
      };

      setGeneratedReports((currentReports) => [
        newReport,
        ...currentReports,
      ]);

      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="merchant-reports-page">
      <aside className="merchant-reports-sidebar">
        <Link className="merchant-reports-brand" to="/">
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
          <button type="button">Drivers</button>
          <Link to="/merchant-marketing">Marketing</Link>
          <Link to="/merchant-analytics">Analytics</Link>

          <Link
            className="merchant-reports-active"
            to="/merchant-reports"
          >
            Reports
          </Link>

          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="merchant-reports-store">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="merchant-reports-main">
        <header className="merchant-reports-header">
          <div>
            <span>Business Reporting</span>
            <h1>Reports & Downloads</h1>

            <p>
              Generate and review sales, inventory, customer,
              delivery, and financial reports.
            </p>
          </div>

          <Link to="/merchant-analytics">
            Open Analytics
          </Link>
        </header>

        <section className="merchant-report-metrics">
          <article>
            <span>Available Reports</span>
            <strong>{reportTypes.length}</strong>
            <small>Operational report templates</small>
          </article>

          <article>
            <span>Generated Reports</span>
            <strong>{generatedReports.length}</strong>
            <small>Current demo history</small>
          </article>

          <article>
            <span>Scheduled Reports</span>
            <strong>3</strong>
            <small>Illustrative automation</small>
          </article>

          <article>
            <span>Storage Used</span>
            <strong>18 MB</strong>
            <small>Demonstration value</small>
          </article>
        </section>

        <section className="merchant-report-workspace">
          <div className="merchant-report-library">
            <div className="merchant-report-toolbar">
              <div>
                <span>Report Library</span>
                <h2>Choose a report</h2>
              </div>

              <div>
                <input
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search reports..."
                  type="search"
                  value={search}
                />

                <select
                  onChange={(event) =>
                    setCategory(event.target.value)
                  }
                  value={category}
                >
                  {categories.map((categoryOption) => (
                    <option key={categoryOption}>
                      {categoryOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="merchant-report-card-grid">
              {visibleReports.map((report) => (
                <article
                  className={
                    selectedReport?.id === report.id
                      ? "merchant-report-card-selected"
                      : ""
                  }
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                >
                  <span>{report.category}</span>
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>

                  <div>
                    <small>{report.format}</small>

                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedReport(report);
                      }}
                      type="button"
                    >
                      Select
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {visibleReports.length === 0 && (
              <div className="merchant-report-empty">
                <strong>No reports found</strong>
                <p>Change the search or category filter.</p>
              </div>
            )}
          </div>

          {selectedReport && (
            <aside className="merchant-report-builder">
              <span>Report Builder</span>
              <h2>{selectedReport.title}</h2>

              <p>{selectedReport.description}</p>

              <label>
                Reporting period
                <select
                  onChange={(event) =>
                    setPeriod(event.target.value)
                  }
                  value={period}
                >
                  <option>Today</option>
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>Last 30 Days</option>
                  <option>Last 90 Days</option>
                  <option>This Year</option>
                </select>
              </label>

              <label>
                Export format
                <select defaultValue="PDF">
                  <option>PDF</option>
                  <option>Excel</option>
                  <option>CSV</option>
                </select>
              </label>

              <section className="merchant-report-preview">
                <span>Report Preview</span>

                <div>
                  <p>
                    <span>Store</span>
                    <strong>
                      Neighborhood Fresh Market
                    </strong>
                  </p>

                  <p>
                    <span>Report</span>
                    <strong>{selectedReport.title}</strong>
                  </p>

                  <p>
                    <span>Period</span>
                    <strong>{period}</strong>
                  </p>

                  <p>
                    <span>Format</span>
                    <strong>{selectedReport.format}</strong>
                  </p>
                </div>
              </section>

              <section className="merchant-report-content">
                <span>Included Sections</span>

                <ul>
                  <li>Summary metrics</li>
                  <li>Performance trends</li>
                  <li>Detailed data table</li>
                  <li>Operational observations</li>
                  <li>Illustrative insights</li>
                </ul>
              </section>

              <button
                className="merchant-generate-report"
                disabled={generating}
                onClick={generateReport}
                type="button"
              >
                {generating
                  ? "Generating Report..."
                  : "Generate Demo Report"}
              </button>

              <small>
                This demonstration creates a report-history record
                but does not download a real file yet.
              </small>
            </aside>
          )}
        </section>

        <section className="merchant-recent-reports">
          <div className="merchant-recent-report-heading">
            <div>
              <span>Report History</span>
              <h2>Recent downloads</h2>
            </div>

            <button type="button">Clear History</button>
          </div>

          <div className="merchant-recent-report-table">
            <div className="merchant-recent-report-header">
              <span>Report</span>
              <span>Period</span>
              <span>Format</span>
              <span>Created</span>
              <span>Action</span>
            </div>

            {generatedReports.map((report) => (
              <div
                className="merchant-recent-report-row"
                key={report.id}
              >
                <strong>{report.report}</strong>
                <span>{report.period}</span>
                <span>{report.format}</span>
                <span>{report.created}</span>

                <button type="button">
                  Download
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="merchant-scheduled-reports">
          <div>
            <span>Scheduled Reporting</span>
            <h2>Automated business summaries</h2>

            <p>
              Production versions can automatically prepare and
              deliver recurring reports to store owners.
            </p>
          </div>

          <div className="merchant-scheduled-report-grid">
            <article>
              <span>Weekly Sales</span>
              <strong>Every Monday</strong>
              <small>PDF by email</small>
            </article>

            <article>
              <span>Inventory Summary</span>
              <strong>Every Friday</strong>
              <small>Excel export</small>
            </article>

            <article>
              <span>Monthly Business Review</span>
              <strong>First day of month</strong>
              <small>PDF and Excel</small>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default MerchantReports;