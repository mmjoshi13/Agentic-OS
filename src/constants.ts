import { Role, Vehicle, Agent, NexusAlert, Permission, RolePermission, Complaint, StakeholderRing, FleetHealth, DMCFeedback, DealerPL, THDRequest, OrchestratorEvent, ActionService, SystemNode, KPI, ServiceAppointment, WorkshopBayStatus, PartVOR, StaffPerformance, DETIssue } from './types';

export const MOCK_SERVICE_APPOINTMENTS: ServiceAppointment[] = [
  {
    id: '1',
    date: '2026-03-06',
    chassisNo: 'MAT12568186',
    customer: 'Mandar Joshi',
    regNo: 'MH-12-AB-1234',
    ppl: 'Nexon EV',
    warranty: 'In Warranty',
    serviceType: '1st Free Service',
    status: 'In Service',
    jcNumber: 'JC-RudAMt-AA3-2526-001120',
    sa: 'Ravi Kulkarni',
    technician: 'Santosh Pawar',
    bay: 'B1 (Mechanical)',
    timeline: {
      gateIn: '8:15 AM',
      jobOpen: '9:25 AM',
      bayAllocated: '10:35 AM',
      workStart: '11:45 AM',
      eqc: 'Pending',
      washing: 'Pending',
      invoice: 'Pending',
      gateOut: 'Pending'
    }
  },
  {
    id: '2',
    date: '2026-03-06',
    chassisNo: 'MAT12568187',
    customer: 'Amit Patel',
    regNo: 'MH-12-CD-5678',
    ppl: 'Harrier',
    warranty: 'Extended Warranty',
    serviceType: 'Paid Service',
    status: 'Washing',
    jcNumber: 'JC-RudAMt-AA3-2526-001121',
    sa: 'Sunita Gaikwad',
    technician: 'Ganesh Bhosale',
    bay: 'B2 (Mechanical)',
    timeline: {
      gateIn: '8:30 AM',
      jobOpen: '9:45 AM',
      bayAllocated: '11:00 AM',
      workStart: '12:15 PM',
      eqc: 'Pending',
      washing: 'Pending',
      invoice: 'Pending',
      gateOut: 'Pending'
    }
  }
];

export const MOCK_WORKSHOP_BAY_STATUS: WorkshopBayStatus[] = [
  { id: '1', bay: 'B1 (Mechanical)', technician: 'Santosh Pawar', vehicle: 'Nexon EV', regNo: 'MH-12-AB-1234', status: 'On Time', efficiency: 94, bayType: 'Mechanical', startTime: '10:35 AM', estimatedEndTime: '12:30 PM', utilization: 92 },
  { id: '2', bay: 'B2 (Mechanical)', technician: 'Ganesh Bhosale', vehicle: 'Harrier', regNo: 'MH-12-CD-5678', status: 'Minor Delay', delay: '15 min', efficiency: 82, bayType: 'Mechanical', startTime: '11:00 AM', estimatedEndTime: '01:30 PM', utilization: 85 },
  { id: '3', bay: 'B3 (Bodyshop)', technician: 'Rahul Jadhav', vehicle: 'Safari', regNo: 'MH-12-GH-3456', status: 'Overdue', delay: '45 min', efficiency: 75, bayType: 'Bodyshop', startTime: '09:00 AM', estimatedEndTime: '04:00 PM', utilization: 95 },
  { id: '4', bay: 'B4 (Mechanical)', technician: 'Mahesh Shinde', vehicle: 'Punch EV', regNo: 'MH-12-EF-9012', status: 'On Time', efficiency: 96, bayType: 'Mechanical', startTime: '11:45 AM', estimatedEndTime: '01:15 PM', utilization: 90 },
  { id: '5', bay: 'B5 (Speedobay)', technician: 'Vishal Kadam', vehicle: 'Altroz', regNo: 'MH-12-OP-0123', status: 'On Time', efficiency: 98, bayType: 'Speedo', startTime: '11:30 AM', estimatedEndTime: '12:00 PM', utilization: 98 },
  { id: '6', bay: 'B6 (Express)', technician: 'Suresh Raina', vehicle: 'Tiago EV', regNo: 'MH-12-XY-7890', status: 'On Time', efficiency: 95, bayType: 'Express', startTime: '11:50 AM', estimatedEndTime: '12:35 PM', utilization: 94 }
];

export const MOCK_PARTS_VOR: PartVOR[] = [
  { id: '1', partNo: 'PT-AC-001', partName: 'AC Compressor Assembly', qty: 1, regNo: 'MH-12-CD-5678', ppl: 'Harrier', jcNo: 'JC-RudAMt-AA3-2526-001121', ageing: '5d', status: 'Order Placed', eta: '2026-03-10', arrangedFrom: 'Regional Warehouse Pune' },
  { id: '2', partNo: 'PT-SUS-002', partName: 'Stabilizer Link Kit', qty: 2, regNo: 'MH-12-EF-9012', ppl: 'Punch EV', jcNo: 'JC-RudAMt-AA3-2526-001122', ageing: '2d', status: 'Pending' },
  { id: '3', partNo: 'PT-RAD-003', partName: 'Radiator Assembly', qty: 1, regNo: 'MH-12-GH-3456', ppl: 'Safari', jcNo: 'JC-RudAMt-AA3-2526-001123', ageing: '8d', status: 'Order Placed', eta: '2026-03-12', arrangedFrom: 'Sai Motors Nashik' },
  { id: '4', partNo: 'PT-BAT-004', partName: '12V Auxiliary Battery', qty: 1, regNo: 'MH-12-AB-1234', ppl: 'Nexon EV', jcNo: 'JC-RudAMt-AA3-2526-001120', ageing: '3d', status: 'Pending' }
];

