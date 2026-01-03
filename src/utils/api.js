// 📁 src/utils/api.js
import { API_BASE, UI_BASE } from "./constants";

function stripHtml(html) {
  if (!html) return "";

  // Remove the Copy JD button completely
  html = html.replace(/📋\s*Copy JD/gi, "");

  // Remove the whole <button>...</button> block
  html = html.replace(/<button[\s\S]*?<\/button>/gi, "");

  // Remove "How to Apply" section entirely
  html = html.replace(/<h2>How to Apply[\s\S]*?<\/p>/gi, "");

  // Remove script & style tags
  html = html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");

  // Replace <li> with "- "
  html = html.replace(/<li>/gi, "- ");

  // Replace breaks & paragraph endings with newlines
  html = html.replace(/<br\s*\/?>/gi, "\n");
  html = html.replace(/<\/p>/gi, "\n");

  // Add newline after section headings
  html = html.replace(/<\/h[1-6]>/gi, "\n");

  // Strip all remaining HTML
  html = html.replace(/<[^>]+>/g, "");

  // Cleanup multiple newlines
  html = html.replace(/\n\s*\n\s*\n+/g, "\n\n");

  return html.trim();
}


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
    company_name: inputs.company_name || "",
    location: inputs.location || "",
    years: parseInt(inputs.experience) || 0,
    job_type: inputs.jobType || "Full-time",
    skills: [
      ...(inputs.skillsMandatory || []),
      ...(inputs.skillsPreferred || []),
    ],
    responsibilities: normalizeArray(inputs.responsibilities),
    about_company: inputs.about || "",
    qualifications: normalizeArray(inputs.perks || []),
    perks: normalizeArray(inputs.perks || []),
  };

  try {
    // -----------------------------------------
    // 📝 1️⃣ Generate JD
    // -----------------------------------------
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

    // Show JD in chat
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: jdText || "✅ JD generated",
      },
    ]);

    // -----------------------------------------
    // 💾 2️⃣ Save JD to DB
    // -----------------------------------------
    const designation = inputs.role || "";
    const skills = [
      ...(inputs.skillsMandatory || []),
      ...(inputs.skillsPreferred || []),
    ].join(", ");

    const saveRes = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        designation,
        skills,
        jd_text: jdText,
      }),
    });

    if (saveRes.ok) {
      console.log("💾 JD saved to DB successfully!");
    } else {
      console.warn("⚠️ JD save returned non-200:", await saveRes.text());
    }

    // -----------------------------------------
    // 🔎 3️⃣ TRIGGER PROFILE MATCHING
    // -----------------------------------------
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "🔎 Matching candidates..." },
    ]);

    console.log(
      "🔎 Triggering /profile/match endpoint...",
      jdText.slice(0, 120)
    );

    const matchRes = await fetch(
      `${API_BASE}/mcp/tools/match/profile/match`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd_text: jdText }),
      }
    );

    if (!matchRes.ok) {
      const body = await matchRes.text();
      console.error("❌ profile/match failed:", matchRes.status, body);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Unable to match profiles. Please try manually.",
        },
      ]);
    } else {
      const matchData = await matchRes.json();

      console.log("✅ profile/match response:", matchData);

      const count = matchData?.candidates?.length || 0;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `🎯 Matching completed — Found ${count} candidates.`,
        },
        {
          role: "assistant",
          type: "profile_table",
          data: matchData.candidates || [],
        },
        {
          role: "assistant",
          content:
            "📎 Would you like to upload more resumes for better matching?",
          meta: { ask_upload_resumes: true },
        },
      ]);

      // Refresh JD history (notify JDHistory component)
      window.dispatchEvent(new CustomEvent("jd_history_refreshed"));
    }
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

// export const uploadResumes = async (files) => {
//   const formData = new FormData();
//   Array.from(files).forEach((file) => formData.append("files", file));

//   const response = await fetch(`${API_BASE}/mcp/tools/resume/upload`, {
//     method: "POST",
//     body: formData,
//   });

