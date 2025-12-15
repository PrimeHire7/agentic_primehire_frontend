// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { API_BASE } from "@/utils/constants";
// // import { Loader2 } from "lucide-react";
// // import "./MailMindButton.css";

// // /**
// //  * MailMindButton.jsx
// //  *
// //  * - Login to mailbox
// //  * - Extract resumes (saved on server)
// //  * - Show extracted resume list + preview/download
// //  * - Upload to DB (calls /mailmind/upload-extracted)
// //  * - If backend returns duplicate info, ask user to confirm overwrite
// //  * - If user confirms, re-call upload with overwrite=true
// //  *
// //  * Notes:
// //  * - This component is defensive about the backend response shape:
// //  *   - It handles response.files with per-file objects, possibly with `duplicate: true`
// //  *   - It also handles a top-level `duplicates` list if backend returns that
// //  */

// // const MailMindButton = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [platform, setPlatform] = useState("outlook");
// //   const [connected, setConnected] = useState(false);
// //   const [resumes, setResumes] = useState([]); // urls for preview/download
// //   const [extractedFiles, setExtractedFiles] = useState([]); // filenames
// //   const [previewFile, setPreviewFile] = useState(null);

// //   const [loadingLogin, setLoadingLogin] = useState(false);
// //   const [loadingExtract, setLoadingExtract] = useState(false);
// //   const [loadingUpload, setLoadingUpload] = useState(false);

// //   // ----------------------
// //   // Login Handler
// //   // ----------------------
// //   const handleConnect = async () => {
// //     setLoadingLogin(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, platform }),
// //       });

// //       if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(text || "Connection failed");
// //       }

// //       await res.json();
// //       setConnected(true);
// //       alert(`✅ Login Successful: ${email} (${platform})`);
// //     } catch (err) {
// //       console.error("Mail connect error:", err);
// //       alert("❌ Login failed. Check credentials or IMAP settings.");
// //     } finally {
// //       setLoadingLogin(false);
// //     }
// //   };

// //   // ----------------------
// //   // Extract Resumes Handler
// //   // ----------------------
// //   const handleExtract = async () => {
// //     setLoadingExtract(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/mcp/tools/resume/mailmind/fetch-resumes`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, platform }),
// //       });

// //       if (!res.ok) {
// //         const t = await res.text();
// //         throw new Error(t || "Extract failed");
// //       }

// //       const data = await res.json();

// //       // backend returns: { message, count, files: [...filenames], result: [...urls] }
// //       if (Array.isArray(data.result) && data.result.length > 0) {
// //         setResumes(data.result);
// //       } else {
// //         setResumes([]);
// //       }

// //       if (Array.isArray(data.files) && data.files.length > 0) {
// //         setExtractedFiles(data.files);
// //       } else {
// //         // fallback: try to derive filenames from result URLs
// //         if (Array.isArray(data.result)) {
// //           const dedupFiles = data.result.map((u) => u.split("/").pop());
// //           setExtractedFiles(dedupFiles);
// //         } else {
// //           setExtractedFiles([]);
// //         }
// //       }

// //       if ((data.result && data.result.length) || (data.files && data.files.length)) {
// //         alert(`✅ Extracted ${data.result?.length ?? data.files?.length ?? 0} resumes`);
// //       } else {
// //         alert(data.message || "ℹ️ No new resumes found.");
// //       }
// //     } catch (err) {
// //       console.error("Extract error:", err);
// //       alert("❌ Failed to extract resumes.");
// //     } finally {
// //       setLoadingExtract(false);
// //     }
// //   };

// //   // ----------------------
// //   // Helper: Show confirm dialog for duplicates
// //   // ----------------------
// //   const confirmOverwriteFor = async (duplicateItems) => {
// //     // duplicateItems: array of objects { filename, email, existing_name, message } OR filenames
// //     // We'll create a single confirm message summarizing duplicates
// //     if (!duplicateItems || duplicateItems.length === 0) return false;

// //     const names = duplicateItems
// //       .map((d) => {
// //         if (typeof d === "string") return d;
// //         if (d.existing_name) return `${d.existing_name} <${d.email || "unknown email"}>`;
// //         return d.filename || d.email || JSON.stringify(d);
// //       })
// //       .slice(0, 6); // limit length in message

