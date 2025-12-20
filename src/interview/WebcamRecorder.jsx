// // // // // // // // // FILE: src/interview/WebcamRecorder.jsx
// // // // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // // // // import { API_BASE } from "@/utils/constants";
// // // // // // // // import "./WebcamRecorder.css";

// // // // // // // // export default function WebcamRecorder({
// // // // // // // //     candidateName,
// // // // // // // //     candidateId,
// // // // // // // //     jdText,
// // // // // // // //     onCandidateId,
// // // // // // // //     stage,
// // // // // // // //     onStartStage
// // // // // // // // }) {
// // // // // // // //     const videoRef = useRef(null);
// // // // // // // //     const streamRef = useRef(null);
// // // // // // // //     const faceLoopRef = useRef(null);

// // // // // // // //     const [recording, setRecording] = useState(false);

// // // // // // // //     // IMPORTANT: Mirror candidateId (because props DO NOT update inside interval)
// // // // // // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

// // // // // // // //     const [tabWarning, setTabWarning] = useState(false);

// // // // // // // //     useEffect(() => {
// // // // // // // //         if (candidateId) {
// // // // // // // //             setLocalCandidateId(candidateId);
// // // // // // // //         }
// // // // // // // //     }, [candidateId]);

// // // // // // // //     // ----------------------------------------------
// // // // // // // //     // TAB SWITCH DETECTION (same behavior as old system)
// // // // // // // //     // ----------------------------------------------
// // // // // // // //     useEffect(() => {
// // // // // // // //         function handleTab() {
// // // // // // // //             if (!localCandidateId) return;

// // // // // // // //             if (document.hidden) {
// // // // // // // //                 setTabWarning(true);

// // // // // // // //                 // Add transcript alert
// // // // // // // //                 window.dispatchEvent(
// // // // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // // // //                         detail: { role: "system", text: "⚠ Tab switch detected — stay in the interview window." }
// // // // // // // //                     })
// // // // // // // //                 );

// // // // // // // //                 // Send anomaly to backend
// // // // // // // //                 const fd = new FormData();
// // // // // // // //                 fd.append("candidate_name", candidateName);
// // // // // // // //                 fd.append("candidate_id", localCandidateId);
// // // // // // // //                 fd.append("event_type", "tab_switch");
// // // // // // // //                 fd.append("event_msg", "Tab switch detected");

// // // // // // // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // // // //                     method: "POST",
// // // // // // // //                     body: fd
// // // // // // // //                 });
// // // // // // // //             } else {
// // // // // // // //                 setTabWarning(false);
// // // // // // // //             }
// // // // // // // //         }

// // // // // // // //         document.addEventListener("visibilitychange", handleTab);
// // // // // // // //         return () => document.removeEventListener("visibilitychange", handleTab);
// // // // // // // //     }, [localCandidateId]);

// // // // // // // //     /** ---------------------------
// // // // // // // //         INIT CAMERA
// // // // // // // //     ---------------------------- **/
// // // // // // // //     useEffect(() => {
// // // // // // // //         async function init() {
// // // // // // // //             streamRef.current = await navigator.mediaDevices.getUserMedia({
// // // // // // // //                 video: true,
// // // // // // // //                 audio: true,
// // // // // // // //             });

// // // // // // // //             videoRef.current.srcObject = streamRef.current;
// // // // // // // //             await videoRef.current.play();
// // // // // // // //         }

// // // // // // // //         init();

// // // // // // // //         return () =>
// // // // // // // //             streamRef.current?.getTracks().forEach((t) => t.stop());
// // // // // // // //     }, []);
// // // // // // // //     /** ---------------------------
// // // // // // // //         START FACE MONITOR LOOP
// // // // // // // //     ---------------------------- **/
// // // // // // // //     function startFaceLoop() {
// // // // // // // //         clearInterval(faceLoopRef.current);

// // // // // // // //         faceLoopRef.current = setInterval(() => {
// // // // // // // //             if (videoRef.current?.videoWidth > 0) {
// // // // // // // //                 sendFaceFrame();
// // // // // // // //             } else {
// // // // // // // //                 console.log("⏳ Waiting for video to stabilize...");
// // // // // // // //             }
// // // // // // // //         }, 300);
// // // // // // // //     }

// // // // // // // //     /** ---------------------------
// // // // // // // //         START INTERVIEW
// // // // // // // //     ---------------------------- **/
// // // // // // // //     // async function startInterview() {
// // // // // // // //     //     setRecording(true);
// // // // // // // //     //     // 🔵 START THE TIMER
// // // // // // // //     //     window.dispatchEvent(new Event("startInterviewTimer"));
// // // // // // // //     //     const fd = new FormData();
// // // // // // // //     //     fd.append("init", "true");
// // // // // // // //     //     fd.append("candidate_name", candidateName);
// // // // // // // //     //     fd.append("job_description", jdText);

// // // // // // // //     //     if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // // // // // // //     //     const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // // // // // // //     //         method: "POST",
// // // // // // // //     //         body: fd,
// // // // // // // //     //     });

// // // // // // // //     //     const d = await r.json();

// // // // // // // //     //     if (d.candidate_id) {
// // // // // // // //     //         setLocalCandidateId(d.candidate_id);
// // // // // // // //     //         onCandidateId(d.candidate_id);
// // // // // // // //     //     }

// // // // // // // //     //     if (d.next_question) {
// // // // // // // //     //         window.dispatchEvent(
// // // // // // // //     //             new CustomEvent("transcriptAdd", {
// // // // // // // //     //                 detail: { role: "ai", text: d.next_question },
// // // // // // // //     //             })
// // // // // // // //     //         );
// // // // // // // //     //     }

// // // // // // // //     //     startFaceLoop();
// // // // // // // //     // }
// // // // // // // //     async function startInterview() {

// // // // // // // //         // ⭐ Stage 1: MCQ
// // // // // // // //         if (stage === 1) {
// // // // // // // //             console.log("➡ Starting Stage 1: MCQ");
// // // // // // // //             onStartStage(1);   // notify InterviewMode
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         // ⭐ Stage 2: Coding
// // // // // // // //         if (stage === 2) {
// // // // // // // //             console.log("➡ Starting Stage 2: Coding");
// // // // // // // //             onStartStage(2);
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         // ⭐ Stage 3: AI INTERVIEW
// // // // // // // //         console.log("➡ Starting Stage 3: AI Interview");

// // // // // // // //         setRecording(true);
// // // // // // // //         window.dispatchEvent(new Event("startInterviewTimer"));

// // // // // // // //         const fd = new FormData();
// // // // // // // //         fd.append("init", "true");
// // // // // // // //         fd.append("candidate_name", candidateName);
// // // // // // // //         fd.append("job_description", jdText);

// // // // // // // //         if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // // // // // // //         const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // // // // // // //             method: "POST",
// // // // // // // //             body: fd,
// // // // // // // //         });

// // // // // // // //         const d = await r.json();

// // // // // // // //         if (d.candidate_id) {
// // // // // // // //             setLocalCandidateId(d.candidate_id);
// // // // // // // //             onCandidateId(d.candidate_id);
// // // // // // // //         }

// // // // // // // //         if (d.next_question) {
// // // // // // // //             window.dispatchEvent(
// // // // // // // //                 new CustomEvent("transcriptAdd", {
// // // // // // // //                     detail: { role: "ai", text: d.next_question },
// // // // // // // //                 })
// // // // // // // //             );
// // // // // // // //         }

// // // // // // // //         startFaceLoop();
// // // // // // // //     }


// // // // // // // //     /** ---------------------------
// // // // // // // //         STOP INTERVIEW
// // // // // // // //     ---------------------------- **/
// // // // // // // //     function stopInterview() {
// // // // // // // //         setRecording(false);
// // // // // // // //         clearInterval(faceLoopRef.current);
// // // // // // // //         // 🔴 STOP THE TIMER
// // // // // // // //         window.dispatchEvent(new Event("stopInterviewTimer"));

// // // // // // // //         window.dispatchEvent(new Event("stopInterview"));
// // // // // // // //     }



// // // // // // // //     /** ---------------------------
// // // // // // // //         SEND FRAME → FACE MONITOR
// // // // // // // //     ---------------------------- **/
// // // // // // // //     async function sendFaceFrame() {
// // // // // // // //         if (!videoRef.current || !localCandidateId) {
// // // // // // // //             console.log("❌ sendFaceFrame: videoRef or candidateId missing");
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         const video = videoRef.current;

// // // // // // // //         // 🔥 Debug: log video size each frame
// // // // // // // //         console.log(`🎥 Video frame size: ${video.videoWidth} x ${video.videoHeight}`);

// // // // // // // //         // Prevent sending if video isn't ready
// // // // // // // //         if (video.videoWidth === 0 || video.videoHeight === 0) {
// // // // // // // //             console.log("⏳ Video not ready yet — skipping frame");
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         const canvas = document.createElement("canvas");
// // // // // // // //         canvas.width = video.videoWidth;
// // // // // // // //         canvas.height = video.videoHeight;

// // // // // // // //         const ctx = canvas.getContext("2d");
// // // // // // // //         ctx.drawImage(video, 0, 0);

// // // // // // // //         // 🔥 Debug: check if canvas rendered correctly
// // // // // // // //         console.log("🖼 Canvas frame rendered");

// // // // // // // //         // Convert to Blob
// // // // // // // //         const blob = await new Promise((resolve) =>
// // // // // // // //             canvas.toBlob(resolve, "image/jpeg", 0.85)
// // // // // // // //         );

// // // // // // // //         if (!blob) {
// // // // // // // //             console.log("❌ Blob conversion failed");
// // // // // // // //             return;
// // // // // // // //         }

// // // // // // // //         console.log(`📤 Sending frame → size: ${blob.size} bytes`);

// // // // // // // //         const fd = new FormData();
// // // // // // // //         fd.append("candidate_name", candidateName);
// // // // // // // //         fd.append("candidate_id", localCandidateId);
// // // // // // // //         fd.append("frame", blob);

// // // // // // // //         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // // // //             method: "POST",
// // // // // // // //             body: fd,
// // // // // // // //         });

// // // // // // // //         const data = await r.json();

// // // // // // // //         console.log("📥 Backend response:", data);

// // // // // // // //         window.dispatchEvent(
// // // // // // // //             new CustomEvent("liveInsightsUpdate", {
// // // // // // // //                 detail: {
// // // // // // // //                     anomalies: data.anomalies,
// // // // // // // //                     boxes: data.boxes,
// // // // // // // //                     frame: data.frame_base64,
// // // // // // // //                     faces: data.faces,
// // // // // // // //                     counts: data.anomaly_counts || {},
// // // // // // // //                 }
// // // // // // // //             })
// // // // // // // //         );

// // // // // // // //         if (data.anomalies?.length) {
// // // // // // // //             data.anomalies.forEach((a) => {
// // // // // // // //                 window.dispatchEvent(
// // // // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // // // //                         detail: { role: "system", text: `⚠ ${a.msg}` },
// // // // // // // //                     })
// // // // // // // //                 );
// // // // // // // //             });
// // // // // // // //         }
// // // // // // // //     }


// // // // // // // //     return (
// // // // // // // //         <div className="webcam-glass-shell">

// // // // // // // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // // // // // // //             {/* TAB SWITCH WARNING BANNER */}
// // // // // // // //             {tabWarning && (
// // // // // // // //                 <div className="warning-banner">⚠ Tab switching detected</div>
// // // // // // // //             )}

// // // // // // // //             {!recording ? (
// // // // // // // //                 <button className="webcam-start-btn" onClick={startInterview}>
// // // // // // // //                     Start Interview
// // // // // // // //                 </button>
// // // // // // // //             ) : (
// // // // // // // //                 <button className="webcam-stop-btn" onClick={stopInterview}>
// // // // // // // //                     Stop Interview
// // // // // // // //                 </button>
// // // // // // // //             )}
// // // // // // // //         </div>
// // // // // // // //     );

// // // // // // // // }
// // // // // // // // FILE: src/interview/WebcamRecorder.jsx
// // // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // // // import { API_BASE } from "@/utils/constants";
// // // // // // // import "./WebcamRecorder.css";

// // // // // // // export default function WebcamRecorder({
// // // // // // //     candidateName,
// // // // // // //     candidateId,
// // // // // // //     jdText,
// // // // // // //     onCandidateId,
// // // // // // //     stage,
// // // // // // //     onStartStage
// // // // // // // }) {
// // // // // // //     const videoRef = useRef(null);
// // // // // // //     const streamRef = useRef(null);
// // // // // // //     const faceLoopRef = useRef(null);

// // // // // // //     const [recording, setRecording] = useState(false);
// // // // // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// // // // // // //     const [tabWarning, setTabWarning] = useState(false);

// // // // // // //     useEffect(() => {
// // // // // // //         if (candidateId) setLocalCandidateId(candidateId);
// // // // // // //     }, [candidateId]);

// // // // // // //     /* =========================================
// // // // // // //        TAB SWITCH DETECTION
// // // // // // //     ========================================= */
// // // // // // //     useEffect(() => {
// // // // // // //         function handleTab() {
// // // // // // //             if (!localCandidateId) return;

// // // // // // //             if (document.hidden) {
// // // // // // //                 setTabWarning(true);

// // // // // // //                 window.dispatchEvent(
// // // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // // //                         detail: {
// // // // // // //                             role: "system",
// // // // // // //                             text: "⚠ Tab switch detected — stay in the interview window."
// // // // // // //                         }
// // // // // // //                     })
// // // // // // //                 );

// // // // // // //                 const fd = new FormData();
// // // // // // //                 fd.append("candidate_name", candidateName);
// // // // // // //                 fd.append("candidate_id", localCandidateId);
// // // // // // //                 fd.append("event_type", "tab_switch");
// // // // // // //                 fd.append("event_msg", "Tab switch detected");

// // // // // // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // // //                     method: "POST",
// // // // // // //                     body: fd
// // // // // // //                 });
// // // // // // //             } else {
// // // // // // //                 setTabWarning(false);
// // // // // // //             }
// // // // // // //         }

// // // // // // //         document.addEventListener("visibilitychange", handleTab);
// // // // // // //         return () =>
// // // // // // //             document.removeEventListener("visibilitychange", handleTab);
// // // // // // //     }, [localCandidateId]);

// // // // // // //     /* =========================================
// // // // // // //        INIT CAMERA
// // // // // // //     ========================================= */
// // // // // // //     useEffect(() => {
// // // // // // //         async function init() {
// // // // // // //             streamRef.current = await navigator.mediaDevices.getUserMedia({
// // // // // // //                 video: true,
// // // // // // //                 audio: true,
// // // // // // //             });

// // // // // // //             videoRef.current.srcObject = streamRef.current;
// // // // // // //             await videoRef.current.play();
// // // // // // //         }

// // // // // // //         init();
// // // // // // //         return () =>
// // // // // // //             streamRef.current?.getTracks().forEach((t) => t.stop());
// // // // // // //     }, []);

// // // // // // //     /* =========================================
// // // // // // //        FACE MONITOR LOOP
// // // // // // //     ========================================= */
// // // // // // //     function startFaceLoop() {
// // // // // // //         clearInterval(faceLoopRef.current);

// // // // // // //         faceLoopRef.current = setInterval(() => {
// // // // // // //             if (videoRef.current?.videoWidth > 0) sendFaceFrame();
// // // // // // //         }, 300);
// // // // // // //     }

// // // // // // //     /* =========================================
// // // // // // //        START INTERVIEW BUTTON (controls stage)
// // // // // // //     ========================================= */
// // // // // // //     async function startInterview() {

// // // // // // //         // ALWAYS start timer
// // // // // // //         window.dispatchEvent(new Event("startInterviewTimer"));
// // // // // // //         setRecording(true);

// // // // // // //         // ALWAYS START FACE MONITOR, regardless of stage
// // // // // // //         startFaceLoop();

// // // // // // //         // ⭐ Stage 1: MCQ
// // // // // // //         if (stage === null || stage === 1) {
// // // // // // //             console.log("➡ Stage 1: MCQ started");
// // // // // // //             onStartStage(1);
// // // // // // //             return; // DO NOT call process-answer
// // // // // // //         }

// // // // // // //         // ⭐ Stage 2: Coding
// // // // // // //         if (stage === 2) {
// // // // // // //             console.log("➡ Stage 2: Coding started");
// // // // // // //             onStartStage(2);
// // // // // // //             return; // DO NOT call process-answer
// // // // // // //         }

// // // // // // //         // ⭐ Stage 3: AI INTERVIEW (only now call backend)
// // // // // // //         console.log("➡ Stage 3: AI Interview started");

// // // // // // //         const fd = new FormData();
// // // // // // //         fd.append("init", "true");
// // // // // // //         fd.append("candidate_name", candidateName);
// // // // // // //         fd.append("job_description", jdText);
// // // // // // //         if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // // // // // //         const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // // // // // //             method: "POST",
// // // // // // //             body: fd,
// // // // // // //         });

// // // // // // //         const d = await r.json();

// // // // // // //         if (d.candidate_id) {
// // // // // // //             setLocalCandidateId(d.candidate_id);
// // // // // // //             onCandidateId(d.candidate_id);
// // // // // // //         }

// // // // // // //         if (d.next_question) {
// // // // // // //             window.dispatchEvent(
// // // // // // //                 new CustomEvent("transcriptAdd", {
// // // // // // //                     detail: { role: "ai", text: d.next_question },
// // // // // // //                 })
// // // // // // //             );
// // // // // // //         }
// // // // // // //     }



// // // // // // //     /* =========================================
// // // // // // //        STOP INTERVIEW
// // // // // // //     ========================================= */
// // // // // // //     function stopInterview() {
// // // // // // //         setRecording(false);
// // // // // // //         clearInterval(faceLoopRef.current);
// // // // // // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // // // // // //         window.dispatchEvent(new Event("stopInterview"));
// // // // // // //     }

// // // // // // //     /* =========================================
// // // // // // //        SEND VIDEO FRAME → Face Monitor API
// // // // // // //     ========================================= */
// // // // // // //     async function sendFaceFrame() {
// // // // // // //         if (!videoRef.current || !localCandidateId) return;

// // // // // // //         const video = videoRef.current;

// // // // // // //         if (video.videoWidth === 0 || video.videoHeight === 0) return;

// // // // // // //         const canvas = document.createElement("canvas");
// // // // // // //         canvas.width = video.videoWidth;
// // // // // // //         canvas.height = video.videoHeight;

// // // // // // //         const ctx = canvas.getContext("2d");
// // // // // // //         ctx.drawImage(video, 0, 0);

// // // // // // //         const blob = await new Promise((resolve) =>
// // // // // // //             canvas.toBlob(resolve, "image/jpeg", 0.85)
// // // // // // //         );
// // // // // // //         if (!blob) return;

// // // // // // //         const fd = new FormData();
// // // // // // //         fd.append("candidate_name", candidateName);
// // // // // // //         fd.append("candidate_id", localCandidateId);
// // // // // // //         fd.append("frame", blob);

// // // // // // //         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // // //             method: "POST",
// // // // // // //             body: fd,
// // // // // // //         });

// // // // // // //         const data = await r.json();

// // // // // // //         window.dispatchEvent(
// // // // // // //             new CustomEvent("liveInsightsUpdate", {
// // // // // // //                 detail: {
// // // // // // //                     anomalies: data.anomalies,
// // // // // // //                     boxes: data.boxes,
// // // // // // //                     frame: data.frame_base64,
// // // // // // //                     faces: data.faces,
// // // // // // //                     counts: data.anomaly_counts || {},
// // // // // // //                 }
// // // // // // //             })
// // // // // // //         );
// // // // // // //     }

// // // // // // //     return (
// // // // // // //         <div className="webcam-glass-shell">

// // // // // // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // // // // // //             {tabWarning && (
// // // // // // //                 <div className="warning-banner">⚠ Tab switching detected</div>
// // // // // // //             )}

// // // // // // //             {!recording ? (
// // // // // // //                 <button className="webcam-start-btn" onClick={startInterview}>
// // // // // // //                     Start Interview
// // // // // // //                 </button>
// // // // // // //             ) : (
// // // // // // //                 <button className="webcam-stop-btn" onClick={stopInterview}>
// // // // // // //                     Stop Interview
// // // // // // //                 </button>
// // // // // // //             )}
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // }
// // // // // // // FILE: src/interview/WebcamRecorder.jsx
// // // // // // // FILE: src/interview/WebcamRecorder.jsx
// // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // // import { API_BASE } from "@/utils/constants";
// // // // // // import "./WebcamRecorder.css";

// // // // // // export default function WebcamRecorder({
// // // // // //     candidateName,
// // // // // //     candidateId,
// // // // // //     jdText,
// // // // // //     onCandidateId,
// // // // // //     stage,
// // // // // //     onStartStage
// // // // // // }) {
// // // // // //     const videoRef = useRef(null);
// // // // // //     const streamRef = useRef(null);
// // // // // //     const faceLoopRef = useRef(null);

// // // // // //     const [recording, setRecording] = useState(false);
// // // // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// // // // // //     const [tabWarning, setTabWarning] = useState(false);

// // // // // //     /* ======================================================
// // // // // //        MIRROR CANDIDATE ID WHEN IT ARRIVES
// // // // // //     ====================================================== */
// // // // // //     useEffect(() => {
// // // // // //         if (candidateId) setLocalCandidateId(candidateId);
// // // // // //     }, [candidateId]);

// // // // // //     /* ======================================================
// // // // // //        TAB SWITCH DETECTION
// // // // // //     ====================================================== */
// // // // // //     useEffect(() => {
// // // // // //         function handleTab() {
// // // // // //             if (!localCandidateId) return;

// // // // // //             if (document.hidden) {
// // // // // //                 setTabWarning(true);

// // // // // //                 window.dispatchEvent(
// // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // //                         detail: {
// // // // // //                             role: "system",
// // // // // //                             text: "⚠ Tab switch detected — stay in the interview window."
// // // // // //                         }
// // // // // //                     })
// // // // // //                 );

// // // // // //                 const fd = new FormData();
// // // // // //                 fd.append("candidate_name", candidateName);
// // // // // //                 fd.append("candidate_id", localCandidateId);
// // // // // //                 fd.append("event_type", "tab_switch");
// // // // // //                 fd.append("event_msg", "Tab switch detected");

// // // // // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // //                     method: "POST",
// // // // // //                     body: fd
// // // // // //                 });
// // // // // //             } else {
// // // // // //                 setTabWarning(false);
// // // // // //             }
// // // // // //         }

// // // // // //         document.addEventListener("visibilitychange", handleTab);
// // // // // //         return () => document.removeEventListener("visibilitychange", handleTab);
// // // // // //     }, [localCandidateId]);

// // // // // //     /* ======================================================
// // // // // //        INIT CAMERA (with AbortError FIX)
// // // // // //     ====================================================== */
// // // // // //     useEffect(() => {
// // // // // //         async function init() {
// // // // // //             try {
// // // // // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({
// // // // // //                     video: true,
// // // // // //                     audio: true
// // // // // //                 });

// // // // // //                 videoRef.current.srcObject = streamRef.current;

// // // // // //                 // FIX: AbortError safe play()
// // // // // //                 videoRef.current.onloadedmetadata = () => {
// // // // // //                     videoRef.current.play().catch((err) => {
// // // // // //                         if (err.name === "AbortError") {
// // // // // //                             console.warn("🎥 SAFE IGNORE AbortError during play()");
// // // // // //                         } else {
// // // // // //                             console.error("Video play error:", err);
// // // // // //                         }
// // // // // //                     });
// // // // // //                 };
// // // // // //             } catch (err) {
// // // // // //                 console.error("Camera init error:", err);
// // // // // //             }
// // // // // //         }

// // // // // //         init();

// // // // // //         return () =>
// // // // // //             streamRef.current?.getTracks().forEach((t) => t.stop());
// // // // // //     }, []);

// // // // // //     /* ======================================================
// // // // // //        FACE MONITOR LOOP
// // // // // //     ====================================================== */
// // // // // //     function startFaceLoop() {
// // // // // //         console.log("🎥 FACE MONITOR STARTED");

// // // // // //         clearInterval(faceLoopRef.current);

// // // // // //         faceLoopRef.current = setInterval(() => {
// // // // // //             if (videoRef.current?.videoWidth > 0) {
// // // // // // //                 sendFaceFrame();
// // // // // // //             }
// // // // // // //         }, 300);
// // // // // // //     }

// // // // // // //     /* ======================================================
// // // // // // //        START INTERVIEW
// // // // // // //     ====================================================== */
// // // // // // //     function startInterview() {
// // // // // // //         console.log("▶ INTERVIEW STARTED — Stage:", stage);

// // // // // // //         setRecording(true);

// // // // // // //         window.dispatchEvent(new Event("startInterviewTimer"));

// // // // // // //         // WAIT UNTIL VIDEO IS READY BEFORE FACE LOOP
// // // // // // //         const waitForVideo = setInterval(() => {
// // // // // // //             const video = videoRef.current;
// // // // // // //             if (video && video.videoWidth > 0) {
// // // // // // //                 console.log("🎥 VIDEO READY — STARTING FACE LOOP");
// // // // // // //                 clearInterval(waitForVideo);
// // // // // // //                 startFaceLoop();
// // // // // // //             } else {
// // // // // // //                 console.log("⏳ Waiting for video to stabilize...");
// // // // // // //             }
// // // // // // //         }, 200);

// // // // // // //         // Start stage 1
// // // // // // //         onStartStage(1);
// // // // // // //     }



// // // // // // //     /* ======================================================
// // // // // // //        AUTO-START AI INTERVIEW WHEN ENTERING STAGE 3
// // // // // // //     ====================================================== */
// // // // // // //     useEffect(() => {
// // // // // // //         if (stage !== 3) return;
// // // // // // //         if (!recording) return; // must be recording already

// // // // // // //         console.log("🤖 AUTO-TRIGGER Stage 3 AI INTERVIEW");

// // // // // // //         async function beginAIInterview() {
// // // // // // //             const fd = new FormData();
// // // // // // //             fd.append("init", "true");
// // // // // // //             fd.append("candidate_name", candidateName);
// // // // // // //             fd.append("job_description", jdText);
// // // // // // //             if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // // // // // //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
// // // // // // //                 method: "POST",
// // // // // // //                 body: fd
// // // // // // //             });

// // // // // // //             const d = await r.json();

// // // // // // //             if (d.candidate_id) {
// // // // // // //                 setLocalCandidateId(d.candidate_id);
// // // // // // //                 onCandidateId(d.candidate_id);
// // // // // // //             }

// // // // // // //             if (d.next_question) {
// // // // // // //                 window.dispatchEvent(
// // // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // // //                         detail: { role: "ai", text: d.next_question }
// // // // // // //                     })
// // // // // // //                 );
// // // // // // //             }
// // // // // // //         }

// // // // // // //         beginAIInterview();
// // // // // // //     }, [stage, recording]);

// // // // // // //     /* ======================================================
// // // // // // //        STOP INTERVIEW
// // // // // // //     ====================================================== */
// // // // // // //     function stopInterview() {
// // // // // // //         console.log("⛔ INTERVIEW STOPPED");

// // // // // // //         setRecording(false);
// // // // // // //         clearInterval(faceLoopRef.current);

// // // // // // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // // // // // //         window.dispatchEvent(new Event("stopInterview"));
// // // // // // //     }

// // // // // // //     /* ======================================================
// // // // // // //        SEND FRAME → FACE MONITOR API
// // // // // // //     ====================================================== */
// // // // // // //     async function sendFaceFrame() {
// // // // // // //         if (!videoRef.current || !localCandidateId) return;

// // // // // // //         const video = videoRef.current;

// // // // // // //         // if (video.videoWidth === 0 || video.videoHeight === 0) return;
// // // // // // //         if (video.videoWidth === 0 || video.videoHeight === 0) {
// // // // // // //             console.log("⏳ Waiting for video to be ready...");
// // // // // // //             return; // allow loop to retry, do NOT kill face monitor
// // // // // // //         }


// // // // // // //         const canvas = document.createElement("canvas");
// // // // // // //         canvas.width = video.videoWidth;
// // // // // // //         canvas.height = video.videoHeight;

// // // // // // //         const ctx = canvas.getContext("2d");
// // // // // // //         ctx.drawImage(video, 0, 0);

// // // // // // //         const blob = await new Promise((resolve) =>
// // // // // // //             canvas.toBlob(resolve, "image/jpeg", 0.85)
// // // // // // //         );

// // // // // // //         if (!blob) return;

// // // // // // //         const fd = new FormData();
// // // // // // //         fd.append("candidate_name", candidateName);
// // // // // // //         fd.append("candidate_id", localCandidateId);
// // // // // // //         fd.append("frame", blob);

// // // // // // //         const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // // //             method: "POST",
// // // // // // //             body: fd
// // // // // // //         });

// // // // // // //         const data = await r.json();

// // // // // // //         console.log("📥 Backend response:", data);

// // // // // // //         window.dispatchEvent(
// // // // // // //             new CustomEvent("liveInsightsUpdate", {
// // // // // // //                 detail: {
// // // // // // //                     anomalies: data.anomalies || [],
// // // // // // //                     boxes: data.boxes || [],
// // // // // // //                     frame: data.frame_base64 || null,
// // // // // // //                     faces: data.faces || 0,
// // // // // // //                     counts: data.anomaly_counts || {}
// // // // // // //                 }
// // // // // // //             })
// // // // // // //         );


// // // // // // //         if (data.anomalies?.length) {
// // // // // // //             data.anomalies.forEach((a) => {
// // // // // // //                 window.dispatchEvent(
// // // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // // //                         detail: { role: "system", text: `⚠ ${a.msg}` }
// // // // // // //                     })
// // // // // // //                 );
// // // // // // //             });
// // // // // // //         }
// // // // // // //     }

// // // // // // //     /* ======================================================
// // // // // // //        RENDER
// // // // // // //     ====================================================== */
// // // // // // //     return (
// // // // // // //         <div className="webcam-glass-shell">

// // // // // // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // // // // // //             {tabWarning && (
// // // // // // //                 <div className="warning-banner">⚠ Tab switching detected</div>
// // // // // // //             )}

// // // // // // //             {!recording ? (
// // // // // // //                 <button className="webcam-start-btn" onClick={startInterview}>
// // // // // // //                     Start Interview
// // // // // // //                 </button>
// // // // // // //             ) : (
// // // // // // //                 <button className="webcam-stop-btn" onClick={stopInterview}>
// // // // // // //                     Stop Interview
// // // // // // //                 </button>
// // // // // // //             )}
// // // // // // //         </div>
// // // // // // //     );
// // // // // // // }
// // // // // // // FILE: src/interview/WebcamRecorder_fixed.jsx
// // // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // // import { API_BASE } from "@/utils/constants";
// // // // // // import "./WebcamRecorder.css";

// // // // // // export default function WebcamRecorder({
// // // // // //     candidateName,
// // // // // //     candidateId,
// // // // // //     jdText,
// // // // // //     onCandidateId,
// // // // // //     stage,
// // // // // //     // onStartStage
// // // // // // }) {
// // // // // //     const videoRef = useRef(null);
// // // // // //     const streamRef = useRef(null);
// // // // // //     const faceLoopRef = useRef(null);
// // // // // //     const waitForVideoRef = useRef(null);

// // // // // //     const [recording, setRecording] = useState(false);
// // // // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// // // // // //     const [tabWarning, setTabWarning] = useState(false);

// // // // // //     // Throttle ref (persists across renders)
// // // // // //     const lastDispatchRef = useRef(0);

// // // // // //     function dispatchInsights(data) {
// // // // // //         // ❌ DO NOT update UI during MCQ or Coding
// // // // // //         if (stage === 1 || stage === 2) return;

// // // // // //         const now = Date.now();
// // // // // //         if (now - lastDispatchRef.current < 1000) return;
// // // // // //         lastDispatchRef.current = now;

// // // // // //         window.dispatchEvent(
// // // // // //             new CustomEvent("liveInsightsUpdate", {
// // // // // //                 detail: {
// // // // // //                     anomalies: data.anomalies || [],
// // // // // //                     counts: data.anomaly_counts || {}
// // // // // //                 }
// // // // // //             })
// // // // // //         );
// // // // // //     }

// // // // // //     useEffect(() => {
// // // // // //         function pause() {
// // // // // //             stopFaceLoop();
// // // // // //         }

// // // // // //         function resume() {
// // // // // //             if (recording) {
// // // // // //                 startFaceLoop();
// // // // // //             }
// // // // // //         }

// // // // // //         window.addEventListener("pauseFaceMonitor", pause);
// // // // // //         window.addEventListener("resumeFaceMonitor", resume);

// // // // // //         return () => {
// // // // // //             window.removeEventListener("pauseFaceMonitor", pause);
// // // // // //             window.removeEventListener("resumeFaceMonitor", resume);
// // // // // //         };
// // // // // //     }, [recording]);

// // // // // //     /* -------------------------------------------
// // // // // //     Mirror candidate id when it arrives
// // // // // //     --------------------------------------------*/
// // // // // //     useEffect(() => {
// // // // // //         if (candidateId) setLocalCandidateId(candidateId);
// // // // // //     }, [candidateId]);

