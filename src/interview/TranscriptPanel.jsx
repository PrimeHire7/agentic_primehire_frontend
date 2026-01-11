// // // // // FILE: src/interview/TranscriptPanel.jsx
// // // // import React, { useEffect, useRef, useState } from "react";
// // // // import "./TranscriptPanel.css";

// // // // /* ------------------------------------------------------
// // // //    AI Voice Output (Web Speech API)
// // // // -------------------------------------------------------*/
// // // // // function speakAI(text) {
// // // // //     if (!window.speechSynthesis) {
// // // // //         console.warn("Speech synthesis not supported.");
// // // // //         return;
// // // // //     }

// // // // //     const utter = new SpeechSynthesisUtterance(text);
// // // // //     const voices = speechSynthesis.getVoices();

// // // // //     const preferred = voices.find(
// // // // //         (v) =>
// // // // //             v.name.includes("Google UK English Male") ||
// // // // //             v.name.includes("Google US English") ||
// // // // //             v.lang === "en-US"
// // // // //     );

// // // // //     if (preferred) utter.voice = preferred;

// // // // //     utter.rate = 1.0;
// // // // //     utter.pitch = 1.0;

// // // // //     window.speechSynthesis.speak(utter);
// // // // // }
// // // // function speakAI(text) {
// // // //     if (!window.speechSynthesis) return;

// // // //     // 🔴 CRITICAL: cancel previous speech
// // // //     window.speechSynthesis.cancel();

// // // //     const utter = new SpeechSynthesisUtterance(text);
// // // //     const voices = window.speechSynthesis.getVoices();

// // // //     const preferred = voices.find(
// // // //         (v) =>
// // // //             v.name.includes("Google UK English Male") ||
// // // //             v.name.includes("Google US English") ||
// // // //             v.lang === "en-US"
// // // //     );

// // // //     if (preferred) utter.voice = preferred;

// // // //     utter.rate = 1.0;
// // // //     utter.pitch = 1.0;

// // // //     // 🔥 GLOBAL FLAG FOR FACE MONITOR THROTTLING
// // // //     utter.onstart = () => {
// // // //         window.__AI_SPEAKING__ = true;
// // // //         window.dispatchEvent(new CustomEvent("aiSpeaking", { detail: true }));
// // // //     };

// // // //     utter.onend = () => {
// // // //         window.__AI_SPEAKING__ = false;
// // // //         window.dispatchEvent(new CustomEvent("aiSpeaking", { detail: false }));
// // // //     };

// // // //     utter.onerror = () => {
// // // //         window.__AI_SPEAKING__ = false;
// // // //         window.dispatchEvent(new CustomEvent("aiSpeaking", { detail: false }));
// // // //     };

// // // //     window.speechSynthesis.speak(utter);
// // // // }

// // // // /* ------------------------------------------------------
// // // //    COMPONENT
// // // // -------------------------------------------------------*/
// // // // export default function TranscriptPanel({ transcript, jdId = null, jdText = "" }) {
// // // //     const scrollRef = useRef(null);

// // // //     const [aiSpeaking, setAiSpeaking] = useState(false);
// // // //     const [userSpeaking, setUserSpeaking] = useState(false);

// // // //     /* ------------------------------------------------------
// // // //        Auto scroll when transcript updates
// // // //     -------------------------------------------------------*/
// // // //     useEffect(() => {
// // // //         if (scrollRef.current) {
// // // //             scrollRef.current.scrollTo({
// // // //                 top: scrollRef.current.scrollHeight,
// // // //                 behavior: "smooth",
// // // //             });
// // // //         }
// // // //     }, [transcript]);

// // // //     /* ------------------------------------------------------
// // // //        Speak AI messages
// // // //     -------------------------------------------------------*/
// // // //     // useEffect(() => {
// // // //     //     if (!transcript || transcript.length === 0) return;

// // // //     //     const lastMsg = transcript[transcript.length - 1];

