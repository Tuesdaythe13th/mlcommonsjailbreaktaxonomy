'use client';

import React from 'react';
import { ArrowUpRight, Terminal, ShieldAlert } from 'lucide-react';

interface TopHeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenExport: () => void;
}

export function TopHeader({ activeSection, onNavigate, onOpenExport }: TopHeaderProps) {
  const navItems = [
    { id: 'taxonomy', label: 'TAXONOMY' },
    { id: 'visual-analysis', label: 'PIPELINE' },
    { id: 'atlas3d', label: '3D ATLAS' },
    { id: 'manifold-volumetric', label: 'MANIFOLD' },
    { id: 'cell6-latent', label: 'CELL 6' },
    { id: 'catalog', label: 'ATTACKS [113]' },
    { id: 'radar', label: 'RADAR' },
    { id: 'vulnerability', label: 'SUT MATRIX' },
    { id: 'methodology', label: 'SPEC' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 pt-3 px-3 sm:px-6">
      {/* Sleek Floating Glassmorphic Nav Capsule */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-4 sm:px-6 py-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        {/* Zone 1: Red Noir Brand Wordmark */}
        <button
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
        >
          <div className="w-3.5 h-3.5 bg-[#ef233c] rounded-xs rotate-45 shadow-[0_0_12px_rgba(239,35,60,0.7)] group-hover:scale-110 transition-transform" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white uppercase">
            AIRR <span className="text-[#ef233c]">TAXONOMY</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <div className="hidden xl:flex items-center gap-5 text-[11px] font-mono tracking-wider text-zinc-400">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors py-1 relative cursor-pointer ${
                activeSection === item.id
                  ? 'text-white font-bold'
                  : 'hover:text-white'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              )}
            </button>
          ))}
        </div>

        {/* Zone 3: Live Status & Shiny CTA Button */}
        <div className="flex items-center gap-3">
          {/* Live Verified Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef233c]" />
            </span>
            <span className="text-zinc-300">113 VECTORS</span>
            <span className="text-[#ef233c] font-semibold">100% RECONCILED</span>
          </div>

          <a
            href="https://github.com/mlcommons/jailbreak-taxonomy"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-1 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors px-2 py-1"
          >
            <span>GITHUB</span>
            <ArrowUpRight className="w-3 h-3 text-[#ef233c]" />
          </a>

          {/* Shiny CTA Export Button with Conic Border Spin */}
          <button
            onClick={onOpenExport}
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 px-4 sm:px-5 py-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <span className="absolute inset-0 border border-white/10 rounded-full" />
            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_75%,#ef233c_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="absolute inset-[1px] rounded-full bg-zinc-950" />
            <span className="relative z-10 flex items-center gap-2 text-[11px] font-mono font-bold tracking-wider text-white">
              <Terminal className="w-3 h-3 text-[#ef233c]" />
              <span className="whitespace-nowrap">EXPORT</span>
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}
