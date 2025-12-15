// // // import React from "react";
// // // import ResumeTable from "@/chat/ResumeTable";
// // // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // // import "./UploadUI.css";

// // // export default function UploadUI() {
// // //     const [files, setFiles] = React.useState([]);
// // //     const [uploading, setUploading] = React.useState(false);
// // //     const [uploadedData, setUploadedData] = React.useState([]);

// // //     const {
// // //         progressData,
// // //         isProcessing,
// // //         isCompleted,
// // //         setProgressData,
// // //         setIsCompleted
// // //     } = useUploadProgress();

// // //     const handleFileChange = (e) => {
// // //         const selected = Array.from(e.target.files);
// // //         setFiles(selected);
// // //         setUploadedData([]);
// // //         setIsCompleted(false);

// // //         setProgressData({
// // //             total: 0,
// // //             processed: 0,
// // //             completed: [],
// // //             errors: [],
// // //             status: "idle"
// // //         });
// // //     };

// // //     const resetAll = () => {
// // //         setUploadedData([]);
// // //         setIsCompleted(false);
// // //         setProgressData({
// // //             total: 0,
// // //             processed: 0,
// // //             completed: [],
// // //             errors: [],
// // //             status: "idle"
// // //         });

// // //         fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/reset", { method: "POST" });
// // //     };

// // //     const handleUpload = async () => {
// // //         if (!files.length) return;

// // //         resetAll();
// // //         setUploading(true);

// // //         try {
// // //             const formData = new FormData();
// // //             files.forEach(f => formData.append("files", f));

// // //             await fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/upload", {
// // //                 method: "POST",
// // //                 body: formData
// // //             });

// // //         } finally {
// // //             setUploading(false);
// // //         }
// // //     };

// // //     React.useEffect(() => {
// // //         if (progressData.total > 0 && progressData.processed === progressData.total) {
// // //             fetch(
// // //                 "https://primehire.nirmataneurotech.com/mcp/tools/resume/recent?limit=" +
// // //                 progressData.total
// // //             )
// // //                 .then(r => r.json())
// // //                 .then(d => setUploadedData(d.recent_candidates || []));
// // //         }
// // //     }, [progressData.processed]);

// // //     const progressPercent =
// // //         progressData.total > 0
// // //             ? Math.round((progressData.processed / progressData.total) * 100)
// // //             : 0;

// // //     return (
// // //         <div className="upload-box mt-3">

// // //             <input
// // //                 id="resume-upload"
// // //                 type="file"
// // //                 multiple
// // //                 accept=".pdf,.docx"
// // //                 onChange={handleFileChange}
// // //                 className="hidden"
// // //             />

// // //             <label htmlFor="resume-upload" className="upload-label">
// // //                 Choose Files
// // //             </label>

// // //             {files.length > 0 && (
// // //                 <div className="selected-files">
// // //                     <strong>{files.length} file(s) selected:</strong>
// // //                     <ul>
// // //                         {files.map((f, i) => (
// // //                             <li key={i}>📄 {f.name}</li>
// // //                         ))}
// // //                     </ul>
// // //                 </div>
// // //             )}

// // //             {isProcessing && (
// // //                 <div className="upload-progress">
// // //                     <div className="progress-bar">
// // //                         <div
// // //                             className="progress-bar-fill"
// // //                             style={{ width: `${progressPercent}%` }}
// // //                         ></div>
// // //                     </div>

// // //                     <p className="progress-status">
// // //                         Processing {progressData.processed}/{progressData.total}
// // //                     </p>

// // //                     {progressData.completed.length > 0 && (
// // //                         <ul className="completed-files-list">
// // //                             {progressData.completed.map((file, i) => (
// // //                                 <li key={i}>✔ {file}</li>
// // //                             ))}
// // //                         </ul>
// // //                     )}

// // //                     {progressData.errors.length > 0 && (
// // //                         <ul className="error-files-list">
// // //                             {progressData.errors.map((file, i) => (
// // //                                 <li key={i}>❌ {file}</li>
// // //                             ))}
// // //                         </ul>
// // //                     )}
// // //                 </div>
// // //             )}

