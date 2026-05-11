/**
 * Desktop Connection Utility
 * This module enables seamless communication between the React UI
 * and the Python PySide6 background process.
 */

interface SystemStatus {
    hwid: string;
    cpu_load: number;
    latency: string;
    temp: string;
    status: string;
}

interface PyBridge {
    log: (msg: string) => void;
    get_system_status: (callback: (status: SystemStatus) => void) => void;
    close_app: () => void;
    toggle_fullscreen: () => void;
}

declare global {
    interface Window {
        pyBridge?: PyBridge;
        desktopReady: Promise<PyBridge | null>;
    }
}

export const getBridge = async (): Promise<PyBridge | null> => {
    return window.desktopReady;
};

export const logToDesktop = async (message: string) => {
    const bridge = await getBridge();
    if (bridge) {
        bridge.log(message);
    } else {
        console.log(`[LOCAL_LOG] ${message}`);
    }
};

export const getDesktopStatus = async (): Promise<SystemStatus | null> => {
    const bridge = await getBridge();
    if (!bridge) return null;
    
    return new Promise((resolve) => {
        bridge.get_system_status((status) => resolve(status));
    });
};
