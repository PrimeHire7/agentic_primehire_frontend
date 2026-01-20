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

  // ✅ Sidebar CLOSED by default
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <div
        className="ph-layout"
        data-state={sidebarOpen ? "open" : "collapsed"}
      >
        {/* LEFT SIDEBAR */}
        <aside className="ph-sidebar">
          <AppSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            selectedFeature={main.selectedFeature}
            onFeatureSelect={main.handleFeatureClick}
          />
        </aside>

        {/* RIGHT SIDE PANEL */}
        <div className="ph-main">
          {/* FIXED HEADER */}
          <Header onRefresh={main.handleRefresh} />

          {/* SCROLL AREA */}
          <div className="ph-main-scroll">
            <MainContent {...main} />
          </div>

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
