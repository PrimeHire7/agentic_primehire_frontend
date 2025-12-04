// import React, { useEffect, useRef, useState } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Send, Paperclip, Mic } from "lucide-react";
// import "./ChatInput.css";
// import "./ChatInput.responsive.css";

// const ChatInput = ({
//   onSend,
//   onFileUpload,
//   placeholder = "Ask PrimeHire anything…",
//   activeTask: propActiveTask = null,
// }) => {
//   const [input, setInput] = useState("");
//   const [activeTask, setActiveTask] = useState(null);
//   const [suggestions, setSuggestions] = useState([]);
//   const [suggestionsVisible, setSuggestionsVisible] = useState(false);

//   const textareaRef = useRef(null);
//   const fileInputRef = useRef(null);

//   /* ------------------------------------------------------------
//      INTERNAL KEY MAP
//   ------------------------------------------------------------ */
//   const internalKeyFor = {
//     "JD Creator": "JD Creator",
//     "Profile Matcher": "Profile Matcher",
//     "Upload Resumes": "Upload Resumes",
//   };

//   /* ------------------------------------------------------------
//      TOP BUTTONS (REPLACES DROPDOWN)
//   ------------------------------------------------------------ */
//   const taskButtons = [
//     "JD Creator",
//     "Profile Matcher",
//     "Upload Resumes",
//   ];

//   /* ------------------------------------------------------------
//      FIXED PROMPT CHIPS
//   ------------------------------------------------------------ */
//   const promptChips = {
//     "JD Creator": [
//       {
//         label: "✨ Senior React Developer @ PrimeHire",
//         text:
//           "Start JD Creator: Create a JD for a Senior React Developer at PrimeHire — 5 years experience, Bangalore, React, Redux, TypeScript.",
//       },
//       {
//         label: "🤖 AI Engineer @ Nirmata",
//         text:
//           "Start JD Creator: Create a JD for an AI Engineer at Nirmata Neurotech — 3+ years experience, Hyderabad, Python, LLMs, Vector DBs.",
//       },
//     ],

//     "Profile Matcher": [
//       {
//         label: "🔍 React Developer",
//         text:
//           "Start Profile Matcher: React Developer — 2–4 years experience, strong in React, JavaScript, APIs.",
//       },
//       {
//         label: "🤖 Generative AI Engineer",
//         text:
//           "Start Profile Matcher: Generative AI Engineer — 4–6 years experience, strong in LLMs, RAG pipelines, multi-agent systems, vector DB (Pinecone/Chroma), FastAPI, AWS.",
//       },
//     ],

//     "Upload Resumes": [
//       {
//         label: "📤 Upload All Resumes",
//         text:
//           "Start Upload Resumes: Upload all candidate resumes for bulk processing.",
//       },
//       {
//         label: "🗂 Bulk Extract",
//         text:
//           "Start Upload Resumes: Bulk extract skills and experience from multiple resumes.",
//       },
//     ],
//   };

//   /* ------------------------------------------------------------
//      PREFIX SYSTEM
//   ------------------------------------------------------------ */
//   const getPrefix = (task = activeTask) => {
//     const map = {
//       "JD Creator": "Start JD Creator: ",
//       "Profile Matcher": "Start Profile Matcher: ",
//       "Upload Resumes": "Start Upload Resumes: ",
//     };
//     return map[task] || "";
//   };

//   const enforcePrefix = (value) => {
//     const prefix = getPrefix(activeTask);
//     if (!prefix) return value;
//     if (!value.startsWith(prefix)) return prefix + value.trimStart();
//     return value;
//   };

//   /* ------------------------------------------------------------
//      SUGGESTIONS
//   ------------------------------------------------------------ */
//   const suggestionPool = [
//     "React", "Redux", "TypeScript", "Node.js", "API", "AWS",
//     "MongoDB", "Remote", "Hyderabad", "Bangalore",
//     "Python", "Transformers", "LLMs"
//   ];

//   const updateSuggestions = (value) => {
//     const prefix = getPrefix(activeTask);
//     const actual = prefix ? value.slice(prefix.length) : value;

//     if (actual.length < 2) return setSuggestionsVisible(false);

//     const filtered = suggestionPool.filter((w) =>
//       w.toLowerCase().includes(actual.toLowerCase())
//     );

//     setSuggestions(filtered.slice(0, 6));
//     setSuggestionsVisible(true);
//   };

//   const acceptSuggestion = (word) => {
//     setInput((prev) => {
//       const prefix = getPrefix(activeTask);
//       const next = prev.trim() ? prev + " " + word : prefix + word;
//       setSuggestionsVisible(false);
//       return next;
//     });
//   };

