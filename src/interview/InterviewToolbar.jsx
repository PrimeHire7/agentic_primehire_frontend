import React, { useEffect, useRef, useState } from "react";
import { Mic, SendHorizonal } from "lucide-react"; // icons

import "./InterviewToolbar.css";

export default function InterviewToolbar({
    candidateName = "Anonymous",
    interviewRunning = false,
    onStart,
    onStop,
}) {
    const [seconds, setSeconds] = useState(0);
    const [showSend, setShowSend] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (interviewRunning) {
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
            setShowSend(true); // activate Send button
        } else {
            clearInterval(timerRef.current);
            setShowSend(false); // hide send button
        }
        return () => clearInterval(timerRef.current);
    }, [interviewRunning]);

    const format = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };

    const handleSend = () => {
        onStop();       // stop interview
        setShowSend(false);
    };

    return (
        <div className="interview-toolbar">

            {/* LEFT — title + timer */}
            <div className="toolbar-left">
                <div className="toolbar-title">Interview — {candidateName}</div>
                <div className="toolbar-timer">{format(seconds)}</div>
            </div>

            {/* RIGHT — waveform + buttons */}
            <div className="toolbar-right">

                {/* WAVEFORM ICON (ACTIVE DURING RECORDING) */}
                {interviewRunning && (
                    <div className="wave-icon">
                        <div></div><div></div><div></div><div></div>
                        <div></div><div></div><div></div><div></div>
                    </div>
                )}

                {/* BUTTONS */}
                {!interviewRunning ? (
                    <button className="primary-btn" onClick={onStart}>
                        <Mic size={16} /> Record
                    </button>
                ) : (
                    <>
                        {showSend && (
                            <button className="primary-btn" onClick={handleSend}>
                                <SendHorizonal size={16} /> Send
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}