// // //             {isCompleted && <p className="progress-status success">✅ Upload Complete</p>}

// // //             <button
// // //                 onClick={() => {
// // //                     if (isCompleted) {
// // //                         resetAll();
// // //                         setFiles([]);
// // //                         setTimeout(() => document.getElementById("resume-upload").click(), 50);
// // //                         return;
// // //                     }

// // //                     if (files.length > 0) {
// // //                         handleUpload();
// // //                         return;
// // //                     }

// // //                     document.getElementById("resume-upload").click();
// // //                 }}
// // //                 disabled={uploading}
// // //                 className="upload-btn"
// // //             >
// // //                 {uploading
// // //                     ? "Uploading..."
// // //                     : isProcessing
// // //                         ? "Processing..."
// // //                         : isCompleted
// // //                             ? "Upload Again"
// // //                             : "Start Upload"}
// // //             </button>

// // //             {/* {uploadedData.length > 0 && !uploading && !isProcessing && (
// // //                 // <ResumeTable data={uploadedData} />
// // //             )} */}

// // //         </div>
// // //     );
// // // }
// // import React from "react";
// // import ResumeTable from "@/chat/ResumeTable";
// // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // import { API_BASE } from "@/utils/constants";
// // import OverwriteDialog from "@/components/OverwriteDialog";
// // import "./UploadUI.css";

// // export default function UploadUI() {
// //     const [files, setFiles] = React.useState([]);
// //     const [uploading, setUploading] = React.useState(false);
// //     const [uploadedData, setUploadedData] = React.useState([]);

// //     const [duplicateItems, setDuplicateItems] = React.useState([]);
// //     const [showOverwriteDialog, setShowOverwriteDialog] = React.useState(false);

// //     const {
// //         progressData,
// //         isProcessing,
// //         isCompleted,
// //         setProgressData,
// //         setIsCompleted
// //     } = useUploadProgress();

// //     // -------------------------------
// //     // File Selection
// //     // -------------------------------
// //     const handleFileChange = (e) => {
// //         const selected = Array.from(e.target.files);
// //         setFiles(selected);
// //         setUploadedData([]);
// //         setIsCompleted(false);

// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "idle"
// //         });
// //     };

// //     const resetAll = () => {
// //         setUploadedData([]);
// //         setIsCompleted(false);

// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "idle"
// //         });

// //         fetch(`${API_BASE}/mcp/tools/resume/reset`, { method: "POST" });
// //     };

// //     // -------------------------------
// //     // MAIN UPLOAD HANDLER
// //     // -------------------------------
// //     const handleUpload = async (forceOverwrite = false) => {
// //         if (!files.length) return;

// //         resetAll();
// //         setUploading(true);

// //         try {
// //             const formData = new FormData();
// //             files.forEach((f) => formData.append("files", f));

// //             const res = await fetch(
// //                 `${API_BASE}/mcp/tools/resume/upload${forceOverwrite ? "?overwrite=true" : ""}`,
// //                 {
// //                     method: "POST",
// //                     body: formData
// //                 }
// //             );

// //             const data = await res.json();

// //             // DUPLICATE DETECTED?
// //             if (data.status === "duplicate") {
// //                 setDuplicateItems(data.duplicates || []);
// //                 setShowOverwriteDialog(true);
// //                 return;
// //             }

// //         } finally {
// //             setUploading(false);
// //         }
// //     };

// //     // -------------------------------
// //     // OVERWRITE CONFIRMATION
// //     // -------------------------------
// //     const confirmOverwrite = () => {
// //         setShowOverwriteDialog(false);
// //         handleUpload(true);
// //     };

// //     const cancelOverwrite = () => {
// //         setShowOverwriteDialog(false);
// //         alert("Upload cancelled due to duplicates.");
// //     };