// // // //     //     if (lastMsg.role === "ai") {
// // // //     //         setAiSpeaking(true);

// // // //     //         // Speak text
// // // //     //         speakAI(lastMsg.text);

// // // //     //         // Stop animation after TTS duration estimate
// // // //     //         setTimeout(() => setAiSpeaking(false), Math.min(lastMsg.text.length * 60, 3000));
// // // //     //     }
// // // //     // }, [transcript]);
// // // //     useEffect(() => {
// // // //         if (!transcript?.length) return;

// // // //         const lastMsg = transcript[transcript.length - 1];
// // // //         if (lastMsg.role === "ai") {
// // // //             speakAI(lastMsg.text);
// // // //         }
// // // //     }, [transcript]);


// // // //     /* ------------------------------------------------------
// // // //        Listen for speaking events
// // // //     -------------------------------------------------------*/
// // // //     useEffect(() => {
// // // //         const aiHandler = (e) => setAiSpeaking(e.detail);
// // // //         const userHandler = (e) => setUserSpeaking(e.detail);

// // // //         window.addEventListener("aiSpeaking", aiHandler);
// // // //         window.addEventListener("candidateSpeaking", userHandler);

// // // //         return () => {
// // // //             window.removeEventListener("aiSpeaking", aiHandler);
// // // //             window.removeEventListener("candidateSpeaking", userHandler);
// // // //         };
// // // //     }, []);

// // // //     return (
// // // //         <div className="tp-wrapper">
// // // //             <h4 className="tp-title">Transcript</h4>

// // // //             {/* JD Banner */}
// // // //             {(jdId || jdText) && (
// // // //                 <div className="tp-jd-banner">
// // // //                     {jdId && <div className="tp-jd-id">JD ID: {jdId}</div>}
// // // //                     {jdText && <div className="tp-jd-text">{jdText.slice(0, 120)}...</div>}
// // // //                 </div>
// // // //             )}

// // // //             {/* AI Talking Animation */}
// // // //             {aiSpeaking && (
// // // //                 <div className="tp-ai-speaking">
// // // //                     🤖 AI is speaking
// // // //                     <span className="dot dot1">.</span>
// // // //                     <span className="dot dot2">.</span>
// // // //                     <span className="dot dot3">.</span>
// // // //                 </div>
// // // //             )}

// // // //             {/* User Talking Animation */}
// // // //             {userSpeaking && (
// // // //                 <div className="tp-user-speaking">
// // // //                     🧑 You are speaking…
// // // //                     <div className="wave">
// // // //                         <div></div><div></div><div></div><div></div>
// // // //                     </div>
// // // //                 </div>
// // // //             )}

// // // //             <div className="tp-scroll" ref={scrollRef}>
// // // //                 {(!transcript || transcript.length === 0) && (
// // // //                     <div className="tp-empty">Transcript will appear here...</div>
// // // //                 )}

// // // //                 {transcript?.map((m, i) => (
// // // //                     <div key={i} className={`tp-msg ${m.role}`}>
// // // //                         <div className="tp-role">
// // // //                             {m.role === "ai"
// // // //                                 ? "🤖 AI"
// // // //                                 : m.role === "system"
// // // //                                     ? "⚠ System"
// // // //                                     : "🧑 Candidate"}
// // // //                         </div>
// // // //                         <div className="tp-text">{m.text}</div>
// // // //                     </div>
// // // //                 ))}
// // // //             </div>
// // // //         </div>
// // // //     );
// // // // }
// // // import React, { useEffect, useRef, useState } from "react";
// // // import "./TranscriptPanel.css";

// // // /* ------------------------------------------------------
// // //    AI Voice Output (Web Speech API) — SAFE
// // // -------------------------------------------------------*/
// // // function speakAI(text) {
// // //     if (!window.speechSynthesis) return;
// // //     if (typeof text !== "string" || !text.trim()) return;

// // //     // Cancel previous speech to avoid overlap crashes
// // //     window.speechSynthesis.cancel();

