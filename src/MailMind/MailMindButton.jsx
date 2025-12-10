import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { API_BASE } from "@/utils/constants";
import { Loader2 } from "lucide-react"; // spinner icon
import "./MailMindButton.css";

const MailMindButton = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [platform, setPlatform] = useState("gmail");
  const [connected, setConnected] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);

  // Separate loading states
  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingExtract, setLoadingExtract] = useState(false);

  const handleConnect = async () => {
    setLoadingLogin(true); // start login loading
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });

      if (!res.ok) throw new Error(await res.text());

      await res.json();
      setConnected(true);
      alert(`✅ Login Successful: ${email} (${platform})`);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to connect. Check credentials or IMAP settings.");
    } finally {
      setLoadingLogin(false); // stop login loading
    }
  };

  const handleExtract = async () => {
    setLoadingExtract(true); // start extract loading
    try {
      const res = await fetch(`${API_BASE}/mcp/tools/mailmind/fetch-resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, platform }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      if (data.result?.length) {
        setResumes(data.result);
        alert(`✅ Extracted ${data.result.length} resumes`);
      } else if (data.message) {
        alert(`ℹ️ ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to extract resumes.");
    } finally {
      setLoadingExtract(false); // stop extract loading
    }
  };

  return (
    <div className="mailmind-container">
      <h3 className="mailmind-title">📬 MailMind</h3>
      <p className="mailmind-info">
  MailMind will securely scan your mailbox and extract only the resumes received in the <b>last 7 days</b>. 
  Please ensure you use your <b>App Password</b> for Outlook.
</p>
      {!connected && (
        <>
        <div className="columns-3 mt-5">
          <div className="col-md-4">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mailmind-input"
          />
</div>
<div className="col-md-4">
          <Input
            type="password"
            placeholder="Password / App Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mailmind-input"
          />
</div>
<div className="col-md-4">
          <Select onValueChange={setPlatform} defaultValue={platform}>
            <SelectTrigger className="mailmind-select">
              <SelectValue placeholder="Select Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outlook">Outlook</SelectItem>
            </SelectContent>
          </Select>
          </div>
</div>
          <Button
            onClick={handleConnect}
            className="mailmind-btn"
            disabled={loadingLogin} // disable while login loading
          >
            {loadingLogin ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Connecting...
              </span>
            ) : (
              "Login to Mail"
            )}
          </Button>
        </>
      )}

      {connected && (
        <>
          <Button
            onClick={handleExtract}
            className="mailmind-extract-btn"
            disabled={loadingExtract} // disable while extracting
          >
            {loadingExtract ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Extracting...
              </span>
            ) : (
              "📄 Extract Resumes"
            )}
          </Button>

          {resumes.length > 0 && (
            <div className="mailmind-resume-list">
              <h4 className="resume-heading">Extracted Resumes:</h4>

              <div className="resume-container">
                {resumes.map((url) => {
                  const filename = url.split("/").pop();
                  const isPdf = filename.toLowerCase().endsWith(".pdf");
                  const fileUrl = `${API_BASE}${url}`;

                  return (
                    <div className="resume-item" key={url}>
                      {isPdf ? (
                        <span
                          className="resume-link"
                          onClick={() => setPreviewFile(fileUrl)}
                        >
                          {filename}
                        </span>
                      ) : (
                        <span className="resume-filename">{filename}</span>
                      )}

                      <a href={fileUrl} download className="resume-download">
                        Download
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {previewFile && (
            <div className="mailmind-preview">
              <h5 className="preview-title">Preview PDF:</h5>

              <iframe
                src={previewFile}
                width="100%"
                height="500px"
                title="PDF Preview"
                className="preview-frame"
              />

              <Button
                onClick={() => setPreviewFile(null)}
                className="close-preview-btn"
              >
                Close Preview
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MailMindButton;
