
import React, { useState } from "react";
import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
    FileText,
    Brain,
    Cpu,
    ChevronLeft,
    ChevronRight
} from "lucide-react";

import "./AppSidebar.css";
import { FaUserCheck } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


const features = [
    { id: "MailMind", label: "MailMind", icon: <Brain size={18} /> },
    { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <Cpu size={18} /> },
    { id: "JDHistory", label: "JD History", icon: <FileText size={18} /> },
    { id: "CandidateStatus", label: "Candidates Status", icon: <FaUserCheck size={18} /> },
    // { id: "InterviewMode", label: "Interview Mode", icon: <ChevronRight size={18} /> },
];

export default function AppSidebar({ open, setOpen, selectedFeature, onFeatureSelect }) {
    // const [open, setOpen] = useState(true);

    return (
        <>
            {/* <div className={`ph-sidebar ${open ? "open" : "closed"}`}>

 <div className="ph-toggle" onClick={() => setOpen(!open)}>
                {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </div>

                <SidebarContent>
                    <SidebarGroup className="mt-4">
                        {open && (
                            <SidebarGroupLabel className="ph-group-label ft_clas">
                                FEATURES
                            </SidebarGroupLabel>
                        )}

                        <SidebarMenu>
                            {features.map((f) => (
                                <SidebarMenuItem key={f.id}>
                                    <SidebarMenuButton
                                        className={`ph-btn ${selectedFeature === f.id ? "ph-active" : ""}`}
                                        onClick={() => onFeatureSelect(f.id)}
                                    >
                                        <div className="ph-icon">{f.icon}</div>
                                        {open && <span>{f.label}</span>}
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </div> */}

            {/* <div className="ph-toggle" onClick={() => setOpen(!open)}>
                {open ? <FaBars size={18} /> : <IoClose size={18} />}
            </div> */}


             <div className={`ph-sidebar ${open ? "open" : "closed"}`}>
            <div className="ph-toggle" onClick={() => setOpen(!open)}>
                {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </div>


            <SidebarContent>
                <SidebarGroup className="mt-4">
                    {open && (
                        <SidebarGroupLabel className="ph-group-label ft_clas">
                            FEATURES
                        </SidebarGroupLabel>
                    )}

                    <SidebarMenu>
                        {features.map((f) => (
                            <SidebarMenuItem key={f.id}>
                                <SidebarMenuButton
                                    className={`ph-btn ${selectedFeature === f.id ? "ph-active" : ""}`}
                                    onClick={() => onFeatureSelect(f.id)}
                                >
                                    <div className="ph-icon">{f.icon}</div>
                                    {open && <span>{f.label}</span>}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </div>
        </>
    );
}

