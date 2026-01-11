
// FILE: src/interview/WebcamRecorder.jsx
import React, { useEffect, useRef, useState } from "react";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

/* ================= CONFIG ================= */
// const FACE_INTERVAL_MS = 5000;   // every 5s
// const FACE_START_DELAY = 3000;   // start after 3s
const FACE_INTERVAL_MS = 150;   // ~6.6 FPS
const FACE_START_DELAY = 500;   // start quickly

/* ================= LIVE INSIGHTS DISPATCH ================= */
function dispatchInsights(data) {
    if (!data || !data.ok) return;

    window.dispatchEvent(
        new CustomEvent("liveInsightsUpdate", {
            detail: {
                anomalies: Array.isArray(data.anomalies) ? data.anomalies : [],
                counts: data.anomaly_counts || {},
            },
        })
    );
}

export default function WebcamRecorder({
    attemptId,
    candidateName,
    candidateId,
    faceMonitorEnabled = false,
}) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const timerRef = useRef(null);
    const lastSendRef = useRef(0);
    const mountedRef = useRef(false);
    const tabReportedRef = useRef(false);

    const [recording, setRecording] = useState(false);

    /* =====================================================
       TAB SWITCH → BACKEND EVENT (ONCE PER ATTEMPT)
    ===================================================== */
    /* =====================================================
   TAB SWITCH → BACKEND EVENT (EVERY TIME)
===================================================== */
    useEffect(() => {
        if (!attemptId) return;

        const onVisibilityChange = async () => {
            if (!document.hidden) return;

            try {
                const fd = new FormData();
                fd.append("attempt_id", attemptId);
                // fd.append("candidate_id", candidateId);
                // fd.append("candidate_name", candidateName);
                fd.append("event_type", "tab_switch");
                fd.append("event_msg", "Tab switch detected");

                const res = await fetch(
                    `${API_BASE}/mcp/interview/face-monitor`,
                    {
                        method: "POST",
                        body: fd,
                        keepalive: true,
                        cache: "no-store",
                    }
                );

                if (!res.ok) return;

                const data = await res.json();
                dispatchInsights(data);

            } catch (err) {
                console.warn("Tab switch report failed", err);
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);
        return () =>
            document.removeEventListener("visibilitychange", onVisibilityChange);
    }, [attemptId, candidateId, candidateName]);



    /* =====================================================
       CAMERA INIT + CLEANUP (SAFE)
    ===================================================== */
    useEffect(() => {
        mountedRef.current = true;

        (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });

                if (!mountedRef.current) {
                    stream.getTracks().forEach((t) => t.stop());
                    return;
                }

                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            } catch (e) {
                console.error("❌ Camera init failed:", e);
            }
        })();

        return () => {
            mountedRef.current = false;
            stopFaceLoop();
            streamRef.current?.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (faceMonitorEnabled && attemptId) {
            setRecording(true);
        }
    }, [faceMonitorEnabled, attemptId]);

    /* =====================================================
       FACE MONITOR LOOP CONTROL
    ===================================================== */
    useEffect(() => {
        if (!faceMonitorEnabled || !recording || !attemptId) {
            stopFaceLoop();
            return;
        }

        console.log("🎥 Face monitor starting in 3s");
        scheduleNext(FACE_START_DELAY);

        return stopFaceLoop;
    }, [faceMonitorEnabled, recording, attemptId]);

    function scheduleNext(delay = FACE_INTERVAL_MS) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(sendFrame, delay);
    }

    function stopFaceLoop() {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        console.log("🛑 Face monitor STOP");
    }

    /* =====================================================
       SEND FRAME → BACKEND (NEVER BREAKS LOOP)
    ===================================================== */
    async function sendFrame() {
        try {
            if (!mountedRef.current || !recording || !attemptId) {
                scheduleNext();
                return;
            }

            if (document.hidden || !videoRef.current) {
                scheduleNext();
                return;
            }

            // const now = Date.now();
            // if (now - lastSendRef.current < FACE_INTERVAL_MS) {
            //     scheduleNext();
            //     return;
            // }
            // lastSendRef.current = now;

            const video = videoRef.current;
            if (!video.videoWidth || !video.videoHeight) {
                scheduleNext();
                return;
            }

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);

            const blob = await new Promise((r) =>
                canvas.toBlob(r, "image/jpeg", 0.6)
            );
            console.log("📤 Sending frame", blob.size);

            if (!blob) {
                scheduleNext();
                return;
            }

            const fd = new FormData();
            fd.append("attempt_id", attemptId);
            // fd.append("candidate_id", candidateId);
            // fd.append("candidate_name", candidateName);
            fd.append("frame", blob);
            console.log("📤 Frame FormData", fd.get("frame"));

            const res = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
                method: "POST",
                body: fd,
                cache: "no-store",
            });

            if (res.ok) {
                const data = await res.json();
                dispatchInsights(data);
            } else {
                console.warn("⚠ Face monitor HTTP error:", res.status);
            }
        } catch (e) {
            console.error("❌ Face monitor error:", e);
        } finally {
            scheduleNext(); // 🔒 CRITICAL: never let loop die
        }
    }

    /* =====================================================
       UI CONTROLS
    ===================================================== */
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

    /* =====================================================
       RENDER
    ===================================================== */
    return (
        <div className="webcam-glass-shell">
            <video
                ref={videoRef}
                className="webcam-video"
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
