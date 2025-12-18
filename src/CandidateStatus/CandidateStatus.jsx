// import React, { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { API_BASE } from "@/utils/constants";
// import "./CandidateStatus.css";

// export default function CandidateStatus() {
//   const { jd_id } = useParams();
//   console.log("JD ID from route:", jd_id);
//   const [attempts, setAttempts] = useState([]);

//   const fetchAttempts = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/mcp/tools/jd_history/scheduler/attempts/${jd_id}`);
//       const data = await res.json();
//       if (data.ok) setAttempts(data.attempts);
//     } catch (err) {
//       console.error("Error fetching attempts:", err);
//     }
//   };

//   useEffect(() => {
//     fetchAttempts();
//     const interval = setInterval(fetchAttempts, 10000);
//     return () => clearInterval(interval);
//   }, [jd_id]);

//   return (
//     <div className="candidate-container">
//       <div className="table-header">
//         <h4>📊 Candidate Interview Status — {attempts[0]?.designation || "Loading..."}</h4>
//       </div>

//       <table className="test-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Scheduled Time</th>
//             <th>Status</th>
//             <th>Total Score</th>
//           </tr>
//         </thead>

//         <tbody>
//           {attempts.map((a) => (
//             <tr key={a.attempt_id}>
//               <td>{a.name}</td>

//               <td>
//                 <Link
//                   to={`/candidate/${a.attempt_id}`}
//                   style={{ textDecoration: "none", color: "#007bff" }}
//                 >
//                   {a.email}
//                 </Link>
//               </td>

//               <td>
//                 {a.slot_start
//                   ? new Date(a.slot_start).toLocaleString()
//                   : "—"}
//               </td>

//               <td>
//                 <span className={`status-pill status-${a.status?.toLowerCase()}`}>
//                   {a.status}
//                 </span>
//               </td>

//               <td>{a.totalScore ?? "—"}</td>
//             </tr>
//           ))}
//         </tbody>


//       </table>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "@/utils/constants";
import "./CandidateStatus.css";
import logo from "../assets/primehire_logo.png";

export default function CandidateStatus() {
  const { jd_id } = useParams();
  const [attempts, setAttempts] = useState([]);

  const fetchAttempts = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/jd_history/scheduler/attempts/${jd_id}`
      );
      const data = await res.json();
      if (data.ok) setAttempts(data.attempts);
    } catch (err) {
      console.error("Error fetching attempts:", err);
    }
  };

  useEffect(() => {
    fetchAttempts();
    const interval = setInterval(fetchAttempts, 10000);
    return () => clearInterval(interval);
  }, [jd_id]);

  return (
    <div className="candidate-container">


      <div className="top-logo">
        <Link to={"/"}><img src={logo} alt="Company Logo" /></Link>
      </div>


      <h1 className="page-title">
        📊 Candidate Interview Status —{" "}
        {attempts[0]?.designation || "Loading..."}
      </h1>

      <table className="test-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Scheduled Time</th>
            <th>Status</th>
            <th>Total Score</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((a) => (
            <tr key={a.attempt_id}>
              <td>{a.name}</td>

              <td>
                <Link to={`/candidate/${a.attempt_id}`} className="email-link">
                  {a.email}
                </Link>
              </td>

              <td>
                {a.slot_start
                  ? new Date(a.slot_start).toLocaleString()
                  : "—"}
              </td>

              <td>
                <span
                  className={`status-pill status-${a.status?.toLowerCase()}`}
                >
                  {a.status}
                </span>
              </td>

              <td>{a.totalScore ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}