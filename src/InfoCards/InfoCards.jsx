import React, { useRef } from "react";
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

export default function InfoCards() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 340; // Card width + gap
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const cards = [
        {
            icon: <LinkIcon size={36} />,
            title: "ZohoBridge",
            description:
                "Connects seamlessly with Zoho Recruit to fetch, update, and sync candidate or job data using Zoho’s API.",
            triggers: ["Fetch Zoho candidates", "Update job status", "Sync Zoho records"],
        },
        {
            icon: <MailIcon size={36} />,
            title: "MailMind",
            description:
                "Extracts candidate resumes and emails from Outlook or HR inboxes for easy data collection and parsing.",
            triggers: ["Extract candidate emails", "Parse resumes from inbox", "Analyze mail portal data"],
        },
        {
            icon: <VideoIcon size={36} />,
            title: "InterviewBot",
            description:
                "Conducts AI-driven interviews with ID validation and generates evaluation reports automatically.",
            triggers: ["Run AI interview", "Simulate interview questions", "Evaluate candidate performance"],
        },
        {
            icon: <CpuIcon size={36} />,
            title: "PrimeHireBrain",
            description:
                "The central AI-powered candidate database storing all resumes and insights from multiple sources.",
            triggers: ["Search candidates in database", "Analyze skill gaps", "View all uploaded resumes"],
        },
        {
            icon: <UploadIcon size={36} />,
            title: "Upload Resumes",
            description:
                "Upload PDF or DOC resumes directly into PostgreSQL + Pinecone vector database for quick access.",
            triggers: ["Upload candidate resumes", "Bulk upload resumes from folder"],
        },
        {
            icon: <FileTextIcon size={36} />,
            title: "JD Creator",
            description:
                "AI-powered job description generator that asks clarifying questions and creates shareable JDs.",
            triggers: ["Create JD for Data Scientist", "Generate perfect job post", "Refine job description"],
        },
        {
            icon: <SearchIcon size={36} />,
            title: "Profile Matcher",
            description:
                "Matches JDs to best-fit candidate profiles using semantic search and vector embeddings.",
            triggers: ["Find best candidates", "Match profiles to JD", "Compare resumes and job role"],
        },
        {
            icon: <BrainIcon size={36} />,
            title: "LinkedInPoster",
            description:
                "Connect your company’s LinkedIn Page to share openings and posts using the LinkedIn Pages API.",
            triggers: ["Post job on LinkedIn", "Share on LinkedIn Page", "Manage LinkedIn job posts"],
        },
    ];

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
                    <div key={index} className="info-card">
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
