import { API_BASE } from "./constants";

// Utility function (make sure it's available to all functions)
const normalizeArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string")
    return val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
};

export const generateJd = async (inputs, setMessages, setIsLoading) => {
  const payload = {
    role: inputs.role || "",
    location: inputs.location || "",
    years: parseInt(inputs.experience) || 0,
    job_type: inputs.jobType || "Full-time",
    skills: [
      ...(Array.isArray(inputs.skillsMandatory) ? inputs.skillsMandatory : []),
      ...(Array.isArray(inputs.skillsPreferred) ? inputs.skillsPreferred : []),
    ],
    responsibilities: normalizeArray(inputs.responsibilities),
    about_company: inputs.about || "",
    qualifications: normalizeArray(inputs.perks),
  };

  try {
    const response = await fetch(`${API_BASE}/mcp/tools/jd/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok)
      throw new Error(`JD generation failed: ${response.status}`);

    const result = await response.json();
    const jdText = result?.result?.markdown_jd || "";
    window.__LAST_GENERATED_JD__ = jdText;

    // -----------------------------------------
    // ✅ SHOW GENERATED JD IN CHAT
    // -----------------------------------------
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: jdText || "✅ JD generated",
      },
    ]);

    // -----------------------------------------
    // ✅ SAVE JD TO DATABASE
    // -----------------------------------------
    const designation = inputs.role || "";
    const skills = [
      ...(inputs.skillsMandatory || []),
      ...(inputs.skillsPreferred || []),
    ].join(", ");

    await fetch(`${API_BASE}/mcp/tools/jd_history/jd/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        designation,
        skills,
        jd_text: jdText,
      }),
    });

    console.log("💾 JD saved to DB successfully!");
  } catch (err) {
    console.error("❌ generateJd error:", err);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "❌ Failed to generate JD. Please try again.",
      },
    ]);
  } finally {
    setIsLoading(false);
  }
};


export const uploadResumes = async (files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE}/mcp/tools/resume/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Status ${response.status} - ${text}`);
  }

  return await response.json();
};

export const sendMailMessage = async (item) => {
  try {
    const email = item.email?.trim();
    if (!email) {
      alert("⚠️ No email address available for this candidate");
      return;
    }

    const messageText = `Hi ${item.name}, are you available for the interview?`;

    const response = await fetch(`${API_BASE}/mcp/tools/match/send_mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: item.email,
        candidate_name: item.name,
        message: messageText,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Status ${response.status} - ${text}`);
    }

    const result = await response.json();
    console.log("✅ Mail sent:", result);
    alert(`✅ Email sent successfully to ${item.name}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    alert(`❌ Failed to send email: ${err.message}`);
  }
};

// ✅ IMPROVED WhatsApp function with better error handling
export const sendWhatsAppMessage = async (candidate) => {
  try {
    const phone = candidate.phone?.replace(/[^0-9]/g, "");
    if (!phone) {
      alert("⚠️ No phone number available for this candidate");
      return;
    }

    console.log(
      "📱 Attempting to send WhatsApp to:",
      candidate.name,
      "Phone:",
      phone
    );

    const response = await fetch(`${API_BASE}/mcp/tools/match/send_whatsapp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone: phone, // Using the cleaned phone number
        candidate_name: candidate.name,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      console.error("❌ WhatsApp API Error:", errorData);

      // Handle specific error cases
      if (response.status === 400) {
        if (
          errorData.detail?.includes("API access blocked") ||
          errorData.detail?.includes("OAuthException")
        ) {
          throw new Error(
            "WhatsApp service is currently unavailable. Please use email instead."
          );
        }
        throw new Error(
          `WhatsApp API error: ${errorData.detail || "Bad request"}`
        );
      }
      throw new Error(
        `Status ${response.status} - ${errorData.detail || "Unknown error"}`
      );
    }

    const result = await response.json();
    console.log("✅ WhatsApp sent successfully:", result);
    alert(`✅ WhatsApp message sent to ${candidate.name}`);
  } catch (err) {
    console.error("❌ Failed to send WhatsApp message:", err);

    // User-friendly error messages
    if (err.message.includes("unavailable")) {
      alert(`❌ ${err.message}`);
    } else if (
      err.message.includes("API access blocked") ||
      err.message.includes("OAuthException")
    ) {
      alert(
        `❌ WhatsApp integration needs configuration. Please use email instead.`
      );
    } else {
      alert(`❌ Failed to send WhatsApp: ${err.message}`);
    }

    // Re-throw to allow calling code to handle it
    throw err;
  }
};

export const fetchProfileMatches = async (promptMessage) => {
  try {
    const response = await fetch(`${API_BASE}/mcp/tools/match/profile/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text: promptMessage || "" }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Status ${response.status} - ${text}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Failed to fetch profile matches:", err);
    throw err;
  }
};

// ✅ ADDITIONAL UTILITY FUNCTION - WhatsApp status check
export const checkWhatsAppStatus = async () => {
  try {
    // You might want to create a simple status endpoint in your backend
    const response = await fetch(`${API_BASE}/mcp/tools/match/whatsapp/status`);
    return response.ok;
  } catch (error) {
    console.warn("❌ WhatsApp status check failed:", error);
    return false;
  }
};


