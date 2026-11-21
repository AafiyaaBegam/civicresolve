import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Sparkles,
  MapPin,
  Upload,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Copy,
  ThumbsUp,
  Send,
  PhoneCall,
  Info,
  X
} from 'lucide-react';
import { DEPARTMENTS, analyzeComplaint, findSimilarComplaints } from '../utils/aiEngine';

const DEMO_PRESETS = [
  {
    label: '⚡ Live Wire Hazard (Demo)',
    title: 'Sparking electric wire hanging low near Children Park',
    description:
      'An insulated power cable snapped and is sparking near the entrance of Children Park in Ward 04. High risk of electric shock for pedestrians.',
    location: 'Ward 04, Children Park Main Road',
    category: 'Auto-Detect',
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '🕳️ Pothole & Drain Leak (Demo)',
    title: 'Severe road crater and sewage drain overflow near Hospital',
    description:
      'Huge pothole and overflowing sewage drain right outside District Government Hospital gate causing traffic jam and unhygienic condition for 4 days.',
    location: 'Ward 02, Hospital Junction',
    category: 'Auto-Detect',
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  },
  {
    label: '🗑️ Garbage Dump (Demo)',
    title: 'Overflowing community garbage bin not cleared for 5 days',
    description:
      'Solid waste dumped on the footpath near Market Cross Street. Foul smell and stray animals scattering trash everywhere.',
    location: 'Ward 07, Market Cross Street',
    category: 'Auto-Detect',
    imageUrl: ''
  }
];

