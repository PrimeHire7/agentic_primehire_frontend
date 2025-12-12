// // // // FILE: src/interview/WebcamRecorder.jsx
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { API_BASE } from "@/utils/constants";
// // // import "./WebcamRecorder.css";

// // // export default function WebcamRecorder({
// // //     candidateName,
// // //     candidateId,
// // //     jdText,
// // //     onCandidateId,
// // //     stage,
// // //     onStartStage
// // // }) {
// // //     const videoRef = useRef(null);
// // //     const streamRef = useRef(null);
// // //     const faceLoopRef = useRef(null);

// // //     const [recording, setRecording] = useState(false);

// // //     // IMPORTANT: Mirror candidateId (because props DO NOT update inside interval)
// // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

// // //     const [tabWarning, setTabWarning] = useState(false);

// // //     useEffect(() => {
// // //         if (candidateId) {
// // //             setLocalCandidateId(candidateId);
// // //         }
// // //     }, [candidateId]);

// // //     // ----------------------------------------------
// // //     // TAB SWITCH DETECTION (same behavior as old system)
// // //     // ----------------------------------------------
// // //     useEffect(() => {
// // //         function handleTab() {
// // //             if (!localCandidateId) return;

// // //             if (document.hidden) {
// // //                 setTabWarning(true);

// // //                 // Add transcript alert
// // //                 window.dispatchEvent(
// // //                     new CustomEvent("transcriptAdd", {
// // //                         detail: { role: "system", text: "⚠ Tab switch detected — stay in the interview window." }
// // //                     })
// // //                 );

// // //                 // Send anomaly to backend
// // //                 const fd = new FormData();
// // //                 fd.append("candidate_name", candidateName);
// // //                 fd.append("candidate_id", localCandidateId);
// // //                 fd.append("event_type", "tab_switch");
// // //                 fd.append("event_msg", "Tab switch detected");

// // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // //                     method: "POST",
// // //                     body: fd
// // //                 });
// // //             } else {
// // //                 setTabWarning(false);
// // //             }
// // //         }

// // //         document.addEventListener("visibilitychange", handleTab);
// // //         return () => document.removeEventListener("visibilitychange", handleTab);
// // //     }, [localCandidateId]);

// // //     /** ---------------------------
// // //         INIT CAMERA
// // //     ---------------------------- **/
// // //     useEffect(() => {
// // //         async function init() {
// // //             streamRef.current = await navigator.mediaDevices.getUserMedia({
// // //                 video: true,
// // //                 audio: true,
// // //             });

// // //             videoRef.current.srcObject = streamRef.current;
// // //             await videoRef.current.play();
// // //         }

// // //         init();

// // //         return () =>
// // //             streamRef.current?.getTracks().forEach((t) => t.stop());
// // //     }, []);
// // //     /** ---------------------------
// // //         START FACE MONITOR LOOP
// // //     ---------------------------- **/
// // //     function startFaceLoop() {
// // //         clearInterval(faceLoopRef.current);

// // //         faceLoopRef.current = setInterval(() => {
// // //             if (videoRef.current?.videoWidth > 0) {
// // //                 sendFaceFrame();
// // //             } else {
// // //                 console.log("⏳ Waiting for video to stabilize...");
// // //             }
// // //         }, 300);
// // //     }

// // //     /** ---------------------------
// // //         START INTERVIEW
// // //     ---------------------------- **/
// // //     // async function startInterview() {
// // //     //     setRecording(true);
// // //     //     // 🔵 START THE TIMER
// // //     //     window.dispatchEvent(new Event("startInterviewTimer"));
// // //     //     const fd = new FormData();
// // //     //     fd.append("init", "true");
// // //     //     fd.append("candidate_name", candidateName);
// // //     //     fd.append("job_description", jdText);

// // //     //     if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // //     //     const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // //     //         method: "POST",
// // //     //         body: fd,
// // //     //     });

// // //     //     const d = await r.json();

