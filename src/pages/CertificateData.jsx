
// // // // import React, { useEffect, useState } from "react";
// // // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // // import { Download, Lock } from "lucide-react";
// // // // import html2canvas from "html2canvas";
// // // // import jsPDF from "jspdf";
// // // // import "./CertificateData.css";
// // // // import logo from "../assets/primehire_logo.png";
// // // // import { API_BASE } from "@/utils/constants";

// // // // export default function CertificateData() {
// // // //   const location = useLocation();
// // // //   const navigate = useNavigate();

// // // //   const {
// // // //     scores = [],
// // // //     candidateName = "Anonymous",
// // // //     candidateId = null,
// // // //     overall = 0,
// // // //     result = "FAIL",
// // // //     feedback = "",
// // // //     designation = "",
// // // //   } = location.state || {};

// // // //   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

// // // //   useEffect(() => {
// // // //     if (!candidateId || !candidateName) return;

// // // //     (async () => {
// // // //       try {
// // // //         const res = await fetch(
// // // //           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
// // // //         );
// // // //         if (!res.ok) throw new Error("No image found");

// // // //         const blob = await res.blob();
// // // //         setFaceImage(URL.createObjectURL(blob));
// // // //       } catch (err) {
// // // //         console.warn("Face image not found:", err);
// // // //       }
// // // //     })();
// // // //   }, [candidateId, candidateName]);

// // // //   const handleDownload = async () => {
// // // //     const el = document.querySelector(".certificate-container");
// // // //     if (!el) return;

// // // //     const canvas = await html2canvas(el, { scale: 2 });
// // // //     const img = canvas.toDataURL("image/png");

// // // //     const pdf = new jsPDF({
// // // //       unit: "px",
// // // //       format: [canvas.width, canvas.height],
// // // //     });

// // // //     pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
// // // //     pdf.save(`${candidateName}_certificate.pdf`);
// // // //   };

// // // //   return (
// // // //     <div className="certificate-page">
// // // //       {/* NAVBAR */}
// // // //       <nav className="navbar">
// // // //         <Link to="/">
// // // //           <img src={logo} alt="PrimeHire" className="nav-logo" />
// // // //         </Link>
// // // //       </nav>

// // // //       {/* CERTIFICATE BOX */}
// // // //       <div className="certificate-container">
// // // //         {/* HEADER */}
// // // //         <div className="certificate-header">
// // // //           <h1>CERTIFICATE</h1>

// // // //           <div className="user-info">
// // // //             <div className="user-photo">
// // // //               <img src={faceImage} alt="face" />
// // // //             </div>

// // // //             <div className="user-details">
// // // //               <h2>{candidateName}</h2>
// // // //               <div className="designation">{designation}</div>
// // // //               <div className="date">{new Date().toLocaleDateString()}</div>

// // // //               <div className="certificate-link">
// // // //                 <Lock />
// // // //                 {candidateId
// // // //                   ? `certs.primehire.ai/${candidateId}`
// // // //                   : "Not available"}
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         {/* RESULT */}
// // // //         <div className="result-container">
// // // //           <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>

// // // //           <p>
// // // //             <strong>Overall Score: </strong>
// // // //             {overall}/100
// // // //           </p>

// // // //           <p>
// // // //             <strong>Feedback: </strong>
// // // //             {feedback}
// // // //           </p>
// // // //         </div>

// // // //         {/* SCORES WITH RANGE BAR */}
// // // //         <div className="scores-container">
// // // //           {scores.map((s, i) => (
// // // //             <div key={i} className="score-item">
// // // //               <div className="score-header">
// // // //                 <strong>{s.title}</strong>
// // // //                 <strong>{s.score}</strong>
// // // //               </div>

// // // //               <div className="score-description">{s.description}</div>

// // // //               {/* RANGE BAR */}
// // // //               <div className="range-bar-container">
// // // //                 <span className="range-min">10</span>

// // // //                 <div className="range-bar">
// // // //                   <div className="range-highlight"></div>
// // // //                   <div className="range-highlight"></div>
// // // //                   <div className="range-highlight"></div>
// // // //                 </div>

// // // //                 <span className="range-max">100</span>
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         {/* DOWNLOAD BUTTON */}
// // // //         <div className="download-wrapper">
// // // //           <button className="download-btn" onClick={handleDownload}>
// // // //             <Download /> Download Certificate
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // FILE: src/pages/CertificateData.jsx
// // // import React, { useEffect, useState } from "react";
// // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // import { Download, Lock } from "lucide-react";
// // // import html2canvas from "html2canvas";
// // // import jsPDF from "jspdf";
// // // import "./CertificateData.css";
// // // import logo from "../assets/primehire_logo.png";
// // // import { API_BASE } from "@/utils/constants";

// // // export default function CertificateData() {
// // //   const location = useLocation();
// // //   const navigate = useNavigate();

// // //   const {
// // //     scores = [],
// // //     candidateName = "Anonymous",
// // //     candidateId = null,
// // //     overall = 0,
// // //     result = "FAIL",
// // //     feedback = "",
// // //     designation = "",

// // //     // NEW ANALYTICS
// // //     transcript = [],
// // //     insights = {},
// // //     anomalyCounts = {},
// // //     per_question = []
// // //   } = location.state || {};

// // //   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

// // //   useEffect(() => {
// // //     if (!candidateId || !candidateName) return;

// // //     (async () => {
// // //       try {
// // //         const res = await fetch(
// // //           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
// // //         );
// // //         if (!res.ok) throw new Error("No image found");

// // //         const blob = await res.blob();
// // //         setFaceImage(URL.createObjectURL(blob));
// // //       } catch (err) {
// // //         console.warn("Face image not found:", err);
// // //       }
// // //     })();
// // //   }, [candidateId, candidateName]);

// // //   const handleDownload = async () => {
// // //     const el = document.querySelector(".certificate-container");
// // //     if (!el) return;

// // //     const canvas = await html2canvas(el, { scale: 2 });
// // //     const img = canvas.toDataURL("image/png");

// // //     const pdf = new jsPDF({
// // //       unit: "px",
// // //       format: [canvas.width, canvas.height],
// // //     });

// // //     pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
// // //     pdf.save(`${candidateName}_certificate.pdf`);
// // //   };

// // //   return (
// // //     <div className="certificate-page">

// // //       {/* NAVBAR */}
// // //       <nav className="navbar">
// // //         <Link to="/">
// // //           <img src={logo} alt="PrimeHire" className="nav-logo" />
// // //         </Link>
// // //       </nav>

// // //       {/* CERTIFICATE BOX */}
// // //       <div className="certificate-container">

// // //         {/* HEADER */}
// // //         <div className="certificate-header">
// // //           <h1>CERTIFICATE</h1>

// // //           <div className="user-info">
// // //             <div className="user-photo">
// // //               <img src={faceImage} alt="face" />
// // //             </div>

// // //             <div className="user-details">
// // //               <h2>{candidateName}</h2>
// // //               <div className="designation">{designation}</div>
// // //               <div className="date">{new Date().toLocaleDateString()}</div>

// // //               <div className="certificate-link">
// // //                 <Lock />
// // //                 {candidateId
// // //                   ? `certs.primehire.ai/${candidateId}`
// // //                   : "Not available"}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {/* RESULT */}
// // //         <div className="result-container">
// // //           <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>

// // //           <p><strong>Overall Score: </strong>{overall}/100</p>
// // //           <p><strong>Feedback: </strong>{feedback}</p>
// // //         </div>

// // //         {/* SCORES */}
// // //         <div className="scores-container">
// // //           {scores.map((s, i) => (
// // //             <div key={i} className="score-item">
// // //               <div className="score-header">
// // //                 <strong>{s.title}</strong>
// // //                 <strong>{s.score}</strong>
// // //               </div>
// // //               <div className="score-description">{s.description}</div>

