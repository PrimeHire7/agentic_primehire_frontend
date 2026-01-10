// // import React, { useEffect, useState, useRef } from "react";
// // import { useParams, Link } from "react-router-dom";
// // import { API_BASE } from "@/utils/constants";
// // import "./CandidateOverview.css";
// // import logo from "../assets/primehire_logo.png";

// // /* =========================
// //    STRIP JD HTML
// // ========================= */
// // function stripHtml(html) {
// //     if (!html) return "";

// //     html = html.replace(/📋\s*Copy JD/gi, "");
// //     html = html.replace(/<button[\s\S]*?<\/button>/gi, "");
// //     html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");
// //     html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
// //     html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
// //     html = html.replace(/<li>/gi, "- ");
// //     html = html.replace(/<br\s*\/?>/gi, "\n");
// //     html = html.replace(/<\/p>/gi, "\n");
// //     html = html.replace(/<\/h[1-6]>/gi, "\n");
// //     html = html.replace(/<[^>]+>/g, "");
// //     html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

// //     return html.trim();
// // }

// // /* =========================
// //    STATUS → STAGE
// // ========================= */
// // function resolveStage(status) {
// //     switch ((status || "").toUpperCase()) {
// //         case "SCHEDULED":
// //             return 1;
// //         case "IN_PROGRESS":
// //             return 2;
// //         case "COMPLETED":
// //         case "LOCKED":
// //         case "EXPIRED":
// //             return 3;
// //         default:
// //             return 1;
// //     }
// // }

// // export default function CandidateOverview() {
// //     const { id } = useParams(); // attempt_id
// //     const [data, setData] = useState(null);
// //     const prevStatusRef = useRef(null);

// //     async function fetchData() {
// //         try {
// //             const res = await fetch(
// //                 `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}`
// //             );
// //             const json = await res.json();
// //             if (json.ok) {
// //                 setData(prev => {
// //                     if (!prev || prev.attempt?.status !== json.attempt?.status) {
// //                         return json;
// //                     }
// //                     return prev;
// //                 });
// //             }
// //         } catch (e) {
// //             console.error("Failed to load candidate overview", e);
// //         }
// //     }

// //     /* Initial load */
// //     useEffect(() => {
// //         fetchData();
// //     }, [id]);

// //     /* Poll every 5s */
// //     useEffect(() => {
// //         const interval = setInterval(fetchData, 5000);
// //         return () => clearInterval(interval);
// //     }, [id]);

// //     if (!data) return <p>Loading...</p>;

// //     const attempt = data.attempt || {};
// //     const candidate = data.candidate || {};
// //     const jd = data.jd || {};
// //     const evaluation = data.evaluation || {};

// //     const {
// //         technical = 0,
// //         communication = 0,
// //         behaviour = 0,
// //         mcq = null,
// //         coding = null,
// //         per_question = []
// //     } = evaluation;

// //     const anomalyCounts = {};
// //     (attempt.anomalies || []).forEach(a => {
// //         if (!a.type) return;
// //         anomalyCounts[a.type] = (anomalyCounts[a.type] || 0) + 1;
// //     });

// //     const resolvedName =
// //         candidate.full_name ||
// //         attempt.candidate_id?.split("@")[0] ||
// //         "Candidate";

// //     const resolvedEmail =
// //         candidate.email || attempt.candidate_id || "—";

// //     const cleanJD = stripHtml(jd.jd_text || "");
// //     // const stage = resolveStage(attempt.status);
// //     const stage = 2;
// //     return (
// //         <div className="candidate-status-container">
// //             <Link to="/">
// //                 <div className="top-header1">
// //                     <img src={logo} alt="PrimeHire" className="top-logo2" />
// //                 </div>
// //             </Link>

// //             <h2 className="title">Candidate Overview</h2>

// //             <div className="status-card">
// //                 {/* LEFT */}
// //                 <div className="profile-section">
// //                     <div className="profile-img-placeholder">
// //                         {resolvedName.charAt(0).toUpperCase()}
// //                     </div>

// //                     <h3 className="candidate-name">{resolvedName}</h3>
// //                     <p className="candidate-role">
// //                         {jd.designation || "Role not specified"}
// //                     </p>

// //                     <div className="interview-score">
// //                         <span className={`status-pill status-${attempt.status?.toLowerCase()}`}>
// //                             {attempt.status}
// //                         </span>
// //                         <span className="score">
// //                             Final Score: {attempt.interview_score ?? "—"}
// //                         </span>
// //                     </div>

// //                     <p className="contact-email">{resolvedEmail}</p>
// //                 </div>

// //                 {/* RIGHT */}
// //                 <div className="content-section">
// //                     <div className="box">
// //                         <h4>Job Description</h4>
// //                         <pre className="jd-text">{cleanJD || "—"}</pre>
// //                     </div>

