
// src/components/TranscriptPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";

export default function TranscriptPanel({ candidateName = "Anonymous", candidateId = null, jobDescription = "" }) {
  const [transcript, setTranscript] = useState([]);
  const [recording, setRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const transcriptEndRef = useRef(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  const speak = (text) => {
    if (!text) return;
    setTranscript((t) => [...t, { sender: "ai", text }]);
    const u = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  };

  async function generateQuestion() {
    if (!jobDescription.trim()) {
      alert("Job description missing!");
      return;
    }

    const fd = new FormData();
    fd.append("init", "true");
    fd.append("candidate_name", candidateName || "Anonymous");
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    console.log("[TranscriptPanel] generateQuestion payload:", { candidateName, candidateId });
    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
      const d = await r.json();
      console.log("[TranscriptPanel] generateQuestion response:", d);
      if (d.ok && d.next_question) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        if (d.candidate_id) {
          console.log("[TranscriptPanel] backend returned candidate_id:", d.candidate_id);
        }
        speak(d.next_question);
      } else {
        alert("No question returned.");
      }
    } catch (err) {
      console.error("generateQuestion error:", err);
      alert("Failed to get next question.");
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
    } catch (err) {
      console.error("Mic error:", err);
      alert("Please allow mic.");
    }
  }

  function stopAndSend() {
    if (recorder) {
      recorder.stop();
      setRecording(false);
    }
  }

  async function sendAnswer(blob) {
    const fd = new FormData();
    fd.append("audio", blob);
    fd.append("candidate_name", candidateName || "Anonymous");
    fd.append("job_description", jobDescription);
    if (candidateId) fd.append("candidate_id", candidateId);

    console.log("[TranscriptPanel] sendAnswer, candidate:", { candidateName, candidateId });
    try {
      const r = await fetch(`${API_BASE}/mcp/interview_bot_beta/process-answer`, { method: "POST", body: fd });
      const d = await r.json();
      console.log("[TranscriptPanel] sendAnswer response:", d);

      if (d.ok && d.transcribed_text) {
        setTranscript((t) => [...t, { sender: "user", text: d.transcribed_text }]);
      }
      if (d.next_question && !d.completed) {
        setTranscript((t) => [...t, { sender: "ai", text: d.next_question }]);
        speak(d.next_question);
      }
      if (d.completed) {
        setTranscript((t) => [...t, { sender: "ai", text: d.final_message || "Interview complete." }]);
        setInterviewCompleted(true);
      }
    } catch (err) {
      console.error("sendAnswer error:", err);
      alert("Failed to send audio.");
    }
  }

  return (
    <div className="transcript-panel" style={{ padding: 8 }}>
      <h3>Transcript</h3>
      <div style={{ display: "flex", gap: 8 }}>
        <Button onClick={generateQuestion} disabled={recording || interviewCompleted}>Start / Next Question</Button>
        {!recording ? (
          <Button onClick={startRecording} disabled={interviewCompleted}>Record</Button>
        ) : (
          <Button onClick={stopAndSend}>Stop & Send</Button>
        )}
      </div>

      <div style={{ marginTop: 12, maxHeight: 420, overflow: "auto", padding: 8, border: "1px solid #eee" }}>
        {transcript.length === 0 ? <div>No conversation yet.</div> : transcript.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{m.sender === "ai" ? "AI" : "You"}:</strong> {m.text}
          </div>
        ))}
        <div ref={transcriptEndRef} />
      </div>
    </div>
  );
}
//