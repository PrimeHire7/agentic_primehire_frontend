// 📁 src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/utils/constants";
import { generateSingleJD } from "@/utils/api";

export const useWebSocket = (
  setSelectedFeature,
  setSelectedTask,
  fetchProfileMatches,
  setMessages,
  setIsLoading,
) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const lastIntentRef = useRef({ name: null, ts: 0 });
  const lastUserMessageRef = useRef("");

  /* ---------------------------------------------
     STRICT TEXT INTENT DETECTOR (only for tasks)
  --------------------------------------------- */
  const detectIntentFromText = (text) => {
    if (!text || typeof text !== "string") return null;

    const raw = text.trim();

    // ignore backend routing text
    const ignore = [
      /detected feature/i,
      /detected task/i,
      /opening.*module/i,
      /routing your request/i,
      /processing your request/i,
    ];
    if (ignore.some((p) => p.test(raw))) return null;

    // Start <task>
    if (/^start\s+profile\s*matcher\b/i.test(raw)) return "Profile Matcher";
    if (/^start\s+jd\s*creator\b/i.test(raw)) return "JD Creator";
    if (/^start\s+upload\s+resumes\b/i.test(raw)) return "Upload Resumes";

    // Use <feature>
    if (/^use\s+zohobridge\b/i.test(raw)) return "ZohoBridge";
    if (/^use\s+mailmind\b/i.test(raw)) return "MailMind";
    if (/^use\s+primehire\s*brain\b/i.test(raw)) return "PrimeHireBrain";
    if (/^use\s+interview\s*bot\b/i.test(raw)) return "InterviewBot";
    if (/^use\s+linkedin\s*poster\b/i.test(raw)) return "LinkedInPoster";

    // Short form
    if (/^profile\s*matcher[:\s]/i.test(raw)) return "Profile Matcher";
    if (/^jd\s*creator[:\s]/i.test(raw)) return "JD Creator";
    if (/^upload\s+resumes[:\s]/i.test(raw)) return "Upload Resumes";

    // 🚫 ABSOLUTELY DO NOT detect JDHistory / MatchHistory / CandidateStatus from text
    // They ONLY trigger from WebSocket.

    return null;
  };

  /* ---------------------------------------------
     MAIN WS MESSAGE HANDLER
  --------------------------------------------- */
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 WS:", msg);

      // structured intent from backend
      if ((msg.type === "feature_detected" || msg.type === "task_detected") && msg.data) {
        if (msg.user_message) {
          lastUserMessageRef.current = msg.user_message;
        }
        await handleIntent(msg.data);
        return;
      }

      // text messages
      if (msg.type === "text" && typeof msg.data === "string") {
        const text = msg.data;

        if (window.__JD_MODE_ACTIVE__ || window.__PROFILE_MATCH_MODE_ACTIVE__) {
          setMessages((prev) => [...prev, { role: "assistant", content: text }]);
          return;
        }

        // only detect allowed tasks/features
        const detected = detectIntentFromText(text);
        if (detected) {
          await handleIntent(detected);
          return;
        }

        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
        return;
      }

      // profile match structured data
      if ((msg.type === "structured" || msg.type === "profile") && msg.data?.candidates) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "profile_table", data: msg.data.candidates },
        ]);
        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
        return;
      }

      // resume table
      if (msg.type === "resume" && msg.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }

      // fallback
      if (typeof msg === "string") {
        setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
      }
    },
    [setMessages]
  );

  /* ---------------------------------------------
     INTENT ROUTER
  --------------------------------------------- */
  const handleIntent = async (intent) => {
    console.log("🎯 Intent:", intent);
    if (!intent) return;

    /* ---------------------------------------------
       UI MODULE INTENTS (NO DETECTION — ONLY WS)
    --------------------------------------------- */

    if (intent === "JDHistory") {
      setSelectedFeature("JDHistory");
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📘 Showing JD History..." },
        { role: "assistant", type: "feature_ui", feature: "JDHistory" },
      ]);
      return;
    }

    if (intent === "ProfileMatchHistory") {
      setSelectedFeature("ProfileMatchHistory");
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📊 Showing Profile Match History..." },
        { role: "assistant", type: "feature_ui", feature: "ProfileMatchHistory" },
      ]);
      return;
    }

    if (intent === "CandidateStatus") {
      setSelectedFeature("CandidateStatus");
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📋 Showing Candidate Status..." },
        { role: "assistant", type: "feature_ui", feature: "CandidateStatus" },
      ]);
      return;
    }

    if (intent === "InterviewBot") {
      setSelectedFeature("InterviewBot");
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🤖 InterviewBot activated!" },
        { role: "assistant", type: "feature_ui", feature: "InterviewBot" },
      ]);
      return;
    }

    /* ---------------------------------------------
       FEATURE MODULES
    --------------------------------------------- */
    if (["ZohoBridge", "MailMind", "PrimeHireBrain", "LinkedInPoster"].includes(intent)) {
      setSelectedFeature(intent);
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚡ Activated feature: ${intent}` },
        { role: "assistant", type: "feature_ui", feature: intent },
      ]);
      return;
    }

    /* ---------------------------------------------
       TASKS
    --------------------------------------------- */

    if (intent === "JD Creator") {
      setMessages((prev) => [...prev, { role: "assistant", content: "📝 Creating JD..." }]);

      const prompt = lastUserMessageRef.current;
      if (!prompt.trim()) return;

      try {
        setIsLoading(true);
        const result = await generateSingleJD(prompt);
        const jdText = result?.result?.markdown_jd || "⚠️ No JD generated.";
        setMessages((prev) => [...prev, { role: "assistant", content: jdText }]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (intent === "Profile Matcher") {
      window.__PROFILE_MATCH_MODE_ACTIVE__ = true;
      const jd = lastUserMessageRef.current;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🎯 Matching candidates..." },
      ]);

      try {
        setIsLoading(true);
        await fetchProfileMatches(jd);
      } finally {
        setIsLoading(false);
        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
      }
      return;
    }

    if (intent === "Upload Resumes") {
      setSelectedFeature("Upload Resumes");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "upload_ui", content: "📎 Upload resumes…" },
      ]);
      return;
    }
  };

  /* ---------------------------------------------
     WS CONNECT
  --------------------------------------------- */
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("WS connected");
    ws.onmessage = (event) => {
      try {
        const msg =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleWebSocketMessage(msg);
      } catch { }
    };
    ws.onclose = () => {
      reconnectRef.current = setTimeout(connectWebSocket, 2000);
    };
    ws.onerror = () => ws.close();
  }, [handleWebSocketMessage]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  /* ---------------------------------------------
     SEND MESSAGE
  --------------------------------------------- */
  const sendMessage = useCallback(
    (msg) => {
      if (!msg.trim()) return;

      lastUserMessageRef.current = msg;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message: msg }));
        setMessages((prev) => [...prev, { role: "user", content: msg }]);
      }
    },
    [setMessages]
  );

  return { sendMessage };
};
