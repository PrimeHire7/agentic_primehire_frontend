
// // // // import { useState, useRef } from "react";
// // // // import React from "react";
// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import {
// // // //   Select,
// // // //   SelectContent,
// // // //   SelectItem,
// // // //   SelectTrigger,
// // // //   SelectValue,
// // // // } from "@/components/ui/select";
// // // // import { Loader2 } from "lucide-react";
// // // // import { API_BASE } from "@/utils/constants";
// // // // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // // // import "./MailMindButton.css";
// // // // import { HiOutlineMail } from "react-icons/hi";
// // // // import { RiLockPasswordFill } from "react-icons/ri";
// // // // import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";


// // // // export default function MailMindButton() {
// // // //   /* =======================
// // // //      AUTH / STATE
// // // //   ======================= */
// // // //   const [email, setEmail] = useState("");
// // // //   const [password, setPassword] = useState("");
// // // //   const [platform, setPlatform] = useState("outlook");
// // // //   const [connected, setConnected] = useState(false);

// // // //   const [resumes, setResumes] = useState([]);          // URLs
// // // //   const [extractedFiles, setExtractedFiles] = useState([]); // all filenames
// // // //   const [pendingFiles, setPendingFiles] = useState([]);     // files to upload
// // // //   const [previewFile, setPreviewFile] = useState(null);

// // // //   const [loadingLogin, setLoadingLogin] = useState(false);
// // // //   const [loadingExtract, setLoadingExtract] = useState(false);
// // // //   const [loadingUpload, setLoadingUpload] = useState(false);
// // // //   const uploadStartedRef = React.useRef(false);
// // // //   const [skippedFiles, setSkippedFiles] = useState([]);

// // // //   /* =======================
// // // //      DUPLICATE PROMPT LATCH
// // // //      (prevents infinite confirm loop)
// // // //   ======================= */
// // // //   const overwritePromptedRef = useRef(false);

// // // //   /* =======================
// // // //      SHARED PROGRESS
// // // //   ======================= */
// // // //   const {
// // // //     progressData,
// // // //     isProcessing,
// // // //     isCompleted,
// // // //     resetProgress,
// // // //   } = useUploadProgress();

// // // //   /* =======================
// // // //      LOGIN
// // // //   ======================= */
// // // //   const handleConnect = async () => {
// // // //     setLoadingLogin(true);
// // // //     try {
// // // //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
// // // //         method: "POST",
// // // //         headers: { "Content-Type": "application/json" },
// // // //         body: JSON.stringify({ email, password, platform }),
// // // //       });

// // // //       if (!res.ok) throw new Error(await res.text());

// // // //       setConnected(true);
// // // //       alert(`✅ Connected as ${email}`);
// // // //     } catch {
// // // //       alert("❌ Login failed. Use App Password if required.");
// // // //     } finally {
// // // //       setLoadingLogin(false);
// // // //     }
// // // //   };

// // // //   /* =======================
// // // //      EXTRACT RESUMES
// // // //   ======================= */
// // // //   const handleExtract = async () => {
// // // //     setLoadingExtract(true);
// // // //     overwritePromptedRef.current = false; // reset latch
// // // //     setSkippedFiles([]);

// // // //     try {
// // // //       const res = await fetch(
// // // //         `${API_BASE}/mcp/tools/mailmind/fetch-resumes`,
// // // //         {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify({ email, password, platform }),
// // // //         }
// // // //       );

// // // //       if (!res.ok) throw new Error(await res.text());

// // // //       const data = await res.json();

// // // //       setResumes(data.result || []);
// // // //       setExtractedFiles(data.files || []);
// // // //       uploadStartedRef.current = false; // 🔥 important
// // // //       setPendingFiles(data.files || []);

// // // //       if (!data.files?.length) {
// // // //         alert("ℹ️ No new resumes found.");
// // // //       } else {
// // // //         alert(`✅ Extracted ${data.files.length} resumes`);
// // // //       }
// // // //     } catch {
// // // //       alert("❌ Failed to extract resumes");
// // // //     } finally {
// // // //       setLoadingExtract(false);
// // // //     }
// // // //   };

// // // //   /* =======================
// // // //      UPLOAD TO DATABASE
// // // //      (NO recursion bug, NO infinite prompt)
// // // //   ======================= */
// // // //   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
// // // //     uploadStartedRef.current = true;
// // // //     resetProgress();
// // // //     setLoadingUpload(true);

// // // //     const filesToSend = filesOverride ?? pendingFiles;

// // // //     try {
// // // //       const params = new URLSearchParams();
// // // //       if (overwrite) params.append("overwrite", "true");

// // // //       const res = await fetch(
// // // //         `${API_BASE}/mcp/tools/mailmind/upload-extracted?${params}`,
// // // //         {
// // // //           method: "POST",
// // // //           headers: { "Content-Type": "application/json" },
// // // //           body: JSON.stringify(filesToSend),
// // // //         }
// // // //       );

// // // //       const data = await res.json();
// // // //       if (Array.isArray(data.skipped)) {
// // // //         setSkippedFiles(data.skipped);
// // // //       }

// // // //       /* 🚫 nothing new */
// // // //       if (data.status === "skipped_all") {
// // // //         alert("All resumes already exist.");
// // // //         return;
// // // //       }

// // // //       /* ⚠️ DUPLICATES — ASK ONLY ONCE */
// // // //       if (
// // // //         data.skipped?.length &&
// // // //         !overwrite &&
// // // //         !overwritePromptedRef.current
// // // //       ) {
// // // //         overwritePromptedRef.current = true;

// // // //         const skippedNames = data.skipped.map(d => d.filename);
// // // //         const ok = confirm(
// // // //           `⚠️ These candidates already exist:\n\n${skippedNames.join(
// // // //             "\n"
// // // //           )}\n\nOverwrite them?`
// // // //         );

// // // //         if (ok) {
// // // //           // overwrite everything
// // // //           uploadToDatabase(true, filesToSend);
// // // //         } else {
// // // //           const remaining = filesToSend.filter(
// // // //             f => !skippedNames.includes(f)
// // // //           );

