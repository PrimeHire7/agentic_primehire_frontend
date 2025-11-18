import React, { useEffect, useState } from "react";
import { Copy, Eye, RefreshCcw, PlusSquare, Edit } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./JDHistory.css";
import ProfileTable from "@/chat/ProfileTable";

const JDHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const [showAddQuestions, setShowAddQuestions] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [currentJD, setCurrentJD] = useState(null);

    const [matcherJD, setMatcherJD] = useState(null);
    const [manualQuestions, setManualQuestions] = useState({});

    const [showEditJD, setShowEditJD] = useState(false);
    const [editData, setEditData] = useState({
        designation: "",
        skills: "",
        jd_text: "",
    });

    // ---------------------------------------------------------
    // FETCH HISTORY
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

    // const openJD = async (id) => {
    //     try {
    //         const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
    //         const data = await res.json();

    //         setSelected({
    //             ...data,
    //             manualQuestions: manualQuestions[id] || [],
    //             aiQuestions: data.ai_questions || [],
    //         });
    //     } catch (err) {
    //         console.error("Failed to fetch JD:", err);
    //     }
    // };
    const openJD = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();

            const aiQs =
                data?.matches?.ai_questions ??
                data?.ai_questions ??
                [];

            const manualQs =
                data?.matches?.manual_questions ??
                [];

            setSelected({
                ...data,
                manualQuestions: manualQs,
                aiQuestions: aiQs,
            });
        } catch (err) {
            console.error("Failed to fetch JD:", err);
        }
    };



    // ---------------------------------------------------------
    // COPY JD
    // ---------------------------------------------------------
    const copyJD = async (text) => {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1200);
    };

    // ---------------------------------------------------------
    // ADD QUESTIONS
    // ---------------------------------------------------------
    const openAddQuestions = (jd) => {
        setCurrentJD(jd);
        const existing = manualQuestions[jd.id] || [];
        setQuestions(existing);
        setShowAddQuestions(true);
    };

    const saveQuestions = async () => {
        if (!currentJD) return;

        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/jd/save_manual_questions/${currentJD.id}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ questions }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert("❌ Failed to save questions");
                return;
            }

            // update local cache
            setManualQuestions((prev) => ({
                ...prev,
                [currentJD.id]: data.questions,
            }));

            setShowAddQuestions(false);
            alert("✔ Manual Questions Saved!");

            // Refresh selected JD if it's open
            if (selected && selected.id === currentJD.id) {
                setSelected((prev) => ({
                    ...prev,
                    manualQuestions: data.questions,
                }));
            }

        } catch (err) {
            console.error("Failed to save manual questions:", err);
            alert("Failed to save questions.");
        }
    };


    // ---------------------------------------------------------
    // MATCHER
    // ---------------------------------------------------------
    const openMatcher = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();

            setMatcherJD({
                ...data,
                jd_id: id,   // <-- ADD THIS
                matches: Array.isArray(data.matches) ? data.matches : [],
            });

        } catch (err) {
            console.error("Failed to fetch matcher JD:", err);
            setMatcherJD({ matches: [] });
        }
    };

    // ---------------------------------------------------------
    // EDIT JD POPUP
    // ---------------------------------------------------------
    const openEditJD = () => {
        setEditData({
            designation: selected.designation,
            skills: selected.skills,
            jd_text: selected.jd_text,
        });
        setShowEditJD(true);
    };

    const saveEditedJD = async () => {
        try {
            await fetch(`${API_BASE}/mcp/tools/jd_history/jd/update/${selected.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editData),
            });

            alert("JD Updated Successfully!");

            // Close the edit modal
            setShowEditJD(false);

            // Refresh list
            fetchHistory();

            // 🔥 Re-fetch the updated JD and update modal content
            setTimeout(async () => {
                const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${selected.id}`);
                const data = await res.json();

                setSelected({
                    ...data,
                    manualQuestions: manualQuestions[selected.id] || [],
                    aiQuestions: data.ai_questions || [],
                });
            }, 300);

        } catch (err) {
            console.error("Failed to save edited JD:", err);
            alert("Failed to save JD.");
        }
    };

    // ---------------------------------------------------------
    // GENERATE AI INTERVIEW QUESTIONS (NEW + FIXED)
    // ---------------------------------------------------------
    const generateAIQuestions = async () => {
        if (!selected) return;

        try {
            // 1️⃣ Trigger backend generation
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/jd/generate_ai_questions/${selected.id}`,
                { method: "POST" }
            );

            const data = await res.json();

            if (!res.ok) {
                alert("❌ " + data.detail);
                return;
            }

            // 2️⃣ Immediately fetch updated JD (where questions are saved)
            const refRes = await fetch(
                `${API_BASE}/mcp/tools/jd_history/jd/history/${selected.id}`
            );
            const refData = await refRes.json();

            // 3️⃣ Extract ai_questions from matches_json (DB structure)
            const savedQuestions =
                refData?.matches?.ai_questions ??
                refData?.ai_questions ??
                data.questions ??
                [];

            if (!savedQuestions.length) {
                alert("⚠️ No questions returned after saving.");
                return;
            }

            // 4️⃣ Update UI
            setSelected((prev) => ({
                ...prev,
                aiQuestions: savedQuestions,
            }));

            alert("🤖 AI Questions Generated & Saved!");

        } catch (err) {
            console.error("AI questions failed:", err);
            alert("Failed to generate AI questions.");
        }
    };

    // ---------------------------------------------------------
    // INITIAL LOAD
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
                <h1 className="jd-title">📄 Generated JD History</h1>
                <button className="jd-button jd-refresh" onClick={fetchHistory}>
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            {/* ---------------------------------------------------------
          TABLE
      --------------------------------------------------------- */}
            {loading ? (
                <p className="jd-loading">Loading...</p>
            ) : (
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
                                    <button className="jd-button jd-view" onClick={() => openJD(row.id)}>
                                        <Eye size={14} /> View
                                    </button>

                                    <button className="jd-button jd-matcher" onClick={() => openMatcher(row.id)}>
                                        🤝 Matcher
                                    </button>

                                    <button
                                        className="jd-button jd-add-questions"
                                        onClick={() => openAddQuestions(row)}
                                    >
                                        <PlusSquare size={14} /> Add Questions
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* ---------------------------------------------------------
          MATCHER POPUP
      --------------------------------------------------------- */}
            {matcherJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal matcher-modal">
                        <button className="jd-modal-close" onClick={() => setMatcherJD(null)}>
                            ✖
                        </button>

                        <h2 className="jd-modal-title">🤝 Matches for: {matcherJD.designation}</h2>

                        <p className="jd-modal-skills">
                            Required Skills: <b>{matcherJD.skills}</b>
                        </p>

                        <div className="matcher-content">
                            {matcherJD.matches.length > 0 ? (
                                // <ProfileTable data={matcherJD.matches} index={9999} />
                                <ProfileTable data={matcherJD.matches} jdId={matcherJD.jd_id} />

                            ) : (
                                <p className="no-matches-text">❌ No matching profiles found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------
          VIEW JD POPUP
      --------------------------------------------------------- */}
            {selected && !showEditJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <button className="jd-modal-close" onClick={() => setSelected(null)}>
                            ✖
                        </button>

                        <h2 className="jd-modal-title">{selected.designation}</h2>
                        <p className="jd-modal-skills">Skills: {selected.skills}</p>

                        <div className="jd-modal-text">{selected.jd_text}</div>

                        {/* NEW BUTTON — GENERATE AI QUESTIONS */}
                        <button className="jd-button jd-ai-generate" onClick={generateAIQuestions}>
                            🤖 Generate AI Questions
                        </button>

                        {/* AI QUESTIONS */}
                        {selected.aiQuestions?.length > 0 && (
                            <div className="ai-questions-box">
                                <h3>🤖 AI Interview Questions</h3>
                                {selected.aiQuestions.map((q, i) => (
                                    <p key={i} className="ai-question-item">
                                        <span className="q-number">{i + 1}.</span> {q}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* MANUAL QUESTIONS */}
                        {selected.manualQuestions?.length > 0 && (
                            <div className="view-questions-list">
                                <h3>📝 Manual Questions</h3>
                                {selected.manualQuestions.map((q, i) => (
                                    <p key={i} className="view-question-item">
                                        <span className="q-number">{i + 1}.</span> {q}
                                    </p>
                                ))}
                            </div>
                        )}

                        {/* EDIT JD BUTTON */}
                        <button className="jd-button jd-edit" onClick={openEditJD}>
                            <Edit size={14} /> Edit JD
                        </button>

                        {/* COPY BUTTON */}
                        <button className="jd-copy-button" onClick={() => copyJD(selected.jd_text)}>
                            <Copy size={16} />
                            {copySuccess ? "Copied!" : "Copy JD"}
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------
          EDIT JD POPUP
      --------------------------------------------------------- */}
            {showEditJD && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal large-modal">
                        <button className="jd-modal-close" onClick={() => setShowEditJD(false)}>
                            ✖
                        </button>

                        <h2 className="jd-modal-title">✏️ Edit Job Description</h2>

                        <label>Designation</label>
                        <input
                            type="text"
                            value={editData.designation}
                            onChange={(e) => setEditData({ ...editData, designation: e.target.value })}
                            className="edit-input"
                        />

                        <label>Skills</label>
                        <input
                            type="text"
                            value={editData.skills}
                            onChange={(e) => setEditData({ ...editData, skills: e.target.value })}
                            className="edit-input"
                        />

                        <label>JD Text</label>
                        <textarea
                            value={editData.jd_text}
                            onChange={(e) => setEditData({ ...editData, jd_text: e.target.value })}
                            className="edit-textarea"
                        />

                        <button className="jd-button jd-save" onClick={saveEditedJD}>
                            💾 Save JD
                        </button>
                    </div>
                </div>
            )}

            {/* ---------------------------------------------------------
          ADD QUESTIONS POPUP
      --------------------------------------------------------- */}
            {showAddQuestions && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <button className="jd-modal-close" onClick={() => setShowAddQuestions(false)}>
                            ✖
                        </button>

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

                            <button
                                className="jd-button jd-add-questions"
                                onClick={() => setQuestions([...questions, ""])}
                            >
                                + Add More
                            </button>
                        </div>

                        <button className="jd-button jd-save" onClick={saveQuestions}>
                            💾 Save Questions
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JDHistory;