// // // // // //     /* -------------------------------------------
// // // // // //     Init camera (robust to AbortError)
// // // // // //     --------------------------------------------*/
// // // // // //     useEffect(() => {
// // // // // //         let mounted = true;

// // // // // //         async function init() {
// // // // // //             try {
// // // // // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// // // // // //                 if (!mounted) return;
// // // // // //                 const vid = videoRef.current;
// // // // // //                 vid.srcObject = streamRef.current;
// // // // // //                 // Use onloadedmetadata to call play safely
// // // // // //                 vid.onloadedmetadata = () => {
// // // // // //                     vid.play().catch((err) => {
// // // // // //                         if (err.name === "AbortError") {
// // // // // //                             console.warn("🎥 SAFE IGNORE AbortError during play()");
// // // // // //                         } else {
// // // // // //                             console.error("Video play error:", err);
// // // // // //                         }
// // // // // //                     });
// // // // // //                 };
// // // // // //             } catch (err) {
// // // // // //                 console.error("Camera init error:", err);
// // // // // //             }
// // // // // //         }

// // // // //         init();

// // // // // //         return () => {
// // // // // //             mounted = false;
// // // // // //             // stop stream
// // // // // //             streamRef.current?.getTracks().forEach((t) => t.stop());
// // // // // //             // clear intervals
// // // // // //             if (faceLoopRef.current) clearInterval(faceLoopRef.current);
// // // // // //             if (waitForVideoRef.current) clearInterval(waitForVideoRef.current);
// // // // // //         };
// // // // // //     }, []);

// // // // // //     /* -------------------------------------------
// // // // // //     Tab visibility handling
// // // // // //     --------------------------------------------*/
// // // // // //     useEffect(() => {
// // // // // //         function handleTab() {
// // // // // //             if (!localCandidateId) return;

// // // // // //             if (document.hidden) {
// // // // // //                 setTabWarning(true);

// // // // // //                 window.dispatchEvent(
// // // // // //                     new CustomEvent("transcriptAdd", {
// // // // // //                         detail: { role: "system", text: "⚠ Tab switch detected — stay in the interview window." }
// // // // // //                     })
// // // // // //                 );

// // // // // //                 const fd = new FormData();
// // // // // //                 fd.append("candidate_name", candidateName);
// // // // // //                 fd.append("candidate_id", localCandidateId);
// // // // // //                 fd.append("event_type", "tab_switch");
// // // // // //                 fd.append("event_msg", "Tab switch detected");

// // // // // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // // // // //                     method: "POST",
// // // // // //                     body: fd
// // // // // //                 })
// // // // // //                     .then(r => r.json())
// // // // // //                     .then(data => {
// // // // // //                         // 🔥 SEND TO LIVE INSIGHTS PANEL
// // // // // //                         dispatchInsights(data);

// // // // // //                     })
// // // // // //                     .catch(err => console.error("Tab switch send failed:", err));

// // // // // //             } else {
// // // // // //                 setTabWarning(false);
// // // // // //             }
// // // // // //         }

// // // // // //         document.addEventListener("visibilitychange", handleTab);
// // // // // //         return () => document.removeEventListener("visibilitychange", handleTab);
// // // // // //     }, [localCandidateId]);


// // // // // //     /* -------------------------------------------
// // // // // //     Start/stop face loop
// // // // // //     --------------------------------------------*/
// // // // // //     // function startFaceLoop() {
// // // // // //     //     console.log("🎥 FACE MONITOR STARTED");
// // // // // //     //     // ensure previous cleared
// // // // // //     //     if (faceLoopRef.current) clearInterval(faceLoopRef.current);

// // // // // //     //     faceLoopRef.current = setInterval(() => {
// // // // // //     //         const v = videoRef.current;
// // // // // //     //         if (!v || v.videoWidth === 0 || v.videoHeight === 0) return;

// // // // // //     //         // Throttle when AI or candidate is speaking
// // // // // //     //         const isBusy =
// // // // // //     //             window.__AI_SPEAKING__ === true ||
// // // // // //     //             window.__CANDIDATE_SPEAKING__ === true;

// // // // // //     //         if (isBusy && Math.random() > 0.3) return;

// // // // // //     //         sendFaceFrame();
// // // // // //     //     }, 300);

// // // // // //     // }
// // // // // //     function startFaceLoop() {
// // // // // //         // ❌ NEVER run during MCQ or Coding
// // // // // //         if (stage !== 3) {
// // // // // //             console.log("⛔ Face monitor blocked (stage:", stage, ")");
// // // // // //             return;
// // // // // //         }

// // // // // //         console.log("🎥 FACE MONITOR STARTED (AI stage)");

// // // // // //         if (faceLoopRef.current) clearInterval(faceLoopRef.current);

// // // // // //         faceLoopRef.current = setInterval(() => {
// // // // // //             const v = videoRef.current;
// // // // // //             if (!v || v.videoWidth === 0 || v.videoHeight === 0) return;

// // // // // //             sendFaceFrame();
// // // // // //         }, 500); // slow down
// // // // // //     }


// // // // // //     function stopFaceLoop() {
// // // // // //         if (faceLoopRef.current) {
// // // // // //             clearInterval(faceLoopRef.current);
// // // // // //             faceLoopRef.current = null;
// // // // // //             console.log("🎥 FACE MONITOR STOPPED");
// // // // // //         }
// // // // // //     }

// // // // // //     /* -------------------------------------------
// // // // // //     Start interview (single button)
// // // // // //     - Waits for video to be ready, starts face loop
// // // // // //     - Starts timer, sets recording state
// // // // // //     - Triggers stage 1 after loop started
// // // // // //     --------------------------------------------*/
// // // // // //     // const interviewStartedRef = useRef(false);
// // // // // //     // async function startInterview() {
// // // // // //     //     if (interviewStartedRef.current) return;
// // // // // //     //     interviewStartedRef.current = true;

// // // // // //     //     console.log("▶ INTERVIEW STARTED");
// // // // // //     //     setRecording(true);
// // // // // //     //     window.dispatchEvent(new Event("startInterviewTimer"));

// // // // // //     //     const v = videoRef.current;

// // // // // //     //     const start = () => {
// // // // // //     //         startFaceLoop();
// // // // // //     //         console.log("🎥 Face monitor started safely");
// // // // // //     //     };

// // // // // //     //     if (v && v.videoWidth > 0) {
// // // // // //     //         setTimeout(start, 200);
// // // // // //     //         return;
// // // // // //     //     }

// // // // // //     //     waitForVideoRef.current = setInterval(() => {
// // // // // //     //         const vv = videoRef.current;
// // // // // //     //         if (vv && vv.videoWidth > 0) {
// // // // // //     //             clearInterval(waitForVideoRef.current);
// // // // // //     //             waitForVideoRef.current = null;
// // // // // //     //             setTimeout(start, 200);
// // // // // //     //         }
// // // // // //     //     }, 200);
// // // // // //     // }

// // // // // //     const interviewStartedRef = useRef(false);

// // // // // //     async function startInterview() {
// // // // // //         if (interviewStartedRef.current) return;
// // // // // //         interviewStartedRef.current = true;

// // // // // //         console.log("▶ INTERVIEW STARTED");

// // // // // //         setRecording(true);
// // // // // //         window.dispatchEvent(new Event("startInterviewTimer"));

// // // // // //         // 🚫 DO NOT start face monitor here
// // // // // //         // Camera preview only — monitoring starts at stage 3
// // // // // //     }
// // // // // //     useEffect(() => {
// // // // // //         if (stage === 3 && recording) {
// // // // // //             console.log("🎥 Starting face monitor (AI stage)");
// // // // // //             startFaceLoop();
// // // // // //         } else {
// // // // // //             stopFaceLoop();
// // // // // //         }
// // // // // //     }, [stage, recording]);

// // // // // //     function stopInterview() {
// // // // // //         console.log("⛔ INTERVIEW STOPPED");
// // // // // //         setRecording(false);
// // // // // //         stopFaceLoop();
// // // // // //         if (waitForVideoRef.current) { clearInterval(waitForVideoRef.current); waitForVideoRef.current = null; }
// // // // // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // // // // //         window.dispatchEvent(new Event("stopInterview"));
// // // // // //     }

// // // // // //     /* -------------------------------------------
// // // // // //     send frame to backend and dispatch liveInsightsUpdate
// // // // // //     --------------------------------------------*/
// // // // // //     async function sendFaceFrame() {
// // // // // //         try {
// // // // // //             if (!videoRef.current || !localCandidateId) return;
// // // // // //             const video = videoRef.current;
// // // // // //             if (video.videoWidth === 0 || video.videoHeight === 0) return;

// // // // // //             const canvas = document.createElement("canvas");
// // // // // //             canvas.width = video.videoWidth;
// // // // // //             canvas.height = video.videoHeight;
// // // // // //             const ctx = canvas.getContext("2d");
// // // // // //             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

// // // // // //             const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.75));
// // // // // //             if (!blob) return;

// // // // // //             const fd = new FormData();
// // // // // //             fd.append("candidate_name", candidateName);
// // // // // //             fd.append("candidate_id", localCandidateId);
// // // // // //             fd.append("frame", blob);

// // // // // //             const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, { method: "POST", body: fd });
// // // // // //             const data = await res.json();
// // // // // //             dispatchInsights(data);

// // // // // //             // Defensive logging
// // // // // //             // console.log("📥 Backend response:", data);

// // // // // //             // Normalize and dispatch
// // // // // //             // window.dispatchEvent(
// // // // // //             //     new CustomEvent("liveInsightsUpdate", {
// // // // // //             //         detail: {
// // // // // //             //             anomalies: data.anomalies || [],
// // // // // //             //             boxes: data.boxes || [],
// // // // // //             //             faces: data.faces || 0,
// // // // // //             //             counts: data.anomaly_counts || {}
// // // // // //             //         }
// // // // // //             //     })
// // // // // //             // );


// // // // // //             // Also push system transcript messages for each anomaly (frontend uses it too)
// // // // // //             if (data.anomalies && data.anomalies.length) {
// // // // // //                 data.anomalies.forEach((a) => {
// // // // // //                     window.dispatchEvent(new CustomEvent("transcriptAdd", { detail: { role: "system", text: `⚠ ${a.msg}` } }));
// // // // // //                 });
// // // // // //             }

// // // // // //         } catch (err) {
// // // // // //             console.error("sendFaceFrame error:", err);
// // // // // //         }
// // // // // //     }

// // // // // //     // /* -------------------------------------------
// // // // // //     // Auto-trigger AI interview when stage becomes 3 (existing behavior)
// // // // // //     // --------------------------------------------*/
// // // // // //     // useEffect(() => {
// // // // // //     //     if (stage !== 3) return;
// // // // // //     //     if (!recording) return;

// // // // // //     //     console.log("🤖 AUTO-TRIGGER Stage 3 AI INTERVIEW");

// // // // // //     //     let cancelled = false;
// // // // // //     //     async function beginAIInterview() {
// // // // // //     //         try {
// // // // // //     //             const fd = new FormData();
// // // // // //     //             fd.append("init", "true");
// // // // // //     //             fd.append("candidate_name", candidateName);
// // // // // //     //             fd.append("job_description", jdText);
// // // // // //     //             if (localCandidateId) fd.append("candidate_id", localCandidateId);