// // // //           if (!remaining.length) {
// // // //             alert("Nothing new to upload.");
// // // //             return;
// // // //           }

// // // //           // reset latch so this call is treated as a fresh upload
// // // //           overwritePromptedRef.current = false;

// // // //           // update state (for UI)
// // // //           setPendingFiles(remaining);

// // // //           // actually upload remaining files
// // // //           uploadToDatabase(false, remaining);
// // // //         }

// // // //         return;
// // // //       }

// // // //       /* ✅ processing started */
// // // //       if (data.status === "processing") {
// // // //         console.log("Upload started");
// // // //       }

// // // //     } catch {
// // // //       alert("❌ Upload failed");
// // // //     } finally {
// // // //       setLoadingUpload(false);
// // // //     }
// // // //   };

// // // //   /* =======================
// // // //      RENDER
// // // //   ======================= */
// // // //   return (
// // // //     <div className="mailmind-container">

// // // //       <h3 className="mailmind-title gradient-txt">MailMind</h3>

// // // //       {!connected && (
// // // //         <>

// // // //           <div className="mailmind-form">
// // // //             <div className="columns-3 mt-5">
// // // //               <div className="col-md-4">
// // // //                 <div className="form-field">
// // // //                   <Input
// // // //                     placeholder="Email"
// // // //                     value={email}
// // // //                     onChange={(e) => setEmail(e.target.value)}
// // // //                   /><HiOutlineMail className="icon-xt" />
// // // //                 </div>

// // // //               </div>
// // // //               <div className="col-md-4">
// // // //                 <div className="form-field">
// // // //                   <Input
// // // //                     type="password"
// // // //                     placeholder="Password / App Password"
// // // //                     value={password}
// // // //                     onChange={(e) => setPassword(e.target.value)}
// // // //                   />
// // // //                   <RiLockPasswordFill className="icon-xt" />
// // // //                 </div>
// // // //               </div>
// // // //               <div className="col-md-4">
// // // //                 <div className="form-field">
// // // //                   <Select onValueChange={setPlatform} defaultValue={platform}>
// // // //                     <SelectTrigger>
// // // //                       <SelectValue />
// // // //                     </SelectTrigger>
// // // //                     <SelectContent>
// // // //                       <SelectItem value="outlook">Outlook</SelectItem>
// // // //                       <SelectItem value="gmail">Gmail</SelectItem>
// // // //                     </SelectContent>
// // // //                   </Select>
// // // //                   <PiMicrosoftOutlookLogoFill className="icon-xt" />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //           <div className="col-md-12 mt-3">
// // // //             <Button className="btn" onClick={handleConnect} disabled={loadingLogin}>
// // // //               {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
// // // //             </Button>
// // // //           </div>
// // // //         </>
// // // //       )}

// // // //       {connected && (
// // // //         <>
// // // //           <div className="mailmind-actions">
// // // //             <Button onClick={handleExtract} disabled={loadingExtract}>
// // // //               {loadingExtract ? <Loader2 className="animate-spin" /> : "📄 Extract Resumes"}
// // // //             </Button>

// // // //             <Button
// // // //               onClick={() => uploadToDatabase(false)}
// // // //               disabled={loadingUpload || !pendingFiles.length}
// // // //             >
// // // //               {loadingUpload ? <Loader2 className="animate-spin" /> : "📤 Upload to Database"}
// // // //             </Button>
// // // //           </div>

// // // //           {/* PROGRESS */}
// // // //           {isProcessing && (
// // // //             <div className="upload-progress">
// // // //               <p>
// // // //                 Processing {progressData.processed}/{progressData.total}
// // // //               </p>
// // // //               <div className="progress-bar">
// // // //                 <div
// // // //                   className="progress-bar-fill"
// // // //                   style={{
// // // //                     width: `${progressData.total
// // // //                       ? Math.round(
// // // //                         (progressData.processed / progressData.total) * 100
// // // //                       )
// // // //                       : 0}%`,
// // // //                   }}
// // // //                 />
// // // //               </div>
// // // //             </div>
// // // //           )}

// // // //           {isCompleted && (
// // // //             <p className="progress-status success">✅ Upload Complete</p>
// // // //           )}

// // // //           {/* EXTRACTED FILES */}
// // // //           {resumes.length > 0 && (
// // // //             <div className="mailmind-resume-list">
// // // //               <h4>Extracted Resumes</h4>

// // // //               {resumes.map((url) => {
// // // //                 const filename = url.split("/").pop();
// // // //                 const fullUrl = `${API_BASE}${url}`;

// // // //                 return (
// // // //                   <div key={url} className="resume-item">
// // // //                     <span onClick={() => setPreviewFile(fullUrl)}>
// // // //                       {filename}
// // // //                     </span>
// // // //                     <a href={fullUrl} download>Download</a>
// // // //                   </div>
// // // //                 );
// // // //               })}
// // // //             </div>
// // // //           )}
// // // //           {skippedFiles.length > 0 && (
// // // //             <div className="skipped-warning">
// // // //               <h4>⚠️ Skipped Resumes</h4>
// // // //               <p>These files were not added because required information was missing:</p>
// // // //               <ul>
// // // //                 {skippedFiles.map((s, idx) => (
// // // //                   <li key={idx}>
// // // //                     <b>{s.filename}</b>
// // // //                     {s.reason && <span> — {s.reason.replace("_", " ")}</span>}
// // // //                     {s.email === null && <span> — email missing</span>}
// // // //                   </li>
// // // //                 ))}
// // // //               </ul>
// // // //             </div>
// // // //           )}

// // // //           {/* PREVIEW */}
// // // //           {previewFile && (
// // // //             <div className="mailmind-preview">
// // // //               <iframe src={previewFile} width="100%" height="500px" />
// // // //               <Button onClick={() => setPreviewFile(null)}>Close</Button>
// // // //             </div>
// // // //           )}
// // // //         </>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }
// // // import { useState, useRef } from "react";
// // // import React from "react";
// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import {
// // //   Select,
// // //   SelectContent,
// // //   SelectItem,
// // //   SelectTrigger,
// // //   SelectValue,
// // // } from "@/components/ui/select";
// // // import { Loader2 } from "lucide-react";
// // // import { API_BASE } from "@/utils/constants";
// // // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // // import "./MailMindButton.css";
// // // import { HiOutlineMail } from "react-icons/hi";
// // // import { RiLockPasswordFill } from "react-icons/ri";
// // // import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";