// // //     const utter = new SpeechSynthesisUtterance(text);
// // //     const voices = window.speechSynthesis.getVoices();

// // //     const preferred = voices.find(
// // //         (v) =>
// // //             v.name.includes("Google UK English") ||
// // //             v.name.includes("Google US English") ||
// // //             v.lang === "en-US"
// // //     );

// // //     if (preferred) utter.voice = preferred;

// // //     utter.rate = 1.0;
// // //     utter.pitch = 1.0;

// // //     utter.onstart = () => {
// // //         window.__AI_SPEAKING__ = true;
// // //         window.dispatchEvent(new CustomEvent("aiSpeaking", { detail: true }));
// // //     };

// // //     utter.onend = utter.onerror = () => {
// // //         window.__AI_SPEAKING__ = false;
// // //         window.dispatchEvent(new CustomEvent("aiSpeaking", { detail: false }));
// // //     };

// // //     window.speechSynthesis.speak(utter);
// // // }

// // // /* ------------------------------------------------------
// // //    COMPONENT
// // // -------------------------------------------------------*/
// // // export default function TranscriptPanel({ transcript = [], jdId = null, jdText = "" }) {
// // //     const scrollRef = useRef(null);
// // //     const [aiSpeaking, setAiSpeaking] = useState(false);
// // //     const [userSpeaking, setUserSpeaking] = useState(false);

// // //     /* Auto scroll */
// // //     useEffect(() => {
// // //         if (scrollRef.current) {
// // //             scrollRef.current.scrollTo({
// // //                 top: scrollRef.current.scrollHeight,
// // //                 behavior: "smooth",
// // //             });
// // //         }
// // //     }, [transcript]);

// // //     /* Speak last AI message safely */
// // //     useEffect(() => {
// // //         if (!Array.isArray(transcript) || transcript.length === 0) return;

// // //         const lastMsg = transcript[transcript.length - 1];
// // //         if (lastMsg?.role === "ai" && typeof lastMsg.text === "string") {
// // //             speakAI(lastMsg.text);
// // //         }
// // //     }, [transcript]);

// // //     /* Speaking listeners */
// // //     useEffect(() => {
// // //         const aiHandler = (e) => setAiSpeaking(!!e.detail);
// // //         const userHandler = (e) => setUserSpeaking(!!e.detail);

// // //         window.addEventListener("aiSpeaking", aiHandler);
// // //         window.addEventListener("candidateSpeaking", userHandler);

// // //         return () => {
// // //             window.removeEventListener("aiSpeaking", aiHandler);
// // //             window.removeEventListener("candidateSpeaking", userHandler);
// // //         };
// // //     }, []);

// // //     return (
// // //         <div className="tp-wrapper">
// // //             <h4 className="tp-title">Transcript</h4>

// // //             {(jdId || jdText) && (
// // //                 <div className="tp-jd-banner">
// // //                     {jdId && <div className="tp-jd-id">JD ID: {jdId}</div>}
// // //                     {jdText && (
// // //                         <div className="tp-jd-text">
// // //                             {jdText.slice(0, 120)}...
// // //                         </div>
// // //                     )}
// // //                 </div>
// // //             )}

// // //             {aiSpeaking && (
// // //                 <div className="tp-ai-speaking">
// // //                     🤖 AI is speaking
// // //                     <span className="dot dot1">.</span>
// // //                     <span className="dot dot2">.</span>
// // //                     <span className="dot dot3">.</span>
// // //                 </div>
// // //             )}

// // //             {userSpeaking && (
// // //                 <div className="tp-user-speaking">
// // //                     🧑 You are speaking…
// // //                     <div className="wave">
// // //                         <div></div><div></div><div></div><div></div>
// // //                     </div>
// // //                 </div>
// // //             )}

// // //             <div className="tp-scroll" ref={scrollRef}>
// // //                 {(!Array.isArray(transcript) || transcript.length === 0) && (
// // //                     <div className="tp-empty">Transcript will appear here...</div>
// // //                 )}

