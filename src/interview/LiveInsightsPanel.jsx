// // // // FILE: src/interview/LiveInsightsPanel.jsx
// // // import React, { useEffect, useState } from "react";
// // // import "./LiveInsightsPanel.css";

// // // export default function LiveInsightsPanel() {
// // //     const [live, setLive] = useState({
// // //         anomalies: [],
// // //         counts: {}
// // //     });

// // //     useEffect(() => {
// // //         const handler = (e) => {
// // //             const payload = e.detail;

// // //             setLive((prev) => ({
// // //                 anomalies: payload.anomalies || prev.anomalies,
// // //                 counts: payload.counts || prev.counts,
// // //             }));
// // //         };

// // //         window.addEventListener("liveInsightsUpdate", handler);
// // //         return () => window.removeEventListener("liveInsightsUpdate", handler);
// // //     }, []);

// // //     const counts = live.counts ? live.counts : {};


// // //     return (
// // //         <div className="live-insight-box">
// // //             <h4>Real-time Behaviour Insights</h4>

// // //             <h5 className="anomaly-title">Detected Anomalies</h5>
// // //             <div className="anomaly-grid">

// // //                 <div className="anomaly-item"><span>No Face</span><strong>{counts.absence || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Multi Face</span><strong>{counts.multi_face || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Face Mismatch</span><strong>{counts.face_mismatch || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Gaze Away</span><strong>{counts.gaze_away || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>No Blink</span><strong>{counts.no_blink || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Static Face</span><strong>{counts.static_face || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Nodding</span><strong>{counts.nodding_pattern || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Scanning</span><strong>{counts.head_scanning || 0}</strong></div>

// // //                 <div className="anomaly-item"><span>Stress Movements</span><strong>{counts.stress_movement || 0}</strong></div>

// // //             </div>

// // //             <h5 className="anomaly-title">Latest Anomaly</h5>
// // //             {live.anomalies?.length > 0 ? (
// // //                 <div className="latest-anomaly">
// // //                     {live.anomalies[live.anomalies.length - 1].msg}
// // //                 </div>
// // //             ) : (
// // //                 <div className="latest-anomaly">No anomalies</div>
// // //             )}

// // //         </div>
// // //     );
// // // }
// // // FILE: src/interview/LiveInsightsPanel.jsx
// // import React, { useEffect, useState } from "react";
// // import "./LiveInsightsPanel.css";

// // export default function LiveInsightsPanel() {
// //     const [live, setLive] = useState({
// //         anomalies: [],
// //         counts: {}
// //     });

// //     useEffect(() => {
// //         const handler = (e) => {
// //             const payload = e.detail;

// //             setLive({
// //                 anomalies: payload.anomalies || [],
// //                 counts: payload.counts || {}
// //             });
// //         };

// //         window.addEventListener("liveInsightsUpdate", handler);
// //         return () => window.removeEventListener("liveInsightsUpdate", handler);
// //     }, []);

// //     const C = live.counts || {};

// //     return (
// //         <div className="live-insight-box">
// //             <h4>Real-time Behaviour Insights</h4>

// //             <h5 className="anomaly-title">Detected Anomalies</h5>
// //             <div className="anomaly-grid">

// //                 <div className="anomaly-item"><span>No Face</span>
// //                     <strong>{C.absence || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Multi Face</span>
// //                     <strong>{C.multi_face || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Face Mismatch</span>
// //                     <strong>{C.face_mismatch || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Gaze Away</span>
// //                     {/* FIXED */}
// //                     <strong>{C.gaze_away_long || 0}</strong></div>

// //                 <div className="anomaly-item"><span>No Blink</span>
// //                     <strong>{C.no_blink || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Static Face</span>
// //                     <strong>{C.static_face || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Nodding</span>
// //                     {/* FIXED */}
// //                     <strong>{C.excessive_nodding_long || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Scanning</span>
// //                     {/* FIXED */}
// //                     <strong>{C.head_scanning_long || 0}</strong></div>

// //                 <div className="anomaly-item"><span>Stress Movements</span>
// //                     <strong>{C.stress_movement || 0}</strong></div>

