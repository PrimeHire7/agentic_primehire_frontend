import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./ChatMessage.css";

const CopyIcon = () => <span style={{ fontSize: "14px" }}>📋</span>;
const ThumbsUp = () => <span style={{ fontSize: "16px" }}>👍</span>;
const ThumbsDown = () => <span style={{ fontSize: "16px" }}>👎</span>;

const ChatMessage = ({ role, content, onFeedback, onTriggerFeature }) => {
  const messageEndRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  /* ---------------- Feature detection for normal chat ---------------- */

  useEffect(() => {
    if (!content || role !== "assistant") return;

    const clean = content.replace(/[*_~`]/g, "");

    const match = clean.match(/\b(JDHistory)\b/i);
    if (match && onTriggerFeature) {
      onTriggerFeature("JDHistory"); // auto fetch
    }
  }, [content]);

  /* ---------------- Copy ---------------- */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    if (onFeedback) onFeedback({ message: content, feedback: type });
  };

  return (
    <div
      ref={messageEndRef}
      className={cn(
        "chat-message",
        role === "assistant" && "chat-message-assistant"
      )}
    >
      <div className="chat-avatar">{role === "user" ? "U" : "AI"}</div>

      <div className="chat-content-wrapper">
        <div className="chat-content">
          <p className="chat-text">{content}</p>
        </div>

        {role === "assistant" && (
          <div className="chat-actions">
            <button className="chat-btn copy-btn" onClick={handleCopy}>
              {copied ? "✔ Copied!" : <CopyIcon />}
            </button>

            <button
              className={`chat-btn thumb-btn ${feedback === "up" ? "active" : ""}`}
              onClick={() => handleFeedback("up")}
            >
              <ThumbsUp />
            </button>

            <button
              className={`chat-btn thumb-btn ${feedback === "down" ? "active" : ""}`}
              onClick={() => handleFeedback("down")}
            >
              <ThumbsDown />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
