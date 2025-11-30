// // MainContent.jsx
// import React, { useState } from "react";
// import ChatContainer from "@/chat/ChatContainer";
// import ChatInput from "@/chat/ChatInput";
// import "./MainContent.css";

// export default function MainContent({
//   messages = [],
//   selectedFeature,
//   selectedTask,
//   isLoading,
//   handleSend,
//   handleTaskSelect,
// }) {
//   const showHero = messages.length === 0 && !selectedFeature && !selectedTask;
//   const [pendingTask, setPendingTask] = useState(null);

//   const handleQuickStart = (task) => {
//     setPendingTask(task);
//     handleTaskSelect?.(task);
//     setTimeout(() => handleSend(""), 60);
//   };

//   return (
//     <div className="mc-root">
//       {showHero ? (
//         <section className="mc-hero glass-surface">
//           <div className="mc-hero-inner">

//             <h1 className="mc-title">
//               Welcome to <span className="mc-accent">PrimeHire AI</span>
//             </h1>

//             <p className="mc-subtitle">
//               Your all-in-one AI Recruiting Workspace — Generate JDs, match candidates,
//               automate interviews, manage hiring history, and monitor candidate status.
//             </p>

//             {/* ------------------------------------
//                 🔥 7 Quick Action Cards
//             ------------------------------------ */}
//             <div className="mc-actions-grid">

//               {/* JD Creator */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("JD Creator")}>
//                 <span>📝</span>
//                 <h3>Create JD</h3>
//                 <p>Generate job descriptions instantly.</p>
//               </div>

//               {/* Profile Matcher */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("Profile Matcher")}>
//                 <span>🎯</span>
//                 <h3>Match Profiles</h3>
//                 <p>Upload resumes & get AI-ranked candidates.</p>
//               </div>

//               {/* Upload Resumes */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("Upload Resumes")}>
//                 <span>📤</span>
//                 <h3>Upload Resumes</h3>
//                 <p>Parse and classify resumes automatically.</p>
//               </div>

//               {/* Interview Bot */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("Interview Bot")}>
//                 <span>🎤</span>
//                 <h3>Interview Bot</h3>
//                 <p>Automated voice/video screening.</p>
//               </div>

//               {/* Candidate Status */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("Candidate Status")}>
//                 <span>📌</span>
//                 <h3>Candidate Status</h3>
//                 <p>Track candidate stages & decisions.</p>
//               </div>

//               {/* JD History */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("JD History")}>
//                 <span>📝</span>
//                 <h3>JD History</h3>
//                 <p>View & export previously created JDs.</p>
//               </div>

//               {/* Match History */}
//               <div className="mc-action-card"
//                 onClick={() => handleQuickStart("Match History")}>
//                 <span>📈</span>
//                 <h3>Match History</h3>
//                 <p>Check past candidate–JD match results.</p>
//               </div>

//             </div>

//             {/* Inline console */}
//             <div className="mc-console">
//               <ChatInput
//                 onSend={handleSend}
//                 placeholder="Try: Create a JD for a React developer"
//                 activeTask={pendingTask}
//                 forceShowChips={true}
//               />
//             </div>



//           </div>
//         </section>
//       ) : (

//         /* ---------------------------
//            CHAT MODE
//         ---------------------------- */
//         <div className="mc-chat-mode">

//           <div className="mc-chat-scroll">
//             <ChatContainer
//               messages={messages}
//               selectedFeature={selectedFeature}
//               selectedTask={selectedTask}
//               isLoading={isLoading}
//             />
//             <div className="mc-bottom-spacer"></div>
//           </div>

//           <div className="mc-chat-input-fixed">
//             <ChatInput
//               onSend={handleSend}
//               activeTask={pendingTask || selectedTask}
//               forceShowChips={true}
//             />
//           </div>

//         </div>
//       )}
//     </div>
//   );
// }
// MainContent.jsx
import React, { useState, useEffect } from "react";
import ChatContainer from "@/chat/ChatContainer";
import ChatInput from "@/chat/ChatInput";
import "./MainContent.css";

export default function MainContent({
  messages = [],
  selectedFeature,
  selectedTask,
  isLoading,
  handleSend,
  handleTaskSelect,
}) {
  const showHero = messages.length === 0 && !selectedFeature && !selectedTask;
  const [pendingTask, setPendingTask] = useState(null);

  const handleQuickStart = (task) => {
    setPendingTask(task);
    handleTaskSelect?.(task);
    setTimeout(() => handleSend(""), 50);
  };

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

  return (
    <div className="mc-root">

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
                ["📤", "Upload Resumes", "Parse & extract candidate insights."],
                ["🎤", "Interview Bot", "Automated screening interviews."],
                ["📌", "Candidate Status", "Track your entire pipeline."],
                ["📝", "JD History", "View your previously generated JDs."],
                ["📈", "Match History", "Review past match results."],
              ].map(([icon, label, desc]) => (
                <div
                  key={label}
                  className="mc-action-card"
                  onClick={() => handleQuickStart(label)}
                >
                  <span>{icon}</span>
                  <h3>{label}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>

            <div className="mc-console">
              <ChatInput
                onSend={handleSend}
                activeTask={pendingTask}
                forceShowChips={true}
              />
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
