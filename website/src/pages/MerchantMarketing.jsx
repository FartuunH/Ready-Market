import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./MerchantMarketing.css";

const initialCampaigns = [
  {
    id: 1,
    name: "Weekend Produce Sale",
    type: "Coupon",
    audience: "All Customers",
    status: "Active",
    discount: "15% off",
    sent: 286,
    used: 48,
    revenue: 1284.4,
    startDate: "Aug 7, 2026",
    endDate: "Aug 9, 2026",
  },
  {
    id: 2,
    name: "Loyal Customer Thank You",
    type: "Email",
    audience: "Loyal Customers",
    status: "Scheduled",
    discount: "$5 off $35",
    sent: 0,
    used: 0,
    revenue: 0,
    startDate: "Aug 10, 2026",
    endDate: "Aug 12, 2026",
  },
  {
    id: 3,
    name: "Free Delivery Friday",
    type: "Promotion",
    audience: "Delivery Customers",
    status: "Completed",
    discount: "Free delivery",
    sent: 164,
    used: 39,
    revenue: 932.75,
    startDate: "Jul 31, 2026",
    endDate: "Jul 31, 2026",
  },
  {
    id: 4,
    name: "Back-to-School Pantry",
    type: "Coupon",
    audience: "Returning Customers",
    status: "Draft",
    discount: "10% off pantry",
    sent: 0,
    used: 0,
    revenue: 0,
    startDate: "Aug 15, 2026",
    endDate: "Aug 20, 2026",
  },
];

const emptyCampaign = {
  name: "",
  type: "Coupon",
  audience: "All Customers",
  discount: "",
  startDate: "",
  endDate: "",
  status: "Draft",
};

