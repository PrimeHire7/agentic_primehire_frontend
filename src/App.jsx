import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificateData from "./pages/CertificateData";
// import WebcamRecorder from "./InterviewBot/WebcamRecorder";
// import InstructionsPrompt from "./InterviewBot/InstructionsPrompt";
import WebcamRecorder from "@/interview/WebcamRecorder";
import InstructionsPrompt from "@/interview/InstructionsPanel";
import CandidateOverview from "./CandidateStatus/CandidateOverview";
import CandidateStatus from "./CandidateStatus/CandidateStatus";
import ValidationPanel from "@/interview/ValidationPanel";
import Scheduler from "@/components/Scheduler";
import { InspectionPanel } from "lucide-react";

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
                        <Route path="/instructions" element={<InspectionPanel />} />

                        <Route path="/candidate-status/:jd_id" element={<CandidateStatus />} />
                        <Route path="/candidate/:id" element={<CandidateOverview />} />

                        <Route path="/validation_panel" element={<ValidationPanel />} />
                        <Route path="/scheduler" element={<Scheduler />} />

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>

            </TooltipProvider>
        </QueryClientProvider>
    );
}