// // //               <div className="range-bar-container">
// // //                 <span className="range-min">0</span>
// // //                 <div className="range-bar">
// // //                   <div
// // //                     className="range-highlight"
// // //                     style={{ width: `${s.score}%` }}
// // //                   ></div>
// // //                 </div>
// // //                 <span className="range-max">100</span>
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* DOWNLOAD */}
// // //         <div className="download-wrapper">
// // //           <button className="download-btn" onClick={handleDownload}>
// // //             <Download /> Download Certificate
// // //           </button>
// // //         </div>
// // //       </div>

// // //       {/* ==================== ANALYTICS DASHBOARD ==================== */}
// // //       <div className="analytics-container">

// // //         <h2 className="analytics-title">Interview Analytics</h2>

// // //         {/* ANOMALIES */}
// // //         <section className="analytics-section">
// // //           <h3>Anomaly Summary</h3>
// // //           {Object.keys(anomalyCounts).length === 0 ? (
// // //             <p>No anomalies detected.</p>
// // //           ) : (
// // //             <ul className="anomaly-list">
// // //               {Object.entries(anomalyCounts).map(([k, v]) => (
// // //                 <li key={k}><strong>{k.replace(/_/g, " ")}</strong>: {v}</li>
// // //               ))}
// // //             </ul>
// // //           )}
// // //         </section>

// // //         {/* PER-QUESTION */}
// // //         <section className="analytics-section">
// // //           <h3>Per-Question Breakdown</h3>

// // //           {per_question?.length === 0 ? (
// // //             <p>No question-answer pairs</p>
// // //           ) : (
// // //             per_question.map((q, idx) => (
// // //               <div className="question-block" key={idx}>

// // //                 <div className="qa"><strong>Q:</strong> {q.question}</div>
// // //                 <div className="qa answer"><strong>A:</strong> {q.answer}</div>

// // //                 <div className="sub-analytics-row">

// // //                   {/* CONFIDENCE */}
// // //                   <div className="sub-card">
// // //                     <h4>Confidence</h4>
// // //                     <p>WPM: {q.analysis.confidence.wpm}</p>
// // //                     <p>Fillers: {q.analysis.confidence.filler_count}</p>
// // //                     <p>Score: {q.analysis.confidence.confidence_score}/100</p>
// // //                     <div className="bar">
// // //                       <div className="bar-fill"
// // //                         style={{ width: q.analysis.confidence.confidence_score + "%" }}
// // //                       ></div>
// // //                     </div>
// // //                   </div>

// // //                   {/* DEPTH */}
// // //                   <div className="sub-card">
// // //                     <h4>Depth</h4>
// // //                     <p>Buzzwords: {q.analysis.superficial.buzzword_hits}</p>
// // //                     <p>Depth Score: {q.analysis.superficial.depth_score}/100</p>
// // //                     <div className="bar">
// // //                       <div className="bar-fill depth"
// // //                         style={{ width: q.analysis.superficial.depth_score + "%" }}
// // //                       ></div>
// // //                     </div>
// // //                   </div>

// // //                   {/* AUTHENTICITY */}
// // //                   <div className="sub-card">
// // //                     <h4>Authenticity</h4>
// // //                     <p>Score: {q.analysis.authenticity.authenticity_score}/100</p>
// // //                     <p>Level: {q.analysis.authenticity.authenticity_level}</p>
// // //                     <div className="bar">
// // //                       <div className="bar-fill authenticity"
// // //                         style={{
// // //                           width: q.analysis.authenticity.authenticity_score + "%",
// // //                         }}
// // //                       ></div>
// // //                     </div>
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))
// // //           )}

// // //         </section>

// // //         {/* TRANSCRIPT */}
// // //         <section className="analytics-section">
// // //           <h3>Transcript</h3>

// // //           <div className="transcript-preview">
// // //             {transcript.map((m, i) => (
// // //               <div key={i} className={`transcript-line ${m.role}`}>
// // //                 <strong>{m.role.toUpperCase()}:</strong> {m.text}
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </section>

// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // FILE: src/pages/CertificateData.jsx
// // import React, { useEffect, useState } from "react";
// // import { Link, useLocation } from "react-router-dom";
// // import { Download, Lock } from "lucide-react";
// // import html2canvas from "html2canvas";
// // import jsPDF from "jspdf";
// // import "./CertificateData.css";
// // import logo from "../assets/primehire_logo.png";
// // import { API_BASE } from "@/utils/constants";

// // export default function CertificateData() {
// //   const location = useLocation();

// //   const {
// //     scores = [],
// //     candidateName = "Anonymous",
// //     candidateId = null,
// //     overall = 0,
// //     result = "FAIL",
// //     feedback = "",
// //     designation = "",

// //     transcript = [],
// //     insights = {},
// //     anomalyCounts = {},
// //     per_question = [],

// //     // ✅ NEW
// //     mcq = null,
// //     coding = null,
// //   } = location.state || {};

// //   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

// //   /* ===============================
// //      LOAD FACE IMAGE
// //   =============================== */
// //   useEffect(() => {
// //     if (!candidateId || !candidateName) return;

// //     (async () => {
// //       try {
// //         const res = await fetch(
// //           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
// //         );
// //         if (!res.ok) throw new Error("No image");

// //         const blob = await res.blob();
// //         setFaceImage(URL.createObjectURL(blob));
// //       } catch {
// //         // ignore
// //       }
// //     })();
// //   }, [candidateId, candidateName]);

// //   /* ===============================
// //      DOWNLOAD CERTIFICATE
// //   =============================== */
// //   const handleDownload = async () => {
// //     const el = document.querySelector(".certificate-container");
// //     if (!el) return;

// //     const canvas = await html2canvas(el, { scale: 2 });
// //     const img = canvas.toDataURL("image/png");

// //     const pdf = new jsPDF({
// //       unit: "px",
// //       format: [canvas.width, canvas.height],
// //     });

// //     pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
// //     pdf.save(`${candidateName}_certificate.pdf`);
// //   };

// //   return (
// //     <div className="certificate-page">

// //       {/* NAVBAR */}
// //       <nav className="navbar">
// //         <Link to="/">
// //           <img src={logo} alt="PrimeHire" className="nav-logo" />
// //         </Link>
// //       </nav>

// //       {/* ================= CERTIFICATE ================= */}
// //       <div className="certificate-container">

// //         {/* HEADER */}
// //         <div className="certificate-header">
// //           <h1>CERTIFICATE</h1>

// //           <div className="user-info">
// //             <div className="user-photo">
// //               <img src={faceImage} alt="face" />
// //             </div>

// //             <div className="user-details">
// //               <h2>{candidateName}</h2>
// //               <div className="designation">{designation}</div>
// //               <div className="date">{new Date().toLocaleDateString()}</div>

// //               <div className="certificate-link">
// //                 <Lock />
// //                 {candidateId ? `certs.primehire.ai/${candidateId}` : "N/A"}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* RESULT */}
// //         <div className="result-container">
// //           <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>
// //           <p><strong>Overall Score:</strong> {overall}/100</p>
// //           <p><strong>Feedback:</strong> {feedback}</p>
// //         </div>

// //         {/* SCORES */}
// //         <div className="scores-container">
// //           {scores.map((s, i) => (
// //             <div key={i} className="score-item">
// //               <div className="score-header">
// //                 <strong>{s.title}</strong>
// //                 <strong>{s.score}</strong>
// //               </div>

// //               <div className="range-bar">
// //                 <div
// //                   className="range-highlight"
// //                   style={{ width: `${s.score}%` }}
// //                 />
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* DOWNLOAD */}
// //         <div className="download-wrapper">
// //           <button className="download-btn" onClick={handleDownload}>
// //             <Download /> Download Certificate
// //           </button>
// //         </div>
// //       </div>

// //       {/* ================= ANALYTICS ================= */}
// //       <div className="analytics-container">

// //         <h2 className="analytics-title">Interview Analytics</h2>

