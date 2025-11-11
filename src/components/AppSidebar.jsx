// import React, { useEffect, useRef, useState } from "react";
// import {
//     Link as LinkIcon,
//     Brain as BrainIcon,
//     Cpu as CpuIcon,
//     FileText as FileTextIcon,
//     Users as UsersIcon,
//     Upload as UploadIcon,
//     History as HistoryIcon,
//     Loader2 as LoaderIcon,
//     CheckCircle2 as CheckIcon,
//     Bot as BotIcon,
//     MessageSquare as MessageSquareIcon,
//     Share2 as ShareIcon,
// } from "lucide-react";

// import {
//     Sidebar,
//     SidebarContent,
//     SidebarGroup,
//     SidebarGroupContent,
//     SidebarGroupLabel,
//     SidebarMenu,
//     SidebarMenuButton,
//     SidebarMenuItem,
//     useSidebar,
// } from "@/components/ui/sidebar";

// import "./AppSidebar.css";

// // ✅ Features list (tool integrations)
// const features = [
//     { id: "ZohoBridge", label: "ZohoBridge", icon: <LinkIcon className="h-4 w-4" /> },
//     { id: "MailMind", label: "MailMind", icon: <BrainIcon className="h-4 w-4" /> },
//     { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <CpuIcon className="h-4 w-4" /> },
//     { id: "InterviewBot", label: "Interview Bot", icon: <BotIcon className="h-4 w-4" /> },
//     { id: "LinkedInPoster", label: "LinkedIn Poster", icon: <ShareIcon className="h-4 w-4" /> },
//     { id: "ProfileMatchHistory", label: "Match History", icon: <HistoryIcon className="h-4 w-4" /> },
// ];

// // ✅ Task list (main workflows)
// const tasks = [
//     { id: "JD Creator", label: "JD Creator", icon: <FileTextIcon className="h-4 w-4" /> },
//     { id: "Profile Matcher", label: "Profile Matcher", icon: <UsersIcon className="h-4 w-4" /> },
//     { id: "Upload Resumes", label: "Upload Resumes", icon: <UploadIcon className="h-4 w-4" /> },
// ];

// export default function AppSidebar({
//     selectedFeature,
//     selectedTask,
//     isLoading,
//     onFeatureSelect,
// }) {
//     const { open, setOpen } = useSidebar();
//     const activeRef = useRef(null);
//     const autoExpandTimeout = useRef(null);
//     const [recentActive, setRecentActive] = useState(null);

//     const handleClick = (id) => {
//         if (onFeatureSelect) {
//             const type = features.some((f) => f.id === id) ? "feature" : "task";
//             onFeatureSelect(id, type);
//         }
//     };


//     const isSelected = (id) => id === selectedFeature || id === selectedTask;

//     // ✅ Smart expand + pulse highlight when feature/task changes
//     useEffect(() => {
//         const currentActive = selectedFeature || selectedTask;
//         if (!currentActive) return;

//         setRecentActive(currentActive);

//         if (!open) {
//             setOpen(true);
//             autoExpandTimeout.current = setTimeout(() => setOpen(false), 2500);
//         }

//         if (activeRef.current) {
//             activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
//             activeRef.current.classList.add("pulse-highlight");
//             setTimeout(() => {
//                 activeRef.current?.classList.remove("pulse-highlight");
//             }, 1500);
//         }

//         return () => clearTimeout(autoExpandTimeout.current);
//     }, [selectedFeature, selectedTask, open, setOpen]);

//     // ✅ UI rendering helper with live state indicator
//     const renderButtonContent = (item) => {
//         const active = isSelected(item.id);
//         const isTask = tasks.find((t) => t.id === item.id);
//         const running =
//             (active && isTask && isLoading) ||
//             (active && item.id === "Profile Matcher" && window.__PROFILE_MATCH_MODE_ACTIVE__);

