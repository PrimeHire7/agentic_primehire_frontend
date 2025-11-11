// 📁 src/hooks/useUploadProgress.js
import { useState, useEffect } from "react";

export const useUploadProgress = (pollInterval = 3000) => {
    const [progressData, setProgressData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(
                    "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
                );
                const data = await res.json();
                if (data?.progress) {
                    setProgressData(data.progress);
                    setIsProcessing(data.status === "processing");
                }
            } catch (err) {
                console.error("❌ Progress fetch failed:", err);
            }
        };

        fetchProgress();
        const interval = setInterval(fetchProgress, pollInterval);
        return () => clearInterval(interval);
    }, [pollInterval]);

    return { progressData, isProcessing };
};
