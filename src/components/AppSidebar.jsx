import React, { useEffect, useRef, useState } from "react";
import {
    Link as LinkIcon,
    Brain as BrainIcon,
    Cpu as CpuIcon,
    FileText as FileTextIcon,
    Users as UsersIcon,
    Upload as UploadIcon,
    History as HistoryIcon,
    Loader2 as LoaderIcon,
    CheckCircle2 as CheckIcon,
    Bot as BotIcon,
    Share2 as ShareIcon,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import "./AppSidebar.css";

// FEATURES
const features = [
    { id: "ZohoBridge", label: "ZohoBridge", icon: <LinkIcon /> },
    { id: "MailMind", label: "MailMind", icon: <BrainIcon /> },
    { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <CpuIcon /> },
    { id: "InterviewBot", label: "Interview Bot", icon: <BotIcon /> },
    { id: "LinkedInPoster", label: "LinkedIn Poster", icon: <ShareIcon /> },
    { id: "ProfileMatchHistory", label: "Match History", icon: <HistoryIcon /> },
    { id: "JDHistory", label: "JD History", icon: <FileTextIcon className="h-4 w-4" /> },

];

// TASKS
const tasks = [
    { id: "JD Creator", label: "JD Creator", icon: <FileTextIcon /> },
    { id: "Profile Matcher", label: "Profile Matcher", icon: <UsersIcon /> },
    { id: "Upload Resumes", label: "Upload Resumes", icon: <UploadIcon /> },
];

export default function AppSidebar({
    selectedFeature,
    selectedTask,
    isLoading,
    onFeatureSelect,
    onTaskSelect,
}) {
    const { open, setOpen } = useSidebar();
    const activeRef = useRef(null);
    const [recentActive, setRecentActive] = useState(null);

    const handleClick = (id) => {
        const isFeature = features.some((f) => f.id === id);
        const isTask = tasks.some((t) => t.id === id);

        if (isFeature && onFeatureSelect) onFeatureSelect(id);
        if (isTask && onTaskSelect) onTaskSelect(id);
    };

    const isSelected = (id) => id === selectedFeature || id === selectedTask;

    // Highlight scroll
    useEffect(() => {
        const current = selectedFeature || selectedTask;

        if (!current) return;

        setRecentActive(current);

        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            activeRef.current.classList.add("pulse-highlight");
            setTimeout(() => activeRef.current?.classList.remove("pulse-highlight"), 1400);
        }
    }, [selectedFeature, selectedTask]);

    const renderButton = (item) => {
        const active = isSelected(item.id);

        return (
            <div className="sidebar-button-content">
                <div className="sidebar-left">
                    <span className="sidebar-icon">{item.icon}</span>
                    {open && <span className="sidebar-label">{item.label}</span>}
                </div>

                {active && (
                    <div className="sidebar-status">
                        {isLoading ? (
                            <LoaderIcon className="sidebar-loader" />
                        ) : (
                            <CheckIcon className="sidebar-check" />
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* FEATURES */}
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {features.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <button
                                            ref={isSelected(item.id) ? activeRef : null}
                                            onClick={() => handleClick(item.id)}
                                            className={`sidebar-btn ${isSelected(item.id) ? "active" : ""}`}
                                        >
                                            {renderButton(item)}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* TASKS */}
                <SidebarGroup>
                    <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tasks.map((item) => (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton asChild>
                                        <button
                                            ref={isSelected(item.id) ? activeRef : null}
                                            onClick={() => handleClick(item.id)}
                                            className={`sidebar-btn ${isSelected(item.id) ? "active" : ""}`}
                                        >
                                            {renderButton(item)}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