//         const completed =
//             recentActive === item.id &&
//             !isLoading &&
//             !window.__PROFILE_MATCH_MODE_ACTIVE__ &&
//             !window.__JD_MODE_ACTIVE__;

//         return (
//             <div className="w-full flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                     {item.icon}
//                     {open && <span>{item.label}</span>}
//                 </div>

//                 {/* 🔵 Live indicator */}
//                 {active && (
//                     <span className="relative flex items-center">
//                         {running ? (
//                             <LoaderIcon className="animate-spin text-blue-400 h-4 w-4" />
//                         ) : completed ? (
//                             <CheckIcon className="text-green-500 h-4 w-4 animate-bounce" />
//                         ) : (
//                             <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse ml-2" />
//                         )}
//                     </span>
//                 )}
//             </div>
//         );
//     };

//     return (
//         <Sidebar collapsible="icon">
//             <SidebarContent>
//                 {/* ===== FEATURES ===== */}
//                 <SidebarGroup>
//                     <SidebarGroupLabel>{open && "Features"}</SidebarGroupLabel>
//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {features.map((f) => (
//                                 <SidebarMenuItem key={f.id}>
//                                     <SidebarMenuButton asChild>
//                                         <button
//                                             ref={isSelected(f.id) ? activeRef : null}
//                                             className={`w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 ${isSelected(f.id)
//                                                 ? "bg-primary text-white shadow-md scale-[1.03]"
//                                                 : "hover:bg-muted text-gray-800"
//                                                 }`}
//                                             onClick={() => handleClick(f.id)}
//                                         >
//                                             {renderButtonContent(f)}
//                                         </button>
//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             ))}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>

//                 {/* ===== TASKS ===== */}
//                 <SidebarGroup>
//                     <SidebarGroupLabel>{open && "Tasks"}</SidebarGroupLabel>
//                     <SidebarGroupContent>
//                         <SidebarMenu>
//                             {tasks.map((t) => (
//                                 <SidebarMenuItem key={t.id}>
//                                     <SidebarMenuButton asChild>
//                                         <button
//                                             ref={isSelected(t.id) ? activeRef : null}
//                                             className={`w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 ${isSelected(t.id)
//                                                 ? "bg-primary text-white shadow-md scale-[1.03]"
//                                                 : "hover:bg-muted text-gray-800"
//                                                 }`}
//                                             onClick={() => handleClick(t.id)}
//                                         >
//                                             {renderButtonContent(t)}
//                                         </button>
//                                     </SidebarMenuButton>
//                                 </SidebarMenuItem>
//                             ))}
//                         </SidebarMenu>
//                     </SidebarGroupContent>
//                 </SidebarGroup>
//             </SidebarContent>
//         </Sidebar>
//     );
// }
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

// ✅ Feature list (modules)
const features = [
    { id: "ZohoBridge", label: "ZohoBridge", icon: <LinkIcon className="h-4 w-4" /> },
    { id: "MailMind", label: "MailMind", icon: <BrainIcon className="h-4 w-4" /> },
    { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <CpuIcon className="h-4 w-4" /> },
    { id: "InterviewBot", label: "Interview Bot", icon: <BotIcon className="h-4 w-4" /> },
    { id: "LinkedInPoster", label: "LinkedIn Poster", icon: <Share2 className="h-4 w-4" /> },
    { id: "ProfileMatchHistory", label: "Match History", icon: <HistoryIcon className="h-4 w-4" /> },
];

// ✅ Task list (main workflows)
const tasks = [
    { id: "JD Creator", label: "JD Creator", icon: <FileTextIcon className="h-4 w-4" /> },
    { id: "Profile Matcher", label: "Profile Matcher", icon: <UsersIcon className="h-4 w-4" /> },
    { id: "Upload Resumes", label: "Upload Resumes", icon: <UploadIcon className="h-4 w-4" /> },
];

