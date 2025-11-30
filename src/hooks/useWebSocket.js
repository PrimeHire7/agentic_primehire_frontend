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

  const intentLockRef = useRef({
    intent: null,
    ts: 0,
  });

  const lastUserMessageRef = useRef("");

  /* =======================================================
     INTENT LOCK (prevents double-trigger)
  ======================================================= */
  const allowIntent = (intent) => {
    const now = Date.now();
    const lock = intentLockRef.current;

    if (lock.intent === intent && now - lock.ts < 1200) {
      console.warn("⛔ BLOCKED DUPLICATE INTENT:", intent);
      return false;
    }

    lock.intent = intent;
    lock.ts = now;
    return true;
  };

  /* =======================================================
     CLEAN INTENT HANDLER (no duplicates)
  ======================================================= */
  const handleIntent = async (intent) => {
    if (!intent) return;

    if (!allowIntent(intent)) return;

    console.log("🎯 Executing Intent:", intent);

    /* ---------------------------
       UI FEATURES (NO DUPLICATES)
    ---------------------------- */
    const featureUIs = {
      JDHistory: "📘 Showing JD History…",
      ProfileMatchHistory: "📊 Showing Profile Match History…",
      CandidateStatus: "📌 Showing Candidate Status…",
      InterviewBot: "🤖 InterviewBot activated!",
      ZohoBridge: "🔗 Opening Zoho Recruit Bridge…",
      MailMind: "📬 MailMind activated!",
      LinkedInPoster: "🔗 Posting on LinkedIn…",
      PrimeHireBrain: "🧠 Activating PrimeHire Brain…",
    };

    if (featureUIs[intent]) {
      setSelectedFeature(intent);
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: featureUIs[intent] },
        { role: "assistant", type: "feature_ui", feature: intent },
      ]);

      return;
    }

    /* ---------------------------
       JD CREATOR
    ---------------------------- */
    if (intent === "JD Creator") {
      const prompt = lastUserMessageRef.current.trim();
      if (!prompt) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📝 Creating JD…" },
      ]);

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

    /* ---------------------------
       PROFILE MATCHER
    ---------------------------- */
    if (intent === "Profile Matcher") {
      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🎯 Matching candidates…" },
      ]);

      try {
        setIsLoading(true);
        await fetchProfileMatches(jd);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    /* ---------------------------
       Upload Resumes
    ---------------------------- */
    if (intent === "Upload Resumes") {
      setSelectedFeature("Upload Resumes");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", type: "upload_ui", content: "📎 Upload your resumes…" },
      ]);
      return;
    }
  };

  /* =======================================================
     MASTER WS MESSAGE HANDLER
  ======================================================= */
  const handleWebSocketMessage = useCallback(
    async (msg) => {
      console.log("📩 WS Received:", msg);

      /* -------------------------------------------
         1) INTENT from backend → ONLY trigger here
      ------------------------------------------- */
      if (msg.type === "feature_detected" && msg.data) {
        lastUserMessageRef.current = msg.user_message || "";
        await handleIntent(msg.data);
        return;
      }

      /* -------------------------------------------
         2) IGNORE backend "✨ Detected request" text
      ------------------------------------------- */
      if (
        msg.type === "text" &&
        typeof msg.data === "string" &&
        msg.data.startsWith("✨ Detected request:")
      ) {
        return;
      }

      /* -------------------------------------------
         3) NORMAL assistant text
      ------------------------------------------- */
      if (msg.type === "text") {
        setMessages((prev) => [...prev, { role: "assistant", content: msg.data }]);
        return;
      }

      /* -------------------------------------------
         4) PROFILE MATCH TABLE
      ------------------------------------------- */
      if (msg.type === "profile" && msg.data?.candidates) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "profile_table", data: msg.data.candidates },
        ]);
        return;
      }

      /* -------------------------------------------
         5) RESUME TABLE
      ------------------------------------------- */
      if (msg.type === "resume" && msg.data) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", type: "resume_table", data: msg.data },
        ]);
        return;
      }
    },
    [setMessages]
  );

  /* =======================================================
     WS CONNECTION BOOT
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
        const msg =
          typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        handleWebSocketMessage(msg);
      } catch { }
    };
  }, [handleWebSocketMessage]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectRef.current);
    };
  }, [connectWebSocket]);

  /* =======================================================
     SEND
  ======================================================= */
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