export const MOCK_TECH_LEADERBOARD: StaffPerformance[] = [
  { id: '1', name: 'Ganesh Bhosale', rv: '1.8%', rc: '0.8%', psf: '4.8', avgTat: '1.5d' },
  { id: '2', name: 'Mahesh Shinde', rv: '1.5%', rc: '1%', psf: '4.7', avgTat: '1.6d' },
  { id: '3', name: 'Santosh Pawar', rv: '2.1%', rc: '1.5%', psf: '4.5', avgTat: '1.8d' },
  { id: '4', name: 'Vishal Kadam', rv: '2.5%', rc: '1.8%', psf: '4.3', avgTat: '2d' },
  { id: '5', name: 'Rahul Jadhav', rv: '3.2%', rc: '2.1%', psf: '4.2', avgTat: '2.1d' }
];

export const MOCK_SA_LEADERBOARD: StaffPerformance[] = [
  { id: '1', name: 'Sunita Gaikwad', activeJobs: 1, avgTime: '35min' },
  { id: '2', name: 'Meera Patil', activeJobs: 2, avgTime: '30min' },
  { id: '3', name: 'Ravi Kulkarni', activeJobs: 3, avgTime: '25min' },
  { id: '4', name: 'Arjun Desai', activeJobs: 4, avgTime: '20min' }
];

export const ROLES: Role[] = [
  'Customer',
  'Receptionist',
  'Service Advisor',
  'Service GM',
  'DET',
  'Technician',
  'Spare Parts Mgr',
  'Dealer Principal',
  'Security Guard',
  'Bay Supervisor',
  'Zone CCM',
  'Regional CCM',
  'CCM',
  'Head of Customer Care',
  'Service Technical Support & Training Head',
  'Training Head',
  'Command Centre Head',
  'Spares Head',
  'Order Processing Manager',
  'Head Quarters',
  'Command Centre',
  'Agentic OS',
  'Admin'
];

export const PERSONA_NAMES: Record<Role, string> = {
  'Customer': 'Mandar Joshi',
  'Receptionist': 'Anjali Singh',
  'Service Advisor': 'Rahul Sharma',
  'Service GM': 'Vikram Malhotra',
  'DET': 'Sanjay Gupta',
  'Technician': 'Rajesh Kumar',
  'Spare Parts Mgr': 'Amit Shah',
  'Dealer Principal': 'Sameer Kulkarni',
  'Security Guard': 'Ram Singh',
  'Bay Supervisor': 'Manoj Kumar',
  'Zone CCM': 'Priya Iyer',
  'Regional CCM': 'Neha Deshmukh',
  'CCM': 'Manoj Verma',
  'Head of Customer Care': 'Kavita Rao',
  'Service Technical Support & Training Head': 'Dr. Arun Mehra',
  'Training Head': 'Sunil Gavaskar',
  'Command Centre Head': 'Capt. Vikram Batra',
  'Spares Head': 'Nitin Gadkari',
  'Order Processing Manager': 'Suresh Prabhu',
  'Head Quarters': 'Central HQ Ops',
  'Command Centre': 'Nexus Ops',
  'Agentic OS': 'Nexus AI',
  'Admin': 'System Administrator'
};