// //     // -------------------------------
// //     // Load recently processed resumes
// //     // -------------------------------
// //     React.useEffect(() => {
// //         if (progressData.total > 0 && progressData.processed === progressData.total) {
// //             fetch(`${API_BASE}/mcp/tools/resume/recent?limit=${progressData.total}`)
// //                 .then((r) => r.json())
// //                 .then((d) => setUploadedData(d.recent_candidates || []));
// //         }
// //     }, [progressData.processed]);

// //     const progressPercent =
// //         progressData.total > 0
// //             ? Math.round((progressData.processed / progressData.total) * 100)
// //             : 0;

// //     return (
// //         <div className="upload-box mt-3">

// //             {/* FILE INPUT */}
// //             <input
// //                 id="resume-upload"
// //                 name="files"
// //                 type="file"
// //                 multiple
// //                 accept=".pdf,.docx"
// //                 onChange={handleFileChange}
// //                 className="hidden"
// //             />

// //             <label htmlFor="resume-upload" className="upload-label">
// //                 Choose Files
// //             </label>

// //             {/* SELECTED FILE LIST */}
// //             {files.length > 0 && (
// //                 <div className="selected-files">
// //                     <strong>{files.length} file(s) selected:</strong>
// //                     <ul>
// //                         {files.map((f, i) => (
// //                             <li key={i}>📄 {f.name}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}

// //             {/* UPLOAD PROGRESS UI */}
// //             {isProcessing && (
// //                 <div className="upload-progress">
// //                     <div className="progress-bar">
// //                         <div
// //                             className="progress-bar-fill"
// //                             style={{ width: `${progressPercent}%` }}
// //                         ></div>
// //                     </div>

// //                     <p className="progress-status">
// //                         Processing {progressData.processed}/{progressData.total}
// //                     </p>

// //                     {progressData.completed.length > 0 && (
// //                         <ul className="completed-files-list">
// //                             {progressData.completed.map((file, i) => (
// //                                 <li key={i}>✔ {file}</li>
// //                             ))}
// //                         </ul>
// //                     )}

// //                     {progressData.errors.length > 0 && (
// //                         <ul className="error-files-list">
// //                             {progressData.errors.map((file, i) => (
// //                                 <li key={i}>❌ {file}</li>
// //                             ))}
// //                         </ul>
// //                     )}
// //                 </div>
// //             )}

// //             {isCompleted && <p className="progress-status success">✅ Upload Complete</p>}

// //             {/* MAIN BUTTON */}
// //             <button
// //                 onClick={() => {
// //                     if (isCompleted) {
// //                         resetAll();
// //                         setFiles([]);
// //                         setTimeout(() => document.getElementById("resume-upload").click(), 50);
// //                         return;
// //                     }

// //                     if (files.length > 0) {
// //                         handleUpload();
// //                         return;
// //                     }

// //                     document.getElementById("resume-upload").click();
// //                 }}
// //                 disabled={uploading}
// //                 className="upload-btn"
// //             >
// //                 {uploading
// //                     ? "Uploading..."
// //                     : isProcessing
// //                         ? "Processing..."
// //                         : isCompleted
// //                             ? "Upload Again"
// //                             : "Start Upload"}
// //             </button>

// //             {/* OPTIONAL TABLE (disabled for now)
// //             {uploadedData.length > 0 && !uploading && !isProcessing && (
// //                 <ResumeTable data={uploadedData} />
// //             )} */}

// //             {/* OVERWRITE POPUP */}
// //             {showOverwriteDialog && (
// //                 <OverwriteDialog
// //                     items={duplicateItems}
// //                     onConfirm={confirmOverwrite}
// //                     onCancel={cancelOverwrite}
// //                 />
// //             )}
// //         </div>
// //     );
// // }
// // import React from "react";
// // import ResumeTable from "@/chat/ResumeTable";
// // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // import { uploadResumes } from "@/utils/uploadResumes";   // 🔥 NEW HELPER
// // import OverwriteDialog from "@/components/OverwriteDialog";
// // import { API_BASE } from "@/utils/constants";
// // import "./UploadUI.css";

// // export default function UploadUI() {
// //     const [files, setFiles] = React.useState([]);
// //     const [uploading, setUploading] = React.useState(false);
// //     const [uploadedData, setUploadedData] = React.useState([]);

