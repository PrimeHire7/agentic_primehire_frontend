import React, { useState, useEffect } from "react";

export default function MCQ({ questions = [], onComplete }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (!questions || questions.length === 0)
        return <div>Loading MCQ...</div>;

    function handleSelect(qIndex, option) {
        setAnswers((prev) => ({
            ...prev,
            [qIndex]: option,
        }));
    }

    function handleSubmit() {
        // Calculate score
        let score = 0;
        questions.forEach((q, idx) => {
            const userAns = answers[idx];
            const correctOpt = q.options[q.correct === "A" ? 0 : q.correct === "B" ? 1 : q.correct === "C" ? 2 : 3];

            if (userAns === correctOpt) score += 1;
        });

        const mcqResult = {
            total: questions.length,
            score,
            answers,
            questions
        };

        setSubmitted(true);
        onComplete(mcqResult);   // PASS TO INTERVIEWMODE
    }

    if (submitted) return null;

    return (
        <div className="mcq-box">
            <h2>MCQ Round</h2>

            {questions.map((q, idx) => (
                <div key={idx} className="mcq-question-block">
                    <h3>Q{idx + 1}. {q.question}</h3>

                    {q.options.map((opt, i) => (
                        <label key={i} style={{ display: "block", marginBottom: "6px" }}>
                            <input
                                type="radio"
                                name={`q${idx}`}
                                value={opt}
                                onChange={() => handleSelect(idx, opt)}
                            />
                            {" "}
                            {opt}
                        </label>
                    ))}
                </div>
            ))}

            <button className="mcq-submit" onClick={handleSubmit}>
                Submit MCQ
            </button>
        </div>
    );
}
