

// // 📁 src/chat/ChatContainer.jsx
// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import MessageRenderer from "./MessageRenderer";
// import ChatInput from "./ChatInput";

// // 🧩 Import feature modules
// import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
// import InterviewBot from "../InterviewBot/InterviewBot";
// import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
// import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
// import MailMindButton from "../MailMind/MailMindButton";

// import "./ChatContainer.css";

// const ChatContainer = ({
//   messages,
//   selectedFeature,
//   selectedTask,
//   isLoading,
//   onSend,
// }) => {
//   const messagesEndRef = useRef(null);
//   const [lockMode, setLockMode] = useState(null);

//   // ✅ Auto-scroll to bottom on new messages or task/feature change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, selectedFeature, selectedTask]);

//   // ✅ Monitor lock modes (JD / Profile Matcher / Resume)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (window.__JD_MODE_ACTIVE__) setLockMode("JD Creator");
//       else if (window.__PROFILE_MATCH_MODE_ACTIVE__) setLockMode("Profile Matcher");
//       else if (window.__UPLOAD_RESUME_MODE_ACTIVE__) setLockMode("Upload Resumes");
//       else setLockMode(null);
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     const chatEnd = document.querySelector(".chat-end");
//     if (chatEnd) chatEnd.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // ✅ Log UI state transitions
//   useEffect(() => {
//     if (selectedFeature) console.log(`🚀 Rendering feature UI for ${selectedFeature}`);
//     if (selectedTask) console.log(`🎯 Rendering task UI for ${selectedTask}`);
//   }, [selectedFeature, selectedTask]);

//   return (
//     <div className="chat-container">
//       {/* 💬 Chat messages area */}
//       <div className="chat-messages">
//         {messages.map((msg, idx) => (
//           <MessageRenderer key={idx} message={msg} index={idx} />
//         ))}

//         {/* 🧠 Task-specific helper cards */}
//         {selectedTask && !isLoading && (
//           <div className="mt-4">
//             {selectedTask === "JD Creator" && (
//               <div className="border rounded-lg p-4 bg-muted/30">
//                 <p className="text-sm font-semibold mb-1">🧠 JD Creator Active</p>
//                 <p className="text-sm text-muted-foreground">
//                   Let’s start building your job description step-by-step.
//                 </p>
//               </div>
//             )}

//             {selectedTask === "Profile Matcher" && (
//               <div className="border rounded-lg p-4 bg-muted/30">
//                 <p className="text-sm font-semibold mb-1">🎯 Profile Matcher Active</p>
//                 <p className="text-sm text-muted-foreground">
//                   Your JD has been sent for candidate matching...
//                 </p>
//               </div>
//             )}

//             {selectedTask === "Upload Resumes" && (
//               <div className="border rounded-lg p-4 bg-muted/30">
//                 <p className="text-sm font-semibold mb-1">📄 Upload Resumes</p>
//                 <p className="text-sm text-muted-foreground">
//                   You can now upload resumes to extract candidate details.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* 🧩 Dynamic Feature Modules */}
//       <AnimatePresence mode="wait">
//         {selectedFeature && (
//           <motion.div
//             key={selectedFeature}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.3 }}
//             className="chat-feature-ui mt-4"
//           >
//             {selectedFeature === "ZohoBridge" && <ZohoLoginButton />}
//             {selectedFeature === "MailMind" && <MailMindButton />}
//             {selectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
//             {selectedFeature === "InterviewBot" && <InterviewBot />}
//             {selectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ⚠️ Mode Lock Indicator Banner */}
//       <AnimatePresence>
//         {lockMode && (
//           <motion.div
//             key={lockMode}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.3 }}
//             className="lock-mode-banner bg-muted/60 text-sm text-center py-2 border-t border-border animate-fade-in"
//           >
//             {lockMode === "JD Creator" && "🧠 JD Creator is in progress — please complete the flow."}
//             {lockMode === "Profile Matcher" &&
//               "🎯 Profile Matcher is analyzing candidates — please wait."}
//             {lockMode === "Upload Resumes" &&
//               "📄 Resume extraction in progress — please wait for upload to finish."}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🗣️ Chat Input — Always Visible */}
//       <div className="chat-input-wrapper">
//         <ChatInput
//           onSend={onSend}
//           disabled={isLoading || !!lockMode}
//           placeholder={
//             lockMode
//               ? `🔒 ${lockMode} active — chat temporarily disabled.`
//               : "Type a message or ask to use a module..."
//           }
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatContainer;
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageRenderer from "./MessageRenderer";
import ChatInput from "./ChatInput";

