import React from 'react';
import {
  ShieldCheck,
  FilePlus2,
  SearchCheck,
  LayoutDashboard,
  Code2,
  RotateCcw
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  totalCount,
  criticalCount,
  onOpenArchitecture,
  onResetDemo
}) {
  const navItems = [
    { id: 'submit', label: 'Lodge Grievance', icon: FilePlus2 },
    { id: 'track', label: 'Track Status', icon: SearchCheck, badge: totalCount },
    { id: 'admin', label: 'Command Center', icon: LayoutDashboard, alertBadge: criticalCount }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a1628] text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveTab('submit')}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-extrabold tracking-tight text-white">
                    Civic<span className="text-cyan-400">Resolve</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    RULE-BASED XAI v2.4
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  AI-Powered Citizen Grievance & Municipal Command
                </p>
              </div>
            </button>

            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={onOpenArchitecture}
                title="View Project Architecture & Deployment"
                className="p-2 rounded-lg bg-slate-800/80 text-cyan-300 hover:bg-slate-700"
              >
                <Code2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.alertBadge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500 text-white animate-pulse">
                      {item.alertBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Deploy & Docs</span>
            </button>
            <button
              type="button"
              onClick={onResetDemo}
              title="Restore initial fictional demo dataset"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