// // // export default function MailMindButton() {
// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [platform, setPlatform] = useState("outlook");
// // //   const [connected, setConnected] = useState(false);

// // //   const [resumes, setResumes] = useState([]);
// // //   const [pendingFiles, setPendingFiles] = useState([]);
// // //   const [previewFile, setPreviewFile] = useState(null);
// // //   const [skippedFiles, setSkippedFiles] = useState([]);

// // //   const [loadingLogin, setLoadingLogin] = useState(false);
// // //   const [loadingExtract, setLoadingExtract] = useState(false);
// // //   const [loadingUpload, setLoadingUpload] = useState(false);

// // //   const overwritePromptedRef = useRef(false);

// // //   const {
// // //     progressData,
// // //     isProcessing,
// // //     isCompleted,
// // //     resetProgress,
// // //   } = useUploadProgress();

// // //   const handleConnect = async () => {
// // //     setLoadingLogin(true);
// // //     try {
// // //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email, password, platform }),
// // //       });
// // //       if (!res.ok) throw new Error(await res.text());
// // //       setConnected(true);
// // //       alert(`✅ Connected as ${email}`);
// // //     } catch {
// // //       alert("❌ Login failed.");
// // //     } finally {
// // //       setLoadingLogin(false);
// // //     }
// // //   };

// // //   const handleExtract = async () => {
// // //     setLoadingExtract(true);
// // //     overwritePromptedRef.current = false;
// // //     setSkippedFiles([]);

// // //     try {
// // //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({ email, password, platform }),
// // //       });

// // //       const data = await res.json();
// // //       setResumes(data.result || []);
// // //       setPendingFiles(data.files || []);

// // //       if (!data.files?.length) alert("ℹ️ No new resumes found.");
// // //       else alert(`✅ Extracted ${data.files.length} resumes`);
// // //     } catch {
// // //       alert("❌ Failed to extract resumes");
// // //     } finally {
// // //       setLoadingExtract(false);
// // //     }
// // //   };

// // //   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
// // //     resetProgress();
// // //     setLoadingUpload(true);

// // //     const filesToSend = filesOverride ?? pendingFiles;

// // //     try {
// // //       const params = new URLSearchParams();
// // //       if (overwrite) params.append("overwrite", "true");

// // //       const res = await fetch(
// // //         `${API_BASE}/mcp/tools/mailmind/upload-extracted?${params}`,
// // //         {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify(filesToSend),
// // //         }
// // //       );

// // //       const data = await res.json();
// // //       if (Array.isArray(data.skipped)) setSkippedFiles(data.skipped);

// // //       if (data.status === "skipped_all") {
// // //         alert("All resumes already exist.");
// // //         return;
// // //       }

// // //       if (data.skipped?.length && !overwrite && !overwritePromptedRef.current) {
// // //         overwritePromptedRef.current = true;
// // //         const skippedNames = data.skipped.map(d => d.filename);
// // //         const ok = confirm(
// // //           `⚠️ These candidates already exist:\n\n${skippedNames.join("\n")}\n\nOverwrite them?`
// // //         );

// // //         if (ok) uploadToDatabase(true, filesToSend);
// // //         else {
// // //           const remaining = filesToSend.filter(f => !skippedNames.includes(f));
// // //           if (!remaining.length) return alert("Nothing new to upload.");
// // //           overwritePromptedRef.current = false;
// // //           setPendingFiles(remaining);
// // //           uploadToDatabase(false, remaining);
// // //         }
// // //       }

// // //     } catch {
// // //       alert("❌ Upload failed");
// // //     } finally {
// // //       setLoadingUpload(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="mailmind-container">
// // //       <h3 className="mailmind-title gradient-txt">MailMind</h3>

// // //       {!connected && (
// // //         <>
// // //           <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
// // //           <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
// // //           <Select onValueChange={setPlatform} defaultValue={platform}>
// // //             <SelectTrigger><SelectValue /></SelectTrigger>
// // //             <SelectContent>
// // //               <SelectItem value="outlook">Outlook</SelectItem>
// // //               <SelectItem value="gmail">Gmail</SelectItem>
// // //             </SelectContent>
// // //           </Select>
// // //           <Button onClick={handleConnect}>{loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}</Button>
// // //         </>
// // //       )}

// // //       {connected && (
// // //         <>
// // //           <Button onClick={handleExtract}>{loadingExtract ? <Loader2 className="animate-spin" /> : "📄 Extract Resumes"}</Button>
// // //           <Button onClick={() => uploadToDatabase(false)} disabled={!pendingFiles.length}>
// // //             {loadingUpload ? <Loader2 className="animate-spin" /> : "📤 Upload to Database"}
// // //           </Button>

// // //           {isProcessing && (
// // //             <div className="upload-progress">
// // //               Processing {progressData.processed}/{progressData.total}
// // //               <div className="progress-bar">
// // //                 <div className="progress-bar-fill" style={{ width: `${(progressData.processed / progressData.total) * 100}%` }} />
// // //               </div>
// // //             </div>
// // //           )}

// // //           {isCompleted && <p>✅ Upload Complete</p>}

// // //           {skippedFiles.length > 0 && (
// // //             <div className="skipped-warning">
// // //               <h4>⚠️ Skipped</h4>
// // //               <ul>
// // //                 {skippedFiles.map((s, i) => (
// // //                   <li key={i}>{s.filename} — email missing</li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //           )}
// // //         </>
// // //       )}

// // //       {resumes.length > 0 && (
// // //         <div className="mailmind-resume-list">
// // //           <h4>Extracted Resumes</h4>

// // //           {resumes.map((url) => {
// // //             const filename = url.split("/").pop();
// // //             const fullUrl = `${API_BASE}${url}`;

// // //             return (
// // //               <div key={url} className="resume-item">
// // //                 <span className="resume-name">{filename}</span>

