

// // export default MainContent;
// import React, { useEffect } from "react";
// import Header from "../common/Header";
// import ChatContainer from "../chat/ChatContainer";
// import InfoCards from "../InfoCards/InfoCards";
// import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
// import JDTaskUI from "@/pages/JDTaskUI";
// import TaskSelector from "@/common/TaskSelector"; // ✅ Import your TaskSelector
// import "./MainContent.css";

// const MainContent = ({
//   messages = [],
//   selectedFeature,
//   selectedTask,
//   isLoading,
//   handleFeatureClick,
//   handleTaskSelect,
//   handleSend,
//   handleRefresh,
//   currentJdStep,
//   currentJdInput,
//   setCurrentJdInput,
//   handleJdSend,
//   jdInProgress,
//   uploadResumes, // ✅ for file upload
// }) => {
//   const showWelcome = messages?.length === 0 && !selectedTask && !selectedFeature;

//   // ✅ JD Drawer event listeners
//   useEffect(() => {
//     const closeHandler = () => {
//       if (window.__JD_REFRESHING__) return;
//       console.log("🧹 JD Drawer closed.");
//       handleRefresh();
//     };
//     window.addEventListener("jd_close", closeHandler);
//     return () => window.removeEventListener("jd_close", closeHandler);
//   }, [handleRefresh]);

//   useEffect(() => {
//     const openHandler = () => {
//       console.log("🪄 JD Drawer open triggered from WebSocket");
//       if (!window.__JD_MODE_ACTIVE__) window.__JD_MODE_ACTIVE__ = true;
//     };
//     window.addEventListener("jd_open", openHandler);
//     return () => window.removeEventListener("jd_open", openHandler);
//   }, []);

//   // ✅ Listen for Profile Matcher completion
//   useEffect(() => {
//     const handleProfileMatchDone = () => {
//       console.log("🧹 [MainContent] Profile Matcher done — returning to chat mode.");
//       if (typeof window !== "undefined") {
//         window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
//       }
//     };
//     window.addEventListener("profile_match_done", handleProfileMatchDone);
//     return () => window.removeEventListener("profile_match_done", handleProfileMatchDone);
//   }, []);

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

//         {/* ✅ Feature-specific content */}
//         {selectedFeature === "ProfileMatchHistory" ? (
//           <div className="feature-view mt-6 p-4">
//             <ProfileMatchHistory />
//           </div>
//         ) : selectedTask === "JD Creator" ||
//           selectedTask === "Profile Matcher" ||
//           selectedTask === "Upload Resumes" ? (
//           // ✅ Show TaskSelector for these 3 tasks
//           <div className="feature-view mt-6 p-4">
//             <TaskSelector
//               selectedTask={selectedTask}
//               onTaskSelect={handleTaskSelect}
//               onUploadResumes={uploadResumes}
//               onJdSend={handleJdSend}
//               currentJdInput={currentJdInput}
//               setCurrentJdInput={setCurrentJdInput}
//               currentJdStep={currentJdStep}
//               isLoading={isLoading}
//               onSend={handleSend}
//             />
//           </div>
//         ) : (
//           // ✅ Default Chat
//           <div className="chat-area">
//             <ChatContainer
//               messages={[
//                 ...messages,
//                 ...(selectedTask === "JD Creator" || window.__JD_MODE_ACTIVE__
//                   ? [
//                     {
//                       role: "assistant",
//                       type: "jd_ui",
//                       data: {
//                         currentJdStep,
//                         currentJdPrompt: window.__CURRENT_JD_STEP__,
//                         currentJdInput,
//                         setCurrentJdInput,
//                         handleJdSend,
//                         jdInProgress,
//                         messages,
//                       },
//                     },
//                   ]
//                   : []),
//               ]}
//               selectedFeature={selectedFeature}
//               selectedTask={selectedTask}
//               isLoading={isLoading}
//               onSend={handleSend}
//             />
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default MainContent;
import React, { useEffect } from "react";
import Header from "../common/Header";
import ChatContainer from "../chat/ChatContainer";
import InfoCards from "../InfoCards/InfoCards";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import JDTaskUI from "@/pages/JDTaskUI";
import ChatInput from "../chat/ChatInput";
import ResumeTable from "@/chat/ResumeTable";
import "./MainContent.css";

const MainContent = ({
  messages = [],
  selectedFeature,
  selectedTask,
  isLoading,
  handleFeatureClick,
  handleTaskSelect,
  handleSend,
  handleRefresh,
  currentJdStep,
  currentJdInput,
  setCurrentJdInput,
  handleJdSend,
  jdInProgress,
  uploadResumes,
}) => {
  const showWelcome = messages?.length === 0 && !selectedTask && !selectedFeature;

  /* 🧹 JD Drawer & Task Event Listeners */
  useEffect(() => {
    const closeHandler = () => {
      if (window.__JD_REFRESHING__) return;
      console.log("🧹 JD Drawer closed.");
      handleRefresh();
    };
    window.addEventListener("jd_close", closeHandler);
    return () => window.removeEventListener("jd_close", closeHandler);
  }, [handleRefresh]);

  useEffect(() => {
    const openHandler = () => {
      console.log("🪄 JD Drawer open triggered from WebSocket");
      if (!window.__JD_MODE_ACTIVE__) window.__JD_MODE_ACTIVE__ = true;
    };
    window.addEventListener("jd_open", openHandler);
    return () => window.removeEventListener("jd_open", openHandler);
  }, []);

  useEffect(() => {
    const handleProfileMatchDone = () => {
      console.log("🧹 [MainContent] Profile Matcher done — returning to chat mode.");
      if (typeof window !== "undefined") window.__PROFILE_MATCH_MODE_ACTIVE__ = false;
    };
    window.addEventListener("profile_match_done", handleProfileMatchDone);
    return () => window.removeEventListener("profile_match_done", handleProfileMatchDone);
  }, []);

  /* 🧩 Compose messages for chat UI */
  const mergedMessages = [
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

    // 🎯 Profile Matcher UI
    ...(selectedTask === "Profile Matcher"
      ? [
        {
          role: "assistant",
          type: "matcher_ui",
          data: {
            isLoading,
            onSend: handleSend,
          },
        },
      ]
      : []),

    // 📎 Upload Resumes UI
    ...(selectedTask === "Upload Resumes"
      ? [
        {
          role: "assistant",
          type: "upload_ui",
          data: { uploadResumes },
        },
      ]
      : []),
  ];

  return (
    <div className="main-content">
      <Header onRefresh={handleRefresh} />

      <main className="main-content-body">
        {/* 💬 Welcome / Intro */}
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

        {showWelcome && <InfoCards />}

        {/* 📊 Profile Match History */}
        {selectedFeature === "ProfileMatchHistory" ? (
          <div className="feature-view mt-6 p-4">
            <ProfileMatchHistory />
          </div>
        ) : (
          // 🧠 Default Chat-based Interface
          <div className="chat-area">
            <ChatContainer
              messages={mergedMessages}
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
