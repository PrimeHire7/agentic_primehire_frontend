// 📁 src/components/ProfileMatcher/ProfileMatchHistory.jsx
import React, { useEffect, useState } from "react";
import { API_BASE } from "@/utils/constants";
import { Calendar, Users, ChevronRight } from "lucide-react";

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
        <div className="p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-3">🧾 Profile Match History</h2>

            {loading && <p className="text-sm text-gray-500">Loading...</p>}

            {!loading && !selected && (
                <ul className="divide-y divide-gray-200">
                    {history.map((item) => (
                        <li
                            key={item.id}
                            className="p-3 flex justify-between items-center hover:bg-gray-50 rounded cursor-pointer"
                            onClick={() => fetchDetail(item.id)}
                        >
                            <div>
                                <p className="font-medium text-gray-800">
                                    {item.jd_meta?.role || "Unknown Role"}
                                </p>
                                <p className="text-xs text-gray-500 flex items-center gap-2">
                                    <Users size={14} /> {item.total_candidates} candidates
                                    <Calendar size={14} />{" "}
                                    {new Date(item.created_at).toLocaleString()}
                                </p>
                            </div>
                            <ChevronRight size={18} className="text-gray-400" />
                        </li>
                    ))}
                </ul>
            )}

            {details && (
                <div className="mt-4 border-t pt-3">
                    <button
                        className="text-blue-600 text-sm mb-2"
                        onClick={() => {
                            setDetails(null);
                            setSelected(null);
                        }}
                    >
                        ← Back to history
                    </button>

                    <h3 className="font-semibold text-gray-800 mb-2">
                        JD: {details.jd_meta?.role || "Unknown Role"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{details.jd_text}</p>

                    <h4 className="font-semibold text-sm mb-1">
                        Matched Candidates ({details.candidates?.length || 0})
                    </h4>
                    <ul className="text-sm text-gray-700 max-h-60 overflow-y-auto border rounded p-2">
                        {details.candidates?.map((c, i) => (
                            <li key={i} className="mb-1">
                                <strong>{c.name}</strong> — {c.designation} ({c.scores.final_score.toFixed(2)})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ProfileMatchHistory;