// //             </div>

// //             <h5 className="anomaly-title">Latest Anomaly</h5>
// //             {live.anomalies?.length > 0 ? (
// //                 <div className="latest-anomaly">
// //                     {live.anomalies[live.anomalies.length - 1].msg}
// //                 </div>
// //             ) : (
// //                 <div className="latest-anomaly">No anomalies</div>
// //             )}
// //         </div>
// //     );
// // }
// // FILE: src/interview/LiveInsightsPanel.jsx
// import React, { useEffect, useState } from "react";
// import "./LiveInsightsPanel.css";

// export default function LiveInsightsPanel() {
//     const [live, setLive] = useState({
//         anomalies: [],
//         counts: {}
//     });

//     useEffect(() => {
//         const handler = (e) => {
//             const payload = e.detail;

//             setLive({
//                 anomalies: payload.anomalies || [],
//                 counts: payload.counts || {}
//             });
//         };

//         window.addEventListener("liveInsightsUpdate", handler);
//         return () => window.removeEventListener("liveInsightsUpdate", handler);
//     }, []);

//     const C = live.counts || {};

//     return (
//         <div className="live-insight-box">
//             <h4>Real-time Behaviour Insights</h4>

//             <h5 className="anomaly-title">Detected Anomalies</h5>
//             <div className="anomaly-grid">

//                 <div className="anomaly-item"><span>No Face</span><strong>{C.absence || 0}</strong></div>

//                 <div className="anomaly-item"><span>Multi Face</span><strong>{C.multi_face || 0}</strong></div>

//                 <div className="anomaly-item"><span>Face Mismatch</span><strong>{C.face_mismatch || 0}</strong></div>

//                 <div className="anomaly-item"><span>Gaze Away</span><strong>{C.gaze_away_long || 0}</strong></div>

//                 <div className="anomaly-item"><span>No Blink</span><strong>{C.no_blink || 0}</strong></div>

//                 <div className="anomaly-item"><span>Static Face</span><strong>{C.static_face || 0}</strong></div>

//                 <div className="anomaly-item"><span>Nodding</span><strong>{C.excessive_nodding_long || 0}</strong></div>

//                 <div className="anomaly-item"><span>Scanning</span><strong>{C.head_scanning_long || 0}</strong></div>

//                 <div className="anomaly-item"><span>Stress Movements</span><strong>{C.stress_movement || 0}</strong></div>

//                 {/* <div className="anomaly-item"><span>Tab Switch</span><strong>{C.tab_switch || 0}</strong></div> */}
//                 <div className="anomaly-item">
//                     <span>Tab Switch</span>
//                     <strong>{C.tab_switch || 0}</strong>
//                 </div>


//             </div>

//             <h5 className="anomaly-title">Latest Anomaly</h5>
//             {live.anomalies?.length > 0 ? (
//                 <div className="latest-anomaly">
//                     {live.anomalies[live.anomalies.length - 1].msg}
//                 </div>
//             ) : (
//                 <div className="latest-anomaly">No anomalies</div>
//             )}
//         </div>
//     );
// }
// // FILE: src/interview/LiveInsightsPanel.jsx
// import React, { useEffect, useState } from "react";
// import "./LiveInsightsPanel.css";

// function LiveInsightsPanel() {
//     const [live, setLive] = useState({
//         anomalies: [],
//         counts: {}
//     });

//     useEffect(() => {
//         const handler = (e) => {
//             const payload = e.detail || {};
//             const nextAnomalies = payload.anomalies || [];
//             const nextCounts = payload.counts || {};

//             setLive((prev) => {
//                 // 🔒 prevent unnecessary re-renders
//                 if (
//                     prev.anomalies === nextAnomalies &&
//                     prev.counts === nextCounts
//                 ) {
//                     return prev;
//                 }

//                 return {
//                     anomalies: nextAnomalies,
//                     counts: nextCounts
//                 };
//             });
//         };

//         window.addEventListener("liveInsightsUpdate", handler);
//         return () => window.removeEventListener("liveInsightsUpdate", handler);
//     }, []);

