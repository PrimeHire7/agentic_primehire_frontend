// 📁 src/components/MainContent.jsx
import React, { useState, useEffect } from "react";
import ChatContainer from "@/chat/ChatContainer";
import ChatInput from "@/chat/ChatInput";

import ValidationPanel from "@/interview/ValidationPanel";
import InstructionsPanel from "@/interview/InstructionsPanel";
import InterviewMode from "@/interview/InterviewMode";

import "./MainContent.css";

export default function MainContent({
  messages = [],
  selectedFeature,
  selectedTask,
  setSelectedTask,
  isLoading,
  handleSend,
  handleTaskSelect,
}) {
  /* ------------------------------------------------------------
     LOGS (DEV MODE)
  ------------------------------------------------------------ */
  console.log("📌 [MC] RENDER ----");
  console.log("🟦 selectedFeature:", selectedFeature);
  console.log("🟩 selectedTask:", selectedTask);
  console.log("🟧 messagesCount:", messages.length);
  console.log("🟪 isLoading:", isLoading);

  /* ------------------------------------------------------------
     INTERVIEW BOT STATE
  ------------------------------------------------------------ */
  const [candidateState, setCandidateState] = useState({
    candidateName: "",
    candidateId: "",
    jdId: "",
    jdText: "",
  });

  /* ------------------------------------------------------------
     📌 HERO QUICK START SUPPORT
  ------------------------------------------------------------ */
  const [pendingTask, setPendingTask] = useState(null);

  const handleQuickStart = (task) => {
    console.log("🚀 [MC] QuickStart:", task);
    setPendingTask(task);
    handleTaskSelect?.(task);

    // send empty message to trigger feature state
    setTimeout(() => handleSend(""), 50);
  };

  /* ------------------------------------------------------------
     Resize observer for ChatInput safe area
  ------------------------------------------------------------ */
  useEffect(() => {
    const updateHeight = () => {
      const el = document.querySelector(".ci-shell");
      if (el) {
        document.documentElement.style.setProperty(
          "--ci-safe-height",
          `${el.offsetHeight + 30}px`
        );
      }
    };
    updateHeight();
    const obs = new ResizeObserver(updateHeight);
    const el = document.querySelector(".ci-shell");
    if (el) obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ------------------------------------------------------------
     🎥 INTERVIEW BOT OVERRIDE MODE
  ------------------------------------------------------------ */
  if (selectedFeature === "InterviewBot") {
    console.log("🎥 [MC] ENTERING INTERVIEW MODE OVERRIDE");

    if (selectedTask === "validation") {
      console.log("🟡 [MC] Rendering <ValidationPanel />");
      return (
        <div className="vp-page">
          <ValidationPanel
            onNext={(data) => {
              console.log("➡️ [MC] ValidationPanel → onNext:", data);
              setCandidateState(data);
              setSelectedTask("instructions");
            }}
          />
        </div>
      );
    }

    if (selectedTask === "instructions") {
      console.log("🟢 [MC] Rendering <InstructionsPanel />");
      return (
        <div className="mc-interview-wrapper">
          <InstructionsPanel
            candidateName={candidateState.candidateName}
            jd_text={candidateState.jdText}
            onNext={() => {
              console.log("➡️ [MC] Moving to INTERVIEW MODE");
              setSelectedTask("interview");
            }}
          />
        </div>
      );
    }

    if (selectedTask === "interview") {
      console.log("🔴 [MC] Rendering <InterviewMode />");
      return (
        <div className="mc-interview-wrapper">
          <InterviewMode
            candidateName={candidateState.candidateName}
            candidateId={candidateState.candidateId}
            jd_text={candidateState.jdText}
            jd_id={candidateState.jdId}
          />
        </div>
      );
    }

    console.log("⚠️ [MC] InterviewBot selected but NO VALID TASK FOUND!");
    return <div className="mc-interview-wrapper">⚠️ No task active</div>;
  }

  /* ------------------------------------------------------------
     DEFAULT CHAT MODE + HERO
  ------------------------------------------------------------ */

  const showHero =
    messages.length === 0 &&
    !selectedFeature &&
    !selectedTask;

  console.log("💬 [MC] showHero:", showHero);

  return (
    <div className="mc-root">

      {showHero ? (
        /* ------------------------------------------------------------
           HERO SECTION WITH ACTION CARDS (PrimeHire Style)
        ------------------------------------------------------------ */
        <section className="mc-hero">
          <div className="mc-hero-inner">

            <h1 className="mc-title">
              Welcome to <span className="mc-accent">PrimeHire AI</span>
            </h1>

            <p className="mc-subtitle">
              Your unified AI recruiting assistant — create JDs, match profiles,
              automate interviews, and manage hiring operations.
            </p>

            {/* ACTION CARDS */}
            <div className="mc-actions-grid">
              {[
                ["📝", "JD Creator", "Generate job descriptions instantly."],
                ["🎯", "Profile Matcher", "AI-ranked resumes in seconds."],
                ["📤", "Upload Resumes", "Parse & extract candidate insights."],
                ["🎤", "InterviewBot", "Automated AI-powered interviews."],
                ["📌", "Candidate Status", "Track your entire pipeline."],
                ["📝", "JD History", "View your previously generated JDs."],
                ["📈", "Match History", "Review past match results."],
              ].map(([icon, label, desc]) => (
                <div
                  key={label}
                  className="mc-action-card"
                  onClick={() => handleQuickStart(label)}
                >
                  <span className="mc-icon">{icon}</span>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>

            <ChatInput
              onSend={handleSend}
              activeTask={pendingTask}
              forceShowChips={true}
            />

          </div>
        </section>

      ) : (
        /* ------------------------------------------------------------
           CHAT MODE
        ------------------------------------------------------------ */
        <div className="mc-chat-mode">
          <div className="mc-chat-scroll">
            <ChatContainer
              messages={messages}
              selectedFeature={selectedFeature}
              selectedTask={selectedTask}
              isLoading={isLoading}
            />
          </div>

          <ChatInput
            onSend={handleSend}
            activeTask={pendingTask || selectedTask}
            forceShowChips={true}
          />
        </div>
      )}

    </div>
  );
}