// //     const more = duplicateItems.length > 6 ? `\n...and ${duplicateItems.length - 6} more` : "";
// //     const msg = `⚠️ Found ${duplicateItems.length} existing candidate(s):\n\n${names.join(
// //       "\n"
// //     )}${more}\n\nDo you want to overwrite these existing records?`;

// //     return confirm(msg); // browser confirm
// //   };

// //   // ----------------------
// //   // Upload handler (first try) — if duplicates returned, prompt, then retry with overwrite=true
// //   // ----------------------
// //   const handleUploadToDatabase = async () => {
// //     if (!extractedFiles || extractedFiles.length === 0) {
// //       alert("No extracted files to upload.");
// //       return;
// //     }

// //     setLoadingUpload(true);

// //     try {
// //       // 1) Call upload-extracted WITHOUT overwrite to let backend detect duplicates
// //       const res = await fetch(`${API_BASE}/mcp/tools/resume/mailmind/upload-extracted`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(extractedFiles),
// //       });

// //       if (!res.ok) {
// //         // If backend returns error, show it
// //         const txt = await res.text();
// //         throw new Error(txt || "Upload request failed");
// //       }

// //       const data = await res.json();

// //       // Normalize potential response shapes:
// //       // - { status: "processing", files: [{ filename, status }, ...] }
// //       // - or { duplicate: true, ... } (single)
// //       // - or { files: [{ filename, duplicate: true, email, existing_name }, ...] }
// //       // - or { duplicates: [...] }
// //       // We'll search for duplicate markers.

// //       // 1) direct duplicates array
// //       if (Array.isArray(data.duplicates) && data.duplicates.length > 0) {
// //         const ok = await confirmOverwriteFor(data.duplicates);
// //         if (ok) {
// //           await retryUploadWithOverwrite();
// //         } else {
// //           alert("Upload aborted for existing candidates.");
// //         }
// //         return;
// //       }

// //       // 2) per-file duplicate objects
// //       if (Array.isArray(data.files) && data.files.some((f) => f && f.duplicate)) {
// //         const dupItems = data.files.filter((f) => f.duplicate);
// //         const ok = await confirmOverwriteFor(dupItems);
// //         if (ok) {
// //           await retryUploadWithOverwrite();
// //         } else {
// //           alert("Upload aborted for existing candidates.");
// //         }
// //         return;
// //       }

// //       // 3) single duplicate response (if backend returns one object with duplicate true)
// //       if (data.duplicate) {
// //         const ok = await confirmOverwriteFor([data]);
// //         if (ok) {
// //           await retryUploadWithOverwrite();
// //         } else {
// //           alert("Upload aborted for existing candidate.");
// //         }
// //         return;
// //       }

// //       // 4) fallback: backend started processing and returned 'processing' status
// //       if (data.status && data.status === "processing") {
// //         alert("🚀 Upload started! Resumes are being processed in background.");
// //         return;
// //       }

// //       // 5) If backend returned a simple success object (no duplicates)
// //       alert("✅ Upload initiated. Check progress from backend.");
// //     } catch (err) {
// //       console.error("Upload error:", err);
// //       alert("❌ Upload to database failed: " + (err.message || err));
// //     } finally {
// //       setLoadingUpload(false);
// //     }
// //   };

// //   // ----------------------
// //   // Retry upload with overwrite=true
// //   // ----------------------
// //   const retryUploadWithOverwrite = async () => {
// //     setLoadingUpload(true);
// //     try {
// //       // Append overwrite=true as query param
// //       const res = await fetch(
// //         `${API_BASE}/mcp/tools/mailmind/upload-extracted?overwrite=true`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(extractedFiles),
// //         }
// //       );

// //       if (!res.ok) {
// //         const txt = await res.text();
// //         throw new Error(txt || "Overwrite upload failed");
// //       }

// //       const data = await res.json();

// //       // If backend still returns duplicate info (unexpected), inform user
// //       if (data.duplicates && data.duplicates.length > 0) {
// //         alert(
// //           "⚠️ Overwrite request returned duplicates. Check server logs or try again."
// //         );
// //         return;
// //       }

// //       if (data.status && data.status === "processing") {
// //         alert("✅ Overwrite accepted. Resumes processing started.");
// //         return;
// //       }

