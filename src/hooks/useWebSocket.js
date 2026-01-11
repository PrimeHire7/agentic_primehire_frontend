
// 📁 src/hooks/useWebSocket.js
import { useEffect, useRef, useCallback } from "react";
import { WS_URL, API_BASE } from "@/utils/constants";
import { generateSingleJD } from "@/utils/api";

export const useWebSocket = (
  setSelectedFeature,
  setSelectedTask,
  fetchProfileMatches,
  setMessages,
  setIsLoading,
  handleJdProcess
) => {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  /* =======================================================
      GLOBAL REFS & STATE
  ======================================================= */
  const intentLockRef = useRef({ intent: null, ts: 0 });
  const uploadTriggeredRef = useRef(false);
  const lastUserMessageRef = useRef("");

  // ⭐ JD clarification state
  const jdClarifyStateRef = useRef(null);

  // ⭐ JD clarifier API
  const callJDClarifier = async (jdText) => {
    try {
      const resp = await fetch(`${API_BASE}/mcp/tools/match/clarify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: jdText }),
      });
      return await resp.json();
    } catch (err) {
      console.error("JD Clarifier Error:", err);
      return { complete: true, questions: [] };
    }
  };

  /* =======================================================
      INTENT DEBOUNCING
  ======================================================= */
  const allowIntent = (intent) => {
    const now = Date.now();
    const lock = intentLockRef.current;

    if (lock.intent === intent && now - lock.ts < 1200) {
      console.log(`⛔ Intent "${intent}" blocked duplicate`);
      return false;
    }
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
      ZohoBridge: "🔗 Opening Zoho Recruit Bridge…",
      MailMind: "📬 MailMind activated!",
      LinkedInPoster: "🔗 Posting on LinkedIn…",
      PrimeHireBrain: "🧠 Activating PrimeHire Brain…",
    };

    /* ===========================
         FEATURE UI REDIRECTS
    ============================ */
    if (featureUIs[intent]) {
      uploadTriggeredRef.current = false;
      setSelectedFeature(intent);
      setSelectedTask("");

      const content = featureUIs[intent];

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content },
        {
          role: "assistant",
          type: "feature_ui",
          feature: intent,
          content,
        },
      ]);
      return;
    }

    /* ===========================
         JD CREATOR
    ============================ */
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
          { role: "assistant", content: "🎉 JD generated successfully!" },
        ]);
      } finally {
        setIsLoading(false);
      }

      return;
    }

    /* =======================================================
         PROFILE MATCHER — WITH CLARIFICATION
    ======================================================= */
    if (intent === "Profile Matcher") {
      uploadTriggeredRef.current = false;

      let jd = lastUserMessageRef.current.trim();
      jd = jd.replace(/^start profile matcher[:\-\s]*/i, "").trim(); // ⭐ REMOVE PREFIX

      if (!jd) return;

      // 1) Ask backend if JD needs clarification
      const clarify = await callJDClarifier(jd);
      const complete = clarify?.complete ?? true;
      const questions = clarify?.questions || [];

      // 2) Needs clarification → ask FIRST question only
      if (!complete && questions.length > 0) {
        jdClarifyStateRef.current = {
          jd,
          questions,
          answers: [],
          currentIndex: 0,
        };

        const firstQ = questions[0];

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `❓ ${firstQ}` },
        ]);

        return; // wait for answer
      }

      // 3) JD complete → run matching
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🎯 Matching candidates…" },
      ]);

      setIsLoading(true);
      const result = await fetchProfileMatches(jd);
      const candidates = result?.candidates || [];

      if (candidates.length === 0) {
        window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
      }

      setIsLoading(false);
      return;
    }

    /* ===========================
         MATCH HISTORY
    ============================ */
    if (intent === "ProfileMatchHistory") {
      setSelectedFeature("ProfileMatchHistory");
      setSelectedTask("");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "feature_ui",
          feature: "ProfileMatchHistory",
          content: "📊 Showing previous profile match results…",
        },
      ]);
      return;
    }

    // /* ===========================
    //      UPLOAD RESUMES
    // ============================ */
    // if (intent === "Upload Resumes") {
    //   if (uploadTriggeredRef.current) return;

    //   uploadTriggeredRef.current = true;
    //   setSelectedFeature("Upload Resumes");

    //   setMessages((prev) => [
    //     ...prev,
    //     {
    //       role: "assistant",
    //       type: "upload_ui",
    //       content: "📎 Upload your resumes…",
    //     },
    //   ]);

    //   return;
    // }
    /* ===========================
      UPLOAD RESUMES — PATCHED
   ============================ */
    if (/upload\s+resume/i.test(intent)) {
      console.log("📤 [INTENT] Normalized Upload Resumes");

      // Always normalize the name (handles: Upload Resume, Upload Resumes, Upload all resumes…)
      intent = "Upload Resumes";

      // 🔥 ALWAYS allow triggering — remove old lock failures
      uploadTriggeredRef.current = false;

      // 🔥 Make sure "Upload UI" ALWAYS displays by pushing BOTH:
      // 1) A visible assistant message
      // 2) The actual UploadUI component
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "📎 Please upload your resumes below.",
        },
        {
          role: "assistant",
          type: "upload_ui",
          content: "📎 Upload your resumes…",
          feature: "Upload Resumes",
        }
      ]);

      // Set global feature state
      setSelectedFeature("Upload Resumes");
      setSelectedTask("");

      return;
    }

    /* ===========================
         INTERVIEW BOT
    ============================ */
    if (intent === "InterviewBot") {
      setSelectedFeature("InterviewBot");
      setSelectedTask("validation");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          type: "feature_ui",
          feature: "InterviewBot",
          content: "🤖 Starting AI Interview — launching validation...",
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

      /* =======================================================
            JD CLARIFICATION MODE
      ======================================================= */
      if (jdClarifyStateRef.current) {
        const state = jdClarifyStateRef.current;

        // Clean answer prefix
        if (msg.user_message) {
          let ans = msg.user_message.trim();
          ans = ans.replace(/^start profile matcher[:\-\s]*/i, "").trim(); // ⭐ remove prefix
          state.answers[state.currentIndex] = ans;
        }

        // Move to next question
        state.currentIndex++;

        // Still questions left?
        if (state.currentIndex < state.questions.length) {
          const nextQ = state.questions[state.currentIndex];

          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: `❓ ${nextQ}` },
          ]);

          return;
        }

        // All questions answered → Build final JD
        let finalJD = state.jd + "\n\nAdditional details:\n";
        state.questions.forEach((q, i) => {
          finalJD += `${q}: ${state.answers[i]}\n`;
        });

        jdClarifyStateRef.current = null;
        lastUserMessageRef.current = finalJD;

        // Auto-run match
        window.dispatchEvent(new CustomEvent("confirm_match_profiles"));
        return;
      }

      /* =======================================================
            NORMAL FEATURE DETECTION
      ======================================================= */
      if (msg.type === "feature_detected" && msg.data) {
        // lastUserMessageRef.current = msg.user_message || "";
        await handleIntent(msg.data);
        return;
      }

      /* =======================================================
            NORMAL TEXT MESSAGE
      ======================================================= */
      if (msg.type === "text") {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: msg.data },
        ]);
        return;
      }

      /* =======================================================
            RESUME TABLE
      ======================================================= */
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
        WEBSOCKET CONNECT
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
        MATCH CONFIRM EVENT
  ======================================================= */
  useEffect(() => {
    const runMatch = async () => {
      let jd = lastUserMessageRef.current.trim();
      jd = jd.replace(/^start profile matcher[:\-\s]*/i, "").trim(); // ⭐ Clean JD again

      if (!jd) return;

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🔍 Matching profiles…" },
      ]);

      setIsLoading(true);
      const result = await fetchProfileMatches(jd);
      const candidates = result?.candidates || [];

      if (candidates.length === 0) {
        window.dispatchEvent(new CustomEvent("trigger_upload_resumes"));
      }

      setIsLoading(false);
    };

    window.addEventListener("confirm_match_profiles", runMatch);
    return () =>
      window.removeEventListener("confirm_match_profiles", runMatch);
  }, []);

  /* =======================================================
        UPLOAD MORE RESUMES TRIGGER
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
        INIT WEBSOCKET ON MOUNT
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