// // //     //     if (d.candidate_id) {
// // //     //         setLocalCandidateId(d.candidate_id);
// // //     //         onCandidateId(d.candidate_id);
// // //     //     }

// // //     //     if (d.next_question) {
// // //     //         window.dispatchEvent(
// // //     //             new CustomEvent("transcriptAdd", {
// // //     //                 detail: { role: "ai", text: d.next_question },
// // //     //             })
// // //     //         );
// // //     //     }

// // //     //     startFaceLoop();
// // //     // }
// // //     async function startInterview() {

// // //         // ⭐ Stage 1: MCQ
// // //         if (stage === 1) {
// // //             console.log("➡ Starting Stage 1: MCQ");
// // //             onStartStage(1);   // notify InterviewMode
// // //             return;
// // //         }

// // //         // ⭐ Stage 2: Coding
// // //         if (stage === 2) {
// // //             console.log("➡ Starting Stage 2: Coding");
// // //             onStartStage(2);
// // //             return;
// // //         }

// // //         // ⭐ Stage 3: AI INTERVIEW
// // //         console.log("➡ Starting Stage 3: AI Interview");

// // //         setRecording(true);
// // //         window.dispatchEvent(new Event("startInterviewTimer"));

// // //         const fd = new FormData();
// // //         fd.append("init", "true");
// // //         fd.append("candidate_name", candidateName);
// // //         fd.append("job_description", jdText);

// // //         if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // //         const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // //             method: "POST",
// // //             body: fd,
// // //         });

// // //         const d = await r.json();

// // //         if (d.candidate_id) {
// // //             setLocalCandidateId(d.candidate_id);
// // //             onCandidateId(d.candidate_id);
// // //         }

// // //         if (d.next_question) {
// // //             window.dispatchEvent(
// // //                 new CustomEvent("transcriptAdd", {
// // //                     detail: { role: "ai", text: d.next_question },
// // //                 })
// // //             );
// // //         }

// // //         startFaceLoop();
// // //     }


// // //     /** ---------------------------
// // //         STOP INTERVIEW
// // //     ---------------------------- **/
// // //     function stopInterview() {
// // //         setRecording(false);
// // //         clearInterval(faceLoopRef.current);
// // //         // 🔴 STOP THE TIMER
// // //         window.dispatchEvent(new Event("stopInterviewTimer"));

// // //         window.dispatchEvent(new Event("stopInterview"));
// // //     }



// // //     /** ---------------------------
// // //         SEND FRAME → FACE MONITOR
// // //     ---------------------------- **/
// // //     async function sendFaceFrame() {
// // //         if (!videoRef.current || !localCandidateId) {
// // //             console.log("❌ sendFaceFrame: videoRef or candidateId missing");
// // //             return;
// // //         }

// // //         const video = videoRef.current;

// // //         // 🔥 Debug: log video size each frame
// // //         console.log(`🎥 Video frame size: ${video.videoWidth} x ${video.videoHeight}`);

// // //         // Prevent sending if video isn't ready
// // //         if (video.videoWidth === 0 || video.videoHeight === 0) {
// // //             console.log("⏳ Video not ready yet — skipping frame");
// // //             return;
// // //         }

// // //         const canvas = document.createElement("canvas");
// // //         canvas.width = video.videoWidth;
// // //         canvas.height = video.videoHeight;

// // //         const ctx = canvas.getContext("2d");
// // //         ctx.drawImage(video, 0, 0);

// // //         // 🔥 Debug: check if canvas rendered correctly
// // //         console.log("🖼 Canvas frame rendered");

// // //         // Convert to Blob
// // //         const blob = await new Promise((resolve) =>
// // //             canvas.toBlob(resolve, "image/jpeg", 0.85)
// // //         );

// // //         if (!blob) {
// // //             console.log("❌ Blob conversion failed");
// // //             return;
// // //         }

// // //         console.log(`📤 Sending frame → size: ${blob.size} bytes`);

// // //         const fd = new FormData();
// // //         fd.append("candidate_name", candidateName);
// // //         fd.append("candidate_id", localCandidateId);
// // //         fd.append("frame", blob);

