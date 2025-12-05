// // 📁 src/components/ProfileMatcher/ProfileMatchHistory.jsx
// import React, { useEffect, useState } from "react";
// import { API_BASE } from "@/utils/constants";
// import { Calendar, Users, ChevronRight } from "lucide-react";
// import "./ProfileMatchHistory.css"; // ✅ Import external CSS
// import ProfileTable from "@/chat/ProfileTable";

// const ProfileMatchHistory = () => {
//     const [history, setHistory] = useState([]);
//     const [selected, setSelected] = useState(null);
//     const [details, setDetails] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         fetchHistory();
//     }, []);

//     const fetchHistory = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/mcp/tools/match_history/profile/history`);
//             const data = await res.json();
//             setHistory(data.history || []);
//         } catch (e) {
//             console.error("❌ Failed to fetch match history:", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchDetail = async (id) => {
//         setSelected(id);
//         setLoading(true);
//         try {
//             const res = await fetch(`${API_BASE}/mcp/tools/match_history/profile/history/${id}`);
//             const data = await res.json();
//             setDetails(data);
//         } catch (e) {
//             console.error("❌ Failed to fetch match details:", e);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="profile-match-container">
//             <h2 className="profile-match-title">🧾 Profile Match History</h2>

//             {loading && <p className="profile-loading">Loading...</p>}

//             {!loading && !selected && (
//                 <ul className="profile-history-list">
//                     {history.map((item) => (
//                         <li
//                             key={item.id}
//                             className="profile-history-item"
//                             onClick={() => fetchDetail(item.id)}
//                         >
//                             <div className="profile-item-info">
//                                 <p className="profile-item-role">
//                                     {item.jd_meta?.role || "Unknown Role"}
//                                 </p>
//                                 <p className="profile-item-meta">
//                                     <span className="profile-meta-icon">
//                                         <Users size={14} />
//                                     </span>
//                                     {item.total_candidates} candidates
//                                     <span className="profile-meta-icon">
//                                         <Calendar size={14} />
//                                     </span>
//                                     {new Date(item.created_at).toLocaleString()}
//                                 </p>
//                             </div>
//                             <ChevronRight size={18} className="profile-chevron" />
//                         </li>
//                     ))}
//                 </ul>
//             )}

//             {details && (
//                 <div className="profile-details">
//                     <button
//                         className="profile-back-btn"
//                         onClick={() => {
//                             setDetails(null);
//                             setSelected(null);
//                         }}
//                     >
//                         ← Back to history
//                     </button>

//                     <h3 className="profile-details-title">
//                         JD: {details.jd_meta?.role || "Unknown Role"}
//                     </h3>
//                     <p className="profile-details-text">{details.jd_text}</p>

//                     <h4 className="profile-candidate-header">
//                         Matched Candidates ({details.candidates?.length || 0})
//                     </h4>
//                     <ul className="profile-candidate-list">
//                         {details.candidates?.map((c, i) => (
//                             <li key={i} className="profile-candidate-item">
//                                 <strong>{c.name}</strong> — {c.designation} (
//                                 {c.scores.final_score.toFixed(2)})
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProfileMatchHistory;
// 📁 src/components/ProfileMatcher/ProfileMatchHistory.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "@/utils/constants";
import { Calendar, Users, ChevronRight } from "lucide-react";
import ProfileTable from "@/chat/ProfileTable"; // ⭐ ADDED
import "./ProfileMatchHistory.css";

const ProfileMatchHistory = () => {
    const [history, setHistory] = useState([]);
    const [selected, setSelected] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/match_history/profile/history`);
            const data = await res.json();
            setHistory(data.history || []);
        } catch (e) {
            console.error("❌ Failed to fetch match history:", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id) => {
        setSelected(id);
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/match_history/profile/history/${id}`);
            const data = await res.json();
            setDetails(data);
        } catch (e) {
            console.error("❌ Failed to fetch match details:", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="profile-match-container">
            <h2 className="profile-match-title">🧾 Profile Match History</h2>

            {loading && <p className="profile-loading">Loading...</p>}

            {/* ---------------- LIST VIEW ---------------- */}
            {!loading && !selected && (
                <ul className="profile-history-list">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="profile-history-item"
                            onClick={() => fetchDetail(item.id)}
                        >
                            <div className="profile-item-info">
                                <p className="profile-item-role">
                                    {item.jd_meta?.role || "Unknown Role"}
                                </p>

                                <p className="profile-item-meta">
                                    <span className="profile-meta-icon">
                                        <Users size={14} />
                                    </span>
                                    {item.total_candidates} candidates

                                    <span className="profile-meta-icon">
                                        <Calendar size={14} />
                                    </span>
                                    {new Date(item.created_at).toLocaleString()}
                                </p>
                            </div>

                            <ChevronRight size={18} className="profile-chevron" />
                        </li>
                    ))}
                </ul>
            )}

            {/* ---------------- DETAIL VIEW ---------------- */}
            {details && (
                <div className="profile-details">
                    <button
                        className="profile-back-btn"
                        onClick={() => {
                            setDetails(null);
                            setSelected(null);
                        }}
                    >
                        ← Back to history
                    </button>

                    <h3 className="profile-details-title">
                        JD: {details.jd_meta?.role || "Unknown Role"}
                    </h3>

                    {/* ⭐ JD TEXT */}
                    <p className="profile-details-text">{details.jd_text}</p>

                    <h4 className="profile-candidate-header">
                        Matched Candidates ({details.candidates?.length || 0})
                    </h4>

                    {/* ⭐ REPLACED STATIC LIST WITH FULL PROFILE TABLE */}
                    <ProfileTable
                        data={details.candidates}  // candidates array
                        jdId={null}                // ⭐ JD-less mode
                        jdText={details.jd_text}   // ⭐ pass JD text for email flow
                        jdMeta={details.jd_meta}   // optional but good to have
                    />
                </div>
            )}
        </div>
    );
};

export default ProfileMatchHistory;
