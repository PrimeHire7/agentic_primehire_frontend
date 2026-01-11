import React, { useState } from "react";
import "./MCQ.css"; // ✅ make sure this file is imported

export default function MCQ({ questions = [], onComplete }) {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    if (!questions || questions.length === 0) {
        return <div className="mcq-box">Loading MCQs…</div>;
    }

    const handleSelect = (qIndex, optionIndex) => {
        const letter = ["A", "B", "C", "D"][optionIndex];

        setAnswers((prev) => ({
            ...prev,
            [qIndex]: letter, // ✅ store A/B/C/D
        }));
    };

    const handleSubmit = () => {
        let score = 0;

        questions.forEach((q, idx) => {
            if (answers[idx] === q.correct) score++;
        });

        const orderedAnswers = questions.map((_, i) => answers[i] || null);

        const mcqResult = {
            total: questions.length,
            score,
            questions,
            answers: orderedAnswers,
        };

        setSubmitted(true);
        onComplete(mcqResult);
    };

    if (submitted) return null;

    return (
        <div className="mcq-box">
            <h2 className="mcq-title">MCQ Round</h2>

            {questions.map((q, idx) => (
                <div key={idx} className="mcq-question-block">
                    <h3>
                        Q{idx + 1}. {q.question}
                    </h3>

                    <div className="mcq-options">
                        {q.options.map((opt, i) => (
                            <label key={i} className="mcq-option">
                                <input
                                    type="radio"
                                    name={`q-${idx}`}
                                    checked={answers[idx] === ["A", "B", "C", "D"][i]}
                                    onChange={() => handleSelect(idx, i)}
                                />
                                <span className="option-text">
                                    {["A", "B", "C", "D"][i]}. {opt}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button
                className="mcq-submit"
                disabled={Object.keys(answers).length !== questions.length}
                onClick={handleSubmit}
            >
                Submit MCQ
            </button>
        </div>
    );
}
