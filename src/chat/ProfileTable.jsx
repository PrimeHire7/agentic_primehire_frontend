
// src/components/ProfileTable.jsx
import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Send, Loader2 } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import "./ProfileTable.css";

const ProfileTable = ({ data = [], index = 0, jdId = null, jdText = "" }) => {
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

  useEffect(() => {
    let mounted = true;
    const fetchResponses = async () => {
      try {
        const res = await fetch(`${API_BASE}/mcp/tools/match/whatsapp/responses`);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (mounted) setResponses(data);
      } catch {
        if (mounted) setWhatsappAvailable(false);
      }
    };

    fetchResponses();
    const i = setInterval(fetchResponses, 20000);
    return () => {
      mounted = false;
      clearInterval(i);
    };
  }, []);

  const prepared = (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    finalScore: item?.scores?.final_score ?? item.finalScore ?? 0,
  }));

  const sortAndFilterMatches = (matches) => {
    let filtered = matches.filter((m) => {
      if (m.finalScore < minScoreFilter) return false;
      if (selectedCategory === "best" && m.finalScore < 85) return false;
      if (selectedCategory === "good" && (m.finalScore < 60 || m.finalScore >= 85)) return false;

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      return (
        (m.name || "").toLowerCase().includes(q) ||
        (Array.isArray(m.skills) ? m.skills.join(", ") : m.skills || "")
          .toLowerCase()
          .includes(q)
      );
    });

    filtered.sort((a, b) =>
      sortConfig.direction === "asc" ? a.finalScore - b.finalScore : b.finalScore - a.finalScore
    );

    return filtered;
  };

  const displayedMatches = sortAndFilterMatches(prepared);

  const summary = { best: 0, good: 0 };
  prepared.forEach((p) => {
    if (p.finalScore >= 85) summary.best++;
    else if (p.finalScore >= 60) summary.good++;
  });

  const deriveId = (it) => it.candidate_id || it.email || it.phone || it._pine_id || it.name || "";

  useEffect(() => {
    setSelectedRows(selectAll ? displayedMatches.map(deriveId) : []);
  }, [selectAll, displayedMatches.length]);

  return (
    <div className="profile-box">
      {/* filters */}
      <div className="filters-row">
        <h2 className="title">🎯 Profile Matches</h2>
        <div className="filter-inputs">
          <input className="input-box" placeholder="Filter by name or skill..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} />
          <input className="input-box small" type="number" min={0} max={100} placeholder="Min Score" value={minScoreFilter} onChange={(e) => setMinScoreFilter(Number(e.target.value))} />
          <button className="sort-btn" onClick={() => setSortConfig(p => ({ ...p, direction: p.direction === "asc" ? "desc" : "asc" }))}>
            Sort {sortConfig.direction === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      <div className="send-review-container">
        <button className="bulk-send-btn" onClick={() => setShowSendMenu(p => !p)}>
          Send ({selectedRows.length})
        </button>

        <div className="review-badges">
          <span className={`badge best ${selectedCategory === "best" ? "active" : ""}`} onClick={() => setSelectedCategory("best")}>🏆 Best ({summary.best})</span>
          <span className={`badge good ${selectedCategory === "good" ? "active" : ""}`} onClick={() => setSelectedCategory("good")}>👍 Good ({summary.good})</span>
        </div>
      </div>
      <div className="over_scrl_table">
        <table className="profiles-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={() => setSelectAll(p => !p)} /></th>
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
            {displayedMatches.map((item, i) => (
              <ProfileTableRow
                key={i}
                item={item}
                jdId={jdId}
                jdText={jdText}
                responses={responses}
                whatsappAvailable={whatsappAvailable}
                isSelected={selectedRows.includes(deriveId(item))}
                onRowSelect={(id, sel) =>
                  setSelectedRows(p => sel ? [...new Set([...p, id])] : p.filter(x => x !== id))
                }
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProfileTableRow = ({ item, jdId, jdText, responses, whatsappAvailable, onRowSelect, isSelected }) => {
  const [showClient, setShowClient] = useState(false);
  const [clientEmail, setClientEmail] = useState("");
  const [mailLoading, setMailLoading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);

  const score = item.finalScore;
  const matchLevel = score >= 85 ? "Best match" : "Good match";
  const barWidth = Math.min(Math.max(score, 5), 100) + "%";
  const candidateId = item.candidate_id || item.email || item.phone || item._pine_id || item.name || "";

  const handleEmailSend = async () => {
    setMailLoading(true);
    await sendMailMessage(item, jdId, jdText);
    setMailLoading(false);
  };

  return (
    <tr>
      <td><input type="checkbox" checked={isSelected} onChange={e => onRowSelect(candidateId, e.target.checked)} /></td>
      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>
          <span className={`match-label ${score >= 85 ? "match-best" : "match-good"}`}>{matchLevel}</span>
          <div className={`bar-fill ${score >= 85 ? "best" : "good"}`} style={{ width: barWidth }} />
        </div>
      </td>
      <td>{item.designation}</td>
      <td>{item.location}</td>
      <td>{item.phone}</td>
      <td>{item.email}</td>
      <td>{item.experience_years}Y</td>
      <td><p className="txt_ht">{(item.skills || []).join(", ")}</p></td>
      <td className="actions-cell">
        <div className="action-group d-flex">
          <button className="action-btn mail" onClick={handleEmailSend} disabled={mailLoading}>
            {mailLoading ? <Loader2 className="spin" /> : <Mail size={16} />}
          </button>
          <button className="action-btn bot" onClick={() => setShowClient(p => !p)}>
            <Send size={16} />
          </button>
          {showClient && (
            <div className="client-mail-box">
              <input className="client-mail-input" placeholder="Client email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} />
            </div>
          )}
        </div>
      </td>
      <td className="score">{score}/100</td>
      <td>—</td>
    </tr>
  );
};

export default ProfileTable;