// // // // // //     //             const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
// // // // // //     //             const d = await r.json();
// // // // // //     //             if (cancelled) return;
// // // // // //     //             if (d.candidate_id) {
// // // // // //     //                 setLocalCandidateId(d.candidate_id);
// // // // // //     //                 onCandidateId(d.candidate_id);
// // // // // //     //             }
// // // // // //     //             if (d.next_question) {
// // // // // //     //                 window.dispatchEvent(new CustomEvent("transcriptAdd", { detail: { role: "ai", text: d.next_question } }));
// // // // // //     //             }
// // // // // //     //         } catch (e) {
// // // // // //     //             console.error("beginAIInterview error:", e);
// // // // // //     //         }
// // // // // //     //     }
// // // // // //     //     beginAIInterview();
// // // // // //     //     return () => { cancelled = true; };
// // // // // //     // }, [stage, recording]);

// // // // // //     /* -------------------------------------------
// // // // // //     Render
// // // // // //     --------------------------------------------*/
// // // // // //     return (
// // // // // //         <div className="webcam-glass-shell">
// // // // // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // // // // //             {tabWarning && (<div className="warning-banner">⚠ Tab switching detected</div>)}

// // // // // //             {!recording ? (
// // // // // //                 <button className="webcam-start-btn" onClick={startInterview}>Start Interview</button>
// // // // // //             ) : (
// // // // // //                 <button className="webcam-stop-btn" onClick={stopInterview}>Stop Interview</button>
// // // // // //             )}
// // // // // //         </div>
// // // // // //     );
// // // // // // }
// // // // // // FILE: src/interview/WebcamRecorder_fixed.jsx

// // // // // import React, { useEffect, useRef, useState } from "react";
// // // // // import { API_BASE } from "@/utils/constants";
// // // // // import "./WebcamRecorder.css";

// // // // // export default function WebcamRecorder({
// // // // //     candidateName,
// // // // //     candidateId,
// // // // //     stage
// // // // // }) {
// // // // //     const videoRef = useRef(null);
// // // // //     const streamRef = useRef(null);
// // // // //     const faceLoopRef = useRef(null);

// // // // //     const [recording, setRecording] = useState(false);
// // // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// // // // //     const [tabWarning, setTabWarning] = useState(false);

// // // // //     const interviewStartedRef = useRef(false);
// // // // //     const lastDispatchRef = useRef(0);

// // // // //     /* --------------------------------------------------
// // // // //        Sync candidateId
// // // // //     -------------------------------------------------- */
// // // // //     useEffect(() => {
// // // // //         if (candidateId) setLocalCandidateId(candidateId);
// // // // //     }, [candidateId]);

// // // // //     /* --------------------------------------------------
// // // // //        Init camera (preview only)
// // // // //     -------------------------------------------------- */
// // // // //     useEffect(() => {
// // // // //         let mounted = true;

// // // // //         async function initCamera() {
// // // // //             try {
// // // // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({
// // // // //                     video: true,
// // // // //                     audio: true
// // // // //                 });

// // // // //                 if (!mounted) return;

// // // // //                 const video = videoRef.current;
// // // // //                 if (!video) return;

// // // // //                 video.srcObject = streamRef.current;
// // // // //                 video.onloadedmetadata = () => {
// // // // //                     video.play().catch(() => { });
// // // // //                 };
// // // // //             } catch (err) {
// // // // //                 console.error("Camera init failed:", err);
// // // // //             }
// // // // //         }

// // // // //         initCamera();

// // // // //         return () => {
// // // // //             mounted = false;
// // // // //             streamRef.current?.getTracks().forEach(t => t.stop());
// // // // //             stopFaceLoop();
// // // // //         };
// // // // //     }, []);

// // // // //     /* --------------------------------------------------
// // // // //        Start interview (NO face monitoring here)
// // // // //     -------------------------------------------------- */
// // // // //     function startInterview() {
// // // // //         if (interviewStartedRef.current) return;
// // // // //         interviewStartedRef.current = true;

// // // // //         console.log("▶ INTERVIEW STARTED");

// // // // //         setRecording(true);
// // // // //         window.dispatchEvent(new Event("startInterviewTimer"));
// // // // //     }

// // // // //     function stopInterview() {
// // // // //         console.log("⛔ INTERVIEW STOPPED");

// // // // //         setRecording(false);
// // // // //         stopFaceLoop();

// // // // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // // // //         window.dispatchEvent(new Event("stopInterview"));
// // // // //     }

// // // // //     /* --------------------------------------------------
// // // // //        Face monitor lifecycle — AI STAGE ONLY
// // // // //     -------------------------------------------------- */
// // // // //     useEffect(() => {
// // // // //         if (stage === 3 && recording) {
// // // // //             console.log("🎥 Face monitor START (AI stage)");
// // // // //             startFaceLoop();
// // // // //         } else {
// // // // //             stopFaceLoop();
// // // // //         }
// // // // //     }, [stage, recording]);

// // // // //     function startFaceLoop() {
// // // // //         if (faceLoopRef.current) return;

// // // // //         faceLoopRef.current = setInterval(() => {
// // // // //             sendFaceFrame();
// // // // //         }, 600); // intentionally slow
// // // // //     }

// // // // //     function stopFaceLoop() {
// // // // //         if (faceLoopRef.current) {
// // // // //             clearInterval(faceLoopRef.current);
// // // // //             faceLoopRef.current = null;
// // // // //             console.log("🎥 Face monitor STOP");
// // // // //         }
// // // // //     }

// // // // //     /* --------------------------------------------------
// // // // //        Tab switch detection (safe)
// // // // //     -------------------------------------------------- */
// // // // //     useEffect(() => {
// // // // //         function onVisibilityChange() {
// // // // //             if (!localCandidateId) return;

// // // // //             if (document.hidden) {
// // // // //                 setTabWarning(true);

// // // // //                 window.dispatchEvent(
// // // // //                     new CustomEvent("transcriptAdd", {
// // // // //                         detail: {
// // // // //                             role: "system",
// // // // //                             text: "⚠ Tab switch detected — stay in interview window."
// // // // //                         }
// // // // //                     })
// // // // //                 );
// // // // //             } else {
// // // // //                 setTabWarning(false);
// // // // //             }
// // // // //         }

// // // // //         document.addEventListener("visibilitychange", onVisibilityChange);
// // // // //         return () =>
// // // // //             document.removeEventListener("visibilitychange", onVisibilityChange);
// // // // //     }, [localCandidateId]);

// // // // //     /* --------------------------------------------------
// // // // //        Send face frame (AI stage only)
// // // // //     -------------------------------------------------- */
// // // // //     async function sendFaceFrame() {
// // // // //         if (!videoRef.current || !localCandidateId || stage !== 3) return;

// // // // //         const now = Date.now();
// // // // //         if (now - lastDispatchRef.current < 1000) return;
// // // // //         lastDispatchRef.current = now;

// // // // //         const video = videoRef.current;
// // // // //         if (!video.videoWidth || !video.videoHeight) return;

// // // // //         const canvas = document.createElement("canvas");
// // // // //         canvas.width = video.videoWidth;
// // // // //         canvas.height = video.videoHeight;

// // // // //         const ctx = canvas.getContext("2d");
// // // // //         ctx.drawImage(video, 0, 0);

// // // // //         const blob = await new Promise(r =>
// // // // //             canvas.toBlob(r, "image/jpeg", 0.75)
// // // // //         );
// // // // //         if (!blob) return;

// // // // //         const fd = new FormData();
// // // // //         fd.append("candidate_name", candidateName);
// // // // //         fd.append("candidate_id", localCandidateId);
// // // // //         fd.append("frame", blob);

// // // // //         try {
// // // // //             const res = await fetch(
// // // // //                 `${API_BASE}/mcp/interview/face-monitor`,
// // // // //                 { method: "POST", body: fd }
// // // // //             );

// // // // //             const data = await res.json();

// // // // //             window.dispatchEvent(
// // // // //                 new CustomEvent("liveInsightsUpdate", {
// // // // //                     detail: {
// // // // //                         anomalies: data.anomalies || [],
// // // // //                         counts: data.anomaly_counts || {}
// // // // //                     }
// // // // //                 })
// // // // //             );

// // // // //             if (data.anomalies?.length) {
// // // // //                 data.anomalies.forEach(a => {
// // // // //                     window.dispatchEvent(
// // // // //                         new CustomEvent("transcriptAdd", {
// // // // //                             detail: {
// // // // //                                 role: "system",
// // // // //                                 text: `⚠ ${a.msg}`
// // // // //                             }
// // // // //                         })
// // // // //                     );
// // // // //                 });
// // // // //             }
// // // // //         } catch (err) {
// // // // //             console.error("Face frame send failed:", err);
// // // // //         }
// // // // //     }

// // // // //     /* --------------------------------------------------
// // // // //        Render
// // // // //     -------------------------------------------------- */
// // // // //     return (
// // // // //         <div className="webcam-glass-shell">
// // // // //             <video
// // // // //                 ref={videoRef}
// // // // //                 className="webcam-video"
// // // // //                 autoPlay
// // // // //                 muted
// // // // //                 playsInline
// // // // //             />

// // // // //             {tabWarning && (
// // // // //                 <div className="warning-banner">
// // // // //                     ⚠ Tab switching detected
// // // // //                 </div>
// // // // //             )}

// // // // //             {!recording ? (
// // // // //                 <button
// // // // //                     className="webcam-start-btn"
// // // // //                     onClick={startInterview}
// // // // //                 >
// // // // //                     Start Interview
// // // // //                 </button>
// // // // //             ) : (
// // // // //                 <button
// // // // //                     className="webcam-stop-btn"
// // // // //                     onClick={stopInterview}
// // // // //                 >
// // // // //                     Stop Interview
// // // // //                 </button>
// // // // //             )}
// // // // //         </div>
// // // // //     );
// // // // // }

// // // // // FILE: src/interview/WebcamRecorder_fixed.jsx

// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import { API_BASE } from "@/utils/constants";
// // // // import "./WebcamRecorder.css";

// // // // export default function WebcamRecorder({
// // // //     candidateName,
// // // //     candidateId,
// // // //     stage
// // // // }) {
// // // //     const videoRef = useRef(null);
// // // //     const streamRef = useRef(null);
// // // //     const faceLoopRef = useRef(null);

// // // //     const [recording, setRecording] = useState(false);
// // // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);
// // // //     const [tabWarning, setTabWarning] = useState(false);

// // // //     const interviewStartedRef = useRef(false);
// // // //     const lastDispatchRef = useRef(0);

// // // //     /* =========================================================
// // // //        SYNC CANDIDATE ID
// // // //     ========================================================= */
// // // //     useEffect(() => {
// // // //         if (candidateId) setLocalCandidateId(candidateId);
// // // //     }, [candidateId]);

// // // //     /* =========================================================
// // // //        INIT CAMERA (PREVIEW ONLY)
// // // //        ❌ NO FACE MONITORING HERE
// // // //     ========================================================= */
// // // //     useEffect(() => {
// // // //         let mounted = true;

