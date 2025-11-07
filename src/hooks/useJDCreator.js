import { useState, useCallback } from "react";
import { generateJd } from "@/utils/api"; // ✅ Import generateJd

const jdSteps = [
  "role", "location", "experience", "jobType", 
  "skillsMandatory", "skillsPreferred", "responsibilities", 
  "company_name", "about", "perks"
];

const stepPrompts = {
  role: "👉 What is the job title / role?",
  location: "📍 Where is the job located? (City or Remote)",
  experience: "💼 What is the experience required?",
  jobType: "📌 Job type (Full-time / Contract / Remote)?",
  skillsMandatory: "✍ List the mandatory skills (comma separated).",
  skillsPreferred: "✨ List the preferred skills (comma separated).",
  responsibilities: "📝 Provide key responsibilities (optional, can skip).",
  company_name: "🏢 What is the company name?",
  about: "🏢 Provide a short description about the role/company (optional).",
  perks: "🎁 Any perks or benefits to highlight? (optional).",
};

export const useJDCreator = (setMessages, setIsLoading) => {
  const [jdAnswers, setJdAnswers] = useState([]);
  const [currentJdInput, setCurrentJdInput] = useState("");
  const [currentJdStep, setCurrentJdStep] = useState(jdSteps[0]);

  const handleJdProcess = useCallback((userMessage) => {
    const stepIndex = jdAnswers.length;
    const stepKey = currentJdStep || jdSteps[stepIndex];

    let value = userMessage;
    if (stepKey === "skillsMandatory" || stepKey === "skillsPreferred") {
      value = userMessage.split(",").map(s => s.trim()).filter(Boolean);
    }

    const newAnswers = [...jdAnswers, { step: stepKey, value }];
    setJdAnswers(newAnswers);

    if (newAnswers.length < jdSteps.length) {
      const nextStep = jdSteps[newAnswers.length];
      setCurrentJdStep(nextStep);

      setTimeout(() => {
        setMessages(prev => [...prev, { role: "assistant", content: stepPrompts[nextStep] }]);
        setIsLoading(false);
      }, 200);
    } else {
      setCurrentJdStep(null);
      const jdInputObj = newAnswers.reduce((acc, item) => {
        acc[item.step] = item.value;
        return acc;
      }, {});
      
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "✅ Generating LinkedIn-ready JD… Please wait." }
      ]);
      
      generateJd(jdInputObj, setMessages, setIsLoading);
    }
  }, [jdAnswers, currentJdStep, setMessages, setIsLoading]);

  const handleJdSend = useCallback((message) => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
    handleJdProcess(message);
    setCurrentJdInput("");
  }, [handleJdProcess, setMessages, setIsLoading]);

  return {
    jdAnswers,
    currentJdInput,
    setCurrentJdInput,
    currentJdStep,
    handleJdProcess,
    handleJdSend
  };
};