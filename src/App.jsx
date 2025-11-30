// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import CertificateData from "./pages/CertificateData";
// import WebcamRecorder from "./InterviewBot/WebcamRecorder";
// import InstructionsPrompt from "./InterviewBot/InstructionsPrompt";
// import CandidateOverview from "./CandidateStatus/CandidateOverview";
// import CandidateStatus from "./CandidateStatus/CandidateStatus";
// import ValidationPanel from "./InterviewBot/ValidationPanel";
// import Scheduler from "@/components/Scheduler";

// const queryClient = new QueryClient();

// const App = () => (
//     <QueryClientProvider client={queryClient}>
//         <TooltipProvider>
//             <Toaster />
//             <Sonner />
//             <BrowserRouter>
//                 <Routes>
//                     <Route path="/" element={<Index />} />
//                     <Route path="/webcam-recorder" element={<WebcamRecorder />} />
//                     <Route path="/certificatedata" element={<CertificateData />} />
//                     <Route path="/instructions" element={<InstructionsPrompt />} />
//                     <Route path="/candidate-status/:jd_id" element={<CandidateStatus />} />
//                     <Route path="/candidate/:id" element={<CandidateOverview />} />
//                     <Route path="/validation_panel" element={<ValidationPanel />} />
//                     <Route path="/scheduler" element={<Scheduler />} />
//                     <Route path="*" element={<NotFound />} />
//                 </Routes>
//             </BrowserRouter>
//         </TooltipProvider>
//     </QueryClientProvider>
// );

// export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <div className="page-root">
                        <Routes>
                            <Route path="/" element={<Index />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
}