// // //         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // //             method: "POST",
// // //             body: fd,
// // //         });

// // //         const data = await r.json();

// // //         console.log("📥 Backend response:", data);

// // //         window.dispatchEvent(
// // //             new CustomEvent("liveInsightsUpdate", {
// // //                 detail: {
// // //                     anomalies: data.anomalies,
// // //                     boxes: data.boxes,
// // //                     frame: data.frame_base64,
// // //                     faces: data.faces,
// // //                     counts: data.anomaly_counts || {},
// // //                 }
// // //             })
// // //         );

// // //         if (data.anomalies?.length) {
// // //             data.anomalies.forEach((a) => {
// // //                 window.dispatchEvent(
// // //                     new CustomEvent("transcriptAdd", {
// // //                         detail: { role: "system", text: `⚠ ${a.msg}` },
// // //                     })
// // //                 );
// // //             });
// // //         }
// // //     }


// // //     return (
// // //         <div className="webcam-glass-shell">

// // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // //             {/* TAB SWITCH WARNING BANNER */}
// // //             {tabWarning && (
// // //                 <div className="warning-banner">⚠ Tab switching detected</div>
// // //             )}

// // //             {!recording ? (
// // //                 <button className="webcam-start-btn" onClick={startInterview}>
// // //                     Start Interview
// // //                 </button>
// // //             ) : (
// // //                 <button className="webcam-stop-btn" onClick={stopInterview}>
// // //                     Stop Interview
// // //                 </button>
// // //             )}
// // //         </div>
// // //     );

// // // }
// // // FILE: src/interview/WebcamRecorder.jsx
// // import React, { useEffect, useRef, useState } from "react";
// // import { API_BASE } from "@/utils/constants";
// // import "./WebcamRecorder.css";

// // export default function WebcamRecorder({
// //     candidateName,
// //     candidateId,
// //     jdText,
// //     onCandidateId,
// //     stage,
// //     onStartStage
// // }) {
// //     const videoRef = useRef(null);
// //     const streamRef = useRef(null);
// //     const faceLoopRef = useRef(null);

// //     const [recording, setRecording] = useState(false);
// //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// //     const [tabWarning, setTabWarning] = useState(false);

// //     useEffect(() => {
// //         if (candidateId) setLocalCandidateId(candidateId);
// //     }, [candidateId]);

// //     /* =========================================
// //        TAB SWITCH DETECTION
// //     ========================================= */
// //     useEffect(() => {
// //         function handleTab() {
// //             if (!localCandidateId) return;

// //             if (document.hidden) {
// //                 setTabWarning(true);

// //                 window.dispatchEvent(
// //                     new CustomEvent("transcriptAdd", {
// //                         detail: {
// //                             role: "system",
// //                             text: "⚠ Tab switch detected — stay in the interview window."
// //                         }
// //                     })
// //                 );

// //                 const fd = new FormData();
// //                 fd.append("candidate_name", candidateName);
// //                 fd.append("candidate_id", localCandidateId);
// //                 fd.append("event_type", "tab_switch");
// //                 fd.append("event_msg", "Tab switch detected");

// //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// //                     method: "POST",
// //                     body: fd
// //                 });
// //             } else {
// //                 setTabWarning(false);
// //             }
// //         }

// //         document.addEventListener("visibilitychange", handleTab);
// //         return () =>
// //             document.removeEventListener("visibilitychange", handleTab);
// //     }, [localCandidateId]);

// //     /* =========================================
// //        INIT CAMERA
// //     ========================================= */
// //     useEffect(() => {
// //         async function init() {
// //             streamRef.current = await navigator.mediaDevices.getUserMedia({
// //                 video: true,
// //                 audio: true,
// //             });

// //             videoRef.current.srcObject = streamRef.current;
// //             await videoRef.current.play();
// //         }

// //         init();
// //         return () =>
// //             streamRef.current?.getTracks().forEach((t) => t.stop());
// //     }, []);

