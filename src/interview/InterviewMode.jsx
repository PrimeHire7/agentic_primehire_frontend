
// // // // FILE: src/interview/InterviewMode.jsx

// // // import React, { useState, useEffect } from "react";
// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { API_BASE } from "@/utils/constants";
// // // import { useSearchParams } from "react-router-dom";

// // // import WebcamRecorder from "./WebcamRecorder";
// // // import TranscriptPanel from "./TranscriptPanel";
// // // import LiveInsightsPanel from "./LiveInsightsPanel";
// // // import AIChartPanel from "./AIChartPanel";
// // // import InterviewToolbar from "./InterviewToolbar";

// // // import "./InterviewMode.css";
// // // import MCQ from "./MCQ";
// // // import CodingTestPanel from "./CodingTestPanel";

// // // export default function InterviewMode() {
// // //     const location = useLocation();
// // //     const navigate = useNavigate();

// // //     // Candidate & JD info
// // //     const candidateName = location.state?.candidateName || "Anonymous";
// // //     const initialCandidateId = location.state?.candidateId || null;
// // //     const jdText = location.state?.jd_text || "";
// // //     const jdId = location.state?.jd_id || null;

// // //     // Core states
// // //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// // //     const [transcript, setTranscript] = useState([]);
// // //     const [insights, setInsights] = useState({});
// // //     const [anomalyCounts, setAnomalyCounts] = useState({});
// // //     const [interviewTime, setInterviewTime] = useState(0);

// // //     // Stage: 1 = MCQ, 2 = Coding, 3 = AI Interview
// // //     // const [stage, setStage] = useState(null);
// // //     const [stage, setStage] = useState(1); // MCQ first


// // //     // MCQ & Coding data
// // //     const [mcq, setMcq] = useState([]);
// // //     const [mcqLoaded, setMcqLoaded] = useState(false);
// // //     const [mcqResult, setMcqResult] = useState(null);
// // //     const [codingResult, setCodingResult] = useState(null);

// // //     const [searchParams] = useSearchParams();
// // //     const interviewToken = searchParams.get("token");

// // //     const aiStartedRef = React.useRef(false);

// // //     const lastInsightRef = React.useRef(0);

// // //     // useEffect(() => {
// // //     //     const handler = (e) => {
// // //     //         const now = Date.now();
// // //     //         if (now - lastInsightRef.current < 1000) return; // ⏱️ 1s throttle
// // //     //         lastInsightRef.current = now;

// // //     //         setInsights(e.detail);
// // //     //         setAnomalyCounts(e.detail.counts || {});
// // //     //     };

// // //     //     window.addEventListener("liveInsightsUpdate", handler);
// // //     //     return () => window.removeEventListener("liveInsightsUpdate", handler);
// // //     // }, []);

// // //     useEffect(() => {
// // //         if (stage !== 3) return;
// // //         if (!candidateId) return;
// // //         if (!interviewToken) return;
// // //         if (aiStartedRef.current) return;

// // //         console.log("🤖 SAFE AI INTERVIEW START");
// // //         aiStartedRef.current = true;

// // //         startAIInterview();
// // //     }, [stage, candidateId, interviewToken]);


// // //     /* ===========================================================
// // //        AI INTERVIEW INIT LISTENER
// // //     =========================================================== */
// // //     // useEffect(() => {
// // //     //     async function startAI() {
// // //     //         if (!candidateId) return;

// // //     //         console.log("🤖 Starting AI Interview (Tell me about yourself)");

// // //     //         const fd = new FormData();
// // //     //         fd.append("init", "true");
// // //     //         fd.append("candidate_name", candidateName);
// // //     //         fd.append("candidate_id", candidateId);
// // //     //         fd.append("job_description", jdText);
// // //     //         fd.append("token", interviewToken);

// // //     //         if (jdId) fd.append("jd_id", jdId);

// // //     //         try {
// // //     //             const r = await fetch(
// // //     //                 `${API_BASE}/mcp/interview_bot_beta/process-answer`,
// // //     //                 { method: "POST", body: fd }
// // //     //             );
// // //     //             const d = await r.json();

// // //     //             if (d.next_question) {
// // //     //                 window.dispatchEvent(
// // //     //                     new CustomEvent("transcriptAdd", {
// // //     //                         detail: { role: "ai", text: d.next_question }
// // //     //                     })
// // //     //                 );
// // //     //             }
// // //     //         } catch (e) {
// // //     //             console.error("AI init failed:", e);
// // //     //         }
// // //     //     }

