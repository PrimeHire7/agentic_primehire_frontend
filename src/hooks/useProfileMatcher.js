
// 📁 src/hooks/useProfileMatcher.js
import { useState } from "react";
import { matchProfiles } from "@/utils/api";

/**
 * Hook that wraps the profile matcher pipeline.
 * Used by:
 *  - useMainContent
 *  - useWebSocket
 */
export const useProfileMatcher = (
  setMessages,
  setIsLoading,
  setSelectedTask
) => {
  const [isMatching, setIsMatching] = useState(false);

  // Strip "Start Profile Matcher:" prefix etc.
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
      const jdId = response?.jd_id || null;          // ✅ FIX
      const jdMeta = response?.jd_meta || {};

      console.log("🟦 [Matcher] Candidates:", candidates.length);
      console.log("🆔 [Matcher] JD ID:", jdId);

      if (candidates.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "profile_table",
            data: candidates,
            jdText: cleaned,
            jdMeta,
            jdId,                                      // ✅ PASS REAL JD ID
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "⚠️ No matching candidates found." },
        ]);

        window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
      }

      if (setSelectedTask) {
        setSelectedTask("Profile Matcher");
      }

      return { candidates, jdId, jdMeta };
    } catch (err) {
      console.error("❌ [Matcher] Profile match failed:", err);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error matching profiles." },
      ]);

      window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
      return { candidates: [] };
    } finally {
      setIsMatching(false);
      if (setIsLoading) setIsLoading(false);
    }
  };

  return { fetchProfileMatches, isMatching };
};
