// utils/uploadResumes.js

import { API_BASE } from "@/utils/constants";

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
