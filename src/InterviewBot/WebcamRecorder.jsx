
// src/components/WebcamRecorder.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "../InterviewBot/TranscriptPanel";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./WebcamRecorder.css";

export default function WebcamRecorder() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✨ Candidate details from InstructionsPrompt
  const candidateName = location.state?.candidateName || "Anonymous";
  const initialId = location.state?.candidateId || null;

  // ✨ JD auto-fetched earlier in Validation → Instructions
  const jd_text = location.state?.jd_text || "";
  const jd_id = location.state?.jd_id || "";

  const [candidateId, setCandidateId] = useState(initialId);
  const [started, setStarted] = useState(false);

  // ✨ Auto-fill JD here (NO manual paste)
  const [jobDescription, setJobDescription] = useState(jd_text);

  const [firstQuestion, setFirstQuestion] = useState(null);

  const videoRef = useRef();
  const frameCanvas = useRef();

  useEffect(() => {
    console.log("[WebcamRecorder] Received JD:", jd_text);
  }, [jd_text]);

  // Start camera when interview starts
  useEffect(() => {
    if (!started) return;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        frameCanvas.current = document.createElement("canvas");
      } catch (e) {
        console.error("Camera error:", e);
        alert("Camera unavailable");
      }
    })();
  }, [started]);

  // ✨ FIX — REMOVE JD CHECK
  const handleStartInterview = async () => {
    setStarted(true);

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName);

    // JD auto-filled — ALWAYS included
    fd.append("job_description", jobDescription);

    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const res = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
        method: "POST",
        body: fd,
      });
      const d = await res.json();
      console.log("[init response]", d);

      if (d.ok) {
        if (d.candidate_id) setCandidateId(d.candidate_id);
        if (d.next_question) setFirstQuestion(d.next_question);
      }
    } catch (e) {
      console.error("Start interview failed:", e);
    }
  };

  const handleStopInterview = async () => {
    setStarted(false);

    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("candidate_id", candidateId);

    // JD auto-fills again
    fd.append("job_description", jobDescription);

    try {
      const res = await fetch(`${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`, {
        method: "POST",
        body: fd,
      });

      const d = await res.json();
      console.log("[evaluation response]", d);

      if (d.ok) {
        navigate("/certificatedata", {
          state: {
            scores: d.scores,
            candidateName: d.candidateName,
            candidateId: d.candidateId,
            overall: d.overall,
            result: d.result,
            feedback: d.feedback,
            designation: d.designation,
          },
        });
      } else {
        alert("Evaluation failed: " + d.error);
      }
    } catch (e) {
      alert("Stop interview error: " + e.message);
    }
  };

  return (
    <div className="webcam-interview-container">
      <div className="webcam-left-panel">
        <h3>Candidate: {candidateName}</h3>

        {/* ✨ JD AUTO-FILLED — NO NEED TO PASTE */}
        <textarea
          placeholder="Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        <video ref={videoRef} autoPlay muted />

        {!started ? (
          <Button onClick={handleStartInterview}>Start Interview</Button>
        ) : (
          <Button variant="destructive" onClick={handleStopInterview}>
            Stop & Evaluate
          </Button>
        )}

        <div className="debug-info">
          Debug → name: {candidateName} | id: {candidateId || "null"} <br />
          JD Loaded: {jobDescription?.slice(0, 50)}...
        </div>
      </div>

      <div className="webcam-right-panel">
        <TranscriptPanel
          candidateName={candidateName}
          candidateId={candidateId}
          jobDescription={jobDescription}
          firstQuestion={firstQuestion}
        />
      </div>
    </div>
  );
}
