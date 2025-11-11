// // import React from "react";
// // import { SidebarProvider } from "@/components/ui/sidebar";
// // import MainContent from "@/components/MainContent";
// // import { useMainContent } from "@/hooks/useMainContent";
// // import AppSidebar from "../components/AppSidebar";

// // const Index = () => {
// //   const mainContent = useMainContent();

// //   return (
// //     <SidebarProvider>
// //       <div className="flex min-h-screen w-full bg-background overflow-hidden">
// //         {/* ✅ Sidebar (fixed width) */}
// //         <AppSidebar onFeatureSelect={mainContent.handleFeatureClick} />

// //         {/* ✅ Main area grows fully and scrolls independently */}
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
// import MainContent from "@/components/MainContent";
// import { useMainContent } from "@/hooks/useMainContent";
// import AppSidebar from "../components/AppSidebar";

// const Index = () => {
//   const mainContent = useMainContent();
//   const {
//     selectedFeature,
//     selectedTask,
//     isLoading,
//     handleFeatureClick,
//     handleTaskSelect,
//   } = mainContent;

//   return (
//     <SidebarProvider>
//       <div className="flex min-h-screen w-full bg-background overflow-hidden">
//         {/* ✅ Sidebar */}
//         <AppSidebar
//           selectedFeature={selectedFeature}
//           selectedTask={selectedTask}
//           isLoading={isLoading}
//           onFeatureSelect={(id, type) => {
//             if (type === "task") {
//               handleTaskSelect(id);
//             } else {
//               handleFeatureClick(id);
//             }
//           }}
//         />

//         {/* ✅ Main area */}
//         <div className="flex-1 flex flex-col h-screen overflow-hidden">
//           <MainContent {...mainContent} />
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

// export default Index;
import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import MainContent from "@/components/MainContent";
import { useMainContent } from "@/hooks/useMainContent";
import AppSidebar from "../components/AppSidebar";

const Index = () => {
  const mainContent = useMainContent();
  const {
    selectedFeature,
    selectedTask,
    isLoading,
    handleFeatureClick,
    handleTaskSelect,
  } = mainContent;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        {/* ✅ Sidebar */}
        <AppSidebar
          selectedFeature={selectedFeature}
          selectedTask={selectedTask}
          isLoading={isLoading}
          onFeatureSelect={handleFeatureClick}   // ✅ for Zoho, MailMind, etc.
          onTaskSelect={handleTaskSelect}         // ✅ for JD Creator, Upload Resumes, etc.
        />

        {/* ✅ Main area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <MainContent {...mainContent} />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