// //       // If backend returns per-file statuses show a summary
// //       if (Array.isArray(data.files)) {
// //         const done = data.files.filter((f) => f.status === "processing" || f.status === "done").length;
// //         alert(`✅ Overwrite started for ${done}/${data.files.length} files.`);
// //         return;
// //       }

// //       alert("✅ Upload/overwrite request completed.");
// //     } catch (err) {
// //       console.error("Retry overwrite error:", err);
// //       alert("❌ Failed to overwrite & upload: " + (err.message || err));
// //     } finally {
// //       setLoadingUpload(false);
// //     }
// //   };

// //   // ----------------------
// //   // Render
// //   // ----------------------
// //   return (
// //     <div className="mailmind-container">
// //       <h3 className="mailmind-title">📬 MailMind</h3>
// //       <p className="mailmind-info">
// //         MailMind will securely scan your mailbox and extract resumes received in the{" "}
// //         <b>last 7 days</b>. Use an <b>App Password</b> for Outlook if needed.
// //       </p>

// //       {!connected && (
// //         <>
// //           <div className="columns-3 mt-5">
// //             <div className="col-md-4">
// //               <Input
// //                 placeholder="Email"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 className="mailmind-input"
// //               />
// //             </div>

// //             <div className="col-md-4">
// //               <Input
// //                 type="password"
// //                 placeholder="Password / App Password"
// //                 value={password}
// //                 onChange={(e) => setPassword(e.target.value)}
// //                 className="mailmind-input"
// //               />
// //             </div>

// //             <div className="col-md-4">
// //               <Select onValueChange={setPlatform} defaultValue={platform}>
// //                 <SelectTrigger className="mailmind-select">
// //                   <SelectValue placeholder="Select Platform" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="outlook">Outlook</SelectItem>
// //                   <SelectItem value="gmail">Gmail</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </div>

// //           <Button onClick={handleConnect} className="mailmind-btn" disabled={loadingLogin}>
// //             {loadingLogin ? (
// //               <span className="flex items-center gap-2">
// //                 <Loader2 className="animate-spin w-4 h-4" />
// //                 Connecting...
// //               </span>
// //             ) : (
// //               "Login to Mail"
// //             )}
// //           </Button>
// //         </>
// //       )}

// //       {connected && (
// //         <>
// //           <div style={{ display: "flex", gap: "8px", marginTop: 10 }}>
// //             <Button
// //               onClick={handleExtract}
// //               className="mailmind-extract-btn"
// //               disabled={loadingExtract}
// //             >
// //               {loadingExtract ? (
// //                 <span className="flex items-center gap-2">
// //                   <Loader2 className="animate-spin w-4 h-4" />
// //                   Extracting...
// //                 </span>
// //               ) : (
// //                 "📄 Extract Resumes"
// //               )}
// //             </Button>

// //             <Button
// //               onClick={handleUploadToDatabase}
// //               className="mailmind-upload-btn"
// //               disabled={loadingUpload || extractedFiles.length === 0}
// //               style={{ marginLeft: 6 }}
// //             >
// //               {loadingUpload ? (
// //                 <span className="flex items-center gap-2">
// //                   <Loader2 className="animate-spin w-4 h-4" />
// //                   Uploading...
// //                 </span>
// //               ) : (
// //                 "📤 Upload to Database"
// //               )}
// //             </Button>
// //           </div>

// //           {/* extracted files list */}
// //           {resumes.length > 0 && (
// //             <div className="mailmind-resume-list" style={{ marginTop: 16 }}>
// //               <h4 className="resume-heading">Extracted Resumes:</h4>

// //               <div className="resume-container">
// //                 {resumes.map((url) => {
// //                   const filename = url.split("/").pop();
// //                   const isPdf = filename.toLowerCase().endsWith(".pdf");
// //                   const fileUrl = `${API_BASE}${url}`;

// //                   return (
// //                     <div className="resume-item" key={url}>
// //                       {isPdf ? (
// //                         <span
// //                           className="resume-link"
// //                           style={{ cursor: "pointer" }}
// //                           onClick={() => setPreviewFile(fileUrl)}
// //                         >
// //                           {filename}
// //                         </span>
// //                       ) : (
// //                         <span className="resume-filename">{filename}</span>
// //                       )}

// //                       <a href={fileUrl} download className="resume-download">
// //                         Download
// //                       </a>
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           )}

