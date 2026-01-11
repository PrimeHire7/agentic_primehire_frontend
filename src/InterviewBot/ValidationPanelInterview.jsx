import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import "./ValidationPanel.css";

export default function ValidationPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const [candidateName, setCandidateName] = useState("");
  const [candidateId, setCandidateId] = useState(null);

  const [jdId, setJdId] = useState(null);
  const [jdText, setJdText] = useState("");

  const [isSaved, setIsSaved] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load params
  useEffect(() => {
    const nameFromURL = params.get("candidateName");
    const idFromURL = params.get("candidateId");
    const jdFromURL = params.get("jd_id");

    if (nameFromURL) setCandidateName(nameFromURL);
    if (idFromURL) setCandidateId(idFromURL);
    if (jdFromURL) setJdId(jdFromURL);

    if (jdFromURL) fetchJDText(jdFromURL);
  }, []);

  // Fetch JD text
  const fetchJDText = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
      const data = await res.json();
      setJdText(data?.jd_text || "Job description unavailable");
    } catch {
      setJdText("Job description unavailable");
    }
  };

  // Start webcam
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      alert("Camera access denied or unavailable.");
    }
  };

  // Capture face
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
  };

  // Save face
  const saveFaceToBackend = async () => {
    if (!capturedImage) return alert("Capture first");
    if (!candidateName.trim()) return alert("Enter candidate name");

    const blob = await (await fetch(capturedImage)).blob();
    const fd = new FormData();
    fd.append("candidate_name", candidateName);
    fd.append("candidate_id", candidateId);
    fd.append("face_image", blob, "face.png");

    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
        { method: "POST", body: fd }
      );

      const d = res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : { ok: res.ok };

      if (!res.ok && !d.ok) throw new Error("Failed to save");

      setIsSaved(true);
    } catch (err) {
      alert("Failed to save face image: " + err.message);
    }
  };

  const handleValidate = async () => {
    if (!candidateName.trim()) return alert("Enter name");
    await startCamera();
  };

  const handleGoInstructions = () => {
    if (!isSaved) return alert("Save face before continuing.");

    navigate("/instructions", {
      state: {
        candidateName,
        candidateId,
        jd_id: jdId,
        jd_text: jdText,
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

      <Button onClick={handleValidate}>Start Camera</Button>

      <div className="validation-camera-section">
        <div className="validation-video-box">
          <video ref={videoRef} autoPlay muted />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        <div className="validation-actions">
          <Button onClick={captureFace}>📸 Capture</Button>
          <Button onClick={saveFaceToBackend}>💾 Save</Button>

          <Button
            variant="outline"
            onClick={handleGoInstructions}
            disabled={!isSaved}
          >
            🎯 Go to Instructions
          </Button>

          <div
            className={`validation-status-text ${isSaved ? "ok" : "wait"
              }`}
          >
            {isSaved
              ? "✅ Face saved — ready to continue"
              : "Save face to continue"}
          </div>
        </div>
      </div>

      <div>
        <strong>Loaded JD:</strong>
        <div className="jd-preview-box">
          {jdText?.slice(0, 300)}...
        </div>
      </div>

      <div className="validation-debug">
        <strong>Debug:</strong>
        <br /> Name: {candidateName}
        <br /> ID: {candidateId}
        <br /> JD ID: {jdId}
      </div>
    </div>
  );
}