// //     /* =========================================
// //        FACE MONITOR LOOP
// //     ========================================= */
// //     function startFaceLoop() {
// //         clearInterval(faceLoopRef.current);

// //         faceLoopRef.current = setInterval(() => {
// //             if (videoRef.current?.videoWidth > 0) sendFaceFrame();
// //         }, 300);
// //     }

// //     /* =========================================
// //        START INTERVIEW BUTTON (controls stage)
// //     ========================================= */
// //     async function startInterview() {

// //         // ALWAYS start timer
// //         window.dispatchEvent(new Event("startInterviewTimer"));
// //         setRecording(true);

// //         // ALWAYS START FACE MONITOR, regardless of stage
// //         startFaceLoop();

// //         // ⭐ Stage 1: MCQ
// //         if (stage === null || stage === 1) {
// //             console.log("➡ Stage 1: MCQ started");
// //             onStartStage(1);
// //             return; // DO NOT call process-answer
// //         }

// //         // ⭐ Stage 2: Coding
// //         if (stage === 2) {
// //             console.log("➡ Stage 2: Coding started");
// //             onStartStage(2);
// //             return; // DO NOT call process-answer
// //         }

// //         // ⭐ Stage 3: AI INTERVIEW (only now call backend)
// //         console.log("➡ Stage 3: AI Interview started");

// //         const fd = new FormData();
// //         fd.append("init", "true");
// //         fd.append("candidate_name", candidateName);
// //         fd.append("job_description", jdText);
// //         if (localCandidateId) fd.append("candidate_id", localCandidateId);

// //         const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// //             method: "POST",
// //             body: fd,
// //         });

// //         const d = await r.json();

// //         if (d.candidate_id) {
// //             setLocalCandidateId(d.candidate_id);
// //             onCandidateId(d.candidate_id);
// //         }

// //         if (d.next_question) {
// //             window.dispatchEvent(
// //                 new CustomEvent("transcriptAdd", {
// //                     detail: { role: "ai", text: d.next_question },
// //                 })
// //             );
// //         }
// //     }



// //     /* =========================================
// //        STOP INTERVIEW
// //     ========================================= */
// //     function stopInterview() {
// //         setRecording(false);
// //         clearInterval(faceLoopRef.current);
// //         window.dispatchEvent(new Event("stopInterviewTimer"));
// //         window.dispatchEvent(new Event("stopInterview"));
// //     }

// //     /* =========================================
// //        SEND VIDEO FRAME → Face Monitor API
// //     ========================================= */
// //     async function sendFaceFrame() {
// //         if (!videoRef.current || !localCandidateId) return;

// //         const video = videoRef.current;

// //         if (video.videoWidth === 0 || video.videoHeight === 0) return;

// //         const canvas = document.createElement("canvas");
// //         canvas.width = video.videoWidth;
// //         canvas.height = video.videoHeight;

// //         const ctx = canvas.getContext("2d");
// //         ctx.drawImage(video, 0, 0);

// //         const blob = await new Promise((resolve) =>
// //             canvas.toBlob(resolve, "image/jpeg", 0.85)
// //         );
// //         if (!blob) return;

// //         const fd = new FormData();
// //         fd.append("candidate_name", candidateName);
// //         fd.append("candidate_id", localCandidateId);
// //         fd.append("frame", blob);

// //         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// //             method: "POST",
// //             body: fd,
// //         });

// //         const data = await r.json();

// //         window.dispatchEvent(
// //             new CustomEvent("liveInsightsUpdate", {
// //                 detail: {
// //                     anomalies: data.anomalies,
// //                     boxes: data.boxes,
// //                     frame: data.frame_base64,
// //                     faces: data.faces,
// //                     counts: data.anomaly_counts || {},
// //                 }
// //             })
// //         );
// //     }

// //     return (
// //         <div className="webcam-glass-shell">

// //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// //             {tabWarning && (
// //                 <div className="warning-banner">⚠ Tab switching detected</div>
// //             )}

