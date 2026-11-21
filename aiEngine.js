export const DEPARTMENTS = [
  {
    id: 'roads',
    name: 'Roads & Traffic Engineering',
    shortName: 'Roads & Traffic',
    helpline: '1073',
    keywords: [
      'pothole', 'road', 'asphalt', 'bridge', 'footpath', 'pavement',
      'traffic', 'signal', 'crater', 'highway', 'speedbreaker', 'divider',
      'barricade', 'sinkhole', 'manhole cover'
    ],
    sop: [
      'Dispatch Ward Junior Engineer (Civil) with geo-tagged inspection kit within SLA.',
      'Place reflective safety barricades around damaged stretch to prevent vehicle accidents.',
      'Execute cold-mix bitumen patch or RCC slab replacement and upload post-work photo.'
    ]
  },
  {
    id: 'water',
    name: 'Water Supply & Sewerage Board',
    shortName: 'Water & Drainage',
    helpline: '1916',
    keywords: [
      'water', 'pipe', 'leak', 'leakage', 'drain', 'drainage', 'sewer',
      'sewage', 'overflow', 'flood', 'flooding', 'waterlogging', 'contamination',
      'dirty water', 'burst', 'pipeline', 'tap', 'supply'
    ],
    sop: [
      'Isolate affected distribution valve to halt potable water loss or sewage backflow.',
      'Deploy jetting/suction tanker and pipeline maintenance crew to site.',
      'Conduct residual chlorine & turbidity quality test before restoring supply.'
    ]
  },
  {
    id: 'electricity',
    name: 'Electricity & Street Lighting',
    shortName: 'Power & Lights',
    helpline: '1912',
    keywords: [
      'electric', 'electricity', 'wire', 'live wire', 'spark', 'sparking',
      'transformer', 'pole', 'streetlight', 'street light', 'dark', 'blackout',
      'power', 'shock', 'short circuit', 'cable', 'outage'
    ],
    sop: [
      'Issue immediate feeder shutdown alert if exposed or sparking conductors are reported.',
      'Dispatch Lineman Emergency Van with insulated boom lift and PPE.',
      'Verify earthing integrity and restore street illumination before dusk.'
    ]
  },
  {
    id: 'sanitation',
    name: 'Solid Waste & Public Health',
    shortName: 'Sanitation & Waste',
    helpline: '155304',
    keywords: [
      'garbage', 'trash', 'waste', 'dump', 'dumping', 'smell', 'stink',
      'mosquito', 'dengue', 'malaria', 'dead animal', 'carcass', 'bin',
      'sweeping', 'sanitation', 'filth', 'plastic', 'hygiene'
    ],
    sop: [
      'Assign compactor vehicle and sanitation squad for immediate clearance.',
      'Apply bio-enzyme disinfectant and anti-larval fogging within 50m radius.',
      'Log ward contractor compliance score in daily Swachh audit.'
    ]
  },
  {
    id: 'parks',
    name: 'Urban Forestry & Public Parks',
    shortName: 'Parks & Trees',
    helpline: '1800-425-1111',
    keywords: [
      'tree', 'fallen tree', 'branch', 'park', 'garden', 'playground',
      'bench', 'trimming', 'overgrown', 'uprooted', 'greenery', 'lawn'
    ],
    sop: [
      'Deploy rapid chainsaw clearance crew if fallen branches obstruct carriageway.',
      'Inspect adjacent root stability to prevent secondary collapse.',
      'Transport green waste to municipal composting facility.'
    ]
  },
  {
    id: 'enforcement',
    name: 'Civic Encroachment & Safety',
    shortName: 'Civic Enforcement',
    helpline: '112',
    keywords: [
      'encroachment', 'illegal', 'construction', 'noise', 'loudspeaker',
      'stray', 'blocking', 'parking', 'unsafe building', 'collapse', 'hazard'
    ],
    sop: [
      'Verify municipal permit status via GIS property registry.',
      'Serve statutory 24-hour notice or execute immediate hazard cordoning.',
      'Coordinate with local traffic/police outpost if public right-of-way is blocked.'
    ]
  }
];

