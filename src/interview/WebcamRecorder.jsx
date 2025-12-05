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

    useEffect(() => {
        if (candidateId) {
            setLocalCandidateId(candidateId);
        }
    }, [candidateId]);

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
        START INTERVIEW
    ---------------------------- **/
    async function startInterview() {
        setRecording(true);

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
        window.dispatchEvent(new Event("stopInterview"));
    }

    /** ---------------------------
        START FACE MONITOR LOOP
    ---------------------------- **/
    function startFaceLoop() {
        clearInterval(faceLoopRef.current);

        faceLoopRef.current = setInterval(() => {
            sendFaceFrame();
        }, 1000); // Fixed to 1 second
    }

    /** ---------------------------
        SEND FRAME → FACE MONITOR
    ---------------------------- **/
    async function sendFaceFrame() {
        if (!videoRef.current || !localCandidateId) return;

        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoRef.current, 0, 0);

        const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", 0.85)
        );

        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", localCandidateId);
        fd.append("frame", blob);

        const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
            method: "POST",
            body: fd,
        });

        const data = await r.json();

        // Update LiveInsightsPanel
        window.dispatchEvent(
            new CustomEvent("liveInsightsUpdate", {
                detail: {
                    anomalies: data.anomalies,
                    boxes: data.boxes,
                    frame: data.frame_base64,
                    faces: data.faces,
                    // Pass anomaly counts if backend includes it
                    counts: data.anomaly_counts || {},
                }
            })
        );


        // Add anomalies to transcript
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
