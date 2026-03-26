
export type Role = 
  | 'Customer'
  | 'Receptionist' 
  | 'Service Advisor' 
  | 'Service GM'
  | 'DET'
  | 'Technician' 
  | 'Spare Parts Mgr' 
  | 'Dealer Principal' 
  | 'Security Guard'
  | 'Bay Supervisor'
  | 'Zone CCM'
  | 'Regional CCM' 
  | 'CCM'
  | 'Head of Customer Care'
  | 'Service Technical Support & Training Head'
  | 'Training Head'
  | 'Command Centre Head'
  | 'Spares Head'
  | 'Order Processing Manager'
  | 'Head Quarters'
  | 'Command Centre'
  | 'Agentic OS'
  | 'Admin';

export interface Complaint {
  id: string;
  customerName: string;
  vehicleModel: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  timestamp: string;
  dealership: string;
  workshopId: string;
  area: string;
  zone: string;
  region: string;
}

export interface KPI {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'neutral';
  description: string;
}

export type StakeholderRing = 'Customer' | 'Dealer' | 'OEM';

export interface AgentMetrics {
  successRate: number; // 0-100
  avgLatency: number; // ms
  tokensUsed: number;
  cost: number; // in INR
  reliabilityScore: number; // 0-100
  uptime: number; // percentage
  lastActive: string;
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing';
  description: string;
  ring: StakeholderRing[]; // An agent can serve multiple rings
  function: string;
  confidenceScore: number; // 0-100
  humanOverridePath: string;
  metrics?: AgentMetrics;
  performanceHistory?: { timestamp: string; successRate: number; latency: number }[];
  behaviorLogs?: { timestamp: string; event: string; status: 'success' | 'failure' | 'warning'; explanation?: string }[];
}

export interface Vehicle {
  vin: string;
  plate: string;
  model: string;
  customer: string;
  healthScore: number;
  soh: number; // State of Health (Battery/Engine)
  status: 'Arriving' | 'In Service' | 'Ready' | 'Delivered';
  alerts: string[];
  workshopId: string;
  telematics?: {
    lastSync: string;
    odometer: number;
    location: string;
    batteryTemp: number;
  };
}

export interface NexusAlertAction {
  label: string;
  type: 'primary' | 'secondary';
}

export interface NexusAlert {
  id: string;
  role: Role | 'All';
  type: 'critical' | 'warning' | 'info';
  severityScore: number; // 0-100
  message: string;
  timestamp: string;
  agentId?: string;
  workshopId?: string;
  actions?: NexusAlertAction[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermission {
  role: Role;
  permissions: string[]; // Array of permission IDs
}

export interface FleetHealth {
  zone: string;
  health: number;
  status: 'success' | 'warning' | 'critical';
  failureClustering?: { mode: string; count: number; trend: 'up' | 'down' }[];
}

export interface DMCFeedback {
  component: string;
  target: string;
  actual: string;
  variance: string;
  status: 'on-track' | 'at-risk';
}

export interface DealerPL {
  dealer: string;
  revenue: string;
  partsAttachment: string;
  warrantyRecovery: string;
  efficiency: string;
  status: 'Green' | 'Amber' | 'Red';
  location?: string;
}

export interface THDRequest {
  id: string;
  dealer: string;
  vehicleModel: string;
  vin: string;
  issue: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  priority: 'Critical' | 'High' | 'Medium';
  timestamp: string;
  assignedAgent?: string;
  category: 'HV Battery' | 'Software' | 'Mechanical' | 'Infotainment';
}

export interface NexusState {
  activeRole: Role;
  kpis: {
    serviceRevenue: string;
    efficiency: string;
    quality: string;
    reliability: string;
    capability: string;
  };
  activeAgents: string[];
}

export interface OrchestratorEvent {
  id: string;
  source: 'Telematics' | 'DMS' | 'CRM' | 'Warranty' | 'IoT';
  type: string;
  payload: any;
  timestamp: string;
  status: 'Ingested' | 'Processing' | 'Completed' | 'Failed';
}

export interface ActionService {
  id: string;
  name: string;
  status: 'Online' | 'Offline' | 'Degraded';
  lastAction?: string;
  latency: number;
}

export interface SystemNode {
  id: string;
  label: string;
  type: 'Frontend' | 'Gateway' | 'Orchestrator' | 'Agent' | 'Action' | 'Data' | 'External';
  status: 'Online' | 'Offline' | 'Warning';
}

export interface ServiceAppointment {
  id: string;
  date: string;
  chassisNo: string;
  customer: string;
  regNo: string;
  ppl: string;
  warranty: string;
  serviceType: string;
  status: string;
  jcNumber?: string;
  sa: string;
  technician: string;
  bay: string;
  timeline: {
    gateIn: string;
    jobOpen: string;
    bayAllocated: string;
    workStart: string;
    eqc: string;
    washing: string;
    invoice: string;
    gateOut: string;
  };
}

export interface DETIssue {
  id: string;
  regNo: string;
  status: 'DET WIP' | 'THD Raised' | 'Supplier Ticket' | 'Awaiting Feedback';
  description: string;
  chassis: string;
  model: string;
  tech: string;
  jc: string;
  ageing: string;
  isRepeat?: boolean;
  thdNo?: string;
}

export interface WorkshopBayStatus {
  id: string;
  bay: string;
  technician: string;
  vehicle: string;
  regNo: string;
  status: 'On Time' | 'Minor Delay' | 'Overdue';
  delay?: string;
  efficiency: number; // percentage
  bayType: 'Mechanical' | 'Express' | 'Speedo' | 'Bodyshop';
  startTime?: string;
  estimatedEndTime?: string;
  utilization: number; // percentage
}

export interface PartVOR {
  id: string;
  partNo: string;
  partName: string;
  qty: number;
  regNo: string;
  ppl: string;
  jcNo: string;
  ageing: string;
  status: 'Order Placed' | 'Pending' | 'Backorder';
  eta?: string;
  arrangedFrom?: string;
}

export interface StaffPerformance {
  id: string;
  name: string;
  rv?: string;
  rc?: string;
  psf?: string;
  avgTat?: string;
  activeJobs?: number;
  avgTime?: string;
}
