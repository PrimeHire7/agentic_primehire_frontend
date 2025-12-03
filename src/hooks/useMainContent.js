
// // 📁 src/hooks/useMainContent.js
// import { useState, useCallback, useEffect } from "react";
// import { useWebSocket } from "./useWebSocket";
// import { useJDCreator } from "./useJDCreator";
// import { useProfileMatcher } from "./useProfileMatcher";
// import { uploadResumes } from "@/utils/api";
// import { useNavigate } from "react-router-dom";


// export const useMainContent = () => {
//   const [selectedFeature, setSelectedFeature] = useState("");
//   const [selectedTask, setSelectedTask] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const navigate = useNavigate();

//   // ✅ Hooks
//   const { fetchProfileMatches } = useProfileMatcher(setMessages, setIsLoading, setSelectedTask);
//   const {
//     jdInProgress,
//     setJdInProgress,     // ✅ NEW
//     currentJdInput,
//     setCurrentJdInput,
//     currentJdStep,
//     setCurrentJdStep,    // ✅ NEW
//     handleJdProcess,
//     handleJdSend,
//   } = useJDCreator(setMessages, setIsLoading, setSelectedTask);


//   // -------------------------------------------------------------
//   // 🔍 DEBUG WATCHERS
//   // -------------------------------------------------------------
//   useEffect(() => {
//     console.log("🟦 selectedFeature =", selectedFeature);
//     window.__LATEST_FEATURE__ = selectedFeature;
//   }, [selectedFeature]);

//   useEffect(() => {
//     console.log("🟩 selectedTask =", selectedTask);
//     window.__LATEST_TASK__ = selectedTask;
//   }, [selectedTask]);

//   useEffect(() => {
//     console.log("🟧 [DEBUG] messages updated:", messages);
//   }, [messages]);

//   useEffect(() => {
//     console.log("🟪 [DEBUG] isLoading:", isLoading);
//   }, [isLoading]);


//   // ✅ make JD handler globally available (for JDTaskUI)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.__HANDLE_JD_PROCESS__ = handleJdProcess;
//     }
//   }, [handleJdProcess]);

//   const { sendMessage } = useWebSocket(
//     setSelectedFeature,
//     setSelectedTask,
//     fetchProfileMatches,
//     setMessages,
//     setIsLoading,
//     handleJdProcess
//   );

//   // 🔁 Reset helper
//   const resetAllFeatureStates = () => {
//     setMessages([]);
//     setSelectedTask("");
//     setSelectedFeature("");
//     setIsLoading(false);
//     window.__JD_MODE_ACTIVE__ = false; // 🧹 Always unlock on reset
//   };

//   // 💡 Manual feature click
//   const handleFeatureClick = (feature) => {
//     console.log("🧭 Manual feature click:", feature);
//     // 👉 New: handle JD History routing
//     // if (feature === "JDHistory") {
//     //   navigate("/jd-history");
//     //   return;
//     // }
//     // ✅ Fire global event for upload UI cleanup
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new Event("feature_change"));
//     }

//     // ✅ Don’t reset first; clear conflicting state after selection
//     setSelectedTask("");
//     setSelectedFeature(feature);

//     // ✅ Display message to trigger UI (e.g., Zoho, MailMind)
//     setMessages([
//       {
//         role: "assistant",
//         content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
//       },
//     ]);
//   };
//   // 💡 Task selector
//   const handleTaskSelect = useCallback(
//     (task) => {
//       console.log("🧩 Task selected manually:", task);

//       // ✅ Fire global event for upload UI cleanup
//       if (typeof window !== "undefined") {
//         window.dispatchEvent(new Event("feature_change"));
//       }

//       // ✅ Don’t reset before; clear conflicting feature only
//       setSelectedFeature("");
//       setSelectedTask(task);

//       // ✅ Generate first assistant message so UI renders
//       switch (task) {
//         case "JD Creator":
//           setMessages([
//             {
//               role: "assistant",
//               content:
//                 "✨ JD Creator activated — ready to start job description flow.",
//             },
//           ]);
//           break;

//         case "Profile Matcher":
//           setMessages([
//             {
//               role: "assistant",
//               content:
//                 "🎯 Profile Matcher activated — analyzing candidates...",
//             },
//           ]);
//           break;

//         case "Upload Resumes":
//           console.log("📎 Activating Upload Resumes — cleaning old resume data.");
//           setMessages([]); // clear any old messages
//           setMessages([
//             {
//               role: "assistant",
//               content:
//                 "📎 Upload Resumes activated — ready to extract resumes.",
//             },
//           ]);
//           break;

