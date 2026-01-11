import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/primehire_logo.png";
import "./InstructionsPrompt.css";

export default function InstructionsPrompt() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const candidateName = location.state?.candidateName || null;
  const candidateId = location.state?.candidateId || null;
  const jd_id = location.state?.jd_id || null;
  const jd_text = location.state?.jd_text || "";

  console.log("📥 InstructionsPrompt received:", {
    candidateName,
    candidateId,
    jd_id,
    jd_text,
  });

  const handleStart = () => {
    if (!candidateName || !candidateId) {
      alert("❌ Missing candidate details. Please go back and validate again.");
      return;
    }

    navigate("/webcam-recorder", {
      state: {
        candidateName,
        candidateId,
        jd_id,
        jd_text,
      },
    });
  };

  return (
    <div className="instructions-wrapper">
      <nav className="instructions-navbar">
        <img src={logo} alt="PrimeHire Logo" className="navbar-logo" />
      </nav>

      <Card className="instructions-card">
        <CardHeader className="instructions-header">
          <CardTitle className="instructions-title">
            Interview Instructions
          </CardTitle>
        </CardHeader>

        <CardContent className="card-content">
          <p>Please read and accept the instructions before continuing.</p>

          <ul className="instructions-list">
            <li>
              Interview duration is <strong>20 minutes</strong>.
            </li>
            <li>
              The interview will be recorded (
              <strong>video + audio + responses</strong>).
            </li>
            <li>
              <strong>AI Proctoring Enabled:</strong> face recognition,
              eye-tracking, voice detection, and identity verification.
            </li>
            <li>
              <strong>Multiple faces</strong> or background voices will
              automatically be flagged.
            </li>
            <li>
              <strong>
                Tab switching, screen minimizing, or copying/pasting
              </strong>{" "}
              will result in automatic warnings and may terminate the interview.
            </li>
            <li>
              Maintain <strong>eye contact with the camera</strong> at all
              times.
            </li>
            <li>
              Use the <strong>Record</strong> button to record your answer and{" "}
              <strong>Stop & Submit</strong> when finished. Answers cannot be
              retaken.
            </li>
            <li>
              Use your own device in a quiet, well-lit environment. Do not use
              earphones or external help.
            </li>
            <li>
              Your data is used strictly for evaluation and compliance purposes.
              Do not share personal or sensitive information.
            </li>
            <li>
              Ensure your camera, microphone, and internet connection are
              working properly before starting.
            </li>
          </ul>

          <div className="confirm-checkbox">
            <Checkbox
              id="agree-checkbox"
              checked={checked}
              onCheckedChange={setChecked}
            />

            <label htmlFor="agree-checkbox" className="checkbox-label">
              I agree to the above instructions.
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            disabled={!checked}
            onClick={handleStart}
            className="start-btn"
          >
            Start Interview
          </Button>
        </CardFooter>
      </Card>

      <div style={{ marginTop: 20, opacity: 0.8 }}>
        Debug: {candidateName} | {candidateId} | JD_ID: {jd_id}
      </div>
    </div>
  );
}