// //                     <div className="box">
// //                         <h4>Interview Progress</h4>
// //                         <div className="progress-bar">
// //                             <div className={`step ${stage >= 1 ? "active" : ""}`} />
// //                             <div className={`step ${stage >= 2 ? "active" : ""}`} />
// //                             <div className={`step ${stage >= 3 ? "active" : ""}`} />
// //                         </div>
// //                         <div className="progress-labels">
// //                             <span>Scheduled</span>
// //                             <span>Interviewed</span>
// //                             <span>Completed</span>
// //                         </div>
// //                     </div>

// //                     <div className="box half">
// //                         <h4>Score Breakdown</h4>
// //                         <p>Technical <span>{technical}</span></p>
// //                         <p>Communication <span>{communication}</span></p>
// //                         <p>Behaviour <span>{behaviour}</span></p>
// //                     </div>

// //                     <div className="box">
// //                         <h4>MCQ Evaluation</h4>
// //                         {!mcq ? <p>No MCQ data.</p> : <p>Score: <strong>{mcq.score}/{mcq.total}</strong></p>}
// //                     </div>

// //                     <div className="box">
// //                         <h4>Coding Test</h4>
// //                         {!coding ? <p>No coding test.</p> : (
// //                             <>
// //                                 <p>Score: <strong>{coding.score}</strong></p>
// //                                 <pre className="code">{coding.solution || "No solution submitted"}</pre>
// //                             </>
// //                         )}
// //                     </div>

// //                     <div className="box">
// //                         <h4>AI Interview (Q & A)</h4>
// //                         {per_question.length === 0 ? <p>No AI interview responses.</p> :
// //                             per_question.map((q, i) => (
// //                                 <div key={i} className="qa-block">
// //                                     <p><strong>Q:</strong> {q.question}</p>
// //                                     <p><strong>A:</strong> {q.answer}</p>
// //                                 </div>
// //                             ))
// //                         }
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";
// import "./CandidateOverview.css";
// import logo from "../assets/primehire_logo.png";

// /* =========================
//    STRIP JD HTML
// ========================= */
// function stripHtml(html) {
//     if (!html) return "";
//     html = html.replace(/📋\s*Copy JD/gi, "");
//     html = html.replace(/<button[\s\S]*?<\/button>/gi, "");
//     html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");
//     html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
//     html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
//     html = html.replace(/<li>/gi, "- ");
//     html = html.replace(/<br\s*\/?>/gi, "\n");
//     html = html.replace(/<\/p>/gi, "\n");
//     html = html.replace(/<\/h[1-6]>/gi, "\n");
//     html = html.replace(/<[^>]+>/g, "");
//     html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");
//     return html.trim();
// }

// /* =========================
//    STATUS → STAGE
// ========================= */
// function resolveStage(status) {
//     switch ((status || "").toUpperCase()) {
//         case "SCHEDULED":
//             return 1;
//         case "IN_PROGRESS":
//             return 2;
//         case "COMPLETED":
//         case "LOCKED":
//         case "EXPIRED":
//             return 3;
//         default:
//             return 1;
//     }
// }

// export default function CandidateOverview() {
//     const { id } = useParams();
//     const [data, setData] = useState(null);
//     const [stage, setStage] = useState(1);

//     async function fetchData() {
//         try {
//             const res = await fetch(
//                 `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}?_=${Date.now()}`,
//                 { cache: "no-store" }
//             );
//             const json = await res.json();
//             if (json.ok) {
//                 setData(json);
//                 setStage(resolveStage(json.attempt?.status));
//             }
//         } catch (e) {
//             console.error("Failed to load candidate overview", e);
//         }
//     }

//     useEffect(() => {
//         fetchData();
//         const interval = setInterval(fetchData, 3000);
//         return () => clearInterval(interval);
//     }, [id]);

//     if (!data) return <p>Loading...</p>;

//     const attempt = data.attempt || {};
//     const candidate = data.candidate || {};
//     const jd = data.jd || {};
//     const evaluation = data.evaluation || {};

//     const {
//         technical = 0,
//         communication = 0,
//         behaviour = 0,
//         mcq = null,
//         coding = null,
//         per_question = []
//     } = evaluation;

//     const resolvedName =
//         candidate.full_name ||
//         attempt.candidate_id?.split("@")[0] ||
//         "Candidate";

//     const resolvedEmail =
//         candidate.email || attempt.candidate_id || "—";

//     const cleanJD = stripHtml(jd.jd_text || "");
//     // const anomalies = attempt.anomalies || [];
//     // const anomalySummary = attempt.anomaly_summary || {};
//     function normalizeAnomalies(input) {
//         if (!input) return [];
//         if (Array.isArray(input)) return input;
//         try {
//             return JSON.parse(input);
//         } catch {
//             return [];
//         }
//     }

