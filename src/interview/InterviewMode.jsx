// // // // // FILE: src/interview/InterviewMode.jsx
// // // // import React, { useState, useEffect } from "react";
// // // // import { useLocation } from "react-router-dom";

// // // // import WebcamRecorder from "./WebcamRecorder";
// // // // import TranscriptPanel from "./TranscriptPanel";
// // // // import LiveInsightsPanel from "./LiveInsightsPanel";
// // // // import AIChartPanel from "./AIChartPanel";
// // // // import InterviewToolbar from "./InterviewToolbar";

// // // // import "./InterviewMode.css";

// // // // export default function InterviewMode() {
// // // //     const location = useLocation();

// // // //     const candidateName = location.state?.candidateName || "Anonymous";
// // // //     const initialCandidateId = location.state?.candidateId || null;
// // // //     const jdText = location.state?.jd_text || "";

// // // //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// // // //     const [transcript, setTranscript] = useState([]);

// // // //     // Global event → add transcript entry
// // // //     useEffect(() => {
// // // //         const handler = (e) => {
// // // //             const msg = e.detail;
// // // //             setTranscript((prev) => [...prev, msg]);
// // // //         };
// // // //         window.addEventListener("transcriptAdd", handler);
// // // //         return () => window.removeEventListener("transcriptAdd", handler);
// // // //     }, []);

// // // //     return (
// // // //         <div className="interview-root">

// // // //             <div className="interview-toolbar-container">
// // // //                 <InterviewToolbar
// // // //                     candidateId={candidateId}
// // // //                     candidateName={candidateName}
// // // //                     jdText={jdText}
// // // //                 />

// // // //             </div>

// // // //             <div className="interview-layout">

// // // //                 {/* LEFT SIDE */}
// // // //                 <div className="left-panel">

// // // //                     <div className="video-wrapper">
// // // //                         <WebcamRecorder
// // // //                             candidateName={candidateName}
// // // //                             candidateId={candidateId}
// // // //                             jdText={jdText}
// // // //                             onCandidateId={setCandidateId}
// // // //                         />
// // // //                     </div>

// // // //                     <div className="insight-score-row">
// // // //                         <div className="insights-box">
// // // //                             <LiveInsightsPanel candidateId={candidateId} />
// // // //                         </div>

// // // //                         <div className="aichart-box">
// // // //                             <AIChartPanel />
// // // //                         </div>
// // // //                     </div>

// // // //                 </div>

// // // //                 {/* RIGHT SIDE */}
// // // //                 <div className="right-panel">
// // // //                     <TranscriptPanel
// // // //                         transcript={transcript}
// // // //                         jdId={location.state?.jd_id || null}
// // // //                         jdText={jdText}
// // // //                     />

// // // //                 </div>

// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }
// // // import React, { useState, useEffect } from "react";
// // // import { useLocation, useNavigate } from "react-router-dom";
// // // import { API_BASE } from "@/utils/constants";

// // // import WebcamRecorder from "./WebcamRecorder";
// // // import TranscriptPanel from "./TranscriptPanel";
// // // import LiveInsightsPanel from "./LiveInsightsPanel";
// // // import AIChartPanel from "./AIChartPanel";
// // // import InterviewToolbar from "./InterviewToolbar";

// // // import "./InterviewMode.css";

// // // export default function InterviewMode() {
// // //     const location = useLocation();
// // //     const navigate = useNavigate();

// // //     const candidateName = location.state?.candidateName || "Anonymous";
// // //     const initialCandidateId = location.state?.candidateId || null;
// // //     const jdText = location.state?.jd_text || "";

// // //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// // //     const [transcript, setTranscript] = useState([]);

// // //     const [insights, setInsights] = useState({});
// // //     const [anomalyCounts, setAnomalyCounts] = useState({});

// // //     // Transcript listener
// // //     useEffect(() => {
// // //         const handler = (e) => {
// // //             setTranscript((prev) => [...prev, e.detail]);
// // //         };
// // //         window.addEventListener("transcriptAdd", handler);
// // //         return () => window.removeEventListener("transcriptAdd", handler);
// // //     }, []);

// // //     // Insights listener
// // //     useEffect(() => {
// // //         const handler = (e) => {
// // //             setInsights(e.detail);
// // //             setAnomalyCounts(e.detail.counts || {});
// // //         };
// // //         window.addEventListener("liveInsightsUpdate", handler);
// // //         return () => window.removeEventListener("liveInsightsUpdate", handler);
// // //     }, []);