// // //                 {Array.isArray(transcript) &&
// // //                     transcript.map((m, i) => {
// // //                         if (!m || typeof m.text !== "string") return null;

// // //                         return (
// // //                             <div key={i} className={`tp-msg ${m.role || "system"}`}>
// // //                                 <div className="tp-role">
// // //                                     {m.role === "ai"
// // //                                         ? "🤖 AI"
// // //                                         : m.role === "system"
// // //                                             ? "⚠ System"
// // //                                             : "🧑 Candidate"}
// // //                                 </div>
// // //                                 <div className="tp-text">{m.text}</div>
// // //                             </div>
// // //                         );
// // //                     })}
// // //             </div>
// // //         </div>
// // //     );
// // // }
// // import React, { useState, useEffect, useRef } from "react";
// // import { Button } from "@/components/ui/button";
// // import { API_BASE } from "@/utils/constants";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import Scheduler from "@/components/Scheduler";
// // import logo from "../assets/primehire_logo.png";
// // import "./ValidationPanel.css";

// // export default function ValidationPanel() {
// //     const navigate = useNavigate();
// //     const location = useLocation();
// //     const params = new URLSearchParams(location.search);

// //     /* ================= URL PARAMS ================= */
// //     const candidateId = params.get("candidateId");
// //     const candidateNameFromURL = params.get("candidateName") || "";
// //     const jdId = params.get("jd_id");
// //     const interviewToken = params.get("token");

// //     /* ================= ACCESS STATE ================= */
// //     const [accessState, setAccessState] = useState("checking");
// //     const [slot, setSlot] = useState(null);
// //     const [errorMsg, setErrorMsg] = useState("");

// //     /* ================= BASIC INFO ================= */
// //     const [candidateName, setCandidateName] = useState(candidateNameFromURL);
// //     const [jdText, setJdText] = useState("");

// //     /* ================= PAN ================= */
// //     const [panFile, setPanFile] = useState(null);
// //     const [panStatus, setPanStatus] = useState("idle");
// //     const [panMessage, setPanMessage] = useState("");
// //     const [panValidated, setPanValidated] = useState(false);

// //     /* ================= CAMERA ================= */
// //     const [capturedImage, setCapturedImage] = useState(null);
// //     const [isSaved, setIsSaved] = useState(false);

// //     const videoRef = useRef(null);
// //     const canvasRef = useRef(null);

// //     /* =====================================================
// //        VALIDATE ACCESS
// //     ===================================================== */
// //     useEffect(() => {
// //         if (!candidateId || !jdId || !interviewToken) {
// //             setAccessState("error");
// //             setErrorMsg("Invalid interview link.");
// //             return;
// //         }

// //         const validateAccess = async () => {
// //             try {
// //                 const qs = new URLSearchParams({
// //                     candidate_id: candidateId,
// //                     jd_id: jdId,
// //                     token: interviewToken,
// //                 });

// //                 const res = await fetch(
// //                     `${API_BASE}/mcp/interview_bot_beta/scheduler/validate_access?${qs}`
// //                 );
// //                 const data = await res.json();

// //                 setSlot({ start: data.slot_start, end: data.slot_end });

// //                 if (!data.ok) {
// //                     setAccessState(
// //                         data.reason === "TOO_EARLY"
// //                             ? "early"
// //                             : data.reason === "EXPIRED"
// //                                 ? "expired"
// //                                 : "error"
// //                     );
// //                     return;
// //                 }

// //                 setAccessState("allowed");
// //             } catch {
// //                 setAccessState("error");
// //                 setErrorMsg("Server validation failed.");
// //             }
// //         };

// //         validateAccess();
// //     }, []);

// //     /* =====================================================
// //        FETCH JD
// //     ===================================================== */
// //     useEffect(() => {
// //         if (!jdId) return;
// //         fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`)
// //             .then((r) => r.json())
// //             .then((d) => setJdText(d?.jd_text || ""));
// //     }, [jdId]);

