import { useState } from "react";

export default function Apply() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !name || !email) {
            setStatus("⚠️ Please fill all fields and upload your resume.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("resume", file);

        try {
            const res = await fetch("https://your-ec2-api.com/api/upload-resume", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                setStatus("✅ Resume uploaded successfully. We'll get back to you soon!");
                setFile(null);
                setName("");
                setEmail("");
            } else {
                setStatus("❌ Failed to upload. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setStatus("❌ Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">Apply for this Job</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Upload your resume to complete your application.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="border p-2 rounded"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit Application
                    </button>
                </form>
                {status && <p className="mt-4 text-center">{status}</p>}
            </div>
        </div>
    );
}
