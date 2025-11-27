import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Bot } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import "./ProfileTable.css";

/* ========================= AUTO SCORE ========================= */
const calculateAutoScore = (item) => {
  if (item.experience_years >= 6) return Math.floor(Math.random() * 10) + 90;
  if (item.experience_years >= 2 && item.experience_years <= 3)
    return Math.floor(Math.random() * 10) + 60;
  if (item.experience_years === 0) return Math.floor(Math.random() * 20) + 30;
  return Math.floor(Math.random() * 20) + 50;
};

/* ========================= MAIN TABLE ========================= */
const ProfileTable = ({ data, index, jdId }) => {
  const [filterQuery, setFilterQuery] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortConfig, setSortConfig] = useState({
    key: "finalScore",
    direction: "desc",
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [responses, setResponses] = useState({});
  const [whatsappAvailable, setWhatsappAvailable] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showSendMenu, setShowSendMenu] = useState(false);

  const navigate = useNavigate();
  
  /* ========================= AI INTERVIEW ========================= */
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

  

  /* ========================= SELECT ALL ========================= */
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(displayedMatches.map((item) => item));
    }
    setSelectAll(!selectAll);
  };

  /* ========================= SELECT ONE ========================= */
  const handleRowSelect = (item) => {
    const exists = selectedRows.find((x) => x.phone === item.phone);

    if (exists) {
      setSelectedRows(selectedRows.filter((x) => x.phone !== item.phone));
    } else {
      setSelectedRows([...selectedRows, item]);
    }
  };

  /* ========================= BULK SEND ========================= */
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

  /* ========================= SORT + FILTER ========================= */
  const sortAndFilterMatches = (matches) => {
    if (!Array.isArray(matches)) return [];

    const getNestedValue = (obj, key) =>
      key.split(".").reduce((acc, k) => (acc ? acc[k] : undefined), obj);

    const filtered = matches.filter((m) => {
      if (typeof m?.scores?.final_score === "number" && m.scores.final_score < minScoreFilter)
        return false;

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      const nameOk = (m.name || "").toLowerCase().includes(q);
      const skillsOk = (
        Array.isArray(m.skills) ? m.skills.join(", ") : m.skills || ""
      ).toLowerCase().includes(q);

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

  /* ========================= WHATSAPP RESPONSES ========================= */
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

  /* ========================= AUTO SCORE ========================= */
  data.forEach((item) => {
    item.finalScore = item?.scores?.final_score ?? 0;
  });


  let displayedMatches = sortAndFilterMatches(data || []);

  if (selectedCategory) {
    displayedMatches = displayedMatches.filter((item) => {
      const score = item.autoScore;
      if (selectedCategory === "best") return item.finalScore >= 85;
      if (selectedCategory === "good") return item.finalScore >= 60 && item.finalScore < 85;
      if (selectedCategory === "partial") return item.finalScore < 60;

      return true;
    });
  }

  /* ========================= SUMMARY ========================= */
  const summary = { best: 0, good: 0, partial: 0 };
  data.forEach((item) => {
    if (item.finalScore >= 85) summary.best++;
    else if (item.finalScore >= 60) summary.good++;
    else summary.partial++;

  });

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

      {/* SEND + BADGES ROW */}
      <div className="send-review-container">

        {/* SEND BUTTON */}
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
                <Mail size={16} /> Email
              </button>

              <button
                className="send-option action-style"
                onClick={() => handleBulkSend("whatsapp")}
              >
                <MessageSquare size={16} /> WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* BADGES */}
        <div className="review-badges">
          <span
            className={`badge best ${selectedCategory === "best" ? "active" : ""}`}
            onClick={() => setSelectedCategory("best")}
          >
            🏆 Best ({summary.best})
          </span>

          <span
            className={`badge good ${selectedCategory === "good" ? "active" : ""}`}
            onClick={() => setSelectedCategory("good")}
          >
            👍 Good ({summary.good})
          </span>

          <span
            className={`badge partial ${selectedCategory === "partial" ? "active" : ""}`}
            onClick={() => setSelectedCategory("partial")}
          >
            ⚙ Partial ({summary.partial})
          </span>
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

    </div>
  );
};

/* ========================= ROW COMPONENT ========================= */
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

  const [status, setStatus] = useState("Not Started");
  const [round, setRound] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  // ========================= FETCH STATUS =========================
  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/jd_history/scheduler/latest_attempt/${item.phone}`
      );
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

  const getStatusBadge = () => {
    const s = status.toLowerCase();

    if (s.includes("completed"))
      return <span className="badge completed">Completed</span>;

    if (s.includes("progress"))
      return <span className="badge in-progress">In Progress</span>;

    if (s.includes("scheduled"))
      return <span className="badge scheduled">Scheduled</span>;

    return <span className="badge not-started">Not Started</span>;
  };

  // ========================= CHECK WHEN CLICKING =========================
  const handleStatusClick = async () => {
    await fetchStatus();
    setShowStatus(true);

    setTimeout(() => setShowStatus(false), 2500);
  };

  const normalizedPhone = (item.phone || "").replace(/\D/g, "");
  const whatsappResp = responses[normalizedPhone] || {};

  const score = item.finalScore ?? 0;

  const matchLevel =
    score >= 85 ? "Best match" :
      score >= 60 ? "Good match" : "Partial match";

  const barWidth = Math.min(Math.max(score, 5), 100) + "%";

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
          <span
            className={`match-label ${
              matchLevel === "Best match"
                ? "match-best"
                : matchLevel === "Good match"
                ? "match-good"
                : "match-partial"
            }`}
          >
            {matchLevel}
          </span>

          <div className="match-bar">
            <div
              className={`bar-fill ${
                matchLevel === "Best match"
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

          <button className="action-btn mail" onClick={() => onSendMail(item)}>
            <Mail size={16} /> Mail
          </button>

          <button
            className={`action-btn whatsapp ${!whatsappAvailable ? "disabled" : ""}`}
            onClick={() => onSendWhatsApp(item)}
            disabled={!whatsappAvailable}
          >
            <MessageSquare size={16} /> WhatsApp
          </button>

          {/* STATUS BUTTON */}
          <button className="action-btn status" onClick={handleStatusClick}>
            <BsGraphUpArrow /> Status
          </button>

          {/* STATUS POPUP */}
          {showStatus && (
            <div className="status-popup">
              <div style={{ fontWeight: "bold" }}>{getStatusBadge()}</div>
              <div style={{ marginTop: "4px", fontSize: "13px" }}>
                Round: <b>{round || 1}</b>
              </div>
              <div style={{ fontSize: "12px", opacity: 0.7 }}>
                Status: {status}
              </div>
            </div>
          )}
        </div>
      </td>

      <td className="score">{item.finalScore.toFixed(0)} / 100</td>

      <td>{whatsappResp?.type === "button" ? whatsappResp.payload : "—"}</td>
    </tr>
  );
};


export default ProfileTable;
