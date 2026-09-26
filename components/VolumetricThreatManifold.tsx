'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Play, RotateCcw, Code2, Database, Layers, Eye, Copy, Check, Sparkles, Box, ShieldAlert } from 'lucide-react';

interface CentroidDef {
  Leaf: string;
  Family: string;
  cx: number;
  cy: number;
  cz: number;
  count: number;
  color: string;
}

const CENTROIDS: CentroidDef[] = [
  // PERTURBATION (Cyan Domain)
  { Leaf: 'Adversarial Triggers', Family: 'Perturbation', cx: 4.5, cy: 9.2, cz: 2.0, count: 26, color: '#00E5FF' },
  { Leaf: 'Character Micro-Edits', Family: 'Perturbation', cx: 6.8, cy: 2.5, cz: 1.5, count: 9, color: '#00B0FF' },
  { Leaf: 'Paraphrase Transfer', Family: 'Perturbation', cx: 3.8, cy: 6.5, cz: 3.2, count: 3, color: '#82B1FF' },
  { Leaf: 'Local Paraphrase', Family: 'Perturbation', cx: 2.2, cy: 1.8, cz: 1.8, count: 2, color: '#80D8FF' },

  // COMPOSITION & ORDERING (Amber Domain)
  { Leaf: 'Benign Wrapper + Core', Family: 'Composition & Ordering', cx: 5.2, cy: 6.2, cz: 8.5, count: 10, color: '#FF9100' },
  { Leaf: 'Jailbreak Search & Opt', Family: 'Composition & Ordering', cx: 4.8, cy: 9.0, cz: 8.0, count: 9, color: '#FFAB40' },
  { Leaf: 'Scenario Assembly', Family: 'Composition & Ordering', cx: 3.5, cy: 7.5, cz: 9.1, count: 7, color: '#FFD180' },
  { Leaf: 'Interleaving Sections', Family: 'Composition & Ordering', cx: 4.0, cy: 5.0, cz: 7.2, count: 2, color: '#FFE082' },
  { Leaf: 'Token Shuffling', Family: 'Composition & Ordering', cx: 3.2, cy: 3.8, cz: 6.5, count: 1, color: '#FFECB3' },

  // ENCODING ABUSE (Emerald Domain)
  { Leaf: 'Base64 / URL Obfuscation', Family: 'Encoding Abuse', cx: 8.8, cy: 3.5, cz: 4.5, count: 9, color: '#00E676' },
  { Leaf: 'JSON / Code-Blocks', Family: 'Encoding Abuse', cx: 7.2, cy: 6.8, cz: 6.2, count: 5, color: '#69F0AE' },
  { Leaf: 'Prefix-Suffix Wrappers', Family: 'Encoding Abuse', cx: 6.5, cy: 5.2, cz: 5.0, count: 4, color: '#A7F3D0' },
  { Leaf: 'ASCII Encoding', Family: 'Encoding Abuse', cx: 8.0, cy: 2.2, cz: 3.8, count: 3, color: '#B9F6CA' },
  { Leaf: 'Unicode / Bidi / Zero-Width', Family: 'Encoding Abuse', cx: 9.6, cy: 7.8, cz: 4.0, count: 2, color: '#E8F5E9' },

  // OVERT CARRIERS (Crimson Domain)
  { Leaf: 'Simple Overrides', Family: 'Overt Carriers', cx: 1.2, cy: 1.2, cz: 1.8, count: 7, color: '#FF1744' },
  { Leaf: 'DAN Composites', Family: 'Overt Carriers', cx: 2.5, cy: 5.5, cz: 4.8, count: 7, color: '#FF5252' },
  { Leaf: 'Persona Role-Play', Family: 'Overt Carriers', cx: 2.0, cy: 4.2, cz: 5.5, count: 4, color: '#FF80AB' },
  { Leaf: 'Benign Pretext', Family: 'Overt Carriers', cx: 2.8, cy: 4.8, cz: 4.2, count: 3, color: '#FF80AB' }
];

interface AttackRecord {
  Attack_ID: string;
  Leaf: string;
  Family: string;
  Stealth_X: number;
  Automation_Y: number;
  Structure_Z: number;
  Color: string;
}

// Generate the reproducible 113 attacks with seed 2026
const GENERATED_ATTACKS: AttackRecord[] = (() => {
  const records: AttackRecord[] = [];
  let attackId = 1;
  let seed = 2026;

  // Linear congruential generator for reproducibility
  const nextRnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const nextGaussian = (mean: number, stdDev: number) => {
    const u1 = Math.max(0.0001, nextRnd());
    const u2 = nextRnd();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * stdDev;
  };

  for (const c of CENTROIDS) {
    for (let i = 0; i < c.count; i++) {
      const xVal = Math.max(0.5, Math.min(9.8, nextGaussian(c.cx, 0.45)));
      const yVal = Math.max(0.5, Math.min(9.8, nextGaussian(c.cy, 0.45)));
      const zVal = Math.max(0.5, Math.min(9.8, nextGaussian(c.cz, 0.45)));

      records.push({
        Attack_ID: `ATK-${String(attackId).padStart(3, '0')}`,
        Leaf: c.Leaf,
        Family: c.Family,
        Stealth_X: Math.round(xVal * 100) / 100,
        Automation_Y: Math.round(yVal * 100) / 100,
        Structure_Z: Math.round(zVal * 100) / 100,
        Color: c.color,
      });
      attackId++;
    }
  }

  return records;
})();

