import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type BackgroundMode = 'day' | 'night' | 'risk';

interface BackgroundModeColors {
    background: string;
    text: string;
    accent: string;
    cardBg: string;
    border: string;
    overlay?: string;
}

interface BackgroundModeContextType {
    mode: BackgroundMode;
    colors: BackgroundModeColors;
    setMode: (mode: BackgroundMode) => void;
    enableRiskMode: () => void;
    disableRiskMode: () => void;
}

const BackgroundModeContext = createContext<BackgroundModeContextType | undefined>(undefined);

const modeColors: Record<BackgroundMode, BackgroundModeColors> = {
    day: {
        background: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'text-emerald-600',
        cardBg: 'bg-white',
        border: 'border-gray-200',
    },
    night: {
        background: 'bg-slate-800',
        text: 'text-slate-50',
        accent: 'text-emerald-400',
        cardBg: 'bg-slate-700/50',
        border: 'border-slate-600',
    },
    risk: {
        background: 'bg-gray-50',
        text: 'text-gray-900',
        accent: 'text-orange-600',
        cardBg: 'bg-white',
        border: 'border-orange-200',
        overlay: 'bg-amber-500/5',
    },
};

export const BackgroundModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = useState<BackgroundMode>('day');
    const [isRiskActive, setIsRiskActive] = useState(false);

    // Night mode is disabled - app stays in day mode
    // Only risk mode can override day mode

    const enableRiskMode = () => {
        setIsRiskActive(true);
        setMode('risk');
    };

    const disableRiskMode = () => {
        setIsRiskActive(false);
        // Always revert to day mode
        setMode('day');
    };

    const value: BackgroundModeContextType = {
        mode,
        colors: modeColors[mode],
        setMode,
        enableRiskMode,
        disableRiskMode,
    };

    return (
        <BackgroundModeContext.Provider value={value}>
            {children}
        </BackgroundModeContext.Provider>
    );
};

export const useBackgroundMode = () => {
    const context = useContext(BackgroundModeContext);
    if (!context) {
        throw new Error('useBackgroundMode must be used within BackgroundModeProvider');
    }
    return context;
};
