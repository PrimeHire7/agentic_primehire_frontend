

// // export default ChatContainer;
// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import MessageRenderer from "./MessageRenderer";
// import ChatInput from "./ChatInput";

// import "./ChatContainer.css";

// const groupedPrompts = [
//   {
//     category: "ZohoBridge",
//     prompts: [
//       "Update job status on Zoho Recruit database",
//       "Fetch all candidates from Zoho Recruit",
//       "Sync candidate records with Zoho database",
//     ],
//   },
//   {
//     category: "MailMind",
//     prompts: [
//       "Extract candidate resumes from emails",
//       "Parse attachments in HR mailbox",
//       "Analyze Outlook inbox for candidate data",
//     ],
//   },
//   {
//     category: "Profile Matcher",
//     prompts: [
//       "Find best candidate for AI Engineer",
//       "Find best match for Software Engineer with Python and ML experience",
//       "Compare candidate profiles for Data Scientist role",
//       "Identify top resumes for Full Stack Developer",
//     ],
//   },
//   {
//     category: "JD Creator",
//     prompts: [
//       "Create JD for Machine Learning Engineer",
//       "Generate job description for Product Manager",
//       "Refine job post for Backend Developer role",
//     ],
//   },
//   {
//     category: "InterviewBot",
//     prompts: [
//       "Run AI interview for selected candidate",
//       "Simulate technical interview questions",
//       "Evaluate candidate performance using AI",
//     ],
//   },
//   {
//     category: "PrimeHireBrain",
//     prompts: [
//       "Search candidates in internal database",
//       "Analyze skill gaps for hiring",
//       "View all uploaded resumes",
//     ],
//   },
//   {
//     category: "LinkedInPoster",
//     prompts: [
//       "Post job update on LinkedIn company page",
//       "Share hiring post for Software Engineer",
//       "Manage LinkedIn job posts",
//     ],
//   },
// ];

// const ChatContainer = ({
//   messages,
//   selectedFeature,
//   selectedTask,
//   isLoading,
//   onSend,
// }) => {
//   const messagesEndRef = useRef(null);
//   const [lockMode, setLockMode] = useState(null);
//   const chatMessagesRef = useRef(null);

//   // 🧭 Scroll to newly rendered feature (triggered by MessageRenderer)
//   // inside ChatContainer component, replace previous listener useEffect with this:

//   useEffect(() => {
//     const HEADER_OFFSET = 64; // adjust to your header height (px)

//     const handleFeatureRendered = (e) => {
//       const el = e.detail?.element;
//       if (!el) return;

//       const container = chatMessagesRef.current || document.querySelector(".chat-messages");
//       if (!container) {
//         // fallback: scroll element into view in viewport
//         el.scrollIntoView({ behavior: "smooth", block: "start" });
//         return;
//       }

//       // compute element offset relative to the scroll container
//       const containerRect = container.getBoundingClientRect();
//       const elRect = el.getBoundingClientRect();

//       // distance from top of container's scrollable content to element
//       const offsetWithinContainer = elRect.top - containerRect.top + container.scrollTop;

//       // final scroll target (leave a bit of space for fixed header)
//       const targetScroll = Math.max(0, offsetWithinContainer - HEADER_OFFSET + 8); // +8px padding

//       // wait a frame to ensure layout stable, then smooth scroll container
//       requestAnimationFrame(() => {
//         // small delay if you have transitions; setTimeout fallback ensures it works with animations
//         setTimeout(() => {
//           container.scrollTo({ top: targetScroll, behavior: "smooth" });
//         }, 30);
//       });
//     };

//     window.addEventListener("featureRendered", handleFeatureRendered);
//     return () => window.removeEventListener("featureRendered", handleFeatureRendered);
//   }, []);


//   // 🧠 Handle lock modes (JD Creator / Profile Matcher / Upload Resumes)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (window.__JD_MODE_ACTIVE__) setLockMode("JD Creator");
//       else if (window.__PROFILE_MATCH_MODE_ACTIVE__) setLockMode("Profile Matcher");
//       else if (window.__UPLOAD_RESUME_MODE_ACTIVE__) setLockMode("Upload Resumes");
//       else setLockMode(null);
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   // 💬 Normal auto-scroll to bottom for messages
//   useEffect(() => {
//     if (!selectedFeature && !selectedTask) {
//       messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);

//   return (
//     <div className="chat-container flex flex-col h-full">
//       {/* 💬 Chat messages */}
//       <div
//         ref={chatMessagesRef}
//         className="chat-messages flex-1 overflow-y-auto px-4 pt-2 pb-20"
//       >
//         {messages.map((msg, idx) => (
//           <MessageRenderer key={idx} message={msg} index={idx} />
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* ⚡ Modern Grid Quick Prompts */}
//       <div className="quick-prompts-grid">
//         {groupedPrompts.map((group, idx) => (
//           <div key={idx} className="prompt-card">
//             <h4 className="prompt-title">{group.category}</h4>
//             <div className="prompt-buttons">
//               {group.prompts.map((prompt, i) => (
//                 <button
//                   key={i}
//                   onClick={() => onSend(prompt)}
//                   className="prompt-btn"
//                 >
//                   {prompt}
//                 </button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ⚠️ Lock Mode Indicator */}
//       <AnimatePresence>
//         {lockMode && (
//           <motion.div
//             key={lockMode}
//             initial={{ opacity: 0, y: 15 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -15 }}
//             transition={{ duration: 0.3 }}
//             className="lock-mode-banner bg-muted/60 text-sm text-center py-2 border-t border-border"
//           >
//             {lockMode === "JD Creator" &&
//               "🧠 JD Creator is in progress — please complete the flow."}
//             {lockMode === "Profile Matcher" &&
//               "🎯 Profile Matcher is analyzing candidates — please wait."}
//             {lockMode === "Upload Resumes" &&
//               "📄 Resume extraction in progress — please wait for upload to finish."}
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* 🗣️ Chat Input */}
//       <div className="chat-input-fixed">
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
// 📁 src/chat/ChatContainer.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageRenderer from "./MessageRenderer";
import ChatInput from "./ChatInput";
import "./ChatContainer.css";

// 💡 Grouped Prompts
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
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [lockMode, setLockMode] = useState(null);

  // 🧭 Auto-scroll when feature UI is rendered (triggered by MessageRenderer)
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

      // compute offset within the scroll container
      const containerRect = container.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const offsetWithinContainer =
        elRect.top - containerRect.top + container.scrollTop;

      const targetScroll = Math.max(
        0,
        offsetWithinContainer - HEADER_OFFSET + 10 // spacing below header
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

  // 💬 Default scroll to bottom when chat messages change
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

      {/* ⚡ Quick Prompts Grid */}
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