// //           {/* pdf preview */}
// //           {previewFile && (
// //             <div className="mailmind-preview" style={{ marginTop: 14 }}>
// //               <h5 className="preview-title">Preview PDF:</h5>
// //               <iframe
// //                 src={previewFile}
// //                 width="100%"
// //                 height="500px"
// //                 title="PDF Preview"
// //                 className="preview-frame"
// //               />
// //               <div style={{ marginTop: 8 }}>
// //                 <Button onClick={() => setPreviewFile(null)} className="close-preview-btn">
// //                   Close Preview
// //                 </Button>
// //               </div>
// //             </div>
// //           )}
// //         </>
// //       )}
// //     </div>
// //   );
// // };

// // export default MailMindButton;
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Loader2 } from "lucide-react";
// import { API_BASE } from "@/utils/constants";
// import { useUploadProgress } from "@/hooks/useUploadProgress";
// import "./MailMindButton.css";
// import { useState, useRef } from "react";

// const overwritePromptedRef = useRef(false);

// export default function MailMindButton() {
//   /* =======================
//      AUTH / STATE
//   ======================= */
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [platform, setPlatform] = useState("outlook");
//   const [connected, setConnected] = useState(false);

//   const [resumes, setResumes] = useState([]);       // URLs
//   const [extractedFiles, setExtractedFiles] = useState([]); // filenames
//   const [previewFile, setPreviewFile] = useState(null);

//   const [loadingLogin, setLoadingLogin] = useState(false);
//   const [loadingExtract, setLoadingExtract] = useState(false);
//   const [loadingUpload, setLoadingUpload] = useState(false);

//   const [pendingFiles, setPendingFiles] = useState([]);

//   /* =======================
//      SHARED PROGRESS (SAME AS UPLOAD UI)
//   ======================= */
//   const {
//     progressData,
//     isProcessing,
//     isCompleted,
//     resetProgress,
//   } = useUploadProgress();

//   /* =======================
//      LOGIN
//   ======================= */
//   const handleConnect = async () => {
//     setLoadingLogin(true);
//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, platform }),
//       });

//       if (!res.ok) throw new Error(await res.text());

//       setConnected(true);
//       alert(`✅ Connected as ${email}`);
//     } catch (err) {
//       alert("❌ Login failed. Use App Password if required.");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   /* =======================
//      EXTRACT RESUMES
//   ======================= */
//   const handleExtract = async () => {
//     setLoadingExtract(true);
//     try {
//       const res = await fetch(
//         `${API_BASE}/mcp/tools/mailmind/fetch-resumes`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password, platform }),
//         }
//       );

//       if (!res.ok) throw new Error(await res.text());

//       const data = await res.json();

//       setResumes(data.result || []);
//       setExtractedFiles(data.files || []);
//       setPendingFiles(data.files || []);


//       if (!data.files?.length) {
//         alert("ℹ️ No new resumes found.");
//       } else {
//         alert(`✅ Extracted ${data.files.length} resumes`);
//       }
//     } catch (err) {
//       alert("❌ Failed to extract resumes");
//     } finally {
//       setLoadingExtract(false);
//     }
//   };

//   /* =======================
//      UPLOAD TO DATABASE
//   ======================= */
//   const uploadToDatabase = async (overwrite = false) => {
//     resetProgress();
//     setLoadingUpload(true);

//     try {
//       const params = new URLSearchParams();
//       if (overwrite) params.append("overwrite", "true");

//       const res = await fetch(
//         `${API_BASE}/mcp/tools/mailmind/upload-extracted?${params}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(pendingFiles),
//         }
//       );

//       const data = await res.json();

//       // 🚫 nothing to upload
//       if (data.status === "skipped_all") {
//         alert("All resumes already exist.");
//         return;
//       }

//       // ⚠️ duplicates found (FIRST TIME ONLY)
//       if (data.skipped?.length && !overwrite) {
//         const skippedNames = data.skipped.map(d => d.filename);
//         const ok = confirm(
//           `⚠️ These candidates already exist:\n\n${skippedNames.join(
//             "\n"
//           )}\n\nOverwrite them?`
//         );

//         if (ok) {
//           // overwrite everything
//           uploadToDatabase(true);
//         } else {
//           // 🔥 REMOVE duplicates and retry ONCE
//           const remaining = pendingFiles.filter(
//             f => !skippedNames.includes(f)
//           );