export const MOCK_ALERTS: NexusAlert[] = [
  { 
    id: 'a1', 
    role: 'Spare Parts Mgr', 
    type: 'critical', 
    severityScore: 92, 
    message: 'Nexon EV Brake Pads: Stock-Out in 24h', 
    timestamp: '10:15 AM', 
    agentId: 'spare',
    workshopId: 'W1',
    actions: [
      { label: 'Order Part', type: 'primary' },
      { label: 'View Inventory', type: 'secondary' }
    ]
  },
  { 
    id: 'a2', 
    role: 'Technician', 
    type: 'critical', 
    severityScore: 88, 
    message: 'VIN ...90: Torque Calibration Required (Step 04)', 
    timestamp: '10:30 AM', 
    agentId: 'lms',
    workshopId: 'W1',
    actions: [
      { label: 'Start Training', type: 'primary' }
    ]
  },
  { 
    id: 'a3', 
    role: 'Service Advisor', 
    type: 'warning', 
    severityScore: 65, 
    message: 'VIN ...56: Warranty Approval Pending', 
    timestamp: '09:45 AM', 
    agentId: 'warranty',
    workshopId: 'W1',
    actions: [
      { label: 'Approve Job', type: 'primary' },
      { label: 'Review Telematics', type: 'secondary' }
    ]
  },
  { id: 'a4', role: 'Receptionist', type: 'info', severityScore: 40, message: 'VIP Customer Mandar Joshi arriving in 2 mins', timestamp: '11:00 AM', agentId: 'logistics', workshopId: 'W1' },
  { 
    id: 'a5', 
    role: 'Dealer Principal', 
    type: 'critical', 
    severityScore: 95, 
    message: 'Profit Leakage detected in Bay 2: ₹1.2L', 
    timestamp: '08:00 AM', 
    agentId: 'health',
    actions: [
      { label: 'Investigate', type: 'primary' }
    ]
  },
  { id: 'a6', role: 'Regional CCM', type: 'warning', severityScore: 72, message: 'Delhi North: Efficiency dropped below 50%', timestamp: '10:00 AM' },
  { id: 'a8', role: 'Customer', type: 'warning', severityScore: 82, message: 'Service Due in 1,200 km. Book now for 10% discount.', timestamp: '09:00 AM', actions: [{ label: 'Book Now', type: 'primary' }] },
  { id: 'a9', role: 'Zone CCM', type: 'critical', severityScore: 90, message: 'Zone 4: Critical Parts Shortage (Brake Pads)', timestamp: '08:30 AM', actions: [{ label: 'Allocate Stock', type: 'primary' }] },
  { id: 'a10', role: 'Admin', type: 'info', severityScore: 30, message: 'New User "Rahul Sharma" added to Service Advisor role.', timestamp: '11:15 AM' },
  { id: 'a7', role: 'All', type: 'info', severityScore: 10, message: 'System Maintenance scheduled for 11 PM', timestamp: '07:00 AM' }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    customerName: 'Mandar Joshi',
    vehicleModel: 'Nexon EV',
    issue: 'Battery drain faster than expected',
    status: 'Open',
    priority: 'High',
    timestamp: '2026-03-20T10:00:00Z',
    dealership: 'Pune Central',
    workshopId: 'W1',
    area: 'Pune',
    zone: 'West',
    region: 'West 2'
  },
  {
    id: 'c2',
    customerName: 'Rahul Sharma',
    vehicleModel: 'Harrier',
    issue: 'Suspension noise persists after repair',
    status: 'Open',
    priority: 'High',
    timestamp: '2026-03-21T08:30:00Z',
    dealership: 'Mumbai West',
    workshopId: 'W2',
    area: 'Mumbai',
    zone: 'West',
    region: 'West 1'
  },
  {
    id: 'c3',
    customerName: 'Anjali Singh',
    vehicleModel: 'Safari',
    issue: 'Infotainment system lag',
    status: 'In Progress',
    priority: 'Medium',
    timestamp: '2026-03-19T14:20:00Z',
    dealership: 'Delhi North',
    workshopId: 'W3',
    area: 'Delhi',
    zone: 'North Central',
    region: 'North Central'
  }
];

