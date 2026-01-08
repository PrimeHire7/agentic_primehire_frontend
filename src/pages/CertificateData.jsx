
// FILE: src/pages/CertificateData.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Download, Lock } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./CertificateData.css";
import logo from "../assets/primehire_logo.png";
import { API_BASE } from "@/utils/constants";

export default function CertificateData() {
  const location = useLocation();
  const state = location.state || {};

  /* ================= SAFE EXTRACTION ================= */
  const ok = state.ok !== false;

  const attemptId = state.attemptId || null;
  const candidateName = state.candidateName || "Anonymous";
  const candidateId = state.candidateId || "";
  const designation = state.designation || "";
  const overall = state.overall ?? 0;
  const result = state.result || "FAIL";
  const feedback = state.feedback || "No feedback available.";

  const scores = Array.isArray(state.scores) ? state.scores : [];
  const perQuestion = Array.isArray(state.per_question)
    ? state.per_question
    : [];

  // const anomalyCounts = state.anomalyCounts || {};
  const anomalyCounts =
    state.anomaly_counts ||
    state.anomalyCounts ||
    {};
  const ANOMALY_LABELS = {
    tab_switch: "Tab Switch",
    multiple_faces: "Multiple Faces",
    no_face: "No Face Detected",
    phone_detected: "Phone Usage",
    looking_away: "Looking Away",
    background_noise: "Background Noise",
    copy_paste: "Copy / Paste",
  };

  const mcq = state.mcq || null;
  const coding = state.coding || null;

  const [faceImage, setFaceImage] = useState(null);

  /* ================= LOAD FACE IMAGE ================= */
  // useEffect(() => {
  //   if (!candidateId || !candidateName) return;

  //   (async () => {
  //     try {
  //       const res = await fetch(
  //         `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
  //       );
  //       if (!res.ok) return;
  //       const blob = await res.blob();
  //       setFaceImage(URL.createObjectURL(blob));
  //     } catch {
  //       // ignore
  //     }
  //   })();
  // }, [candidateId, candidateName]);

  useEffect(() => {
    if (!attemptId) return;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${attemptId}`
        );
        if (!res.ok) return;

        const blob = await res.blob();
        setFaceImage(URL.createObjectURL(blob));
      } catch (e) {
        console.warn("Face image load failed", e);
      }
    })();
  }, [attemptId]);


  /* ================= DOWNLOAD CERT ================= */
  const handleDownload = async () => {
    const el = document.querySelector(".certificate-container");
    if (!el) return;

    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${candidateName}_certificate.pdf`);
  };

  /* ================= ERROR STATE ================= */
  if (!ok) {
    return (
      <div className="certificate-page">
        <h2 style={{ color: "red" }}>Evaluation Failed</h2>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="certificate-page">

      {/* NAVBAR */}
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="PrimeHire" className="nav-logo" />
        </Link>
      </nav>

      {/* ================= CERTIFICATE ================= */}
      <div className="certificate-container">

        {/* HEADER */}
        <div className="certificate-header">
          <h1>CERTIFICATE</h1>

          <div className="user-info">
            <div className="user-photo">
              {faceImage ? <img src={faceImage} /> : <div className="photo-placeholder" />}
            </div>

            <div className="user-details">
              <h2>{candidateName}</h2>
              {designation && <div className="designation">{designation}</div>}
              <div className="date">{new Date().toLocaleDateString()}</div>

              <div className="certificate-link">
                <Lock />
                {attemptId ? `certs.primehire.ai/${attemptId}` : "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* RESULT */}
        <div className="result-container">
          <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>
          <p><strong>Overall Score:</strong> {overall}/100</p>
          <p><strong>Feedback:</strong> {feedback}</p>
        </div>

        {/* SCORE BREAKDOWN */}
        <div className="scores-container">
          {scores.length === 0 ? (
            <p className="muted">No score breakdown available.</p>
          ) : (
            scores.map((s, i) => (
              <div key={i} className="score-item">
                <div className="score-header">
                  <strong>{s.title.toUpperCase()}</strong>
                  <strong>{s.score}</strong>
                </div>

                <div className="range-bar">
                  <div
                    className="range-highlight"
                    style={{ width: `${s.score}%` }}
                  />
                </div>

                {s.description && (
                  <div className="score-desc">{s.description}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* DOWNLOAD */}
        <div className="download-wrapper">
          <button className="download-btn" onClick={handleDownload}>
            <Download /> Download Certificate
          </button>
        </div>
      </div>

      {/* ================= ANALYTICS ================= */}
      <div className="analytics-container">

        <h2 className="analytics-title">Interview Analytics</h2>

        {/* ---------- ANOMALIES ---------- */}
        <section className="analytics-section">
          <h3>Anomaly Summary</h3>

          {Object.keys(anomalyCounts).length === 0 ? (
            <p className="muted">No anomalies detected.</p>
          ) : (
            <ul className="anomaly-list">
              {Object.entries(ANOMALY_LABELS).map(([key, label]) => {
                const count = anomalyCounts[key] || 0;
                if (!count) return null;

                return (
                  <li key={key}>
                    <strong>{label}</strong>: {count}
                  </li>
                );
              })}
            </ul>


          )}
        </section>

        {/* ---------- MCQ ---------- */}
        <section className="analytics-section">
          <h3>MCQ Evaluation</h3>

          {!mcq ? (
            <p className="muted">No MCQ data available.</p>
          ) : (
            <>
              <div className="score-pill">
                <span>Score</span>
                <strong>{mcq.score}/{mcq.total}</strong>
              </div>

              {Array.isArray(mcq.questions) &&
                mcq.questions.map((q, idx) => (
                  <div className="mcq-card" key={idx}>
                    <div className="mcq-question">
                      Q{idx + 1}. {q.question}
                    </div>

                    <ul className="mcq-options">
                      {q.options.map((opt, i) => {
                        const selected = mcq.answers?.[idx];
                        const correctOpt =
                          q.options[
                          q.correct === "A"
                            ? 0
                            : q.correct === "B"
                              ? 1
                              : q.correct === "C"
                                ? 2
                                : 3
                          ];

                        return (
                          <li
                            key={i}
                            className={
                              opt === correctOpt
                                ? "option correct"
                                : opt === selected
                                  ? "option wrong"
                                  : "option"
                            }
                          >
                            {opt}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
            </>
          )}
        </section>

        {/* ---------- CODING ---------- */}
        <section className="analytics-section">
          <h3>Coding Test</h3>

          {!coding ? (
            <p className="muted">No coding test data available.</p>
          ) : (
            <>
              <div className="score-pill">
                <span>Score</span>
                <strong>{coding.score || 0}/100</strong>
              </div>

              <div className="coding-card">
                <pre className="code">
                  {coding.solution || "No solution submitted"}
                </pre>
              </div>
            </>
          )}
        </section>

        {/* ---------- AI INTERVIEW ---------- */}
        <section className="analytics-section">
          <h3>AI Interview – Per Question</h3>

          {perQuestion.length === 0 ? (
            <p className="muted">No AI interview data.</p>
          ) : (
            perQuestion.map((q, i) => (
              <div key={i} className="question-block">
                <strong>Q:</strong> {q.question}
                <br />
                <strong>A:</strong> {q.answer}
              </div>
            ))
          )}
        </section>

      </div>
    </div>
  );
}