//     const C = live.counts || {};

//     return (
//         <div className="live-insight-box">
//             <h4>Real-time Behaviour Insights</h4>

//             <h5 className="anomaly-title">Detected Anomalies</h5>
//             <div className="anomaly-grid">
//                 <div className="anomaly-item"><span>No Face</span><strong>{C.absence || 0}</strong></div>
//                 <div className="anomaly-item"><span>Multi Face</span><strong>{C.multi_face || 0}</strong></div>
//                 <div className="anomaly-item"><span>Face Mismatch</span><strong>{C.face_mismatch || 0}</strong></div>
//                 <div className="anomaly-item"><span>Gaze Away</span><strong>{C.gaze_away_long || 0}</strong></div>
//                 <div className="anomaly-item"><span>No Blink</span><strong>{C.no_blink || 0}</strong></div>
//                 <div className="anomaly-item"><span>Static Face</span><strong>{C.static_face || 0}</strong></div>
//                 <div className="anomaly-item"><span>Nodding</span><strong>{C.excessive_nodding_long || 0}</strong></div>
//                 <div className="anomaly-item"><span>Scanning</span><strong>{C.head_scanning_long || 0}</strong></div>
//                 <div className="anomaly-item"><span>Stress Movements</span><strong>{C.stress_movement || 0}</strong></div>
//                 <div className="anomaly-item"><span>Tab Switch</span><strong>{C.tab_switch || 0}</strong></div>
//             </div>

//             <h5 className="anomaly-title">Latest Anomaly</h5>
//             {live.anomalies.length > 0 ? (
//                 <div className="latest-anomaly">
//                     {live.anomalies[live.anomalies.length - 1].msg}
//                 </div>
//             ) : (
//                 <div className="latest-anomaly">No anomalies</div>
//             )}
//         </div>
//     );
// }

// export default React.memo(LiveInsightsPanel);
// FILE: src/interview/LiveInsightsPanel.jsx
// // FILE: src/interview/LiveInsightsPanel.jsx
// import React, { useEffect, useState } from "react";
// import "./LiveInsightsPanel.css";

// function LiveInsightsPanel() {
//     const [live, setLive] = useState({
//         anomalies: [],
//         counts: {}
//     });

//     useEffect(() => {
//         const handler = (e) => {
//             const payload = e.detail || {};

//             const incomingAnomalies = Array.isArray(payload.anomalies)
//                 ? payload.anomalies
//                 : [];

//             const incomingCounts = payload.counts || {};

//             // ✅ CRITICAL FIX: MERGE COUNTS
//             setLive((prev) => {
//                 const mergedCounts = { ...prev.counts };

//                 Object.entries(incomingCounts).forEach(([key, value]) => {
//                     mergedCounts[key] = value;
//                 });

//                 return {
//                     anomalies: incomingAnomalies.length
//                         ? [...prev.anomalies, ...incomingAnomalies]
//                         : prev.anomalies,
//                     counts: mergedCounts,
//                 };
//             });
//         };

//         window.addEventListener("liveInsightsUpdate", handler);
//         return () =>
//             window.removeEventListener("liveInsightsUpdate", handler);
//     }, []);

//     const C = live.counts || {};

//     return (
//         <div className="live-insight-box">
//             <h4>Real-time Behaviour Insights</h4>

//             <h5 className="anomaly-title">Detected Anomalies</h5>
//             <div className="anomaly-grid">
//                 <div className="anomaly-item"><span>No Face</span><strong>{C.absence ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Multi Face</span><strong>{C.multi_face ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Face Mismatch</span><strong>{C.face_mismatch ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Gaze Away</span><strong>{C.gaze_away_long ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>No Blink</span><strong>{C.no_blink ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Static Face</span><strong>{C.static_face ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Nodding</span><strong>{C.excessive_nodding_long ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Scanning</span><strong>{C.head_scanning_long ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Stress</span><strong>{C.stress_movement ?? 0}</strong></div>
//                 <div className="anomaly-item"><span>Tab Switch</span><strong>{C.tab_switch ?? 0}</strong></div>
//             </div>

