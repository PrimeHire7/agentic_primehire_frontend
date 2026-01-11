## 🤖 **PrimeHire — Agentic AI for Recruiting**

> *Your all-in-one recruitment assistant for sourcing, matching, validating, and interviewing candidates.*

---

### 🌟 **Overview**

**PrimeHire** is an **AI-powered recruitment automation platform** that integrates seamlessly with external CRMs, mail systems, and job portals to simplify end-to-end hiring.
It connects with Zoho, LinkedIn, and email systems — and uses advanced LLM + VectorDB pipelines for resume parsing, JD creation, and candidate matching.

Built with **React**, **FastAPI**, and **Pinecone**, PrimeHire combines automation and intelligence into a single, modular platform.

---

## 🧩 **Core Features**

### 🧠 PrimeHire Brain

> Central intelligence that powers all modules of PrimeHire.

* AI-driven **candidate database** for storing and analyzing resumes.
* Integrates with **PostgreSQL** and **Pinecone Vector DB**.
* Supports **semantic search**, **skill gap analysis**, and **profile insights**.
* Acts as the main “brain” syncing data between modules.

---

### 🧾 JD Creator

> AI-powered Job Description generator.

* Generates contextual **Job Descriptions** based on role titles.
* Interactively asks **clarifying questions** to refine output.
* Allows **exporting and sharing** JDs instantly.
* Perfect for roles like *Data Scientist, ML Engineer, etc.*

---

### 🧍‍♂️ Profile Matcher

> Matches JDs to best-fit candidate profiles.

* Uses **semantic search** & **vector embeddings**.
* Matches candidates from **PrimeHire Brain** or **Zoho Recruit**.
* Supports **side-by-side comparison** of resume vs job role.

---

### 📥 Upload Resumes

> Upload and manage candidate data efficiently.

* Upload **PDF/DOC resumes** manually or in bulk.
* Automatically parses data and stores vectors in Pinecone.
* Enables **fast retrieval** and **AI-powered insights**.

---

### 💌 MailMind

> Extract candidate resumes and emails from Outlook or HR inboxes.

* Fetches candidate attachments automatically.
* Parses resumes directly from email bodies or attachments.
* Analyzes patterns and aggregates candidate data into PrimeHire Brain.

---

### 🔗 ZohoBridge

> Connects seamlessly with **Zoho Recruit API**.

* Fetch Zoho candidates & job data.
* Update candidate status automatically.
* Sync job postings and resume data with Zoho in real time.

---

### 🧑‍💼 Interview Bot

> AI-driven interviewer with candidate identity validation.

* Conducts **automated interviews** with real-time video capture.
* Performs **face validation** (via webcam).
* Generates structured **evaluation reports**.
* Supports **speech-to-text**, **transcript review**, and **automated scoring**.

---

### 💼 LinkedIn Poster

> Automate your recruitment marketing.

* Integrates with **LinkedIn Pages API**.
* Allows your company page to **post job openings** automatically.
* Manage or edit job posts directly from PrimeHire.

---

### 🧠 Match History

> View all previous matches, evaluations, and candidate interactions in one place.

---

## 🧭 **Available Tasks & Actions**

| Module              | Action                                    |
| ------------------- | ----------------------------------------- |
| **JD Creator**      | Create job descriptions with context      |
| **Profile Matcher** | Match JDs with candidate resumes          |
| **Upload Resumes**  | Upload single or bulk resumes             |
| **Interview Bot**   | Validate and interview candidates         |
| **ZohoBridge**      | Sync with Zoho Recruit data               |
| **MailMind**        | Parse resumes from email inboxes          |
| **LinkedIn Poster** | Auto-post openings to LinkedIn            |
| **PrimeHire Brain** | Store, search, and analyze all candidates |
| **Match History**   | Review all candidate match results        |

---

## 🧰 **Tech Stack**

| Layer          | Technology                                 |
| -------------- | ------------------------------------------ |
| **Frontend**   | React + Vite                               |
| **Styling**    | TailwindCSS / CSS Modules                  |
| **Backend**    | FastAPI / Django REST                      |
| **Database**   | PostgreSQL + Pinecone (Vector DB)          |
| **APIs**       | Zoho Recruit API, LinkedIn Pages API       |
| **Deployment** | Vercel (frontend) + Render / EC2 (backend) |
| **Auth**       | Firebase Authentication                    |

---

## ⚙️ **Installation & Setup**

```bash
# Clone repo
git clone https://github.com/chocky18/primehire_beta_ui.git
cd primehire_beta_ui

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

---

## 🧾 **Environment Variables**

Create a `.env.local` file in your project root:

```env
VITE_API_BASE=https://your-backend-api-url.com
VITE_PINECONE_KEY=your_pinecone_api_key
VITE_ZOHO_CLIENT_ID=your_zoho_client_id
VITE_ZOHO_CLIENT_SECRET=your_zoho_client_secret
VITE_LINKEDIN_ACCESS_TOKEN=your_linkedin_token
```
### Using CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📁 **Folder Structure**

```
primehire_beta_ui/
│
├── src/
│   ├── InterviewBot/        # Candidate validation + face capture
│   ├── chat/                # Chatbot UI (agentic interaction)
│   ├── components/          # Sidebar, Header, common UI
│   ├── pages/               # JD Creator, Resume Upload, Profile Matcher
│   ├── hooks/               # useJDCreator, useWebSocket, etc.
│   ├── assets/              # Images, logos, etc.
│   ├── main.jsx             # React entry point
│   └── App.jsx              # Root application
│
├── public/
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔧 **Scripts**

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm install`     | Install dependencies     |
| `npm run dev`     | Run development server   |
| `npm run build`   | Build production assets  |
| `npm run preview` | Preview production build |

---

## 🧑‍💻 **Team & Contributors**

| Role                    | Name                 | GitHub                                   |
| ----------------------- | -------------------- | ---------------------------------------- |
| Lead Engineer | **Naresh Tinnaluri** | [@chocky18](https://github.com/chocky18) |



---

## 💡 **Future Roadmap**

* 🔜 Candidate Analytics Dashboard
* 🔜 HR Feedback Integration
* 🔜 WhatsApp & Slack Recruitment Bot
* 🔜 Resume Auto-Scoring & Ranking
* 🔜 Multi-organization Access Support

---

## 🛡️ **License**

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.

---

### 🧩 **PrimeHire — Smarter Hiring with AI**

> “Transforming recruitment from reactive to predictive.”