// // //     //     window.addEventListener("startAIInterview", startAI);
// // //     //     return () => window.removeEventListener("startAIInterview", startAI);
// // //     // }, [candidateId, candidateName, jdText, jdId]);
// // //     /* ===========================================================
// // //    AUTO START AI INTERVIEW WHEN STAGE === 3
// // // =========================================================== */
// // //     async function startAIInterview() {
// // //         if (!candidateId || !interviewToken) {
// // //             console.error("❌ Missing candidateId or token");
// // //             return;
// // //         }

// // //         console.log("🤖 Explicitly starting AI interview");

// // //         const fd = new FormData();
// // //         fd.append("init", "true");
// // //         fd.append("candidate_name", candidateName);
// // //         fd.append("candidate_id", candidateId);
// // //         fd.append("job_description", jdText);
// // //         fd.append("token", interviewToken);
// // //         if (jdId) fd.append("jd_id", jdId);

// // //         try {
// // //             const r = await fetch(
// // //                 `${API_BASE}/mcp/interview_bot_beta/process-answer`,
// // //                 { method: "POST", body: fd }
// // //             );

// // //             const d = await r.json();
// // //             console.log("AI INIT RESPONSE:", d);

// // //             if (d.next_question) {
// // //                 window.dispatchEvent(
// // //                     new CustomEvent("transcriptAdd", {
// // //                         detail: { role: "ai", text: d.next_question }
// // //                     })
// // //                 );

// // //                 // ✅ SAFE TO RESUME FACE MONITOR NOW
// // //                 setTimeout(() => {
// // //                     window.dispatchEvent(new Event("resumeFaceMonitor"));
// // //                 }, 300);
// // //             }

// // //         } catch (e) {
// // //             console.error("❌ AI init failed:", e);
// // //         }
// // //     }



// // //     /* ===========================================================
// // //        START STAGE HANDLER (triggered by WebcamRecorder Start button)
// // //     =========================================================== */
// // //     // async function handleStartStage(stageNumber) {
// // //     //     console.log("Starting stage:", stageNumber);
// // //     //     setStage(stageNumber);

// // //     //     // ⭐ LOAD MCQ WHEN STAGE 1 STARTS
// // //     //     if (stageNumber === 1 && !mcqLoaded) {
// // //     //         const fd = new FormData();
// // //     //         fd.append("job_description", jdText);
// // //     //         fd.append("candidate_id", candidateId);
// // //     //         if (jdId) fd.append("jd_id", jdId);

// // //     //         const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/generate-mcq`, {
// // //     //             method: "POST",
// // //     //             body: fd,
// // //     //         });

// // //     //         const d = await r.json();
// // //     //         if (d.ok) {
// // //     //             setMcq(d.mcq);
// // //     //             setMcqLoaded(true);
// // //     //         } else {
// // //     //             alert("Failed to load MCQ");
// // //     //         }
// // //     //     }
// // //     // }
// // //     /* ===========================================================
// // //    AUTO LOAD MCQ WHEN STAGE === 1
// // // =========================================================== */
// // //     useEffect(() => {
// // //         if (stage !== 1) return;
// // //         if (mcqLoaded) return;
// // //         if (!candidateId) return;

// // //         console.log("📝 Loading MCQs...");

// // //         const loadMCQ = async () => {
// // //             try {
// // //                 const fd = new FormData();
// // //                 fd.append("job_description", jdText);
// // //                 fd.append("candidate_id", candidateId);
// // //                 if (jdId) fd.append("jd_id", jdId);

// // //                 const r = await fetch(
// // //                     `${API_BASE}/mcp/interview_bot_beta/generate-mcq`,
// // //                     { method: "POST", body: fd }
// // //                 );

// // //                 const d = await r.json();
// // //                 if (d.ok) {
// // //                     setMcq(d.mcq);
// // //                     setMcqLoaded(true);
// // //                 } else {
// // //                     alert("Failed to load MCQ");
// // //                 }
// // //             } catch (err) {
// // //                 console.error("MCQ load failed:", err);
// // //             }
// // //         };

// // //         loadMCQ();
// // //     }, [stage, candidateId, mcqLoaded]);

// // //     /* ===========================================================
// // //        RIGHT PANEL RENDER BASED ON STAGE
// // //     =========================================================== */
// // //     function renderRightContent() {
// // //         if (stage === 1) {
// // //             return (
// // //                 <MCQ
// // //                     questions={mcq}
// // //                     onComplete={(result) => {
// // //                         setMcqResult(result);
// // //                         setStage(2);
// // //                     }}
// // //                 />
// // //             );
// // //         }

// // //         if (stage === 2) {
// // //             return (
// // //                 <CodingTestPanel
// // //                     onComplete={(score) => {
// // //                         setCodingResult(score);

