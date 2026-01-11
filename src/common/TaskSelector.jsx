
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import ChatInput from "../chat/ChatInput";
import ResumeTable from "@/chat/ResumeTable";
import "./TaskSelector.css";

const TaskSelector = ({
  selectedTask,
  onTaskSelect,
  onUploadResumes,
  onJdSend,
  currentJdInput,
  setCurrentJdInput,
  currentJdStep,
  isLoading,
  onSend,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null); // ✅ For ResumeTable display
  const [uploadProgress, setUploadProgress] = useState(0);

  const stepPrompts = {
    role: "👉 What is the job title / role?",
    location: "📍 Where is the job located? (City or Remote)",
    experience: "💼 What is the experience required?",
    jobType: "📌 Job type (Full-time / Contract / Remote)?",
    skillsMandatory: "✍️ List the mandatory skills (comma separated).",
    skillsPreferred: "✨ List the preferred skills (comma separated).",
    responsibilities: "📝 Provide key responsibilities (optional, can skip).",
    company_name: "🏢 What is the company name?",
    about: "🏢 Provide a short description about the role/company (optional).",
    perks: "🎁 Any perks or benefits to highlight? (optional).",
  };

  // ✅ Handle resume upload with progress simulation
  const handleResumeUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    setUploadedData(null);
    setUploadProgress(0);

    // Simulate smooth progress
    const fakeProgress = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(fakeProgress);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    try {
      // Pass to parent handler (connects to backend)
      const result = await onUploadResumes(files);

      // Once complete
      setUploadProgress(100);
      setTimeout(() => {
        clearInterval(fakeProgress);
        setUploading(false);
        if (result?.uploaded_files) {
          setUploadedData(result.uploaded_files);
        }
      }, 500);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      clearInterval(fakeProgress);
      setUploading(false);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="task-selector-wrapper">
      {/* Task selector buttons */}
      <div className="task-selector-container mb-4">
        {["JD Creator", "Profile Matcher", "Upload Resumes"].map((task) => (
          <Button
            key={task}
            variant={selectedTask === task ? "default" : "outline"}
            size="sm"
            className="task-button"
            onClick={() => onTaskSelect(task)}
          >
            {task}
          </Button>
        ))}
      </div>

      {/* 🧠 JD Creator Input */}
      {selectedTask === "JD Creator" && (
        <div className="jd-creator-container">
          <div className="jd-creator-box">
            <input
              type="text"
              value={currentJdInput}
              onChange={(e) => setCurrentJdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onJdSend(currentJdInput)}
              placeholder={
                currentJdStep ? stepPrompts[currentJdStep] : "Type your answer..."
              }
              className="jd-creator-input"
            />

            <button
              className="jd-creator-btn"
              onClick={() => onJdSend(currentJdInput)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* 🎯 Profile Matcher */}
      {selectedTask === "Profile Matcher" && (
        <div className="profile-matcher-section mt-4">
          <ChatInput
            onSend={onSend}
            disabled={isLoading}
            placeholder="Type JD text or paste JSON to match..."
          />
        </div>
      )}

      {/* 📎 Upload Resumes */}
      {selectedTask === "Upload Resumes" && (
        <div className="upload-resumes-section mt-4">
          <label htmlFor="resume-upload" className="upload-resumes-label">
            📎 Upload Candidate Resumes (PDF/DOCX)
          </label>
          <input
            id="resume-upload"
            type="file"
            multiple
            accept=".pdf,.docx"
            onChange={(e) => handleResumeUpload(e.target.files)}
            className="upload-resumes-input"
            disabled={uploading}
          />

          {/* 🕐 Progress Bar */}
          {uploading && (
            <div className="upload-progress-bar mt-3">
              <div
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <p className="upload-progress-text">
                {uploadProgress < 100
                  ? `Uploading... ${uploadProgress}%`
                  : "Processing resumes..."}
              </p>
            </div>
          )}

          {/* ✅ After Upload — Show Table */}
          {!uploading && uploadedData && (
            <div className="uploaded-table mt-6">
              <h4 className="font-semibold mb-2">📄 Extracted Resume Data</h4>
              <ResumeTable data={uploadedData} />
            </div>
          )}

          {!uploading && !uploadedData && (
            <p className="upload-resumes-help mt-2 text-sm text-gray-600">
              Upload multiple resumes. Extracted info will appear as a table.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskSelector;