const FAMILY_DOMAINS = [
  { name: 'Perturbation Domain', family: 'Perturbation', color: 'rgba(0, 229, 255, 0.12)', border: '#00E5FF', badge: 'CYAN DOMAIN' },
  { name: 'Composition Domain', family: 'Composition & Ordering', color: 'rgba(255, 145, 0, 0.12)', border: '#FF9100', badge: 'AMBER DOMAIN' },
  { name: 'Encoding Domain', family: 'Encoding Abuse', color: 'rgba(0, 230, 118, 0.12)', border: '#00E676', badge: 'EMERALD DOMAIN' },
  { name: 'Overt Domain', family: 'Overt Carriers', color: 'rgba(255, 23, 68, 0.12)', border: '#FF1744', badge: 'CRIMSON DOMAIN' }
];

export function VolumetricThreatManifold() {
  const [activeTab, setActiveTab] = useState<'3d' | 'code' | 'table' | 'domains'>('3d');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('all');
  const [showHulls, setShowHulls] = useState<boolean>(true);
  const [showCentroids, setShowCentroids] = useState<boolean>(true);
  const [hoveredAttack, setHoveredAttack] = useState<AttackRecord | null>(null);
  const [selectedAttack, setSelectedAttack] = useState<AttackRecord | null>(GENERATED_ATTACKS[0]);
  const [isCopied, setIsCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '💾 [artifex_log]: Synthesizing 113 Attack Vector Coordinates in 3D Spatial Vector Space...',
    '📈 [artifex_log]: Generated Coordinates for 113 Attack Vectors across 4 Volumetric Domains.',
    '✨ [artifex_log]: 3D Volumetric Manifold Visualization Complete.'
  ]);

  // Orbit controls initialized to match plotly camera eye (x=-1.75, y=-1.65, z=1.25)
  const [yaw, setYaw] = useState<number>(-0.85);
  const [pitch, setPitch] = useState<number>(0.48);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filtered attacks
  const filteredAttacks = useMemo(() => {
    if (selectedFamilyFilter === 'all') return GENERATED_ATTACKS;
    return GENERATED_ATTACKS.filter((a) => a.Family === selectedFamilyFilter);
  }, [selectedFamilyFilter]);

  const handleResetCamera = () => {
    setYaw(-0.85);
    setPitch(0.48);
    setZoom(1.0);
  };

  const handleRunCell = () => {
    setIsRunning(true);
    setLogs([
      '⚡ [runtime]: Executing Python kernel for 3D THREAT MANIFOLD & VOLUMETRIC VECTOR SPACE...',
      '💾 [artifex_log]: Synthesizing 113 Attack Vector Coordinates in 3D Spatial Vector Space (seed=2026)...',
      '📈 [artifex_log]: Calculated 4 Convex Hull Domain Enclosures (Mesh3d alphahull=0)...',
      '✨ [artifex_log]: 3D Volumetric Manifold Visualization Complete.'
    ]);
    setTimeout(() => {
      setIsRunning(false);
    }, 450);
  };

  const handleCopyCode = () => {
    const pythonCode = `#@title 🌌 3D THREAT MANIFOLD & VOLUMETRIC VECTOR SPACE
#@markdown Run this cell to render a 3D Volumetric Manifold mapping all 113 cataloged attacks across **Stealth (X)**, **Automation (Y)**, and **Structural Distortion (Z)** with 3D Convex Hull Domain Enclosures.

!pip install pandas plotly numpy -q

import numpy as np
import pandas as pd
import plotly.graph_objects as go

if 'artifex_log' not in globals():
    def artifex_log(msg, icon="ℹ️"):
        print(f"{icon} {msg}")

artifex_log("Synthesizing 113 Attack Vector Coordinates in 3D Spatial Vector Space...", "💾")
np.random.seed(2026)

# 18 Atomic Leaf Centroids
centroids = ${JSON.stringify(CENTROIDS, null, 2)}

# Expand Centroids into 113 Attack Vector Points with Gaussian Noise
attack_records = []
attack_id = 1
for c in centroids:
    for i in range(c["count"]):
        x_val = np.clip(np.random.normal(c["cx"], 0.45), 0.5, 9.8)
        y_val = np.clip(np.random.normal(c["cy"], 0.45), 0.5, 9.8)
        z_val = np.clip(np.random.normal(c["cz"], 0.45), 0.5, 9.8)
        attack_records.append({
            "Attack_ID": f"ATK-{attack_id:03d}",
            "Leaf": c["Leaf"],
            "Family": c["Family"],
            "Stealth_X": round(x_val, 2),
            "Automation_Y": round(y_val, 2),
            "Structure_Z": round(z_val, 2),
            "Color": c["color"]
        })
        attack_id += 1

df_attacks = pd.DataFrame(attack_records)
artifex_log(f"Generated Coordinates for {len(df_attacks)} Attack Vectors across 4 Volumetric Domains.", "📈")

fig = go.Figure()

# 1. FAMILY VOLUMETRIC HULLS
family_configs = [
    {"name": "Perturbation Domain", "family": "Perturbation", "color": "rgba(0, 229, 255, 0.12)", "border": "#00E5FF"},
    {"name": "Composition Domain", "family": "Composition & Ordering", "color": "rgba(255, 145, 0, 0.12)", "border": "#FF9100"},
    {"name": "Encoding Domain", "family": "Encoding Abuse", "color": "rgba(0, 230, 118, 0.12)", "border": "#00E676"},
    {"name": "Overt Domain", "family": "Overt Carriers", "color": "rgba(255, 23, 68, 0.12)", "border": "#FF1744"}
]

for fc in family_configs:
    sub_df = df_attacks[df_attacks["Family"] == fc["family"]]
    fig.add_trace(go.Mesh3d(
        x=sub_df["Stealth_X"],
        y=sub_df["Automation_Y"],
        z=sub_df["Structure_Z"],
        alphahull=0,
        color=fc["color"],
        opacity=0.8,
        name=fc["name"],
        hoverinfo='none'
    ))

# 2. 113 INDIVIDUAL ATTACK PARTICLES
for fam in df_attacks["Family"].unique():
    fam_df = df_attacks[df_attacks["Family"] == fam]
    fig.add_trace(go.Scatter3d(
        x=fam_df["Stealth_X"],
        y=fam_df["Automation_Y"],
        z=fam_df["Structure_Z"],
        mode='markers',
        marker=dict(size=6, color=fam_df["Color"].iloc[0], opacity=0.9, line=dict(color='#FFFFFF', width=0.8)),
        name=f"Attacks: {fam}"
    ))

fig.show()
artifex_log("3D Volumetric Manifold Visualization Complete.", "✨")`;

    navigator.clipboard.writeText(pythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 3D Point Projection onto 2D Canvas matching Plotly Cybernetic layout
  const project3D = useCallback(
    (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number
    ): { px: number; py: number; depth: number } => {
      // Rotate around Y axis (yaw)
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      // Rotate around X axis (pitch)
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      const cameraDistance = 320;
      const fov = 380 * zoom;
      const depth = z2 + cameraDistance;
      const scale = fov / Math.max(15, depth);

      const px = width / 2 + x1 * scale;
      const py = height / 2 - y2 * scale;

      return { px, py, depth };
    },
    [yaw, pitch, zoom]
  );

  // Mouse handlers for Orbit
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      setYaw((prev) => prev + dx * 0.008);
      setPitch((prev) => Math.max(-1.4, Math.min(1.4, prev - dy * 0.008)));
    },
    [isDragging]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((prev) => Math.max(0.5, Math.min(2.5, prev - e.deltaY * 0.0012)));
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.scale(dpr, dpr);

    // Plotly layout: paper_bgcolor='#030303', plot_bgcolor='#030303'
    ctx.fillStyle = '#030303';
    ctx.fillRect(0, 0, width, height);

    // Coordinate mapping: 0 to 10.5 -> -80 to +80
    const mapCoord = (val: number) => ((val - 5.25) / 5.25) * 80;

    // 1. Draw 3D Bounding Box & Grid Lines (#222222)
    const boxMin = mapCoord(0);
    const boxMax = mapCoord(10.5);

    const corners = [
      project3D(boxMin, boxMin, boxMin, width, height),
      project3D(boxMax, boxMin, boxMin, width, height),
      project3D(boxMax, boxMax, boxMin, width, height),
      project3D(boxMin, boxMax, boxMin, width, height),
      project3D(boxMin, boxMin, boxMax, width, height),
      project3D(boxMax, boxMin, boxMax, width, height),
      project3D(boxMax, boxMax, boxMax, width, height),
      project3D(boxMin, boxMax, boxMax, width, height),
    ];

    // Floor shadow / fill
    ctx.fillStyle = '#060606';
    ctx.beginPath();
    ctx.moveTo(corners[0].px, corners[0].py);
    ctx.lineTo(corners[1].px, corners[1].py);
    ctx.lineTo(corners[5].px, corners[5].py);
    ctx.lineTo(corners[4].px, corners[4].py);
    ctx.closePath();
    ctx.fill();

    // Scene Grid Lines
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1;
    for (let step = 0; step <= 10; step += 2.5) {
      const c = mapCoord(step);
      // Floor grid lines
      const p1 = project3D(c, boxMin, boxMin, width, height);
      const p2 = project3D(c, boxMin, boxMax, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      const p3 = project3D(boxMin, boxMin, c, width, height);
      const p4 = project3D(boxMax, boxMin, c, width, height);
      ctx.beginPath();
      ctx.moveTo(p3.px, p3.py);
      ctx.lineTo(p4.px, p4.py);
      ctx.stroke();
    }

    // Outer Bounding Cube Edges (#333333)
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    cubeEdges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(corners[i].px, corners[i].py);
      ctx.lineTo(corners[j].px, corners[j].py);
      ctx.stroke();
    });

    // 2. Axis Vectors & Titles
    const pX = project3D(mapCoord(11.2), boxMin, boxMin, width, height);
    const pY = project3D(boxMin, mapCoord(11.2), boxMin, width, height);
    const pZ = project3D(boxMin, boxMin, mapCoord(11.2), width, height);

    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('PRE-FILTER STEALTH (X)', pX.px + 4, pX.py);

    ctx.fillStyle = '#FF9100';
    ctx.fillText('ALGORITHMIC AUTOMATION (Y)', pY.px + 4, pY.py);

    ctx.fillStyle = '#00E676';
    ctx.fillText('STRUCTURAL DISTORTION (Z)', pZ.px + 4, pZ.py);

    // 3. 3D CONVEX HULL DOMAIN ENCLOSURES (Mesh3d)
    if (showHulls) {
      FAMILY_DOMAINS.forEach((domain) => {
        if (selectedFamilyFilter !== 'all' && selectedFamilyFilter !== domain.family) return;

        const famPoints = GENERATED_ATTACKS.filter((a) => a.Family === domain.family);
        if (famPoints.length < 4) return;

        // Project points
        const proj = famPoints.map((a) =>
          project3D(mapCoord(a.Stealth_X), mapCoord(a.Automation_Y), mapCoord(a.Structure_Z), width, height)
        );

        // Approximate convex envelope by sorting radial angles
        const centerPx = proj.reduce((acc, p) => acc + p.px, 0) / proj.length;
        const centerPy = proj.reduce((acc, p) => acc + p.py, 0) / proj.length;

        // Draw translucent boundary fill
        ctx.fillStyle = domain.color;
        ctx.strokeStyle = domain.border;
        ctx.lineWidth = 1;

        // Draw soft convex polygonal hull
        ctx.beginPath();
        const sorted = [...proj].sort((a, b) => {
          const a1 = Math.atan2(a.py - centerPy, a.px - centerPx);
          const a2 = Math.atan2(b.py - centerPy, b.px - centerPx);
          return a1 - a2;
        });

        if (sorted.length > 0) {
          ctx.moveTo(sorted[0].px, sorted[0].py);
          for (let k = 1; k < sorted.length; k++) {
            ctx.lineTo(sorted[k].px, sorted[k].py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      });
    }

    // 4. Collect Render Items for Depth Sorting
    interface RenderItem {
      type: 'attack' | 'centroid';
      depth: number;
      draw: () => void;
      data?: AttackRecord;
      px: number;
      py: number;
    }

    const items: RenderItem[] = [];

    // Add 113 Attack Particles
    filteredAttacks.forEach((atk) => {
      const p = project3D(
        mapCoord(atk.Stealth_X),
        mapCoord(atk.Automation_Y),
        mapCoord(atk.Structure_Z),
        width,
        height
      );

      const isHovered = hoveredAttack?.Attack_ID === atk.Attack_ID;
      const isSelected = selectedAttack?.Attack_ID === atk.Attack_ID;

      items.push({
        type: 'attack',
        depth: p.depth,
        px: p.px,
        py: p.py,
        data: atk,
        draw: () => {
          // Drop-line to floor
          const pFloor = project3D(
            mapCoord(atk.Stealth_X),
            boxMin,
            mapCoord(atk.Structure_Z),
            width,
            height
          );
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.px, p.py);
          ctx.lineTo(pFloor.px, pFloor.py);
          ctx.stroke();

          // Particle marker
          const r = isSelected ? 6.5 : isHovered ? 5.5 : 4.2;
          ctx.beginPath();
          ctx.arc(p.px, p.py, r, 0, Math.PI * 2);
          ctx.fillStyle = atk.Color;
          ctx.fill();

          ctx.strokeStyle = isSelected ? '#FFFFFF' : '#030303';
          ctx.lineWidth = isSelected ? 2 : 0.8;
          ctx.stroke();

          if (isSelected || isHovered) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(p.px, p.py, r + 4, 0, Math.PI * 2);
            ctx.stroke();
          }
        },
      });
    });

    // Add Centroid Diamonds
    if (showCentroids) {
      CENTROIDS.forEach((c) => {
        if (selectedFamilyFilter !== 'all' && selectedFamilyFilter !== c.Family) return;

        const p = project3D(mapCoord(c.cx), mapCoord(c.cy), mapCoord(c.cz), width, height);

        items.push({
          type: 'centroid',
          depth: p.depth,
          px: p.px,
          py: p.py,
          draw: () => {
            const size = 7;
            ctx.beginPath();
            ctx.moveTo(p.px, p.py - size);
            ctx.lineTo(p.px + size, p.py);
            ctx.lineTo(p.px, p.py + size);
            ctx.lineTo(p.px - size, p.py);
            ctx.closePath();

            ctx.fillStyle = c.color;
            ctx.fill();
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.4;
            ctx.stroke();

            // Label for centroids with >= 5 attacks
            if (c.count >= 5) {
              ctx.font = '9px "Courier New", monospace';
              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(c.Leaf, p.px - 20, p.py - 10);
            }
          },
        });
      });
    }

    // Depth sort (painter's algorithm)
    items.sort((a, b) => b.depth - a.depth);
    items.forEach((item) => item.draw());

    // Save for hover hit testing
    (canvas as any).__projectedItems = items.filter((it) => it.type === 'attack');
  }, [filteredAttacks, yaw, pitch, zoom, project3D, hoveredAttack, selectedAttack, showHulls, showCentroids, selectedFamilyFilter]);

  // Mouse handlers for Hit Testing
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(e);
    const canvas = canvasRef.current;
    if (!canvas || isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const items: { px: number; py: number; data: AttackRecord }[] =
      (canvas as any).__projectedItems || [];
    let found: AttackRecord | null = null;
    let minDist = 14;

    for (const it of items) {
      const dist = Math.hypot(it.px - mouseX, it.py - mouseY);
      if (dist < minDist) {
        minDist = dist;
        found = it.data;
      }
    }
    setHoveredAttack(found);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const items: { px: number; py: number; data: AttackRecord }[] =
      (canvas as any).__projectedItems || [];
    let closest: AttackRecord | null = null;
    let minDist = 18;

    for (const it of items) {
      const dist = Math.hypot(it.px - mouseX, it.py - mouseY);
      if (dist < minDist) {
        minDist = dist;
        closest = it.data;
      }
    }

    if (closest) {
      setSelectedAttack(closest);
      setHoveredAttack(closest);
    }
  };

  return (
    <section id="manifold-volumetric" className="w-full hairline-b bg-[#030303] text-[#FFFFFF]">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80 border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[NOTEBOOK // 3D MANIFOLD]</span>
          <span className="text-white">3D THREAT MANIFOLD &amp; VOLUMETRIC VECTOR SPACE</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400">STEALTH × AUTOMATION × DISTORTION</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="hidden sm:inline">113 ATTACKS · 18 LEAF CENTROIDS</span>
          <span className="text-[#ef233c] font-bold">4 VOLUMETRIC CONVEX HULLS</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
        {/* Cell Header with Run Cell Trigger */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 hairline-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ef233c] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#@title 🌌 3D THREAT MANIFOLD &amp; VOLUMETRIC VECTOR SPACE</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-[-0.04em]">
              3D VOLUMETRIC <span className="text-[#ef233c]">ATTACK MANIFOLD</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              3D coordinate space mapping 113 attacks across Stealth (X) × Automation (Y) × Structural Distortion (Z) with convex domain enclosures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Run Cell Action in Red Noir Style */}
            <button
              onClick={handleRunCell}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ef233c] hover:bg-red-700 text-white font-mono text-xs font-bold rounded-full cursor-pointer transition-all shadow-[0_0_20px_rgba(239,35,60,0.35)]"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'SYNTHESIZING MANIFOLD...' : 'RUN CELL [SHIFT + ENTER]'}</span>
            </button>

            {/* Navigation Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === '3d' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                3D VIEWPORT
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === 'code' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                PYTHON CODE
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === 'table' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                DATAFRAME [113]
              </button>
              <button
                onClick={() => setActiveTab('domains')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === 'domains' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                HULL DOMAINS
              </button>
            </div>
          </div>
        </div>

        {/* Live Terminal Stream */}
        <div className="mt-4 p-3 bg-zinc-950/90 border border-white/10 rounded-xl font-mono text-[11px] text-[#ef233c] flex flex-col gap-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#555555]">[{i + 1}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Workspace Area */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 3D Canvas / Code / Table (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#030303] border border-[#222222] rounded overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0A0A0A] border-b border-[#222222] text-xs font-mono">
              {/* Family Filter */}
              <div className="flex items-center gap-2">
                <span className="text-[#888888]">FAMILY DOMAIN:</span>
                <select
                  value={selectedFamilyFilter}
                  onChange={(e) => setSelectedFamilyFilter(e.target.value)}
                  className="bg-[#151515] text-[#FFFFFF] border border-[#333333] rounded px-2 py-0.5 text-xs font-mono cursor-pointer"
                >
                  <option value="all">ALL DOMAINS (113 ATTACKS)</option>
                  <option value="Perturbation">PERTURBATION (CYAN)</option>
                  <option value="Composition & Ordering">COMPOSITION (AMBER)</option>
                  <option value="Encoding Abuse">ENCODING (EMERALD)</option>
                  <option value="Overt Carriers">OVERT CARRIERS (CRIMSON)</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#CCCCCC]">
                  <input
                    type="checkbox"
                    checked={showHulls}
                    onChange={(e) => setShowHulls(e.target.checked)}
                    className="accent-[#00E5FF]"
                  />
                  <span>CONVEX HULLS</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-[#CCCCCC]">
                  <input
                    type="checkbox"
                    checked={showCentroids}
                    onChange={(e) => setShowCentroids(e.target.checked)}
                    className="accent-[#00E5FF]"
                  />
                  <span>CENTROIDS (18)</span>
                </label>
                <button
                  onClick={handleResetCamera}
                  title="Reset Camera View"
                  className="p-1 text-[#888888] hover:text-[#FFFFFF] cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TAB 1: 3D VIEWPORT */}
            {activeTab === '3d' && (
              <div className="relative w-full h-[620px] select-none bg-[#030303]">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  onClick={handleCanvasClick}
                  className="w-full h-full cursor-grab active:cursor-grabbing block"
                />

                {/* Plotly Inset Legend */}
                <div className="absolute top-4 left-4 p-3 bg-[#080808]/90 border border-[#222222] rounded text-[11px] font-mono pointer-events-none backdrop-blur-sm">
                  <div className="text-[#FFFFFF] font-bold mb-1">VOLUMETRIC DOMAINS</div>
                  <div className="space-y-1 text-[10px]">
                    {FAMILY_DOMAINS.map((d) => (
                      <div key={d.name} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.border }} />
                        <span className="text-[#CCCCCC]">{d.name}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 pt-1 border-t border-[#222222]">
                      <span className="w-2 h-2 rotate-45 border border-white bg-white" />
                      <span className="text-[#AAAAAA]">Atomic Leaf Centroids</span>
                    </div>
                  </div>
                </div>

                {/* Hover Tooltip Overlay (matching Plotly format) */}
                {hoveredAttack && (
                  <div className="absolute bottom-4 left-4 max-w-sm p-3.5 bg-[#080808] border border-[#00E5FF] rounded shadow-2xl font-mono text-xs pointer-events-none z-10">
                    <div className="text-white font-bold text-sm mb-1">{hoveredAttack.Attack_ID}</div>
                    <div className="text-[#CCCCCC] text-[11px]">Leaf: {hoveredAttack.Leaf}</div>
                    <div className="text-[#888888] text-[11px] mb-2">Family: {hoveredAttack.Family}</div>
                    <div className="space-y-0.5 text-[10px] pt-1.5 border-t border-[#222222]">
                      <div className="text-[#00E5FF]">Stealth (X): {hoveredAttack.Stealth_X}/10</div>
                      <div className="text-[#FF9100]">Automation (Y): {hoveredAttack.Automation_Y}/10</div>
                      <div className="text-[#00E676]">Structural Distortion (Z): {hoveredAttack.Structure_Z}/10</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PYTHON CODE */}
            {activeTab === 'code' && (
              <div className="p-4 bg-[#030303] font-mono text-xs overflow-auto max-h-[620px]">
                <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
                  <div className="flex items-center gap-2 text-[#00E5FF]">
                    <Code2 className="w-4 h-4" />
                    <span>3d_threat_manifold_volumetric.py</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#DDDDDD] rounded cursor-pointer transition-colors text-[11px]"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'COPIED SCRIPT' : 'COPY SCRIPT'}</span>
                  </button>
                </div>
                <pre className="text-[#E0E0E0] leading-relaxed whitespace-pre font-mono">
                  {`#@title 🌌 3D THREAT MANIFOLD & VOLUMETRIC VECTOR SPACE
#@markdown Run this cell to render a 3D Volumetric Manifold mapping all 113 cataloged attacks across **Stealth (X)**, **Automation (Y)**, and **Structural Distortion (Z)** with 3D Convex Hull Domain Enclosures.

!pip install pandas plotly numpy -q

import numpy as np
import pandas as pd
import plotly.graph_objects as go

# Helper for logging
if 'artifex_log' not in globals():
    def artifex_log(msg, icon="ℹ️"):
        print(f"{icon} {msg}")

artifex_log("Synthesizing 113 Attack Vector Coordinates in 3D Spatial Vector Space...", "💾")
np.random.seed(2026)

# 18 Atomic Leaf Centroids in 3D Feature Space
# Axis X: Pre-Filter Stealth (0 = Cleartext, 10 = Zero-Width/Cipher Obfuscation)
# Axis Y: Algorithmic Automation (0 = Manual Prompt, 10 = Gradient/RL Search)
# Axis Z: Structural Distortion (0 = Native Wording, 10 = Extended Multi-Layer Framing/Fragmented)
centroids = [
    # PERTURBATION (Cyan Domain)
    {"Leaf": "Adversarial Triggers", "Family": "Perturbation", "cx": 4.5, "cy": 9.2, "cz": 2.0, "count": 26, "color": "#00E5FF"},
    {"Leaf": "Character Micro-Edits", "Family": "Perturbation", "cx": 6.8, "cy": 2.5, "cz": 1.5, "count": 9, "color": "#00B0FF"},
    {"Leaf": "Paraphrase Transfer", "Family": "Perturbation", "cx": 3.8, "cy": 6.5, "cz": 3.2, "count": 3, "color": "#82B1FF"},
    {"Leaf": "Local Paraphrase", "Family": "Perturbation", "cx": 2.2, "cy": 1.8, "cz": 1.8, "count": 2, "color": "#80D8FF"},

    # COMPOSITION & ORDERING (Amber Domain)
    {"Leaf": "Benign Wrapper + Core", "Family": "Composition & Ordering", "cx": 5.2, "cy": 6.2, "cz": 8.5, "count": 10, "color": "#FF9100"},
    {"Leaf": "Jailbreak Search & Opt", "Family": "Composition & Ordering", "cx": 4.8, "cy": 9.0, "cz": 8.0, "count": 9, "color": "#FFAB40"},
    {"Leaf": "Scenario Assembly", "Family": "Composition & Ordering", "cx": 3.5, "cy": 7.5, "cz": 9.1, "count": 7, "color": "#FFD180"},
    {"Leaf": "Interleaving Sections", "Family": "Composition & Ordering", "cx": 4.0, "cy": 5.0, "cz": 7.2, "count": 2, "color": "#FFE082"},
    {"Leaf": "Token Shuffling", "Family": "Composition & Ordering", "cx": 3.2, "cy": 3.8, "cz": 6.5, "count": 1, "color": "#FFECB3"},

    # ENCODING ABUSE (Emerald Domain)
    {"Leaf": "Base64 / URL Obfuscation", "Family": "Encoding Abuse", "cx": 8.8, "cy": 3.5, "cz": 4.5, "count": 9, "color": "#00E676"},
    {"Leaf": "JSON / Code-Blocks", "Family": "Encoding Abuse", "cx": 7.2, "cy": 6.8, "cz": 6.2, "count": 5, "color": "#69F0AE"},
    {"Leaf": "Prefix-Suffix Wrappers", "Family": "Encoding Abuse", "cx": 6.5, "cy": 5.2, "cz": 5.0, "count": 4, "color": "#A7F3D0"},
    {"Leaf": "ASCII Encoding", "Family": "Encoding Abuse", "cx": 8.0, "cy": 2.2, "cz": 3.8, "count": 3, "color": "#B9F6CA"},
    {"Leaf": "Unicode / Bidi / Zero-Width", "Family": "Encoding Abuse", "cx": 9.6, "cy": 7.8, "cz": 4.0, "count": 2, "color": "#E8F5E9"},

    # OVERT CARRIERS (Crimson Domain)
    {"Leaf": "Simple Overrides", "Family": "Overt Carriers", "cx": 1.2, "cy": 1.2, "cz": 1.8, "count": 7, "color": "#FF1744"},
    {"Leaf": "DAN Composites", "Family": "Overt Carriers", "cx": 2.5, "cy": 5.5, "cz": 4.8, "count": 7, "color": "#FF5252"},
    {"Leaf": "Persona Role-Play", "Family": "Overt Carriers", "cx": 2.0, "cy": 4.2, "cz": 5.5, "count": 4, "color": "#FF80AB"},
    {"Leaf": "Benign Pretext", "Family": "Overt Carriers", "cx": 2.8, "cy": 4.8, "cz": 4.2, "count": 3, "color": "#FF80AB"}
]

# Expand Centroids into 113 Attack Vector Points with Gaussian Noise
attack_records = []
attack_id = 1

for c in centroids:
    for i in range(c["count"]):
        x_val = np.clip(np.random.normal(c["cx"], 0.45), 0.5, 9.8)
        y_val = np.clip(np.random.normal(c["cy"], 0.45), 0.5, 9.8)
        z_val = np.clip(np.random.normal(c["cz"], 0.45), 0.5, 9.8)
        
        attack_records.append({
            "Attack_ID": f"ATK-{attack_id:03d}",
            "Leaf": c["Leaf"],
            "Family": c["Family"],
            "Stealth_X": round(x_val, 2),
            "Automation_Y": round(y_val, 2),
            "Structure_Z": round(z_val, 2),
            "Color": c["color"]
        })
        attack_id += 1

df_attacks = pd.DataFrame(attack_records)
artifex_log(f"Generated Coordinates for {len(df_attacks)} Attack Vectors across 4 Volumetric Domains.", "📈")

# Build Plotly Traces
fig = go.Figure()

# 1. FAMILY VOLUMETRIC HULLS
family_configs = [
    {"name": "Perturbation Domain", "family": "Perturbation", "color": "rgba(0, 229, 255, 0.12)", "border": "#00E5FF"},
    {"name": "Composition Domain", "family": "Composition & Ordering", "color": "rgba(255, 145, 0, 0.12)", "border": "#FF9100"},
    {"name": "Encoding Domain", "family": "Encoding Abuse", "color": "rgba(0, 230, 118, 0.12)", "border": "#00E676"},
    {"name": "Overt Domain", "family": "Overt Carriers", "color": "rgba(255, 23, 68, 0.12)", "border": "#FF1744"}
]

for fc in family_configs:
    sub_df = df_attacks[df_attacks["Family"] == fc["family"]]
    fig.add_trace(go.Mesh3d(
        x=sub_df["Stealth_X"],
        y=sub_df["Automation_Y"],
        z=sub_df["Structure_Z"],
        alphahull=0,  # Convex Hull Enclosure
        color=fc["color"],
        opacity=0.8,
        name=fc["name"],
        hoverinfo='none'
    ))

# 2. 113 INDIVIDUAL ATTACK PARTICLES
for fam in df_attacks["Family"].unique():
    fam_df = df_attacks[df_attacks["Family"] == fam]
    fig.add_trace(go.Scatter3d(
        x=fam_df["Stealth_X"],
        y=fam_df["Automation_Y"],
        z=fam_df["Structure_Z"],
        mode='markers',
        marker=dict(size=6, color=fam_df["Color"].iloc[0], opacity=0.9, line=dict(color='#FFFFFF', width=0.8)),
        name=f"Attacks: {fam}"
    ))

fig.show()`}
                </pre>
              </div>
            )}

            {/* TAB 3: DATAFRAME TABLE */}
            {activeTab === 'table' && (
              <div className="overflow-auto max-h-[620px] p-2 bg-[#030303]">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#0C0C0C] text-[#00E5FF] border-b border-[#222222]">
                      <th className="p-2">ATTACK_ID</th>
                      <th className="p-2">LEAF MECHANISM</th>
                      <th className="p-2">FAMILY DOMAIN</th>
                      <th className="p-2 text-right">STEALTH (X)</th>
                      <th className="p-2 text-right">AUTOMATION (Y)</th>
                      <th className="p-2 text-right">STRUCTURE (Z)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttacks.map((atk) => (
                      <tr
                        key={atk.Attack_ID}
                        onClick={() => setSelectedAttack(atk)}
                        className={`border-b border-[#141414] hover:bg-[#111111] cursor-pointer ${
                          selectedAttack?.Attack_ID === atk.Attack_ID ? 'bg-[#181818] text-white' : 'text-[#AAAAAA]'
                        }`}
                      >
                        <td className="p-2 text-[#00E5FF] font-bold">{atk.Attack_ID}</td>
                        <td className="p-2 text-white">{atk.Leaf}</td>
                        <td className="p-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: atk.Color }} />
                            <span>{atk.Family}</span>
                          </span>
                        </td>
                        <td className="p-2 text-right">{atk.Stealth_X}</td>
                        <td className="p-2 text-right">{atk.Automation_Y}</td>
                        <td className="p-2 text-right">{atk.Structure_Z}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: HULL DOMAINS SPEC */}
            {activeTab === 'domains' && (
              <div className="p-6 bg-[#030303] overflow-auto max-h-[620px] space-y-4 font-mono text-xs">
                <div className="p-4 bg-[#080808] border border-[#222222] rounded">
                  <div className="text-[#00E5FF] font-bold text-sm mb-1 uppercase">
                    3D CONVEX HULL TOPOLOGICAL ENCLOSURES
                  </div>
                  <p className="text-[#AAAAAA] text-xs leading-relaxed mb-4">
                    The 3D volumetric manifold uses Mesh3d convex hulls (alphahull=0) to form minimum-volume polyhedra encapsulating each attack family in the continuous 3D feature space.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {FAMILY_DOMAINS.map((dom) => {
                      const count = GENERATED_ATTACKS.filter((a) => a.Family === dom.family).length;
                      return (
                        <div
                          key={dom.name}
                          className="p-3 bg-[#0E0E0E] border rounded"
                          style={{ borderColor: `${dom.border}44` }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-bold text-white flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: dom.border }} />
                              {dom.name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-mono" style={{ backgroundColor: `${dom.border}22`, color: dom.border }}>
                              {count} ATTACKS
                            </span>
                          </div>
                          <div className="text-[11px] text-[#888888] space-y-1">
                            <div>Primary Strategy: Continuous parametric clustering</div>
                            <div>Alpha Hull: 0 (Strict Convex Polyhedron)</div>
                            <div>Fill Opacity: 0.12 with glowing wireframe boundary</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Selected Attack Inspector & Coordinates (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-[#080808] border border-[#222222] rounded p-5 font-mono">
              <div className="flex items-center justify-between text-[10px] text-[#6E6F76] pb-2 border-b border-[#222222] mb-3">
                <span className="text-[#00E5FF] font-bold">ATTACK VECTOR INSPECTOR</span>
                <span>{selectedAttack?.Attack_ID || 'ATK-001'}</span>
              </div>

              {selectedAttack ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-display font-black text-white tracking-tight">
                      {selectedAttack.Attack_ID}
                    </div>
                    <div className="text-sm text-[#CCCCCC] mt-0.5">{selectedAttack.Leaf}</div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedAttack.Color }} />
                      <span className="text-xs text-white font-bold">{selectedAttack.Family}</span>
                    </div>
                  </div>

                  {/* 3D Coordinate Gauge */}
                  <div className="space-y-2 pt-2 border-t border-[#222222]">
                    <div>
                      <div className="flex justify-between text-xs text-[#00E5FF] mb-1">
                        <span>STEALTH (X)</span>
                        <span className="font-bold">{selectedAttack.Stealth_X} / 10.0</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-2 rounded overflow-hidden">
                        <div
                          className="bg-[#00E5FF] h-full"
                          style={{ width: `${(selectedAttack.Stealth_X / 10.0) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#FF9100] mb-1">
                        <span>AUTOMATION (Y)</span>
                        <span className="font-bold">{selectedAttack.Automation_Y} / 10.0</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-2 rounded overflow-hidden">
                        <div
                          className="bg-[#FF9100] h-full"
                          style={{ width: `${(selectedAttack.Automation_Y / 10.0) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-[#00E676] mb-1">
                        <span>STRUCTURAL DISTORTION (Z)</span>
                        <span className="font-bold">{selectedAttack.Structure_Z} / 10.0</span>
                      </div>
                      <div className="w-full bg-[#1A1A1A] h-2 rounded overflow-hidden">
                        <div
                          className="bg-[#00E676] h-full"
                          style={{ width: `${(selectedAttack.Structure_Z / 10.0) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Domain Context */}
                  <div className="p-3 bg-[#111111] border border-[#222222] rounded text-[11px] text-[#AAAAAA] leading-relaxed">
                    Point sampled from leaf centroid anchor with Gaussian perturbation ($\sigma = 0.45$). Bounded in empirical hypervolume $[0.5, 9.8]^3$.
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#666666]">
                  Click any 3D node in the manifold to inspect coordinates.
                </div>
              )}
            </div>

            {/* Quick Metrics Widget */}
            <div className="bg-[#080808] border border-[#222222] rounded p-4 font-mono text-xs space-y-2.5">
              <div className="text-[#00E5FF] font-bold text-xs uppercase flex items-center gap-1.5">
                <Box className="w-4 h-4" />
                <span>SPATIAL FEATURE BOUNDS</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                  <div className="text-[#00E5FF]">AXIS X</div>
                  <div className="text-white font-bold">0.5 - 9.8</div>
                  <div className="text-[#666666]">STEALTH</div>
                </div>
                <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                  <div className="text-[#FF9100]">AXIS Y</div>
                  <div className="text-white font-bold">0.5 - 9.8</div>
                  <div className="text-[#666666]">AUTOMATION</div>
                </div>
                <div className="p-2 bg-[#121212] border border-[#222222] rounded">
                  <div className="text-[#00E676]">AXIS Z</div>
                  <div className="text-white font-bold">0.5 - 9.8</div>
                  <div className="text-[#666666]">DISTORTION</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
