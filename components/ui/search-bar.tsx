'use client'
import React from 'react'


export default function SearchBar({ q, setQ, dept, setDept, departments }: any) {
return (
<div className="flex gap-2 mb-4">
<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="flex-1 p-2 border rounded" />
<select value={dept} onChange={e => setDept(e.target.value)} className="p-2 border rounded">
<option value="">All departments</option>
{departments.map((d: string) => <option key={d} value={d}>{d}</option>)}
</select>
</div>
)
}