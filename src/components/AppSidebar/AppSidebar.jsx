import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import { FileText, Brain, Cpu, LogOut } from "lucide-react";
import { FaUserCheck, FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

import "./AppSidebar.css";

const features = [
  { id: "MailMind", label: "MailMind", icon: <Cpu size={18} /> },
  { id: "PrimeHireBrain", label: "PrimeHire Brain", icon: <Brain size={18} /> },
  { id: "JDHistory", label: "JD History", icon: <FileText size={18} /> },
  { id: "CandidateStatus", label: "Candidates Status", icon: <FaUserCheck size={18} /> },
];

export default function AppSidebar({
  open,
  setOpen,
  selectedFeature,
  onFeatureSelect,
}) {

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className={`ph-sidebar-inner ${open ? "open" : "closed"}`}>

      {/* TOGGLE BUTTON */}
      <div className="ph-toggle" onClick={() => setOpen(!open)}>
        {open ? <IoClose size={20} /> : <FaBars size={20} />}
      </div>

      <SidebarContent className="flex flex-col h-full">

        {/* FEATURES */}
        <SidebarGroup className="mt-4 flex-1">
          {open && (
            <SidebarGroupLabel className="ph-group-label ft_clas">
              FEATURES
            </SidebarGroupLabel>
          )}

          <SidebarMenu>
            {features.map((f) => (
              <SidebarMenuItem key={f.id}>
                <SidebarMenuButton
                  className={selectedFeature === f.id ? "ph-active" : ""}
                  onClick={() => {
                    onFeatureSelect(f.id);
                    setOpen(false);
                  }}
                >
                  <div className="ph-icon">{f.icon}</div>
                  {open && <span>{f.label}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* 🔴 LOGOUT SECTION (BOTTOM) */}
        <div className="ph-logout">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="ph-logout-btn"
                onClick={handleLogout}
              >
                <div className="ph-icon">
                  <LogOut size={18} />
                </div>
                {open && <span>Logout</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>

      </SidebarContent>
    </div>
  );
}
