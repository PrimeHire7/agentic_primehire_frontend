// // 📁 src/interview/ValidationPanel.jsx
// import React, { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { API_BASE } from "@/utils/constants";
// import "./ValidationPanel.css";

// export default function ValidationPanel({ onNext }) {
//     const [candidateName, setCandidateName] = useState("");
//     const [candidateId, setCandidateId] = useState("");
//     const [jdId, setJdId] = useState("");
//     const [jdText, setJdText] = useState("");

//     const [capturedImage, setCapturedImage] = useState(null);
//     const [isSaved, setIsSaved] = useState(false);

//     const videoRef = useRef(null);
//     const canvasRef = useRef(null);

//     /* --------------------------------------------------
//          1. START CAMERA
//     -------------------------------------------------- */
//     const startCamera = async () => {
//         try {
//             const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//             videoRef.current.srcObject = stream;
//             await videoRef.current.play();
//         } catch {
//             alert("Camera access denied.");
//         }
//     };

//     /* --------------------------------------------------
//          2. CAPTURE FACE
//     -------------------------------------------------- */
//     const captureFace = () => {
//         const video = videoRef.current;
//         const canvas = canvasRef.current;

//         if (!video || !canvas) return;

//         canvas.width = video.videoWidth || 320;
//         canvas.height = video.videoHeight || 240;

//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         setCapturedImage(canvas.toDataURL("image/png"));
//         setIsSaved(false);
//     };

//     /* --------------------------------------------------
//          3. SAVE FACE TO BACKEND
//     -------------------------------------------------- */
//     const saveFaceToBackend = async () => {
//         if (!capturedImage) return alert("Capture first.");

//         const blob = await (await fetch(capturedImage)).blob();
//         const fd = new FormData();

//         fd.append("candidate_name", candidateName);
//         fd.append("candidate_id", candidateId);
//         fd.append("face_image", blob, "face.png");

//         try {
//             const res = await fetch(
//                 `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
//                 {
//                     method: "POST",
//                     body: fd,
//                 }
//             );

//             if (!res.ok) throw new Error("Save failed.");

//             setIsSaved(true);
//         } catch (err) {
//             alert("Save error: " + err.message);
//         }
//     };

//     /* --------------------------------------------------
//        4. CONTINUE → SEND DATA BACK TO MAINCONTENT
//     -------------------------------------------------- */
//     const handleContinue = () => {
//         if (!isSaved) return alert("Save face first.");

//         // 🚀 This is the KEY for switching to instructions!
//         onNext({
//             candidateName,
//             candidateId,
//             jdId,
//             jdText,
//         });
//     };

//     return (
//         <div className="vp-page">
//             <div className="vp-center">
//                 <div className="vp-glass-wrapper">

//                     <h2 className="vp-title">Candidate Validation</h2>

//                     {/* INPUT BLOCK */}
//                     <div className="vp-input-block">
//                         <label>Candidate Name</label>
//                         <input
//                             className="vp-input"
//                             value={candidateName}
//                             onChange={(e) => setCandidateName(e.target.value)}
//                             placeholder="Enter candidate name"
//                         />

//                         <label>Candidate ID</label>
//                         <input
//                             className="vp-input"
//                             value={candidateId}
//                             onChange={(e) => setCandidateId(e.target.value)}
//                             placeholder="Unique identifier"
//                         />

//                         <label>JD ID</label>
//                         <input
//                             className="vp-input"
//                             value={jdId}
//                             onChange={(e) => setJdId(e.target.value)}
//                             placeholder="Job description ID"
//                         />
//                     </div>

//                     {/* CAMERA BLOCK */}
//                     <div className="vp-camera-row">

//                         <div className="vp-video-box">
//                             <video ref={videoRef} autoPlay muted className="vp-video" />
//                             <canvas ref={canvasRef} style={{ display: "none" }} />

//                             {capturedImage && (
//                                 <img
//                                     src={capturedImage}
//                                     alt="Captured"
//                                     className="vp-captured-img"
//                                 />
//                             )}
//                         </div>

//                         <div className="vp-actions">
//                             <Button className="vp-btn" onClick={startCamera}>Start Camera</Button>
//                             <Button className="vp-btn" onClick={captureFace}>📸 Capture</Button>
//                             <Button className="vp-btn" onClick={saveFaceToBackend}>💾 Save</Button>

//                             <Button
//                                 className={`vp-btn-next ${isSaved ? "ready" : ""}`}
//                                 disabled={!isSaved}
//                                 onClick={handleContinue}
//                             >
//                                 Continue →
//                             </Button>

//                             <div className="vp-status">
//                                 {isSaved ? "✅ Face saved" : "Waiting for save..."}
//                             </div>
//                         </div>

//                     </div>

//                     {/* JD TEXT BLOCK */}
//                     <div className="vp-jd-block">
//                         <label>Job Description Preview</label>
//                         <textarea
//                             className="vp-jd-display"
//                             value={jdText}
//                             onChange={(e) => setJdText(e.target.value)}
//                             placeholder="Paste or load JD text"
//                         />
//                     </div>

