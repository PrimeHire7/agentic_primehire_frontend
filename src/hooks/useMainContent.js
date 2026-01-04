
import { useState, useCallback, useEffect, useRef } from "react";
import { useWebSocket } from "./useWebSocket";
import { useJDCreator } from "./useJDCreator";
import { useProfileMatcher } from "./useProfileMatcher";
import { uploadResumes } from "@/utils/api";
import { useNavigate } from "react-router-dom";

export const useMainContent = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // ⭐ NEW: show/hide chat input
  const [showChatInput, setShowChatInput] = useState(true);

  const lastUserMessageRef = useRef("");
  const navigate = useNavigate();

  /* ------------------------------------------------------------
     PROFILE MATCHER HOOK
  ------------------------------------------------------------ */
  const { fetchProfileMatches } = useProfileMatcher(
    setMessages,
    setIsLoading,
    setSelectedTask
  );

  /* ------------------------------------------------------------
     JD CREATOR HOOK
  ------------------------------------------------------------ */
  const {
    jdInProgress,
    setJdInProgress,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    setCurrentJdStep,
    handleJdProcess,
    handleJdSend,
  } = useJDCreator(setMessages, setIsLoading, setSelectedTask);

  /* ------------------------------------------------------------
     DEBUG LOGS
  ------------------------------------------------------------ */
  useEffect(() => {
    console.log("🟦 selectedFeature =", selectedFeature);
  }, [selectedFeature]);

  useEffect(() => {
    console.log("🟩 selectedTask =", selectedTask);
  }, [selectedTask]);

  useEffect(() => {
    console.log("🟧 [DEBUG] messages updated:", messages);
  }, [messages]);

  /* ------------------------------------------------------------
     MAKE JD HANDLER GLOBAL
  ------------------------------------------------------------ */
  useEffect(() => {
    window.__HANDLE_JD_PROCESS__ = handleJdProcess;
  }, [handleJdProcess]);

  /* ------------------------------------------------------------
     WEBSOCKET HANDLER
  ------------------------------------------------------------ */
  const { sendMessage } = useWebSocket(
    setSelectedFeature,
    setSelectedTask,
    fetchProfileMatches,
    setMessages,
    setIsLoading,
    handleJdProcess
  );

  /* ------------------------------------------------------------
     RESET EVERYTHING
  ------------------------------------------------------------ */
  const resetAllFeatureStates = () => {
    setMessages([]);
    setSelectedTask("");
    setSelectedFeature("");
    setIsLoading(false);
    window.__JD_MODE_ACTIVE__ = false;

    // ⭐ Show Chat Input again
    setShowChatInput(true);
  };

  const handleFeatureClick = (feature) => {
    console.log("🧭 Feature clicked:", feature);

    window.dispatchEvent(new Event("feature_change"));

    setSelectedFeature(feature);

    // ⭐ Correct InterviewBot behavior
    if (feature === "InterviewBot") {
      setSelectedTask("interview");     // <-- START INTERVIEW BOT FLOW
      setShowChatInput(false);           // optional: hide chat input
    } else {
      setSelectedTask("");
      setShowChatInput(false);
    }

    // Assistant message in chat
    setMessages([
      {
        role: "assistant",
        content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
      },
    ]);
  };

  /* ------------------------------------------------------------
     FEATURE CLICK
     → Hide chat input
  ------------------------------------------------------------ */
  // const handleFeatureClick = (feature) => {
  //   console.log("🧭 Feature clicked:", feature);

  //   window.dispatchEvent(new Event("feature_change"));

  //   setSelectedTask("");
  //   setSelectedFeature(feature);

  //   // ⭐ Hide ChatInput when feature is selected
  //   setShowChatInput(false);

  //   setMessages([
  //     {
  //       role: "assistant",
  //       content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
  //     },
  //   ]);
  // };

  /* ------------------------------------------------------------
     TASK SELECTOR
     (Tasks still allow ChatInput)
  ------------------------------------------------------------ */
  const handleTaskSelect = useCallback((task) => {
    console.log("🧩 Task selected:", task);

    window.dispatchEvent(new Event("feature_change"));

    setSelectedFeature("");
    setSelectedTask(task);

    // ⭐ Tasks should show ChatInput
    setShowChatInput(true);

    switch (task) {
      case "JD Creator":
        setMessages([
          {
            role: "assistant",
            content: "✨ JD Creator activated — ready to start job description flow.",
          },
        ]);
        break;

      case "Profile Matcher":
        setMessages([
          {
            role: "assistant",
            content: "🎯 Profile Matcher activated — analyzing candidates...",
          },
        ]);
        break;

      case "Upload Resumes":
        setMessages([
          {
            role: "assistant",
            content: "📎 Upload Resumes activated — ready to extract resumes.",
          },
        ]);
        break;

      default:
        break;
    }
  }, []);

  /* ------------------------------------------------------------
     REFRESH → SHOW CHAT INPUT AGAIN
  ------------------------------------------------------------ */
  const handleRefresh = useCallback(() => {
    console.log("🔄 Refresh triggered");

    window.dispatchEvent(new Event("refresh_trigger"));
    resetAllFeatureStates();

    try {
      setCurrentJdInput("");
      setCurrentJdStep("role");
      setJdInProgress(false);

      setMessages((prev) =>
        prev.filter((msg) => msg.type !== "resume_table")
      );
    } catch { }

    // ⭐ Ensure ChatInput reappears after refresh
    setShowChatInput(true);

    console.log("✅ Refresh completed.");
  }, [resetAllFeatureStates, setCurrentJdStep, setCurrentJdInput, setJdInProgress, setMessages]);

  /* ------------------------------------------------------------
     MAIN MESSAGE HANDLER
  ------------------------------------------------------------ */
  const handleSend = useCallback(
    (message) => {
      if (!message || message.trim() === "") {
        setMessages([{ role: "assistant", content: "👋 How can I assist you today?" }]);
        return;
      }

      sendMessage(message);
      lastUserMessageRef.current = message;

      if (window.__JD_MODE_ACTIVE__ || (selectedTask === "JD Creator" && jdInProgress)) {
        handleJdProcess(message);
        return;
      }

      if (selectedTask === "JD Creator" && !jdInProgress) {
        handleJdProcess(message);
        return;
      }
    },
    [
      selectedTask,
      jdInProgress,
      handleJdProcess,
      fetchProfileMatches,
      sendMessage,
      setMessages,
    ]
  );

  /* ------------------------------------------------------------
     FILE UPLOAD HANDLER
  ------------------------------------------------------------ */
  const uploadResumesHandler = useCallback(
    async (files) => {
      if (!files?.length) return;

      setIsLoading(true);

      try {
        const result = await uploadResumes(files);

        setMessages((prev) =>
          prev.filter((msg) => msg.type !== "resume_table")
        );

        const resumeData =
          result?.uploaded_files ||
          result?.recent_candidates ||
          result?.data?.recent_candidates ||
          [];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "resume_table",
            data: resumeData,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Failed to upload resumes." },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /* ------------------------------------------------------------
     EXPORT HOOK API
  ------------------------------------------------------------ */
  return {
    messages,
    selectedFeature,
    selectedTask,
    setSelectedTask,
    isLoading,

    currentJdInput,
    setCurrentJdInput,
    currentJdStep,

    showChatInput,       // ⭐ expose state
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,

    handleSend,
    handleJdSend,
    uploadResumes: uploadResumesHandler,

    setMessages,
  };
};
