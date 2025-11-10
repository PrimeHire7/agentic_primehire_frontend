// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { API_BASE } from "@/utils/constants";
// import "./ValidationPanel.css";
// import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router-dom";

// const ValidationPanel = ({
//   candidateName,
//   setCandidateName,
//   validationResult,
//   setValidationResult,
// }) => {
//   const [panFile, setPanFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [isSaved, setIsSaved] = useState(false); // ✅ Track save state
//   const [candidateId, setCandidateId] = useState(null);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const navigate = useNavigate();

//   // 🎥 Start camera only when validation passes
//   useEffect(() => {
//     if (validationResult?.valid_name) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           if (videoRef.current) videoRef.current.srcObject = stream;
//         })
//         .catch((err) => console.error("Camera access error:", err));
//     }
//   }, [validationResult?.valid_name]);

//   const captureFace = () => {
//     const canvas = canvasRef.current;
//     const video = videoRef.current;
//     if (!canvas || !video) return;

//     const context = canvas.getContext("2d");
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     const dataURL = canvas.toDataURL("image/png");
//     setCapturedImage(dataURL);
//     setIsSaved(false); // reset save state when recapturing
//     alert("💾 Please save your captured image to proceed.");
//   };

//   const saveFaceToBackend = async () => {
//     if (!capturedImage || !candidateName) {
//       alert("Please capture your face first.");
//       return;
//     }

//     const sessionId = candidateId || uuidv4();
//     setCandidateId(sessionId);

//     const blob = await (await fetch(capturedImage)).blob();
//     const formData = new FormData();
//     formData.append("candidate_name", candidateName);
//     formData.append("candidate_id", sessionId);
//     formData.append("face_image", blob, "face.png");

//     try {
//       const res = await fetch(
//         `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
//       if (!res.ok) throw new Error("Failed to save face");

//       setIsSaved(true); // ✅ Enable Start Interview after saving
//       alert("✅ Face image saved successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Failed to save face image. Please try again.");
//     }
//   };

//   const handleValidateCandidate = async () => {
//     if (!candidateName || !panFile) {
//       alert("Please enter candidate name and upload PAN card.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", candidateName);
//     formData.append("pan_file", panFile);

//     try {
//       setIsLoading(true);
//       const response = await fetch(
//         `${API_BASE}/mcp/tools/candidate_validation/validate_candidate`,
//         { method: "POST", body: formData }
//       );
//       if (!response.ok)
//         throw new Error(`Validation failed: ${response.status}`);

//       const data = await response.json();
//       console.log("Candidate validation result:", data);

//       let parsed = null;
//       if (typeof data.validation === "object") parsed = data.validation;
//       else if (typeof data.validation === "string") {
//         try {
//           parsed = JSON.parse(data.validation);
//         } catch {
//           console.warn("Fallback to direct object:", data.validation);
//         }
//       }

//       if (parsed) setValidationResult(parsed);
//       else alert("Failed to parse validation result");
//     } catch (err) {
//       console.error("PAN validation error:", err);
//       alert("Validation failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleStartInterview = () => {
//     if (!isSaved) {
//       alert("Please save your face image before continuing.");
//       return;
//     }

//     navigate("/webcam-recorder", {
//       state: { candidateName, candidateId },
//     });
//   };

//   return (
//     <div className="validation-container">
//       {/* Left Panel - PAN Validation */}
//       <div className="validation-panel">
//         <input
//           type="text"
//           placeholder="Candidate Name"
//           className="validation-input"
//           value={candidateName}
//           onChange={(e) => setCandidateName(e.target.value)}
//         />

//         <div className="file-upload-section">
//           <input
//             type="file"
//             accept=".jpg,.jpeg,.png,.pdf"
//             onChange={(e) => setPanFile(e.target.files[0])}
//             className="file-input"
//           />
//           <p className="file-upload-help">
//             📎 Please upload a clear image or PDF of the candidate's PAN card.
//           </p>
//         </div>

//         <Button
//           variant="default"
//           className="validate-button"
//           disabled={isLoading}
//           onClick={handleValidateCandidate}
//         >
//           {isLoading ? "Validating..." : "🧾 Validate Candidate"}
//         </Button>

//         {validationResult && (
//           <div
//             className={`validation-result ${validationResult.valid_name
//               ? "validation-success"
//               : "validation-error"
//               }`}
//           >
//             <p className="validation-result-item">{validationResult.message}</p>
//           </div>
//         )}
//       </div>

