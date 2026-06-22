import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  History, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronLeft,
  Search,
  Bell,
  User,
  CheckCircle2,
  AlertCircle,
  Clock,
  Store,
  ArrowRight,
  Menu,
  X,
  Camera,
  Printer,
  Trash2,
  Edit3,
  BarChart3,
  ClipboardCheck,
  Calendar,
  UserCheck,
  PlayCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  MinusCircle,
  FileText,
  Filter,
  TrendingDown,
  TrendingUp,
  Target,
  Plus,
  Save,
  Users,
  Layers,
  ShieldCheck,
  Maximize2,
  Tag,
  Moon,
  Sun,
  Download,
  Lock,
  Eye,
  EyeOff,
  Activity
} from 'lucide-react';

// --- CONFIGURAÇÃO SUPABASE ---
const SUPABASE_URL = 'https://tsjyqcrqwssepnjipwhw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzanlxY3Jxd3NzZXBuamlwd2h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2MjI4ODksImV4cCI6MjA4MzE5ODg4OX0.v9sJm0MqV4rPZ0Vzvz-97yZFdvCKgksiTxN8dGg0x7M';

// Constante de Meta
const META_GLOBAL = 100; 

// --- UTILITÁRIOS ---
const toCamel = (s) => s.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
const keysToCamel = (o) => {
  if (Array.isArray(o)) return o.map(keysToCamel);
  if (o !== null && typeof o === 'object') {
    return Object.keys(o).reduce((acc, key) => {
      const newKey = toCamel(key);
      acc[newKey] = keysToCamel(o[key]);
      return acc;
    }, {});
  }
  return o;
};

const getPenaltyPoints = (severity) => {
  const points = { 'gravissima': 50, 'grave': 4, 'media': 2.5, 'leve': 1 };
  return points[severity] || 0;
};

// --- COMPONENTES DE UI BASE (DESIGN SYSTEM) ---

const Button = ({ children, variant = 'primary', className = '', isDark = true, ...props }) => {
  const base = "px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: isDark 
      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
      : "bg-[#EBFF00] text-[#0062FF] font-bold hover:bg-[#d4e600] shadow-sm",
    secondary: isDark 
      ? "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700" 
      : "bg-white text-[#0062FF] hover:bg-slate-50 border border-slate-200 shadow-sm font-bold",
    outline: isDark 
      ? "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-800" 
      : "bg-transparent border border-[#0062FF] text-[#0062FF] hover:bg-[#0062FF]/5 font-bold",
    ghost: isDark 
      ? "bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50" 
      : "bg-transparent text-[#0062FF] hover:bg-[#0062FF]/5 font-bold",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm"
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", isDark = true }) => (
  <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl overflow-hidden border shadow-sm ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, type = 'neutral', isDark = true }) => {
  const types = {
    success: isDark ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200",
    warning: isDark ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-amber-50 text-amber-700 border-amber-200",
    danger: isDark ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-red-50 text-red-700 border-red-200",
    neutral: isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-100 text-slate-600 border-slate-200",
    primary: isDark ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-[#0062FF]/10 text-[#0062FF] border-[#0062FF]/20"
  };
  return <span className={`px-2.5 py-1 rounded-md text-xs font-medium border whitespace-nowrap ${types[type]}`}>{children}</span>;
};

// --- COMPONENTES DA SIDEBAR ---

function NavItem({ icon, label, active, onClick, collapsed, isDark = true }) {
  const activeLight = "bg-[#0062FF] text-[#EBFF00] font-bold shadow-md";
  const inactiveLight = "text-slate-500 hover:bg-[#0062FF]/5 hover:text-[#0062FF] font-medium";
  const activeDark = "bg-blue-500/10 text-blue-400 font-semibold";
  const inactiveDark = "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200";

  const stateClass = active 
    ? (isDark ? activeDark : activeLight) 
    : (isDark ? inactiveDark : inactiveLight);

  return (
    <div className="relative group flex justify-center w-full">
      <button
        onClick={onClick}
        className={`
          flex items-center transition-colors duration-200 rounded-lg text-sm
          ${collapsed ? 'w-10 h-10 justify-center' : 'w-full px-3 py-2.5 gap-3'}
          ${stateClass}
        `}
      >
        <span className="shrink-0">{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
      </button>
      
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[100] shadow-lg hidden lg:block">
          {label}
        </div>
      )}
    </div>
  );
}

// --- GRÁFICOS OTIMIZADOS ---

