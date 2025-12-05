// FILE: src/interview/InterviewMode.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import AIChartPanel from "./AIChartPanel";
import InterviewToolbar from "./InterviewToolbar";

import "./InterviewMode.css";

export default function InterviewMode() {
    const location = useLocation();

    const candidateName = location.state?.candidateName || "Anonymous";
    const initialCandidateId = location.state?.candidateId || null;
    const jdText = location.state?.jd_text || "";

    const [candidateId, setCandidateId] = useState(initialCandidateId);
    const [transcript, setTranscript] = useState([]);

    // Global event → add transcript entry
    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;
            setTranscript((prev) => [...prev, msg]);
        };
        window.addEventListener("transcriptAdd", handler);
        return () => window.removeEventListener("transcriptAdd", handler);
    }, []);

    return (
        <div className="interview-root">

            <div className="interview-toolbar-container">
                <InterviewToolbar />
            </div>

            <div className="interview-layout">

                {/* LEFT SIDE */}
                <div className="left-panel">

                    <div className="video-wrapper">
                        <WebcamRecorder
                            candidateName={candidateName}
                            candidateId={candidateId}
                            jdText={jdText}
                            onCandidateId={setCandidateId}
                        />
                    </div>

                    <div className="insight-score-row">
                        <div className="insights-box">
                            <LiveInsightsPanel candidateId={candidateId} />
                        </div>

                        <div className="aichart-box">
                            <AIChartPanel />
                        </div>
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="right-panel">
                    <TranscriptPanel
                        transcript={transcript}
                        jdId={location.state?.jd_id || null}
                        jdText={jdText}
                    />

                </div>

            </div>
        </div>
    );
}
