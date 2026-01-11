import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import "./JDMessage.css";

const JDMessage = ({ content }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (err) {
            console.error("❌ Copy failed:", err);
        }
    };

    return (
        <div className="jdmsg-container">
            <pre className="jdmsg-text">{content}</pre>

            {/* Copy Button */}
            <button onClick={handleCopy} className="jdmsg-copy-btn">
                {copied ? (
                    <>
                        <Check className="jdmsg-icon" /> Copied
                    </>
                ) : (
                    <>
                        <Copy className="jdmsg-icon" /> Copy
                    </>
                )}
            </button>
        </div>
    );
};

export default JDMessage;