function MonthlyComboChart({ data, isDark }) {
  const maxScore = 100;
  const maxVisits = Math.max(4, ...data.map(d => d.visits || 0));
  const gridVisitsMax = Math.ceil(maxVisits / 4) * 4;

  if (!data || data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-sm text-slate-500">Nenhum dado disponível.</div>;
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div 
        className="relative flex flex-col px-4 pt-6 pb-16" 
        style={{ minWidth: data.length > 6 ? `${data.length * 80}px` : '100%' }}
      >
        <div className="relative h-56 sm:h-64 flex items-end ml-8 sm:ml-10 mr-8 sm:mr-10">
          
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map((pct, i) => {
              const scoreVal = pct;
              const visitVal = (gridVisitsMax * (pct / 100));
              return (
                <div key={pct} className="w-full flex items-center gap-2 absolute" style={{ bottom: `${pct}%`, transform: 'translateY(50%)' }}>
                  <span className={`text-[10px] font-medium w-8 text-right absolute -left-10 sm:-left-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {scoreVal}%
                  </span>
                  <div className={`w-full h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
                  <span className={`text-[10px] font-medium w-8 text-left absolute -right-8 sm:-right-10 ${isDark ? 'text-indigo-500/50' : 'text-indigo-400'}`}>
                    {visitVal}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bars Wrapper */}
          <div className="relative w-full h-full flex items-end justify-around gap-4 z-20">
            {data.map((item, idx) => {
              const scoreHeight = (item.score / maxScore) * 100;
              const visitsHeight = gridVisitsMax > 0 ? (item.visits / gridVisitsMax) * 100 : 0;
              
              return (
                <div key={idx} className="flex-1 flex justify-center gap-1 sm:gap-2 h-full relative group" style={{ maxWidth: '80px' }}>
                  
                  {/* Score Bar */}
                  <div className="w-1/2 h-full flex flex-col justify-end items-center relative">
                    <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${scoreHeight}%` }}>
                      <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                        {item.score.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full rounded-t-sm transition-all duration-1000 ease-out bg-emerald-500 hover:bg-emerald-400" style={{ height: `${scoreHeight}%` }} />
                  </div>

                  {/* Visits Bar */}
                  <div className="w-1/2 h-full flex flex-col justify-end items-center relative">
                    <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${visitsHeight}%` }}>
                      <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                        {item.visits}
                      </span>
                    </div>
                    <div className="w-full rounded-t-sm transition-all duration-1000 ease-out bg-indigo-500 hover:bg-indigo-400" style={{ height: `${visitsHeight}%` }} />
                  </div>

                  {/* Month Label X Axis */}
                  <div className="absolute top-full mt-2 w-full flex justify-center">
                    <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} whitespace-nowrap`}>
                      {item.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

function IndicatorBarChart({ data, isDark }) {
  const maxCount = Math.max(4, ...data.map(d => d.count || 0));
  const gridMax = Math.ceil(maxCount / 4) * 4;
  const gridLines = [gridMax, gridMax * 0.75, gridMax * 0.5, gridMax * 0.25, 0];

  if (!data || data.length === 0) {
    return <div className="h-56 flex items-center justify-center text-sm text-slate-500">Nenhum dado disponível.</div>;
  }

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div 
        className="relative flex flex-col px-4 pt-6 pb-24" 
        style={{ minWidth: data.length > 6 ? `${data.length * 60}px` : '100%' }}
      >
        <div className="relative h-56 sm:h-64 flex items-end ml-8 sm:ml-10">
          
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {gridLines.map((val, i) => (
              <div key={i} className="w-full flex items-center gap-2 absolute" style={{ bottom: `${(val / gridMax) * 100}%`, transform: 'translateY(50%)' }}>
                <span className={`text-[10px] font-medium w-8 text-right absolute -left-10 sm:-left-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {val}
                </span>
                <div className={`w-full h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              </div>
            ))}
          </div>

          {/* Bars Wrapper */}
          <div className="relative w-full h-full flex items-end justify-around gap-2 z-20">
            {data.map((item, idx) => {
              const count = Number(item.count) || 0;
              const barHeight = gridMax > 0 ? (count / gridMax) * 100 : 0;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center relative h-full justify-end group" style={{ maxWidth: '50px' }}>
                  
                  {/* Rótulo Permanentemente Visível acima da barra */}
                  <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${barHeight}%` }}>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                      {count}
                    </span>
                  </div>

                  {/* Bar Container */}
                  <div className={`w-full relative transition-all duration-700 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} h-full flex flex-col justify-end rounded-t-sm overflow-hidden`}>
                    <div 
                      className="w-full rounded-t-sm transition-all duration-1000 ease-out bg-amber-500 hover:bg-amber-400"
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>

                  {/* Rotulo Eixo X (Nome do Indicador) */}
                  <div className="absolute top-full mt-2 w-full flex justify-center px-1">
                    <span 
                      className={`text-[9px] leading-tight text-center font-medium whitespace-normal break-words ${isDark ? 'text-slate-400' : 'text-slate-500'} w-14 sm:w-20 line-clamp-3`}
                      title={item.name}
                    >
                      {item.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

function VisitsBarChart({ data, isDark }) {
  const maxVisits = Math.max(4, ...data.map(d => d.visits || 0));
  const gridMax = Math.ceil(maxVisits / 4) * 4;
  const gridLines = [gridMax, gridMax * 0.75, gridMax * 0.5, gridMax * 0.25, 0];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div 
        className="relative flex flex-col px-4 pt-6 pb-16" 
        style={{ minWidth: data.length > 8 ? `${data.length * 50}px` : '100%' }}
      >
        <div className="relative h-56 sm:h-64 flex items-end ml-8 sm:ml-10">
          
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {gridLines.map((val, i) => (
              <div key={i} className="w-full flex items-center gap-2 absolute" style={{ bottom: `${(val / gridMax) * 100}%`, transform: 'translateY(50%)' }}>
                <span className={`text-[10px] font-medium w-8 text-right absolute -left-10 sm:-left-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {val}
                </span>
                <div className={`w-full h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              </div>
            ))}
          </div>

          {/* Bars Wrapper */}
          <div className="relative w-full h-full flex items-end justify-around gap-1 sm:gap-2 z-20">
            {data.map((item, idx) => {
              const visits = Number(item.visits) || 0;
              const barHeight = gridMax > 0 ? (visits / gridMax) * 100 : 0;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center relative h-full justify-end group" style={{ maxWidth: '50px' }}>
                  <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${barHeight}%` }}>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                      {visits}
                    </span>
                  </div>
                  <div className={`w-full relative transition-all duration-700 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} h-full flex flex-col justify-end rounded-t-sm overflow-hidden`}>
                    <div 
                      className="w-full rounded-t-sm transition-all duration-1000 ease-out bg-indigo-500 hover:bg-indigo-400"
                      style={{ height: `${barHeight}%` }}
                    />
                  </div>
                  <div className="absolute top-full mt-2 w-full flex justify-center">
                    <span 
                      className={`text-[9px] sm:text-[10px] font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} origin-top-left rotate-45 whitespace-nowrap`}
                      title={item.code}
                    >
                      {item.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

function ZeroedBarChart({ data, isDark }) {
  const maxZeroes = Math.max(4, ...data.map(d => d.zeroes || 0));
  const gridMax = Math.ceil(maxZeroes / 4) * 4;
  const gridLines = [gridMax, gridMax * 0.75, gridMax * 0.5, gridMax * 0.25, 0];

  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div 
        className="relative flex flex-col px-4 pt-6 pb-16" 
        style={{ minWidth: data.length > 8 ? `${data.length * 50}px` : '100%' }}
      >
        <div className="relative h-56 sm:h-64 flex items-end ml-8 sm:ml-10">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {gridLines.map((val, i) => (
              <div key={i} className="w-full flex items-center gap-2 absolute" style={{ bottom: `${(val / gridMax) * 100}%`, transform: 'translateY(50%)' }}>
                <span className={`text-[10px] font-medium w-8 text-right absolute -left-10 sm:-left-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {val}
                </span>
                <div className={`w-full h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              </div>
            ))}
          </div>
          <div className="relative w-full h-full flex items-end justify-around gap-1 sm:gap-2 z-20">
            {data.map((item, idx) => {
              const zeroes = Number(item.zeroes) || 0;
              const barHeight = gridMax > 0 ? (zeroes / gridMax) * 100 : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center relative h-full justify-end group" style={{ maxWidth: '50px' }}>
                  <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${barHeight}%` }}>
                    <span className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                      {zeroes}
                    </span>
                  </div>
                  <div className={`w-full relative transition-all duration-700 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} h-full flex flex-col justify-end rounded-t-sm overflow-hidden`}>
                    <div className="w-full rounded-t-sm transition-all duration-1000 ease-out bg-red-500 hover:bg-red-400" style={{ height: `${barHeight}%` }} />
                  </div>
                  <div className="absolute top-full mt-2 w-full flex justify-center">
                    <span className={`text-[9px] sm:text-[10px] font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} origin-top-left rotate-45 whitespace-nowrap`} title={item.code}>
                      {item.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function PerformanceBarChart({ data, isDark }) {
  const maxScore = 100;
  const target = META_GLOBAL;
  
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div 
        className="relative flex flex-col px-4 pt-6 pb-16" 
        style={{ minWidth: data.length > 8 ? `${data.length * 50}px` : '100%' }}
      >
        <div className="relative h-56 sm:h-64 flex items-end ml-8 sm:ml-10">
          
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map(val => (
              <div key={val} className="w-full flex items-center gap-2 absolute" style={{ bottom: `${val}%`, transform: 'translateY(50%)' }}>
                <span className={`text-[10px] font-medium w-8 text-right absolute -left-10 sm:-left-12 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {val}%
                </span>
                <div className={`w-full h-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              </div>
            ))}
          </div>

          <div className="absolute left-0 right-0 border-t border-dashed border-emerald-500 z-10 flex items-center" style={{ bottom: `${target}%` }}>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full absolute -left-4 -top-3 border ${isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
              Meta {target}%
            </span>
          </div>

          <div className="relative w-full h-full flex items-end justify-around gap-1 sm:gap-2 z-20">
            {data.map((item, idx) => {
              const parsedScore = Number(item.score) || 0;
              const isSuccess = parsedScore >= target;
              const barHeight = (parsedScore / maxScore) * 100;
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center relative h-full justify-end group" style={{ maxWidth: '50px' }}>
                  <div className="absolute w-full flex justify-center pb-1.5 transition-all duration-700" style={{ bottom: `${barHeight}%` }}>
                    <span className={`text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'} whitespace-nowrap`}>
                      {parsedScore.toFixed(0)}%
                    </span>
                  </div>
                  <div className={`w-full relative transition-all duration-700 ${isDark ? 'bg-slate-800/50' : 'bg-slate-100'} h-full flex flex-col justify-end rounded-t-sm overflow-hidden`}>
                    <div className={`w-full rounded-t-sm transition-all duration-1000 ease-out ${isSuccess ? 'bg-blue-500 hover:bg-blue-400' : 'bg-slate-400 hover:bg-slate-300'}`} style={{ height: `${barHeight}%` }} />
                  </div>
                  <div className="absolute top-full mt-2 w-full flex justify-center">
                    <span className={`text-[9px] sm:text-[10px] font-medium uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'} origin-top-left rotate-45 whitespace-nowrap`} title={item.code}>
                      {item.code}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- APLICAÇÃO PRINCIPAL ---

export default function App() {
  const [supabaseClient, setSupabaseClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  // Define a visibilidade inicial com base no tamanho da tela (para mobile começa fechado)
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [selectedEval, setSelectedEval] = useState(null);
  const [expandedImg, setExpandedImg] = useState(null);
  const [isDark, setIsDark] = useState(localStorage.getItem('vq_theme') !== 'light');
  const [db, setDb] = useState({ users: [], stores: [], evaluations: [], indicators: [], questions: [], channels: [], managers: [], userActivity: [] });

  useEffect(() => {
    let clientInstance = null;
    const initSupabase = async () => {
      try {
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js');
        if (!clientInstance) {
          clientInstance = createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: false, autoRefreshToken: false }
          });
          setSupabaseClient(clientInstance);
        }
      } catch (e) {
        console.error("Erro ao carregar Supabase:", e);
      }
    };
    initSupabase();

    const loggedUser = localStorage.getItem('vq_user');
    if (loggedUser) setUser(JSON.parse(loggedUser));
    
    // Ouve redimensionamento para ajustar o sidebar automaticamente
    const handleResize = () => {
      if (window.innerWidth > 1024) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (supabaseClient) fetchData();
  }, [supabaseClient]);

  useEffect(() => {
    localStorage.setItem('vq_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const fetchData = async () => {
    if (!supabaseClient) return;
    try {
      const [u, m, s, c, i, q, e, ua] = await Promise.all([
        supabaseClient.from('users').select('*'),
        supabaseClient.from('managers').select('*'),
        supabaseClient.from('stores').select('*'),
        supabaseClient.from('channels').select('*'),
        supabaseClient.from('indicators').select('*'),
        supabaseClient.from('questions').select('*'),
        supabaseClient.from('evaluations')
          .select('*, evaluation_details(id, question_id, answer, cp_validated)')
          .order('date', { ascending: false })
          .limit(10000),
        supabaseClient.from('user_activity').select('*')
      ]);

      const formattedEvals = keysToCamel(e.data || []).map(ev => ({
        ...ev,
        details: ev.evaluationDetails || []
      }));

      setDb({
        users: keysToCamel(u.data || []),
        managers: keysToCamel(m.data || []),
        stores: keysToCamel(s.data || []),
        channels: keysToCamel(c.data || []),
        indicators: keysToCamel(i.data || []),
        questions: keysToCamel(q.data || []),
        evaluations: formattedEvals,
        userActivity: keysToCamel(ua.data || [])
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleShowReport = async (ev) => {
    if (!supabaseClient) {
      setSelectedEval(ev);
      return;
    }
    try {
      const { data, error } = await supabaseClient
        .from('evaluation_details')
        .select('*')
        .eq('evaluation_id', ev.id);
        
      if (error) throw error;
      
      setSelectedEval({
        ...ev,
        details: keysToCamel(data || [])
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes da avaliação:", error);
      setSelectedEval(ev);
    }
  };

  const handleLogin = (email, password) => {
    supabaseClient.from('users').select('*').eq('email', email.toLowerCase()).single().then(async ({data}) => {
       if (data && data.password === password) {
         // Registra o login na tabela user_activity
         await supabaseClient.from('user_activity').insert({ user_id: data.id });

         const u = { 
           id: data.id, 
           name: data.name, 
           email: data.email, 
           role: data.role,
           storeId: data.store_id,
           accessibleStores: data.accessible_stores || []
         };
         setUser(u);
         localStorage.setItem('vq_user', JSON.stringify(u));
       } else alert("Dados de acesso incorretos.");
    });
  };

  const logout = () => {
    localStorage.removeItem('vq_user');
    window.location.reload();
  };

  // Wrapper para fechar o sidebar no mobile ao clicar num link
  const navClick = (tab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  if (loading || !supabaseClient) return (
    <div className={`h-screen w-full flex flex-col items-center justify-center text-center transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className={`w-10 h-10 border-4 border-t-transparent rounded-full animate-spin ${isDark ? 'border-blue-600' : 'border-[#0062FF]'}`}></div>
      <p className={`mt-4 text-sm font-medium ${isDark ? 'text-slate-400' : 'text-[#0062FF]'} animate-pulse`}>Carregando sistema...</p>
    </div>
  );

  if (!user) return <LoginView onLogin={handleLogin} />;

  const isAdmin = user.role === 'admin';

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* OVERLAY MOBILE PARA SIDEBAR */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col no-print transition-all duration-300 border-r
        ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}
        ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'}
      `}>
        <div className="p-6 flex items-center justify-center min-h-[80px]">
          <img 
            src={isSidebarOpen ? "/logo.svg" : "/icons.svg"} 
            alt="Logo" 
            className={`transition-all duration-300 object-contain ${isSidebarOpen ? 'w-full h-10 sm:h-12' : 'w-8 h-8 shrink-0'}`} 
            onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12l10 5 10-5'/%3E%3C/svg%3E"; }} 
          />
        </div>

        <nav className="mt-6 px-3 flex-1 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem icon={<LayoutDashboard size={18}/>} label="Visão Geral" active={activeTab === 'home'} onClick={() => navClick('home')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<BarChart3 size={18}/>} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => navClick('dashboard')} collapsed={!isSidebarOpen} isDark={isDark} />
          <NavItem icon={<History size={18}/>} label="Histórico" active={activeTab === 'histórico'} onClick={() => navClick('histórico')} collapsed={!isSidebarOpen} isDark={isDark} />
          
          {isAdmin && (
            <div className="pt-6">
              {isSidebarOpen ? (
                <div className={`text-xs font-semibold uppercase tracking-wider mb-3 px-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Administração</div>
              ) : (
                <div className={`h-px my-6 mx-3 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
              )}
              <div className="space-y-1">
                <NavItem icon={<Activity size={18}/>} label="Acessos" active={activeTab === 'acessos'} onClick={() => navClick('acessos')} collapsed={!isSidebarOpen} isDark={isDark} />
                <NavItem icon={<PlusCircle size={18}/>} label="Nova Auditoria" active={activeTab === 'new'} onClick={() => navClick('new')} collapsed={!isSidebarOpen} isDark={isDark} />
                <NavItem icon={<Settings size={18}/>} label="Configurações" active={activeTab === 'settings'} onClick={() => navClick('settings')} collapsed={!isSidebarOpen} isDark={isDark} />
              </div>
            </div>
          )}
        </nav>

        <div className="p-4">
           <NavItem icon={<LogOut size={18} />} label="Sair" active={false} onClick={logout} collapsed={!isSidebarOpen} isDark={isDark} />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 transition-all duration-300 flex flex-col h-screen w-full ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <header className={`sticky top-0 z-30 backdrop-blur-xl px-4 sm:px-6 md:px-8 py-4 flex items-center justify-between border-b no-print transition-colors ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => setSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg transition-colors block ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-600'}`}>
              <Menu size={20} />
            </button>
            <h2 className={`text-lg md:text-xl font-semibold capitalize truncate max-w-[150px] sm:max-w-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {activeTab === 'settings' ? 'Configurações do Sistema' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-lg border transition-colors shrink-0 ${isDark ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              title={isDark ? "Modo Claro" : "Modo Escuro"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden sm:flex flex-col items-end">
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.name}</span>
              <span className="text-xs text-slate-500 capitalize">{user.role === 'manager' ? 'Gestora' : user.role === 'admin' ? 'Admin' : 'Supervisora'}</span>
            </div>
            <div className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-[#EBFF00] text-[#0062FF] shadow-sm'}`}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        <div id="content-container" className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto no-print">
          {activeTab === 'home' && <HomeView db={db} user={user} setActiveTab={navClick} onShowReport={handleShowReport} isDark={isDark} />}
          {activeTab === 'dashboard' && <DashboardView db={db} user={user} isDark={isDark} />}
          {activeTab === 'histórico' && <HistoryView db={db} user={user} onShowReport={handleShowReport} isDark={isDark} supabaseClient={supabaseClient} fetchData={fetchData} />}
          {activeTab === 'acessos' && isAdmin && <AccessLogView db={db} isDark={isDark} />}
          {activeTab === 'new' && isAdmin && <NewAuditView db={db} supabaseClient={supabaseClient} onComplete={() => { fetchData(); navClick('histórico'); }} isDark={isDark} />}
          {activeTab === 'settings' && isAdmin && <ManagementView db={db} supabaseClient={supabaseClient} fetchData={fetchData} isDark={isDark} />}
        </div>
      </main>

      {/* MODAL DE RELATÓRIO */}
      {selectedEval && (
        <div id="report-portal" className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 md:p-6">
          <div className={`${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} w-full max-w-5xl h-full sm:h-auto max-h-full sm:max-h-[90vh] overflow-hidden sm:rounded-2xl border shadow-xl flex flex-col relative animate-in zoom-in-95 duration-200`}>
            <div className={`px-4 sm:px-6 py-4 border-b flex justify-between items-center transition-colors modal-header-actions shrink-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-2 sm:gap-3">
                <img src="/logo.svg" alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 object-contain" onError={(e) => { e.target.onerror = null; e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5z'/%3E%3Cpath d='M2 17l10 5 10-5'/%3E%3Cpath d='M2 12l10 5 10-5'/%3E%3C/svg%3E"; }} />
                <h3 className={`font-semibold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'} truncate`}>Relatório de Auditoria</h3>
              </div>
              <div className="flex gap-2 no-print shrink-0">
                <Button variant="outline" onClick={() => window.print()} className="py-2 text-xs hidden sm:flex" isDark={isDark}><Printer size={16}/> Imprimir</Button>
                <button onClick={() => setSelectedEval(null)} className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}><X size={20}/></button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 lg:p-8">
              <ReportContent evaluation={selectedEval} db={db} isDark={isDark} onExpandImage={setExpandedImg} />
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZADOR DE IMAGEM EXPANDIDA */}
      {expandedImg && (
        <div 
          className="fixed inset-0 z-[2000] bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200 no-print"
          onClick={() => setExpandedImg(null)}
        >
          <button className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-colors bg-slate-800/50 p-2 rounded-full">
            <X size={24} />
          </button>
          <img 
            src={expandedImg} 
            alt="Evidência Expandida" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
          />
        </div>
      )}

      <style>{`
        @media print {
          body, html { 
            background: white !important; 
            color: black !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            height: auto !important;
            overflow: visible !important;
          }
          div, main, #root {
            overflow: visible !important;
            height: auto !important;
            min-height: auto !important;
            max-height: none !important;
            flex: none !important;
            display: block !important;
          }
          * {
            color-scheme: light !important;
          }
          #report-portal, #report-portal *, #report-portal p, #report-portal h3, #report-portal h4, #report-portal h5, #report-portal span {
            color: black !important;
            background-color: transparent !important;
            border-color: #e2e8f0 !important;
          }
          .no-print, aside, header, #content-container, .modal-header-actions button, .modal-header-actions .no-print { 
            display: none !important; 
          }
          #report-portal {
            display: block !important;
            position: relative !important;
            left: auto !important;
            top: auto !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            background: white !important;
            color: black !important;
            z-index: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            backdrop-filter: none !important;
            background-color: white !important;
          }
          #report-portal > div {
            border: none !important;
            box-shadow: none !important;
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          #report-portal .overflow-y-auto {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            padding: 0 !important;
          }
          @page { 
            size: portrait; 
            margin: 15mm 10mm; 
          }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

// --- VIEWS ---

function HomeView({ db, user, setActiveTab, onShowReport, isDark }) {
  const auditList = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.evaluations, user]);
  
  const avg = useMemo(() => {
    if (!auditList.length) return "0.00";
    const totalScore = auditList.reduce((acc, b) => acc + (Number(b.score) || 0), 0);
    return (totalScore / auditList.length).toFixed(2);
  }, [auditList]);

  const criticalCount = auditList.filter(e => (Number(e.score) || 0) < 80).length;

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-300">
      {/* HEADER BANNER */}
      <div className={`p-6 sm:p-8 md:p-10 rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-[#0062FF] border-transparent'} shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden`}>
        <div className="relative z-10 w-full">
          <h1 className={`text-2xl md:text-3xl font-black text-white`}>Portal Qualidade e Conformidade</h1>
          <p className={`mt-2 text-sm md:text-base ${isDark ? 'text-slate-400' : 'text-white/90'} max-w-xl`}>Sistema centralizado de gestão técnica, auditorias de padronização e visualização de indicadores da rede.</p>
          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
            <Button onClick={() => setActiveTab('dashboard')} className="w-full sm:w-auto" variant={isDark ? "primary" : "secondary"} isDark={isDark}><BarChart3 size={16}/> Ver Dashboard</Button>
            {user.role === 'admin' && <Button variant="primary" className="w-full sm:w-auto" onClick={() => setActiveTab('new')} isDark={isDark}><PlusCircle size={16}/> Nova Avaliação</Button>}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-5 dark:opacity-10 pointer-events-none hidden md:block">
           <ShieldCheck className={`w-full h-full scale-150 transform translate-x-1/4 ${isDark ? 'text-blue-600' : 'text-white'}`} />
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard isDark={isDark} title="Média de Desempenho" value={`${avg}%`} icon={<TrendingUp className="text-emerald-500" size={24}/>} />
        <StatCard isDark={isDark} title="Alertas de Conformidade" value={criticalCount} icon={<AlertCircle className="text-amber-500" size={24}/>} />
        <StatCard isDark={isDark} title="Unidades Ativas" value={db.stores.length} icon={<Store className="text-blue-500" size={24}/>} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <Clock size={18} className={isDark ? "text-blue-500" : "text-[#0062FF]"}/> Registros Recentes
          </h3>
          <div className="space-y-3">
            {auditList.slice(0, 5).map((ev, idx) => { 
              const store = db.stores.find(s => s.id === ev.storeId); 
              const score = Number(ev.score) || 0;
              return (
                <Card key={ev.id} isDark={isDark} className={`p-4 flex items-center gap-3 md:gap-4 transition-colors cursor-pointer ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-50'}`} onClick={() => onShowReport(ev)}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${score >= 80 ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600') : (isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-600')}`}>
                    {score >= 80 ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>Auditoria em <span className="font-semibold">{store?.name}</span></p>
                    <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Por {ev.evaluator} em {ev.date ? new Date(ev.date).toLocaleDateString('pt-BR') : '---'}</p>
                  </div>
                  <div className={`font-semibold text-sm px-2 sm:px-2.5 py-1 rounded-md shrink-0 ${score >= 80 ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700') : (isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700')}`}>
                    {score.toFixed(1)}%
                  </div>
                </Card>
              ); 
            })}
            {auditList.length === 0 && <p className="text-sm text-slate-500 py-4">Nenhum registro encontrado.</p>}
          </div>
        </div>

        <div className="lg:col-span-1 h-full">
          <Card isDark={isDark} className={`p-6 h-full flex flex-col justify-center items-center text-center border-none min-h-[250px] relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-600 to-indigo-700' : 'bg-[#0062FF]'}`}>
            {!isDark && <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#EBFF00]/20 rounded-full blur-3xl pointer-events-none"></div>}
            <h4 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6 z-10">Média Geral da Rede</h4>
            <div className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full border-8 flex items-center justify-center mb-4 sm:mb-6 z-10 ${isDark ? 'border-blue-400/30' : 'border-[#EBFF00] bg-[#0062FF] shadow-[0_0_20px_rgba(235,255,0,0.3)]'}`}>
              <span className={`text-4xl sm:text-5xl font-black ${isDark ? 'text-white' : 'text-[#EBFF00]'}`}>{avg}<span className="text-xl sm:text-2xl">%</span></span>
            </div>
            <p className="text-xs sm:text-sm text-white/90 max-w-[200px] z-10">Representa o índice consolidado de aderência aos padrões de qualidade.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ManagementView({ db, supabaseClient, fetchData, isDark }) {
  const [activeSubTab, setActiveSubTab] = useState('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterChannelId, setFilterChannelId] = useState('all');

  const config = {
    users: { title: "Usuários", icon: <Users size={16}/>, table: "users" },
    managers: { title: "Gestoras", icon: <UserCheck size={16}/>, table: "managers" },
    stores: { title: "Lojas", icon: <Store size={16}/>, table: "stores" },
    channels: { title: "Canais", icon: <Layers size={16}/>, table: "channels" },
    indicators: { title: "Indicadores", icon: <Target size={16}/>, table: "indicators" },
    questions: { title: "Perguntas", icon: <FileText size={16}/>, table: "questions" }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este registro?")) return;
    const { error } = await supabaseClient.from(config[activeSubTab].table).delete().eq('id', id);
    if (error) alert("Erro ao excluir: " + error.message);
    else fetchData();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const payload = {};
    Object.keys(data).forEach(key => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (snakeKey === 'accessible_stores') {
        payload[snakeKey] = data[key] ? data[key].split(',').map(id => parseInt(id.trim())) : [];
      } else {
        payload[snakeKey] = data[key] === "" ? null : data[key];
      }
    });

    let action;
    if (editingItem) action = supabaseClient.from(config[activeSubTab].table).update(payload).eq('id', editingItem.id);
    else action = supabaseClient.from(config[activeSubTab].table).insert([payload]);

    const { error } = await action;
    if (error) alert("Erro ao salvar: " + error.message);
    else { setIsModalOpen(false); setEditingItem(null); fetchData(); }
  };

  const filteredData = useMemo(() => {
    let list = db[activeSubTab] || [];
    if (filterChannelId === 'all') return list;
    if (activeSubTab === 'stores' || activeSubTab === 'indicators') return list.filter(item => item.channelId == filterChannelId);
    if (activeSubTab === 'questions') return list.filter(q => db.indicators.find(i => i.id == q.indicatorId)?.channelId == filterChannelId);
    return list;
  }, [db, activeSubTab, filterChannelId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Configurações</h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Gerenciamento da estrutura do portal.</p>
        </div>
        <Button onClick={() => { setEditingItem(null); setIsModalOpen(true); }} className="w-full sm:w-auto" isDark={isDark}><Plus size={16}/> Novo Registro</Button>
      </div>

      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar w-full pb-2 md:pb-0">
          {Object.entries(config).map(([key, val]) => (
            <button key={key} onClick={() => setActiveSubTab(key)} className={`flex items-center gap-2 pb-2 md:pb-3 text-sm transition-colors border-b-2 whitespace-nowrap shrink-0 ${activeSubTab === key ? (isDark ? 'border-blue-500 text-blue-400 font-medium' : 'border-[#0062FF] text-[#0062FF] font-bold') : `border-transparent font-medium ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-[#0062FF]'}`}`}>{val.icon} {val.title}</button>
          ))}
        </div>
        {['stores', 'indicators', 'questions'].includes(activeSubTab) && (
          <div className="flex items-center gap-2 pb-3 shrink-0">
            <Filter size={14} className="text-slate-400" />
            <select className={`bg-transparent text-sm font-medium outline-none cursor-pointer w-full sm:w-auto ${isDark ? 'text-slate-300' : 'text-slate-700'}`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}>
              <option value="all">Todos os Canais</option>
              {db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
      </div>

      <Card isDark={isDark} className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} font-medium`}>
              <tr><th className="px-4 sm:px-6 py-3">Informação</th><th className="px-4 sm:px-6 py-3">Detalhes</th><th className="px-4 sm:px-6 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {filteredData.map(item => (
                <tr key={item.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} transition-colors group`}>
                  <td className="px-4 sm:px-6 py-4">
                    <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'} max-w-[200px] sm:max-w-xs truncate`}>{item.name || item.text}</p>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.email || item.code || `ID: ${item.id}`}</p>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    {activeSubTab === 'users' && <Badge isDark={isDark} type={item.role === 'admin' ? 'primary' : 'neutral'}>{item.role === 'admin' ? 'Admin' : item.role === 'manager' ? 'Gestora' : 'Supervisor'}</Badge>}
                    {activeSubTab === 'managers' && <Badge isDark={isDark} type={item.status === 'Ativa' ? 'success' : 'neutral'}>{item.status}</Badge>}
                    {activeSubTab === 'stores' && <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{db.channels.find(c => c.id == item.channelId)?.name}</span>}
                    {activeSubTab === 'questions' && <Badge isDark={isDark} type={item.severity === 'gravissima' ? 'danger' : item.severity === 'grave' ? 'warning' : 'neutral'}>{item.severity}</Badge>}
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(item)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}><Edit3 size={16}/></button>
                      <button onClick={() => handleDelete(item.id)} className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-red-900/30 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-sm text-slate-500">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <Card isDark={isDark} className="w-full max-w-lg p-5 sm:p-8 animate-in zoom-in-95 duration-200 max-h-full overflow-y-auto">
            <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{editingItem ? 'Editar' : 'Novo'} {config[activeSubTab].title}</h3>
            <form onSubmit={handleSave} className="space-y-4 text-left">
              {activeSubTab === 'users' && (<UserForm editingItem={editingItem} db={db} isDark={isDark} />)}
              {activeSubTab === 'managers' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Status" name="status" isDark={isDark} defaultValue={editingItem?.status}><option value="Ativa">Ativa</option><option value="Férias">Férias</option><option value="Desligada">Desligada</option></FormSelect></>)}
              {activeSubTab === 'stores' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormInput label="Código" name="code" isDark={isDark} defaultValue={editingItem?.code} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect><FormSelect label="Gestora" name="managerId" isDark={isDark} defaultValue={editingItem?.managerId}><option value="">Selecione...</option>{db.managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'channels' && <FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required />}
              {activeSubTab === 'indicators' && (<><FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required /><FormSelect label="Canal" name="channelId" isDark={isDark} defaultValue={editingItem?.channelId}>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</FormSelect></>)}
              {activeSubTab === 'questions' && (<><FormInput label="Texto" name="text" isDark={isDark} defaultValue={editingItem?.text} required /><FormSelect label="Gravidade" name="severity" isDark={isDark} defaultValue={editingItem?.severity}><option value="leve">Leve</option><option value="media">Média</option><option value="grave">Grave</option><option value="gravissima">Gravíssima</option></FormSelect><FormSelect label="Indicador" name="indicatorId" isDark={isDark} defaultValue={editingItem?.indicatorId}>{db.indicators.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</FormSelect></>)}
              
              <div className="pt-6 flex flex-col-reverse sm:flex-row gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} isDark={isDark} className="flex-1 w-full">Cancelar</Button>
                <Button type="submit" isDark={isDark} className="flex-1 w-full">Salvar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

function UserForm({ editingItem, db, isDark }) {
  const [role, setRole] = useState(editingItem?.role || 'manager');
  return (
    <>
      <FormInput label="Nome" name="name" isDark={isDark} defaultValue={editingItem?.name} required />
      <FormInput label="E-mail" name="email" isDark={isDark} type="email" defaultValue={editingItem?.email} required />
      <FormInput label="Senha" name="password" isDark={isDark} defaultValue={editingItem?.password || ''} required type="password" />
      <FormSelect label="Função" name="role" isDark={isDark} value={role} onChange={e => setRole(e.target.value)}><option value="admin">Administrador</option><option value="manager">Gestora</option><option value="supervisor">Supervisora</option></FormSelect>
      {role === 'manager' && (<FormSelect label="Unidade Vinculada (Obrigatório)" isDark={isDark} name="storeId" defaultValue={editingItem?.storeId} required><option value="">Selecione a loja...</option>{db.stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</FormSelect>)}
      {role === 'supervisor' && (<div className="space-y-1.5"><label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Lojas Acessíveis (IDs separados por vírgula)</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20'}`} name="accessibleStores" placeholder="Ex: 1, 4, 12" defaultValue={editingItem?.accessibleStores?.join(', ')} /></div>)}
    </>
  );
}

function DashboardView({ db, user, isDark }) {
  const [filterChannel, setFilterChannel] = useState('all');
  const [filterMonth, setFilterMonth] = useState(""); 

  const filteredEvals = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    
    return list.filter(ev => {
      const store = db.stores.find(s => s.id == ev.storeId);
      const evalChannelId = ev.channelId || store?.channelId; // Obtém o canal da avaliação ou deduz pela Loja
      const matchChannel = filterChannel === 'all' || evalChannelId == filterChannel;
      const matchMonth = filterMonth === '' || ev.date?.startsWith(filterMonth);
      return matchChannel && matchMonth;
    });
  }, [db.evaluations, db.stores, user, filterChannel, filterMonth]);

  const stats = useMemo(() => {
    if (!filteredEvals.length) return { audits: 0, stores: 0, conf: "0.00", inconf: "0.00" };
    const uniqueStores = new Set(filteredEvals.map(e => e.storeId)).size;
    
    const totalScore = filteredEvals.reduce((acc, ev) => acc + (Number(ev.score) || 0), 0);
    const avgConf = totalScore / filteredEvals.length;
    
    return { 
      audits: filteredEvals.length, 
      stores: uniqueStores, 
      conf: avgConf.toFixed(2), 
      inconf: Math.max(0, 100 - avgConf).toFixed(2) 
    };
  }, [filteredEvals]);

  const rankings = useMemo(() => {
    const storeMap = {};
    const managerMap = {};
    filteredEvals.forEach(ev => {
      const scoreNum = Number(ev.score) || 0;
      if (!storeMap[ev.storeId]) {
        const sObj = db.stores.find(s => s.id == ev.storeId);
        storeMap[ev.storeId] = { sum: 0, count: 0, visits: 0, name: sObj?.name || '---', code: sObj?.code || '---' };
      }
      storeMap[ev.storeId].sum += scoreNum;
      storeMap[ev.storeId].count++;
      storeMap[ev.storeId].visits++;
      
      const store = db.stores.find(s => s.id == ev.storeId);
      if (store?.managerId) {
        if (!managerMap[store.managerId]) managerMap[store.managerId] = { sum: 0, count: 0 };
        managerMap[store.managerId].sum += scoreNum;
        managerMap[store.managerId].count++;
      }
    });
    return {
      storeRank: Object.keys(storeMap).map(id => ({ id, code: storeMap[id].code, name: storeMap[id].name, score: storeMap[id].sum / storeMap[id].count, visits: storeMap[id].visits })).sort((a,b) => b.score - a.score),
      managerRank: Object.keys(managerMap).map(id => ({ name: db.managers.find(m => m.id == id)?.name || '---', score: managerMap[id].sum / managerMap[id].count })).sort((a,b) => b.score - a.score)
    };
  }, [filteredEvals, db.stores, db.managers]);

  const zeroesData = useMemo(() => {
    const storeMap = {};
    filteredEvals.forEach(ev => {
      if (!storeMap[ev.storeId]) {
        const sObj = db.stores.find(s => s.id == ev.storeId);
        storeMap[ev.storeId] = { code: sObj?.code || '---', name: sObj?.name || '---', zeroes: 0 };
      }
      if (ev.score !== null && Number(ev.score) === 0) {
        storeMap[ev.storeId].zeroes++;
      }
    });
    return Object.values(storeMap).sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true }));
  }, [filteredEvals, db.stores]);

  const monthlyStats = useMemo(() => {
    const monthMap = {};
    filteredEvals.forEach(ev => {
      if (!ev.date) return;
      const m = ev.date.substring(0, 7); 
      if (!monthMap[m]) monthMap[m] = { visits: 0, scoreSum: 0 };
      monthMap[m].visits++;
      monthMap[m].scoreSum += (Number(ev.score) || 0);
    });
    return Object.keys(monthMap).sort().map(m => ({
      month: m,
      label: `${m.split('-')[1]}/${m.split('-')[0].slice(-2)}`, // YYYY-MM to MM/YY to save space
      visits: monthMap[m].visits,
      score: monthMap[m].scoreSum / monthMap[m].visits
    }));
  }, [filteredEvals]);

  const indicatorProblems = useMemo(() => {
    const counts = {};
    filteredEvals.forEach(ev => {
      ev.details?.forEach(det => {
        if (det.answer === 'inconforme') {
          const q = db.questions.find(q => q.id == det.questionId);
          if (q) {
            const indId = q.indicatorId;
            counts[indId] = (counts[indId] || 0) + 1;
          }
        }
      });
    });
    return Object.keys(counts).map(indId => {
      const ind = db.indicators.find(i => i.id == indId);
      return {
        id: indId,
        name: ind ? ind.name : 'Desconhecido',
        count: counts[indId]
      };
    }).sort((a, b) => b.count - a.count);
  }, [filteredEvals, db.questions, db.indicators]);

  const topProblems = useMemo(() => {
    const counts = {};
    filteredEvals.forEach(ev => { ev.details?.forEach(det => { if (det.answer === 'inconforme') counts[det.questionId] = (counts[det.questionId] || 0) + 1; }); });
    return Object.keys(counts).map(qid => ({ text: db.questions.find(q => q.id == qid)?.text || 'Pergunta Removida', count: counts[qid] })).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredEvals, db.questions]);

  // --- LÓGICA CONSOLIDADA PARA AS MATRIZES ---
  const formatMonth = (m) => {
    if (!m) return "";
    const [year, month] = m.split('-');
    return `${month}/${year}`;
  };

  const { matrixMonths, matrixData, matrixTotals } = useMemo(() => {
    const monthsSet = new Set();
    filteredEvals.forEach(ev => {
      if (ev.date) monthsSet.add(ev.date.substring(0, 7)); // Formato YYYY-MM
    });
    const months = Array.from(monthsSet).sort(); // Ordenar cronologicamente

    const totals = { globalVisits: 0, globalScoreSum: 0, globalZeroes: 0, globalIndCounts: {}, monthData: {} };
    months.forEach(m => totals.monthData[m] = { visits: 0, scoreSum: 0, indCounts: {}, indicators: [] });

    const storeMap = {};
    filteredEvals.forEach(ev => {
      if (!storeMap[ev.storeId]) {
        const store = db.stores.find(s => s.id == ev.storeId);
        storeMap[ev.storeId] = {
          storeId: ev.storeId,
          storeName: store?.name || 'Desconhecida',
          storeCode: store?.code || 'N/A',
          evals: [],
          zeroedVisits: 0
        };
      }
      storeMap[ev.storeId].evals.push(ev);

      if (ev.score !== null && Number(ev.score) === 0) {
        storeMap[ev.storeId].zeroedVisits++;
        totals.globalZeroes++;
      }

      // Calcular Totais (Mês e Global)
      const m = ev.date?.substring(0, 7);
      if (m && totals.monthData[m]) {
         totals.monthData[m].visits++;
         totals.monthData[m].scoreSum += (Number(ev.score) || 0);
      }
      totals.globalVisits++;
      totals.globalScoreSum += (Number(ev.score) || 0);
    });

    const data = Object.values(storeMap).map(storeObj => {
      const monthData = {};
      const totalIndCounts = {};

      months.forEach(m => {
         const mEvals = storeObj.evals.filter(ev => ev.date && ev.date.startsWith(m));
         const visits = mEvals.length;
         const scoreSum = mEvals.reduce((acc, ev) => acc + (Number(ev.score) || 0), 0);
         
         const mIndCounts = {};
         
         mEvals.forEach(ev => {
             ev.details?.forEach(det => {
                 if (det.answer === 'inconforme') {
                     const q = db.questions.find(q => q.id == det.questionId);
                     if (q && q.indicatorId) {
                         const indName = db.indicators.find(i => i.id == q.indicatorId)?.name || 'Desconhecido';
                         mIndCounts[indName] = (mIndCounts[indName] || 0) + 1;
                         totalIndCounts[indName] = (totalIndCounts[indName] || 0) + 1;

                         // Adicionar aos totais da rede
                         totals.monthData[m].indCounts[indName] = (totals.monthData[m].indCounts[indName] || 0) + 1;
                         totals.globalIndCounts[indName] = (totals.globalIndCounts[indName] || 0) + 1;
                     }
                 }
             });
         });

         monthData[m] = {
           visits,
           score: visits > 0 ? scoreSum / visits : null,
           indicators: Object.entries(mIndCounts).map(([name, count]) => ({name, count})).sort((a, b) => b.count - a.count)
         };
      });

      const totalVisits = storeObj.evals.length;
      const totalScoreSum = storeObj.evals.reduce((acc, ev) => acc + (Number(ev.score) || 0), 0);

      return {
        storeName: storeObj.storeName,
        storeCode: storeObj.storeCode,
        monthData,
        totalVisits,
        totalScore: totalVisits > 0 ? totalScoreSum / totalVisits : null,
        zeroedVisits: storeObj.zeroedVisits,
        totalIndicators: Object.entries(totalIndCounts).map(([name, count]) => ({name, count})).sort((a, b) => b.count - a.count)
      };
    }).sort((a, b) => String(a.storeCode).localeCompare(String(b.storeCode), undefined, { numeric: true }));

    // Formatar os objetos de totais de indicadores para arrays para facilitar a renderização
    months.forEach(m => {
        totals.monthData[m].indicators = Object.entries(totals.monthData[m].indCounts).map(([name, count]) => ({name, count})).sort((a, b) => b.count - a.count);
    });
    totals.globalIndicators = Object.entries(totals.globalIndCounts).map(([name, count]) => ({name, count})).sort((a, b) => b.count - a.count);

    return { matrixMonths: months, matrixData: data, matrixTotals: totals };
  }, [filteredEvals, db.stores, db.questions, db.indicators]);

  const handleExportCSV = (type) => {
    let csvContent = "";
    
    // Configura o Cabeçalho
    const headers = ["Cód. Loja", "Nome da Loja"];
    matrixMonths.forEach(m => headers.push(`"${formatMonth(m)}"`));
    headers.push(`"Geral (Rede)"`);
    
    if (type === 'performance') headers.push(`"Visitas Zeradas"`);
    
    csvContent += headers.join(";") + "\r\n";
    
    // Adiciona as Linhas das Lojas
    matrixData.forEach(row => {
      const rowData = [`"${row.storeCode}"`, `"${row.storeName}"`];
      
      matrixMonths.forEach(m => {
        if (type === 'performance') {
            const score = row.monthData[m].score;
            const visits = row.monthData[m].visits;
            const scoreStr = score !== null ? `${score.toFixed(1).replace('.', ',')}%` : '-';
            const visitStr = visits > 0 ? ` (${visits} vis)` : '';
            rowData.push(`"${scoreStr}${visitStr}"`);
        } else {
            const inds = row.monthData[m].indicators;
            if (inds && inds.length > 0) {
                rowData.push(`"${inds.map(i => `${i.name} (${i.count}x)`).join(', ')}"`);
            } else {
                rowData.push(`"-"`);
            }
        }
      });
      
      if (type === 'performance') {
          const totScore = row.totalScore !== null ? `${row.totalScore.toFixed(1).replace('.', ',')}%` : '-';
          const totVisits = row.totalVisits > 0 ? ` (${row.totalVisits} vis)` : '';
          rowData.push(`"${totScore}${totVisits}"`);
          rowData.push(`"${row.zeroedVisits}"`);
      } else {
          const inds = row.totalIndicators;
          if (inds && inds.length > 0) {
              rowData.push(`"${inds.map(i => `${i.name} (${i.count}x)`).join(', ')}"`);
          } else {
              rowData.push(`"-"`);
          }
      }
      
      csvContent += rowData.join(";") + "\r\n";
    });

    // Adiciona a Linha de Total
    const totalRow = [`"-"`, `"TOTAL DA REDE"`];
    matrixMonths.forEach(m => {
        if (type === 'performance') {
            const mVisits = matrixTotals.monthData[m].visits;
            const mScore = mVisits > 0 ? (matrixTotals.monthData[m].scoreSum / mVisits) : null;
            const scoreStr = mScore !== null ? `${mScore.toFixed(1).replace('.', ',')}%` : '-';
            const visitStr = mVisits > 0 ? ` (${mVisits} vis)` : '';
            totalRow.push(`"${scoreStr}${visitStr}"`);
        } else {
            const inds = matrixTotals.monthData[m].indicators;
            if (inds && inds.length > 0) {
                totalRow.push(`"${inds.map(i => `${i.name} (${i.count}x)`).join(', ')}"`);
            } else {
                totalRow.push(`"-"`);
            }
        }
    });
    
    if (type === 'performance') {
        const globalScore = matrixTotals.globalVisits > 0 ? (matrixTotals.globalScoreSum / matrixTotals.globalVisits) : null;
        const gsStr = globalScore !== null ? `${globalScore.toFixed(1).replace('.', ',')}%` : '-';
        const gvStr = matrixTotals.globalVisits > 0 ? ` (${matrixTotals.globalVisits} vis)` : '';
        totalRow.push(`"${gsStr}${gvStr}"`);
        totalRow.push(`"${matrixTotals.globalZeroes}"`);
    } else {
        const inds = matrixTotals.globalIndicators;
        if (inds && inds.length > 0) {
            totalRow.push(`"${inds.map(i => `${i.name} (${i.count}x)`).join(', ')}"`);
        } else {
            totalRow.push(`"-"`);
        }
    }

    csvContent += totalRow.join(";") + "\r\n";
    
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `matriz_${type}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Visão Geral de Dados</h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Acompanhe o desempenho da rede comercial.</p>
        </div>
      </div>

      <Card isDark={isDark} className="p-4 sm:p-6 no-print">
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
          <div className="space-y-1.5 w-full sm:flex-1 sm:min-w-[200px]">
            <label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Filter size={14}/> Filtro por Canal</label>
            <select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={filterChannel} onChange={e => setFilterChannel(e.target.value)}>
              <option value="all">Todos os Canais</option>
              {db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-1.5 w-full sm:flex-1 sm:min-w-[200px]">
            <label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Calendar size={14}/> Mês Referência</label>
            <input type="month" className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
          </div>
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => { setFilterChannel('all'); setFilterMonth(""); }} isDark={isDark}>Limpar Filtros</Button>
        </div>
      </Card>

      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard isDark={isDark} title="Auditorias" value={stats.audits} icon={<ClipboardCheck className="text-blue-500" size={20}/>} />
        <StatCard isDark={isDark} title="Lojas" value={stats.stores} icon={<Store className="text-indigo-500" size={20}/>} />
        <StatCard isDark={isDark} title="Conformidade" value={`${stats.conf}%`} icon={<TrendingUp className="text-emerald-500" size={20}/>} />
        <StatCard isDark={isDark} title="Falhas" value={`${stats.inconf}%`} icon={<TrendingDown className="text-red-500" size={20}/>} />
      </section>

      {/* GRÁFICO: Evolução Mensal */}
      <Card isDark={isDark} className="p-4 sm:p-6 relative min-h-[400px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Calendar className="text-emerald-500 shrink-0" size={18}/> 
            <span className="truncate">Pontuação vs Visitas</span>
          </h3>
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0"></div> Média Score</div>
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 shrink-0"></div> Qtd. Visitas</div>
          </div>
        </div>
        <MonthlyComboChart data={monthlyStats} isDark={isDark} />
      </Card>

      {/* GRÁFICO: Inconformidades por Indicador */}
      <Card isDark={isDark} className="p-4 sm:p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <AlertTriangle className="text-amber-500" size={18}/> Inconformidades
          </h3>
        </div>
        <IndicatorBarChart data={indicatorProblems} isDark={isDark} />
      </Card>

      {/* GRÁFICO: Visitas por Loja */}
      <Card isDark={isDark} className="p-4 sm:p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Store className="text-indigo-500" size={18}/> Visitas por Loja
          </h3>
        </div>
        <VisitsBarChart data={[...rankings.storeRank].sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true }))} isDark={isDark} />
      </Card>

      {/* GRÁFICO: Avaliações Zeradas por Loja */}
      <Card isDark={isDark} className="p-4 sm:p-6 relative min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <AlertTriangle className="text-red-500" size={18}/> Avaliações Zeradas (0%)
          </h3>
        </div>
        <ZeroedBarChart data={zeroesData} isDark={isDark} />
      </Card>

      <Card isDark={isDark} className="p-4 sm:p-6 relative min-h-[400px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Target className="text-blue-500 shrink-0" size={18}/> 
            <span className="truncate">Atingimento vs Meta</span>
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0"></div> Meta</div>
            <div className={`flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><div className="w-2.5 h-2.5 rounded-sm bg-slate-400 shrink-0"></div> Abaixo</div>
          </div>
        </div>
        <PerformanceBarChart data={[...rankings.storeRank].sort((a, b) => String(a.code).localeCompare(String(b.code), undefined, { numeric: true }))} isDark={isDark} />
      </Card>

      {/* MATRIZ DE DESEMPENHO E VISITAS */}
      <Card isDark={isDark} className="relative flex flex-col max-h-[500px]">
        <div className={`px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <Layers className="text-blue-500" size={18}/> Matriz de Desempenho
          </h3>
          <Button variant="outline" className="w-full sm:w-auto py-1.5 px-3 text-xs shadow-none" onClick={() => handleExportCSV('performance')} isDark={isDark}>
            <Download size={14}/> Exportar Excel
          </Button>
        </div>
        
        <div className="overflow-auto flex-1 relative no-print">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className={`sticky top-0 z-20 shadow-sm ${isDark ? 'bg-slate-900/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-500'} backdrop-blur-sm`}>
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Loja</th>
                {matrixMonths.map(m => (
                  <th key={m} className="px-4 sm:px-6 py-3 font-medium text-center">{formatMonth(m)}</th>
                ))}
                <th className={`px-4 sm:px-6 py-3 font-bold text-center border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>Geral</th>
                <th className={`px-4 sm:px-6 py-3 font-bold text-center border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>Zeradas</th>
              </tr>
            </thead>
            
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {matrixData.map((row, idx) => (
                <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 sm:px-6 py-3 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex flex-col">
                      <span>{row.storeCode}</span>
                      <span className="text-[10px] font-normal text-slate-500 uppercase truncate max-w-[120px] sm:max-w-[150px]" title={row.storeName}>{row.storeName}</span>
                    </div>
                  </td>
                  
                  {matrixMonths.map(m => {
                    const score = row.monthData[m].score;
                    const visits = row.monthData[m].visits;
                    return (
                      <td key={m} className="px-4 sm:px-6 py-2.5 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {score !== null ? (
                            <span className={`font-semibold ${score >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                              {score.toFixed(1)}%
                            </span>
                          ) : (
                            <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>-</span>
                          )}
                          {visits > 0 && (
                            <span className={`text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded ${isDark ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                              {visits} vis
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  
                  <td className={`px-4 sm:px-6 py-2.5 text-center border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      {row.totalScore !== null ? (
                        <span className={`font-bold ${row.totalScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {row.totalScore.toFixed(1)}%
                        </span>
                      ) : (
                        <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>-</span>
                      )}
                      {row.totalVisits > 0 && (
                        <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                          {row.totalVisits} tot
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className={`px-4 sm:px-6 py-2.5 text-center border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                     {row.zeroedVisits > 0 ? (
                       <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-sm font-bold ${isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'}`}>
                         {row.zeroedVisits}
                       </span>
                     ) : (
                       <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>-</span>
                     )}
                  </td>
                  
                </tr>
              ))}
              {matrixData.length === 0 && (
                <tr><td colSpan={matrixMonths.length + 3} className="px-6 py-8 text-center text-slate-500">Nenhum dado encontrado para a matriz.</td></tr>
              )}
            </tbody>

            {matrixData.length > 0 && (
              <tfoot className={`sticky bottom-0 z-20 font-bold border-t shadow-[0_-2px_4px_rgba(0,0,0,0.05)] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} backdrop-blur-sm`}>
                <tr>
                  <td className="px-4 sm:px-6 py-4 align-top">TOTAL</td>
                  {matrixMonths.map(m => {
                    const mVisits = matrixTotals.monthData[m].visits;
                    const mScore = mVisits > 0 ? (matrixTotals.monthData[m].scoreSum / mVisits) : null;
                    return (
                      <td key={`total-${m}`} className="px-4 sm:px-6 py-3 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          {mScore !== null ? (
                            <span className={mScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}>
                              {mScore.toFixed(1)}%
                            </span>
                          ) : '-'}
                          {mVisits > 0 && (
                            <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${isDark ? 'bg-indigo-500/20 text-indigo-300' : 'bg-indigo-200 text-indigo-800'}`}>
                              {mVisits} vis
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-4 sm:px-6 py-3 text-center border-l border-dashed ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                    <div className="flex flex-col items-center justify-center gap-1">
                      {(() => {
                        const globalScore = matrixTotals.globalVisits > 0 ? (matrixTotals.globalScoreSum / matrixTotals.globalVisits) : null;
                        return globalScore !== null ? (
                          <span className={globalScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}>
                            {globalScore.toFixed(1)}%
                          </span>
                        ) : '-';
                      })()}
                      {matrixTotals.globalVisits > 0 && (
                        <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${isDark ? 'bg-blue-500/30 text-blue-300' : 'bg-blue-200 text-blue-800'}`}>
                          {matrixTotals.globalVisits} tot
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={`px-4 sm:px-6 py-3 text-center border-l border-dashed ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                     {matrixTotals.globalZeroes > 0 ? (
                        <span className={`text-sm font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                          {matrixTotals.globalZeroes}
                        </span>
                     ) : '-'}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {/* MATRIZ DE INCONFORMIDADES */}
      <Card isDark={isDark} className="relative flex flex-col max-h-[500px]">
        <div className={`px-4 sm:px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0 ${isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
          <h3 className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            <AlertTriangle className="text-amber-500" size={18}/> Inconformidades por Indicador
          </h3>
          <Button variant="outline" className="w-full sm:w-auto py-1.5 px-3 text-xs shadow-none" onClick={() => handleExportCSV('indicators')} isDark={isDark}>
            <Download size={14}/> Exportar Excel
          </Button>
        </div>
        
        <div className="overflow-auto flex-1 relative no-print">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className={`sticky top-0 z-20 shadow-sm ${isDark ? 'bg-slate-900/95 border-slate-800 text-slate-400' : 'bg-white/95 border-slate-200 text-slate-500'} backdrop-blur-sm`}>
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Loja</th>
                {matrixMonths.map(m => (
                  <th key={m} className="px-4 sm:px-6 py-3 font-medium text-left">{formatMonth(m)}</th>
                ))}
                <th className={`px-4 sm:px-6 py-3 font-bold text-left border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>Geral</th>
              </tr>
            </thead>
            
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {matrixData.map((row, idx) => (
                <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 sm:px-6 py-3 font-medium align-top ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <div className="flex flex-col mt-1">
                      <span>{row.storeCode}</span>
                      <span className="text-[10px] font-normal text-slate-500 uppercase truncate max-w-[120px] sm:max-w-[150px]" title={row.storeName}>{row.storeName}</span>
                    </div>
                  </td>
                  
                  {matrixMonths.map(m => {
                    const inds = row.monthData[m].indicators;
                    return (
                      <td key={m} className={`px-4 sm:px-6 py-3 text-left align-top border-l ${isDark ? 'border-slate-800/50' : 'border-slate-100'}`}>
                        <div className="flex flex-col gap-1.5 w-[140px] sm:w-[160px] whitespace-normal">
                          {inds && inds.length > 0 ? (
                            inds.map((ind, i) => (
                              <div key={i} className={`text-[10px] leading-tight flex items-start gap-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                                <span className="opacity-70">•</span> 
                                <span>{ind.name} <strong className="ml-1 opacity-90">({ind.count})</strong></span>
                              </div>
                            ))
                          ) : (
                            <span className={`text-xs text-center block w-full ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  
                  <td className={`px-4 sm:px-6 py-3 text-left align-top border-l border-dashed ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                    <div className="flex flex-col gap-1.5 w-[150px] sm:w-[180px] whitespace-normal">
                      {row.totalIndicators && row.totalIndicators.length > 0 ? (
                        row.totalIndicators.map((ind, i) => (
                          <div key={i} className={`text-[10px] leading-tight flex items-start gap-1 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
                            <span className="opacity-70">•</span> 
                            <span>{ind.name} <strong className="ml-1 opacity-90 font-bold">({ind.count})</strong></span>
                          </div>
                        ))
                      ) : (
                        <span className={`text-xs text-center block w-full ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {matrixData.length === 0 && (
                <tr><td colSpan={matrixMonths.length + 2} className="px-6 py-8 text-center text-slate-500">Nenhum dado encontrado para a matriz.</td></tr>
              )}
            </tbody>

            {matrixData.length > 0 && (
              <tfoot className={`sticky bottom-0 z-20 font-bold border-t shadow-[0_-2px_4px_rgba(0,0,0,0.05)] ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'} backdrop-blur-sm`}>
                <tr>
                  <td className="px-4 sm:px-6 py-4 align-top">TOTAL</td>
                  {matrixMonths.map(m => {
                    const inds = matrixTotals.monthData[m].indicators;
                    return (
                      <td key={`total-${m}`} className={`px-4 sm:px-6 py-3 text-left align-top border-l ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="flex flex-col gap-1.5 w-[140px] sm:w-[160px] whitespace-normal">
                          {inds && inds.length > 0 ? (
                            inds.map((ind, i) => (
                              <div key={i} className={`text-[10px] leading-tight flex items-start gap-1 font-medium ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                                <span className="opacity-70">•</span> 
                                <span>{ind.name} <strong className="ml-1">({ind.count})</strong></span>
                              </div>
                            ))
                          ) : (
                            <span className="text-center block w-full">-</span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  <td className={`px-4 sm:px-6 py-3 text-left align-top border-l border-dashed ${isDark ? 'border-slate-600' : 'border-slate-300'}`}>
                    <div className="flex flex-col gap-1.5 w-[150px] sm:w-[180px] whitespace-normal">
                      {matrixTotals.globalIndicators && matrixTotals.globalIndicators.length > 0 ? (
                        matrixTotals.globalIndicators.map((ind, i) => (
                          <div key={i} className={`text-[10px] leading-tight flex items-start gap-1 font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                            <span className="opacity-70">•</span> 
                            <span>{ind.name} <strong className="ml-1">({ind.count})</strong></span>
                          </div>
                        ))
                      ) : (
                        <span className="text-center block w-full">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card isDark={isDark} className="p-4 sm:p-6">
          <h3 className={`text-base font-semibold flex items-center gap-2 mb-4 sm:mb-6 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><Store className="text-blue-500" size={18}/> Top Perfomance (Lojas)</h3>
          <div className="space-y-3">
            {rankings.storeRank.slice(0, 5).map((s, i) => {
              const currentScore = Number(s.score) || 0;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 ${i < 3 ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700') : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600')}`}>#{i+1}</span>
                    <span className={`text-sm font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{s.name}</span>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${currentScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{currentScore.toFixed(1)}%</span>
                </div>
              );
            })}
            {rankings.storeRank.length === 0 && <div className="text-center text-sm text-slate-500 py-6">Nenhum dado disponível.</div>}
          </div>
        </Card>

        <Card isDark={isDark} className="p-4 sm:p-6">
          <h3 className={`text-base font-semibold flex items-center gap-2 mb-4 sm:mb-6 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><UserCheck className="text-indigo-500" size={18}/> Top Perfomance (Gestoras)</h3>
          <div className="space-y-3">
            {rankings.managerRank.slice(0, 5).map((m, i) => {
              const currentScore = Number(m.score) || 0;
              return (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'} transition-colors`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-semibold shrink-0 ${i < 3 ? (isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700') : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600')}`}>#{i+1}</span>
                    <span className={`text-sm font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{m.name}</span>
                  </div>
                  <span className={`text-sm font-semibold shrink-0 ${currentScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{currentScore.toFixed(1)}%</span>
                </div>
              );
            })}
            {rankings.managerRank.length === 0 && <div className="text-center text-sm text-slate-500 py-6">Nenhum dado disponível.</div>}
          </div>
        </Card>
      </div>

      <Card isDark={isDark}>
        <div className={`px-4 sm:px-6 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`text-base font-semibold flex items-center gap-2 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}><AlertTriangle className="text-amber-500" size={18}/> Ocorrências Mais Frequentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-max">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
              <tr>
                <th className="px-4 sm:px-6 py-3 font-medium">Parâmetro Evaluado</th>
                <th className="px-4 sm:px-6 py-3 font-medium text-right">Frequência</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {topProblems.map((p, i) => (
                <tr key={i} className={`transition-colors ${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}`}>
                  <td className={`px-4 sm:px-6 py-3 ${isDark ? 'text-slate-300' : 'text-slate-700'} whitespace-normal max-w-[250px] sm:max-w-md`}>{p.text}</td>
                  <td className="px-4 sm:px-6 py-3 text-right align-top">
                    <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold ${isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      {p.count}
                    </span>
                  </td>
                </tr>
              ))}
              {topProblems.length === 0 && <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-500">Nenhum registro de falha encontrado no período.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function HistoryView({ db, user, onShowReport, isDark, supabaseClient, fetchData }) {
  const [searchGestor, setSearchGestor] = useState('');
  const [searchLoja, setSearchLoja] = useState('');
  const [filterChannelId, setFilterChannelId] = useState('all');
  const [filterRange, setFilterRange] = useState('all');

  const evals = useMemo(() => {
    let list = db.evaluations || [];
    if (user.role === 'manager') list = list.filter(e => e.storeId == user.storeId);
    else if (user.role === 'supervisor') list = list.filter(e => user.accessibleStores?.includes(e.storeId));
    
    if (searchGestor) {
      list = list.filter(ev => {
        const store = db.stores.find(s => s.id == ev.storeId);
        const manager = db.managers.find(m => m.id == store?.managerId);
        return manager?.name?.toLowerCase()?.includes(searchGestor.toLowerCase()) || false;
      });
    }

    if (searchLoja) {
      list = list.filter(ev => {
        const store = db.stores.find(s => s.id == ev.storeId);
        const storeNameMatch = store?.name?.toLowerCase()?.includes(searchLoja.toLowerCase()) || false;
        const storeCodeMatch = store?.code?.toLowerCase()?.includes(searchLoja.toLowerCase()) || false;
        return storeNameMatch || storeCodeMatch;
      });
    }

    if (filterChannelId !== 'all') {
      list = list.filter(ev => {
        const store = db.stores.find(s => s.id == ev.storeId);
        const evalChannelId = ev.channelId || store?.channelId;
        return evalChannelId == filterChannelId;
      });
    }

    if (filterRange !== 'all') {
      list = list.filter(ev => {
        const currentScore = Number(ev.score) || 0;
        if (filterRange === '95-100') return currentScore >= 95;
        if (filterRange === '90-94') return currentScore >= 90 && currentScore < 95;
        if (filterRange === '80-89') return currentScore >= 80 && currentScore < 90;
        if (filterRange === 'abaixo-79') return currentScore < 80;
        return true;
      });
    }

    return [...list].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [db.evaluations, db.stores, db.managers, user, searchGestor, searchLoja, filterChannelId, filterRange]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Tem certeza que deseja excluir esta avaliação permanentemente?")) return;
    
    const { error } = await supabaseClient.from('evaluations').delete().eq('id', id);
    if (error) alert("Erro ao excluir a avaliação: " + error.message);
    else fetchData();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="mb-2">
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Histórico de Auditorias</h1>
        <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Consulta completa aos registros realizados no sistema.</p>
      </div>

      <Card isDark={isDark} className="p-4 sm:p-6 font-medium">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><UserCheck size={14}/> Gestora</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} placeholder="Buscar nome..." value={searchGestor} onChange={e => setSearchGestor(e.target.value)} /></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Store size={14}/> Loja/Cód</label><input className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} placeholder="Nome ou código..." value={searchLoja} onChange={e => setSearchLoja(e.target.value)} /></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Tag size={14}/> Canal</label><select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} value={filterChannelId} onChange={e => setFilterChannelId(e.target.value)}><option value="all">Todos</option>{db.channels.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="space-y-1.5"><label className={`text-xs font-medium flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}><Target size={14}/> Atingimento</label><select className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} value={filterRange} onChange={e => setFilterRange(e.target.value)}><option value="all">Todas</option><option value="95-100">95% a 100%</option><option value="90-94">90% a 94%</option><option value="80-89">80% a 89%</option><option value="abaixo-79">Abaixo de 80%</option></select></div>
        </div>
      </Card>

      <Card isDark={isDark} className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} font-medium`}>
              <tr><th className="px-4 sm:px-6 py-3">Data</th><th className="px-4 sm:px-6 py-3">Unidade</th><th className="px-4 sm:px-6 py-3">Canal</th><th className="px-4 sm:px-6 py-3">Score</th><th className="px-4 sm:px-6 py-3 text-right">Ações</th></tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {evals.map(ev => { 
                const store = db.stores.find(s => s.id == ev.storeId); 
                const channel = db.channels.find(c => c.id == ev.channelId) || db.channels.find(c => c.id == store?.channelId); 
                const currentScore = Number(ev.score) || 0;
                return (
                  <tr key={ev.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} group cursor-pointer transition-colors`} onClick={() => onShowReport(ev)}>
                    <td className={`px-4 sm:px-6 py-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{ev.date ? new Date(ev.date).toLocaleDateString('pt-BR') : '---'}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'} truncate max-w-[150px] sm:max-w-[200px]`}>{store?.name}</p>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{store?.code}</p>
                    </td>
                    <td className={`px-4 sm:px-6 py-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{channel?.name}</td>
                    <td className="px-4 sm:px-6 py-4"><Badge isDark={isDark} type={currentScore >= 80 ? 'success' : 'danger'}>{currentScore.toFixed(1)}%</Badge></td>
                    <td className="px-4 sm:px-6 py-4 text-right no-print">
                      <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onShowReport(ev); }} title="Ver Detalhes" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}>
                          <FileText size={16}/>
                        </button>
                        {user.role === 'admin' && (
                          <button onClick={(e) => handleDelete(e, ev.id)} title="Excluir Avaliação" className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-slate-400 hover:bg-red-900/30 hover:text-red-400' : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}`}>
                            <Trash2 size={16}/>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ); 
              })}
              {evals.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Nenhum registro localizado.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function NewAuditView({ db, supabaseClient, onComplete, isDark }) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({ storeId: '', date: new Date().toISOString().split('T')[0] });
  const [activeInd, setActiveInd] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const startAudit = () => {
    if (!config.storeId) return alert("Selecione uma loja para iniciar.");
    const store = db.stores.find(s => s.id == config.storeId);
    const inds = db.indicators.filter(i => i.channelId == store.channelId);
    if (!inds.length) return alert("Não existem indicadores cadastrados para o canal desta loja.");
    setActiveInd(inds[0].id);
    setStep(2);
  };

  const handleAnswer = (qId, value, cp = false, comment = "", media = []) => {
    setAnswers(prev => ({ ...prev, [qId]: { ...prev[qId], value, cp, comment, media: media.length > 0 ? media : (prev[qId]?.media || []) } }));
  };

  const handleFileUpload = (qId, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

        setAnswers(prev => {
          const currentMedia = prev[qId]?.media || [];
          return {
            ...prev,
            [qId]: { ...prev[qId], media: [...currentMedia, { url: dataUrl, name: file.name }] }
          };
        });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const calculateScore = () => {
    const store = db.stores.find(s => s.id == config.storeId);
    if (!store) return 100;
    const channel = db.channels.find(c => c.id == store.channelId);
    const channelName = channel?.name?.toUpperCase() || "";

    if (channelName.includes("PCOF")) {
      const questionsInAudit = db.questions.filter(q => db.indicators.filter(i => i.channelId == store.channelId).some(i => i.id == q.indicatorId));
      let totalResponded = 0;
      let conformeCount = 0;
      questionsInAudit.forEach(q => {
        const ans = answers[q.id];
        if (ans?.value === 'conforme' || ans?.value === 'inconforme') {
          totalResponded++;
          if (ans.value === 'conforme') conformeCount++;
        }
      });
      return totalResponded > 0 ? (conformeCount / totalResponded) * 100 : 0;
    }

    let score = 100;
    const questions = db.questions.filter(q => db.indicators.filter(i => i.channelId == store.channelId).some(i => i.id == q.indicatorId));
    questions.forEach(q => {
      const ans = answers[q.id];
      if (ans?.value === 'inconforme' && !ans.cp) score -= getPenaltyPoints(q.severity);
    });
    return Math.max(0, score);
  };

  const submitAudit = async () => {
    setSubmitting(true);
    const finalScore = calculateScore();
    const evaluator = JSON.parse(localStorage.getItem('vq_user')).name;
    const { data: newEval, error: evalError } = await supabaseClient.from('evaluations').insert({ store_id: config.storeId, channel_id: db.stores.find(s => s.id == config.storeId).channelId, evaluator, score: finalScore, date: config.date }).select().single();
    
    if (evalError) {
      alert("Erro ao criar a avaliação: " + evalError.message);
      setSubmitting(false);
      return;
    }

    if (newEval) {
      const details = Object.keys(answers).map(qId => ({ evaluation_id: newEval.id, question_id: qId, answer: answers[qId].value, comment: answers[qId].comment || "", cp_validated: answers[qId].cp || false, media: answers[qId].media || [] }));
      
      if (details.length > 0) {
        const { error: detError } = await supabaseClient.from('evaluation_details').insert(details);
        if (detError) {
          alert("Alerta: A auditoria foi salva, mas ocorreu um erro ao salvar as respostas ou imagens. Erro: " + detError.message);
        }
      }
      onComplete();
    }
    setSubmitting(false);
  };

  if (step === 1) return (
    <div className="max-w-xl mx-auto space-y-6 sm:space-y-8 pt-8 sm:pt-12 animate-in slide-in-from-bottom-4 duration-300">
      <div className="text-center px-4">
        <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Nova Auditoria</h1>
        <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Configure os parâmetros iniciais da inspeção de qualidade.</p>
      </div>
      <Card isDark={isDark} className="p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Unidade a ser inspecionada</label>
          <select className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={config.storeId} onChange={e => setConfig({...config, storeId: e.target.value})}>
            <option value="">Selecione uma Unidade...</option>
            {db.stores.map(s => <option key={s.id} value={s.id}>{s.code} — {s.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Data de Referência</label>
          <input type="date" className={`w-full border rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'}`} value={config.date} onChange={e => setConfig({...config, date: e.target.value})} />
        </div>
        <div className="pt-4">
          <Button onClick={startAudit} className="w-full py-3" isDark={isDark}>Avançar para o Formulário</Button>
        </div>
      </Card>
    </div>
  );

  const store = db.stores.find(s => s.id == config.storeId); 
  const inds = db.indicators.filter(i => i.channelId == store.channelId); 
  const currentInd = inds.find(i => i.id == activeInd); 
  const questions = db.questions.filter(q => q.indicatorId == activeInd);
  const currentScore = calculateScore();

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative pb-32">
      {/* Menu Lateral/Superior de Indicadores */}
      <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 lg:sticky lg:top-24 h-fit no-scrollbar z-10">
        {inds.map(ind => (
          <button 
            key={ind.id} 
            onClick={() => setActiveInd(ind.id)} 
            className={`shrink-0 w-auto lg:w-full px-4 py-3 rounded-lg border text-left text-sm transition-all whitespace-nowrap lg:whitespace-normal
              ${activeInd === ind.id 
                ? (isDark ? 'bg-blue-600 border-blue-600 text-white shadow-sm font-medium' : 'bg-[#0062FF] border-[#0062FF] text-[#EBFF00] font-bold shadow-md') 
                : `${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 font-medium' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'}`}
            `}
          >
            {ind.name}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-6">
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6 border rounded-xl shadow-sm ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div>
            <h2 className={`text-base sm:text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentInd?.name}</h2>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Preencha todos os itens abaixo</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:text-right flex sm:block items-center justify-between w-full sm:w-auto">
            <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Score Parcial</span>
            <p className={`text-2xl sm:text-3xl font-bold ${currentScore >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{currentScore.toFixed(1)}%</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {questions.map(q => (
            <Card key={q.id} isDark={isDark} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <p className={`text-sm sm:text-base font-medium leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{q.text}</p>
                <Badge isDark={isDark} type={q.severity === 'gravissima' ? 'danger' : q.severity === 'grave' ? 'warning' : 'neutral'}>{q.severity}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <AnswerBtn active={answers[q.id]?.value === 'conforme'} onClick={() => handleAnswer(q.id, 'conforme')} label="Conforme" variant="success" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'inconforme'} onClick={() => handleAnswer(q.id, 'inconforme')} label="Inconforme" variant="danger" isDark={isDark} />
                <AnswerBtn active={answers[q.id]?.value === 'na'} onClick={() => handleAnswer(q.id, 'na')} label="Não se Aplica" variant="neutral" isDark={isDark} />
              </div>
              {answers[q.id]?.value === 'inconforme' && (
                <div className={`mt-4 sm:mt-6 space-y-4 pt-4 sm:pt-6 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'} animate-in slide-in-from-top-2`}>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 sm:w-5 sm:h-5 rounded border-slate-300 text-amber-500 focus:ring-amber-500" checked={answers[q.id]?.cp} onChange={e => handleAnswer(q.id, 'inconforme', e.target.checked, answers[q.id]?.comment)}/>
                    <span className={`text-sm font-medium ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Plano de Ação/CP Validado?</span>
                  </label>
                  <textarea placeholder="Insira observações ou evidências adicionais..." className={`w-full min-h-[100px] border rounded-lg p-3 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-blue-600'}`} value={answers[q.id]?.comment} onChange={e => handleAnswer(q.id, 'inconforme', answers[q.id]?.cp, e.target.value)} />
                  <Button variant="outline" onClick={() => document.getElementById(`file-q-${q.id}`).click()} className="text-xs w-full sm:w-auto" isDark={isDark}><Camera size={14}/> Anexar Evidência</Button>
                  <input type="file" id={`file-q-${q.id}`} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(q.id, e)} />
                  <div className="flex gap-3 overflow-x-auto pt-2">{answers[q.id]?.media?.map((img, i) => <img key={i} src={img.url} className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border shrink-0 ${isDark ? 'border-slate-700' : 'border-slate-200'}`} />)}</div>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="pt-6 flex justify-end">
          <Button disabled={submitting} onClick={submitAudit} className="px-8 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 sm:py-2.5">
            <Save size={18} /> Salvar Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- AUXILIARES ADICIONAIS ---

function AnswerBtn({ active, label, onClick, variant, isDark }) {
  const styles = {
    success: active 
      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:border-emerald-600/50 hover:text-emerald-400' : 'border-slate-300 text-slate-600 hover:border-emerald-600/50 hover:text-emerald-600'}`,
    danger: active 
      ? 'bg-red-600 text-white border-red-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:border-red-600/50 hover:text-red-400' : 'border-slate-300 text-slate-600 hover:border-red-600/50 hover:text-red-600'}`,
    neutral: active 
      ? 'bg-slate-600 text-white border-slate-600 shadow-sm' 
      : `bg-transparent ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`
  };
  return <button onClick={onClick} className={`w-full px-4 py-3 sm:py-3.5 rounded-lg text-sm font-medium border transition-colors ${styles[variant]}`}>{label}</button>;
}

function StatCard({ title, value, icon, subtitle, isDark }) { 
  return (
    <Card isDark={isDark} className="p-4 sm:p-6 relative text-left flex flex-col justify-between">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className={`p-2 sm:p-2.5 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>{icon}</div>
      </div>
      <div>
        <div className={`text-2xl sm:text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</div>
        <div className={`text-xs sm:text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</div>
        {subtitle && <div className={`text-xs mt-1 sm:mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</div>}
      </div>
    </Card>
  ); 
}

// --- VISUALIZAÇÃO DE DOSSIÊ ---

function ReportContent({ evaluation, db, isDark = true, onExpandImage }) {
  const store = db.stores.find(s => s.id == evaluation.storeId);
  const manager = db.managers.find(m => m.id == store?.managerId);
  const textColor = isDark ? 'text-slate-200' : 'text-slate-800';
  const borderColor = isDark ? 'border-slate-800' : 'border-slate-200';
  const bgCard = isDark ? 'bg-slate-800/50' : 'bg-slate-50';

  const groupedDetails = {};
  evaluation.details?.forEach(det => {
    const q = db.questions.find(q => q.id == det.questionId);
    const indId = q ? q.indicatorId : 'unknown';
    if (!groupedDetails[indId]) {
      groupedDetails[indId] = [];
    }
    groupedDetails[indId].push({ det, q: q || { text: 'Pergunta não encontrada', severity: 'neutral' } });
  });

  const parsedScore = Number(evaluation.score) || 0;

  return (
    <div className={`space-y-6 sm:space-y-8 ${textColor} text-left`}>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-b ${borderColor} pb-6 sm:pb-8`}>
        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Unidade Avaliada</p>
            <p className={`text-base sm:text-lg font-bold mt-0.5 ${isDark ? 'text-blue-400' : 'text-[#0062FF]'}`}>{store?.name || 'Desconhecida'}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Data da Realização</p>
            <p className="text-sm sm:text-base font-medium mt-0.5">{evaluation.date ? new Date(evaluation.date).toLocaleDateString('pt-BR') : '---'}</p>
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4 md:text-right">
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Responsável pela Unidade</p>
            <p className="text-sm sm:text-base font-medium mt-0.5">{manager?.name || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">Avaliador VQ</p>
            <p className="text-sm sm:text-base font-medium mt-0.5">{evaluation.evaluator}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className={`${bgCard} p-4 sm:p-5 rounded-xl border ${borderColor}`}>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase mb-1">Score Obtido</p>
          <p className={`text-2xl sm:text-3xl font-bold ${parsedScore >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>
            {parsedScore.toFixed(2)}%
          </p>
        </div>
        <div className={`${bgCard} p-4 sm:p-5 rounded-xl border ${borderColor}`}>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase mb-1">Resultado</p>
          <p className="text-lg sm:text-xl font-bold mt-1">{parsedScore >= 80 ? 'Aprovado' : 'Requer Atenção'}</p>
        </div>
        <div className={`${bgCard} p-4 sm:p-5 rounded-xl border ${borderColor}`}>
          <p className="text-[10px] sm:text-xs text-slate-500 font-semibold uppercase mb-1">Penalizações</p>
          <p className="text-lg sm:text-xl font-bold mt-1">{(100 - parsedScore).toFixed(2)} pts</p>
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className={`text-base sm:text-lg font-bold border-l-4 pl-3 ${isDark ? 'border-blue-600' : 'border-[#0062FF]'}`}>Detalhamento dos Indicadores</h4>
        
        {Object.keys(groupedDetails).length === 0 && (
          <p className="text-slate-500 italic text-sm">Nenhum detalhe técnico foi recuperado para este relatório.</p>
        )}

        {Object.keys(groupedDetails).map(indId => {
          const indicator = db.indicators.find(i => i.id == indId);
          const indName = indicator ? indicator.name : 'Removidos do Sistema';

          return (
            <div key={indId} className="space-y-3 mt-4">
              <h5 className={`text-xs sm:text-sm font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'} border-b pb-2`}>
                {indName}
              </h5>

              <div className="space-y-3">
                {groupedDetails[indId].map(({det, q}) => {
                  let mediaArray = [];
                  try {
                    if (Array.isArray(det.media)) {
                      mediaArray = det.media;
                    } else if (det.media && typeof det.media === 'object') {
                      if (det.media.url) mediaArray = [det.media];
                      else if (Object.keys(det.media).length > 0) mediaArray = [det.media];
                    } else if (typeof det.media === 'string' && det.media.trim() !== '') {
                      if (det.media.startsWith('[') || det.media.startsWith('{')) {
                        const parsed = JSON.parse(det.media);
                        mediaArray = Array.isArray(parsed) ? parsed : [parsed];
                      } else {
                        mediaArray = [{ url: det.media }];
                      }
                    }
                  } catch (e) {
                    console.error("Erro ao fazer parseamento de mídias:", e);
                  }

                  return (
                    <div key={det.id || det.questionId} className={`${bgCard} border ${borderColor} rounded-lg p-4 sm:p-5`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                        <p className="font-medium text-sm leading-relaxed flex-1">{q.text}</p>
                        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                          {(det.cpValidated || det.cp_validated) && <Badge isDark={isDark} type="warning">Corrigido</Badge>}
                          <Badge isDark={isDark} type={det.answer === 'conforme' ? 'success' : det.answer === 'inconforme' ? 'danger' : 'neutral'}>
                            {det.answer === 'na' ? 'N/A' : det.answer === 'conforme' ? 'Conforme' : 'Não Conforme'}
                          </Badge>
                        </div>
                      </div>

                      {det.comment && (
                        <div className={`mt-3 ${isDark ? 'bg-slate-900' : 'bg-white'} p-3 rounded-md border ${borderColor} flex gap-2 items-start`}>
                          <Info size={16} className="text-slate-400 shrink-0 mt-0.5"/>
                          <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{det.comment}</p>
                        </div>
                      )}

                      {mediaArray && mediaArray.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {mediaArray.map((img, i) => (
                            <div key={i} className="relative group cursor-zoom-in" onClick={() => onExpandImage(img.url || img)}>
                              <img src={typeof img === 'string' ? img : img.url} className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md border ${borderColor} hover:opacity-80 transition-opacity`} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FormInput({ label, isDark, ...props }) { 
  return (
    <div className="space-y-1 text-left">
      <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
      <input className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm outline-none transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} {...props} />
    </div>
  ); 
}

function FormSelect({ label, children, isDark, ...props }) { 
  return (
    <div className="space-y-1 text-left">
      <label className={`text-xs font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>
      <select className={`w-full border rounded-lg px-3 py-2 sm:py-2.5 text-sm outline-none cursor-pointer transition-colors ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-blue-500' : 'bg-white border-slate-300 text-slate-900 focus:border-blue-600'}`} {...props}>{children}</select>
    </div>
  ); 
}

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Caminhos para as imagens locais informadas (agora na pasta public)
  const bgImage = "/bg.svg";
  const logoImage = "/logo.svg";
  const logoAlvorar = "/logo-alvorar.svg";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-start lg:pl-[10%] bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${bgImage})` }}>
       
       {/* Card de Login Azul */}
       <div className="bg-[#0062FF] rounded-[24px] p-8 sm:p-12 w-[90%] max-w-[440px] shadow-2xl relative z-30 flex flex-col gap-10 mx-auto lg:mx-0 animate-in zoom-in-95 duration-500">
          
          {/* Logo Local */}
          <div className="flex justify-center items-center w-full">
             <img src={logoImage} alt="Visita Qualidade" className="h-16 sm:h-20 w-auto object-contain" />
          </div>

          {/* Formulário */}
          <form onSubmit={(e) => { e.preventDefault(); onLogin(email, password); }} className="space-y-5">
             
             {/* Input Email */}
             <div className="bg-white rounded-[12px] flex items-center px-5 py-4">
                <User size={24} className="text-[#0062FF]" strokeWidth={2.5} />
                <input
                   type="email"
                   required
                   className="bg-transparent border-none outline-none flex-1 ml-4 text-[#0062FF] font-bold text-base placeholder-[#0062FF]"
                   placeholder="E-mail"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                />
             </div>

             {/* Input Senha */}
             <div className="bg-white rounded-[12px] flex items-center px-5 py-4">
                <Lock size={24} className="text-[#0062FF]" strokeWidth={2.5} />
                <input
                   type={showPassword ? "text" : "password"}
                   required
                   className="bg-transparent border-none outline-none flex-1 ml-4 text-[#0062FF] font-bold text-base placeholder-[#0062FF]"
                   placeholder="Senha"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="text-[#0062FF] hover:text-[#004bbd] transition-colors outline-none ml-2"
                >
                   {showPassword ? <EyeOff size={24} strokeWidth={2.5} /> : <Eye size={24} strokeWidth={2.5} />}
                </button>
             </div>

             {/* Botão Entrar */}
             <button
                type="submit"
                className="w-full bg-[#EBFF00] hover:bg-[#d4e600] active:scale-[0.98] text-[#0062FF] font-black text-xl rounded-[12px] py-4 transition-all mt-4 shadow-[0_4px_20px_0_rgba(235,255,0,0.3)]"
             >
                Entra
             </button>

             {/* Logo Secundária - Alvorar */}
             <div className="pt-2 flex justify-center items-center w-full pointer-events-none">
                <img src={logoAlvorar} alt="Alvorar" className="h-8 sm:h-10 object-contain opacity-90 hover:opacity-100 transition-opacity" />
             </div>

          </form>
       </div>
    </div>
  );
}

function AccessLogView({ db, isDark }) {
  const usersAccess = useMemo(() => {
    const now = new Date();
    return [...(db.users || [])].map(u => {
      // Busca os registros de atividade para este usuário
      const activities = (db.userActivity || []).filter(act => act.userId === u.id);
      
      // Encontra o registro mais recente
      let lastActivity = null;
      if (activities.length > 0) {
        activities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        lastActivity = activities[0];
      }

      const lastLogin = lastActivity ? new Date(lastActivity.createdAt) : null;
      let diffDays = null;
      if (lastLogin) {
        const diffTime = Math.abs(now - lastLogin);
        diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      }
      return { ...u, lastLoginDate: lastLogin, diffDays };
    }).sort((a, b) => {
      // Ordenar para mostrar quem está há mais tempo sem logar ou nunca logou primeiro
      if (a.diffDays === null && b.diffDays !== null) return -1;
      if (b.diffDays === null && a.diffDays !== null) return 1;
      if (a.diffDays === null && b.diffDays === null) return 0;
      return b.diffDays - a.diffDays;
    });
  }, [db.users, db.userActivity]);

  const stats = useMemo(() => {
    let active = 0, inactive = 0, never = 0;
    usersAccess.forEach(u => {
      if (u.diffDays === null) never++;
      else if (u.diffDays > 15) inactive++;
      else active++;
    });
    return { active, inactive, never, total: usersAccess.length };
  }, [usersAccess]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Monitoramento de Acessos</h1>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Verifique a atividade e último login dos usuários do sistema.</p>
        </div>
      </div>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard isDark={isDark} title="Total de Usuários" value={stats.total} icon={<Users className="text-blue-500" size={20}/>} />
        <StatCard isDark={isDark} title="Ativos recentes (≤ 15 dias)" value={stats.active} icon={<CheckCircle2 className="text-emerald-500" size={20}/>} />
        <StatCard isDark={isDark} title="Inativos (> 15 dias)" value={stats.inactive} icon={<AlertTriangle className="text-amber-500" size={20}/>} />
        <StatCard isDark={isDark} title="Nunca logaram" value={stats.never} icon={<MinusCircle className="text-slate-500" size={20}/>} />
      </section>

      <Card isDark={isDark} className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-max">
            <thead className={`${isDark ? 'bg-slate-800/50 text-slate-400' : 'bg-slate-50 text-slate-500'} font-medium`}>
              <tr>
                <th className="px-4 sm:px-6 py-3">Usuário</th>
                <th className="px-4 sm:px-6 py-3">Função</th>
                <th className="px-4 sm:px-6 py-3">Último Acesso</th>
                <th className="px-4 sm:px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-200'}`}>
              {usersAccess.map(u => {
                let badgeType = 'neutral';
                let statusText = 'Nunca acessou';
                if (u.diffDays !== null) {
                  if (u.diffDays <= 7) { badgeType = 'success'; statusText = 'Ativo recente'; }
                  else if (u.diffDays <= 15) { badgeType = 'primary'; statusText = 'Ativo'; }
                  else if (u.diffDays <= 30) { badgeType = 'warning'; statusText = 'Inativo moderado'; }
                  else { badgeType = 'danger'; statusText = 'Inativo há muito tempo'; }
                }

                return (
                  <tr key={u.id} className={`${isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50/50'} transition-colors`}>
                    <td className="px-4 sm:px-6 py-4">
                      <p className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'} max-w-[200px] truncate`}>{u.name}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{u.email}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                       <Badge isDark={isDark} type="neutral">{u.role === 'admin' ? 'Admin' : u.role === 'manager' ? 'Gestora' : 'Supervisor'}</Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className={`font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {u.lastLoginDate ? u.lastLoginDate.toLocaleDateString('pt-BR') + ' às ' + u.lastLoginDate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'}) : '---'}
                      </p>
                      {u.diffDays !== null && (
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                          {u.diffDays === 0 ? 'Hoje' : `Há ${u.diffDays} dias`}
                        </p>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <Badge isDark={isDark} type={badgeType}>{statusText}</Badge>
                    </td>
                  </tr>
                );
              })}
              {usersAccess.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-slate-500">Nenhum registro encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}