// // // //         async function initCamera() {
// // // //             try {
// // // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({
// // // //                     video: true,
// // // //                     audio: true
// // // //                 });

// // // //                 if (!mounted) return;

// // // //                 const video = videoRef.current;
// // // //                 if (!video) return;

// // // //                 video.srcObject = streamRef.current;
// // // //                 video.onloadedmetadata = () => {
// // // //                     video.play().catch(() => { });
// // // //                 };
// // // //             } catch (err) {
// // // //                 console.error("Camera init failed:", err);
// // // //             }
// // // //         }

// // // //         initCamera();

// // // //         return () => {
// // // //             mounted = false;
// // // //             streamRef.current?.getTracks().forEach(t => t.stop());
// // // //             stopFaceLoop();
// // // //         };
// // // //     }, []);

// // // //     /* =========================================================
// // // //        START / STOP INTERVIEW
// // // //     ========================================================= */
// // // //     function startInterview() {
// // // //         if (interviewStartedRef.current) return;
// // // //         interviewStartedRef.current = true;

// // // //         console.log("▶ INTERVIEW STARTED");

// // // //         setRecording(true);
// // // //         window.dispatchEvent(new Event("startInterviewTimer"));
// // // //     }

// // // //     function stopInterview() {
// // // //         console.log("⛔ INTERVIEW STOPPED");

// // // //         setRecording(false);
// // // //         stopFaceLoop();

// // // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // // //         window.dispatchEvent(new Event("stopInterview"));
// // // //     }

// // // //     /* =========================================================
// // // //        FACE MONITOR LIFECYCLE — AI STAGE ONLY
// // // //     ========================================================= */
// // // //     useEffect(() => {
// // // //         if (stage === 3 && recording) {
// // // //             console.log("🎥 Face monitor START (AI stage)");
// // // //             startFaceLoop();
// // // //         } else {
// // // //             stopFaceLoop();
// // // //         }
// // // //     }, [stage, recording]);

// // // //     function startFaceLoop() {
// // // //         if (faceLoopRef.current) return;

// // // //         faceLoopRef.current = setInterval(() => {
// // // //             sendFaceFrame();
// // // //         }, 800); // ⏱ intentionally slow (safe)
// // // //     }

// // // //     function stopFaceLoop() {
// // // //         if (faceLoopRef.current) {
// // // //             clearInterval(faceLoopRef.current);
// // // //             faceLoopRef.current = null;
// // // //             console.log("🎥 Face monitor STOP");
// // // //         }
// // // //     }

// // // //     /* =========================================================
// // // //        TAB SWITCH DETECTION (SAFE)
// // // //     ========================================================= */
// // // //     useEffect(() => {
// // // //         function onVisibilityChange() {
// // // //             if (!localCandidateId) return;

// // // //             if (document.hidden) {
// // // //                 setTabWarning(true);

// // // //                 window.dispatchEvent(
// // // //                     new CustomEvent("transcriptAdd", {
// // // //                         detail: {
// // // //                             role: "system",
// // // //                             text: "⚠ Tab switch detected — stay in interview window."
// // // //                         }
// // // //                     })
// // // //                 );
// // // //             } else {
// // // //                 setTabWarning(false);
// // // //             }
// // // //         }

// // // //         document.addEventListener("visibilitychange", onVisibilityChange);
// // // //         return () =>
// // // //             document.removeEventListener("visibilitychange", onVisibilityChange);
// // // //     }, [localCandidateId]);

// // // //     /* =========================================================
// // // //        SEND FACE FRAME — AI STAGE ONLY
// // // //     ========================================================= */
// // // //     async function sendFaceFrame() {
// // // //         if (!videoRef.current || !localCandidateId || stage !== 3) return;

// // // //         const now = Date.now();
// // // //         if (now - lastDispatchRef.current < 1000) return;
// // // //         lastDispatchRef.current = now;

// // // //         const video = videoRef.current;
// // // //         if (!video.videoWidth || !video.videoHeight) return;

// // // //         const canvas = document.createElement("canvas");
// // // //         canvas.width = video.videoWidth;
// // // //         canvas.height = video.videoHeight;

// // // //         const ctx = canvas.getContext("2d");
// // // //         ctx.drawImage(video, 0, 0);

// // // //         const blob = await new Promise(r =>
// // // //             canvas.toBlob(r, "image/jpeg", 0.75)
// // // //         );
// // // //         if (!blob) return;

// // // //         const fd = new FormData();
// // // //         fd.append("candidate_name", candidateName);
// // // //         fd.append("candidate_id", localCandidateId);
// // // //         fd.append("frame", blob);

// // // //         try {
// // // //             const res = await fetch(
// // // //                 `${API_BASE}/mcp/interview/face-monitor`,
// // // //                 { method: "POST", body: fd }
// // // //             );

// // // //             const data = await res.json();

// // // //             window.dispatchEvent(
// // // //                 new CustomEvent("liveInsightsUpdate", {
// // // //                     detail: {
// // // //                         anomalies: data.anomalies || [],
// // // //                         counts: data.anomaly_counts || {}
// // // //                     }
// // // //                 })
// // // //             );

// // // //             if (data.anomalies?.length) {
// // // //                 data.anomalies.forEach(a => {
// // // //                     window.dispatchEvent(
// // // //                         new CustomEvent("transcriptAdd", {
// // // //                             detail: {
// // // //                                 role: "system",
// // // //                                 text: `⚠ ${a.msg}`
// // // //                             }
// // // //                         })
// // // //                     );
// // // //                 });
// // // //             }
// // // //         } catch (err) {
// // // //             console.error("Face frame send failed:", err);
// // // //         }
// // // //     }

// // // //     /* =========================================================
// // // //        RENDER
// // // //     ========================================================= */
// // // //     return (
// // // //         <div className="webcam-glass-shell">
// // // //             <video
// // // //                 ref={videoRef}
// // // //                 className="webcam-video"
// // // //                 autoPlay
// // // //                 muted
// // // //                 playsInline
// // // //             />

// // // //             {tabWarning && (
// // // //                 <div className="warning-banner">
// // // //                     ⚠ Tab switching detected
// // // //                 </div>
// // // //             )}

// // // //             {!recording ? (
// // // //                 <button
// // // //                     className="webcam-start-btn"
// // // //                     onClick={startInterview}
// // // //                 >
// // // //                     Start Interview
// // // //                 </button>
// // // //             ) : (
// // // //                 <button
// // // //                     className="webcam-stop-btn"
// // // //                     onClick={stopInterview}
// // // //                 >
// // // //                     Stop Interview
// // // //                 </button>
// // // //             )}
// // // //         </div>
// // // //     );
// // // // }
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { API_BASE } from "@/utils/constants";
// // // import "./WebcamRecorder.css";

// // // export default function WebcamRecorder({
// // //     candidateName,
// // //     candidateId,
// // //     stage,
// // //     aiInterviewStarted
// // // }) {
// // //     const videoRef = useRef(null);
// // //     const streamRef = useRef(null);
// // //     const faceLoopRef = useRef(null);
// // //     const lastDispatchRef = useRef(0);

// // //     const [recording, setRecording] = useState(false);
// // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

// // //     /* ---------------- Sync ID ---------------- */
// // //     useEffect(() => {
// // //         if (candidateId) setLocalCandidateId(candidateId);
// // //     }, [candidateId]);

// // //     /* ---------------- Camera Preview ---------------- */
// // //     /* ---------------- AUTO START RECORDING FOR STAGE 3 ---------------- */
// // //     // useEffect(() => {
// // //     //     if (stage === 3 && !recording) {
// // //     //         console.log("▶ Auto-start recording for AI stage");
// // //     //         setRecording(true);
// // //     //         window.dispatchEvent(new Event("startInterviewTimer"));
// // //     //     }
// // //     // }, [stage]);

// // //     useEffect(() => {
// // //         let mounted = true;

// // //         (async () => {
// // //             try {
// // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
// // //                 if (!mounted) return;

// // //                 videoRef.current.srcObject = streamRef.current;
// // //                 videoRef.current.onloadedmetadata = () => videoRef.current.play().catch(() => { });
// // //             } catch (e) {
// // //                 console.error("Camera error:", e);
// // //             }
// // //         })();

// // //         return () => {
// // //             mounted = false;
// // //             streamRef.current?.getTracks().forEach(t => t.stop());
// // //             stopFaceLoop();
// // //         };
// // //     }, []);

// // //     /* ---------------- Start / Stop Interview ---------------- */
// // //     function startInterview() {
// // //         setRecording(true);
// // //         window.dispatchEvent(new Event("startInterviewTimer"));
// // //         console.log("▶ INTERVIEW STARTED");
// // //     }

// // //     function stopInterview() {
// // //         setRecording(false);
// // //         stopFaceLoop();
// // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // //         window.dispatchEvent(new Event("stopInterview"));
// // //     }

// // //     /* ---------------- Face Monitor (SAFE) ---------------- */
// // //     // useEffect(() => {
// // //     //     if (stage === 3 && recording && aiInterviewStarted) {
// // //     //         startFaceLoop();
// // //     //     } else {
// // //     //         stopFaceLoop();
// // //     //     }
// // //     // }, [stage, recording, aiInterviewStarted]);
// // //     /* ---------------- Face Monitor (GLOBAL SESSION) ---------------- */




// // //     /* ---------------- Send Frame ---------------- */
// // //     async function sendFaceFrame() {
// // //         if (!videoRef.current || !localCandidateId) return;

// // //         const now = Date.now();
// // //         if (now - lastDispatchRef.current < 1200) return;
// // //         lastDispatchRef.current = now;

// // //         const video = videoRef.current;
// // //         if (!video.videoWidth || !video.videoHeight) return;

// // //         const canvas = document.createElement("canvas");
// // //         canvas.width = video.videoWidth;
// // //         canvas.height = video.videoHeight;
// // //         canvas.getContext("2d").drawImage(video, 0, 0);

// // //         const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.75));
// // //         if (!blob) return;

// // //         const fd = new FormData();
// // //         fd.append("candidate_name", candidateName);
// // //         fd.append("candidate_id", localCandidateId);
// // //         fd.append("frame", blob);

// // //         const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // //             method: "POST",
// // //             body: fd
// // //         });

// // //         const data = await res.json();

// // //         window.dispatchEvent(new CustomEvent("liveInsightsUpdate", {
// // //             detail: {
// // //                 anomalies: data.anomalies || [],
// // //                 counts: data.anomaly_counts || {}
// // //             }
// // //         }));
// // //     }

// // //     useEffect(() => {
// // //         if (recording) {
// // //             startFaceLoop();
// // //         } else {
// // //             stopFaceLoop();
// // //         }
// // //     }, [recording]);


// // //     function startFaceLoop() {
// // //         if (faceLoopRef.current) return;

// // //         console.log("🎥 Face monitor START ");

// // //         faceLoopRef.current = setInterval(sendFaceFrame, 900);
// // //     }

// // //     function stopFaceLoop() {
// // //         if (faceLoopRef.current) {
// // //             clearInterval(faceLoopRef.current);
// // //             faceLoopRef.current = null;
// // //             console.log("🎥 Face monitor STOP");
// // //         }
// // //     }

