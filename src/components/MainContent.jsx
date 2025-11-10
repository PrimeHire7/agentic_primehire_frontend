// import Header from "../common/Header";
// import ChatContainer from "../chat/ChatContainer";
// import InfoCards from "../InfoCards/InfoCards";
// import "./MainContent.css";

// const MainContent = ({
//   messages = [],
//   selectedFeature,
//   selectedTask,
//   isLoading,
//   handleFeatureClick,
//   handleRefresh,
//   handleSend,
// }) => {
//   const showWelcome = messages?.length === 0 && !selectedTask;

//   return (
//     <div className="main-content">
//       {/* ✅ Header */}
//       <Header onRefresh={handleRefresh} />

//       <main className="main-content-body">
//         {/* ✅ Welcome Section */}
//         {showWelcome && (
//           <div className="welcome-section text-center mt-4">
//             <h1 className="welcome-title">
//               Hi, I'm <span className="brand-accent">PrimeHire</span> — Agentic AI for Recruiting
//             </h1>
//             <p className="welcome-subtitle">
//               Your all-in-one recruitment assistant for sourcing, matching, and interviewing candidates.
//             </p>
//           </div>
//         )}

//         {/* ✅ Info Cards */}
//         {showWelcome && <InfoCards />}

//         {/* ✅ Chat Container (messages + chat input) */}
//         <div className="chat-area">
//           <ChatContainer
//             messages={messages}
//             selectedFeature={selectedFeature}
//             selectedTask={selectedTask}
//             isLoading={isLoading}
//             onSend={handleSend}
//           />
//         </div>
//       </main>
//     </div>
//   );
// };

// export default MainContent;
// 📁 src/layout/MainContent.jsx
// 📁 src/layout/MainContent.jsx
import Header from "../common/Header";
import ChatContainer from "../chat/ChatContainer";
import InfoCards from "../InfoCards/InfoCards";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import JDTaskUI from "@/pages/JDTaskUI"; // ✅ ensure correct path
import "./MainContent.css";
import { useEffect } from "react";

const MainContent = ({
  messages = [],
  selectedFeature,
  selectedTask,
  isLoading,
  handleFeatureClick,
  handleRefresh,
  handleSend,

  // ✅ JD-related props from useMainContent
  currentJdStep,
  currentJdInput,
  setCurrentJdInput,
  handleJdSend,
  jdInProgress,
}) => {
  const showWelcome = messages?.length === 0 && !selectedTask && !selectedFeature;
  useEffect(() => {
    const closeHandler = () => {
      if (window.__JD_REFRESHING__) {
        console.log("⏸️ JD Drawer close ignored — refresh already in progress.");
        return;
      }
      console.log("🧹 JD Drawer closed.");
      handleRefresh();
    };

    window.addEventListener("jd_close", closeHandler);
    return () => window.removeEventListener("jd_close", closeHandler);
  }, [handleRefresh]);
  useEffect(() => {
    const openHandler = () => {
      console.log("🪄 JD Drawer open triggered from WebSocket");
      // ensures UI reflects JD active state
      if (!window.__JD_MODE_ACTIVE__) window.__JD_MODE_ACTIVE__ = true;
    };

    window.addEventListener("jd_open", openHandler);
    return () => window.removeEventListener("jd_open", openHandler);
  }, []);
  // ✅ Listen for Profile Matcher completion
  useEffect(() => {
    const handleProfileMatchDone = () => {
      console.log("🧹 [MainContent] Profile Matcher done — returning to chat mode.");
      if (typeof window !== "undefined") {
        window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
      }
    };

    window.addEventListener("profile_match_done", handleProfileMatchDone);
    return () => window.removeEventListener("profile_match_done", handleProfileMatchDone);
  }, []);

  return (
    <div className="main-content">
      {/* ✅ Header */}
      <Header onRefresh={handleRefresh} />

      <main className="main-content-body">
        {/* ✅ Welcome Section */}
        {showWelcome && (
          <div className="welcome-section text-center mt-4">
            <h1 className="welcome-title">
              Hi, I'm <span className="brand-accent">PrimeHire</span> — Agentic AI for Recruiting
            </h1>
            <p className="welcome-subtitle">
              Your all-in-one recruitment assistant for sourcing, matching, and interviewing candidates.
            </p>
          </div>
        )}

        {/* ✅ Info Cards */}
        {showWelcome && <InfoCards />}

        {/* ✅ Feature View (non-chat) */}
        {selectedFeature === "ProfileMatchHistory" ? (
          <div className="feature-view mt-6 p-4">
            <ProfileMatchHistory />
          </div>
        ) : (
          // ✅ Default chat interface
          <div className="chat-area">
            <ChatContainer
              messages={[
                ...messages,
                ...(selectedTask === "JD Creator" || window.__JD_MODE_ACTIVE__
                  ? [
                    {
                      role: "assistant",
                      type: "jd_ui",
                      data: {
                        currentJdStep,
                        currentJdPrompt: window.__CURRENT_JD_STEP__,
                        currentJdInput,
                        setCurrentJdInput,
                        handleJdSend,
                        jdInProgress,
                        messages,
                      },
                    },
                  ]
                  : []),
              ]}
              selectedFeature={selectedFeature}
              selectedTask={selectedTask}
              isLoading={isLoading}
              onSend={handleSend}
            />
          </div>

        )}
      </main>
    </div>
  );
};

export default MainContent;
