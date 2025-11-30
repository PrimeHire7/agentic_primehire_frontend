import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ProfileTable from "./ProfileTable";
import ResumeTable from "@/chat/ResumeTable";
import JDTaskUI from "@/pages/JDTaskUI";
import UploadUI from "./UploadUI";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import JDHistory from "@/pages/JDHistory";
import Designation from "../CandidateStatus/Designation";

import "./UploadUI.css";

const MessageRenderer = React.memo(({ message, onTriggerFeature }) => {
  if (!message) return null;

  /* ============================================================
     STRUCTURED TABLES
  ============================================================ */
  if (message.type === "profile_table") {
    return <ProfileTable data={message.data || {}} />;
  }

  if (message.type === "resume_table") {
    return <ResumeTable data={message.data || {}} />;
  }

  /* ============================================================
     JD UI (legacy)
  ============================================================ */
  if (message.type === "jd_ui") {
    const {
      currentJdStep,
      currentJdPrompt,
      currentJdInput,
      setCurrentJdInput,
      handleJdSend,
      jdInProgress,
      messages,
    } = message.data || {};

    return (
      <div className="message-block feature-block">
        <JDTaskUI
          currentJdStep={currentJdStep}
          currentJdPrompt={
            typeof currentJdPrompt === "object"
              ? currentJdPrompt?.prompt
              : currentJdPrompt
          }
          currentJdInput={currentJdInput}
          setCurrentJdInput={setCurrentJdInput}
          handleJdSend={handleJdSend}
          jdInProgress={jdInProgress}
          messages={messages}
        />
      </div>
    );
  }

  /* ============================================================
     UPLOAD UI
  ============================================================ */
  if (message.type === "upload_ui") {
    return (
      <div className="message-block feature-block fade-highlight">
        <ChatMessage role="assistant" content="📎 Upload Resumes" />
        <UploadUI />
      </div>
    );
  }

  /* ============================================================
     DIRECT FEATURE UI RENDERING (FROM WS)
  ============================================================ */
  if (message.type === "feature_ui") {
    return (
      <div className="message-block feature-block fade-highlight">
        {message.content && (
          <ChatMessage role="assistant" content={message.content} />
        )}

        <div className="message-feature-ui mt-2">
          {message.feature === "JDHistory" && <JDHistory />}
          {message.feature === "ProfileMatchHistory" && <ProfileMatchHistory />}
          {message.feature === "CandidateStatus" && <Designation />}

          {message.feature === "InterviewBot" && <InterviewBot />}
          {message.feature === "ZohoBridge" && <ZohoLoginButton />}
          {message.feature === "MailMind" && <MailMindButton />}
          {message.feature === "PrimeHireBrain" && <PrimeHireBrain />}
          {message.feature === "LinkedInPoster" && <LinkedInPosterButton />}
        </div>
      </div>
    );
  }

  /* ============================================================
     TEXT-BASED FEATURE DETECTION (fallback)
  ============================================================ */
  const featureRef = useRef(null);

  const isAssistant = message.role === "assistant";
  const cleanText =
    isAssistant && typeof message.content === "string"
      ? message.content.replace(/[*_~`]/g, "")
      : "";

  const featureMatch = cleanText.match(
    /\b(ZohoBridge|MailMind|JDHistory|PrimeHireBrain|InterviewBot|LinkedInPoster|ProfileMatchHistory|CandidateStatus)\b/i
  );

  const detectedFeature = featureMatch ? featureMatch[1] : null;

  useEffect(() => {
    if (!detectedFeature) return;
    onTriggerFeature && onTriggerFeature(detectedFeature);
  }, [detectedFeature]);

  if (detectedFeature) {
    return (
      <div ref={featureRef} className="message-block feature-block fade-highlight">
        <ChatMessage role={message.role} content={message.content} />

        <div className="message-feature-ui mt-2">
          {detectedFeature === "JDHistory" && <JDHistory />}
          {detectedFeature === "ProfileMatchHistory" && <ProfileMatchHistory />}
          {detectedFeature === "CandidateStatus" && <Designation />}

          {detectedFeature === "InterviewBot" && <InterviewBot />}
          {detectedFeature === "ZohoBridge" && <ZohoLoginButton />}
          {detectedFeature === "MailMind" && <MailMindButton />}
          {detectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
          {detectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
        </div>
      </div>
    );
  }

  /* ============================================================
     DEFAULT
  ============================================================ */
  return (
    <div className="message-block">
      <ChatMessage role={message.role} content={message.content} />
    </div>
  );
});

export default MessageRenderer;
