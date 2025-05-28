 import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [contests, setContests] = useState([]);
  const [platformFilter, setPlatformFilter] = useState("All");

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/contests");
      setContests(res.data.data);
    } catch (err) {
      console.error("Error fetching contests:", err);
    }
  };

  const getDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m > 0 ? `${m}m` : ""}`;
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

  const filteredContests =
    platformFilter === "All"
      ? contests
      : contests.filter((c) => c.platform === platformFilter);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Contest Tracker</h2>

      {/* Filter Buttons */}
      <div style={{ marginBottom: "20px" }}>
        {["All", "Codeforces", "LeetCode", "CodeChef"].map((platform) => (
          <label key={platform} style={{ marginRight: "15px" }}>
            <input
              type="radio"
              value={platform}
              checked={platformFilter === platform}
              onChange={(e) => setPlatformFilter(e.target.value)}
            />
            {" "}{platform}
          </label>
        ))}
      </div>

      {/* Contest Table */}
      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr style={{ background: "#2980b9", color: "white" }}>
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
                  style={{ color: "#2980b9", textDecoration: "none" }}
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
  );
}

export default App;
