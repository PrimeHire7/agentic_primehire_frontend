import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


import Login from "./pages/Login";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CertificateData from "./pages/CertificateData";
import ProtectedRoute from "./auth/ProtectedRoute";
import WebcamRecorder from "@/interview/WebcamRecorder";
import InstructionsPanel from "@/interview/InstructionsPanel";
import CandidateOverview from "./CandidateStatus/CandidateOverview";
import CandidateStatus from "./CandidateStatus/CandidateStatus";
import ValidationPanel from "@/interview/ValidationPanel";
import Scheduler from "@/components/Scheduler";
import InterviewMode from "@/interview/InterviewMode";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>

            {/* 🔓 PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* 🔒 PROTECTED ROOT */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />

            {/* 🔒 PROTECTED ROUTES */}
            <Route
              path="/webcam-recorder"
              element={<ProtectedRoute><WebcamRecorder /></ProtectedRoute>}
            />

            <Route
              path="/certificatedata"
              element={<ProtectedRoute><CertificateData /></ProtectedRoute>}
            />

            <Route
              path="/instructions"
              element={<ProtectedRoute><InstructionsPanel /></ProtectedRoute>}
            />

            <Route
              path="/candidate-status/:jd_id"
              element={<ProtectedRoute><CandidateStatus /></ProtectedRoute>}
            />

            <Route
              path="/candidate/:id"
              element={<ProtectedRoute><CandidateOverview /></ProtectedRoute>}
            />

            <Route
              path="/interview"
              element={<ProtectedRoute><InterviewMode /></ProtectedRoute>}
            />

            <Route
              path="/validation_panel"
              element={
                <ProtectedRoute>
                  {sessionStorage.getItem("interview_started") === "true"
                    ? <Navigate to="/interview" replace />
                    : <ValidationPanel />}
                </ProtectedRoute>
              }
            />

            <Route
              path="/scheduler"
              element={<ProtectedRoute><Scheduler /></ProtectedRoute>}
            />

            {/* ❌ NOT FOUND */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  );
}
