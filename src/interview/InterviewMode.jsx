// import React, { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// import WebcamRecorder from "./WebcamRecorder";
// import TranscriptPanel from "./TranscriptPanel";
// import LiveInsightsPanel from "./LiveInsightsPanel";
// import InterviewToolbar from "./InterviewToolbar";

// import "./InterviewMode.css";

// export default function InterviewMode() {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const candidateName = location.state?.candidateName || "Anonymous";
//     const initialCandidateId = location.state?.candidateId || null;
//     const jd_text = location.state?.jd_text || "";
//     const jd_id = location.state?.jd_id || null;

//     const [interviewRunning, setInterviewRunning] = useState(false);
//     const [candidateIdState, setCandidateIdState] = useState(initialCandidateId);
//     const [transcriptState, setTranscriptState] = useState([]);

//     useEffect(() => {
//         const onTranscript = (e) => {
//             const t = e.detail;
//             if (Array.isArray(t)) setTranscriptState(t);
//         };
//         window.addEventListener("transcriptUpdate", onTranscript);
//         return () => window.removeEventListener("transcriptUpdate", onTranscript);
//     }, []);

//     const handleStop = () => {
//         setInterviewRunning(false);
//         window.dispatchEvent(new CustomEvent("stopInterview"));
//     };

//     return (
//         <div className="interview-root">

//             {/* HEADER / TOOLBAR */}
//             <div className="interview-toolbar-container">
//                 <InterviewToolbar
//                     interviewRunning={interviewRunning}
//                     onStart={() => {
//                         window.dispatchEvent(new CustomEvent("startInterview"));
//                         setInterviewRunning(true);
//                     }}
//                     onStop={handleStop}
//                 />
//             </div>

//             {/* MAIN 2-COLUMN LAYOUT */}
//             <div className="interview-layout">

//                 {/* LEFT SIDE */}
//                 <div className="left-panel">
//                     <div className="video-wrapper">
//                         <WebcamRecorder
//                             candidateName={candidateName}
//                             candidateId={candidateIdState}
//                             jd_text={jd_text}
//                             jd_id={jd_id}
//                             onCandidateId={(id) => setCandidateIdState(id)}
//                             onTranscriptUpdate={(t) => setTranscriptState(t)}
//                         />
//                     </div>

//                     {/* BELOW VIDEO — INSIGHTS + AI SCORE STATIC */}
//                     <div className="insight-score-row">

//                         <div className="insights-box">
//                             <LiveInsightsPanel
//                                 candidateName={candidateName}
//                                 candidateId={candidateIdState}
//                                 jdText={jd_text}
//                                 jdId={jd_id}
//                                 transcript={transcriptState}
//                             />
//                         </div>

//                         <div className="ai-score-box">
//                             <h4>AI Interview Score</h4>
//                             <div className="ai-score-static">
//                                 <p>Confidence Score: <strong>—</strong></p>
//                                 <p>Superficial Check: <strong>—</strong></p>
//                                 <p>WPM: <strong>—</strong></p>
//                                 <p>Buzzword Hits: <strong>—</strong></p>
//                             </div>
//                         </div>

//                     </div>
//                 </div>

//                 {/* RIGHT SIDE — TRANSCRIPT */}
//                 <div className="right-panel">
//                     <TranscriptPanel transcript={transcriptState} />
//                 </div>

//             </div>
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import WebcamRecorder from "./WebcamRecorder";
import TranscriptPanel from "./TranscriptPanel";
import LiveInsightsPanel from "./LiveInsightsPanel";
import InterviewToolbar from "./InterviewToolbar";

import "./InterviewMode.css";

export default function InterviewMode() {
    const navigate = useNavigate();
    const location = useLocation();

    const candidateName = location.state?.candidateName || "Anonymous";
    const initialCandidateId = location.state?.candidateId || null;
    const jd_text = location.state?.jd_text || "";
    const jd_id = location.state?.jd_id || null;

    const [interviewRunning, setInterviewRunning] = useState(false);
    const [candidateIdState, setCandidateIdState] = useState(initialCandidateId);
    const [transcriptState, setTranscriptState] = useState([]);

    useEffect(() => {
        const onTranscript = (e) => {
            const t = e.detail;
            if (Array.isArray(t)) setTranscriptState(t);
        };
        window.addEventListener("transcriptUpdate", onTranscript);
        return () => window.removeEventListener("transcriptUpdate", onTranscript);
    }, []);

    const handleStop = () => {
        setInterviewRunning(false);
        window.dispatchEvent(new CustomEvent("stopInterview"));
    };

    return (
        <div className="interview-root">
            {/* HEADER / TOOLBAR */}
            <div className="interview-toolbar-container">
                <InterviewToolbar
                    interviewRunning={interviewRunning}
                    onStart={() => {
                        window.dispatchEvent(new CustomEvent("startInterview"));
                        setInterviewRunning(true);
                    }}
                    onStop={handleStop}
                />
            </div>

            {/* MAIN 2-COLUMN LAYOUT */}
            <div className="interview-layout">
                {/* LEFT SIDE */}
                <div className="left-panel">
                    <div className="video-wrapper">
                        <WebcamRecorder
                            candidateName={candidateName}
                            candidateId={candidateIdState}
                            jd_text={jd_text}
                            jd_id={jd_id}
                            onCandidateId={(id) => setCandidateIdState(id)}
                            onTranscriptUpdate={(t) => setTranscriptState(t)}
                        />
                    </div>

                    {/* BELOW VIDEO — INSIGHTS + AI SCORE STATIC */}
                    <div className="insight-score-row">
                        <div className="insights-box">
                            <LiveInsightsPanel
                                candidateName={candidateName}
                                candidateId={candidateIdState}
                                jdText={jd_text}
                                jdId={jd_id}
                                transcript={transcriptState}
                            />
                        </div>
                        <div className="workmap-score-box">
                            <div className="workmap-header">
                                {/* <h4>Workmap Score</h4> */}

                            </div>

                            <div className="score-item">
                                <p>
                                    Confidence Score <span>90%</span>
                                </p>
                                <div className="bar">
                                    <div className="fill purple" style={{ width: "90%" }}></div>
                                </div>
                            </div>

                            <div className="score-item">
                                <p>
                                    Superficial Check <span>60%</span>
                                </p>
                                <div className="bar">
                                    <div className="fill orange" style={{ width: "60%" }}></div>
                                </div>
                            </div>

                            <div className="score-item">
                                <p>
                                    WPM <span>85%</span>
                                </p>
                                <div className="bar">
                                    <div className="fill purple" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                            <div className="score-item">
                                <p>
                                    Buzzword Hits <span>85%</span>
                                </p>
                                <div className="bar">
                                    <div className="fill purple" style={{ width: "85%" }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE — TRANSCRIPT */}
                <div className="right-panel">
                    <TranscriptPanel transcript={transcriptState} />
                </div>
            </div>
        </div>
    );
}