//       {/* Right Panel - Face Capture (only visible when validation passes) */}
//       {validationResult?.valid_name && (
//         <div className="face-capture">
//           <video ref={videoRef} autoPlay playsInline width="200" height="150" />
//           <canvas
//             ref={canvasRef}
//             width="200"
//             height="150"
//             style={{ display: "none" }}
//           />

//           {capturedImage && (
//             <img
//               src={capturedImage}
//               alt="Captured face"
//               className="face-preview"
//             />
//           )}

//           <div className="face-buttons">
//             <Button onClick={captureFace} size="sm">
//               📸 Capture
//             </Button>
//             <Button onClick={saveFaceToBackend} size="sm">
//               💾 Save
//             </Button>
//           </div>

//           {capturedImage && !isSaved && (
//             <p className="face-warn">💾 Please save your captured image.</p>
//           )}
//           {isSaved && <p className="face-ok">✅ Face image saved!</p>}

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={handleStartInterview}
//             disabled={!isSaved}
//             className="start-interview-button"
//           >
//             🎯 Start Interview
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ValidationPanel;
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import "./ValidationPanel.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const ValidationPanel = ({
  candidateName,
  setCandidateName,
  validationResult,
  setValidationResult,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [candidateId, setCandidateId] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // 🎥 Start camera only when validation passes
  useEffect(() => {
    if (validationResult?.valid_name) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch((err) => console.error("Camera access error:", err));
    }
  }, [validationResult?.valid_name]);

  const captureFace = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL("image/png");
    setCapturedImage(dataURL);
    setIsSaved(false);
    alert("💾 Please save your captured image to proceed.");
  };

  const saveFaceToBackend = async () => {
    if (!capturedImage || !candidateName) {
      alert("Please capture your face first.");
      return;
    }

    const sessionId = candidateId || uuidv4();
    setCandidateId(sessionId);

    const blob = await (await fetch(capturedImage)).blob();
    const formData = new FormData();
    formData.append("candidate_name", candidateName);
    formData.append("candidate_id", sessionId);
    formData.append("face_image", blob, "face.png");

    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/candidate_validation/save_face_image`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!res.ok) throw new Error("Failed to save face");

      setIsSaved(true);
      alert("✅ Face image saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save face image. Please try again.");
    }
  };

  // ✅ PAN validation removed – name only
  const handleValidateCandidate = async () => {
    if (!candidateName) {
      alert("Please enter candidate name.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const fakeValidationResult = {
        valid_name: true,
        message: `✅ Candidate "${candidateName}" validated successfully (PAN skipped).`,
      };
      setValidationResult(fakeValidationResult);
      setIsLoading(false);
    }, 1000); // short delay for UX
  };

  const handleStartInterview = () => {
    if (!isSaved) {
      alert("Please save your face image before continuing.");
      return;
    }

    navigate("/webcam-recorder", {
      state: { candidateName, candidateId },
    });
  };

  return (
    <div className="validation-container">
      {/* Left Panel - Candidate Validation */}
      <div className="validation-panel">
        <input
          type="text"
          placeholder="Candidate Name"
          className="validation-input"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <Button
          variant="default"
          className="validate-button"
          disabled={isLoading}
          onClick={handleValidateCandidate}
        >
          {isLoading ? "Validating..." : "🧾 Validate Candidate"}
        </Button>

        {validationResult && (
          <div
            className={`validation-result ${validationResult.valid_name
                ? "validation-success"
                : "validation-error"
              }`}
          >
            <p className="validation-result-item">
              {validationResult.message}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Face Capture */}
      {validationResult?.valid_name && (
        <div className="face-capture">
          <video ref={videoRef} autoPlay playsInline width="200" height="150" />
          <canvas
            ref={canvasRef}
            width="200"
            height="150"
            style={{ display: "none" }}
          />

          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured face"
              className="face-preview"
            />
          )}

          <div className="face-buttons">
            <Button onClick={captureFace} size="sm">
              📸 Capture
            </Button>
            <Button onClick={saveFaceToBackend} size="sm">
              💾 Save
            </Button>
          </div>

          {capturedImage && !isSaved && (
            <p className="face-warn">💾 Please save your captured image.</p>
          )}
          {isSaved && <p className="face-ok">✅ Face image saved!</p>}

          <Button
            variant="outline"
            size="sm"
            onClick={handleStartInterview}
            disabled={!isSaved}
            className="start-interview-button"
          >
            🎯 Start Interview
          </Button>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;