//           setPendingFiles(remaining);

//           if (remaining.length === 0) {
//             alert("Nothing new to upload.");
//             return;
//           }

//           // retry upload WITHOUT overwrite
//           uploadToDatabase(false);
//         }
//         return;
//       }

//       // ✅ processing started
//       if (data.status === "processing") {
//         console.log("Upload started");
//       }

//     } catch (err) {
//       alert("Upload failed");
//     } finally {
//       setLoadingUpload(false);
//     }
//   };


//   /* =======================
//      RENDER
//   ======================= */
//   return (
//     <div className="mailmind-container">

//       <h3 className="mailmind-title">📬 MailMind</h3>

//       {!connected && (
//         <>
//           <div className="mailmind-form">
//             <Input
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />

//             <Input
//               type="password"
//               placeholder="Password / App Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />

//             <Select onValueChange={setPlatform} defaultValue={platform}>
//               <SelectTrigger>
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="outlook">Outlook</SelectItem>
//                 <SelectItem value="gmail">Gmail</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           <Button onClick={handleConnect} disabled={loadingLogin}>
//             {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
//           </Button>
//         </>
//       )}

//       {connected && (
//         <>
//           <div className="mailmind-actions">
//             <Button onClick={handleExtract} disabled={loadingExtract}>
//               {loadingExtract ? <Loader2 className="animate-spin" /> : "📄 Extract Resumes"}
//             </Button>

//             <Button
//               onClick={() => uploadToDatabase(false)}
//               disabled={loadingUpload || !extractedFiles.length}
//             >
//               {loadingUpload ? <Loader2 className="animate-spin" /> : "📤 Upload to Database"}
//             </Button>
//           </div>

