// FILE: src/interview/AIChartPanel.jsx
import React, { useEffect, useState } from "react";
import "./AIChartPanel.css";

export default function AIChartPanel() {
    const [metrics, setMetrics] = useState(null);

    useEffect(() => {
        // listen for metric updates from InterviewToolbar
        const handler = (e) => {
            console.log("📊 AI Metrics Received:", e.detail);
            setMetrics(e.detail);
        };

        window.addEventListener("aiMetricsUpdate", handler);

        return () => window.removeEventListener("aiMetricsUpdate", handler);
    }, []);

    if (!metrics) return <div className="ai-chart-panel-root">Waiting for audio…</div>;

    const conf = metrics.confidence?.confidence_score ?? 0;
    const wpm = metrics.confidence?.wpm ?? 0;
    const buzz = metrics.superficial?.buzzword_hits ?? 0;
    const depth = metrics.superficial?.depth_score ?? 0;

    return (
        <div className="ai-chart-panel-root">

            <div className="metric-box">
                <div className="metric-label">Confidence <span>{conf}%</span></div>
                <div className="metric-bar">
                    <div className="metric-fill purple" style={{ width: `${conf}%` }} />
                </div>
            </div>

            <div className="metric-box">
                <div className="metric-label">WPM <span>{Math.round(wpm)}</span></div>
                <div className="metric-bar">
                    <div className="metric-fill green" style={{ width: `${Math.min(wpm, 200) / 2}%` }} />
                </div>
            </div>

            <div className="metric-box">
                <div className="metric-label">Depth <span>{depth}%</span></div>
                <div className="metric-bar">
                    <div className="metric-fill blue" style={{ width: `${depth}%` }} />
                </div>
            </div>

            <div className="metric-box">
                <div className="metric-label">Buzzwords <span>{buzz}</span></div>
                <div className="metric-bar">
                    <div className="metric-fill orange" style={{ width: `${Math.min(buzz * 20, 100)}%` }} />
                </div>
            </div>
        </div>
    );
}
