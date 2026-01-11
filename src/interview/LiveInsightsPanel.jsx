
// FILE: src/interview/LiveInsightsPanel.jsx
import React, { useEffect, useState, useRef } from "react";
import "./LiveInsightsPanel.css";

const ANOMALY_KEY_MAP = {
    absence: "no_face",
    multi_face: "multiple_faces",
    face_mismatch: "face_mismatch",
    gaze_away_long: "looking_away",
    no_blink: "no_blink",
    static_face: "static_face",
    excessive_nodding_long: "excessive_nodding",
    head_scanning_long: "head_scanning",
    stress_movement: "stress",
    tab_switch: "tab_switch",
};

const normalizeCounts = (counts = {}) => {
    const out = {};
    for (const [k, v] of Object.entries(counts)) {
        const nk = ANOMALY_KEY_MAP[k] || k;
        out[nk] = v;
    }
    return out;
};

function LiveInsightsPanel() {
    const [live, setLive] = useState({
        anomalies: [],
        counts: {}
    });

    // Track which anomalies were already persisted
    const writtenRef = useRef(new Set());

    useEffect(() => {
        const handler = (e) => {
            const payload = e.detail || {};

            const incomingAnomalies = Array.isArray(payload.anomalies)
                ? payload.anomalies
                : [];

            const incomingCounts = payload.counts || {};

            // ===============================
            // 1️⃣ UPDATE UI STATE (SAFE MERGE)
            // ===============================
            setLive((prev) => {
                const mergedCounts = { ...incomingCounts };

                // Do NOT accumulate counts — always trust backend snapshot
                return {
                    anomalies: incomingAnomalies.length
                        ? [...prev.anomalies, ...incomingAnomalies].slice(-50) // cap size
                        : prev.anomalies,
                    counts: mergedCounts,
                };
            });

            // ==========================================
            // 2️⃣ PERSIST ONLY NEW ANOMALIES TO TRANSCRIPT
            // ==========================================
            incomingAnomalies.forEach((a) => {
                const key =
                    typeof a === "string"
                        ? a
                        : a?.type || a?.msg || JSON.stringify(a);

                if (writtenRef.current.has(key)) return;

                writtenRef.current.add(key);

                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: {
                            role: "system",
                            text: `⚠ ${key}`,
                        },
                    })
                );
            });
        };

        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    const C = live.counts || {};

    return (
        <div className="live-insight-box">
            <h4>Real-time Behaviour Insights</h4>

            <h5 className="anomaly-title">Detected Anomalies</h5>
            <div className="anomaly-grid">
                <div className="anomaly-item"><span>No Face</span><strong>{C.absence ?? 0}</strong></div>
                <div className="anomaly-item"><span>Multi Face</span><strong>{C.multi_face ?? 0}</strong></div>
                <div className="anomaly-item"><span>Face Mismatch</span><strong>{C.face_mismatch ?? 0}</strong></div>
                <div className="anomaly-item"><span>Gaze Away</span><strong>{C.gaze_away_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>No Blink</span><strong>{C.no_blink ?? 0}</strong></div>
                <div className="anomaly-item"><span>Static Face</span><strong>{C.static_face ?? 0}</strong></div>
                <div className="anomaly-item"><span>Nodding</span><strong>{C.excessive_nodding_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>Scanning</span><strong>{C.head_scanning_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>Stress</span><strong>{C.stress_movement ?? 0}</strong></div>
                <div className="anomaly-item"><span>Tab Switch</span><strong>{C.tab_switch ?? 0}</strong></div>
            </div>

            <h5 className="anomaly-title">Latest Anomaly</h5>
            {live.anomalies.length > 0 ? (
                <div className="latest-anomaly">
                    {live.anomalies[live.anomalies.length - 1]?.msg ||
                        live.anomalies[live.anomalies.length - 1]}
                </div>
            ) : (
                <div className="latest-anomaly muted">No anomalies</div>
            )}
        </div>
    );
}

export default React.memo(LiveInsightsPanel);
