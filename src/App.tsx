/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  UserCircle, 
  Wrench, 
  Package, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  GraduationCap, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  AlertCircle,
  Info,
  Zap,
  MessageSquare,
  FileText,
  Monitor,
  Users,
  Filter,
  ArrowUpRight,
  Globe,
  MapPin,
  BarChart3,
  Smile,
  Cpu,
  Layers,
  Terminal,
  Scan,
  LogIn,
  LogOut,
  Move,
  Plus,
  CheckCircle,
  RotateCcw,
  Mic,
  MicOff,
  Edit3,
  Save,
  ClipboardList,
  History,
  Play,
  Pause,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Role, Vehicle, Agent, NexusAlert, AgentMetrics, Permission, RolePermission, Complaint, StakeholderRing, FleetHealth, DMCFeedback, DealerPL, THDRequest, OrchestratorEvent, ActionService, SystemNode, DETIssue, ServiceAppointment } from './types';
import { ROLES, AGENTS, MOCK_VEHICLES, MOCK_ALERTS, MOCK_PERMISSIONS, MOCK_ROLE_PERMISSIONS, ROLE_KPIS, MOCK_COMPLAINTS, MOCK_FLEET_HEALTH, MOCK_DMC_FEEDBACK, MOCK_DEALER_PL, MOCK_THD_REQUESTS, MOCK_ACTION_SERVICES, MOCK_SYSTEM_NODES, MOCK_EVENTS, WORKSHOPS, PERSONA_NAMES, MOCK_SERVICE_APPOINTMENTS, MOCK_WORKSHOP_BAY_STATUS, MOCK_PARTS_VOR, MOCK_TECH_LEADERBOARD, MOCK_SA_LEADERBOARD, MOCK_DET_ISSUES } from './constants';
import { GeminiInsight } from './components/GeminiInsight';

const WORKSHOP_SPECIFIC_ROLES: Role[] = [
  'Technician',
  'Service Advisor',
  'Receptionist',
  'Spare Parts Mgr',
  'Security Guard',
  'Bay Supervisor',
  'DET'
];

const ZONE_REGION_MAPPING = {
  'Central': ['Central 1', 'Central 2', 'Central 3'],
  'East': ['East 1', 'East 2', 'East 3'],
  'West': ['West 1', 'West 2', 'West 3'],
  'North': ['North 1', 'North 2', 'North 3'],
  'North Central': ['North Central'],
  'South': ['South 1', 'South 2', 'South 3']
};

