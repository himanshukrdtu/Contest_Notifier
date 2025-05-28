import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [contests, setContests] = useState([]);
  const [platformFilter, setPlatformFilter] = useState("All");

  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifName, setNotifName] = useState("");
  const [notifEmail, setNotifEmail] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await axios.get("https://contest-notifier-2.onrender.com/api/contests");
      setContests(res.data.data);
    } catch (err) {
      console.error("Error fetching contests:", err);
    }
  };

  const getDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h${m > 0 ? ` ${m}m` : ""}`;
  };

  const getStartsIn = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start - now;
    if (diff < 0) return "Started";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const filteredContests = platformFilter === "All"
    ? contests
    : contests.filter((c) => c.platform === platformFilter);

  const handleNotifSubmit = async (e) => {
    e.preventDefault();
    if (!notifName.trim() || !notifEmail.trim()) {
      setNotifMessage("Please fill in both name and email.");
      return;
    }
    try {
      await axios.post("https://contest-notifier-2.onrender.com/api/users", {
        name: notifName,
        email: notifEmail,
      });
      setNotifMessage("Thank you! You will receive notifications.");
      setNotifName("");
      setNotifEmail("");
      setTimeout(() => setShowNotificationModal(false), 2000);
    } catch (err) {
      setNotifMessage("Error submitting. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="app-container">
      <h2 className="app-title">Contest Tracker</h2>

      <div
        className="notification-text"
        onClick={() => setShowNotificationModal(true)}
        title="Click to get notifications"
      >
        Add Email to Get notification of upcoming contest
      </div>

      {showNotificationModal && (
        <div className="notification-modal">
          <button
            onClick={() => {
              setShowNotificationModal(false);
              setNotifMessage("");
            }}
            aria-label="Close notification form"
            className="modal-close-btn"
          >
            &times;
          </button>

          <h3>Get Notifications</h3>
          <form onSubmit={handleNotifSubmit} className="notif-form">
            <input
              type="text"
              placeholder="Name"
              value={notifName}
              onChange={(e) => setNotifName(e.target.value)}
              required
              className="notif-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={notifEmail}
              onChange={(e) => setNotifEmail(e.target.value)}
              required
              className="notif-input"
            />
            <button type="submit" className="notif-submit-btn">
              Submit
            </button>
          </form>
          {notifMessage && <p className="notif-message">{notifMessage}</p>}
        </div>
      )}

      <div className="table-wrapper">
        <table className="contest-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Platform</th>
              <th>Code</th>
              <th>Name</th>
              <th>Start Time</th>
              <th>Duration</th>
              <th>Starts In</th>
            </tr>
          </thead>
          <tbody>
            {filteredContests.map((contest, index) => (
              <tr key={contest._id}>
                <td>{index + 1}</td>
                <td>{contest.platform}</td>
                <td>{contest.code}</td>
                <td>
                  <a
                    href={contest.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contest-link"
                  >
                    {contest.name}
                  </a>
                </td>
                <td>{new Date(contest.startTime).toLocaleString()}</td>
                <td>{getDuration(contest.durationSeconds)}</td>
                <td>{getStartsIn(contest.startTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
