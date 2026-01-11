"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const API_BASE = "http://54.167.210.32:8000"

interface Candidate {
  full_name: string
  email: string
  phone: string
  top_skills: string
  years_of_experience: string
  current_company: string
  last_updated: string
}

interface PrimeHireBrainProps {
  isActive: boolean
}

const PrimeHireBrain: React.FC<PrimeHireBrainProps> = ({ isActive }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchStoredResumes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/mcp/tools/resume/list`)
      if (!response.ok) throw new Error("Failed to fetch resumes")
      const data = await response.json()
      setCandidates(data.resumes || [])
    } catch (error) {
      console.error("Failed to load resumes:", error)
      alert("Failed to load stored candidates")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isActive) return null

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-3">🧠 PrimeHire Brain</h2>

      <Button onClick={fetchStoredResumes} disabled={isLoading} className="mb-4">
        {isLoading ? "Loading..." : "📊 View Stored Candidates"}
      </Button>

      {candidates.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Stored Candidates ({candidates.length})</h3>
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Email</th>
                <th className="border px-4 py-2 text-left">Phone</th>
                <th className="border px-4 py-2 text-left">Skills</th>
                <th className="border px-4 py-2 text-left">Experience</th>
                <th className="border px-4 py-2 text-left">Company</th>
                <th className="border px-4 py-2 text-left">Updated</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{candidate.full_name}</td>
                  <td className="border px-4 py-2">{candidate.email}</td>
                  <td className="border px-4 py-2">{candidate.phone}</td>
                  <td className="border px-4 py-2">{candidate.top_skills}</td>
                  <td className="border px-4 py-2">{candidate.years_of_experience}</td>
                  <td className="border px-4 py-2">{candidate.current_company}</td>
                  <td className="border px-4 py-2">{candidate.last_updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default PrimeHireBrain
