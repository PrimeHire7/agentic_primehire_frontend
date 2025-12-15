// // // // // useUploadProgress.js
// // // // import { useState, useEffect } from "react";

// // // // export const useUploadProgress = (pollInterval = 800) => {
// // // //     const [progressData, setProgressData] = useState({
// // // //         total: 0,
// // // //         processed: 0,
// // // //         completed: [],
// // // //         errors: [],
// // // //         status: "idle"
// // // //     });

// // // //     const [isProcessing, setIsProcessing] = useState(false);
// // // //     const [isCompleted, setIsCompleted] = useState(false);

// // // //     useEffect(() => {
// // // //         const fetchProgress = async () => {
// // // //             try {
// // // //                 const res = await fetch(
// // // //                     "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
// // // //                 );
// // // //                 const data = await res.json();

// // // //                 if (data?.progress) {
// // // //                     const pd = data.progress;
// // // //                     setProgressData(pd);

// // // //                     const processing = pd.total > 0 && pd.processed < pd.total;
// // // //                     const completed = pd.total > 0 && pd.processed === pd.total;

// // // //                     setIsProcessing(processing);
// // // //                     setIsCompleted(completed);
// // // //                 }
// // // //             } catch (err) {
// // // //                 console.error("❌ Progress fetch failed:", err);
// // // //             }
// // // //         };

// // // //         fetchProgress();
// // // //         const interval = setInterval(fetchProgress, pollInterval);
// // // //         return () => clearInterval(interval);
// // // //     }, [pollInterval]);

// // // //     return {
// // // //         progressData,
// // // //         isProcessing,
// // // //         isCompleted,
// // // //         setIsCompleted,
// // // //         setProgressData,
// // // //         setIsProcessing
// // // //     };
// // // // };
// // // // useUploadProgress.js
// // // import { useState, useEffect } from "react";

// // // export const useUploadProgress = (pollInterval = 800) => {
// // //     const [progressData, setProgressData] = useState({
// // //         total: 0,
// // //         processed: 0,
// // //         completed: [],
// // //         errors: [],
// // //         status: "idle"
// // //     });

// // //     const [isProcessing, setIsProcessing] = useState(false);

// // //     // 🔥 IMPORTANT: completion is UI-controlled
// // //     const [isCompleted, setIsCompleted] = useState(false);

// // //     useEffect(() => {
// // //         const fetchProgress = async () => {
// // //             try {
// // //                 const res = await fetch(
// // //                     "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
// // //                 );
// // //                 const data = await res.json();

// // //                 if (data?.progress) {
// // //                     const pd = data.progress;
// // //                     setProgressData(pd);

// // //                     // ✅ processing only
// // //                     const processing =
// // //                         pd.total > 0 && pd.processed < pd.total;

// // //                     setIsProcessing(processing);

// // //                     // ❌ DO NOT auto-set isCompleted here
// // //                     // UI decides when completion is final
// // //                 }
// // //             } catch (err) {
// // //                 console.error("❌ Progress fetch failed:", err);
// // //             }
// // //         };

// // //         fetchProgress();
// // //         const interval = setInterval(fetchProgress, pollInterval);
// // //         return () => clearInterval(interval);
// // //     }, [pollInterval]);

// // //     return {
// // //         progressData,
// // //         isProcessing,

// // //         // UI-controlled
// // //         isCompleted,
// // //         setIsCompleted,

// // //         // exposed setters
// // //         setProgressData,
// // //         setIsProcessing
// // //     };
// // // };
// // // useUploadProgress.js
// // import { useState, useEffect, useRef } from "react";

// // export const useUploadProgress = (pollInterval = 800) => {
// //     const [progressData, setProgressData] = useState({
// //         total: 0,
// //         processed: 0,
// //         completed: [],
// //         errors: [],
// //         status: "idle"
// //     });

// //     const [isProcessing, setIsProcessing] = useState(false);
// //     const [isCompleted, setIsCompleted] = useState(false);

// //     // 🔒 HARD STOP polling flag
// //     const stopPollingRef = useRef(false);

// //     useEffect(() => {
// //         if (stopPollingRef.current) return;

// //         const fetchProgress = async () => {
// //             try {
// //                 const res = await fetch(
// //                     "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
// //                 );
// //                 const data = await res.json();

// //                 if (!data?.progress) return;

// //                 const pd = data.progress;
// //                 setProgressData(pd);

// //                 const processing =
// //                     pd.total > 0 && pd.processed < pd.total;

// //                 const completed =
// //                     pd.total > 0 && pd.processed === pd.total;

// //                 setIsProcessing(processing);

// //                 // 🔥 ONCE completed → STOP POLLING FOREVER
// //                 if (completed) {
// //                     setIsCompleted(true);
// //                     stopPollingRef.current = true;
// //                 }
// //             } catch (err) {
// //                 console.error("❌ Progress fetch failed:", err);
// //             }
// //         };

// //         fetchProgress();
// //         const interval = setInterval(fetchProgress, pollInterval);

// //         return () => clearInterval(interval);
// //     }, [pollInterval]);

// //     /* 🔄 EXPLICIT RESET (called from UI) */
// //     const resetProgress = () => {
// //         stopPollingRef.current = false;

// //         setProgressData({
// //             total: 0,
// //             processed: 0,
// //             completed: [],
// //             errors: [],
// //             status: "idle"
// //         });

// //         setIsProcessing(false);
// //         setIsCompleted(false);
// //     };

// //     return {
// //         progressData,
// //         isProcessing,
// //         isCompleted,

// //         resetProgress,   // 🔥 IMPORTANT
// //         setProgressData
// //     };
// // };
// // useUploadProgress.js
// import { useState, useEffect, useRef } from "react";

// export const useUploadProgress = (pollInterval = 800) => {
//     const [progressData, setProgressData] = useState({
//         total: 0,
//         processed: 0,
//         completed: [],
//         errors: [],
//         status: "idle"
//     });

//     const [isProcessing, setIsProcessing] = useState(false);
//     const [isCompleted, setIsCompleted] = useState(false);

//     const stopPollingRef = useRef(false);

//     useEffect(() => {
//         if (stopPollingRef.current) return;

//         const fetchProgress = async () => {
//             try {
//                 const res = await fetch(
//                     "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
//                 );
//                 const data = await res.json();

//                 if (!data?.progress) return;

//                 const pd = data.progress;
//                 setProgressData(pd);

//                 const processing = pd.total > 0 && pd.processed < pd.total;
//                 const completed = pd.total > 0 && pd.processed === pd.total;

//                 setIsProcessing(processing);

//                 if (completed) {
//                     setIsCompleted(true);
//                     stopPollingRef.current = true; // 🔒 STOP FOREVER
//                 }
//             } catch (err) {
//                 console.error("❌ Progress fetch failed:", err);
//             }
//         };

//         fetchProgress();
//         const interval = setInterval(fetchProgress, pollInterval);
//         return () => clearInterval(interval);
//     }, [pollInterval]);

//     const resetProgress = () => {
//         stopPollingRef.current = false;
//         setIsCompleted(false);
//         setIsProcessing(false);
//         setProgressData({
//             total: 0,
//             processed: 0,
//             completed: [],
//             errors: [],
//             status: "idle"
//         });
//     };

//     return {
//         progressData,
//         isProcessing,
//         isCompleted,
//         resetProgress,
//         setProgressData
//     };
// };
// useUploadProgress.js
import { useState, useEffect, useRef } from "react";

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
                const res = await fetch(
                    "https://primehire.nirmataneurotech.com/mcp/tools/resume/progress"
                );
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
        stopPollingRef.current = false; // 🔥 resume polling
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