// // //                         // pause face monitor first
// // //                         window.dispatchEvent(new Event("pauseFaceMonitor"));

// // //                         // allow React to settle BEFORE stage switch
// // //                         requestAnimationFrame(() => {
// // //                             setStage(3);
// // //                         });
// // //                     }}

// // //                 />



// // //             );
// // //         }

// // //         if (stage === 3) {
// // //             return (
// // //                 <TranscriptPanel
// // //                     transcript={transcript}
// // //                     jdId={jdId}
// // //                     jdText={jdText}
// // //                 />
// // //             );
// // //         }

// // //         return (
// // //             <div className="tp-empty big-msg">
// // //                 Press "Start Interview" on the left to begin.
// // //             </div>
// // //         );
// // //     }

// // //     /* ===========================================================
// // //        INTERVIEW TIMER
// // //     =========================================================== */
// // //     useEffect(() => {
// // //         let timer = null;

// // //         const startTimer = () => {
// // //             if (timer) return;
// // //             timer = setInterval(() => setInterviewTime((t) => t + 1), 1000);
// // //         };

// // //         const stopTimer = () => {
// // //             clearInterval(timer);
// // //             timer = null;
// // //         };

// // //         window.addEventListener("startInterviewTimer", startTimer);
// // //         window.addEventListener("stopInterviewTimer", stopTimer);

// // //         return () => {
// // //             window.removeEventListener("startInterviewTimer", startTimer);
// // //             window.removeEventListener("stopInterviewTimer", stopTimer);
// // //             clearInterval(timer);
// // //         };
// // //     }, []);

// // //     /* ===========================================================
// // //        TRANSCRIPT LISTENER
// // //     =========================================================== */
// // //     useEffect(() => {
// // //         const handler = (e) => {
// // //             setTranscript((prev) => [...prev, e.detail]);
// // //         };
// // //         window.addEventListener("transcriptAdd", handler);
// // //         return () => window.removeEventListener("transcriptAdd", handler);
// // //     }, []);

// // //     /* ===========================================================
// // //        INSIGHTS LISTENER
// // //     =========================================================== */
// // //     // useEffect(() => {
// // //     //     const handler = (e) => {
// // //     //         setInsights(e.detail);
// // //     //         setAnomalyCounts(e.detail.counts || {});
// // //     //     };
// // //     //     window.addEventListener("liveInsightsUpdate", handler);
// // //     //     return () => window.removeEventListener("liveInsightsUpdate", handler);
// // //     // }, []);

// // //     /* ===========================================================
// // //        STOP → FINAL EVALUATION
// // //     =========================================================== */
// // //     useEffect(() => {
// // //         const stopHandler = async () => {
// // //             if (!candidateId) return alert("Candidate ID missing");

// // //             const fd = new FormData();
// // //             fd.append("candidate_name", candidateName);
// // //             fd.append("candidate_id", candidateId);
// // //             fd.append("job_description", jdText);
// // //             fd.append("mcq_result", JSON.stringify(mcqResult));
// // //             fd.append("coding_result", JSON.stringify(codingResult));

// // //             if (jdId) fd.append("jd_id", jdId);

// // //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
// // //                 method: "POST",
// // //                 body: fd,
// // //             });

// // //             const d = await r.json();

// // //             navigate("/certificatedata", {
// // //                 state: {
// // //                     ...d,              // AI interview result
// // //                     mcq: mcqResult,    // MCQ stage result
// // //                     coding: codingResult,
// // //                     transcript,
// // //                     insights,
// // //                     anomalyCounts,
// // //                 },
// // //             });
// // //         };

// // //         window.addEventListener("stopInterview", stopHandler);
// // //         return () => window.removeEventListener("stopInterview", stopHandler);
// // //     }, [candidateId, transcript, insights, anomalyCounts, mcqResult, codingResult]);

// // //     /* ===========================================================
// // //        MAIN RENDER
// // //     =========================================================== */

// // //     return (
// // //         <div className="interview-root">

// // //             <div className="interview-toolbar-container">
// // //                 <InterviewToolbar
// // //                     candidateId={candidateId}
// // //                     candidateName={candidateName}
// // //                     jdText={jdText}
// // //                     interviewTime={interviewTime}
// // //                 />
// // //             </div>

// // //             <div className="interview-layout">

// // //                 {/* LEFT SIDE */}
// // //                 <div className="left-panel">

// // //                     <div className="video-wrapper">
// // //                         <WebcamRecorder
// // //                             candidateName={candidateName}
// // //                             candidateId={candidateId}
// // //                             jdText={jdText}
// // //                             onCandidateId={setCandidateId}
// // //                             stage={stage}
// // //                         // onStartStage={handleStartStage}
// // //                         />
// // //                     </div>