// // //     // STOP interview → Evaluate
// // //     useEffect(() => {
// // //         const stopHandler = async () => {
// // //             if (!candidateId) return;

// // //             const fd = new FormData();
// // //             fd.append("candidate_name", candidateName);
// // //             fd.append("candidate_id", candidateId);
// // //             fd.append("job_description", jdText);

// // //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
// // //                 method: "POST",
// // //                 body: fd,
// // //             });

// // //             const d = await r.json();

// // //             if (d.ok) {
// // //                 navigate("/certificatedata", {
// // //                     state: {
// // //                         scores: d.scores,
// // //                         candidateName,
// // //                         candidateId,
// // //                         overall: d.overall,
// // //                         result: d.result,
// // //                         feedback: d.feedback,
// // //                         designation: d.designation,

// // //                         // NEW: Full dataset
// // //                         transcript,
// // //                         insights,
// // //                         anomalyCounts,
// // //                     }
// // //                 });
// // //             } else {
// // //                 alert("Evaluation failed: " + d.error);
// // //             }
// // //         };

// // //         window.addEventListener("stopInterview", stopHandler);
// // //         return () => window.removeEventListener("stopInterview", stopHandler);
// // //     }, [candidateId, transcript, insights, anomalyCounts]);

// // //     return (
// // //         <div className="interview-root">
// // //             <div className="interview-toolbar-container">
// // //                 <InterviewToolbar
// // //                     candidateId={candidateId}
// // //                     candidateName={candidateName}
// // //                     jdText={jdText}
// // //                 />
// // //             </div>

// // //             <div className="interview-layout">
// // //                 <div className="left-panel">
// // //                     <div className="video-wrapper">
// // //                         <WebcamRecorder
// // //                             candidateName={candidateName}
// // //                             candidateId={candidateId}
// // //                             jdText={jdText}
// // //                             onCandidateId={setCandidateId}
// // //                         />
// // //                     </div>

// // //                     <div className="insight-score-row">
// // //                         <div className="insights-box">
// // //                             <LiveInsightsPanel candidateId={candidateId} />
// // //                         </div>

// // //                         <div className="aichart-box">
// // //                             <AIChartPanel />
// // //                         </div>
// // //                     </div>
// // //                 </div>

// // //                 <div className="right-panel">
// // //                     <TranscriptPanel
// // //                         transcript={transcript}
// // //                         jdId={location.state?.jd_id || null}
// // //                         jdText={jdText}
// // //                     />
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }
// // // FILE: src/interview/InterviewMode.jsx
// // import React, { useState, useEffect } from "react";
// // import { useLocation, useNavigate } from "react-router-dom";
// // import { API_BASE } from "@/utils/constants";

// // import WebcamRecorder from "./WebcamRecorder";
// // import TranscriptPanel from "./TranscriptPanel";
// // import LiveInsightsPanel from "./LiveInsightsPanel";
// // import AIChartPanel from "./AIChartPanel";
// // import InterviewToolbar from "./InterviewToolbar";

// // import "./InterviewMode.css";
// // import MCQ from "./MCQ";
// // import CodingTestPanel from "./CodingTestPanel";

// // export default function InterviewMode() {
// //     const location = useLocation();
// //     const navigate = useNavigate();

// //     const candidateName = location.state?.candidateName || "Anonymous";
// //     const initialCandidateId = location.state?.candidateId || null;
// //     const jdText = location.state?.jd_text || "";
// //     const jdId = location.state?.jd_id || null;

// //     const [candidateId, setCandidateId] = useState(initialCandidateId);
// //     const [transcript, setTranscript] = useState([]);

// //     const [insights, setInsights] = useState({});
// //     const [anomalyCounts, setAnomalyCounts] = useState({});
// //     const [perQuestion, setPerQuestion] = useState([]);

// //     const [interviewTime, setInterviewTime] = useState(0);

// //     const [stage, setStage] = useState(1); // 1 = MCQ, 2 = Coding, 3 = AI Interview
// //     useEffect(() => {
// //         async function loadMCQ() {
// //             if (stage !== 1) return;
// //             if (!candidateId) return;

// //             const fd = new FormData();
// //             fd.append("job_description", jdText);
// //             fd.append("candidate_id", candidateId);
// //             if (jdId) fd.append("jd_id", jdId);

// //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/generate-mcq`, {
// //                 method: "POST",
// //                 body: fd
// //             });

// //             const d = await r.json();
// //             if (d.ok) {
// //                 window.generatedMCQ = d.mcq;   // store globally or state
// //             } else {
// //                 alert("Failed to load MCQ");
// //             }
// //         }