// // //                 <div className="resume-actions">
// // //                   <Button size="sm" variant="outline" onClick={() => setPreviewFile(fullUrl)}>
// // //                     Preview
// // //                   </Button>
// // //                   <a href={fullUrl} target="_blank" rel="noopener noreferrer">
// // //                     <Button size="sm" variant="secondary">Download</Button>
// // //                   </a>
// // //                 </div>
// // //               </div>
// // //             );
// // //           })}
// // //         </div>
// // //       )}

// // //     </div>
// // //   );
// // // }
// // import { useState, useRef } from "react";
// // import React from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import { Loader2 } from "lucide-react";
// // import { API_BASE } from "@/utils/constants";
// // import { useUploadProgress } from "@/hooks/useUploadProgress";
// // import "./MailMindButton.css";
// // import { HiOutlineMail } from "react-icons/hi";
// // import { RiLockPasswordFill } from "react-icons/ri";
// // import { PiMicrosoftOutlookLogoFill } from "react-icons/pi";

// // export default function MailMindButton() {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [platform, setPlatform] = useState("outlook");
// //   const [connected, setConnected] = useState(false);

// //   const [resumes, setResumes] = useState([]);
// //   const [pendingFiles, setPendingFiles] = useState([]);
// //   const [previewFile, setPreviewFile] = useState(null);
// //   const [skippedFiles, setSkippedFiles] = useState([]);

// //   const [loadingLogin, setLoadingLogin] = useState(false);
// //   const [loadingExtract, setLoadingExtract] = useState(false);
// //   const [loadingUpload, setLoadingUpload] = useState(false);

// //   const overwritePromptedRef = useRef(false);

// //   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");
// //   const isDoc = (url) =>
// //     url?.toLowerCase().endsWith(".doc") || url?.toLowerCase().endsWith(".docx");

// //   const {
// //     progressData,
// //     isProcessing,
// //     isCompleted,
// //     resetProgress,
// //   } = useUploadProgress();

// //   const handleConnect = async () => {
// //     setLoadingLogin(true);
// //     try {
// //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, platform }),
// //       });
// //       if (!res.ok) throw new Error(await res.text());
// //       setConnected(true);
// //       alert(`✅ Connected as ${email}`);
// //     } catch {
// //       alert("❌ Login failed.");
// //     } finally {
// //       setLoadingLogin(false);
// //     }
// //   };

// //   const handleExtract = async () => {
// //     setLoadingExtract(true);
// //     overwritePromptedRef.current = false;
// //     setSkippedFiles([]);

// //     try {
// //       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ email, password, platform }),
// //       });

// //       const data = await res.json();
// //       setResumes(data.result || []);
// //       setPendingFiles(data.files || []);

// //       if (!data.files?.length) alert("ℹ️ No new resumes found.");
// //       else alert(`✅ Extracted ${data.files.length} resumes`);
// //     } catch {
// //       alert("❌ Failed to extract resumes");
// //     } finally {
// //       setLoadingExtract(false);
// //     }
// //   };

// //   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
// //     resetProgress();
// //     setLoadingUpload(true);

// //     const filesToSend = filesOverride ?? pendingFiles;

// //     try {
// //       const params = new URLSearchParams();
// //       if (overwrite) params.append("overwrite", "true");

// //       const res = await fetch(
// //         `${API_BASE}/mcp/tools/mailmind/upload-extracted?${params}`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(filesToSend),
// //         }
// //       );

// //       const data = await res.json();
// //       if (Array.isArray(data.skipped)) setSkippedFiles(data.skipped);

// //       if (data.status === "skipped_all") {
// //         alert("All resumes already exist.");
// //         return;
// //       }

// //       if (data.skipped?.length && !overwrite && !overwritePromptedRef.current) {
// //         overwritePromptedRef.current = true;
// //         const skippedNames = data.skipped.map(d => d.filename);
// //         const ok = confirm(
// //           `⚠️ These candidates already exist:\n\n${skippedNames.join("\n")}\n\nOverwrite them?`
// //         );

// //         if (ok) uploadToDatabase(true, filesToSend);
// //         else {
// //           const remaining = filesToSend.filter(f => !skippedNames.includes(f));
// //           if (!remaining.length) return alert("Nothing new to upload.");
// //           overwritePromptedRef.current = false;
// //           setPendingFiles(remaining);
// //           uploadToDatabase(false, remaining);
// //         }
// //       }

// //     } catch {
// //       alert("❌ Upload failed");
// //     } finally {
// //       setLoadingUpload(false);
// //     }
// //   };

// //   return (
// //     <div className="mailmind-container">
// //       <h3 className="mailmind-title gradient-txt">MailMind</h3>

// //       {!connected && (
// //         <>
// //           <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
// //           <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
// //           <Select onValueChange={setPlatform} defaultValue={platform}>
// //             <SelectTrigger><SelectValue /></SelectTrigger>
// //             <SelectContent>
// //               <SelectItem value="outlook">Outlook</SelectItem>
// //               <SelectItem value="gmail">Gmail</SelectItem>
// //             </SelectContent>
// //           </Select>
// //           <Button onClick={handleConnect}>
// //             {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
// //           </Button>
// //         </>
// //       )}

// //       {connected && (
// //         <>
// //           <Button onClick={handleExtract}>
// //             {loadingExtract ? <Loader2 className="animate-spin" /> : "📄 Extract Resumes"}
// //           </Button>

// //           <Button onClick={() => uploadToDatabase(false)} disabled={!pendingFiles.length}>
// //             {loadingUpload ? <Loader2 className="animate-spin" /> : "📤 Upload to Database"}
// //           </Button>

// //           {isProcessing && (
// //             <div className="upload-progress">
// //               Processing {progressData.processed}/{progressData.total}
// //               <div className="progress-bar">
// //                 <div
// //                   className="progress-bar-fill"
// //                   style={{ width: `${(progressData.processed / progressData.total) * 100}%` }}
// //                 />
// //               </div>
// //             </div>
// //           )}

// //           {isCompleted && <p>✅ Upload Complete</p>}

