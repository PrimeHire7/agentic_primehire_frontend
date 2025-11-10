// 📁 src/hooks/useMainContent.js
import { useState, useCallback, useEffect } from "react";
import { useWebSocket } from "./useWebSocket";
import { useJDCreator } from "./useJDCreator";
import { useProfileMatcher } from "./useProfileMatcher";
import { uploadResumes } from "@/utils/api";

export const useMainContent = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  // ✅ Hooks
  const { fetchProfileMatches } = useProfileMatcher(setMessages, setIsLoading, setSelectedTask);
  const {
    jdInProgress,
    setJdInProgress,     // ✅ NEW
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    setCurrentJdStep,    // ✅ NEW
    handleJdProcess,
    handleJdSend,
  } = useJDCreator(setMessages, setIsLoading, setSelectedTask);


  // ✅ make JD handler globally available (for JDTaskUI)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__HANDLE_JD_PROCESS__ = handleJdProcess;
    }
  }, [handleJdProcess]);

  const { sendMessage } = useWebSocket(
    setSelectedFeature,
    setSelectedTask,
    fetchProfileMatches,
    setMessages,
    setIsLoading,
    handleJdProcess
  );

  // 🔁 Reset helper
  const resetAllFeatureStates = () => {
    setMessages([]);
    setSelectedTask("");
    setSelectedFeature("");
    setIsLoading(false);
    window.__JD_MODE_ACTIVE__ = false; // 🧹 Always unlock on reset
  };

  // 💡 Manual feature click
  const handleFeatureClick = (feature) => {
    console.log("🧭 Manual feature click:", feature);
    resetAllFeatureStates();
    setSelectedFeature(feature);
  };

  // 💡 Task selector
  const handleTaskSelect = useCallback(
    (task) => {
      console.log("🧩 Task selected manually:", task);
      resetAllFeatureStates();
      setSelectedTask(task);

      switch (task) {
        case "JD Creator":
          setMessages([
            { role: "assistant", content: "✨ Detected task: **JD Creator** — Opening JD Creator module..." },
            // immediate first step prompt, use global (ensures step text is consistent)
            // { role: "assistant", content: `Step 1/10 — ${window.__CURRENT_JD_STEP__ || "👉 What is the job title / role?"}` }
          ]);
          break;


        case "Profile Matcher":
          setMessages([
            {
              role: "assistant",
              content:
                "✨ Detected task: **Profile Matcher** — Opening Profile Matcher module...",
            },
          ]);
          break;

        case "Upload Resumes":
          setMessages([
            {
              role: "assistant",
              content:
                "✨ Detected task: **Upload Resumes** — Opening Upload Resumes module...",
            },
          ]);
          break;

        default:
          console.log("⚙️ No setup for this task");
      }
    },
    []
  );

  const handleRefresh = useCallback(() => {
    if (window.__JD_REFRESHING__) {
      console.log("⏸️ Skipping redundant refresh — already in progress.");
      return;
    }
    window.__JD_REFRESHING__ = true;

    console.log("🔄 Refresh triggered — full reset including JD Creator state.");

    // 🧹 Reset UI and global flags
    resetAllFeatureStates();

    if (typeof window !== "undefined") {
      // ✅ Safer: keep JD keys defined but inactive
      window.__JD_MODE_ACTIVE__ = false;
      window.__CURRENT_JD_STEP__ = null;
      window.__JD_HISTORY__ = [];
      delete window.__HANDLE_JD_PROCESS__;
    }

    try {
      // ✅ Reset local JD React states
      setCurrentJdInput("");
      if (typeof setCurrentJdStep === "function") setCurrentJdStep("role"); // safe default, not null
      if (typeof setJdInProgress === "function") setJdInProgress(false);
    } catch (err) {
      console.warn("⚠️ JD reset skipped (hook refs not ready):", err);
    }

    console.log("✅ All JD Creator and session states cleared.");

    // 🔓 Allow next refresh after small delay
    setTimeout(() => {
      delete window.__JD_REFRESHING__;
    }, 500);
  }, [
    resetAllFeatureStates,
    setCurrentJdInput,
    setCurrentJdStep,
    setJdInProgress,
  ]);




  // ✅ Fixed message handler
  const handleSend = useCallback(
    (message) => {
      if (!message.trim()) return;
      setIsLoading(true);

      // 🚫 JD Creator Mode Lock
      if (window.__JD_MODE_ACTIVE__ || (selectedTask === "JD Creator" && jdInProgress)) {
        console.log("🧱 [Main] JD Creator active — handling locally only");
        handleJdProcess(message);
        setIsLoading(false);
        return;
      }

      // 🧠 JD Creator startup (first step)
      if (selectedTask === "JD Creator" && !jdInProgress) {
        console.log("🧭 [Main] Starting JD Creator flow...");
        handleJdProcess(message);
        setIsLoading(false);
        return;
      }

      // 🎯 Profile Matcher
      if (selectedTask === "Profile Matcher") {
        console.log("🎯 [Main] Routing to Profile Matcher...");
        fetchProfileMatches(message);
      } else {
        // 🌐 Default → WebSocket route
        console.log("🌐 [Main] Routing to WebSocket...");
        sendMessage(message);
      }

      setIsLoading(false);
    },
    [selectedTask, jdInProgress, handleJdProcess, fetchProfileMatches, sendMessage]
  );

  // 📎 Resume Upload Handler
  const uploadResumesHandler = useCallback(
    async (files) => {
      if (!files?.length) return;
      setIsLoading(true);

      try {
        const result = await uploadResumes(files);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: result.uploaded_files },
        ]);
      } catch (err) {
        console.error("❌ Upload error:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Failed to upload resumes. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    messages,
    selectedFeature,
    selectedTask,
    isLoading,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,
    handleSend,
    handleJdSend,
    uploadResumes: uploadResumesHandler,
    setMessages,
  };
};