// //         loadMCQ();
// //     }, [stage, candidateId]);

// //     // =======================================================
// //     // ⭐ STAGE MANAGEMENT
// //     // =======================================================

// //     function renderRightContent() {
// //         if (stage === 1) {
// //             return (
// //                 <MCQ onComplete={() => setStage(2)} />
// //             );
// //         }

// //         if (stage === 2) {
// //             return (
// //                 <CodingTestPanel onComplete={() => setStage(3)} />
// //             );
// //         }

// //         // Stage 3 → Transcript Panel
// //         return (
// //             <TranscriptPanel
// //                 transcript={transcript}
// //                 jdId={jdId}
// //                 jdText={jdText}
// //             />
// //         );
// //     }
// //     // =======================================================
// //     // Interview timer
// //     useEffect(() => {
// //         let timer = null;

// //         const startTimer = () => {
// //             if (timer) return;
// //             timer = setInterval(() => {
// //                 setInterviewTime((t) => t + 1);
// //             }, 1000);
// //         };

// //         const stopTimer = () => {
// //             clearInterval(timer);
// //             timer = null;
// //         };

// //         window.addEventListener("startInterviewTimer", startTimer);
// //         window.addEventListener("stopInterviewTimer", stopTimer);

// //         return () => {
// //             window.removeEventListener("startInterviewTimer", startTimer);
// //             window.removeEventListener("stopInterviewTimer", stopTimer);
// //             clearInterval(timer);
// //         };
// //     }, []);

// //     // Transcript collector
// //     useEffect(() => {
// //         const handler = (e) => {
// //             setTranscript((prev) => [...prev, e.detail]);
// //         };
// //         window.addEventListener("transcriptAdd", handler);
// //         return () => window.removeEventListener("transcriptAdd", handler);
// //     }, []);

// //     // Insights collector
// //     useEffect(() => {
// //         const handler = (e) => {
// //             setInsights(e.detail);
// //             setAnomalyCounts(e.detail.counts || {});
// //         };
// //         window.addEventListener("liveInsightsUpdate", handler);
// //         return () => window.removeEventListener("liveInsightsUpdate", handler);
// //     }, []);

// //     // STOP INTERVIEW → Evaluate transcript and navigate
// //     useEffect(() => {
// //         const stopHandler = async () => {
// //             if (!candidateId) return alert("Candidate ID missing");

// //             const fd = new FormData();
// //             fd.append("candidate_name", candidateName);
// //             fd.append("candidate_id", candidateId);
// //             fd.append("job_description", jdText);
// //             if (jdId) fd.append("jd_id", jdId);

// //             const r = await fetch(
// //                 `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
// //                 { method: "POST", body: fd }
// //             );
// //             const d = await r.json();

// //             if (!d.ok) {
// //                 alert("Evaluation failed: " + d.error);
// //                 return;
// //             }

// //             navigate("/certificatedata", {
// //                 state: {
// //                     ...d,              // backend output
// //                     transcript,        // frontend transcript
// //                     insights,          // face insights
// //                     anomalyCounts,     // anomaly summary
// //                 },
// //             });
// //         };

// //         window.addEventListener("stopInterview", stopHandler);
// //         return () => window.removeEventListener("stopInterview", stopHandler);

// //     }, [candidateId, transcript, insights, anomalyCounts]);

// //     return (
// //         <div className="interview-root">

// //             <div className="interview-toolbar-container">
// //                 <InterviewToolbar
// //                     candidateId={candidateId}
// //                     candidateName={candidateName}
// //                     jdText={jdText}
// //                     interviewTime={interviewTime}
// //                 />

// //             </div>

// //             <div className="interview-layout">

// //                 {/* LEFT SIDE */}
// //                 <div className="left-panel">

// //                     <div className="video-wrapper">
// //                         <WebcamRecorder
// //                             candidateName={candidateName}
// //                             candidateId={candidateId}
// //                             jdText={jdText}
// //                             onCandidateId={setCandidateId}
// //                         />
// //                     </div>

// //                     <div className="insight-score-row">
// //                         <div className="insights-box">
// //                             <LiveInsightsPanel candidateId={candidateId} />
// //                         </div>

// //                         <div className="aichart-box">
// //                             <AIChartPanel />
// //                         </div>
// //                     </div>

// //                 </div>

