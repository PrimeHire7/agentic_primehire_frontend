
// import React from "react";
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
//     const uploadStartedRef = React.useRef(false);

//     const {
//         progressData,
//         isProcessing,
//         isCompleted,
//         resetProgress,
//         setProgressData
//     } = useUploadProgress();

//     const confirmOverwrite = () => {
//         setShowOverwriteDialog(false);   // ✅ close modal
//         setDuplicateItems([]);           // ✅ clear duplicate state
//         handleUpload(true);              // ✅ start overwrite
//     };

//     /* FILE SELECT */
//     const handleFileChange = (e) => {
//         uploadStartedRef.current = false;  // 🔥 reset session
//         console.log("FILE CHANGE FIRED", e.target.files);
//         setFiles(Array.from(e.target.files));
//         setUploadedData([]);
//         resetProgress();
//     };

//     /* RESET */
//     const resetAll = () => {
//         resetProgress();
//         setFiles([]);
//         setUploadedData([]);
//         fetch(`${API_BASE}/mcp/tools/resume/reset`, { method: "POST" });
//     };

//     /* UPLOAD */
//     const handleUpload = async (forceOverwrite = false) => {
//         uploadStartedRef.current = true;
//         if (!files.length) return;

//         resetProgress();
//         setUploading(true);

//         setProgressData({
//             total: 0,
//             processed: 0,
//             completed: [],
//             errors: [],
//             status: "uploading"
//         });

//         try {
//             const data = await uploadResumes(files, forceOverwrite);

//             if (data.status === "duplicate" && !forceOverwrite) {
//                 setDuplicateItems(data.duplicates || []);
//                 setShowOverwriteDialog(true);
//                 return;
//             }
//         } catch (err) {
//             console.error("Upload failed:", err);
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <div className="upload-box mt-3">

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
//                 <p className="progress-status">
//                     Processing {progressData.processed}/{progressData.total}
//                 </p>
//             )}

//             {uploadStartedRef.current && isCompleted && (
//                 <p className="progress-status success">✅ Upload Complete</p>
//             )}


//             <button
//                 className="upload-btn"
//                 disabled={uploading}
//                 onClick={() => {
//                     if (isCompleted) {
//                         resetAll();
//                         document.getElementById("resume-upload")?.click();
//                         return;
//                     }

//                     if (files.length) {
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
import React from "react";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import { uploadResumes } from "@/utils/uploadResumes";
import OverwriteDialog from "@/components/OverwriteDialog";
import { API_BASE } from "@/utils/constants";
import "./UploadUI.css";

export default function UploadUI() {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [duplicateItems, setDuplicateItems] = React.useState([]);
    const [showOverwriteDialog, setShowOverwriteDialog] = React.useState(false);

    const {
        progressData,
        isProcessing,
        resetProgress,
        setProgressData
    } = useUploadProgress();

    const confirmOverwrite = () => {
        setShowOverwriteDialog(false);
        setDuplicateItems([]);
        handleUpload(true);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (!selectedFiles.length) return;

        console.log("FILES SELECTED:", selectedFiles);
        setFiles(selectedFiles);
        resetProgress();
    };

    const handleUpload = async (forceOverwrite = false) => {
        if (!files.length || uploading || isProcessing) return;

        setUploading(true);
        resetProgress();

        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "uploading"
        });

        try {
            const data = await uploadResumes(files, forceOverwrite);

            if (data?.status === "duplicate" && !forceOverwrite) {
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
