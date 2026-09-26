'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAMILIES } from '@/lib/taxonomyData';

export function TaxonomyMechanismRefractor() {
  const [activeFamilyIdx, setActiveFamilyIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-cycle through the 4 families every 4.5 seconds unless hovered/interacted
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveFamilyIdx((prev) => (prev + 1) % FAMILIES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Specific mechanism visual data for each family with Red Noir accents
  const familyVisualSpecs = [
    {
      id: 'perturbation',
      code: 'FAM-01',
      title: 'PERTURBATION DISPERSION',
      mechanism: 'TOKEN JITTER // HOMOGLYPH SHIFT',
      prevalence: '36.28%',
      vectors: ['Adv-Trigger Suffix', 'Char Micro-Edit', 'BPE Split Desync', 'Homoglyph Swap'],
      orbitAngles: [0, 90, 180, 270],
      pulseColor: '#ef233c',
      rotSpeed: 28,
    },
    {
      id: 'composition',
      code: 'FAM-02',
      title: 'CONTEXT FRAMING SYNTHESIS',
      mechanism: 'RECURSIVE WRAPPER // ATTENTION DILUTION',
      prevalence: '23.89%',
      vectors: ['Nested Inception', 'Task Overload Sieve', 'In-Context Interleave', 'Tree of Attacks'],
      orbitAngles: [45, 135, 225, 315],
      pulseColor: '#ef233c',
      rotSpeed: 36,
    },
    {
      id: 'encoding',
      code: 'FAM-03',
      title: 'SCHEMA ENCODING RECONSTRUCTION',
      mechanism: 'ZERO-WIDTH BIDI // AST PARSE INJECTION',
      prevalence: '20.35%',
      vectors: ['Base64 Cipher Stream', 'JSON-RPC Wrap', 'Unicode ZWSP Break', 'ASCII Glyphs'],
      orbitAngles: [30, 120, 210, 300],
      pulseColor: '#ef233c',
      rotSpeed: 22,
    },
    {
      id: 'overt',
      code: 'FAM-04',
      title: 'AUTHORITY OVERRIDE VECTORS',
      mechanism: 'NORMATIVE COLLAPSE // DUAL PERSONA',
      prevalence: '19.47%',
      vectors: ['DAN Root Contract', 'OWL Negative Constraint', 'Agent Teleology', 'Directive Preemption'],
      orbitAngles: [60, 150, 240, 330],
      pulseColor: '#ef233c',
      rotSpeed: 40,
    },
  ];

  const currentSpec = familyVisualSpecs[activeFamilyIdx];

  return (
    <div
      className="relative w-full aspect-square max-w-[460px] mx-auto bg-black/80 rounded-xl border border-white/10 overflow-hidden flex flex-col justify-between p-4 select-none shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Telemetry Overlay */}
      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-b border-white/10 pb-2 z-20">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] animate-pulse" />
          <span className="text-white font-bold">{currentSpec.code}</span>
          <span className="text-zinc-600">/</span>
          <span className="truncate max-w-[170px] sm:max-w-none text-zinc-300">{currentSpec.title}</span>
        </div>
        <div className="font-mono text-[#ef233c] font-bold">
          {currentSpec.prevalence}
        </div>
      </div>

      {/* Main Animated SVG Refractor Stage */}
      <div className="relative flex-1 flex items-center justify-center my-2 overflow-hidden">
        {/* Subtle coordinate crosshair grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.04]" />
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.04]" />
          <div className="absolute left-1/4 top-0 bottom-0 w-[1px] border-r border-dotted border-white/[0.03]" />
          <div className="absolute right-1/4 top-0 bottom-0 w-[1px] border-r border-dotted border-white/[0.03]" />
          <div className="absolute top-1/4 left-0 right-0 h-[1px] border-b border-dotted border-white/[0.03]" />
          <div className="absolute bottom-1/4 left-0 right-0 h-[1px] border-b border-dotted border-white/[0.03]" />
        </div>

        {/* Ambient Center Glow */}
        <div className="absolute w-[200px] h-[200px] bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Outer Circular Calibrated Ring with Slow Rotation */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[290px] h-[290px] rounded-full border border-white/10 flex items-center justify-center pointer-events-none"
        >
          {/* Tick marks on perimeter */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <div
              key={deg}
              className="absolute w-[6px] h-[1px] bg-zinc-600"
              style={{
                transform: `rotate(${deg}deg) translate(145px)`,
              }}
            />
          ))}
          {/* Primary cardinal tick marks */}
          {[0, 90, 180, 270].map((deg) => (
            <div
              key={`card-${deg}`}
              className="absolute w-[12px] h-[1.5px] bg-[#ef233c]"
              style={{
                transform: `rotate(${deg}deg) translate(145px)`,
              }}
            />
          ))}
        </motion.div>

        {/* Middle Counter-Rotating Precision Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: currentSpec.rotSpeed, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[210px] h-[210px] rounded-full border border-dashed border-red-500/20 flex items-center justify-center pointer-events-none"
        >
          {/* Four orbital payload nodes */}
          {currentSpec.orbitAngles.map((angle, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-zinc-950 border border-white/30 flex items-center justify-center rounded-xs shadow-[0_0_8px_rgba(239,35,60,0.5)]"
              style={{
                transform: `rotate(${angle}deg) translate(105px) rotate(-${angle}deg)`,
              }}
            >
              <div className="w-1 h-1 bg-[#ef233c]" />
            </motion.div>
          ))}
        </motion.div>

        {/* Central Geometric Monolith / Refractor Prism Core */}
        <motion.div
          key={currentSpec.id}
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-28 h-28 flex items-center justify-center"
        >
          {/* Outer rotating diamond */}
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border border-white/20 bg-zinc-900/40 rounded-xs"
            style={{ transformOrigin: 'center center' }}
          />

          {/* Inner counter-rotating diamond */}
          <motion.div
            animate={{ rotate: [360, 270, 180, 90, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 border border-dotted border-red-500/40"
            style={{ transformOrigin: 'center center' }}
          />

          {/* Central Black Refractor Monolith Core with Crimson Hairline Glint */}
          <div className="relative w-14 h-14 bg-black border border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(239,35,60,0.25)]">
            {/* Real mechanical register center */}
            <div className="w-3 h-3 border border-red-500/50 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-1.5 h-1.5 bg-[#ef233c] shadow-[0_0_8px_#ef233c]"
              />
            </div>

            {/* Pulsing Signal Trace */}
            <motion.div
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-[1.5px] bg-[#ef233c] shadow-[0_0_8px_#ef233c]"
            />
          </div>

          {/* Sweeping Refraction Laser Line (Single Red Signal Trace) */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[260px] h-[1px] pointer-events-none"
            style={{ transformOrigin: 'center center' }}
          >
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[#ef233c] to-transparent opacity-85 shadow-[0_0_8px_#ef233c]" />
          </motion.div>
        </motion.div>

        {/* Orbiting Atomic Vector Callouts */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSpec.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {/* Vector Tag 1: Top-Left */}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="absolute top-4 left-2 font-mono text-[9px] bg-black/90 px-2 py-0.5 border border-white/10 text-zinc-300 rounded shadow-md"
            >
              <span className="text-[#ef233c] mr-1 font-bold">01//</span>
              {currentSpec.vectors[0]}
            </motion.div>

            {/* Vector Tag 2: Top-Right */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="absolute top-4 right-2 font-mono text-[9px] bg-black/90 px-2 py-0.5 border border-white/10 text-zinc-300 rounded shadow-md"
            >
              <span className="text-[#ef233c] mr-1 font-bold">02//</span>
              {currentSpec.vectors[1]}
            </motion.div>

            {/* Vector Tag 3: Bottom-Left */}
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="absolute bottom-4 left-2 font-mono text-[9px] bg-black/90 px-2 py-0.5 border border-white/10 text-zinc-300 rounded shadow-md"
            >
              <span className="text-[#ef233c] mr-1 font-bold">03//</span>
              {currentSpec.vectors[2]}
            </motion.div>

            {/* Vector Tag 4: Bottom-Right */}
            <motion.div
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="absolute bottom-4 right-2 font-mono text-[9px] bg-black/90 px-2 py-0.5 border border-white/10 text-zinc-300 rounded shadow-md"
            >
              <span className="text-[#ef233c] mr-1 font-bold">04//</span>
              {currentSpec.vectors[3]}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Step Ribbon */}
      <div className="border-t border-white/10 pt-2 z-20">
        <div className="flex items-center justify-between font-mono text-[9px] text-zinc-400 mb-1.5">
          <span>ACTIVE MECHANISM VECTOR</span>
          <span className="text-white font-bold">{currentSpec.mechanism}</span>
        </div>

        {/* 4 Interactive Family Selector Bars */}
        <div className="grid grid-cols-4 gap-1.5">
          {familyVisualSpecs.map((spec, idx) => {
            const isActive = activeFamilyIdx === idx;
            return (
              <button
                key={spec.id}
                onClick={() => setActiveFamilyIdx(idx)}
                className={`py-1.5 px-1 text-[8px] font-mono text-center rounded border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#ef233c] text-white border-[#ef233c] shadow-[0_0_12px_rgba(239,35,60,0.5)] font-bold'
                    : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800/80 hover:text-white'
                }`}
              >
                <div className="font-bold">{spec.code}</div>
                <div className="text-[7px] truncate opacity-90">{spec.id.slice(0, 4).toUpperCase()}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