// //     /* =====================================================
// //        PAN VALIDATION
// //     ===================================================== */
// //     const validatePanCard = async () => {
// //         if (!panFile) return;

// //         setPanStatus("validating");
// //         setPanMessage("");

// //         const fd = new FormData();
// //         fd.append("name", candidateName);
// //         fd.append("pan_file", panFile);

// //         try {
// //             const res = await fetch(
// //                 `${API_BASE}/mcp/tools/candidate_validation/validate_candidate`,
// //                 { method: "POST", body: fd }
// //             );
// //             const data = await res.json();

// //             if (data?.validation?.valid_name) {
// //                 setPanValidated(true);
// //                 setPanStatus("success");
// //                 setPanMessage("PAN verified successfully");
// //             } else {
// //                 setPanValidated(false);
// //                 setPanStatus("error");
// //                 setPanMessage(data?.validation?.message || "PAN validation failed");
// //             }
// //         } catch {
// //             setPanStatus("error");
// //             setPanMessage("PAN validation error");
// //         }
// //     };

// //     /* =====================================================
// //        CAMERA
// //     ===================================================== */
// //     const startCamera = async () => {
// //         if (panFile && !panValidated && panStatus !== "idle") {
// //             alert("Please validate PAN or remove it.");
// //             return;
// //         }
// //         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
// //         videoRef.current.srcObject = stream;
// //         await videoRef.current.play();
// //     };

// //     const captureFace = () => {
// //         const canvas = canvasRef.current;
// //         const video = videoRef.current;
// //         canvas.width = video.videoWidth;
// //         canvas.height = video.videoHeight;
// //         canvas.getContext("2d").drawImage(video, 0, 0);
// //         setCapturedImage(canvas.toDataURL("image/png"));
// //     };

// //     // const saveFaceToBackend = async () => {
// //     //     const blob = await (await fetch(capturedImage)).blob();
// //     //     const fd = new FormData();
// //     //     fd.append("candidate_name", candidateName);
// //     //     fd.append("candidate_id", candidateId);
// //     //     fd.append("face_image", blob);

// //     //     await fetch(
// //     //         `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
// //     //         { method: "POST", body: fd }
// //     //     );

// //     //     setIsSaved(true);
// //     // };
// //     const saveFaceToBackend = async () => {
// //         const blob = await (await fetch(capturedImage)).blob();
// //         const fd = new FormData();
// //         fd.append("candidate_name", candidateName);
// //         fd.append("candidate_id", candidateId);
// //         fd.append("face_image", blob);

// //         await fetch(
// //             `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
// //             { method: "POST", body: fd }
// //         );

// //         // 🔑 STOP CAMERA STREAM
// //         const stream = videoRef.current?.srcObject;
// //         if (stream) {
// //             stream.getTracks().forEach(t => t.stop());
// //             videoRef.current.srcObject = null;
// //         }

// //         setIsSaved(true);
// //     };

// //     const handleContinue = () => {
// //         navigate("/instructions", {
// //             state: { candidateName, candidateId, jd_id: jdId, jd_text: jdText, interviewToken },
// //         });
// //     };

// //     /* =====================================================
// //        ACCESS STATES
// //     ===================================================== */
// //     if (accessState === "checking")
// //         return <div className="vp-loading">🔒 Checking interview window…</div>;

// //     if (accessState === "early")
// //         return (
// //             <div className="vp-container">
// //                 <div className="vp-access-state early">
// //                     <h2>⏳ Interview Not Started</h2>
// //                     <span className="time-window">
// //                         {new Date(slot.start).toLocaleString()} —{" "}
// //                         {new Date(slot.end).toLocaleString()}
// //                     </span>
// //                 </div>
// //             </div>
// //         );

// //     if (accessState === "expired")
// //         return (
// //             <div className="vp-container">
// //                 <div className="vp-access-state expired">
// //                     <h2>❌ Interview Expired</h2>
// //                     <Scheduler />
// //                 </div>
// //             </div>
// //         );

