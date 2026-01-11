
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import AIChartPanel from "./AIChartPanel";
import InterviewToolbar from "./InterviewToolbar";
import MCQ from "./MCQ";
import CodingTestPanel from "./CodingTestPanel";

import "./InterviewMode.css";

const INTERVIEW_FLAG = "INTERVIEW_STARTED";
console.log("🧨 InterviewMode mounted");


export default function InterviewMode() {
    const location = useLocation();
    const navigate = useNavigate();

    /* ================= CONTEXT ================= */
    const attemptId = location.state?.attemptId || null;
    const candidateName = location.state?.candidateName || "Anonymous";
    const candidateId = location.state?.candidateId || null;
    const jdText = location.state?.jd_text || "";
    const jdId = location.state?.jd_id || null;
    const interviewToken = location.state?.interviewToken || null;

    /* ================= STATE ================= */
    const [stage, setStage] = useState(1); // 1=MCQ | 2=Coding | 3=AI
    const [mcq, setMcq] = useState([]);
    const [mcqLoaded, setMcqLoaded] = useState(false);

    const [mcqResult, setMcqResult] = useState(null);
    const [codingResult, setCodingResult] = useState(null);

    const [transcript, setTranscript] = useState([]);
    const [interviewTime, setInterviewTime] = useState(0);
    const [aiInitDone, setAiInitDone] = useState(false);

    const aiBusyRef = useRef(false);
    const [anomalyCounts, setAnomalyCounts] = useState({});

    useEffect(() => {
        const handler = (e) => {
            if (!e.detail?.counts) return;
            setAnomalyCounts((prev) => ({
                ...prev,
                ...e.detail.counts,
            }));
        };

        window.addEventListener("liveInsightsUpdate", handler);
        return () => window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    /* ================= SAFETY ================= */
    useEffect(() => {
        if (!attemptId) {
            alert("Invalid interview session.");
            navigate("/", { replace: true });
        }
    }, [attemptId, navigate]);

    /* ================= LOAD MCQ ================= */
    useEffect(() => {
        if (stage !== 1 || mcqLoaded || !attemptId) return;

        (async () => {
            try {
                const fd = new FormData();
                fd.append("attempt_id", attemptId);
                fd.append("job_description", jdText);
                if (jdId) fd.append("jd_id", jdId);

                const res = await fetch(
                    `${API_BASE}/mcp/interview_bot_beta/generate-mcq`,
                    { method: "POST", body: fd }
                );

                if (!res.ok) {
                    console.error("❌ MCQ fetch failed:", res.status);
                    return;
                }

                const d = await res.json();
                if (d?.ok) {
                    setMcq(d.mcq || []);
                    setMcqLoaded(true);
                }
            } catch (err) {
                console.error("❌ MCQ load error:", err);
            }
        })();
    }, [stage, attemptId, jdText, jdId, mcqLoaded]);

    /* ================= AI INIT (ONCE) ================= */
    useEffect(() => {
        if (
            stage !== 3 ||
            aiInitDone ||
            !attemptId ||
            !interviewToken
        )
            return;

        setAiInitDone(true);
        aiBusyRef.current = true;

        (async () => {
            try {
                const fd = new FormData();
                fd.append("init", "true");
                fd.append("attempt_id", attemptId);
                fd.append("candidate_id", candidateId);
                fd.append("candidate_name", candidateName);
                fd.append("job_description", jdText);
                fd.append("token", interviewToken);
                if (jdId) fd.append("jd_id", jdId);

                const res = await fetch(
                    `${API_BASE}/mcp/interview_bot_beta/process-answer`,
                    { method: "POST", body: fd }
                );

                const data = await res.json();

                if (data?.next_question) {
                    window.dispatchEvent(
                        new CustomEvent("transcriptAdd", {
                            detail: {
                                role: "ai",
                                text: data.next_question,
                            },
                        })
                    );
                }
            } catch (e) {
                console.error("❌ AI init failed:", e);
            } finally {
                aiBusyRef.current = false;
            }
        })();
    }, [
        stage,
        aiInitDone,
        attemptId,
        interviewToken,
        candidateId,
        candidateName,
        jdText,
        jdId,
    ]);

    /* ================= TIMER ================= */
    useEffect(() => {
        const id = setInterval(() => {
            setInterviewTime((t) => t + 1);
        }, 1000);

        return () => clearInterval(id);
    }, []);

    /* ================= STOP INTERVIEW (FINALIZED) ================= */
    useEffect(() => {
        let submitting = false;

        const handler = async () => {
            if (submitting) return;

            // ⏳ Wait until MCQ & Coding are ready
            let retries = 0;
            while ((!mcqResult || !codingResult) && retries < 20) {
                await new Promise((r) => setTimeout(r, 150));
                retries++;
            }

            if (!mcqResult || !codingResult) {
                console.error("❌ Interview data not ready", {
                    mcqResult,
                    codingResult,
                });
                return;
            }

            submitting = true;

            console.log("✅ FINAL INTERVIEW SUBMIT", {
                mcqResult,
                codingResult,
            });

            const fd = new FormData();
            fd.append("attempt_id", attemptId);
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            fd.append("mcq_result", JSON.stringify(mcqResult));
            fd.append("coding_result", JSON.stringify(codingResult));
            fd.append("anomaly_counts", JSON.stringify(anomalyCounts));
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(
                `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
                { method: "POST", body: fd }
            );

            const d = await r.json();

            // navigate("/certificatedata", { state: d });
            navigate("/certificatedata", {
                state: {
                    ...d,
                    anomaly_counts: anomalyCounts,
                },
            });

        };

        window.addEventListener("stopInterview", handler);
        return () => window.removeEventListener("stopInterview", handler);
    }, [mcqResult, codingResult, attemptId, candidateName, candidateId, jdText, jdId, navigate]);

    /* ================= RIGHT PANEL ================= */
    const renderRight = () => {
        if (stage === 1) {
            return (
                <MCQ
                    questions={mcq}
                    onComplete={(r) => {
                        setMcqResult(r);
                        setStage(2);
                    }}
                />
            );
        }

        if (stage === 2) {
            return (
                <CodingTestPanel
                    onComplete={(r) => {
                        setCodingResult(r);
                        sessionStorage.setItem(INTERVIEW_FLAG, "true");
                        setStage(3);
                    }}
                />
            );
        }

        return <TranscriptPanel transcript={transcript} />;
    };

    return (
        <div className="interview-root">
            <InterviewToolbar
                attemptId={attemptId}
                candidateId={candidateId}
                candidateName={candidateName}
                jdText={jdText}
                interviewTime={interviewTime}
                interviewToken={interviewToken}
                jdId={jdId}
            />

            <div className="interview-layout">
                <div className="left-panel">
                    <WebcamRecorder
                        attemptId={attemptId}
                        candidateName={candidateName}
                        // faceMonitorEnabled={stage === 3}
                        faceMonitorEnabled={true}



                    />

                    <LiveInsightsPanel />
                    <AIChartPanel />
                </div>

                <div className="right-panel">{renderRight()}</div>
            </div>
        </div>
    );
}
