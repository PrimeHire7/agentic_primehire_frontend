// src/pages/JDTaskUI.jsx
import React, { useEffect, useRef, useState } from "react";
import "./JDTaskUI.css";
import { Send } from "lucide-react";

const JDTaskUI = ({
    currentJdPrompt,
    currentJdInput,
    setCurrentJdInput,
    handleJdSend,
    jdInProgress,
    messages = [],
}) => {
    const [localHistory, setLocalHistory] = useState([]);
    const inputRef = useRef(null);

    // 🧠 Sync JD history with global store
    useEffect(() => {
        const sync = () => {
            if (typeof window !== "undefined") {
                setLocalHistory(window.__JD_HISTORY__ || []);
            }
        };
        sync();
        const handler = () => sync();
        window.addEventListener("jd_step_update", handler);
        window.addEventListener("jd_input_update", handler);
        return () => {
            window.removeEventListener("jd_step_update", handler);
            window.removeEventListener("jd_input_update", handler);
        };
    }, [messages, jdInProgress]);

    // auto-focus when step changes
    useEffect(() => {
        inputRef.current?.focus();
    }, [currentJdPrompt]);

    // auto-scroll to bottom
    useEffect(() => {
        const t = document.querySelector(".jd-timeline");
        if (t) t.scrollTop = t.scrollHeight;
    }, [localHistory]);

    // 🧠 Send answer to JD flow
    const onSend = () => {
        const val = (currentJdInput || "").trim();
        if (!val) return;

        // ✅ Only call handleJdSend — history handled in useJDCreator
        if (typeof handleJdSend === "function") handleJdSend(val);

        // clear input locally
        if (typeof setCurrentJdInput === "function") setCurrentJdInput("");
    };

    // 🧾 Clean summary builder (1 question → 1 answer)
    const mergedSummary = (() => {
        const qnaPairs = [];
        const seenSteps = new Set();

        (localHistory || []).forEach((entry, i) => {
            if (entry.by === "ai" && !seenSteps.has(entry.step)) {
                const nextUser = (localHistory || []).find(
                    (x) => x.by === "user" && x.step === entry.step
                );
                qnaPairs.push({
                    question: entry.value,
                    answer: nextUser?.value || "(not answered)",
                });
                seenSteps.add(entry.step);
            }
        });

        // handle last standalone user entry (rare)
        const last = localHistory[localHistory.length - 1];
        if (last && last.by === "user" && !seenSteps.has(last.step)) {
            qnaPairs.push({ question: last.step, answer: last.value });
        }

        return qnaPairs;
    })();

    return (
        <div className="jd-ui card">
            <div className="jd-header">
                <div>
                    <div className="jd-badge">🧠 JD Creator</div>
                    <div className="jd-sub">
                        Step {mergedSummary.length + 1} —{" "}
                        {currentJdPrompt || "Initializing..."}
                    </div>
                </div>
                <div className="jd-status">
                    {jdInProgress ? "In progress" : "Idle"}
                </div>
            </div>

            <div className="jd-main">
                {/* Timeline */}
                <div className="jd-timeline">
                    {localHistory.length === 0 && (
                        <div className="timeline-empty">
                            No answers yet — answer the question below to begin.
                        </div>
                    )}
                    {localHistory.map((h, i) => (
                        <div
                            key={i}
                            className={`timeline-item ${h.by === "user" ? "user" : "ai"}`}
                        >
                            <div className="timeline-avatar">
                                {h.by === "user" ? "U" : "AI"}
                            </div>
                            <div className="timeline-body">
                                <div className="timeline-meta">
                                    <span className="meta-role">
                                        {h.by === "user" ? "You" : "Assistant"}
                                    </span>
                                </div>
                                <div className="timeline-text">
                                    {Array.isArray(h.value)
                                        ? h.value.join(", ")
                                        : h.value}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input + question */}
                <div className="jd-question">
                    <div className="question-pill">
                        <strong>Question</strong>
                        <div className="question-text">
                            {currentJdPrompt ||
                                "👉 What is the job title?..."}
                        </div>
                    </div>

                    <div className="jd-input-row">
                        <input
                            ref={inputRef}
                            value={currentJdInput || ""}
                            onChange={(e) => {
                                setCurrentJdInput(e.target.value);
                                if (typeof window !== "undefined")
                                    window.__CURRENT_JD_INPUT__ = e.target.value;
                            }}
                            placeholder={currentJdPrompt || "Type your answer..."}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    onSend();
                                }
                            }}
                            className="jd-input"
                        />
                        <button className="jd-send" onClick={onSend}>
                            <Send />
                        </button>
                    </div>

                    <div className="jd-hint">
                        Tip: short answers for skills (comma separated)
                    </div>
                </div>

                {/* Draft Summary */}
                {!jdInProgress && mergedSummary.length > 0 && (
                    <div className="jd-summary">
                        <div className="summary-title">📋 Draft Summary</div>
                        <div className="summary-grid">
                            {mergedSummary.map((pair, i) => (
                                <div key={i} className="summary-item">
                                    <div className="summary-key">{pair.question}</div>
                                    <div className="summary-val">
                                        {Array.isArray(pair.answer)
                                            ? pair.answer.join(", ")
                                            : pair.answer}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="summary-actions">
                            <button
                                className="btn primary"
                                onClick={() => {
                                    const text = mergedSummary
                                        .map((p) => `${p.question}: ${p.answer}`)
                                        .join("\n");
                                    navigator.clipboard.writeText(text);
                                    alert("📋 Copied summary to clipboard!");
                                }}
                            >
                                Copy summary
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JDTaskUI;