// //                 {/* RIGHT SIDE */}
// //                 {/* <div className="right-panel">
// //                     <TranscriptPanel
// //                         transcript={transcript}
// //                         jdId={jdId}
// //                         jdText={jdText}
// //                     />
// //                 </div> */}
// //                 <div className="right-panel">
// //                     {renderRightContent()}
// //                 </div>


// //             </div>
// //         </div>
// //     );
// // }
// // FILE: src/interview/InterviewMode.jsx

// // FILE: src/interview/InterviewMode.jsx

// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";

// import WebcamRecorder from "./WebcamRecorder";
// import TranscriptPanel from "./TranscriptPanel";
// import LiveInsightsPanel from "./LiveInsightsPanel";
// import AIChartPanel from "./AIChartPanel";
// import InterviewToolbar from "./InterviewToolbar";

// import "./InterviewMode.css";
// import MCQ from "./MCQ";
// import CodingTestPanel from "./CodingTestPanel";

// export default function InterviewMode() {
//     const location = useLocation();
//     const navigate = useNavigate();

//     // Candidate & JD info
//     const candidateName = location.state?.candidateName || "Anonymous";
//     const initialCandidateId = location.state?.candidateId || null;
//     const jdText = location.state?.jd_text || "";
//     const jdId = location.state?.jd_id || null;

//     // Core states
//     const [candidateId, setCandidateId] = useState(initialCandidateId);
//     const [transcript, setTranscript] = useState([]);
//     const [insights, setInsights] = useState({});
//     const [anomalyCounts, setAnomalyCounts] = useState({});
//     const [interviewTime, setInterviewTime] = useState(0);

//     // Stage: 1 = MCQ, 2 = Coding, 3 = AI Interview
//     const [stage, setStage] = useState(1);

//     // MCQ data
//     const [mcq, setMcq] = useState([]);
//     const [mcqLoaded, setMcqLoaded] = useState(false);
//     const [mcqResult, setMcqResult] = useState(null);

//     // Coding data
//     const [codingResult, setCodingResult] = useState(null);
//     //  Interview started flag
//     const [interviewStarted, setInterviewStarted] = useState(false);

//     /* ===========================================================
//        LOAD MCQ QUESTIONS (ONLY ONCE)
//     =========================================================== */
//     // useEffect(() => {
//     //     async function loadMCQ() {
//     //         if (mcqLoaded) return;
//     //         if (stage !== 1) return;
//     //         if (!candidateId) return;

//     //         const fd = new FormData();
//     //         fd.append("job_description", jdText);
//     //         fd.append("candidate_id", candidateId);
//     //         if (jdId) fd.append("jd_id", jdId);

//     //         try {
//     //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/generate-mcq`, {
//     //                 method: "POST",
//     //                 body: fd
//     //             });

//     //             const d = await r.json();
//     //             if (d.ok) {
//     //                 setMcq(d.mcq);
//     //                 setMcqLoaded(true);
//     //             } else {
//     //                 alert("Failed to load MCQ: " + d.error);
//     //             }
//     //         } catch (err) {
//     //             console.error("MCQ Load Error:", err);
//     //         }
//     //     }

//     //     loadMCQ();
//     // }, [stage, candidateId, mcqLoaded]);

//     // ===========================================================
//     // HANDLE STAGE START   
//     function handleStartStage(stageNumber) {
//         setStage(stageNumber);
//     }

//     /* ===========================================================
//        STAGE RENDERER
//     =========================================================== */
//     function renderRightContent() {
//         if (stage === 1) {
//             return (
//                 <MCQ
//                     questions={mcq}
//                     onComplete={(result) => {
//                         console.log("MCQ Results:", result);
//                         setMcqResult(result);
//                         setStage(2);
//                     }}
//                 />
//             );
//         }

//         if (stage === 2) {
//             return (
//                 <CodingTestPanel
//                     onComplete={(codingScore) => {
//                         console.log("Coding Score:", codingScore);
//                         setCodingResult(codingScore);
//                         setStage(3);
//                     }}
//                 />
//             );
//         }

//         return (
//             <TranscriptPanel
//                 transcript={transcript}
//                 jdId={jdId}
//                 jdText={jdText}
//             />
//         );
//     }

//     /* ===========================================================
//        INTERVIEW TIMER
//     =========================================================== */
//     useEffect(() => {
//         let timer = null;

//         const startTimer = () => {
//             if (timer) return;
//             timer = setInterval(() => setInterviewTime((t) => t + 1), 1000);
//         };

//         const stopTimer = () => {
//             clearInterval(timer);
//             timer = null;
//         };

