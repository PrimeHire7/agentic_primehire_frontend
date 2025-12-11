// FILE: src/interview/WebcamRecorder.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder({
    candidateName,
    candidateId,
    jdText,
    onCandidateId,
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const faceLoopRef = useRef(null);

    const [recording, setRecording] = useState(false);

    // IMPORTANT: Mirror candidateId (because props DO NOT update inside interval)
    const [localCandidateId, setLocalCandidateId] = useState(candidateId);

    const [tabWarning, setTabWarning] = useState(false);

    useEffect(() => {
        if (candidateId) {
            setLocalCandidateId(candidateId);
        }
    }, [candidateId]);

    // ----------------------------------------------
    // TAB SWITCH DETECTION (same behavior as old system)
    // ----------------------------------------------
    useEffect(() => {
        function handleTab() {
            if (!localCandidateId) return;

            if (document.hidden) {
                setTabWarning(true);

                // Add transcript alert
                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: { role: "system", text: "⚠ Tab switch detected — stay in the interview window." }
                    })
                );

                // Send anomaly to backend
                const fd = new FormData();
                fd.append("candidate_name", candidateName);
                fd.append("candidate_id", localCandidateId);
                fd.append("event_type", "tab_switch");
                fd.append("event_msg", "Tab switch detected");

                fetch(`${API_BASE}/mcp/interview/face-monitor`, {
                    method: "POST",
                    body: fd
                });
            } else {
                setTabWarning(false);
            }
        }

        document.addEventListener("visibilitychange", handleTab);
        return () => document.removeEventListener("visibilitychange", handleTab);
    }, [localCandidateId]);

    /** ---------------------------
        INIT CAMERA
    ---------------------------- **/
    useEffect(() => {
        async function init() {
            streamRef.current = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            videoRef.current.srcObject = streamRef.current;
            await videoRef.current.play();
        }

        init();

        return () =>
            streamRef.current?.getTracks().forEach((t) => t.stop());
    }, []);
    /** ---------------------------
        START FACE MONITOR LOOP
    ---------------------------- **/
    function startFaceLoop() {
        clearInterval(faceLoopRef.current);

        faceLoopRef.current = setInterval(() => {
            if (videoRef.current?.videoWidth > 0) {
                sendFaceFrame();
            } else {
                console.log("⏳ Waiting for video to stabilize...");
            }
        }, 300);
    }

    /** ---------------------------
        START INTERVIEW
    ---------------------------- **/
    async function startInterview() {
        setRecording(true);
        // 🔵 START THE TIMER
        window.dispatchEvent(new Event("startInterviewTimer"));
        const fd = new FormData();
        fd.append("init", "true");
        fd.append("candidate_name", candidateName);
        fd.append("job_description", jdText);

        if (localCandidateId) fd.append("candidate_id", localCandidateId);

        const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
            method: "POST",
            body: fd,
        });

        const d = await r.json();

        if (d.candidate_id) {
            setLocalCandidateId(d.candidate_id);
            onCandidateId(d.candidate_id);
        }

        if (d.next_question) {
            window.dispatchEvent(
                new CustomEvent("transcriptAdd", {
                    detail: { role: "ai", text: d.next_question },
                })
            );
        }

        startFaceLoop();
    }

    /** ---------------------------
        STOP INTERVIEW
    ---------------------------- **/
    function stopInterview() {
        setRecording(false);
        clearInterval(faceLoopRef.current);
        // 🔴 STOP THE TIMER
        window.dispatchEvent(new Event("stopInterviewTimer"));

        window.dispatchEvent(new Event("stopInterview"));
    }



    /** ---------------------------
        SEND FRAME → FACE MONITOR
    ---------------------------- **/
    async function sendFaceFrame() {
        if (!videoRef.current || !localCandidateId) {
            console.log("❌ sendFaceFrame: videoRef or candidateId missing");
            return;
        }

        const video = videoRef.current;

        // 🔥 Debug: log video size each frame
        console.log(`🎥 Video frame size: ${video.videoWidth} x ${video.videoHeight}`);

        // Prevent sending if video isn't ready
        if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.log("⏳ Video not ready yet — skipping frame");
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        // 🔥 Debug: check if canvas rendered correctly
        console.log("🖼 Canvas frame rendered");

        // Convert to Blob
        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.85)
        );

        if (!blob) {
            console.log("❌ Blob conversion failed");
            return;
        }

        console.log(`📤 Sending frame → size: ${blob.size} bytes`);

        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", localCandidateId);
        fd.append("frame", blob);

        const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
            method: "POST",
            body: fd,
        });

        const data = await r.json();

        console.log("📥 Backend response:", data);

        window.dispatchEvent(
            new CustomEvent("liveInsightsUpdate", {
                detail: {
                    anomalies: data.anomalies,
                    boxes: data.boxes,
                    frame: data.frame_base64,
                    faces: data.faces,
                    counts: data.anomaly_counts || {},
                }
            })
        );

        if (data.anomalies?.length) {
            data.anomalies.forEach((a) => {
                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: { role: "system", text: `⚠ ${a.msg}` },
                    })
                );
            });
        }
    }


    return (
        <div className="webcam-glass-shell">

            <video ref={videoRef} className="webcam-video" autoPlay muted playsInline />

            {/* TAB SWITCH WARNING BANNER */}
            {tabWarning && (
                <div className="warning-banner">⚠ Tab switching detected</div>
            )}

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