// //             {!recording ? (
// //                 <button className="webcam-start-btn" onClick={startInterview}>
// //                     Start Interview
// //                 </button>
// //             ) : (
// //                 <button className="webcam-stop-btn" onClick={stopInterview}>
// //                     Stop Interview
// //                 </button>
// //             )}
// //         </div>
// //     );
// // }
// // FILE: src/interview/WebcamRecorder.jsx
// // FILE: src/interview/WebcamRecorder.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { API_BASE } from "@/utils/constants";
// import "./WebcamRecorder.css";

// export default function WebcamRecorder({
//     candidateName,
//     candidateId,
//     jdText,
//     onCandidateId,
//     stage,
//     onStartStage
// }) {
//     const videoRef = useRef(null);
//     const streamRef = useRef(null);
//     const faceLoopRef = useRef(null);

//     const [recording, setRecording] = useState(false);
//     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
//     const [tabWarning, setTabWarning] = useState(false);

//     /* ======================================================
//        MIRROR CANDIDATE ID WHEN IT ARRIVES
//     ====================================================== */
//     useEffect(() => {
//         if (candidateId) setLocalCandidateId(candidateId);
//     }, [candidateId]);

//     /* ======================================================
//        TAB SWITCH DETECTION
//     ====================================================== */
//     useEffect(() => {
//         function handleTab() {
//             if (!localCandidateId) return;

//             if (document.hidden) {
//                 setTabWarning(true);

//                 window.dispatchEvent(
//                     new CustomEvent("transcriptAdd", {
//                         detail: {
//                             role: "system",
//                             text: "⚠ Tab switch detected — stay in the interview window."
//                         }
//                     })
//                 );

//                 const fd = new FormData();
//                 fd.append("candidate_name", candidateName);
//                 fd.append("candidate_id", localCandidateId);
//                 fd.append("event_type", "tab_switch");
//                 fd.append("event_msg", "Tab switch detected");

//                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
//                     method: "POST",
//                     body: fd
//                 });
//             } else {
//                 setTabWarning(false);
//             }
//         }

//         document.addEventListener("visibilitychange", handleTab);
//         return () => document.removeEventListener("visibilitychange", handleTab);
//     }, [localCandidateId]);

//     /* ======================================================
//        INIT CAMERA (with AbortError FIX)
//     ====================================================== */
//     useEffect(() => {
//         async function init() {
//             try {
//                 streamRef.current = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true
//                 });

//                 videoRef.current.srcObject = streamRef.current;

//                 // FIX: AbortError safe play()
//                 videoRef.current.onloadedmetadata = () => {
//                     videoRef.current.play().catch((err) => {
//                         if (err.name === "AbortError") {
//                             console.warn("🎥 SAFE IGNORE AbortError during play()");
//                         } else {
//                             console.error("Video play error:", err);
//                         }
//                     });
//                 };
//             } catch (err) {
//                 console.error("Camera init error:", err);
//             }
//         }

//         init();

//         return () =>
//             streamRef.current?.getTracks().forEach((t) => t.stop());
//     }, []);

//     /* ======================================================
//        FACE MONITOR LOOP
//     ====================================================== */
//     function startFaceLoop() {
//         console.log("🎥 FACE MONITOR STARTED");

//         clearInterval(faceLoopRef.current);

//         faceLoopRef.current = setInterval(() => {
//             if (videoRef.current?.videoWidth > 0) {
//                 sendFaceFrame();
//             }
//         }, 300);
//     }

//     /* ======================================================
//        START INTERVIEW
//     ====================================================== */
//     function startInterview() {
//         console.log("▶ INTERVIEW STARTED — Stage:", stage);

//         setRecording(true);

//         window.dispatchEvent(new Event("startInterviewTimer"));

//         // WAIT UNTIL VIDEO IS READY BEFORE FACE LOOP
//         const waitForVideo = setInterval(() => {
//             const video = videoRef.current;
//             if (video && video.videoWidth > 0) {
//                 console.log("🎥 VIDEO READY — STARTING FACE LOOP");
//                 clearInterval(waitForVideo);
//                 startFaceLoop();
//             } else {
//                 console.log("⏳ Waiting for video to stabilize...");
//             }
//         }, 200);