const STATE_BIFURCATION = [
  { state: 'Andhra Pradesh', zone: 'Central', region: 'Central 1' },
  { state: 'Arunachal Pradesh', zone: 'East', region: 'East 3' },
  { state: 'Assam', zone: 'East', region: 'East 3' },
  { state: 'Bihar', zone: 'East', region: 'East 2' },
  { state: 'Chhattisgarh', zone: 'Central', region: 'Central 2' },
  { state: 'Goa', zone: 'West', region: 'West 1' },
  { state: 'Gujarat', zone: 'West', region: 'West 3' },
  { state: 'Haryana', zone: 'North Central', region: 'North Central' },
  { state: 'Himachal Pradesh', zone: 'North', region: 'North 2' },
  { state: 'Jharkhand', zone: 'East', region: 'East 2' },
  { state: 'Karnataka', zone: 'South', region: 'South 1' },
  { state: 'Kerala', zone: 'South', region: 'South 3' },
  { state: 'Madhya Pradesh', zone: 'Central', region: 'Central 3' },
  { state: 'Maharashtra (Without Mumbai)', zone: 'West', region: 'West 2' },
  { state: 'Mumbai', zone: 'West', region: 'West 1' },
  { state: 'Manipur', zone: 'East', region: 'East 3' },
  { state: 'Meghalaya', zone: 'East', region: 'East 3' },
  { state: 'Mizoram', zone: 'East', region: 'East 3' },
  { state: 'Nagaland', zone: 'East', region: 'East 3' },
  { state: 'Odisha', zone: 'Central', region: 'Central 2' },
  { state: 'Punjab', zone: 'North', region: 'North 2' },
  { state: 'Rajasthan', zone: 'North', region: 'North 3' },
  { state: 'Sikkim', zone: 'East', region: 'East 3' },
  { state: 'Tamil Nadu', zone: 'South', region: 'South 2' },
  { state: 'Telangana', zone: 'Central', region: 'Central 1' },
  { state: 'Tripura', zone: 'East', region: 'East 3' },
  { state: 'Uttar Pradesh', zone: 'North Central', region: 'North Central' },
  { state: 'Uttarakhand', zone: 'North Central', region: 'North Central' },
  { state: 'West Bengal', zone: 'East', region: 'East 1' },
  { state: 'Jammu and Kashmir', zone: 'North', region: 'North 1' },
  { state: 'Chandigarh', zone: 'North', region: 'North 1' },
  { state: 'Andaman and Nicobar', zone: 'East', region: 'East 1' },
  { state: 'Ladakh', zone: 'North', region: 'North 1' },
];

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>('Service Advisor');
  const [activeRing, setActiveRing] = useState<StakeholderRing>('Dealer');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'persona' | 'observability'>('persona');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('W1');

  const [selectedJC, setSelectedJC] = useState<string | null>(null);

  const isWorkshopSpecific = useMemo(() => WORKSHOP_SPECIFIC_ROLES.includes(activeRole), [activeRole]);

  const currentWorkshop = useMemo(() => {
    return WORKSHOPS.find(w => w.id === selectedWorkshopId) || WORKSHOPS[0];
  }, [selectedWorkshopId]);

  const roleAlerts = useMemo(() => {
    return MOCK_ALERTS.filter(alert => {
      const isRoleMatch = alert.role === activeRole || alert.role === 'All';
      if (!isRoleMatch) return false;
      
      // If role is workshop-specific, filter by workshopId
      if (isWorkshopSpecific && alert.workshopId) {
        return alert.workshopId === selectedWorkshopId;
      }
      
      return true;
    });
  }, [activeRole, isWorkshopSpecific, selectedWorkshopId]);

  const roleKPIs = useMemo(() => {
    return ROLE_KPIS[activeRole] || [];
  }, [activeRole]);

  const activeAgents = useMemo(() => AGENTS.filter(a => a.status !== 'idle').map(a => a.name), []);

  const renderPersonaContent = () => {
    switch (activeRole) {
      case 'Customer':
        return <CustomerView onOpenJC={setSelectedJC} />;
      case 'Receptionist':
        return <ReceptionistView workshopId={selectedWorkshopId} />;
      case 'Service Advisor':
        return <ServiceAdvisorView workshopId={selectedWorkshopId} onOpenJC={setSelectedJC} />;
      case 'Service GM':
        return <ServiceGMView workshopId={selectedWorkshopId} onOpenJC={setSelectedJC} />;
      case 'DET':
        return <DETView workshopId={selectedWorkshopId} onOpenJC={setSelectedJC} selectedJC={selectedJC} />;
      case 'Technician':
        return <TechnicianView workshopId={selectedWorkshopId} onOpenJC={setSelectedJC} />;
      case 'Spare Parts Mgr':
        return <SparePartsView workshopId={selectedWorkshopId} />;
      case 'Dealer Principal':
        return <DealerPrincipalView workshopId={selectedWorkshopId} />;
      case 'Security Guard':
        return <SecurityGuardView workshopId={selectedWorkshopId} />;
      case 'Bay Supervisor':
        return <BaySupervisorView workshopId={selectedWorkshopId} />;
      case 'Zone CCM':
        return <ZoneCCMView />;
      case 'Regional CCM':
        return <RegionalCCMView />;
      case 'CCM':
        return <CCMView />;
      case 'Head of Customer Care':
        return <HeadOfCustomerCareView />;
      case 'Service Technical Support & Training Head':
        return <ServiceTechnicalSupportView />;
      case 'Training Head':
        return <TrainingHeadView />;
      case 'Command Centre Head':
        return <CommandCentreHeadView />;
      case 'Spares Head':
        return <SparesHeadView />;
      case 'Order Processing Manager':
        return <OrderProcessingView />;
      case 'Head Quarters':
        return <HeadQuartersView />;
      case 'Command Centre':
        return <CommandCentreView />;
      case 'Agentic OS':
        return <AgenticOrchestratorView />;
      case 'Admin':
        return <RoleManagementView />;
      default:
        return <ServiceAdvisorView workshopId={selectedWorkshopId} onOpenJC={setSelectedJC} />;
    }
  };

  return (
    <div className="flex h-screen bg-bg text-accent font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border bg-surface flex flex-col z-50 overflow-hidden"
          >
            <div className="p-10 pb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white text-lg">N</div>
              <h1 className="font-bold text-xs tracking-widest uppercase">Nexus</h1>
            </div>

            <nav className="flex-1 overflow-y-auto p-8 space-y-10">
              <div className="space-y-4">
                <div className="text-[10px] text-black/20 uppercase font-bold tracking-[0.2em] px-3">Stakeholder Ring</div>
                <div className="flex p-1 bg-black/[0.03] rounded-xl border border-border">
                  {(['Customer', 'Dealer', 'OEM'] as StakeholderRing[]).map((ring) => (
                    <button
                      key={ring}
                      onClick={() => setActiveRing(ring)}
                      className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                        activeRing === ring ? 'bg-white text-accent shadow-sm' : 'text-black/20 hover:text-black/40'
                      }`}
                    >
                      {ring}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-black/20 uppercase font-bold tracking-[0.2em] px-3 mb-4">Persona</div>
                {activeRing === 'OEM' ? (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <div className="text-[9px] text-black/20 uppercase font-bold tracking-[0.2em] px-3 mb-2">Central Level</div>
                      {[
                        'Head of Customer Care',
                        'Service Technical Support & Training Head',
                        'Training Head',
                        'Command Centre Head',
                        'Spares Head',
                        'Order Processing Manager',
                        'Head Quarters'
                      ].map((role) => (
                        <button
                          key={role}
                          onClick={() => { setActiveRole(role as Role); setViewMode('persona'); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[12px] font-medium ${
                            activeRole === role && viewMode === 'persona'
                              ? 'bg-accent text-white shadow-sm' 
                              : 'text-black/40 hover:bg-black/5 hover:text-accent'
                          }`}
                        >
                          <UserCircle size={14} strokeWidth={2} />
                          {role}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-black/20 uppercase font-bold tracking-[0.2em] px-3 mb-2">Field Level</div>
                      {[
                        'Zone CCM',
                        'Regional CCM',
                        'CCM'
                      ].map((role) => (
                        <button
                          key={role}
                          onClick={() => { setActiveRole(role as Role); setViewMode('persona'); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[12px] font-medium ${
                            activeRole === role && viewMode === 'persona'
                              ? 'bg-accent text-white shadow-sm' 
                              : 'text-black/40 hover:bg-black/5 hover:text-accent'
                          }`}
                        >
                          <UserCircle size={14} strokeWidth={2} />
                          {role}
                        </button>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[9px] text-black/20 uppercase font-bold tracking-[0.2em] px-3 mb-2">System</div>
                      {[
                        'Command Centre',
                        'Agentic OS',
                        'Admin'
                      ].map((role) => (
                        <button
                          key={role}
                          onClick={() => { setActiveRole(role as Role); setViewMode('persona'); }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-[12px] font-medium ${
                            activeRole === role && viewMode === 'persona'
                              ? 'bg-accent text-white shadow-sm' 
                              : 'text-black/40 hover:bg-black/5 hover:text-accent'
                          }`}
                        >
                          <UserCircle size={14} strokeWidth={2} />
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  ROLES.filter(role => {
                    if (activeRing === 'Customer') return role === 'Customer';
                    if (activeRing === 'Dealer') return ['Receptionist', 'Service Advisor', 'Service GM', 'DET', 'Technician', 'Spare Parts Mgr', 'Dealer Principal', 'Security Guard', 'Bay Supervisor'].includes(role);
                    return true;
                  }).map((role) => (
                    <button
                      key={role}
                      onClick={() => { setActiveRole(role); setViewMode('persona'); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${
                        activeRole === role && viewMode === 'persona'
                          ? 'bg-accent text-white shadow-sm' 
                          : 'text-black/40 hover:bg-black/5 hover:text-accent'
                      }`}
                    >
                      <UserCircle size={16} strokeWidth={2} />
                      {role}
                    </button>
                  ))
                )}
              </div>

              {activeRing === 'OEM' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-3 mb-4">
                    <div className="text-[10px] text-black/20 uppercase font-bold tracking-[0.2em]">Observability</div>
                    <button 
                      onClick={() => { setViewMode('observability'); setSelectedAgentId(null); }}
                      className={`p-1.5 rounded-lg transition-all ${viewMode === 'observability' && !selectedAgentId ? 'bg-accent text-white' : 'text-black/20 hover:text-accent'}`}
                      title="Global Dashboard"
                    >
                      <Activity size={14} />
                    </button>
                  </div>
                  {AGENTS.filter(agent => agent.ring.includes(activeRing)).map((agent) => (
                    <button 
                      key={agent.id} 
                      onClick={() => { setViewMode('observability'); setSelectedAgentId(agent.id); }}
                      className={`w-full flex items-center gap-3 text-[11px] font-medium transition-all px-4 py-2.5 rounded-xl ${
                        selectedAgentId === agent.id && viewMode === 'observability' ? 'bg-accent text-white shadow-sm' : 'text-black/40 hover:bg-black/5 hover:text-accent'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Cpu size={14} strokeWidth={2} />
                        {agent.name}
                      </div>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'active' ? 'bg-success' : 
                        agent.status === 'processing' ? 'bg-amber-400 animate-pulse' : 'bg-black/10'
                      }`} />
                    </button>
                  ))}
                </div>
              )}

              {activeRing === 'OEM' && (
                <div className="space-y-6 pt-6 border-t border-border">
                  <div className="text-[10px] text-black/20 uppercase font-bold tracking-[0.2em] px-3">MD-Ready Intelligence</div>
                  <div className="space-y-3 px-3">
                    <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 group cursor-pointer hover:bg-accent/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={12} className="text-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Strategic Signal</span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-black/60">
                        Fleet health in Zone 4 is deteriorating. AI suggests immediate <strong>Batch B4</strong> recall assessment.
                      </p>
                    </div>
                    <div className="p-4 bg-success/5 rounded-2xl border border-success/10 group cursor-pointer hover:bg-success/10 transition-all">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={12} className="text-success" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-success">Cost Optimization</span>
                      </div>
                      <p className="text-[11px] font-medium leading-relaxed text-black/60">
                        Auto-adjudication reached 82% efficiency. Projected <strong>₹4.2Cr</strong> savings this quarter.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </nav>

            <div className="p-8">
              <div className="bg-black/[0.03] rounded-2xl p-5 border border-border">
                <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-3">System Health</div>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-black/40">Operational</span>
                  <span className="text-success">94%</span>
                </div>
              </div>
            </div>
            <div className="p-8 border-t border-border">
              <div className="flex items-center gap-4 p-4 bg-black/[0.03] rounded-2xl border border-border">
                <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-[11px] tracking-tighter shadow-sm shrink-0">
                  {PERSONA_NAMES[activeRole].split(' ').map(n => n[0]).join('')}
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold tracking-tight truncate">{PERSONA_NAMES[activeRole]}</div>
                  <div className="text-[9px] font-bold text-black/30 uppercase tracking-widest truncate">{activeRole}</div>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 flex items-center justify-between px-12 z-40">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-black/20 hover:text-accent transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-6">
              <div>
                <h2 className="font-semibold text-2xl tracking-tight">
                  {viewMode === 'observability' 
                    ? (selectedAgentId ? AGENTS.find(a => a.id === selectedAgentId)?.name : 'Global Dashboard') 
                    : activeRole}
                </h2>
                <p className="text-[10px] text-black/30 uppercase tracking-widest font-bold mt-0.5">
                  {viewMode === 'observability' ? 'Agent Observability' : 'Nexus Workspace'}
                </p>
              </div>

              <div className="h-8 w-px bg-border mx-2" />

              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">Workshop Context</span>
                {isWorkshopSpecific ? (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/5 border border-accent/10 rounded-lg">
                    <MapPin size={12} className="text-accent" />
                    <span className="text-xs font-bold text-accent">{currentWorkshop.name}</span>
                  </div>
                ) : (
                  <select 
                    value={selectedWorkshopId}
                    onChange={(e) => setSelectedWorkshopId(e.target.value)}
                    className="bg-surface border border-border px-3 py-1.5 rounded-lg text-xs font-bold focus:outline-none focus:border-accent transition-all appearance-none pr-8 relative cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'currentColor\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'org/19/9\' /%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1rem' }}
                  >
                    {WORKSHOPS.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="relative hidden lg:block">
              <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-black/10" size={16} />
              <input 
                type="text" 
                placeholder="Search Nexus..." 
                className="bg-transparent border-none py-2 pl-7 pr-4 text-sm w-48 focus:w-72 focus:ring-0 transition-all placeholder:text-black/10 font-medium"
              />
            </div>
            
            <div className="flex items-center gap-6 relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`p-2 rounded-full relative transition-colors ${isNotificationsOpen ? 'text-accent' : 'text-black/20 hover:text-accent'}`}
              >
                <Bell size={22} strokeWidth={2} />
                {roleAlerts.length > 0 && (
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white" />
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute right-0 top-full mt-6 w-96 bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-border z-50 overflow-hidden"
                    >
                      <div className="p-8 pb-4 flex justify-between items-center border-b border-border">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">Notifications</span>
                        <span className="text-[10px] font-bold text-black/20">{roleAlerts.length} Active</span>
                      </div>
                      <div className="max-h-[32rem] overflow-y-auto p-4">
                        {roleAlerts.length > 0 ? (
                          roleAlerts.sort((a, b) => b.severityScore - a.severityScore).map((alert) => (
                            <div key={alert.id} className="p-5 hover:bg-surface rounded-2xl transition-colors group">
                              <div className="flex gap-5">
                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                                  alert.type === 'critical' ? 'bg-accent' : 'bg-black/10'
                                }`} />
                                <div className="flex-1">
                                  <p className="text-sm font-medium leading-relaxed mb-3 text-black/80">{alert.message}</p>
                                  
                                  {alert.actions && alert.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {alert.actions.map((action, idx) => (
                                        <button
                                          key={idx}
                                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                            action.type === 'primary'
                                              ? 'bg-accent text-white hover:bg-black/80'
                                              : 'bg-black/5 text-black/40 hover:bg-black/10'
                                          }`}
                                        >
                                          {action.label}
                                        </button>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest">{alert.timestamp}</span>
                                    <div className="flex items-center gap-2">
                                      <div className="w-12 h-1 bg-black/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent" style={{ width: `${alert.severityScore}%` }} />
                                      </div>
                                      <span className="text-[10px] font-bold text-black/20">{alert.severityScore}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-16 text-center text-black/10">
                            <p className="text-sm font-medium tracking-widest uppercase">System Clear</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold tracking-tight">{PERSONA_NAMES[activeRole]}</div>
                  <div className="text-[9px] font-bold text-black/30 uppercase tracking-widest">{activeRole}</div>
                </div>
                <div className="w-10 h-10 bg-accent text-white rounded-full flex items-center justify-center font-bold text-[11px] tracking-tighter shadow-sm">
                  {PERSONA_NAMES[activeRole].split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto px-12 pb-12">
          {/* KPI Bar - Minimalist & Role-Specific */}
          {viewMode === 'persona' && roleKPIs.length > 0 && (
            <div className="flex flex-wrap gap-16 mb-16 py-6 border-b border-border">
              {roleKPIs.map((kpi, i) => (
                <div key={i}>
                  <MinimalKPI label={kpi.label} value={kpi.value} />
                </div>
              ))}
            </div>
          )}

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode === 'observability' ? `obs-${selectedAgentId}` : activeRole}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              {viewMode === 'observability' && activeRing === 'OEM' ? (
                <AgentObservabilityView 
                  selectedId={selectedAgentId} 
                  onSelect={(id) => setSelectedAgentId(id)} 
                  activeRing={activeRing}
                />
              ) : (
                renderPersonaContent()
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nexus Log - Minimal Status Bar */}
        <div className="h-14 px-12 flex items-center justify-between border-t border-border bg-surface text-[10px] font-bold uppercase tracking-[0.2em] text-black/20">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 bg-success rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
              <span className="text-accent">Nexus Live</span>
            </div>
            <div className="hidden md:flex gap-6">
              {activeAgents.slice(0, 3).map(agent => (
                <span key={agent} className="opacity-60">{agent}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-10">
            <div className="hidden lg:block">
              <span className="opacity-40 mr-3">Next Event:</span>
              <span className="text-accent/60">
                {activeRole === 'Technician' ? 'EV Diagnostics' : 
                 activeRole === 'Service Advisor' ? 'Warranty Approval' : 'Monitor Load'}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Global Job Card Modal */}
      {selectedJC && (
        <JobCardModal jcNumber={selectedJC} onClose={() => setSelectedJC(null)} />
      )}
    </div>
  );
}

function MinimalKPI({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-2">{label}</h3>
      <div className="text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function KPICard({ label, value, sub, icon }: { label: string, value: string, sub: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-[#F5F5F7] rounded-lg text-black/60">{icon}</div>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+4.2%</span>
      </div>
      <h3 className="text-xs font-medium text-black/50 uppercase tracking-wider mb-1">{label}</h3>
      <div className="text-xl font-bold mb-1">{value}</div>
      <p className="text-[10px] text-black/40">{sub}</p>
    </div>
  );
}

// --- PERSONA VIEWS ---

function ReceptionistView({ workshopId }: { workshopId: string }) {
  const workshopVehicles = MOCK_VEHICLES.filter(v => v.workshopId === workshopId);
  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Live Arrivals</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Smart Triage Active</span>
              </div>
            </div>
            <div className="divide-y divide-border">
              {workshopVehicles.map((v) => (
                <div key={v.vin} className="py-8 flex items-center justify-between group cursor-pointer hover:bg-surface/50 transition-colors px-4 -mx-4 rounded-2xl">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white font-mono text-[10px] leading-tight transition-all group-hover:scale-105 shadow-sm">
                      {v.plate.split(' ').map((s, i) => <div key={i}>{s}</div>)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-semibold text-lg tracking-tight">{v.model}</div>
                        {v.healthScore < 50 && (
                          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest border border-red-100">Critical Telematics</span>
                        )}
                      </div>
                      <div className="text-xs text-black/40 font-medium">{v.customer} • {v.vin}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-right">
                      <div className="text-sm font-semibold mb-1">Health {v.healthScore}%</div>
                      <div className="text-[10px] text-black/20 uppercase tracking-widest font-bold">Status: {v.status}</div>
                    </div>
                    <ChevronRight size={20} className="text-black/10 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-accent text-white p-10 rounded-[2.5rem] shadow-sm">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-8">
              <Zap size={20} className="text-success" />
            </div>
            <h4 className="font-semibold text-xl mb-3 tracking-tight">Agentic Insight</h4>
            <p className="text-sm text-white/60 leading-relaxed mb-10">
              VIN ...56 (Nexon EV) has a battery imbalance. Assign to <strong>Express Bay</strong> to maintain &lt;48h efficiency.
            </p>
            <button className="w-full bg-white text-accent py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all">
              Notify Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OSJobCardModal({ vehicle, appointment, onClose }: { vehicle: Vehicle; appointment?: ServiceAppointment; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-10 border-b border-border flex justify-between items-center bg-surface">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-accent text-white rounded-2xl flex items-center justify-center font-bold text-2xl">JC</div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Job Card: {appointment?.jcNumber || 'JC-NEW-2026'}</h3>
              <p className="text-sm text-black/40 font-medium">{vehicle.model} • {vehicle.plate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-black/5 rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Customer Details</h5>
              <div className="space-y-2">
                <div className="text-lg font-semibold">{vehicle.customer}</div>
                <div className="text-sm text-black/60">+91 98765 43210</div>
                <div className="text-sm text-black/60">Gold Loyalty Member</div>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Vehicle Info</h5>
              <div className="space-y-2">
                <div className="text-lg font-semibold">{vehicle.model}</div>
                <div className="text-sm text-black/60">VIN: {vehicle.vin}</div>
                <div className="text-sm text-black/60">Odometer: {vehicle.telematics?.odometer} km</div>
              </div>
            </div>
            <div className="space-y-4">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Service Info</h5>
              <div className="space-y-2">
                <div className="text-lg font-semibold">{appointment?.serviceType || 'General Service'}</div>
                <div className="text-sm text-black/60">SA: {appointment?.sa || 'Unassigned'}</div>
                <div className="text-sm text-black/60">Status: {appointment?.status || 'Open'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Service Timeline</h5>
            <div className="relative pt-8 pb-4">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black/5 -translate-y-1/2" />
              <div className="flex justify-between relative">
                {[
                  { label: 'Gate In', time: appointment?.timeline.gateIn, completed: true },
                  { label: 'Job Open', time: appointment?.timeline.jobOpen, completed: true },
                  { label: 'Bay Alloc', time: appointment?.timeline.bayAllocated, completed: !!appointment?.timeline.bayAllocated && appointment?.timeline.bayAllocated !== 'Pending' },
                  { label: 'Work Start', time: appointment?.timeline.workStart, completed: !!appointment?.timeline.workStart && appointment?.timeline.workStart !== 'Pending' },
                  { label: 'Ready', time: 'Pending', completed: false },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${step.completed ? 'bg-success' : 'bg-black/10'}`} />
                    <div className="text-center">
                      <div className="text-[10px] font-bold uppercase tracking-widest">{step.label}</div>
                      <div className="text-[10px] text-black/40 font-medium mt-1">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-border bg-surface flex justify-end gap-4">
          <button className="px-8 py-3 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">Print Job Card</button>
          <button className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all">Update Status</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AgenticServiceOS({ vehicle, workshopId }: { vehicle: Vehicle; workshopId: string }) {
  const [vocInput, setVocInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [complaints, setComplaints] = useState<string[]>(['Battery drain faster than expected', 'Brake squeal on low speeds']);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [workPlan, setWorkPlan] = useState<{ id: string; task: string; priority: 'High' | 'Medium' | 'Low'; status: 'Pending' | 'Modified'; remarks?: string }[] | null>(null);
  const [isJobCardOpen, setIsJobCardOpen] = useState(false);
  const appointment = MOCK_SERVICE_APPOINTMENTS.find(a => a.regNo === vehicle.plate || a.chassisNo === vehicle.vin);

  const handleAddComplaint = () => {
    if (vocInput.trim()) {
      setComplaints([...complaints, vocInput.trim()]);
      setVocInput('');
    }
  };

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
    // Simulate AI generation
    setTimeout(() => {
      setWorkPlan([
        { id: '1', task: 'HV Battery Cell Balancing & Diagnostic Scan', priority: 'High', status: 'Pending' },
        { id: '2', task: 'Brake Pad Inspection & Cleaning (Front)', priority: 'Medium', status: 'Pending' },
        { id: '3', task: 'Software Update: BMS v2.4.1', priority: 'High', status: 'Pending' },
        { id: '4', task: 'Suspension Bush Lubrication', priority: 'Low', status: 'Pending' },
      ]);
      setIsGeneratingPlan(false);
    }, 1500);
  };

  const handleOverride = (id: string, newTask: string) => {
    const remarks = prompt('Please provide a justification for this override:');
    if (remarks) {
      setWorkPlan(prev => prev?.map(task => 
        task.id === id ? { ...task, task: newTask, status: 'Modified', remarks } : task
      ) || null);
    }
  };

  return (
    <div className="space-y-12">
      <AnimatePresence>
        {isJobCardOpen && (
          <OSJobCardModal 
            vehicle={vehicle} 
            appointment={appointment} 
            onClose={() => setIsJobCardOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* OS Header */}
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-black/10 border border-border">
            <UserCircle size={40} strokeWidth={1} />
          </div>
          <div>
            <h4 className="text-2xl font-bold tracking-tight">{vehicle.customer}</h4>
            <p className="text-sm text-black/40 font-medium">{vehicle.model} • {vehicle.plate}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsJobCardOpen(true)}
          className="flex items-center gap-3 px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-lg shadow-black/10"
        >
          <ClipboardList size={14} /> Open Job Card
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* VoC Capture Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 text-accent rounded-xl">
              <Mic size={18} />
            </div>
            <h5 className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">Voice of Customer (VoC)</h5>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
            <div className="space-y-4">
              <h6 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Captured Concerns</h6>
              <div className="space-y-3">
                {complaints.map((c, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      <span className="text-sm font-medium text-black/80">{c}</span>
                    </div>
                    <button 
                      onClick={() => setComplaints(complaints.filter((_, idx) => idx !== i))}
                      className="p-2 text-black/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea 
                value={vocInput}
                onChange={(e) => setVocInput(e.target.value)}
                placeholder="Capture customer concerns in real-time..."
                className="w-full h-32 p-6 bg-surface border border-border rounded-3xl text-sm focus:outline-none focus:border-accent transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={`p-3 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-black/5 text-black/40 hover:bg-black/10'}`}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button 
                  onClick={handleAddComplaint}
                  className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all"
                >
                  Add Concern
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleGeneratePlan}
            disabled={complaints.length === 0 || isGeneratingPlan}
            className="w-full py-5 bg-accent text-white rounded-3xl text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isGeneratingPlan ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
            Generate AI Work Plan
          </button>
        </div>

        {/* AI Work Plan Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
              <Zap size={18} />
            </div>
            <h5 className="text-[11px] font-bold text-black uppercase tracking-[0.2em]">AI-Generated Work Plan</h5>
          </div>

          {!workPlan && !isGeneratingPlan ? (
            <div className="h-[400px] bg-surface border border-dashed border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/10">
                <ClipboardList size={40} strokeWidth={1} />
              </div>
              <div>
                <div className="text-lg font-semibold text-black/40">No Work Plan Generated</div>
                <p className="text-sm text-black/20 mt-2">Capture customer concerns to generate an intelligent work plan.</p>
              </div>
            </div>
          ) : isGeneratingPlan ? (
            <div className="h-[400px] bg-white border border-border rounded-[2.5rem] flex flex-col items-center justify-center text-center p-12 space-y-8">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                  <Sparkles size={32} className="animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-lg font-bold text-indigo-900">Nexus AI Orchestrating...</div>
                <p className="text-sm text-indigo-900/40">Analyzing VoC, telematics, and workshop load.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm space-y-8">
              <div className="space-y-4">
                {workPlan?.map((task, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={task.id} 
                    className="p-5 bg-surface rounded-2xl border border-border group relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                          task.priority === 'High' ? 'bg-red-500 text-white' :
                          task.priority === 'Medium' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {task.priority} Priority
                        </span>
                        {task.status === 'Modified' && (
                          <span className="flex items-center gap-1 text-[8px] font-bold text-indigo-600 uppercase tracking-widest">
                            <Edit3 size={10} /> Modified
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleOverride(task.id, task.task)}
                        className="p-2 text-black/20 hover:text-accent transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-black/80">{task.task}</div>
                    {task.remarks && (
                      <div className="mt-3 pt-3 border-t border-black/5 text-[10px] text-black/40 italic">
                        Justification: {task.remarks}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="pt-8 border-t border-border flex justify-between items-center">
                <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">
                  Total Tasks: {workPlan?.length}
                </div>
                <button className="px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all">
                  Approve & Push to Workshop
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceAdvisorView({ workshopId, onOpenJC }: { workshopId: string; onOpenJC: (jc: string) => void }) {
  const workshopVehicles = MOCK_VEHICLES.filter(v => v.workshopId === workshopId);
  const vehicle = workshopVehicles[0] || MOCK_VEHICLES[1];

  return (
    <div className="space-y-16">
      <AgenticServiceOS vehicle={vehicle} workshopId={workshopId} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Diagnostic Context */}
          <div className="bg-red-50/50 border border-red-100 p-8 rounded-[2.5rem] space-y-6">
            <div className="flex items-center justify-between">
              <h5 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em]">Telematics & History Context</h5>
              <span className="bg-red-500 text-white px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest">High Priority</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="text-[10px] text-black/60 font-bold uppercase tracking-widest">Telematics Fault</div>
                <div className="text-sm font-semibold text-red-900">Turbocharger Efficiency Low (P0299)</div>
                <p className="text-xs text-red-900/80 leading-relaxed">Boost pressure is 15% below target. Telematics suggests wastegate actuator failure.</p>
              </div>
              <div className="space-y-3 border-l border-red-100 pl-8">
                <div className="text-[10px] text-black/60 font-bold uppercase tracking-widest">Prior History Alert</div>
                <div className="text-sm font-semibold text-red-900">Repeat Repair Detected</div>
                <p className="text-xs text-red-900/80 leading-relaxed">Suspension noise reported 3 times in 12 months. Root cause likely <strong>Lower Control Arm</strong>, not bushes.</p>
              </div>
            </div>
          </div>

          <GeminiInsight 
            title="AI Service Strategy"
            compact
            systemInstruction="You are a service strategy advisor. Provide a concise technical recommendation for the technician and a separate, reassuring 1-sentence summary for the customer."
            prompt={`The customer ${vehicle.customer} has a ${vehicle.model} with a health score of ${vehicle.healthScore}. 
            Issues: Turbocharger Efficiency Low (P0299) and Repeat Suspension Noise. 
            History: Suspension noise reported 3 times. 
            Draft a technical recommendation for the technician and a reassuring summary for the customer.`}
          />

          <ComplaintsSection role="Service Advisor" workshopId={workshopId} />
        </div>

        <div className="space-y-12">
          {/* Workshop Ops & Quality Compliance */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Bay Allocation</h5>
              <span className="text-[10px] text-success font-bold uppercase tracking-widest">Optimized</span>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-surface rounded-2xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center font-bold">04</div>
                  <div>
                    <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Assigned Bay</div>
                    <div className="text-xs font-semibold">EV Specialization Bay</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Skill Match</div>
                  <div className="text-xs font-bold text-success">98%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Quality & Compliance</h5>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest">3 Pending</span>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Revisit Detection', status: 'warning', desc: 'Suspension noise repeat' },
                { label: 'Warranty Pre-validation', status: 'success', desc: 'Eligible for claim' },
                { label: 'TSB Check', status: 'critical', desc: 'TSB-2024-012: Battery Seal' },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-surface rounded-2xl border border-border">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'success' ? 'bg-success' : 
                    check.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5">{check.label}</div>
                    <div className="text-[10px] text-black/40 font-medium">{check.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceGMView({ workshopId, onOpenJC }: { workshopId: string; onOpenJC: (jc: string) => void }) {
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'Workshop Status' | 'Parts Dashboard' | 'Targets & Trends'>('Dashboard');
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>('1');

  const workshop = WORKSHOPS.find(w => w.id === workshopId);
  const workshopName = workshop?.name || 'Nexus Motors';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return (
          <div className="space-y-10">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Total Appointments</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">10</span>
                </div>
                <div className="mt-4 flex gap-3 text-[9px] font-bold text-black/40 uppercase tracking-widest">
                  <span>Walk-in: 3</span>
                  <span>Agent: 3</span>
                  <span>Dealer: 2</span>
                  <span>iRA: 2</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Bay Availability</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight text-accent">6 / 4 / 2</span>
                </div>
                <div className="mt-4 text-[9px] font-bold text-black/40 uppercase tracking-widest">
                  Total / Occupied / Free
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Vehicles in Workshop</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tight">4</span>
                </div>
                <div className="mt-4 text-[9px] font-bold text-black/40 uppercase tracking-widest">
                  Currently
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Revisit %</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold tracking-tight">3.2%</span>
                  <span className="text-success text-[10px] font-bold">↓ 0.5%</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Repeat Complaint %</div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold tracking-tight">1.8%</span>
                  <span className="text-success text-[10px] font-bold">↓ 0.2%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Today Revenue</div>
                  <div className="text-2xl font-bold tracking-tight">₹5.8L / ₹3.9L</div>
                  <div className="text-[9px] font-bold text-black/40 uppercase tracking-widest mt-1">Spares / Labour</div>
                </div>
                <div className="p-4 bg-accent/5 rounded-2xl text-accent">
                  <TrendingUp size={24} />
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">PSF Score</div>
                  <div className="text-2xl font-bold tracking-tight">4.5/5</div>
                  <div className="text-success text-[10px] font-bold mt-1">↑ 0.1</div>
                </div>
                <div className="p-4 bg-success/5 rounded-2xl text-success">
                  <Smile size={24} />
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm flex justify-between items-center">
                <div>
                  <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Avg TAT</div>
                  <div className="text-2xl font-bold tracking-tight">M: 2.00d B: 12.63d</div>
                  <div className="text-[9px] font-bold text-black/40 uppercase tracking-widest mt-1">Mech / Body</div>
                </div>
                <div className="p-4 bg-amber-500/5 rounded-2xl text-amber-500">
                  <Clock size={24} />
                </div>
              </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="flex border-b border-border">
                {['All Appointments', 'Walk-in', 'Agent Appointment', 'Dealer Appointment', 'iRA/Z-Connect', 'Pickup & Drop'].map(tab => (
                  <button key={tab} className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'All Appointments' ? 'border-b-2 border-accent text-accent' : 'text-black/40 hover:text-black/60'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/[0.02] text-[10px] font-bold text-black/30 uppercase tracking-widest">
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5">Chassis No</th>
                      <th className="px-8 py-5">Customer</th>
                      <th className="px-8 py-5">Reg No</th>
                      <th className="px-8 py-5">PPL</th>
                      <th className="px-8 py-5">Warranty</th>
                      <th className="px-8 py-5">Service Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_SERVICE_APPOINTMENTS.map(apt => (
                      <React.Fragment key={apt.id}>
                        <tr 
                          className={`hover:bg-black/[0.01] transition-all cursor-pointer ${expandedAppointmentId === apt.id ? 'bg-black/[0.02]' : ''}`}
                          onClick={() => setExpandedAppointmentId(expandedAppointmentId === apt.id ? null : apt.id)}
                        >
                          <td className="px-8 py-6 text-xs font-medium">{apt.date}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.chassisNo}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.customer}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.regNo}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.ppl}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.warranty}</td>
                          <td className="px-8 py-6 text-xs font-medium">{apt.serviceType}</td>
                        </tr>
                        {expandedAppointmentId === apt.id && (
                          <tr>
                            <td colSpan={7} className="px-8 py-10 bg-black/[0.02]">
                              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                                <div className="flex justify-between items-start mb-10">
                                  <div className="grid grid-cols-4 gap-12">
                                    <div>
                                      <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-1">JC Number</div>
                                      <div className="text-xs font-bold">{apt.jcNumber}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-1">SA</div>
                                      <div className="text-xs font-bold">{apt.sa}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-1">Technician</div>
                                      <div className="text-xs font-bold">{apt.technician}</div>
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-1">Bay</div>
                                      <div className="text-xs font-bold">{apt.bay}</div>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-4">
                                    {apt.jcNumber && (
                                      <button 
                                        onClick={() => onOpenJC(apt.jcNumber!)}
                                        className="px-6 py-3 bg-accent text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-accent/20"
                                      >
                                        View Full Job Card
                                      </button>
                                    )}
                                    <button className="px-6 py-3 bg-white border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
                                      Download PDF
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-8">Vehicle Timeline</div>
                                  <div className="relative">
                                    <div className="absolute top-4 left-0 w-full h-0.5 bg-border" />
                                    <div className="relative flex justify-between">
                                      {[
                                        { label: 'Gate In', time: apt.timeline.gateIn },
                                        { label: 'Job Open', time: apt.timeline.jobOpen },
                                        { label: 'Bay Allocated', time: apt.timeline.bayAllocated },
                                        { label: 'Work Start', time: apt.timeline.workStart },
                                        { label: 'eQC', time: apt.timeline.eqc },
                                        { label: 'Washing', time: apt.timeline.washing },
                                        { label: 'Invoice', time: apt.timeline.invoice },
                                        { label: 'Gate Out', time: apt.timeline.gateOut }
                                      ].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${step.time !== 'Pending' ? 'bg-accent text-white' : 'bg-surface border border-border text-black/20'}`}>
                                            {step.time !== 'Pending' ? <CheckCircle size={14} /> : i + 1}
                                          </div>
                                          <div className="text-center">
                                            <div className="text-[9px] font-bold uppercase tracking-widest mb-1">{step.label}</div>
                                            <div className="text-[10px] font-medium text-black/40">{step.time}</div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Workshop Status':
        return (
          <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
            <div className="p-8 border-b border-border">
              <h3 className="text-xl font-bold tracking-tight">Workshop Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/[0.02] text-[10px] font-bold text-black/30 uppercase tracking-widest">
                    <th className="px-8 py-5">Bay</th>
                    <th className="px-8 py-5">Technician</th>
                    <th className="px-8 py-5">Vehicle</th>
                    <th className="px-8 py-5">Reg No</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5">Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_WORKSHOP_BAY_STATUS.map(bay => (
                    <tr key={bay.id} className="hover:bg-black/[0.01] transition-all">
                      <td className="px-8 py-6 text-xs font-medium">{bay.bay}</td>
                      <td className="px-8 py-6 text-xs font-medium">{bay.technician}</td>
                      <td className="px-8 py-6 text-xs font-medium">{bay.vehicle}</td>
                      <td className="px-8 py-6 text-xs font-medium">{bay.regNo}</td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          bay.status === 'On Time' ? 'bg-success/10 text-success' :
                          bay.status === 'Minor Delay' ? 'bg-amber-500/10 text-amber-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {bay.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-xs font-medium text-red-500">{bay.delay || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'Parts Dashboard':
        return (
          <div className="space-y-10">
            <div className="flex border-b border-border">
              {['VOR', 'Overall Stock'].map(tab => (
                <button key={tab} className={`px-8 py-5 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === 'VOR' ? 'border-b-2 border-accent text-accent' : 'text-black/40 hover:text-black/60'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2">Parts Required</div>
                <div className="text-3xl font-bold tracking-tight">4</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2 text-amber-500">Pending</div>
                <div className="text-3xl font-bold tracking-tight text-amber-500">2</div>
              </div>
              <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
                <div className="text-[10px] text-black/30 font-bold uppercase tracking-widest mb-2 text-red-500">Backorder</div>
                <div className="text-3xl font-bold tracking-tight text-red-500">1</div>
              </div>
            </div>

            <div className="p-6 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">VOR Escalation: PT-SUS-002 (Stabilizer Link Kit) in backorder for MH-12-EF-9012, JC ageing: 2 days</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-black/[0.02] text-[10px] font-bold text-black/30 uppercase tracking-widest">
                      <th className="px-8 py-5">Part No</th>
                      <th className="px-8 py-5">Part Name</th>
                      <th className="px-8 py-5">Qty</th>
                      <th className="px-8 py-5">Reg No</th>
                      <th className="px-8 py-5">PPL</th>
                      <th className="px-8 py-5">JC#</th>
                      <th className="px-8 py-5">Ageing</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">ETA</th>
                      <th className="px-8 py-5">Arranged From</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_PARTS_VOR.map(part => (
                      <tr key={part.id} className="hover:bg-black/[0.01] transition-all">
                        <td className="px-8 py-6 text-xs font-medium">{part.partNo}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.partName}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.qty}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.regNo}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.ppl}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.jcNo}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.ageing}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            part.status === 'Order Placed' ? 'bg-success/10 text-success' :
                            part.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {part.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-xs font-medium">{part.eta || '-'}</td>
                        <td className="px-8 py-6 text-xs font-medium">{part.arrangedFrom || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Targets & Trends':
        return (
          <div className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">PSF / Revisit / Repeat Complaint Trends</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Oct', psf: 4.2, revisit: 2.8, repeat: 1.5 },
                      { month: 'Nov', psf: 4.3, revisit: 2.5, repeat: 1.4 },
                      { month: 'Dec', psf: 4.2, revisit: 2.6, repeat: 1.6 },
                      { month: 'Jan', psf: 4.4, revisit: 2.4, repeat: 1.3 },
                      { month: 'Feb', psf: 4.5, revisit: 2.2, repeat: 1.2 },
                      { month: 'Mar', psf: 4.5, revisit: 2.1, repeat: 1.2 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                      <YAxis hide />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                      <Line type="monotone" dataKey="psf" stroke="#141414" strokeWidth={3} dot={{ r: 4 }} name="PSF" />
                      <Line type="monotone" dataKey="revisit" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Revisit %" />
                      <Line type="monotone" dataKey="repeat" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Repeat %" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Bay Utilization & Walk-in vs Agent</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: 'Oct', bay: 82, walkin: 45, agent: 55 },
                      { month: 'Nov', bay: 85, walkin: 42, agent: 58 },
                      { month: 'Dec', bay: 78, walkin: 48, agent: 52 },
                      { month: 'Jan', bay: 88, walkin: 40, agent: 60 },
                      { month: 'Feb', bay: 90, walkin: 38, agent: 62 },
                      { month: 'Mar', bay: 85, walkin: 41, agent: 59 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                      <YAxis hide />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                      <Bar dataKey="bay" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Bay Util %" />
                      <Bar dataKey="walkin" fill="#10B981" radius={[4, 4, 0, 0]} name="Walk-in %" />
                      <Bar dataKey="agent" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Agent %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border flex items-center gap-3">
                  <Users size={20} className="text-accent" />
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Technician Leaderboard</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-black/[0.02] text-[10px] font-bold text-black/30 uppercase tracking-widest">
                        <th className="px-8 py-5">#</th>
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">RV%</th>
                        <th className="px-8 py-5">RC%</th>
                        <th className="px-8 py-5">PSF</th>
                        <th className="px-8 py-5">Avg TAT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MOCK_TECH_LEADERBOARD.map((tech, i) => (
                        <tr key={tech.id} className="hover:bg-black/[0.01] transition-all">
                          <td className="px-8 py-6">
                            {i === 0 ? <TrendingUp size={16} className="text-amber-500" /> : i + 1}
                          </td>
                          <td className="px-8 py-6 text-xs font-bold">{tech.name}</td>
                          <td className="px-8 py-6 text-xs font-medium">{tech.rv}</td>
                          <td className="px-8 py-6 text-xs font-medium">{tech.rc}</td>
                          <td className="px-8 py-6 text-xs font-bold text-success">{tech.psf}</td>
                          <td className="px-8 py-6 text-xs font-medium">{tech.avgTat}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
                <div className="p-8 border-b border-border flex items-center gap-3">
                  <Users size={20} className="text-accent" />
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Service Advisor Leaderboard</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-black/[0.02] text-[10px] font-bold text-black/30 uppercase tracking-widest">
                        <th className="px-8 py-5">#</th>
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">Active Jobs</th>
                        <th className="px-8 py-5">Avg Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MOCK_SA_LEADERBOARD.map((sa, i) => (
                        <tr key={sa.id} className="hover:bg-black/[0.01] transition-all">
                          <td className="px-8 py-6">
                            {i === 0 ? <TrendingUp size={16} className="text-amber-500" /> : i + 1}
                          </td>
                          <td className="px-8 py-6 text-xs font-bold">{sa.name}</td>
                          <td className="px-8 py-6 text-xs font-medium">{sa.activeJobs}</td>
                          <td className="px-8 py-6 text-xs font-medium">{sa.avgTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Average TAT Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Oct', mech: 2.2, body: 14.5 },
                      { month: 'Nov', mech: 2.1, body: 12.8 },
                      { month: 'Dec', mech: 2.3, body: 13.2 },
                      { month: 'Jan', mech: 2.0, body: 12.5 },
                      { month: 'Feb', mech: 1.9, body: 11.8 },
                      { month: 'Mar', mech: 2.0, body: 12.6 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                      <YAxis hide />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                      <Line type="monotone" dataKey="mech" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} name="Mechanical (days)" />
                      <Line type="monotone" dataKey="body" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} name="Bodyshop (days)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Revenue Trend</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { month: 'Oct', spares: 4.2, labour: 3.1 },
                      { month: 'Nov', spares: 4.5, labour: 3.2 },
                      { month: 'Dec', spares: 4.1, labour: 3.0 },
                      { month: 'Jan', spares: 4.8, labour: 3.5 },
                      { month: 'Feb', spares: 5.2, labour: 3.8 },
                      { month: 'Mar', spares: 5.8, labour: 3.9 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                      <YAxis hide />
                      <Tooltip />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                      <Bar dataKey="spares" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Spares" />
                      <Bar dataKey="labour" fill="#10B981" radius={[4, 4, 0, 0]} name="Labour" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full -m-12 overflow-hidden">
      {/* Internal Sidebar */}
      <div className="w-72 bg-black text-white p-10 space-y-12 shrink-0">
        <div className="space-y-2">
          <div className="text-xl font-bold tracking-tight">{workshopName}</div>
          <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">5008010</div>
        </div>

        <nav className="space-y-4">
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Workshop Status', icon: Wrench },
            { id: 'Parts Dashboard', icon: Package },
            { id: 'Targets & Trends', icon: BarChart3 }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-sm font-medium ${
                activeTab === item.id ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.id}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 bg-bg">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="flex p-1 bg-black/[0.03] rounded-xl border border-border">
              {['All', 'EV', 'PV'].map(filter => (
                <button key={filter} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === 'All' ? 'bg-white text-accent shadow-sm' : 'text-black/20 hover:text-black/40'}`}>
                  {filter}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-3 px-6 py-2.5 bg-white border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
              <Clock size={14} /> Date Filter
            </button>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] bg-accent/5 px-4 py-2 rounded-lg border border-accent/10">GM / CRM / SM</div>
            <button className="p-3 rounded-xl bg-white border border-border text-black/20 hover:text-red-500 transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </div>
  );
}

function JobCardModal({ jcNumber, onClose }: { jcNumber: string; onClose: () => void }) {
  const appointment = MOCK_SERVICE_APPOINTMENTS.find(a => a.jcNumber === jcNumber);
  const vehicle = MOCK_VEHICLES.find(v => v.plate === appointment?.regNo || v.vin === appointment?.chassisNo);
  const detIssue = MOCK_DET_ISSUES.find(i => i.jc === jcNumber);

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-10 py-8 border-b border-border flex items-center justify-between bg-surface/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
              <FileText size={24} />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight">{jcNumber}</div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Job Card Details • {appointment.date}</div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-black/5 rounded-2xl transition-all text-black/40">
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          {/* Synergy Status */}
          <div className="flex items-center gap-3 px-6 py-3 bg-success/5 border border-success/10 rounded-2xl text-success">
            <CheckCircle2 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest">All Databases Integrated & Synergized</span>
          </div>

          <div className="grid grid-cols-2 gap-10">
            {/* Left Column: Vehicle & Customer */}
            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Vehicle & Customer</h3>
                <div className="bg-surface/30 p-8 rounded-3xl border border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Customer</span>
                    <span className="text-sm font-bold">{appointment.customer}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Registration</span>
                    <span className="text-sm font-bold">{appointment.regNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Chassis No</span>
                    <span className="text-sm font-bold font-mono">{appointment.chassisNo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Model</span>
                    <span className="text-sm font-bold">{appointment.ppl}</span>
                  </div>
                  {vehicle && (
                    <>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Health Score</span>
                        <span className={`text-sm font-bold ${vehicle.healthScore > 80 ? 'text-success' : 'text-amber-500'}`}>{vehicle.healthScore}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Battery SoH</span>
                        <span className="text-sm font-bold text-accent">{vehicle.soh}%</span>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {detIssue && (
                <section>
                  <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Diagnostic Context</h3>
                  <div className="bg-accent/5 p-8 rounded-3xl border border-accent/10 space-y-4">
                    <div className="text-sm font-bold text-accent">{detIssue.description}</div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest bg-white border border-accent/20 text-accent`}>
                        {detIssue.status}
                      </span>
                      {detIssue.isRepeat && (
                        <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[9px] font-bold uppercase tracking-widest">Repeat Repair</span>
                      )}
                    </div>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Service & Timeline */}
            <div className="space-y-10">
              <section>
                <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Service Assignment</h3>
                <div className="bg-surface/30 p-8 rounded-3xl border border-border space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Service Type</span>
                    <span className="text-sm font-bold">{appointment.serviceType}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Service Advisor</span>
                    <span className="text-sm font-bold">{appointment.sa}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Technician</span>
                    <span className="text-sm font-bold">{appointment.technician}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Bay</span>
                    <span className="text-sm font-bold">{appointment.bay}</span>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Service Timeline</h3>
                <div className="space-y-4">
                  {Object.entries(appointment.timeline).map(([key, value], i) => (
                    <div key={key} className="flex items-center gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${value === 'Pending' ? 'bg-black/10' : 'bg-success'}`} />
                        {i < Object.entries(appointment.timeline).length - 1 && (
                          <div className="w-0.5 h-6 bg-black/5" />
                        )}
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${value === 'Pending' ? 'text-black/20' : 'text-black/80'}`}>{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-10 py-8 border-t border-border bg-surface/30 flex items-center justify-end gap-4">
          <button className="px-8 py-3 bg-white border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
            Download PDF
          </button>
          <button className="px-8 py-3 bg-accent text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-accent/20">
            Update Status
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DETView({ workshopId, onOpenJC, selectedJC }: { workshopId: string; onOpenJC: (jc: string) => void; selectedJC: string | null }) {
  const [activeTab, setActiveTab] = useState<'Active Issues' | 'THD Raised' | 'Supplier Tickets' | 'DET WIP'>('Active Issues');
  const [searchQuery, setSearchQuery] = useState('');

  const workshop = WORKSHOPS.find(w => w.id === workshopId);
  const workshopName = workshop?.name || 'Nexus Motors';
  const workshopInitials = workshopName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const kpis = [
    { label: 'Active Issues', value: '5' },
    { label: 'DET WIP', value: '2' },
    { label: 'THD Awaiting Dealer Feedback', value: '0' },
    { label: 'THD Awaiting STS/CCM', value: '1' },
    { label: 'Awaiting Supplier', value: '1' },
  ];

  const filteredIssues = MOCK_DET_ISSUES.filter(issue => {
    const matchesSearch = issue.regNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         issue.chassis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.jc.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === 'Active Issues') return true;
    if (activeTab === 'THD Raised') return issue.status === 'THD Raised';
    if (activeTab === 'DET WIP') return issue.status === 'DET WIP';
    return true;
  });

  return (
    <div className="flex flex-col h-full -m-12 overflow-hidden bg-[#F8FAFC]">
      {/* Top Header */}
      <div className="bg-white border-b border-border px-12 py-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl">{workshopInitials}</div>
          <div>
            <div className="text-lg font-bold tracking-tight">{workshopName}</div>
            <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{workshopId}</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex p-1 bg-black/[0.03] rounded-xl border border-border">
            {['All', 'EV', 'PV'].map(filter => (
              <button key={filter} className={`px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${filter === 'All' ? 'bg-accent text-white shadow-sm' : 'text-black/20 hover:text-black/40'}`}>
                {filter}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-3 px-6 py-2.5 bg-white border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
            <Clock size={14} /> Date Filter
          </button>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-accent/5 border border-accent/10 rounded-lg text-[10px] font-bold text-accent uppercase tracking-widest">DET ID</div>
            <button className="p-2.5 rounded-xl hover:bg-black/5 text-black/40 transition-all relative">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-black/5 text-black/40 transition-all">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">DET Dashboard</h2>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
              <Monitor size={14} /> Remote Diagnostics
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all shadow-lg shadow-accent/20">
              <Plus size={14} /> New Diagnostic Case
            </button>
          </div>
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-5 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-8 rounded-[1.5rem] border border-border shadow-sm">
              <div className="text-3xl font-bold mb-2">{kpi.value}</div>
              <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest leading-tight">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Issues List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="text"
                placeholder="Search by Reg No / Chassis No..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:border-accent transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tabs & List */}
            <div className="bg-white rounded-[2.5rem] border border-border shadow-sm overflow-hidden">
              <div className="flex border-b border-border px-8">
                {['Active Issues', 'THD Raised', 'Supplier Tickets', 'DET WIP'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-8 py-6 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-accent' : 'text-black/40 hover:text-black/60'}`}
                  >
                    {tab}
                    {tab === 'THD Raised' && (
                      <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-[9px] rounded-full">2</span>
                    )}
                    {activeTab === tab && (
                      <motion.div layoutId="detTab" className="absolute bottom-0 left-0 w-full h-1 bg-accent" />
                    )}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-border">
                {filteredIssues.map((issue) => (
                  <div key={issue.id} className="p-8 hover:bg-black/[0.01] transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold tracking-tight">{issue.regNo}</span>
                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                          issue.status === 'DET WIP' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                          issue.status === 'THD Raised' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                          'bg-surface text-black/40 border border-border'
                        }`}>
                          {issue.status}
                        </span>
                        {issue.isRepeat && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[9px] font-bold uppercase tracking-widest">
                            <RotateCcw size={10} /> Repeat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onOpenJC(issue.jc)}
                          className="px-6 py-2 text-[10px] font-bold text-black/40 uppercase tracking-widest hover:bg-black/5 rounded-lg transition-all border border-border"
                        >
                          View Job Card
                        </button>
                        {issue.status === 'DET WIP' ? (
                          <>
                            <button className="px-6 py-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:bg-accent/5 rounded-lg transition-all">Update Checks</button>
                            <button className="px-6 py-2 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-amber-600 transition-all shadow-sm shadow-amber-500/20">Raise THD</button>
                          </>
                        ) : (
                          <button className="px-6 py-2 text-[10px] font-bold text-accent uppercase tracking-widest hover:bg-accent/5 rounded-lg transition-all">Refer/Update THD</button>
                        )}
                        <button className="p-2 text-black/20 group-hover:text-black/40 transition-all">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xl font-semibold mb-4">{issue.description}</div>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      <span>Chassis: <span className="text-black/60">{issue.chassis}</span></span>
                      <span>Model: <span className="text-black/60">{issue.model}</span></span>
                      <span>Tech: <span className="text-black/60">{issue.tech}</span></span>
                      {issue.thdNo && <span>THD: <span className="text-black/60">{issue.thdNo}</span></span>}
                      <span>JC: <span className="text-black/60">{issue.jc}</span></span>
                      <span>Ageing: <span className="text-black/60">{issue.ageing}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Intelligence & Feeds */}
          <div className="space-y-8">
            {/* DET Intelligence */}
            <div className="bg-accent text-white p-8 rounded-[2.5rem] shadow-xl shadow-accent/20">
              <div className="flex items-center gap-3 mb-6">
                <Zap size={20} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">DET Intelligence</h3>
              </div>
              <div className="space-y-6">
                <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-sm font-medium leading-relaxed">
                    Spike in <strong>HV Battery Faults</strong> observed in Nexon EV Batch B4. AI suggests proactive cooling system check.
                  </p>
                </div>
                <div className="p-5 bg-white/10 rounded-2xl border border-white/10">
                  <p className="text-sm font-medium leading-relaxed">
                    <strong>THD-2026-0045</strong> matches historical case #9921. Recommended fix: Turbo actuator recalibration.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Tech Support Feed */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Live Support Feed</h3>
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              </div>
              <div className="space-y-6">
                {[
                  { user: 'STS Head', msg: 'New bulletin released for Punch EV software update.', time: '10m ago' },
                  { user: 'Supplier (Exide)', msg: 'Battery testing protocol updated for 2026 models.', time: '25m ago' },
                  { user: 'CCM Zone 2', msg: 'Escalation for MH-12-CD-5678 acknowledged.', time: '1h ago' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-8 h-8 bg-black/[0.03] rounded-full flex items-center justify-center text-[10px] font-bold group-hover:bg-accent group-hover:text-white transition-all">
                      {item.user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-black/60">{item.user}</span>
                        <span className="text-[9px] text-black/20 font-bold uppercase tracking-widest">{item.time}</span>
                      </div>
                      <p className="text-xs text-black/40 leading-relaxed">{item.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Bulletins */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Technical Bulletins</h3>
              <div className="space-y-4">
                {[
                  { title: 'Nexon EV BMS Update v4.2', tag: 'Critical' },
                  { title: 'Harrier Steering Calibration', tag: 'Standard' },
                  { title: 'Punch EV Infotainment Patch', tag: 'Optional' }
                ].map((b, i) => (
                  <div key={i} className="p-4 hover:bg-black/[0.02] rounded-xl transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-border">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-black/20 group-hover:text-accent" />
                      <span className="text-xs font-semibold text-black/60">{b.title}</span>
                    </div>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                      b.tag === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-black/5 text-black/40'
                    }`}>{b.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Training Progress */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Training Progress</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                    <span className="text-black/40">EV Expert Level 3</span>
                    <span className="text-accent">85%</span>
                  </div>
                  <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '85%' }} />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-accent/5 rounded-xl border border-accent/10">
                  <GraduationCap size={16} className="text-accent" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Next: HV Safety Cert</span>
                </div>
              </div>
            </div>

            {/* Expert Network */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h3 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Expert Network</h3>
              <div className="flex -space-x-3 mb-6">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-black/[0.05] flex items-center justify-center text-[10px] font-bold">
                    {['SK', 'RJ', 'MP', 'AD', 'VM'][i-1]}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-accent text-white flex items-center justify-center text-[10px] font-bold">
                  +12
                </div>
              </div>
              <button className="w-full py-3 border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">
                Consult Expert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TechnicianView({ workshopId, onOpenJC }: { workshopId: string; onOpenJC: (jc: string) => void }) {
  const workshopVehicles = MOCK_VEHICLES.filter(v => v.workshopId === workshopId);
  const activeJobs = workshopVehicles.filter(v => v.status === 'In Service');
  const currentJob = MOCK_SERVICE_APPOINTMENTS.find(a => a.technician === 'Rahul Sharma' && a.status === 'In Service') || MOCK_SERVICE_APPOINTMENTS[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Workshop Floor</h3>
          <p className="text-sm text-black/60">Real-time bay utilization and job tracking</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-2">
            <Activity size={12} /> BAY 04 ACTIVE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-8">
            <div className="flex justify-between items-start mb-8 border-b border-border pb-6">
              <div>
                <div className="text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">JOB ID: {currentJob.jcNumber}</div>
                <div className="text-xl font-semibold">{currentJob.ppl} - {currentJob.serviceType}</div>
              </div>
              <div className="flex items-center gap-6">
                {currentJob.jcNumber && (
                  <button 
                    onClick={() => onOpenJC(currentJob.jcNumber!)}
                    className="px-4 py-2 bg-accent/5 text-accent rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent/10 transition-all"
                  >
                    View Job Card
                  </button>
                )}
                <div className="text-right">
                  <div className="text-[10px] font-bold text-black/60 uppercase tracking-wider mb-1">ELAPSED TIME</div>
                  <div className="text-xl font-mono font-medium text-accent">01:42:15</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center text-success text-[10px] font-bold">01</div>
                <div className="text-sm text-black/40 line-through">Drain engine oil and remove underbody shield.</div>
                <CheckCircle2 size={16} className="ml-auto text-success" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-accent/10 rounded-xl">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-bold">02</div>
                <div className="text-sm font-medium">Disconnect turbocharger inlet and outlet hoses.</div>
                <ChevronRight size={16} className="ml-auto text-accent" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl opacity-50">
                <div className="w-6 h-6 bg-black/10 rounded-full flex items-center justify-center text-black/40 text-[10px] font-bold">03</div>
                <div className="text-sm">Unbolt manifold mounting nuts (x4).</div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">JIT Learning Required</div>
                <div className="text-sm text-amber-900/80">Step 04 requires <strong>Torque Calibration</strong>. Complete LMS Module <strong>#TATA-TRB-02</strong>.</div>
              </div>
              <button className="bg-amber-600 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-amber-700 transition-colors">
                Open LMS
              </button>
            </div>

            {/* Fault Evidence Feed */}
            <div className="mt-8 space-y-6">
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Fault Evidence Feed</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Turbo Leak', type: 'image' },
                  { label: 'Oil Residue', type: 'image' },
                  { label: 'Actuator Test', type: 'video' },
                  { label: 'Gasket Wear', type: 'image' },
                ].map((media, i) => (
                  <div key={i} className="aspect-square bg-surface rounded-2xl border border-border overflow-hidden relative group cursor-pointer">
                    <img 
                      src={`https://picsum.photos/seed/fault-${i}/400/400`} 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      alt={media.label}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white uppercase tracking-widest">{media.label}</span>
                    </div>
                    {media.type === 'video' && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                ))}
                <button className="aspect-square border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 text-black/20 hover:text-accent hover:border-accent transition-all">
                  <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                    <span className="text-xl">+</span>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-widest">Add Media</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GeminiInsight 
            title="AI Diagnostic Assistant"
            compact
            systemInstruction="You are a master technician assistant. Provide a single, high-impact 'pro-tip' for the current repair step. Be extremely concise and focus on safety or efficiency."
            prompt="The technician is currently working on a Harrier - Turbo Replacement (JOB ID: #TX-9921). 
            Current status: Disconnecting turbocharger inlet and outlet hoses. 
            Next step: Unbolt manifold mounting nuts. 
            Provide a pro-tip for this specific step and any common pitfalls to avoid for this vehicle model."
          />
          <div className="bg-white p-8 border border-border rounded-2xl">
            <h4 className="font-semibold text-[10px] uppercase tracking-widest mb-6 text-black/40">Part Reservation</h4>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Turbocharger Unit</div>
                  <div className="text-[10px] text-black/40">PART #2234-AX-01</div>
                </div>
                <span className="bg-success/10 text-success px-2 py-1 rounded text-[10px] font-bold">RESERVED</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Gasket Set</div>
                  <div className="text-[10px] text-black/40">PART #9910-GS-02</div>
                </div>
                <span className="bg-success/10 text-success px-2 py-1 rounded text-[10px] font-bold">RESERVED</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium">Synthetic Oil (5L)</div>
                  <div className="text-[10px] text-black/40">PART #OIL-SYN-05</div>
                </div>
                <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold">IN TRANSIT</span>
              </div>
            </div>
            <button className="w-full mt-8 bg-black text-white py-3 rounded-xl font-semibold text-[10px] uppercase tracking-widest hover:bg-black/90 transition-colors">
              Log Fault & Request Approval
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BaySupervisorView({ workshopId }: { workshopId: string }) {
  const workshopBays = MOCK_WORKSHOP_BAY_STATUS.filter(b => b.id.startsWith('W') ? b.id.includes(workshopId) : true); // Simplified filtering for now
  
  const stats = useMemo(() => {
    const total = workshopBays.length;
    const express = workshopBays.filter(b => b.bayType === 'Express').length;
    const speedo = workshopBays.filter(b => b.bayType === 'Speedo').length;
    const avgEfficiency = Math.round(workshopBays.reduce((acc, b) => acc + b.efficiency, 0) / (total || 1));
    const avgUtilization = Math.round(workshopBays.reduce((acc, b) => acc + b.utilization, 0) / (total || 1));
    
    return { total, express, speedo, avgEfficiency, avgUtilization };
  }, [workshopBays]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Bay Supervisor Dashboard</h3>
          <p className="text-sm text-black/40">Real-time bay allocation, efficiency tracking, and network planning</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-xl border border-border flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Overall Efficiency: {stats.avgEfficiency}%</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-border flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-black/60">Utilization: {stats.avgUtilization}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-4">Total Bays</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            <div className="text-[10px] font-bold text-success uppercase tracking-widest">Active</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-4">Express Bays</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight">{stats.express}</div>
            <div className="text-[10px] font-bold text-accent uppercase tracking-widest">High Flow</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-4">Speedo Bays</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight">{stats.speedo}</div>
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Rapid</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-4">Avg TAT</div>
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold tracking-tight">42m</div>
            <div className="text-[10px] font-bold text-success uppercase tracking-widest">-8% vs Target</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border flex items-center justify-between bg-surface/50">
              <div className="flex items-center gap-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">Pending Allocation</h4>
                <div className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-bold">3 Vehicles</div>
              </div>
              <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent/90 transition-all shadow-sm group">
                <Zap size={14} className="group-hover:animate-pulse" />
                Auto-Allocate (Bay Agent)
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { reg: 'DL01-AB-1234', model: 'Nexon EV', type: 'Express', priority: 'High', time: '10m ago' },
                { reg: 'MH02-CD-5678', model: 'Harrier', type: 'Mechanical', priority: 'Medium', time: '15m ago' },
                { reg: 'KA03-EF-9012', model: 'Punch EV', type: 'Speedo', priority: 'High', time: '5m ago' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-surface rounded-2xl border border-border group hover:border-accent transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-xs font-bold">{item.model}</div>
                    <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      item.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
                    }`}>{item.priority}</span>
                  </div>
                  <div className="text-[10px] text-black/40 mb-3">{item.reg}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-black/60">{item.type}</span>
                    <div className="text-[8px] text-black/20 font-bold">{item.time}</div>
                  </div>
                  <button className="w-full mt-4 py-2 rounded-lg border border-border text-[9px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all opacity-0 group-hover:opacity-100">
                    Assign Bay
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border flex items-center justify-between bg-surface/50">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black/40">Live Bay Allocation</h4>
              <div className="flex gap-2">
                {['All', 'Mechanical', 'Express', 'Speedo'].map(type => (
                  <button key={type} className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border hover:bg-black hover:text-white transition-all">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface/30">
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Bay / Type</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Vehicle / Reg</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Technician</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Efficiency</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">TAT Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {workshopBays.map((bay) => (
                    <tr key={bay.id} className="hover:bg-surface/50 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            bay.bayType === 'Express' ? 'bg-accent' : 
                            bay.bayType === 'Speedo' ? 'bg-amber-500' : 
                            'bg-black/20'
                          }`} />
                          <div>
                            <div className="text-xs font-bold">{bay.bay}</div>
                            <div className="text-[8px] text-black/40 font-bold uppercase tracking-widest">{bay.bayType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-bold">{bay.vehicle}</div>
                        <div className="text-[10px] text-black/40 font-medium">{bay.regNo}</div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-medium">{bay.technician}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          bay.status === 'On Time' ? 'bg-success/10 text-success' :
                          bay.status === 'Minor Delay' ? 'bg-amber-50 text-amber-500' :
                          'bg-red-50 text-red-500'
                        }`}>
                          {bay.status}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-black/5 rounded-full overflow-hidden w-16">
                            <div 
                              className={`h-full rounded-full ${bay.efficiency > 90 ? 'bg-success' : bay.efficiency > 80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${bay.efficiency}%` }} 
                            />
                          </div>
                          <span className="text-[10px] font-bold">{bay.efficiency}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-xs font-mono font-medium">{bay.estimatedEndTime}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <GeminiInsight 
            title="Bay Optimization Engine"
            compact
            systemInstruction="You are a workshop efficiency expert. Provide concise, high-impact recommendations for bay allocation. Focus on immediate actions to improve throughput. Use bullet points. Start with the most critical bottleneck."
            prompt={`Analyze current workshop status: Total Bays: ${stats.total}, Express: ${stats.express}, Speedo: ${stats.speedo}, Avg Efficiency: ${stats.avgEfficiency}%, Utilization: ${stats.avgUtilization}%. 
            Identify bottlenecks and suggest proactive re-allocation for Express and Speedo bays to maximize throughput. Consider technician skill levels and part availability.`}
          />

          <div className="bg-white p-8 rounded-3xl border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-8">Network Planning Insights</h4>
            <div className="space-y-8">
              <div className="p-6 bg-surface rounded-2xl border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Expansion Opportunity</div>
                    <div className="text-[10px] text-black/40 font-medium uppercase tracking-widest">Zone 4 Analysis</div>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  High concentration of Nexon EVs in Zone 4 suggests a <strong>15% capacity gap</strong>. Recommend adding 2 Express Bays by Q3.
                </p>
              </div>

              <div className="p-6 bg-surface rounded-2xl border border-border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Speedo Bay Efficiency</div>
                    <div className="text-[10px] text-black/40 font-medium uppercase tracking-widest">Performance Audit</div>
                  </div>
                </div>
                <p className="text-xs text-black/60 leading-relaxed">
                  Speedo bays are operating at <strong>98% efficiency</strong>. Current TAT is 25m, which is 5m better than national average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SparePartsView({ workshopId }: { workshopId: string }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Inventory & Supply</h3>
          <p className="text-sm text-black/40">AI-driven stock optimization and demand forecasting</p>
        </div>
        <div className="flex gap-2">
          <span className="bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
            <CheckCircle2 size={12} /> FILL RATE: 94.2%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Health-Based Forecasting */}
          <div className="bg-white p-8 rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Health-Based Forecasting</h4>
              <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Regional Telematics Sync</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium">Brake Pad Wear Trend</div>
                  <div className="text-xs text-red-500 font-bold">+18% vs Last Month</div>
                </div>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 w-[85%]" />
                </div>
                <p className="text-[10px] text-black/40 leading-relaxed">Telematics from 450 vehicles in Zone 4 show accelerated wear due to high-dust environment. <strong>Stock-out risk in 12 days.</strong></p>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div className="text-sm font-medium">Battery Replacement Forecast</div>
                  <div className="text-xs text-amber-500 font-bold">+12% vs Last Month</div>
                </div>
                <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[65%]" />
                </div>
                <p className="text-[10px] text-black/40 leading-relaxed">Predictive analysis of voltage drops across 1,200 Harrier EVs suggests a spike in replacement demand by Week 3.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-surface flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-black/40">Critical Stock Alerts</span>
              <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">4 Stock-Out Risks</span>
            </div>
            <div className="divide-y divide-border">
              {[
                { part: 'Brake Pads (Nexon)', stock: 2, demand: 'High', action: 'Order 20' },
                { part: 'Oil Filter (Harrier)', stock: 0, demand: 'Critical', action: 'Transfer' },
                { part: 'Coolant (Safari)', stock: 5, demand: 'Medium', action: 'Order 10' },
              ].map((item, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-surface transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.stock === 0 ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                      <Package size={20} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{item.part}</div>
                      <div className="text-[10px] text-black/40 font-medium">STOCK: {item.stock} • DEMAND: {item.demand}</div>
                    </div>
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black/90 transition-colors">{item.action}</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-accent text-white p-8 rounded-2xl shadow-sm">
            <h4 className="font-semibold text-sm mb-6 flex items-center gap-2">
              <Truck size={18} /> Spare Care AI
            </h4>
            <p className="text-sm text-white/80 leading-relaxed mb-8">
              Predicting <strong>25% spike</strong> in AC Filter demand due to upcoming summer seasonality. Suggesting bulk order to save ₹45,000 in logistics.
            </p>
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Recommended Action</div>
              <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider border border-white/10 transition-colors">
                Approve Procurement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DealerPrincipalView({ workshopId }: { workshopId: string }) {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Business Intelligence</h3>
          <p className="text-sm text-black/60">Financial performance and operational efficiency</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface p-1 rounded-xl border border-border">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  timeRange === range ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <span className="bg-success/10 text-success px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
            <TrendingUp size={12} /> ABSORPTION: 1.2
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-border">
            <h4 className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-8">Revenue Mix</h4>
            <div className="space-y-6">
              <RevenueItem label="Spare Parts" value="₹45.2L" percent={40} color="bg-accent" />
              <RevenueItem label="Labor Charges" value="₹32.1L" percent={30} color="bg-success" />
              <RevenueItem label="AMC & Warranty" value="₹18.5L" percent={20} color="bg-purple-500" />
              <RevenueItem label="SaaS & Royalty" value="₹12.2L" percent={10} color="bg-amber-500" />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-border">
            <h4 className="text-[10px] font-bold text-black/30 uppercase tracking-widest mb-8">Efficiency Metrics</h4>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-black/60">Bay Hourly Revenue</span>
                  <span className="font-semibold">₹2,450</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[75%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-black/60">Technician Productivity</span>
                  <span className="font-semibold">92%</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[92%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium text-black/60">Parts Fill Rate</span>
                  <span className="font-semibold">88%</span>
                </div>
                <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[88%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <ComplaintsSection role="Dealer Principal" workshopId={workshopId} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-red-50 border border-red-100 text-red-900 p-8 rounded-2xl">
            <h4 className="font-semibold text-sm mb-6 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" /> Profit Leakage
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-red-100 rounded-xl">
                <div className="text-[10px] text-red-500/60 font-bold uppercase tracking-wider mb-1">Warranty Rejections</div>
                <p className="text-xs text-red-900/80 leading-relaxed">₹1.2L in pending claims due to improper documentation in Bay 2. <strong>Action Required.</strong></p>
              </div>
              <div className="p-4 bg-white border border-red-100 rounded-xl">
                <div className="text-[10px] text-red-500/60 font-bold uppercase tracking-wider mb-1">Idle Bay Time</div>
                <p className="text-xs text-red-900/80 leading-relaxed">Logistics Agent reports 15% idle time in Body Shop. Suggesting <strong>Dynamic Scheduling</strong>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SecurityGuardView({ workshopId }: { workshopId: string }) {
  const [activeTab, setActiveTab] = useState<'appointments' | 'movement' | 'walkin'>('appointments');
  const [scanning, setScanning] = useState(false);
  const [scannedPlate, setScannedPlate] = useState('');

  const workshopVehicles = MOCK_VEHICLES.filter(v => v.workshopId === workshopId);
  const appointments = workshopVehicles.filter(v => v.status === 'Arriving').map(v => ({
    id: `APT-${v.vin.slice(-3)}`,
    customer: v.customer,
    vehicle: v.model,
    plate: v.plate,
    time: '11:00 AM',
    type: 'Service'
  }));

  const movements = [
    { id: 'MOV-101', plate: 'MH 12 AB 1234', type: 'Gate In', timestamp: '10:58 AM', status: 'Completed' },
    { id: 'MOV-102', plate: 'MH 15 EF 9012', type: 'Gate Out', timestamp: '10:45 AM', status: 'Completed' },
    { id: 'MOV-103', plate: 'MH 12 XY 5678', type: 'Movement', timestamp: '10:30 AM', status: 'To Bay 04' },
  ];

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScannedPlate('MH 12 AB 1234');
    }, 2000);
  };

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-4xl font-semibold tracking-tight mb-2">Gate Control</h4>
          <p className="text-sm text-black/40 font-medium">Manage vehicle entry, exit and internal movements.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={simulateScan}
            disabled={scanning}
            className="px-8 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-lg flex items-center gap-3"
          >
            <Scan size={16} className={scanning ? 'animate-pulse' : ''} />
            {scanning ? 'Scanning Plate...' : 'Scan Number Plate'}
          </button>
          <button 
            onClick={() => setActiveTab('walkin')}
            className="px-8 py-4 bg-white border border-border text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black/5 transition-all flex items-center gap-3"
          >
            <Plus size={16} />
            Manual Walk-in
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-10">
          {/* Tabs */}
          <div className="flex gap-8 border-b border-border">
            {['appointments', 'movement', 'walkin'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-accent' : 'text-black/20 hover:text-black/40'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between group hover:border-accent/20 transition-all">
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-surface rounded-2xl flex items-center justify-center text-black/10">
                      <Truck size={32} strokeWidth={1} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold">{apt.plate}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-accent/5 text-accent">
                          {apt.type}
                        </span>
                      </div>
                      <h5 className="text-lg font-semibold tracking-tight">{apt.customer} • {apt.vehicle}</h5>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-1">Scheduled: {apt.time}</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="p-4 bg-success text-white rounded-xl hover:bg-success/90 transition-all shadow-sm flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <LogIn size={14} />
                      Gate In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'movement' && (
            <div className="space-y-6">
              {movements.map((mov) => (
                <div key={mov.id} className="p-8 bg-white rounded-[2.5rem] border border-border shadow-sm flex items-center justify-between">
                  <div className="flex gap-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      mov.type === 'Gate In' ? 'bg-success/10 text-success' : 
                      mov.type === 'Gate Out' ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'
                    }`}>
                      {mov.type === 'Gate In' ? <LogIn size={32} strokeWidth={1} /> : 
                       mov.type === 'Gate Out' ? <LogOut size={32} strokeWidth={1} /> : <Move size={32} strokeWidth={1} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold">{mov.plate}</span>
                        <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-black/5 text-black/40">
                          {mov.id}
                        </span>
                      </div>
                      <h5 className="text-lg font-semibold tracking-tight">{mov.type}</h5>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-1">{mov.timestamp} • {mov.status}</div>
                    </div>
                  </div>
                  <button className="p-4 text-black/20 hover:text-accent transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'walkin' && (
            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <h5 className="text-xl font-bold tracking-tight mb-8">Manual Vehicle Entry</h5>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Number Plate</label>
                  <input 
                    type="text" 
                    placeholder="e.g. MH 12 AB 1234"
                    className="w-full p-4 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Customer Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter name"
                    className="w-full p-4 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-accent transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Vehicle Model</label>
                  <select className="w-full p-4 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-accent transition-all appearance-none">
                    <option>Nexon EV</option>
                    <option>Harrier</option>
                    <option>Safari</option>
                    <option>Tiago EV</option>
                    <option>Punch EV</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Entry Type</label>
                  <select className="w-full p-4 bg-surface border border-border rounded-xl text-sm font-medium focus:outline-none focus:border-accent transition-all appearance-none">
                    <option>Service</option>
                    <option>Repair</option>
                    <option>Body Shop</option>
                    <option>Washing</option>
                  </select>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button className="flex-1 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-sm">
                  Register Entry
                </button>
                <button 
                  onClick={() => setActiveTab('appointments')}
                  className="flex-1 py-4 bg-black/5 text-black/40 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-10">
          <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Scan size={24} className="text-white" />
              </div>
              <div>
                <h5 className="text-lg font-bold tracking-tight">Plate Recognition</h5>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">AI-Powered OCR</p>
              </div>
            </div>
            {scannedPlate ? (
              <div className="space-y-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-2">Last Scanned</div>
                  <div className="text-3xl font-bold tracking-tighter">{scannedPlate}</div>
                </div>
                <div className="p-6 bg-success/10 rounded-2xl border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={12} className="text-success" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-success">Appointment Found</span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed">Mandar Joshi (Nexon EV) is scheduled for 11:00 AM.</p>
                </div>
                <button 
                  onClick={() => setScannedPlate('')}
                  className="w-full py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all"
                >
                  Clear & Scan Next
                </button>
              </div>
            ) : (
              <div className="aspect-square bg-white/5 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center p-8">
                <Scan size={48} className="text-white/10 mb-4" />
                <p className="text-xs text-white/40 font-medium leading-relaxed">Position vehicle plate within the camera frame for automatic recognition.</p>
              </div>
            )}
          </div>

          <div className="bg-surface p-10 rounded-[2.5rem] border border-border">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Security Alerts</h5>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5" />
                <div>
                  <div className="text-xs font-bold mb-1">Unrecognized Entry</div>
                  <p className="text-[10px] text-black/40 font-medium leading-relaxed">Vehicle MH 15 EF 9012 entered without appointment.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5" />
                <div>
                  <div className="text-xs font-bold mb-1">Internal Movement Delay</div>
                  <p className="text-[10px] text-black/40 font-medium leading-relaxed">VIN ...56 has been in transit to Bay 04 for 15 mins.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeadOfCustomerCareView() {
  const [selectedKpi, setSelectedKpi] = useState('csat');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const bscKpis = [
    // Customer Perspective
    { id: 'csat', perspective: 'Customer', label: 'CSAT', value: '4.6', target: '4.8', unit: '/5', trend: '+0.2', icon: Smile, color: 'text-success', comparison: '+4.3%' },
    { id: 'nps', perspective: 'Customer', label: 'NPS', value: '72', target: '75', unit: '', trend: '+5', icon: TrendingUp, color: 'text-accent', comparison: '+7.4%' },
    { id: 'repeat', perspective: 'Customer', label: 'Repeat Complaints', value: '4.2%', target: '3.0%', unit: '', trend: '-0.8%', icon: AlertCircle, color: 'text-amber-500', comparison: '-16%' },
    
    // Internal Process Perspective
    { id: 'res_rate', perspective: 'Internal Process', label: 'Resolution Rate', value: '99.1%', target: '99.5%', unit: '', trend: '+0.5%', icon: CheckCircle2, color: 'text-success', comparison: '+0.5%' },
    { id: 'res_time', perspective: 'Internal Process', label: 'Avg Res Time', value: '2.4d', target: '2.0d', unit: '', trend: '-0.3d', icon: Clock, color: 'text-blue-500', comparison: '-11%' },
    { id: 'ftr', perspective: 'Internal Process', label: 'First Time Right', value: '88%', target: '92%', unit: '', trend: '+2%', icon: Zap, color: 'text-accent', comparison: '+2.3%' },

    // Financial Perspective
    { id: 'cptv', perspective: 'Financial', label: 'CPTV', value: '₹14.2k', target: '₹12.5k', unit: '', trend: '-₹1.2k', icon: LayoutDashboard, color: 'text-blue-500', comparison: '-7.8%' },
    { id: 'warranty', perspective: 'Financial', label: 'Warranty Cost', value: '₹2.4Cr', target: '₹2.1Cr', unit: '', trend: '+₹15L', icon: FileText, color: 'text-red-500', comparison: '+6.6%' },

    // Learning & Growth Perspective
    { id: 'training', perspective: 'Learning & Growth', label: 'Training Comp.', value: '94%', target: '100%', unit: '', trend: '+4%', icon: GraduationCap, color: 'text-success', comparison: '+4.4%' },
    { id: 'skill', perspective: 'Learning & Growth', label: 'Skill Index', value: '8.2', target: '9.0', unit: '/10', trend: '+0.5', icon: Activity, color: 'text-accent', comparison: '+6.5%' },
  ];

  const perspectives = ['Customer', 'Internal Process', 'Financial', 'Learning & Growth'];

  const zonalData: Record<string, any[]> = {
    csat: [
      { zone: 'North', value: 4.8, status: 'Top Performing', color: 'bg-success', complaints: 120 },
      { zone: 'North Central', value: 4.6, status: 'Stable', color: 'bg-blue-400', complaints: 210 },
      { zone: 'Central', value: 4.5, status: 'Stable', color: 'bg-blue-500', complaints: 340 },
      { zone: 'West', value: 4.4, status: 'Stable', color: 'bg-indigo-500', complaints: 280 },
      { zone: 'South', value: 4.2, status: 'At Risk', color: 'bg-amber-500', complaints: 450 },
      { zone: 'East', value: 3.9, status: 'Critical', color: 'bg-red-500', complaints: 330 },
    ],
    nps: [
      { zone: 'North', value: 78, status: 'Exceeding', color: 'bg-success', complaints: 110 },
      { zone: 'North Central', value: 75, status: 'On Track', color: 'bg-blue-400', complaints: 180 },
      { zone: 'Central', value: 74, status: 'On Track', color: 'bg-blue-500', complaints: 320 },
      { zone: 'West', value: 72, status: 'On Track', color: 'bg-indigo-500', complaints: 250 },
      { zone: 'South', value: 68, status: 'Below Target', color: 'bg-amber-500', complaints: 480 },
      { zone: 'East', value: 65, status: 'Critical', color: 'bg-red-500', complaints: 350 },
    ],
    res_rate: [
      { zone: 'North', value: 99.8, status: 'Perfect', color: 'bg-success', complaints: 105 },
      { zone: 'North Central', value: 99.4, status: 'Stable', color: 'bg-blue-400', complaints: 190 },
      { zone: 'Central', value: 99.2, status: 'Stable', color: 'bg-blue-500', complaints: 335 },
      { zone: 'West', value: 98.9, status: 'Stable', color: 'bg-indigo-500', complaints: 260 },
      { zone: 'South', value: 98.5, status: 'Warning', color: 'bg-amber-500', complaints: 460 },
      { zone: 'East', value: 97.2, status: 'Critical', color: 'bg-red-500', complaints: 345 },
    ],
    cptv: [
      { zone: 'North', value: 12.1, status: 'Efficient', color: 'bg-success', complaints: 115 },
      { zone: 'North Central', value: 12.8, status: 'Efficient', color: 'bg-blue-400', complaints: 200 },
      { zone: 'Central', value: 13.8, status: 'Stable', color: 'bg-blue-500', complaints: 330 },
      { zone: 'West', value: 14.2, status: 'Stable', color: 'bg-indigo-500', complaints: 270 },
      { zone: 'South', value: 15.4, status: 'High Cost', color: 'bg-amber-500', complaints: 470 },
      { zone: 'East', value: 16.2, status: 'Critical', color: 'bg-red-500', complaints: 340 },
    ],
    res_time: [
      { zone: 'North', value: 1.8, status: 'Fast', color: 'bg-success', complaints: 108 },
      { zone: 'North Central', value: 2.0, status: 'Fast', color: 'bg-blue-400', complaints: 195 },
      { zone: 'Central', value: 2.2, status: 'Stable', color: 'bg-blue-500', complaints: 325 },
      { zone: 'West', value: 2.5, status: 'Stable', color: 'bg-indigo-500', complaints: 265 },
      { zone: 'South', value: 2.9, status: 'Delayed', color: 'bg-amber-500', complaints: 455 },
      { zone: 'East', value: 3.4, status: 'Critical', color: 'bg-red-500', complaints: 335 },
    ],
    repeat: [
      { zone: 'North', value: 2.8, status: 'Low', color: 'bg-success', complaints: 112 },
      { zone: 'North Central', value: 3.2, status: 'Low', color: 'bg-blue-400', complaints: 205 },
      { zone: 'Central', value: 3.9, status: 'Stable', color: 'bg-blue-500', complaints: 338 },
      { zone: 'West', value: 4.2, status: 'Stable', color: 'bg-indigo-500', complaints: 275 },
      { zone: 'South', value: 5.1, status: 'High', color: 'bg-amber-500', complaints: 465 },
      { zone: 'East', value: 6.2, status: 'Critical', color: 'bg-red-500', complaints: 342 },
    ],
    ftr: [
      { zone: 'North', value: 92, status: 'Target Met', color: 'bg-success', complaints: 100 },
      { zone: 'North Central', value: 90, status: 'Target Met', color: 'bg-blue-400', complaints: 185 },
      { zone: 'Central', value: 88, status: 'Stable', color: 'bg-blue-500', complaints: 310 },
      { zone: 'West', value: 87, status: 'Stable', color: 'bg-indigo-500', complaints: 255 },
      { zone: 'South', value: 85, status: 'Warning', color: 'bg-amber-500', complaints: 440 },
      { zone: 'East', value: 82, status: 'Critical', color: 'bg-red-500', complaints: 320 },
    ],
    warranty: [
      { zone: 'North', value: 1.8, status: 'Efficient', color: 'bg-success', complaints: 110 },
      { zone: 'North Central', value: 2.0, status: 'Efficient', color: 'bg-blue-400', complaints: 190 },
      { zone: 'Central', value: 2.2, status: 'Stable', color: 'bg-blue-500', complaints: 320 },
      { zone: 'West', value: 2.4, status: 'Stable', color: 'bg-indigo-500', complaints: 260 },
      { zone: 'South', value: 2.8, status: 'High', color: 'bg-amber-500', complaints: 450 },
      { zone: 'East', value: 3.2, status: 'Critical', color: 'bg-red-500', complaints: 330 },
    ],
    training: [
      { zone: 'North', value: 98, status: 'Exceeding', color: 'bg-success', complaints: 100 },
      { zone: 'North Central', value: 96, status: 'Exceeding', color: 'bg-blue-400', complaints: 180 },
      { zone: 'Central', value: 95, status: 'On Track', color: 'bg-blue-500', complaints: 300 },
      { zone: 'West', value: 94, status: 'On Track', color: 'bg-indigo-500', complaints: 250 },
      { zone: 'South', value: 92, status: 'Stable', color: 'bg-amber-500', complaints: 420 },
      { zone: 'East', value: 88, status: 'Below Target', color: 'bg-red-500', complaints: 310 },
    ],
    skill: [
      { zone: 'North', value: 8.8, status: 'High', color: 'bg-success', complaints: 105 },
      { zone: 'North Central', value: 8.5, status: 'High', color: 'bg-blue-400', complaints: 190 },
      { zone: 'Central', value: 8.2, status: 'Stable', color: 'bg-blue-500', complaints: 315 },
      { zone: 'West', value: 8.0, status: 'Stable', color: 'bg-indigo-500', complaints: 260 },
      { zone: 'South', value: 7.8, status: 'Warning', color: 'bg-amber-500', complaints: 435 },
      { zone: 'East', value: 7.2, status: 'Critical', color: 'bg-red-500', complaints: 325 },
    ],
  };

  const selectedKpiData = bscKpis.find(k => k.id === selectedKpi);

  const momTrendData = {
    csat: [
      { month: 'Oct', val: 4.2 }, { month: 'Nov', val: 4.3 }, { month: 'Dec', val: 4.5 }, { month: 'Jan', val: 4.4 }, { month: 'Feb', val: 4.6 }
    ],
    nps: [
      { month: 'Oct', val: 62 }, { month: 'Nov', val: 65 }, { month: 'Dec', val: 68 }, { month: 'Jan', val: 70 }, { month: 'Feb', val: 72 }
    ],
    repeat: [
      { month: 'Oct', val: 5.8 }, { month: 'Nov', val: 5.4 }, { month: 'Dec', val: 4.9 }, { month: 'Jan', val: 4.5 }, { month: 'Feb', val: 4.2 }
    ],
    res_rate: [
      { month: 'Oct', val: 97.5 }, { month: 'Nov', val: 98.2 }, { month: 'Dec', val: 98.8 }, { month: 'Jan', val: 99.0 }, { month: 'Feb', val: 99.1 }
    ],
    res_time: [
      { month: 'Oct', val: 3.2 }, { month: 'Nov', val: 2.9 }, { month: 'Dec', val: 2.7 }, { month: 'Jan', val: 2.5 }, { month: 'Feb', val: 2.4 }
    ],
    ftr: [
      { month: 'Oct', val: 82 }, { month: 'Nov', val: 84 }, { month: 'Dec', val: 85 }, { month: 'Jan', val: 87 }, { month: 'Feb', val: 88 }
    ],
    cptv: [
      { month: 'Oct', val: 16.5 }, { month: 'Nov', val: 15.8 }, { month: 'Dec', val: 15.2 }, { month: 'Jan', val: 14.8 }, { month: 'Feb', val: 14.2 }
    ],
    warranty: [
      { month: 'Oct', val: 1.9 }, { month: 'Nov', val: 2.1 }, { month: 'Dec', val: 2.3 }, { month: 'Jan', val: 2.5 }, { month: 'Feb', val: 2.4 }
    ],
    training: [
      { month: 'Oct', val: 85 }, { month: 'Nov', val: 88 }, { month: 'Dec', val: 90 }, { month: 'Jan', val: 92 }, { month: 'Feb', val: 94 }
    ],
    skill: [
      { month: 'Oct', val: 7.2 }, { month: 'Nov', val: 7.5 }, { month: 'Dec', val: 7.8 }, { month: 'Jan', val: 8.0 }, { month: 'Feb', val: 8.2 }
    ],
  };

  return (
    <div className="space-y-16">
      {/* Balanced Scorecard (BSC) Perspectives */}
      <div className="space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Balanced Scorecard</h3>
            <p className="text-sm text-black/60 mt-1">Strategic performance across all perspectives</p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-surface p-1 rounded-xl border border-border">
              {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    timeRange === range ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <span className="bg-surface border border-border px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center">FY 2025-26</span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {perspectives.map((perspective) => (
            <div key={perspective} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-accent rounded-full" />
                <h4 className="text-[11px] font-bold text-black uppercase tracking-[0.15em]">{perspective} Perspective</h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bscKpis.filter(k => k.perspective === perspective).map((kpi) => (
                  <button 
                    key={kpi.id} 
                    onClick={() => setSelectedKpi(kpi.id)}
                    className={`p-5 rounded-[2rem] border transition-all text-left group relative overflow-hidden ${
                      selectedKpi === kpi.id 
                        ? 'bg-black text-white border-black shadow-xl scale-[1.02]' 
                        : 'bg-white border-border hover:border-accent shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-xl ${selectedKpi === kpi.id ? 'bg-white/10 text-white' : 'bg-surface ' + kpi.color}`}>
                        <kpi.icon size={14} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                        selectedKpi === kpi.id ? 'bg-white/20 text-white' : 'bg-success/10 text-success'
                      }`}>
                        {kpi.comparison}
                      </span>
                    </div>
                    <div className={`text-[11px] font-bold uppercase tracking-widest mb-2 ${
                      selectedKpi === kpi.id ? 'text-white/60' : 'text-black/60'
                    }`}>{kpi.label}</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold tracking-tight">{kpi.value}</span>
                      <span className={`text-[10px] font-medium ${selectedKpi === kpi.id ? 'text-white/40' : 'text-black/30'}`}>{kpi.unit}</span>
                    </div>
                    <div className={`mt-4 pt-4 border-t ${selectedKpi === kpi.id ? 'border-white/10' : 'border-black/5'}`}>
                      <div className={`text-[9px] font-bold uppercase tracking-widest ${selectedKpi === kpi.id ? 'text-white/30' : 'text-black/20'}`}>
                        Target: <span className={selectedKpi === kpi.id ? 'text-white/60' : 'text-black/60'}>{kpi.target}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Month-on-Month Trends Section */}
      <div className="space-y-12 pt-16 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Month-on-Month Trends</h3>
            <p className="text-sm text-black/40 mt-1">Comparative performance trajectory for all KPIs</p>
          </div>
          <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Download Trend Report</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {bscKpis.map((kpi) => (
            <div key={kpi.id} className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm hover:border-accent transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-surface ${kpi.color}`}>
                    <kpi.icon size={14} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-widest text-black/60">{kpi.label}</div>
                </div>
                <div className="text-[10px] font-bold text-success uppercase tracking-widest">{kpi.trend}</div>
              </div>
              
              <div className="h-24 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={momTrendData[kpi.id as keyof typeof momTrendData]}>
                    <defs>
                      <linearGradient id={`color-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={kpi.color.includes('success') ? '#22c55e' : kpi.color.includes('accent') ? '#141414' : '#3b82f6'} stopOpacity={0.1}/>
                        <stop offset="95%" stopColor={kpi.color.includes('success') ? '#22c55e' : kpi.color.includes('accent') ? '#141414' : '#3b82f6'} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke={kpi.color.includes('success') ? '#22c55e' : kpi.color.includes('accent') ? '#141414' : '#3b82f6'} 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill={`url(#color-${kpi.id})`} 
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-xl">
                              {payload[0].value}{kpi.unit}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-2xl font-bold tracking-tight">{kpi.value}</div>
                  <div className="text-[9px] font-bold text-black/20 uppercase tracking-widest">Current Value</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-black/40">{kpi.target}</div>
                  <div className="text-[9px] font-bold text-black/20 uppercase tracking-widest">Target</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 pt-8 border-t border-border">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-tight">Zonal Deep Dive: {selectedKpiData?.label}</h3>
                <p className="text-xs text-black/40 mt-1">Performance breakdown across all operating zones</p>
              </div>
              <div className="flex gap-4">
                <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Export Data</button>
                <button className="text-[10px] font-bold text-accent uppercase tracking-widest hover:underline">Interactive Map</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {zonalData[selectedKpi]?.map((zone, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-white p-8 rounded-[2.5rem] border border-border hover:border-accent transition-all group shadow-sm"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl ${zone.color}/10 flex items-center justify-center text-current`}>
                        <MapPin size={20} className={zone.color.replace('bg-', 'text-')} />
                      </div>
                      <div>
                        <div className="text-lg font-semibold tracking-tight">{zone.zone}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest opacity-40">{zone.status}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold tracking-tighter">{zone.value}{selectedKpiData?.unit}</div>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">{selectedKpiData?.label}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-black/40">Performance Index</span>
                      <span className={zone.value >= parseFloat(selectedKpiData?.target || '0') ? 'text-success' : 'text-red-500'}>
                        {((zone.value / parseFloat(selectedKpiData?.target || '1')) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                      <div className={`h-full ${zone.color} transition-all duration-1000`} style={{ width: `${Math.min((zone.value / parseFloat(selectedKpiData?.target || '1')) * 100, 100)}%` }} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <ComplaintsSection role="Head of Customer Care" />
        </div>

        {/* Dynamic Action Insights */}
        <div className="space-y-10">
          <div className="bg-accent text-white p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap size={120} strokeWidth={1} />
            </div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10 relative z-10">Strategic Insights: {selectedKpiData?.label}</h4>
            <div className="space-y-10 relative z-10">
              {selectedKpi === 'csat' && (
                <>
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Critical Alert</div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      <strong>Zone 4 (East)</strong> CSAT has dropped to 3.9. Sentiment analysis points to <strong>Service Delay</strong> as the primary cause.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                      Deploy Support Team
                    </button>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <TrendingUp size={14} className="text-success" />
                      <div className="text-[10px] text-success font-bold uppercase tracking-widest">Best Practice</div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      <strong>Zone 1</strong> maintains 4.8 CSAT. Their <strong>'Proactive Communication'</strong> model is ready for national rollout.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                      View Rollout Plan
                    </button>
                  </div>
                </>
              )}
              {selectedKpi === 'cptv' && (
                <>
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={14} className="text-amber-400" />
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Cost Warning</div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      <strong>Zone 4</strong> CPTV is 30% above national average. High <strong>Repeat Visit</strong> rate is driving costs up.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                      Audit Zone 4 Workshops
                    </button>
                  </div>
                  <div className="group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap size={14} className="text-success" />
                      <div className="text-[10px] text-success font-bold uppercase tracking-widest">Efficiency Gain</div>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed mb-4">
                      <strong>Zone 1</strong> has reduced CPTV by 12% using <strong>Remote Diagnostics</strong>. Suggesting wider adoption.
                    </p>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                      Scale Remote Diag
                    </button>
                  </div>
                </>
              )}
              {selectedKpi === 'warranty' && (
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertCircle size={14} className="text-red-400" />
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Budget Overrun</div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    Warranty costs in <strong>Zone 4</strong> have spiked by 15%. AI identifies <strong>Fuel Pump</strong> failures as the primary driver.
                  </p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                    Issue National TSB
                  </button>
                </div>
              )}
              {selectedKpi !== 'csat' && selectedKpi !== 'cptv' && selectedKpi !== 'warranty' && (
                <div className="group cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <Info size={14} className="text-blue-400" />
                    <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">General Insight</div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">
                    National trend for <strong>{selectedKpiData?.label}</strong> is positive. Zone 1 continues to lead while Zone 4 requires strategic intervention.
                  </p>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                    Download Full Analysis
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* National Trend Chart */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">National {selectedKpiData?.label} Trend</h4>
              <span className="text-[10px] font-bold text-success uppercase tracking-widest">Trending Up</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Oct', val: 82 },
                  { month: 'Nov', val: 85 },
                  { month: 'Dec', val: 89 },
                  { month: 'Jan', val: 87 },
                  { month: 'Feb', val: 92 },
                ]}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#141414" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#141414" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  />
                  <Area type="monotone" dataKey="val" stroke="#141414" fillOpacity={1} fill="url(#colorVal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoneCCMView() {
  const zones = Object.keys(ZONE_REGION_MAPPING) as (keyof typeof ZONE_REGION_MAPPING)[];
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Zone CCM Dashboard</h3>
          <p className="text-sm text-black/60 font-medium">Managing {zones.length} Zones across India</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {zones.map((zone) => (
          <div key={zone} className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm hover:border-accent transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-bold">{zone} Zone</h4>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">{ZONE_REGION_MAPPING[zone].length} Regional CCMs</p>
              </div>
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-2xl border border-border">
                <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">CSAT</div>
                <div className="text-xl font-bold">4.{Math.floor(Math.random() * 9)}</div>
              </div>
              <div className="p-4 bg-surface rounded-2xl border border-border">
                <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">CPTV</div>
                <div className="text-xl font-bold">₹12k</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionalCCMView() {
  const [selectedZone, setSelectedZone] = useState<keyof typeof ZONE_REGION_MAPPING>('North');
  const [selectedRegion, setSelectedRegion] = useState('North 1');
  
  const zones = Object.keys(ZONE_REGION_MAPPING) as (keyof typeof ZONE_REGION_MAPPING)[];
  const regionsForZone = ZONE_REGION_MAPPING[selectedZone];

  useEffect(() => {
    if (!regionsForZone.includes(selectedRegion)) {
      setSelectedRegion(regionsForZone[0]);
    }
  }, [selectedZone, regionsForZone, selectedRegion]);
  
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Regional CCM Dashboard</h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Zone:</span>
              <select 
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value as any)}
                className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-border rounded-lg px-2 py-1 outline-none focus:border-accent"
              >
                {zones.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Region:</span>
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-border rounded-lg px-2 py-1 outline-none focus:border-accent"
              >
                {regionsForZone.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[selectedRegion].map((region) => (
          <div key={region} className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm hover:border-accent transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-lg font-bold">{region}</h4>
                <p className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Multiple CCMs</p>
              </div>
              <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                <ChevronRight size={20} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-black/40">Network Health</span>
                <span className="text-success">97.5%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[97%]" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">CCM Performance (Region {selectedRegion})</h4>
            <div className="space-y-4">
              {[
                { name: 'CCM - Rahul', dealerships: 8, csat: 4.8, efficiency: 94 },
                { name: 'CCM - Amit', dealerships: 7, csat: 4.5, efficiency: 88 },
                { name: 'CCM - Priya', dealerships: 8, csat: 4.2, efficiency: 82 },
              ].map((ccm, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-border hover:border-accent transition-all group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-bold text-accent shadow-sm">{ccm.name.split(' - ')[1][0]}</div>
                    <div>
                      <div className="text-sm font-bold group-hover:text-accent transition-colors">{ccm.name}</div>
                      <div className="text-[10px] text-black/40 font-medium tracking-widest uppercase">{ccm.dealerships} Dealerships</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <div className="text-lg font-bold">{ccm.csat}</div>
                      <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Avg CSAT</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{ccm.efficiency}%</div>
                      <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Efficiency</div>
                    </div>
                    <ChevronRight size={16} className="text-black/10 group-hover:text-accent transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <ComplaintsSection role="Regional CCM" />
        </div>
      </div>
    </div>
  );
}

function CCMView() {
  const [selectedRegion, setSelectedRegion] = useState('North 1');
  const allRegions = Object.values(ZONE_REGION_MAPPING).flat();

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">CCM Dashboard</h3>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-black/60 font-medium tracking-tight">Managing 8 Dealerships in Region: {selectedRegion}</p>
            <select 
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-border rounded-lg px-2 py-1 outline-none focus:border-accent"
            >
              {allRegions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">Schedule Dealer Visit</button>
          <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-sm">Review Open Complaints</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Dealership Performance Matrix</h4>
            <div className="space-y-4">
              {['Pune Central', 'Mumbai West', 'Delhi North', 'Bangalore East', 'Chennai South', 'Kolkata East', 'Ahmedabad West', 'Hyderabad Central'].map((dealer, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-border hover:border-accent transition-all group cursor-pointer">
                  <div className="flex items-center gap-6">
                    <div className={`w-3 h-3 rounded-full ${i % 3 === 0 ? 'bg-success' : i % 3 === 1 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    <div>
                      <div className="text-sm font-bold group-hover:text-accent transition-colors">{dealer}</div>
                      <div className="text-[10px] text-black/40 font-medium tracking-widest uppercase">Last Visit: {i + 2} days ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <div className="text-right">
                      <div className="text-lg font-bold">9{i}%</div>
                      <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Efficiency</div>
                    </div>
                    <ChevronRight size={16} className="text-black/10 group-hover:text-accent transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Critical Escalations</h4>
            <div className="space-y-4">
              <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                <div className="text-xs font-bold mb-1">VIN ...5678: Repeat Repair</div>
                <p className="text-[10px] text-red-900/60 leading-relaxed mb-3">3rd attempt for suspension noise at Pune Central. Customer threatening social media escalation.</p>
                <button className="w-full py-2 bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">Intervene Now</button>
              </div>
            </div>
          </div>
          <ComplaintsSection role="CCM" />
        </div>
      </div>
    </div>
  );
}

function ServiceTechnicalSupportView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Service Tech & Training Head</h3>
          <p className="text-sm text-black/60 font-medium">National Technical Readiness & Skill Index</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">National Skill Matrix Coverage</h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { zone: 'North', skilled: 88, training: 12 },
                  { zone: 'West', skilled: 92, training: 8 },
                  { zone: 'South', skilled: 85, training: 15 },
                  { zone: 'East', skilled: 78, training: 22 },
                  { zone: 'Central', skilled: 82, training: 18 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="skilled" stackId="a" fill="#141414" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="training" stackId="a" fill="#F0F0F0" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Training Head Status</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold">Sunil Gavaskar</div>
                  <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Training Head</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">LMS Engagement</span>
                  <span>88%</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[88%]" />
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Command Centre Status</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/40">
                  <Monitor size={24} />
                </div>
                <div>
                  <div className="text-sm font-bold">Capt. Vikram Batra</div>
                  <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Command Centre Head</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">Real-time Monitoring</span>
                  <span className="text-success">ACTIVE</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-success w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Technical Escalations</h4>
            <div className="space-y-4">
              <div className="p-5 bg-surface rounded-2xl border border-border">
                <div className="text-xs font-bold mb-1">EV Battery Thermal Runaway Risk</div>
                <p className="text-[10px] text-black/40 leading-relaxed mb-3">Detected in 3 vehicles in West Zone. Immediate technical bulletin required.</p>
                <button className="w-full py-2 bg-black text-white text-[9px] font-bold uppercase tracking-widest rounded-lg">Issue Bulletin</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrainingHeadView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Training Head Dashboard</h3>
          <p className="text-sm text-black/60 font-medium">LMS Engagement & Certification Pipeline</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
          <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Certification Trends</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { month: 'Oct', certs: 120 },
                { month: 'Nov', certs: 150 },
                { month: 'Dec', certs: 180 },
                { month: 'Jan', certs: 160 },
                { month: 'Feb', certs: 210 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Area type="monotone" dataKey="certs" stroke="#141414" fill="#141414" fillOpacity={0.05} strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
          <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Pending Certifications</h4>
          <div className="space-y-4">
            {['EV Advanced Diagnostics', 'High Voltage Safety', 'Customer Experience 2.0'].map((course, i) => (
              <div key={i} className="p-4 bg-surface rounded-xl border border-border">
                <div className="text-xs font-bold mb-1">{course}</div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-black/40">
                  <span>{45 + i * 10} Technicians</span>
                  <span className="text-accent">Due in 4d</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandCentreHeadView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Command Centre Operations</h3>
          <p className="text-sm text-black/60 font-medium">Real-time Network Monitoring & Response</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-success/10 text-success rounded-full text-[10px] font-bold uppercase tracking-widest">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" /> Live Monitoring Active
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-black p-10 rounded-[2.5rem] border border-white/10 shadow-2xl text-white">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Global Incident Map</h4>
            <div className="flex gap-4">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">4 Critical</span>
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">12 Warning</span>
            </div>
          </div>
          <div className="aspect-video bg-white/5 rounded-3xl border border-white/10 relative overflow-hidden">
            <img src="https://picsum.photos/seed/commandmap/1200/600" alt="Command Map" className="w-full h-full object-cover opacity-20 grayscale invert" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute top-1/4 left-1/3" />
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute bottom-1/3 right-1/4" />
            </div>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
          <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Active Incidents</h4>
          <div className="space-y-4">
            {[
              { id: 'INC-992', type: 'System', msg: 'LMS Server Latency in East Zone', time: '2m ago' },
              { id: 'INC-993', type: 'Network', msg: 'Pune Central Workshop Offline', time: '5m ago' },
              { id: 'INC-994', type: 'Safety', msg: 'HV Battery Alert - VIN ...90', time: '12m ago' },
            ].map((inc, i) => (
              <div key={i} className="p-4 bg-surface rounded-xl border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] font-bold text-accent uppercase tracking-widest">{inc.type}</span>
                  <span className="text-[9px] text-black/20 font-bold uppercase tracking-widest">{inc.time}</span>
                </div>
                <div className="text-xs font-bold mb-1">{inc.msg}</div>
                <div className="text-[9px] text-black/40 font-medium">{inc.id}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SparesHeadView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Spares & Revenue Head</h3>
          <p className="text-sm text-black/60 font-medium">National Inventory & Spare Parts Revenue</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
          <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Spare Revenue Trend (National)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { month: 'Oct', revenue: 38 },
                { month: 'Nov', revenue: 42 },
                { month: 'Dec', revenue: 45 },
                { month: 'Jan', revenue: 41 },
                { month: 'Feb', revenue: 48 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                <YAxis hide />
                <Bar dataKey="revenue" fill="#141414" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-6">Order Processing Status</h4>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center text-black/40">
                <Package size={24} />
              </div>
              <div>
                <div className="text-sm font-bold">Suresh Prabhu</div>
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Order Processing Mgr</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-black/40">Fulfillment Rate</span>
                <span>98.2%</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[98%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderProcessingView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">Order Processing & Spare Revenue</h3>
          <p className="text-sm text-black/60 font-medium">Warehouse Efficiency & National Spare Revenue Pipeline</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Active Order Pipeline</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Pending Approval', count: 142, status: 'warning' },
                { label: 'In Picking', count: 85, status: 'processing' },
                { label: 'Ready for Dispatch', count: 210, status: 'success' },
              ].map((stat, i) => (
                <div key={i} className="p-8 bg-surface rounded-3xl border border-border">
                  <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">{stat.label}</div>
                  <div className="text-4xl font-bold mb-2">{stat.count}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${
                    stat.status === 'success' ? 'text-success' : stat.status === 'warning' ? 'text-amber-500' : 'text-accent'
                  }`}>
                    {stat.status === 'processing' ? 'Accelerating' : 'On Track'}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Spare Revenue Contribution</h4>
            <div className="space-y-6">
              {[
                { zone: 'North', revenue: '₹1.2Cr', percent: 85, color: 'bg-success' },
                { zone: 'West', revenue: '₹0.9Cr', percent: 72, color: 'bg-blue-500' },
                { zone: 'South', revenue: '₹1.1Cr', percent: 78, color: 'bg-indigo-500' },
                { zone: 'East', revenue: '₹0.6Cr', percent: 45, color: 'bg-red-500' },
              ].map((z, i) => (
                <div key={i}>
                  <RevenueItem label={z.zone} value={z.revenue} percent={z.percent} color={z.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-10">
          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-sm">
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-8">Logistics Alerts</h4>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-xs font-bold mb-1">Stock-out Risk: Brake Pads</div>
                <p className="text-[10px] text-white/40 leading-relaxed mb-3">Inventory in North Warehouse below safety threshold. Re-order triggered.</p>
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-bold text-amber-500 uppercase tracking-widest">High Priority</span>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">2h ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeadQuartersView() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-semibold tracking-tight">HQ Operations Dashboard</h3>
          <p className="text-sm text-black/60 font-medium">Complaints, RSA & Network Expansion Performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Complaints Performance (National)</h4>
            <div className="grid grid-cols-3 gap-8 mb-10">
              <div className="p-6 bg-surface rounded-2xl border border-border">
                <div className="text-[9px] font-bold text-black/20 uppercase tracking-widest mb-2">Call Centre</div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-[8px] text-success font-bold uppercase tracking-widest mt-1">Resolution Rate</div>
              </div>
              <div className="p-6 bg-surface rounded-2xl border border-border">
                <div className="text-[9px] font-bold text-black/20 uppercase tracking-widest mb-2">Social Media</div>
                <div className="text-2xl font-bold">88%</div>
                <div className="text-[8px] text-amber-500 font-bold uppercase tracking-widest mt-1">Sentiment Index</div>
              </div>
              <div className="p-6 bg-surface rounded-2xl border border-border">
                <div className="text-[9px] font-bold text-black/20 uppercase tracking-widest mb-2">Escalated</div>
                <div className="text-2xl font-bold">12</div>
                <div className="text-[8px] text-red-500 font-bold uppercase tracking-widest mt-1">Active High-Priority</div>
              </div>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { day: 'Mon', call: 92, social: 85 },
                  { day: 'Tue', call: 94, social: 88 },
                  { day: 'Wed', call: 91, social: 82 },
                  { day: 'Thu', call: 96, social: 90 },
                  { day: 'Fri', call: 95, social: 89 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="call" stroke="#141414" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="social" stroke="#141414" strokeWidth={3} strokeDasharray="5 5" dot={false} opacity={0.3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">RSA Performance</h4>
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold tracking-tight">18.2m</div>
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Avg Response Time</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold text-success">96.4%</div>
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">SLA Compliance</div>
              </div>
            </div>
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent w-[96%]" />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Network Expansion</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">Active Projects</div>
                <span className="text-xs font-bold text-accent">4 New Dealers</span>
              </div>
              <div className="space-y-4">
                {[
                  { city: 'Kolhapur', progress: 85, zone: 'West' },
                  { city: 'Gwalior', progress: 42, zone: 'Central' },
                  { city: 'Mysore', progress: 12, zone: 'South' },
                ].map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-black/60">{p.city} ({p.zone})</span>
                      <span>{p.progress}%</span>
                    </div>
                    <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                      <div className="h-full bg-black/20" style={{ width: `${p.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all">Expansion Roadmap</button>
            </div>
          </div>
          <ComplaintsSection role="Head Quarters" />
        </div>
      </div>
    </div>
  );
}

function OEMView({ level }: { level: string }) {
  const [activeTab, setActiveTab] = useState('fleet');
  const [selectedKpi, setSelectedKpi] = useState('cptv');
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  
  const kpis = [
    { id: 'cptv', label: 'CPTV', value: '₹12,450', trend: 'down', target: '₹11,500', comparison: '-4.2%' },
    { id: 'warranty', label: 'Warranty %', value: '2.4%', trend: 'up', target: '2.0%', comparison: '+0.3%' },
    { id: 'csat', label: 'CSAT', value: '4.8', trend: 'up', target: '4.5', comparison: '+0.2' },
    { id: 'nps', label: 'NPS', value: '72', trend: 'up', target: '75', comparison: '+5' },
  ];

  const tabs = [
    { id: 'fleet', label: 'Fleet Intelligence', icon: Truck },
    { id: 'warranty', label: 'Warranty & Cost', icon: ShieldCheck },
    { id: 'product', label: 'Product Feedback', icon: Zap },
    { id: 'network', label: 'Network Governance', icon: LayoutDashboard },
  ];

  return (
    <div className="space-y-12">
      {/* Header & KPI Bar */}
      <div className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-4xl font-semibold tracking-tight">{level} Dashboard</h3>
            <p className="text-sm text-black/60 font-medium">Phase 4: Cross-Program Intelligence & Autonomous Governance</p>
          </div>
          <div className="flex gap-4">
            <div className="flex bg-surface p-1 rounded-xl border border-border">
              {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    timeRange === range ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button 
              onClick={() => alert('Generating MD-Ready Board Pack...')}
              className="px-6 py-3 bg-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all flex items-center gap-2"
            >
              <FileText size={14} /> Generate Board Pack
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-sm">Trigger OTA Campaign</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <button 
              key={kpi.id}
              onClick={() => setSelectedKpi(kpi.id)}
              className={`p-6 rounded-3xl border transition-all text-left group relative overflow-hidden ${
                selectedKpi === kpi.id ? 'bg-white border-accent shadow-md' : 'bg-surface border-transparent hover:border-border'
              }`}
            >
              <div className={`text-[11px] font-bold uppercase tracking-[0.1em] mb-4 transition-colors ${
                selectedKpi === kpi.id ? 'text-accent' : 'text-black/60'
              }`}>{kpi.label}</div>
              <div className="flex items-end justify-between mb-4">
                <div className="text-3xl font-bold tracking-tight text-black">{kpi.value}</div>
                <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${
                  kpi.trend === 'up' ? 'bg-success/10 text-success' : 'bg-accent/10 text-accent'
                }`}>
                  {kpi.comparison}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Target: <span className="text-black/60">{kpi.target}</span></div>
                <div className="h-1 w-12 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-black/20 w-3/4" />
                </div>
              </div>
            </button>
          ))}
        </div>

        <GeminiInsight 
          title="OEM Strategic Intelligence"
          model="gemini-3.1-pro-preview"
          compact
          prompt={`Analyze the current OEM KPIs: CPTV: ₹12,450 (down), Warranty: 2.4% (up), CSAT: 4.8 (up), NPS: 72 (up). 
          Provide a strategic recommendation for the MD focusing on cost optimization and quality control.`}
        />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-surface rounded-2xl border border-border w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {activeTab === 'fleet' && (
            <div className="space-y-12">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">HV Battery Fleet Intelligence Map</h4>
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                      <div className="w-2 h-2 bg-success rounded-full" /> Normal
                    </span>
                    <span className="flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" /> Monitoring
                    </span>
                  </div>
                </div>
                <div className="aspect-[21/9] bg-surface rounded-3xl overflow-hidden relative border border-border">
                  <img src="https://picsum.photos/seed/fleetmap/1200/500" alt="Fleet Map" className="w-full h-full object-cover opacity-30 grayscale" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 p-10 flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-6 w-full">
                      {MOCK_FLEET_HEALTH.map((z, i) => (
                        <div key={i} className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                          <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">{z.zone}</div>
                          <div className="text-2xl font-bold mb-3">{z.health}%</div>
                          <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden mb-4">
                            <div className={`h-full ${z.status === 'success' ? 'bg-success' : 'bg-amber-500'}`} style={{ width: `${z.health}%` }} />
                          </div>
                          {z.failureClustering && (
                            <div className="space-y-2 pt-2 border-t border-black/5">
                              <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Top Cluster</div>
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-semibold truncate max-w-[80px]">{z.failureClustering[0].mode}</span>
                                <span className="text-[10px] font-bold text-red-500">+{z.failureClustering[0].count}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-10">
                <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Early Warning System</h4>
                  <div className="space-y-4">
                    <div className="p-5 bg-red-50 rounded-2xl border border-red-100">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle size={16} className="text-red-500" />
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Critical Cluster</span>
                      </div>
                      <div className="text-xs font-bold mb-1">HV Battery Seal Leakage</div>
                      <div className="text-[10px] text-red-900/60 leading-relaxed">Cluster detected in Nexon EV (Batch B4). Statistical significance reached.</div>
                    </div>
                    <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle size={16} className="text-amber-500" />
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Emerging Mode</span>
                      </div>
                      <div className="text-xs font-bold mb-1">Infotainment Reboot Loop</div>
                      <div className="text-[10px] text-amber-900/60 leading-relaxed">Rising trend in Zone 2. Monitoring for OTA trigger.</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-8">Predictive CPTV Model</h4>
                  <div className="h-40 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { name: 'W1', val: 12000 },
                        { name: 'W2', val: 12450 },
                        { name: 'W3', val: 12800 },
                        { name: 'W4 (P)', val: 13200 },
                        { name: 'W5 (P)', val: 13500 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8 }} />
                        <YAxis hide />
                        <Area type="monotone" dataKey="val" stroke="#141414" fill="#141414" fillOpacity={0.05} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-black/40">90-Day Forecast</span>
                    <span className="text-red-500">+8.5% Δ</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Warranty Fraud Detection</h4>
                  <div className="space-y-4">
                    {[
                      { dealer: 'Mumbai West', risk: 'High', score: 92, reason: 'Part Reuse Signal' },
                      { dealer: 'Delhi North', risk: 'Medium', score: 65, reason: 'Claim Frequency Outlier' },
                      { dealer: 'Bangalore East', risk: 'Low', score: 12, reason: 'Normal Pattern' },
                    ].map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-surface rounded-2xl border border-border">
                        <div className="flex items-center gap-6">
                          <div className={`w-3 h-3 rounded-full ${d.risk === 'High' ? 'bg-red-500' : d.risk === 'Medium' ? 'bg-amber-500' : 'bg-success'}`} />
                          <div>
                            <div className="text-sm font-bold">{d.dealer}</div>
                            <div className="text-[10px] text-black/40 font-medium">{d.reason}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{d.score}</div>
                          <div className="text-[8px] font-bold text-black/20 uppercase tracking-widest">Risk Score</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Auto-Adjudication Engine</h4>
                    <span className="text-[10px] font-bold text-success uppercase tracking-widest">82% Autonomous</span>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-2xl font-bold tracking-tight">₹4.2Cr</div>
                        <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Savings Realized</div>
                      </div>
                      <div className="h-12 w-24">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[{v: 10}, {v: 25}, {v: 15}, {v: 45}, {v: 35}]}>
                            <Area type="monotone" dataKey="v" stroke="#10B981" fill="#10B981" fillOpacity={0.1} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-black/40 uppercase tracking-widest">Straight-Through Processing</span>
                        <span>82%</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                        <div className="h-full bg-success w-[82%]" />
                      </div>
                    </div>
                    <div className="p-5 bg-surface rounded-2xl border border-border">
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-3">Agent Reasoning</div>
                      <p className="text-[11px] leading-relaxed text-black/60 italic">
                        "Claims for <strong>Nexon EV</strong> brake pads are being auto-approved based on historical wear patterns and telematics data correlating with heavy city driving."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'product' && (
            <div className="space-y-12">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">EVP001 DMC Feedback Loop</h4>
                  <div className="flex gap-4">
                    <span className="px-3 py-1 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-lg">Design-Mfg-Customer</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {MOCK_DMC_FEEDBACK.map((f, i) => (
                    <div key={i} className="p-6 bg-surface rounded-2xl border border-border space-y-4">
                      <div className="text-sm font-bold">{f.component}</div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <div className="text-[8px] text-black/20 font-bold uppercase tracking-widest">Actual vs Target</div>
                          <div className="text-lg font-bold">{f.actual} <span className="text-[10px] text-black/40 font-medium">/ {f.target}</span></div>
                        </div>
                        <div className={`text-[10px] font-bold ${f.variance.startsWith('-') ? 'text-success' : 'text-red-500'}`}>
                          {f.variance} Δ
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                        <div className={`h-full ${f.variance.startsWith('-') ? 'bg-success' : 'bg-red-500'}`} style={{ width: '75%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Failure-to-Design Signals</h4>
                <div className="space-y-6">
                  <div className="flex items-start gap-6 p-6 bg-red-50 rounded-2xl border border-red-100">
                    <div className="p-3 bg-red-500 rounded-xl text-white">
                      <Zap size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-bold">Suspension Bushing Premature Wear</div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">High Confidence</span>
                      </div>
                      <p className="text-xs text-red-900/60 leading-relaxed mb-4">
                        Field data shows 15% failure rate at 12k km vs design spec of 40k km. Material analysis suggests thermal degradation in high-humidity zones.
                      </p>
                      <div className="flex gap-4">
                        <button className="px-4 py-2 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Update Design Spec</button>
                        <button className="px-4 py-2 bg-white border border-red-200 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">Notify Supplier</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-12">
              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Dealer P&L Intelligence</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="pb-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Dealership</th>
                        <th className="pb-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Revenue</th>
                        <th className="pb-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Parts Att.</th>
                        <th className="pb-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Warranty Rec.</th>
                        <th className="pb-4 text-[10px] font-bold text-black/20 uppercase tracking-widest">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {MOCK_DEALER_PL.map((d, i) => (
                        <tr key={i} className="group hover:bg-surface transition-colors">
                          <td className="py-6">
                            <div className="text-sm font-bold">{d.dealer}</div>
                            <div className="text-[10px] text-black/40">{d.location}</div>
                          </td>
                          <td className="py-6 font-semibold text-sm">{d.revenue}</td>
                          <td className="py-6 font-semibold text-sm">{d.partsAttachment}%</td>
                          <td className="py-6 font-semibold text-sm">{d.warrantyRecovery}%</td>
                          <td className="py-6">
                            <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
                              d.status === 'Green' ? 'bg-success/10 text-success' : 
                              d.status === 'Amber' ? 'bg-amber-50 text-amber-500' : 'bg-red-50 text-red-500'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex items-center justify-between mb-10">
                  <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">White-Space Analysis</h4>
                  <button className="text-[10px] font-bold text-accent uppercase tracking-widest border-b border-accent/20 pb-1">View Expansion Map</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="p-6 bg-surface rounded-2xl border border-border">
                      <div className="text-xs font-bold mb-2">Tier-3 Expansion Opportunity</div>
                      <p className="text-[11px] text-black/40 leading-relaxed mb-4">
                        High EV adoption in <strong>Kolhapur Cluster</strong>. Current service gap: 45km. AI recommends <strong>Compact Workshop</strong> model.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="text-[10px] font-bold text-success uppercase tracking-widest">ROI: 18 Months</div>
                        <button className="px-4 py-2 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-lg">Approve LOI</button>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-video bg-surface rounded-3xl overflow-hidden relative border border-border">
                    <img src="https://picsum.photos/seed/networkmap/600/400" alt="Network Map" className="w-full h-full object-cover opacity-30 grayscale" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-accent rounded-full animate-ping" />
                      <div className="w-2 h-2 bg-accent rounded-full absolute" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Strategic Sidebar */}
        <div className="space-y-10">
          <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">MD-Ready Intelligence</h4>
            <div className="space-y-10">
              <div className="group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp size={14} className="text-success" />
                  <div className="text-[10px] text-success font-bold uppercase tracking-widest">Program Profitability</div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  EV Service profitability is up 12% YoY. <strong>Spare Parts</strong> margin in Zone 2 is the primary driver.
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                  Review Margin Strategy
                </button>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle size={14} className="text-accent" />
                  <div className="text-[10px] text-accent font-bold uppercase tracking-widest">Risk Mitigation</div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  Autonomous agent detected <strong>₹1.2Cr</strong> potential warranty leakage in Zone 4. Auto-audit triggered.
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                  View Audit Trail
                </button>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Zap size={14} className="text-amber-400" />
                  <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Network Expansion</div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  White-space analysis identifies <strong>Tier-3</strong> clusters in Maharashtra for EVP002 launch.
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                  Open Expansion Map
                </button>
              </div>
            </div>
            <button className="w-full mt-16 bg-white text-black py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all">
              Download MD Review Pack
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black/20 mb-10">Active OEM Agents</h4>
            <div className="space-y-6">
              {AGENTS.filter(a => a.ring.includes('OEM') && a.status === 'active').map((agent) => (
                <div key={agent.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-accent/5 rounded-lg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{agent.name}</div>
                      <div className="text-[8px] text-black/40 font-medium uppercase tracking-widest">{agent.function}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-black/20">{agent.confidenceScore}%</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerView({ onOpenJC }: { onOpenJC: (jc: string) => void }) {
  const currentCustomer = "Mandar Joshi";
  const customerVehicles = MOCK_VEHICLES.filter(v => v.customer === currentCustomer);
  const [selectedVehicleVin, setSelectedVehicleVin] = useState(customerVehicles[0]?.vin);
  const vehicle = customerVehicles.find(v => v.vin === selectedVehicleVin) || customerVehicles[0];
  const activeAppointment = MOCK_SERVICE_APPOINTMENTS.find(a => (a.regNo === vehicle.plate || a.chassisNo === vehicle.vin) && a.status !== 'Gate Out');

  return (
    <div className="space-y-16">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-4xl font-semibold tracking-tight">Welcome back, {currentCustomer}</h3>
        <p className="text-sm text-black/40 font-medium">Here's the real-time status of your Tata fleet.</p>
      </div>

      {/* Vehicle Selector (if more than 1) */}
      {customerVehicles.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {customerVehicles.map((v) => (
            <button
              key={v.vin}
              onClick={() => setSelectedVehicleVin(v.vin)}
              className={`flex-shrink-0 p-6 rounded-3xl border transition-all flex items-center gap-4 ${
                selectedVehicleVin === v.vin 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white text-black border-border hover:border-black/20'
              }`}
            >
              <div className={`p-2 rounded-xl ${selectedVehicleVin === v.vin ? 'bg-white/10' : 'bg-surface'}`}>
                <Truck size={20} />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold uppercase tracking-widest opacity-60">{v.plate}</div>
                <div className="text-sm font-bold">{v.model}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Active Job Card Card for Customer */}
      {activeAppointment && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Active Service Status</h5>
            <span className="bg-accent/5 text-accent px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent/10">Live Tracking</span>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-accent/5 rounded-[2rem] flex items-center justify-center text-accent">
                <Wrench size={32} />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight mb-1">{activeAppointment.jcNumber}</div>
                <div className="text-sm text-black/40 font-medium">{activeAppointment.serviceType} • {activeAppointment.status}</div>
              </div>
            </div>
            {activeAppointment.jcNumber && (
              <button 
                onClick={() => onOpenJC(activeAppointment.jcNumber!)}
                className="px-10 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-black/80 transition-all shadow-lg shadow-accent/20"
              >
                View Live Job Card
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="flex items-start justify-between">
            <div className="flex gap-8">
              <div className="w-24 h-24 bg-surface rounded-[2.5rem] flex items-center justify-center text-black/10 border border-border">
                <Truck size={56} strokeWidth={1} />
              </div>
              <div>
                <h4 className="text-4xl font-semibold tracking-tight mb-2">My {vehicle.model}</h4>
                <p className="text-sm text-black/40 font-medium">{vehicle.plate} • {vehicle.vin}</p>
                <div className="flex gap-3 mt-6">
                  <span className="text-[10px] border border-border px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-black/40">Warranty Active</span>
                  <span className="text-[10px] border border-border px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-black/40">RSA Active</span>
                  <span className="text-[10px] bg-accent/5 border border-accent/10 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-accent">SoH: {vehicle.soh}%</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-6xl font-semibold tracking-tighter text-success">{vehicle.healthScore}</div>
              <div className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mt-2">Health Index</div>
            </div>
          </div>

          {/* Predictive Alert & AI Booking */}
          {vehicle.soh < 80 && (
            <div className="bg-accent text-white p-10 rounded-[2.5rem] shadow-[0_20px_40px_rgba(20,20,20,0.15)] flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={24} />
                  <h5 className="text-xl font-bold tracking-tight">Predictive Maintenance Alert</h5>
                </div>
                <p className="text-sm text-white/80 font-medium leading-relaxed max-w-md">
                  Your battery State of Health (SoH) is <strong>{vehicle.soh}%</strong>. Nexus AI recommends a cell balancing check within the next 15 days to prevent performance degradation.
                </p>
              </div>
              <div className="flex flex-col gap-4 w-full md:w-auto">
                <button className="px-8 py-4 bg-white text-accent text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/90 transition-all shadow-lg">
                  AI-Driven Booking (Slot: 10 AM)
                </button>
                <button className="px-8 py-4 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white/20 transition-all border border-white/20">
                  View Cost Estimate (₹2,450)
                </button>
              </div>
            </div>
          )}

          {/* Live Progress Tracker & Video Feed */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Live Service Progress</h5>
                <span className="text-[10px] text-accent font-bold uppercase tracking-widest">In Progress • 45m left</span>
              </div>
              <div className="relative">
                <div className="flex justify-between mb-8">
                  {[
                    { label: 'Arrival', status: 'completed' },
                    { label: 'Diagnostic', status: 'completed' },
                    { label: 'Service', status: 'active' },
                    { label: 'Washing', status: 'pending' },
                    { label: 'Ready', status: 'pending' },
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center gap-4 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-bg transition-all ${
                        step.status === 'completed' ? 'bg-success text-white' : 
                        step.status === 'active' ? 'bg-accent text-white shadow-[0_0_15px_rgba(20,20,20,0.2)]' : 'bg-surface text-black/20'
                      }`}>
                        {step.status === 'completed' ? <CheckCircle2 size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        step.status === 'active' ? 'text-accent' : 'text-black/20'
                      }`}>{step.label}</span>
                    </div>
                  ))}
                </div>
                <div className="absolute top-4 left-0 w-full h-1 bg-surface -z-0 rounded-full">
                  <div className="h-full bg-accent w-[50%] transition-all duration-1000" />
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center">
                    <Monitor size={18} className="text-black/40" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Technician Feed</div>
                    <div className="text-xs font-semibold">Live from Bay 04</div>
                  </div>
                </div>
                <div className="aspect-video bg-black rounded-2xl overflow-hidden relative group cursor-pointer">
                  <img src="https://picsum.photos/seed/workshop/800/450" alt="Workshop Feed" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-white uppercase tracking-widest">Live</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface p-8 rounded-[2.5rem] border border-border flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">AI Explainer & Approval</h5>
                <span className="text-[10px] bg-accent text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">New Request</span>
              </div>
              <div className="flex-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Info size={16} className="text-accent" />
                    <span className="text-xs font-bold uppercase tracking-widest">Brake Pad Replacement</span>
                  </div>
                  <p className="text-xs text-black/60 leading-relaxed italic mb-4">
                    "Nexus AI detected that your brake pads have worn down to 2.5mm. Replacing them now prevents damage to the rotors, saving you ₹12,000 in future repairs."
                  </p>
                  <div className="flex items-center justify-between text-sm font-bold">
                    <span className="text-black/40">Estimated Cost</span>
                    <span>₹4,200</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button className="flex-1 py-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black transition-all shadow-sm">
                  Approve Job
                </button>
                <button className="flex-1 py-4 bg-black/5 text-black/40 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-black/10 transition-all">
                  Reject
                </button>
              </div>
            </div>
          </div>

          {/* Telematics Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">Battery Health</div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold">82%</span>
                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Fair</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[82%]" />
              </div>
              <p className="text-[10px] text-black/40 mt-4 font-medium">Cell imbalance detected in Module 4</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">Brake Life</div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold">45%</span>
                <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest">Low</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[45%]" />
              </div>
              <p className="text-[10px] text-black/40 mt-4 font-medium">Replacement recommended in 500km</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-border shadow-sm">
              <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">Eco-Driving Score</div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold">92/100</span>
                <span className="text-[10px] text-success font-bold uppercase tracking-widest">Excellent</span>
              </div>
              <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-success w-[92%]" />
              </div>
              <p className="text-[10px] text-black/40 mt-4 font-medium">Smooth braking saved ₹1,200 this month</p>
            </div>
          </div>

          {/* AI Journey Insights */}
          <div className="bg-surface p-8 rounded-[2.5rem] border border-border">
            <div className="flex items-center gap-3 mb-6">
              <Zap size={18} className="text-accent" />
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">AI Journey Insights</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Usage Pattern</div>
                <p className="text-sm font-medium text-black/80 leading-relaxed">
                  Your frequent short trips in <strong>Pune traffic</strong> are accelerating brake wear. AI suggests using <strong>Regen Level 3</strong> more consistently.
                </p>
              </div>
              <div className="space-y-3 border-l border-border pl-8">
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Prior Info Context</div>
                <p className="text-sm font-medium text-black/80 leading-relaxed">
                  Last service at <strong>Pune Central</strong> noted a minor alignment issue. Telematics confirms this is stable but should be checked at next visit.
                </p>
              </div>
            </div>
          </div>

          {/* Predictive Maintenance Timeline */}
          <div className="space-y-8">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Predictive Maintenance Timeline</h5>
            <div className="relative pl-8 border-l border-border space-y-12">
              {[
                { title: 'Brake Pad Replacement', date: 'Est. April 2026', status: 'critical', desc: 'Based on current wear rate (1.2mm/1000km)' },
                { title: 'Battery Deep Cycle', date: 'Est. June 2026', status: 'warning', desc: 'Recommended to balance cells and extend life' },
                { title: 'Annual Service', date: 'Est. Jan 2027', status: 'info', desc: 'Standard periodic maintenance' },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-bg ${
                    item.status === 'critical' ? 'bg-red-500' : 
                    item.status === 'warning' ? 'bg-amber-500' : 'bg-accent'
                  }`} />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-lg tracking-tight">{item.title}</div>
                      <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{item.date}</div>
                    </div>
                    <p className="text-sm text-black/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Service History</h5>
            <div className="space-y-3">
              {[
                { date: '12 Jan 2026', type: 'Periodic Maintenance', cost: '₹8,450', status: 'Completed' },
                { date: '15 Oct 2025', type: 'Brake Pad Replacement', cost: '₹4,200', status: 'Completed' },
                { date: '10 Jul 2025', type: 'First Free Service', cost: '₹0', status: 'Completed' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-surface rounded-[2rem] group hover:bg-white border border-transparent hover:border-border transition-all">
                  <div className="flex items-center gap-5 text-base font-semibold tracking-tight">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    {service.type}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-semibold">{service.cost}</div>
                      <div className="text-[10px] text-black/20 uppercase tracking-widest font-bold">{service.date}</div>
                    </div>
                    <ChevronRight size={20} className="text-black/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-accent text-white p-10 rounded-[2.5rem] shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">Nexus Assistant</h4>
            <div className="space-y-10">
              <div>
                <div className="text-[10px] text-success font-bold uppercase tracking-widest mb-3">Maintenance Due</div>
                <p className="text-sm text-white/60 leading-relaxed">Your next service is due in <strong>1,200 km</strong>. Book now to get 10% off on labor.</p>
              </div>
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-3">Health Alert</div>
                <p className="text-sm text-white/60 leading-relaxed">Battery health is at 82%. We recommend a <strong>Deep Cycle Charge</strong> at your next visit.</p>
              </div>
            </div>
            <button className="w-full mt-16 bg-white text-accent py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all">
              Book Service
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegionalCCMView_Duplicate() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-black uppercase tracking-[0.15em]">Regional Dealer Performance</h3>
              <div className="flex items-center gap-4">
                <div className="flex bg-surface p-1 rounded-xl border border-border">
                  {(['daily', 'weekly', 'monthly'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                        timeRange === range ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-bold text-success uppercase tracking-widest bg-success/10 px-3 py-1.5 rounded-full">97.5% Network Health</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-border shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div className="text-[11px] font-bold text-black uppercase tracking-widest">Efficiency Trend <span className="text-black/30 ml-2">vs Target</span></div>
                  <span className="text-[10px] text-success font-bold uppercase tracking-widest bg-success/10 px-2 py-1 rounded">+4% Avg</span>
                </div>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', val: 82, target: 90 },
                      { month: 'Feb', val: 85, target: 90 },
                      { month: 'Mar', val: 92, target: 90 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#141414', fontWeight: 600 }} />
                      <YAxis hide domain={[70, 100]} />
                      <ReferenceLine y={90} stroke="#FF4444" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#FF4444', fontSize: 8, fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="val" stroke="#141414" strokeWidth={3} dot={{ r: 4, fill: '#141414' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Pune Central', score: 94, trend: 'up', info: 'Best in Express Bay' },
                  { name: 'Mumbai West', score: 88, trend: 'down', info: 'High Body Shop Load' },
                  { name: 'Delhi North', score: 42, trend: 'down', info: 'Critical Parts Shortage' },
                  { name: 'Bangalore East', score: 91, trend: 'up', info: 'Optimal Performance' },
                ].map((dealer, i) => (
                  <div key={i} className="p-6 bg-surface rounded-2xl flex items-center justify-between group hover:bg-white border border-transparent hover:border-border transition-all cursor-pointer">
                    <div>
                      <div className="font-semibold text-sm">{dealer.name}</div>
                      <div className="text-[8px] text-black/40 uppercase font-bold mt-1">{dealer.info}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-bold">{dealer.score}%</div>
                        <div className="text-[8px] text-black/40 uppercase font-bold">Efficiency</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${dealer.score > 90 ? 'bg-success' : dealer.score > 70 ? 'bg-amber-500' : 'bg-red-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Regional Predictive Strategy */}
          <div className="bg-surface p-8 rounded-[2.5rem] border border-border">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={18} className="text-accent" />
              <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">AI Regional Strategy</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Resource Optimization</div>
                <p className="text-sm font-medium text-black/80 leading-relaxed">
                  AI predicts a <strong>20% surge</strong> in Delhi North service volume next week. Recommend shifting 2 technicians from Pune Central (currently at 110% capacity).
                </p>
              </div>
              <div className="space-y-3 border-l border-border pl-8">
                <div className="text-[10px] text-black/40 font-bold uppercase tracking-widest">Inventory Balancing</div>
                <p className="text-sm font-medium text-black/80 leading-relaxed">
                  Brake Pad stock is critical in Delhi. AI suggests <strong>Inter-Dealer Transfer (IDT)</strong> of 50 units from Mumbai West to avoid stock-outs.
                </p>
              </div>
            </div>
          </div>

          <ComplaintsSection role="Regional CCM" />

          <div className="space-y-6">
            <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Regional Escalations</h5>
            <div className="space-y-3">
              {MOCK_ALERTS.filter(a => a.role === 'Regional CCM' || a.severityScore > 80).map((alert, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-surface rounded-[2rem] group hover:bg-white border border-transparent hover:border-border transition-all">
                  <div className="flex items-center gap-5 text-base font-semibold tracking-tight">
                    <div className={`w-2 h-2 rounded-full ${alert.type === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-amber-500'}`} />
                    {alert.message}
                  </div>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-black/20 group-hover:text-accent transition-colors">Investigate</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-accent text-white p-10 rounded-[2.5rem] shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">Regional Intelligence</h4>
            <div className="space-y-10">
              <div>
                <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest mb-3">Critical Trend</div>
                <p className="text-sm text-white/60 leading-relaxed">Delhi North efficiency dropped by <strong>15%</strong>. Telematics indicates a 40% increase in "Repeat Repairs" for Nexon EV suspension.</p>
              </div>
              <div>
                <div className="text-[10px] text-success font-bold uppercase tracking-widest mb-3">Opportunity</div>
                <p className="text-sm text-white/60 leading-relaxed">Pune Central has <strong>94% efficiency</strong>. Recommend standardizing their "Express Bay" workflow across the region.</p>
              </div>
            </div>
            <button className="w-full mt-16 bg-white text-accent py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all">
              Generate Regional Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommandCentreView() {
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-4xl font-semibold tracking-tight">Command Centre</h3>
          <p className="text-sm text-black/60 font-medium">Technical Help Desk (THD) & Dealership Support Operations</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-surface p-1 rounded-xl border border-border">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  timeRange === range ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <button className="px-6 py-3 bg-surface border border-border rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black/5 transition-all flex items-center gap-2">
            <Activity size={14} /> Live Support Queue
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-sm">Broadcast Tech Bulletin</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-12">
          <GeminiInsight 
            title="Command Centre Intelligence"
            prompt={`Analyze the active THD requests: ${JSON.stringify(MOCK_THD_REQUESTS)}. 
            Identify any recurring technical issues across dealerships and suggest a proactive technical bulletin.`}
          />
          {/* THD Request Queue */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Active THD Requests</h4>
              <div className="flex gap-4">
                <span className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> 2 Critical
                </span>
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">5 Pending</span>
              </div>
            </div>
            <div className="space-y-6">
              {MOCK_THD_REQUESTS.map((request) => {
                const isComplex = request.category === 'HV Battery' || request.category === 'Software';
                const assignedAgentName = request.assignedAgent || (isComplex ? 'DET' : 'Service Advisor Agent');
                const matchScore = isComplex ? 98 : 94;
                const reason = isComplex ? 'Assigned based on Advanced Diagnostics specialization' : 'Assigned based on Routine Support expertise';
                
                return (
                  <div key={request.id} className="group p-8 bg-surface rounded-3xl border border-border hover:border-accent/20 transition-all cursor-pointer">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-4">
                        <div className={`p-3 rounded-xl ${
                          request.priority === 'Critical' ? 'bg-red-500 text-white' : 
                          request.priority === 'High' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          <Wrench size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm font-bold">{request.id}</span>
                            <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              request.status === 'Open' ? 'bg-red-100 text-red-600' : 
                              request.status === 'In Progress' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                            }`}>
                              {request.status}
                            </span>
                            {!request.assignedAgent && (
                              <div className="flex items-center gap-2">
                                <span className="text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-accent/10 text-accent">
                                  Auto-Assigned
                                </span>
                                <span className="text-[8px] font-bold text-success uppercase tracking-widest flex items-center gap-1">
                                  <CheckCircle2 size={10} /> {matchScore}% Expertise Match
                                </span>
                              </div>
                            )}
                          </div>
                          <h5 className="text-lg font-semibold tracking-tight">{request.issue}</h5>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">{request.timestamp.split('T')[1].substring(0, 5)}</div>
                        <div className="text-xs font-bold text-accent">{request.dealer}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-black/5">
                      <div className="flex gap-8">
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">Vehicle</span>
                          <span className="text-[10px] font-bold">{request.vehicleModel} ({request.vin.slice(-6)})</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">Category</span>
                          <span className="text-[10px] font-bold">{request.category}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest mb-1">Assigned Expert</span>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <UserCircle size={16} className="text-accent" />
                              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-success rounded-full border border-white" title="Available" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold">{assignedAgentName}</span>
                              <span className="text-[8px] text-black/40 font-medium italic">{reason}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-border text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black/5 transition-all">Connect to Dealer</button>
                        <button className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-accent transition-all">Take Action</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Support Intelligence */}
          <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">Support Intelligence</h4>
            <div className="space-y-10">
              <div className="group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Cpu size={14} className="text-success" />
                  <div className="text-[10px] text-success font-bold uppercase tracking-widest">Automated Diagnostics</div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  Nexus AI has analyzed <strong>THD-001</strong>. Root cause identified as <strong>Firmware Mismatch</strong> in BMS v2.1.
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                  Push Fix to Dealer
                </button>
              </div>
              <div className="group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <Users size={14} className="text-blue-400" />
                  <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Expert Availability</div>
                </div>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  3 HV Battery experts are online. <strong>DET Training</strong> session scheduled for Zone 4 at 2 PM.
                </p>
                <button className="text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-white transition-all">
                  Join Training Room
                </button>
              </div>
            </div>
          </div>

          {/* SLA Performance */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black/20 mb-10">SLA Performance</h4>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span>Critical Response</span>
                  <span className="text-success">98%</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[98%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-3">
                  <span>Resolution Time</span>
                  <span className="text-amber-500">85%</span>
                </div>
                <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[85%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgenticOrchestratorView() {
  const [activeEvent, setActiveEvent] = useState<string>('Battery SoH dropped to 78% for Nexon EV');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [activeTab, setActiveTab] = useState<'orchestrator' | 'architecture' | 'events'>('orchestrator');

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-4xl font-semibold tracking-tight">Agentic OS Orchestrator</h3>
          <p className="text-sm text-black/60 font-medium">Central Intelligence Layer: DETECT → DIAGNOSE → DECIDE → ACT → TRACK → LEARN</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-surface p-1 rounded-xl flex gap-1">
            {(['orchestrator', 'architecture', 'events'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  activeTab === tab ? 'bg-white text-accent shadow-sm' : 'text-black/20 hover:text-black/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex p-1 bg-black/[0.03] rounded-xl border border-border">
            {(['daily', 'weekly', 'monthly'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${
                  timeRange === range ? 'bg-white text-accent shadow-sm' : 'text-black/20 hover:text-black/40'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeTab === 'orchestrator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {/* Event Input Section */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Live Event Stream</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-accent uppercase tracking-widest">Listening for signals</span>
                </div>
              </div>
              <div className="relative">
                <textarea
                  value={activeEvent}
                  onChange={(e) => setActiveEvent(e.target.value)}
                  placeholder="Enter event (e.g., Battery SoH dropped to 78% for Nexon EV)"
                  className="w-full h-32 p-6 bg-surface rounded-2xl border border-border focus:border-accent outline-none text-lg font-medium resize-none text-black"
                />
                <button 
                  onClick={() => setIsProcessing(true)}
                  disabled={!activeEvent || isProcessing}
                  className="absolute bottom-4 right-4 px-8 py-3 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all disabled:opacity-50"
                >
                  {isProcessing ? 'Orchestrating...' : 'Process Event'}
                </button>
              </div>
            </div>

            {/* Intelligence Layer Output */}
            {isProcessing && (
              <div className="space-y-12">
                <GeminiInsight 
                  title="Agentic OS Intelligence"
                  prompt={`Process the following event as the Tata Nexus Service Agentic OS: "${activeEvent}". 
                  Follow the mandatory structure: EVENT SUMMARY, DIAGNOSIS, DECISION, ACTION PLAN (Customer, Dealer, OEM), AUTO-EXECUTED ACTIONS, EXPECTED IMPACT, TRACKING METRICS.`}
                  onComplete={() => setIsProcessing(false)}
                />
                
                {/* Orchestration Flow Visualization */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { step: 'DETECT', status: 'completed', icon: Search, color: 'text-blue-500' },
                    { step: 'DIAGNOSE', status: 'completed', icon: Cpu, color: 'text-purple-500' },
                    { step: 'DECIDE', status: 'completed', icon: Zap, color: 'text-amber-500' },
                    { step: 'ACT', status: 'processing', icon: Activity, color: 'text-success' },
                    { step: 'TRACK', status: 'pending', icon: Clock, color: 'text-black/20' },
                    { step: 'LEARN', status: 'pending', icon: GraduationCap, color: 'text-black/20' },
                  ].map((flow, i) => (
                    <div key={i} className={`p-6 bg-white border border-border rounded-2xl flex items-center gap-4 ${flow.status === 'processing' ? 'ring-2 ring-accent ring-offset-2 shadow-lg shadow-accent/10' : ''}`}>
                      <div className={`p-3 rounded-xl bg-surface ${flow.color}`}>
                        <flow.icon size={20} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">{flow.step}</div>
                        <div className="text-xs font-bold capitalize text-black">{flow.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Layer Status */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Action Layer Execution</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {MOCK_ACTION_SERVICES.map((service) => (
                  <div key={service.id} className="bg-white p-8 rounded-[2rem] border border-border shadow-sm flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${service.status === 'Online' ? 'bg-success' : 'bg-red-500'}`} />
                        <span className="text-sm font-bold">{service.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">{service.latency}ms</span>
                    </div>
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Last Action</div>
                      <p className="text-xs font-medium text-black/60 italic">"{service.lastAction}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Agent Status */}
            <div className="bg-black text-white p-10 rounded-[2.5rem] shadow-sm">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white/30 mb-10">Agent Ecosystem Status</h4>
              <div className="space-y-8">
                {AGENTS.slice(0, 6).map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${agent.status === 'active' ? 'bg-success' : 'bg-amber-400 animate-pulse'}`} />
                      <div>
                        <div className="text-sm font-bold group-hover:text-accent transition-colors">{agent.name}</div>
                        <div className="text-[8px] text-white/30 uppercase tracking-widest font-bold">{agent.function}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold">{agent.confidenceScore}%</div>
                      <div className="text-[8px] text-white/20 uppercase font-bold">Confidence</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-16 bg-white/10 text-white py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-white/20 transition-all">
                View All Agents
              </button>
            </div>

            {/* System Metrics */}
            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-black/20 mb-10">Orchestration Metrics</h4>
              <div className="space-y-10">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Auto-Execution Rate</div>
                      <div className="text-2xl font-bold text-black">85%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-success uppercase tracking-widest">↑ 4% vs Prev</div>
                      <div className="text-[8px] text-black/20 font-bold uppercase tracking-widest">Target: 90%</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden relative">
                    <div className="h-full bg-accent w-[85%]" />
                    <div className="absolute top-0 left-[90%] w-0.5 h-full bg-black/10" title="Target" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Diagnostic Accuracy</div>
                      <div className="text-2xl font-bold text-black">96%</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-success uppercase tracking-widest">↑ 2% vs Prev</div>
                      <div className="text-[8px] text-black/20 font-bold uppercase tracking-widest">Target: 98%</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden relative">
                    <div className="h-full bg-success w-[96%]" />
                    <div className="absolute top-0 left-[98%] w-0.5 h-full bg-black/10" title="Target" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Response Latency</div>
                      <div className="text-2xl font-bold text-black">420ms</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-success uppercase tracking-widest">↓ 50ms vs Prev</div>
                      <div className="text-[8px] text-black/20 font-bold uppercase tracking-widest">Target: 300ms</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden relative">
                    <div className="h-full bg-blue-500 w-[70%]" />
                    <div className="absolute top-0 left-[30%] w-0.5 h-full bg-black/10" title="Target" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'architecture' && <SystemArchitectureView />}

      {activeTab === 'events' && (
        <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Kafka Event Pipeline</h4>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" /> 3 Topics Active
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="p-6 bg-surface rounded-2xl border border-border flex items-center justify-between group hover:border-accent transition-all">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Source</span>
                    <span className="text-sm font-bold">{event.source}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Event Type</span>
                    <span className="text-sm font-bold text-accent">{event.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-1">Payload</span>
                    <span className="text-xs font-medium text-black/40 font-mono">{JSON.stringify(event.payload)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">{event.timestamp}</span>
                  <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                    event.status === 'Completed' ? 'bg-success/10 text-success' : 
                    event.status === 'Processing' ? 'bg-amber-400/10 text-amber-600' : 'bg-black/5 text-black/40'
                  }`}>
                    {event.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SystemArchitectureView() {
  return (
    <div className="space-y-12">
      <div className="bg-black text-white p-12 rounded-[3rem] shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 space-y-16">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Full Production Architecture</h4>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold text-success uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" /> All Systems Nominal
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Layer 1: Frontend */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Frontend Layer</div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-accent/20 text-accent rounded-xl">
                  <Monitor size={20} />
                </div>
                <div className="text-sm font-bold">Persona Apps</div>
              </div>
            </div>

            {/* Layer 2: Gateway */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Gateway Layer</div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
                  <Globe size={20} />
                </div>
                <div className="text-sm font-bold">API Gateway</div>
              </div>
            </div>

            {/* Layer 3: Orchestrator */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Core Brain</div>
              <div className="p-6 bg-accent text-white rounded-2xl flex items-center gap-4 shadow-lg shadow-accent/20">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Cpu size={20} />
                </div>
                <div className="text-sm font-bold">Nexus Orchestrator</div>
              </div>
            </div>

            {/* Layer 4: Agents */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Agent Layer</div>
              <div className="space-y-4">
                {['Customer Agent', 'Dealer Agent', 'OEM Agent'].map((agent) => (
                  <div key={agent} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                      <Users size={14} />
                    </div>
                    <span className="text-xs font-bold">{agent}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Layer 5: Actions */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Action Services</div>
              <div className="grid grid-cols-2 gap-4">
                {['Booking', 'Parts', 'TSB', 'Notify'].map((svc) => (
                  <div key={svc} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-success/20 text-success rounded-lg">
                      <Zap size={14} />
                    </div>
                    <span className="text-xs font-bold">{svc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layer 6: Data */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Data & Event Layer</div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                    <Layers size={14} />
                  </div>
                  <span className="text-xs font-bold">Kafka Event Bus</span>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Terminal size={14} />
                  </div>
                  <span className="text-xs font-bold">PostgreSQL / BigQuery</span>
                </div>
              </div>
            </div>

            {/* Layer 7: External */}
            <div className="space-y-6">
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">External Systems</div>
              <div className="grid grid-cols-2 gap-4">
                {['DMS', 'Telematics', 'CRM', 'Warranty'].map((ext) => (
                  <div key={ext} className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                      <ArrowUpRight size={14} />
                    </div>
                    <span className="text-xs font-bold">{ext}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">API Gateway Throughput</div>
          <div className="text-2xl font-bold mb-2">1,240 req/s</div>
          <div className="text-[10px] font-bold text-success uppercase tracking-widest">↑ 12% vs Peak</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">Kafka Message Lag</div>
          <div className="text-2xl font-bold mb-2">12ms</div>
          <div className="text-[10px] font-bold text-success uppercase tracking-widest">Optimal</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-border shadow-sm">
          <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-4">DB Query Latency</div>
          <div className="text-2xl font-bold mb-2">8ms</div>
          <div className="text-[10px] font-bold text-success uppercase tracking-widest">Stable</div>
        </div>
      </div>
    </div>
  );
}

function RoleManagementView() {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(MOCK_ROLE_PERMISSIONS);

  const togglePermission = (role: Role, permId: string) => {
    setRolePermissions(prev => prev.map(rp => {
      if (rp.role === role) {
        const hasPerm = rp.permissions.includes(permId);
        return {
          ...rp,
          permissions: hasPerm 
            ? rp.permissions.filter(id => id !== permId)
            : [...rp.permissions, permId]
        };
      }
      return rp;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold tracking-tight">Role Management</h3>
          <p className="text-sm text-black/40">Manage user personas and system permissions</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface p-1 rounded-xl flex gap-1">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'users' ? 'bg-white text-accent shadow-sm' : 'text-black/40 hover:text-accent'
              }`}
            >
              Users
            </button>
            <button 
              onClick={() => setActiveTab('roles')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                activeTab === 'roles' ? 'bg-white text-accent shadow-sm' : 'text-black/40 hover:text-accent'
              }`}
            >
              Roles & Permissions
            </button>
          </div>
          <button className="bg-accent text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-black/80 transition-colors">
            {activeTab === 'users' ? 'Add New User' : 'Create Custom Role'}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' ? (
          <motion.div
            key="users-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl border border-border overflow-hidden"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40">User</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Persona</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Status</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Last Active</th>
                  <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: 'Mandar Joshi', role: 'Admin', status: 'Active', last: 'Now' },
                  { name: 'Rahul Sharma', role: 'Service Advisor', status: 'Active', last: '2h ago' },
                  { name: 'Anjali Singh', role: 'Technician', status: 'On Leave', last: '1d ago' },
                  { name: 'Suresh Kumar', role: 'Spare Parts Mgr', status: 'Active', last: '15m ago' },
                ].map((user, i) => (
                  <tr key={i} className="hover:bg-surface transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center font-bold text-[10px]">{user.name.split(' ').map(n => n[0]).join('')}</div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-sm text-black/60">{user.role}</td>
                    <td className="p-6">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        user.status === 'Active' ? 'bg-success/10 text-success' : 'bg-black/5 text-black/40'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-black/40">{user.last}</td>
                    <td className="p-6">
                      <button className="text-black/20 hover:text-accent transition-colors"><Settings size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <motion.div
            key="roles-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          >
            <div className="lg:col-span-1 space-y-4">
              <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest px-2">System Personas</div>
              {ROLES.map(role => (
                <div key={role} className="p-4 bg-white border border-border rounded-2xl flex items-center justify-between group hover:border-accent transition-all cursor-pointer">
                  <span className="text-sm font-medium">{role}</span>
                  <ChevronRight size={14} className="text-black/10 group-hover:text-accent" />
                </div>
              ))}
            </div>

            <div className="lg:col-span-3 bg-white rounded-2xl border border-border overflow-hidden">
              <div className="p-8 border-b border-border bg-surface flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-lg tracking-tight">Permissions Matrix</h4>
                  <p className="text-xs text-black/40 font-medium">Configure access levels for each persona</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface border-b border-border">
                      <th className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40 sticky left-0 bg-surface z-10">Permission</th>
                      {ROLES.slice(0, 6).map(role => (
                        <th key={role} className="p-6 text-[10px] font-bold uppercase tracking-widest text-black/40 text-center">{role}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {MOCK_PERMISSIONS.map(perm => (
                      <tr key={perm.id} className="hover:bg-surface transition-colors">
                        <td className="p-6 sticky left-0 bg-white group-hover:bg-surface z-10 border-r border-border">
                          <div className="font-medium text-sm">{perm.name}</div>
                          <div className="text-[10px] text-black/40">{perm.description}</div>
                        </td>
                        {ROLES.slice(0, 6).map(role => {
                          const rp = rolePermissions.find(r => r.role === role);
                          const isChecked = rp?.permissions.includes(perm.id);
                          return (
                            <td key={role} className="p-6 text-center">
                              <button 
                                onClick={() => togglePermission(role, perm.id)}
                                className={`w-5 h-5 rounded-md border-2 transition-all mx-auto flex items-center justify-center ${
                                  isChecked ? 'bg-accent border-accent text-white' : 'border-black/10 hover:border-accent'
                                }`}
                              >
                                {isChecked && <CheckCircle2 size={12} />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AgentObservabilityView({ selectedId, onSelect, activeRing }: { selectedId: string | null, onSelect: (id: string) => void, activeRing: StakeholderRing }) {
  const filteredAgents = AGENTS.filter(a => a.ring.includes(activeRing));
  const selectedAgent = AGENTS.find(a => a.id === selectedId);

  if (!selectedAgent) {
    // Global Dashboard View
    const totalTokens = filteredAgents.reduce((acc, a) => acc + (a.metrics?.tokensUsed || 0), 0);
    const totalCost = filteredAgents.reduce((acc, a) => acc + (a.metrics?.cost || 0), 0);
    const avgSuccessRate = (filteredAgents.reduce((acc, a) => acc + (a.metrics?.successRate || 0), 0) / (filteredAgents.length || 1)).toFixed(1);
    const avgLatency = (filteredAgents.reduce((acc, a) => acc + (a.metrics?.avgLatency || 0), 0) / (filteredAgents.length || 1)).toFixed(0);

    const allLogs = filteredAgents.flatMap(a => a.behaviorLogs?.map(l => ({ ...l, agentName: a.name })) || [])
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
      .slice(0, 10);

    return (
      <div className="space-y-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <MetricBox label="Avg Success Rate" value={`${avgSuccessRate}%`} trend="up" />
          <MetricBox label="Avg Latency" value={`${avgLatency}ms`} trend="down" />
          <MetricBox label="Total Tokens" value={totalTokens.toLocaleString()} trend="neutral" />
          <MetricBox label="Total Cost" value={`₹${totalCost}`} trend="neutral" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Agent Performance Comparison</h4>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredAgents.map(a => ({ name: a.name, success: a.metrics?.successRate, latency: a.metrics?.avgLatency }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#F5F5F7' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Bar dataKey="success" fill="#10B981" radius={[4, 4, 0, 0]} barSize={30} name="Success Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Resource Distribution</h4>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredAgents.map(a => ({ name: a.name, value: a.metrics?.tokensUsed }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {filteredAgents.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#141414', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Live System Logs</h4>
              <div className="space-y-4">
                {allLogs.map((log, i) => (
                  <div key={i} className="p-5 bg-white border border-border rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-accent uppercase tracking-widest">{(log as any).agentName}</span>
                      <span className="text-[8px] font-bold text-black/20 uppercase tracking-widest">{log.timestamp}</span>
                    </div>
                    <div className="text-xs font-semibold">{log.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-surface p-10 rounded-[2.5rem] border border-border">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold tracking-tight">{selectedAgent.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
              selectedAgent.status === 'active' ? 'bg-success/10 text-success' : 'bg-black/5 text-black/40'
            }`}>
              {selectedAgent.status}
            </span>
          </div>
          <p className="text-xs text-black/40 font-medium">{selectedAgent.description}</p>
          <div className="flex items-center gap-4 pt-2">
            <span className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
              {selectedAgent.function}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-black/20 uppercase tracking-widest">Confidence</span>
              <div className="w-24 h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${selectedAgent.confidenceScore}%` }} />
              </div>
              <span className="text-[10px] font-bold text-accent">{selectedAgent.confidenceScore}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a 
            href={selectedAgent.humanOverridePath}
            className="px-6 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-all shadow-sm"
          >
            Human Override
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-16">
          {/* Real-time Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <MetricBox label="Success Rate" value={`${selectedAgent.metrics?.successRate}%`} trend="up" />
            <MetricBox label="Avg Latency" value={`${selectedAgent.metrics?.avgLatency}ms`} trend="down" />
            <MetricBox label="Reliability" value={`${selectedAgent.metrics?.reliabilityScore}/100`} trend="neutral" />
            <MetricBox label="Uptime" value={`${selectedAgent.metrics?.uptime}%`} trend="up" />
          </div>

          {/* Performance Charts */}
          <div className="space-y-10">
            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Success Rate History</h4>
                <div className="flex gap-4">
                  <span className="flex items-center gap-2 text-[10px] font-bold text-success uppercase tracking-widest">
                    <div className="w-2 h-2 bg-success rounded-full" /> Stable
                  </span>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={selectedAgent.performanceHistory}>
                    <defs>
                      <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                    <YAxis hide domain={[80, 100]} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="successRate" stroke="#10B981" fillOpacity={1} fill="url(#colorSuccess)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[2.5rem] border border-border shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Latency Distribution (ms)</h4>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedAgent.performanceHistory}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                    <XAxis dataKey="timestamp" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#A0A0A0' }} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: '#F5F5F7' }}
                      contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontSize: '12px' }}
                    />
                    <Bar dataKey="latency" fill="#141414" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Resource Consumption */}
          <div className="bg-surface p-10 rounded-[2.5rem] border border-border">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em] mb-10">Resource Usage</h4>
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-xs font-bold mb-3">
                  <span className="text-black/40 uppercase tracking-widest">Tokens Used</span>
                  <span>{selectedAgent.metrics?.tokensUsed.toLocaleString()}</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[65%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-3">
                  <span className="text-black/40 uppercase tracking-widest">Compute Cost</span>
                  <span>₹{selectedAgent.metrics?.cost}</span>
                </div>
                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent w-[42%]" />
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-black/20">
                <span>Last Active</span>
                <span className="text-accent">{selectedAgent.metrics?.lastActive}</span>
              </div>
            </div>
          </div>

          {/* Behavior Logs */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Behavior Logs</h4>
            <div className="space-y-4">
              {selectedAgent.behaviorLogs?.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white border border-border rounded-2xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-[10px] font-bold text-black/20">{log.timestamp}</div>
                      {log.status === 'success' ? (
                        <CheckCircle2 size={14} className="text-success" />
                      ) : log.status === 'warning' ? (
                        <AlertTriangle size={14} className="text-amber-500" />
                      ) : (
                        <AlertCircle size={14} className="text-accent" />
                      )}
                    </div>
                    <div className="text-xs font-semibold mb-1">{log.event}</div>
                    {log.explanation && (
                      <div className="text-[10px] text-black/40 leading-relaxed italic">
                        {log.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ComplaintsSection({ role, workshopId }: { role: Role; workshopId?: string }) {
  const filteredComplaints = useMemo(() => {
    if (role === 'Head of Customer Care' || role === 'Admin') return MOCK_COMPLAINTS;
    if (role === 'Regional CCM') return MOCK_COMPLAINTS.filter(c => c.area === 'Pune' || c.area === 'Mumbai');
    if (role === 'Zone CCM') return MOCK_COMPLAINTS.filter(c => c.zone === 'Zone 4');
    
    if (workshopId) {
      return MOCK_COMPLAINTS.filter(c => c.workshopId === workshopId);
    }
    
    if (role === 'Service Advisor' || role === 'Service GM' || role === 'Dealer Principal') {
      return MOCK_COMPLAINTS.filter(c => c.dealership === 'Pune Central');
    }
    return [];
  }, [role, workshopId]);

  if (filteredComplaints.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h5 className="text-[10px] font-bold text-black/20 uppercase tracking-[0.2em]">Open Complaints</h5>
        <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
          {filteredComplaints.filter(c => c.status === 'Open').length} Active
        </span>
      </div>
      <div className="space-y-3">
        {filteredComplaints.map((complaint) => (
          <div key={complaint.id} className="p-6 bg-white border border-border rounded-2xl hover:border-accent transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${complaint.priority === 'High' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-amber-500'}`} />
                <div>
                  <div className="font-semibold text-sm">{complaint.customerName} • {complaint.vehicleModel}</div>
                  <div className="text-[10px] text-black/40 font-medium uppercase tracking-widest mt-1">{complaint.dealership}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${
                complaint.status === 'Open' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'
              }`}>
                {complaint.status}
              </span>
            </div>
            <p className="text-xs text-black/60 leading-relaxed mb-4">{complaint.issue}</p>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest">{new Date(complaint.timestamp).toLocaleDateString()}</span>
              <button className="text-[10px] font-bold uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-opacity">Resolve</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ label, value, trend }: { label: string, value: string, trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
      <div className="text-[10px] font-bold text-black/20 uppercase tracking-widest mb-3">{label}</div>
      <div className="text-xl font-bold tracking-tight mb-1">{value}</div>
      <div className={`text-[10px] font-bold uppercase tracking-widest ${
        trend === 'up' ? 'text-success' : trend === 'down' ? 'text-red-500' : 'text-black/20'
      }`}>
        {trend === 'up' ? '↑ Stable' : trend === 'down' ? '↓ Improving' : '→ Nominal'}
      </div>
    </div>
  );
}

function RevenueItem({ label, value, percent, color }: { label: string, value: string, percent: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="text-black/60 font-medium">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
