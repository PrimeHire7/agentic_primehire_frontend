import React, { useState, useEffect } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import "./ProfileTable.css";

/* ===========================================================
   MAIN TABLE COMPONENT
   =========================================================== */
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

  const navigate = useNavigate();

  /* ------------------- FETCH WHATSAPP RESPONSES ------------------- */
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

  /* ------------------- PREPROCESS MATCHES ------------------- */
  data.forEach((item) => {
    item.finalScore = item?.scores?.final_score ?? 0;
  });

  const sortAndFilterMatches = (matches) => {
    if (!Array.isArray(matches)) return [];

    const filtered = matches.filter((m) => {
      if (m.finalScore < minScoreFilter) return false;

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      const nameOk = (m.name || "").toLowerCase().includes(q);
      const skillsOk = (Array.isArray(m.skills) ? m.skills.join(", ") : m.skills || "").toLowerCase().includes(q);

      return nameOk || skillsOk;
    });

    return filtered.sort((a, b) =>
      sortConfig.direction === "asc" ? a.finalScore - b.finalScore : b.finalScore - a.finalScore
    );
  };

  const displayedMatches = sortAndFilterMatches(data);

  return (
    <div key={index} className="profile-box">
      {/* ------------------- FILTERS ------------------- */}
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

      {/* ------------------- TABLE ------------------- */}
      {displayedMatches.length === 0 ? (
        <p>No matching profiles.</p>
      ) : (
        <table className="profiles-table">
          <thead>
            <tr>
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
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ===========================================================
   ROW COMPONENT
   =========================================================== */
const ProfileTableRow = ({
  item,
  responses,
  onSendMail,
  onSendWhatsApp,
  whatsappAvailable,
  jdId,
}) => {
  /* ------------------- CLIENT SEND BOX ------------------- */
  const [showClientBox, setShowClientBox] = useState(false);
  const [clientEmail, setClientEmail] = useState("");

  /* ------------------- STATUS ------------------- */
  const [status, setStatus] = useState("Not Started");
  const [round, setRound] = useState(null);
  const [showStatus, setShowStatus] = useState(false);

  /* ------------------- SEND TO CLIENT ------------------- */
  const sendToClient = async () => {
  if (!clientEmail) return alert("Enter client email!");

  const payload = {
    client_email: String(clientEmail).trim(),
    candidate_id: String(item.candidate_id || item.phone || item.email || ""),
    jd_id: jdId
  };

  console.log("📤 Sending Payload:", payload);

  const res = await fetch(`${API_BASE}/mcp/tools/match/send_to_client`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("📥 DEBUG DATA:", data);

  alert("Sent to debug endpoint!");
};




  /* ------------------- STATUS FETCH ------------------- */
  const fetchStatus = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/jd_history/scheduler/latest_attempt/${item.phone}/${jdId}`
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

  const handleStatusClick = async () => {
    await fetchStatus();
    setShowStatus(true);
    setTimeout(() => setShowStatus(false), 2500);
  };

  /* ------------------- MATCH UI ------------------- */
  const score = item.finalScore ?? 0;
  const normalizedPhone = (item.phone || "").replace(/\D/g, "");
  const whatsappResp = responses[normalizedPhone] || {};

  return (
    <tr>
      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>

          <div className="match-bar">
            <div
              className={`bar-fill ${score >= 85 ? "best" : score >= 60 ? "good" : "partial"}`}
              style={{ width: `${score}%` }}
            ></div>
          </div>
        </div>
      </td>

      <td>{item.designation}</td>
      <td>{item.location}</td>
      <td>{item.phone || "—"}</td>
      <td>{item.email || "—"}</td>
      <td>{item.experience_years} yrs</td>
      <td>{(item.skills || []).join(", ")}</td>

      {/* ACTIONS */}
      <td className="actions-cell">
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

        <button className="action-btn status" onClick={handleStatusClick}>
          <BsGraphUpArrow /> Status
        </button>

        {/* STATUS POPUP */}
        {showStatus && (
          <div className="status-popup">
            <div style={{ fontWeight: "bold" }}>{status}</div>
            <div style={{ fontSize: "12px" }}>Round: {round || 1}</div>
          </div>
        )}

        {/* CLIENT SEND */}
        <div style={{ position: "relative" }}>
          <button className="action-btn bot" onClick={() => setShowClientBox(!showClientBox)}>
            <Send size={16} /> Client
          </button>

          {showClientBox && (
            <div className="client-mail-box">
              <input
                type="email"
                placeholder="Enter client email"
                className="client-mail-input"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
              <button className="client-mail-send-btn" onClick={sendToClient}>
                Send
              </button>
            </div>
          )}
        </div>
      </td>

      <td className="score">{score}/100</td>
      <td>{whatsappResp?.type === "button" ? whatsappResp.payload : "—"}</td>
    </tr>
  );
};

export default ProfileTable;
