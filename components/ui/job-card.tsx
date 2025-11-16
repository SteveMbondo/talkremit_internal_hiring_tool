"use client"
import React from 'react'


type Job = {
title: string
department: string
location: string
description: string
}


export default function JobCard({ job }: { job: Job }) {
return (
<article className="p-4 border rounded-lg shadow-sm">
<h3 className="text-lg font-semibold">{job.title}</h3>
<p className="text-sm text-slate-500">{job.department} • {job.location}</p>
<div className="mt-2 text-sm whitespace-pre-line">{job.description}</div>
</article>
)
}