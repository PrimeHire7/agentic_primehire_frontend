import React, { useState } from "react";
import ChatContainer from "@/chat/ChatContainer";

import ValidationPanel from "@/interview/ValidationPanel";
import InstructionsPanel from "@/interview/InstructionsPanel";
import InterviewMode from "@/interview/InterviewMode";
import ChatInput from "@/chat/ChatInput";
import { FaFilePen } from "react-icons/fa6";

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
  const [candidateState, setCandidateState] = useState({
    candidateName: "",
    candidateId: "",
    jdId: "",
    jdText: "",
  });

  const [pendingTask, setPendingTask] = useState(null);

  const handleQuickStart = (task) => {
    setPendingTask(task);
    handleTaskSelect?.(task);
    setTimeout(() => handleSend(""), 50);
  };

  /* INTERVIEW BOT MODES */
  if (selectedFeature === "InterviewBot") {

    // 1 — VALIDATION
    if (selectedTask === "validation") {
      return (
        <div className="vp-page">
          <ValidationPanel
            onNext={(data) => {
              setCandidateState({
                candidateName: data.candidateName,
                candidateId: data.candidateId,
                jdId: data.jdId,
                jdText: data.jdText,
              });

              setSelectedTask("instructions");
            }}
          />
        </div>
      );
    }

    // 2 — INSTRUCTIONS
    if (selectedTask === "instructions") {
      return (
        <div className="mc-interview-wrapper">
          <InstructionsPanel
            candidateName={candidateState.candidateName}
            jd_text={candidateState.jdText}
            onNext={() => setSelectedTask("interview")}
          />
        </div>
      );
    }

    // 3 — INTERVIEW MODE
    if (selectedTask === "interview") {
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
  }


  /* HERO MODE CHECK */
  const showHero =
    messages.length === 0 &&
    !selectedFeature &&
    !selectedTask;

  return (
    <div className="mc-root">

      {/* ---------------- HERO OR CHAT SCROLL ---------------- */}
      {showHero ? (
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
                ["📤", "Upload Resumes", "Parse candidate insights."],
                // ["🎤", "InterviewBot", "Automated AI interviews."],
                // ["📌", "Candidate Status", "Track hiring pipeline."],
                // ["📝", "JD History", "Previous job descriptions."],
                // ["📈", "Match History", "Review past matches."],
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

          </div>
        </section>
      ) : (
        <div className="mc-chat-mode">
          <div className="mc-chat-scroll">
            <ChatContainer
              messages={messages}
              selectedFeature={selectedFeature}
              selectedTask={selectedTask}
              isLoading={isLoading}
              onTriggerFeature={handleTaskSelect}
            />
          </div>
        </div>
      )}

      {/* ---------------- ALWAYS SHOW CHAT INPUT ---------------- */}
      {/* <div className="mc-chatinput-wrapper">
        <ChatInput
          onSend={handleSend}
          activeTask={pendingTask || selectedTask}
          forceShowChips={true}
        />
      </div> */}

    </div>
  );
}