// // //                     <div className="insight-score-row">
// // //                         <div className="insights-box">
// // //                             {/* <LiveInsightsPanel candidateId={candidateId} /> */}
// // //                             <LiveInsightsPanel />

// // //                         </div>

// // //                         <div className="aichart-box">
// // //                             <AIChartPanel />
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 {/* RIGHT SIDE */}
// // //                 <div className="right-panel">
// // //                     {renderRightContent()}
// // //                 </div>

// // //             </div>
// // //         </div>
// // //     );
// // // }
// // // FILE: src/interview/InterviewMode.jsx

// // import React, { useState, useEffect, useRef } from "react";
// // import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// // import { API_BASE } from "@/utils/constants";

// // import WebcamRecorder from "./WebcamRecorder";
// // import TranscriptPanel from "./TranscriptPanel";
// // import LiveInsightsPanel from "./LiveInsightsPanel";
// // import AIChartPanel from "./AIChartPanel";
// // import InterviewToolbar from "./InterviewToolbar";

// // import MCQ from "./MCQ";
// // import CodingTestPanel from "./CodingTestPanel";
// // import "./InterviewMode.css";

// // export default function InterviewMode() {
// //     const location = useLocation();
// //     const navigate = useNavigate();
// //     const [searchParams] = useSearchParams();

// //     /* =========================================================
// //        BASIC INFO
// //     ========================================================= */
// //     const candidateName = location.state?.candidateName || "Anonymous";
// //     const initialCandidateId = location.state?.candidateId || null;
// //     const jdText = location.state?.jd_text || "";
// //     const jdId = location.state?.jd_id || null;
// //     const interviewToken = searchParams.get("token");

// //     /* =========================================================
// //        CORE STATE
// //        stage:
// //          0 = idle
// //          1 = MCQ
// //          2 = Coding
// //          3 = AI Interview
// //     ========================================================= */
// //     const [stage, setStage] = useState(0);
// //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// //     const [interviewTime, setInterviewTime] = useState(0);

// //     const [transcript, setTranscript] = useState([]);
// //     const [insights, setInsights] = useState({});
// //     const [anomalyCounts, setAnomalyCounts] = useState({});

// //     /* =========================================================
// //        MCQ + CODING
// //     ========================================================= */
// //     const [mcq, setMcq] = useState([]);
// //     const [mcqLoaded, setMcqLoaded] = useState(false);
// //     const [mcqResult, setMcqResult] = useState(null);
// //     const [codingResult, setCodingResult] = useState(null);

// //     const [aiInterviewStarted, setAiInterviewStarted] = useState(false);

// //     /* =========================================================
// //        AI INTERVIEW SAFE START
// //     ========================================================= */
// //     const aiStartedRef = useRef(false);

// //     useEffect(() => {
// //         if (stage !== 3) return;
// //         if (!candidateId || !interviewToken) return;
// //         if (aiStartedRef.current) return;

// //         aiStartedRef.current = true;
// //         startAIInterview();
// //     }, [stage, candidateId, interviewToken]);

// //     async function startAIInterview() {
// //         try {
// //             const fd = new FormData();
// //             fd.append("init", "true");
// //             fd.append("candidate_name", candidateName);
// //             fd.append("candidate_id", candidateId);
// //             fd.append("job_description", jdText);
// //             fd.append("token", interviewToken);
// //             if (jdId) fd.append("jd_id", jdId);

// //             const r = await fetch(
// //                 `${API_BASE}/mcp/interview_bot_beta/process-answer`,
// //                 { method: "POST", body: fd }
// //             );
// //             const d = await r.json();

// //             if (d.next_question) {
// //                 window.dispatchEvent(
// //                     new CustomEvent("transcriptAdd", {
// //                         detail: { role: "ai", text: d.next_question }
// //                     })
// //                 );
// //             }
// //         } catch (e) {
// //             console.error("AI init failed:", e);
// //         }
// //     }

// //     /* =========================================================
// //        START INTERVIEW → MOVE TO MCQ
// //     ========================================================= */
// //     useEffect(() => {
// //         function onInterviewStart() {
// //             if (stage !== 0) return;
// //             console.log("🧠 Interview started → MCQ stage");
// //             setStage(1);
// //         }

// //         window.addEventListener("startInterviewTimer", onInterviewStart);
// //         return () =>
// //             window.removeEventListener("startInterviewTimer", onInterviewStart);
// //     }, [stage]);

