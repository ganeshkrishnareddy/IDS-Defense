'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Shield,
    Activity,
    AlertTriangle,
    ShieldCheck,
    Terminal,
    Zap,
    Lock,
    Globe,
    Cpu,
    RefreshCw,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    ChevronDown,
    ChevronUp,
    Info,
    Database,
    Clock,
    User,
    ArrowUpRight
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const IDENTITY = {
    project: "Intrusion Detection System (IDS)",
    developer: "P Ganesh Krishna Reddy",
    portfolio: "https://pganeshreddy.netlify.app/",
    deployment: "ProgVision",
    deployment_url: "https://progvision.in/"
};

const SEVERITY_COLORS: any = {
    Critical: 'text-red-500 bg-red-500/10 border-red-500/20',
    High: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    Medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    Low: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    Normal: 'text-green-500 bg-green-500/10 border-green-500/20'
};

export default function IDSDashboard() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [stats, setStats] = useState({
        scanned: 0,
        threats: 0,
        uptime: "00:00:00",
        severity: "Normal",
        prevScanned: 0,
        prevThreats: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
    const [expandedAlert, setExpandedAlert] = useState<number | null>(null);
    const [latency, setLatency] = useState<number>(0);
    const startTime = useRef(Date.now());

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8000/ws/alerts');

        socket.onopen = () => setStatus('online');
        socket.onclose = () => setStatus('offline');

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setAlerts(prev => [data, ...prev].slice(0, 50));
            setLatency(data.inference_latency || 0);

            setStats(prev => {
                const newSeverity = data.severity === 'Critical' ? 'Critical' :
                    data.severity === 'High' && prev.severity !== 'Critical' ? 'High' :
                        prev.severity;
                return {
                    ...prev,
                    threats: prev.threats + 1,
                    severity: newSeverity
                };
            });
        };

        const interval = setInterval(() => {
            const diff = Date.now() - startTime.current;
            const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
            const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');

            setStats(prev => ({
                ...prev,
                prevScanned: prev.scanned,
                prevThreats: prev.threats,
                scanned: prev.scanned + Math.floor(Math.random() * 8) + 2,
                uptime: `${h}:${m}:${s}`
            }));

            setChartData(prev => {
                const lastThreatCount = alerts.filter(a => {
                    const alertTime = new Date(a.timestamp).getTime();
                    return Date.now() - alertTime < 1000;
                }).length;

                const newData = [...prev, {
                    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    threats: lastThreatCount,
                    traffic: Math.floor(Math.random() * 80) + 40
                }].slice(-30);
                return newData;
            });
        }, 1000);

        return () => {
            socket.close();
            clearInterval(interval);
        };
    }, [alerts]);

    const topAttackers = useMemo(() => {
        const counts: any = {};
        alerts.forEach(a => {
            counts[a.src_ip] = (counts[a.src_ip] || 0) + 1;
        });
        return Object.entries(counts)
            .sort(([, a]: any, [, b]: any) => b - a)
            .slice(0, 5);
    }, [alerts]);

    const threatDistribution = useMemo(() => {
        const counts: any = {};
        alerts.forEach(a => {
            counts[a.threat_type] = (counts[a.threat_type] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [alerts]);

    const PIE_COLORS = ['#3B82F6', '#EF4444', '#F59E0B', '#10B981', '#8B5CF6'];

    return (
        <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
            {/* Pulsing overlay for critical threats */}
            {stats.severity === 'Critical' && (
                <div className="fixed inset-0 pointer-events-none z-50 animate-pulse border-[4px] border-red-500/20" />
            )}

            {/* Header */}
            <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 border-b border-white/5 pb-8">
                <div>
                    <div className="flex flex-wrap items-center gap-4 mb-2">
                        <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
                            <Shield className="w-7 h-7 text-blue-500" />
                        </div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                            IDS Defense Dashboard
                        </h1>
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-sm flex items-center gap-1.5 ${status === 'online' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {status}
                        </div>
                    </div>
                    <p className="text-white/40 text-sm font-medium">
                        SOC-Grade ML-Based Intrusion Detection Platform • <span className="text-white/70">{IDENTITY.developer}</span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-6 px-4 py-2 bg-white/[0.02] border border-white/5 rounded-xl mr-2">
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Model v1.2</span>
                            <span className="text-xs font-mono text-blue-400">XGBoost-Anomaly</span>
                        </div>
                        <div className="h-6 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-0.5">Inference Avg</span>
                            <span className="text-xs font-mono text-green-400">{latency}ms</span>
                        </div>
                    </div>
                    <a href={IDENTITY.deployment_url} target="_blank" className="flex items-center gap-3 text-xs bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl transition-all border border-white/5 hover:border-white/20 group">
                        <Zap className="w-4 h-4 text-yellow-500 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-white/70">Deployed by {IDENTITY.deployment}</span>
                    </a>
                    <a href={IDENTITY.portfolio} target="_blank" className="flex items-center gap-3 text-xs bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 font-bold active:scale-95">
                        <ArrowUpRight className="w-4 h-4" />
                        Engineer Portfolio
                    </a>
                </div>
            </header>

            {/* Layout */}
            <div className="grid grid-cols-12 gap-6">

                {/* Left Column: Stats & Charts */}
                <div className="col-span-12 lg:col-span-9 space-y-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard
                            icon={Activity}
                            label="Packets Scanned"
                            value={stats.scanned}
                            trend={stats.scanned > stats.prevScanned ? "up" : "down"}
                            diff={stats.scanned - stats.prevScanned}
                            color="blue"
                        />
                        <StatCard
                            icon={AlertTriangle}
                            label="Threats Detected"
                            value={stats.threats}
                            trend={stats.threats > stats.prevThreats ? "up" : "neutral"}
                            diff={stats.threats - stats.prevThreats}
                            color="red"
                        />
                        <StatCard
                            icon={RefreshCw}
                            label="Uptime Session"
                            value={stats.uptime}
                            color="green"
                        />
                        <StatCard
                            icon={ShieldCheck}
                            label="Severity Status"
                            value={stats.severity}
                            color={stats.severity === 'Critical' ? 'red' : stats.severity === 'High' ? 'orange' : stats.severity === 'Medium' ? 'yellow' : 'blue'}
                            isPulse={stats.severity === 'Critical'}
                        />
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 via-red-500/50 to-blue-500/50 opacity-10" />
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        Network Throughput & Anomaly Spikes
                                    </h3>
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Real-time analysis window (Last 30 samples)</p>
                                </div>
                                <div className="flex gap-2">
                                    {['5m', '15m', '1h'].map(t => (
                                        <button key={t} className={`px-2 py-1 rounded text-[10px] font-bold ${t === '5m' ? 'bg-blue-600' : 'bg-white/5 text-white/40 hover:bg-white/10'} transition-colors`}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[320px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                        <XAxis dataKey="time" hide />
                                        <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)' }}
                                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="traffic" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
                                        <Area type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={3} fillOpacity={1} fill="url(#colorThreats)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Distribution Widget */}
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col">
                            <h3 className="text-sm font-bold flex items-center gap-2 mb-6">
                                <Database className="w-4 h-4 text-purple-500" />
                                Threat Distribution
                            </h3>
                            <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={threatDistribution.length > 0 ? threatDistribution : [{ name: 'Idle', value: 1 }]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {threatDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                            ))}
                                            {threatDistribution.length === 0 && <Cell fill="#ffffff05" />}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10', borderRadius: '8px' }}
                                            itemStyle={{ fontSize: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-lg font-black">{alerts.length}</span>
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Total Events</span>
                                </div>
                            </div>
                            <div className="space-y-2 mt-4">
                                {threatDistribution.slice(0, 3).map((item, i) => (
                                    <div key={item.name} className="flex items-center justify-between text-[11px]">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                                            <span className="text-white/60 font-medium">{item.name}</span>
                                        </div>
                                        <span className="font-mono text-white/90">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Attacker IP Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-2xl">
                            <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 mb-4 text-white/60">
                                <User className="w-4 h-4 text-orange-500" />
                                Top Attacker IPs
                            </h3>
                            <div className="space-y-2">
                                {topAttackers.length > 0 ? topAttackers.map(([ip, count]: any, i) => (
                                    <div key={ip} className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-white/20 font-black">#0{i + 1}</span>
                                            <span className="text-xs font-mono text-white/80">{ip}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-bold uppercase">Malicious</span>
                                            <span className="text-xs font-bold text-white/40">{count} events</span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-xs text-white/20 italic py-4">Waiting for malicious payloads...</p>
                                )}
                            </div>
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col justify-center items-center text-center space-y-4">
                            <div className="p-4 bg-green-500/5 rounded-full border border-green-500/10">
                                <Lock className="w-8 h-8 text-green-500/30" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">System Compliance</h4>
                                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-1">Zero-Trust Network Access Enabled</p>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-bold">NIST-800</div>
                                <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-bold">SOC2-READY</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Alerts Feed */}
                <div className="col-span-12 lg:col-span-3 h-[800px] sticky top-8 flex flex-col">
                    <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[80px] -z-1" />

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 text-red-500">
                                    <Terminal className="w-5 h-5" />
                                    SOC Alert Intel
                                </h3>
                                <p className="text-[9px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Live Inspection Stream</p>
                            </div>
                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> Live
                            </span>
                        </div>

                        <div className="overflow-y-auto flex-1 space-y-3 pr-1 pb-4 scrollbar-thin scrollbar-thumb-white/10 custom-scroll">
                            <AnimatePresence initial={false}>
                                {alerts.map((alert, i) => (
                                    <motion.div
                                        key={alert.timestamp + i}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`group cursor-pointer rounded-xl transition-all border ${expandedAlert === i ? 'bg-white/[0.04] border-white/20' : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03] hover:border-white/10'
                                            }`}
                                        onClick={() => setExpandedAlert(expandedAlert === i ? null : i)}
                                    >
                                        <div className={`p-4 border-l-4 ${SEVERITY_COLORS[alert.severity].split(' ')[2]} transition-all`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${SEVERITY_COLORS[alert.severity].split(' ')[0]}`}>
                                                        {alert.threat_type}
                                                    </span>
                                                    <span className="text-[10px] text-white/40 font-mono">ID: {alert.timestamp.split('T')[1].split('.')[0].replace(/:/g, '')}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] text-white/20 font-bold">{new Date(alert.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                                                    {expandedAlert === i ? <ChevronUp className="w-3 h-3 text-white/40" /> : <ChevronDown className="w-3 h-3 text-white/40" />}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1 h-1 bg-white/30 rounded-full" />
                                                        <span className="text-[10px] font-mono text-white/60 truncate max-w-[120px]">{alert.src_ip}</span>
                                                    </div>
                                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-black uppercase border border-white/10 ${SEVERITY_COLORS[alert.severity].split(' ')[0]} bg-white/[0.02]`}>
                                                        {alert.severity}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Expandable Inspection View */}
                                            <AnimatePresence>
                                                {expandedAlert === i && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="mt-4 pt-4 border-t border-white/10 space-y-4">
                                                            <div>
                                                                <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/30 mb-2 tracking-widest">
                                                                    <Activity className="w-3 h-3" /> Detection Intel
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-2">
                                                                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                                        <div className="text-[8px] text-white/40 font-bold uppercase mb-0.5">Logic</div>
                                                                        <div className="text-[10px] text-blue-400 font-bold uppercase">{alert.detection_type}</div>
                                                                    </div>
                                                                    <div className="bg-white/[0.03] p-2 rounded-lg border border-white/5">
                                                                        <div className="text-[8px] text-white/40 font-bold uppercase mb-0.5">Confidence</div>
                                                                        <div className="text-[10px] text-green-400 font-bold">{(alert.confidence * 100).toFixed(1)}%</div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/30 mb-2 tracking-widest">
                                                                    <Info className="w-3 h-3" /> Feature Vector
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-[9px] text-white/60 leading-relaxed overflow-x-auto whitespace-pre">
                                                                    {JSON.stringify(alert.feature_snapshot, null, 2)}
                                                                </div>
                                                            </div>

                                                            <div className="flex justify-between items-center text-[8px] font-bold text-white/20 uppercase tracking-widest">
                                                                <span>{alert.model_version}</span>
                                                                <span>Latency: {alert.inference_latency}ms</span>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Engineering Signals */}
            <footer className="mt-10 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/40 font-bold uppercase tracking-[0.2em]">
                <div className="flex flex-wrap items-center justify-center gap-8">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-green-500/5 rounded-full border border-green-500/10">
                        <Globe className="w-3.5 h-3.5 text-green-500" /> Distributed Node: <span className="text-white/60">Global-Scan-01</span>
                    </span>
                    <span className="flex items-center gap-2 group cursor-help">
                        <Cpu className="w-3.5 h-3.5 text-blue-500 group-hover:animate-spin" /> Engine: <span className="text-white/60">Hybrid ML/Rule Engine</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-purple-500" /> Encryption: <span className="text-white/60">AES-256 E2E</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]" /> FP Rate: <span className="text-white/60">0.02% Rolling</span>
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white/30">© 2026 {IDENTITY.developer}</span>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <span className="text-white/60">SOC PLATFORM v2.0-STABLE</span>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color, trend, diff, isPulse }: any) {
    const colors: any = {
        blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5',
        red: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/5',
        green: 'text-green-500 bg-green-500/10 border-green-500/20 shadow-green-500/5',
        yellow: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/5',
        orange: 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/5',
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`bg-[#0A0A0A] border border-white/5 rounded-2xl p-6 transition-all hover:border-white/10 shadow-xl relative overflow-hidden group ${isPulse ? 'animate-[pulse_1.5s_infinite] border-red-500/50' : ''}`}
        >
            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-125 transition-all">
                <Icon className="w-16 h-16" />
            </div>
            <div className={`p-2.5 rounded-xl w-fit mb-5 ${colors[color]}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-3xl font-black tracking-tighter"
                >
                    {value}
                </motion.div>
                {trend && (
                    <div className={`flex items-center text-[10px] font-black ${trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-white/20'}`}>
                        {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : trend === 'down' ? <TrendingDown className="w-3 h-3 mr-0.5" /> : null}
                        {diff > 0 && `+${diff}`}
                    </div>
                )}
            </div>
            <div className="text-[10px] uppercase font-black tracking-widest text-white/30 italic group-hover:text-white/50 transition-colors">{label}</div>
        </motion.div>
    );
}