export const AGENTS: Agent[] = [
  { 
    id: 'health', 
    name: 'Health Agent', 
    status: 'active', 
    description: 'Proactive vehicle diagnostics, SoH alerts, predictive failure.',
    ring: ['Customer', 'Dealer', 'OEM'],
    function: 'Predictive Maintenance & Diagnostics',
    confidenceScore: 96,
    humanOverridePath: '/override/health',
    metrics: {
      successRate: 98.4,
      avgLatency: 420,
      tokensUsed: 124500,
      cost: 1250,
      reliabilityScore: 96,
      uptime: 99.9,
      lastActive: '2 mins ago'
    },
    performanceHistory: [
      { timestamp: '08:00', successRate: 97, latency: 450 },
      { timestamp: '09:00', successRate: 98, latency: 430 },
      { timestamp: '10:00', successRate: 99, latency: 410 },
      { timestamp: '11:00', successRate: 98, latency: 420 }
    ],
    behaviorLogs: [
      { timestamp: '11:42:15', event: 'Pattern Recognition: VIN ...90', status: 'success', explanation: 'Detected abnormal battery discharge pattern consistent with cell imbalance.' },
      { timestamp: '11:40:02', event: 'Predictive Failure Analysis: Battery', status: 'success', explanation: 'SoH dropped to 78% for VIN ...90. Alerting customer.' },
      { timestamp: '11:35:18', event: 'Telematics Sync: Delhi North', status: 'success' }
    ]
  },
  { 
    id: 'warranty', 
    name: 'Warranty AI', 
    status: 'idle', 
    description: 'Claim validation, fraud detection, provision tracking.',
    ring: ['Dealer', 'OEM'],
    function: 'Automated Claim Adjudication',
    confidenceScore: 92,
    humanOverridePath: '/override/warranty',
    metrics: {
      successRate: 91.5,
      avgLatency: 1200,
      tokensUsed: 45000,
      cost: 480,
      reliabilityScore: 88,
      uptime: 98.2,
      lastActive: '1 hour ago'
    },
    performanceHistory: [
      { timestamp: '08:00', successRate: 90, latency: 1300 },
      { timestamp: '09:00', successRate: 91, latency: 1250 },
      { timestamp: '10:00', successRate: 92, latency: 1180 },
      { timestamp: '11:00', successRate: 91, latency: 1200 }
    ],
    behaviorLogs: [
      { timestamp: '10:30:15', event: 'Warranty Approval: VIN ...56', status: 'success', explanation: 'Suspension claim validated against telematics impact data.' },
      { timestamp: '10:15:02', event: 'Fraud Detection: Duplicate Claim', status: 'warning', explanation: 'Potential duplicate claim detected for VIN ...12. Flagged for manual review.' }
    ]
  },
  { 
    id: 'spare', 
    name: 'Spare Care AI', 
    status: 'active', 
    description: 'Parts availability, substitution, logistics ETA.',
    ring: ['Dealer', 'OEM'],
    function: 'Inventory & Supply Chain Optimization',
    confidenceScore: 94,
    humanOverridePath: '/override/spare',
    metrics: {
      successRate: 94.2,
      avgLatency: 850,
      tokensUsed: 89000,
      cost: 920,
      reliabilityScore: 91,
      uptime: 99.5,
      lastActive: '5 mins ago'
    },
    performanceHistory: [
      { timestamp: '08:00', successRate: 92, latency: 900 },
      { timestamp: '09:00', successRate: 94, latency: 870 },
      { timestamp: '10:00', successRate: 95, latency: 840 },
      { timestamp: '11:00', successRate: 94, latency: 850 }
    ],
    behaviorLogs: [
      { timestamp: '11:45:10', event: 'Inventory Optimization: Nexon Pads', status: 'success' },
      { timestamp: '11:30:05', event: 'Demand Forecast: Summer Seasonality', status: 'success' }
    ]
  },
  { 
    id: 'lms', 
    name: 'LMS Agent', 
    status: 'active', 
    description: 'Technician skill gap, certification compliance.',
    ring: ['Dealer'],
    function: 'Workforce Capability Management',
    confidenceScore: 98,
    humanOverridePath: '/override/lms',
    metrics: {
      successRate: 99.1,
      avgLatency: 310,
      tokensUsed: 210000,
      cost: 2100,
      reliabilityScore: 98,
      uptime: 99.9,
      lastActive: 'Just now'
    },
    performanceHistory: [
      { timestamp: '08:00', successRate: 98, latency: 350 },
      { timestamp: '09:00', successRate: 99, latency: 320 },
      { timestamp: '10:00', successRate: 99, latency: 300 },
      { timestamp: '11:00', successRate: 99, latency: 310 }
    ],
    behaviorLogs: [
      { timestamp: '11:50:12', event: 'JIT Training: Torque Calibration', status: 'success' },
      { timestamp: '11:40:05', event: 'Competency Tracking: Bay 4', status: 'success' }
    ]
  },
  { 
    id: 'logistics', 
    name: 'Logistics Agent', 
    status: 'processing', 
    description: 'Inter-dealer transfer, BRC dispatch, last-mile tracking.',
    ring: ['Dealer', 'OEM'],
    function: 'Network Logistics & Fulfillment',
    confidenceScore: 88,
    humanOverridePath: '/override/logistics',
    metrics: {
      successRate: 88.7,
      avgLatency: 1500,
      tokensUsed: 156000,
      cost: 1600,
      reliabilityScore: 85,
      uptime: 97.5,
      lastActive: 'Processing...'
    },
    performanceHistory: [
      { timestamp: '08:00', successRate: 85, latency: 1700 },
      { timestamp: '09:00', successRate: 87, latency: 1600 },
      { timestamp: '10:00', successRate: 89, latency: 1450 },
      { timestamp: '11:00', successRate: 88, latency: 1500 }
    ],
    behaviorLogs: [
      { timestamp: '11:55:02', event: 'Bay Optimization: Bay 2', status: 'success' },
      { timestamp: '11:45:18', event: 'Route Calculation: VIP Arrival', status: 'success' }
    ]
  },
  { 
    id: 'det-expert', 
    name: 'DET', 
    status: 'active', 
    description: 'Specialized in complex technical diagnostics, HV battery, and software issues.',
    ring: ['OEM'],
    function: 'Advanced Technical Diagnostics (DET)',
    confidenceScore: 99,
    humanOverridePath: '/override/det',
    metrics: {
      successRate: 98.5,
      avgLatency: 300,
      tokensUsed: 150000,
      cost: 1500,
      reliabilityScore: 98,
      uptime: 100,
      lastActive: 'Just now'
    }
  },
  { 
    id: 'advisor-expert', 
    name: 'Service Advisor Agent', 
    status: 'active', 
    description: 'Handles routine queries, mechanical issues, and customer-facing technical support.',
    ring: ['Dealer'],
    function: 'Routine Technical Support & Advisory',
    confidenceScore: 94,
    humanOverridePath: '/override/advisor',
    metrics: {
      successRate: 95.2,
      avgLatency: 250,
      tokensUsed: 200000,
      cost: 2000,
      reliabilityScore: 93,
      uptime: 99.9,
      lastActive: 'Just now'
    }
  },
  { 
    id: 'revenue', 
    name: 'Revenue Agent', 
    status: 'active', 
    description: 'Upsell propensity, AMC conversion, leakage detection.',
    ring: ['Dealer'],
    function: 'Profitability & Growth Intelligence',
    confidenceScore: 90,
    humanOverridePath: '/override/revenue',
    metrics: {
      successRate: 92.1,
      avgLatency: 600,
      tokensUsed: 112000,
      cost: 1150,
      reliabilityScore: 89,
      uptime: 99.2,
      lastActive: '10 mins ago'
    }
  },
  { 
    id: 'quality', 
    name: 'Quality Agent', 
    status: 'active', 
    description: 'Revisit detection, TSB applicability, RCA clustering.',
    ring: ['Dealer', 'OEM'],
    function: 'Service Quality & Compliance',
    confidenceScore: 95,
    humanOverridePath: '/override/quality',
    metrics: {
      successRate: 96.4,
      avgLatency: 450,
      tokensUsed: 98000,
      cost: 1000,
      reliabilityScore: 94,
      uptime: 99.8,
      lastActive: '1 min ago'
    }
  },
  { 
    id: 'escalation', 
    name: 'Escalation Agent', 
    status: 'idle', 
    description: 'Customer complaint → resolution routing, SLA tracking.',
    ring: ['Customer', 'Dealer', 'OEM'],
    function: 'Crisis Management & SLA Governance',
    confidenceScore: 97,
    humanOverridePath: '/override/escalation',
    metrics: {
      successRate: 99.5,
      avgLatency: 200,
      tokensUsed: 34000,
      cost: 350,
      reliabilityScore: 99,
      uptime: 100,
      lastActive: '4 hours ago'
    }
  },
  { 
    id: 'concierge', 
    name: 'Concierge Agent', 
    status: 'active', 
    description: 'Conversational AI for customer-facing enquiries, booking, and status.',
    ring: ['Customer'],
    function: 'Hyper-Personalised Customer Engagement',
    confidenceScore: 93,
    humanOverridePath: '/override/concierge',
    metrics: {
      successRate: 94.8,
      avgLatency: 150,
      tokensUsed: 450000,
      cost: 4500,
      reliabilityScore: 92,
      uptime: 99.9,
      lastActive: 'Just now'
    }
  },
  { 
    id: 'program', 
    name: 'Program Intelligence Agent', 
    status: 'active', 
    description: 'EVP001 ↔ field data feedback loop. CapEx ROI validation.',
    ring: ['OEM'],
    function: 'Cross-Program Product Intelligence',
    confidenceScore: 95,
    humanOverridePath: '/override/program',
    metrics: {
      successRate: 96.2,
      avgLatency: 800,
      tokensUsed: 120000,
      cost: 1200,
      reliabilityScore: 95,
      uptime: 99.8,
      lastActive: '10 mins ago'
    }
  },
  { 
    id: 'network', 
    name: 'Network Agent', 
    status: 'active', 
    description: 'White-space analysis, dealer expansion, hub-and-spoke optimization.',
    ring: ['OEM'],
    function: 'Network Strategy & Expansion Intelligence',
    confidenceScore: 91,
    humanOverridePath: '/override/network',
    metrics: {
      successRate: 92.5,
      avgLatency: 1200,
      tokensUsed: 85000,
      cost: 850,
      reliabilityScore: 91,
      uptime: 99.5,
      lastActive: '1 hour ago'
    }
  },
  {
    id: 'bay-allocation',
    name: 'Bay Allocation Agent',
    status: 'active',
    description: 'Automated vehicle-to-bay assignment, technician load balancing, and throughput optimization.',
    ring: ['Dealer'],
    function: 'Workshop Throughput & Resource Optimization',
    confidenceScore: 97,
    humanOverridePath: '/override/bay-allocation',
    metrics: {
      successRate: 98.2,
      avgLatency: 180,
      tokensUsed: 145000,
      cost: 1400,
      reliabilityScore: 97,
      uptime: 99.9,
      lastActive: 'Just now'
    },
    behaviorLogs: [
      { timestamp: '11:58:12', event: 'Allocation: Nexon EV -> Bay 4 (Express)', status: 'success', explanation: 'Matched high-priority EV service with certified Express technician.' },
      { timestamp: '11:55:05', event: 'Optimization: Re-routed Harrier to Bay 2', status: 'success', explanation: 'Bay 1 delay detected; re-routing to maintain TAT targets.' }
    ]
  }
];