function MerchantMarketing() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    initialCampaigns[0].id,
  );
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [campaignForm, setCampaignForm] = useState(emptyCampaign);

  const visibleCampaigns = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesSearch =
        normalizedSearch === "" ||
        campaign.name.toLowerCase().includes(normalizedSearch) ||
        campaign.type.toLowerCase().includes(normalizedSearch) ||
        campaign.audience.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, search, statusFilter]);

  const selectedCampaign = campaigns.find(
    (campaign) => campaign.id === selectedCampaignId,
  );

  const activeCampaigns = campaigns.filter(
    (campaign) => campaign.status === "Active",
  ).length;

  const totalSent = campaigns.reduce(
    (total, campaign) => total + campaign.sent,
    0,
  );

  const totalUsed = campaigns.reduce(
    (total, campaign) => total + campaign.used,
    0,
  );

  const campaignRevenue = campaigns.reduce(
    (total, campaign) => total + campaign.revenue,
    0,
  );

  const redemptionRate =
    totalSent > 0 ? Math.round((totalUsed / totalSent) * 100) : 0;

  const handleCampaignChange = (event) => {
    const { name, value } = event.target;

    setCampaignForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const createCampaign = (event) => {
    event.preventDefault();

    if (
      !campaignForm.name ||
      !campaignForm.discount ||
      !campaignForm.startDate ||
      !campaignForm.endDate
    ) {
      return;
    }

    const newCampaign = {
      id: Date.now(),
      ...campaignForm,
      sent: 0,
      used: 0,
      revenue: 0,
    };

    setCampaigns((currentCampaigns) => [
      newCampaign,
      ...currentCampaigns,
    ]);

    setSelectedCampaignId(newCampaign.id);
    setCampaignForm(emptyCampaign);
    setCampaignOpen(false);
  };

  const updateCampaignStatus = (campaignId, status) => {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.map((campaign) =>
        campaign.id === campaignId
          ? { ...campaign, status }
          : campaign,
      ),
    );
  };

  const deleteCampaign = (campaignId) => {
    setCampaigns((currentCampaigns) =>
      currentCampaigns.filter(
        (campaign) => campaign.id !== campaignId,
      ),
    );

    const remaining = campaigns.filter(
      (campaign) => campaign.id !== campaignId,
    );

    if (remaining.length > 0) {
      setSelectedCampaignId(remaining[0].id);
    }
  };

  const statusClass = (status) =>
    `marketing-status marketing-status-${status.toLowerCase()}`;

  return (
    <div className="marketing-page">
      <aside className="marketing-sidebar">
        <Link className="marketing-brand" to="/">
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

          <Link
            className="marketing-nav-active"
            to="/merchant-marketing"
          >
            Marketing
          </Link>

          <Link to="/merchant-analytics">Analytics</Link>
          <Link to="/merchant-reports">Reports</Link>
          <Link to="/merchant-settings">Settings</Link>
        </nav>

        <div className="marketing-store-card">
          <span>Current store</span>
          <strong>Neighborhood Fresh Market</strong>
          <small>St. Cloud, Minnesota</small>
        </div>
      </aside>

      <main className="marketing-main">
        <header className="marketing-header">
          <div>
            <span>Customer Growth</span>
            <h1>Marketing & Promotions</h1>

            <p>
              Create coupons, customer campaigns, promotions, and
              loyalty offers.
            </p>
          </div>

          <div className="marketing-header-actions">
            <button type="button">Export Results</button>

            <button
              className="marketing-create-button"
              onClick={() => setCampaignOpen(true)}
              type="button"
            >
              + Create Campaign
            </button>
          </div>
        </header>

        <section className="marketing-metrics">
          <article>
            <span>Active Campaigns</span>
            <strong>{activeCampaigns}</strong>
            <small>Currently running</small>
          </article>

          <article>
            <span>Customers Reached</span>
            <strong>{totalSent}</strong>
            <small>Illustrative audience reach</small>
          </article>

          <article>
            <span>Offers Used</span>
            <strong>{totalUsed}</strong>
            <small>{redemptionRate}% redemption rate</small>
          </article>

          <article>
            <span>Campaign Revenue</span>
            <strong>${campaignRevenue.toFixed(2)}</strong>
            <small>Attributed sample revenue</small>
          </article>
        </section>

        <section className="marketing-workspace">
          <div className="marketing-list-panel">
            <div className="marketing-toolbar">
              <div>
                <span>Campaign Directory</span>
                <h2>Store campaigns</h2>
              </div>

              <div className="marketing-search-filters">
                <input
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search campaign, type, or audience..."
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
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Draft</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>

            <div className="marketing-table-wrapper">
              <table className="marketing-table">
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Type</th>
                    <th>Audience</th>
                    <th>Offer</th>
                    <th>Status</th>
                    <th>Used</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {visibleCampaigns.map((campaign) => (
                    <tr
                      className={
                        selectedCampaignId === campaign.id
                          ? "marketing-row-selected"
                          : ""
                      }
                      key={campaign.id}
                    >
                      <td>
                        <strong>{campaign.name}</strong>
                        <small>
                          {campaign.startDate}–{campaign.endDate}
                        </small>
                      </td>

                      <td>{campaign.type}</td>
                      <td>{campaign.audience}</td>
                      <td>{campaign.discount}</td>

                      <td>
                        <span
                          className={statusClass(campaign.status)}
                        >
                          {campaign.status}
                        </span>
                      </td>

                      <td>{campaign.used}</td>

                      <td>
                        <button
                          onClick={() =>
                            setSelectedCampaignId(campaign.id)
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

              {visibleCampaigns.length === 0 && (
                <div className="marketing-empty">
                  <strong>No campaigns found</strong>
                  <p>Change your search or status filter.</p>
                </div>
              )}
            </div>
          </div>

          {selectedCampaign && (
            <aside className="marketing-details-panel">
              <div className="marketing-details-heading">
                <div>
                  <span>Campaign Details</span>
                  <h2>{selectedCampaign.name}</h2>
                  <small>{selectedCampaign.type}</small>
                </div>

                <span
                  className={statusClass(
                    selectedCampaign.status,
                  )}
                >
                  {selectedCampaign.status}
                </span>
              </div>

              <section className="marketing-offer-card">
                <span>Customer Offer</span>
                <strong>{selectedCampaign.discount}</strong>
                <p>{selectedCampaign.audience}</p>
              </section>

              <section className="marketing-campaign-summary">
                <article>
                  <span>Sent</span>
                  <strong>{selectedCampaign.sent}</strong>
                </article>

                <article>
                  <span>Used</span>
                  <strong>{selectedCampaign.used}</strong>
                </article>

                <article>
                  <span>Revenue</span>
                  <strong>
                    ${selectedCampaign.revenue.toFixed(2)}
                  </strong>
                </article>

                <article>
                  <span>Conversion</span>
                  <strong>
                    {selectedCampaign.sent > 0
                      ? Math.round(
                          (selectedCampaign.used /
                            selectedCampaign.sent) *
                            100,
                        )
                      : 0}
                    %
                  </strong>
                </article>
              </section>

              <section className="marketing-date-card">
                <p>
                  <span>Start Date</span>
                  <strong>{selectedCampaign.startDate}</strong>
                </p>

                <p>
                  <span>End Date</span>
                  <strong>{selectedCampaign.endDate}</strong>
                </p>
              </section>

              <section className="marketing-preview-card">
                <span>Customer Preview</span>

                <div>
                  <small>Neighborhood Fresh Market</small>
                  <strong>{selectedCampaign.name}</strong>
                  <p>{selectedCampaign.discount}</p>

                  <button type="button">
                    Apply Offer
                  </button>
                </div>
              </section>

              <section className="marketing-ai-card">
                <span>Illustrative Marketing Insight</span>

                <strong>
                  Returning customers are the strongest audience for
                  this offer.
                </strong>

                <p>
                  Ready AI could later use real customer behavior,
                  product sales, and campaign history to recommend
                  promotions.
                </p>
              </section>

              <div className="marketing-details-actions">
                {selectedCampaign.status === "Draft" && (
                  <button
                    onClick={() =>
                      updateCampaignStatus(
                        selectedCampaign.id,
                        "Scheduled",
                      )
                    }
                    type="button"
                  >
                    Schedule
                  </button>
                )}

                {selectedCampaign.status === "Scheduled" && (
                  <button
                    onClick={() =>
                      updateCampaignStatus(
                        selectedCampaign.id,
                        "Active",
                      )
                    }
                    type="button"
                  >
                    Start Campaign
                  </button>
                )}

                {selectedCampaign.status === "Active" && (
                  <button
                    onClick={() =>
                      updateCampaignStatus(
                        selectedCampaign.id,
                        "Completed",
                      )
                    }
                    type="button"
                  >
                    End Campaign
                  </button>
                )}

                <button type="button">
                  Duplicate
                </button>

                <button
                  className="marketing-delete-button"
                  onClick={() =>
                    deleteCampaign(selectedCampaign.id)
                  }
                  type="button"
                >
                  Delete
                </button>
              </div>

              <small className="marketing-disclosure">
                Campaigns, customers, and results are demonstration
                data.
              </small>
            </aside>
          )}
        </section>
      </main>

      {campaignOpen && (
        <div className="marketing-modal-overlay">
          <form
            className="marketing-modal"
            onSubmit={createCampaign}
          >
            <button
              className="marketing-modal-close"
              onClick={() => setCampaignOpen(false)}
              type="button"
            >
              ×
            </button>

            <span>Marketing Campaign</span>
            <h2>Create a new campaign</h2>

            <label>
              Campaign name
              <input
                name="name"
                onChange={handleCampaignChange}
                required
                type="text"
                value={campaignForm.name}
              />
            </label>

            <div className="marketing-form-grid">
              <label>
                Campaign type
                <select
                  name="type"
                  onChange={handleCampaignChange}
                  value={campaignForm.type}
                >
                  <option>Coupon</option>
                  <option>Promotion</option>
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Loyalty Reward</option>
                </select>
              </label>

              <label>
                Audience
                <select
                  name="audience"
                  onChange={handleCampaignChange}
                  value={campaignForm.audience}
                >
                  <option>All Customers</option>
                  <option>New Customers</option>
                  <option>Returning Customers</option>
                  <option>Loyal Customers</option>
                  <option>Delivery Customers</option>
                  <option>Pickup Customers</option>
                </select>
              </label>
            </div>

            <label>
              Offer
              <input
                name="discount"
                onChange={handleCampaignChange}
                placeholder="Example: 15% off produce"
                required
                type="text"
                value={campaignForm.discount}
              />
            </label>

            <div className="marketing-form-grid">
              <label>
                Start date
                <input
                  name="startDate"
                  onChange={handleCampaignChange}
                  required
                  type="date"
                  value={campaignForm.startDate}
                />
              </label>

              <label>
                End date
                <input
                  name="endDate"
                  onChange={handleCampaignChange}
                  required
                  type="date"
                  value={campaignForm.endDate}
                />
              </label>
            </div>

            <label>
              Status
              <select
                name="status"
                onChange={handleCampaignChange}
                value={campaignForm.status}
              >
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Active</option>
              </select>
            </label>

            <button
              className="marketing-save-button"
              type="submit"
            >
              Create Campaign
            </button>

            <small>
              This creates a demonstration campaign only.
            </small>
          </form>
        </div>
      )}
    </div>
  );
}

export default MerchantMarketing;