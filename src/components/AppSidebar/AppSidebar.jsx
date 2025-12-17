import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import {
    FileText,
    Link as LinkIcon,
    Brain,
    Cpu,
    History,
    Bot,
    Share2,
    ChevronLeft
} from "lucide-react";

import "./AppSidebar.css";
import { FaUserCheck } from "react-icons/fa";

const features = [
    // { id: "ZohoBridge", label: "ZohoBridge", icon: <LinkIcon size={18} /> },
    { id: "MailMind", label: "MailMind", icon: <Brain size={18} /> },
    { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <Cpu size={18} /> },
    // { id: "InterviewBot", label: "Interview Bot", icon: <Bot size={18} /> },
    // { id: "LinkedInPoster", label: "LinkedIn Poster", icon: <Share2 size={18} /> },
    // { id: "ProfileMatchHistory", label: "Match History", icon: <History size={18} /> },
    { id: "JDHistory", label: "JD History", icon: <FileText size={18} /> },
    { id: "CandidateStatus", label: "Candidates Status", icon: <FaUserCheck /> },
];

export default function AppSidebar({ selectedFeature, onFeatureSelect }) {
    return (
        <div className="ph-sidebar">
            <SidebarContent>

                <SidebarGroup className="mt-4">
                    <SidebarGroupLabel className="ph-group-label ft_clas">FEATURES</SidebarGroupLabel>

                    <SidebarMenu>
                        {features.map((f) => (
                            <SidebarMenuItem key={f.id}>
                                <SidebarMenuButton
                                    className={`ph-btn ${selectedFeature === f.id ? "ph-active" : ""}`}
                                    onClick={() => onFeatureSelect(f.id)}
                                >
                                    <div className="ph-icon">{f.icon}</div>
                                    <span>{f.label}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>

                </SidebarGroup>

            </SidebarContent>

            {/* <div className="ph-collapse-area">
                <SidebarTrigger className="ph-collapse-btn">
                    <ChevronLeft size={18} />
                </SidebarTrigger>
            </div> */}
        </div>
    );
}
