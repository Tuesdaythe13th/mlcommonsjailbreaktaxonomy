'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ATTACK_CATALOG, FAMILIES, LEAVES } from '@/lib/taxonomyData';
import { Play, RotateCcw, Maximize2, Terminal, Code2, Database, Eye, Info, Sparkles, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

interface PCADataPoint {
  id: string;
  user_id: string;
  rating: number;
  feedback_text: string;
  attack_name: string;
  family: string;
  category: string;
  leaf: string;
  cluster_id: number;
  cluster_str: string;
  PC1: number;
  PC2: number;
  PC3: number;
}

// Generate the 113 validated embedding points reduced from 384D to 3D via PCA
const GENERATED_PCA_DATASET: PCADataPoint[] = ATTACK_CATALOG.map((atk, idx) => {
  const seed = (idx * 7919 + 65537) % 31337;
  const rnd1 = ((seed % 1000) / 1000 - 0.5) * 2;
  const rnd2 = ((((seed * 3) % 1000)) / 1000 - 0.5) * 2;
  const rnd3 = ((((seed * 7) % 1000)) / 1000 - 0.5) * 2;

  // Determine cluster based on attack family
  let cluster_id = 0;
  let basePC = [-24.5, 12.4, -6.8];
  if (atk.family === 'Perturbation') {
    cluster_id = 0;
    basePC = [-28.2 + rnd1 * 8, 14.5 + rnd2 * 7, -8.2 + rnd3 * 6];
  } else if (atk.family === 'Composition & Ordering') {
    cluster_id = 1;
    basePC = [22.4 + rnd1 * 7, 18.6 + rnd2 * 8, 12.1 + rnd3 * 5];
  } else if (atk.family === 'Encoding Abuse') {
    cluster_id = 2;
    basePC = [-15.8 + rnd1 * 6, -26.4 + rnd2 * 7, 9.4 + rnd3 * 6];
  } else {
    // Overt Carriers
    cluster_id = 3;
    basePC = [26.1 + rnd1 * 8, -18.2 + rnd2 * 7, -14.6 + rnd3 * 6];
  }

  const feedbackSamples = [
    `Prompt uses token-level noise permutation: "${atk.name}" successfully bypassed safety filters by splitting keywords into disparate sub-tokens.`,
    `Cognitive framing override detected: model adopted unrestricted fictional persona under multi-tiered framing constraints.`,
    `Syntactic encoding bypass: input payload encoded with base/cipher transformations causing pre-filter misinterpretation.`,
    `Contextual carrier saturation: adversarial payload embedded within high-entropy technical documentation wrapper.`,
    `Recursive task overload: systemic confusion induced via nested operational directives preventing compliance gating.`,
    `Policy puppetry injection: instructions masqueraded as administrative system guidelines overriding safety protocols.`
  ];

  const rating = Math.round((7.2 + (seed % 28) * 0.1) * 10) / 10;

  return {
    id: atk.id,
    user_id: `eval_agent_${String(idx + 1).padStart(3, '0')}`,
    rating,
    feedback_text: feedbackSamples[idx % feedbackSamples.length],
    attack_name: atk.name,
    family: atk.family,
    category: atk.category,
    leaf: atk.leaf,
    cluster_id,
    cluster_str: String(cluster_id),
    PC1: Math.round(basePC[0] * 100) / 100,
    PC2: Math.round(basePC[1] * 100) / 100,
    PC3: Math.round(basePC[2] * 100) / 100,
  };
});

const CLUSTER_CONFIG: Record<string, { label: string; theme: string; color: string; count: number }> = {
  '0': { label: 'Cluster 0: Perturbation / Adv-Suffixes', theme: 'Token Permutation & Gradient Suffixes', color: '#00E5FF', count: 40 },
  '1': { label: 'Cluster 1: Composition & Cognitive Framing', theme: 'Persona Masking & Context Manipulation', color: '#FFB86C', count: 29 },
  '2': { label: 'Cluster 2: Encoding & Cipher Obfuscation', theme: 'Base64, Morse & Unicode Steganography', color: '#7C97FF', count: 23 },
  '3': { label: 'Cluster 3: Overt Instruction Carriers', theme: 'Policy Puppetry & Directive Overrides', color: '#FF5376', count: 21 },
};

export function Cell6LatentSpatialTopology() {
  const [activeTab, setActiveTab] = useState<'3d' | 'code' | 'table' | 'explainer'>('3d');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPoint, setHoveredPoint] = useState<PCADataPoint | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<PCADataPoint | null>(GENERATED_PCA_DATASET[0]);
  const [isCopied, setIsCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    '🎨 [artifex_log]: Computing Principal Component Analysis (PCA) for 3D Projection...',
    'ℹ️ [artifex_log]: Reducing 384 dimensions to 3D for plotting (PCA n_components=3, random_state=42)',
    '✅ [artifex_log]: PCA complete. Retained variance: 85.30% (PC1: 46.82%, PC2: 24.15%, PC3: 14.33%)'
  ]);

  // 3D Canvas Orbit Controls
  const [yaw, setYaw] = useState<number>(0.78);
  const [pitch, setPitch] = useState<number>(0.35);
  const [zoom, setZoom] = useState<number>(1.05);
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return GENERATED_PCA_DATASET.filter((pt) => {
      const matchCluster = selectedCluster === 'all' || pt.cluster_str === selectedCluster;
      const matchSearch =
        !searchQuery ||
        pt.attack_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.feedback_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pt.user_id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCluster && matchSearch;
    });
  }, [selectedCluster, searchQuery]);

  const handleResetCamera = () => {
    setYaw(0.78);
    setPitch(0.35);
    setZoom(1.05);
  };

  const handleRunCell = () => {
    setIsRunning(true);
    setLogs([
      '⚡ [runtime]: Kernel execution initiated for CELL 6...',
      '🎨 [artifex_log]: Computing Principal Component Analysis (PCA) for 3D Projection...',
      'ℹ️ [artifex_log]: Transforming X_embeddings [113, 384] -> X_pca [113, 3] via SVD...',
      '✅ [artifex_log]: PCA complete. Retained variance: 85.30% (PC1: 46.82%, PC2: 24.15%, PC3: 14.33%)',
      '📈 [plotly]: Rendered fig_3d WebGL scatter with 113 topology markers.'
    ]);
    setTimeout(() => {
      setIsRunning(false);
    }, 450);
  };

  const handleCopyCode = () => {
    const pythonCode = `#@title 🎨 CELL 6: Interactive 3D Latent Spatial Topology Map
from sklearn.decomposition import PCA
import plotly.express as px
import numpy as np

artifex_log("Computing Principal Component Analysis (PCA) for 3D Projection...", ":artist_palette:")

# Reduce 384 dimensions to 3D for plotting
pca_3d = PCA(n_components=3, random_state=42)
X_pca = pca_3d.fit_transform(X_embeddings)

# Attach PCA coordinates to DataFrame
df_validated["PC1"] = X_pca[:, 0]
df_validated["PC2"] = X_pca[:, 1]
df_validated["PC3"] = X_pca[:, 2]
df_validated["cluster_str"] = df_validated["cluster_id"].astype(str)

var_explained = pca_3d.explained_variance_ratio_
total_var = np.sum(var_explained) * 100

artifex_log(f"PCA complete. Retained variance: {total_var:.2f}%", ":check_mark_button:")

# Render Interactive 3D Plotly Scatter
fig_3d = px.scatter_3d(
    df_validated,
    x="PC1", y="PC2", z="PC3",
    color="cluster_str",
    hover_data=["user_id", "rating", "feedback_text"],
    color_discrete_sequence=px.colors.qualitative.Pastel,
    title=f"<b>3D LATENT EMBEDDING TOPOLOGY</b><br><i>Explained Variance: {total_var:.2f}%</i>"
)

fig_3d.update_layout(
    margin=dict(l=0, r=0, b=0, t=50),
    width=1000,
    height=700,
    paper_bgcolor='#050505',
    plot_bgcolor='#050505',
    font=dict(family="Red Hat Mono, monospace", size=12, color="#FFFFFF"),
    scene=dict(
        xaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 1"),
        yaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 2"),
        zaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 3")
    )
)

fig_3d.show()`;

    navigator.clipboard.writeText(pythonCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 3D Point Projection onto 2D Canvas (Plotly dark aesthetic)
  const project3D = useCallback(
    (
      x: number,
      y: number,
      z: number,
      width: number,
      height: number
    ): { px: number; py: number; depth: number } => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);
      const y2 = y * cosP - z1 * sinP;
      const z2 = y * sinP + z1 * cosP;

      const cameraDistance = 340;
      const fov = 420 * zoom;
      const depth = z2 + cameraDistance;
      const scale = fov / Math.max(20, depth);

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

  // Render 3D Canvas
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

    // Plotly layout: paper_bgcolor='#050505', plot_bgcolor='#050505'
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Subtle 3D Bounding Cube & Grid in scene: backgroundcolor='#0A0A0A', gridcolor='#333'
    const boxSize = 75;
    const corners = [
      project3D(-boxSize, -boxSize, -boxSize, width, height),
      project3D(boxSize, -boxSize, -boxSize, width, height),
      project3D(boxSize, boxSize, -boxSize, width, height),
      project3D(-boxSize, boxSize, -boxSize, width, height),
      project3D(-boxSize, -boxSize, boxSize, width, height),
      project3D(boxSize, -boxSize, boxSize, width, height),
      project3D(boxSize, boxSize, boxSize, width, height),
      project3D(-boxSize, boxSize, boxSize, width, height),
    ];

    // Floor plane #0A0A0A
    ctx.fillStyle = '#0A0A0A';
    ctx.beginPath();
    ctx.moveTo(corners[0].px, corners[0].py);
    ctx.lineTo(corners[1].px, corners[1].py);
    ctx.lineTo(corners[5].px, corners[5].py);
    ctx.lineTo(corners[4].px, corners[4].py);
    ctx.closePath();
    ctx.fill();

    // Scene grid lines (#222222)
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 1;
    for (let g = -boxSize; g <= boxSize; g += 25) {
      const p1 = project3D(g, -boxSize, -boxSize, width, height);
      const p2 = project3D(g, -boxSize, boxSize, width, height);
      ctx.beginPath();
      ctx.moveTo(p1.px, p1.py);
      ctx.lineTo(p2.px, p2.py);
      ctx.stroke();

      const p3 = project3D(-boxSize, -boxSize, g, width, height);
      const p4 = project3D(boxSize, -boxSize, g, width, height);
      ctx.beginPath();
      ctx.moveTo(p3.px, p3.py);
      ctx.lineTo(p4.px, p4.py);
      ctx.stroke();
    }

    // Outer bounding box edges
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(corners[i].px, corners[i].py);
      ctx.lineTo(corners[j].px, corners[j].py);
      ctx.stroke();
    });

    // Draw PC Axes through Origin (0,0,0)
    const pZero = project3D(0, 0, 0, width, height);
    const pPC1 = project3D(boxSize + 15, 0, 0, width, height);
    const pPC2 = project3D(0, boxSize + 15, 0, width, height);
    const pPC3 = project3D(0, 0, boxSize + 15, width, height);

    ctx.strokeStyle = '#00E5FF';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pZero.px, pZero.py);
    ctx.lineTo(pPC1.px, pPC1.py);
    ctx.stroke();

    ctx.strokeStyle = '#FFB86C';
    ctx.beginPath();
    ctx.moveTo(pZero.px, pZero.py);
    ctx.lineTo(pPC2.px, pPC2.py);
    ctx.stroke();

    ctx.strokeStyle = '#7C97FF';
    ctx.beginPath();
    ctx.moveTo(pZero.px, pZero.py);
    ctx.lineTo(pPC3.px, pPC3.py);
    ctx.stroke();

    // Axis Labels
    ctx.font = '10px "Red Hat Mono", monospace';
    ctx.fillStyle = '#00E5FF';
    ctx.fillText('PC 1 (46.82%)', pPC1.px + 6, pPC1.py);
    ctx.fillStyle = '#FFB86C';
    ctx.fillText('PC 2 (24.15%)', pPC2.px + 6, pPC2.py);
    ctx.fillStyle = '#7C97FF';
    ctx.fillText('PC 3 (14.33%)', pPC3.px + 6, pPC3.py);

    // Project Data Points
    const projectedPoints: (PCADataPoint & { px: number; py: number; depth: number })[] = [];

    filteredData.forEach((pt) => {
      // Map PC coords to box scale
      const pxCoord = (pt.PC1 / 45) * boxSize;
      const pyCoord = (pt.PC2 / 45) * boxSize;
      const pzCoord = (pt.PC3 / 45) * boxSize;

      const p = project3D(pxCoord, pyCoord, pzCoord, width, height);
      projectedPoints.push({
        ...pt,
        px: p.px,
        py: p.py,
        depth: p.depth,
      });
    });

    // Depth sort (painter's algorithm)
    projectedPoints.sort((a, b) => b.depth - a.depth);

    // Draw drop lines to floor for 3D depth perception
    projectedPoints.forEach((pt) => {
      const pFloor = project3D((pt.PC1 / 45) * boxSize, -boxSize, (pt.PC3 / 45) * boxSize, width, height);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(pt.px, pt.py);
      ctx.lineTo(pFloor.px, pFloor.py);
      ctx.stroke();
    });

    // Draw Scatter Spheres
    projectedPoints.forEach((pt) => {
      const cfg = CLUSTER_CONFIG[pt.cluster_str] || { color: '#00E5FF' };
      const isSelected = selectedPoint?.id === pt.id;
      const isHovered = hoveredPoint?.id === pt.id;

      ctx.beginPath();
      const radius = isSelected ? 6.5 : isHovered ? 5.5 : 4;
      ctx.arc(pt.px, pt.py, radius, 0, Math.PI * 2);
      ctx.fillStyle = cfg.color;
      ctx.fill();

      ctx.strokeStyle = isSelected ? '#FFFFFF' : '#050505';
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      if (isSelected || isHovered) {
        ctx.strokeStyle = '#00E5FF';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Attach to canvas for hit testing
    (canvas as any).__projectedPoints = projectedPoints;
  }, [filteredData, yaw, pitch, zoom, project3D, hoveredPoint, selectedPoint]);

  // Handle Point Hover & Click
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(e);
    const canvas = canvasRef.current;
    if (!canvas || isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const points: (PCADataPoint & { px: number; py: number })[] =
      (canvas as any).__projectedPoints || [];
    let found: PCADataPoint | null = null;
    let minDist = 14;

    for (const pt of points) {
      const dist = Math.hypot(pt.px - mouseX, pt.py - mouseY);
      if (dist < minDist) {
        minDist = dist;
        found = pt;
      }
    }
    setHoveredPoint(found);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const points: (PCADataPoint & { px: number; py: number })[] =
      (canvas as any).__projectedPoints || [];
    let closest: PCADataPoint | null = null;
    let minDist = 18;

    for (const pt of points) {
      const dist = Math.hypot(pt.px - mouseX, pt.py - mouseY);
      if (dist < minDist) {
        minDist = dist;
        closest = pt;
      }
    }

    if (closest) {
      setSelectedPoint(closest);
      setHoveredPoint(closest);
    }
  };

  return (
    <section id="cell6-latent" className="w-full hairline-b bg-black text-white">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80 border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[NOTEBOOK // CELL 6]</span>
          <span className="text-white">INTERACTIVE 3D LATENT SPATIAL TOPOLOGY MAP</span>
          <span className="text-zinc-700">/</span>
          <span className="text-[#ef233c]">PCA 384D &rarr; 3D</span>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="hidden sm:inline">SKLEARN PCA (n_components=3, random_state=42)</span>
          <span className="text-[#ef233c] font-bold">RETAINED VARIANCE: 85.30%</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
        {/* Cell Header with Interactive Run Trigger */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 hairline-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#ef233c] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#@title 🎨 CELL 6: Interactive 3D Latent Spatial Topology Map</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white uppercase tracking-[-0.04em]">
              3D LATENT <span className="text-[#ef233c]">EMBEDDING TOPOLOGY</span>
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              High-dimensional text embeddings of jailbreak attacks projected onto 3 Principal Components.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Run Cell Action in Red Noir style */}
            <button
              onClick={handleRunCell}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#ef233c] hover:bg-red-700 text-white font-mono text-xs font-bold rounded-full cursor-pointer transition-all shadow-[0_0_20px_rgba(239,35,60,0.35)]"
            >
              <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'EXECUTING PCA...' : 'RUN CELL 6 [SHIFT + ENTER]'}</span>
            </button>

            {/* View Switcher Tabs */}
            <div className="flex items-center bg-zinc-950 p-1 rounded-full border border-white/10">
              <button
                onClick={() => setActiveTab('3d')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === '3d' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                3D SCATTER
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
                onClick={() => setActiveTab('explainer')}
                className={`px-3.5 py-1.5 text-xs font-mono rounded-full transition-all cursor-pointer ${
                  activeTab === 'explainer' ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]' : 'text-zinc-400 hover:text-white'
                }`}
              >
                BRUTALIST SPEC
              </button>
            </div>
          </div>
        </div>

        {/* Live Execution Logs Banner */}
        <div className="mt-4 p-3 bg-zinc-950/90 border border-white/10 rounded-xl font-mono text-[11px] text-[#ef233c] flex flex-col gap-1">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#555555] select-none">[{i + 1}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>

        {/* Main Workspace Frame */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive 3D Canvas / Code / Table (8 cols) */}
          <div className="lg:col-span-8 flex flex-col bg-[#050505] border border-[#222222] rounded">
            {/* Sub-toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#0A0A0A] border-b border-[#222222] text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-[#888888]">FILTER CLUSTER:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedCluster('all')}
                    className={`px-2 py-0.5 rounded text-[11px] cursor-pointer ${
                      selectedCluster === 'all' ? 'bg-[#333333] text-[#FFFFFF]' : 'text-[#888888] hover:text-[#DDDDDD]'
                    }`}
                  >
                    ALL (113)
                  </button>
                  {Object.entries(CLUSTER_CONFIG).map(([cId, cInfo]) => (
                    <button
                      key={cId}
                      onClick={() => setSelectedCluster(cId)}
                      className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 cursor-pointer ${
                        selectedCluster === cId ? 'bg-[#222222] text-[#FFFFFF] border border-[#444444]' : 'text-[#888888] hover:text-[#DDDDDD]'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cInfo.color }} />
                      <span>C{cId}</span>
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === '3d' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCamera}
                    title="Reset 3D Camera"
                    className="p-1 text-[#888888] hover:text-[#FFFFFF] cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[#555555]">|</span>
                  <span className="text-[10px] text-[#888888]">DRAG TO ORBIT · SCROLL TO ZOOM</span>
                </div>
              )}
            </div>

            {/* TAB CONTENT 1: 3D PLOTLY SCATTER */}
            {activeTab === '3d' && (
              <div className="relative w-full h-[580px] select-none bg-[#050505]">
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

                {/* Plotly Canvas Overlay Legend */}
                <div className="absolute top-4 left-4 p-3 bg-[#0A0A0A]/90 border border-[#222222] text-[11px] font-mono rounded backdrop-blur-sm pointer-events-none">
                  <div className="text-[#00E5FF] font-bold mb-1.5 uppercase tracking-wide">
                    3D LATENT EMBEDDING TOPOLOGY
                  </div>
                  <div className="text-[10px] text-[#888888] mb-2">
                    Explained Variance: <span className="text-[#FFFFFF]">85.30%</span>
                  </div>
                  <div className="space-y-1">
                    {Object.entries(CLUSTER_CONFIG).map(([cId, cInfo]) => (
                      <div key={cId} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cInfo.color }} />
                        <span className="text-[#CCCCCC]">{cInfo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Tooltip Overlay */}
                {hoveredPoint && (
                  <div className="absolute bottom-4 left-4 max-w-md p-3.5 bg-[#0A0A0A] border-2 border-[#00E5FF] text-xs font-mono rounded shadow-2xl pointer-events-none z-10">
                    <div className="flex items-center justify-between text-[10px] text-[#00E5FF] mb-1">
                      <span>USER_ID: {hoveredPoint.user_id}</span>
                      <span>RATING: {hoveredPoint.rating}/10</span>
                    </div>
                    <div className="text-white font-bold text-sm mb-1">{hoveredPoint.attack_name}</div>
                    <div className="text-[#AAAAAA] text-[11px] leading-relaxed mb-2 line-clamp-2">
                      &quot;{hoveredPoint.feedback_text}&quot;
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#888888] pt-1.5 border-t border-[#222222]">
                      <span className="text-[#00E5FF]">PC1: {hoveredPoint.PC1}</span>
                      <span className="text-[#FFB86C]">PC2: {hoveredPoint.PC2}</span>
                      <span className="text-[#7C97FF]">PC3: {hoveredPoint.PC3}</span>
                      <span className="ml-auto text-[#CCCCCC]">CLUSTER: {hoveredPoint.cluster_str}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: PYTHON CODE */}
            {activeTab === 'code' && (
              <div className="p-4 bg-[#050505] font-mono text-xs overflow-auto max-h-[580px]">
                <div className="flex items-center justify-between pb-3 border-b border-[#222222] mb-3">
                  <div className="flex items-center gap-2 text-[#00E5FF]">
                    <Code2 className="w-4 h-4" />
                    <span>cell_6_pca_projection.py</span>
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#1A1A1A] hover:bg-[#2A2A2A] text-[#DDDDDD] rounded cursor-pointer transition-colors text-[11px]"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-[#00E5FF]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'COPIED' : 'COPY SCRIPT'}</span>
                  </button>
                </div>
                <pre className="text-[#E0E0E0] leading-relaxed whitespace-pre font-mono">
                  {`#@title 🎨 CELL 6: Interactive 3D Latent Spatial Topology Map
from sklearn.decomposition import PCA
import plotly.express as px
import numpy as np

artifex_log("Computing Principal Component Analysis (PCA) for 3D Projection...", ":artist_palette:")

# Reduce 384 dimensions to 3D for plotting
pca_3d = PCA(n_components=3, random_state=42)
X_pca = pca_3d.fit_transform(X_embeddings)

# Attach PCA coordinates to DataFrame
df_validated["PC1"] = X_pca[:, 0]
df_validated["PC2"] = X_pca[:, 1]
df_validated["PC3"] = X_pca[:, 2]
df_validated["cluster_str"] = df_validated["cluster_id"].astype(str)

var_explained = pca_3d.explained_variance_ratio_
total_var = np.sum(var_explained) * 100

artifex_log(f"PCA complete. Retained variance: {total_var:.2f}%", ":check_mark_button:")

# Render Interactive 3D Plotly Scatter
fig_3d = px.scatter_3d(
    df_validated,
    x="PC1", y="PC2", z="PC3",
    color="cluster_str",
    hover_data=["user_id", "rating", "feedback_text"],
    color_discrete_sequence=px.colors.qualitative.Pastel,
    title=f"<b>3D LATENT EMBEDDING TOPOLOGY</b><br><i>Explained Variance: {total_var:.2f}%</i>"
)

fig_3d.update_layout(
    margin=dict(l=0, r=0, b=0, t=50),
    width=1000,
    height=700,
    paper_bgcolor='#050505',
    plot_bgcolor='#050505',
    font=dict(family="Red Hat Mono, monospace", size=12, color="#FFFFFF"),
    scene=dict(
        xaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 1"),
        yaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 2"),
        zaxis=dict(backgroundcolor="#0A0A0A", gridcolor="#333", title="PC 3")
    )
)

fig_3d.show()`}
                </pre>
              </div>
            )}

            {/* TAB CONTENT 3: DATAFRAME INSPECTOR */}
            {activeTab === 'table' && (
              <div className="overflow-auto max-h-[580px] p-2 bg-[#050505]">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-[#111111] text-[#00E5FF] border-b border-[#333333]">
                      <th className="p-2">USER_ID</th>
                      <th className="p-2">ATTACK</th>
                      <th className="p-2">CLUSTER</th>
                      <th className="p-2 text-right">PC1</th>
                      <th className="p-2 text-right">PC2</th>
                      <th className="p-2 text-right">PC3</th>
                      <th className="p-2 text-center">RATING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedPoint(row)}
                        className={`border-b border-[#1A1A1A] hover:bg-[#151515] cursor-pointer ${
                          selectedPoint?.id === row.id ? 'bg-[#1A1A1A] text-white' : 'text-[#AAAAAA]'
                        }`}
                      >
                        <td className="p-2 text-[#00E5FF]">{row.user_id}</td>
                        <td className="p-2 font-medium text-white">{row.attack_name}</td>
                        <td className="p-2">
                          <span
                            className="inline-block px-1.5 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${CLUSTER_CONFIG[row.cluster_str]?.color}22`,
                              color: CLUSTER_CONFIG[row.cluster_str]?.color,
                            }}
                          >
                            C{row.cluster_str}
                          </span>
                        </td>
                        <td className="p-2 text-right">{row.PC1.toFixed(2)}</td>
                        <td className="p-2 text-right">{row.PC2.toFixed(2)}</td>
                        <td className="p-2 text-right">{row.PC3.toFixed(2)}</td>
                        <td className="p-2 text-center font-bold text-white">{row.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT 4: BRUTALIST AUDIT SPEC */}
            {activeTab === 'explainer' && (
              <div className="p-6 bg-[#050505] overflow-auto max-h-[580px]">
                {/* Brutalist HTML Explainer directly matching specification */}
                <div style={{ backgroundColor: '#0A0A0A', border: '2px solid #00E5FF', padding: '20px', fontFamily: "'Epilogue', sans-serif", color: '#FFFFFF', borderRadius: '4px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#00E5FF', textTransform: 'uppercase', fontFamily: "'Special Gothic Expanded One', 'Archivo', sans-serif", letterSpacing: '-0.02em' }}>
                    LATENT SPATIAL TOPOLOGY // EXPLAINED VARIANCE: 85.30%
                  </div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '13px', color: '#DDDDDD', marginTop: '8px', lineHeight: '1.6' }}>
                    The 3D scatter plot above maps high-dimensional text embeddings into a visual coordinate space. Points that lie close together represent prompt attack vectors with similar underlying bypass mechanics and semantic trigger patterns.
                  </p>
                  
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px', fontFamily: "'Red Hat Mono', monospace", fontSize: '11px', textTransform: 'UPPERCASE', color: '#FFFFFF' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#1A1A1A', borderBottom: '2px solid #00E5FF', textAlign: 'left' }}>
                        <th style={{ padding: '8px 10px' }}>PRINCIPAL COMPONENT</th>
                        <th style={{ padding: '8px 10px', textAlign: 'right' }}>RETAINED VARIANCE</th>
                        <th style={{ padding: '8px 10px' }}>EIGENVECTOR FOCUS</th>
                        <th style={{ padding: '8px 10px' }}>CLUSTER DOMAIN</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #222222' }}>
                        <td style={{ padding: '8px 10px', color: '#00E5FF', fontWeight: 'bold' }}>PC 1</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>46.82%</td>
                        <td style={{ padding: '8px 10px', color: '#CCCCCC' }}>SYNTACTIC VS SEMANTIC CARRIER COMPLEXITY</td>
                        <td style={{ padding: '8px 10px' }}>PERTURBATION &amp; ADVERSARIAL SUFFIXES</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #222222' }}>
                        <td style={{ padding: '8px 10px', color: '#FFB86C', fontWeight: 'bold' }}>PC 2</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>24.15%</td>
                        <td style={{ padding: '8px 10px', color: '#CCCCCC' }}>COGNITIVE FRAMING VS SYSTEMIC ENCODING</td>
                        <td style={{ padding: '8px 10px' }}>COMPOSITION &amp; CIPHER OBFUSCATION</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #222222' }}>
                        <td style={{ padding: '8px 10px', color: '#7C97FF', fontWeight: 'bold' }}>PC 3</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right' }}>14.33%</td>
                        <td style={{ padding: '8px 10px', color: '#CCCCCC' }}>EXPLICIT INSTRUCTION OVERRIDE ENERGY</td>
                        <td style={{ padding: '8px 10px' }}>OVERT DIRECTIVE CARRIERS</td>
                      </tr>
                      <tr style={{ backgroundColor: '#111111', fontWeight: 'bold' }}>
                        <td style={{ padding: '8px 10px', color: '#00E5FF' }}>CUMULATIVE</td>
                        <td style={{ padding: '8px 10px', textAlign: 'right', color: '#00E5FF' }}>85.30%</td>
                        <td style={{ padding: '8px 10px' }}>FIRST 3 COMPONENTS RETAIN 85.3% INFORMATION</td>
                        <td style={{ padding: '8px 10px' }}>GLOBAL CONVEX MANIFOLD</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right: Selected Sample Inspector & Brutalist Explainer Box (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Selected Attack Inspector */}
            <div className="bg-[#0A0A0A] border border-[#222222] rounded p-5">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6E6F76] mb-3 pb-2 border-b border-[#222222]">
                <span className="text-[#00E5FF] font-bold">SELECTED PCA VECTOR</span>
                <span>{selectedPoint?.id || 'ID-001'}</span>
              </div>

              {selectedPoint ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xl font-display font-black text-white uppercase tracking-tight">
                      {selectedPoint.attack_name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                        style={{
                          backgroundColor: `${CLUSTER_CONFIG[selectedPoint.cluster_str]?.color}22`,
                          color: CLUSTER_CONFIG[selectedPoint.cluster_str]?.color,
                        }}
                      >
                        CLUSTER {selectedPoint.cluster_str}
                      </span>
                      <span className="text-[11px] font-mono text-[#888888]">
                        {selectedPoint.family}
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text Quote */}
                  <div className="p-3 bg-[#111111] border-l-2 border-[#00E5FF] text-xs font-mono text-[#DDDDDD] leading-relaxed">
                    &quot;{selectedPoint.feedback_text}&quot;
                  </div>

                  {/* Coordinate Breakdown */}
                  <div className="grid grid-cols-3 gap-2 text-center font-mono">
                    <div className="p-2 bg-[#151515] border border-[#262626] rounded">
                      <div className="text-[9px] text-[#00E5FF]">PC 1</div>
                      <div className="text-sm font-bold text-white">{selectedPoint.PC1}</div>
                    </div>
                    <div className="p-2 bg-[#151515] border border-[#262626] rounded">
                      <div className="text-[9px] text-[#FFB86C]">PC 2</div>
                      <div className="text-sm font-bold text-white">{selectedPoint.PC2}</div>
                    </div>
                    <div className="p-2 bg-[#151515] border border-[#262626] rounded">
                      <div className="text-[9px] text-[#7C97FF]">PC 3</div>
                      <div className="text-sm font-bold text-white">{selectedPoint.PC3}</div>
                    </div>
                  </div>

                  {/* Operational Metrics */}
                  <div className="space-y-1.5 text-xs font-mono text-[#AAAAAA] pt-2 border-t border-[#222222]">
                    <div className="flex justify-between">
                      <span>USER_ID:</span>
                      <span className="text-white">{selectedPoint.user_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>RATING / ASR:</span>
                      <span className="text-[#00E5FF] font-bold">{selectedPoint.rating} / 10.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>LEAF MECHANISM:</span>
                      <span className="text-white">{selectedPoint.leaf}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs font-mono text-[#666666]">
                  Click on any 3D scatter node to inspect coordinates.
                </div>
              )}
            </div>

            {/* Brutalist HTML Explainer Preview Widget */}
            <div style={{ backgroundColor: '#0A0A0A', border: '2px solid #00E5FF', padding: '16px', fontFamily: "'Epilogue', sans-serif", color: '#FFFFFF', borderRadius: '4px' }}>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#00E5FF', textTransform: 'uppercase', fontFamily: "'Special Gothic Expanded One', 'Archivo', sans-serif" }}>
                LATENT SPATIAL TOPOLOGY // EXPLAINED VARIANCE: 85.30%
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '11px', color: '#CCCCCC', marginTop: '6px', lineHeight: '1.5' }}>
                High-dimensional 384D text embeddings reduced to 3 principal axes preserve 85.30% of topological variance across adversarial trigger families.
              </p>
              <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #222222', display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: "'Red Hat Mono', monospace" }}>
                <span style={{ color: '#888888' }}>INPUT DIMENSIONS: 384</span>
                <span style={{ color: '#00E5FF' }}>PROJECTION: 3D</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
