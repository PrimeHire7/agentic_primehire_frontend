import React, { useEffect, useState } from "react";
import { Copy, Eye, RefreshCcw } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./JDHistory.css";

const JDHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history`);
            const data = await res.json();
            setHistory(data.history || []);
        } catch (err) {
            console.error("Failed to fetch JD history:", err);
        }
        setLoading(false);
    };

    const openJD = async (id) => {
        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${id}`);
            const data = await res.json();
            setSelected(data);
        } catch (err) {
            console.error("Failed to fetch JD:", err);
        }
    };

    const copyJD = async (text) => {
        await navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 1200);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return (
        <div className="jd-history-container">
            <div className="jd-header">
                <h1 className="jd-title">📄 Generated JD History</h1>
                <button className="jd-button jd-refresh" onClick={fetchHistory}>
                    <RefreshCcw size={16} />
                    Refresh
                </button>
            </div>

            {loading ? (
                <p className="jd-loading">Loading...</p>
            ) : (
                <table className="jd-table">
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Skills</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row) => (
                            <tr key={row.id}>
                                <td>{row.designation}</td>
                                <td>{row.skills}</td>
                                <td>{new Date(row.created_at).toLocaleString()}</td>
                                <td className="jd-actions">
                                    <button
                                        className="jd-button jd-view"
                                        onClick={() => openJD(row.id)}
                                    >
                                        <Eye size={14} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal */}
            {selected && (
                <div className="jd-modal-overlay">
                    <div className="jd-modal">
                        <button className="jd-modal-close" onClick={() => setSelected(null)}>
                            ✖
                        </button>
                        <h2 className="jd-modal-title">{selected.designation}</h2>
                        <p className="jd-modal-skills">Skills: {selected.skills}</p>
                        <div className="jd-modal-text">{selected.jd_text}</div>
                        <button className="jd-copy-button" onClick={() => copyJD(selected.jd_text)}>
                            <Copy size={16} />
                            {copySuccess ? "Copied!" : "Copy JD"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JDHistory;