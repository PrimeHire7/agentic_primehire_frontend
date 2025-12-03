// // 📁 src/hooks/useProfileMatcher.js
// import { useCallback } from "react";
// import { API_BASE } from "@/utils/constants";

// export const useProfileMatcher = (setMessages, setIsLoading, setSelectedTask) => {
//   const fetchProfileMatches = useCallback(
//     async (promptMessage) => {
//       console.log("🧩 [ProfileMatcher] fetchProfileMatches() called");

//       if (!promptMessage || !promptMessage.trim()) {
//         console.warn("⚠️ [ProfileMatcher] Empty JD text received!");
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content:
//               "⚠️ No JD text provided for matching. Please type a job description first.",
//           },
//         ]);
//         return;
//       }

//       // 🔒 Lock routing mode
//       window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
//       window.dispatchEvent(new Event("profile_match_start"));
//       console.log("🔒 [ProfileMatcher] Locking routing — fetching candidates...");

//       setIsLoading(true);
//       console.log(`📤 [ProfileMatcher] Sending JD text to backend:`, promptMessage);

//       try {
//         const response = await fetch(`${API_BASE}/mcp/tools/match/profile/match`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ jd_text: promptMessage }),
//         });

//         console.log(`📡 [ProfileMatcher] API response status: ${response.status}`);

//         if (!response.ok) {
//           const text = await response.text();
//           console.error(`❌ [ProfileMatcher] Bad response - Status ${response.status}:`, text);
//           throw new Error(`Status ${response.status} - ${text}`);
//         }

//         const data = await response.json();
//         console.log("✅ [ProfileMatcher] Response JSON received:", data);

//         const candidates = data.candidates || [];
//         if (candidates.length > 0) {
//           console.log(`🎯 [ProfileMatcher] ${candidates.length} candidates matched.`);
//           setMessages(prev => [
//             ...prev,
//             { role: "assistant", type: "profile_table", data: candidates },
//           ]);
//         }
//         else {
//           console.warn("⚠️ [ProfileMatcher] No candidates returned.");

//           // Show only one message
//           setMessages(prev => [
//             ...prev,
//             { role: "assistant", content: "⚠️ No matching candidates found." }
//           ]);

//           // Trigger Upload UI (WebSocket listener handles it)
//           window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
//         }


//         // ✅ Unlock routing + notify UI
//         setTimeout(() => {
//           window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//           window.__PROFILE_MATCH_RECENTLY_DONE__ = Date.now();
//           window.dispatchEvent(new Event("profile_match_done"));
//           if (typeof setSelectedTask === "function") setSelectedTask("");
//           console.log("🔓 [ProfileMatcher] Routing unlocked — back to WebSocket mode.");
//         }, 300);
//       } catch (err) {
//         console.error("🔥 [ProfileMatcher] Failed to fetch profile matches:", err);
//         setMessages((prev) => [
//           ...prev,
//           {
//             role: "assistant",
//             content: "❌ Failed to fetch profile matches. Please try again later.",
//           },
//         ]);

//         // 🔓 Unlock even on error
//         window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//         window.dispatchEvent(new Event("profile_match_done"));
//       } finally {
//         console.log("🧹 [ProfileMatcher] Done fetching matches.");
//         setIsLoading(false);
//       }
//     },
//     [setMessages, setIsLoading, setSelectedTask]
//   );

//   return { fetchProfileMatches };
// };
// 📁 src/hooks/useProfileMatcher.js
import { useCallback } from "react";
import { API_BASE } from "@/utils/constants";

export const useProfileMatcher = (setMessages, setIsLoading, setSelectedTask) => {
  const fetchProfileMatches = useCallback(
    async (promptMessage) => {
      console.log("🧩 [ProfileMatcher] fetchProfileMatches() called");

      if (!promptMessage || !promptMessage.trim()) {
        console.warn("⚠️ [ProfileMatcher] Empty JD text received!");
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "⚠️ No JD text provided for matching. Please type a job description first.",
          },
        ]);
        return { candidates: [] };
      }

      // 🔒 Lock routing mode
      window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
      window.dispatchEvent(new Event("profile_match_start"));
      console.log("🔒 [ProfileMatcher] Locking routing — fetching candidates...");

      setIsLoading(true);
      console.log(`📤 [ProfileMatcher] Sending JD text to backend:`, promptMessage);

      let candidates = [];

      try {
        const response = await fetch(`${API_BASE}/mcp/tools/match/profile/match`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jd_text: promptMessage }),
        });

        console.log(`📡 [ProfileMatcher] API response status: ${response.status}`);

        if (!response.ok) {
          const text = await response.text();
          console.error(
            `❌ [ProfileMatcher] Bad response - Status ${response.status}:`,
            text
          );
          throw new Error(`Status ${response.status} - ${text}`);
        }

        const data = await response.json();
        console.log("✅ [ProfileMatcher] Response JSON received:", data);

        candidates = data.candidates || [];

        if (candidates.length > 0) {
          console.log(`🎯 [ProfileMatcher] ${candidates.length} candidates matched.`);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", type: "profile_table", data: candidates },
          ]);
        } else {
          console.warn("⚠️ [ProfileMatcher] No candidates returned.");

          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "⚠️ No matching candidates found." },
          ]);
        }

        // ✅ Unlock routing + notify UI
        setTimeout(() => {
          window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
          window.__PROFILE_MATCH_RECENTLY_DONE__ = Date.now();
          window.dispatchEvent(new Event("profile_match_done"));
          if (typeof setSelectedTask === "function") setSelectedTask("");
          console.log("🔓 [ProfileMatcher] Routing unlocked — back to WebSocket mode.");
        }, 300);
      } catch (err) {
        console.error("🔥 [ProfileMatcher] Failed to fetch profile matches:", err);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "❌ Failed to fetch profile matches. Please try again later.",
          },
        ]);

        // 🔓 Unlock even on error
        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
        window.dispatchEvent(new Event("profile_match_done"));
      } finally {
        console.log("🧹 [ProfileMatcher] Done fetching matches.");
        setIsLoading(false);
      }

      // 👇 Let WebSocket know what happened
      return { candidates };
    },
    [setMessages, setIsLoading, setSelectedTask]
  );

  return { fetchProfileMatches };
};
