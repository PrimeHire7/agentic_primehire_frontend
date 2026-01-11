// // import React, { useState, useEffect } from "react";
// // import Editor from "@monaco-editor/react";
// // import "./CodingTestPanel.css";

// // export default function CodingTestPanel({
// //     question = "Write a function to reverse a string.",
// //     language = "javascript",
// //     onComplete
// // }) {
// //     const [code, setCode] = useState("");
// //     const [output, setOutput] = useState("");
// //     const [py, setPy] = useState(null);
// //     const [submitted, setSubmitted] = useState(false);

// //     // Auto-hide coding panel after submission
// //     if (submitted) return null;

// //     /* -------------------------------------------------------
// //        LOAD PYODIDE (only for Python)
// //     ------------------------------------------------------- */
// //     useEffect(() => {
// //         if (language !== "python") return;

// //         async function loadPy() {
// //             console.log("🟦 Loading Pyodide...");
// //             const pyodide = await window.loadPyodide();
// //             setPy(pyodide);
// //             console.log("🟩 Pyodide loaded");
// //         }

// //         loadPy();
// //     }, [language]);


// //     /* -------------------------------------------------------
// //        RUN CODE
// //     ------------------------------------------------------- */
// //     async function runCode() {
// //         setOutput("⏳ Running...");

// //         try {
// //             if (language === "javascript") {
// //                 const safeFn = new Function(code);
// //                 const result = safeFn();
// //                 setOutput(String(result));
// //             }

// //             if (language === "python") {
// //                 if (!py) return setOutput("⏳ Loading Python engine...");
// //                 const result = await py.runPythonAsync(code);
// //                 setOutput(String(result));
// //             }

// //         } catch (err) {
// //             setOutput("❌ Error:\n" + err.message);
// //         }
// //     }


// //     /* -------------------------------------------------------
// //        SUBMIT FINAL ANSWER → move to Stage 3 (AI Interview)
// //     ------------------------------------------------------- */
// //     function submitAnswer() {
// //         setSubmitted(true);
// //         if (onComplete) onComplete();

// //         // Log candidate submission into Transcript
// //         window.dispatchEvent(
// //             new CustomEvent("transcriptAdd", {
// //                 detail: {
// //                     role: "system",
// //                     text: "🧑‍💻 Candidate has submitted the coding test."
// //                 }
// //             })
// //         );
// //     }


// //     return (
// //         <div className="coding-panel">

// //             <h3 className="coding-title">Coding Challenge</h3>

// //             <div className="coding-question">
// //                 {question}
// //             </div>

// //             <Editor
// //                 height="350px"
// //                 defaultLanguage={language}
// //                 theme="vs-dark"
// //                 onChange={(value) => setCode(value)}
// //                 defaultValue={
// //                     `// Write your answer here
// // // Example:
// // function reverse(str) {
// //     return str.split("").reverse().join("");
// // }

// // console.log(reverse("hello"));
// // `
// //                 }
// //             />

// //             <div className="coding-buttons">
// //                 <button className="run-btn" onClick={runCode}>
// //                     ▶ Run Code
// //                 </button>

// //                 <button className="submit-btn" onClick={submitAnswer}>
// //                     ✔ Submit Coding Test
// //                 </button>
// //             </div>

// //             <pre className="coding-output">{output}</pre>
// //         </div>
// //     );
// // }
// // // FILE: src/interview/CodingTestPanel.jsx
// // import React, { useState, useEffect } from "react";
// // import Editor from "@monaco-editor/react";
// // import "./CodingTestPanel.css";

// // export default function CodingTestPanel({
// //     question = "Write a function to reverse a string.",
// //     language = "javascript",
// //     onComplete,
// // }) {
// //     const [code, setCode] = useState("");
// //     const [output, setOutput] = useState("");
// //     const [py, setPy] = useState(null);

// //     /* ---------------- LOAD PYODIDE (PYTHON ONLY) ---------------- */
// //     useEffect(() => {
// //         if (language !== "python") return;

// //         async function loadPy() {
// //             const pyodide = await window.loadPyodide();
// //             setPy(pyodide);
// //         }

// //         loadPy();
// //     }, [language]);

// //     /* ---------------- RUN CODE ---------------- */
// //     async function runCode() {
// //         setOutput("⏳ Running...");

// //         try {
// //             if (language === "javascript") {
// //                 const fn = new Function(code);
// //                 const result = fn();
// //                 setOutput(String(result));
// //             }

// //             if (language === "python") {
// //                 if (!py) return setOutput("⏳ Loading Python...");
// //                 const result = await py.runPythonAsync(code);
// //                 setOutput(String(result));
// //             }
// //         } catch (err) {
// //             setOutput("❌ Error:\n" + err.message);
// //         }
// //     }

// //     /* ---------------- SUBMIT ---------------- */
// //     function submitAnswer() {
// //         if (!onComplete) return;

// //         onComplete({
// //             submitted: true,
// //             systemMessage: "🧑‍💻 Candidate has submitted the coding test.",
// //             code,
// //             language,
// //         });
// //     }

// //     return (
// //         <div className="coding-panel">
// //             <h3 className="coding-title">Coding Challenge</h3>

// //             <div className="coding-question">{question}</div>

// //             <Editor
// //                 height="350px"
// //                 theme="vs-dark"
// //                 defaultLanguage={language}
// //                 defaultValue="// Write your answer here"
// //                 onChange={(v) => setCode(v || "")}
// //             />

// //             <div className="coding-buttons">
// //                 <button className="run-btn" onClick={runCode}>
// //                     ▶ Run Code
// //                 </button>

// //                 <button className="submit-btn" onClick={submitAnswer}>
// //                     ✔ Submit Coding Test
// //                 </button>
// //             </div>