// //         {/* ---------- ANOMALIES ---------- */}
// //         <section className="analytics-section">
// //           <h3>Anomaly Summary</h3>

// //           {Object.keys(anomalyCounts).length === 0 ? (
// //             <p className="muted">No anomalies detected.</p>
// //           ) : (
// //             <ul className="anomaly-list">
// //               {Object.entries(anomalyCounts).map(([k, v]) => (
// //                 <li key={k}>
// //                   <strong>{k.replace(/_/g, " ")}</strong>: {v}
// //                 </li>
// //               ))}
// //             </ul>
// //           )}
// //         </section>

// //         {/* ================= MCQ ================= */}
// //         <section className="analytics-section">
// //           <h3>MCQ Evaluation</h3>

// //           {!mcq ? (
// //             <p className="muted">No MCQ data available.</p>
// //           ) : (
// //             <>
// //               <div className="score-pill">
// //                 <span>Score</span>
// //                 <strong>{mcq.score}/{mcq.total}</strong>
// //               </div>

// //               {mcq.answers?.map((q, idx) => (
// //                 <div className="mcq-card" key={idx}>
// //                   <div className="mcq-question">
// //                     <span>Q{idx + 1}</span> {q.question}
// //                   </div>

// //                   <ul className="mcq-options">
// //                     {q.options.map((opt, i) => {
// //                       const isCorrect = opt === q.correct;
// //                       const isSelected = opt === q.selected;

// //                       return (
// //                         <li
// //                           key={i}
// //                           className={
// //                             isCorrect
// //                               ? "option correct"
// //                               : isSelected
// //                                 ? "option wrong"
// //                                 : "option"
// //                           }
// //                         >
// //                           {opt}
// //                           {isCorrect && <span className="tag success">Correct</span>}
// //                           {isSelected && !isCorrect && (
// //                             <span className="tag danger">Your Answer</span>
// //                           )}
// //                         </li>
// //                       );
// //                     })}
// //                   </ul>
// //                 </div>
// //               ))}
// //             </>
// //           )}
// //         </section>

// //         {/* ================= CODING ================= */}
// //         <section className="analytics-section">
// //           <h3>Coding Test</h3>

// //           {!coding ? (
// //             <p className="muted">No coding test data available.</p>
// //           ) : (
// //             <>
// //               <div className="score-pill">
// //                 <span>Score</span>
// //                 <strong>{coding.score}/100</strong>
// //               </div>

// //               <div className="coding-card">

// //                 <div className="coding-block">
// //                   <h4>Problem</h4>
// //                   <pre>{coding.problem || "Problem not available"}</pre>
// //                 </div>

// //                 <div className="coding-block">
// //                   <h4>Candidate Solution</h4>
// //                   <pre className="code">
// //                     {coding.solution || "No solution submitted"}
// //                   </pre>
// //                 </div>

// //                 <div className="coding-meta">
// //                   <div>
// //                     <strong>Tests Passed</strong>
// //                     <p>{coding.passed}/{coding.total}</p>
// //                   </div>

// //                   <div>
// //                     <strong>Result</strong>
// //                     <p className={coding.score >= 60 ? "pass" : "fail"}>
// //                       {coding.score >= 60 ? "PASS" : "FAIL"}
// //                     </p>
// //                   </div>
// //                 </div>

// //               </div>
// //             </>
// //           )}
// //         </section>

// //         {/* ================= AI PER QUESTION ================= */}
// //         <section className="analytics-section">
// //           <h3>AI Interview – Per Question</h3>

// //           {per_question.length === 0 ? (
// //             <p className="muted">No AI interview data.</p>
// //           ) : (
// //             per_question.map((q, i) => (
// //               <div key={i} className="question-block">
// //                 <strong>Q:</strong> {q.question}
// //                 <br />
// //                 <strong>A:</strong> {q.answer}
// //               </div>
// //             ))
// //           )}
// //         </section>

