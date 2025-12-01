// src/hooks/useJDCreator.js
import { useState, useCallback } from "react";
import { generateSingleJD } from "@/utils/api";

export const useJDCreator = (setMessages, setIsLoading) => {
  const [jdInProgress, setJdInProgress] = useState(false);

  // ---------------------------------------------
  // ✨ Single Prompt JD → Just send natural text
  // ---------------------------------------------
  const handleJdProcess = useCallback(
    async (userMessage) => {
      if (!userMessage?.trim()) return;

      // JD mode ON
      setJdInProgress(true);
      setIsLoading(true);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📝 Processing your job description request…" },
      ]);

      try {
        const response = await generateSingleJD(userMessage);

        const html = response?.result?.html_jd || "<p>No JD generated</p>";

        // Render JD
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: html },
          {
            role: "assistant",
            content: "🎉 Your job description is ready!",
          },
        ]);

      } catch (err) {
        console.error("JD Creator Error:", err);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Failed to generate JD." },
        ]);
      } finally {
        setIsLoading(false);
        setJdInProgress(false);
      }
    },
    [setMessages, setIsLoading]
  );

  // Wrapper for message send
  const handleJdSend = (msg) => {
    if (!msg?.trim()) return;
    setIsLoading(true);
    handleJdProcess(msg);
  };

  return {
    jdInProgress,
    handleJdProcess,
    handleJdSend,
  };
};
