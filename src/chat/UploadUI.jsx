import React from "react";
import ResumeTable from "@/chat/ResumeTable";
import { useUploadProgress } from "@/hooks/useUploadProgress";
import "./UploadUI.css";

export default function UploadUI() {
    const [files, setFiles] = React.useState([]);
    const [uploading, setUploading] = React.useState(false);
    const [uploadedData, setUploadedData] = React.useState([]);

    const {
        progressData,
        isProcessing,
        isCompleted,
        setProgressData,
        setIsCompleted
    } = useUploadProgress();

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        setFiles(selected);
        setUploadedData([]);
        setIsCompleted(false);

        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "idle"
        });
    };

    const resetAll = () => {
        setUploadedData([]);
        setIsCompleted(false);
        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "idle"
        });

        fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/reset", { method: "POST" });
    };

    const handleUpload = async () => {
        if (!files.length) return;

        resetAll();
        setUploading(true);

        try {
            const formData = new FormData();
            files.forEach(f => formData.append("files", f));

            await fetch("https://primehire.nirmataneurotech.com/mcp/tools/resume/upload", {
                method: "POST",
                body: formData
            });

        } finally {
            setUploading(false);
        }
    };

    React.useEffect(() => {
        if (progressData.total > 0 && progressData.processed === progressData.total) {
            fetch(
                "https://primehire.nirmataneurotech.com/mcp/tools/resume/recent?limit=" +
                progressData.total
            )
                .then(r => r.json())
                .then(d => setUploadedData(d.recent_candidates || []));
        }
    }, [progressData.processed]);

    const progressPercent =
        progressData.total > 0
            ? Math.round((progressData.processed / progressData.total) * 100)
            : 0;

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
                <div className="upload-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>

                    <p className="progress-status">
                        Processing {progressData.processed}/{progressData.total}
                    </p>

                    {progressData.completed.length > 0 && (
                        <ul className="completed-files-list">
                            {progressData.completed.map((file, i) => (
                                <li key={i}>✔ {file}</li>
                            ))}
                        </ul>
                    )}

                    {progressData.errors.length > 0 && (
                        <ul className="error-files-list">
                            {progressData.errors.map((file, i) => (
                                <li key={i}>❌ {file}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {isCompleted && <p className="progress-status success">✅ Upload Complete</p>}

            <button
                onClick={() => {
                    if (isCompleted) {
                        resetAll();
                        setFiles([]);
                        setTimeout(() => document.getElementById("resume-upload").click(), 50);
                        return;
                    }

                    if (files.length > 0) {
                        handleUpload();
                        return;
                    }

                    document.getElementById("resume-upload").click();
                }}
                disabled={uploading}
                className="upload-btn"
            >
                {uploading
                    ? "Uploading..."
                    : isProcessing
                        ? "Processing..."
                        : isCompleted
                            ? "Upload Again"
                            : "Start Upload"}
            </button>

            {/* {uploadedData.length > 0 && !uploading && !isProcessing && (
                // <ResumeTable data={uploadedData} />
            )} */}

        </div>
    );
}
