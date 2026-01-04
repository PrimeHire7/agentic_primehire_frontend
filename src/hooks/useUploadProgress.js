
// useUploadProgress.js
import { useState, useEffect, useRef } from "react";
import { WS_URL, API_BASE } from "@/utils/constants";
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

    // controls whether we SHOULD process updates
    const stopPollingRef = useRef(false);

    useEffect(() => {
        const fetchProgress = async () => {
            // 🔒 polling paused (but effect still alive)
            if (stopPollingRef.current) return;

            try {
                const res = await fetch(`${API_BASE}/mcp/tools/resume/progress`);

                const data = await res.json();

                if (!data?.progress) return;

                const pd = data.progress;
                setProgressData(pd);

                const processing = pd.total > 0 && pd.processed < pd.total;
                // const completed = pd.total > 0 && pd.processed === pd.total;
                const completed =
                    pd.total > 0 &&
                    pd.processed >= pd.total;

                setIsProcessing(processing);

                if (completed) {
                    setIsCompleted(true);
                    stopPollingRef.current = true; // pause polling
                }
            } catch (err) {
                console.error("❌ Progress fetch failed:", err);
            }
        };

        fetchProgress();
        const interval = setInterval(fetchProgress, pollInterval);

        return () => clearInterval(interval);
    }, [pollInterval]);

    const resetProgress = () => {
        stopPollingRef.current = false;   // 🔥 important
        setIsCompleted(false);
        setIsProcessing(false);
        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "idle"
        });
    };


    return {
        progressData,
        isProcessing,
        isCompleted,
        resetProgress,
        setProgressData
    };
};