//         default:
//           console.log("⚙️ No setup for this task");
//       }
//     },
//     []
//   );


//   const handleRefresh = useCallback(() => {
//     if (window.__JD_REFRESHING__) {
//       console.log("⏸️ Skipping redundant refresh — already in progress.");
//       return;
//     }
//     window.__JD_REFRESHING__ = true;

//     console.log("🔄 Refresh triggered — full reset including JD Creator + Upload Resume state.");

//     // -------------------------------------------------------------
//     // 1️⃣ RESET BACKEND PROGRESS JSON
//     // -------------------------------------------------------------
//     try {
//       fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/reset-progress", {
//         method: "POST",
//       })
//         .then(() => console.log("🗑 Backend progress.json reset successfully"))
//         .catch((err) => console.error("❌ Backend progress reset failed:", err));
//     } catch (err) {
//       console.error("❌ Backend reset exception:", err);
//     }

//     // -------------------------------------------------------------
//     // 2️⃣ RESET FRONTEND UPLOAD UI (files, metadata, progress)
//     // -------------------------------------------------------------
//     if (typeof window !== "undefined") {
//       window.dispatchEvent(new Event("refresh_trigger")); // Upload UI reset
//     }

//     // -------------------------------------------------------------
//     // 3️⃣ RESET ALL FEATURE STATES
//     // -------------------------------------------------------------
//     resetAllFeatureStates();

//     // -------------------------------------------------------------
//     // 4️⃣ CLEAR JD CREATOR STATE
//     // -------------------------------------------------------------
//     try {
//       window.__JD_MODE_ACTIVE__ = false;
//       window.__CURRENT_JD_STEP__ = null;
//       window.__JD_HISTORY__ = [];

//       delete window.__HANDLE_JD_PROCESS__;
//       window.__UPLOAD_RESUME_CACHE__ = null;
//       window.__LAST_UPLOADED_FILES__ = null;

//       // React state resets
//       setCurrentJdInput("");
//       if (typeof setCurrentJdStep === "function") setCurrentJdStep("role");
//       if (typeof setJdInProgress === "function") setJdInProgress(false);

//       // Remove resume table messages
//       setMessages((prev) =>
//         prev.filter(
//           (msg) =>
//             msg.type !== "resume_table" &&
//             !msg?.data?.recent_candidates
//         )
//       );
//     } catch (err) {
//       console.warn("⚠️ JD/Upload reset skipped (hook refs not ready):", err);
//     }

//     console.log("✅ All JD Creator + Resume Upload states cleared.");

//     // -------------------------------------------------------------
//     // 5️⃣ AFTER RESET → OPTIONAL: RESTORE LAST GENERATED JD
//     // -------------------------------------------------------------
//     setTimeout(() => {
//       const lastJd = window.__LAST_GENERATED_JD__;
//       if (lastJd) {
//         console.log("♻ Restoring last generated JD after refresh...");
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content:
//               "🎉 Here's your latest generated JD (refreshed):\n\n" + lastJd,
//           },
//         ]);
//       }

//       delete window.__JD_REFRESHING__;
//     }, 300);
//   }, [
//     resetAllFeatureStates,
//     setCurrentJdInput,
//     setCurrentJdStep,
//     setJdInProgress,
//     setMessages
//   ]);

//   // ✅ Fixed message handler
//   const handleSend = useCallback(
//     (message) => {
//       // if (!message.trim()) return;
//       // setIsLoading(true);

//       if (!message || message.trim() === "") {
//         // Just open chat mode UI
//         setMessages([{ role: "assistant", content: "👋 How can I assist you today?" }]);
//         return;
//       }


//       // 🚫 JD Creator Mode Lock
//       if (window.__JD_MODE_ACTIVE__ || (selectedTask === "JD Creator" && jdInProgress)) {
//         console.log("🧱 [Main] JD Creator active — handling locally only");
//         handleJdProcess(message);
//         setIsLoading(false);
//         return;
//       }

//       // 🧠 JD Creator startup (first step)
//       if (selectedTask === "JD Creator" && !jdInProgress) {
//         console.log("🧭 [Main] Starting JD Creator flow...");
//         handleJdProcess(message);
//         setIsLoading(false);
//         return;
//       }

//       // 🎯 Profile Matcher
//       if (selectedTask === "Profile Matcher") {
//         console.log("🎯 [Main] Routing to Profile Matcher...");
//         fetchProfileMatches(message);
//       } else {
//         // 🌐 Default → WebSocket route
//         console.log("🌐 [Main] Routing to WebSocket...");
//         sendMessage(message);
//       }

