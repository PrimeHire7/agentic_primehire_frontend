import React from "react";
import "./OverwriteDialog.css";

export default function OverwriteDialog({ items, onConfirm, onCancel }) {
    return (
        <div className="overwrite-backdrop">
            <div className="overwrite-box">
                <h3>⚠️ Duplicate Candidates Found</h3>
                <p>The following resumes already exist in the database:</p>

                <ul className="overwrite-list">
                    {items.map((d, i) => (
                        <li key={i}>
                            <b>{d.filename}</b>
                            {d.email ? ` — ${d.email}` : ""}
                        </li>
                    ))}
                </ul>

                <p>Do you want to <b>overwrite</b> these existing candidates?</p>

                <div className="overwrite-actions">
                    <button onClick={onConfirm} className="overwrite-btn-confirm">
                        Yes, Overwrite
                    </button>
                    <button onClick={onCancel} className="overwrite-btn-cancel">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
