import React from "react";
import { LinkIcon, BrainIcon, CpuIcon } from "lucide-react";
import FeatureButton from "../features/FeatureButton";
import "./FeatureButtons.css";

const FeatureButtons = ({ selectedFeature, onFeatureClick }) => {
  const features = [
    { label: "ZohoBridge", icon: <LinkIcon className="feature-button-icon" /> },
    { label: "LinkedInPoster", icon: <LinkIcon className="feature-button-icon" /> },
    { label: "MailMind", icon: <BrainIcon className="feature-button-icon" /> },
    { label: "InterviewBot", icon: <BrainIcon className="feature-button-icon" /> },
    { label: "PrimeHireBrain", icon: <CpuIcon className="feature-button-icon" /> },
  ];

  return (
    <div className="feature-buttons-container">
      {features.map((btn) => (
        <FeatureButton
          key={btn.label}
          icon={btn.icon}
          label={btn.label}
          onClick={() => onFeatureClick(btn.label)}
          variant={selectedFeature === btn.label ? "default" : "outline"}
          className={`feature-button ${selectedFeature === btn.label ? `feature-button-active feature-button-${btn.color}` : `feature-button-inactive feature-button-${btn.color}`}`}
        />
      ))}
    </div>
  );
};

export default FeatureButtons;