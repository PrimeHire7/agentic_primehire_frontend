// // // import React, { useState } from "react";
// // // import {
// // //     Card,
// // //     CardHeader,
// // //     CardTitle,
// // //     CardContent,
// // //     CardFooter,
// // // } from "@/components/ui/card";
// // // import { Button } from "@/components/ui/button";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import WebcamRecorder from "./WebcamRecorder";
// // // import logo from "../assets/primehire_logo.png"; // Your logo
// // // import "./InstructionsPrompt.css";

// // // const InstructionsPrompt = () => {
// // //     const [checked, setChecked] = useState(false);
// // //     const [startInterview, setStartInterview] = useState(false);

// // //     const handleStart = () => {
// // //         setStartInterview(true);
// // //     };

// // //     if (startInterview) {
// // //         return (
// // //             <WebcamRecorder
// // //                 candidateName={location.state?.candidateName}
// // //                 candidateId={location.state?.candidateId}
// // //             />
// // //         );
// // //     }


// // //     return (
// // //         <div className="instructions-wrapper">
// // //             {/* Navbar */}
// // //             <nav className="instructions-navbar">
// // //                 <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
// // //             </nav>

// // //             {/* Card */}
// // //             <Card className="instructions-card">
// // //                 <CardHeader className="instructions-header">
// // //                     <CardTitle className="instructions-title header-title">
// // //                         Interview Instructions
// // //                     </CardTitle>
// // //                 </CardHeader>

// // //                 <CardContent>
// // //                     <p className="instructions-text">
// // //                         Please read and confirm the instructions before starting your
// // //                         interview:
// // //                     </p>

// // //                     <ul className="instructions-list">
// // //                         <li>Interview will be recorded (video + audio + responses).</li>
// // //                         <li>Your data will be used for evaluation purposes.</li>
// // //                         <li>Do not share personal or sensitive information.</li>
// // //                         <li>Give honest answers without external help.</li>
// // //                         <li>Ensure camera, mic, and internet are working properly.</li>
// // //                     </ul>

// // //                     <div className="confirm-checkbox">
// // //                         <Checkbox
// // //                             id="agree"
// // //                             checked={checked}
// // //                             onCheckedChange={setChecked}
// // //                         />
// // //                         <label htmlFor="agree">
// // //                             I have read and agree to these instructions.
// // //                         </label>
// // //                     </div>
// // //                 </CardContent>

// // //                 <CardFooter>
// // //                     <Button
// // //                         className="instructions-btn"
// // //                         disabled={!checked}
// // //                         onClick={handleStart}
// // //                     >
// // //                         Start Interview
// // //                     </Button>
// // //                 </CardFooter>
// // //             </Card>
// // //         </div>
// // //     );
// // // };

// // // // // export default InstructionsPrompt;
// // // // import React, { useState } from "react";
// // // // import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // import { useNavigate, useLocation } from "react-router-dom";

// // // // export default function InstructionsPrompt() {
// // // //   const [checked, setChecked] = useState(false);
// // // //   const navigate = useNavigate();
// // // //   const location = useLocation();
// // // //   const { candidateName, candidateId } = location.state || {};

// // // //   const handleStart = () => {
// // // //     // pass candidateName and candidateId to webcam route
// // // //     navigate("/webcam-recorder", { state: { candidateName, candidateId } });
// // // //   };

// // // //   return (
// // // //     <div style={{ padding: 20 }}>
// // // //       <Card>
// // // //         <CardHeader>
// // // //           <CardTitle>Interview Instructions</CardTitle>
// // // //         </CardHeader>
// // // //         <CardContent>
// // // //           <ul>
// // // //             <li>Interview will be recorded (audio + video).</li>
// // // //             <li>Keep camera on and avoid tab switching.</li>
// // // //             <li>Speak clearly and honestly.</li>
// // // //           </ul>
// // // //           <div style={{ marginTop: 12 }}>
// // // //             <Checkbox id="agree" checked={checked} onCheckedChange={setChecked} />
// // // //             <label htmlFor="agree"> I agree</label>
// // // //           </div>
// // // //         </CardContent>
// // // //         <CardFooter>
// // // //           <Button disabled={!checked} onClick={handleStart}>
// // // //             Start Interview
// // // //           </Button>
// // // //         </CardFooter>
// // // //       </Card>
// // // //       <div style={{ marginTop: 12 }}>
// // // //         <strong>Debug:</strong> candidateName: {candidateName} | candidateId: {candidateId}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }
// // import React, { useState } from "react";
// // import {
// //     Card,
// //     CardHeader,
// //     CardTitle,
// //     CardContent,
// //     CardFooter,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { useNavigate, useLocation } from "react-router-dom";
// // import logo from "../assets/primehire_logo.png";
// // import "./InstructionsPrompt.css";

// // export default function InstructionsPrompt() {
// //     const [checked, setChecked] = useState(false);
// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     const candidateName = location.state?.candidateName || null;
// //     const candidateId = location.state?.candidateId || null;

// //     console.log("📥 InstructionsPrompt received:", { candidateName, candidateId });

// //     const handleStart = () => {
// //         if (!candidateName || !candidateId) {
// //             alert("❌ Missing candidate details. Please go back and validate again.");
// //             return;
// //         }

// //         navigate("/webcam-recorder", {
// //             state: { candidateName, candidateId },
// //         });
// //     };

// //     return (
// //         <div className="instructions-wrapper">
// //             <nav className="instructions-navbar">
// //                 <img src={logo} alt="PrimeHire" className="navbar-logo" />
// //             </nav>

