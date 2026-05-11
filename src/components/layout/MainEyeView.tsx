import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Move, Pencil, Lock, Trash2, Play, Camera, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MainEyeViewProps {
  showControls: boolean;
}

const MainEyeView: React.FC<MainEyeViewProps> = ({ showControls }) => {
  const [zoom, setZoom] = useState(1.0);
  const [isLocked, setIsLocked] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  return (
    <div className="flex-1 bg-[#020303] relative flex items-center justify-center overflow-hidden">
      {/* Zoom Indicator Top Left - Professional compact style */}
      <div className="absolute top-[20px] left-[20px] z-20 flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
         <button className="h-[28px] w-[28px] border border-white/10 bg-white/[0.02] rounded-[4px] flex items-center justify-center hover:bg-white/10 text-white/40 hover:text-white transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
         </button>
         <div className="h-[28px] px-3 bg-white/[0.02] border border-white/10 rounded-[4px] flex items-center text-[11px] font-bold text-white/80 font-mono tracking-wider">
            MAG: {zoom.toFixed(2)}x
         </div>
         <div className="h-[28px] px-2 bg-accent-green/5 border border-accent-green/20 rounded-[4px] flex items-center text-[9px] font-bold text-accent-green tracking-tighter">
            LIVE
         </div>
      </div>

      {/* Floating Controls Overlay Panel - Centered HUD - Surgical Precision */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-[20px] left-1/2 -translate-x-1/2 z-40"
          >
            <div className="bg-[#0D0F10]/90 backdrop-blur-2xl border border-white/15 rounded-[10px] p-4 shadow-[0_32px_64px_rgba(0,0,0,0.8)] flex gap-6 items-center">
              {/* ROI CONTROL GROUP */}
              <div className="flex flex-col gap-2">
               <span className="text-[9px] uppercase text-white/30 font-black tracking-[0.2em] px-1 pointer-events-none">ROI Assist</span>
                <div className="flex gap-1.5 h-[36px]">
                  <ActionButton icon={Pencil} label="Define" variant="green" />
                  <ActionButton 
                    icon={Lock} 
                    label={isLocked ? "Secure" : "Secure"} 
                    variant="default" 
                    isActive={isLocked}
                    onClick={() => setIsLocked(!isLocked)}
                  />
                  <ActionButton icon={Trash2} label="Reset" variant="default" />
                </div>
              </div>

              <div className="w-[1px] h-[40px] bg-white/5" />

              {/* DETECTION GROUP */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase text-white/30 font-black tracking-[0.2em] px-1 text-center pointer-events-none">Processing</span>
                <div className="flex h-[36px]">
                  <ActionButton 
                    icon={Play} 
                    label="Execute" 
                    variant="green-fill" 
                    isActive={isDetecting}
                    onClick={() => setIsDetecting(!isDetecting)}
                  />
                </div>
              </div>

              <div className="w-[1px] h-[40px] bg-white/5" />

              {/* CAPTURE GROUP */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] uppercase text-white/30 font-black tracking-[0.2em] px-1 pointer-events-none">Documentation</span>
                <div className="flex gap-1.5 h-[36px]">
                  <ActionButton icon={Camera} label="Archive Pre" variant="blue" />
                  <ActionButton icon={Camera} label="Archive Post" variant="purple" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Eye Image Container - Technical Edge */}
      <div 
        className="relative w-full h-full max-w-[1500px] max-h-[850px] transition-transform duration-700 ease-in-out"
        style={{ transform: `scale(${zoom})` }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="relative w-full h-full rounded-[16px] overflow-hidden border border-white/5 bg-[#010202] shadow-[inset_0_0_120px_rgba(0,0,0,0.9)]">
             <img 
               src="https://picsum.photos/seed/surgeon-eye/1800/1100" 
               alt="Surgical View" 
               className="w-full h-full object-cover grayscale opacity-35 brightness-[0.8] scale-100"
               referrerPolicy="no-referrer"
             />
             
             {/* Integrated HUD Overlays */}
             <div className="absolute inset-4 border border-white/10 rounded-[12px] pointer-events-none overflow-hidden">
                <svg className="w-full h-full">
                  {/* Fine Grid Overlay */}
                  <defs>
                    <pattern id="imaging-grid-fine" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.3" opacity="0.04"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#imaging-grid-fine)" />

                  {/* High Persistence Crosshairs */}
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.4" opacity="0.15" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.4" opacity="0.15" />

                  {/* Limbus Ring - Precise Yellow (#FDB913) */}
                  <circle 
                    cx="50%" cy="50%" r="280" 
                    fill="none" 
                    stroke="#FDB913" 
                    strokeWidth="1.0" 
                    opacity="0.6"
                    strokeDasharray="4 2"
                  />
                  {/* Draggable Anchors */}
                  {Array.from({length: 4}).map((_, i) => {
                    const angle = (i * 90) * (Math.PI / 180);
                    const cx = `calc(50% + ${Math.cos(angle) * 280}px)`;
                    const cy = `calc(50% + ${Math.sin(angle) * 280}px)`;
                    return <circle key={i} cx={cx} cy={cy} r="3" fill="#FDB913" />;
                  })}

                  {/* Pupil Centration - Vibrant Green (#00FF88) */}
                  <circle 
                    cx="50%" cy="50%" r="120" 
                    fill="none" 
                    stroke="#00FF88" 
                    strokeWidth="1.2" 
                    className="drop-shadow-[0_0_8px_#00FF88]"
                  />
                  <circle cx="50%" cy="50%" r="2.5" fill="#00FF88" className="drop-shadow-[0_0_6px_#00FF88]" />
                  
                  {/* Dynamic Measurement Banner */}
                  <g transform="translate(20, 20)">
                    <rect width="140" height="30" rx="4" fill="black" fillOpacity="0.4" />
                    <text x="12" y="20" fill="#00FF88" className="text-[10px] font-mono font-black uppercase">OFFSET: 0.30mm</text>
                  </g>

                  {/* Right Status Banner */}
                  <g transform="translate(1320, 20)">
                     <text x="0" y="20" fill="white" fillOpacity="0.4" textAnchor="end" className="text-[9px] font-mono uppercase">STABILITY INDEX: 0.98</text>
                  </g>
                </svg>
             </div>
          </div>
        </div>
      </div>

      {/* Camera Tools (Right) */}
      <div className="absolute right-[32px] top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
         <ToolButtonSmall icon={ZoomIn} onClick={() => setZoom(z => Math.min(z + 0.1, 2.5))} label="Zoom +" />
         <ToolButtonSmall icon={ZoomOut} onClick={() => setZoom(z => Math.max(z - 0.1, 0.4))} label="Zoom -" />
         <div className="h-[1px] bg-white/10 my-1 mx-2" />
         <ToolButtonSmall icon={Move} onClick={() => {}} label="Pan" />
      </div>
    </div>
  );
};

const ToolButtonSmall: React.FC<{ icon: any; onClick: () => void; label: string }> = ({ icon: Icon, onClick, label }) => (
  <button 
    onClick={onClick}
    className="w-[40px] h-[40px] bg-white/[0.03] border border-white/10 rounded-[8px] flex flex-col items-center justify-center gap-1 hover:bg-white/10 text-white/50 hover:text-white transition-all group"
  >
    <Icon className="w-3.5 h-3.5" />
    <span className="text-[7px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

interface ActionButtonProps {
  icon: any;
  label: string;
  variant: 'green' | 'blue' | 'purple' | 'default' | 'green-fill';
  onClick?: () => void;
  isActive?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon: Icon, label, variant, onClick, isActive }) => {
  const getStyles = () => {
    switch (variant) {
      case 'green': return isActive ? 'bg-accent-green/20 text-accent-green border-accent-green/40' : 'text-accent-green hover:bg-accent-green/10 border-white/5';
      case 'green-fill': return 'bg-accent-green text-black border-accent-green shadow-[0_0_20px_#00ff88]';
      case 'blue': return 'text-[#1594ff] hover:bg-[#1594ff]/10 border-white/5';
      case 'purple': return 'text-accent-purple hover:bg-accent-purple/10 border-white/5';
      default: return isActive ? 'bg-white/10 text-white border-white/20' : 'text-white/60 hover:bg-white/5 border-white/5';
    }
  };

  return (
    <button 
      onClick={onClick}
      className={`h-full min-w-[80px] px-3.5 border rounded-[4px] flex items-center justify-center gap-2.5 font-black text-[9px] transition-all uppercase tracking-widest ${getStyles()}`}
    >
      <Icon className={`w-3.5 h-3.5 ${variant === 'green-fill' ? 'text-black' : ''} stroke-[2.5px]`} />
      <span>{label}</span>
    </button>
  );
};

export default MainEyeView;