//   if (!response.ok) {
//     const text = await response.text();
//     throw new Error(`Status ${response.status} - ${text}`);
//   }

//   return await response.json();
// };
// utils/uploadResumes.js



export const uploadResumes = async (files, overwrite = false) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append("files", file));

  // 🔥 Correct overwrite support
  const url = `${API_BASE}/mcp/tools/resume/upload${overwrite ? "?overwrite=true" : ""}`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Status ${response.status} - ${text}`);
  }

  return await response.json(); // duplicate OR processing
};

/* ------------------------------------------------------------------
   EMAIL + WHATSAPP HELPERS
------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   EMAIL + WHATSAPP HELPERS (JD & JD-LESS MODE SUPPORTED)
------------------------------------------------------------------ */

export const sendMailMessage = async (item, jdId, jdTextFromMatcher = null) => {
  try {
    const email = item.email?.trim();
    if (!email) {
      alert("⚠️ Candidate has no email");
      return;
    }

    const candidateId = item.candidate_id;
    const candidateName = item.full_name || item.name || "Candidate";

    let jdText = "";
    let finalJdId = jdId;
    let jdToken = null;

    /* ==========================================================
       CASE 1 — JD MODE (jdId available → fetch from DB)
    ========================================================== */
    if (jdId) {
      const jdRes = await fetch(
        `${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`
      );
      const jdData = await jdRes.json();
      // jdText = jdData.jd_text || "Job description unavailable";
      let jdHtml = jdData.jd_text || "Job description unavailable";

      // CLEAN HTML → convert to readable text
      jdText = stripHtml(jdHtml);

    }

    /* ==========================================================
       CASE 2 — JD-LESS MODE (Profile Matcher)
    ========================================================== */
    else {
      jdText = jdTextFromMatcher || "Job description unavailable";
      finalJdId = "null";
    }

    /* ==========================================================
       ALWAYS CREATE JD TOKEN (NEW FLOW)
    ========================================================== */
    const saveRes = await fetch(`${API_BASE}/mcp/tools/jd_cache/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text: jdText }),
    });

    const saveData = await saveRes.json();
    jdToken = saveData.jd_token;

    if (!jdToken) {
      alert("❌ Failed to generate JD token");
      return;
    }

    /* ==========================================================
       BUILD CORRECT SCHEDULER LINK (NOT validation_panel)
    ========================================================== */
    const schedulerLink =
      `${UI_BASE}/scheduler?candidateId=` +
      `${encodeURIComponent(candidateId)}&candidateName=` +
      `${encodeURIComponent(candidateName)}&jd_token=${jdToken}&jd_id=${finalJdId}`;

    /* ==========================================================
       EMAIL BODY
    ========================================================== */
    const messageText = `
Hi ${candidateName},

Below is your job description for the interview:
-----------------------------------------
${jdText}
-----------------------------------------

Please click the link below to schedule your interview:
${schedulerLink}

Thanks,
PrimeHire Team
`;

    /* SEND EMAIL */
    await fetch(`${API_BASE}/mcp/tools/match/send_mail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        candidate_name: candidateName,
        message: messageText,
      }),
    });

    alert(`📧 Email sent to ${candidateName}`);
  } catch (err) {
    console.error("Email send error:", err);
    alert("Failed to send email.");
  }
};


// export const sendMailMessage = async (item, jdId, jdTextFromMatcher = null) => {
//   try {
//     const email = item.email?.trim();
//     if (!email) {
//       alert("⚠️ No email found!");
//       return;
//     }

//     const candidateId = item.candidate_id;
//     const candidateName = item.full_name || item.name || "Candidate";

//     let jdText = "";
//     let finalJdId = jdId;
//     let jdToken = null;

//     /* ==========================================================
//        CASE 1 — JD mode → fetch from JD History
//     ========================================================== */
//     if (jdId) {
//       const res = await fetch(`${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`);
//       const data = await res.json();
//       jdText = data.jd_text || "Job description unavailable";
//     }

//     /* ==========================================================
//        CASE 2 — JD-LESS MODE (Profile Match)
//     ========================================================== */
//     else {
//       jdText = jdTextFromMatcher || "Job description unavailable";
//       finalJdId = "null";
//     }

//     /* ==========================================================
//        Store JD text → get token
//     ========================================================== */
//     const saveRes = await fetch(`${API_BASE}/mcp/tools/jd_cache/save`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ jd_text: jdText }),
//     });

//     const saveData = await saveRes.json();
//     jdToken = saveData.jd_token;

//     if (!jdToken) {
//       alert("Failed to generate JD token");
//       return;
//     }

//     /* ==========================================================
//        Build scheduler link using token instead of text
//     ========================================================== */
//     const schedulerLink =
//       `https://primehire-beta-ui.vercel.app/scheduler?candidateId=` +
//       `${encodeURIComponent(candidateId)}&candidateName=` +
//       `${encodeURIComponent(candidateName)}&jd_token=${jdToken}&jd_id=${finalJdId}`;

//     const messageText = `
// Hi ${candidateName},

// Below is your job description for the interview:
// -----------------------------------------
// ${jdText}
// -----------------------------------------

// Please click the link below to schedule your interview:
// ${schedulerLink}

// Thanks,
// PrimeHire Team
// `;

//     /* SEND EMAIL */
//     await fetch(`${API_BASE}/mcp/tools/match/send_mail`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email,
//         candidate_name: candidateName,
//         message: messageText,
//       }),
//     });

//     alert(`📧 Email sent to ${candidateName}`);
//   } catch (err) {
//     console.error("Email error:", err);
//     alert("Email send failed.");
//   }
// };


// export const sendMailMessage = async (item, jdId, jdTextFromMatcher = null) => {
//   try {
//     const email = item.email?.trim();
//     if (!email) {
//       alert("⚠️ No email address available for this candidate");
//       return;
//     }

//     const candidateId = item.candidate_id;
//     if (!candidateId) {
//       alert("❌ Missing candidate_id!");
//       return;
//     }

//     const candidateName = item.full_name || item.name || "Candidate";

//     let jdText = "";
//     let finalJdId = jdId;

//     /* ==========================================================
//        CASE 1 — JD MODE (jdId exists → fetch from JDHistory)
//     ========================================================== */
//     if (jdId) {
//       const jdRes = await fetch(
//         `${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`
//       );
//       const jdData = await jdRes.json();
//       jdText = jdData.jd_text || "Job description unavailable";
//     }

//     /* ==========================================================
//        CASE 2 — JD-LESS MODE (MATCHER HISTORY)
//        We use the JD text passed from ProfileTable
//     ========================================================== */
//     else {
//       jdText = jdTextFromMatcher || "Job description unavailable";
//       finalJdId = "null";
//     }

//     /* ==========================================================
//        Scheduler Link (JD or JD-less)
//     ========================================================== */
//     const schedulerLink =
//       `https://primehire-beta-ui.vercel.app/scheduler?candidateId=` +
//       `${encodeURIComponent(candidateId)}&candidateName=` +
//       `${encodeURIComponent(candidateName)}&jd_id=${finalJdId}`;

//     const messageText = `
// Hi ${candidateName},

// Below is your job description for the interview:
// -----------------------------------------
// ${jdText}
// -----------------------------------------

// Please click the link below to schedule your interview:
// ${schedulerLink}

// Thanks,
// PrimeHire Team
// `;

//     const payload = { email, candidate_name: candidateName, message: messageText };

//     const res = await fetch(`${API_BASE}/mcp/tools/match/send_mail`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error("Email failed");

//     alert(`📧 Email sent to ${candidateName}`);
//   } catch (err) {
//     console.error("Email send error:", err);
//     alert("Failed to send email. See console.");
//   }
// };

// export const sendMailMessage = async (item, jdId) => {
//   try {
//     const email = item.email?.trim();
//     if (!email) {
//       alert("⚠️ No email address available for this candidate");
//       return;
//     }

//     const candidateId = item.candidate_id; // MUST be from DB
//     if (!candidateId) {
//       alert("❌ Missing candidate_id!");
//       return;
//     }

//     const candidateName = item.full_name || item.name || "Candidate";

//     // Fetch JD text
//     const jdRes = await fetch(
//       `${API_BASE}/mcp/tools/jd_history/jd/history/${jdId}`
//     );
//     const jdData = await jdRes.json();
//     const jdText = jdData.jd_text || "Job description unavailable";

//     // 👉 NEW: Scheduler link
//     const schedulerLink = `https://primehire-beta-ui.vercel.app/scheduler?candidateId=${encodeURIComponent(
//       candidateId
//     )}&candidateName=${encodeURIComponent(
//       candidateName
//     )}&jd_id=${jdId}`;

//     const messageText = `
// Hi ${candidateName},

// Below is your job description for the interview:
// -----------------------------------------
// ${jdText}
// -----------------------------------------

// Please click the link below to schedule your interview:
// ${schedulerLink}

// Thanks,
// PrimeHire Team
// `;

//     const payload = { email, candidate_name: candidateName, message: messageText };

//     const res = await fetch(`${API_BASE}/mcp/tools/match/send_mail`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error("Email failed");

//     alert(`📧 Email sent to ${candidateName}`);
//   } catch (err) {
//     console.error("Email send error:", err);
//     alert("Failed to send email. See console.");
//   }
// };

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

    const response = await fetch(
      `${API_BASE}/mcp/tools/match/send_whatsapp/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          candidate_name: candidate.name,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ detail: "Unknown error" }));
      console.error("❌ WhatsApp API Error:", errorData);

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

    throw err;
  }
};

/* ------------------------------------------------------------------
   PROFILE MATCHER API (for both WS + manual)
------------------------------------------------------------------ */

export const fetchProfileMatches = async (promptMessage) => {
  try {
    console.log(
      "📤 fetchProfileMatches → /mcp/tools/match/profile/match with:",
      promptMessage
    );

    const response = await fetch(`${API_BASE}/mcp/tools/match/profile/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text: promptMessage || "" }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Status ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("📥 fetchProfileMatches response:", data);
    return data;
  } catch (err) {
    console.error("❌ Failed to fetch profile matches:", err);
    throw err;
  }
};

