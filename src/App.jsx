import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificateData from "./pages/CertificateData";

import WebcamRecorder from "@/interview/WebcamRecorder";
import InstructionsPanel from "@/interview/InstructionsPanel";   // ✅ FIXED IMPORT
import CandidateOverview from "./CandidateStatus/CandidateOverview";
import CandidateStatus from "./CandidateStatus/CandidateStatus";
import ValidationPanel from "@/interview/ValidationPanel";
import Scheduler from "@/components/Scheduler";
import InterviewMode from "@/interview/InterviewMode";

const queryClient = new QueryClient();

export default function App() {
    console.log("🔥🔥 APP.JSX IS RENDERING");

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />

                        <Route path="/webcam-recorder" element={<WebcamRecorder />} />
                        <Route path="/certificatedata" element={<CertificateData />} />

                        {/* ✅ Correct Instructions Route */}
                        <Route path="/instructions" element={<InstructionsPanel />} />

                        <Route path="/candidate-status/:jd_id" element={<CandidateStatus />} />
                        <Route path="/candidate/:id" element={<CandidateOverview />} />
                        <Route path="/interview" element={<InterviewMode />} />
                        <Route
                            path="/validation_panel"
                            element={
                                sessionStorage.getItem("interview_started") === "true"
                                    ? <Navigate to="/interview" replace />
                                    : <ValidationPanel />
                            }
                        />
                        <Route path="/scheduler" element={<Scheduler />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>

            </TooltipProvider>
        </QueryClientProvider>
    );
}
// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Index from "./pages/Index";
// import CertificateData from "./pages/CertificateData";

// import WebcamRecorder from "@/interview/WebcamRecorder";
// import InstructionsPanel from "@/interview/InstructionsPanel";
// import CandidateOverview from "./CandidateStatus/CandidateOverview";
// import CandidateStatus from "./CandidateStatus/CandidateStatus";
// import ValidationPanel from "@/interview/ValidationPanel";
// import Scheduler from "@/components/Scheduler";
// import InterviewMode from "@/interview/InterviewMode";

// const queryClient = new QueryClient();

// export default function App() {
//     console.log("🔥🔥 APP.JSX IS RENDERING");

//     return (
//         <QueryClientProvider client={queryClient}>
//             <TooltipProvider>
//                 <Toaster />
//                 <Sonner />

//                 <BrowserRouter>
//                     <Routes>
//                         {/* 🔒 deterministic root */}
//                         <Route path="/" element={<Navigate to="/validation_panel" replace />} />

//                         {/* <Route path="/validation_panel" element={<ValidationPanel />} /> */}
//                         <Route
//                             path="/validation_panel"
//                             element={
//                                 sessionStorage.getItem("INTERVIEW_STARTED") === "true"
//                                     ? <InterviewMode />
//                                     : <ValidationPanel />
//                             }
//                         />

//                         <Route path="/instructions" element={<InstructionsPanel />} />
//                         <Route path="/interview" element={<InterviewMode />} />

//                         <Route path="/certificatedata" element={<CertificateData />} />
//                         <Route path="/candidate-status/:jd_id" element={<CandidateStatus />} />
//                         <Route path="/candidate/:id" element={<CandidateOverview />} />
//                         <Route path="/webcam-recorder" element={<WebcamRecorder />} />
//                         <Route path="/scheduler" element={<Scheduler />} />

//                         {/* 🚫 NO NotFound COMPONENT */}
//                         <Route path="*" element={<Navigate to="/" replace />} />
//                     </Routes>
//                 </BrowserRouter>
//             </TooltipProvider>
//         </QueryClientProvider>
//     );
// }
