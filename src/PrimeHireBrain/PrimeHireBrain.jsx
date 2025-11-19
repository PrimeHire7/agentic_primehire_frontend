
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import "./PrimeHireBrain.css";

const PrimeHireBrain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([]);

  const fetchStoredResumes = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/mcp/tools/resume/list`);
      if (!response.ok) throw new Error("Failed to fetch resumes");
      const data = await response.json();
      setResumes(data.resumes || []);
    } catch (err) {
      console.error("❌ Failed to load resumes:", err);
      alert("❌ Failed to load stored candidates.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="primehirebrain-container">
      <h2 className="brain-title">PrimeHire Brain</h2>

      <Button
        onClick={fetchStoredResumes}
        className="fetch-btn"
      >
        📊 View Stored Candidates
      </Button>

      {isLoading && <p className="loading-text">Loading data...</p>}

      {resumes.length > 0 && (
        <div className="table-wrapper">
          <h3 className="table-title">
            Stored Candidates ({resumes.length})
          </h3>
          <table className="candidates-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>   {/* 🆕 Added */}
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Company</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {resumes.map((r, i) => (
                <tr key={i}>
                  <td data-label="Name">{r.full_name}</td>
                  <td data-label="Designation">{r.current_title}</td> {/* 🆕 Added */}
                  <td data-label="Email">{r.email}</td>
                  <td data-label="Phone">{r.phone}</td>
                  <td data-label="Skills">{r.top_skills}</td>
                  <td data-label="Experience">{r.years_of_experience}</td>
                  <td data-label="Company">{r.current_company}</td>
                  <td data-label="Updated">{r.last_updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PrimeHireBrain;