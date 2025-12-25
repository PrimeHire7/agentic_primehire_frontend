// // import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// // import { ChevronRight } from "lucide-react";
// // import { API_BASE } from "@/utils/constants";
// // import "./Designation.css";

// // const Designation = () => {
// //     const [jobs, setJobs] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const fetchJDHistory = async () => {
// //     try {
// //         const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
// //         const data = await res.json();

// //         const history = data.history || [];

// //         // Fetch attempts per JD
// //         const withAttempts = await Promise.all(
// //             history.map(async (jd) => {
// //                 const attemptsRes = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/attempts/${jd.id}`);
// //                 const attemptsData = await attemptsRes.json();

// //                 // Filter out useless / unstarted attempts
// //                 const usefulAttempts = attemptsData.attempts?.filter(
// //                     a =>
// //                         a.progress &&
// //                         a.progress !== "Applied" &&
// //                         a.progress !== "Not Started"
// //                 );

// //                 return {
// //                     ...jd,
// //                     attemptCount: usefulAttempts.length || 0,
// //                 };
// //             })
// //         );

// //         setJobs(withAttempts);
// //     } catch (err) {
// //         console.error("Failed to load JD list", err);
// //     }
// //     setLoading(false);
// // };

// //     // const fetchJDHistory = async () => {
// //     //     try {
// //     //         const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
// //     //         const data = await res.json();
// //     //         setJobs(data.history || []);
// //     //     } catch (err) {
// //     //         console.error("Failed to load JD list", err);
// //     //     }
// //     //     setLoading(false);
// //     // };

// //     useEffect(() => {
// //         fetchJDHistory();
// //     }, []);

// //     return (
// //         <div className="designation-container">
// //             <h2 className="heading">
// //                 <span>📄</span> Job Designations
// //             </h2>

// //             {loading ? (
// //                 <p>Loading…</p>
// //             ) : jobs.length === 0 ? (
// //                 <p>No JD available.</p>
// //             ) : (
// //                 jobs.map((item) => (
// //                     <Link
// //                         to={`/candidate-status/${item.id}`}
// //                         key={item.id}
// //                         className="designation-card"
// //                     >
// //                         <div className="card-content">
// //                             <h3 className="jd-title">{item.designation}</h3>
// //                             {/* <p className="sub-info">{item.match_count} Matches</p> */}
// //                             <p className="sub-info">{item.attemptCount} Attempts</p>

// //                         </div>

// //                         <ChevronRight size={20} className="arrow-icon" />
// //                     </Link>
// //                 ))
// //             )}
// //         </div>
// //     );
// // };

// // export default Designation;
// // 📁 src/pages/Designation.jsx
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ChevronRight } from "lucide-react";
// import { API_BASE } from "@/utils/constants";
// import "./Designation.css";

// const VALID_STATUSES = [
//     "SCHEDULED",
//     "IN_PROGRESS",
//     "COMPLETED",
//     "EXPIRED",
// ];

// const Designation = () => {
//     const [jobs, setJobs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     /* ---------------------------------------------------------
//        FETCH JD HISTORY + ATTEMPT COUNTS
//     --------------------------------------------------------- */
//     const fetchJDHistory = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
//             const data = await res.json();

//             const history = data.history || [];

//             // Fetch attempts per JD and count valid ones
//             const enriched = await Promise.all(
//                 history.map(async (jd) => {
//                     try {
//                         const attemptsRes = await fetch(
//                             `${API_BASE}/mcp/tools/jd_history/scheduler/attempts/${jd.id}`
//                         );
//                         const attemptsData = await attemptsRes.json();

//                         const attempts = attemptsData.attempts || [];

//                         const validAttempts = attempts.filter(
//                             (a) =>
//                                 a.status &&
//                                 VALID_STATUSES.includes(a.status.toUpperCase())
//                         );

//                         return {
//                             ...jd,
//                             candidateCount: validAttempts.length,
//                         };
//                     } catch {
//                         return {
//                             ...jd,
//                             candidateCount: 0,
//                         };
//                     }
//                 })
//             );

//             setJobs(enriched);
//         } catch (err) {
//             console.error("❌ Failed to load JD list", err);
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         fetchJDHistory();
//     }, []);

//     /* ---------------------------------------------------------
//        UI
//     --------------------------------------------------------- */
//     return (
//         <div className="designation-container">
//             <h2 className="heading">
//                 <span>📄</span> Job Designations
//             </h2>

//             {loading ? (
//                 <p>Loading…</p>
//             ) : jobs.length === 0 ? (
//                 <p>No JD available.</p>
//             ) : (
//                 jobs.map((item) => (
//                     <Link
//                         to={`/candidate-status/${item.id}`}
//                         key={item.id}
//                         className="designation-card"
//                     >
//                         <div className="card-content">
//                             <h3 className="jd-title">{item.designation}</h3>

//                             <p className="sub-info">
//                                 👥 {item.candidateCount} Candidate
//                                 {item.candidateCount !== 1 ? "s" : ""}
//                             </p>
//                         </div>

//                         <ChevronRight size={20} className="arrow-icon" />
//                     </Link>
//                 ))
//             )}
//         </div>
//     );
// };

// export default Designation;
// 📁 src/pages/Designation.jsx
// 📁 src/pages/Designation.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./Designation.css";

const Designation = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ---------------------------------------------------------
       FETCH JD HISTORY + ALL CANDIDATE COUNTS
    --------------------------------------------------------- */
    const fetchJDHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
            const data = await res.json();
            const history = data.history || [];

            const enriched = await Promise.all(
                history.map(async (jd) => {
                    try {
                        const attemptsRes = await fetch(
                            `${API_BASE}/mcp/tools/jd_history/scheduler/attempts/${jd.id}`
                        );
                        const attemptsData = await attemptsRes.json();

                        return {
                            ...jd,
                            candidateCount: attemptsData.total_candidates || 0,
                            statusCounts: attemptsData.counts_by_status || {},
                        };
                    } catch (err) {
                        console.error("Failed to load attempts", err);
                        return {
                            ...jd,
                            candidateCount: 0,
                            statusCounts: {},
                        };
                    }
                })
            );

            setJobs(enriched);
        } catch (err) {
            console.error("❌ Failed to load JD list", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchJDHistory();
    }, []);

    /* ---------------------------------------------------------
       UI
    --------------------------------------------------------- */
    return (
        <div className="designation-container jd-history-container">
            <h2 className="heading">
                <span>📄</span> Job Designations
            </h2>

            {loading ? (
                <p>Loading…</p>
            ) : jobs.length === 0 ? (
                <p>No JD available.</p>
            ) : (
                jobs.map((item) => (
                    <Link
                        to={`/candidate-status/${item.id}`}
                        key={item.id}
                        className="designation-card"
                    >
                        <div className="card-content">
                            <h3 className="jd-title">{item.designation}</h3>

                            <p className="sub-info">
                                👥 {item.candidateCount} Candidate
                                {item.candidateCount !== 1 ? "s" : ""}
                            </p>

                            {/* OPTIONAL STATUS BREAKDOWN */}
                            <div className="status-row">
                                {Object.entries(item.statusCounts).map(([k, v]) => (
                                    <span className={`status-chip ${k.toLowerCase()}`}>
                                        <span className="label">{k.replace("_", " ")}</span>
                                        <span className="count">{v}</span>
                                    </span>

                                ))}
                            </div>
                        </div>

                        <ChevronRight size={20} className="arrow-icon" />
                    </Link>
                ))
            )}
        </div>
    );
};

export default Designation;