// //     if (accessState === "error")
// //         return <div className="vp-container">❌ {errorMsg}</div>;

// //     /* =====================================================
// //        MAIN UI
// //     ===================================================== */
// //     return (
// //         <div className="vp-container">
// //             <div className="vp-logo-header">
// //                 <img src={logo} className="vp-logo" />
// //             </div>

// //             <div className="vp-slot-box">
// //                 <strong>Interview Window</strong>
// //                 <div>
// //                     {new Date(slot.start).toLocaleString()} —{" "}
// //                     {new Date(slot.end).toLocaleString()}
// //                 </div>
// //             </div>

// //             <div className="vp-input-block">
// //                 <label>Candidate Name</label>
// //                 <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
// //             </div>

// //             <div className="vp-pan-block">
// //                 <label>PAN Card (Optional)</label>
// //                 <input type="file" onChange={(e) => setPanFile(e.target.files[0])} />
// //                 {panFile && <Button onClick={validatePanCard}>Validate PAN</Button>}
// //                 {panMessage && (
// //                     <div className={`vp-pan-status ${panStatus}`}>
// //                         {panMessage}
// //                     </div>
// //                 )}
// //             </div>

// //             <div className="vp-camera-row">
// //                 <div className="vp-video-box">
// //                     {capturedImage ? (
// //                         <img src={capturedImage} />
// //                     ) : (
// //                         <video ref={videoRef} autoPlay muted />
// //                     )}
// //                     <canvas ref={canvasRef} hidden />
// //                 </div>

// //                 <div className="vp-actions">
// //                     <Button onClick={startCamera}>Start Camera</Button>
// //                     <Button onClick={captureFace}>Capture</Button>
// //                     <Button onClick={saveFaceToBackend}>Save Face</Button>
// //                     <Button
// //                         className="vp-continue-btn"
// //                         disabled={!isSaved}
// //                         onClick={handleContinue}
// //                     >
// //                         Continue →
// //                     </Button>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }
// // FILE: src/interview/TranscriptPanel.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { API_BASE } from "@/utils/constants";
// import "./TranscriptPanel.css";

// export default function TranscriptPanel({
//     transcript,
//     jdText,
//     jdId,
// }) {
//     const [list, setList] = useState(transcript || []);
//     const mediaRecorderRef = useRef(null);
//     const chunksRef = useRef([]);
//     const recordingRef = useRef(false);

//     /* =====================================================
//        KEEP TRANSCRIPT IN SYNC
//     ===================================================== */
//     useEffect(() => {
//         setList(transcript || []);
//     }, [transcript]);

//     /* =====================================================
//        START AUDIO RECORDING
//     ===================================================== */
//     const startRecording = async () => {
//         if (recordingRef.current) return;

//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const mr = new MediaRecorder(stream);
//         mediaRecorderRef.current = mr;
//         chunksRef.current = [];

//         mr.ondataavailable = (e) => chunksRef.current.push(e.data);

//         mr.onstop = async () => {
//             stream.getTracks().forEach(t => t.stop());
//             await sendAudio();
//         };

//         mr.start();
//         recordingRef.current = true;
//     };

//     /* =====================================================
//        STOP AUDIO RECORDING
//     ===================================================== */
//     const stopRecording = () => {
//         if (!recordingRef.current) return;
//         recordingRef.current = false;
//         mediaRecorderRef.current?.stop();
//     };

//     /* =====================================================
//        SEND AUDIO → BACKEND → NEXT QUESTION
//     ===================================================== */
//     async function sendAudio() {
//         const blob = new Blob(chunksRef.current, { type: "audio/webm" });
//         if (!blob.size) return;

//         const fd = new FormData();
//         fd.append("audio", blob);
//         fd.append("candidate_name", "");
//         fd.append("candidate_id", "");
//         fd.append("job_description", jdText);
//         if (jdId) fd.append("jd_id", jdId);