// //             <Card className="instructions-card">
// //                 <CardHeader className="instructions-header">
// //                     <CardTitle className="instructions-title header-title">
// //                         Interview Instructions
// //                     </CardTitle>
// //                 </CardHeader>

// //                 <CardContent>
// //                     <p>Please read and accept the instructions before continuing.</p>
// //                     <ul className="instructions-list">
// //                         <li>Interview will be recorded.</li>
// //                         <li>Camera + mic are required.</li>
// //                         <li>Don’t switch tabs.</li>
// //                         <li>Give clear and honest responses.</li>
// //                     </ul>

// //                     <div className="confirm-checkbox">
// //                         <Checkbox
// //                             checked={checked}
// //                             onCheckedChange={setChecked}
// //                         />
// //                         <label>I agree to the above instructions.</label>
// //                     </div>
// //                 </CardContent>

// //                 <CardFooter>
// //                     <Button disabled={!checked} onClick={handleStart}>
// //                         Start Interview
// //                     </Button>
// //                 </CardFooter>
// //             </Card>

// //             <div style={{ marginTop: 20, opacity: 0.5 }}>
// //                 Debug: {candidateName || "NULL"} | {candidateId || "NULL"}
// //             </div>
// //         </div>
// //     );
// // }
// // src/components/InstructionsPrompt.jsx
// import React, { useState } from "react";
// import {
//     Card,
//     CardHeader,
//     CardTitle,
//     CardContent,
//     CardFooter,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/primehire_logo.png";
// import "./InstructionsPrompt.css";

// export default function InstructionsPrompt() {
//     const [checked, setChecked] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();

//     const candidateName = location.state?.candidateName || null;
//     const candidateId = location.state?.candidateId || null;

//     console.log("📥 InstructionsPrompt received:", { candidateName, candidateId });

//     const handleStart = () => {
//         if (!candidateName || !candidateId) {
//             alert("❌ Missing candidate details. Please go back and validate again.");
//             return;
//         }

//         // pass them forward to webcam route
//         navigate("/webcam-recorder", { state: { candidateName, candidateId } });
//     };

//     return (
//         <div className="instructions-wrapper">
//             <nav className="instructions-navbar">
//                 <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
//             </nav>

//             <Card className="instructions-card">
//                 <CardHeader className="instructions-header">
//                     <CardTitle className="instructions-title header-title">
//                         Interview Instructions
//                     </CardTitle>
//                 </CardHeader>

//                 <CardContent>
//                     <p>Please read and accept the instructions before continuing.</p>
//                     <ul className="instructions-list">
//                         <li>Interview will be recorded (video + audio + responses).</li>
//                         <li>Your data will be used for evaluation purposes.</li>
//                         <li>Do not share personal or sensitive information.</li>
//                         <li>Give honest answers without external help.</li>
//                         <li>Ensure camera, mic, and internet are working properly.</li>
//                     </ul>

//                     <div className="confirm-checkbox" style={{ marginTop: 12 }}>
//                         <Checkbox id="agree" checked={checked} onCheckedChange={setChecked} />
//                         <label htmlFor="agree" style={{ marginLeft: 8 }}>
//                             I have read and agree to these instructions.
//                         </label>
//                     </div>
//                 </CardContent>

//                 <CardFooter>
//                     <Button disabled={!checked} onClick={handleStart}>
//                         Start Interview
//                     </Button>
//                 </CardFooter>
//             </Card>

//             <div style={{ marginTop: 20, opacity: 0.8 }}>
//                 Debug: candidateName: {candidateName || "NULL"} | candidateId: {candidateId || "NULL"}
//             </div>
//         </div>
//     );
// }

// src/components/InstructionsPrompt.jsx
import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/primehire_logo.png";
import "./InstructionsPrompt.css";

export default function InstructionsPrompt() {
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const candidateName = location.state?.candidateName || null;
    const candidateId = location.state?.candidateId || null;
    const jd_id = location.state?.jd_id || null;
    const jd_text = location.state?.jd_text || "";

    console.log("📥 InstructionsPrompt received:", {
        candidateName,
        candidateId,
        jd_id,
        jd_text,
    });

    const handleStart = () => {
        if (!candidateName || !candidateId) {
            alert("❌ Missing candidate details. Please go back and validate again.");
            return;
        }

        navigate("/webcam-recorder", {
            state: {
                candidateName,
                candidateId,
                jd_id,
                jd_text,
            },
        });
    };

    return (
        <div className="instructions-wrapper">
            <nav className="instructions-navbar">
                <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
            </nav>

            <Card className="instructions-card">
                <CardHeader className="instructions-header">
                    <CardTitle className="instructions-title header-title">
                        Interview Instructions
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <p>Please read and accept the instructions before continuing.</p>
                    <ul className="instructions-list">
                        <li>Interview will be recorded (video + audio + responses).</li>
                        <li>Your data will be used for evaluation purposes.</li>
                        <li>Do not share personal or sensitive information.</li>
                        <li>Give honest answers without external help.</li>
                        <li>Ensure camera, mic, and internet are working properly.</li>
                    </ul>

                    <div className="confirm-checkbox" style={{ marginTop: 12 }}>
                        <Checkbox checked={checked} onCheckedChange={setChecked} />
                        <label style={{ marginLeft: 8 }}>I agree to the above instructions.</label>
                    </div>
                </CardContent>

                <CardFooter>
                    <Button disabled={!checked} onClick={handleStart}>
                        Start Interview
                    </Button>
                </CardFooter>
            </Card>

            <div style={{ marginTop: 20, opacity: 0.8 }}>
                Debug: {candidateName} | {candidateId} | JD_ID: {jd_id}
            </div>
        </div>
    );
}