// // //     /* ---------------- Render ---------------- */
// // //     return (
// // //         <div className="webcam-glass-shell">
// // //             <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

// // //             {/* Manual control ONLY before Stage 3 */}
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

// // //-- FILE: src/interview/WebcamRecorder_fixed.jsx
// // // import React, { useEffect, useRef, useState } from "react";
// // // import { API_BASE } from "@/utils/constants";
// // // import "./WebcamRecorder.css";

// // // export default function WebcamRecorder({
// // //     candidateName,
// // //     candidateId,
// // // }) {
// // //     const videoRef = useRef(null);
// // //     const streamRef = useRef(null);
// // //     const faceLoopRef = useRef(null);
// // //     const lastDispatchRef = useRef(0);

// // //     const [recording, setRecording] = useState(false);
// // //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

// // //     function dispatchInsights(data) {
// // //         window.dispatchEvent(
// // //             new CustomEvent("liveInsightsUpdate", {
// // //                 detail: {
// // //                     anomalies: data.anomalies || [],
// // //                     counts: data.anomaly_counts || {}
// // //                 }
// // //             })
// // //         );
// // //     }

// // //     /* ---------------- Sync ID ---------------- */
// // //     useEffect(() => {
// // //         if (candidateId) setLocalCandidateId(candidateId);
// // //     }, [candidateId]);

// // //     /* ---------------- Camera Preview ---------------- */
// // //     useEffect(() => {
// // //         let mounted = true;

// // //         (async () => {
// // //             try {
// // //                 streamRef.current = await navigator.mediaDevices.getUserMedia({
// // //                     video: true,
// // //                     audio: true
// // //                 });
// // //                 if (!mounted) return;

// // //                 videoRef.current.srcObject = streamRef.current;
// // //                 videoRef.current.onloadedmetadata = () =>
// // //                     videoRef.current.play().catch(() => { });
// // //             } catch (e) {
// // //                 console.error("Camera error:", e);
// // //             }
// // //         })();

// // //         return () => {
// // //             mounted = false;
// // //             streamRef.current?.getTracks().forEach(t => t.stop());
// // //             stopFaceLoop();
// // //         };
// // //     }, []);

// // //     /* ---------------- Start / Stop Interview ---------------- */
// // //     function startInterview() {
// // //         setRecording(true);
// // //         window.dispatchEvent(new Event("startInterviewTimer"));
// // //         console.log("▶ INTERVIEW STARTED");
// // //     }

// // //     function stopInterview() {
// // //         setRecording(false);
// // //         stopFaceLoop();
// // //         window.dispatchEvent(new Event("stopInterviewTimer"));
// // //         window.dispatchEvent(new Event("stopInterview"));
// // //     }

// // //     /* ---------------- Face Monitor (GLOBAL SESSION) ---------------- */
// // //     useEffect(() => {
// // //         if (recording) {
// // //             startFaceLoop();
// // //         } else {
// // //             stopFaceLoop();
// // //         }
// // //     }, [recording]);

// // //     function startFaceLoop() {
// // //         if (faceLoopRef.current) return;

// // //         console.log("🎥 Face monitor START");
// // //         faceLoopRef.current = setInterval(sendFaceFrame, 900);
// // //     }

// // //     function stopFaceLoop() {
// // //         if (faceLoopRef.current) {
// // //             clearInterval(faceLoopRef.current);
// // //             faceLoopRef.current = null;
// // //             console.log("🎥 Face monitor STOP");
// // //         }
// // //     }

// // //     /* ---------------- Send Frame ---------------- */
// // //     async function sendFaceFrame() {
// // //         if (!recording || !videoRef.current || !localCandidateId) return;

// // //         const now = Date.now();
// // //         if (now - lastDispatchRef.current < 1200) return;
// // //         lastDispatchRef.current = now;

// // //         const video = videoRef.current;
// // //         if (!video.videoWidth || !video.videoHeight) return;

// // //         const canvas = document.createElement("canvas");
// // //         canvas.width = video.videoWidth;
// // //         canvas.height = video.videoHeight;
// // //         canvas.getContext("2d").drawImage(video, 0, 0);

// // //         const blob = await new Promise(r =>
// // //             canvas.toBlob(r, "image/jpeg", 0.75)
// // //         );
// // //         if (!blob) return;

// // //         const fd = new FormData();
// // //         fd.append("candidate_name", candidateName);
// // //         fd.append("candidate_id", localCandidateId);
// // //         fd.append("frame", blob);

// // //         const res = await fetch(
// // //             `${API_BASE}/mcp/interview/face-monitor`,
// // //             { method: "POST", body: fd }
// // //         );

// // //         const data = await res.json();

// // //         window.dispatchEvent(
// // //             new CustomEvent("liveInsightsUpdate", {
// // //                 detail: {
// // //                     anomalies: data.anomalies || [],
// // //                     counts: data.anomaly_counts || {}
// // //                 }
// // //             })
// // //         );
// // //     }

// // //     /* -------------------------------------------
// // //    TAB VISIBILITY / TAB SWITCH MONITOR
// // // -------------------------------------------- */
// // //     useEffect(() => {
// // //         if (!localCandidateId) return;

// // //         function handleVisibilityChange() {
// // //             if (document.hidden) {
// // //                 console.warn("⚠ Tab switch detected");

// // //                 // Optional: transcript log
// // //                 window.dispatchEvent(
// // //                     new CustomEvent("transcriptAdd", {
// // //                         detail: {
// // //                             role: "system",
// // //                             text: "⚠ Tab switch detected — stay in the interview window."
// // //                         }
// // //                     })
// // //                 );

// // //                 const fd = new FormData();
// // //                 fd.append("candidate_name", candidateName);
// // //                 fd.append("candidate_id", localCandidateId);
// // //                 fd.append("event_type", "tab_switch");
// // //                 fd.append("event_msg", "Tab switch detected");

// // //                 fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// // //                     method: "POST",
// // //                     body: fd
// // //                 })
// // //                     .then(r => r.json())
// // //                     .then(data => {
// // //                         // ✅ UPDATE LIVE INSIGHTS
// // //                         dispatchInsights(data);
// // //                     })
// // //                     .catch(err =>
// // //                         console.error("❌ Tab switch send failed:", err)
// // //                     );
// // //             }
// // //         }

// // //         document.addEventListener("visibilitychange", handleVisibilityChange);
// // //         return () =>
// // //             document.removeEventListener("visibilitychange", handleVisibilityChange);

// // //     }, [localCandidateId, candidateName]);

// // //     /* ---------------- Render ---------------- */
// // //     return (
// // //         <div className="webcam-glass-shell">
// // //             <video
// // //                 ref={videoRef}
// // //                 className="webcam-video"
// // //                 autoPlay
// // //                 muted
// // //                 playsInline
// // //             />

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
// // import React, { useEffect, useRef, useState } from "react";
// // import { API_BASE } from "@/utils/constants";
// // import "./WebcamRecorder.css";

// // export default function WebcamRecorder({
// //     candidateName,
// //     candidateId,
// // }) {
// //     const videoRef = useRef(null);
// //     const streamRef = useRef(null);
// //     const faceLoopRef = useRef(null);
// //     const lastDispatchRef = useRef(0);

// //     const [recording, setRecording] = useState(false);
// //     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

// //     /* ---------------- DISPATCH LIVE INSIGHTS ---------------- */
// //     function dispatchInsights(data) {
// //         window.dispatchEvent(
// //             new CustomEvent("liveInsightsUpdate", {
// //                 detail: {
// //                     anomalies: data?.anomalies || [],
// //                     counts: data?.anomaly_counts || {}
// //                 }
// //             })
// //         );
// //     }

// //     /* ---------------- Sync Candidate ID ---------------- */
// //     useEffect(() => {
// //         if (candidateId) setLocalCandidateId(candidateId);
// //     }, [candidateId]);

// //     /* ---------------- Camera Preview ---------------- */
// //     useEffect(() => {
// //         let mounted = true;

// //         (async () => {
// //             try {
// //                 streamRef.current = await navigator.mediaDevices.getUserMedia({
// //                     video: true,
// //                     audio: true
// //                 });
// //                 if (!mounted) return;

// //                 videoRef.current.srcObject = streamRef.current;
// //                 videoRef.current.onloadedmetadata = () =>
// //                     videoRef.current.play().catch(() => { });
// //             } catch (e) {
// //                 console.error("Camera error:", e);
// //             }
// //         })();

// //         return () => {
// //             mounted = false;
// //             streamRef.current?.getTracks().forEach(t => t.stop());
// //             stopFaceLoop();
// //         };
// //     }, []);

// //     /* ---------------- Start / Stop Interview ---------------- */
// //     function startInterview() {
// //         setRecording(true);
// //         window.dispatchEvent(new Event("startInterviewTimer"));
// //         console.log("▶ INTERVIEW STARTED");
// //     }

// //     function stopInterview() {
// //         setRecording(false);
// //         stopFaceLoop();
// //         window.dispatchEvent(new Event("stopInterviewTimer"));
// //         window.dispatchEvent(new Event("stopInterview"));
// //     }

// //     /* ---------------- Face Monitor Loop ---------------- */
// //     useEffect(() => {
// //         if (recording) startFaceLoop();
// //         else stopFaceLoop();
// //     }, [recording]);

// //     function startFaceLoop() {
// //         if (faceLoopRef.current) return;

// //         console.log("🎥 Face monitor START");
// //         faceLoopRef.current = setInterval(sendFaceFrame, 900);
// //     }

// //     function stopFaceLoop() {
// //         if (faceLoopRef.current) {
// //             clearInterval(faceLoopRef.current);
// //             faceLoopRef.current = null;
// //             console.log("🎥 Face monitor STOP");
// //         }
// //     }

// //     /* ---------------- Send Face Frame ---------------- */
// //     async function sendFaceFrame() {
// //         if (!recording || document.hidden) return;
// //         if (!videoRef.current || !localCandidateId) return;

// //         const now = Date.now();
// //         if (now - lastDispatchRef.current < 1200) return;
// //         lastDispatchRef.current = now;

// //         const video = videoRef.current;
// //         if (!video.videoWidth || !video.videoHeight) return;

// //         const canvas = document.createElement("canvas");
// //         canvas.width = video.videoWidth;
// //         canvas.height = video.videoHeight;
// //         canvas.getContext("2d").drawImage(video, 0, 0);

// //         const blob = await new Promise(r =>
// //             canvas.toBlob(r, "image/jpeg", 0.75)
// //         );
// //         if (!blob) return;

// //         const fd = new FormData();
// //         fd.append("candidate_name", candidateName);
// //         fd.append("candidate_id", localCandidateId);
// //         fd.append("frame", blob);

// //         try {
// //             const res = await fetch(
// //                 `${API_BASE}/mcp/interview/face-monitor`,
// //                 { method: "POST", body: fd }
// //             );

// //             if (!res.ok) return;

// //             const data = await res.json();
// //             dispatchInsights(data);
// //         } catch (err) {
// //             console.error("❌ Face frame send failed:", err);
// //         }
// //     }

// //     /* ---------------- TAB SWITCH MONITOR ---------------- */
// //     useEffect(() => {
// //         if (!localCandidateId) return;

