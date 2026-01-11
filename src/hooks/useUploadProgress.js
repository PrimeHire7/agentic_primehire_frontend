import { useState, useEffect, useRef } from "react";
import { API_BASE } from "@/utils/constants";

export const useUploadProgress = (pollInterval = 800) => {
    const [progressData, setProgressData] = useState({
        total: 0,
        processed: 0,
        completed: [],
        errors: [],
        status: "idle"
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const jobIdRef = useRef(null);
    const intervalRef = useRef(null);

    const fetchProgress = async () => {
        const jobId = jobIdRef.current;
        if (!jobId) return;

        try {
            const res = await fetch(
                `${API_BASE}/mcp/tools/resume/progress/live?job_id=${jobId}`
            );
            const data = await res.json();

            if (!data?.progress) return;

            const pd = data.progress;
            setProgressData(pd);

            const processing = pd.total > 0 && pd.processed < pd.total;
            setIsProcessing(processing);

            if (!processing && intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }

        } catch (err) {
            console.error("Progress fetch failed:", err);
        }
    };

    const startTracking = (newJobId) => {
        if (!newJobId) return;

        if (intervalRef.current) clearInterval(intervalRef.current);

        jobIdRef.current = newJobId;
        setIsProcessing(true);

        fetchProgress();
        intervalRef.current = setInterval(fetchProgress, pollInterval);
    };

    const resetProgress = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        jobIdRef.current = null;
        setIsProcessing(false);
        setProgressData({
            total: 0,
            processed: 0,
            completed: [],
            errors: [],
            status: "idle"
        });
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return {
        progressData,
        isProcessing,
        resetProgress,
        startTracking
    };
};