import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";

import "./ChatContainer.css";

// 🧭 Grid-Style Quick Prompts (always visible)
const groupedPrompts = [
  {
    category: "ZohoBridge",
    prompts: [
      "Update job status on Zoho Recruit database",
      "Fetch all candidates from Zoho Recruit",
      "Sync candidate records with Zoho database",
    ],
  },
  {
    category: "MailMind",
    prompts: [
      "Extract candidate resumes from emails",
      "Parse attachments in HR mailbox",
      "Analyze Outlook inbox for candidate data",
    ],
  },
  {
    category: "Profile Matcher",
    prompts: [
      "Find best candidate for AI Engineer",
      "Find best match for Software Engineer with Python and ML experience",
      "Compare candidate profiles for Data Scientist role",
      "Identify top resumes for Full Stack Developer",
    ],
  },
  {
    category: "JD Creator",
    prompts: [
      "Create JD for Machine Learning Engineer",
      "Generate job description for Product Manager",
      "Refine job post for Backend Developer role",
    ],
  },
  {
    category: "InterviewBot",
    prompts: [
      "Run AI interview for selected candidate",
      "Simulate technical interview questions",
      "Evaluate candidate performance using AI",
    ],
  },
  {
    category: "PrimeHireBrain",
    prompts: [
      "Search candidates in internal database",
      "Analyze skill gaps for hiring",
      "View all uploaded resumes",
    ],
  },
  {
    category: "LinkedInPoster",
    prompts: [
      "Post job update on LinkedIn company page",
      "Share hiring post for Software Engineer",
      "Manage LinkedIn job posts",
    ],
  },
];

const ChatContainer = ({
  messages,
  selectedFeature,
  selectedTask,
  isLoading,
  onSend,
}) => {
  const messagesEndRef = useRef(null);
  const [lockMode, setLockMode] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedFeature, selectedTask]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.__JD_MODE_ACTIVE__) setLockMode("JD Creator");
      else if (window.__PROFILE_MATCH_MODE_ACTIVE__) setLockMode("Profile Matcher");
      else if (window.__UPLOAD_RESUME_MODE_ACTIVE__) setLockMode("Upload Resumes");
      else setLockMode(null);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="chat-container flex flex-col h-full">
      {/* 💬 Chat messages */}
      <div className="chat-messages flex-1 overflow-y-auto px-4 pt-2 pb-20">
        {messages.map((msg, idx) => (
          <MessageRenderer key={idx} message={msg} index={idx} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ⚡ Modern Grid Quick Prompts */}
      <div className="quick-prompts-grid">
        {groupedPrompts.map((group, idx) => (
          <div key={idx} className="prompt-card">
            <h4 className="prompt-title">{group.category}</h4>
            <div className="prompt-buttons">
              {group.prompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => onSend(prompt)}
                  className="prompt-btn"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ⚠️ Lock Mode Indicator */}
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
            {lockMode === "JD Creator" && "🧠 JD Creator is in progress — please complete the flow."}
            {lockMode === "Profile Matcher" && "🎯 Profile Matcher is analyzing candidates — please wait."}
            {lockMode === "Upload Resumes" && "📄 Resume extraction in progress — please wait for upload to finish."}
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