// //     /* =========================================================
// //        AUTO LOAD MCQ WHEN STAGE === 1
// //     ========================================================= */
// //     useEffect(() => {
// //         if (stage !== 1) return;
// //         if (mcqLoaded) return;
// //         if (!candidateId) return;

// //         console.log("📝 Loading MCQs...");

// //         (async () => {
// //             try {
// //                 const fd = new FormData();
// //                 fd.append("job_description", jdText);
// //                 fd.append("candidate_id", candidateId);
// //                 if (jdId) fd.append("jd_id", jdId);

// //                 const r = await fetch(
// //                     `${API_BASE}/mcp/interview_bot_beta/generate-mcq`,
// //                     { method: "POST", body: fd }
// //                 );
// //                 const d = await r.json();

// //                 if (d.ok) {
// //                     setMcq(d.mcq);
// //                     setMcqLoaded(true);
// //                 } else {
// //                     alert("Failed to load MCQs");
// //                 }
// //             } catch (e) {
// //                 console.error("MCQ load failed:", e);
// //             }
// //         })();
// //     }, [stage, candidateId, mcqLoaded]);

// //     /* =========================================================
// //        INTERVIEW TIMER
// //     ========================================================= */
// //     useEffect(() => {
// //         let timer = null;

// //         const start = () => {
// //             if (timer) return;
// //             timer = setInterval(() => setInterviewTime(t => t + 1), 1000);
// //         };
// //         const stop = () => {
// //             clearInterval(timer);
// //             timer = null;
// //         };

// //         window.addEventListener("startInterviewTimer", start);
// //         window.addEventListener("stopInterviewTimer", stop);

// //         return () => {
// //             window.removeEventListener("startInterviewTimer", start);
// //             window.removeEventListener("stopInterviewTimer", stop);
// //             clearInterval(timer);
// //         };
// //     }, []);

// //     /* =========================================================
// //        TRANSCRIPT LISTENER
// //     ========================================================= */
// //     useEffect(() => {
// //         const h = (e) => setTranscript(p => [...p, e.detail]);
// //         window.addEventListener("transcriptAdd", h);
// //         return () => window.removeEventListener("transcriptAdd", h);
// //     }, []);

// //     /* =========================================================
// //        FINAL STOP → EVALUATION
// //     ========================================================= */
// //     useEffect(() => {
// //         async function onStop() {
// //             if (!candidateId) return;

// //             const fd = new FormData();
// //             fd.append("candidate_name", candidateName);
// //             fd.append("candidate_id", candidateId);
// //             fd.append("job_description", jdText);
// //             fd.append("mcq_result", JSON.stringify(mcqResult));
// //             fd.append("coding_result", JSON.stringify(codingResult));
// //             if (jdId) fd.append("jd_id", jdId);

// //             const r = await fetch(
// //                 `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
// //                 { method: "POST", body: fd }
// //             );
// //             const d = await r.json();

// //             navigate("/certificatedata", {
// //                 state: {
// //                     ...d,
// //                     mcq: mcqResult,
// //                     coding: codingResult,
// //                     transcript,
// //                     insights,
// //                     anomalyCounts
// //                 }
// //             });
// //         }

// //         window.addEventListener("stopInterview", onStop);
// //         return () => window.removeEventListener("stopInterview", onStop);
// //     }, [candidateId, mcqResult, codingResult, transcript]);

// //     /* =========================================================
// //        RIGHT PANEL
// //     ========================================================= */
// //     function renderRight() {
// //         if (stage === 1) {
// //             return (
// //                 <MCQ
// //                     questions={mcq}
// //                     onComplete={(r) => {
// //                         setMcqResult(r);
// //                         setStage(2);
// //                     }}
// //                 />
// //             );
// //         }

// //         if (stage === 2) {
// //             return (
// //                 <CodingTestPanel
// //                     onComplete={(r) => {
// //                         setCodingResult(r);
// //                         setStage(3);
// //                     }}
// //                 />
// //             );
// //         }

// //         if (stage === 3) {
// //             return <TranscriptPanel transcript={transcript} jdId={jdId} jdText={jdText} />;
// //         }

// //         return <div className="tp-empty big-msg">Press Start Interview</div>;
// //     }

// //     /* =========================================================
// //        RENDER
// //     ========================================================= */
// //     return (
// //         <div className="interview-root">
// //             <InterviewToolbar
// //                 candidateId={candidateId}
// //                 candidateName={candidateName}
// //                 jdText={jdText}
// //                 interviewTime={interviewTime}
// //             />