//       setIsLoading(false);
//     },
//     [selectedTask, jdInProgress, handleJdProcess, fetchProfileMatches, sendMessage]
//   );


//   // 📎 Resume Upload Handler
//   const uploadResumesHandler = useCallback(
//     async (files) => {
//       if (!files?.length) return;
//       setIsLoading(true);

//       try {
//         const result = await uploadResumes(files);

//         // 🧹 Step 1: Clear old resume-related messages
//         setMessages((prev) =>
//           prev.filter(
//             (msg) =>
//               msg.type !== "resume_table" &&
//               !msg?.data?.recent_candidates
//           )
//         );

//         // 🧠 Step 2: Normalize backend response key
//         const resumeData =
//           result?.uploaded_files ||
//           result?.recent_candidates ||
//           result?.data?.recent_candidates ||
//           [];

//         // 🧩 Step 3: Add new resume data as assistant message
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             type: "resume_table",
//             data: resumeData,
//           },
//         ]);

//         console.log("📂 [Upload Handler] Stored resumes:", resumeData);
//       } catch (err) {
//         console.error("❌ Upload error:", err);
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: "❌ Failed to upload resumes. Please try again.",
//           },
//         ]);
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     []
//   );


//   return {
//     messages,
//     selectedFeature,
//     selectedTask,
//     setSelectedTask,   // ⭐ REQUIRED
//     isLoading,
//     currentJdInput,
//     setCurrentJdInput,
//     currentJdStep,
//     handleFeatureClick,
//     handleTaskSelect,
//     handleRefresh,
//     handleSend,
//     handleJdSend,
//     uploadResumes: uploadResumesHandler,
//     setMessages,

//   };
// };

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
     MAKE JD HANDLER GLOBAL FOR UI
  ------------------------------------------------------------ */
  useEffect(() => {
    window.__HANDLE_JD_PROCESS__ = handleJdProcess;
  }, [handleJdProcess]);

  /* ------------------------------------------------------------
     WEBSOCKET HOOK
  ------------------------------------------------------------ */
  const { sendMessage } = useWebSocket(
    setSelectedFeature,
    setSelectedTask,
    fetchProfileMatches, // matcher is triggered from WS here too
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
  };

  /* ------------------------------------------------------------
     FEATURE CLICK HANDLER
  ------------------------------------------------------------ */
  const handleFeatureClick = (feature) => {
    console.log("🧭 Feature clicked:", feature);

    window.dispatchEvent(new Event("feature_change"));

    setSelectedTask("");
    setSelectedFeature(feature);

    setMessages([
      {
        role: "assistant",
        content: `✨ Detected feature: **${feature}** — Opening ${feature} module...`,
      },
    ]);
  };

  /* ------------------------------------------------------------
     TASK SELECTOR
  ------------------------------------------------------------ */
  const handleTaskSelect = useCallback((task) => {
    console.log("🧩 Task selected:", task);

    window.dispatchEvent(new Event("feature_change"));

    setSelectedFeature("");
    setSelectedTask(task);

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
     REFRESH HANDLER
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

    console.log("✅ Refresh completed.");
  }, [resetAllFeatureStates, setCurrentJdStep, setCurrentJdInput, setJdInProgress, setMessages]);

  /* ------------------------------------------------------------
     MAIN MESSAGE HANDLER
     (Option A — Hybrid: both WS & manual matcher allowed)
  ------------------------------------------------------------ */
  const handleSend = useCallback(
    (message) => {
      if (!message || message.trim() === "") {
        setMessages([{ role: "assistant", content: "👋 How can I assist you today?" }]);
        return;
      }

      // 1️⃣ ALWAYS SEND MESSAGE TO THE WEBSOCKET FIRST
      sendMessage(message);
      lastUserMessageRef.current = message;

      // 2️⃣ If JD Creator is active, process locally
      if (window.__JD_MODE_ACTIVE__ || (selectedTask === "JD Creator" && jdInProgress)) {
        handleJdProcess(message);
        return;
      }

      if (selectedTask === "JD Creator" && !jdInProgress) {
        handleJdProcess(message);
        return;
      }

      // 3️⃣ DO NOT manually trigger Profile Matcher here
      // WebSocket `feature_detected` MUST decide this.
      // ❌ REMOVE THIS:
      // if (selectedTask === "Profile Matcher") {
      //   fetchProfileMatches(message);
      //   return;
      // }

      // 4️⃣ DONE — WebSocket will route the intent automatically
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

    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,

    handleSend,
    handleJdSend,
    uploadResumes: uploadResumesHandler,

    setMessages,
  };
};