export const MOCK_FLEET_HEALTH: FleetHealth[] = [
  { zone: 'North', health: 94, status: 'success', failureClustering: [{ mode: 'HV Battery Seal', count: 12, trend: 'up' }] },
  { zone: 'North Central', health: 92, status: 'success', failureClustering: [{ mode: 'Brake Squeal', count: 18, trend: 'up' }] },
  { zone: 'West', health: 88, status: 'warning', failureClustering: [{ mode: 'Infotainment Lag', count: 45, trend: 'up' }] },
  { zone: 'South', health: 96, status: 'success', failureClustering: [{ mode: 'Suspension Noise', count: 8, trend: 'down' }] },
  { zone: 'East', health: 91, status: 'success', failureClustering: [{ mode: 'Brake Squeal', count: 15, trend: 'up' }] },
  { zone: 'Central', health: 93, status: 'success', failureClustering: [{ mode: 'AC Performance', count: 10, trend: 'up' }] },
];

export const MOCK_DMC_FEEDBACK: DMCFeedback[] = [
  { component: 'HV Battery Pack', target: '₹1,900', actual: '₹2,150', variance: '+₹250', status: 'at-risk' },
  { component: 'Electric Motor', target: '₹850', actual: '₹720', variance: '-₹130', status: 'on-track' },
  { component: 'Inverter/Converter', target: '₹420', actual: '₹415', variance: '-₹5', status: 'on-track' },
  { component: 'Body & Trims', target: '₹1,200', actual: '₹1,180', variance: '-₹20', status: 'on-track' },
];