// //         function handleVisibilityChange() {
// //             if (!document.hidden) return;

// //             console.warn("⚠ Tab switch detected");

// //             window.dispatchEvent(
// //                 new CustomEvent("transcriptAdd", {
// //                     detail: {
// //                         role: "system",
// //                         text: "⚠ Tab switch detected — stay in the interview window."
// //                     }
// //                 })
// //             );

// //             const fd = new FormData();
// //             fd.append("candidate_name", candidateName);
// //             fd.append("candidate_id", localCandidateId);
// //             fd.append("event_type", "tab_switch");
// //             fd.append("event_msg", "Tab switch detected");

// //             fetch(`${API_BASE}/mcp/interview/face-monitor`, {
// //                 method: "POST",
// //                 body: fd
// //             })
// //                 .then(r => r.ok ? r.json() : null)
// //                 .then(data => data && dispatchInsights(data))
// //                 .catch(err =>
// //                     console.error("❌ Tab switch send failed:", err)
// //                 );
// //         }

// //         document.addEventListener("visibilitychange", handleVisibilityChange);
// //         return () =>
// //             document.removeEventListener("visibilitychange", handleVisibilityChange);

// //     }, [localCandidateId, candidateName]);

// //     /* ---------------- Render ---------------- */
// //     return (
// //         <div className="webcam-glass-shell">
// //             <video
// //                 ref={videoRef}
// //                 className="webcam-video"
// //                 autoPlay
// //                 muted
// //                 playsInline
// //             />

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
// import React, { useEffect, useRef, useState } from "react";
// import { API_BASE } from "@/utils/constants";
// import "./WebcamRecorder.css";

// export default function WebcamRecorder({ candidateName, candidateId }) {
//     const videoRef = useRef(null);
//     const streamRef = useRef(null);
//     const faceLoopRef = useRef(null);
//     const lastDispatchRef = useRef(0);

//     const [recording, setRecording] = useState(false);
//     const [localCandidateId, setLocalCandidateId] = useState(candidateId);

//     /* ---------------- DISPATCH LIVE INSIGHTS ---------------- */
//     function dispatchInsights(data) {
//         window.dispatchEvent(
//             new CustomEvent("liveInsightsUpdate", {
//                 detail: {
//                     anomalies: data?.anomalies || [],
//                     counts: data?.anomaly_counts || {},
//                 },
//             })
//         );
//     }

//     /* ---------------- Sync Candidate ID ---------------- */
//     useEffect(() => {
//         if (candidateId) setLocalCandidateId(candidateId);
//     }, [candidateId]);

//     /* ---------------- Camera Preview ---------------- */
//     useEffect(() => {
//         let mounted = true;

//         (async () => {
//             try {
//                 streamRef.current = await navigator.mediaDevices.getUserMedia({
//                     video: true,
//                     audio: true,
//                 });
//                 if (!mounted) return;

//                 videoRef.current.srcObject = streamRef.current;
//                 videoRef.current.onloadedmetadata = () =>
//                     videoRef.current.play().catch(() => { });
//             } catch (e) {
//                 console.error("Camera error:", e);
//             }
//         })();

//         return () => {
//             mounted = false;
//             streamRef.current?.getTracks().forEach((t) => t.stop());
//             stopFaceLoop();
//         };
//     }, []);

//     /* ---------------- Start / Stop Interview ---------------- */
//     function startInterview() {
//         setRecording(true);
//         window.dispatchEvent(new Event("startInterviewTimer"));
//         console.log("▶ INTERVIEW STARTED");
//     }

//     function stopInterview() {
//         setRecording(false);
//         stopFaceLoop();
//         window.dispatchEvent(new Event("stopInterviewTimer"));
//         window.dispatchEvent(new Event("stopInterview"));
//     }

//     /* ---------------- Face Monitor Loop ---------------- */
//     useEffect(() => {
//         if (recording) startFaceLoop();
//         else stopFaceLoop();
//     }, [recording]);

//     function startFaceLoop() {
//         if (faceLoopRef.current) return;

//         console.log("🎥 Face monitor START");
//         faceLoopRef.current = setInterval(sendFaceFrame, 900);
//     }

//     function stopFaceLoop() {
//         if (faceLoopRef.current) {
//             clearInterval(faceLoopRef.current);
//             faceLoopRef.current = null;
//             console.log("🎥 Face monitor STOP");
//         }
//     }

//     /* ---------------- Send Face Frame ---------------- */
//     async function sendFaceFrame() {
//         if (!recording || document.hidden) return;
//         if (!videoRef.current || !localCandidateId) return;

//         const now = Date.now();
//         if (now - lastDispatchRef.current < 1200) return;
//         lastDispatchRef.current = now;

//         const video = videoRef.current;
//         if (!video.videoWidth || !video.videoHeight) return;

//         const canvas = document.createElement("canvas");
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;
//         canvas.getContext("2d").drawImage(video, 0, 0);

//         const blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.75));
//         if (!blob) return;

//         const fd = new FormData();
//         fd.append("candidate_name", candidateName);
//         fd.append("candidate_id", localCandidateId);
//         fd.append("frame", blob);

//         try {
//             const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
//                 method: "POST",
//                 body: fd,
//             });

//             if (!res.ok) return;

//             const data = await res.json();
//             dispatchInsights(data);
//         } catch (err) {
//             console.error("❌ Face frame send failed:", err);
//         }
//     }

//     /* ---------------- TAB SWITCH MONITOR ---------------- */
//     useEffect(() => {
//         if (!localCandidateId) return;

//         function handleVisibilityChange() {
//             if (!document.hidden) return;

//             console.warn("⚠ Tab switch detected");

//             window.dispatchEvent(
//                 new CustomEvent("transcriptAdd", {
//                     detail: {
//                         role: "system",
//                         text: "⚠ Tab switch detected — stay in the interview window.",
//                     },
//                 })
//             );

//             const fd = new FormData();
//             fd.append("candidate_name", candidateName);
//             fd.append("candidate_id", localCandidateId);
//             fd.append("event_type", "tab_switch");
//             fd.append("event_msg", "Tab switch detected");

//             fetch(`${API_BASE}/mcp/interview/face-monitor`, {
//                 method: "POST",
//                 body: fd,
//             })
//                 .then((r) => (r.ok ? r.json() : null))
//                 .then((data) => data && dispatchInsights(data))
//                 .catch((err) => console.error("❌ Tab switch send failed:", err));
//         }

//         document.addEventListener("visibilitychange", handleVisibilityChange);
//         return () =>
//             document.removeEventListener("visibilitychange", handleVisibilityChange);
//     }, [localCandidateId, candidateName]);

//     /* ---------------- Render ---------------- */
//     return (
//         <div className="webcam-glass-shell">
//             <video
//                 ref={videoRef}
//                 className="webcam-video"
//                 autoPlay
//                 muted
//                 playsInline
//             />

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
import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder({
    candidateName,
    candidateId,
    aiBusyRef, // 🔑 NEW
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const faceLoopRef = useRef(null);
    const lastDispatchRef = useRef(0);
    const failCountRef = useRef(0);

    const [recording, setRecording] = useState(false);
    const [localCandidateId, setLocalCandidateId] = useState(candidateId);

    /* ---------------- DISPATCH LIVE INSIGHTS ---------------- */
    function dispatchInsights(data) {
        window.dispatchEvent(
            new CustomEvent("liveInsightsUpdate", {
                detail: {
                    anomalies: data?.anomalies || [],
                    counts: data?.anomaly_counts || {},
                },
            })
        );
    }

    /* ---------------- Sync Candidate ID ---------------- */
    useEffect(() => {
        if (candidateId) setLocalCandidateId(candidateId);
    }, [candidateId]);

    /* ---------------- Camera Preview ---------------- */
    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });
                if (!mounted) return;

                videoRef.current.srcObject = streamRef.current;
                videoRef.current.onloadedmetadata = () =>
                    videoRef.current.play().catch(() => { });
            } catch (e) {
                console.error("Camera error:", e);
            }
        })();

        return () => {
            mounted = false;
            streamRef.current?.getTracks().forEach((t) => t.stop());
            stopFaceLoop();
        };
    }, []);

    /* ---------------- Start / Stop Interview ---------------- */
    function startInterview() {
        setRecording(true);
        window.dispatchEvent(new Event("startInterviewTimer"));
    }

    function stopInterview() {
        setRecording(false);
        stopFaceLoop();
        window.dispatchEvent(new Event("stopInterviewTimer"));
        window.dispatchEvent(new Event("stopInterview"));
    }

    /* ---------------- Face Monitor Loop ---------------- */
    useEffect(() => {
        if (recording) startFaceLoop();
        else stopFaceLoop();
    }, [recording]);

    function startFaceLoop() {
        if (faceLoopRef.current) return;
        faceLoopRef.current = setInterval(sendFaceFrame, 1800);
    }

    function stopFaceLoop() {
        if (faceLoopRef.current) {
            clearInterval(faceLoopRef.current);
            faceLoopRef.current = null;
        }
    }

    /* ---------------- Send Face Frame ---------------- */
    async function sendFaceFrame() {
        if (!recording) return;
        if (aiBusyRef?.current) return; // 🔑 AI PRIORITY
        if (document.hidden) return;
        if (!videoRef.current || !localCandidateId) return;

        const now = Date.now();
        if (now - lastDispatchRef.current < 1200) return;
        lastDispatchRef.current = now;

        const video = videoRef.current;
        if (!video.videoWidth || !video.videoHeight) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        const blob = await new Promise((r) =>
            canvas.toBlob(r, "image/jpeg", 0.7)
        );
        if (!blob) return;

        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", localCandidateId);
        fd.append("frame", blob);

        try {
            const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
                method: "POST",
                body: fd,
            });

            if (!res.ok) throw new Error("Bad response");

            const data = await res.json();
            dispatchInsights(data);
            failCountRef.current = 0;
        } catch (err) {
            failCountRef.current++;

            // 🛑 AUTO-PAUSE ON NETWORK FAILURE
            if (failCountRef.current >= 3) {
                stopFaceLoop();
            }
        }
    }

    /* ---------------- TAB SWITCH ---------------- */
    useEffect(() => {
        if (!localCandidateId) return;

        function handleVisibilityChange() {
            if (!document.hidden) return;

            const fd = new FormData();
            fd.append("candidate_name", candidateName);
            fd.append("candidate_id", localCandidateId);
            fd.append("event_type", "tab_switch");
            fd.append("event_msg", "Tab switch detected");

            fetch(`${API_BASE}/mcp/interview/face-monitor`, {
                method: "POST",
                body: fd,
            })
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => d && dispatchInsights(d))
                .catch(() => { });
        }

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [localCandidateId, candidateName]);

    /* ---------------- Render ---------------- */
    return (
        <div className="webcam-glass-shell">
            <video
                ref={videoRef}
                className="webcam-video"
                autoPlay
                muted
                playsInline
            />

            {!recording ? (
                <button className="webcam-start-btn" onClick={startInterview}>
                    Start Interview
                </button>
            ) : (
                <button className="webcam-stop-btn" onClick={stopInterview}>
                    Stop Interview
                </button>
            )}
        </div>
    );
}
