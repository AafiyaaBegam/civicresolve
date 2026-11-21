export const DEMO_BANNER_LABEL = 'Demo Data — Fictional Sample Grievances for Evaluation';

export const SEED_COMPLAINTS = [
  {
    id: 'CR-2026-8841',
    isDemoData: true,
    title: 'Live overhead wire sparking near Government High School gate',
    description:
      'A high-tension service cable snapped during last night rain and is sparking near the main pedestrian gate of Government High School, Ward 14. Immediate feeder isolation required before morning assembly.',
    location: 'Ward 14, Anna Salai Main Gate, Valparai',
    citizenName: 'Meenakshi Sundaram (Demo)',
    citizenPhone: '+91 98422 11490',
    imageUrl:
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    status: 'In Progress',
    createdAt: '2026-11-21T07:15:00.000Z',
    updatedAt: '2026-11-21T08:05:00.000Z',
    resolvedAt: null,
    upvotes: 19,
    assignedOfficer: 'Er. K. Balaji (AE Electrical — Demo)',
    adminNotes: 'Feeder F-04 isolated. Emergency boom truck en route to replace snapped insulator.',
    completedSteps: [0],
    aiAnalysis: {
      departmentId: 'electricity',
      department: 'Electricity & Street Lighting',
      shortDepartment: 'Power & Lights',
      helpline: '1912',
      priority: 'Critical',
      urgencyScore: 96,
      slaHours: 4,
      isEmergency: true,
      confidence: 96,
      matchedKeywords: ['wire', 'live wire', 'sparking'],
      reasons: [
        'Matched 3 domain indicators ("wire", "live wire", "sparking") mapped to Power & Lights.',
        'Exposed electrical hazard ("live wire") poses immediate life-safety risk.',
        'Active electrical arcing ("sparking") requires emergency feeder isolation.',
        'Proximity to children/educational zone ("school") elevates safety weight.'
      ],
      suggestedActions: [
        'Issue immediate feeder shutdown alert if exposed or sparking conductors are reported.',
        'Dispatch Lineman Emergency Van with insulated boom lift and PPE.',
        'Verify earthing integrity and restore street illumination before dusk.'
      ],
      engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
    },
    history: [
      {
        time: '2026-11-21T07:15:00.000Z',
        actor: 'Citizen Portal',
        action: 'Demo complaint lodged with geo-tag and hazard photo.'
      },
      {
        time: '2026-11-21T07:15:05.000Z',
        actor: 'CivicResolve Rule Engine',
        action: 'Auto-classified as CRITICAL (Score 96/100) -> Electricity & Street Lighting (4h SLA).'
      },
      {
        time: '2026-11-21T08:05:00.000Z',
        actor: 'Er. K. Balaji (AE Electrical — Demo)',
        action: 'Status changed to In Progress. Feeder F-04 isolated for safety.'
      }
    ]
  },
  {
    id: 'CR-2026-8837',
    isDemoData: true,
    title: 'Deep waterlogged pothole and open manhole cover on Market Road',
    description:
      'A 4-foot wide pothole right next to an open manhole cover is completely submerged due to drainage overflow near Central Bus Stand. Two-wheelers are skidding daily.',
    location: 'Ward 06, Old Market Road, Near Bus Stand',
    citizenName: 'Aravindhan R. (Demo)',
    citizenPhone: '+91 94431 77210',
    imageUrl:
      'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    createdAt: '2026-11-21T06:40:00.000Z',
    updatedAt: '2026-11-21T06:40:00.000Z',
    resolvedAt: null,
    upvotes: 14,
    assignedOfficer: 'Er. S. Priya (JE Civil — Demo)',
    adminNotes: '',
    completedSteps: [],
    aiAnalysis: {
      departmentId: 'roads',
      department: 'Roads & Traffic Engineering',
      shortDepartment: 'Roads & Traffic',
      helpline: '1073',
      priority: 'Critical',
      urgencyScore: 88,
      slaHours: 4,
      isEmergency: true,
      confidence: 92,
      matchedKeywords: ['pothole', 'road', 'manhole cover'],
      reasons: [
        'Matched 3 domain indicators ("pothole", "road", "manhole cover") mapped to Roads & Traffic.',
        'Unprotected vertical drop ("open manhole") poses severe pedestrian fatality risk.',
        'Active sewage/drain overflow ("overflow") creates public health hazard.'
      ],
      suggestedActions: [
        'Dispatch Ward Junior Engineer (Civil) with geo-tagged inspection kit within SLA.',
        'Place reflective safety barricades around damaged stretch to prevent vehicle accidents.',
        'Execute cold-mix bitumen patch or RCC slab replacement and upload post-work photo.'
      ],
      engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
    },
    history: [
      {
        time: '2026-11-21T06:40:00.000Z',
        actor: 'Citizen Portal',
        action: 'Demo complaint submitted by Aravindhan R. (Demo).'
      },
      {
        time: '2026-11-21T06:40:03.000Z',
        actor: 'CivicResolve Rule Engine',
        action: 'Flagged CRITICAL due to "open manhole" hazard. Assigned 4h emergency SLA.'
      }
    ]
  },
  {
    id: 'CR-2026-8829',
    isDemoData: true,
    title: 'Main drinking water pipeline burst flooding residential lane',
    description:
      'Pressurized municipal water pipeline burst near Cooperative Colony Cross Street. Thousands of litres of clean water wasting for 6 hours and entering ground-floor homes.',
    location: 'Ward 09, Cooperative Colony, 3rd Cross',
    citizenName: 'Lakshmi Narayanan (Demo)',
    citizenPhone: '+91 97890 45123',
    imageUrl: '',
    status: 'In Progress',
    createdAt: '2026-11-20T18:20:00.000Z',
    updatedAt: '2026-11-20T21:10:00.000Z',
    resolvedAt: null,
    upvotes: 11,
    assignedOfficer: 'Er. M. Karthik (TWAD Wing — Demo)',
    adminNotes: 'Sub-valve closed. Collar clamp welding underway.',
    completedSteps: [0, 1],
    aiAnalysis: {
      departmentId: 'water',
      department: 'Water Supply & Sewerage Board',
      shortDepartment: 'Water & Drainage',
      helpline: '1916',
      priority: 'High',
      urgencyScore: 78,
      slaHours: 12,
      isEmergency: false,
      confidence: 94,
      matchedKeywords: ['water', 'pipe', 'pipeline', 'burst'],
      reasons: [
        'Matched 4 domain indicators ("water", "pipe", "pipeline", "burst") mapped to Water & Drainage.',
        'Pressurized main rupture ("burst") causes rapid infrastructure damage.',
        'Active inundation ("flooding") disrupts mobility and sanitation.'
      ],
      suggestedActions: [
        'Isolate affected distribution valve to halt potable water loss or sewage backflow.',
        'Deploy jetting/suction tanker and pipeline maintenance crew to site.',
        'Conduct residual chlorine & turbidity quality test before restoring supply.'
      ],
      engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
    },
    history: [
      {
        time: '2026-11-20T18:20:00.000Z',
        actor: 'Citizen Portal',
        action: 'Demo complaint submitted.'
      },
      {
        time: '2026-11-20T21:10:00.000Z',
        actor: 'Er. M. Karthik (TWAD Wing — Demo)',
        action: 'Valve isolated and repair team deployed.'
      }
    ]
  },
  {
    id: 'CR-2026-8814',
    isDemoData: true,
    title: 'Uncollected garbage dump & mosquito breeding behind Gandhi Park',
    description:
      'Garbage bins have not been cleared for a week behind Gandhi Park North Gate. Foul smell and stagnant rainwater causing severe dengue mosquito menace for nearby residents.',
    location: 'Ward 03, Gandhi Park North Gate',
    citizenName: 'Deepa Krishnan (Demo)',
    citizenPhone: '+91 90032 88912',
    imageUrl: '',
    status: 'Resolved',
    createdAt: '2026-11-19T09:10:00.000Z',
    updatedAt: '2026-11-19T16:45:00.000Z',
    resolvedAt: '2026-11-19T16:45:00.000Z',
    upvotes: 8,
    assignedOfficer: 'R. Senthil (Sanitary Inspector — Demo)',
    adminNotes: '2.4 tons waste cleared via compactor. Anti-larval fogging completed.',
    completedSteps: [0, 1, 2],
    aiAnalysis: {
      departmentId: 'sanitation',
      department: 'Solid Waste & Public Health',
      shortDepartment: 'Sanitation & Waste',
      helpline: '155304',
      priority: 'High',
      urgencyScore: 72,
      slaHours: 12,
      isEmergency: false,
      confidence: 95,
      matchedKeywords: ['garbage', 'dump', 'smell', 'mosquito', 'dengue', 'bin'],
      reasons: [
        'Matched 6 domain indicators ("garbage", "dump", "smell") mapped to Sanitation & Waste.',
        'Vector-borne disease outbreak indicator ("dengue").',
        'Chronic unresolved issue (>1 week) escalated for SLA compliance.'
      ],
      suggestedActions: [
        'Assign compactor vehicle and sanitation squad for immediate clearance.',
        'Apply bio-enzyme disinfectant and anti-larval fogging within 50m radius.',
        'Log ward contractor compliance score in daily Swachh audit.'
      ],
      engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
    },
    history: [
      {
        time: '2026-11-19T09:10:00.000Z',
        actor: 'Citizen Portal',
        action: 'Demo complaint submitted.'
      },
      {
        time: '2026-11-19T13:00:00.000Z',
        actor: 'R. Senthil (Sanitary Inspector — Demo)',
        action: 'Compactor truck dispatched to Ward 03.'
      },
      {
        time: '2026-11-19T16:45:00.000Z',
        actor: 'R. Senthil (Sanitary Inspector — Demo)',
        action: 'Resolved: Area sanitized and fogging completed in 7.5 hours.'
      }
    ]
  },
  {
    id: 'CR-2026-8798',
    isDemoData: true,
    title: 'Uprooted eucalyptus tree blocking single-lane hill connector road',
    description:
      'Strong winds uprooted an old eucalyptus tree across the Estate View connector road. Ambulances and school vans cannot pass through.',
    location: 'Ward 11, Estate View Road, Sector B',
    citizenName: 'Vigneshwaran P. (Demo)',
    citizenPhone: '+91 96295 33104',
    imageUrl: '',
    status: 'Resolved',
    createdAt: '2026-11-18T11:00:00.000Z',
    updatedAt: '2026-11-18T14:20:00.000Z',
    resolvedAt: '2026-11-18T14:20:00.000Z',
    upvotes: 15,
    assignedOfficer: 'T. Natarajan (Horticulture Officer — Demo)',
    adminNotes: 'Tree sectioned and carriageway reopened in 3h 20m.',
    completedSteps: [0, 1, 2],
    aiAnalysis: {
      departmentId: 'parks',
      department: 'Urban Forestry & Public Parks',
      shortDepartment: 'Parks & Trees',
      helpline: '1800-425-1111',
      priority: 'High',
      urgencyScore: 68,
      slaHours: 12,
      isEmergency: false,
      confidence: 88,
      matchedKeywords: ['tree', 'uprooted'],
      reasons: [
        'Matched 2 domain indicators ("tree", "uprooted") mapped to Parks & Trees.',
        'Proximity to children/educational zone ("school") elevates safety weight.'
      ],
      suggestedActions: [
        'Deploy rapid chainsaw clearance crew if fallen branches obstruct carriageway.',
        'Inspect adjacent root stability to prevent secondary collapse.',
        'Transport green waste to municipal composting facility.'
      ],
      engineLabel: 'CivicResolve Rule-Based Triage Engine v2.4 (Transparent XAI)'
    },
    history: [
      {
        time: '2026-11-18T11:00:00.000Z',
        actor: 'Citizen Portal',
        action: 'Demo complaint submitted.'
      },
      {
        time: '2026-11-18T14:20:00.000Z',
        actor: 'T. Natarajan (Horticulture Officer — Demo)',
        action: 'Resolved: Road cleared and logs moved to depot.'
      }
    ]
  }
];
