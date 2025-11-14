// 📁 src/hooks/useMainContent.js
import { useState, useCallback, useEffect } from "react";
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
  const navigate = useNavigate();

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
  // 💡 Manual feature click
  // const handleFeatureClick = (feature) => {
  //   console.log("🧭 Manual feature click:", feature);

  //   // ✅ Don’t reset first; clear conflicting state after selection
  //   setSelectedTask("");
  //   setSelectedFeature(feature);

  //   // ✅ Display message to trigger UI (e.g., Zoho, MailMind)
  //   setMessages([
  //     {
  //       role: "assistant",
  //       content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
  //     },
  //   ]);
  // };
  // 💡 Manual feature click
  const handleFeatureClick = (feature) => {
    console.log("🧭 Manual feature click:", feature);
    // 👉 New: handle JD History routing
    // if (feature === "JDHistory") {
    //   navigate("/jd-history");
    //   return;
    // }
    // ✅ Fire global event for upload UI cleanup
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("feature_change"));
    }

    // ✅ Don’t reset first; clear conflicting state after selection
    setSelectedTask("");
    setSelectedFeature(feature);

    // ✅ Display message to trigger UI (e.g., Zoho, MailMind)
    setMessages([
      {
        role: "assistant",
        content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
      },
    ]);
  };
  // 💡 Task selector
  const handleTaskSelect = useCallback(
    (task) => {
      console.log("🧩 Task selected manually:", task);

      // ✅ Fire global event for upload UI cleanup
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("feature_change"));
      }

      // ✅ Don’t reset before; clear conflicting feature only
      setSelectedFeature("");
      setSelectedTask(task);

      // ✅ Generate first assistant message so UI renders
      switch (task) {
        case "JD Creator":
          setMessages([
            {
              role: "assistant",
              content:
                "✨ JD Creator activated — ready to start job description flow.",
            },
          ]);
          break;

        case "Profile Matcher":
          setMessages([
            {
              role: "assistant",
              content:
                "🎯 Profile Matcher activated — analyzing candidates...",
            },
          ]);
          break;

        case "Upload Resumes":
          console.log("📎 Activating Upload Resumes — cleaning old resume data.");
          setMessages([]); // clear any old messages
          setMessages([
            {
              role: "assistant",
              content:
                "📎 Upload Resumes activated — ready to extract resumes.",
            },
          ]);
          break;

        default:
          console.log("⚙️ No setup for this task");
      }
    },
    []
  );

  // 💡 Task selector
  // const handleTaskSelect = useCallback(
  //   (task) => {
  //     console.log("🧩 Task selected manually:", task);

  //     // ✅ Don’t reset before; clear conflicting feature only
  //     setSelectedFeature("");
  //     setSelectedTask(task);

  //     // ✅ Generate first assistant message so UI renders
  //     switch (task) {
  //       case "JD Creator":
  //         setMessages([
  //           {
  //             role: "assistant",
  //             content:
  //               "✨ JD Creator activated — ready to start job description flow.",
  //           },
  //         ]);
  //         break;

  //       case "Profile Matcher":
  //         setMessages([
  //           {
  //             role: "assistant",
  //             content:
  //               "🎯 Profile Matcher activated — analyzing candidates...",
  //           },
  //         ]);
  //         break;

  //       case "Upload Resumes":
  //         console.log("📎 Activating Upload Resumes — cleaning old resume data.");
  //         setMessages([]); // clear any old messages
  //         setMessages([
  //           {
  //             role: "assistant",
  //             content:
  //               "📎 Upload Resumes activated — ready to extract resumes.",
  //           },
  //         ]);
  //         break;

  //       default:
  //         console.log("⚙️ No setup for this task");
  //     }
  //   },
  //   []
  // );

  // const handleRefresh = useCallback(() => {
  //   if (window.__JD_REFRESHING__) {
  //     console.log("⏸️ Skipping redundant refresh — already in progress.");
  //     return;
  //   }
  //   window.__JD_REFRESHING__ = true;

  //   console.log("🔄 Refresh triggered — full reset including JD Creator state.");

  //   // 🧹 Reset UI and global flags
  //   resetAllFeatureStates();

  //   if (typeof window !== "undefined") {
  //     // ✅ Safer: keep JD keys defined but inactive
  //     window.__JD_MODE_ACTIVE__ = false;
  //     window.__CURRENT_JD_STEP__ = null;
  //     window.__JD_HISTORY__ = [];
  //     delete window.__HANDLE_JD_PROCESS__;
  //   }

  //   try {
  //     // ✅ Reset local JD React states
  //     setCurrentJdInput("");
  //     if (typeof setCurrentJdStep === "function") setCurrentJdStep("role"); // safe default, not null
  //     if (typeof setJdInProgress === "function") setJdInProgress(false);
  //   } catch (err) {
  //     console.warn("⚠️ JD reset skipped (hook refs not ready):", err);
  //   }

  //   console.log("✅ All JD Creator and session states cleared.");

  //   // 🔓 Allow next refresh after small delay
  //   setTimeout(() => {
  //     delete window.__JD_REFRESHING__;
  //   }, 500);
  // }, [
  //   resetAllFeatureStates,
  //   setCurrentJdInput,
  //   setCurrentJdStep,
  //   setJdInProgress,
  // ]);


  const handleRefresh = useCallback(() => {
    if (window.__JD_REFRESHING__) {
      console.log("⏸️ Skipping redundant refresh — already in progress.");
      return;
    }
    window.__JD_REFRESHING__ = true;

    console.log("🔄 Refresh triggered — full reset including JD Creator + Upload Resume state.");

    // ✅ Fire event for upload UI cleanup
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("refresh_trigger"));
    }

    // 🧹 Reset feature-specific UI
    resetAllFeatureStates();

    if (typeof window !== "undefined") {
      // Clear JD state
      window.__JD_MODE_ACTIVE__ = false;
      window.__CURRENT_JD_STEP__ = null;
      window.__JD_HISTORY__ = [];

      // Clear JD handler
      delete window.__HANDLE_JD_PROCESS__;

      // Clear upload-related cached data
      window.__UPLOAD_RESUME_CACHE__ = null;
      window.__LAST_UPLOADED_FILES__ = null;
    }

    try {
      // 🧹 Reset JD local states
      setCurrentJdInput("");
      if (typeof setCurrentJdStep === "function") setCurrentJdStep("role");
      if (typeof setJdInProgress === "function") setJdInProgress(false);

      // 🧹 Remove resume table messages
      setMessages((prev) =>
        prev.filter(
          (msg) =>
            msg.type !== "resume_table" &&
            !msg?.data?.recent_candidates
        )
      );
    } catch (err) {
      console.warn("⚠️ JD/Upload reset skipped (hook refs not ready):", err);
    }

    console.log("✅ All JD Creator + Resume Upload states cleared.");

    // ---------------------------------------------------------
    // 🆕 NEW: After Refresh → Reload the last generated JD
    // ---------------------------------------------------------
    setTimeout(() => {
      const lastJd = window.__LAST_GENERATED_JD__;
      if (lastJd) {
        console.log("♻ Restoring last generated JD after refresh...");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "🎉 Here's your latest generated JD (refreshed):\n\n" + lastJd,
          },
        ]);
      }

      delete window.__JD_REFRESHING__;
    }, 300); // small delay for UI cleanup

  }, [
    resetAllFeatureStates,
    setCurrentJdInput,
    setCurrentJdStep,
    setJdInProgress,
    setMessages
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
  // const uploadResumesHandler = useCallback(
  //   async (files) => {
  //     if (!files?.length) return;
  //     setIsLoading(true);

  //     try {
  //       const result = await uploadResumes(files);
  //       setMessages((prev) => [
  //         ...prev,
  //         { role: "assistant", type: "resume_table", data: result.uploaded_files },
  //       ]);
  //     } catch (err) {
  //       console.error("❌ Upload error:", err);
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "assistant",
  //           content: "❌ Failed to upload resumes. Please try again.",
  //         },
  //       ]);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   []
  // );

  // 📎 Resume Upload Handler
  const uploadResumesHandler = useCallback(
    async (files) => {
      if (!files?.length) return;
      setIsLoading(true);

      try {
        const result = await uploadResumes(files);

        // 🧹 Step 1: Clear old resume-related messages
        setMessages((prev) =>
          prev.filter(
            (msg) =>
              msg.type !== "resume_table" &&
              !msg?.data?.recent_candidates
          )
        );

        // 🧠 Step 2: Normalize backend response key
        const resumeData =
          result?.uploaded_files ||
          result?.recent_candidates ||
          result?.data?.recent_candidates ||
          [];

        // 🧩 Step 3: Add new resume data as assistant message
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "resume_table",
            data: resumeData,
          },
        ]);

        console.log("📂 [Upload Handler] Stored resumes:", resumeData);
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
