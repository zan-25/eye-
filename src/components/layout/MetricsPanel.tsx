import React, { useState } from 'react';
import { ChevronUp, Info, Pencil, Activity, Database, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MetricsPanel: React.FC = () => {
  return (
    <aside className="w-[300px] h-full bg-[#050708]/50 backdrop-blur-xl border-l border-white/5 flex flex-col z-40 overflow-y-auto">
      {/* Parameters Panel */}
      <Section title="Coordinates & Geometry" defaultOpen={true}>
        <div className="flex flex-col gap-3">
          <MetricRow label="Pupil Vector" value="124.0, 98.2" unit="px" color="blue" />
          <MetricRow label="Limbus Vector" value="120.5, 95.1" unit="px" color="blue" />
          <MetricRow label="Pupil Dia." value="3.62" unit="MM" />
          <MetricRow label="Limbus Dia." value="11.24" unit="MM" />
          
          <div className="h-[1px] bg-white/[0.03] my-1" />
          
          <MetricRow label="Decentration P vs L" value="0.30" unit="MM" color="yellow" />
          <MetricRow label="Geometric Offset" value="0.28" unit="MM" />
        </div>
      </Section>

      {/* Real-time Telemetry */}
      <Section title="Motion Telemetry" defaultOpen={true}>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-white/[0.02] p-2 rounded">
            <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-accent-green" />
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Stability Index</span>
            </div>
            <span className="text-[14px] font-bold text-accent-green font-mono">0.982</span>
          </div>
          
          {/* Waveform simulation */}
          <div className="flex items-end justify-between h-[30px] px-1 gap-[2px]">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="w-[4px] bg-accent-green/20 rounded-t" 
                style={{ height: `${20 + Math.random() * 80}%` }}
              />
            ))}
          </div>
          
          <MetricRow label="Micro-movement" value="0.12" unit="MM/S" />
          <MetricRow label="Tracking Lock" value="HIGH" color="green" />
        </div>
      </Section>

      {/* System Infrastructure */}
      <Section title="System Status" defaultOpen={true}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-white/20" />
              <span className="text-[10px] text-white/30 uppercase tracking-tighter">Buffer Stat</span>
            </div>
            <span className="text-[10px] font-mono text-white/60">NOMINAL</span>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
              <ShieldCheck className="w-3 h-3 text-accent-blue" />
              <span className="text-[10px] text-white/30 uppercase tracking-tighter">Integrity Check</span>
            </div>
            <span className="text-[10px] font-mono text-accent-blue">PASSED</span>
          </div>
        </div>
      </Section>

      {/* Desktop Version Footer */}
      <div className="mt-auto p-4 border-t border-white/5 bg-white/[0.01]">
         <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black font-mono text-white/20 uppercase tracking-[0.2em]">HWID:</span>
              <span className="text-[8px] font-mono text-white/40">7722-X9-FF0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black font-mono text-white/20 uppercase tracking-[0.2em]">Build:</span>
              <span className="text-[8px] font-mono text-white/40">2026.05.10-PRO</span>
            </div>
         </div>
      </div>
    </aside>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-white/5 p-4 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between mb-4 group"
      >
        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 group-hover:text-accent-green transition-colors">{title}</span>
        <ChevronUp className={`w-3.5 h-3.5 text-white/10 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricRow: React.FC<{ label: string; value: string | number; unit?: string; color?: string }> = ({ label, value, unit, color }) => {
  const getColor = () => {
    switch (color) {
        case 'blue': return 'text-[#00c2ff]';
        case 'yellow': return 'text-accent-yellow';
        case 'green': return 'text-accent-green';
        default: return 'text-white/80';
    }
  };

  return (
    <div className="flex items-center justify-between group cursor-default">
      <span className="text-[10px] font-bold text-white/30 uppercase tracking-tight group-hover:text-white/50 transition-colors">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5 font-mono">
        <span className={`text-[13px] font-bold ${getColor()}`}>
          {value}
        </span>
        {unit && <span className="text-[8px] text-white/20 font-black tracking-tighter">{unit}</span>}
      </div>
    </div>
  );
};

export default MetricsPanel;
