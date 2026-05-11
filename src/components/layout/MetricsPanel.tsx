import React, { useState } from 'react';
import { ChevronUp, Info, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MetricsPanel: React.FC = () => {
  return (
    <aside className="w-[300px] h-full bg-[#050708]/50 backdrop-blur-xl border-l border-white/5 flex flex-col z-40 overflow-y-auto">
      {/* Parameters Panel */}
      <Section title="PARAMETERS" defaultOpen={true} hasHide>
        <div className="flex flex-col gap-2">
          <MetricRow label="Pupil Center (X, Y)" value="124," secondValue="98" unit="px" valueColor="white" secondValueColor="blue" />
          <MetricRow label="Limbus Center (X, Y)" value="120," secondValue="95" unit="px" valueColor="white" secondValueColor="blue" />
          <MetricRow label="Pupil Diameter" value="3.62" unit="mm" />
          <MetricRow label="Limbus Diameter" value="11.24" unit="mm" />
          
          <div className="h-[1px] bg-white/[0.05] my-2" />
          
          <MetricRow label="Offset - Pupil vs Limbus" value="0.30" unit="mm" valueColor="yellow" unitColor="yellow" />
          <MetricRow label="Offset - Red Dot vs Pupil" value="0.28" unit="mm" />
          <MetricRow label="Offset - Red Dot vs Limbus" value="0.31" unit="mm" />
          
          <div className="h-[1px] bg-white/[0.05] my-2" />

          <MetricRow label="Confidence Score" value="0.92" valueColor="green" />
          <MetricRow label="HVID (Horizontal)" value="11.63" unit="mm" hasPencil />
          <MetricRow label="HVID (Vertical)" value="11.58" unit="mm" hasPencil />
        </div>
      </Section>

      {/* Stability Metrics */}
      <Section title="STABILITY METRICS" defaultOpen={true} hasInfo>
        <div className="flex flex-col gap-3">
          <MetricRow label="Stability Index" value="82%" valueColor="green" />
          
          {/* Dot bar graph */}
          <div className="flex items-center gap-[4px] py-1">
            {Array.from({ length: 24 }).map((_, i) => (
              <div 
                key={i} 
                className={`w-[6px] h-[6px] rounded-full ${i < 15 ? 'bg-[#00FF88]' : 'bg-white/10'}`} 
              />
            ))}
          </div>
          
          <MetricRow label="Movement (Last 2s)" value="0.12" unit="mm" />
          <MetricRow label="Quality Index" value="High" valueColor="green" />
        </div>
      </Section>

      {/* Image Quality & Latency */}
      <Section title="IMAGE QUALITY & LATENCY" defaultOpen={true} hasInfo>
        <div className="flex flex-col gap-3">
          <MetricRow label="Latency" value="12" unit="ms" valueColor="green" unitColor="green" />
          <MetricRow label="Quality Index" value="High" valueColor="green" />
        </div>
      </Section>

    </aside>
  );
};

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  hasHide?: boolean;
  hasInfo?: boolean;
}

const Section: React.FC<SectionProps> = ({ title, children, defaultOpen = true, hasHide, hasInfo }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col border-b border-white/5 p-4 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white uppercase tracking-wide">{title}</span>
          {hasInfo && <Info className="w-3.5 h-3.5 text-white/40" />}
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 group"
        >
          {hasHide && <span className="text-[11px] text-[#00c2ff]">Hide</span>}
          <ChevronUp className={`w-4 h-4 text-white transition-transform ${isOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

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

interface MetricRowProps {
  label: string;
  value: string | number;
  secondValue?: string | number;
  unit?: string;
  valueColor?: string;
  secondValueColor?: string;
  unitColor?: string;
  hasPencil?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ 
  label, value, secondValue, unit, 
  valueColor = 'white', secondValueColor = 'white', unitColor = 'white/40',
  hasPencil
}) => {
  const getColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-[#00c2ff]';
      case 'yellow': return 'text-[#FDB913]';
      case 'green': return 'text-[#00FF88]';
      case 'white': return 'text-white';
      case 'white/40': return 'text-white/40';
      default: return `text-[${color}]`;
    }
  };

  return (
    <div className="flex items-center justify-between group cursor-default h-[20px]">
      <span className="text-[11px] font-medium text-[#A0A5AA] hover:text-white/80 transition-colors">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5 font-mono">
        <span className={`text-[13px] font-bold ${getColor(valueColor)}`}>
          {value}
        </span>
        {secondValue && (
          <span className={`text-[13px] font-bold ${getColor(secondValueColor)}`}>
            {secondValue}
          </span>
        )}
        {unit && (
          <span className={`text-[10px] ${getColor(unitColor)} font-medium`}>
            {unit}
          </span>
        )}
        {hasPencil && (
          <Pencil className="w-3 h-3 text-white/40 ml-1 hover:text-white/80 cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default MetricsPanel;
