// /src/interview/AIResponsePanel.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./InterviewMode.css";

export default function AIResponsePanel({ transcript = [], candidateName, candidateId }) {
    const [aiMessages, setAiMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // tiny local view of transcript -> display last few items
        setAiMessages((prev) => {
            const derived = transcript.slice(-6).map((t, i) => ({
                id: `t-${Date.now()}-${i}`,
                text: t.text || t,
                type: "transcript"
            }));
            return [...prev, ...derived].slice(-12);
        });
    }, [transcript]);

    useEffect(() => {
        const onAi = (e) => {
            const d = e.detail;
            if (!d) return;
            setAiMessages((prev) => [...prev, { id: Date.now(), text: d.text || d, type: "ai" }].slice(-20));
        };
        window.addEventListener("aiResponse", onAi);
        return () => window.removeEventListener("aiResponse", onAi);
    }, []);

    const askAI = async (prompt) => {
        setLoading(true);
        try {
            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("prompt", prompt);

            const res = await fetch(`${API_BASE}/mcp/interview/ask-ai`, { method: "POST", body: fd });
            const j = await res.json();
            if (j?.text) {
                setAiMessages((prev) => [...prev, { id: Date.now(), text: j.text, type: "ai" }].slice(-30));
            }
        } catch (err) {
            setAiMessages((prev) => [...prev, { id: Date.now(), text: "AI request failed", type: "system" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="panel vp-panel glass-panel ai-panel">
            <div className="panel-head">
                <h4>AI Response</h4>
                <small>Real-time reasoning</small>
            </div>

            <div className="panel-section responses">
                {aiMessages.length === 0 && <div className="muted">AI responses will appear here.</div>}
                {aiMessages.map((m) => (
                    <div key={m.id} className={`ai-msg ${m.type}`}>
                        <div className="msg-text">{m.text}</div>
                    </div>
                ))}
            </div>

            <div className="panel-foot">
                <input
                    placeholder="Ask AI (manual)..."
                    className="ai-input"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                            askAI(e.target.value.trim());
                            e.target.value = "";
                        }
                    }}
                />
                <button className="primary-outline" onClick={() => askAI("Summarize latest answers")}>
                    Summarize
                </button>
                <button className="ghost-btn" onClick={() => setAiMessages([])}>Clear</button>
            </div>
        </div>
    );
}