//         // Start stage 1
//         onStartStage(1);
//     }



//     /* ======================================================
//        AUTO-START AI INTERVIEW WHEN ENTERING STAGE 3
//     ====================================================== */
//     useEffect(() => {
//         if (stage !== 3) return;
//         if (!recording) return; // must be recording already

//         console.log("🤖 AUTO-TRIGGER Stage 3 AI INTERVIEW");

//         async function beginAIInterview() {
//             const fd = new FormData();
//             fd.append("init", "true");
//             fd.append("candidate_name", candidateName);
//             fd.append("job_description", jdText);
//             if (localCandidateId) fd.append("candidate_id", localCandidateId);

//             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
//                 method: "POST",
//                 body: fd
//             });

//             const d = await r.json();

//             if (d.candidate_id) {
//                 setLocalCandidateId(d.candidate_id);
//                 onCandidateId(d.candidate_id);
//             }

//             if (d.next_question) {
//                 window.dispatchEvent(
//                     new CustomEvent("transcriptAdd", {
//                         detail: { role: "ai", text: d.next_question }
//                     })
//                 );
//             }
//         }

//         beginAIInterview();
//     }, [stage, recording]);

//     /* ======================================================
//        STOP INTERVIEW
//     ====================================================== */
//     function stopInterview() {
//         console.log("⛔ INTERVIEW STOPPED");

//         setRecording(false);
//         clearInterval(faceLoopRef.current);

//         window.dispatchEvent(new Event("stopInterviewTimer"));
//         window.dispatchEvent(new Event("stopInterview"));
//     }

//     /* ======================================================
//        SEND FRAME → FACE MONITOR API
//     ====================================================== */
//     async function sendFaceFrame() {
//         if (!videoRef.current || !localCandidateId) return;

//         const video = videoRef.current;

//         // if (video.videoWidth === 0 || video.videoHeight === 0) return;
//         if (video.videoWidth === 0 || video.videoHeight === 0) {
//             console.log("⏳ Waiting for video to be ready...");
//             return; // allow loop to retry, do NOT kill face monitor
//         }


//         const canvas = document.createElement("canvas");
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0);

//         const blob = await new Promise((resolve) =>
//             canvas.toBlob(resolve, "image/jpeg", 0.85)
//         );

//         if (!blob) return;

//         const fd = new FormData();
//         fd.append("candidate_name", candidateName);
//         fd.append("candidate_id", localCandidateId);
//         fd.append("frame", blob);

//         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
//             method: "POST",
//             body: fd
//         });

//         const data = await r.json();

//         console.log("📥 Backend response:", data);

//         window.dispatchEvent(
//             new CustomEvent("liveInsightsUpdate", {
//                 detail: {
//                     anomalies: data.anomalies || [],
//                     boxes: data.boxes || [],
//                     frame: data.frame_base64 || null,
//                     faces: data.faces || 0,
//                     counts: data.anomaly_counts || {}
//                 }
//             })
//         );


//         if (data.anomalies?.length) {
//             data.anomalies.forEach((a) => {
//                 window.dispatchEvent(
//                     new CustomEvent("transcriptAdd", {
//                         detail: { role: "system", text: `⚠ ${a.msg}` }
//                     })
//                 );
//             });
//         }
//     }

//     /* ======================================================
//        RENDER
//     ====================================================== */
//     return (
//         <div className="webcam-glass-shell">

//             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

//             {tabWarning && (
//                 <div className="warning-banner">⚠ Tab switching detected</div>
//             )}

