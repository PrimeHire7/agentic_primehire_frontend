
// // import React, { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { API_BASE } from "@/utils/constants";
// // import "./PrimeHireBrain.css";

// // const PrimeHireBrain = () => {
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [resumes, setResumes] = useState([]);

// //   const fetchStoredResumes = async () => {
// //     setIsLoading(true);
// //     try {
// //       const response = await fetch(`${API_BASE}/mcp/tools/resume/list`);
// //       if (!response.ok) throw new Error("Failed to fetch resumes");
// //       const data = await response.json();
// //       setResumes(data.resumes || []);
// //     } catch (err) {
// //       console.error("❌ Failed to load resumes:", err);
// //       alert("❌ Failed to load stored candidates.");
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="primehirebrain-container">
// //       <h2 className="brain-title">PrimeHire Brain</h2>

// //       <Button
// //         onClick={fetchStoredResumes}
// //         className="fetch-btn"
// //       >
// //         📊 View Stored Candidates
// //       </Button>

// //       {isLoading && <p className="loading-text">Loading data...</p>}

// //       {resumes.length > 0 && (
// //         <div className="table-wrapper">
// //           <h3 className="table-title">
// //             Stored Candidates ({resumes.length})
// //           </h3>
// //           <table className="candidates-table">
// //             <thead>
// //               <tr>
// //                 <th>Name</th>
// //                 <th>Designation</th>   {/* 🆕 Added */}
// //                 <th>Email</th>
// //                 <th>Phone</th>
// //                 <th>Skills</th>
// //                 <th>Experience</th>
// //                 <th>Company</th>
// //                 <th>Updated</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {resumes.map((r, i) => (
// //                 <tr key={i}>
// //                   <td data-label="Name">{r.full_name}</td>
// //                   <td data-label="Designation">{r.current_title}</td> {/* 🆕 Added */}
// //                   <td data-label="Email">{r.email}</td>
// //                   <td data-label="Phone">{r.phone}</td>
// //                   <td data-label="Skills">{r.top_skills}</td>
// //                   <td data-label="Experience">{r.years_of_experience}</td>
// //                   <td data-label="Company">{r.current_company}</td>
// //                   <td data-label="Updated">{r.last_updated}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default PrimeHireBrain;

// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { API_BASE } from "@/utils/constants";
// import "./PrimeHireBrain.css";

// const PrimeHireBrain = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [resumes, setResumes] = useState([]);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(new Set());

//   /* --------------------------------------------------
//      FETCH (used by search + button)
//   -------------------------------------------------- */
//   const fetchStoredResumes = async (q = "") => {
//     setIsLoading(true);
//     try {
//       const query = q ? `?search=${encodeURIComponent(q)}` : "";
//       const res = await fetch(`${API_BASE}/mcp/tools/resume/list${query}`);
//       if (!res.ok) throw new Error("Fetch failed");
//       const data = await res.json();
//       setResumes(data.resumes || []);
//       setSelected(new Set()); // reset selection
//     } catch (e) {
//       console.error(e);
//       alert("Failed to load candidates");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* --------------------------------------------------
//      🔍 LIVE SEARCH (this was missing ❗)
//   -------------------------------------------------- */
//   useEffect(() => {
//     const t = setTimeout(() => {
//       fetchStoredResumes(search);
//     }, 400); // debounce

//     return () => clearTimeout(t);
//   }, [search]);

//   /* --------------------------------------------------
//      CHECKBOX LOGIC
//   -------------------------------------------------- */
//   const toggleOne = (id) => {
//     const copy = new Set(selected);
//     copy.has(id) ? copy.delete(id) : copy.add(id);
//     setSelected(copy);
//   };

//   const toggleAll = () => {
//     if (selected.size === resumes.length) {
//       setSelected(new Set());
//     } else {
//       setSelected(new Set(resumes.map((r) => r.candidate_id)));
//     }
//   };

//   /* --------------------------------------------------
//      DELETE
//   -------------------------------------------------- */
//   const deleteCandidates = async (ids) => {
//     if (!ids.length) return;
//     if (!window.confirm(`Delete ${ids.length} candidate(s)?`)) return;

//     try {
//       await Promise.all(
//         ids.map((id) =>
//           fetch(`${API_BASE}/mcp/tools/resume/delete/${id}`, {
//             method: "DELETE",
//           })
//         )
//       );

//       setResumes((prev) =>
//         prev.filter((r) => !ids.includes(r.candidate_id))
//       );
//       setSelected(new Set());
//     } catch (e) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div className="primehirebrain-container">
//       <h2 className="brain-title">PrimeHire Brain</h2>

//       {/* SEARCH + ACTIONS */}
//       <div className="brain-actions">
//         <input
//           className="search-input"
//           placeholder="Search by name or email"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <Button onClick={() => fetchStoredResumes(search)}>
//           🔄 Refresh
//         </Button>

//         {selected.size > 0 && (
//           <Button
//             variant="destructive"
//             onClick={() => deleteCandidates([...selected])}
//           >
//             🗑 Delete ({selected.size})
//           </Button>
//         )}
//       </div>

//       {isLoading && <p>Loading...</p>}

//       {resumes.length > 0 && (
//         <>
//           <div className="table-header">
//             <span className="resume-count">
//               📄 Total Candidates: <strong>{resumes.length}</strong>
//             </span>
//           </div>

