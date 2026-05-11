import React, { useState } from 'react';
import { Sun, ChevronLeft, ChevronRight, Layers, FileImage } from 'lucide-react';

const BottomDrawer: React.FC = () => {
  return (
    <div className="h-[220px] bg-[#020303] border-t border-white/5 p-4 flex gap-4 z-40">
      <Panel title="OCT ENFACE" subTitle="0.85 SCAN">
        <div className="relative w-full h-[120px] bg-[#050607] rounded-[4px] overflow-hidden group border border-white/5">
           <img 
            src="https://picsum.photos/seed/oct1/400/200" 
            alt="OCT Enface" 
            className="w-full h-full object-cover grayscale opacity-40 contrast-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-2 right-2 flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <Layers className="w-3 h-3 text-white" />
            <FileImage className="w-3 h-3 text-white" />
          </div>
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
        </div>
        <BrightnessControl value={82} />
      </Panel>

      <Panel title="OCT B-SCAN" subTitle="Scan 05 / 24">
        <div className="flex flex-col gap-2 h-full">
          <div className="relative w-full h-[100px] bg-[#050607] rounded-[4px] border border-white/5 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]" />
             <svg className="w-full h-full" viewBox="0 0 100 40">
                <path 
                  d="M 5 35 Q 50 0 95 35" 
                  fill="none" 
                  stroke="#00FF88" 
                  strokeWidth="0.4" 
                  className="opacity-40"
                />
                <path 
                  d="M 5 38 Q 50 3 95 38" 
                  fill="none" 
                  stroke="#00FF88" 
                  strokeWidth="0.2" 
                  className="opacity-20"
                />
                <circle cx="50" cy="18" r="1" fill="#00FF88" className="animate-pulse shadow-[0_0_8px_#00FF88]" />
             </svg>
          </div>
          <div className="flex gap-1 h-[24px] items-center">
            <button className="p-0.5 hover:bg-white/5 rounded text-white/20 transition-colors"><ChevronLeft className="w-3 h-3" /></button>
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-[18px] bg-[#010202] border rounded-[2px] transition-all hover:border-white/20 ${i === 4 ? 'border-accent-green/60 bg-accent-green/5' : 'border-white/5'}`} 
              >
                 {i === 4 && <div className="w-full h-full flex items-center justify-center text-accent-green text-[8px] font-black italic">!</div>}
              </div>
            ))}
            <button className="p-0.5 hover:bg-white/5 rounded text-white/20 transition-colors"><ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      </Panel>

      <Panel title="EYE CAM 01" subTitle="INFRARED">
        <div className="relative w-full h-[120px] bg-[#050607] rounded-[4px] border border-white/5 overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/eye1/400/200" 
            alt="Camera 1" 
            className="w-full h-full object-cover grayscale opacity-40 brightness-75 transition-all group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-mono font-bold text-[#1594ff]">CH:01</div>
        </div>
        <BrightnessControl value={75} />
      </Panel>

      <Panel title="EYE CAM 02" subTitle="INFRARED">
        <div className="relative w-full h-[120px] bg-[#050607] rounded-[4px] border border-white/5 overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/eye2/400/200" 
            alt="Camera 2" 
            className="w-full h-full object-cover grayscale opacity-40 brightness-75 transition-all group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-mono font-bold text-[#1594ff]">CH:02</div>
        </div>
        <BrightnessControl value={75} />
      </Panel>
    </div>
  );
};

const Panel: React.FC<{ title: string; subTitle?: string; children: React.ReactNode }> = ({ title, subTitle, children }) => (
  <div className="flex-1 flex flex-col gap-1.5">
    <header className="flex justify-between items-center mb-1 pr-1">
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30">{title}</span>
      {subTitle && <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">{subTitle}</span>}
    </header>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const BrightnessControl: React.FC<{ value: number }> = ({ value }) => {
  const [val, setVal] = useState(value);
  return (
    <div className="flex items-center gap-3 mt-auto py-1">
      <Sun className="w-3 h-3 text-white/20" />
      <div className="flex-1 h-[1.5px] bg-white/[0.03] relative group">
        <div className="h-full bg-accent-green/60 shadow-[0_0_8px_rgba(0,255,136,0.2)]" style={{ width: `${val}%` }} />
        <input 
          type="range" min="0" max="100" value={val} 
          onChange={(e) => setVal(parseInt(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>
      <span className="text-[9px] font-mono font-bold tracking-widest text-white/30 w-[30px] text-right">{val}%</span>
    </div>
  );
};

export default BottomDrawer;
