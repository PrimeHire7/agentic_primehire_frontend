import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@common": path.resolve(__dirname, "./src/common"),
      "@chat": path.resolve(__dirname, "./src/chat"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@primehire": path.resolve(__dirname, "./src/PrimeHireBrain"),
      "@zoho": path.resolve(__dirname, "./src/ZohoBridge"),
      "@linkedin": path.resolve(__dirname, "./src/LinkedInPoster"),
      "@mailmind": path.resolve(__dirname, "./src/MailMind"),
      "@status": path.resolve(__dirname, "./src/CandidateStatus"),
      "@interview": path.resolve(__dirname, "./src/InterviewBot"),
      "@matcher": path.resolve(__dirname, "./src/components/ProfileMatcher"),
    },
  },
}));
