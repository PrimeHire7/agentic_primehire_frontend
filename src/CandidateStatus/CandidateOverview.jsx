
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./CandidateOverview.css";
import logo from "../assets/primehire_logo.png";

/* =========================
   STRIP JD HTML (YOUR FN)
========================= */
function stripHtml(html) {
    if (!html) return "";

    html = html.replace(/📋\s*Copy JD/gi, "");
    html = html.replace(/<button[\s\S]*?<\/button>/gi, "");
    html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");
    html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
    html = html.replace(/<li>/gi, "- ");
    html = html.replace(/<br\s*\/?>/gi, "\n");
    html = html.replace(/<\/p>/gi, "\n");
    html = html.replace(/<\/h[1-6]>/gi, "\n");
    html = html.replace(/<[^>]+>/g, "");
    html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

    return html.trim();
}

export default function CandidateOverview() {
    const { id } = useParams(); // attempt_id
    const [data, setData] = useState(null);

    /* ---------------- FETCH DETAILS ---------------- */
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(
                    `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`
                );
                const json = await res.json();
                if (json.ok) setData(json);
            } catch (e) {
                console.error("Failed to load candidate overview", e);
            }
        })();
    }, [id]);

    if (!data) return <p>Loading...</p>;

    const attempt = data.attempt || {};
    const candidate = data.candidate || {};
    const jd = data.jd || {};

    /* ---------------- RESOLVE EVALUATION ---------------- */
    const evaluation = data.evaluation || {};


    const {
        technical = 0,
        communication = 0,
        behaviour = 0,
        mcq = null,
        coding = null,
        per_question = []
    } = evaluation;

    /* ---------------- RESOLVE ANOMALY COUNTS ---------------- */
    const anomalyCounts = {};
    (attempt.anomalies || []).forEach(a => {
        if (!a.type) return;
        anomalyCounts[a.type] = (anomalyCounts[a.type] || 0) + 1;
    });

    const resolvedName =
        candidate.full_name ||
        attempt.candidate_id?.split("@")[0] ||
        "Candidate";

    const resolvedEmail =
        candidate.email || attempt.candidate_id || "—";

    const cleanJD = stripHtml(jd.jd_text || "");

    const isScheduled = attempt.status === "SCHEDULED";
    const isInProgress = attempt.status === "IN_PROGRESS";
    const isCompleted = attempt.status === "COMPLETED" || attempt.status === "LOCKED";

    return (
        <div className="candidate-status-container">
            {/* HEADER */}
            <Link to="/">
                <div className="top-header1">
                    <img src={logo} alt="PrimeHire" className="top-logo2" />
                </div>
            </Link>

            <h2 className="title">Candidate Overview</h2>

            <div className="status-card">

                {/* ================= LEFT ================= */}
                <div className="profile-section">
                    <div className="profile-img-placeholder">
                        {resolvedName.charAt(0).toUpperCase()}
                    </div>

                    <h3 className="candidate-name">{resolvedName}</h3>
                    <p className="candidate-role">
                        {jd.designation || "Role not specified"}
                    </p>

                    <div className="interview-score">
                        <span className={`status-pill status-${attempt.status?.toLowerCase()}`}>
                            {attempt.status}
                        </span>
                        <span className="score">
                            Final Score: {attempt.interview_score ?? "—"}
                        </span>
                    </div>

                    <p className="contact-email">{resolvedEmail}</p>
                </div>

                {/* ================= RIGHT ================= */}
                <div className="content-section">

                    {/* JD DETAILS */}
                    <div className="box">
                        <h4>Job Description</h4>
                        <pre className="jd-text">{cleanJD || "—"}</pre>
                    </div>

                    {/* PROGRESS */}
                    <div className="box">
                        <h4>Interview Progress</h4>
                        <div className="progress-bar">
                            <div className={`step active`} />
                            <div className={`step ${isInProgress || isCompleted ? "active" : ""}`} />
                            <div className={`step ${isCompleted ? "active" : ""}`} />
                        </div>
                        <div className="progress-labels">
                            <span>Scheduled</span>
                            <span>Interviewed</span>
                            <span>Completed</span>
                        </div>
                    </div>

                    {/* SCORE BREAKDOWN */}
                    <div className="box half">
                        <h4>Score Breakdown</h4>
                        <p>Technical <span>{technical}</span></p>
                        <p>Communication <span>{communication}</span></p>
                        <p>Behaviour <span>{behaviour}</span></p>
                    </div>

                    {/* MCQ */}
                    <div className="box">
                        <h4>MCQ Evaluation</h4>
                        {!mcq ? (
                            <p>No MCQ data.</p>
                        ) : (
                            <p>
                                Score: <strong>{mcq.score}/{mcq.total}</strong>
                            </p>
                        )}
                    </div>

                    {/* CODING */}
                    <div className="box">
                        <h4>Coding Test</h4>
                        {!coding ? (
                            <p>No coding test.</p>
                        ) : (
                            <>
                                <p>Score: <strong>{coding.score}</strong></p>
                                <pre className="code">
                                    {coding.solution || "No solution submitted"}
                                </pre>
                            </>
                        )}
                    </div>

                    {/* AI INTERVIEW */}
                    <div className="box">
                        <h4>AI Interview (Q & A)</h4>
                        {per_question.length === 0 ? (
                            <p>No AI interview responses.</p>
                        ) : (
                            per_question.map((q, i) => (
                                <div key={i} className="qa-block">
                                    <p><strong>Q:</strong> {q.question}</p>
                                    <p><strong>A:</strong> {q.answer}</p>
                                </div>
                            ))
                        )}
                    </div>
                    {/* ================= METADATA ================= */}
                    <div className="box half">
                        <h4>Metadata</h4>

                        <p>
                            Created
                            <span>
                                {attempt.created_at
                                    ? new Date(attempt.created_at).toLocaleString()
                                    : "—"}
                            </span>
                        </p>

                        <p>
                            Updated
                            <span>
                                {attempt.updated_at
                                    ? new Date(attempt.updated_at).toLocaleString()
                                    : "—"}
                            </span>
                        </p>

                        <p>Token</p>
                        <span className="token-text">
                            {attempt.interview_token || "—"}
                        </span>
                    </div>

                    {/* ANOMALIES (COUNTS ONLY) */}
                    <div className="box">
                        <h4>Anomalies Detected</h4>
                        {Object.keys(anomalyCounts).length === 0 ? (
                            <p>No anomalies detected.</p>
                        ) : (
                            <div className="anomaly-count-grid">
                                {Object.entries(anomalyCounts).map(([k, v]) => (
                                    <div key={k} className="anomaly-pill">
                                        <strong>{k.replace(/_/g, " ")}</strong>
                                        <span>{v}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
