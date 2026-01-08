/* FILE: src/interview/LiveInsightsPanel.jsx */

import React, { useEffect, useState, useRef } from "react";
import "./LiveInsightsPanel.css";

function LiveInsightsPanel({ attemptId }) {
    const [live, setLive] = useState({ anomalies: [], counts: {} });
    const writtenRef = useRef(new Set());

    // Reset when attempt changes
    useEffect(() => {
        setLive({ anomalies: [], counts: {} });
        writtenRef.current = new Set();
    }, [attemptId]);

    useEffect(() => {
        const handler = (e) => {
            const payload = e.detail || {};
            if (payload.attempt_id !== attemptId) return;

            const incomingAnomalies = Array.isArray(payload.anomalies)
                ? payload.anomalies
                : [];

            const incomingCounts = payload.counts || {};

            setLive((prev) => ({
                anomalies: incomingAnomalies.length
                    ? [...prev.anomalies, ...incomingAnomalies].slice(-50)
                    : prev.anomalies,
                counts: { ...incomingCounts },
            }));

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
    }, [attemptId]);

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
                    {live.anomalies.at(-1)?.msg || live.anomalies.at(-1)}
                </div>
            ) : (
                <div className="latest-anomaly empty">
                    No anomalies
                </div>
            )}
        </div>
    );
}

export default React.memo(LiveInsightsPanel);
