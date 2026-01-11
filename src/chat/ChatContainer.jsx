import React, { useEffect, useRef, useState } from "react";
import MessageRenderer from "./MessageRenderer";
import "./ChatContainer.css";

// const ChatContainer = ({ messages = [], isLoading = false, fetchJDHistory }) => {
const ChatContainer = ({
  messages = [],
  isLoading = false,
  fetchJDHistory,
  onTriggerFeature,   // ⭐ ADD THIS
}) => {

  const scrollRef = useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!isUserScrolling) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isLoading, isUserScrolling]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = Math.abs(el.scrollHeight - el.scrollTop - el.clientHeight) < 12;
    setIsUserScrolling(!atBottom);
  };

  // const handleTriggerFeature = (feature) => {
  //   if (feature === "JDHistory") {
  //     fetchJDHistory && fetchJDHistory();
  //   }
  // };

  const handleTriggerFeature = (feature) => {
    // first call internal feature actions
    if (feature === "JDHistory") {
      fetchJDHistory && fetchJDHistory();
    }

    // then propagate to MainContent
    onTriggerFeature && onTriggerFeature(feature);  // ⭐ NOW Upload Resumes will work
  };


  return (
    <div className="chat-container-wrapper">
      <div className="chat-scroll-area" ref={scrollRef} onScroll={handleScroll}>
        {messages.length === 0 && !isLoading && (
          <div className="empty-placeholder">👋 Start by asking something…</div>
        )}

        {messages.map((msg, i) => (
          <MessageRenderer key={i} message={msg} onTriggerFeature={handleTriggerFeature} />
        ))}

        {isLoading && (
          <div className="assistant-loading">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer;
