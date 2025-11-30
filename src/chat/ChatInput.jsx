import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, ChevronDown, Zap, ListTodo, Mic } from "lucide-react";
import "./ChatInput.css";

const ChatInput = ({
  onSend,
  onFileUpload,
  placeholder = "Ask PrimeHire anything…",
  activeTask: propActiveTask = null,
  forceShowChips = false,
}) => {
  const [input, setInput] = useState("");
  const [showTasksDropdown, setShowTasksDropdown] = useState(true);
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const tasksRef = useRef(null);
  const featuresRef = useRef(null);
  useEffect(() => {
    const update = () => {
      const el = document.querySelector(".ci-shell");
      if (el) {
        const safe = el.offsetHeight + 40;
        document.documentElement.style.setProperty("--ci-safe-height", `${safe}px`);
      }
    };
    update();
    const obs = new ResizeObserver(update);
    const shell = document.querySelector(".ci-shell");
    if (shell) obs.observe(shell);
    return () => obs.disconnect();
  }, []);

  /* ============================================================
     ⭐ INTERNAL TOKEN MAPPING (CRITICAL FOR WS ROUTING)
  ============================================================ */
  const internalKeyFor = {
    "JD Creator": "JD Creator",
    "Profile Matcher": "Profile Matcher",
    "Upload Resumes": "Upload Resumes",
    "Interview Bot": "InterviewBot",

    // NEW FIX: history & status modules
    "JD History": "JDHistory",
    "Match History": "ProfileMatchHistory",
    "Candidate Status": "CandidateStatus",
  };

  const tasks = [
    "JD Creator",
    "Profile Matcher",
    "Upload Resumes",
    "Interview Bot",
    "JD History",
    "Match History",
    "Candidate Status",
  ];

  /* ============================================================
     ⭐ Prompt Chips for Quick Actions
  ============================================================ */
  const promptChips = {
    "JD Creator": [
      {
        label: "✨ Senior React Developer @ PrimeHire",
        text:
          "Start JD Creator: Create a JD for a Senior React Developer at PrimeHire — 5 years experience, Bangalore, React, Redux, TypeScript.",
      },
      {
        label: "🤖 AI Engineer @ Nirmata",
        text:
          "Start JD Creator: Create a JD for an AI Engineer at Nirmata Neurotech — 3+ years experience, Python, LLMs, Vector DBs.",
      },
    ],
    "Profile Matcher": [
      {
        label: "🔍 React Developer",
        text:
          "Start Profile Matcher: React Developer — 2–4 years experience, strong in React, JavaScript, APIs.",
      },
      {
        label: "⚡ Node.js Backend",
        text:
          "Start Profile Matcher: Node.js Backend Developer — REST APIs, MongoDB, Postgres, AWS.",
      },
    ],
    "Upload Resumes": [
      {
        label: "📤 Upload All Resumes",
        text: "Start Upload Resumes: Upload all candidate resumes for bulk processing.",
      },
      {
        label: "🗂 Bulk Extract",
        text:
          "Start Upload Resumes: Bulk extract skills and experience from multiple resumes.",
      },
    ],
    "Interview Bot": [
      {
        label: "🎤 Quick Candidate Screen",
        text:
          "Start InterviewBot: Run a 5-min voice screening for the candidate — focus on communication and problem solving.",
      },
      {
        label: "🎥 Full Video Interview",
        text:
          "Start InterviewBot: Run a full video interview simulation — include technical and behavioral questions.",
      },
    ],
    "JD History": [
      { label: "🕘 Recent JDs", text: "Show JDHistory: Fetch last 10 job descriptions." },
    ],
    "Match History": [
      { label: "📈 Last Matches", text: "Show ProfileMatchHistory: recent match runs." },
    ],
    "Candidate Status": [
      {
        label: "📌 Candidate Overview",
        text: "Show CandidateStatus: Overview of candidate pipeline.",
      },
    ],
  };

  /* ============================================================
     ⭐ Prefix builder
  ============================================================ */
  const getPrefix = (task = activeTask) => {
    if (!task) return "";
    if (task === "JD Creator") return "Start JD Creator: ";
    if (task === "Profile Matcher") return "Start Profile Matcher: ";
    if (task === "Upload Resumes") return "Start Upload Resumes: ";
    if (task === "InterviewBot" || task === "Interview Bot")
      return "Start InterviewBot: ";
    return "";
  };

  const enforcePrefix = (value) => {
    const prefix = getPrefix(activeTask);
    if (!prefix) return value;
    if (!value.startsWith(prefix)) return prefix + value.trimStart();
    return value;
  };

  /* ============================================================
     ⭐ Auto-complete logic
  ============================================================ */
  const suggestionPool = [
    "React",
    "Redux",
    "TypeScript",
    "Node.js",
    "API",
    "AWS",
    "MongoDB",
    "Remote",
    "Hyderabad",
    "Bangalore",
    "Python",
    "Transformers",
    "LLMs",
  ];

  const updateSuggestions = (value) => {
    const prefix = getPrefix(activeTask);
    const actual = prefix ? value.slice(prefix.length) : value;
    if (actual.length < 2) {
      setSuggestionsVisible(false);
      return;
    }
    const filtered = suggestionPool.filter((w) =>
      w.toLowerCase().includes(actual.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 6));
    setSuggestionsVisible(true);
  };

  const acceptSuggestion = (word) => {
    setInput((prev) => {
      const prefix = getPrefix(activeTask);
      const next = prev.trim() ? prev + " " + word : prefix + word;
      setSuggestionsVisible(false);
      return next;
    });
  };

  /* ============================================================
     ⭐ Handle chip click — with INTERNAL TOKEN FIX
  ============================================================ */
  const handleChipClick = (taskFriendly, text) => {
    const internal = internalKeyFor[taskFriendly] || taskFriendly;

    // Set task + prefix
    setActiveTask(internal);

    // Pre-fill the textarea with chip text (NOT sending)
    const enforced = enforcePrefix(text);
    setInput(enforced);

    // ❌ No auto send here
  };


  /* ============================================================
     ⭐ Respect parent activeTask
  ============================================================ */
  useEffect(() => {
    if (propActiveTask) {
      const internal = internalKeyFor[propActiveTask] || propActiveTask;
      setActiveTask(internal);
      setInput(getPrefix(internal));
    }
  }, [propActiveTask]);

  /* ============================================================
     ⭐ Sending message
  ============================================================ */
  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setInput("");
    setActiveTask(null);
  };
  useEffect(() => {
    const updateHeight = () => {
      const el = document.querySelector(".ci-shell");
      if (el) {
        document.documentElement.style.setProperty(
          "--ci-height",
          `${el.offsetHeight + 40}px`
        );
      }
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.querySelector(".ci-shell"));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="chat-input-wrapper">
      <div className="ci-shell">

        {/* LEFT ACTION: FILE UPLOAD */}
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

        {/* CENTER AREA */}
        <div className="ci-center">

          {/* TOP ROW : FEATURES + TASKS */}
          <div className="ci-top-row">

            {/* FEATURES DROPDOWN */}
            <div className="ci-dropdown-wrapper">
              <button
                className="ci-dropdown-trigger"
                onClick={() => {
                  setShowFeaturesDropdown((s) => !s);
                  setShowTasksDropdown(false);
                }}
              >
                <Zap className="w-4 h-4" />
                <span>Features</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showFeaturesDropdown && (
                <div className="ci-dropdown-menu">
                  {["ZohoBridge", "MailMind", "LinkedInPoster", "PrimeHireBrain", "Interview Bot"].map(
                    (f, i) => (
                      <button
                        key={i}
                        className="ci-dropdown-item"
                        onClick={() => {
                          const internal = internalKeyFor[f] || f;
                          setActiveTask(internal);
                          setInput(getPrefix(internal));
                        }}
                      >
                        {f}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* TASKS DROPDOWN (ALWAYS OPEN) */}
            <div className="ci-dropdown-wrapper">
              <button
                className="ci-dropdown-trigger always-open-trigger"
                onClick={() => setShowTasksDropdown(!showTasksDropdown)}
              >
                <ListTodo className="w-4 h-4" />
                <span>Tasks</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTasksDropdown && (
                <div className="ci-dropdown-menu ci-task-menu">
                  {tasks.map((t, i) => (
                    <button
                      key={i}
                      className={`ci-dropdown-item ${activeTask === internalKeyFor[t] ? "task-active" : ""
                        }`}
                      onClick={() => {
                        const internal = internalKeyFor[t];
                        setActiveTask(internal);
                        setInput(getPrefix(internal));
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* PROMPT CHIPS */}
          {activeTask &&
            promptChips[
            Object.keys(internalKeyFor).find((k) => internalKeyFor[k] === activeTask)
            ] && (
              <div className="ci-chip-row">
                {promptChips[
                  Object.keys(internalKeyFor).find((k) => internalKeyFor[k] === activeTask)
                ].map((chip, idx) => (
                  <div
                    key={idx}
                    className="ci-chip"
                    onClick={() =>
                      handleChipClick(
                        Object.keys(internalKeyFor).find(
                          (k) => internalKeyFor[k] === activeTask
                        ),
                        chip.text
                      )
                    }
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

            {/* AUTOCOMPLETE SUGGESTIONS */}
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

        {/* RIGHT PANEL: MIC + SEND */}
        <div className="ci-right">
          <button className="ci-icon-btn ci-mic-btn">
            <Mic className="w-5 h-5" />
          </button>

          <button className="ci-send-btn" onClick={send}>
            <Send className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
export default ChatInput;
