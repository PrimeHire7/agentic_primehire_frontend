// import React, { useRef, useState } from "react";
// import { useUploadProgress } from "@/hooks/useUploadProgress";
// import { uploadResumes } from "@/utils/uploadResumes";
// import OverwriteDialog from "@/components/OverwriteDialog";
// import "./UploadUI.css";

// export default function UploadUI() {
//     const [files, setFiles] = useState([]);
//     const [uploading, setUploading] = useState(false);
//     const [duplicateItems, setDuplicateItems] = useState([]);
//     const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
//     const [jobId, setJobId] = useState(null);

//     const inputRef = useRef(null);

//     const {
//         progressData,
//         isProcessing,
//         resetProgress,
//         startTracking
//     } = useUploadProgress();

//     const confirmOverwrite = () => {
//         setShowOverwriteDialog(false);
//         setDuplicateItems([]);
//         handleUpload(true);
//     };

//     const handleFileChange = (e) => {
//         const selectedFiles = Array.from(e.target.files || []);
//         if (!selectedFiles.length) return;

//         setFiles(selectedFiles);
//         resetProgress();
//         setJobId(null);
//     };

//     const handleUpload = async (forceOverwrite = false) => {
//         if (!files.length || uploading || isProcessing) return;

//         setUploading(true);
//         resetProgress();

//         try {
//             const data = await uploadResumes(files, forceOverwrite);

//             if (data?.status === "duplicate" && !forceOverwrite) {
//                 setDuplicateItems(data.duplicates || []);
//                 setShowOverwriteDialog(true);
//                 return;
//             }

//             if (data?.job_id) {
//                 setJobId(data.job_id);
//                 startTracking(data.job_id); // 🔥 start real-time polling
//             }

//             setFiles([]);
//             if (inputRef.current) inputRef.current.value = "";

//         } catch (err) {
//             console.error("Upload failed:", err);
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="upload-box mt-3">
//             <input
//                 ref={inputRef}
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

//             {isProcessing && (
//                 <p className="progress-status processing">
//                     Processing {progressData.processed}/{progressData.total}
//                 </p>
//             )}

//             {progressData.status && progressData.status !== "idle" && (
//                 <p className={`progress-status ${progressData.status}`}>
//                     Status: {progressData.status}
//                 </p>
//             )}

//             <button
//                 className="upload-btn"
//                 disabled={!files.length || uploading || isProcessing}
//                 onClick={() => handleUpload()}
//             >
//                 {uploading ? "Uploading..." : "Start Upload"}
//             </button>

//             {showOverwriteDialog && (
//                 <OverwriteDialog
//                     items={duplicateItems}
//                     onConfirm={confirmOverwrite}
//                     onCancel={() => {
//                         setShowOverwriteDialog(false);
//                         setDuplicateItems([]);
//                     }}
//                 />
//             )}
//         </div>
//     );
// }
import React, { useRef, useState } from "react";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import { uploadResumes } from "@/utils/uploadResumes";
import OverwriteDialog from "@/components/OverwriteDialog";
import "./UploadUI.css";

export default function UploadUI() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [duplicateItems, setDuplicateItems] = useState([]);
    const [showOverwriteDialog, setShowOverwriteDialog] = useState(false);
    const [jobId, setJobId] = useState(null);

    const inputRef = useRef(null);

    const {
        progressData,
        isProcessing,
        resetProgress,
        startTracking
    } = useUploadProgress();

    const confirmOverwrite = () => {
        setShowOverwriteDialog(false);
        setDuplicateItems([]);
        handleUpload(true);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;

        setFiles(selectedFiles);
        resetProgress();
        setJobId(null);
    };

    const handleUpload = async (forceOverwrite = false) => {
        if (!files.length || uploading || isProcessing) return;

        setUploading(true);
        resetProgress();

        try {
            const data = await uploadResumes(files, forceOverwrite);

            if (data?.status === "duplicate" && !forceOverwrite) {
                setDuplicateItems(data.duplicates || []);
                setShowOverwriteDialog(true);
                return;
            }

            if (data?.job_id) {
                setJobId(data.job_id);
                startTracking(data.job_id);
            }

            setFiles([]);
            if (inputRef.current) inputRef.current.value = "";

        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-box mt-3">
            <input
                ref={inputRef}
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
                <p className="progress-status processing">
                    Processing {progressData.processed}/{progressData.total}
                </p>
            )}

            {progressData.status && progressData.status !== "idle" && (
                <p className={`progress-status ${progressData.status}`}>
                    Status: {progressData.status}
                </p>
            )}

            {/* 🔽 NEW: Progress details */}
            {(progressData.completed?.length > 0 || progressData.errors?.length > 0) && (
                <div className="progress-details">
                    {progressData.completed?.length > 0 && (
                        <>
                            <h5>Completed</h5>
                            <ul className="completed-list">
                                {progressData.completed.map((f, i) => (
                                    <li key={i}>✅ {f}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {progressData.errors?.length > 0 && (
                        <>
                            <h5>Failed</h5>
                            <ul className="error-list">
                                {progressData.errors.map((f, i) => (
                                    <li key={i}>❌ {f}</li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}

            <button
                className="upload-btn"
                disabled={!files.length || uploading || isProcessing}
                onClick={() => handleUpload()}
            >
                {uploading ? "Uploading..." : "Start Upload"}
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
