import React, { useState, useEffect } from "react";
import { API_BASE } from "@/utils/constants";

export default function CandidateStatus() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/attempts/all`);
      const data = await res.json();
      if (data.ok) setAttempts(data.attempts);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttempts();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => fetchAttempts(), 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📊 Candidate Interview Status</h2>

      {loading && <div>Loading...</div>}

      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "center" }}>
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>JD ID</th>
            <th>Scheduled Time</th>
            <th>Status</th>
            <th>Total Score</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a) => (
            <tr key={a.attempt_id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.jd_id}</td>
              <td>{new Date(a.slot_start).toLocaleString()}</td>
              <td>{a.progress}</td>
              <td>{a.totalScore ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
