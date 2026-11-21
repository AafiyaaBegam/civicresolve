import React from 'react';
import { X, Terminal, Cloud, GitBranch, Cpu } from 'lucide-react';

export default function ArchitectureModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-[#0a1628] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold">
              System Architecture, GitHub & Google Cloud Run Guide
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Terminal className="w-4 h-4 text-cyan-600" />
                <span>1. Local Vite Setup</span>
              </div>
              <pre className="bg-slate-900 text-cyan-300 p-2.5 rounded-lg overflow-x-auto mt-2">
{`npm install
npm run dev`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <GitBranch className="w-4 h-4 text-cyan-600" />
                <span>2. GitHub Push</span>
              </div>
              <pre className="bg-slate-900 text-cyan-300 p-2.5 rounded-lg overflow-x-auto mt-2">
{`git init
git add .
git commit -m "CivicResolve v1"
git push -u origin main`}
              </pre>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Cloud className="w-4 h-4 text-cyan-600" />
                <span>3. Cloud Run Deploy</span>
              </div>
              <pre className="bg-slate-900 text-cyan-300 p-2.5 rounded-lg overflow-x-auto mt-2">
{`gcloud run deploy civicresolve \\
  --source . \\
  --region asia-south1 \\
  --allow-unauthenticated`}
              </pre>
            </div>
          </div>

          <div className="bg-cyan-50/70 border border-cyan-200 rounded-xl p-4 space-y-1.5">
            <h3 className="font-bold text-slate-900">Transparent Rule-Based Triage & Demo Data</h3>
            <p>
              <strong>CivicResolve</strong> uses a deterministic rule-based scoring engine (
              <code>src/utils/aiEngine.js</code>) without claiming external AI APIs, Jaccard
              duplicate detection, and LocalStorage persistence. Pre-loaded tickets are clearly
              marked as fictional <strong>Demo Data</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