// Simple wrapper used by useProfileMatcher
export const matchProfiles = async (jdText) => {
  return await fetchProfileMatches(jdText);
};

// ✅ ADDITIONAL UTILITY FUNCTION - WhatsApp status check
export const checkWhatsAppStatus = async () => {
  try {
    const response = await fetch(
      `${API_BASE}/mcp/tools/match/whatsapp/status`
    );
    return response.ok;
  } catch (error) {
    console.warn("❌ WhatsApp status check failed:", error);
    return false;
  }
};

/* ------------------------------------------------------------------
   SINGLE-PROMPT JD GENERATOR (chatbot style)
------------------------------------------------------------------ */

export const generateSingleJD = async (prompt) => {
  try {
    const res = await fetch(`${API_BASE}/mcp/tools/jd/generate/single`, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ prompt }),
    });

    console.log("generateSingleJD: status", res.status, res.statusText);
    const text = await res.text();
    console.log(
      "generateSingleJD: raw response (first 2000 chars):",
      text.slice(0, 2000)
    );

    let payload;
    try {
      payload = JSON.parse(text);
    } catch (e) {
      console.error("generateSingleJD: invalid JSON from server", e);
      throw new Error("Invalid JSON response from JD endpoint");
    }

    if (!payload.ok) {
      console.error(
        "generateSingleJD: server returned error payload",
        payload
      );
      throw new Error(payload.error || "JD generation failed");
    }

    return payload; // { ok, jd_html, jd_id, ... }
  } catch (err) {
    console.error("generateSingleJD network error:", err);
    throw err;
  }
};