//           <table className="candidates-table">
//             <thead>
//               <tr>
//                 <th>
//                   <input
//                     type="checkbox"
//                     checked={selected.size === resumes.length}
//                     onChange={toggleAll}
//                   />
//                 </th>
//                 <th>Name</th>
//                 <th>Designation</th>
//                 <th>Email</th>
//                 <th>Experience</th>
//                 <th>Company</th>
//                 <th>Updated</th>
//                 <th>Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {resumes.map((r) => (
//                 <tr key={r.candidate_id}>
//                   <td>
//                     <input
//                       type="checkbox"
//                       checked={selected.has(r.candidate_id)}
//                       onChange={() => toggleOne(r.candidate_id)}
//                     />
//                   </td>
//                   <td>{r.full_name}</td>
//                   <td>{r.current_title}</td>
//                   <td>{r.email}</td>
//                   <td>{r.years_of_experience}</td>
//                   <td>{r.current_company}</td>
//                   <td>{r.last_updated}</td>
//                   <td>
//                     <button
//                       className="delete-btn"
//                       onClick={() => deleteCandidates([r.candidate_id])}
//                     >
//                       🗑
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//     </div>
//   );
// };

// export default PrimeHireBrain;
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/utils/constants";
import "./PrimeHireBrain.css";

const PrimeHireBrain = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());

  /* ---------------- REPAIR STATE ---------------- */
  const [repairing, setRepairing] = useState(false);
  const [repairStatus, setRepairStatus] = useState(null);

  /* --------------------------------------------------
     FETCH RESUMES
  -------------------------------------------------- */
  const fetchStoredResumes = async (q = "") => {
    setIsLoading(true);
    try {
      const query = q ? `?search=${encodeURIComponent(q)}` : "";
      const res = await fetch(`${API_BASE}/mcp/tools/resume/list${query}`);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setResumes(data.resumes || []);
      setSelected(new Set());
    } catch (e) {
      alert("Failed to load candidates");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- LIVE SEARCH ---------------- */
  useEffect(() => {
    const t = setTimeout(() => fetchStoredResumes(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  /* ---------------- CHECKBOX LOGIC ---------------- */
  const toggleOne = (id) => {
    const copy = new Set(selected);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelected(copy);
  };

  const toggleAll = () => {
    if (selected.size === resumes.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(resumes.map((r) => r.candidate_id)));
    }
  };

  /* ---------------- DELETE ---------------- */
  const deleteCandidates = async (ids) => {
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} candidate(s)?`)) return;

    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${API_BASE}/mcp/tools/resume/delete/${id}`, {
            method: "DELETE",
          })
        )
      );
      setResumes((prev) =>
        prev.filter((r) => !ids.includes(r.candidate_id))
      );
      setSelected(new Set());
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------------- START REPAIR ---------------- */
  const startRepair = async () => {
    if (!window.confirm("Sync DB → Pinecone? This may take several minutes.")) {
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/mcp/tools/resume/sync/repair`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error();

      setRepairing(true);
      setRepairStatus({ status: "running", repaired: 0, total: 0 });
    } catch {
      alert("Failed to start repair");
    }
  };

  /* ---------------- REPAIR STATUS POLLING ---------------- */
  useEffect(() => {
    if (!repairing) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/mcp/tools/resume/sync/repair/status`
        );
        if (!res.ok) return;

        const data = await res.json();
        setRepairStatus(data);

        if (data.status === "completed") {
          setRepairing(false);
          fetchStoredResumes(search);
        }

        if (data.status === "error") {
          setRepairing(false);
          alert("Repair failed. Check logs.");
        }
      } catch { }
    }, 3000);

    return () => clearInterval(interval);
  }, [repairing]);

  /* ---------------- PROGRESS % ---------------- */
  const progressPercent =
    repairStatus?.total > 0
      ? Math.round((repairStatus.repaired / repairStatus.total) * 100)
      : 0;

  return (
    <div className="primehirebrain-container">
      <h2 className="brain-title">PrimeHire Brain</h2>

      {/* ACTION BAR */}
      <div className="brain-actions">
        <input
          className="search-input"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button onClick={() => fetchStoredResumes(search)}>🔄 Refresh</Button>

        <Button
          variant="outline"
          disabled={repairing}
          onClick={startRepair}
        >
          🛠 Repair Pinecone
        </Button>

        {selected.size > 0 && (
          <Button
            variant="destructive"
            onClick={() => deleteCandidates([...selected])}
          >
            🗑 Delete ({selected.size})
          </Button>
        )}
      </div>

      {/* REPAIR STATUS UI */}
      {repairing && repairStatus && (
        <div className="repair-box">
          <div className="repair-header">
            <span className="badge running">RUNNING</span>
            <strong>Repairing Pinecone</strong>
          </div>

          <div className="repair-progress">
            <div
              className="repair-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="repair-meta">
            {repairStatus.repaired} / {repairStatus.total} repaired
            <span>{progressPercent}%</span>
          </div>
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {resumes.length > 0 && (
        <>
          <div className="table-header">
            📄 Total Candidates: <strong>{resumes.length}</strong>
          </div>

          <table className="candidates-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selected.size === resumes.length}
                    onChange={toggleAll}
                  />
                </th>
                <th>Name</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Experience</th>
                <th>Company</th>
                <th>Updated</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {resumes.map((r) => (
                <tr key={r.candidate_id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.has(r.candidate_id)}
                      onChange={() => toggleOne(r.candidate_id)}
                    />
                  </td>
                  <td>{r.full_name}</td>
                  <td>{r.current_title}</td>
                  <td>{r.email}</td>
                  <td>{r.years_of_experience}</td>
                  <td>{r.current_company}</td>
                  <td>{r.last_updated}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteCandidates([r.candidate_id])}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PrimeHireBrain;
