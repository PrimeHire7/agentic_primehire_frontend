import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./LinkedInPosterButton.css";

export default function LinkedInPosterButton({ jobData }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [canPost, setCanPost] = useState(false);

    useEffect(() => {
        setCanPost(jobData && jobData.title && jobData.description && jobData.applyLink);
    }, [jobData]);

    const handleConnectLinkedIn = () => {
        const loginUrl = "https://www.linkedin.com/login";
        const popup = window.open(loginUrl, "linkedinLogin", "width=600,height=700");

        const checkLogin = setInterval(() => {
            try {
                if (popup.closed) {
                    clearInterval(checkLogin);
                    setIsLoggedIn(true);
                    alert("✅ LinkedIn connected successfully!");
                }
            } catch (err) {
                console.log("Checking LinkedIn login…", err);
            }
        }, 1000);
    };

    const handlePostJD = () => {
        if (!isLoggedIn) {
            alert("Please connect your LinkedIn account first.");
            return;
        }

        if (!canPost) {
            alert("JD data missing! Generate or select a JD first.");
            return;
        }

        const postJobUrl = "https://www.linkedin.com/talent/post-a-job";
        const newTab = window.open(postJobUrl, "_blank");

        const fillScript = `
      (function() {
        function setValue(selector, value) {
          const el = document.querySelector(selector);
          if (el) {
            el.focus();
            el.value = value;
            el.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }

        setTimeout(() => {
          setValue('input[name="jobTitle"]', ${JSON.stringify(jobData.title)});
          setValue('textarea[name="jobDescription"]', ${JSON.stringify(jobData.description)});
          setValue('input[name="applyUrl"]', ${JSON.stringify(jobData.applyLink)});
        }, 3000);
      })();
    `;

        newTab.onload = () => {
            newTab.eval(fillScript);
        };
    };

    return (
        <div className="linkedin-auto-container">
            <h3 className="linkedin-auto-title">🚀 LinkedIn Auto Poster</h3>

            <div className="linkedin-auto-buttons">
                <Button
                    variant="outline"
                    onClick={handleConnectLinkedIn}
                    className={`linkedin-connect-btn ${isLoggedIn ? "connected" : ""}`}
                >
                    {isLoggedIn ? "✅ Connected to LinkedIn" : "Connect LinkedIn"}
                </Button>

                <Button
                    variant="default"
                    onClick={handlePostJD}
                    disabled={!canPost}
                    className="linkedin-post-job-btn"
                >
                    🚀 Post Job to LinkedIn
                </Button>
            </div>
        </div>
    );
}
