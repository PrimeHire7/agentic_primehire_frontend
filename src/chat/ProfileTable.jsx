import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Bot } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import "./ProfileTable.css";

/* ========================= SCORE (MOVED TO TOP) ========================= */
const calculateAutoScore = (item) => {
  if (item.experience_years >= 6)
    return Math.floor(Math.random() * 10) + 90;
  if (item.experience_years >= 2 && item.experience_years <= 3)
    return Math.floor(Math.random() * 10) + 60;
  if (item.experience_years === 0)
    return Math.floor(Math.random() * 20) + 30;
  return Math.floor(Math.random() * 20) + 50;
};


const ProfileTable = ({ data, index, jdId }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "scores.final_score",
    direction: "desc",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responses, setResponses] = useState({});
  const [whatsappAvailable, setWhatsappAvailable] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [showSendMenu, setShowSendMenu] = useState(false);

  const navigate = useNavigate();

  // ⭐ AI INTERVIEW BUTTON (correct JD routing)
  const handleStartAIInterview = async (item) => {
    if (!jdId) return alert("No JD ID found for this match!");

    const jdRes = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`);
    const jdData = await jdRes.json();

    if (!jdData?.jd_text) return alert("JD not found!");

    navigate("/validation", {
      state: {
        candidateName: item.name,
        candidateId: item.phone,
        jd_id: jdId,
        jd_text: jdData.jd_text,
      },
    });
  };

  // ⭐ SELECT ALL
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayedMatches.map((item) => item));
    }
    setSelectAll(!selectAll);
  };

  // ⭐ SINGLE ROW SELECT
  const handleRowSelect = (item) => {
    const exists = selectedRows.find((x) => x.phone === item.phone);

    if (exists) {
      setSelectedRows(selectedRows.filter((x) => x.phone !== item.phone));
    } else {
      setSelectedRows([...selectedRows, item]);
    }
  };

  // ⭐ BULK SEND EMAIL / WHATSAPP
  const handleBulkSend = async (type) => {
    if (selectedRows.length === 0)
      return alert("Please select at least one candidate.");

    for (const item of selectedRows) {
      try {
        if (type === "email") await sendMailMessage(item, jdId);
        if (type === "whatsapp") await sendWhatsAppMessage(item, jdId);
      } catch (err) {
        console.error("Send failed:", err);
      }
    }

    alert(`Successfully sent ${type} to ${selectedRows.length} candidate(s)`);
    setShowSendMenu(false);
  };

  // ⭐ SORT + FILTER
  const sortAndFilterMatches = (matches) => {
    if (!Array.isArray(matches)) return [];

    const getNestedValue = (obj, key) =>
      key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

    const filtered = matches.filter((m) => {
      if (
        typeof m?.scores?.final_score === "number" &&
        m.scores.final_score < minScoreFilter
      )
        return false;

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      const nameOk = (m.name || "").toLowerCase().includes(q);
      const skillsOk = (Array.isArray(m.skills)
        ? m.skills.join(", ")
        : m.skills || ""
      )
        .toLowerCase()
        .includes(q);

      return nameOk || skillsOk;
    });

    const sorted = filtered.sort((a, b) => {
      const aVal = getNestedValue(a, sortConfig.key) ?? 0;
      const bVal = getNestedValue(b, sortConfig.key) ?? 0;

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // ⭐ Fetch WhatsApp responses
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch(`${API_BASE}/mcp/tools/match/whatsapp/responses`);
        if (res.ok) {
          const data = await res.json();
          setResponses(data);
        }
      } catch {
        setWhatsappAvailable(false);
      }
    };

    fetchResponses();
    const interval = setInterval(fetchResponses, 20000);
    return () => clearInterval(interval);
  }, []);

  let displayedMatches = sortAndFilterMatches(data || []);

  if (selectedCategory) {
    displayedMatches = displayedMatches.filter((item) => {
      const score = item.autoScore;
      if (selectedCategory === "best") return score >= 85;
      if (selectedCategory === "good") return score >= 60 && score < 85;
      if (selectedCategory === "partial") return score < 60;
      return true;
    });
  }

  // ⭐ Summary counts
  const summary = { best: 0, good: 0, partial: 0 };
  data.forEach((item) => {
    const autoScore = calculateAutoScore(item);
    item.autoScore = autoScore;

    if (autoScore >= 85) summary.best++;
    else if (autoScore >= 60) summary.good++;
    else summary.partial++;
  });

  return (
    <div key={index} className="profile-box">
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
            step={1}
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
              setSortConfig((prev) => ({
                key: prev.key,
                direction: prev.direction === "asc" ? "desc" : "asc",
              }))
            }
          >
            Sort: {sortConfig.direction === "asc" ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ============= SEND DROPDOWN ============= */}
      <div className="bulk-send-container">
        <div className="bulk-send-wrapper">
          <button
            className="bulk-send-btn"
            onClick={() => setShowSendMenu((prev) => !prev)}
          >
            Send ({selectedRows.length})
          </button>

          {showSendMenu && (
            <div className="send-dropdown">
              <button
                className="send-option action-style"
                onClick={() => handleBulkSend("email")}
              >
                <Mail size={16} /> <span>Email</span>
              </button>
              <button
                className="send-option action-style"
                onClick={() => handleBulkSend("whatsapp")}
              >
                <MessageSquare size={16} /> <span>WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============= TABLE ============= */}
      {displayedMatches.length === 0 ? (
        <p>No matching profiles.</p>
      ) : (
        <table className="profiles-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
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
                onSendMail={(item) => sendMailMessage(item, jdId)}
                onSendWhatsApp={(item) => sendWhatsAppMessage(item, jdId)}
                whatsappAvailable={whatsappAvailable}
                onRowSelect={handleRowSelect}
                isSelected={selectedRows.some((x) => x.phone === item.phone)}
                onStartInterview={handleStartAIInterview}
              />


            ))}
          </tbody>
        </table>
      )}

      <ReviewSummary
        summary={summary}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
    </div>
  );
};

/* ========================= ROW ========================= */
const ProfileTableRow = ({
  item,
  responses,
  onSendMail,
  onSendWhatsApp,
  whatsappAvailable,
  onRowSelect,
  isSelected,
  jdId,
  onStartInterview,
}) => {
  const normalizedPhone = (item.phone || "").replace(/\D/g, "");
  const whatsappResp = responses[normalizedPhone] || {};

  const matchLevel =
    item.autoScore >= 85
      ? "Best match"
      : item.autoScore >= 60
        ? "Good match"
        : "Partial match";

  const barWidth = Math.min(Math.max(item.autoScore, 5), 100) + "%";

  return (
    <tr>
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onRowSelect(item)}
        />
      </td>

      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>
          <span className={`match-label ${matchLevel === "Best match"
            ? "match-best"
            : matchLevel === "Good match"
              ? "match-good"
              : "match-partial"
            }`}>
            {matchLevel}
          </span>

          <div className="match-bar">
            <div
              className={`bar-fill ${matchLevel === "Best match"
                ? "best"
                : matchLevel === "Good match"
                  ? "good"
                  : "partial"
                }`}
              style={{ width: barWidth }}
            />
          </div>
        </div>
      </td>

      <td>{item.designation}</td>
      <td>{item.location}</td>
      <td>{item.phone || "—"}</td>
      <td>{item.email || "—"}</td>
      <td>{item.experience_years} yrs</td>
      <td>{(item.skills || []).join(", ")}</td>

      <td className="actions-cell">
        <div className="action-group">
          {/* EMAIL */}
          <button className="action-btn mail" onClick={() => sendMailMessage(item, jdId)}>
            <Mail size={16} /> Mail
          </button>

          {/* WHATSAPP */}
          <button
            className={`action-btn whatsapp ${!whatsappAvailable ? "disabled" : ""}`}
            onClick={() => onSendWhatsApp(item, jdId)}
            disabled={!whatsappAvailable}
          >
            <MessageSquare size={16} /> WhatsApp
          </button>

          {/* AI INTERVIEW */}
          <button className="action-btn bot" onClick={() => onStartInterview(item)}>
            <Bot size={16} /> AI
          </button>
        </div>
      </td>

      <td className="score">{item.autoScore}/100</td>

      <td>{whatsappResp?.type === "button" ? whatsappResp.payload : "—"}</td>
    </tr>
  );
};

/* ========================= SUMMARY ========================= */
const ReviewSummary = ({ summary, selectedCategory, onCategorySelect }) => (
  <div className="summary-box">
    <div className="review-cards">
      {["best", "good", "partial"].map((type) => (
        <div
          key={type}
          className={`review-card ${selectedCategory === type ? "active" : ""}`}
          onClick={() => onCategorySelect(type)}
        >
          <h4>
            {type === "best"
              ? "🏆 Best Matches"
              : type === "good"
                ? "👍 Good Matches"
                : "⚙ Partial Matches"}
          </h4>
          <p>{summary[type]} profiles</p>
        </div>
      ))}
    </div>
  </div>
);

/* ========================= SCORE ========================= */

export default ProfileTable;
