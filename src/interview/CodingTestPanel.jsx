import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./CodingTestPanel.css";

export default function CodingTestPanel({
    question = "Write a function to reverse a string.",
    language = "javascript",
    onComplete
}) {
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [py, setPy] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Auto-hide coding panel after submission
    if (submitted) return null;

    /* -------------------------------------------------------
       LOAD PYODIDE (only for Python)
    ------------------------------------------------------- */
    useEffect(() => {
        if (language !== "python") return;

        async function loadPy() {
            console.log("🟦 Loading Pyodide...");
            const pyodide = await window.loadPyodide();
            setPy(pyodide);
            console.log("🟩 Pyodide loaded");
        }

        loadPy();
    }, [language]);


    /* -------------------------------------------------------
       RUN CODE
    ------------------------------------------------------- */
    async function runCode() {
        setOutput("⏳ Running...");

        try {
            if (language === "javascript") {
                const safeFn = new Function(code);
                const result = safeFn();
                setOutput(String(result));
            }

            if (language === "python") {
                if (!py) return setOutput("⏳ Loading Python engine...");
                const result = await py.runPythonAsync(code);
                setOutput(String(result));
            }

        } catch (err) {
            setOutput("❌ Error:\n" + err.message);
        }
    }


    /* -------------------------------------------------------
       SUBMIT FINAL ANSWER → move to Stage 3 (AI Interview)
    ------------------------------------------------------- */
    function submitAnswer() {
        setSubmitted(true);
        if (onComplete) onComplete();

        // Log candidate submission into Transcript
        window.dispatchEvent(
            new CustomEvent("transcriptAdd", {
                detail: {
                    role: "system",
                    text: "🧑‍💻 Candidate has submitted the coding test."
                }
            })
        );
    }


    return (
        <div className="coding-panel">

            <h3 className="coding-title">Coding Challenge</h3>

            <div className="coding-question">
                {question}
            </div>

            <Editor
                height="350px"
                defaultLanguage={language}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
                defaultValue={
                    `// Write your answer here
// Example:
function reverse(str) {
    return str.split("").reverse().join("");
}

console.log(reverse("hello"));
`
                }
            />

            <div className="coding-buttons">
                <button className="run-btn" onClick={runCode}>
                    ▶ Run Code
                </button>

                <button className="submit-btn" onClick={submitAnswer}>
                    ✔ Submit Coding Test
                </button>
            </div>

            <pre className="coding-output">{output}</pre>
        </div>
    );
}
