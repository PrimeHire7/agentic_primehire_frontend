import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageRenderer from "./MessageRenderer";
import ChatInput from "./ChatInput";
import "./ChatContainer.css";

const ChatContainer = ({
  messages,
  selectedFeature,
  selectedTask,
  isLoading,
  onSend,
}) => {
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [lockMode, setLockMode] = useState(null);

  // 🧭 Auto-scroll when feature UI is rendered
  useEffect(() => {
    const HEADER_OFFSET = 64; // header height in px

    const handleFeatureRendered = (e) => {
      const el = e.detail?.element;
      if (!el) return;

      const container =
        chatMessagesRef.current || document.querySelector(".chat-messages");

      if (!container) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offsetWithinContainer =
        elRect.top - containerRect.top + container.scrollTop;

      const targetScroll = Math.max(
        0,
        offsetWithinContainer - HEADER_OFFSET + 10
      );

      requestAnimationFrame(() => {
        setTimeout(() => {
          container.scrollTo({ top: targetScroll, behavior: "smooth" });
        }, 50);
      });
    };

    window.addEventListener("featureRendered", handleFeatureRendered);
    return () =>
      window.removeEventListener("featureRendered", handleFeatureRendered);
  }, []);

  // 🧠 Lock modes for JD/Profile Matcher/Upload
  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__JD_MODE_ACTIVE__) setLockMode("JD Creator");
      else if (window.__PROFILE_MATCH_MODE_ACTIVE__)
        setLockMode("Profile Matcher");
      else if (window.__UPLOAD_RESUME_MODE_ACTIVE__)
        setLockMode("Upload Resumes");
      else setLockMode(null);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // 💬 Default scroll to bottom on new chat messages
  useEffect(() => {
    if (!selectedFeature && !selectedTask) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, selectedFeature, selectedTask]);

  return (
    <div className="chat-container flex flex-col h-full">
      {/* 💬 Chat messages */}
      <div
        ref={chatMessagesRef}
        className="chat-messages flex-1 overflow-y-auto px-4 pt-2 pb-20"
      >
        {messages.map((msg, idx) => (
          <MessageRenderer key={idx} message={msg} index={idx} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ⚠️ Lock Mode Banner */}
      <AnimatePresence>
        {lockMode && (
          <motion.div
            key={lockMode}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="lock-mode-banner bg-muted/60 text-sm text-center py-2 border-t border-border"
          >
            {lockMode === "JD Creator" &&
              "🧠 JD Creator is in progress — please complete the flow."}
            {lockMode === "Profile Matcher" &&
              "🎯 Profile Matcher is analyzing candidates — please wait."}
            {lockMode === "Upload Resumes" &&
              "📄 Resume extraction in progress — please wait for upload to finish."}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🗣️ Chat Input */}
      <div className="chat-input-fixed">
        <ChatInput
          onSend={onSend}
          disabled={isLoading || !!lockMode}
          placeholder={
            lockMode
              ? `🔒 ${lockMode} active — chat temporarily disabled.`
              : "Type a message or ask to use a module..."
          }
        />
      </div>
    </div>
  );
};

export default ChatContainer;
