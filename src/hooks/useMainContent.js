import { useState, useCallback } from "react";
import { useWebSocket } from "./useWebSocket";
import { useJDCreator } from "./useJDCreator";
import { useProfileMatcher } from "./useProfileMatcher";
import { uploadResumes, generateJd } from "@/utils/api"; // ✅ Import from correct path

export const useMainContent = () => {
  const [selectedFeature, setSelectedFeature] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    messages,
    setMessages,
    handleSend: handleWebSocketSend
  } = useWebSocket();

  const {
    jdAnswers,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    handleJdProcess,
    handleJdSend
  } = useJDCreator(setMessages, setIsLoading);

  const {
    fetchProfileMatches
  } = useProfileMatcher(setMessages, setIsLoading);
  // 👇 Add this helper before handleFeatureClick()
  const resetAllFeatureStates = () => {
    // ✅ Only reset global/shared states that belong to MainContent
    setMessages([]);
    setSelectedTask("");
    setIsLoading(false);

    // Shared filters and summaries
    // setDisplayedMatches([]);
    // setFilterQuery("");
    // setMinScoreFilter(0);
    // setSortConfig({ key: "scores.final_score", direction: "desc" });
    // setSummary({ best: 0, good: 0, partial: 0 });
    // setSelectedCategory(null);

    // Shared data that’s actually defined here
    // setResponses({});
    // setAnomaliesList([]);

    // 🧹 Do NOT reset child component state like setCandidateName, setJdAnswers, etc.
    // They reset automatically when the feature component unmounts.
  };


  // const handleFeatureClick = useCallback((feature) => {
  //   setSelectedFeature(feature);
  //   setMessages([]);
  // }, [setMessages]);
  const handleFeatureClick = (feature) => {
    console.log("🧭 Feature clicked:", feature);

    resetAllFeatureStates();

    setSelectedTask(""); // ✅ clear active task
    setSelectedFeature(feature);

    switch (feature) {
      case "ZohoBridge":
        console.log("🔗 ZohoBridge selected");
        break;
      case "MailMind":
        console.log("🧠 MailMind selected");
        break;
      case "LinkedInPoster":
        console.log("💼 LinkedIn Poster selected");
        break;
      case "PrimeHireBrain":
        console.log("🤖 PrimeHire Brain selected");
        break;
      default:
        console.log("🌀 Unknown feature");
    }
  };


  // const handleTaskSelect = useCallback((task) => {
  //   setSelectedTask(task);
  //   if (task === "JD Creator") {
  //     setMessages(prev => [...prev, {
  //       role: "assistant",
  //       content: "Let's create a job description! What is the job title/role?"
  //     }]);
  //   }
  // }, [setMessages]);
  const handleTaskSelect = useCallback((task) => {
    console.log("🧭 Task selected:", task);

    // 🧹 Step 1: Clear existing feature when switching task
    setSelectedFeature(""); // ✅ hides Zoho / MailMind / PrimeHireBrain UI

    // 🧹 Step 2: Clear previous messages before switching task
    setMessages([]);

    // 🧠 Step 3: Activate new task
    setSelectedTask(task);

    // 🧩 Step 4: Task-specific initialization
    switch (task) {
      case "JD Creator":
        setMessages([
          { role: "assistant", content: "Let's create a job description! What is the job title/role?" },
        ]);
        break;

      case "Profile Matcher":
        setMessages([
          { role: "assistant", content: "Paste a JD to start matching profiles." },
        ]);
        break;

      case "Upload Resumes":
        setMessages([
          { role: "assistant", content: "📄 Upload resumes to begin extraction." },
        ]);
        break;

      default:
        console.log("⚙ No specific initialization for:", task);
        break;
    }
  }, [setMessages, setSelectedFeature, setSelectedTask]);


  const handleRefresh = useCallback(() => {
    setIsLoading(false);
    setMessages([]);
    setSelectedFeature("");
    setSelectedTask("");
  }, [setMessages]);

  const handleSend = useCallback((message) => {
    if (!message.trim()) return;

    // 🧹 Clear irrelevant message types (profile_table, resume_table)
    setMessages(prev =>
      prev.filter(
        msg =>
          (selectedTask === "Profile Matcher" && msg.type === "profile_table") ||
          (selectedTask === "Upload Resumes" && msg.type === "resume_table") ||
          (!msg.type && selectedTask === "JD Creator") // keep normal chat for JD
      )
    );

    // Append new user message
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    // Route message to respective task
    if (selectedTask === "JD Creator") {
      handleJdProcess(message);
    } else if (selectedTask === "Profile Matcher") {
      fetchProfileMatches(message);
    } else {
      handleWebSocketSend(message, selectedTask);
    }
  }, [selectedTask, handleJdProcess, fetchProfileMatches, handleWebSocketSend, setMessages]);


  const uploadResumesHandler = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);

    try {
      const result = await uploadResumes(files);
      setMessages(prev => [
        ...prev,
        { role: "assistant", type: "resume_table", data: result.uploaded_files }
      ]);
    } catch (error) {
      console.error("Upload error:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "❌ Failed to upload resumes. Try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [setMessages]);

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
    uploadResumes: uploadResumesHandler
  };
};