// //       </div>
// //     </div>
// //   );
// // }
// // FILE: src/pages/CertificateData.jsx
// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Download, Lock } from "lucide-react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import "./CertificateData.css";
// import logo from "../assets/primehire_logo.png";
// import { API_BASE } from "@/utils/constants";

// export default function CertificateData() {
//   const location = useLocation();
//   const state = location.state || {};

//   /* ===============================
//      SAFE STATE EXTRACTION
//   =============================== */
//   const ok = state.ok !== false;

//   const candidateName = state.candidateName || "Anonymous";
//   const candidateId = state.candidateId || null;
//   const designation = state.designation || "";
//   const overall = state.overall || 0;
//   const result = state.result || "FAIL";
//   const feedback = state.feedback || "No feedback available.";

//   const scores = Array.isArray(state.scores) ? state.scores : [];
//   const per_question = Array.isArray(state.per_question) ? state.per_question : [];
//   const anomalyCounts = state.anomalyCounts || {};
//   const mcq = state.mcq || null;
//   const coding = state.coding || null;

//   const [faceImage, setFaceImage] = useState("/api/placeholder/80/80");

//   /* ===============================
//      LOAD FACE IMAGE
//   =============================== */
//   useEffect(() => {
//     if (!candidateId || !candidateName) return;

//     (async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
//         );
//         if (!res.ok) throw new Error("No image");
//         const blob = await res.blob();
//         setFaceImage(URL.createObjectURL(blob));
//       } catch {
//         // fallback image
//       }
//     })();
//   }, [candidateId, candidateName]);

//   /* ===============================
//      DOWNLOAD CERTIFICATE
//   =============================== */
//   const handleDownload = async () => {
//     const el = document.querySelector(".certificate-container");
//     if (!el) return;

//     const canvas = await html2canvas(el, { scale: 2 });
//     const img = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       unit: "px",
//       format: [canvas.width, canvas.height],
//     });

//     pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
//     pdf.save(`${candidateName}_certificate.pdf`);
//   };

//   /* ===============================
//      ERROR FALLBACK
//   =============================== */
//   if (!ok) {
//     return (
//       <div className="certificate-page">
//         <h2 style={{ color: "red" }}>Certificate generation failed</h2>
//         <pre>{JSON.stringify(state, null, 2)}</pre>
//       </div>
//     );
//   }

//   return (
//     <div className="certificate-page">

//       {/* NAVBAR */}
//       <nav className="navbar">
//         <Link to="/">
//           <img src={logo} alt="PrimeHire" className="nav-logo" />
//         </Link>
//       </nav>

//       {/* ================= CERTIFICATE ================= */}
//       <div className="certificate-container">

//         {/* HEADER */}
//         <div className="certificate-header">
//           <h1>CERTIFICATE</h1>

//           <div className="user-info">
//             <div className="user-photo">
//               <img src={faceImage} alt="face" />
//             </div>

//             <div className="user-details">
//               <h2>{candidateName}</h2>
//               <div className="designation">{designation}</div>
//               <div className="date">{new Date().toLocaleDateString()}</div>

//               <div className="certificate-link">
//                 <Lock />
//                 {candidateId ? `certs.primehire.ai/${candidateId}` : "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* RESULT */}
//         <div className="result-container">
//           <h2 className={result === "PASS" ? "pass" : "fail"}>{result}</h2>
//           <p><strong>Overall Score:</strong> {overall}/100</p>
//           <p><strong>Feedback:</strong> {feedback}</p>
//         </div>

//         {/* SCORES */}
//         <div className="scores-container">
//           {scores.length === 0 ? (
//             <p className="muted">No score breakdown available.</p>
//           ) : (
//             scores.map((s, i) => (
//               <div key={i} className="score-item">
//                 <div className="score-header">
//                   <strong>{s.title.toUpperCase()}</strong>
//                   <strong>{s.score}</strong>
//                 </div>

//                 <div className="range-bar">
//                   <div
//                     className="range-highlight"
//                     style={{ width: `${s.score}%` }}
//                   />
//                 </div>