// //             <pre className="coding-output">{output}</pre>
// //         </div>
// //     );
// // }
// import React, { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react";
// import "./CodingTestPanel.css";

// export default function CodingTestPanel({
//     question = "Write a function to reverse a string.",
//     language = "javascript",
//     onComplete,
// }) {
//     const [code, setCode] = useState("");
//     const [output, setOutput] = useState("");
//     const [py, setPy] = useState(null);

//     /* ================= LOAD PYODIDE ================= */
//     useEffect(() => {
//         if (language !== "python") return;

//         async function loadPy() {
//             const pyodide = await window.loadPyodide();
//             setPy(pyodide);
//         }

//         loadPy();
//     }, [language]);

//     /* ================= RUN CODE ================= */
//     async function runCode() {
//         setOutput("⏳ Running...");

//         try {
//             if (language === "javascript") {
//                 // safer execution
//                 const fn = new Function(`
//           ${code}
//           return typeof solution === "function"
//             ? solution()
//             : undefined;
//         `);
//                 const result = fn();
//                 setOutput(String(result));
//             }

//             if (language === "python") {
//                 if (!py) return setOutput("⏳ Loading Python...");
//                 const result = await py.runPythonAsync(code);
//                 setOutput(String(result));
//             }
//         } catch (err) {
//             setOutput("❌ Error:\n" + err.message);
//         }
//     }

//     /* ================= SUBMIT ================= */
//     function submitAnswer() {
//         if (!onComplete) return;

//         // basic scoring heuristic (can improve later)
//         const score =
//             code && code.trim().length > 20
//                 ? Math.min(100, 40 + code.length)
//                 : 0;

//         onComplete({
//             score,
//             solution: code, // ✅ CERTIFICATE EXPECTS THIS
//             language,
//             output,
//             question,
//         });
//     }

//     return (
//         <div className="coding-panel">
//             <h3 className="coding-title">Coding Challenge</h3>

//             <div className="coding-question">{question}</div>

//             <Editor
//                 height="350px"
//                 theme="vs-dark"
//                 language={language}
//                 value={code}
//                 onChange={(v) => setCode(v || "")}
//             />

//             <div className="coding-buttons">
//                 <button className="run-btn" onClick={runCode}>
//                     ▶ Run Code
//                 </button>

//                 <button
//                     className="submit-btn"
//                     disabled={!code.trim()}
//                     onClick={submitAnswer}
//                 >
//                     ✔ Submit Coding Test
//                 </button>
//             </div>

//             <pre className="coding-output">{output}</pre>
//         </div>
//     );
// }
import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import "./CodingTestPanel.css";

const LANGUAGES = [
    { label: "JavaScript", value: "javascript" },
    { label: "Python", value: "python" },
];

export default function CodingTestPanel({
    question = "Write a function to reverse a string.",
    onComplete,
}) {
    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");
    const [py, setPy] = useState(null);
    const [loadingPy, setLoadingPy] = useState(false);

    /* ================= LOAD PYODIDE WHEN PYTHON SELECTED ================= */
    useEffect(() => {
        if (language !== "python") return;

        let cancelled = false;

        async function loadPyodideRuntime() {
            setLoadingPy(true);
            try {
                const pyodide = await window.loadPyodide();
                if (!cancelled) setPy(pyodide);
            } catch (e) {
                console.error("❌ Pyodide load failed", e);
            } finally {
                if (!cancelled) setLoadingPy(false);
            }
        }

        if (!py) loadPyodideRuntime();

        return () => {
            cancelled = true;
        };
    }, [language]);

    /* ================= RUN CODE ================= */
    async function runCode() {
        setOutput("⏳ Running...");

        try {
            if (language === "javascript") {
                const fn = new Function(`
          ${code}
          if (typeof solution === "function") {
            return solution();
          }
          return undefined;
        `);

                const result = fn();
                setOutput(String(result));
            }

            if (language === "python") {
                if (!py) {
                    setOutput("⏳ Python runtime loading...");
                    return;
                }

                const result = await py.runPythonAsync(code);
                setOutput(String(result));
            }
        } catch (err) {
            setOutput("❌ Error:\n" + err.message);
        }
    }

    /* ================= SUBMIT ================= */
    function submitAnswer() {
        if (!onComplete) return;

        const score =
            code && code.trim().length > 20
                ? Math.min(100, 40 + code.length)
                : 0;

        onComplete({
            score,
            solution: code, // ✅ certificate reads this
            language,
            output,
            question,
        });
    }

    return (
        <div className="coding-panel">
            <h3 className="coding-title">Coding Challenge</h3>

            <div className="coding-question">{question}</div>

            {/* ================= LANGUAGE SELECTOR ================= */}
            <div className="language-selector">
                <label>Select Language</label>
                <select
                    value={language}
                    onChange={(e) => {
                        setLanguage(e.target.value);
                        setCode("");
                        setOutput("");
                    }}
                >
                    {LANGUAGES.map((l) => (
                        <option key={l.value} value={l.value}>
                            {l.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* ================= CODE EDITOR ================= */}
            <Editor
                height="350px"
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    automaticLayout: true,
                }}
            />

            {/* ================= ACTION BUTTONS ================= */}
            <div className="coding-buttons">
                <button className="run-btn" onClick={runCode}>
                    ▶ Run Code
                </button>

                <button
                    className="submit-btn"
                    disabled={!code.trim() || loadingPy}
                    onClick={submitAnswer}
                >
                    ✔ Submit Coding Test
                </button>
            </div>

            {/* ================= OUTPUT ================= */}
            <pre className="coding-output">
                {loadingPy ? "⏳ Loading Python runtime..." : output}
            </pre>
        </div>
    );
}