export const MOCK_THD_REQUESTS: THDRequest[] = [
  {
    id: 'THD-001',
    dealer: 'Mumbai West',
    vehicleModel: 'Nexon EV Max',
    vin: 'MAT12345678901234',
    issue: 'HV Battery Isolation Fault - Step 4 calibration failing',
    status: 'Open',
    priority: 'Critical',
    timestamp: '2024-03-22T10:45:00Z',
    category: 'HV Battery',
    assignedAgent: 'Nexus Engineering'
  },
  {
    id: 'THD-002',
    dealer: 'Pune Central',
    vehicleModel: 'Tiago EV',
    vin: 'MAT98765432109876',
    issue: 'BMS Software Update Failure - Error Code 0x45',
    status: 'In Progress',
    priority: 'High',
    timestamp: '2024-03-22T09:30:00Z',
    category: 'Software'
  },
  {
    id: 'THD-003',
    dealer: 'Delhi North',
    vehicleModel: 'Harrier',
    vin: 'MAT55555555555555',
    issue: 'Infotainment Blackout - Hard reset not working',
    status: 'Resolved',
    priority: 'Medium',
    timestamp: '2024-03-22T08:15:00Z',
    category: 'Infotainment'
  }
];

export const MOCK_DEALER_PL: DealerPL[] = [
  { dealer: 'Pune Central', revenue: '₹4.2Cr', partsAttachment: '22%', warrantyRecovery: '98%', efficiency: '92%', status: 'Green' },
  { dealer: 'Mumbai West', revenue: '₹3.8Cr', partsAttachment: '18%', warrantyRecovery: '94%', efficiency: '78%', status: 'Amber' },
  { dealer: 'Delhi North', revenue: '₹2.1Cr', partsAttachment: '15%', warrantyRecovery: '82%', efficiency: '45%', status: 'Red' },
];

export const MOCK_PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'View Dashboard', description: 'Access to the main dashboard and KPIs' },
  { id: 'p2', name: 'Manage Jobs', description: 'Create, update and close service job cards' },
  { id: 'p3', name: 'Inventory Control', description: 'Manage spare parts and stock orders' },
  { id: 'p4', name: 'Financial Reports', description: 'Access to revenue and profit leakage data' },
  { id: 'p5', name: 'User Management', description: 'Manage system users and role assignments' },
  { id: 'p6', name: 'Agent Observability', description: 'Monitor AI agent performance and logs' },
  { id: 'p7', name: 'Customer Data', description: 'Access to customer profiles and history' },
  { id: 'p8', name: 'Workshop Ops', description: 'Manage bay utilization and technician tasks' }
];

export const MOCK_ROLE_PERMISSIONS: RolePermission[] = [
  { role: 'Admin', permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] },
  { role: 'Agentic OS', permissions: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] },
  { role: 'Dealer Principal', permissions: ['p1', 'p4', 'p6', 'p7'] },
  { role: 'Service Advisor', permissions: ['p1', 'p2', 'p7'] },
  { role: 'Service GM', permissions: ['p1', 'p2', 'p4', 'p7', 'p8'] },
  { role: 'DET', permissions: ['p1', 'p2', 'p4', 'p5', 'p8'] },
  { role: 'Technician', permissions: ['p1', 'p2', 'p8'] },
  { role: 'Spare Parts Mgr', permissions: ['p1', 'p3'] },
  { role: 'Customer', permissions: ['p1', 'p7'] },
  { role: 'Receptionist', permissions: ['p1', 'p7'] },
  { role: 'Bay Supervisor', permissions: ['p1', 'p8'] }
];

export const WORKSHOPS = [
  { id: 'W1', name: 'Pune Central', location: 'Pune' },
  { id: 'W2', name: 'Mumbai West', location: 'Mumbai' },
  { id: 'W3', name: 'Delhi North', location: 'Delhi' }
];

export const MOCK_VEHICLES: Vehicle[] = [
  {
    vin: 'MAT12568186',
    plate: 'MH-12-AB-1234',
    model: 'Nexon EV',
    customer: 'Mandar Joshi',
    healthScore: 82,
    soh: 78,
    status: 'Arriving',
    alerts: ['Battery Cell Imbalance Detected', 'Brake Pad Wear (Front Left)'],
    workshopId: 'W1',
    telematics: {
      lastSync: '2026-03-21T10:00:00Z',
      odometer: 12450,
      location: 'Pune, Maharashtra',
      batteryTemp: 34
    }
  },
  {
    vin: 'MAT12568187',
    plate: 'MH-12-CD-5678',
    model: 'Harrier',
    customer: 'Amit Patel',
    healthScore: 92,
    soh: 95,
    status: 'Ready',
    alerts: [],
    workshopId: 'W1',
    telematics: {
      lastSync: '2026-03-21T11:30:00Z',
      odometer: 5600,
      location: 'Pune, Maharashtra',
      batteryTemp: 30
    }
  },
  {
    vin: 'MAT12568188',
    plate: 'MH-12-EF-9012',
    model: 'Punch EV',
    customer: 'Rahul Sharma',
    healthScore: 45,
    soh: 88,
    status: 'In Service',
    alerts: ['Turbocharger Efficiency Low', 'Repeat Repair Alert: Suspension'],
    workshopId: 'W2',
    telematics: {
      lastSync: '2026-03-21T09:30:00Z',
      odometer: 45600,
      location: 'Mumbai, Maharashtra',
      batteryTemp: 42
    }
  },
  {
    vin: 'MAT12568189',
    plate: 'MH-12-GH-3456',
    model: 'Safari',
    customer: 'Anjali Singh',
    healthScore: 95,
    soh: 92,
    status: 'Ready',
    alerts: [],
    workshopId: 'W3',
    telematics: {
      lastSync: '2026-03-21T11:00:00Z',
      odometer: 8900,
      location: 'New Delhi, Delhi',
      batteryTemp: 31
    }
  }
];