//                 {s.description && (
//                   <div className="score-desc">{s.description}</div>
//                 )}
//               </div>
//             ))
//           )}
//         </div>

//         {/* DOWNLOAD */}
//         <div className="download-wrapper">
//           <button className="download-btn" onClick={handleDownload}>
//             <Download /> Download Certificate
//           </button>
//         </div>
//       </div>

//       {/* ================= ANALYTICS ================= */}
//       <div className="analytics-container">

//         <h2 className="analytics-title">Interview Analytics</h2>
//         {/* ---------- ANOMALIES ---------- */}
//         <section className="analytics-section">
//           <h3>Anomaly Summary</h3>

//           {Object.keys(anomalyCounts).length === 0 ? (
//             <p className="muted">No anomalies detected.</p>
//           ) : (
//             <ul className="anomaly-list">
//               {Object.entries(anomalyCounts).map(([k, v]) => (
//                 <li key={k}>
//                   <strong>{k.replace(/_/g, " ")}</strong>: {v}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </section>

//         {/* ---------- MCQ ---------- */}
//         <section className="analytics-section">
//           <h3>MCQ Evaluation</h3>
//           {!mcq ? (
//             <p className="muted">No MCQ data available.</p>
//           ) : (
//             <>
//               <div className="score-pill">
//                 <span>Score</span>
//                 <strong>{mcq.score}/{mcq.total}</strong>
//               </div>

//               {Array.isArray(mcq.answers) && mcq.answers.map((q, idx) => (
//                 <div className="mcq-card" key={idx}>
//                   <div className="mcq-question">
//                     <span>Q{idx + 1}</span> {q.question}
//                   </div>

//                   <ul className="mcq-options">
//                     {q.options.map((opt, i) => {
//                       const isCorrect = opt === q.correct;
//                       const isSelected = opt === q.selected;

//                       return (
//                         <li
//                           key={i}
//                           className={
//                             isCorrect
//                               ? "option correct"
//                               : isSelected
//                                 ? "option wrong"
//                                 : "option"
//                           }
//                         >
//                           {opt}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 </div>
//               ))}
//             </>
//           )}
//         </section>

//         {/* ---------- CODING ---------- */}
//         <section className="analytics-section">
//           <h3>Coding Test</h3>

//           {!coding ? (
//             <p className="muted">No coding test data available.</p>
//           ) : (
//             <>
//               <div className="score-pill">
//                 <span>Score</span>
//                 <strong>{coding.score}/100</strong>
//               </div>

//               <div className="coding-card">
//                 <pre className="code">
//                   {coding.solution || "No solution submitted"}
//                 </pre>
//               </div>
//             </>
//           )}
//         </section>

//         {/* ---------- AI INTERVIEW ---------- */}
//         <section className="analytics-section">
//           <h3>AI Interview – Per Question</h3>

//           {per_question.length === 0 ? (
//             <p className="muted">No AI interview data.</p>
//           ) : (
//             per_question.map((q, i) => (
//               <div key={i} className="question-block">
//                 <strong>Q:</strong> {q.question}
//                 <br />
//                 <strong>A:</strong> {q.answer}
//               </div>
//             ))
//           )}
//         </section>

//       </div>
//     </div>
//   );
// }
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

  const anomalyCounts = state.anomalyCounts || {};
  const mcq = state.mcq || null;
  const coding = state.coding || null;

  const [faceImage, setFaceImage] = useState(null);

  /* ================= LOAD FACE IMAGE ================= */
  useEffect(() => {
    if (!candidateId || !candidateName) return;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/candidate_validation/get_face_image/${candidateName}/${candidateId}`
        );
        if (!res.ok) return;
        const blob = await res.blob();
        setFaceImage(URL.createObjectURL(blob));
      } catch {
        // ignore
      }
    })();
  }, [candidateId, candidateName]);

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
              {Object.entries(anomalyCounts).map(([k, v]) => (
                <li key={k}>
                  <strong>{k.replace(/_/g, " ")}</strong>: {v}
                </li>
              ))}
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