export default function AppSidebar({
    selectedFeature,
    selectedTask,
    isLoading,
    onFeatureSelect,
    onTaskSelect, // ✅ this connects task clicks
}) {
    const { open, setOpen } = useSidebar();
    const activeRef = useRef(null);
    const autoExpandTimeout = useRef(null);
    const [recentActive, setRecentActive] = useState(null);

    // 🧭 Handles clicks on features or tasks
    const handleClick = (id) => {
        const isFeature = features.some((f) => f.id === id);
        const isTask = tasks.some((t) => t.id === id);

        if (isFeature && typeof onFeatureSelect === "function") {
            console.log("🧭 Sidebar feature clicked:", id);
            onFeatureSelect(id, "feature");
        } else if (isTask && typeof onTaskSelect === "function") {
            console.log("🧩 Sidebar task clicked:", id);
            onTaskSelect(id, "task");
        }
    };

    const isSelected = (id) => id === selectedFeature || id === selectedTask;

    // 🔄 Auto-expand sidebar and pulse active button
    useEffect(() => {
        const currentActive = selectedFeature || selectedTask;
        if (!currentActive) return;

        setRecentActive(currentActive);

        if (!open) {
            setOpen(true);
            autoExpandTimeout.current = setTimeout(() => setOpen(false), 2500);
        }

        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            activeRef.current.classList.add("pulse-highlight");
            setTimeout(() => {
                activeRef.current?.classList.remove("pulse-highlight");
            }, 1500);
        }

        return () => clearTimeout(autoExpandTimeout.current);
    }, [selectedFeature, selectedTask, open, setOpen]);

    // 💡 Renders button with live indicators
    const renderButtonContent = (item) => {
        const active = isSelected(item.id);
        const isTask = tasks.find((t) => t.id === item.id);

        const running =
            (active && isTask && isLoading) ||
            (active && item.id === "Profile Matcher" && window.__PROFILE_MATCH_MODE_ACTIVE__);

        const completed =
            recentActive === item.id &&
            !isLoading &&
            !window.__PROFILE_MATCH_MODE_ACTIVE__ &&
            !window.__JD_MODE_ACTIVE__;

        return (
            <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {item.icon}
                    {open && <span>{item.label}</span>}
                </div>

                {active && (
                    <span className="relative flex items-center">
                        {running ? (
                            <LoaderIcon className="animate-spin text-blue-400 h-4 w-4" />
                        ) : completed ? (
                            <CheckIcon className="text-green-500 h-4 w-4 animate-bounce" />
                        ) : (
                            <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse ml-2" />
                        )}
                    </span>
                )}
            </div>
        );
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarContent>
                {/* ===== FEATURES ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>{open && "Features"}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {features.map((f) => (
                                <SidebarMenuItem key={f.id}>
                                    <SidebarMenuButton asChild>
                                        <button
                                            ref={isSelected(f.id) ? activeRef : null}
                                            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 ${isSelected(f.id)
                                                ? "bg-primary text-white shadow-md scale-[1.03]"
                                                : "hover:bg-muted text-gray-800"
                                                }`}
                                            onClick={() => handleClick(f.id)}
                                        >
                                            {renderButtonContent(f)}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* ===== TASKS ===== */}
                <SidebarGroup>
                    <SidebarGroupLabel>{open && "Tasks"}</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {tasks.map((t) => (
                                <SidebarMenuItem key={t.id}>
                                    <SidebarMenuButton asChild>
                                        <button
                                            ref={isSelected(t.id) ? activeRef : null}
                                            className={`w-full flex items-center gap-2 px-2 py-1 rounded-md transition-all duration-200 ${isSelected(t.id)
                                                ? "bg-primary text-white shadow-md scale-[1.03]"
                                                : "hover:bg-muted text-gray-800"
                                                }`}
                                            onClick={() => handleClick(t.id)}
                                        >
                                            {renderButtonContent(t)}
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
