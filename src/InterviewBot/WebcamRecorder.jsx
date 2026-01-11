// src/components/WebcamRecorder.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import TranscriptPanel from "./TranscriptPanelInterview";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import logo from "../assets/primehire_logo.png";
import "./WebcamRecorder.css";

export default function WebcamRecorder() {
  const location = useLocation();
  const navigate = useNavigate();

  const candidateName = location.state?.candidateName || "Anonymous";
  const initialId = location.state?.candidateId || null;

  const jd_text = location.state?.jd_text || "";
  const jd_id = location.state?.jd_id || "";

  const [candidateId, setCandidateId] = useState(initialId);
  const [started, setStarted] = useState(false);
  const [jobDescription, setJobDescription] = useState(jd_text);
  const [firstQuestion, setFirstQuestion] = useState(null);

  const [tabWarning, setTabWarning] = useState(false);
  const [faceWarning, setFaceWarning] = useState(false);

  const videoRef = useRef();

  useEffect(() => {
    console.log("[WebcamRecorder] Loaded:", {
      candidateName,
      candidateId,
      jd_id,
      jd_text
    });
  }, []);

  // =======================================================
  // ⭐ FIX 1 — TAB SWITCH PREVENT BEFORE candidateId EXISTS
  // =======================================================
  useEffect(() => {
    const handleTabChange = async () => {
      if (!candidateId) {
        console.warn("⚠ Tab event ignored — candidateId not ready yet");
        return;
      }

      if (document.hidden) {
        setTabWarning(true);

        // show non-blocking warning instead of alert()
        window.dispatchEvent(
          new CustomEvent("anomalyEvent", {
            detail: "⚠ Tab switch detected — please do not leave the interview."
          })
        );

        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", candidateId);
        fd.append("event_type", "tab_switch");

        await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
          method: "POST",
          body: fd
        });
      } else {
        setTabWarning(false);
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    return () =>
      document.removeEventListener("visibilitychange", handleTabChange);
  }, [candidateId]);



  // =======================================================
  // CAMERA STREAM
  // =======================================================
  async function startCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false
    });
    videoRef.current.srcObject = stream;
    await videoRef.current.play();
  }


  // =======================================================
  // ⭐ FIX 2 — START FACE MONITOR ONLY AFTER candidateId is ready
  // =======================================================
  useEffect(() => {
    if (!started) return;
    if (!candidateId) {
      console.warn("⏳ Waiting for candidateId before face monitor begins…");
      return;
    }

    startCamera();

    const interval = setInterval(() => {
      if (!videoRef.current) return;

      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!candidateId) return; // ⭐ safety check
        const fd = new FormData();
        fd.append("candidate_name", candidateName);
        fd.append("candidate_id", candidateId); // ⭐ FIX
        fd.append("frame", blob);

        const r = await fetch(`${API_BASE}/mcp/interview/face-monitor`, {
          method: "POST",
          body: fd
        });

        const data = await r.json();
        if (data?.anomalies?.length > 0) {
          setFaceWarning(true);
          data.anomalies.forEach((a) =>
            window.dispatchEvent(
              new CustomEvent("anomalyEvent", { detail: a.msg })
            )
          );
        } else {
          setFaceWarning(false);
        }
      }, "image/jpeg");
    }, 3000);

    return () => clearInterval(interval);
  }, [started, candidateId]); // ⭐ FIXED DEPENDENCIES


  // =======================================================
  // INTERVIEW START
  // =======================================================
  const handleStartInterview = async () => {
    setStarted(true);

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName);
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const res = await fetch(
        `${API_BASE}/mcp/interview_bot_beta/process-answer`,
        { method: "POST", body: fd }
      );
      const d = await res.json();

      if (d.ok) {
        if (d.candidate_id) {
          console.log("⭐ Backend assigned candidateId:", d.candidate_id);
          setCandidateId(d.candidate_id); // ⭐ NOW candidateId becomes valid
        }
        if (d.next_question) setFirstQuestion(d.next_question);
      }
    } catch (e) {
      console.error("Start interview failed:", e);
    }
  };

  // =======================================================
  // STOP INTERVIEW
  // =======================================================
  const handleStopInterview = async () => {
    setStarted(false);

    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("candidate_id", candidateId);
    fd.append("job_description", jobDescription);

    try {
      const res = await fetch(
        `${API_BASE}/mcp/interview_bot_beta/evaluate-transcript`,
        { method: "POST", body: fd }
      );
      const d = await res.json();

      if (d.ok) {
        navigate("/certificatedata", {
          state: {
            scores: d.scores,
            candidateName: d.candidateName,
            candidateId: d.candidateId,
            overall: d.overall,
            result: d.result,
            feedback: d.feedback,
            designation: d.designation
          }
        });
      } else {
        alert("Evaluation failed: " + d.error);
      }
    } catch (e) {
      alert("Stop interview error: " + e.message);
    }
  };

  // =======================================================
  // RENDER
  // =======================================================
  return (
    <div className="webcam-interview-wrapper">
      <div className="webcam-navbar">
        <img src={logo} alt="Company Logo" className="navbar-logo" />
      </div>

      <div className="webcam-interview-container">
        <div className="webcam-left-panel">
          <h3>Candidate: {candidateName}</h3>

          <textarea
            placeholder="Job Description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />

          <div className="video-container">
            <video ref={videoRef} autoPlay muted />
            {tabWarning && <div className="warning-banner">⚠ Tab switching detected</div>}
            {faceWarning && <div className="warning-banner">⚠ Face not clearly visible</div>}
          </div>

          {!started ? (
            <Button onClick={handleStartInterview}>Start Interview</Button>
          ) : (
            <Button variant="destructive" onClick={handleStopInterview}>
              Stop & Evaluate
            </Button>
          )}

          <div className="debug-info">
            Debug → name: {candidateName} | id: {candidateId} <br />
            JD Loaded: {jobDescription?.slice(0, 50)}...
          </div>
        </div>

        <div className="webcam-right-panel">
          <TranscriptPanelInterview
            candidateName={candidateName}
            candidateId={candidateId}
            jobDescription={jobDescription}
            firstQuestion={firstQuestion}
          />
        </div>
      </div>
    </div>
  );
}
