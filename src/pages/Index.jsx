import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";

import AppSidebar from "@/components/AppSidebar/AppSidebar";
import Header from "@/common/Header";
import MainContent from "@/components/MainContent";
import ChatInput from "@/chat/ChatInput";
import { useMainContent } from "@/hooks/useMainContent";

import "@/styles/layout.css";

export default function Index() {
  const main = useMainContent();

  return (
    <SidebarProvider>
      {/* Entire page shifted under header */}
      <div className="ph-layout">

        {/* LEFT SIDEBAR */}
        <aside className="ph-sidebar">
          <AppSidebar
            selectedFeature={main.selectedFeature}
            selectedTask={main.selectedTask}
            onFeatureSelect={main.handleFeatureClick}
            onTaskSelect={main.handleTaskSelect}
          />
        </aside>

        {/* RIGHT SIDE PANEL */}
        <div className="ph-main">

          {/* FIXED HEADER */}
          <div className="ph-header">
            <Header onRefresh={main.handleRefresh} />
          </div>

          {/* SCROLLABLE CONTENT */}
          <div className="ph-main-scroll">
            <MainContent {...main} />
          </div>

          {/* FIXED CHAT INPUT */}
          {/* FIXED CHAT INPUT */}
          {main.showChatInput && (
            <div className="ph-chatinput-fixed">
              <ChatInput
                onSend={main.handleSend}
                activeTask={main.selectedTask}
                forceShowChips={true}
              />
            </div>
          )}


        </div>
      </div>
    </SidebarProvider>
  );
}
