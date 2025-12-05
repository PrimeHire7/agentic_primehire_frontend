// import React, { useState, useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scheduler.css";

function isoIST(dateStr, timeStr) {
    const dt = new Date(`${dateStr}T${timeStr}:00+05:30`);
    return dt.toISOString();
}

export default function Scheduler() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const candidateId = params.get("candidateId");
    const candidateName = params.get("candidateName") || "Candidate";

    const jdId = params.get("jd_id");
    const jdToken = params.get("jd_token");  // <-- JD-less mode support

    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    });

    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(null);

    useEffect(() => {
        const slots = [];
        for (let h = 9; h < 18; h++) {
            for (let m of [0, 20, 40]) {
                slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
            }
        }
        setAvailableTimes(slots);
    }, []);

    const handleConfirm = async () => {
        if (!selectedTime) return alert("Select a time slot.");
        if (!candidateId) return alert("Missing candidate ID");

        setLoading(true);

        const start_iso = isoIST(date, selectedTime);
        const startDt = new Date(start_iso);
        const endDt = new Date(startDt.getTime() + 20 * 60 * 1000);

        const payload = {
            candidate_id: candidateId,
            candidate_name: candidateName,
            candidate_email: candidateId, // email = candidateId in your system

            jd_id: jdId === "null" ? null : jdId,
            jd_token: jdToken || null, // <-- SUPPORT JD TOKEN

            start_iso: startDt.toISOString(),
            end_iso: endDt.toISOString(),

            slot_minutes: 20,
        };

        console.log("SCHEDULER PAYLOAD >>>", payload);

        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/jd_history/scheduler/schedule`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const d = await res.json();
            if (!res.ok) {
                alert("Scheduling failed.");
                return;
            }

            setConfirmed({
                candidateId,
                jdId,
                jdToken,
                start_iso: payload.start_iso,
                end_iso: payload.end_iso,
                interview_token: d.interview_token,
            });

            alert("Slot scheduled! Check your email.");
        } catch (err) {
            console.error(err);
            alert("Failed.");
        }

        setLoading(false);
    };

    return (
        <div className="scheduler-container">
            <h2>Schedule Interview</h2>

            <p>
                Candidate: <strong>{candidateName}</strong> ({candidateId})
            </p>

            <p>
                JD ID: {jdId}
                {jdToken && <span> | JD Token: {jdToken}</span>}
            </p>

            <div className="date-section">
                <label>
                    Choose date:
                    <input type="date" value={date}
                        onChange={e => setDate(e.target.value)} />
                </label>
            </div>

            <div className="slots-section">
                <h4>Available Slots (20 min)</h4>
                <div className="slots-grid">
                    {availableTimes.map(t => (
                        <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={selectedTime === t ? "slot-button selected" : "slot-button"}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="actions-section">
                <button className="confirm-button" onClick={handleConfirm} disabled={loading}>
                    {loading ? "Scheduling..." : "Confirm"}
                </button>
                <button className="cancel-button" onClick={() => navigate(-1)}>Cancel</button>
            </div>

            {confirmed && (
                <div className="confirmation-box">
                    <h4>Scheduled</h4>
                    <div>Start: {confirmed.start_iso}</div>
                    <div>End: {confirmed.end_iso}</div>
                    <div>Token: {confirmed.interview_token}</div>
                </div>
            )}
        </div>
    );
}