//     // const anomalies = normalizeAnomalies(attempt.anomalies);
//     const anomalySummary = attempt.anomaly_summary || {};

//     return (
//         <div className="candidate-status-container">
//             <Link to="/">
//                 <div className="top-header1">
//                     <img src={logo} alt="PrimeHire" className="top-logo2" />
//                 </div>
//             </Link>

//             <h2 className="title">Candidate Overview</h2>

//             <div className="status-card">
//                 {/* LEFT */}
//                 <div className="profile-section">
//                     <div className="profile-img-placeholder">
//                         {resolvedName.charAt(0).toUpperCase()}
//                     </div>

//                     <h3 className="candidate-name">{resolvedName}</h3>
//                     <p className="candidate-role">
//                         {jd.designation || "Role not specified"}
//                     </p>

//                     <div className="interview-score">
//                         <span className={`status-pill status-${attempt.status?.toLowerCase()}`}>
//                             {attempt.status}
//                         </span>
//                         <span className="score">
//                             Final Score: {attempt.interview_score ?? "—"}
//                         </span>
//                     </div>

//                     <p className="contact-email">{resolvedEmail}</p>
//                 </div>

//                 {/* RIGHT */}
//                 <div className="content-section">
//                     <div className="box">
//                         <h4>Job Description</h4>
//                         <pre className="jd-text">{cleanJD || "—"}</pre>
//                     </div>

//                     {/* PROGRESS */}
//                     <div className="box">
//                         <h4>Interview Progress</h4>
//                         {/* <div className="progress-bar">
//                             <div
//                                 className="progress-fill"
//                                 style={{ width: `${(stage / 3) * 100}%` }}
//                             />
//                         </div> */}
//                         <div className="progress-track">
//                             <div
//                                 className="progress-knob"
//                                 style={{ left: `${(stage - 1) * 50}%` }}
//                             />
//                         </div>

//                         <div className="progress-labels">
//                             <span>SCHEDULED</span>
//                             <span>IN_PROGRESS</span>
//                             <span>COMPLETED</span>
//                         </div>
//                     </div>

//                     {/* SCORE */}
//                     <div className="box half">
//                         <h4>Score Breakdown</h4>
//                         <p>Technical <span>{technical}</span></p>
//                         <p>Communication <span>{communication}</span></p>
//                         <p>Behaviour <span>{behaviour}</span></p>
//                     </div>

//                     {/* MCQ */}
//                     <div className="box">
//                         <h4>MCQ Evaluation</h4>
//                         {!mcq ? <p>No MCQ data.</p> : (
//                             <p>Score: <strong>{mcq.score}/{mcq.total}</strong></p>
//                         )}
//                     </div>

//                     {/* CODING */}
//                     <div className="box">
//                         <h4>Coding Test</h4>
//                         {!coding ? <p>No coding test.</p> : (
//                             <>
//                                 <p>Score: <strong>{coding.score}</strong></p>
//                                 <pre className="code">{coding.solution || "No solution submitted"}</pre>
//                             </>
//                         )}
//                     </div>

//                     {/* AI INTERVIEW */}
//                     <div className="box">
//                         <h4>AI Interview (Q & A)</h4>
//                         {per_question.length === 0 ? <p>No AI interview responses.</p> :
//                             per_question.map((q, i) => (
//                                 <div key={i} className="qa-block">
//                                     <p><strong>Q:</strong> {q.question}</p>
//                                     <p><strong>A:</strong> {q.answer}</p>
//                                 </div>
//                             ))
//                         }
//                     </div>
//                     {/* ANOMALIES */}
//                     <div className="box">
//                         <h4>Anomalies Detected</h4>

//                         {anomalies.length === 0 ? (
//                             <p>No anomalies detected.</p>
//                         ) : (
//                             <>
//                                 <ul className="anomaly-list">
//                                     {anomalies.map((a, i) => (
//                                         <li key={i}>
//                                             <strong>{a.type || "Anomaly"}:</strong> {a.message || JSON.stringify(a)}
//                                         </li>
//                                     ))}
//                                 </ul>

//                                 {Object.keys(anomalySummary).length > 0 && (
//                                     <>
//                                         <h5>Summary</h5>
//                                         <pre className="anomaly-summary">
//                                             {JSON.stringify(anomalySummary, null, 2)}
//                                         </pre>
//                                     </>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./CandidateOverview.css";
import logo from "../assets/primehire_logo.png";

/* =========================
   STRIP JD HTML
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

/* =========================
   STATUS → STAGE
========================= */
function resolveStage(status) {
    switch ((status || "").toUpperCase()) {
        case "SCHEDULED": return 1;
        case "IN_PROGRESS": return 2;
        case "COMPLETED":
        case "LOCKED":
        case "EXPIRED": return 3;
        default: return 1;
    }
}