// //             <div className="interview-layout">
// //                 <div className="left-panel">
// //                     <WebcamRecorder
// //                         candidateName={candidateName}
// //                         candidateId={candidateId}
// //                         jdText={jdText}
// //                         onCandidateId={setCandidateId}
// //                         stage={stage}
// //                     />

// //                     <div className="insight-score-row">
// //                         <LiveInsightsPanel />
// //                         <AIChartPanel />
// //                     </div>
// //                 </div>

// //                 <div className="right-panel">
// //                     {renderRight()}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// import React, { useState, useEffect, useRef } from "react";
// import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";

// import WebcamRecorder from "./WebcamRecorder";
// import TranscriptPanel from "./TranscriptPanel";
// import LiveInsightsPanel from "./LiveInsightsPanel";
// import AIChartPanel from "./AIChartPanel";
// import InterviewToolbar from "./InterviewToolbar";
// import MCQ from "./MCQ";
// import CodingTestPanel from "./CodingTestPanel";

// import "./InterviewMode.css";

// export default function InterviewMode() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     /* ---------------- Candidate & JD ---------------- */
//     const candidateName = location.state?.candidateName || "Anonymous";
//     const jdText = location.state?.jd_text || "";
//     const jdId = location.state?.jd_id || null;
//     const initialCandidateId = location.state?.candidateId || null;

//     /* ---------------- Core State ---------------- */
//     const [candidateId, setCandidateId] = useState(initialCandidateId);
//     const [stage, setStage] = useState(1); // 1=MCQ, 2=Coding, 3=AI
//     const [aiInterviewStarted, setAiInterviewStarted] = useState(false);

//     const [mcq, setMcq] = useState([]);
//     const [mcqLoaded, setMcqLoaded] = useState(false);
//     const [mcqResult, setMcqResult] = useState(null);
//     const [codingResult, setCodingResult] = useState(null);

//     const [transcript, setTranscript] = useState([]);
//     const [interviewTime, setInterviewTime] = useState(0);

//     const [searchParams] = useSearchParams();
//     const interviewToken = searchParams.get("token");

//     const aiInitOnceRef = useRef(false);

//     /* ======================================================
//        LOAD MCQs (AUTO)
//     ====================================================== */
//     useEffect(() => {
//         if (stage !== 1 || mcqLoaded || !candidateId) return;

//         console.log("📝 Loading MCQs...");

//         (async () => {
//             const fd = new FormData();
//             fd.append("job_description", jdText);
//             fd.append("candidate_id", candidateId);
//             if (jdId) fd.append("jd_id", jdId);

//             const r = await fetch(
//                 `${API_BASE}/mcp/interview_bot_beta/generate-mcq`,
//                 { method: "POST", body: fd }
//             );
//             const d = await r.json();

//             if (d.ok) {
//                 setMcq(d.mcq);
//                 setMcqLoaded(true);
//             }
//         })();
//     }, [stage, candidateId, mcqLoaded]);

//     /* ======================================================
//        START AI INTERVIEW (ONCE)
//     ====================================================== */
//     useEffect(() => {
//         if (stage !== 3) return;
//         if (!candidateId || !interviewToken) return;
//         if (aiInitOnceRef.current) return;

//         aiInitOnceRef.current = true;
//         console.log("🤖 Initializing AI Interview");

//         (async () => {
//             const fd = new FormData();
//             fd.append("init", "true");
//             fd.append("candidate_name", candidateName);
//             fd.append("candidate_id", candidateId);
//             fd.append("job_description", jdText);
//             fd.append("token", interviewToken);
//             if (jdId) fd.append("jd_id", jdId);

//             const r = await fetch(
//                 `${API_BASE}/mcp/interview_bot_beta/process-answer`,
//                 { method: "POST", body: fd }
//             );

//             const d = await r.json();

//             if (d.next_question) {
//                 setAiInterviewStarted(true); // 🔑 KEY FIX

//                 window.dispatchEvent(
//                     new CustomEvent("transcriptAdd", {
//                         detail: { role: "ai", text: d.next_question }
//                     })
//                 );
//             }
//         })();
//     }, [stage, candidateId, interviewToken]);

//     /* ======================================================
//        TRANSCRIPT LISTENER
//     ====================================================== */
//     useEffect(() => {
//         const handler = (e) => {
//             setTranscript((prev) => [...prev, e.detail]);
//         };
//         window.addEventListener("transcriptAdd", handler);
//         return () => window.removeEventListener("transcriptAdd", handler);
//     }, []);

//     /* ======================================================
//        TIMER
//     ====================================================== */
//     useEffect(() => {
//         let timer = null;

//         const start = () => {
//             if (!timer) timer = setInterval(() => setInterviewTime(t => t + 1), 1000);
//         };
//         const stop = () => {
//             clearInterval(timer);
//             timer = null;
//         };

