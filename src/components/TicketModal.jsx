import React, { useState } from 'react';
import {
  X,
  CheckSquare,
  Square,
  Sparkles,
  MapPin,
  Clock,
  Save
} from 'lucide-react';

export default function TicketModal({ ticket, onClose, onUpdateTicket }) {
  const [status, setStatus] = useState(ticket.status);
  const [assignedOfficer, setAssignedOfficer] = useState(ticket.assignedOfficer);
  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes || '');
  const [completedSteps, setCompletedSteps] = useState(ticket.completedSteps || []);

  const toggleStep = (index) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const statusChanged = status !== ticket.status;

    const newHistoryEntry = {
      time: now,
      actor: assignedOfficer || 'Municipal Admin',
      action: statusChanged
        ? `Status updated from ${ticket.status} to ${status}. ${
            adminNotes ? `Note: ${adminNotes}` : ''
          }`
        : `Updated field notes & SOP checklist (${completedSteps.length}/${ticket.aiAnalysis.suggestedActions.length} steps).`
    };

    onUpdateTicket(ticket.id, {
      status,
      assignedOfficer,
      adminNotes,
      completedSteps,
      updatedAt: now,
      resolvedAt: status === 'Resolved' ? ticket.resolvedAt || now : null,
      history: [...ticket.history, newHistoryEntry]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-fade-in">
        <div className="bg-[#0a1628] px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-cyan-400">{ticket.id}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/10">
                {ticket.aiAnalysis.priority} ({ticket.aiAnalysis.urgencyScore}/100)
              </span>
              {ticket.isDemoData && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/30 text-indigo-200">
                  Demo Data
                </span>
              )}
            </div>
            <h2 className="text-base font-bold mt-1 line-clamp-1">{ticket.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <p className="text-sm text-slate-800">{ticket.description}</p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {ticket.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> SLA: {ticket.aiAnalysis.slaHours}h
              </span>
              <span>
                Citizen: <strong>{ticket.citizenName}</strong> ({ticket.citizenPhone})
              </span>
            </div>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-950 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-600" />
              <span>Rule-Based Triage Justification ({ticket.aiAnalysis.department})</span>
            </div>
            <ul className="space-y-1 text-xs text-cyan-900">
              {ticket.aiAnalysis.reasons.map((r, i) => (
                <li key={i}>• {r}</li>
              ))}
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Standard Operating Procedure (SOP) Execution Checklist
            </label>
            <div className="space-y-2">
              {ticket.aiAnalysis.suggestedActions.map((step, idx) => {
                const checked = completedSteps.includes(idx);
                return (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`w-full text-left flex items-start gap-2.5 p-3 rounded-xl border text-xs transition-colors ${
                      checked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <span className={checked ? 'line-through opacity-80' : ''}>{step}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Workflow Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Field Officer
              </label>
              <input
                type="text"
                value={assignedOfficer}
                onChange={(e) => setAssignedOfficer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Action / Resolution Remarks (Visible to Citizen)
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Document field action taken, crew dispatched, or verification details..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0a1628] hover:bg-cyan-600 text-white text-xs font-bold shadow transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
