import React, { useRef, useState } from "react";
import {
    Link as LinkIcon,
    Brain as BrainIcon,
    Cpu as CpuIcon,
    Mail as MailIcon,
    Video as VideoIcon,
    Upload as UploadIcon,
    FileText as FileTextIcon,
    Search as SearchIcon,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import "./InfoCards.css";

import ZohoBridge from "../ZohoBridge/ZohoLoginButton";
import MailMindButton from "../MailMind/MailMindButton";
import InterviewBot from "../InterviewBot/InterviewBot";
import PrimeHireBrain from "../PrimeHireBrain/PrimeHireBrain";
import UploadUI from "../chat/UploadUI";
import JDTaskUI from "../pages/JDTaskUI";
import LinkedInPosterButton from "../LinkedInPoster/LinkedInPosterButton";
import Designation from "../CandidateStatus/Designation";
import ChatContainer from "../chat/ChatContainer";

export default function InfoCards() {
    const scrollRef = useRef(null);

    const [selectedFeature, setSelectedFeature] = useState(null);
    const BackButton = () => (
        <button className="back-btn" onClick={() => setSelectedFeature(null)}>
            ← Back to Features
        </button>
    );

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const handleCardClick = (title) => {
        console.log("Card clicked:", title);

        setSelectedFeature(title);
    };

    if (selectedFeature === "ZohoBridge") {
        return (
            <>
                <BackButton />
                <ZohoBridge />
            </>
        );
    }

    if (selectedFeature === "MailMind") {
        return (
            <>
                <BackButton />
                <MailMindButton />
            </>
        );
    }

    if (selectedFeature === "InterviewBot") {
        return (
            <>
                <BackButton />
                <InterviewBot />
            </>
        );
    }

    if (selectedFeature === "PrimeHireBrain") {
        return (
            <>
                <BackButton />
                <PrimeHireBrain />
            </>
        );
    }

    if (selectedFeature === "Upload Resumes") {
        return (
            <>
                <BackButton />
                <UploadUI />
            </>
        );
    }

    if (selectedFeature === "JD Creator") {
        return (
            <>
                <BackButton />
                <JDTaskUI />
            </>
        );
    }

    if (
        selectedFeature === "ChatContainer" ||
        selectedFeature === "ChatInput" ||
        selectedFeature === "Profile Matcher"
    ) {
        return (
            <>
                <BackButton />
                <ChatContainer />
            </>
        );
    }

    if (selectedFeature === "LinkedInPoster") {
        return (
            <>
                <BackButton />
                <LinkedInPosterButton />
            </>
        );
    }

    if (selectedFeature === "CandidateStatus") {
        return (
            <>
                <BackButton />
                <Designation />
            </>
        );
    }

    const promptChips = {
        /* ======================================================
           ⭐ FEATURE: ZOHO BRIDGE
        ====================================================== */
        ZohoBridge: [
            {
                label: "🔗 Fetch Zoho Candidates",
                text: "Start ZohoBridge: Fetch all candidates from Zoho Recruit and sync them with PrimeHire."
            },
            {
                label: "📌 Update Job Status",
                text: "Start ZohoBridge: Update job openings in Zoho Recruit with the latest status from PrimeHire."
            },
            {
                label: "🔄 Sync Zoho Records",
                text: "Start ZohoBridge: Perform a full sync of candidate and job records between Zoho Recruit and PrimeHire."
            }
        ],

        /* ======================================================
           ⭐ FEATURE: MAILMIND
        ====================================================== */
        MailMind: [
            {
                label: "📥 Extract Emails",
                text: "Start MailMind: Extract candidate emails from Outlook inbox and parse resume attachments."
            },
            {
                label: "📂 Parse Resumes",
                text: "Start MailMind: Parse resumes from inbox for skills, experience, and structured profile data."
            },
            {
                label: "📊 Analyze Inbox Activity",
                text: "Start MailMind: Analyze HR inbox patterns for candidate responses, follow-ups, and unread profiles."
            }
        ],

        /* ======================================================
           ⭐ FEATURE: INTERVIEW BOT
        ====================================================== */
        InterviewBot: [
            {
                label: "🎤 Run AI Interview",
                text: "Start InterviewBot: Conduct a complete AI-driven interview with ID validation and evaluation scoring."
            },
            {
                label: "❓ Simulate Questions",
                text: "Start InterviewBot: Generate a dynamic interview simulation with technical and behavioral questions."
            },
            {
                label: "📈 Evaluate Candidate",
                text: "Start InterviewBot: Evaluate the candidate's performance and generate a structured interview report."
            }
        ],

        /* ======================================================
           ⭐ FEATURE: PRIMEHIRE BRAIN
        ====================================================== */
        PrimeHireBrain: [
            {
                label: "🔍 Search Candidates",
                text: "Start PrimeHireBrain: Search the entire AI-powered resume database for best-fit candidates."
            },
            {
                label: "📉 Analyze Skill Gaps",
                text: "Start PrimeHireBrain: Analyze candidate skill gaps relative to selected job descriptions."
            },
            {
                label: "🗂 View All Resumes",
                text: "Start PrimeHireBrain: Retrieve all resumes stored in PrimeHireBrain for batch inspection."
            }
        ],

        /* ======================================================
           ⭐ FEATURE: LINKEDIN POSTER
        ====================================================== */
        LinkedInPoster: [
            {
                label: "📢 Post Job on LinkedIn",
                text: "Start LinkedInPoster: Publish a job post on the company's LinkedIn Page using the LinkedIn API."
            },
            {
                label: "📝 Share Page Update",
                text: "Start LinkedInPoster: Create and publish a LinkedIn Page update about hiring or company news."
            },
            {
                label: "📋 Manage Job Posts",
                text: "Start LinkedInPoster: Retrieve and manage previously published LinkedIn job posts."
            }
        ],

        /* ======================================================
           ⭐ FEATURE: CANDIDATE STATUS
        ====================================================== */
        CandidateStatus: [
            {
                label: "📅 Interview Schedule",
                text: "Show CandidateStatus: Fetch candidate interview schedules, dates, and time slots."
            },
            {
                label: "📈 Progress Tracking",
                text: "Show CandidateStatus: Show candidate progress across interview rounds."
            },
            {
                label: "⚠️ Identify Anomalies",
                text: "Show CandidateStatus: Detect anomalies such as low performance, missing rounds, or inconsistent answers."
            }
        ],

        /* ======================================================
           ⭐ TASK: UPLOAD RESUMES
        ====================================================== */
        "Upload Resumes": [
            {
                label: "📤 Upload Resumes",
                text: "Start Upload Resumes: Upload and parse candidate resumes into PostgreSQL + Pinecone."
            },
            {
                label: "📁 Bulk Upload",
                text: "Start Upload Resumes: Bulk upload a folder of resumes and index them for semantic search."
            }
        ],

        /* ======================================================
           ⭐ TASK: JD CREATOR
        ====================================================== */
        "JD Creator": [
            {
                label: "🧑‍💻 Create JD (Data Scientist)",
                text: "Start JD Creator: Create a job description for a Data Scientist — Python, ML, deep learning, 3+ years."
            },
            {
                label: "📝 Generate Job Post",
                text: "Start JD Creator: Generate a polished job post with responsibilities, skills, and salary bands."
            },
            {
                label: "✨ Refine Description",
                text: "Start JD Creator: Refine the existing job description for clarity and impact."
            }
        ],

        /* ======================================================
           ⭐ TASK: PROFILE MATCHER
        ====================================================== */
        "Profile Matcher": [
            {
                label: "🎯 Find Best Candidates",
                text: "Start Profile Matcher: Find top candidates for the selected job description using semantic matching."
            },
            {
                label: "🔎 Match Profiles to JD",
                text: "Start Profile Matcher: Match all available resumes to the given job role."
            },
            {
                label: "⚖️ Compare Candidates",
                text: "Start Profile Matcher: Compare candidate resumes and identify closest fit for the JD."
            }
        ],

        /* ======================================================
           ⭐ HISTORY MODULES
        ====================================================== */
        "JD History": [
            { label: "🕘 Recent JDs", text: "Show JDHistory: Fetch last 10 job descriptions." }
        ],

        "Match History": [
            { label: "📈 Last Matches", text: "Show ProfileMatchHistory: Fetch recent match runs." }
        ]
    };


    return (
        <div className="info-section">
            <h1 className="section-title">Our Intelligent Recruitment Features</h1>

            {/* Scroll Buttons */}
            <button className="scroll-btn left" onClick={() => scroll("left")}>
                <ChevronLeft size={20} />
            </button>
            <button className="scroll-btn right" onClick={() => scroll("right")}>
                <ChevronRight size={20} />
            </button>

            {/* Scrollable container */}
            <div ref={scrollRef} className="cards-container scrollable">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="info-card"
                        onClick={() => handleCardClick(card.title)}
                    >
                        <div className="card-icon">{card.icon}</div>
                        <h2 className="card-title">{card.title}</h2>
                        <p className="card-description">{card.description}</p>
                        <ul className="card-points">
                            {card.triggers.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
