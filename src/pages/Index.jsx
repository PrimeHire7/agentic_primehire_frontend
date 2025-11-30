// import React from "react";
// import Header from "@/common/Header";
// import MainContent from "@/components/MainContent";
// import ChatInput from "@/chat/ChatInput";
// import { useMainContent } from "@/hooks/useMainContent";

// export default function Index() {
//   const main = useMainContent();

//   return (
//     <div className="ph-root">

//       <Header onRefresh={main.handleRefresh} />

//       <div className="ph-chat-area">
//         <MainContent {...main} />
//       </div>

//       <ChatInput onSend={main.handleSend} {...main} />

//     </div>
//   );
// }
import React from "react";
import Header from "@/common/Header";
import MainContent from "@/components/MainContent";
import { useMainContent } from "@/hooks/useMainContent";

export default function Index() {
  const main = useMainContent();

  return (
    <div className="page-main">
      <Header onRefresh={main.handleRefresh} />
      <MainContent {...main} />
    </div>
  );
}
