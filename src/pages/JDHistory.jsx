// JDHistory.jsx (FULL patched version)
// Place under your frontend project replacing old JDHistory.jsx

import React, { useEffect, useState } from "react";
import { Copy, Eye, RefreshCcw, PlusSquare, Edit, Send } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./JDHistory.css";
import ProfileTable from "@/chat/ProfileTable";
import { IoEye } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";
import { MdAddComment } from "react-icons/md";
import { MdWorkHistory } from "react-icons/md";
import { TbTargetArrow } from "react-icons/tb";



const JDHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    // VIEW modal
    const [selected, setSelected] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    // Add manual questions modal
    const [showAddQuestions, setShowAddQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentJD, setCurrentJD] = useState(null);

    // Matcher modal
    const [matcherJD, setMatcherJD] = useState(null);
    const [matcherLoading, setMatcherLoading] = useState(false);

    // Edit JD
    const [showEditJD, setShowEditJD] = useState(false);
    const [editData, setEditData] = useState({
        designation: "",
        skills: "",
        jd_text: "",
    });

    // ---------------------------------------------------------
    // Helper: strip HTML from JD text
    // ---------------------------------------------------------
    function stripHtml(html) {
        if (!html) return "";

        // Remove the Copy JD button completely
        html = html.replace(/📋\s*Copy JD/gi, "");

        // Remove the whole <button>...</button> block
        html = html.replace(/<button[\s\S]*?<\/button>/gi, "");

        // Remove "How to Apply" section entirely
        html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");

        // Remove script & style tags
        html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
        html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");

        // Replace <li> with "- "
        html = html.replace(/<li>/gi, "- ");

        // Replace line-break tags
        html = html.replace(/<br\s*\/?>/gi, "\n");
        html = html.replace(/<\/p>/gi, "\n");

        // Add newline after headings
        html = html.replace(/<\/h[1-6]>/gi, "\n");

        // Remove all remaining HTML
        html = html.replace(/<[^>]+>/g, "");

        // Remove excess newlines
        html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

        return html.trim();
    }


    // ---------------------------------------------------------
    // Helper: fetch history
    // ---------------------------------------------------------
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
            const data = await res.json();
            setHistory(data.history || []);
        } catch (err) {
            console.error("Failed to fetch JD history:", err);
        }
        setLoading(false);
    };

    // ---------------------------------------------------------
    // Helper: fetch single JD details (always use to get fresh data)
    // ---------------------------------------------------------
    const fetchSingleJD = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch single JD:", err);
            return null;
        }
    };

    // ---------------------------------------------------------
    // OPEN JD (VIEW) - ALWAYS fetch fresh from backend
    // ---------------------------------------------------------
    const openJD = async (id) => {
        const data = await fetchSingleJD(id);
        if (!data) return;
        setSelected({
            ...data,
            // Backend returns manual_questions & ai_questions as arrays
            manualQuestions: data.manual_questions || [],
            aiQuestions: data.ai_questions || [],
            matches: data.matches || [],
        });
    };

    // ---------------------------------------------------------
    // OPEN Add Questions modal (load fresh manual questions)
    // ---------------------------------------------------------
    const openAddQuestions = async (jd) => {
        setCurrentJD(jd);
        const data = await fetchSingleJD(jd.id);
        const existing = (data && data.manual_questions) ? data.manual_questions : [];
        setQuestions(existing);
        setShowAddQuestions(true);
    };

    const saveQuestions = async () => {
        if (!currentJD) return;
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/save_manual_questions/${currentJD.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ questions }),
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.detail || "Failed to save questions");
                return;
            }

            // Update UI: refresh single JD if it's open
            if (selected?.id === currentJD.id) {
                // fetch fresh
                const fresh = await fetchSingleJD(currentJD.id);
                if (fresh) {
                    setSelected({
                        ...fresh,
                        manualQuestions: fresh.manual_questions || [],
                        aiQuestions: fresh.ai_questions || [],
                        matches: fresh.matches || []
                    });
                }
            }

            setShowAddQuestions(false);
            alert("Manual questions saved successfully!");
        } catch (err) {
            console.error("Failed to save manual questions:", err);
            alert("Failed to save manual questions.");
        }
    };

    // ---------------------------------------------------------
    // GENERATE AI QUESTIONS (persisted in backend)
    // ---------------------------------------------------------
    const generateAIQuestions = async () => {
        if (!selected) return;
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/generate_ai_questions/${selected.id}`, {
                method: "POST",
            });
            const data = await res.json();

            if (!res.ok) {
                alert(data.detail || "Failed to generate AI questions");
                return;
            }

            // fetch fresh JD to get persisted ai_questions
            const fresh = await fetchSingleJD(selected.id);
            if (fresh) {
                setSelected({
                    ...fresh,
                    manualQuestions: fresh.manual_questions || [],
                    aiQuestions: fresh.ai_questions || [],
                    matches: fresh.matches || []
                });
            }

            alert("AI questions generated and saved!");
        } catch (err) {
            console.error("AI generation failed:", err);
            alert("Failed to generate AI questions.");
        }
    };

    // ---------------------------------------------------------
    // MATCHER modal — fetch JD row (with matches)
    // ---------------------------------------------------------
    const openMatcher = async (id) => {
        setMatcherLoading(true);  // 🔥 start loading
        try {
            const matchRes = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/match_profiles/${id}`, {
                method: "POST"
            });

            const matchJson = await matchRes.json();
            const data = await fetchSingleJD(id);

            setMatcherJD({
                ...data,
                matches: data.matches || []
            });

            // refresh table counts
            await fetchHistory();
        } catch (err) {
            console.error("Matcher failed:", err);
            setMatcherJD({ matches: [] });
        }
        setMatcherLoading(false); // ❗ stop loading
    };



    // ---------------------------------------------------------
    // SEND JD TO CLIENT
    // ---------------------------------------------------------
    const sendToClient = async (jd) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/send_to_client/${jd.id}`, {
                method: "POST"
            });
            const data = await res.json();
            if (data.success) {
                alert("JD sent to client successfully!");
            } else {
                alert(data.message || "Failed to send JD.");
            }
        } catch (err) {
            console.error("Send to client failed:", err);
            alert("Error sending JD to client.");
        }
    };

    // ---------------------------------------------------------
    // EDIT / SAVE JD
    // ---------------------------------------------------------
    const openEditJD = () => {
        if (!selected) return;
        setEditData({
            designation: selected.designation,
            skills: selected.skills,
            jd_text: selected.jd_text,
        });
        setShowEditJD(true);
    };

    const saveEditedJD = async () => {
        if (!selected) return;
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/update/${selected.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData)
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.detail || "Failed to update JD");
                return;
            }
            alert("JD Updated Successfully!");
            setShowEditJD(false);
            await fetchHistory();
            setSelected(null);
        } catch (err) {
            console.error("Failed to save edited JD:", err);
            alert("Failed to save JD.");
        }
    };

    // ---------------------------------------------------------
    // COPY JD text
    // ---------------------------------------------------------
    const copyJD = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 1200);
        } catch (err) {
            console.error("Copy failed", err);
        }
    };

    // ---------------------------------------------------------
    // initial load
    // ---------------------------------------------------------
    useEffect(() => {
        fetchHistory();
    }, []);

    // ---------------------------------------------------------
    // UI
    // ---------------------------------------------------------
    return (
        <div className="jd-history-container">
            <div className="jd-header">
                <h2 className="jd-title"><MdWorkHistory /> Generated JD History</h2>
                <button className="jd-button jd-refresh" onClick={fetchHistory}>
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            {/* TABLE */}
            {!loading ? (
                <table className="jd-table">
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Skills</th>
                            <th>Matches</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {history.map((row) => (
                            <tr key={row.id}>
                                <td>{row.designation}</td>
                                <td>{row.skills}</td>
                                <td>{row.match_count}</td>
                                <td>{new Date(row.created_at).toLocaleString()}</td>

                                <td className="jd-actions">
                                    <div className="hr-toolbar">
                                    <button className="jd-button jd-view" onClick={() => openJD(row.id)}>
                                        {/* <Eye size={14} />  */}
                                        <IoEye />   

                                    </button>

                                    <span className="toolbar">View</span>
                                    </div>
 <div className="hr-toolbar">
                                    <button className="jd-button jd-matcher" onClick={() => openMatcher(row.id)}>
                                        <FaHandshake />
 
                                    </button>
 <span className="toolbar">Matcher</span>
                                    </div>
                                     <div className="hr-toolbar">
                                    <button className="jd-button jd-add-questions" onClick={() => openAddQuestions(row)}>
                                        {/* <PlusSquare size={14} />  */}
                                        <MdAddComment />

                                    </button>

                                    {/* <button className="jd-button jd-send-client" onClick={() => sendToClient(row)}>
                                        <Send size={18} style={{ marginRight: "6px" }} />
                                        Send to Client
                                    </button> */}
                                     <span className="toolbar">Add Questions</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="jd-loading">Loading…</p>
            )}
            {/* LOADING POPUP FOR MATCHER */}
            {matcherLoading && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <h3>🔍 Matching candidates...</h3>
                        <p>Please wait...</p>
                        <div className="spinner"></div>
                    </div>
                </div>
            )}

            {/* MATCHER POPUP */}
            {matcherJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal matcher-modal">
                        <button className="jd-modal-close" onClick={() => setMatcherJD(null)}>✖</button>

                        <h2 className="jd-modal-title d-flex justify-space-between"><TbTargetArrow /> Matches for: {matcherJD.designation}</h2>
                        <p className="jd-modal-skills">Required Skills: <b><span className="sk-bg-clrs">{matcherJD.skills}</span></b></p>

                        <div className="matcher-content">
                            {matcherJD.matches && matcherJD.matches.length > 0 ? (
                                <ProfileTable data={matcherJD.matches} index={9999} jdId={matcherJD.id} />
                            ) : (
                                <p className="no-matches-text">❌ No matching profiles found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW JD POPUP */}
            {selected && !showEditJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <button className="jd-modal-close" onClick={() => setSelected(null)}>✖</button>

                        <h2 className="jd-modal-title">{selected.designation}</h2>
                        <p className="jd-modal-skills">Skills: {selected.skills}</p>

                        {/* <div className="jd-modal-text">{selected.jd_text}</div> */}
                        <div className="jd-modal-text">
                            <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                                {stripHtml(selected.jd_text)}
                            </pre>
                        </div>


                        {/* Generate AI Questions */}
                        <div style={{ marginTop: 12 }}>
                            <button className="jd-button jd-ai-generate" onClick={generateAIQuestions}>
                                🤖 Generate AI Questions
                            </button>
                        </div>

                        {/* AI Questions (persisted) */}
                        {selected.aiQuestions && selected.aiQuestions.length > 0 && (
                            <div className="ai-questions-box" style={{ marginTop: 12 }}>
                                <h3>🤖 AI Interview Questions</h3>
                                <table className="ai-questions-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Question</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selected.aiQuestions.map((q, i) => (
                                            <tr key={i}>
                                                <td>{i + 1}</td>
                                                <td>{q}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Manual Questions */}
                        {selected.manualQuestions && selected.manualQuestions.length > 0 && (
                            <div className="view-questions-list" style={{ marginTop: 12 }}>
                                <h3>📝 Manual Questions</h3>
                                <ol>
                                    {selected.manualQuestions.map((q, i) => (
                                        <li key={i} style={{ marginBottom: 6 }}>{q}</li>
                                    ))}
                                </ol>
                            </div>
                        )}

                        <div style={{ marginTop: 14 }}>
                            <button className="jd-button jd-edit" onClick={openEditJD}>
                                <Edit size={14} /> Edit JD
                            </button>

                            <button className="jd-copy-button" onClick={() => copyJD(selected.jd_text)} style={{ marginLeft: 8 }}>
                                <Copy size={16} /> {copySuccess ? "Copied!" : "Copy JD"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT JD POPUP */}
            {showEditJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal large-modal">
                        <button className="jd-modal-close" onClick={() => setShowEditJD(false)}>✖</button>

                        <h2 className="jd-modal-title">✏️ Edit Job Description</h2>

                        <label>Designation</label>
                        <input type="text" value={editData.designation} onChange={(e) => setEditData({ ...editData, designation: e.target.value })} className="edit-input" />

                        <label>Skills</label>
                        <input type="text" value={editData.skills} onChange={(e) => setEditData({ ...editData, skills: e.target.value })} className="edit-input" />

                        <label>JD Text</label>
                        <textarea value={editData.jd_text} onChange={(e) => setEditData({ ...editData, jd_text: e.target.value })} className="edit-textarea" />

                        <button className="jd-button jd-save" onClick={saveEditedJD}>💾 Save JD</button>
                    </div>
                </div>
            )}

            {/* ADD QUESTIONS POPUP */}
            {showAddQuestions && currentJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <button className="jd-modal-close" onClick={() => setShowAddQuestions(false)}>✖</button>

                        <h2 className="jd-modal-title">Add Questions for: {currentJD.designation}</h2>

                        <div className="questions-container">
                            {questions.map((q, idx) => (
                                <input
                                    key={idx}
                                    type="text"
                                    placeholder={`Question ${idx + 1}`}
                                    value={q}
                                    onChange={(e) => {
                                        const newQs = [...questions];
                                        newQs[idx] = e.target.value;
                                        setQuestions(newQs);
                                    }}
                                    className="question-input"
                                />
                            ))}

                            <button className="jd-button jd-add-questions" onClick={() => setQuestions([...questions, ""])}>
                                + Add More
                            </button>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <button className="jd-button jd-save" onClick={saveQuestions}>💾 Save Questions</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JDHistory;