// //           {skippedFiles.length > 0 && (
// //             <div className="skipped-warning">
// //               <h4>⚠️ Skipped</h4>
// //               <ul>
// //                 {skippedFiles.map((s, i) => (
// //                   <li key={i}>{s.filename} — email missing</li>
// //                 ))}
// //               </ul>
// //             </div>
// //           )}
// //         </>
// //       )}

// //       {resumes.length > 0 && (
// //         <div className="mailmind-resume-list">
// //           <h4>Extracted Resumes</h4>

// //           {resumes.map((url) => {
// //             const filename = url.split("/").pop();
// //             const fullUrl = `${API_BASE}${url}`;

// //             return (
// //               <div key={url} className="resume-item">
// //                 <span className="resume-name">{filename}</span>

// //                 <div className="resume-actions">
// //                   <Button size="sm" variant="outline" onClick={() => setPreviewFile(fullUrl)}>
// //                     Preview
// //                   </Button>
// //                   <a href={fullUrl} target="_blank" rel="noopener noreferrer">
// //                     <Button size="sm" variant="secondary">Download</Button>
// //                   </a>
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       )}

// //       {previewFile && (
// //         <div className="mailmind-preview">
// //           <div className="preview-header">
// //             <span>Resume Preview</span>
// //             <Button size="sm" variant="ghost" onClick={() => setPreviewFile(null)}>
// //               Close
// //             </Button>
// //           </div>

// //           {isPdf(previewFile) && (
// //             <iframe src={previewFile} width="100%" height="500px" />
// //           )}

// //           {isDoc(previewFile) && (
// //             <iframe
// //               src={`https://docs.google.com/gview?url=${encodeURIComponent(previewFile)}&embedded=true`}
// //               width="100%"
// //               height="500px"
// //             />
// //           )}

// //           {!isPdf(previewFile) && !isDoc(previewFile) && (
// //             <p>
// //               Preview not supported.{" "}
// //               <a href={previewFile} target="_blank" rel="noreferrer">
// //                 Download file
// //               </a>
// //             </p>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import { useState, useRef } from "react";
// import React from "react";
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

// export default function MailMindButton() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [platform, setPlatform] = useState("outlook");
//   const [connected, setConnected] = useState(false);

//   const [resumes, setResumes] = useState([]);
//   const [pendingFiles, setPendingFiles] = useState([]);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [skippedFiles, setSkippedFiles] = useState([]);
//   const [showSkippedModal, setShowSkippedModal] = useState(false);

//   const [loadingLogin, setLoadingLogin] = useState(false);
//   const [loadingExtract, setLoadingExtract] = useState(false);
//   const [loadingUpload, setLoadingUpload] = useState(false);

//   const overwritePromptedRef = useRef(false);

//   const { progressData, isProcessing, isCompleted, resetProgress } = useUploadProgress();

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");
//   const isDoc = (url) =>
//     url?.toLowerCase().endsWith(".doc") || url?.toLowerCase().endsWith(".docx");

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
//     } catch {
//       alert("Login failed");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   const handleExtract = async () => {
//     setLoadingExtract(true);
//     overwritePromptedRef.current = false;
//     setSkippedFiles([]);
//     setShowSkippedModal(false);

//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, platform }),
//       });

//       const data = await res.json();
//       setResumes(data.result || []);
//       setPendingFiles(data.files || []);
//     } catch {
//       alert("Failed to extract");
//     } finally {
//       setLoadingExtract(false);
//     }
//   };

//   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
//     resetProgress();
//     setLoadingUpload(true);

//     const filesToSend = filesOverride ?? pendingFiles;

//     try {
//       const params = new URLSearchParams();
//       if (overwrite) params.append("overwrite", "true");

//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/upload-extracted`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ files: pendingFiles })
//       });

//       const data = await res.json();

//       if (Array.isArray(data.skipped) && data.skipped.length > 0) {
//         setSkippedFiles(data.skipped);
//         setShowSkippedModal(true);
//       }

//       if (data.status === "skipped_all") return;

//       if (data.skipped?.length && !overwrite && !overwritePromptedRef.current) {
//         overwritePromptedRef.current = true;
//         const skippedNames = data.skipped.map(d => d.filename);

//         const ok = confirm(
//           `Duplicates found:\n\n${skippedNames.join("\n")}\n\nOverwrite them?`
//         );

//         if (ok) uploadToDatabase(true, filesToSend);
//         else {
//           const remaining = filesToSend.filter(f => !skippedNames.includes(f));
//           overwritePromptedRef.current = false;
//           setPendingFiles(remaining);
//           uploadToDatabase(false, remaining);
//         }
//       }
//     } catch {
//       alert("Upload failed");
//     } finally {
//       setLoadingUpload(false);
//     }
//   };

//   return (
//     <div className="mailmind-container">
//       <h3>MailMind</h3>

//       {!connected && (
//         <>
//           <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//           <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//           <Select onValueChange={setPlatform} defaultValue={platform}>
//             <SelectTrigger><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="outlook">Outlook</SelectItem>
//               <SelectItem value="gmail">Gmail</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={handleConnect}>
//             {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
//           </Button>
//         </>
//       )}

//       {connected && (
//         <>
//           <Button onClick={handleExtract}>
//             {loadingExtract ? <Loader2 className="animate-spin" /> : "Extract"}
//           </Button>

//           <Button onClick={() => uploadToDatabase(false)} disabled={!pendingFiles.length}>
//             {loadingUpload ? <Loader2 className="animate-spin" /> : "Upload"}
//           </Button>

//           {isProcessing && (
//             <div className="upload-progress">
//               Processing {progressData.processed}/{progressData.total}
//               <div className="progress-bar">
//                 <div
//                   className="progress-bar-fill"
//                   style={{ width: `${(progressData.processed / progressData.total) * 100}%` }}
//                 />
//               </div>
//             </div>
//           )}

//           {isCompleted && <p>Upload complete</p>}
//         </>
//       )}

