
// src/components/ValidationPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import "./ValidationPanel.css";

export default function ValidationPanel() {
  const [candidateName, setCandidateName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [candidateId, setCandidateId] = useState(() => uuidv4());
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // nothing auto-started; camera starts after name validated
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera start failed:", err);
      alert("Camera access denied or unavailable.");
    }
  };

  const captureFace = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return alert("Camera not ready");
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 320;
    canvas.height = video.videoHeight || 240;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    setIsSaved(false);
    alert("Face captured. Click Save to store in backend.");
  };

  const saveFaceToBackend = async () => {
    if (!capturedImage) return alert("Capture first");
    if (!candidateName.trim()) return alert("Enter candidate name");

    // ensure candidateId exists
    const sessionId = candidateId || uuidv4();
    setCandidateId(sessionId);

    const blob = await (await fetch(capturedImage)).blob();
    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("candidate_id", sessionId);
    fd.append("face_image", blob, "face.png");

    try {
      console.log("[ValidationPanel] saving face for", candidateName, sessionId);
      const res = await fetch(`${API_BASE}/mcp/tools/candidate_validation/save_face_image`, {
        method: "POST",
        body: fd,
      });
      // backend may return plain success or json, handle both
      const d = res.headers.get("content-type")?.includes("application/json") ? await res.json() : { ok: res.ok };
      console.log("[ValidationPanel] save face response:", d);
      if (!res.ok && !(d && d.ok)) throw new Error(d?.message || "Failed to save");
      setIsSaved(true);
      alert("✅ Face saved.");
    } catch (err) {
      console.error("Save face error:", err);
      alert("Failed to save face image: " + (err.message || err));
    }
  };

  const handleValidate = async () => {
    if (!candidateName.trim()) return alert("Enter name");
    await startCamera();
    alert("Name accepted. Capture and save face, then continue.");
  };

  const handleGoInstructions = () => {
    if (!isSaved) return alert("Save face before continuing.");
    console.log("➡️ Navigating to /instructions with:", { candidateName, candidateId });
    navigate("/instructions", {
      state: {
        candidateName,
        candidateId,
      },
    });
  };

  return (
    <div className="validation-container">
      <h2>Validate Candidate</h2>
      <input
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
      />
      <div style={{ marginTop: 8 }}>
        <Button onClick={handleValidate}>Validate (start camera)</Button>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <div>
          <video ref={videoRef} autoPlay muted width="320" height="240" />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Button onClick={captureFace}>📸 Capture</Button>
          <Button onClick={saveFaceToBackend}>💾 Save</Button>
          <Button variant="outline" onClick={handleGoInstructions} disabled={!isSaved}>
            🎯 Go to Instructions
          </Button>
          {isSaved ? (
            <div style={{ color: "green" }}>✅ Face saved — ready to continue</div>
          ) : (
            <div style={{ color: "#888" }}>Save face to continue</div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 12, opacity: 0.8 }}>
        <strong>Debug:</strong> name: {candidateName || "—"} | id: {candidateId}
      </div>
    </div>
  );
}