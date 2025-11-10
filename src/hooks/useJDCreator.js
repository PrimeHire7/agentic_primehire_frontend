// 📁 src/hooks/useJDCreator.js
import { useState, useCallback, useEffect } from "react";
import { generateJd } from "@/utils/api";

const jdSteps = [
  "role",
  "location",
  "experience",
  "jobType",
  "skillsMandatory",
  "skillsPreferred",
  "responsibilities",
  "company_name",
  "about",
  "perks",
];

const stepPrompts = {
  role: "👉 What is the job title / role?",
  location: "📍 Where is the job located? (City or Remote)",
  experience: "💼 What is the experience required?",
  jobType: "📌 Job type (Full-time / Contract / Remote)?",
  skillsMandatory: "✍️ List the mandatory skills (comma separated).",
  skillsPreferred: "✨ List the preferred skills (comma separated).",
  responsibilities: "📝 Provide key responsibilities (optional, can skip).",
  company_name: "🏢 What is the company name?",
  about: "🏢 Provide a short description about the role/company (optional).",
  perks: "🎁 Any perks or benefits to highlight? (optional).",
};

export const useJDCreator = (setMessages, setIsLoading, setSelectedTask) => {
  const [jdAnswers, setJdAnswers] = useState([]);
  const [currentJdInput, setCurrentJdInput] = useState("");
  const [currentJdStep, setCurrentJdStep] = useState(jdSteps[0]);
  const [jdInProgress, setJdInProgress] = useState(false);

  // initialize once
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__JD_HISTORY__ = window.__JD_HISTORY__ || [];
    window.__CURRENT_JD_STEP__ = window.__CURRENT_JD_STEP__ || stepPrompts[currentJdStep];
    window.__HANDLE_JD_PROCESS__ = handleJdProcess; // will be hoisted
    window.__CURRENT_JD_INPUT__ = "";
    return () => delete window.__HANDLE_JD_PROCESS__;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setWindowStep = (stepKey) => {
    if (typeof window === "undefined") return;
    window.__CURRENT_JD_STEP__ = stepPrompts[stepKey] || null;
    window.dispatchEvent(new CustomEvent("jd_step_update", { detail: { step: stepKey } }));
  };

  const handleJdProcess = useCallback(
    async (userMessage) => {
      if (!userMessage?.toString().trim()) return;

      // start JD mode
      if (!jdInProgress) {
        setJdInProgress(true);
        if (typeof window !== "undefined") window.__JD_HISTORY__ = [];
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "🧠 JD Creator started — let's build your job description step by step!" },
        ]);
      }

      const stepIndex = jdAnswers.length;
      const stepKey = currentJdStep || jdSteps[stepIndex] || jdSteps[jdSteps.length - 1];

      let value = userMessage;
      if (["skillsMandatory", "skillsPreferred"].includes(stepKey)) {
        value = userMessage
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      const newAnswers = [...jdAnswers, { step: stepKey, value }];
      setJdAnswers(newAnswers);

      if (typeof window !== "undefined") {
        window.__JD_HISTORY__ = [
          ...(window.__JD_HISTORY__ || []),
          { step: stepKey, value, by: "user" },
        ];
      }

      const nextIndex = newAnswers.length;
      if (nextIndex < jdSteps.length) {
        const nextStep = jdSteps[nextIndex];
        setCurrentJdStep(nextStep);
        setWindowStep(nextStep);

        if (typeof window !== "undefined") {
          window.__JD_HISTORY__ = [
            ...(window.__JD_HISTORY__ || []),
            { step: nextStep, value: stepPrompts[nextStep], by: "ai" },
          ];
        }

        setIsLoading(false);
        setCurrentJdInput("");
        return;
      }

      // All steps answered — build JD
      const jdInputObj = newAnswers.reduce((acc, { step, value }) => {
        acc[step] = value;
        return acc;
      }, {});

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "✅ Generating LinkedIn-ready JD. Please wait..." },
      ]);
      setIsLoading(true);

      try {
        await generateJd(jdInputObj, setMessages, setIsLoading);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "🎉 JD generation complete! You can continue chatting below." },
        ]);
      } catch (err) {
        console.error("JD generation failed:", err);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ JD generation failed. Please try again." },
        ]);
      } finally {
        // ✅ JD generation finished successfully
        setIsLoading(false);
        setJdInProgress(false);
        setCurrentJdStep(null); // stop further JD questions

        if (typeof window !== "undefined") {
          // ❌ Unlock chat
          window.__JD_MODE_ACTIVE__ = false;

          // ✅ Keep summary visible (so JD UI still shows)
          window.__JD_HISTORY__ = [...(window.__JD_HISTORY__ || []), {
            step: "JD Summary",
            value: "🎉 JD generated successfully. You can now continue chatting or start a new JD anytime.",
            by: "ai",
          }];

          // Keep last prompt descriptive
          window.__CURRENT_JD_STEP__ = "✅ JD Completed — Chat re-enabled!";
        }

        // append final assistant message for clarity
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "💬 JD generated successfully — chat is now re-enabled!" },
        ]);
      }

    },
    [jdAnswers, currentJdStep, jdInProgress, setMessages, setIsLoading]
  );

  const handleJdSend = useCallback(
    (message) => {
      if (!message?.toString().trim()) return;
      if (typeof window !== "undefined") window.__CURRENT_JD_INPUT__ = "";
      setIsLoading(true);
      handleJdProcess(message);
    },
    [handleJdProcess]
  );

  return {
    jdAnswers,
    jdInProgress,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    setCurrentJdStep,
    handleJdProcess,
    handleJdSend,
  };
};
