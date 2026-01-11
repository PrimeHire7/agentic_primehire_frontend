import { useEffect, useRef } from "react";

const WS_BASE =
    import.meta.env.VITE_WS_BASE || "wss://primehire.nirmataneurotech.com";

export default function FaceMonitorWS({ videoRef, candidateId }) {
    const wsRef = useRef(null);
    const intervalRef = useRef(null);

    /* ---------------- CONNECT WS ---------------- */
    useEffect(() => {
        if (!candidateId) return;

        const ws = new WebSocket(
            `${WS_BASE}/mcp/interview/ws/face-monitor/${candidateId}`
        );
        wsRef.current = ws;

        ws.onopen = () => console.log("🎥 Face WS connected");
        ws.onerror = (e) => console.error("Face WS error", e);
        ws.onclose = () => console.log("🛑 Face WS closed");

        return () => {
            ws.close();
        };
    }, [candidateId]);

    /* ---------------- SEND FRAMES ---------------- */
    useEffect(() => {
        if (!videoRef?.current) return;

        intervalRef.current = setInterval(() => {
            const video = videoRef.current;
            const ws = wsRef.current;

            if (!video || !video.videoWidth) return;
            if (!ws || ws.readyState !== WebSocket.OPEN) return;

            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext("2d").drawImage(video, 0, 0);

            canvas.toBlob(
                (blob) => blob && ws.send(blob),
                "image/jpeg",
                0.6
            );
        }, 1500);

        return () => clearInterval(intervalRef.current);
    }, [videoRef]);

    return null;
}