/* =========================
   FORMAT ANOMALY LABEL
========================= */
function formatAnomalyKey(key) {
    return key
        .replace(/_/g, " ")
        .replace(/\./g, "")
        .replace(/\b\w/g, c => c.toUpperCase());
}
function buildAnomalyCounts(anomalies, summary) {
    const counts = { ...(summary || {}) };

    if (Array.isArray(anomalies)) {
        anomalies.forEach(a => {
            const key = a.type || a.key || a.name;
            if (!key) return;
            counts[key] = (counts[key] || 0) + 1;
        });
    }

    return counts;
}

export default function CandidateOverview() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [stage, setStage] = useState(1);

    async function fetchData() {
        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/scheduler/attempt_detail/${id}?_=${Date.now()}`,
                { cache: "no-store" }
            );
            const json = await res.json();
            if (json.ok) {
                setData(json);
                setStage(resolveStage(json.attempt?.status));
            }
        } catch (e) {
            console.error("Failed to load candidate overview", e);
        }
    }

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [id]);

    if (!data) return <p>Loading...</p>;

    const attempt = data.attempt || {};
    const candidate = data.candidate || {};
    const jd = data.jd || {};
    const evaluation = data.evaluation || {};

    const {
        technical = 0,
        communication = 0,
        behaviour = 0,
        mcq = null,
        coding = null,
        per_question = []
    } = evaluation;

    const anomalyCounts = buildAnomalyCounts(attempt.anomalies || [], attempt.anomaly_summary || {});


    const resolvedName =
        candidate.full_name ||
        attempt.candidate_id?.split("@")[0] ||
        "Candidate";

    const resolvedEmail =
        candidate.email || attempt.candidate_id || "—";

    const cleanJD = stripHtml(jd.jd_text || "");

    return (
        <div className="candidate-status-container">
            <Link to="/">
                <div className="top-header1">
                    <img src={logo} alt="PrimeHire" className="top-logo2" />
                </div>
            </Link>

            <h2 className="title">Candidate Overview</h2>

            <div className="status-card">

                {/* LEFT */}
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

                {/* RIGHT */}
                <div className="content-section">

                    <div className="box">
                        <h4>Job Description</h4>
                        <pre className="jd-text">{cleanJD || "—"}</pre>
                    </div>

                    <div className="box">
                        <h4>Interview Progress</h4>
                        <div className="progress-track">
                            <div
                                className="progress-knob"
                                style={{ left: `${(stage - 1) * 50}%` }}
                            />
                        </div>
                        <div className="progress-labels">
                            <span>SCHEDULED</span>
                            <span>IN_PROGRESS</span>
                            <span>COMPLETED</span>
                        </div>
                    </div>

                    <div className="box half">
                        <h4>Score Breakdown</h4>

                        <div className="score-row">
                            <p>Technical: <strong>{technical}</strong></p>
                            <p className="reason">{evaluation.technical_reason}</p>
                        </div>

                        <div className="score-row">
                            <p>Communication: <strong>{communication}</strong></p>
                            <p className="reason">{evaluation.communication_reason}</p>
                        </div>

                        <div className="score-row">
                            <p>Behaviour: <strong>{behaviour}</strong></p>
                            <p className="reason">{evaluation.behaviour_reason}</p>
                        </div>
                    </div>


                    <div className="box">
                        <h4>MCQ Evaluation</h4>
                        {!mcq ? <p>No MCQ data.</p> : (
                            <p>Score: <strong>{mcq.score}/{mcq.total}</strong></p>
                        )}
                    </div>

                    <div className="box">
                        <h4>Coding Test</h4>
                        {!coding ? <p>No coding test.</p> : (
                            <>
                                <p>Score: <strong>{coding.score}</strong></p>
                                <pre className="code">{coding.solution || "No solution submitted"}</pre>
                            </>
                        )}
                    </div>

                    <div className="box">
                        <h4>AI Interview (Q & A)</h4>
                        {per_question.length === 0 ? <p>No AI interview responses.</p> :
                            per_question.map((q, i) => (
                                <div key={i} className="qa-block">
                                    <p><strong>Q:</strong> {q.question}</p>
                                    <p><strong>A:</strong> {q.answer}</p>
                                </div>
                            ))
                        }
                    </div>

                    {/* ANOMALIES */}
                    {/* ANOMALIES */}
                    {/* ANOMALIES */}
                    <div className="box">
                        <h4>Anomalies Detected</h4>

                        {Object.keys(anomalyCounts).length === 0 ? (
                            <p>No anomalies detected.</p>
                        ) : (
                            <div className="anomaly-count-grid">
                                {Object.entries(anomalyCounts).map(([key, count]) => (
                                    <div className="anomaly-pill" key={key}>
                                        <strong>{formatAnomalyKey(key)}</strong>
                                        <span>{count}</span>
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
