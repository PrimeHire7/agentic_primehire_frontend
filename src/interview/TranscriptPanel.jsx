// FILE: src/interview/TranscriptPanel.jsx
import React, { useEffect, useRef, useState } from "react";
import "./TranscriptPanel.css";

/* ------------------------------------------------------
   AI Voice Output (Web Speech API)
-------------------------------------------------------*/
function speakAI(text) {
    if (!window.speechSynthesis) {
        console.warn("Speech synthesis not supported.");
        return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    const preferred = voices.find(
        (v) =>
            v.name.includes("Google UK English Male") ||
            v.name.includes("Google US English") ||
            v.lang === "en-US"
    );

    if (preferred) utter.voice = preferred;

    utter.rate = 1.0;
    utter.pitch = 1.0;

    window.speechSynthesis.speak(utter);
}

/* ------------------------------------------------------
   COMPONENT
-------------------------------------------------------*/
export default function TranscriptPanel({ transcript, jdId = null, jdText = "" }) {
    const scrollRef = useRef(null);

    const [aiSpeaking, setAiSpeaking] = useState(false);
    const [userSpeaking, setUserSpeaking] = useState(false);

    /* ------------------------------------------------------
       Auto scroll when transcript updates
    -------------------------------------------------------*/
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [transcript]);

    /* ------------------------------------------------------
       Speak AI messages
    -------------------------------------------------------*/
    useEffect(() => {
        if (!transcript || transcript.length === 0) return;

        const lastMsg = transcript[transcript.length - 1];

        if (lastMsg.role === "ai") {
            setAiSpeaking(true);

            // Speak text
            speakAI(lastMsg.text);

            // Stop animation after TTS duration estimate
            setTimeout(() => setAiSpeaking(false), Math.min(lastMsg.text.length * 60, 3000));
        }
    }, [transcript]);

    /* ------------------------------------------------------
       Listen for speaking events
    -------------------------------------------------------*/
    useEffect(() => {
        const aiHandler = (e) => setAiSpeaking(e.detail);
        const userHandler = (e) => setUserSpeaking(e.detail);

        window.addEventListener("aiSpeaking", aiHandler);
        window.addEventListener("candidateSpeaking", userHandler);

        return () => {
            window.removeEventListener("aiSpeaking", aiHandler);
            window.removeEventListener("candidateSpeaking", userHandler);
        };
    }, []);

    return (
        <div className="tp-wrapper">
            <h4 className="tp-title">Transcript</h4>

            {/* JD Banner */}
            {(jdId || jdText) && (
                <div className="tp-jd-banner">
                    {jdId && <div className="tp-jd-id">JD ID: {jdId}</div>}
                    {jdText && <div className="tp-jd-text">{jdText.slice(0, 120)}...</div>}
                </div>
            )}

            {/* AI Talking Animation */}
            {aiSpeaking && (
                <div className="tp-ai-speaking">
                    🤖 AI is speaking
                    <span className="dot dot1">.</span>
                    <span className="dot dot2">.</span>
                    <span className="dot dot3">.</span>
                </div>
            )}

            {/* User Talking Animation */}
            {userSpeaking && (
                <div className="tp-user-speaking">
                    🧑 You are speaking…
                    <div className="wave">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
            )}

            <div className="tp-scroll" ref={scrollRef}>
                {(!transcript || transcript.length === 0) && (
                    <div className="tp-empty">Transcript will appear here...</div>
                )}

                {transcript?.map((m, i) => (
                    <div key={i} className={`tp-msg ${m.role}`}>
                        <div className="tp-role">
                            {m.role === "ai"
                                ? "🤖 AI"
                                : m.role === "system"
                                    ? "⚠ System"
                                    : "🧑 Candidate"}
                        </div>
                        <div className="tp-text">{m.text}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