//   /* ------------------------------------------------------------
//      PARENT SYNC
//   ------------------------------------------------------------ */
//   useEffect(() => {
//     if (propActiveTask) {
//       setActiveTask(propActiveTask);
//       setInput(getPrefix(propActiveTask));
//     }
//   }, [propActiveTask]);

//   /* ------------------------------------------------------------
//      SEND MESSAGE
//   ------------------------------------------------------------ */
//   const send = () => {
//     const trimmed = input.trim();
//     if (!trimmed) return;
//     onSend?.(trimmed);
//     setInput("");
//     setActiveTask(null);
//   };

//   /* ------------------------------------------------------------
//      RENDER
//   ------------------------------------------------------------ */
//   return (
//     <div className="ci-shell">

//       {/* LEFT: file upload */}
//       <button
//         className="ci-icon-btn ci-file-btn"
//         onClick={() => fileInputRef.current?.click()}
//       >
//         <Paperclip className="w-5 h-5" />
//       </button>

//       <input
//         ref={fileInputRef}
//         type="file"
//         multiple
//         style={{ display: "none" }}
//         onChange={(e) => onFileUpload?.(Array.from(e.target.files))}
//       />

//       {/* CENTER */}
//       <div className="ci-center">

//         {/* TOP THREE BUTTONS */}
//         <div className="ci-top-buttons">
//           {taskButtons.map((t) => (
//             <button
//               key={t}
//               className={`ci-task-btn ${activeTask === t ? "active" : ""}`}
//               onClick={() => {
//                 setActiveTask(t);
//                 setInput(getPrefix(t));
//               }}
//             >
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* CHIPS */}
//         {activeTask && promptChips[activeTask] && (
//           <div className="ci-chip-row">
//             {promptChips[activeTask].map((chip, idx) => (
//               <div
//                 key={idx}
//                 className="ci-chip"
//                 onClick={() => {
//                   setInput(enforcePrefix(chip.text));
//                 }}
//               >
//                 {chip.label}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* TEXTAREA */}
//         <div className="ci-textarea-wrapper">
//           <Textarea
//             className="ci-textarea"
//             placeholder={placeholder}
//             value={input}
//             ref={textareaRef}
//             onChange={(e) => {
//               const enforced = enforcePrefix(e.target.value);
//               setInput(enforced);
//               updateSuggestions(enforced);
//             }}
//           />

//           {suggestionsVisible && (
//             <div className="ci-suggestions">
//               {suggestions.map((s, idx) => (
//                 <div
//                   key={idx}
//                   className="ci-suggestion-item"
//                   onMouseDown={() => acceptSuggestion(s)}
//                 >
//                   {s}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT: Mic + Send */}
//       <div className="ci-right">
//         <button className="ci-icon-btn ci-mic-btn">
//           <Mic className="w-5 h-5" />
//         </button>

//         <button className="ci-send-btn" onClick={send}>
//           <Send className="w-5 h-5" />
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ChatInput;
import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic } from "lucide-react";
import "./ChatInput.css";
import "./ChatInput.responsive.css";