export const ROLE_KPIS: Record<Role, { label: string; value: string }[]> = {
  'Customer': [
    { label: 'Uptime', value: '99.2%' },
    { label: 'TCOC', value: '₹4.2/km' },
    { label: 'Health', value: '96%' },
    { label: 'Savings', value: '₹12k' }
  ],
  'Receptionist': [
    { label: 'Booked Appointments', value: '12' },
    { label: 'Walk-ins', value: '4' },
    { label: 'Pending Check-ins', value: '3' },
    { label: 'Avg Wait Time', value: '8m' }
  ],
  'Service Advisor': [
    { label: 'Open Job Cards', value: '8' },
    { label: 'Daily Revenue', value: '₹42k' },
    { label: 'CSAT Score', value: '4.8/5' },
    { label: 'Upsell Rate', value: '22%' }
  ],
  'Service GM': [
    { label: 'Network Efficiency', value: '88%' },
    { label: 'Open Complaints', value: '14' },
    { label: 'Avg Resolution Time', value: '3.2d' },
    { label: 'Customer Retention', value: '91%' }
  ],
  'DET': [
    { label: 'Diagnostic Accuracy', value: '98%' },
    { label: 'Training Hours', value: '12h/wk' },
    { label: 'Repeat Repair Rate', value: '1.2%' },
    { label: 'LMS Completion', value: '94%' }
  ],
  'Technician': [
    { label: 'Bay Efficiency', value: '94%' },
    { label: 'Active Jobs', value: '2' },
    { label: 'Pending Tasks', value: '1' },
    { label: 'Revisit Rate', value: '0%' }
  ],
  'Spare Parts Mgr': [
    { label: 'Fill Rate', value: '94.2%' },
    { label: 'Stock Items', value: '1,240' },
    { label: 'Pending Orders', value: '12' },
    { label: 'Inventory Value', value: '₹18L' }
  ],
  'Dealer Principal': [
    { label: 'Total Revenue', value: '₹1.2Cr' },
    { label: 'MoM Growth', value: '+12%' },
    { label: 'Dealer CSAT', value: '4.6' },
    { label: 'Service Absorption', value: '82%' }
  ],
  'Security Guard': [
    { label: 'Gate In Today', value: '24' },
    { label: 'Gate Out Today', value: '18' },
    { label: 'Avg Scan Time', value: '12s' },
    { label: 'Walk-ins Logged', value: '6' }
  ],
  'Bay Supervisor': [
    { label: 'Overall Bay Efficiency', value: '92%' },
    { label: 'Express Bay TAT', value: '45m' },
    { label: 'Speedo Bay TAT', value: '25m' },
    { label: 'Bay Utilization', value: '88%' }
  ],
  'Zone CCM': [
    { label: 'Zone Performance', value: '92%' },
    { label: 'Regional Compliance', value: '96%' },
    { label: 'Network Health', value: '89%' },
    { label: 'Escalated Cases', value: '4' }
  ],
  'Regional CCM': [
    { label: 'Region Efficiency', value: '94%' },
    { label: 'Dealer CSAT', value: '4.7/5' },
    { label: 'Avg TAT', value: '2.8d' },
    { label: 'CCM Performance', value: '91%' }
  ],
  'CCM': [
    { label: 'Dealer Coverage', value: '8/8' },
    { label: 'Complaint Resolution', value: '98%' },
    { label: 'Service Quality', value: '95%' },
    { label: 'On-site Visits', value: '12/mo' }
  ],
  'Head of Customer Care': [
    { label: 'Total P&L', value: '₹142Cr' },
    { label: 'End-to-End Efficiency', value: '94%' },
    { label: 'National NPS', value: '72' },
    { label: 'Strategic Growth', value: '+12%' }
  ],
  'Service Technical Support & Training Head': [
    { label: 'Technical Readiness', value: '96%' },
    { label: 'Training Completion', value: '92%' },
    { label: 'Support Resolution', value: '98%' },
    { label: 'Skill Index', value: '4.8/5' }
  ],
  'Training Head': [
    { label: 'LMS Engagement', value: '88%' },
    { label: 'Certification Rate', value: '94%' },
    { label: 'Skill Matrix Coverage', value: '96%' },
    { label: 'Training ROI', value: '₹2.4Cr' }
  ],
  'Command Centre Head': [
    { label: 'Real-time Monitoring', value: '100%' },
    { label: 'Response Time', value: '<2m' },
    { label: 'Agent Uptime', value: '99.9%' },
    { label: 'Incident Resolution', value: '96%' }
  ],
  'Spares Head': [
    { label: 'Spare Revenue', value: '₹42Cr' },
    { label: 'Inventory Turnover', value: '4.2x' },
    { label: 'Order Fulfillment', value: '98%' },
    { label: 'Supply Chain Health', value: '95%' }
  ],
  'Order Processing Manager': [
    { label: 'Order Lead Time', value: '1.2d' },
    { label: 'Processing Accuracy', value: '99.8%' },
    { label: 'Backlog Status', value: 'Low' },
    { label: 'Warehouse Efficiency', value: '94%' }
  ],
  'Head Quarters': [
    { label: 'Complaints Perf', value: '96%' },
    { label: 'RSA Response', value: '18m' },
    { label: 'Network Expansion', value: '+4' },
    { label: 'Social Sentiment', value: 'Positive' }
  ],
  'Command Centre': [
    { label: 'Avg Resolution Time', value: '4.2h' },
    { label: 'First Contact Res.', value: '78%' },
    { label: 'Escalation Rate', value: '12%' },
    { label: 'SLA Compliance', value: '96%' }
  ],
  'Agentic OS': [
    { label: 'Orchestration Rate', value: '99.8%' },
    { label: 'Auto-Execution', value: '85%' },
    { label: 'Stakeholder CSAT', value: '4.9' },
    { label: 'OEM Cost Saving', value: '₹4.2Cr' }
  ],
  'Admin': [
    { label: 'Total Users', value: '42' },
    { label: 'Active Now', value: '38' },
    { label: 'System Load', value: '12%' },
    { label: 'Security Status', value: 'Stable' }
  ]
};

