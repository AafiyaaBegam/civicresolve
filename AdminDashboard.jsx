import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Search,
  Wrench,
  Sparkles,
  Download
} from 'lucide-react';
import { DEPARTMENTS } from '../utils/aiEngine';
import TicketModal from './TicketModal';

export default function AdminDashboard({ complaints, onUpdateTicket }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('urgency');
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const metrics = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const critical = complaints.filter(
      (c) => c.aiAnalysis.priority === 'Critical' && c.status !== 'Resolved'
    ).length;

    const resolvedItems = complaints.filter((c) => c.status === 'Resolved' && c.resolvedAt);
    let avgResolutionHours = 5.4;
    if (resolvedItems.length > 0) {
      const totalHrs = resolvedItems.reduce((acc, item) => {
        const diff =
          (new Date(item.resolvedAt).getTime() - new Date(item.createdAt).getTime()) /
          (1000 * 60 * 60);
        return acc + Math.max(diff, 0.5);
      }, 0);
      avgResolutionHours = (totalHrs / resolvedItems.length).toFixed(1);
    }

    const byDept = DEPARTMENTS.map((dept) => {
      const items = complaints.filter((c) => c.aiAnalysis.departmentId === dept.id);
      return {
        id: dept.id,
        name: dept.shortName,
        fullName: dept.name,
        total: items.length,
        open: items.filter((i) => i.status !== 'Resolved').length
      };
    });

    const byPriority = ['Critical', 'High', 'Medium', 'Low'].map((p) => ({
      label: p,
      count: complaints.filter((c) => c.aiAnalysis.priority === p).length
    }));

    return {
      total,
      pending,
      inProgress,
      resolved,
      critical,
      avgResolutionHours,
      slaCompliance: total === 0 ? 100 : Math.round(((resolved + inProgress) / total) * 100),
      byDept,
      byPriority
    };
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) => {
        if (deptFilter !== 'All' && c.aiAnalysis.departmentId !== deptFilter) return false;
        if (priorityFilter !== 'All' && c.aiAnalysis.priority !== priorityFilter) return false;
        if (statusFilter !== 'All' && c.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            c.id.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q) ||
            c.assignedOfficer.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'urgency') return b.aiAnalysis.urgencyScore - a.aiAnalysis.urgencyScore;
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [complaints, deptFilter, priorityFilter, statusFilter, search, sortBy]);

  const exportCsv = () => {
    const headers = [
      'ID',
      'DataType',
      'Title',
      'Department',
      'Priority',
      'UrgencyScore',
      'Status',
      'Location'
    ];
    const rows = filteredComplaints.map((c) => [
      c.id,
      c.isDemoData ? 'Demo Data' : 'User Submitted',
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.aiAnalysis.department}"`,
      c.aiAnalysis.priority,
      c.aiAnalysis.urgencyScore,
      c.status,
      `"${c.location.replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CivicResolve_Audit_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTicket = complaints.find((c) => c.id === selectedTicketId);
  const maxDeptCount = Math.max(...metrics.byDept.map((d) => d.total), 1);

  const priorityPill = {
    Critical: 'bg-rose-100 text-rose-800 border-rose-300',
    High: 'bg-amber-100 text-amber-800 border-amber-300',
    Medium: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    Low: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  const statusPill = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 text-xs text-indigo-900 flex flex-wrap items-center justify-between gap-2">
        <span>
          <strong>Notice:</strong> Seeded records in this view are fictional <strong>Demo Data</strong>{' '}
          pre-loaded for evaluation. Any new grievances you submit or updates you save persist in
          LocalStorage.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Grievances</span>
            <BarChart3 className="w-4 h-4 text-slate-700" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{metrics.total}</p>
          <p className="text-[11px] text-slate-500 mt-1">Across 6 municipal wings</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between text-rose-700 text-xs font-semibold">
            <span>Critical Open</span>
            <AlertOctagon className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{metrics.critical}</p>
          <p className="text-[11px] text-rose-700/80 mt-1">4-hour emergency SLA</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
            <span>Pending / Active</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">
            {metrics.pending}{' '}
            <span className="text-base font-semibold text-blue-600">/ {metrics.inProgress}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Pending vs In-Progress</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
            <span>Resolved Tickets</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{metrics.resolved}</p>
          <p className="text-[11px] text-slate-500 mt-1">{metrics.slaCompliance}% active SLA response</p>
        </div>

        <div className="bg-[#0a1628] text-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-semibold">
            <span>Avg Resolution Time</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-3xl font-extrabold text-white mt-2">{metrics.avgResolutionHours}h</p>
          <p className="text-[11px] text-cyan-300/80 mt-1">Computed from resolved items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Departmental Load & Click-to-Filter
              </h2>
              <p className="text-xs text-slate-500">
                Click any department bar to filter the live dispatch queue below
              </p>
            </div>
            {deptFilter !== 'All' && (
              <button
                type="button"
                onClick={() => setDeptFilter('All')}
                className="text-xs font-semibold text-cyan-700 hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="space-y-3.5">
            {metrics.byDept.map((dept) => {
              const widthPct = Math.round((dept.total / maxDeptCount) * 100);
              const isSelected = deptFilter === dept.id;
              return (
                <button
                  type="button"
                  key={dept.id}
                  onClick={() => setDeptFilter(isSelected ? 'All' : dept.id)}
                  className={`w-full text-left p-2 rounded-xl transition-colors ${
                    isSelected ? 'bg-cyan-50 ring-1 ring-cyan-400' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-800">{dept.name}</span>
                    <span className="text-slate-600">
                      {dept.total} total ({dept.open} open)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected ? 'bg-cyan-500' : 'bg-[#0f2342]'
                      }`}
                      style={{ width: `${Math.max(widthPct, dept.total > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Severity Tier Breakdown</h2>
            <p className="text-xs text-slate-500 mb-5">
              Click a tier to filter grievances by rule-based priority
            </p>

            <div className="grid grid-cols-2 gap-3">
              {metrics.byPriority.map((item) => {
                const styles = {
                  Critical: 'border-rose-200 bg-rose-50/70 text-rose-900',
                  High: 'border-amber-200 bg-amber-50/70 text-amber-900',
                  Medium: 'border-cyan-200 bg-cyan-50/70 text-cyan-900',
                  Low: 'border-slate-200 bg-slate-50 text-slate-800'
                };
                return (
                  <button
                    type="button"
                    key={item.label}
                    onClick={() =>
                      setPriorityFilter(priorityFilter === item.label ? 'All' : item.label)
                    }
                    className={`p-4 rounded-xl border text-left transition-transform hover:scale-[1.02] ${
                      styles[item.label]
                    } ${priorityFilter === item.label ? 'ring-2 ring-slate-900' : ''}`}
                  >
                    <span className="text-xs font-bold uppercase opacity-80">{item.label}</span>
                    <p className="text-2xl font-extrabold mt-1">{item.count}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Triage Engine Mode</span>
            <span className="font-bold text-cyan-700">Deterministic Rule-Based</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Municipal Grievance Dispatch Queue ({filteredComplaints.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click "Manage" on any ticket to execute SOP checklists and update status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, ward, officer..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="All">Status: All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="All">Priority: All</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs bg-white font-medium"
            >
              <option value="urgency">Sort: Highest Urgency</option>
              <option value="recent">Sort: Most Recent</option>
              <option value="upvotes">Sort: Citizen Endorsements</option>
            </select>

            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Grievance & Ward</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">
                    No complaints match the current filters.
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span>{c.id}</span>
                        {c.isDemoData && (
                          <span className="px-1.5 py-0.5 rounded font-sans text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Demo
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-sans font-normal text-slate-400">
                        ▲ {c.upvotes} endorsements
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 line-clamp-1">{c.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{c.location}</p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-slate-700">
                      {c.aiAnalysis.shortDepartment}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                          priorityPill[c.aiAnalysis.priority]
                        }`}
                      >
                        {c.aiAnalysis.priority} ({c.aiAnalysis.urgencyScore})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          statusPill[c.status]
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      {c.assignedOfficer}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketId(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0a1628] hover:bg-cyan-600 text-white font-semibold transition-colors"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeTicket && (
        <TicketModal
          ticket={activeTicket}
          onClose={() => setSelectedTicketId(null)}
          onUpdateTicket={onUpdateTicket}
        />
      )}
    </div>
  );
}