//             {!recording ? (
//                 <button className="webcam-start-btn" onClick={startInterview}>
//                     Start Interview
//                 </button>
//             ) : (
//                 <button className="webcam-stop-btn" onClick={stopInterview}>
//                     Stop Interview
//                 </button>
//             )}
//         </div>
//     );
// }
// FILE: src/interview/WebcamRecorder_fixed.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder({
    candidateName,
    candidateId,
    jdText,
    onCandidateId,
    stage,
    onStartStage
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const faceLoopRef = useRef(null);
    const waitForVideoRef = useRef(null);

    const [recording, setRecording] = useState(false);
    const [localCandidateId, setLocalCandidateId] = useState(candidateId);
    const [tabWarning, setTabWarning] = useState(false);

    /* -------------------------------------------
       Mirror candidate id when it arrives
    --------------------------------------------*/
    useEffect(() => {
        if (candidateId) setLocalCandidateId(candidateId);
    }, [candidateId]);

    /* -------------------------------------------
       Init camera (robust to AbortError)
    --------------------------------------------*/
    useEffect(() => {
        let mounted = true;

        async function init() {
            try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (!mounted) return;
                const vid = videoRef.current;
                vid.srcObject = streamRef.current;
                // Use onloadedmetadata to call play safely
                vid.onloadedmetadata = () => {
                    vid.play().catch((err) => {
                        if (err.name === "AbortError") {
                            console.warn("🎥 SAFE IGNORE AbortError during play()");
                        } else {
                            console.error("Video play error:", err);
                        }
                    });
                };
            } catch (err) {
                console.error("Camera init error:", err);
            }
        }

        init();

        return () => {
            mounted = false;
            // stop stream
            streamRef.current?.getTracks().forEach((t) => t.stop());
            // clear intervals
            if (faceLoopRef.current) clearInterval(faceLoopRef.current);
            if (waitForVideoRef.current) clearInterval(waitForVideoRef.current);
        };
    }, []);

    /* -------------------------------------------
       Tab visibility handling
    --------------------------------------------*/
    useEffect(() => {
        function handleTab() {
            if (!localCandidateId) return;
            if (document.hidden) {
                setTabWarning(true);
                window.dispatchEvent(new CustomEvent("transcriptAdd", { detail: { role: "system", text: "⚠ Tab switch detected — stay in the interview window." } }));
                const fd = new FormData();
                fd.append("candidate_name", candidateName);
                fd.append("candidate_id", localCandidateId);
                fd.append("event_type", "tab_switch");
                fd.append("event_msg", "Tab switch detected");
                fetch(`${API_BASE}/mcp/interview/face-monitor`, { method: "POST", body: fd }).catch((e) => console.warn("tab switch send failed", e));
            } else {
                setTabWarning(false);
            }
        }
        document.addEventListener("visibilitychange", handleTab);
        return () => document.removeEventListener("visibilitychange", handleTab);
    }, [localCandidateId]);

    /* -------------------------------------------
       Start/stop face loop
    --------------------------------------------*/
    function startFaceLoop() {
        console.log("🎥 FACE MONITOR STARTED");
        // ensure previous cleared
        if (faceLoopRef.current) clearInterval(faceLoopRef.current);

        faceLoopRef.current = setInterval(() => {
            const v = videoRef.current;
            // if video not ready, just return so it retries next tick
            if (!v || v.videoWidth === 0 || v.videoHeight === 0) {
                // console.debug("⏳ video not ready, skipping frame");
                return;
            }
            sendFaceFrame();
        }, 300);
    }

    function stopFaceLoop() {
        if (faceLoopRef.current) {
            clearInterval(faceLoopRef.current);
            faceLoopRef.current = null;
            console.log("🎥 FACE MONITOR STOPPED");
        }
    }

    /* -------------------------------------------
       Start interview (single button)
       - Waits for video to be ready, starts face loop
       - Starts timer, sets recording state
       - Triggers stage 1 after loop started
    --------------------------------------------*/
    async function startInterview() {
        console.log("▶ INTERVIEW STARTED — Stage:", stage);
        setRecording(true);
        window.dispatchEvent(new Event("startInterviewTimer"));

        // If video already ready, start immediately
        const v = videoRef.current;
        if (v && v.videoWidth > 0) {
            startFaceLoop();
            // small delay to ensure loop started and first frame fired
            setTimeout(() => onStartStage(1), 200);
            return;
        }

        // otherwise poll for readiness, but keep face loop start only when ready
        let tries = 0;
        waitForVideoRef.current = setInterval(() => {
            const vv = videoRef.current;
            if (vv && vv.videoWidth > 0) {
                clearInterval(waitForVideoRef.current);
                waitForVideoRef.current = null;
                startFaceLoop();
                console.log("🎥 VIDEO ready -> face loop started");
                // trigger stage AFTER small delay so rendering doesn't interrupt video
                setTimeout(() => onStartStage(1), 200);
            } else {
                tries++;
                if (tries % 5 === 0) console.log("⏳ Waiting for video to stabilize...");
            }
        }, 200);
    }

    function stopInterview() {
        console.log("⛔ INTERVIEW STOPPED");
        setRecording(false);
        stopFaceLoop();
        if (waitForVideoRef.current) { clearInterval(waitForVideoRef.current); waitForVideoRef.current = null; }
        window.dispatchEvent(new Event("stopInterviewTimer"));
        window.dispatchEvent(new Event("stopInterview"));
    }

    /* -------------------------------------------
       send frame to backend and dispatch liveInsightsUpdate
    --------------------------------------------*/
    async function sendFaceFrame() {
        try {
            if (!videoRef.current || !localCandidateId) return;
            const video = videoRef.current;
            if (video.videoWidth === 0 || video.videoHeight === 0) return;

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.75));
            if (!blob) return;

            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", localCandidateId);
            fd.append("frame", blob);

            const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, { method: "POST", body: fd });
            const data = await res.json();

            // Defensive logging
            console.log("📥 Backend response:", data);

            // Normalize and dispatch
            window.dispatchEvent(
                new CustomEvent("liveInsightsUpdate", {
                    detail: {
                        anomalies: data.anomalies || [],
                        boxes: data.boxes || [],
                        frame: data.frame_base64 || null,
                        faces: data.faces || 0,
                        counts: data.anomaly_counts || {}
                    }
                })
            );

            // Also push system transcript messages for each anomaly (frontend uses it too)
            if (data.anomalies && data.anomalies.length) {
                data.anomalies.forEach((a) => {
                    window.dispatchEvent(new CustomEvent("transcriptAdd", { detail: { role: "system", text: `⚠ ${a.msg}` } }));
                });
            }

        } catch (err) {
            console.error("sendFaceFrame error:", err);
        }
    }

    /* -------------------------------------------
       Auto-trigger AI interview when stage becomes 3 (existing behavior)
    --------------------------------------------*/
    useEffect(() => {
        if (stage !== 3) return;
        if (!recording) return;

        console.log("🤖 AUTO-TRIGGER Stage 3 AI INTERVIEW");

        let cancelled = false;
        async function beginAIInterview() {
            try {
                const fd = new FormData();
                fd.append("init", "true");
                fd.append("candidate_name", candidateName);
                fd.append("job_description", jdText);
                if (localCandidateId) fd.append("candidate_id", localCandidateId);

                const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
                const d = await r.json();
                if (cancelled) return;
                if (d.candidate_id) {
                    setLocalCandidateId(d.candidate_id);
                    onCandidateId(d.candidate_id);
                }
                if (d.next_question) {
                    window.dispatchEvent(new CustomEvent("transcriptAdd", { detail: { role: "ai", text: d.next_question } }));
                }
            } catch (e) {
                console.error("beginAIInterview error:", e);
            }
        }
        beginAIInterview();
        return () => { cancelled = true; };
    }, [stage, recording]);

    /* -------------------------------------------
       Render
    --------------------------------------------*/
    return (
        <div className="webcam-glass-shell">
            <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

            {tabWarning && (<div className="warning-banner">⚠ Tab switching detected</div>)}

            {!recording ? (
                <button className="webcam-start-btn" onClick={startInterview}>Start Interview</button>
            ) : (
                <button className="webcam-stop-btn" onClick={stopInterview}>Stop Interview</button>
            )}
        </div>
    );
}

