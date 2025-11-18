'use client'
import React from 'react'


export default function SearchBar({ q, setQ, dept, setDept, departments }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-4 w-full px-4 sm:px-0">
      
      {/* Search Input */}
      <input 
        value={q} 
        onChange={e => setQ(e.target.value)} 
        placeholder="Search" 
        className="w-full sm:flex-1 p-2 border rounded" 
      />
      
      <select 
        value={dept} 
        onChange={e => setDept(e.target.value)} 
        className="w-full sm:w-auto p-2 border rounded"
      >
        <option value="">All departments</option>
        {departments.map((d: string) => <option key={d} value={d}>{d}</option>)}
      </select>
    </div>
  )
}
