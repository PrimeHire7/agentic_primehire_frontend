// 📁 src/hooks/useProfileMatcher.js
import { useState } from "react";
import { matchProfiles } from "@/utils/api";

/**
 * Hook that wraps the profile matcher pipeline.
 * It is used by:
 *  - useMainContent (manual "Profile Matcher" task)
 *  - useWebSocket (WS intent: "Profile Matcher")
 */
export const useProfileMatcher = (setMessages, setIsLoading, setSelectedTask) => {
  const [isMatching, setIsMatching] = useState(false);

  // Strip "Start Profile Matcher:" prefix etc. before sending to backend
  const cleanJDText = (t = "") =>
    t.replace(/^start profile matcher[:\-\s]*/i, "").trim();

  const fetchProfileMatches = async (jdText) => {
    const cleaned = cleanJDText(jdText || "");
    console.log("🧹 [Matcher] Cleaned JD text:", cleaned);

    if (!cleaned) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Please describe the role or paste a JD to match.",
        },
      ]);
      return { candidates: [] };
    }

    try {
      setIsMatching(true);
      if (setIsLoading) setIsLoading(true);

      console.log("📤 [Matcher] Calling matchProfiles() with JD:", cleaned);
      const response = await matchProfiles(cleaned);
      console.log("📥 [Matcher] Raw response:", response);

      const candidates = response?.candidates || [];
      const count = candidates.length;

      console.log("🟦 [Matcher] Candidates found:", count);

      if (count > 0) {
        // Show results in profile table
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "profile_table",
            data: candidates,
            jdText: cleaned,                   // ⭐ user’s JD prompt
            jdMeta: response?.jd_meta || {},  // optional
            jdId: null                         // JD-less mode
          },
        ]);

      } else {
        console.log("⚠️ [Matcher] No candidates → Auto-trigger upload resumes");

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ No matching candidates found." },
        ]);

        // 🔥 Let global listener open Upload Resumes UI
        window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
      }

      if (setSelectedTask) {
        setSelectedTask("Profile Matcher");
      }

      return { candidates };
    } catch (err) {
      console.error("❌ [Matcher] Profile match failed:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error matching profiles." },
      ]);

      // Optionally prompt upload resumes here too
      window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));

      return { candidates: [] };
    } finally {
      setIsMatching(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return { fetchProfileMatches, isMatching };
};
