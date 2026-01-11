// src/components/TranscriptPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { API_BASE } from "@/utils/constants";
import "./TranscriptPanel.css";
import { Button } from "@/components/ui/button";

export default function TranscriptPanel({
  candidateName = "Anonymous",
  candidateId = null,
  jobDescription = "",
  firstQuestion = null
}) {
  const [transcript, setTranscript] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const transcriptEndRef = useRef(null);

  // Scroll to bottom when new message
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);


  // ============ ANOMALY LISTENER ============
  useEffect(() => {
    const listener = (e) => {
      setTranscript((t) => [
        ...t,
        { sender: "system", text: `⚠ Anomaly detected: ${e.detail}` },
      ]);
    };

    window.addEventListener("anomalyEvent", listener);
    return () => window.removeEventListener("anomalyEvent", listener);
  }, []);


  const speak = (text) => {
    if (!text) return;
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  // ================= FIRST QUESTION LOAD =================
  useEffect(() => {
    if (firstQuestion) {
      setTranscript((t) => [...t, { sender: "ai", text: firstQuestion }]);
      speak(firstQuestion);
    }
  }, [firstQuestion]);


  async function generateQuestion() {
    if (!jobDescription.trim()) {
      alert("Paste job description first.");
      return;
    }

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName);
    fd.append("job_description", jobDescription);

    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
        method: "POST", body: fd
      });

      const d = await r.json();
      if (d.ok && d.next_question) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        speak(d.next_question);
      }
    } catch (err) {
      alert("Failed to fetch question.");
    }
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];

      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        await sendAnswer(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      rec.start();
      setRecorder(rec);
      setRecording(true);
    } catch {
      alert("Microphone permission denied.");
    }
  }

  function stopAndSend() {
    if (recorder) recorder.stop();
    setRecording(false);
  }

  async function sendAnswer(blob) {
    const fd = new FormData();
    fd.append("audio", blob);
    fd.append("candidate_name", candidateName);
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, {
        method: "POST", body: fd
      });

      const d = await r.json();

      if (d.ok && d.transcribed_text) {
        setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
      }

      if (d.next_question && !d.completed) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        speak(d.next_question);
      }

      if (d.completed) {
        setTranscript((t) => [
          ...t,
          { sender: "ai", text: d.final_message || "Interview complete." },
        ]);
        setInterviewCompleted(true);
      }
    } catch {
      alert("Failed to send answer.");
    }
  }

  return (
    <div className="transcript-panel">
      <h3>Transcript</h3>

      <div className="transcript-actions">
        <Button onClick={generateQuestion} disabled={recording || interviewCompleted}>
          Start / Next Question
        </Button>

        {!recording ? (
          <Button onClick={startRecording} disabled={interviewCompleted}>Record</Button>
        ) : (
          <Button onClick={stopAndSend} className="recording">Stop & Send</Button>
        )}
      </div>

      <div className="transcript-messages">
        {transcript.length === 0 ? (
          <div className="transcript-empty">No conversation yet.</div>
        ) : (
          transcript.map((m, i) => (
            <div
              key={i}
              className={`transcript-message-row ${m.sender === "ai" ? "ai-row" :
                m.sender === "system" ? "system-row" : "user-row"
                }`}
            >
              <div className="transcript-message">
                <div className="message-header">
                  {m.sender === "ai" ? "AI" : m.sender === "system" ? "System" : "You"}
                </div>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={transcriptEndRef}></div>
      </div>
    </div>
  );
}
