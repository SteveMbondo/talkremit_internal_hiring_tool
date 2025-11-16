"use client"
import React, { useEffect, useState } from 'react'
import JobCard from '../components/ui/job-card'
import SearchBar from '../components/ui/search-bar'


type Job = {
title: string
department: string
location: string
description: string
}


export default function Page() {
const [jobs, setJobs] = useState<Job[] | null>(null)
const [q, setQ] = useState('')
const [dept, setDept] = useState('')


useEffect(() => {
fetch('/api/jobs')
.then(r => r.json())
.then(setJobs)
.catch(err => { console.error(err); setJobs([]) })
}, [])


const filtered = (jobs || [])
  .filter(job => job.status?.toLowerCase() !== "HIRED")
  .filter(job => {
    if (q && !(`${job.title} ${job.description}`).toLowerCase().includes(q.toLowerCase())) return false
    if (dept && job.department.toLowerCase() !== dept.toLowerCase()) return false
    return true
  })



const departments = Array.from(new Set((jobs || []).map(j => j.department))).filter(Boolean)


return (
<div>
<h2 className="text-2xl font-semibold mb-4">Open roles</h2>
<SearchBar q={q} setQ={setQ} dept={dept} setDept={setDept} departments={departments} />


<div className="grid gap-4">
{jobs === null ? <p>Loading…</p> : (filtered.length === 0 ? <p>No open roles found.</p> : filtered.map((j) => <JobCard key={j.title} job={j} />))}
</div>
</div>
)
}