// //     const [duplicateItems, setDuplicateItems] = React.useState([]);
// //     const [showOverwriteDialog, setShowOverwriteDialog] = React.useState(false);

// //     const {
// //         progressData,
// //         isProcessing,
// //         isCompleted,
// //         setProgressData,
// //         setIsCompleted
// //     } = useUploadProgress();

// //     // -------------------------------
// //     // FILE SELECTION HANDLER
// //     // -------------------------------
// //     const handleFileChange = (e) => {
// //         const selected = Array.from(e.target.files);
// //         setFiles(selected);

// //         setUploadedData([]);
// //         setIsCompleted(false);
// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "idle"
// //         });
// //     };

// //     // -------------------------------
// //     // RESET
// //     // -------------------------------
// //     const resetAll = () => {
// //         setUploadedData([]);
// //         setIsCompleted(false);

// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "idle"
// //         });

// //         fetch(`${API_BASE}/mcp/tools/resume/reset`, { method: "POST" });
// //     };

// //     // -------------------------------
// //     // MAIN UPLOAD LOGIC
// //     // -------------------------------
// //     const handleUpload = async (forceOverwrite = false) => {
// //         if (!files.length) return;

// //         // resetAll();
// //         // setUploading(true);
// //         setUploadedData([]);
// //         setIsCompleted(false);

// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "uploading"
// //         });

// //         setUploading(true);


// //         try {
// //             const data = await uploadResumes(files, forceOverwrite);

// //             // 🔍 DUPLICATE CASE
// //             if (data.status === "duplicate" && !forceOverwrite) {
// //                 setDuplicateItems(data.duplicates || []);
// //                 setShowOverwriteDialog(true);
// //                 return;
// //             }

// //             // 🔥 PROCESSING STARTED
// //             if (data.status === "processing") return;

// //             console.warn("Unexpected response:", data);

// //         } catch (err) {
// //             console.error("Upload failed:", err);
// //         } finally {
// //             setUploading(false);
// //         }
// //     };

// //     // -------------------------------
// //     // OVERWRITE CONFIRMATION
// //     // -------------------------------
// //     const confirmOverwrite = () => {
// //         setShowOverwriteDialog(false);
// //         handleUpload(true);  // 🔥 calls /upload?overwrite=true
// //     };

// //     const cancelOverwrite = () => {
// //         setShowOverwriteDialog(false);
// //         alert("Upload cancelled due to duplicates.");
// //     };

// //     // -------------------------------
// //     // LOAD RECENT CANDIDATES
// //     // -------------------------------
// //     React.useEffect(() => {
// //         if (progressData.total > 0 && progressData.processed === progressData.total) {
// //             fetch(`${API_BASE}/mcp/tools/resume/recent?limit=${progressData.total}`)
// //                 .then((r) => r.json())
// //                 .then((d) => setUploadedData(d.recent_candidates || []));
// //         }
// //     }, [progressData.processed]);

// //     const progressPercent =
// //         progressData.total > 0
// //             ? Math.round((progressData.processed / progressData.total) * 100)
// //             : 0;
// //     // ✅ MARK UPLOAD AS COMPLETED
// //     React.useEffect(() => {
// //         if (
// //             progressData.total > 0 &&
// //             progressData.processed === progressData.total &&
// //             !isProcessing
// //         ) {
// //             setIsCompleted(true);
// //             setUploading(false);
// //         }
// //     }, [progressData.total, progressData.processed, isProcessing]);

// //     return (
// //         <div className="upload-box mt-3">

// //             {/* FILE INPUT */}
// //             <input
// //                 id="resume-upload"
// //                 name="files"
// //                 type="file"
// //                 multiple
// //                 accept=".pdf,.docx"
// //                 onChange={handleFileChange}
// //                 className="hidden"
// //             />

// //             <label htmlFor="resume-upload" className="upload-label">
// //                 Choose Files
// //             </label>

