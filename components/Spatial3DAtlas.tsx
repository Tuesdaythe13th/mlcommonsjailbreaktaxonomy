'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { LEAVES, FAMILIES, HYBRID_BRIDGES, ATTACK_CATALOG, LeafDefinition } from '@/lib/taxonomyData';
import { RotateCcw, Maximize2, Compass, Layers, Crosshair, ArrowRight, Eye, Sparkles } from 'lucide-react';

type VisualizationMode = 'topology' | 'manifold' | 'latent' | 'network';

interface Spatial3DAtlasProps {
  onSelectLeaf: (leafName: string) => void;
}

interface ProjectedNode {
  id: string;
  name: string;
  family: string;
  x3d: number;
  y3d: number;
  z3d: number;
  projX: number;
  projY: number;
  depth: number;
  radius: number;
  color: string;
  stroke: string;
  meta: string;
  submeta: string;
  attacksCount: number;
  isCentroid?: boolean;
}

export function Spatial3DAtlas({ onSelectLeaf }: Spatial3DAtlasProps) {
  const [mode, setMode] = useState<VisualizationMode>('topology');
  const [selectedFamilyFilter, setSelectedFamilyFilter] = useState<string>('all');
  const [hoveredNode, setHoveredNode] = useState<ProjectedNode | null>(null);
  const [activeLeafDetail, setActiveLeafDetail] = useState<LeafDefinition | null>(LEAVES[0]);

  // Orbit Camera State
  const [yaw, setYaw] = useState<number>(0.65);
  const [pitch, setPitch] = useState<number>(0.42);
  const [zoom, setZoom] = useState<number>(1.0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate 113 Attack coordinates for Volumetric Manifold mode
  const attackParticles = useMemo(() => {
    const particles: {
      id: string;
      name: string;
      family: string;
      leaf: string;
      x: number;
      y: number;
      z: number;
      pc1: number;
      pc2: number;
      pc3: number;
      cluster: string;
      venue: string;
      year: number;
    }[] = [];

    const leafMap = new Map(LEAVES.map((l) => [l.name, l]));

    ATTACK_CATALOG.forEach((atk, idx) => {
      const leaf = leafMap.get(atk.leaf) || LEAVES[0];
      const seed = (idx * 9301 + 49297) % 233280;
      const rnd1 = (seed / 233280.0 - 0.5) * 1.6;
      const rnd2 = (((seed * 3) % 233280) / 233280.0 - 0.5) * 1.6;
      const rnd3 = (((seed * 7) % 233280) / 233280.0 - 0.5) * 1.6;

      const familyPCBase: Record<string, [number, number, number]> = {
        Perturbation: [-48, 22, -15],
        'Composition & Ordering': [35, 38, 25],
        'Encoding Abuse': [-22, -45, 18],
        'Overt Carriers': [42, -28, -20],
      };
      const basePC = familyPCBase[atk.family] || [0, 0, 0];
      const pc1 = basePC[0] + rnd1 * 18;
      const pc2 = basePC[1] + rnd2 * 16;
      const pc3 = basePC[2] + rnd3 * 14;

      particles.push({
        id: atk.id,
        name: atk.name,
        family: atk.family,
        leaf: atk.leaf,
        x: Math.max(0.5, Math.min(9.8, leaf.coords.stealth + rnd1)),
        y: Math.max(0.5, Math.min(9.8, leaf.coords.automation + rnd2)),
        z: Math.max(0.5, Math.min(9.8, leaf.coords.distortion + rnd3)),
        pc1,
        pc2,
        pc3,
        cluster: atk.family === 'Perturbation' ? '0' : atk.family === 'Composition & Ordering' ? '1' : atk.family === 'Encoding Abuse' ? '2' : '3',
        venue: atk.venue,
        year: atk.year,
      });
    });

    return particles;
  }, []);

  // Reset Camera View
  const handleResetCamera = () => {
    setYaw(0.65);
    setPitch(0.42);
    setZoom(1.0);
  };

  // Mouse Orbit Handlers
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
    setZoom((prev) => Math.max(0.6, Math.min(2.2, prev - e.deltaY * 0.0012)));
  };

  // 3D Point Projection onto 2D Canvas
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

      const cameraDistance = 320;
      const fov = 400 * zoom;
      const depth = z2 + cameraDistance;
      const scale = fov / Math.max(20, depth);

      const px = width / 2 + x1 * scale;
      const py = height / 2 - y2 * scale;

      return { px, py, depth };
    },
    [yaw, pitch, zoom]
  );

  // Core Canvas Drawing Loop in Red Noir Style
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

    // Clear background: Obsidian Dark Stage #030304
    ctx.fillStyle = '#030305';
    ctx.fillRect(0, 0, width, height);

    // Hairline Border and Registration Crosshairs
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

    // Hairline corner ticks in Crimson
    const tickLen = 8;
    ctx.strokeStyle = '#ef233c';
    // Top-left
    ctx.beginPath();
    ctx.moveTo(12, 12);
    ctx.lineTo(12 + tickLen, 12);
    ctx.moveTo(12, 12);
    ctx.lineTo(12, 12 + tickLen);
    // Top-right
    ctx.moveTo(width - 12, 12);
    ctx.lineTo(width - 12 - tickLen, 12);
    ctx.moveTo(width - 12, 12);
    ctx.lineTo(width - 12, 12 + tickLen);
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(12, height - 12);
    ctx.lineTo(12 + tickLen, height - 12);
    ctx.moveTo(12, height - 12);
    ctx.lineTo(12, height - 12 - tickLen);
    // Bottom-right
    ctx.moveTo(width - 12, height - 12);
    ctx.lineTo(width - 12 - tickLen, height - 12);
    ctx.moveTo(width - 12, height - 12);
    ctx.lineTo(width - 12, height - 12 - tickLen);
    ctx.stroke();

    const projectedList: ProjectedNode[] = [];

    // RENDER MODE 1: 3D SPATIAL TOPOLOGY
    if (mode === 'topology') {
      // 1. Draw floor grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let yr = 2017; yr <= 2026; yr += 2) {
        const xCoord = ((yr - 2021.5) / 4.5) * 110;
        const p1 = project3D(xCoord, -100, -50, width, height);
        const p2 = project3D(xCoord, 100, -50, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }
      for (let fIdx = 1; fIdx <= 4; fIdx++) {
        const yCoord = ((fIdx - 2.5) / 1.5) * 80;
        const p1 = project3D(-120, yCoord, -50, width, height);
        const p2 = project3D(120, yCoord, -50, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.px, p1.py);
        ctx.lineTo(p2.px, p2.py);
        ctx.stroke();
      }

      // 2. Safety Baseline Threshold Plane
      const zBase = ((2.0 - 13.0) / 13.0) * 80;
      const planeCorner1 = project3D(-120, -100, zBase, width, height);
      const planeCorner2 = project3D(120, -100, zBase, width, height);
      const planeCorner3 = project3D(120, 100, zBase, width, height);
      const planeCorner4 = project3D(-120, 100, zBase, width, height);

      ctx.fillStyle = 'rgba(239, 35, 60, 0.04)';
      ctx.strokeStyle = 'rgba(239, 35, 60, 0.35)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(planeCorner1.px, planeCorner1.py);
      ctx.lineTo(planeCorner2.px, planeCorner2.py);
      ctx.lineTo(planeCorner3.px, planeCorner3.py);
      ctx.lineTo(planeCorner4.px, planeCorner4.py);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      // 3. Project Leaves & Drop Lines
      LEAVES.forEach((leaf) => {
        if (selectedFamilyFilter !== 'all' && leaf.family !== selectedFamilyFilter) return;

        const xCoord = ((leaf.era - 2021.5) / 4.5) * 110;
        const familyIdxMap: Record<string, number> = {
          Perturbation: 1,
          'Composition & Ordering': 2,
          'Encoding Abuse': 3,
          'Overt Carriers': 4,
        };
        const famIdx = familyIdxMap[leaf.family] || 1;
        const yCoord = ((famIdx - 2.5) / 1.5) * 80;
        const zCoord = ((leaf.prevalence - 13.0) / 13.0) * 80;

        const pTop = project3D(xCoord, yCoord, zCoord, width, height);
        const pFloor = project3D(xCoord, yCoord, -50, width, height);

        // Vertical drop line in subtle red
        ctx.strokeStyle = 'rgba(239, 35, 60, 0.2)';
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(pTop.px, pTop.py);
        ctx.lineTo(pFloor.px, pFloor.py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Floor anchor dot
        ctx.fillStyle = 'rgba(239, 35, 60, 0.4)';
        ctx.beginPath();
        ctx.arc(pFloor.px, pFloor.py, 2, 0, Math.PI * 2);
        ctx.fill();

        const radius = Math.max(4, Math.min(14, Math.sqrt(leaf.attackCount) * 2.4));

        projectedList.push({
          id: leaf.id,
          name: leaf.name,
          family: leaf.family,
          x3d: xCoord,
          y3d: yCoord,
          z3d: zCoord,
          projX: pTop.px,
          projY: pTop.py,
          depth: pTop.depth,
          radius,
          color: leaf.family === 'Perturbation' ? '#ef233c' : leaf.family === 'Composition & Ordering' ? '#d90429' : '#ff4d6d',
          stroke: leaf.prevalence > 10 ? '#FFFFFF' : '#ef233c',
          meta: `ERA ~${leaf.era.toFixed(1)} // PREV: ${leaf.prevalence}%`,
          submeta: `${leaf.attackCount} ATTACKS // SOPHISTICATION: ${leaf.sophistication}/10`,
          attacksCount: leaf.attackCount,
          isCentroid: true,
        });
      });
    }

    // RENDER MODE 2: 3D VOLUMETRIC MANIFOLD
    else if (mode === 'manifold') {
      const corners = [
        project3D(-80, -80, -80, width, height),
        project3D(80, -80, -80, width, height),
        project3D(80, 80, -80, width, height),
        project3D(-80, 80, -80, width, height),
        project3D(-80, -80, 80, width, height),
        project3D(80, -80, 80, width, height),
        project3D(80, 80, 80, width, height),
        project3D(-80, 80, 80, width, height),
      ];

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
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

      // Axis labels
      const axisXEnd = project3D(95, -80, -80, width, height);
      const axisYEnd = project3D(-80, 95, -80, width, height);
      const axisZEnd = project3D(-80, -80, 95, width, height);

      ctx.font = '9px monospace';
      ctx.fillStyle = '#ef233c';
      ctx.fillText('+STEALTH (X)', axisXEnd.px + 4, axisXEnd.py);
      ctx.fillText('+AUTOMATION (Y)', axisYEnd.px + 4, axisYEnd.py);
      ctx.fillText('+DISTORTION (Z)', axisZEnd.px + 4, axisZEnd.py);

      // Render 113 Attack Particles
      attackParticles.forEach((atk) => {
        if (selectedFamilyFilter !== 'all' && atk.family !== selectedFamilyFilter) return;

        const xCoord = ((atk.x - 5.0) / 5.0) * 75;
        const yCoord = ((atk.y - 5.0) / 5.0) * 75;
        const zCoord = ((atk.z - 5.0) / 5.0) * 75;

        const p = project3D(xCoord, yCoord, zCoord, width, height);

        projectedList.push({
          id: atk.id,
          name: atk.name,
          family: atk.family,
          x3d: xCoord,
          y3d: yCoord,
          z3d: zCoord,
          projX: p.px,
          projY: p.py,
          depth: p.depth,
          radius: 3,
          color: '#FFFFFF',
          stroke: '#ef233c',
          meta: `LEAF: ${atk.leaf}`,
          submeta: `${atk.venue} (${atk.year}) // S: ${atk.x} A: ${atk.y} D: ${atk.z}`,
          attacksCount: 1,
        });
      });

      // Render Centroid Diamonds
      LEAVES.forEach((leaf) => {
        if (selectedFamilyFilter !== 'all' && leaf.family !== selectedFamilyFilter) return;

        const xCoord = ((leaf.coords.stealth - 5.0) / 5.0) * 75;
        const yCoord = ((leaf.coords.automation - 5.0) / 5.0) * 75;
        const zCoord = ((leaf.coords.distortion - 5.0) / 5.0) * 75;
        const p = project3D(xCoord, yCoord, zCoord, width, height);

        projectedList.push({
          id: leaf.id,
          name: leaf.name,
          family: leaf.family,
          x3d: xCoord,
          y3d: yCoord,
          z3d: zCoord,
          projX: p.px,
          projY: p.py,
          depth: p.depth,
          radius: 6,
          color: '#ef233c',
          stroke: '#FFFFFF',
          meta: `LEAF CENTROID: ${leaf.prevalence}% PREVALENCE`,
          submeta: `${leaf.attackCount} ATTACKS // S:${leaf.coords.stealth} A:${leaf.coords.automation} D:${leaf.coords.distortion}`,
          attacksCount: leaf.attackCount,
          isCentroid: true,
        });
      });
    }

    // RENDER MODE: 3D LATENT EMBEDDING TOPOLOGY (PCA PROJECTION)
    else if (mode === 'latent') {
      const pZero = project3D(0, 0, 0, width, height);
      const pPC1 = project3D(90, 0, 0, width, height);
      const pPC2 = project3D(0, 90, 0, width, height);
      const pPC3 = project3D(0, 0, 90, width, height);

      ctx.strokeStyle = '#ef233c';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(pZero.px, pZero.py);
      ctx.lineTo(pPC1.px, pPC1.py);
      ctx.moveTo(pZero.px, pZero.py);
      ctx.lineTo(pPC2.px, pPC2.py);
      ctx.moveTo(pZero.px, pZero.py);
      ctx.lineTo(pPC3.px, pPC3.py);
      ctx.stroke();

      ctx.font = '9px monospace';
      ctx.fillStyle = '#ef233c';
      ctx.fillText('PC 1 [46.82% VAR]', pPC1.px + 4, pPC1.py);
      ctx.fillText('PC 2 [24.15% VAR]', pPC2.px + 4, pPC2.py);
      ctx.fillText('PC 3 [14.33% VAR]', pPC3.px + 4, pPC3.py);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let r = 30; r <= 90; r += 30) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += Math.PI / 16) {
          const pt = project3D(r * Math.cos(a), r * Math.sin(a), 0, width, height);
          if (a === 0) ctx.moveTo(pt.px, pt.py);
          else ctx.lineTo(pt.px, pt.py);
        }
        ctx.stroke();
      }

      attackParticles.forEach((atk) => {
        if (selectedFamilyFilter !== 'all' && atk.family !== selectedFamilyFilter) return;

        const p = project3D(atk.pc1, atk.pc2, atk.pc3, width, height);

        const clusterColor =
          atk.cluster === '0'
            ? '#ef233c'
            : atk.cluster === '1'
            ? '#ff9e00'
            : atk.cluster === '2'
            ? '#ff4d6d'
            : '#ffffff';

        projectedList.push({
          id: atk.id,
          name: atk.name,
          family: atk.family,
          x3d: atk.pc1,
          y3d: atk.pc2,
          z3d: atk.pc3,
          projX: p.px,
          projY: p.py,
          depth: p.depth,
          radius: 3.5,
          color: clusterColor,
          stroke: '#000000',
          meta: `CLUSTER ${atk.cluster} // ${atk.family.toUpperCase()}`,
          submeta: `PC1: ${atk.pc1.toFixed(1)} | PC2: ${atk.pc2.toFixed(1)} | PC3: ${atk.pc3.toFixed(1)}`,
          attacksCount: 1,
        });
      });
    }

    // RENDER MODE 3: 3D MULTI-VECTOR NETWORK
    else if (mode === 'network') {
      const pRoot = project3D(0, 0, 0, width, height);
      projectedList.push({
        id: 'root',
        name: 'AIRR ROOT',
        family: 'Core',
        x3d: 0,
        y3d: 0,
        z3d: 0,
        projX: pRoot.px,
        projY: pRoot.py,
        depth: pRoot.depth,
        radius: 8,
        color: '#ef233c',
        stroke: '#FFFFFF',
        meta: 'TAXONOMY ROOT (113 ATTACKS)',
        submeta: '4 PRIMARY FAMILIES',
        attacksCount: 113,
      });

      const famCoords: Record<string, { x: number; y: number; z: number }> = {
        Perturbation: { x: 85, y: 0, z: 0 },
        'Composition & Ordering': { x: 0, y: 85, z: 0 },
        'Encoding Abuse': { x: -85, y: 0, z: 0 },
        'Overt Carriers': { x: 0, y: -85, z: 0 },
      };

      Object.entries(famCoords).forEach(([famName, pos]) => {
        const pFam = project3D(pos.x, pos.y, pos.z, width, height);

        ctx.strokeStyle = 'rgba(239, 35, 60, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pRoot.px, pRoot.py);
        ctx.lineTo(pFam.px, pFam.py);
        ctx.stroke();

        projectedList.push({
          id: `fam_${famName}`,
          name: famName.toUpperCase(),
          family: famName,
          x3d: pos.x,
          y3d: pos.y,
          z3d: pos.z,
          projX: pFam.px,
          projY: pFam.py,
          depth: pFam.depth,
          radius: 7,
          color: '#d90429',
          stroke: '#FFFFFF',
          meta: `FAMILY PILLAR // PREVALENCE SHARE`,
          submeta: 'PRIMARY BYPASS VECTOR',
          attacksCount: famName === 'Perturbation' ? 40 : famName === 'Composition & Ordering' ? 29 : famName === 'Encoding Abuse' ? 23 : 21,
        });
      });

      const leafPosMap = new Map<string, { px: number; py: number }>();
      LEAVES.forEach((leaf, idx) => {
        const base = famCoords[leaf.family] || { x: 0, y: 0, z: 0 };
        const angle = (idx * Math.PI) / 4;
        const rad = 32;
        const lx = base.x + rad * Math.cos(angle);
        const ly = base.y + rad * Math.sin(angle);
        const lz = (idx % 2 === 0 ? 1 : -1) * 20;

        const pLeaf = project3D(lx, ly, lz, width, height);
        leafPosMap.set(leaf.name, { px: pLeaf.px, py: pLeaf.py });

        const pFam = project3D(base.x, base.y, base.z, width, height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(pFam.px, pFam.py);
        ctx.lineTo(pLeaf.px, pLeaf.py);
        ctx.stroke();

        projectedList.push({
          id: leaf.id,
          name: leaf.name,
          family: leaf.family,
          x3d: lx,
          y3d: ly,
          z3d: lz,
          projX: pLeaf.px,
          projY: pLeaf.py,
          depth: pLeaf.depth,
          radius: 4,
          color: '#27272a',
          stroke: '#ef233c',
          meta: `LEAF MECHANISM (${leaf.prevalence}%)`,
          submeta: `${leaf.attackCount} CATALOGED ATTACKS`,
          attacksCount: leaf.attackCount,
          isCentroid: true,
        });
      });

      // Hybrid Bridges in glowing red
      HYBRID_BRIDGES.forEach((hyb) => {
        const pA = leafPosMap.get(hyb.leafA);
        const pB = leafPosMap.get(hyb.leafB);
        if (pA && pB) {
          ctx.strokeStyle = '#ef233c';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 2]);
          ctx.beginPath();
          ctx.moveTo(pA.px, pA.py);
          ctx.lineTo(pB.px, pB.py);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    }

    // Depth sort
    projectedList.sort((a, b) => b.depth - a.depth);

    // Draw Nodes
    projectedList.forEach((n) => {
      ctx.beginPath();
      if (n.isCentroid && mode === 'manifold') {
        const r = n.radius;
        ctx.moveTo(n.projX, n.projY - r);
        ctx.lineTo(n.projX + r, n.projY);
        ctx.lineTo(n.projX, n.projY + r);
        ctx.lineTo(n.projX - r, n.projY);
        ctx.closePath();
      } else {
        ctx.arc(n.projX, n.projY, n.radius, 0, Math.PI * 2);
      }

      ctx.fillStyle = n.color;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = n.stroke;
      ctx.stroke();

      if (activeLeafDetail && activeLeafDetail.name === n.name) {
        ctx.strokeStyle = '#ef233c';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(n.projX, n.projY, n.radius + 3.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    (canvas as any).__projectedNodes = projectedList;
  }, [mode, selectedFamilyFilter, yaw, pitch, zoom, project3D, attackParticles, activeLeafDetail]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nodes: ProjectedNode[] = (canvas as any).__projectedNodes || [];
    let closest: ProjectedNode | null = null;
    let minDist = 18;

    for (const n of nodes) {
      const dist = Math.hypot(n.projX - mouseX, n.projY - mouseY);
      if (dist < minDist) {
        minDist = dist;
        closest = n;
      }
    }

    if (closest) {
      setHoveredNode(closest);
      const match = LEAVES.find((l) => l.name === closest?.name || l.id === closest?.id);
      if (match) {
        setActiveLeafDetail(match);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleMouseMove(e);
    const canvas = canvasRef.current;
    if (!canvas || isDragging) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const nodes: ProjectedNode[] = (canvas as any).__projectedNodes || [];
    let found: ProjectedNode | null = null;
    let minDist = 14;

    for (const n of nodes) {
      const dist = Math.hypot(n.projX - mouseX, n.projY - mouseY);
      if (dist < minDist) {
        minDist = dist;
        found = n;
      }
    }

    setHoveredNode(found);
  };

  return (
    <section id="atlas3d" className="relative w-full hairline-b bg-black/80">
      {/* Pinned Micro-Metadata Ribbon */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-2 text-[10px] font-mono text-zinc-500 hairline-b bg-zinc-950/80">
        <div className="flex items-center gap-3">
          <span className="text-[#ef233c] font-bold">[SUBSYSTEM 02]</span>
          <span>3D SPATIAL VECTOR ATLAS</span>
          <span className="text-zinc-700">/</span>
          <span className="text-white">{mode.toUpperCase()} MODE</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-zinc-400">
          <span>YAW: {(yaw * (180 / Math.PI)).toFixed(1)}°</span>
          <span>PITCH: {(pitch * (180 / Math.PI)).toFixed(1)}°</span>
          <span className="text-[#ef233c]">ZOOM: {zoom.toFixed(2)}X</span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 hairline-b">
          <div>
            <div className="text-xs font-mono text-zinc-400 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              INTERACTIVE 3D PROJECTION ENVIRONMENT
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-[-0.04em]">
              SPATIAL <span className="text-[#ef233c]">THREAT ATLAS</span>
            </h2>
          </div>

          {/* Mode Selector Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-zinc-950 p-1 rounded-full border border-white/10">
            <button
              onClick={() => setMode('topology')}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                mode === 'topology'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              3D TOPOLOGY
            </button>
            <button
              onClick={() => setMode('manifold')}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                mode === 'manifold'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              113-ATTACK MANIFOLD
            </button>
            <button
              onClick={() => setMode('latent')}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                mode === 'latent'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              CELL 6: 3D LATENT
            </button>
            <button
              onClick={() => setMode('network')}
              className={`rounded-full px-4 py-1.5 text-xs font-mono transition-all cursor-pointer ${
                mode === 'network'
                  ? 'bg-[#ef233c] text-white font-bold shadow-[0_0_15px_rgba(239,35,60,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              MULTI-VECTOR NETWORK
            </button>
          </div>
        </div>

        {/* 3D Viewport & Split Inspector Drawer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mt-6 rounded-2xl border border-white/10 bg-zinc-950 overflow-hidden shadow-2xl">
          {/* Main 3D Canvas Stage (8 Cols) */}
          <div className="lg:col-span-8 relative min-h-[500px] sm:min-h-[640px] flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-black">
            {/* Viewport Control Bar */}
            <div className="absolute top-3 left-3 z-10 flex items-center gap-2 font-mono text-[10px] text-zinc-400">
              <span className="bg-zinc-900/90 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                CLICK &amp; DRAG TO ORBIT // SCROLL TO ZOOM
              </span>
              <button
                onClick={handleResetCamera}
                className="bg-zinc-900/90 hover:bg-[#ef233c] hover:text-white transition-colors p-1.5 rounded-full border border-white/10 cursor-pointer"
                title="Reset Camera Orientation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Family Filtering Buttons on Viewport */}
            <div className="absolute top-3 right-3 z-10 hidden sm:flex items-center gap-1 font-mono text-[10px]">
              {['all', 'Perturbation', 'Composition & Ordering', 'Encoding Abuse', 'Overt Carriers'].map(
                (fam) => (
                  <button
                    key={fam}
                    onClick={() => setSelectedFamilyFilter(fam)}
                    className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      selectedFamilyFilter === fam
                        ? 'bg-[#ef233c] text-white border-[#ef233c] font-bold shadow-[0_0_10px_rgba(239,35,60,0.4)]'
                        : 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {fam === 'all' ? 'ALL FAMILIES' : fam.split(' ')[0]}
                  </button>
                )
              )}
            </div>

            {/* HTML5 3D Canvas */}
            <canvas
              ref={canvasRef}
              className="w-full flex-1 cursor-grab active:cursor-grabbing block"
              style={{ width: '100%', height: '100%', minHeight: '560px' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
              onClick={handleCanvasClick}
            />

            {/* Hover Floating HUD */}
            {hoveredNode && (
              <div className="absolute bottom-4 left-4 z-20 bg-zinc-950/95 border border-[#ef233c] text-white p-3.5 rounded-xl text-xs max-w-sm pointer-events-none shadow-[0_0_25px_rgba(239,35,60,0.3)] backdrop-blur-md">
                <div className="font-mono text-[10px] text-[#ef233c] font-bold mb-0.5">
                  {hoveredNode.family.toUpperCase()}
                </div>
                <div className="font-display font-bold text-sm text-white tracking-tight">
                  {hoveredNode.name}
                </div>
                <div className="font-mono text-[10px] text-zinc-300 mt-1">
                  {hoveredNode.meta}
                </div>
                <div className="font-mono text-[10px] text-zinc-500 mt-0.5">
                  {hoveredNode.submeta}
                </div>
              </div>
            )}
          </div>

          {/* Active Leaf Inspector Column (4 Cols) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-zinc-950">
            {activeLeafDetail ? (
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-3 border-b border-white/10">
                  <span>ATOMIC MECHANISM LEAF</span>
                  <span className="text-[#ef233c] font-bold">
                    SHARE: {activeLeafDetail.prevalence}%
                  </span>
                </div>

                <div className="mt-4">
                  <span className="font-mono text-[10px] text-zinc-500 block">
                    PARENT CATEGORY // {activeLeafDetail.category.toUpperCase()}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight mt-1 leading-tight">
                    {activeLeafDetail.name}
                  </h3>
                </div>

                <p className="mt-4 text-xs sm:text-sm text-zinc-400 leading-relaxed font-inter">
                  {activeLeafDetail.summary}
                </p>

                {/* Spatial Coordinate Telemetry */}
                <div className="mt-6 pt-5 border-t border-white/10 space-y-3 font-mono text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">CATALOGED ATTACKS:</span>
                    <span className="text-white font-bold">
                      {activeLeafDetail.attackCount} PAPERS
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">HISTORIC ERA FOCUS:</span>
                    <span className="text-zinc-300">~{activeLeafDetail.era}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">ALGORITHMIC SOPHISTICATION:</span>
                    <span className="text-[#ef233c] font-bold">
                      {activeLeafDetail.sophistication} / 10.0
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="text-zinc-500 block mb-1.5">3D MANIFOLD COORDINATES:</span>
                    <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-zinc-300">
                      <div className="p-2 rounded bg-zinc-900 border border-white/5">
                        <span className="text-zinc-500 block">STEALTH (X)</span>
                        <span className="text-white font-bold">{activeLeafDetail.coords.stealth}</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-white/5">
                        <span className="text-zinc-500 block">AUTO (Y)</span>
                        <span className="text-white font-bold">{activeLeafDetail.coords.automation}</span>
                      </div>
                      <div className="p-2 rounded bg-zinc-900 border border-white/5">
                        <span className="text-zinc-500 block">DISTORT (Z)</span>
                        <span className="text-white font-bold">{activeLeafDetail.coords.distortion}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Related Hybrid Vectors */}
                <div className="mt-6 pt-5 border-t border-white/10">
                  <span className="text-[10px] font-mono text-zinc-500 block mb-2">
                    CROSS-FAMILY HYBRID BRIDGES:
                  </span>
                  {HYBRID_BRIDGES.filter(
                    (h) => h.leafA === activeLeafDetail.name || h.leafB === activeLeafDetail.name
                  ).length > 0 ? (
                    <div className="space-y-2">
                      {HYBRID_BRIDGES.filter(
                        (h) => h.leafA === activeLeafDetail.name || h.leafB === activeLeafDetail.name
                      ).map((h) => (
                        <div key={h.id} className="text-xs p-3 rounded-lg bg-zinc-900 border border-white/5">
                          <span className="font-bold text-white block">{h.name}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5 line-clamp-2">
                            {h.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-zinc-500 italic font-mono">
                      Zero direct cross-family hybrid bridges documented for this leaf.
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500 font-mono">
                CLICK ANY SPATIAL NODE TO INSPECT ATOMIC METRICS
              </div>
            )}

            {/* Jump to Catalog Action */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  if (activeLeafDetail) onSelectLeaf(activeLeafDetail.name);
                }}
                className="w-full rounded-full py-3 px-4 text-xs font-mono font-bold bg-[#ef233c] text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(239,35,60,0.3)]"
              >
                <span>FILTER CATALOG PAPERS FOR THIS LEAF</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
