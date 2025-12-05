// FILE: src/interview/LiveInsightsPanel.jsx
import React, { useEffect, useState } from "react";
import "./LiveInsightsPanel.css";

export default function LiveInsightsPanel() {
    const [live, setLive] = useState({
        anomalies: [],
        counts: {}
    });

    useEffect(() => {
        const handler = (e) => {
            const payload = e.detail;

            setLive((prev) => ({
                anomalies: payload.anomalies || prev.anomalies,
                counts: payload.counts || prev.counts,
            }));
        };

        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    const counts = live.counts || {};

    return (
        <div className="live-insight-box">
            <h4>Real-time Behaviour Insights</h4>

            <h5 className="anomaly-title">Detected Anomalies</h5>
            <div className="anomaly-grid">

                <div className="anomaly-item"><span>No Face</span><strong>{counts.absence || 0}</strong></div>

                <div className="anomaly-item"><span>Multi Face</span><strong>{counts.multi_face || 0}</strong></div>

                <div className="anomaly-item"><span>Face Mismatch</span><strong>{counts.face_mismatch || 0}</strong></div>

                <div className="anomaly-item"><span>Gaze Away</span><strong>{counts.gaze_away || 0}</strong></div>

                <div className="anomaly-item"><span>No Blink</span><strong>{counts.no_blink || 0}</strong></div>

                <div className="anomaly-item"><span>Static Face</span><strong>{counts.static_face || 0}</strong></div>

                <div className="anomaly-item"><span>Nodding</span><strong>{counts.nodding_pattern || 0}</strong></div>

                <div className="anomaly-item"><span>Scanning</span><strong>{counts.head_scanning || 0}</strong></div>

                <div className="anomaly-item"><span>Stress Movements</span><strong>{counts.stress_movement || 0}</strong></div>

            </div>

            <h5 className="anomaly-title">Latest Anomaly</h5>
            {live.anomalies?.length > 0 ? (
                <div className="latest-anomaly">
                    {live.anomalies[live.anomalies.length - 1].msg}
                </div>
            ) : (
                <div className="latest-anomaly">No anomalies</div>
            )}

        </div>
    );
}
