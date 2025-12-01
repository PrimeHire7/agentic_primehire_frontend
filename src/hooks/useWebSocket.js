// 📁 src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "@/utils/constants";
import { generateSingleJD } from "@/utils/api";

export const useWebSocket = (
  setSelectedFeature,
  setSelectedTask,
  fetchProfileMatches,
  setMessages,
  setIsLoading
) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const intentLockRef = useRef({ intent: null, ts: 0 });
  const uploadTriggeredRef = useRef(false);
  const lastUserMessageRef = useRef("");

  const allowIntent = (intent) => {
    const now = Date.now();
    const lock = intentLockRef.current;

    if (lock.intent === intent && now - lock.ts < 1200) return false;

    lock.intent = intent;
    lock.ts = now;
    return true;
  };

  /* =======================================================
      HANDLE INTENTS
  ======================================================= */
  const handleIntent = async (intent) => {
    if (!intent || !allowIntent(intent)) return;

    console.log("🎯 Executing Intent:", intent);

    /* ---------- JD CREATOR ---------- */
    if (intent === "JD Creator") {
      uploadTriggeredRef.current = false;

      const prompt = lastUserMessageRef.current.trim();
      if (!prompt) return;

      setMessages((p) => [...p, { role: "assistant", content: "📝 Creating JD…" }]);

      try {
        setIsLoading(true);

        const payload = await generateSingleJD(prompt);
        const jdHtml =
          payload.jd_html || payload.result?.html_jd || "<p>No JD generated</p>";

        // JD HTML + confirmation
        setMessages((p) => [
          ...p,
          {
            role: "assistant",
            type: "jd_output",
            content: jdHtml,
            meta: { ask_confirmation: true },
          },
        ]);

        setMessages((p) => [
          ...p,
          { role: "assistant", content: "🎉 JD generated successfully!" },
        ]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    /* ---------- PROFILE MATCHER ---------- */
    /* =======================================================
    PROFILE MATCHER (SAFE)
======================================================= */
    if (intent === "Profile Matcher") {
      uploadTriggeredRef.current = false;

      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🎯 Matching candidates…"
      }]);

      try {
        setIsLoading(true);

        const result = await fetchProfileMatches(jd);

        const safeCandidates = Array.isArray(result?.candidates)
          ? result.candidates
          : [];

        // Show profile table
        setMessages(prev => [
          ...prev,
          { role: "assistant", type: "profile_table", data: safeCandidates }
        ]);

        // Ask to upload resumes
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "📎 Would you like to upload more resumes for better matching?",
            meta: { ask_upload_resumes: true }
          }
        ]);

      } catch (err) {
        console.error("Profile Matcher Error:", err);

        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "❌ Failed to match profiles." }
        ]);

      } finally {
        setIsLoading(false);
      }

      return;
    }


    /* ---------- DIRECT UPLOAD INTENT ---------- */
    if (intent === "Upload Resumes") {
      if (uploadTriggeredRef.current) return;

      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload your resumes…",
        },
      ]);

      return;
    }
  };

  /* =======================================================
      WS MESSAGE HANDLER
  ======================================================= */
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 WS Received:", msg);

      // AI intent detection
      if (msg.type === "feature_detected" && msg.data) {
        lastUserMessageRef.current = msg.user_message || "";
        await handleIntent(msg.data);
        return;
      }

      // Assistant messages
      if (msg.type === "text") {
        setMessages((p) => [...p, { role: "assistant", content: msg.data }]);
        return;
      }

      // Profile match result
      /* =======================================================
    WS PROFILE TABLE (SAFE)
======================================================= */
      if (msg.type === "profile") {
        const safeCandidates = Array.isArray(msg.data?.candidates)
          ? msg.data.candidates
          : [];

        setMessages(prev => [
          ...prev,
          { role: "assistant", type: "profile_table", data: safeCandidates }
        ]);

        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content: "📎 Would you like to upload more resumes for better matching?",
            meta: { ask_upload_resumes: true }
          }
        ]);

        return;
      }


      // Resume table
      if (msg.type === "resume" && msg.data) {
        setMessages((p) => [
          ...p,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }
    },
    [setMessages]
  );

  /* =======================================================
      CONNECT WS
  ======================================================= */
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("🌐 WS connected");
    ws.onclose = () => {
      reconnectRef.current = setTimeout(connectWebSocket, 1500);
    };
    ws.onerror = () => ws.close();

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleWebSocketMessage(msg);
      } catch (err) {
        console.error("WS Parse Error:", err);
      }
    };
  }, [handleWebSocketMessage]);

  /* =======================================================
      YES — MATCH PROFILES
  ======================================================= */
  useEffect(() => {
    const onYes = async () => {
      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages((p) => [...p, { role: "assistant", content: "🔍 Matching profiles…" }]);

      setIsLoading(true);
      await fetchProfileMatches(jd);
      setIsLoading(false);
    };

    window.addEventListener("confirm_match_profiles", onYes);
    return () => window.removeEventListener("confirm_match_profiles", onYes);
  }, []);

  /* =======================================================
      YES — UPLOAD MORE RESUMES
  ======================================================= */
  useEffect(() => {
    const onUploadMore = () => {
      if (uploadTriggeredRef.current) return;

      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload more resumes to improve matching.",
        },
      ]);
    };

    window.addEventListener("trigger_upload_resumes", onUploadMore);
    return () =>
      window.removeEventListener("trigger_upload_resumes", onUploadMore);
  }, [setMessages, setSelectedFeature]);

  /* =======================================================
      INIT WS CONNECTION
  ======================================================= */
  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  /* =======================================================
      SEND MESSAGE
  ======================================================= */
  const sendMessage = useCallback(
    (msg) => {
      if (!msg.trim()) return;

      lastUserMessageRef.current = msg;

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ message: msg }));
        setMessages((p) => [...p, { role: "user", content: msg }]);
      }
    },
    [setMessages]
  );

  return { sendMessage };
};
