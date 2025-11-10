

// src/chat/MessageRenderer.jsx
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ProfileTable from "./ProfileTable";
import ResumeTable from "@/chat/ResumeTable";// adjust path if needed
import ResumeUpload from "@/pages/ResumeUpload";
import JDTaskUI from "@/pages/JDTaskUI";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";

const MessageRenderer = ({ message, index }) => {
  if (!message) return null;

  // structured tables
  if (message.type === "profile_table") {
    return <ProfileTable key={index} data={message.data} index={index} />;
  }
  if (message.type === "resume_table") {
    return <ResumeTable key={index} data={message.data} index={index} />;
  }
  if (message.type === "jd_ui" && message.data) {
    const { currentJdStep, currentJdPrompt, currentJdInput, setCurrentJdInput, handleJdSend, jdInProgress, messages } =
      message.data;
    return (
      <div key={index} className="message-block">
        <JDTaskUI
          currentJdStep={currentJdStep}
          currentJdPrompt={currentJdPrompt}
          currentJdInput={currentJdInput}
          setCurrentJdInput={setCurrentJdInput}
          handleJdSend={handleJdSend}
          jdInProgress={jdInProgress}
          messages={messages}
        />
      </div>
    );
  }


  // Detect features & tasks from assistant messages
  const isAssistantText = message.role === "assistant" && typeof message.content === "string";
  const featureMatch =
    isAssistantText &&
    message.content.match(
      /ZohoBridge|MailMind|PrimeHireBrain|InterviewBot|LinkedInPoster|ProfileMatchHistory|JD\s?Creator|Profile\s?Matcher|Upload\s?Resumes?/i
    );
  const detectedFeature = featureMatch ? featureMatch[0] : null;

  // If JD Creator was detected, render JDTaskUI instead of showing the assistant bubble
  // If JD Creator was detected, skip rendering JD UI here.
  // MainContent handles JDTaskUI globally.
  if (detectedFeature && /JD\s?Creator/i.test(detectedFeature)) {
    console.log("🧠 JD Creator detected — skipping duplicate UI in MessageRenderer");
    return null;
  }


  // If Upload Resumes task was detected, render ResumeUpload inline (and skip bubble)
  if (detectedFeature && /Upload\s?Resumes?/i.test(detectedFeature)) {
    return (
      <div key={index} className="message-block">
        <ResumeUpload />
      </div>
    );
  }

  // ProfileMatchHistory inline
  if (detectedFeature && /ProfileMatchHistory/i.test(detectedFeature)) {
    return (
      <div key={index} className="message-block">
        <ProfileMatchHistory />
      </div>
    );
  }

  // Other features: still render a small inline control but also keep the chat bubble
  if (detectedFeature) {
    return (
      <div key={index} className="message-block">
        <ChatMessage role={message.role} content={message.content} />
        <div className="message-feature-ui mt-2">
          {detectedFeature === "ZohoBridge" && <ZohoLoginButton />}
          {detectedFeature === "MailMind" && <MailMindButton />}
          {detectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
          {detectedFeature === "InterviewBot" && <InterviewBot />}
          {detectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
          {detectedFeature === "ProfileMatchHistory" && <ProfileMatchHistory />}
        </div>
      </div>
    );
  }

  // default: render normal chat bubble
  return (
    <div key={index} className="message-block">
      <ChatMessage role={message.role} content={message.content} />
    </div>
  );
};

export default MessageRenderer;
