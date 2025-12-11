import React, { useState, useEffect } from "react";
export default function MCQ({ onComplete }) {
    const [submitted, setSubmitted] = useState(false);

    function handleSubmitMCQ() {
        setSubmitted(true);
        onComplete(); // move to next stage
    }

    if (submitted) return null;

    return (
        <div className="mcq-box">
            <h3>Q1. Which argument is passed to fflush()?</h3>
            <p>A. no parameters</p>
            <p>B. stdin</p>
            <p>C. stdout</p>
            <p>D. stderr</p>

            <h3>Q2. Output of int x = 1/2; ...</h3>
            <pre>{`int x = 1/2; ...`}</pre>
            <p>Answer: 0</p>

            <button className="mcq-submit" onClick={handleSubmitMCQ}>
                Submit MCQ
            </button>
        </div>
    );
}