//                 </div>
//             </div>
//         </div>
//     );
// }
// 📁 src/interview/ValidationPanel.jsx
// 📁 src/interview/ValidationPanel.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import { useNavigate, useLocation } from "react-router-dom";
import "./ValidationPanel.css";

export default function ValidationPanel() {
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);

    /* ---------------------------------------
       STATE
    ---------------------------------------- */
    const [candidateName, setCandidateName] = useState("");
    const [candidateId, setCandidateId] = useState("");
    const [jdId, setJdId] = useState("");
    const [jdText, setJdText] = useState("");

    const [capturedImage, setCapturedImage] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    /* ---------------------------------------
       1️⃣ LOAD PARAMETERS LIKE OLD SYSTEM
    ---------------------------------------- */
    useEffect(() => {
        const nameURL = params.get("candidateName");
        const idURL = params.get("candidateId");
        const jdURL = params.get("jd_id");
        const jdTokenURL = params.get("jd_token");

        if (nameURL) setCandidateName(nameURL);
        if (idURL) setCandidateId(idURL);
        if (jdURL) setJdId(jdURL);

        // JD-ID MODE
        if (jdURL && jdURL !== "null") {
            fetchJDText(jdURL);
        }

        // JD-TOKEN MODE
        if (jdTokenURL) {
            fetchJDToken(jdTokenURL);
        }
    }, []);


    // 🔄 Whenever JD ID changes manually, re-fetch JD text
    useEffect(() => {
        if (!jdId || jdId === "null" || jdId.trim() === "") return;

        // JD-ID MODE
        fetchJDText(jdId);
    }, [jdId]);

    /* ---------------------------------------
       2️⃣ FETCH JD TEXT BY ID
    ---------------------------------------- */
    const fetchJDText = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();
            setJdText(data?.jd_text || "Job description unavailable");
        } catch {
            setJdText("Job description unavailable");
        }
    };


    /* ---------------------------------------
       3️⃣ FETCH JD TEXT BY TOKEN
    ---------------------------------------- */
    const fetchJDToken = async (token) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_cache/${token}`);
            const data = await res.json();
            setJdText(data?.jd_text || "");
        } catch {
            setJdText("");
        }
    };

    /* ---------------------------------------
       4️⃣ START CAMERA
    ---------------------------------------- */
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
        } catch {
            alert("Camera access denied.");
        }
    };

    /* ---------------------------------------
       5️⃣ CAPTURE FRAME
    ---------------------------------------- */
    const captureFace = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return alert("Camera not ready");

        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");
        setCapturedImage(imageData);
        setIsSaved(false);
    };

    /* ---------------------------------------
       6️⃣ SAVE FACE
    ---------------------------------------- */
    const saveFaceToBackend = async () => {
        if (!capturedImage) return alert("Capture an image first.");

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

            if (!res.ok) throw new Error("Failed to save");
            setIsSaved(true);
        } catch (err) {
            alert("Save failed: " + err.message);
        }
    };

    /* ---------------------------------------
       7️⃣ CONTINUE → INSTRUCTIONS
    ---------------------------------------- */
    const handleContinue = () => {
        if (!isSaved) return alert("Save the face first!");

        navigate("/instructions", {
            state: {
                candidateName,
                candidateId,
                jd_id: jdId || null,
                jd_text: jdText || "",
            },
        });
    };

    return (
        <div className="vp-container">
            <h2 className="vp-title">Candidate Validation</h2>

            <div className="vp-input-block">
                <label>Candidate Name</label>
                <input
                    className="vp-input"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter candidate name"
                />

                <label>Candidate ID (or Email)</label>
                <input
                    className="vp-input"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    placeholder="Unique ID / Email"
                />

                <label>JD ID (optional)</label>
                <input
                    className="vp-input"
                    value={jdId}
                    onChange={(e) => setJdId(e.target.value)}
                    placeholder="Enter JD ID"
                />
            </div>

            {/* CAMERA + ACTIONS */}
            <div className="vp-camera-row">
                <div className="vp-video-box">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        className={`vp-video ${capturedImage ? "hidden-video" : ""}`}
                    />

                    <canvas ref={canvasRef} style={{ display: "none" }} />

                    {capturedImage && (
                        <img
                            src={capturedImage}
                            alt="Preview"
                            className="vp-preview-img"
                        />
                    )}
                </div>


                <div className="vp-actions">
                    <Button className="vp-btn" onClick={startCamera}>Start Camera</Button>
                    <Button className="vp-btn" onClick={captureFace}>📸 Capture</Button>
                    <Button className="vp-btn" onClick={saveFaceToBackend}>💾 Save</Button>

                    <Button
                        className={`vp-btn-next ${isSaved ? "ready" : ""}`}
                        disabled={!isSaved}
                        onClick={handleContinue}
                    >
                        Continue →
                    </Button>

                    <div className="vp-status">
                        {isSaved ? "✅ Face saved" : "Waiting for save..."}
                    </div>


                </div>
            </div>

            {/* JD PREVIEW */}
            <div className="vp-jd-block">
                <label>Job Description</label>
                <textarea
                    className="vp-jd-display"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Job description will appear here..."
                />
            </div>
        </div>
    );
}
