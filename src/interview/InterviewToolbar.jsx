import React, { useState, useRef } from "react";
import "./InterviewToolbar.css";
import { API_BASE } from "@/utils/constants";
import { Mic, Square } from "lucide-react"; // icons

export default function InterviewToolbar({
    candidateId,
    candidateName,
    jdText
}) {
    const [recording, setRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    /* ---------------------------------------------------
       START AUDIO RECORDING
    --------------------------------------------------- */
    async function startAudio() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: "audio/webm",
        });

        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
            audioChunksRef.current.push(e.data);
        };

        mediaRecorderRef.current.onstop = sendAudioToBackend;

        mediaRecorderRef.current.start();
        setRecording(true);
    }

    /* ---------------------------------------------------
       STOP RECORDING
    --------------------------------------------------- */
    function stopAudio() {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setRecording(false);
    }

    /* ---------------------------------------------------
       SEND AUDIO → /process-answer
    --------------------------------------------------- */
    /* ---------------------------------------------------
   SEND AUDIO → /process-answer
--------------------------------------------------- */
    async function sendAudioToBackend() {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        const fd = new FormData();
        fd.append("audio", blob);
        fd.append("candidate_id", candidateId);
        fd.append("candidate_name", candidateName);
        fd.append("job_description", jdText);

        const res = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
            method: "POST",
            body: fd,
        });

        const data = await res.json();

        // 1️⃣ User transcript update
        if (data.transcribed_text) {
            window.dispatchEvent(
                new CustomEvent("transcriptAdd", {
                    detail: {
                        role: "user",
                        text: data.transcribed_text,
                        analysis: data.analysis
                    },
                })
            );
        }

        // 2️⃣ UPDATE AI CHART PANEL — FIXED
        if (data.analysis) {
            window.dispatchEvent(
                new CustomEvent("aiMetricsUpdate", {
                    detail: data.analysis,   // ⬅ ALWAYS contains confidence + superficial
                })
            );
        }

        // 3️⃣ Append next AI question
        if (data.next_question) {
            window.dispatchEvent(
                new CustomEvent("transcriptAdd", {
                    detail: { role: "ai", text: data.next_question }
                })
            );
        }

        // 4️⃣ Completed
        if (data.completed) {
            window.dispatchEvent(
                new CustomEvent("transcriptAdd", {
                    detail: {
                        role: "ai",
                        text: data.final_message || "Interview complete.",
                    },
                })
            );
        }
    }


    return (
        <div className="interview-toolbar">

            {/* Recording pulse animation */}
            {/* Recording Waveform Animation */}
            {recording && (
                <div className="recording-wave">
                    <div /><div /><div /><div /><div /><div /><div /><div />
                    <span className="recording-label">Listening…</span>
                </div>
            )}


            {!recording ? (
                <button className="start-speaking-btn" onClick={startAudio}>
                    <Mic size={18} />
                    Start Speaking
                </button>
            ) : (
                <button className="stop-speaking-btn" onClick={stopAudio}>
                    <Square size={18} />
                    Stop
                </button>
            )}
        </div>
    );
}
