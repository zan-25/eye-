import React from 'react';
import { User, Video, Scan, FolderOpen, Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

type ViewStage = 'patient' | 'live' | 'oct' | 'view_data' | 'settings';

interface SidebarProps {
  activeStage: ViewStage;
  setActiveStage: (stage: ViewStage) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeStage, setActiveStage }) => {
  const navItems = [
    { id: 'patient', icon: User, label: 'PX INFO' },
    { id: 'live', icon: Video, label: 'LIVE' },
    { id: 'oct', icon: Scan, label: 'OCT' },
    { id: 'view_data', icon: FolderOpen, label: 'DATA' },
    { id: 'settings', icon: Settings, label: 'CNFG' },
  ];

  return (
    <aside className="w-[80px] h-full bg-[#020304] border-r border-white/5 flex flex-col items-center py-6 z-50">
      <div className="flex flex-col items-center mb-10 opacity-10 select-none">
        <span className="text-[8px] font-black tracking-[0.3em] transform -rotate-90 origin-center whitespace-nowrap mb-16">SYS_v2.5.0_PRO</span>
      </div>

      <nav className="flex-1 w-full flex flex-col pt-4">
        {navItems.map((item) => {
          const isActive = activeStage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveStage(item.id as ViewStage)}
              className={`h-[72px] w-full flex flex-col items-center justify-center gap-1.5 transition-all relative group
                ${isActive ? 'bg-accent-green/[0.03]' : 'hover:bg-white/[0.02]'}`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 top-[15px] bottom-[15px] w-[2px] bg-accent-green shadow-[0_0_15px_rgba(0,255,136,0.4)]"
                />
              )}
              <Icon className={`w-5 h-5 transition-all stroke-[1.5px] ${isActive ? 'text-accent-green' : 'text-white/20 group-hover:text-white/40'}`} />
              <span className={`text-[8px] font-black tracking-widest transition-colors uppercase ${isActive ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <button className="h-[72px] w-full flex flex-col items-center justify-center gap-1.5 text-warning-red/20 hover:text-warning-red hover:bg-warning-red/[0.03] transition-all group">
        <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
        <span className="text-[8px] font-black tracking-widest uppercase">Eject</span>
      </button>
    </aside>
  );
};

export default Sidebar;