export default function CitizenPortal({
  complaints,
  onAddComplaint,
  onUpvoteComplaint,
  onNavigateTrack
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Auto-Detect');
  const [location, setLocation] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copiedId, setCopiedId] = useState(false);

  const aiPreview = useMemo(
    () => analyzeComplaint({ title, description, selectedCategory: category }),
    [title, description, category]
  );

  const potentialDuplicates = useMemo(
    () => findSimilarComplaints(title, description, location, complaints),
    [title, description, location, complaints]
  );

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: 'Image must be under 3 MB.' }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      setErrors((prev) => ({ ...prev, image: null }));
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setLocation(preset.location);
    setCategory(preset.category);
    setImageUrl(preset.imageUrl);
    setErrors({});
    setSubmittedTicket(null);
  };

  const validate = () => {
    const nextErrors = {};
    if (title.trim().length < 8) {
      nextErrors.title = 'Please enter a clear issue headline (at least 8 characters).';
    }
    if (description.trim().length < 20) {
      nextErrors.description = 'Provide at least 20 characters describing the hazard or duration.';
    }
    if (location.trim().length < 4) {
      nextErrors.location = 'Please specify a Ward number, street, or landmark.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date().toISOString();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `CR-2026-${randomNum}`;

    const newTicket = {
      id: newId,
      isDemoData: false,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      citizenName: citizenName.trim() || 'Anonymous Citizen',
      citizenPhone: citizenPhone.trim() || 'Not Provided',
      imageUrl,
      status: 'Pending',
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      upvotes: 1,
      assignedOfficer: 'Auto-Assigned to Ward Nodal Officer',
      adminNotes: '',
      completedSteps: [],
      aiAnalysis: aiPreview,
      history: [
        {
          time: now,
          actor: citizenName.trim() || 'Citizen Portal',
          action: 'Grievance registered via CivicResolve Portal.'
        },
        {
          time: now,
          actor: 'CivicResolve Rule Engine',
          action: `Classified as ${aiPreview.priority.toUpperCase()} (${aiPreview.urgencyScore}/100) -> ${aiPreview.department} (${aiPreview.slaHours}h SLA).`
        }
      ]
    };

    onAddComplaint(newTicket);
    setSubmittedTicket(newTicket);
    setTitle('');
    setDescription('');
    setLocation('');
    setCategory('Auto-Detect');
    setImageUrl('');
  };

  const copyId = (id) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const priorityBadgeStyle = {
    Critical: 'bg-rose-100 text-rose-800 border-rose-300',
    High: 'bg-amber-100 text-amber-800 border-amber-300',
    Medium: 'bg-cyan-100 text-cyan-800 border-cyan-300',
    Low: 'bg-slate-100 text-slate-700 border-slate-300'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="bg-gradient-to-r from-[#0a1628] via-[#0f2342] to-[#132d54] rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent Rule-Based AI Triage & Instant SLA Routing</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Report a Civic Issue. Watch Rule-Based AI Route It Live.
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Every grievance is automatically classified by department, scored for public safety
              urgency, checked for existing ward duplicates, and assigned a binding resolution SLA.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 shrink-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
              1-Click Demo Presets (Sample Data)
            </p>
            <div className="flex flex-wrap gap-2">
              {DEMO_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-xs font-medium text-slate-200 border border-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {submittedTicket && (
        <div className="mb-8 bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 shadow-md animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Grievance Registered & Dispatched
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  Complaint ID: <span className="font-mono text-emerald-700">{submittedTicket.id}</span>
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Assigned to <strong>{submittedTicket.aiAnalysis.department}</strong> with{' '}
                  <strong>{submittedTicket.aiAnalysis.priority}</strong> priority (Target SLA:{' '}
                  <strong>{submittedTicket.aiAnalysis.slaHours} hours</strong>).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => copyId(submittedTicket.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTrack(submittedTicket.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0a1628] text-white text-sm font-semibold hover:bg-slate-800"
              >
                <span>Track Live Status</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Citizen Grievance Filing Form</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Fields marked with * are required. Leave Department on Auto-Detect for rule-based AI routing.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-1.5">
              Complaint Headline *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Broken streetlight and open manhole near Ward 12 Bus Stop"
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                errors.title ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-semibold text-slate-800">
                Detailed Description & Safety Impact *
              </label>
              <span className="text-xs text-slate-400">{description.length} chars</span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact issue, how long it has persisted, and whether it is near a school, hospital, or main road..."
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                errors.description ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
              }`}
            />
            {errors.description && (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {potentialDuplicates.length > 0 && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-3 animate-fade-in">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-bold text-amber-900">
                    Similar Active Complaint Detected in This Area
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    To prevent duplicate tickets, you can endorse an existing report to boost its
                    priority score instead of filing a new one.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {potentialDuplicates.map((dup) => (
                  <div
                    key={dup.id}
                    className="bg-white rounded-lg p-3 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{dup.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          {dup.similarityScore}% Match
                        </span>
                        {dup.isDemoData && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600">
                            Demo Data
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">{dup.status}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900 mt-1">{dup.title}</p>
                      <p className="text-[11px] text-slate-500">{dup.location}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onUpvoteComplaint(dup.id)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shrink-0"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Endorse ({dup.upvotes})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Ward / Street / Landmark *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Ward 14, Main Bazaar"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    errors.location ? 'border-rose-500 bg-rose-50/40' : 'border-slate-300'
                  }`}
                />
              </div>
              {errors.location && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                Department Routing
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Auto-Detect">✨ Rule-Based Auto-Detect (Recommended)</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Citizen Name (Optional)
              </label>
              <input
                type="text"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile for SMS Alerts (Optional)
              </label>
              <input
                type="tel"
                value={citizenPhone}
                onChange={(e) => setCitizenPhone(e.target.value)}
                placeholder="+91 98XXX XXXXX"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Site Photo Evidence (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-slate-400 hover:border-cyan-600 bg-slate-50 hover:bg-cyan-50/40 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-cyan-600" />
                <span>Upload Image (JPG/PNG)</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              {imageUrl && (
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-14 w-20 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
            {errors.image && <p className="text-xs text-rose-600 mt-1">{errors.image}</p>}
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0a1628] to-[#16325c] hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Submit Grievance & Dispatch to Department</span>
          </button>
        </form>

        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          {aiPreview.isEmergency && (
            <div className="bg-rose-600 text-white rounded-2xl p-5 shadow-lg border border-rose-400 animate-fade-in">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-7 h-7 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                    Critical Public Safety Alert
                  </span>
                  <h3 className="text-base font-extrabold mt-1">
                    Fast-Track 4-Hour Emergency SLA Triggered
                  </h3>
                  <p className="text-xs text-rose-100 mt-1">
                    If there is immediate danger to human life, also call Unified Emergency{' '}
                    <strong>112</strong> or Dept Helpline <strong>{aiPreview.helpline}</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-[#0a1628] px-5 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold">Live Rule-Based Triage (XAI)</h3>
              </div>
              <span className="text-[11px] font-mono text-cyan-300">
                {aiPreview.confidence}% Rule Match
              </span>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Routed Department
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {aiPreview.shortDepartment}
                  </p>
                  <p className="text-[11px] text-cyan-700 font-medium mt-0.5 flex items-center gap-1">
                    <PhoneCall className="w-3 h-3" /> Helpline: {aiPreview.helpline}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">
                    Urgency & SLA
                  </span>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                        priorityBadgeStyle[aiPreview.priority]
                      }`}
                    >
                      {aiPreview.priority}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {aiPreview.urgencyScore}/100
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Target SLA: {aiPreview.slaHours} hrs
                  </p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-600">Hazard Severity Index</span>
                  <span className="text-slate-900">{aiPreview.urgencyScore} / 100</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      aiPreview.urgencyScore >= 80
                        ? 'bg-rose-500'
                        : aiPreview.urgencyScore >= 60
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${aiPreview.urgencyScore}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Why This Priority Was Assigned
                </h4>
                <ul className="space-y-1.5">
                  {aiPreview.reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 bg-cyan-50/60 border border-cyan-100 rounded-lg px-3 py-2 leading-relaxed"
                    >
                      • {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Suggested Field Resolution Steps
                </h4>
                <ol className="space-y-1.5">
                  {aiPreview.suggestedActions.map((step, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
                <Info className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                <span>
                  Uses <strong>{aiPreview.engineLabel}</strong>. No external paid or remote AI API
                  is connected; all classification and scoring run locally via deterministic rules.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
