
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import "./PrimeHireBrain.css";
import { LuRefreshCw } from "react-icons/lu";
import { FaUserAlt } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { FaBrain } from "react-icons/fa";


const PrimeHireBrain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  /* ---------------- REPAIR STATE ---------------- */
  const [repairing, setRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState(null);

  /* ---------------- FETCH ---------------- */
  const fetchStoredResumes = async (q = "") => {
    setIsLoading(true);
    try {
      const query = q ? `?search=${encodeURIComponent(q)}` : "";
      const res = await fetch(`${API_BASE}/mcp/tools/resume/list${query}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setResumes(data.resumes || []);
      setSelected(new Set());
    } catch {
      alert("Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LIVE SEARCH ---------------- */
  useEffect(() => {
    const t = setTimeout(() => fetchStoredResumes(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ---------------- SELECT ---------------- */
  const toggleOne = (id) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  const toggleAll = () => {
    if (selected.size === resumes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(resumes.map((r) => r.candidate_id)));
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteCandidates = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} candidate(s)?`)) return;

    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE}/mcp/tools/resume/delete/${id}`, {
            method: "DELETE",
          })
        )
      );
      setResumes((prev) =>
        prev.filter((r) => !ids.includes(r.candidate_id))
      );
      setSelected(new Set());
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- START REPAIR ---------------- */
  const startRepair = async () => {
    if (!window.confirm("Sync DB → Pinecone? This may take several minutes.")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/resume/sync/repair`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error();

      setRepairing(true);
      setRepairStatus({ status: "running", repaired: 0, total: 0 });
    } catch {
      alert("Failed to start repair");
    }
  };

  /* ---------------- REPAIR STATUS POLLING ---------------- */
  useEffect(() => {
    if (!repairing) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/resume/sync/repair/status`
        );
        if (!res.ok) return;

        const data = await res.json();
        setRepairStatus(data);

        if (data.status === "completed") {
          setRepairing(false);
          fetchStoredResumes(search);
        }

        if (data.status === "error") {
          setRepairing(false);
          alert("Repair failed. Check logs.");
        }
      } catch { }
    }, 3000);

    return () => clearInterval(interval);
  }, [repairing]);

  const progressPercent =
    repairStatus?.total > 0
      ? Math.round((repairStatus.repaired / repairStatus.total) * 100)
      : 0;

  return (
    <div className="jd-history-container">
      <h2 className="jd-title"> <FaBrain /> PrimeHire Brain</h2>

      {/* ACTION BAR */}
      <div className="brain-actions">
        <input
          className="search-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button
          className="refresh-btn jd-refresh btn" onClick={() => fetchStoredResumes(search)}>
          <LuRefreshCw />
          Refresh
        </Button>

        <Button className="repair-btn"
          variant="outline"
          disabled={repairing}
          onClick={startRepair}
        >
          🛠 Repair Pinecone
        </Button>

        {selected.size > 0 && (
          <Button
            variant="destructive"
            onClick={() => deleteCandidates([...selected])}
          >
            🗑 Delete ({selected.size})
          </Button>
        )}
      </div>

      {/* REPAIR STATUS */}
      {repairing && repairStatus && (
        <div className="repair-box">
          <div className="repair-header">
            <span className="badge running">RUNNING</span>
            <strong>Repairing Pinecone</strong>
          </div>

          <div className="repair-progress">
            <div
              className="repair-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="repair-meta">
            {repairStatus.repaired} / {repairStatus.total} repaired
            <span>{progressPercent}%</span>
          </div>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {resumes.length > 0 && (
        <>
          <div className="table-header d-flex justify-space-between">
            <FaUserAlt />  Total Candidates: <strong>{resumes.length}</strong>
          </div>

          <div className="table-wrapper">
            <table className="candidates-table compact">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selected.size === resumes.length}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Skills</th>
                  <th>Experience</th>
                  <th>Location</th>
                  {/* <th>Company</th> */}
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((r) => (
                  <tr key={r.candidate_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.has(r.candidate_id)}
                        onChange={() => toggleOne(r.candidate_id)}
                      />
                    </td>
                    <td>{r.full_name}</td>
                    <td>{r.current_title}</td>
                    <td>{r.email}</td>
                    <td className="skills-cell" title={r.top_skills}>
                      {r.top_skills}
                    </td>
                    <td>{r.years_of_experience}</td>
                    <td>{r.location}</td>
                    {/* <td>{r.current_company}</td> */}

                    <td>{r.last_updated}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteCandidates([r.candidate_id])
                        }
                      >
                        <AiFillDelete />

                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default PrimeHireBrain;