const CRITICAL_SIGNALS = [
  { term: 'live wire', weight: 42, reason: 'Exposed electrical hazard ("live wire") poses immediate life-safety risk' },
  { term: 'sparking', weight: 38, reason: 'Active electrical arcing ("sparking") requires emergency feeder isolation' },
  { term: 'collapse', weight: 40, reason: 'Structural failure risk ("collapse") triggers emergency disaster protocol' },
  { term: 'sinkhole', weight: 38, reason: 'Roadbed cavity ("sinkhole") threatens severe vehicular accidents' },
  { term: 'burst', weight: 32, reason: 'Pressurized main rupture ("burst") causes rapid infrastructure damage' },
  { term: 'hospital', weight: 25, reason: 'Proximity to critical healthcare facility ("hospital") elevates civic priority' },
  { term: 'school', weight: 24, reason: 'Proximity to children/educational zone ("school") elevates safety weight' },
  { term: 'accident', weight: 30, reason: 'Reported public injury/collision risk ("accident")' },
  { term: 'flooding', weight: 28, reason: 'Active inundation ("flooding") disrupts mobility and sanitation' },
  { term: 'open manhole', weight: 36, reason: 'Unprotected vertical drop ("open manhole") poses severe pedestrian fatality risk' },
  { term: 'dengue', weight: 26, reason: 'Vector-borne disease outbreak indicator ("dengue")' },
  { term: 'overflow', weight: 22, reason: 'Active sewage/drain overflow ("overflow") creates public health hazard' },
  { term: 'fallen tree', weight: 28, reason: 'Roadway obstruction ("fallen tree") blocks emergency vehicle access' },
  { term: 'dark', weight: 15, reason: 'Unlit public corridor ("dark") compromises pedestrian night safety' },
  { term: 'days', weight: 12, reason: 'Multi-day unresolved duration detected in citizen narrative' },
  { term: 'week', weight: 16, reason: 'Chronic unresolved issue (>1 week) escalated for SLA compliance' }
];

export function analyzeComplaint({ title = '', description = '', selectedCategory = 'Auto-Detect' }) {
  const fullText = `${title} ${description}`.toLowerCase();

  let bestDept = DEPARTMENTS[0];
  let maxHits = 0;
  let matchedKeywords = [];

  DEPARTMENTS.forEach((dept) => {
    const hits = dept.keywords.filter((kw) => fullText.includes(kw));
    if (hits.length > maxHits) {
      maxHits = hits.length;
      bestDept = dept;
      matchedKeywords = hits;
    }
  });

  if (selectedCategory && selectedCategory !== 'Auto-Detect') {
    const manual = DEPARTMENTS.find((d) => d.name === selectedCategory || d.id === selectedCategory);
    if (manual) {
      bestDept = manual;
      matchedKeywords = manual.keywords.filter((kw) => fullText.includes(kw));
    }
  }

  let score = 32;
  const reasons = [];

  if (matchedKeywords.length > 0) {
    score += Math.min(matchedKeywords.length * 6, 18);
    reasons.push(
      `Matched ${matchedKeywords.length} domain indicator${matchedKeywords.length > 1 ? 's' : ''} (${matchedKeywords
        .slice(0, 3)
        .map((k) => `"${k}"`)
        .join(', ')}) mapped to ${bestDept.shortName}.`
    );
  } else {
    reasons.push(`Routed to ${bestDept.shortName} via default municipal taxonomy rules.`);
  }

  CRITICAL_SIGNALS.forEach((sig) => {
    if (fullText.includes(sig.term)) {
      score += sig.weight;
      reasons.push(sig.reason + '.');
    }
  });

  if (description.trim().length > 110) {
    score += 5;
    reasons.push('Detailed citizen description (+5 confidence) provides actionable field coordinates.');
  }

  score = Math.min(Math.max(score, 18), 99);

  let priority = 'Low';
  let slaHours = 72;
  let isEmergency = false;

  if (score >= 80) {
    priority = 'Critical';
    slaHours = 4;
    isEmergency = true;
  } else if (score >= 60) {
    priority = 'High';
    slaHours = 12;
  } else if (score >= 42) {
    priority = 'Medium';
    slaHours = 36;
  }

  const confidence = Math.min(72 + matchedKeywords.length * 7 + (reasons.length > 1 ? 8 : 0), 98);

  return {
    departmentId: bestDept.id,
    department: bestDept.name,
    shortDepartment: bestDept.shortName,
    helpline: bestDept.helpline,
    priority,
    urgencyScore: score,
    slaHours,
    isEmergency,
    confidence,
    matchedKeywords,
    reasons: reasons.slice(0, 4),
    suggestedActions: bestDept.sop,
    engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
  };
}

function tokenize(text) {
  const stopWords = new Set([
    'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for',
    'of', 'near', 'from', 'with', 'has', 'have', 'been', 'very', 'please', 'fix'
  ]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w))
  );
}

export function findSimilarComplaints(title, description, location, existingComplaints) {
  const queryTokens = tokenize(`${title} ${description}`);
  if (queryTokens.size < 2) return [];

  const locLower = (location || '').toLowerCase().trim();

  return existingComplaints
    .filter((c) => c.status !== 'Resolved')
    .map((c) => {
      const targetTokens = tokenize(`${c.title} ${c.description}`);
      let intersection = 0;
      queryTokens.forEach((t) => {
        if (targetTokens.has(t)) intersection++;
      });
      const union = new Set([...queryTokens, ...targetTokens]).size;
      let similarity = union === 0 ? 0 : intersection / union;

      if (locLower && c.location.toLowerCase().includes(locLower)) {
        similarity += 0.18;
      }

      return {
        ...c,
        similarityScore: Math.min(Math.round(similarity * 100), 99)
      };
    })
    .filter((c) => c.similarityScore >= 32)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 2);
}
