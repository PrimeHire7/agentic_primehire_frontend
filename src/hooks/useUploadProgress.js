// useUploadProgress.js
import { useState, useEffect } from "react";

export const useUploadProgress = (pollInterval = 800) => {
    const [progressData, setProgressData] = useState({
        total: 0,
        processed: 0,
        completed: [],
        errors: [],
        status: "idle"
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const res = await fetch(
                    "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
                );
                const data = await res.json();

                if (data?.progress) {
                    const pd = data.progress;
                    setProgressData(pd);

                    const processing = pd.total > 0 && pd.processed < pd.total;
                    const completed = pd.total > 0 && pd.processed === pd.total;

                    setIsProcessing(processing);
                    setIsCompleted(completed);
                }
            } catch (err) {
                console.error("❌ Progress fetch failed:", err);
            }
        };

        fetchProgress();
        const interval = setInterval(fetchProgress, pollInterval);
        return () => clearInterval(interval);
    }, [pollInterval]);

    return {
        progressData,
        isProcessing,
        isCompleted,
        setIsCompleted,
        setProgressData,
        setIsProcessing
    };
};
