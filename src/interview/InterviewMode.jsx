
// FILE: src/interview/InterviewMode.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import { useSearchParams } from "react-router-dom";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import AIChartPanel from "./AIChartPanel";
import InterviewToolbar from "./InterviewToolbar";

import "./InterviewMode.css";
import MCQ from "./MCQ";
import CodingTestPanel from "./CodingTestPanel";

export default function InterviewMode() {
    const location = useLocation();
    const navigate = useNavigate();

    // Candidate & JD info
    const candidateName = location.state?.candidateName || "Anonymous";
    const initialCandidateId = location.state?.candidateId || null;
    const jdText = location.state?.jd_text || "";
    const jdId = location.state?.jd_id || null;

    // Core states
    const [candidateId, setCandidateId] = useState(initialCandidateId);
    const [transcript, setTranscript] = useState([]);
    const [insights, setInsights] = useState({});
    const [anomalyCounts, setAnomalyCounts] = useState({});
    const [interviewTime, setInterviewTime] = useState(0);

    // Stage: 1 = MCQ, 2 = Coding, 3 = AI Interview
    const [stage, setStage] = useState(null);

    // MCQ & Coding data
    const [mcq, setMcq] = useState([]);
    const [mcqLoaded, setMcqLoaded] = useState(false);
    const [mcqResult, setMcqResult] = useState(null);
    const [codingResult, setCodingResult] = useState(null);

    const [searchParams] = useSearchParams();
    const interviewToken = searchParams.get("token");

    /* ===========================================================
       AI INTERVIEW INIT LISTENER
    =========================================================== */
    // useEffect(() => {
    //     async function startAI() {
    //         if (!candidateId) return;

    //         console.log("🤖 Starting AI Interview (Tell me about yourself)");

    //         const fd = new FormData();
    //         fd.append("init", "true");
    //         fd.append("candidate_name", candidateName);
    //         fd.append("candidate_id", candidateId);
    //         fd.append("job_description", jdText);
    //         fd.append("token", interviewToken);

    //         if (jdId) fd.append("jd_id", jdId);

    //         try {
    //             const r = await fetch(
    //                 `${API_BASE}/mcp/interview_bot_beta/process-answer`,
    //                 { method: "POST", body: fd }
    //             );
    //             const d = await r.json();

    //             if (d.next_question) {
    //                 window.dispatchEvent(
    //                     new CustomEvent("transcriptAdd", {
    //                         detail: { role: "ai", text: d.next_question }
    //                     })
    //                 );
    //             }
    //         } catch (e) {
    //             console.error("AI init failed:", e);
    //         }
    //     }

    //     window.addEventListener("startAIInterview", startAI);
    //     return () => window.removeEventListener("startAIInterview", startAI);
    // }, [candidateId, candidateName, jdText, jdId]);
    useEffect(() => {
        async function startAI() {
            if (!candidateId || !interviewToken) {
                console.error("❌ Missing candidateId or interviewToken");
                return;
            }

            console.log("🤖 Starting AI Interview with token:", interviewToken);

            const fd = new FormData();
            fd.append("init", "true");
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            fd.append("token", interviewToken);
            if (jdId) fd.append("jd_id", jdId);

            try {
                const r = await fetch(
                    `${API_BASE}/mcp/interview_bot_beta/process-answer`,
                    { method: "POST", body: fd }
                );

                const d = await r.json();
                console.log("AI INIT RESPONSE:", d);

                if (d.next_question) {
                    window.dispatchEvent(
                        new CustomEvent("transcriptAdd", {
                            detail: { role: "ai", text: d.next_question }
                        })
                    );
                }
            } catch (e) {
                console.error("❌ AI init failed:", e);
            }
        }

        window.addEventListener("startAIInterview", startAI);
        return () => window.removeEventListener("startAIInterview", startAI);
    }, [candidateId, interviewToken, candidateName, jdText, jdId]);

    /* ===========================================================
       START STAGE HANDLER (triggered by WebcamRecorder Start button)
    =========================================================== */
    async function handleStartStage(stageNumber) {
        console.log("Starting stage:", stageNumber);
        setStage(stageNumber);

        // ⭐ LOAD MCQ WHEN STAGE 1 STARTS
        if (stageNumber === 1 && !mcqLoaded) {
            const fd = new FormData();
            fd.append("job_description", jdText);
            fd.append("candidate_id", candidateId);
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/generate-mcq`, {
                method: "POST",
                body: fd,
            });

            const d = await r.json();
            if (d.ok) {
                setMcq(d.mcq);
                setMcqLoaded(true);
            } else {
                alert("Failed to load MCQ");
            }
        }
    }

    /* ===========================================================
       RIGHT PANEL RENDER BASED ON STAGE
    =========================================================== */
    function renderRightContent() {
        if (stage === 1) {
            return (
                <MCQ
                    questions={mcq}
                    onComplete={(result) => {
                        setMcqResult(result);
                        setStage(2);
                    }}
                />
            );
        }

        if (stage === 2) {
            return (
                <CodingTestPanel
                    onComplete={(score) => {
                        setCodingResult(score);
                        setStage(3);

                        // 🔥 EXPLICIT AI START SIGNAL
                        setTimeout(() => {
                            window.dispatchEvent(new Event("startAIInterview"));
                        }, 300);
                    }}
                />

            );
        }

        if (stage === 3) {
            return (
                <TranscriptPanel
                    transcript={transcript}
                    jdId={jdId}
                    jdText={jdText}
                />
            );
        }

        return (
            <div className="tp-empty big-msg">
                Press "Start Interview" on the left to begin.
            </div>
        );
    }

    /* ===========================================================
       INTERVIEW TIMER
    =========================================================== */
    useEffect(() => {
        let timer = null;

        const startTimer = () => {
            if (timer) return;
            timer = setInterval(() => setInterviewTime((t) => t + 1), 1000);
        };

        const stopTimer = () => {
            clearInterval(timer);
            timer = null;
        };

        window.addEventListener("startInterviewTimer", startTimer);
        window.addEventListener("stopInterviewTimer", stopTimer);

        return () => {
            window.removeEventListener("startInterviewTimer", startTimer);
            window.removeEventListener("stopInterviewTimer", stopTimer);
            clearInterval(timer);
        };
    }, []);

    /* ===========================================================
       TRANSCRIPT LISTENER
    =========================================================== */
    useEffect(() => {
        const handler = (e) => {
            setTranscript((prev) => [...prev, e.detail]);
        };
        window.addEventListener("transcriptAdd", handler);
        return () => window.removeEventListener("transcriptAdd", handler);
    }, []);

    /* ===========================================================
       INSIGHTS LISTENER
    =========================================================== */
    useEffect(() => {
        const handler = (e) => {
            setInsights(e.detail);
            setAnomalyCounts(e.detail.counts || {});
        };
        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    /* ===========================================================
       STOP → FINAL EVALUATION
    =========================================================== */
    useEffect(() => {
        const stopHandler = async () => {
            if (!candidateId) return alert("Candidate ID missing");

            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            fd.append("mcq_result", JSON.stringify(mcqResult));
            fd.append("coding_result", JSON.stringify(codingResult));

            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
                method: "POST",
                body: fd,
            });

            const d = await r.json();

            navigate("/certificatedata", {
                state: {
                    ...d,              // AI interview result
                    mcq: mcqResult,    // MCQ stage result
                    coding: codingResult,
                    transcript,
                    insights,
                    anomalyCounts,
                },
            });
        };

        window.addEventListener("stopInterview", stopHandler);
        return () => window.removeEventListener("stopInterview", stopHandler);
    }, [candidateId, transcript, insights, anomalyCounts, mcqResult, codingResult]);

    /* ===========================================================
       MAIN RENDER
    =========================================================== */

    return (
        <div className="interview-root">

            <div className="interview-toolbar-container">
                <InterviewToolbar
                    candidateId={candidateId}
                    candidateName={candidateName}
                    jdText={jdText}
                    interviewTime={interviewTime}
                />
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
                            stage={stage}
                            onStartStage={handleStartStage}
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
                    {renderRightContent()}
                </div>

            </div>
        </div>
    );
}
