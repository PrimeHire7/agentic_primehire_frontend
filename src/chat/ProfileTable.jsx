

// src/components/ProfileTable.jsx
import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import "./ProfileTable.css";

/* ===========================================================
  ProfileTable.jsx
  - Merged: sorting/filtering/badges + working send-to-client flow
  - Option B: bar + label (Best/Good/Partial)
  =========================================================== */
const ProfileTable = ({ data = [], index = 0, jdId = null }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: "finalScore", direction: "desc" });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responses, setResponses] = useState({});
  const [whatsappAvailable, setWhatsappAvailable] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showSendMenu, setShowSendMenu] = useState(false);

  const navigate = useNavigate();

  /* ------------------- FETCH WHATSAPP RESPONSES ------------------- */
  useEffect(() => {
    let mounted = true;
    const fetchResponses = async () => {
      try {
        const res = await fetch(`${API_BASE}/mcp/tools/match/whatsapp/responses`);
        if (!res.ok) throw new Error("failed to fetch responses");
        const data = await res.json();
        if (mounted) setResponses(data);
      } catch (err) {
        if (mounted) setWhatsappAvailable(false);
      }
    };

    fetchResponses();
    const interval = setInterval(fetchResponses, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  /* ------------------- PREPROCESS MATCHES ------------------- */
  // shallow copy to avoid mutating props unexpectedly
  const prepared = (Array.isArray(data) ? data.slice() : []).map((item) => {
    const finalScore = item?.scores?.final_score ?? item?.finalScore ?? 0;
    return { ...item, finalScore };
  });

  /* ------------------- SORT & FILTER ------------------- */
  const sortAndFilterMatches = (matches) => {
    let filtered = matches.filter((m) => {
      if (m.finalScore < minScoreFilter) return false;

      if (!filterQuery && !selectedCategory) return true;

      // category filter (best/good/partial)
      if (selectedCategory) {
        if (selectedCategory === "best" && m.finalScore < 85) return false;
        if (selectedCategory === "good" && (m.finalScore < 60 || m.finalScore >= 85)) return false;
        // if (selectedCategory === "partial" && m.finalScore >= 60) return false;
      }

      if (!filterQuery) return true;
      const q = filterQuery.toLowerCase();
      const nameOk = (m.name || "").toLowerCase().includes(q);
      const skillsOk = (Array.isArray(m.skills) ? m.skills.join(", ") : m.skills || "").toLowerCase().includes(q);

      return nameOk || skillsOk;
    });

    filtered.sort((a, b) => {
      if (sortConfig.direction === "asc") return a.finalScore - b.finalScore;
      return b.finalScore - a.finalScore;
    });

    return filtered;
  };

  const displayedMatches = sortAndFilterMatches(prepared);

  /* ------------------- Summary counts ------------------- */
  const summary = { best: 0, good: 0 };
  prepared.forEach((item) => {
    if (item.finalScore >= 85) summary.best++;
    else if (item.finalScore >= 60) summary.good++;
  });


  /* ------------------- Select All handler ------------------- */
  useEffect(() => {
    if (selectAll) setSelectedRows(displayedMatches.map((d) => _deriveCandidateId(d)));
    else setSelectedRows([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectAll, jdId, filterQuery, minScoreFilter, selectedCategory]);

  /* ------------------- Helper: robust candidate id ------------------- */
  const _deriveCandidateId = (item) => {
    // Candidate source key -> keep consistent with server search keys
    return item.candidate_id || item.email || item.phone || item._pine_id || item.name || "";
  };

  /* ------------------- Bulk actions placeholder ------------------- */
  const handleBulkEmail = () => alert("Bulk email coming soon!");
  const handleBulkWhatsApp = () => alert("Bulk WhatsApp coming soon!");

  return (
    <div key={index} className="profile-box">
      {/* FILTER BAR */}
      <div className="filters-row">
        <h2 className="title">🎯 Profile Matches</h2>

        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Filter name or skill..."
            className="input-box"
            value={filterQuery}
            onChange={(e) => {
              setFilterQuery(e.target.value);
              setSelectedCategory(null);
            }}
          />

          <input
            type="number"
            min={0}
            max={100}
            placeholder="Min Score"
            className="input-box small"
            value={minScoreFilter}
            onChange={(e) => {
              setMinScoreFilter(Number(e.target.value));
              setSelectedCategory(null);
            }}
          />

          <button
            className="sort-btn"
            onClick={() =>
              setSortConfig((prev) => ({ key: prev.key, direction: prev.direction === "asc" ? "desc" : "asc" }))
            }
          >
            Sort: {sortConfig.direction === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* SEND + BADGES ROW */}
      <div className="send-review-container">
        <div className="bulk-send-wrapper">
          <button className="bulk-send-btn" onClick={() => setShowSendMenu((p) => !p)}>
            Send ({selectedRows.length})
          </button>

          {showSendMenu && (
            <div className="send-dropdown">
              <button className="send-option action-style" onClick={handleBulkEmail}>
                <Mail size={16} /> Email
              </button>

              <button className="send-option action-style" onClick={handleBulkWhatsApp}>
                <MessageSquare size={16} /> WhatsApp
              </button>
            </div>
          )}
        </div>

        <div className="review-badges">
          <span className={`badge best ${selectedCategory === "best" ? "active" : ""}`} onClick={() => setSelectedCategory("best")}>
            🏆 Best ({summary.best})
          </span>

          <span className={`badge good ${selectedCategory === "good" ? "active" : ""}`} onClick={() => setSelectedCategory("good")}>
            👍 Good ({summary.good})
          </span>

          {/* <span className={`badge partial ${selectedCategory === "partial" ? "active" : ""}`} onClick={() => setSelectedCategory("partial")}>
              ⚙ Partial ({summary.partial})
            </span> */}
        </div>
      </div>

      {/* TABLE */}
      {displayedMatches.length === 0 ? (
        <p>No matching profiles.</p>
      ) : (
        <table className="profiles-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => setSelectAll((p) => !p)}
                />
              </th>
              <th>Name</th>
              <th>Designation</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Exp</th>
              <th>Skills</th>
              <th>Actions</th>
              <th>Score</th>
              <th>Interview</th>
            </tr>
          </thead>

          <tbody>
            {displayedMatches.map((item, idx) => (
              <ProfileTableRow
                key={idx}
                item={item}
                responses={responses}
                jdId={jdId}
                onSendMail={(it) => sendMailMessage(it, jdId)}
                onSendWhatsApp={(it) => sendWhatsAppMessage(it, jdId)}
                whatsappAvailable={whatsappAvailable}
                onRowSelect={(candidateId, checked) => {
                  setSelectedRows((prev) => {
                    if (checked) return Array.from(new Set([...prev, candidateId]));
                    return prev.filter((c) => c !== candidateId);
                  });
                }}
                isSelected={selectedRows.includes(_deriveCandidateId(item))}
                onStartInterview={(it) => {
                  if (!jdId) return alert("No JD ID found for this match!");
                  // fetch jd text then navigate
                  fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`)
                    .then((r) => r.json())
                    .then((jdData) => {
                      if (!jdData?.jd_text) return alert("JD not found!");
                      navigate("/validation", {
                        state: {
                          candidateName: it.name,
                          candidateId: it.phone,
                          jd_id: jdId,
                          jd_text: jdData.jd_text,
                        },
                      });
                    })
                    .catch((e) => {
                      console.error("JD fetch error", e);
                      alert("Failed to fetch JD text");
                    });
                }}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ===========================================================
  Row Component (Option B style)
  - handles Send to Client: minimal payload -> { client_email, candidate_id, jd_id }
  =========================================================== */
const ProfileTableRow = ({
  item,
  responses = {},
  onSendMail,
  onSendWhatsApp,
  whatsappAvailable,
  onRowSelect,
  isSelected = false,
  onStartInterview,
  jdId,
}) => {
  const [showClientBox, setShowClientBox] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState("Not Started");
  const [round, setRound] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  const score = item.finalScore ?? 0;

  const matchLevel = score >= 85 ? "Best match" : "Good match";

  const barWidth = Math.min(Math.max(score, 5), 100) + "%";

  const normalizedPhone = (item.phone || "").replace(/\D/g, "");
  const whatsappResp = responses[normalizedPhone] || {};

  /* Robust candidate id derivation (same as sendMail) */
  const candidateId = item.candidate_id || item.email || item.phone || item._pine_id || item.name || "";

  /* ------------------- SEND TO CLIENT ------------------- */
  const sendToClient = async () => {
    if (!clientEmail || !clientEmail.includes("@")) return alert("Enter valid client email!");

    const payload = {
      client_email: String(clientEmail).trim(),
      candidate_id: String(candidateId),
      jd_id: jdId,
    };

    try {
      const res = await fetch(`${API_BASE}/mcp/tools/match/send_to_client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("send_to_client failed:", data);
        alert(data.detail || data.message || "Failed to send client mail");
        return;
      }

      alert(data.message || "Client mail sent!");
      setShowClientBox(false);
    } catch (err) {
      console.error("send_to_client error:", err);
      alert("Failed to send client mail. Check console.");
    }
  };

  /* ------------------- STATUS FETCH ------------------- */
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/latest_attempt/${item.phone}/${jdId}`);
      if (!res.ok) {
        setStatus("Not Started");
        return;
      }
      const data = await res.json();
      if (!data.ok) {
        setStatus("Not Started");
        return;
      }
      setStatus(data.progress || "Not Started");
      setRound(data.interview_round || 1);
    } catch (e) {
      setStatus("Not Started");
    }
  };

  const handleStatusClick = async () => {
    await fetchStatus();
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 2500);
  };

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onRowSelect && onRowSelect(candidateId, e.target.checked)}
        />
      </td>

      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>

          <span
            className={`match-label ${matchLevel === "Best match" ? "match-best" : matchLevel === "Good match" ? "match-good" : "match-partial"
              }`}
          >
            {matchLevel}
          </span>

          <div
            className={`bar-fill ${score >= 85 ? "best" : "good"}`}
            style={{ width: barWidth }}
          />
        </div>
      </td>

      <td>{item.designation}</td>
      <td>{item.location}</td>
      <td>{item.phone || "—"}</td>
      <td>{item.email || "—"}</td>
      <td>{item.experience_years ?? "—"} yrs</td>
      <td>{(item.skills || []).join(", ")}</td>

      <td className="actions-cell">
        <div className="action-group">
          <button className="action-btn mail" onClick={() => onSendMail && onSendMail(item)}>
            <Mail size={16} /> Mail
          </button>

          <button
            className={`action-btn whatsapp ${!whatsappAvailable ? "disabled" : ""}`}
            onClick={() => onSendWhatsApp && onSendWhatsApp(item)}
            disabled={!whatsappAvailable}
          >
            <MessageSquare size={16} /> WhatsApp
          </button>

          <button className="action-btn status" onClick={handleStatusClick}>
            <BsGraphUpArrow /> Status
          </button>

          {showStatus && (
            <div className="status-popup">
              <div style={{ fontWeight: "bold" }}>{status}</div>
              <div style={{ marginTop: "4px", fontSize: "13px" }}>
                Round: <b>{round || 1}</b>
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>Status: {status}</div>
            </div>
          )}
          <div className="action-btn-container">
            <button
              className="action-btn bot"
              onClick={() => setShowClientBox(!showClientBox)}
            >
              <Send size={16} /> Send to Client
            </button>

            {showClientBox && (
              <div className="client-inline-row">
                <input
                  type="email"
                  placeholder="Enter client email"
                  className="client-inline-input"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
                <button className="client-inline-send" onClick={sendToClient}>
                  Send
                </button>
              </div>
            )}
          </div>





        </div>
      </td>

      <td className="score">{score}/100</td>

      <td>{whatsappResp?.type === "button" ? whatsappResp.payload : "—"}</td>
    </tr>
  );
};

export default ProfileTable;
