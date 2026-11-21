import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CitizenPortal from './components/CitizenPortal';
import StatusTracker from './components/StatusTracker';
import AdminDashboard from './components/AdminDashboard';
import ArchitectureModal from './components/ArchitectureModal';
import { SEED_COMPLAINTS, DEMO_BANNER_LABEL } from './data/seedComplaints';

const STORAGE_KEY = 'civicresolve_complaints_v1';

export default function App() {
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (err) {
      console.error('Failed to read LocalStorage:', err);
    }
    return SEED_COMPLAINTS;
  });

  const [activeTab, setActiveTab] = useState('submit');
  const [trackerSearch, setTrackerSearch] = useState('');
  const [showArchModal, setShowArchModal] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
    } catch (err) {
      console.error('Failed to persist to LocalStorage:', err);
    }
  }, [complaints]);

  const handleAddComplaint = (newTicket) => {
    setComplaints((prev) => [newTicket, ...prev]);
  };

  const handleUpvoteComplaint = (id) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const boostedScore = Math.min(c.aiAnalysis.urgencyScore + 2, 99);
        return {
          ...c,
          upvotes: c.upvotes + 1,
          aiAnalysis: {
            ...c.aiAnalysis,
            urgencyScore: boostedScore,
            priority: boostedScore >= 80 ? 'Critical' : c.aiAnalysis.priority
          }
        };
      })
    );
  };

  const handleUpdateTicket = (id, updates) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const handleNavigateTrack = (ticketId) => {
    setTrackerSearch(ticketId);
    setActiveTab('track');
  };

  const handleResetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    setComplaints(SEED_COMPLAINTS);
    setTrackerSearch('');
  };

  const criticalOpenCount = complaints.filter(
    (c) => c.aiAnalysis.priority === 'Critical' && c.status !== 'Resolved'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalCount={complaints.length}
        criticalCount={criticalOpenCount}
        onOpenArchitecture={() => setShowArchModal(true)}
        onResetDemo={handleResetDemo}
      />

      <div className="bg-slate-900 text-slate-300 text-[11px] py-1.5 px-4 text-center border-b border-slate-800">
        {DEMO_BANNER_LABEL} • Transparent Rule-Based Triage (No External AI API Connected)
      </div>

      <main className="flex-1">
        {activeTab === 'submit' && (
          <CitizenPortal
            complaints={complaints}
            onAddComplaint={handleAddComplaint}
            onUpvoteComplaint={handleUpvoteComplaint}
            onNavigateTrack={handleNavigateTrack}
          />
        )}

        {activeTab === 'track' && (
          <StatusTracker
            complaints={complaints}
            initialSearch={trackerSearch}
            onUpvoteComplaint={handleUpvoteComplaint}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            complaints={complaints}
            onUpdateTicket={handleUpdateTicket}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-5 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            <strong>CivicResolve</strong> — AI-Powered Citizen Grievance & Municipal Resolution
            Platform
          </p>
          <p>Rule-Based Triage • LocalStorage Persistence • Cloud Run Ready</p>
        </div>
      </footer>

      {showArchModal && <ArchitectureModal onClose={() => setShowArchModal(false)} />}
    </div>
  );
}