//         const r = await fetch(
//             `${API_BASE}/mcp/interview_bot_beta/process-answer`,
//             { method: "POST", body: fd }
//         );

//         const d = await r.json();

//         if (d?.transcribed_text) {
//             setList(prev => [
//                 ...prev,
//                 { role: "user", text: d.transcribed_text },
//             ]);
//         }

//         if (d?.next_question) {
//             setList(prev => [
//                 ...prev,
//                 { role: "ai", text: d.next_question },
//             ]);
//         }

//         if (d?.completed) {
//             window.dispatchEvent(new Event("stopInterview"));
//         }
//     }

//     /* =====================================================
//        UI
//     ===================================================== */
//     return (
//         <div className="transcript-panel">
//             <div className="transcript-list">
//                 {list.map((m, i) => (
//                     <div key={i} className={`msg ${m.role}`}>
//                         {m.text}
//                     </div>
//                 ))}
//             </div>

//             <div className="transcript-controls">
//                 <button onMouseDown={startRecording} onMouseUp={stopRecording}>
//                     🎙 Hold to Speak
//                 </button>
//             </div>
//         </div>
//     );
// }
// FILE: src/interview/TranscriptPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import "./TranscriptPanel.css";

/* ------------------------------------------------------
   AI Voice Output (SAFE)
-------------------------------------------------------*/
function speakAI(text) {
    if (!window.speechSynthesis) return;
    if (!text || typeof text !== "string") return;

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;

    utter.onstart = () => {
        window.dispatchEvent(
            new CustomEvent("aiSpeaking", { detail: true })
        );
    };

    utter.onend = utter.onerror = () => {
        window.dispatchEvent(
            new CustomEvent("aiSpeaking", { detail: false })
        );
    };

    window.speechSynthesis.speak(utter);
}

export default function TranscriptPanel({ jdId, jdText }) {
    const [messages, setMessages] = useState([]);
    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [userSpeaking, setUserSpeaking] = useState(false);

    const scrollRef = useRef(null);

    /* ------------------------------------------------------
       AUTO SCROLL
    -------------------------------------------------------*/
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    /* ------------------------------------------------------
       TRANSCRIPT ADD EVENTS
    -------------------------------------------------------*/
    useEffect(() => {
        function handleAdd(e) {
            if (!e.detail?.text) return;

            setMessages(prev => [...prev, e.detail]);

            if (e.detail.role === "ai") {
                speakAI(e.detail.text);
            }
        }

        window.addEventListener("transcriptAdd", handleAdd);
        return () => window.removeEventListener("transcriptAdd", handleAdd);
    }, []);

    /* ------------------------------------------------------
       SPEAKING STATES
    -------------------------------------------------------*/
    useEffect(() => {
        const aiHandler = e => setAiSpeaking(!!e.detail);
        const userHandler = e => setUserSpeaking(!!e.detail);

        window.addEventListener("aiSpeaking", aiHandler);
        window.addEventListener("candidateSpeaking", userHandler);

        return () => {
            window.removeEventListener("aiSpeaking", aiHandler);
            window.removeEventListener("candidateSpeaking", userHandler);
        };
    }, []);

    return (
        <div className="tp-wrapper">
            <h4 className="tp-title">Transcript</h4>

            {(jdId || jdText) && (
                <div className="tp-jd-banner">
                    {jdId && <span>JD ID: {jdId}</span>}
                    {jdText && <span>{jdText.slice(0, 120)}…</span>}
                </div>
            )}

            {aiSpeaking && (
                <div className="tp-ai-speaking">🤖 AI speaking…</div>
            )}

            {userSpeaking && (
                <div className="tp-user-speaking">🎤 You are speaking…</div>
            )}

            <div className="tp-scroll" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="tp-empty">
                        Waiting for first question…
                    </div>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`tp-msg ${m.role}`}>
                        <div className="tp-role">
                            {m.role === "ai" ? "🤖 AI" : "🧑 You"}
                        </div>
                        <div className="tp-text">{m.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