//       {resumes.length > 0 && (
//         <div className="resume-list">
//           {resumes.map((url) => {
//             const fullUrl = `${API_BASE}${url}`;
//             return (
//               <div key={url} className="resume-item">
//                 <span>{url.split("/").pop()}</span>
//                 <Button size="sm" onClick={() => setPreviewFile(fullUrl)}>Preview</Button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {previewFile && (
//         <div className="preview-overlay" onClick={() => setPreviewFile(null)}>
//           <div
//             className="preview-modal"
//             onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
//           >
//             <div className="preview-header">
//               <span>Resume Preview</span>
//               <Button size="sm" variant="ghost" onClick={() => setPreviewFile(null)}>
//                 Close ✕
//               </Button>
//             </div>

//             {isPdf(previewFile) && (
//               <iframe src={previewFile} width="100%" height="500px" />
//             )}

//             {isDoc(previewFile) && (
//               <iframe
//                 src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                   previewFile
//                 )}&embedded=true`}
//                 width="100%"
//                 height="500px"
//               />
//             )}

//             {!isPdf(previewFile) && !isDoc(previewFile) && (
//               <p>
//                 Preview not supported.{" "}
//                 <a href={previewFile} target="_blank" rel="noreferrer">
//                   Download file
//                 </a>
//               </p>
//             )}
//           </div>
//         </div>
//       )}


//       {showSkippedModal && (
//         <div className="preview-overlay" onClick={() => setShowSkippedModal(false)}>
//           <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
//             <h4>Skipped Files</h4>
//             <ul>
//               {skippedFiles.map((s, i) => (
//                 <li key={i}>{s.filename} — {s.reason || "duplicate"}</li>
//               ))}
//             </ul>
//             <Button onClick={() => setShowSkippedModal(false)}>Close</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";
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

// export default function MailMindButton() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [platform, setPlatform] = useState("outlook");
//   const [connected, setConnected] = useState(false);

//   const [resumes, setResumes] = useState([]);
//   const [pendingFiles, setPendingFiles] = useState([]);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [skippedFiles, setSkippedFiles] = useState([]);
//   const [showSkippedModal, setShowSkippedModal] = useState(false);
//   const [jobId, setJobId] = useState(null);

//   const [loadingLogin, setLoadingLogin] = useState(false);
//   const [loadingExtract, setLoadingExtract] = useState(false);
//   const [loadingUpload, setLoadingUpload] = useState(false);

//   const overwritePromptedRef = useRef(false);

//   const {
//     progressData,
//     isProcessing,
//     isCompleted,
//     resetProgress,
//     startTracking,
//   } = useUploadProgress();

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");
//   const isDoc = (url) =>
//     url?.toLowerCase().endsWith(".doc") || url?.toLowerCase().endsWith(".docx");

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
//     } catch {
//       alert("Login failed");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   const handleExtract = async () => {
//     setLoadingExtract(true);
//     overwritePromptedRef.current = false;
//     setSkippedFiles([]);
//     setShowSkippedModal(false);

//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, platform }),
//       });
//       const data = await res.json();
//       setResumes(data.result || []);
//       setPendingFiles(data.files || []);
//     } catch {
//       alert("Failed to extract resumes");
//     } finally {
//       setLoadingExtract(false);
//     }
//   };

//   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
//     resetProgress();
//     setLoadingUpload(true);

//     const filesToSend = filesOverride ?? pendingFiles;
//     if (!filesToSend.length) return;

//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/upload-extracted`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ files: filesToSend, overwrite }),
//       });

//       const data = await res.json();

//       if (Array.isArray(data.skipped) && data.skipped.length > 0) {
//         setSkippedFiles(data.skipped);
//         setShowSkippedModal(true);
//       }

//       if (data.job_id) {
//         setJobId(data.job_id);
//         startTracking(data.job_id);
//       }
//     } catch {
//       alert("Upload failed");
//     } finally {
//       setLoadingUpload(false);
//     }
//   };

//   return (
//     <div className="mailmind-container">
//       <h3>MailMind</h3>

//       {!connected && (
//         <>
//           <Input
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Select onValueChange={setPlatform} defaultValue={platform}>
//             <SelectTrigger>
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="outlook">Outlook</SelectItem>
//               <SelectItem value="gmail">Gmail</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={handleConnect}>
//             {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
//           </Button>
//         </>
//       )}

//       {connected && (
//         <>
//           <Button onClick={handleExtract}>
//             {loadingExtract ? <Loader2 className="animate-spin" /> : "Extract"}
//           </Button>

//           <Button
//             onClick={() => uploadToDatabase(false)}
//             disabled={!pendingFiles.length || isProcessing}
//           >
//             {loadingUpload ? <Loader2 className="animate-spin" /> : "Upload"}
//           </Button>

//           {isProcessing && (
//             <div className="upload-progress">
//               Processing {progressData.processed}/{progressData.total}
//               <div className="progress-bar">
//                 <div
//                   className="progress-bar-fill"
//                   style={{
//                     width: progressData.total
//                       ? `${Math.round(
//                           (progressData.processed / progressData.total) * 100
//                         )}%`
//                       : "0%",
//                   }}
//                 />
//               </div>
//             </div>
//           )}

//           {isCompleted && <p className="success">Upload completed</p>}
//         </>
//       )}

//       {resumes.length > 0 && (
//         <div className="resume-list">
//           {resumes.map((url) => {
//             const fullUrl = `${API_BASE}${url}`;
//             return (
//               <div key={url} className="resume-item">
//                 <span>{url.split("/").pop()}</span>
//                 <Button size="sm" onClick={() => setPreviewFile(fullUrl)}>
//                   Preview
//                 </Button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {previewFile && (
//         <div className="preview-overlay" onClick={() => setPreviewFile(null)}>
//           <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="preview-header">
//               <span>Resume Preview</span>
//               <Button
//                 size="sm"
//                 variant="ghost"
//                 onClick={() => setPreviewFile(null)}
//               >
//                 Close ✕
//               </Button>
//             </div>

//             {isPdf(previewFile) && (
//               <iframe src={previewFile} width="100%" height="600px" />
//             )}
//             {isDoc(previewFile) && (
//               <iframe
//                 src={`https://docs.google.com/gview?url=${encodeURIComponent(
//                   previewFile
//                 )}&embedded=true`}
//                 width="100%"
//                 height="600px"
//               />
//             )}
//           </div>
//         </div>
//       )}