//         window.addEventListener("startInterviewTimer", start);
//         window.addEventListener("stopInterviewTimer", stop);

//         return () => {
//             stop();
//             window.removeEventListener("startInterviewTimer", start);
//             window.removeEventListener("stopInterviewTimer", stop);
//         };
//     }, []);

//     /* ======================================================
//        STOP INTERVIEW → FINAL EVAL
//     ====================================================== */
//     useEffect(() => {
//         const stopHandler = async () => {
//             const fd = new FormData();
//             fd.append("candidate_name", candidateName);
//             fd.append("candidate_id", candidateId);
//             fd.append("job_description", jdText);
//             fd.append("mcq_result", JSON.stringify(mcqResult));
//             fd.append("coding_result", JSON.stringify(codingResult));
//             if (jdId) fd.append("jd_id", jdId);

//             const r = await fetch(
//                 `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
//                 { method: "POST", body: fd }
//             );

//             const d = await r.json();

//             navigate("/certificatedata", {
//                 state: {
//                     ...d,
//                     mcq: mcqResult,
//                     coding: codingResult,
//                     transcript
//                 }
//             });
//         };

//         window.addEventListener("stopInterview", stopHandler);
//         return () => window.removeEventListener("stopInterview", stopHandler);
//     }, [candidateId, mcqResult, codingResult, transcript]);

//     /* ======================================================
//        RIGHT PANEL
//     ====================================================== */
//     function renderRightPanel() {
//         if (stage === 1)
//             return <MCQ questions={mcq} onComplete={(r) => { setMcqResult(r); setStage(2); }} />;

//         if (stage === 2)
//             return <CodingTestPanel onComplete={(r) => { setCodingResult(r); setStage(3); }} />;

//         if (stage === 3)
//             return <TranscriptPanel transcript={transcript} jdText={jdText} jdId={jdId} />;

//         return null;
//     }

//     /* ======================================================
//        RENDER
//     ====================================================== */
//     return (
//         <div className="interview-root">
//             <InterviewToolbar
//                 candidateId={candidateId}
//                 candidateName={candidateName}
//                 jdText={jdText}
//                 interviewTime={interviewTime}
//             />

//             <div className="interview-layout">
//                 <div className="left-panel">
//                     <WebcamRecorder
//                         candidateName={candidateName}
//                         candidateId={candidateId}
//                         stage={stage}
//                         aiInterviewStarted={aiInterviewStarted}
//                     />

//                     <div className="insight-score-row">
//                         <LiveInsightsPanel />
//                         <AIChartPanel />
//                     </div>
//                 </div>

//                 <div className="right-panel">
//                     {renderRightPanel()}
//                 </div>
//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "@/utils/constants";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import AIChartPanel from "./AIChartPanel";
import InterviewToolbar from "./InterviewToolbar";
import MCQ from "./MCQ";
import CodingTestPanel from "./CodingTestPanel";

import "./InterviewMode.css";