//           {/* PROGRESS BAR (SAME AS UPLOAD UI) */}
//           {isProcessing && (
//             <div className="upload-progress">
//               <p>
//                 Processing {progressData.processed}/{progressData.total}
//               </p>
//               <div className="progress-bar">
//                 <div
//                   className="progress-bar-fill"
//                   style={{
//                     width: `${progressData.total
//                       ? Math.round(
//                         (progressData.processed / progressData.total) * 100
//                       )
//                       : 0
//                       }%`,
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {isCompleted && (
//             <p className="progress-status success">✅ Upload Complete</p>
//           )}

//           {/* EXTRACTED FILE LIST */}
//           {resumes.length > 0 && (
//             <div className="mailmind-resume-list">
//               <h4>Extracted Resumes</h4>

//               {resumes.map((url) => {
//                 const filename = url.split("/").pop();
//                 const fullUrl = `${API_BASE}${url}`;

//                 return (
//                   <div key={url} className="resume-item">
//                     <span onClick={() => setPreviewFile(fullUrl)}>
//                       {filename}
//                     </span>
//                     <a href={fullUrl} download>
//                       Download
//                     </a>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* PDF PREVIEW */}
//           {previewFile && (
//             <div className="mailmind-preview">
//               <iframe src={previewFile} width="100%" height="500px" />
//               <Button onClick={() => setPreviewFile(null)}>Close</Button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }
import { useState, useRef } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import "./MailMindButton.css";

export default function MailMindButton() {
  /* =======================
     AUTH / STATE
  ======================= */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("outlook");
  const [connected, setConnected] = useState(false);

  const [resumes, setResumes] = useState([]);          // URLs
  const [extractedFiles, setExtractedFiles] = useState([]); // all filenames
  const [pendingFiles, setPendingFiles] = useState([]);     // files to upload
  const [previewFile, setPreviewFile] = useState(null);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const uploadStartedRef = React.useRef(false);

  /* =======================
     DUPLICATE PROMPT LATCH
     (prevents infinite confirm loop)
  ======================= */
  const overwritePromptedRef = useRef(false);

  /* =======================
     SHARED PROGRESS
  ======================= */
  const {
    progressData,
    isProcessing,
    isCompleted,
    resetProgress,
  } = useUploadProgress();

  /* =======================
     LOGIN
  ======================= */
  const handleConnect = async () => {
    setLoadingLogin(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });

      if (!res.ok) throw new Error(await res.text());

      setConnected(true);
      alert(`✅ Connected as ${email}`);
    } catch {
      alert("❌ Login failed. Use App Password if required.");
    } finally {
      setLoadingLogin(false);
    }
  };

  /* =======================
     EXTRACT RESUMES
  ======================= */
  const handleExtract = async () => {
    setLoadingExtract(true);
    overwritePromptedRef.current = false; // reset latch

    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/mailmind/fetch-resumes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, platform }),
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      setResumes(data.result || []);
      setExtractedFiles(data.files || []);
      uploadStartedRef.current = false; // 🔥 important
      setPendingFiles(data.files || []);

      if (!data.files?.length) {
        alert("ℹ️ No new resumes found.");
      } else {
        alert(`✅ Extracted ${data.files.length} resumes`);
      }
    } catch {
      alert("❌ Failed to extract resumes");
    } finally {
      setLoadingExtract(false);
    }
  };

  /* =======================
     UPLOAD TO DATABASE
     (NO recursion bug, NO infinite prompt)
  ======================= */
  const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
    uploadStartedRef.current = true;
    resetProgress();
    setLoadingUpload(true);

    const filesToSend = filesOverride ?? pendingFiles;

    try {
      const params = new URLSearchParams();
      if (overwrite) params.append("overwrite", "true");

      const res = await fetch(
        `${API_BASE}/mcp/tools/mailmind/upload-extracted?${params}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filesToSend),
        }
      );

      const data = await res.json();

      /* 🚫 nothing new */
      if (data.status === "skipped_all") {
        alert("All resumes already exist.");
        return;
      }

      /* ⚠️ DUPLICATES — ASK ONLY ONCE */
      if (
        data.skipped?.length &&
        !overwrite &&
        !overwritePromptedRef.current
      ) {
        overwritePromptedRef.current = true;

        const skippedNames = data.skipped.map(d => d.filename);
        const ok = confirm(
          `⚠️ These candidates already exist:\n\n${skippedNames.join(
            "\n"
          )}\n\nOverwrite them?`
        );

        if (ok) {
          // overwrite everything
          uploadToDatabase(true, filesToSend);
        } else {
          // upload remaining only
          const remaining = filesToSend.filter(
            f => !skippedNames.includes(f)
          );

          setPendingFiles(remaining);

          if (!remaining.length) {
            alert("Nothing new to upload.");
            return;
          }

          uploadToDatabase(false, remaining);
        }
        return;
      }

      /* ✅ processing started */
      if (data.status === "processing") {
        console.log("Upload started");
      }

    } catch {
      alert("❌ Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="mailmind-container">

      <h3 className="mailmind-title">📬 MailMind</h3>

      {!connected && (
        <>
          <div className="mailmind-form">
            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password / App Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Select onValueChange={setPlatform} defaultValue={platform}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="gmail">Gmail</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleConnect} disabled={loadingLogin}>
            {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </>
      )}

      {connected && (
        <>
          <div className="mailmind-actions">
            <Button onClick={handleExtract} disabled={loadingExtract}>
              {loadingExtract ? <Loader2 className="animate-spin" /> : "📄 Extract Resumes"}
            </Button>

            <Button
              onClick={() => uploadToDatabase(false)}
              disabled={loadingUpload || !pendingFiles.length}
            >
              {loadingUpload ? <Loader2 className="animate-spin" /> : "📤 Upload to Database"}
            </Button>
          </div>

          {/* PROGRESS */}
          {isProcessing && (
            <div className="upload-progress">
              <p>
                Processing {progressData.processed}/{progressData.total}
              </p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${progressData.total
                      ? Math.round(
                        (progressData.processed / progressData.total) * 100
                      )
                      : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {isCompleted && (
            <p className="progress-status success">✅ Upload Complete</p>
          )}

          {/* EXTRACTED FILES */}
          {resumes.length > 0 && (
            <div className="mailmind-resume-list">
              <h4>Extracted Resumes</h4>

              {resumes.map((url) => {
                const filename = url.split("/").pop();
                const fullUrl = `${API_BASE}${url}`;

                return (
                  <div key={url} className="resume-item">
                    <span onClick={() => setPreviewFile(fullUrl)}>
                      {filename}
                    </span>
                    <a href={fullUrl} download>Download</a>
                  </div>
                );
              })}
            </div>
          )}

          {/* PREVIEW */}
          {previewFile && (
            <div className="mailmind-preview">
              <iframe src={previewFile} width="100%" height="500px" />
              <Button onClick={() => setPreviewFile(null)}>Close</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
