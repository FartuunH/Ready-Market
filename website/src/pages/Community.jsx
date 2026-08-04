import { Link } from "react-router-dom";
import "./Community.css";

const communityListings = [
  {
    id: 1,
    title: "Fresh Farmers Market",
    type: "Farmers Market",
    location: "Lake George Park, St. Cloud",
    date: "Saturday",
    time: "8:00 AM – 1:00 PM",
    description:
      "Fresh produce, local honey, baked goods, flowers, and seasonal products.",
  },
  {
    id: 2,
    title: "Neighborhood Farm Stand",
    type: "Farm Stand",
    location: "Waite Park, Minnesota",
    date: "Friday and Saturday",
    time: "9:00 AM – 4:00 PM",
    description:
      "Locally grown vegetables, eggs, herbs, and seasonal fruit.",
  },
  {
    id: 3,
    title: "Community Garden Open Day",
    type: "Community Event",
    location: "St. Cloud Community Garden",
    date: "August 15",
    time: "10:00 AM – 2:00 PM",
    description:
      "Garden tours, family activities, growing demonstrations, and volunteer information.",
  },
];

function Community() {
  return (
    <div className="community-page">
      <header className="community-header">
        <Link className="community-brand" to="/">
          <span>R</span>

          <div>
            <strong>Ready Market</strong>
            <small>Community Listings</small>
          </div>
        </Link>

        <Link className="community-back-link" to="/">
          Back to Ready Technologies
        </Link>
      </header>

      <main>
        <section className="community-hero">
          <span>Ready Community</span>

          <h1>Discover local food events and community resources.</h1>

          <p>
            Ready Market provides a small free space where local farmers,
            food organizations, and community groups can share farmers
            markets, farm stands, and neighborhood food events.
          </p>

          <small>
            Ready Market’s primary focus remains helping independent grocery
            stores grow through online ordering, pickup, delivery, and
            merchant software.
          </small>
        </section>

        <section className="community-listings-section">
          <div className="community-section-heading">
            <span>Upcoming Listings</span>
            <h2>Local food and community events</h2>
          </div>

          <div className="community-listings-grid">
            {communityListings.map((listing) => (
              <article key={listing.id}>
                <span>{listing.type}</span>
                <h3>{listing.title}</h3>

                <div>
                  <p>
                    <strong>Location</strong>
                    {listing.location}
                  </p>

                  <p>
                    <strong>Date</strong>
                    {listing.date}
                  </p>

                  <p>
                    <strong>Time</strong>
                    {listing.time}
                  </p>
                </div>

                <small>{listing.description}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="community-submit-section">
          <div>
            <span>Free Community Listing</span>

            <h2>Share a local food event.</h2>

            <p>
              Farmers, nonprofit organizations, and community groups may
              submit eligible food-related events for free.
            </p>
          </div>

          <form onSubmit={(event) => event.preventDefault()}>
            <label>
              Organization or farm
              <input placeholder="Organization name" type="text" />
            </label>

            <label>
              Contact email
              <input placeholder="you@example.com" type="email" />
            </label>

            <label>
              Event name
              <input placeholder="Event name" type="text" />
            </label>

            <label>
              Location
              <input placeholder="Event address or location" type="text" />
            </label>

            <label>
              Event details
              <textarea
                placeholder="Tell us about the event."
                rows="5"
              />
            </label>

            <button type="submit">
              Submit Demo Listing
            </button>

            <small>
              This demonstration form does not currently send submissions.
            </small>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Community;