// //             {/* SHOW SELECTED FILES */}
// //             {files.length > 0 && (
// //                 <div className="selected-files">
// //                     <strong>{files.length} file(s) selected:</strong>
// //                     <ul>
// //                         {files.map((f, i) => (
// //                             <li key={i}>📄 {f.name}</li>
// //                         ))}
// //                     </ul>
// //                 </div>
// //             )}

// //             {/* PROGRESS */}
// //             {isProcessing && (
// //                 <div className="upload-progress">
// //                     <div className="progress-bar">
// //                         <div
// //                             className="progress-bar-fill"
// //                             style={{ width: `${progressPercent}%` }}
// //                         ></div>
// //                     </div>

// //                     <p className="progress-status">
// //                         Processing {progressData.processed}/{progressData.total}
// //                     </p>

// //                     {progressData.completed.length > 0 && (
// //                         <ul className="completed-files-list">
// //                             {progressData.completed.map((file, i) => (
// //                                 <li key={i}>✔ {file}</li>
// //                             ))}
// //                         </ul>
// //                     )}

// //                     {progressData.errors.length > 0 && (
// //                         <ul className="error-files-list">
// //                             {progressData.errors.map((file, i) => (
// //                                 <li key={i}>❌ {file}</li>
// //                             ))}
// //                         </ul>
// //                     )}
// //                 </div>
// //             )}

// //             {isCompleted && <p className="progress-status success">✅ Upload Complete</p>}

// //             {/* MAIN ACTION BUTTON */}
// //             <button
// //                 onClick={() => {
// //                     if (isCompleted) {
// //                         resetAll();
// //                         setFiles([]);
// //                         setTimeout(() => document.getElementById("resume-upload").click(), 50);
// //                         return;
// //                     }

// //                     if (files.length > 0) {
// //                         handleUpload();
// //                         return;
// //                     }

// //                     document.getElementById("resume-upload").click();
// //                 }}
// //                 disabled={uploading}
// //                 className="upload-btn"
// //             >
// //                 {uploading
// //                     ? "Uploading..."
// //                     : isProcessing
// //                         ? "Processing..."
// //                         : isCompleted
// //                             ? "Upload Again"
// //                             : "Start Upload"}
// //             </button>

// //             {/* OVERWRITE POPUP */}
// //             {showOverwriteDialog && (
// //                 <OverwriteDialog
// //                     items={duplicateItems}
// //                     onConfirm={confirmOverwrite}
// //                     onCancel={cancelOverwrite}
// //                 />
// //             )}
// //         </div>
// //     );
// // }
// import React from "react";
// import ResumeTable from "@/chat/ResumeTable";
// import { useUploadProgress } from "@/hooks/useUploadProgress";
// import { uploadResumes } from "@/utils/uploadResumes";
// import OverwriteDialog from "@/components/OverwriteDialog";
// import { API_BASE } from "@/utils/constants";
// import "./UploadUI.css";

// export default function UploadUI() {
//     const [files, setFiles] = React.useState([]);
//     const [uploading, setUploading] = React.useState(false);
//     const [uploadedData, setUploadedData] = React.useState([]);

//     const [duplicateItems, setDuplicateItems] = React.useState([]);
//     const [showOverwriteDialog, setShowOverwriteDialog] = React.useState(false);

//     // 🔒 LATCH — ensures "Upload Complete" never disappears
//     const completedOnceRef = React.useRef(false);

//     const {
//         progressData,
//         isProcessing,
//         isCompleted,
//         setProgressData,
//         setIsCompleted
//     } = useUploadProgress();

//     /* ===============================
//         FILE SELECTION
//     =============================== */
//     const handleFileChange = (e) => {
//         const selected = Array.from(e.target.files);
//         setFiles(selected);

//         completedOnceRef.current = false;
//         setUploadedData([]);
//         setIsCompleted(false);

//         setProgressData({
//             total: 0,
//             processed: 0,
//             completed: [],
//             errors: [],
//             status: "idle"
//         });
//     };

//     /* ===============================
//         RESET (ONLY ON Upload Again)
//     =============================== */
//     const resetAll = () => {
//         completedOnceRef.current = false;
//         setFiles([]);
//         setUploadedData([]);
//         setIsCompleted(false);

