
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import WebcamRecorder from "./WebcamRecorder";
import "./InterviewBot.css";

import ValidationPanel from "./ValidationPanelInterview";


const InterviewBot = () => {
    const [interviewStep, setInterviewStep] = useState(0);
    const [candidateName, setCandidateName] = useState("");
    const [validationResult, setValidationResult] = useState(null);
    const [transcript, setTranscript] = useState([]); // Add transcript state

    const handleStartInterview = () => {
        setInterviewStep(1);
    };

    const handleStopInterview = () => {
        setInterviewStep(0);
        // Optional: Clear states when interview stops
        setCandidateName("");
        setValidationResult(null);
        setTranscript([]);
    };

    return (
        <div className="interviewbot-containerOne">
            <h2 className="interviewbot-titleOne">🤖 Interview Bot</h2>

            {interviewStep === 0 && (
                <ValidationPanel
                    candidateName={candidateName}
                    setCandidateName={setCandidateName}
                    validationResult={validationResult}
                    setValidationResult={setValidationResult}
                    onStartInterview={handleStartInterview}
                />
            )}

            {interviewStep === 1 && (
                <WebcamRecorder
                    candidateName={candidateName}
                    onStopInterview={handleStopInterview}
                    transcript={transcript}
                    setTranscript={setTranscript}
                />
            )}
        </div>
    );
};

export default InterviewBot;