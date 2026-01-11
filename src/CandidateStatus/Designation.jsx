
// 📁 src/pages/Designation.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import "./Designation.css";
import { FaSuitcase } from "react-icons/fa6";
import { FaUsers } from "react-icons/fa";


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
            <h2 className="jd-title">
                <span><FaSuitcase /></span> Job Designations
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
                            <h3 className="jd-titlee">{item.designation}</h3>

                            <p className="sub-info">
                                <FaUsers /> {item.candidateCount} Candidate
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
