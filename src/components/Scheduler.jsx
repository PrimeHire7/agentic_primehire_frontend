// src/components/Scheduler.jsx
import React, { useState, useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scheduler.css"; // keep your CSS; minimal layout assumed

function isoUTC(date, timeStr) {
    // date: YYYY-MM-DD, timeStr: HH:MM (24h). returns ISO string in UTC
    const [h, m] = timeStr.split(":").map((x) => parseInt(x, 10));
    const dt = new Date(date + "T00:00:00Z");
    dt.setUTCHours(h, m, 0, 0);
    return dt.toISOString();
}

export default function Scheduler() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const candidateId = params.get("candidateId");
    const candidateName = params.get("candidateName") || "Candidate";
    const jdId = params.get("jd_id");

    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1); // default tomorrow
        return d.toISOString().slice(0, 10);
    });

    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(null);

    useEffect(() => {
        // build 20-minute slots from 09:00 to 18:00 by default
        const slots = [];
        for (let h = 9; h < 18; h++) {
            for (let m of [0, 20, 40]) {
                const hh = String(h).padStart(2, "0");
                const mm = String(m).padStart(2, "0");
                slots.push(`${hh}:${mm}`);
            }
        }
        setAvailableTimes(slots);
    }, []);

    const handleConfirm = async () => {
        if (!selectedTime) return alert("Select a time slot.");
        if (!candidateId || !jdId) return alert("Missing candidate or JD.");

        setLoading(true);
        const start_iso_utc = isoUTC(date, selectedTime);

        // ⬅️ Add 24 hours
        const startDt = new Date(new Date(start_iso_utc).getTime() + 24 * 60 * 60 * 1000);

        // End time after 20 minutes
        const endDt = new Date(startDt.getTime() + 20 * 60 * 1000);

        const payload = {
            candidate_id: candidateId,
            jd_id: parseInt(jdId, 10),
            start_iso: startDt.toISOString(),
            end_iso: endDt.toISOString(),
            slot_minutes: 20,
        };


        try {
            const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/schedule`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const d = await res.json();
            if (!res.ok) {
                console.error("Schedule err:", d);
                alert("Failed to schedule. See console.");
                setLoading(false);
                return;
            }

            setConfirmed({
                candidateId,
                jdId,
                start_iso: payload.start_iso,
                end_iso: payload.end_iso,
                interview_token: d.interview_token || null,
            });

            alert("✅ Slot requested. You will receive a confirmation email (with interview link).");
        } catch (err) {
            console.error("Schedule error:", err);
            alert("Failed to schedule - see console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Schedule Interview</h2>
            <p>
                Candidate: <strong>{candidateName}</strong> (ID: {candidateId})
            </p>
            <p>Job ID: {jdId}</p>

            <div style={{ marginTop: 12 }}>
                <label>
                    Choose date:
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        style={{ marginLeft: 8 }}
                    />
                </label>
            </div>

            <div style={{ marginTop: 12 }}>
                <h4>Available 20-min slots</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {availableTimes.map((t) => (
                        <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            style={{
                                padding: "8px 12px",
                                borderRadius: 8,
                                border: selectedTime === t ? "2px solid #0b5cff" : "1px solid #ccc",
                                background: selectedTime === t ? "#eaf2ff" : "#fff",
                                cursor: "pointer",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: 16 }}>
                <button onClick={handleConfirm} disabled={loading}>
                    {loading ? "Scheduling..." : "Confirm Slot"}
                </button>
                <button style={{ marginLeft: 8 }} onClick={() => navigate(-1)}>Cancel</button>
            </div>

            {confirmed && (
                <div style={{ marginTop: 16, background: "#f3f3f3", padding: 12 }}>
                    <h4>Scheduled (pending confirmation email)</h4>
                    <div>Start (UTC): {confirmed.start_iso}</div>
                    <div>End (UTC): {confirmed.end_iso}</div>
                    <div>Token: {confirmed.interview_token || "Will be emailed"}</div>
                </div>
            )}
        </div>
    );
}
