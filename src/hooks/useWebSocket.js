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

  /* =======================================================
        GLOBAL LOCKS
  ======================================================= */
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
        INTENT EXECUTION
  ======================================================= */
  const handleIntent = async (intent) => {
    if (!intent) return;
    if (!allowIntent(intent)) return;

    console.log("🎯 Executing Intent:", intent);

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

    /* =======================================================
        FEATURE UI HANDLER (ALL FIXES APPLIED)
    ======================================================= */
    if (featureUIs[intent]) {
      uploadTriggeredRef.current = false;
      setSelectedFeature(intent);
      setSelectedTask("");

      const content = featureUIs[intent] || `Showing ${intent} UI`;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content },
        {
          role: "assistant",
          type: "feature_ui",
          feature: intent,
          content,
          meta: {},
        },
      ]);

      return;
    }

    /* =======================================================
        JD CREATOR
    ======================================================= */
    if (intent === "JD Creator") {
      uploadTriggeredRef.current = false;

      const prompt = lastUserMessageRef.current.trim();
      if (!prompt) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "📝 Creating JD…" },
      ]);

      try {
        setIsLoading(true);
        const payload = await generateSingleJD(prompt);

        if (!payload || payload.ok === false) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `❌ ${payload?.error || "JD generation failed"}`,
            },
          ]);
          return;
        }

        const jdHtml =
          payload.jd_html ||
          payload.result?.html_jd ||
          "<p>No JD generated</p>";

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: jdHtml,
            meta: { ask_confirmation: payload.ask_confirmation === true },
          },
          {
            role: "assistant",
            content: "🎉 JD generated successfully!",
          },
        ]);
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "❌ Failed to generate JD." },
        ]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    /* =======================================================
        PROFILE MATCHER FLOW (SAFE & CLEAN)
    ======================================================= */
    if (intent === "Profile Matcher") {
      uploadTriggeredRef.current = false;

      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🎯 Matching candidates…" },
      ]);

      try {
        setIsLoading(true);
        const result = await fetchProfileMatches(jd);

        const candidates = result?.candidates || [];

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "profile_table",
            data: candidates,
          },
        ]);

        // Ask to upload resumes
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "📎 Would you like to upload more resumes for better matching?",
            meta: { ask_upload_resumes: true },
          },
        ]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    if (intent === "ProfileMatchHistory") {
      setSelectedFeature("ProfileMatchHistory");
      setSelectedTask("");

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          type: "feature_ui",
          feature: "ProfileMatchHistory",
          content: "📊 Showing previous profile match results…"
        }
      ]);

      return;
    }

    /* =======================================================
        UPLOAD RESUMES TRIGGER
    ======================================================= */
    if (intent === "Upload Resumes") {
      if (uploadTriggeredRef.current) return;

      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");

      setMessages((prev) => [
        ...prev,
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

      if (msg.type === "feature_detected" && msg.data) {
        lastUserMessageRef.current = msg.user_message || "";
        await handleIntent(msg.data);
        return;
      }

      // Regular text stream
      if (msg.type === "text") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: msg.data },
        ]);
        return;
      }

      // Profile table from backend
      if (msg.type === "profile" && msg.data?.candidates) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            type: "profile_table",
            data: msg.data.candidates,
          },
        ]);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "📎 Would you like to upload more resumes for better matching?",
            meta: { ask_upload_resumes: true },
          },
        ]);

        return;
      }

      // Resume table
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
        CONNECT WEBSOCKET
  ======================================================= */
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => console.log("🌐 WS connected");
    ws.onerror = () => ws.close();

    ws.onclose = () => {
      reconnectRef.current = setTimeout(connectWebSocket, 1500);
    };

    ws.onmessage = (event) => {
      try {
        const msg =
          typeof event.data === "string"
            ? JSON.parse(event.data)
            : event.data;
        handleWebSocketMessage(msg);
      } catch (err) {
        console.error("WS parse error:", err, event.data);
      }
    };
  }, [handleWebSocketMessage]);

  /* =======================================================
        YES — MATCH PROFILES
  ======================================================= */
  useEffect(() => {
    const runMatch = async () => {
      const jd = lastUserMessageRef.current.trim();
      if (!jd) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🔍 Matching profiles…" },
      ]);

      setIsLoading(true);
      await fetchProfileMatches(jd);
      setIsLoading(false);
    };

    window.addEventListener("confirm_match_profiles", runMatch);
    return () =>
      window.removeEventListener("confirm_match_profiles", runMatch);
  }, []);

  /* =======================================================
        YES — UPLOAD MORE RESUMES
  ======================================================= */
  useEffect(() => {
    const openUpload = () => {
      if (uploadTriggeredRef.current) return;

      uploadTriggeredRef.current = true;

      setSelectedFeature("Upload Resumes");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload more resumes to improve matching.",
        },
      ]);
    };

    window.addEventListener("trigger_upload_resumes", openUpload);
    return () =>
      window.removeEventListener("trigger_upload_resumes", openUpload);
  }, []);

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
        setMessages((prev) => [...prev, { role: "user", content: msg }]);
      }
    },
    [setMessages]
  );

  return { sendMessage };
};