//         setProgressData({
//             total: 0,
//             processed: 0,
//             completed: [],
//             errors: [],
//             status: "idle"
//         });

//         fetch(`${API_BASE}/mcp/tools/resume/reset`, { method: "POST" });
//     };

//     /* ===============================
//         MAIN UPLOAD
//     =============================== */
//     const handleUpload = async (forceOverwrite = false) => {
//         if (!files.length) return;

//         completedOnceRef.current = false;
//         setIsCompleted(false);
//         setUploadedData([]);

//         setProgressData({
//             total: 0,
//             processed: 0,
//             completed: [],
//             errors: [],
//             status: "uploading"
//         });

//         setUploading(true);

//         try {
//             const data = await uploadResumes(files, forceOverwrite);

//             if (data.status === "duplicate" && !forceOverwrite) {
//                 setDuplicateItems(data.duplicates || []);
//                 setShowOverwriteDialog(true);
//                 return;
//             }

//             if (data.status === "processing") return;

//             console.warn("Unexpected response:", data);
//         } catch (err) {
//             console.error("Upload failed:", err);
//         } finally {
//             setUploading(false);
//         }
//     };

//     /* ===============================
//         OVERWRITE CONFIRMATION
//     =============================== */
//     const confirmOverwrite = () => {
//         setShowOverwriteDialog(false);
//         handleUpload(true);
//     };

//     const cancelOverwrite = () => {
//         setShowOverwriteDialog(false);
//         alert("Upload cancelled due to duplicates.");
//     };

//     /* ===============================
//         LOAD RECENT CANDIDATES
//     =============================== */
//     React.useEffect(() => {
//         if (
//             progressData.total > 0 &&
//             progressData.processed === progressData.total
//         ) {
//             fetch(`${API_BASE}/mcp/tools/resume/recent?limit=${progressData.total}`)
//                 .then((r) => r.json())
//                 .then((d) => setUploadedData(d.recent_candidates || []));
//         }
//     }, [progressData.processed]);

//     /* ===============================
//         FINAL COMPLETION LATCH
//     =============================== */
//     React.useEffect(() => {
//         if (
//             completedOnceRef.current
//         ) return;

//         if (
//             progressData.total > 0 &&
//             progressData.processed === progressData.total &&
//             !isProcessing
//         ) {
//             completedOnceRef.current = true;
//             setIsCompleted(true);
//             setUploading(false);
//         }
//     }, [progressData.total, progressData.processed, isProcessing]);

//     const progressPercent =
//         progressData.total > 0
//             ? Math.round((progressData.processed / progressData.total) * 100)
//             : 0;

//     return (
//         <div className="upload-box mt-3">

//             {/* FILE INPUT */}
//             <input
//                 id="resume-upload"
//                 type="file"
//                 multiple
//                 accept=".pdf,.docx"
//                 onChange={handleFileChange}
//                 className="hidden"
//             />

//             <label htmlFor="resume-upload" className="upload-label">
//                 Choose Files
//             </label>

//             {/* SELECTED FILES */}
//             {files.length > 0 && (
//                 <div className="selected-files">
//                     <strong>{files.length} file(s) selected:</strong>
//                     <ul>
//                         {files.map((f, i) => (
//                             <li key={i}>📄 {f.name}</li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {/* PROGRESS */}
//             {isProcessing && (
//                 <div className="upload-progress">
//                     <div className="progress-bar">
//                         <div
//                             className="progress-bar-fill"
//                             style={{ width: `${progressPercent}%` }}
//                         />
//                     </div>

//                     <p className="progress-status">
//                         Processing {progressData.processed}/{progressData.total}
//                     </p>
//                 </div>
//             )}

//             {/* ✅ STAYS FOREVER */}
//             {isCompleted && (
//                 <p className="progress-status success">
//                     ✅ Upload Complete
//                 </p>
//             )}

