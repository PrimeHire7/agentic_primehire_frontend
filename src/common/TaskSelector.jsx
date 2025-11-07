// import React from "react";
// import { Button } from "../components/ui/button";
// import ChatInput from "../chat/ChatInput";
// import "./TaskSelector.css";

// const TaskSelector = ({
//   selectedTask,
//   onTaskSelect,
//   onUploadResumes,
//   onJdSend,
//   currentJdInput,
//   setCurrentJdInput,
//   currentJdStep,
//   isLoading,
//   onSend
// }) => {
//   const stepPrompts = {
//     role: "👉 What is the job title / role?",
//     location: "📍 Where is the job located? (City or Remote)",
//     experience: "💼 What is the experience required?",
//     jobType: "📌 Job type (Full-time / Contract / Remote)?",
//     skillsMandatory: "✍️ List the mandatory skills (comma separated).",
//     skillsPreferred: "✨ List the preferred skills (comma separated).",
//     responsibilities: "📝 Provide key responsibilities (optional, can skip).",
//     company_name: "🏢 What is the company name?",
//     about: "🏢 Provide a short description about the role/company (optional).",
//     perks: "🎁 Any perks or benefits to highlight? (optional).",
//   };

//   return (
//     <>
//       {/* Task selector buttons */}
//       <div className="task-selector-container">
//         {["JD Creator", "Profile Matcher", "Upload Resumes"].map((task) => (
//           <Button
//             key={task}
//             variant={selectedTask === task ? "default" : "outline"}
//             size="sm"
//             className="task-button"
//             onClick={() => onTaskSelect(task)}
//           >
//             {task}
//           </Button>
//         ))}
//       </div>

//       {/* Upload Resumes Section */}
//       {selectedTask === "Upload Resumes" && (
//         <div className="upload-resumes-section">
//           <label className="upload-resumes-label">📎 Upload Candidate Resumes (PDF/DOCX)</label>
//           <input
//             type="file"
//             multiple
//             accept=".pdf,.docx"
//             onChange={(e) => onUploadResumes(e.target.files)}
//             className="upload-resumes-input"
//           />
//           <p className="upload-resumes-help">
//             Upload multiple resumes. Extracted info will appear as a table.
//           </p>
//         </div>
//       )}

//       {/* JD Creator input area */}
//       {selectedTask === "JD Creator" ? (
//         <div className="jd-creator-input">
//           <input
//             type="text"
//             value={currentJdInput}
//             onChange={(e) => setCurrentJdInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && onJdSend(currentJdInput)}  
//             placeholder={currentJdStep ? stepPrompts[currentJdStep] : "Type your answer..."}
//             className="jd-creator-text-input"
//           />
//           <Button onClick={() => onJdSend(currentJdInput)}>Next</Button>
//         </div>
//       ) : (
//         // Default chat input for other tasks
//         <ChatInput
//           onSend={onSend}
//           disabled={isLoading}
//           placeholder={
//             selectedTask === "Profile Matcher"
//               ? "Type JD text or paste JSON to match..."
//               : "Type a message..."
//           }
//         />
//       )}
//     </>
//   );
// };

// export default TaskSelector;
import React from "react";
import { Button } from "../components/ui/button";
import ChatInput from "../chat/ChatInput";
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
  onSend
}) => {
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

  return (
    <>
        {selectedTask === "Upload Resumes" && (
  <div className="upload-resumes-section">
    <label htmlFor="resume-upload" className="upload-resumes-label">
      📎 Upload Candidate Resumes (PDF/DOCX)
    </label>
    <input
      id="resume-upload"
      type="file"
      multiple
      accept=".pdf,.docx"
      onChange={(e) => onUploadResumes(e.target.files)}
      className="upload-resumes-input"
    />
    <p className="upload-resumes-help">
      Upload multiple resumes. Extracted info will appear as a table.
    </p>
  </div>
)}

      {/* Task selector buttons */}
      <div className="task-selector-container">
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

      
  

      {/* JD Creator Input */}
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

      <button className="jd-creator-btn" onClick={() => onJdSend(currentJdInput)}>
        Next
      </button>
    </div>
  </div>
)}


      {/* Chat input for Profile Matcher */}
      {selectedTask === "Profile Matcher" && (
        <ChatInput
          onSend={onSend}
          disabled={isLoading}
          placeholder="Type JD text or paste JSON to match..."
        />
      )}
    </>
  );
};

export default TaskSelector;