export const MOCK_ACTION_SERVICES: ActionService[] = [
  { id: 'booking', name: 'Booking Service', status: 'Online', lastAction: 'Slot allocated for VIN ...90', latency: 120 },
  { id: 'parts', name: 'Parts Service', status: 'Online', lastAction: 'Auto-reserved Brake Pads', latency: 240 },
  { id: 'notify', name: 'Notification Service', status: 'Online', lastAction: 'WhatsApp sent to Mandar', latency: 85 },
  { id: 'tsb', name: 'TSB Engine', status: 'Online', lastAction: 'Bulletin #42 generated', latency: 450 },
  { id: 'workflow', name: 'Workflow Executor', status: 'Online', lastAction: 'Triggered Dealer Assignment', latency: 110 }
];

export const MOCK_SYSTEM_NODES: SystemNode[] = [
  { id: 'fe', label: 'Persona Apps', type: 'Frontend', status: 'Online' },
  { id: 'gw', label: 'API Gateway', type: 'Gateway', status: 'Online' },
  { id: 'orch', label: 'Nexus Orchestrator', type: 'Orchestrator', status: 'Online' },
  { id: 'cust_agt', label: 'Customer Agent', type: 'Agent', status: 'Online' },
  { id: 'dlr_agt', label: 'Dealer Agent', type: 'Agent', status: 'Online' },
  { id: 'oem_agt', label: 'OEM Agent', type: 'Agent', status: 'Online' },
  { id: 'act_svc', label: 'Action Layer', type: 'Action', status: 'Online' },
  { id: 'kafka', label: 'Event Pipeline (Kafka)', type: 'Data', status: 'Online' },
  { id: 'db', label: 'Operational DB (Postgres)', type: 'Data', status: 'Online' },
  { id: 'dms', label: 'Dealer DMS', type: 'External', status: 'Online' },
  { id: 'tele', label: 'Telematics Platform', type: 'External', status: 'Online' }
];

export const MOCK_EVENTS: OrchestratorEvent[] = [
  { id: 'ev1', source: 'Telematics', type: 'SoH_Drop', payload: { vin: 'TATA7890123456', soh: 78 }, timestamp: '11:40 AM', status: 'Completed' },
  { id: 'ev2', source: 'DMS', type: 'Job_Created', payload: { vin: 'TATA1234567890', dealer: 'Pune Central' }, timestamp: '11:42 AM', status: 'Processing' },
  { id: 'ev3', source: 'CRM', type: 'Complaint_Raised', payload: { customer: 'Rahul Sharma', issue: 'Suspension' }, timestamp: '11:45 AM', status: 'Ingested' }
];

export const MOCK_DET_ISSUES: DETIssue[] = [
  {
    id: '1',
    regNo: 'MH-12-AB-1234',
    status: 'DET WIP',
    description: 'Battery draining fast',
    chassis: 'MAT12568186',
    model: 'Nexon EV',
    tech: 'Santosh Pawar',
    jc: 'JC-RudAMt-AA3-2526-001120',
    ageing: '3d'
  },
  {
    id: '2',
    regNo: 'MH-12-CD-5678',
    status: 'THD Raised',
    description: 'AC not cooling properly',
    chassis: 'MAT12568187',
    model: 'Harrier',
    tech: 'Ganesh Bhosale',
    jc: 'JC-RudAMt-AA3-2526-001121',
    ageing: '5d',
    isRepeat: true,
    thdNo: 'THD-2026-0045'
  },
  {
    id: '3',
    regNo: 'MH-12-EF-9012',
    status: 'DET WIP',
    description: 'Suspension noise on rough road',
    chassis: 'MAT12568188',
    model: 'Punch EV',
    tech: 'Rahul Jadhav',
    jc: 'JC-RudAMt-AA3-2526-001122',
    ageing: '2d'
  }
];
