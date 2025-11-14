import React, { useEffect, useRef, useState } from "react";
import "./JDTaskUI.css";
import { Send } from "lucide-react";
import JDMessage from "@/components/JDMessage";   // ⬅️ ADD THIS

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

    const onSend = () => {
        const val = (currentJdInput || "").trim();
        if (!val) return;
        if (typeof handleJdSend === "function") handleJdSend(val);
        if (typeof setCurrentJdInput === "function") setCurrentJdInput("");
    };

    // 🧾 Clean summary builder
    const mergedSummary = (() => {
        const qnaPairs = [];
        const seenSteps = new Set();

        (localHistory || []).forEach((entry) => {
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

        return qnaPairs;
    })();

    // 🧠 Detect final JD (assistant message after generation)
    const finalJd = messages
        ?.filter((m) => m.role === "assistant")
        ?.map((m) => m.content)
        ?.find((c) =>
            typeof c === "string" &&
            (c.includes("Job Description") || c.includes("Responsibilities"))
        );

    return (
        <div className="jd-ui card">
            {/* Header */}
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
                        <div key={i} className={`timeline-item ${h.by}`}>
                            <div className="timeline-avatar">
                                {h.by === "user" ? "U" : "AI"}
                            </div>
                            <div className="timeline-body">
                                <div className="timeline-meta">
                                    {h.by === "user" ? "You" : "Assistant"}
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

                {/* Input */}
                <div className="jd-question">
                    <div className="question-pill">
                        <strong>Question</strong>
                        <div className="question-text">
                            {currentJdPrompt || "👉 What is the job title? ..."}
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
                                if (e.key === "Enter") {
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

                    <div className="jd-hint">Tip: short answers, comma separated</div>
                </div>

                {/* ⬇️⏬ FINAL JD WITH COPY BUTTON ⏬⬇️ */}
                {finalJd && !jdInProgress && (
                    <div className="jd-final-output" style={{ marginTop: "20px" }}>
                        <h3 className="font-semibold mb-2 text-gray-800">
                            📄 Generated Job Description
                        </h3>
                        <JDMessage content={finalJd} />
                    </div>
                )}

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

                        {/* Copy Summary */}
                        <div className="summary-actions">
                            <button
                                className="btn primary"
                                onClick={() => {
                                    const text = mergedSummary
                                        .map((p) => `${p.question}: ${p.answer}`)
                                        .join("\n");

                                    navigator.clipboard.writeText(text);
                                    alert("📋 Summary copied!");
                                }}
                            >
                                Copy Summary
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JDTaskUI;
