/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import TopHeader from './components/layout/TopHeader';
import Sidebar from './components/layout/Sidebar';
import MainEyeView from './components/layout/MainEyeView';
import MetricsPanel from './components/layout/MetricsPanel';
import BottomDrawer from './components/layout/BottomDrawer';
import { ViewStage, EyeType } from './types';

export default function App() {
  const [activeStage, setActiveStage] = useState<ViewStage>('live');
  const [eyeType, setEyeType] = useState<EyeType>('OD');
  const [showControls, setShowControls] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-main-bg overflow-hidden relative">
      {/* Top Level Layout Container */}
      <TopHeader 
        onControlsToggle={() => setShowControls(!showControls)} 
        showControls={showControls}
        eyeType={eyeType}
        setEyeType={setEyeType}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar activeStage={activeStage} setActiveStage={setActiveStage} />
        
        {/* Main Workspace Area (Viewport + Metrics) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* The primary eye viewport area */}
            <MainEyeView showControls={showControls} />
            
            {/* The telemetry / parameters panel */}
            <MetricsPanel />
          </div>
          
          {/* Sub-panels and auxiliary views */}
          <BottomDrawer />
        </div>
      </div>

      {/* Global Background UI Elements (optional subtle scanlines or overlay noise) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] scanlines" />
    </div>
  );
}