//         window.addEventListener("startInterviewTimer", startTimer);
//         window.addEventListener("stopInterviewTimer", stopTimer);

//         return () => {
//             window.removeEventListener("startInterviewTimer", startTimer);
//             window.removeEventListener("stopInterviewTimer", stopTimer);
//             clearInterval(timer);
//         };
//     }, []);

//     /* ===========================================================
//        TRANSCRIPT LISTENER
//     =========================================================== */
//     useEffect(() => {
//         const handler = (e) => {
//             setTranscript((prev) => [...prev, e.detail]);
//         };
//         window.addEventListener("transcriptAdd", handler);
//         return () => window.removeEventListener("transcriptAdd", handler);
//     }, []);

//     /* ===========================================================
//        LIVE INSIGHTS LISTENER
//     =========================================================== */
//     useEffect(() => {
//         const handler = (e) => {
//             setInsights(e.detail);
//             setAnomalyCounts(e.detail.counts || {});
//         };
//         window.addEventListener("liveInsightsUpdate", handler);
//         return () => window.removeEventListener("liveInsightsUpdate", handler);
//     }, []);

//     /* ===========================================================
//        STOP → FINAL EVALUATION
//     =========================================================== */
//     useEffect(() => {
//         const stopHandler = async () => {
//             if (!candidateId) return alert("Candidate ID missing");

//             const fd = new FormData();
//             fd.append("candidate_name", candidateName);
//             fd.append("candidate_id", candidateId);
//             fd.append("job_description", jdText);
//             if (jdId) fd.append("jd_id", jdId);

//             const r = await fetch(
//                 `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
//                 { method: "POST", body: fd }
//             );

//             const d = await r.json();

//             if (!d.ok) {
//                 alert("Evaluation failed: " + d.error);
//                 return;
//             }

//             // Move to certificate page with ALL RESULTS
//             navigate("/certificatedata", {
//                 state: {
//                     ...d,                    // AI interview scores
//                     mcq: mcqResult,          // MCQ scores
//                     coding: codingResult,    // Coding scores
//                     transcript,
//                     insights,
//                     anomalyCounts,
//                 },
//             });
//         };

//         window.addEventListener("stopInterview", stopHandler);
//         return () => window.removeEventListener("stopInterview", stopHandler);

//     }, [candidateId, transcript, insights, anomalyCounts, mcqResult, codingResult]);

//     /* ===========================================================
//        MAIN RENDER
//     =========================================================== */

//     return (
//         <div className="interview-root">

//             <div className="interview-toolbar-container">
//                 <InterviewToolbar
//                     candidateId={candidateId}
//                     candidateName={candidateName}
//                     jdText={jdText}
//                     interviewTime={interviewTime}
//                 />
//             </div>

//             <div className="interview-layout">

//                 {/* LEFT SIDE */}
//                 <div className="left-panel">

//                     <div className="video-wrapper">
//                         <WebcamRecorder
//                             candidateName={candidateName}
//                             candidateId={candidateId}
//                             jdText={jdText}
//                             onCandidateId={setCandidateId}
//                             stage={stage}
//                             onStartStage={handleStartStage}
//                         />

//                     </div>

//                     <div className="insight-score-row">
//                         <div className="insights-box">
//                             <LiveInsightsPanel candidateId={candidateId} />
//                         </div>

//                         <div className="aichart-box">
//                             <AIChartPanel />
//                         </div>
//                     </div>
//                 </div>

//                 {/* RIGHT SIDE */}
//                 <div className="right-panel">
//                     {!interviewStarted ? (
//                         <div className="start-interview-screen">
//                             <button
//                                 className="start-btn"
//                                 onClick={async () => {
//                                     setInterviewStarted(true);
//                                     setStage(1);

//                                     // Load MCQ NOW
//                                     const fd = new FormData();
//                                     fd.append("job_description", jdText);
//                                     fd.append("candidate_id", candidateId);
//                                     if (jdId) fd.append("jd_id", jdId);

//                                     const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/generate-mcq`, {
//                                         method: "POST",
//                                         body: fd,
//                                     });

//                                     const d = await r.json();
//                                     if (d.ok) setMcq(d.mcq);
//                                     else alert("Failed to load MCQ");
//                                 }}
//                             >
//                                 Start Interview
//                             </button>
//                         </div>
//                     ) : (
//                         renderRightContent()
//                     )}
//                 </div>

//             </div>
//         </div>
//     );
// }
// FILE: src/interview/InterviewMode.jsx

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";

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