//             {/* ACTION BUTTON */}
//             <button
//                 className="upload-btn"
//                 disabled={uploading}
//                 onClick={() => {
//                     if (isCompleted) {
//                         resetAll();
//                         setTimeout(
//                             () => document.getElementById("resume-upload")?.click(),
//                             50
//                         );
//                         return;
//                     }

//                     if (files.length > 0) {
//                         handleUpload();
//                         return;
//                     }

//                     document.getElementById("resume-upload")?.click();
//                 }}
//             >
//                 {uploading
//                     ? "Uploading..."
//                     : isProcessing
//                         ? "Processing..."
//                         : isCompleted
//                             ? "Upload Again"
//                             : "Start Upload"}
//             </button>

//             {/* OVERWRITE DIALOG */}
//             {showOverwriteDialog && (
//                 <OverwriteDialog
//                     items={duplicateItems}
//                     onConfirm={confirmOverwrite}
//                     onCancel={cancelOverwrite}
//                 />
//             )}
//         </div>
//     );
// }

import React from "react";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import { uploadResumes } from "@/utils/uploadResumes";
import OverwriteDialog from "@/components/OverwriteDialog";
import { API_BASE } from "@/utils/constants";
import "./UploadUI.css";

export default function UploadUI() {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [uploadedData, setUploadedData] = React.useState([]);
    const [duplicateItems, setDuplicateItems] = React.useState([]);
    const [showOverwriteDialog, setShowOverwriteDialog] = React.useState(false);
    const uploadStartedRef = React.useRef(false);

    const {
        progressData,
        isProcessing,
        isCompleted,
        resetProgress,
        setProgressData
    } = useUploadProgress();

    const confirmOverwrite = () => {
        setShowOverwriteDialog(false);   // ✅ close modal
        setDuplicateItems([]);           // ✅ clear duplicate state
        handleUpload(true);              // ✅ start overwrite
    };

    /* FILE SELECT */
    const handleFileChange = (e) => {
        uploadStartedRef.current = false;  // 🔥 reset session
        console.log("FILE CHANGE FIRED", e.target.files);
        setFiles(Array.from(e.target.files));
        setUploadedData([]);
        resetProgress();
    };

    /* RESET */
    const resetAll = () => {
        resetProgress();
        setFiles([]);
        setUploadedData([]);
        fetch(`${API_BASE}/mcp/tools/resume/reset`, { method: "POST" });
    };

    /* UPLOAD */
    const handleUpload = async (forceOverwrite = false) => {
        uploadStartedRef.current = true;
        if (!files.length) return;

        resetProgress();
        setUploading(true);

        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "uploading"
        });

        try {
            const data = await uploadResumes(files, forceOverwrite);

            if (data.status === "duplicate" && !forceOverwrite) {
                setDuplicateItems(data.duplicates || []);
                setShowOverwriteDialog(true);
                return;
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-box mt-3">

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

            {files.length > 0 && (
                <div className="selected-files">
                    <strong>{files.length} file(s) selected:</strong>
                    <ul>
                        {files.map((f, i) => (
                            <li key={i}>📄 {f.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {isProcessing && (
                <p className="progress-status">
                    Processing {progressData.processed}/{progressData.total}
                </p>
            )}

            {uploadStartedRef.current && isCompleted && (
                <p className="progress-status success">✅ Upload Complete</p>
            )}


            <button
                className="upload-btn"
                disabled={uploading}
                onClick={() => {
                    if (isCompleted) {
                        resetAll();
                        document.getElementById("resume-upload")?.click();
                        return;
                    }

                    if (files.length) {
                        handleUpload();
                        return;
                    }

                    document.getElementById("resume-upload")?.click();
                }}
            >
                {uploading
                    ? "Uploading..."
                    : isProcessing
                        ? "Processing..."
                        : isCompleted
                            ? "Upload Again"
                            : "Start Upload"}
            </button>

            {showOverwriteDialog && (
                <OverwriteDialog
                    items={duplicateItems}
                    onConfirm={confirmOverwrite}
                    onCancel={() => {
                        setShowOverwriteDialog(false);
                        setDuplicateItems([]);
                    }}
                />
            )}

        </div>
    );
}
