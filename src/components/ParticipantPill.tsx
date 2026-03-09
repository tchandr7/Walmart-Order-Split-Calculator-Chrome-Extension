import React from 'react';

interface Props {
    name: string;
    isActive: boolean;
    onClick: () => void;
}

export const ParticipantPill: React.FC<Props> = ({ name, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            aria-pressed={isActive}
            className={`
        px-4 py-2 rounded-full text-base font-medium transition-all duration-75 border
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isActive
                    ? 'bg-blue-600 text-white border-blue-600 font-bold'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                }
      `}
        >
            {name}
        </button>
    );
};
