import React from 'react';
import { LayoutGrid, ChevronDown, Settings, Maximize2, Circle, Minimize2, X } from 'lucide-react';

interface TopHeaderProps {
  onControlsToggle: () => void;
  showControls: boolean;
  eyeType: 'OD' | 'OS';
  setEyeType: (type: 'OD' | 'OS') => void;
}

const TopHeader: React.FC<TopHeaderProps> = ({ onControlsToggle, showControls, eyeType, setEyeType }) => {
  return (
    <header className="h-[88px] border-b border-white/5 bg-[#020304] px-6 flex items-center justify-between z-50">
      {/* OS Style Window Controls (Far Left) */}
      <div className="flex items-center gap-1.5 mr-6 opacity-40 hover:opacity-100 transition-opacity">
        <button 
          onClick={() => window.pyBridge?.close_app()}
          className="w-2.5 h-2.5 rounded-full bg-accent-red/20 border border-accent-red/40 hover:bg-accent-red transition-all" 
        />
        <button 
          onClick={() => window.pyBridge?.toggle_fullscreen()}
          className="w-2.5 h-2.5 rounded-full bg-accent-blue/10 border border-accent-blue/30" 
        />
        <button className="w-2.5 h-2.5 rounded-full bg-accent-green/10 border border-accent-green/30" />
      </div>

      {/* Brand Section */}
      <div className="flex items-center gap-4">
        <div className="w-[32px] h-[32px] border border-accent-green/60 rounded-full flex items-center justify-center relative shadow-[0_0_15px_rgba(0,255,136,0.2)]">
          <div className="w-[0.5px] h-full bg-accent-green absolute top-0 left-1/2 -translate-x-1/2 opacity-20" />
          <div className="w-full h-[0.5px] bg-accent-green absolute top-1/2 left-0 -translate-y-1/2 opacity-20" />
          <Circle className="w-1.5 h-1.5 text-accent-green fill-accent-green animate-pulse-medical" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[12px] font-black tracking-[0.2em] uppercase text-white">Centration</span>
          <span className="text-[9px] font-black tracking-[0.1em] uppercase text-white/30">Surgical Assist</span>
        </div>
      </div>

      <div className="h-12 w-[1px] bg-white/5 mx-6" />

      {/* Patient Info Section */}
      <div className="flex items-center gap-0">
        <InfoBlock label="PX ID" value="PX-1023" />
        <div className="h-8 w-[1px] bg-white/5 mx-6" />
        <InfoBlock label="PATIENT NAME" value="John Doe" />
        <div className="h-8 w-[1px] bg-white/5 mx-6" />
        <InfoBlock label="DOB / AGE" value="12-05-1980 / 44 Y" />
        <div className="h-8 w-[1px] bg-white/5 mx-6" />
        <InfoBlock label="SURGEON" value="Dr. Smith" />
      </div>

      <div className="flex-1" />

      {/* Right Controls Section */}
      <div className="flex items-center gap-6">
        {/* Controls Button */}
        <button 
          onClick={onControlsToggle}
          className={`h-[38px] px-3 flex items-center gap-3 border rounded-[4px] transition-all group ${showControls ? 'bg-accent-green/5 border-accent-green/30' : 'bg-white/[0.03] border-white/10 hover:border-white/20'}`}
        >
          <LayoutGrid className={`w-4 h-4 ${showControls ? 'text-accent-green' : 'text-white'}`} />
          <span className="text-[11px] font-semibold text-white">Controls</span>
          <div className="w-[1px] h-4 bg-white/10" />
          <ChevronDown className="w-3 h-3 text-white/30" />
        </button>

        {/* Eye Select */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Eye</span>
          <div className="flex items-center h-[24px] border border-white/10 rounded-[2px] overflow-hidden">
            <button 
              onClick={() => setEyeType('OD')}
              className={`px-2.5 h-full text-[9px] font-black transition-all ${eyeType === 'OD' ? 'bg-accent-green/10 text-accent-green' : 'text-white/20 hover:bg-white/5'}`}
            >
              OD
            </button>
            <button 
              onClick={() => setEyeType('OS')}
              className={`px-2.5 h-full text-[9px] font-black transition-all ${eyeType === 'OS' ? 'bg-accent-green/10 text-accent-green' : 'text-white/20 hover:bg-white/5'}`}
            >
              OS
            </button>
          </div>
        </div>

        {/* Mode */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Mode</span>
          <button className="h-[24px] px-2 flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-[4px] text-[10px] text-white">
            IR <ChevronDown className="w-2.5 h-2.5 text-white/30" />
          </button>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Status</span>
          <div className="flex items-center gap-2 h-[24px]">
            <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_#00ff88]" />
            <span className="text-[11px] font-black text-white tracking-widest">STABLE - READY</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="h-[38px] px-3 flex items-center gap-2 bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-[4px] transition-all">
            <Settings className="w-4 h-4 text-white" />
            <span className="text-[10px] font-semibold text-white">Settings</span>
          </button>
          <button 
             onClick={() => document.documentElement.requestFullscreen()}
             className="h-[38px] w-[38px] flex items-center justify-center bg-white/[0.03] hover:bg-white/10 border border-white/10 rounded-[4px] transition-all text-white/30 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

const InfoBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="label-tech mb-[2px]">{label}</span>
    <span className="value-tech">{value}</span>
  </div>
);

export default TopHeader;
