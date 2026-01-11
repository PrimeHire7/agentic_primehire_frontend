import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "./ChatMessage.css";

const CopyIcon = () => (
  <svg width="16" height="16" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <rect x="9" y="9" width="12" height="12" rx="2" strokeWidth="2" />
    <rect x="3" y="3" width="12" height="12" rx="2" strokeWidth="2" />
  </svg>
);

const ThumbsUp = () => (
  <svg width="18" height="18" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path d="M7 22V10M3 10h18l-2 10H5l-2-10zM14 3l1 4" strokeWidth="2" />
  </svg>
);

const ThumbsDown = () => (
  <svg width="18" height="18" stroke="currentColor" fill="none" viewBox="0 0 24 24">
    <path d="M7 2v12M3 14h18l-2-10H5L3 14zM14 21l1-4" strokeWidth="2" />
  </svg>
);

const AIAvatar = () => (
  <div className="chat-avatar ai-avatar">
    <div className="ai-orb-core"></div>
    <div className="ai-orbit orbit-1"></div>
    <div className="ai-orbit orbit-2"></div>
    <div className="ai-spark spark-1"></div>
    <div className="ai-spark spark-2"></div>
    <div className="ai-spark spark-3"></div>
    <div className="ai-shimmer"></div>
  </div>
);

const UserAvatar = () => (
  <div className="chat-avatar user-avatar">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v2h20v-2c0-3.3-6.7-5-10-5z" />
    </svg>
  </div>
);

const ChatMessage = ({ role, content, meta = {}, onFeedback }) => {
  const endRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [content]);

  const handleCopy = async () => {
    const html = typeof content === "string" ? content : "";
    const plain = html.replace(/<[^>]+>/g, " "); // strip tags for clipboard view

    await navigator.clipboard.writeText(plain.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };


  const askConfirmation = meta?.ask_confirmation === true;

  return (
    <div ref={endRef} className="chat-message">
      <div className="chat-message-inner">
        {role === "assistant" ? <AIAvatar /> : <UserAvatar />}

        <div className="chat-content-wrapper">
          <div className={cn("chat-content", role)}>
            <div
              className="chat-text"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* ---- YES/NO Confirmation Box ---- */}
            {askConfirmation && (
              <div className="confirm-box">
                <p className="confirm-title">
                  Would you like to find matching candidates?
                </p>

                <div className="confirm-buttons">
                  <button
                    className="confirm-btn yes"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("confirm_match_profiles"))
                    }
                  >
                    ✅ Yes, match profiles
                  </button>

                  <button className="confirm-btn no">❌ No, skip</button>
                </div>
              </div>
            )}

            {/* Ask to upload resumes after matching */}
            {meta?.ask_upload_resumes === true && (
              <div className="confirm-box">
                <p className="confirm-title">
                  Would you like to upload more resumes for better matching?
                </p>

                <div className="confirm-buttons">
                  <button
                    className="confirm-btn yes"
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("trigger_upload_resumes"))
                    }
                  >
                    📎 Yes, upload resumes
                  </button>

                  <button className="confirm-btn no">❌ No, maybe later</button>
                </div>
              </div>
            )}

          </div>

          {role === "assistant" && (
            <div className="chat-actions">
              <button className="chat-btn copy-btn" onClick={handleCopy}>
                {copied ? "✔" : <CopyIcon />}
              </button>

              <button
                className={`chat-btn thumb-btn ${feedback === "up" ? "active" : ""}`}
                onClick={() => setFeedback("up")}
              >
                <ThumbsUp />
              </button>

              <button
                className={`chat-btn thumb-btn ${feedback === "down" ? "active" : ""}`}
                onClick={() => setFeedback("down")}
              >
                <ThumbsDown />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
