// src/components/ProfileTable.jsx
import React, { useState, useEffect } from "react";
import {
  Mail,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { sendMailMessage, sendWhatsAppMessage } from "@/utils/api";
import { API_BASE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { BsGraphUpArrow } from "react-icons/bs";
import "./ProfileTable.css";

const ProfileTable = ({ data = [], index = 0, jdId = null }) => {
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

  useEffect(() => {
    let mounted = true;
    const fetchResponses = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/match/whatsapp/responses`
        );
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (mounted) setResponses(data);
      } catch (err) {
        setWhatsappAvailable(false);
      }
    };

    fetchResponses();
    const i = setInterval(fetchResponses, 20000);
    return () => {
      mounted = false;
      clearInterval(i);
    };
  }, []);

  const prepared = (Array.isArray(data) ? data.slice() : []).map((item) => ({
    ...item,
    finalScore: item?.scores?.final_score ?? item.finalScore ?? 0,
  }));

  const sortAndFilterMatches = (matches) => {
    let filtered = matches.filter((m) => {
      if (m.finalScore < minScoreFilter) return false;

      if (selectedCategory) {
        if (selectedCategory === "best" && m.finalScore < 85) return false;
        if (
          selectedCategory === "good" &&
          (m.finalScore < 60 || m.finalScore >= 85)
        )
          return false;
      }

      if (!filterQuery) return true;

      const q = filterQuery.toLowerCase();
      const name = (m.name || "").toLowerCase();
      const skills = (Array.isArray(m.skills)
        ? m.skills.join(", ")
        : m.skills || ""
      ).toLowerCase();

      return name.includes(q) || skills.includes(q);
    });

    filtered.sort((a, b) =>
      sortConfig.direction === "asc"
        ? a.finalScore - b.finalScore
        : b.finalScore - a.finalScore
    );

    return filtered;
  };

  const displayedMatches = sortAndFilterMatches(prepared);

  const summary = { best: 0, good: 0 };
  prepared.forEach((p) => {
    if (p.finalScore >= 85) summary.best++;
    else if (p.finalScore >= 60) summary.good++;
  });

  const _deriveCandidateId = (it) =>
    it.candidate_id || it.email || it.phone || it._pine_id || it.name || "";

  useEffect(() => {
    setSelectedRows(selectAll ? displayedMatches.map(_deriveCandidateId) : []);
  }, [selectAll, displayedMatches.length]);

  return (
    <div className="profile-box">
      {/* FILTER */}
      <div className="filters-row">
        <h2 className="title">🎯 Profile Matches</h2>

        <div className="filter-inputs">
          <input
            type="text"
            placeholder="Filter by name or skill..."
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

      {/* SEND + BADGES */}
      <div className="send-review-container">
        <button
          className="bulk-send-btn"
          onClick={() => setShowSendMenu(!showSendMenu)}
        >
          Send ({selectedRows.length})
        </button>

        {showSendMenu && (
          <div className="send-dropdown">
            <button className="send-option">
              <Mail size={16} /> Email
            </button>
            <button className="send-option">
              <MessageSquare size={16} /> WhatsApp
            </button>
          </div>
        )}

        <div className="review-badges">
          <span
            className={`badge best ${selectedCategory === "best" && "active"}`}
            onClick={() => setSelectedCategory("best")}
          >
            🏆 Best ({summary.best})
          </span>
          <span
            className={`badge good ${selectedCategory === "good" && "active"}`}
            onClick={() => setSelectedCategory("good")}
          >
            👍 Good ({summary.good})
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
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={() => setSelectAll((prev) => !prev)}
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
            {displayedMatches.map((item, i) => (
              <ProfileTableRow
                key={i}
                item={item}
                jdId={jdId}
                responses={responses}
                whatsappAvailable={whatsappAvailable}
                isSelected={selectedRows.includes(_deriveCandidateId(item))}
                onRowSelect={(id, sel) =>
                  setSelectedRows((prev) =>
                    sel
                      ? [...new Set([...prev, id])]
                      : prev.filter((x) => x !== id)
                  )
                }
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const ProfileTableRow = ({
  item,
  responses = {},
  jdId,
  onRowSelect,
  isSelected,
  whatsappAvailable,
}) => {
  const [showClient, setShowClient] = useState(false);
  const [clientEmail, setClientEmail] = useState("");

  const [mailLoading, setMailLoading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const [statusInfo, setStatusInfo] = useState(null);

  const score = item.finalScore;
  const matchLevel = score >= 85 ? "Best match" : "Good match";
  const barWidth = Math.min(Math.max(score, 5), 100) + "%";

  const candidateId =
    item.candidate_id || item.email || item.phone || item._pine_id || item.name;

  const sendClient = async () => {
    if (!clientEmail.includes("@")) return alert("Enter valid email");

    setClientLoading(true);

    try {
      const payload = {
        client_email: clientEmail.trim(),
        candidate_id: candidateId,
        jd_id: jdId,
      };

      const res = await fetch(`${API_BASE}/mcp/tools/match/send_to_client`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setClientLoading(false);

      if (!res.ok) {
        alert(data.detail || "Failed Send");
        return;
      }

      alert("Client mail sent!");
      setShowClient(false);
      setClientEmail("");
    } catch (err) {
      setClientLoading(false);
      alert("Failed");
    }
  };

  return (
    <tr className="row">
      <td>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onRowSelect(candidateId, e.target.checked)}
        />
      </td>

      <td>
        <div className="name-cell">
          <span className="name">{item.name}</span>

          <span
            className={`match-label ${matchLevel === "Best match"
              ? "match-best"
              : matchLevel === "Good match"
                ? "match-good"
                : "match-partial"
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
      <td>{item.phone}</td>
      <td>{item.email}</td>
      <td>{item.experience_years} Y</td>
      <td>{(item.skills || []).join(", ")}</td>

      {/* ACTIONS */}
      <td className="actions-cell">
        <div className="action-group">
          {/* MAIL */}
          <button
            className="action-btn mail"
            disabled={mailLoading}
            onClick={async () => {
              setMailLoading(true);
              await sendMailMessage(item, jdId);
              setMailLoading(false);
            }}
          >
            {mailLoading ? <Loader2 className="spin" /> : <Mail size={16} />}
            Mail
          </button>

          {/* WHATSAPP */}
          <button
            className={`action-btn whatsapp ${!whatsappAvailable ? "disabled" : ""
              }`}
            disabled={waLoading || !whatsappAvailable}
            onClick={async () => {
              setWaLoading(true);
              await sendWhatsAppMessage(item, jdId);
              setWaLoading(false);
            }}
          >
            {waLoading ? (
              <Loader2 className="spin" />
            ) : (
              <MessageSquare size={16} />
            )}
            WhatsApp
          </button>

          {/* STATUS */}
          <button
            className="action-btn status"
            disabled={statusLoading}
            onClick={async () => {
              setStatusLoading(true);
              const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/scheduler/latest_attempt/${item.phone}/${jdId}`
              );
              const data = await res.json();
              setStatusInfo(data);
              setStatusLoading(false);
            }}
          >
            {statusLoading ? (
              <Loader2 className="spin" />
            ) : (
              <BsGraphUpArrow size={16} />
            )}
            Status
          </button>

          {statusInfo && (
            <div className="status-popup">
              <div>{statusInfo.progress || "Not Started"}</div>
              <div>Round: {statusInfo.interview_round || 1}</div>
            </div>
          )}

          {/* SEND TO CLIENT INLINE */}
          <button
            className="action-btn bot"
            onClick={() => setShowClient(!showClient)}
          >
            <Send size={16} />
            Send to Client
          </button>

          {showClient && (
            <div className="client-inline-row">
              <input
                type="email"
                placeholder="Client email"
                value={clientEmail}
                className="client-inline-input"
                onChange={(e) => setClientEmail(e.target.value)}
              />
              <button
                className="client-inline-send"
                disabled={clientLoading}
                onClick={sendClient}
              >
                {clientLoading ? <Loader2 className="spin" /> : "Send"}
              </button>
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
