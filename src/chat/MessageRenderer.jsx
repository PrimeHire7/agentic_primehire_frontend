import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ProfileTable from "./ProfileTable";
import ResumeTable from "@/chat/ResumeTable";
import JDTaskUI from "@/pages/JDTaskUI";
import ProfileMatchHistory from "@/components/ProfileMatcher/ProfileMatchHistory";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import InterviewBot from "../InterviewBot/InterviewBot";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import ZohoLoginButton from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import JDHistory from "@/pages/JDHistory";
import "./UploadResumeUI.css";

const MessageRenderer = ({ message, index }) => {
  if (!message) return null;

  // ✅ Structured tables
  if (message.type === "profile_table")
    return <ProfileTable key={index} data={message.data} index={index} />;

  if (message.type === "resume_table")
    return <ResumeTable key={index} data={message.data} index={index} />;

  // ✅ JD Creator inline UI
  if (message.type === "jd_ui" && message.data) {
    const {
      currentJdStep,
      currentJdPrompt,
      currentJdInput,
      setCurrentJdInput,
      handleJdSend,
      jdInProgress,
      messages,
    } = message.data;

    return (
      <div key={index} className="message-block feature-block">
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

  // ✅ Profile Matcher inline UI
  if (message.type === "matcher_ui") {
    const { isLoading, onSend } = message.data || {};
    return (
      <div key={index} className="message-block feature-block fade-highlight">
        <ChatMessage
          role="assistant"
          content="🎯 Profile Matcher — enter JD to find best candidates."
        />
        <div className="message-feature-ui mt-2">
          <ChatInput
            onSend={onSend}
            disabled={isLoading}
            placeholder="Type JD text or paste JSON to match..."
          />
        </div>
      </div>
    );
  }



  // ✅ Upload Resumes inline UI
  // ✅ Upload Resumes inline UI (styled)
  // ✅ Upload Resumes inline UI
  if (message.type === "upload_ui") {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [uploadedData, setUploadedData] = React.useState([]);

    const { progressData, isProcessing } = useUploadProgress();

    // 🧹 Reset everything on refresh or feature change
    React.useEffect(() => {
      const resetHandler = () => {
        console.log("🧹 FULL Upload UI Reset Triggered");

        setFiles([]);
        setUploadedData([]);
        setUploading(false);
      };

      window.addEventListener("refresh_trigger", resetHandler);
      window.addEventListener("feature_change", resetHandler);

      return () => {
        window.removeEventListener("refresh_trigger", resetHandler);
        window.removeEventListener("feature_change", resetHandler);
      };
    }, []);

    // 📁 Choose files
    const handleFileChange = (e) => setFiles(Array.from(e.target.files));

    // 🚀 Start Upload
    const handleUpload = async () => {
      if (!files.length) return;

      // 🔥 Clear frontend progress before new batch
      window.dispatchEvent(new Event("refresh_trigger"));

      console.log("🚀 Starting new upload batch:", files.length);

      setUploading(true);

      try {
        const formData = new FormData();
        files.forEach((f) => formData.append("files", f));

        const res = await fetch(
          "https://primehire.nirmataneurotech.com/mcp/tools/resume/upload",
          { method: "POST", body: formData }
        );

        const data = await res.json();
        console.log("📤 Upload initiated:", data);

      } catch (err) {
        console.error("❌ Upload failed:", err);
      } finally {
        setUploading(false);
      }
    };

    // 🧠 When backend finishes, load recent metadata
    React.useEffect(() => {
      if (
        progressData &&
        progressData.total > 0 &&
        progressData.processed === progressData.total
      ) {
        console.log("🎯 All resumes processed — fetching recent metadata…");

        fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/recent")
          .then((r) => r.json())
          .then((d) => {
            console.log("📥 Received recent candidates:", d);
            setUploadedData(d.recent_candidates || []);
          });
      }
    }, [progressData]);

    const progressPercent =
      progressData && progressData.total
        ? Math.round((progressData.processed / progressData.total) * 100)
        : 0;

    return (
      <div key={index} className="message-block feature-block fade-highlight">
        <ChatMessage
          role="assistant"
          content="📎 Upload Resumes — upload PDFs/DOCXs, track progress, and view parsed metadata."
        />

        <div className="upload-box mt-3">

          {/* File Input */}
          <input
            id="resume-upload"
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="resume-upload" className="upload-label">
            Choose Files
          </label>

          {/* File List */}
          {files.length > 0 ? (
            <div className="selected-files">
              <strong>{files.length} file(s) selected:</strong>
              <ul>
                {files.map((f, i) => (
                  <li key={i}>📄 {f.name}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="upload-placeholder">
              No files selected — click “Choose Files”
            </div>
          )}

          {/* Progress Bar */}
          {progressData && progressData.total > 0 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <p className="progress-status">
                {isProcessing ? (
                  <span className="processing">
                    Processing {progressData.processed}/{progressData.total}...
                  </span>
                ) : (
                  <span className="success">✅ All resumes processed</span>
                )}
              </p>

              {progressData.completed?.length > 0 && (
                <div className="completed-list">
                  {progressData.completed.slice(-3).map((name, i) => (
                    <div key={i}>✅ {name}</div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upload button */}
          <button
            onClick={handleUpload}
            disabled={!files.length || uploading}
            className="upload-btn"
          >
            {uploading ? "Uploading..." : "Start Upload"}
          </button>
        </div>

        {/* Parsed Resume Results */}
        {uploadedData.length > 0 && (
          <div className="mt-6">
            <ResumeTable data={uploadedData} />
          </div>
        )}
      </div>
    );
  }


  // ✅ Upload Resumes inline UI with progress bar + ResumeTable
  // ✅ Upload Resumes inline UI (styled)
  // if (message.type === "upload_ui") {
  //   const [files, setFiles] = React.useState([]);
  //   const [uploading, setUploading] = React.useState(false);
  //   const [uploadedData, setUploadedData] = React.useState([]);
  //   const { progressData, isProcessing } = useUploadProgress();

  //   const handleFileChange = (e) => setFiles(Array.from(e.target.files));

  //   const handleUpload = async () => {
  //     if (!files.length) return;
  //     setUploading(true);
  //     try {
  //       const formData = new FormData();
  //       files.forEach((f) => formData.append("files", f));
  //       const res = await fetch(
  //         "https://primehire.nirmataneurotech.com/mcp/tools/resume/upload",
  //         { method: "POST", body: formData }
  //       );
  //       const data = await res.json();
  //       console.log("📂 Upload started:", data);
  //     } catch (err) {
  //       console.error("❌ Upload failed:", err);
  //     } finally {
  //       setUploading(false);
  //     }
  //   };

  //   // Auto-fetch metadata when processing completes
  //   React.useEffect(() => {
  //     if (
  //       progressData &&
  //       progressData.total > 0 &&
  //       progressData.processed === progressData.total
  //     ) {
  //       fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/recent")
  //         .then((r) => r.json())
  //         .then((d) => {
  //           console.log("✅ Recent metadata:", d);
  //           setUploadedData(d.recent_candidates || []);
  //         });
  //     }
  //   }, [progressData]);

  //   const progressPercent =
  //     progressData && progressData.total
  //       ? Math.round((progressData.processed / progressData.total) * 100)
  //       : 0;

  //   return (
  //     <div key={index} className="message-block feature-block fade-highlight">
  //       <ChatMessage
  //         role="assistant"
  //         content="📎 Upload Resumes — upload PDFs/DOCXs, track progress, and view details."
  //       />

  //       <div className="upload-box mt-3">
  //         {/* File input */}
  //         <input
  //           id="resume-upload"
  //           type="file"
  //           multiple
  //           accept=".pdf,.docx"
  //           onChange={handleFileChange}
  //           className="hidden"
  //         />
  //         <label htmlFor="resume-upload" className="upload-label">
  //           Choose Files
  //         </label>

  //         {/* Selected files */}
  //         {files.length > 0 ? (
  //           <div className="selected-files">
  //             <strong>{files.length} file(s) selected:</strong>
  //             <ul>
  //               {files.map((f, i) => (
  //                 <li key={i}>📄 {f.name}</li>
  //               ))}
  //             </ul>
  //           </div>
  //         ) : (
  //           <div className="upload-placeholder">
  //             No files selected yet — click “Choose Files” to begin.
  //           </div>
  //         )}

  //         {/* Progress bar */}
  //         {progressData && progressData.total > 0 && (
  //           <div className="upload-progress">
  //             <div className="progress-bar">
  //               <div
  //                 className="progress-bar-fill"
  //                 style={{ width: `${progressPercent}%` }}
  //               ></div>
  //             </div>
  //             <p className="progress-status">
  //               {isProcessing ? (
  //                 <span className="processing">
  //                   Processing {progressData.processed}/{progressData.total}...
  //                 </span>
  //               ) : (
  //                 <span className="success">✅ All resumes processed</span>
  //               )}
  //             </p>

  //             {progressData.completed?.length > 0 && (
  //               <div className="completed-list">
  //                 {progressData.completed.slice(-3).map((name, i) => (
  //                   <div key={i}>✅ {name}</div>
  //                 ))}
  //               </div>
  //             )}
  //           </div>
  //         )}

  //         {/* Upload button */}
  //         <button
  //           onClick={handleUpload}
  //           disabled={!files.length || uploading}
  //           className="upload-btn"
  //         >
  //           {uploading ? "Uploading..." : "Start Upload"}
  //         </button>
  //       </div>

  //       {/* Resume table */}
  //       {uploadedData.length > 0 && (
  //         <div className="mt-6">
  //           <ResumeTable data={uploadedData} />
  //         </div>
  //       )}
  //     </div>
  //   );
  // }




  // ✅ Feature Detection (Zoho, MailMind, etc.)
  const featureRef = useRef(null);
  const isAssistantText =
    message.role === "assistant" && typeof message.content === "string";
  const cleanContent = isAssistantText
    ? message.content.replace(/[*_~`]/g, "")
    : message.content;

  const featureMatch =
    isAssistantText &&
    cleanContent.match(
      /ZohoBridge|MailMind|JDHistory|PrimeHireBrain|InterviewBot|LinkedInPoster|ProfileMatchHistory|JD\s?Creator|Profile\s?Matcher|Upload\s?Resumes?/i
    );

  const detectedFeature = featureMatch ? featureMatch[0] : null;

  // 🔔 Dispatch "featureRendered" for scroll-to-feature behavior
  useEffect(() => {
    if (!featureRef.current || !detectedFeature) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        const event = new CustomEvent("featureRendered", {
          detail: { element: featureRef.current, feature: detectedFeature },
        });
        window.dispatchEvent(event);
      }, 40);
    });
  }, [detectedFeature]);

  // ✅ Render feature blocks
  if (detectedFeature) {
    return (
      <div
        ref={featureRef}
        key={index}
        className="message-block feature-block fade-highlight"
      >
        <ChatMessage role={message.role} content={message.content} />
        <div className="message-feature-ui mt-2">
          {detectedFeature === "ZohoBridge" && <ZohoLoginButton />}
          {detectedFeature === "MailMind" && <MailMindButton />}
          {detectedFeature === "PrimeHireBrain" && <PrimeHireBrain />}
          {detectedFeature === "InterviewBot" && <InterviewBot />}
          {detectedFeature === "LinkedInPoster" && <LinkedInPosterButton />}
          {detectedFeature === "ProfileMatchHistory" && <ProfileMatchHistory />}
          {detectedFeature === "JDHistory" && <JDHistory />}
        </div>
      </div>
    );
  }

  // ✅ Default message
  return (
    <div key={index} className="message-block">
      <ChatMessage role={message.role} content={message.content} />
    </div>
  );
};

export default MessageRenderer;