//       {showSkippedModal && (
//         <div
//           className="preview-overlay"
//           onClick={() => setShowSkippedModal(false)}
//         >
//           <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
//             <h4>Skipped Files</h4>
//             <ul>
//               {skippedFiles.map((s, i) => (
//                 <li key={i}>
//                   {s.filename} — {s.reason || "skipped"}
//                 </li>
//               ))}
//             </ul>
//             <Button onClick={() => setShowSkippedModal(false)}>Close</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useRef } from "react";
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

// export default function MailMindButton() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [platform, setPlatform] = useState("outlook");
//   const [connected, setConnected] = useState(false);

//   const [resumes, setResumes] = useState([]);
//   const [pendingFiles, setPendingFiles] = useState([]);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [skippedFiles, setSkippedFiles] = useState([]);
//   const [showSkippedModal, setShowSkippedModal] = useState(false);

//   const [loadingLogin, setLoadingLogin] = useState(false);
//   const [loadingExtract, setLoadingExtract] = useState(false);
//   const [loadingUpload, setLoadingUpload] = useState(false);

//   const overwritePromptedRef = useRef(false);

//   const {
//     progressData,
//     isProcessing,
//     isCompleted,
//     resetProgress,
//     startTracking,
//   } = useUploadProgress();

//   const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");
//   const isDoc = (url) =>
//     url?.toLowerCase().endsWith(".doc") || url?.toLowerCase().endsWith(".docx");

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
//     } catch {
//       alert("Login failed");
//     } finally {
//       setLoadingLogin(false);
//     }
//   };

//   const handleExtract = async () => {
//     setLoadingExtract(true);
//     overwritePromptedRef.current = false;
//     setSkippedFiles([]);
//     setShowSkippedModal(false);

//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password, platform }),
//       });

//       const data = await res.json();
//       setResumes(data.result || []);
//       setPendingFiles(data.files || []);
//     } catch {
//       alert("Failed to extract resumes");
//     } finally {
//       setLoadingExtract(false);
//     }
//   };

//   const uploadToDatabase = async (overwrite = false, filesOverride = null) => {
//     resetProgress();
//     setLoadingUpload(true);

//     const filesToSend = filesOverride ?? pendingFiles;

//     if (!filesToSend.length) {
//       alert("No files to upload");
//       setLoadingUpload(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/mailmind/upload-extracted`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           files: filesToSend,
//           overwrite
//         }),
//       });

//       const data = await res.json();

//       if (data.status === "duplicate" && !overwrite) {
//         const dupNames = data.duplicates.map(d => d.filename);
//         const ok = confirm(
//           `Duplicates found:\n\n${dupNames.join("\n")}\n\nOverwrite them?`
//         );

//         if (ok) {
//           uploadToDatabase(true, filesToSend);
//         } else {
//           const remaining = filesToSend.filter(f => !dupNames.includes(f));
//           uploadToDatabase(false, remaining);
//         }
//         return;
//       }

//       if (data.job_id) {
//         startTracking(data.job_id);
//       }

//     } catch (e) {
//       console.error(e);
//       alert("Upload failed");
//     } finally {
//       setLoadingUpload(false);
//     }
//   };


//   return (
//     <div className="mailmind-container">
//       <h3>MailMind</h3>

//       {!connected && (
//         <>
//           <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//           <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
//           <Select onValueChange={setPlatform} defaultValue={platform}>
//             <SelectTrigger><SelectValue /></SelectTrigger>
//             <SelectContent>
//               <SelectItem value="outlook">Outlook</SelectItem>
//               <SelectItem value="gmail">Gmail</SelectItem>
//             </SelectContent>
//           </Select>
//           <Button onClick={handleConnect}>
//             {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
//           </Button>
//         </>
//       )}

//       {connected && (
//         <>
//           <Button onClick={handleExtract}>
//             {loadingExtract ? <Loader2 className="animate-spin" /> : "Extract"}
//           </Button>

//           <Button onClick={() => uploadToDatabase(false)} disabled={!pendingFiles.length || isProcessing}>
//             {loadingUpload ? <Loader2 className="animate-spin" /> : "Upload"}
//           </Button>

//           {isProcessing && (
//             <div className="upload-progress">
//               Processing {progressData.processed}/{progressData.total}
//               <div className="progress-bar">
//                 <div
//                   className="progress-bar-fill"
//                   style={{
//                     width: `${progressData.total ? Math.round((progressData.processed / progressData.total) * 100) : 0}%`,
//                   }}
//                 />
//               </div>

//               <ul className="file-status">
//                 {progressData.completed?.map((f) => (
//                   <li key={f} className="done">✅ {f}</li>
//                 ))}
//                 {progressData.errors?.map((f) => (
//                   <li key={f} className="error">❌ {f}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {isCompleted && <p className="success">Upload completed</p>}
//         </>
//       )}

//       {resumes.length > 0 && (
//         <div className="resume-list">
//           {resumes.map((url) => {
//             const fullUrl = `${API_BASE}${url}`;
//             return (
//               <div key={url} className="resume-item">
//                 <span>{url.split("/").pop()}</span>
//                 <Button size="sm" onClick={() => setPreviewFile(fullUrl)}>Preview</Button>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {previewFile && (
//         <div className="preview-overlay" onClick={() => setPreviewFile(null)}>
//           <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
//             <div className="preview-header">
//               <span>Resume Preview</span>
//               <Button size="sm" variant="ghost" onClick={() => setPreviewFile(null)}>Close ✕</Button>
//             </div>

//             {isPdf(previewFile) && <iframe src={previewFile} width="100%" height="600px" />}
//             {isDoc(previewFile) && (
//               <iframe
//                 src={`https://docs.google.com/gview?url=${encodeURIComponent(previewFile)}&embedded=true`}
//                 width="100%"
//                 height="600px"
//               />
//             )}
//           </div>
//         </div>
//       )}