export default function InterviewMode() {
    const location = useLocation();
    const navigate = useNavigate();

    const candidateName = location.state?.candidateName || "Anonymous";
    const jdText = location.state?.jd_text || "";
    const jdId = location.state?.jd_id || null;
    const initialCandidateId = location.state?.candidateId || null;

    const [candidateId] = useState(initialCandidateId);
    const [stage, setStage] = useState(1);
    const [aiInterviewStarted, setAiInterviewStarted] = useState(false);

    const [mcq, setMcq] = useState([]);
    const [mcqLoaded, setMcqLoaded] = useState(false);
    const [mcqResult, setMcqResult] = useState(null);
    const [codingResult, setCodingResult] = useState(null);

    const [transcript, setTranscript] = useState([]);
    const [interviewTime, setInterviewTime] = useState(0);

    const [searchParams] = useSearchParams();
    const interviewToken =
        location.state?.interviewToken ||
        new URLSearchParams(window.location.search).get("token") ||
        null;


    const aiInitOnceRef = useRef(false);

    /* ---------------- LOAD MCQs ---------------- */
    useEffect(() => {
        if (stage !== 1 || mcqLoaded || !candidateId) return;

        (async () => {
            const fd = new FormData();
            fd.append("job_description", jdText);
            fd.append("candidate_id", candidateId);
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(
                `${API_BASE}/mcp/interview_bot_beta/generate-mcq`,
                { method: "POST", body: fd }
            );
            const d = await r.json();

            if (d?.ok && Array.isArray(d.mcq)) {
                setMcq(d.mcq);
                setMcqLoaded(true);
            }
        })();
    }, [stage, candidateId, mcqLoaded]);


    /* ======================================================
   FORCE START STAGE 3 (FROM CODING PANEL)
====================================================== */
    useEffect(() => {
        const handler = () => {
            console.log("🚀 Stage 3 start signal received");

            setStage(prev => (prev === 3 ? prev : 3));

            // 🔁 Reset AI state cleanly
            aiInitOnceRef.current = false;
            setAiInterviewStarted(false);
        };

        window.addEventListener("startStage3", handler);
        return () => window.removeEventListener("startStage3", handler);
    }, []);

    console.log("AI INIT CHECK:", {
        stage,
        candidateId,
        interviewToken,
        aiInitOnce: aiInitOnceRef.current
    });

    /* ---------------- INIT AI INTERVIEW ---------------- */
    useEffect(() => {
        if (stage !== 3) return;
        if (!candidateId || !interviewToken) return;
        if (aiInitOnceRef.current) return;

        aiInitOnceRef.current = true;
        console.log("🤖 Initializing AI Interview");

        (async () => {
            const fd = new FormData();

            fd.append("init", "true");
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            fd.append("token", interviewToken);
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(
                `${API_BASE}/mcp/interview_bot_beta/process-answer`,
                { method: "POST", body: fd }
            );
            const d = await r.json();

            if (typeof d?.next_question === "string" && d.next_question.trim()) {
                setAiInterviewStarted(true);

                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: { role: "ai", text: d.next_question }
                    })
                );
            } else {
                console.warn("AI init returned no question", d);
            }
        })();
    }, [stage, candidateId, interviewToken]);


    /* ---------------- TRANSCRIPT LISTENER (SAFE) ---------------- */
    useEffect(() => {
        const handler = (e) => {
            const msg = e.detail;
            if (!msg || typeof msg !== "object") return;
            if (!msg.role || typeof msg.text !== "string") return;

            setTranscript((prev) => [...prev, msg]);
        };

        window.addEventListener("transcriptAdd", handler);
        return () => window.removeEventListener("transcriptAdd", handler);
    }, []);

    /* ---------------- TIMER ---------------- */
    useEffect(() => {
        let timer = null;

        const start = () => {
            if (!timer) timer = setInterval(() => setInterviewTime(t => t + 1), 1000);
        };
        const stop = () => {
            clearInterval(timer);
            timer = null;
        };

        window.addEventListener("startInterviewTimer", start);
        window.addEventListener("stopInterviewTimer", stop);

        return () => {
            stop();
            window.removeEventListener("startInterviewTimer", start);
            window.removeEventListener("stopInterviewTimer", stop);
        };
    }, []);

    /* ---------------- STOP INTERVIEW ---------------- */
    useEffect(() => {
        const stopHandler = async () => {
            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", candidateId);
            fd.append("job_description", jdText);
            fd.append("mcq_result", JSON.stringify(mcqResult));
            fd.append("coding_result", JSON.stringify(codingResult));
            if (jdId) fd.append("jd_id", jdId);

            const r = await fetch(
                `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
                { method: "POST", body: fd }
            );
            const d = await r.json();

            navigate("/certificatedata", {
                state: { ...d, mcq: mcqResult, coding: codingResult, transcript }
            });
        };

        window.addEventListener("stopInterview", stopHandler);
        return () => window.removeEventListener("stopInterview", stopHandler);
    }, [candidateId, mcqResult, codingResult, transcript]);

    /* ---------------- RIGHT PANEL ---------------- */
    const renderRightPanel = () => {
        if (stage === 1)
            return <MCQ questions={mcq} onComplete={(r) => { setMcqResult(r); setStage(2); }} />;

        if (stage === 2)
            return <CodingTestPanel onComplete={(r) => { setCodingResult(r); }} />;

        if (stage === 3)
            return <TranscriptPanel transcript={transcript} jdText={jdText} jdId={jdId} />;

        return null;
    };

    return (
        <div className="interview-root">
            <InterviewToolbar
                candidateId={candidateId}
                candidateName={candidateName}
                jdText={jdText}
                interviewTime={interviewTime}
                interviewToken={interviewToken}
            />

            <div className="interview-layout">
                <div className="left-panel">
                    <WebcamRecorder
                        candidateName={candidateName}
                        candidateId={candidateId}
                        stage={stage}
                        aiInterviewStarted={aiInterviewStarted}
                    />

                    <div className="insight-score-row">
                        <LiveInsightsPanel />
                        <AIChartPanel />
                    </div>
                </div>

                <div className="right-panel">
                    {renderRightPanel()}
                </div>
            </div>
        </div>
    );
}
