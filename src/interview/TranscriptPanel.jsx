// // FILE: src/interview/TranscriptPanel.jsx
// import React, { useEffect, useRef } from "react";
// import "./TranscriptPanel.css";

// export default function TranscriptPanel({ transcript }) {
//     const scrollRef = useRef(null);

//     useEffect(() => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollTo({
//                 top: scrollRef.current.scrollHeight,
//                 behavior: "smooth",
//             });
//         }
//     }, [transcript]);

//     return (
//         <div className="tp-wrapper">
//             <h4 className="tp-title">Transcript</h4>

//             <div className="tp-scroll" ref={scrollRef}>
//                 {(!transcript || transcript.length === 0) && (
//                     <div className="tp-empty">Transcript will appear here...</div>
//                 )}

//                 {transcript?.map((m, i) => (
//                     <div key={i} className={`tp-msg ${m.role}`}>
//                         <div className="tp-role">
//                             {m.role === "ai"
//                                 ? "🤖 AI"
//                                 : m.role === "system"
//                                     ? "⚠ System"
//                                     : "🧑 Candidate"}
//                         </div>
//                         <div className="tp-text">{m.text}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
// FILE: src/interview/TranscriptPanel.jsx
import React, { useEffect, useRef } from "react";
import "./TranscriptPanel.css";

export default function TranscriptPanel({
    transcript,
    jdId = null,
    jdText = ""
}) {

    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [transcript]);

    return (
        <div className="tp-wrapper">

            <h4 className="tp-title">Transcript</h4>

            {/* 🔵 Optional JD Context Banner */}
            {(jdId || jdText) && (
                <div className="tp-jd-banner">
                    {jdId && <div className="tp-jd-id">JD ID: {jdId}</div>}
                    {jdText && (
                        <div className="tp-jd-text">
                            {jdText.slice(0, 120)}...
                        </div>
                    )}
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
