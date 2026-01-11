import React, { useState, useEffect } from "react";
import { API_BASE } from "@/utils/constants";
import { useLocation, useNavigate } from "react-router-dom";
import "./Scheduler.css";
import logo from "../assets/primehire_logo.png";

/* ================== CONFIG ================== */
const INTERVIEW_DURATION_MINUTES = 30; // change to 60 if needed

/* ================== HELPERS ================== */
function toISO(date, time) {
    return new Date(`${date}T${time}:00`).toISOString();
}


export default function Scheduler() {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const candidateId = params.get("candidateId");
    // const candidateName = params.get("candidateName") || "Candidate";
    const candidateName = params.get("candidateName") || "";

    const jdId = params.get("jd_id");
    const jdToken = params.get("jd_token");

    /* ================== STATE ================== */
    const [date, setDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().slice(0, 10);
    });

    const [startTime, setStartTime] = useState("10:00");
    const [loading, setLoading] = useState(false);
    const [existing, setExisting] = useState(null);
    const [confirmed, setConfirmed] = useState(null);
    const [rescheduling, setRescheduling] = useState(false);

    /* ================== CHECK EXISTING ================== */
    useEffect(() => {
        if (!candidateId) return;

        const checkExisting = async () => {
            try {
                if (!candidateId || !jdId || !jdToken) return;

                const url =
                    `${API_BASE}/mcp/interview_bot_beta/scheduler/validate_access` +
                    `?candidate_id=${encodeURIComponent(candidateId)}` +
                    `&jd_id=${jdId}` +
                    `&token=${jdToken}`;

                const res = await fetch(url);
                const data = await res.json();

                if (data.ok) setExisting(data);
            } catch (e) {
                console.error("Existing schedule check failed", e);
            }
        };

        checkExisting();
    }, [candidateId, jdId]);

    /* ================== CONFIRM ================== */
    const handleConfirm = async () => {
        if (!candidateId) return alert("Missing candidate ID");

        const start_iso = toISO(date, startTime);
        const startDt = new Date(start_iso);
        const endDt = new Date(
            startDt.getTime() + INTERVIEW_DURATION_MINUTES * 60 * 1000
        );
        const url = rescheduling
            ? `${API_BASE}/mcp/interview_bot_beta/scheduler/reschedule`
            : `${API_BASE}/mcp/interview_bot_beta/scheduler/schedule`;

        const payload = {
            candidate_id: candidateId,
            candidate_name: candidateName,
            candidate_email: candidateId,

            jd_id: jdId === "null" ? null : jdId,
            jd_token: jdToken || null,

            start_iso: startDt.toISOString(),
            end_iso: endDt.toISOString(),
        };

        setLoading(true);

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });


            const data = await res.json();

            if (res.status === 409) {
                alert(
                    `❌ Interview already scheduled\n\n` +
                    `Start: ${new Date(data.detail.slot_start).toLocaleString()}\n` +
                    `End: ${new Date(data.detail.slot_end).toLocaleString()}`
                );
                return;
            }

            if (!res.ok) {
                alert("Scheduling failed.");
                return;
            }

            setConfirmed({
                start: payload.start_iso,
                end: payload.end_iso,
                token: data.interview_token,
            });

            alert("✅ Interview scheduled. Check your email.");
        } catch (err) {
            console.error(err);
            alert("Failed to schedule.");
        } finally {
            setLoading(false);
        }
    };

    /* ================== UI ================== */
    return (
        <div className="scheduler-container">
            <div className="scheduler-header">
                <div className="brand">
                    <img src={logo} alt="PrimeHire" />
                    <div className="brand-text">
                        {/* <span className="brand-name">PrimeHire</span> */}
                        <span className="brand-tagline">Interview Scheduling</span>
                    </div>


                </div>


                <div className="scheduler-card">
                    <div className="info-row">
                        <div className="header-title">
                            <h1>Choose your interview time</h1>
                            <p>
                                Select a convenient date and start time. The interview duration is fixed
                                by the recruiter.
                            </p>
                        </div>
                        {candidateName && (
                            <div>
                                <label>Candidate</label>
                                <div className="value">{candidateName}</div>
                            </div>
                        )}

                        <div>
                            <label>Email</label>
                            <div className="value">{candidateId}</div>
                        </div>
                    </div>

                    <div className="divider" />

                    {existing && !rescheduling && (
                        <div className="existing-box">
                            <h4>Interview Already Scheduled</h4>
                            <p>
                                {new Date(existing.slot_start).toLocaleString()} —{" "}
                                {new Date(existing.slot_end).toLocaleString()}
                            </p>

                            <div className="existing-actions">
                                <button
                                    className="confirm"
                                    onClick={() => {
                                        // prefill with existing time
                                        const d = new Date(existing.slot_start);
                                        setDate(d.toISOString().slice(0, 10));
                                        setStartTime(d.toISOString().slice(11, 16));

                                        setRescheduling(true);
                                    }}
                                >
                                    Reschedule
                                </button>

                                <button className="cancel" onClick={() => navigate(-1)}>
                                    Go Back
                                </button>
                            </div>
                        </div>
                    )}

                    {(!existing || rescheduling) && (
                        <>
                            <div className="grid">
                                <div>
                                    <label>Select Date</label>
                                    <input
                                        type="date"
                                        value={date}
                                        min={new Date().toISOString().slice(0, 10)}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Start Time</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label>Duration</label>
                                    <input
                                        type="text"
                                        value={`${INTERVIEW_DURATION_MINUTES} minutes`}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="preview-box">
                                <strong>
                                    {rescheduling ? "New Interview Window" : "Interview Window"}
                                </strong>
                                <div>
                                    {new Date(toISO(date, startTime)).toLocaleString()} —{" "}
                                    {new Date(
                                        new Date(toISO(date, startTime)).getTime() +
                                        INTERVIEW_DURATION_MINUTES * 60000
                                    ).toLocaleString()}
                                </div>
                                <small>Duration is fixed by the recruiter</small>
                            </div>

                            <div className="actions">
                                <button
                                    className="confirm"
                                    onClick={handleConfirm}
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Saving..."
                                        : rescheduling
                                            ? "Confirm Reschedule"
                                            : "Confirm Schedule"}
                                </button>

                                <button
                                    className="cancel"
                                    onClick={() => {
                                        setRescheduling(false);
                                        navigate(-1);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    )}



                    {confirmed && (
                        <div className="confirmation-box">
                            <h4>✅ Scheduled Successfully</h4>
                            <p>
                                {new Date(confirmed.start).toLocaleString()} —{" "}
                                {new Date(confirmed.end).toLocaleString()}
                            </p>
                            <small>Interview link sent to your email</small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
