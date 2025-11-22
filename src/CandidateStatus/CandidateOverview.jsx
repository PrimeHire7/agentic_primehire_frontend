// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./CandidateOverview.css";
// import { API_BASE } from "@/utils/constants";

// const CandidateOverview = () => {
//     const { email } = useParams();
//     const [candidate, setCandidate] = useState(null);

//     useEffect(() => {
//         fetch(`${API_BASE}/mcp/tools/candidates/by_email/${email}`)
//             .then((res) => res.json())
//             .then((data) => setCandidate(data))
//             .catch((err) => console.error("Fetch error:", err));
//     }, [email]);

//     if (!candidate) return <p>Loading candidate...</p>;

//     return (
//         <div className="candidate-status-container">
//             <h2 className="title">CANDIDATE OVERVIEW</h2>

//             <div className="status-card">
//                 <div className="profile-section">
//                     <img src="/profile.jpg" className="profile-img" alt="Profile" />

//                     <h3 className="candidate-name">{candidate.full_name}</h3>
//                     <p className="candidate-role">{candidate.current_title}</p>

//                     <p className="contact-email">{candidate.email}</p>
//                     <p className="contact-phone">{candidate.phone}</p>
//                 </div>

//                 <div className="content-section">
//                     <div className="box">
//                         <h4>Candidate Details</h4>
//                         <p>Experience <span>{candidate.years_of_experience} years</span></p>
//                         <p>Location <span>{candidate.location}</span></p>
//                         <p>Skills <span>{candidate.top_skills}</span></p>
//                     </div>

//                     <div className="box">
//                         <h4>Resume</h4>
//                         <a href={`${API_BASE}/${candidate.resume_link}`} className="resume-btn" download>
//                             Download Resume
//                         </a>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CandidateOverview;
import React from "react";
import "./CandidateOverview.css";
import logo from "../assets/primehire_logo.png";
import { Link } from "react-router-dom";

const CandidateOverview = () => {
    return (
        <div className="candidate-status-container">
            <Link to={"/"}> <div className="top-header1">
                <img src={logo} alt="Logo" className="top-logo2" />
            </div></Link>
            <h2 className="title">CANDIDATE STATUS</h2>

            <div className="status-card">
                {/* Profile Section */}
                <div className="profile-section">
                    <img
                        src="/profile.jpg"
                        alt="Candidate"
                        className="profile-img"
                    />
                    <h3 className="candidate-name">John Doe</h3>
                    <p className="candidate-role">Software Engineer</p>

                    <div className="interview-score">
                        <span>Interviewed</span>
                        <span className="score">Score: 85</span>
                    </div>

                    <p className="contact-email">johndoe@example.com</p>
                    <p className="contact-phone">(123) 456-7880</p>
                </div>

                {/* Right Content Section */}
                <div className="content-section">
                    {/* JD Details */}
                    <div className="box">
                        <h4>JD Details</h4>
                        <div className="info-grid">
                            <p>jd_id</p><span>1234</span>
                            <p>Designation</p><span>Software Engineer</span>
                            <p>jd_text</p>
                            <span>Design, implement and maintain software applications</span>
                        </div>
                    </div>

                    {/* Interview Progress */}
                    <div className="box">
                        <h4>Interview Progress</h4>
                        <div className="progress-bar">
                            <div className="step active"></div>
                            <div className="step active"></div>
                            <div className="step"></div>
                        </div>
                        <div className="progress-labels">
                            <span>Screening</span>
                            <span>Interview</span>
                            <span>Offer</span>
                        </div>
                    </div>

                    {/* Profile Match */}
                    <div className="box half">
                        <h4>Profile Match</h4>
                        <div className="progress-wrapper">
                            <div className="line"></div>
                            <span>95%</span>
                        </div>

                        <h5>Profile Match Breakdown</h5>
                        <p>Skills <span>90</span></p>
                        <p>AI Questions <span>85</span></p>
                        <p>Manual Questions <span>85</span></p>
                    </div>

                    {/* Score Metrics */}
                    <div className="box half">
                        <h4>Score Metrics</h4>
                        <p>created_at <span>March 1, 2024</span></p>
                        <p>updated_at <span>March 1, 2024</span></p>
                        <p>Interview Access Token</p>
                        <span>abcdef123456</span>

                        <button className="resume-btn">Download Resume</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateOverview;