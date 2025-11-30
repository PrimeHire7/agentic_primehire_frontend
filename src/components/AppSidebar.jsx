import React from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
} from "@/components/ui/sidebar";

import {
    FileText,
    Users,
    Upload,
    Link as LinkIcon,
    Brain,
    Cpu,
    History,
    Bot,
    Share2,
} from "lucide-react";

import "./AppSidebar.css";

const features = [
    { id: "ZohoBridge", label: "ZohoBridge", icon: <LinkIcon /> },
    { id: "MailMind", label: "MailMind", icon: <Brain /> },
    { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <Cpu /> },
    { id: "InterviewBot", label: "Interview Bot", icon: <Bot /> },
    { id: "LinkedInPoster", label: "LinkedIn Poster", icon: <Share2 /> },
    { id: "ProfileMatchHistory", label: "Match History", icon: <History /> },
    { id: "JDHistory", label: "JD History", icon: <FileText /> },
];

const tasks = [
    { id: "JD Creator", label: "JD Creator", icon: <FileText /> },
    { id: "Profile Matcher", label: "Profile Matcher", icon: <Users /> },
    { id: "Upload Resumes", label: "Upload Resumes", icon: <Upload /> },
];
const [open, setOpen] = useState(false);  // Sidebar closed initially

export default function AppSidebar({
    selectedFeature,
    selectedTask,
    isLoading,
    onFeatureSelect = () => { },
    onTaskSelect = () => { },
}) {
    return (
        // This Sidebar uses the ShadCN component system - variant "sidebar"
        <Sidebar variant="sidebar" collapsible="icon" className="app-sidebar-root">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {features.map((f) => (
                                <SidebarMenuItem key={f.id}>
                                    <SidebarMenuButton
                                        isActive={selectedFeature === f.id}
                                        onClick={() => onFeatureSelect(f.id)}
                                    >
                                        {f.icon}
                                        <span>{f.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Tasks</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tasks.map((t) => (
                                <SidebarMenuItem key={t.id}>
                                    <SidebarMenuButton
                                        isActive={selectedTask === t.id}
                                        onClick={() => onTaskSelect(t.id)}
                                    >
                                        {t.icon}
                                        <span>{t.label}</span>
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
