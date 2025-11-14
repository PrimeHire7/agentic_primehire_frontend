// // // // import React from "react";
// // // // import { SidebarProvider } from "@/components/ui/sidebar";
// // // // import MainContent from "@/components/MainContent";
// // // // import { useMainContent } from "@/hooks/useMainContent";
// // // // import AppSidebar from "../components/AppSidebar";

// // // // const Index = () => {
// // // //   const mainContent = useMainContent();

// // // //   return (
// // // //     <SidebarProvider>
// // // //       <div className="flex min-h-screen w-full bg-background overflow-hidden">
// // // //         {/* ✅ Sidebar (fixed width) */}
// // // //         <AppSidebar onFeatureSelect={mainContent.handleFeatureClick} />

// // // //         {/* ✅ Main area grows fully and scrolls independently */}
// // // //         <div className="flex-1 flex flex-col h-screen overflow-hidden">
// // // //           <MainContent {...mainContent} />
// // // //         </div>
// // // //       </div>
// // // //     </SidebarProvider>
// // // //   );
// // // // };

// // // // export default Index;
// // // import React from "react";
// // // import { SidebarProvider } from "@/components/ui/sidebar";
// // // import MainContent from "@/components/MainContent";
// // // import { useMainContent } from "@/hooks/useMainContent";
// // // import AppSidebar from "../components/AppSidebar";

// // // const Index = () => {
// // //   const mainContent = useMainContent();
// // //   const {
// // //     selectedFeature,
// // //     selectedTask,
// // //     isLoading,
// // //     handleFeatureClick,
// // //     handleTaskSelect,
// // //   } = mainContent;

// // //   return (
// // //     <SidebarProvider>
// // //       <div className="flex min-h-screen w-full bg-background overflow-hidden">
// // //         {/* ✅ Sidebar */}
// // //         <AppSidebar
// // //           selectedFeature={selectedFeature}
// // //           selectedTask={selectedTask}
// // //           isLoading={isLoading}
// // //           onFeatureSelect={(id, type) => {
// // //             if (type === "task") {
// // //               handleTaskSelect(id);
// // //             } else {
// // //               handleFeatureClick(id);
// // //             }
// // //           }}
// // //         />

// // //         {/* ✅ Main area */}
// // //         <div className="flex-1 flex flex-col h-screen overflow-hidden">
// // //           <MainContent {...mainContent} />
// // //         </div>
// // //       </div>
// // //     </SidebarProvider>
// // //   );
// // // };

// // // export default Index;
// // import React from "react";
// // import { SidebarProvider } from "@/components/ui/sidebar";
// // import MainContent from "@/components/MainContent";
// // import { useMainContent } from "@/hooks/useMainContent";
// // import AppSidebar from "../components/AppSidebar";

// // const Index = () => {
// //   const mainContent = useMainContent();
// //   const {
// //     selectedFeature,
// //     selectedTask,
// //     isLoading,
// //     handleFeatureClick,
// //     handleTaskSelect,
// //   } = mainContent;

// //   return (
// //     <SidebarProvider>
// //       <div className="flex min-h-screen w-full bg-background overflow-hidden">
// //         {/* ✅ Sidebar */}
// //         <AppSidebar
// //           selectedFeature={selectedFeature}
// //           selectedTask={selectedTask}
// //           isLoading={isLoading}
// //           onFeatureSelect={handleFeatureClick}   // ✅ for Zoho, MailMind, etc.
// //           onTaskSelect={handleTaskSelect}         // ✅ for JD Creator, Upload Resumes, etc.
// //         />

// //         {/* ✅ Main area */}
// //         <div className="flex-1 flex flex-col h-screen overflow-hidden">
// //           <MainContent {...mainContent} />
// //         </div>
// //       </div>
// //     </SidebarProvider>
// //   );
// // };

// // export default Index;
// import React from "react";
// import { SidebarProvider } from "@/components/ui/sidebar";
// import AppSidebar from "@/components/AppSidebar";
// import MainContent from "@/components/MainContent";
// import { useMainContent } from "@/hooks/useMainContent";
// import Header from "@/common/Header"; // ✅ Import Header at top level

// const Index = () => {
//   const mainContent = useMainContent();
//   const {
//     selectedFeature,
//     selectedTask,
//     isLoading,
//     handleFeatureClick,
//     handleTaskSelect,
//     handleRefresh, // ✅ So we can refresh from header
//   } = mainContent;

//   return (
//     <SidebarProvider>
//       {/* ✅ Sidebar + Main Layout */}
//       <div className="flex w-full h-[100dvh] bg-background overflow-hidden">


//         {/* Sidebar */}
//         <AppSidebar
//           selectedFeature={selectedFeature}
//           selectedTask={selectedTask}
//           isLoading={isLoading}
//           onFeatureSelect={handleFeatureClick}
//           onTaskSelect={handleTaskSelect}
//         />

//         {/* Main Area */}
//         <div className="flex-1 flex flex-col h-screen overflow-hidden">
//           {/* ✅ Header (can toggle sidebar + refresh chat) */}
//           <Header onRefresh={handleRefresh} />

//           {/* ✅ Main Chat & Features */}
//           <MainContent {...mainContent} />
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar"; // ✅ must wrap AppSidebar
import AppSidebar from "@/components/AppSidebar";
import MainContent from "@/components/MainContent";
import { useMainContent } from "@/hooks/useMainContent";
import Header from "@/common/Header"; // ✅ top header bar

const Index = () => {
  const mainContent = useMainContent();
  const {
    selectedFeature,
    selectedTask,
    isLoading,
    handleFeatureClick,
    handleTaskSelect,
    handleRefresh,
  } = mainContent;

  return (
    <SidebarProvider>
      {/* ✅ Full layout wrapper */}
      <div className="flex w-full h-[100dvh] bg-background overflow-hidden">

        {/* ✅ Sidebar */}
        <AppSidebar
          selectedFeature={selectedFeature}
          selectedTask={selectedTask}
          isLoading={isLoading}
          onFeatureSelect={handleFeatureClick}
          onTaskSelect={handleTaskSelect}
        />

        {/* ✅ Main Content Area */}
        <div className="flex flex-1 flex-col h-[100dvh] overflow-hidden">
          {/* Header stays fixed at top */}
          <Header onRefresh={handleRefresh} />

          {/* Scrollable chat / features */}
          <main className="main-content flex-1 overflow-y-auto">
            <MainContent {...mainContent} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