const ChatInput = ({
  onSend,
  onFileUpload,
  placeholder = "Ask PrimeHire anything…",
  activeTask: propActiveTask = null,
}) => {
  const [input, setInput] = useState("");

  // ⭐ DEFAULT TASK ALWAYS PROFILE MATCHER
  const [activeTask, setActiveTask] = useState("Profile Matcher");

  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ------------------------------------------------------------
     PERMANENT ORDER OF TASK BUTTONS
  ------------------------------------------------------------ */
  const taskButtons = [
    "Profile Matcher",
    "JD Creator",
    "Upload Resumes",
  ];

  /* ------------------------------------------------------------
     PREFIX SYSTEM
  ------------------------------------------------------------ */
  const prefixMap = {
    "JD Creator": "Start JD Creator: ",
    "Profile Matcher": "Start Profile Matcher: ",
    "Upload Resumes": "Start Upload Resumes: ",
  };

  const getPrefix = (task = activeTask) => prefixMap[task] || "";

  const enforcePrefix = (value) => {
    const prefix = getPrefix(activeTask);
    if (!prefix) return value;
    if (!value.startsWith(prefix)) return prefix + value.trimStart();
    return value;
  };

  /* ------------------------------------------------------------
     CHIPS
  ------------------------------------------------------------ */
  const promptChips = {
    "JD Creator": [
      {
        label: "✨ Senior React Developer",
        text:
          "Start JD Creator: Create a JD for a Senior React Developer — 5 years exp, React, Redux, TypeScript.",
      },
      {
        label: "🤖 AI Engineer",
        text:
          "Start JD Creator: Create a JD for an AI Engineer — 3+ years exp, Python, LLMs, Vector DBs.",
      },
    ],

    "Profile Matcher": [
      {
        label: "🔍 React Developer",
        text:
          "Start Profile Matcher: React Developer — 2–4 years exp, React, JS, APIs.",
      },
      {
        label: "🤖 Generative AI Engineer",
        text:
          "Start Profile Matcher: Generative AI Engineer — 4–6 years exp, LLMs, RAG, agents, AWS.",
      },
    ],

    "Upload Resumes": [
      {
        label: "📤 Upload All Resumes",
        text: "Start Upload Resumes: Upload all candidate resumes.",
      },
      {
        label: "🗂 Bulk Extract",
        text: "Start Upload Resumes: Bulk extract skill data.",
      },
    ],
  };

  /* ------------------------------------------------------------
     AUTOCOMPLETE SUGGESTIONS
  ------------------------------------------------------------ */
  const suggestionPool = [
    "React", "Redux", "TypeScript", "Node.js", "API", "AWS",
    "MongoDB", "Hyderabad", "Bangalore",
    "Python", "LLMs", "Transformers", "Remote"
  ];

  const updateSuggestions = (value) => {
    const prefix = getPrefix(activeTask);
    const actual = prefix ? value.slice(prefix.length) : value;

    if (actual.length < 2) return setSuggestionsVisible(false);

    const filtered = suggestionPool.filter((w) =>
      w.toLowerCase().includes(actual.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 6));
    setSuggestionsVisible(true);
  };

  const acceptSuggestion = (word) => {
    setInput((prev) => {
      const prefix = getPrefix(activeTask);
      const next = prev.trim()
        ? prev + " " + word
        : prefix + word;

      setSuggestionsVisible(false);
      return next;
    });
  };

  /* ------------------------------------------------------------
     WHEN ACTIVE TASK IS FORCED FROM PARENT
  ------------------------------------------------------------ */
  useEffect(() => {
    if (propActiveTask) {
      setActiveTask(propActiveTask);
      setInput(getPrefix(propActiveTask));
    }
  }, [propActiveTask]);

  /* ------------------------------------------------------------
     AUTO-SET DEFAULT PREFIX ON LOAD
  ------------------------------------------------------------ */
  useEffect(() => {
    setInput(getPrefix("Profile Matcher"));
  }, []);

  /* ------------------------------------------------------------
     SEND MESSAGE
  ------------------------------------------------------------ */
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    onSend?.(trimmed);

    // After sending → reset back to Profile Matcher with empty box
    setActiveTask("Profile Matcher");
    setInput(getPrefix("Profile Matcher"));
  };

  /* ------------------------------------------------------------
     RENDER UI
  ------------------------------------------------------------ */
  return (
    <div className="ci-shell">

      {/* LEFT: FILE UPLOAD BUTTON */}
      <button
        className="ci-icon-btn ci-file-btn"
        onClick={() => fileInputRef.current?.click()}
      >
        <Paperclip className="w-5 h-5" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onFileUpload?.(Array.from(e.target.files))}
      />

      {/* CENTER */}
      <div className="ci-center">

        {/* ⭐ TASK BUTTONS — ALWAYS THIS ORDER */}
        <div className="ci-top-buttons">
          {taskButtons.map((t) => (
            <button
              key={t}
              className={`ci-task-btn ${activeTask === t ? "active" : ""}`}
              onClick={() => {
                setActiveTask(t);
                setInput(getPrefix(t));
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CHIPS */}
        {activeTask && promptChips[activeTask] && (
          <div className="ci-chip-row">
            {promptChips[activeTask].map((chip, idx) => (
              <div
                key={idx}
                className="ci-chip"
                onClick={() => setInput(enforcePrefix(chip.text))}
              >
                {chip.label}
              </div>
            ))}
          </div>
        )}

        {/* TEXTAREA */}
        <div className="ci-textarea-wrapper">
          <Textarea
            className="ci-textarea"
            placeholder={placeholder}
            value={input}
            ref={textareaRef}
            onChange={(e) => {
              const enforced = enforcePrefix(e.target.value);
              setInput(enforced);
              updateSuggestions(enforced);
            }}
          />

          {suggestionsVisible && (
            <div className="ci-suggestions">
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  className="ci-suggestion-item"
                  onMouseDown={() => acceptSuggestion(s)}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT — MIC + SEND */}
      <div className="ci-right">
        <button className="ci-icon-btn ci-mic-btn">
          <Mic className="w-5 h-5" />
        </button>

        <button className="ci-send-btn" onClick={send}>
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};

export default ChatInput;
