import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Clock,
  ThumbsUp,
  CheckCircle2,
  CircleDot,
  UserCheck,
  History
} from 'lucide-react';

export default function StatusTracker({
  complaints,
  initialSearch = '',
  onUpvoteComplaint
}) {
  const [query, setQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = complaints.filter((c) => {
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.aiAnalysis.department.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const getStageIndex = (status) => {
    if (status === 'Pending') return 0;
    if (status === 'In Progress') return 1;
    return 2;
  };

  const priorityColors = {
    Critical: 'bg-rose-100 text-rose-800 border-rose-200',
    High: 'bg-amber-100 text-amber-800 border-amber-200',
    Medium: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    Low: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Citizen Grievance Tracker & Public Ledger
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Search by Complaint ID (e.g., <span className="font-mono">CR-2026-8841</span>), ward,
              or keyword. Pre-loaded items marked <strong>Demo Data</strong> are fictional sample records.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start">
            {['All', 'Pending', 'In Progress', 'Resolved'].map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#0a1628] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Complaint ID, location, department, or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-base font-bold text-slate-800">No matching grievances found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try clearing your search query or switching the status filter.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((ticket) => {
            const stage = getStageIndex(ticket.status);
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-cyan-400/70 transition-colors"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-[#0a1628] text-cyan-300">
                        {ticket.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          priorityColors[ticket.aiAnalysis.priority]
                        }`}
                      >
                        {ticket.aiAnalysis.priority} Priority ({ticket.aiAnalysis.urgencyScore}/100)
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                        {ticket.aiAnalysis.department}
                      </span>
                      {ticket.isDemoData && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Demo Data
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => onUpvoteComplaint(ticket.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 text-xs font-bold transition-colors"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Community Endorse ({ticket.upvotes})</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-5">
                    <div className="space-y-2 flex-1">
                      <h2 className="text-lg font-bold text-slate-900">{ticket.title}</h2>
                      <p className="text-sm text-slate-600 leading-relaxed">{ticket.description}</p>

                      <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                          {ticket.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          SLA: {ticket.aiAnalysis.slaHours}h
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          {ticket.assignedOfficer}
                        </span>
                      </div>
                    </div>

                    {ticket.imageUrl && (
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.title}
                        className="w-full md:w-44 h-32 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    )}
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '1. Registered & Triaged', active: stage >= 0 },
                        { label: '2. Field Crew Dispatched', active: stage >= 1 },
                        { label: '3. Resolved & Verified', active: stage >= 2 }
                      ].map((step, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div
                            className={`h-2 rounded-full ${
                              step.active
                                ? stage === 2
                                  ? 'bg-emerald-500'
                                  : 'bg-cyan-500'
                                : 'bg-slate-200'
                            }`}
                          />
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                            {step.active ? (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  stage === 2 ? 'text-emerald-600' : 'text-cyan-600'
                                }`}
                              />
                            ) : (
                              <CircleDot className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className="truncate">{step.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
                    {ticket.adminNotes && (
                      <div className="text-xs text-slate-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                        <strong className="text-emerald-800">Official Field Update:</strong>{' '}
                        {ticket.adminNotes}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600">
                      <History className="w-3.5 h-3.5 text-cyan-700" />
                      <span>Audit Trail</span>
                    </div>
                    <div className="space-y-1">
                      {ticket.history.map((h, i) => (
                        <div
                          key={i}
                          className="text-[11px] text-slate-600 flex flex-col sm:flex-row sm:justify-between gap-0.5"
                        >
                          <span>
                            <strong className="text-slate-800">{h.actor}:</strong> {h.action}
                          </span>
                          <span className="text-slate-400 font-mono">
                            {new Date(h.time).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
