import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-24 h-24" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#0891b2" />
            </linearGradient>
             <linearGradient id="amberGrad" x1="50" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#b45309" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        
        {/* Left Side (Player - Cyan) */}
        {/* A shard like shape representing the 'Blue Buff' side or player */}
        <path d="M15 25 L45 10 L42 90 L10 80 Z" fill="url(#cyanGrad)" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
        
        {/* Right Side (Enemy - Amber/Red) */}
        {/* A shard like shape representing the 'Red Buff' side or enemy */}
        <path d="M55 10 L85 25 L90 80 L58 90 Z" fill="url(#amberGrad)" stroke="rgba(251,191,36,0.4)" strokeWidth="1" />
        
        {/* The Gap (Visual Tension lines) */}
        {/* Stylized rift/gap in the middle */}
        <path d="M50 5 V95" stroke="url(#cyanGrad)" strokeWidth="0.5" strokeOpacity="0.2" />
        
        <circle cx="50" cy="50" r="2" fill="#fff" filter="url(#glow)" opacity="0.8" />
        
        {/* Orbiting elements */}
        <circle cx="50" cy="50" r="30" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
    </svg>
);