//       {showSkippedModal && (
//         <div className="preview-overlay" onClick={() => setShowSkippedModal(false)}>
//           <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
//             <h4>Skipped Files</h4>
//             <ul>
//               {skippedFiles.map((s, i) => (
//                 <li key={i}>{s.filename} — {s.reason || "duplicate"}</li>
//               ))}
//             </ul>
//             <Button onClick={() => setShowSkippedModal(false)}>Close</Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { API_BASE } from "@/utils/constants";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import "./MailMindButton.css";

export default function MailMindButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("outlook");
  const [connected, setConnected] = useState(false);

  const [resumes, setResumes] = useState([]);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  const [duplicates, setDuplicates] = useState([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const {
    progressData,
    isProcessing,
    isCompleted,
    resetProgress,
    startTracking,
  } = useUploadProgress();

  const isPdf = (url) => url?.toLowerCase().endsWith(".pdf");
  const isDoc = (url) => url?.toLowerCase().endsWith(".doc") || url?.toLowerCase().endsWith(".docx");

  const handleConnect = async () => {
    setLoadingLogin(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });
      if (!res.ok) throw new Error();
      setConnected(true);
    } finally {
      setLoadingLogin(false);
    }
  };

  const handleExtract = async () => {
    setLoadingExtract(true);
    setDuplicates([]);
    setShowDuplicateModal(false);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });
      const data = await res.json();
      setResumes(data.result || []);
      setPendingFiles(data.files || []);
    } finally {
      setLoadingExtract(false);
    }
  };

  const uploadToDatabase = async (files = pendingFiles) => {
    resetProgress();
    setLoadingUpload(true);
    setShowProgressModal(true);
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/upload-extracted`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files }),
      });

      const data = await res.json();

      if (data.duplicates?.length) {
        setDuplicates(data.duplicates);
        setShowDuplicateModal(true);
      }

      if (data.job_id) {
        startTracking(data.job_id); // 🔥 always start tracking if present
      }

    } finally {
      setLoadingUpload(false);
    }
  };


  const ignoreDuplicatesAndContinue = () => {
    const dupNames = duplicates.map(d => d.filename);
    const remaining = pendingFiles.filter(f => !dupNames.includes(f));

    setPendingFiles(remaining);
    setShowDuplicateModal(false);
    setDuplicates([]);

    if (remaining.length) uploadToDatabase(remaining); // 🔥 will now track properly
  };


  return (
    <div className="mailmind-container">
      <h3>MailMind</h3>

      {!connected && (
        <>
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <Select onValueChange={setPlatform} defaultValue={platform}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="outlook">Outlook</SelectItem>
              <SelectItem value="gmail">Gmail</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleConnect}>
            {loadingLogin ? <Loader2 className="animate-spin" /> : "Login"}
          </Button>
        </>
      )}

      {connected && (
        <>
          <Button onClick={handleExtract}>
            {loadingExtract ? <Loader2 className="animate-spin" /> : "Extract"}
          </Button>

          <Button onClick={() => uploadToDatabase()} disabled={!pendingFiles.length || isProcessing}>
            {loadingUpload ? <Loader2 className="animate-spin" /> : "Upload"}
          </Button>

          {resumes.length > 0 && (
            <div className="resume-list">
              <h4>Fetched Resumes ({resumes.length})</h4>
              {resumes.map((url) => {
                const fullUrl = `${API_BASE}${url}`;
                return (
                  <div key={url} className="resume-item">
                    <span>{url.split("/").pop()}</span>
                    <Button size="sm" onClick={() => setPreviewFile(fullUrl)}>Preview</Button>
                  </div>
                );
              })}
            </div>
          )}
          {previewFile && (
            <div className="preview-overlay" onClick={() => setPreviewFile(null)}>
              <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="preview-header">
                  <span>Resume Preview</span>
                  <Button size="sm" variant="ghost" onClick={() => setPreviewFile(null)}>
                    ✕
                  </Button>
                </div>

                {previewFile.toLowerCase().endsWith(".pdf") && (
                  <iframe
                    src={previewFile}
                    title="PDF Preview"
                    width="100%"
                    height="600px"
                    style={{ border: "none" }}
                  />
                )}

                {(previewFile.toLowerCase().endsWith(".doc") ||
                  previewFile.toLowerCase().endsWith(".docx")) && (
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(previewFile)}&embedded=true`}
                      title="DOC Preview"
                      width="100%"
                      height="600px"
                      style={{ border: "none" }}
                    />
                  )}
              </div>
            </div>
          )}


          {showProgressModal && (
            <div className="preview-overlay" onClick={() => setShowProgressModal(false)}>
              <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
                <div className="preview-header">
                  <span>Upload Progress</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowProgressModal(false)}
                  >
                    ✕
                  </Button>
                </div>

                <div className="upload-progress">
                  <div style={{ marginBottom: 8 }}>
                    Processing {progressData.processed}/{progressData.total}
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progressData.total
                          ? Math.round((progressData.processed / progressData.total) * 100)
                          : 0
                          }%`,
                      }}
                    />
                  </div>

                  <ul className="file-status">
                    {progressData.completed?.map(f => (
                      <li key={f} className="done">✅ {f}</li>
                    ))}
                    {progressData.errors?.map(f => (
                      <li key={f} className="error">❌ {f}</li>
                    ))}
                  </ul>

                  {isCompleted && (
                    <div className="success" style={{ marginTop: 10 }}>
                      Upload completed
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}



          {isCompleted && <p className="success">Upload completed</p>}
        </>
      )}

      {showDuplicateModal && (
        <div className="preview-overlay">
          <div className="preview-modal">

            <div className="preview-header">
              <span>Duplicate Resumes Found</span>
              <Button size="sm" variant="ghost" onClick={() => setShowDuplicateModal(false)}>✕</Button>
            </div>

            <div className="duplicate-body">
              <ul>
                {duplicates.map((d, i) => (
                  <li key={i}>{d.filename} — {d.email || d.reason}</li>
                ))}
              </ul>
            </div>

            <div className="duplicate-footer">
              <Button variant="secondary" onClick={() => setShowDuplicateModal(false)}>
                Cancel
              </Button>
              <Button onClick={ignoreDuplicatesAndContinue}>
                Ignore & Upload Remaining
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