//             <h5 className="anomaly-title">Latest Anomaly</h5>
//             {live.anomalies.length > 0 ? (
//                 <div className="latest-anomaly">
//                     {live.anomalies[live.anomalies.length - 1]?.msg}
//                 </div>
//             ) : (
//                 <div className="latest-anomaly muted">No anomalies</div>
//             )}
//         </div>
//     );
// }

// export default React.memo(LiveInsightsPanel);

// FILE: src/interview/LiveInsightsPanel.jsx
import React, { useEffect, useState, useRef } from "react";
import "./LiveInsightsPanel.css";

function LiveInsightsPanel() {
    const [live, setLive] = useState({
        anomalies: [],
        counts: {}
    });

    // ✅ Track which anomalies have already been written to transcript
    const writtenRef = useRef(new Set());

    useEffect(() => {
        const handler = (e) => {
            const payload = e.detail || {};

            const incomingAnomalies = Array.isArray(payload.anomalies)
                ? payload.anomalies
                : [];

            const incomingCounts = payload.counts || {};

            // ===============================
            // 1️⃣ UPDATE UI STATE (UNCHANGED)
            // ===============================
            setLive((prev) => {
                const mergedCounts = { ...prev.counts };

                Object.entries(incomingCounts).forEach(([key, value]) => {
                    mergedCounts[key] = value;
                });

                return {
                    anomalies: incomingAnomalies.length
                        ? [...prev.anomalies, ...incomingAnomalies]
                        : prev.anomalies,
                    counts: mergedCounts,
                };
            });

            // ==========================================
            // 2️⃣ PERSIST ANOMALIES INTO TRANSCRIPT (NEW)
            // ==========================================
            incomingAnomalies.forEach((a) => {
                // support both string + object payloads
                const key =
                    typeof a === "string"
                        ? a
                        : a?.type || a?.msg || JSON.stringify(a);

                if (writtenRef.current.has(key)) return;

                writtenRef.current.add(key);

                window.dispatchEvent(
                    new CustomEvent("transcriptAdd", {
                        detail: {
                            role: "system",
                            text: `⚠ ${key}`,
                        },
                    })
                );
            });
        };

        window.addEventListener("liveInsightsUpdate", handler);
        return () =>
            window.removeEventListener("liveInsightsUpdate", handler);
    }, []);

    const C = live.counts || {};

    return (
        <div className="live-insight-box">
            <h4>Real-time Behaviour Insights</h4>

            <h5 className="anomaly-title">Detected Anomalies</h5>
            <div className="anomaly-grid">
                <div className="anomaly-item"><span>No Face</span><strong>{C.absence ?? 0}</strong></div>
                <div className="anomaly-item"><span>Multi Face</span><strong>{C.multi_face ?? 0}</strong></div>
                <div className="anomaly-item"><span>Face Mismatch</span><strong>{C.face_mismatch ?? 0}</strong></div>
                <div className="anomaly-item"><span>Gaze Away</span><strong>{C.gaze_away_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>No Blink</span><strong>{C.no_blink ?? 0}</strong></div>
                <div className="anomaly-item"><span>Static Face</span><strong>{C.static_face ?? 0}</strong></div>
                <div className="anomaly-item"><span>Nodding</span><strong>{C.excessive_nodding_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>Scanning</span><strong>{C.head_scanning_long ?? 0}</strong></div>
                <div className="anomaly-item"><span>Stress</span><strong>{C.stress_movement ?? 0}</strong></div>
                <div className="anomaly-item"><span>Tab Switch</span><strong>{C.tab_switch ?? 0}</strong></div>
            </div>

            <h5 className="anomaly-title">Latest Anomaly</h5>
            {live.anomalies.length > 0 ? (
                <div className="latest-anomaly">
                    {live.anomalies[live.anomalies.length - 1]?.msg ||
                        live.anomalies[live.anomalies.length - 1]}
                </div>
            ) : (
                <div className="latest-anomaly muted">No anomalies</div>
            )}
        </div>
    );
}

export default React.memo(LiveInsightsPanel);
