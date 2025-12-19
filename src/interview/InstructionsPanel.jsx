// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./InstructionsPanel.css";

// export default function InstructionsPanel() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Values passed from ValidationPanel
//     const candidateName = location.state?.candidateName || "Candidate";
//     const candidateId = location.state?.candidateId || null;
//     const jd_id = location.state?.jd_id || null;
//     const jd_text = location.state?.jd_text || "";
//     const interviewToken = location.state?.interviewToken || null;

//     const [checked, setChecked] = useState(false);

//     const handleStart = () => {
//         if (!checked) {
//             return alert("Please accept the interview instructions.");
//         }

//         if (!candidateName || !candidateId) {
//             return alert("Candidate details missing. Please restart validation.");
//         }

//         // 🚀 GO DIRECTLY TO INTERVIEW MODE
//         navigate("/interview", {
//             state: {
//                 candidateName,
//                 candidateId,
//                 jd_id,
//                 jd_text,
//                 interviewToken,
//             },
//         });
//     };

//     return (
//         <div className="ip-page">
//             <div className="ip-glass-wrapper">

//                 <h2 className="ip-title">Interview Instructions</h2>

//                 <p className="ip-subtitle">
//                     Hello <strong>{candidateName}</strong>,
//                     please read and confirm the instructions carefully.
//                 </p>

//                 {/* MAIN INSTRUCTIONS CARD */}
//                 <div className="ip-card">
//                     <ul className="ip-list">
//                         <li>Ensure your camera and microphone are working properly.</li>
//                         <li>Use a quiet, well-lit environment with minimal distractions.</li>
//                         <li>The interview will record your video, audio, and responses.</li>
//                         <li>AI Proctoring is enabled: multiple-face detection, gaze tracking, tab switching alerts, and face mismatch warnings.</li>
//                         <li>Do not minimize the browser or switch tabs during the interview.</li>
//                         <li>Maintain steady eye contact with the camera.</li>
//                         <li>Speak clearly and confidently while answering questions.</li>
//                         <li>Internet connection must remain stable during the interview.</li>
//                         <li>Your data is processed solely for candidate evaluation.</li>
//                     </ul>

//                     {/* ACCEPT INSTRUCTIONS */}
//                     <div className="ip-checkbox-row">
//                         <Checkbox
//                             id="instructions-accept"
//                             checked={checked}
//                             onCheckedChange={setChecked}
//                         />
//                         <label htmlFor="instructions-accept" className="ip-checkbox-label">
//                             I have read and agree to the above instructions.
//                         </label>
//                     </div>
//                 </div>

//                 {/* ACTION BUTTON */}
//                 <div className="ip-actions">
//                     <Button
//                         className={`ip-btn-start ${checked ? "ready" : ""}`}
//                         disabled={!checked}
//                         onClick={handleStart}
//                     >
//                         Start Interview →
//                     </Button>
//                 </div>

//                 {/* DEBUG (optional remove later) */}
//                 <div className="ip-debug">
//                     Debug: {candidateName} | {candidateId} | JD_ID: {jd_id}
//                 </div>

//             </div>
//         </div>
//     );
// }
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import "./InstructionsPanel.css";
import logo from "../assets/primehire_logo.png"

export default function InstructionsPanel() {
    const navigate = useNavigate();
    const location = useLocation();

    // Values passed from ValidationPanel
    const candidateName = location.state?.candidateName || "Candidate";
    const candidateId = location.state?.candidateId || null;
    const jd_id = location.state?.jd_id || null;
    const jd_text = location.state?.jd_text || "";
    const interviewToken = location.state?.interviewToken || null;

    const [checked, setChecked] = useState(false);

    const handleStart = () => {
        if (!checked) {
            return alert("Please accept the interview instructions.");
        }

        if (!candidateName || !candidateId) {
            return alert("Candidate details missing. Please restart validation.");
        }

        // 🚀 GO DIRECTLY TO INTERVIEW MODE
        navigate("/interview", {
            replace: true,
            state: {
                candidateName,
                candidateId,
                jd_id,
                jd_text,
                interviewToken,
            },
        });
    };

    return (
        <div className="ip-page">
            <div className="ip-logo-header">
                <img
                    src={logo}        // put logo inside public/
                    alt="App Logo"
                    className="ph-logo"
                />

            </div>
            <div className="ip-glass-wrapper">

                <h2 className="ip-title">Interview Instructions</h2>

                <p className="ip-subtitle">
                    Hello <strong>{candidateName}</strong>,
                    please read and confirm the instructions carefully.
                </p>

                {/* MAIN INSTRUCTIONS CARD */}
                <div className="ip-card">
                    <ul className="ip-list">
                        <li>Ensure your camera and microphone are working properly.</li>
                        <li>Use a quiet, well-lit environment with minimal distractions.</li>
                        <li>The interview will record your video, audio, and responses.</li>
                        <li>AI Proctoring is enabled: multiple-face detection, gaze tracking, tab switching alerts, and face mismatch warnings.</li>
                        <li>Do not minimize the browser or switch tabs during the interview.</li>
                        <li>Maintain steady eye contact with the camera.</li>
                        <li>Speak clearly and confidently while answering questions.</li>
                        <li>Internet connection must remain stable during the interview.</li>
                        <li>Your data is processed solely for candidate evaluation.</li>
                    </ul>

                    {/* ACCEPT INSTRUCTIONS */}
                    <div className="ip-checkbox-row">
                        <Checkbox
                            id="instructions-accept"
                            checked={checked}
                            onCheckedChange={setChecked}
                        />
                        <label htmlFor="instructions-accept" className="ip-checkbox-label">
                            I have read and agree to the above instructions.
                        </label>
                    </div>
                </div>

                {/* ACTION BUTTON */}
                <div className="ip-actions">
                    <Button
                        className={`ip-btn-start ${checked ? "ready" : ""}`}
                        disabled={!checked}
                        onClick={handleStart}
                    >
                        Start Interview →
                    </Button>
                </div>

                {/* DEBUG (optional remove later) */}
                <div className="ip-debug">
                    Debug: {candidateName} | {candidateId} | JD_ID: {jd_id}
                </div>

            </div>
        </div>
    );
}