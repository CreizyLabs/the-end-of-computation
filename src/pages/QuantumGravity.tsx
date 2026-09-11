import React, { useState, useEffect, useRef } from 'react';
import { FullPaperSection } from '../components/ui/FullPaperSection';
import { quantumGravityPaper } from '../data/papersData';

// 3D Canvas visualizer for Spin-Foam Network & Quasicrystalline Lattice
function SpinFoamCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 3D icosahedral / golden ratio quasicrystalline vertex positions
    const phi = 1.6180339887;
    const baseVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    let animId: number;
    let t = 0;
    let w = canvas.clientWidth || 300;
    let h = canvas.clientHeight || 200;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        w = entry.contentRect.width;
        h = entry.contentRect.height;
        const dpr = window.devicePixelRatio || 1;
        const displayW = Math.floor(w * dpr);
        const displayH = Math.floor(h * dpr);
        if (canvas.width !== displayW || canvas.height !== displayH) {
          canvas.width = displayW;
          canvas.height = displayH;
        }
      }
    });
    observer.observe(canvas);

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;

      if (w === 0 || h === 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const scale = Math.min(w, h) * 0.28;

      // 3D Rotation matrices
      const rotY = t * 0.5;
      const rotX = t * 0.3;

      const projected = baseVertices.map(([x, y, z]) => {
        // Rotate around Y
        let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
        let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
        // Rotate around X
        let y2 = y * Math.cos(rotX) - z1 * Math.sin(rotX);
        let z2 = y * Math.sin(rotX) + z1 * Math.cos(rotX);

        // Perspective projection
        const fov = 3.5;
        const pz = z2 + fov;
        const px = cx + (x1 * scale) / pz;
        const py = cy + (y2 * scale) / pz;

        return { px, py, pz, x1, y2, z2 };
      });

      // Draw Spin-Foam edges with quantum flux colors
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = baseVertices[i][0] - baseVertices[j][0];
          const dy = baseVertices[i][1] - baseVertices[j][1];
          const dz = baseVertices[i][2] - baseVertices[j][2];
          const distSq = dx * dx + dy * dy + dz * dz;

          // In standard icosahedron, edge length squared is 4
          if (distSq < 4.2) {
            const avgZ = (projected[i].pz + projected[j].pz) / 2;
            const alpha = Math.max(0.15, Math.min(0.85, (avgZ - 2) / 2.5));

            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);

            // Flowing quantum gauge flux
            const phase = t * 2 + (i + j) * 0.3;
            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * (0.6 + 0.4 * Math.sin(phase))})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      // Draw Spin-Foam vertices (Intertwiner nodes)
      projected.forEach((v, idx) => {
        const pulse = Math.sin(t * 3 + idx) * 0.5 + 0.5;
        const radius = Math.max(3, (5 * (4 - v.pz)) / 2.5) + pulse * 1.5;

        ctx.beginPath();
        ctx.arc(v.px, v.py, radius, 0, Math.PI * 2);
        ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#a855f7';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Central Quantum Singularity Core (Suppressed)
      const corePulse = (Math.sin(t * 2) + 1) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + corePulse * 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Labels
      ctx.font = '10px monospace';
      ctx.fillStyle = '#fde047';
      ctx.textAlign = 'center';
      ctx.fillText('φ-Harmonic Spin-Foam (U_q(sl₂), q = e^{iπ/5})', cx, 22);
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('UV Singularities Eliminated via Quasicrystalline Discretization', cx, h - 18);

      t += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
}

// Interactive Spin-Foam & Golden Ratio Lattice Controller
function QuantumGeometrySimulator() {
  const [spinJ, setSpinJ] = useState('1/2');
  const [rootN, setRootN] = useState(5);

  const phi = 1.6180339887;
  // Quantum dimension at root of unity q = exp(i*pi/N)
  // For spin 1/2: d_1/2 = 2*cos(pi/N)
  const qDim = (2 * Math.cos(Math.PI / rootN)).toFixed(6);

  return (
    <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-xl space-y-5">
      <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
            φ-Harmonic Quantum Spin-Foam Engine
          </span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
          UV REGULARIZED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Spin Representation (j):</span>
            <span className="text-amber-400 font-bold">j = {spinJ}</span>
          </div>
          <div className="flex gap-2">
            {['1/2', '1', '3/2', '2'].map(j => (
              <button
                key={j}
                onClick={() => setSpinJ(j)}
                className={`flex-1 py-1.5 rounded font-mono text-xs border transition-colors ${
                  spinJ === j
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                    : 'bg-black/40 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-300">
            <span>Root of Unity Root (N):</span>
            <span className="text-cyan-400 font-bold">q = e^(iπ/{rootN})</span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            step="1"
            value={rootN}
            onChange={e => setRootN(parseInt(e.target.value))}
            className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <div className="text-[11px] font-mono text-slate-400">
            {rootN === 5 ? '★ N = 5: Exactly produces golden ratio φ!' : 'Non-golden root deformation'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black/60 border border-slate-800 p-3 rounded-lg text-center">
          <div className="text-[11px] font-mono text-slate-400">Quantum Dimension [2]_q</div>
          <div className="text-lg font-mono font-bold text-amber-400 mt-0.5">{qDim}</div>
          <div className="text-[10px] font-mono text-slate-400">{rootN === 5 ? '≡ φ (Golden Ratio)' : 'Deformed'}</div>
        </div>
        <div className="bg-black/60 border border-slate-800 p-3 rounded-lg text-center">
          <div className="text-[11px] font-mono text-slate-400">Singularity Status</div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">ELIMINATED</div>
          <div className="text-[10px] font-mono text-slate-400">Finite Intertwiner Volume</div>
        </div>
        <div className="bg-black/60 border border-slate-800 p-3 rounded-lg text-center">
          <div className="text-[11px] font-mono text-slate-400">Ring Structure</div>
          <div className="text-lg font-mono font-bold text-purple-400 mt-0.5">ℤ[φ]</div>
          <div className="text-[10px] font-mono text-slate-400">Galois Unit Barrier</div>
        </div>
      </div>

      <div className="bg-black/80 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1">
        <div className="text-amber-300">
          ✓ Penrose Quasicrystalline Lattice: 4D spacetime discretized without breaking local Lorentz covariance.
        </div>
        <div className="text-emerald-400">
          ✓ No Infinities: Continuous spacetime derivatives replaced by discrete quantum holonomies with strictly bounded spectra.
        </div>
      </div>
    </div>
  );
}

export default function QuantumGravity() {
  const [activeTab, setActiveTab] = useState<'framework' | 'spinfoam' | 'quasicrystal'>('framework');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <header className="space-y-4 border-b border-amber-500/20 pb-8 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="bg-amber-900/40 border border-amber-500/40 text-amber-300 px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider">
            Quantum Gravity Unified
          </span>
          <span className="bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider">
            φ-Harmonic Lattice
          </span>
          <span className="bg-purple-900/40 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider">
            Singularities Eliminated
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          A Unified Spin-Foam and Quasicrystalline Framework for φ-Harmonic Quantum Gravity
        </h1>

        <p className="text-lg sm:text-xl text-amber-200/80 font-light max-w-4xl">
          Non-Perturbative Quantum Geometry, Discrete Anyonic Invariance, and the Elimination of Spacetime Singularities
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-mono text-slate-400 pt-2">
          <div>
            <span className="text-slate-500">Author:</span> <strong className="text-slate-200">Jason Emerick</strong>
          </div>
          <div>
            <span className="text-slate-500">Affiliation:</span> <strong className="text-slate-200">Creizy Labs</strong> (creizylabs@gmail.com)
          </div>
          <div>
            <span className="text-slate-500">Date:</span> <span className="text-slate-300">September 2026</span>
          </div>
        </div>
      </header>

      {/* Visualizer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-6 bg-slate-950/60 border border-amber-500/20 rounded-2xl overflow-hidden relative min-h-[380px] flex flex-col justify-between">
          <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/30">
            <div className="text-[11px] font-mono text-amber-300">3D Quasicrystalline Spin-Foam Network</div>
            <div className="text-[9px] font-mono text-slate-400">Golden ratio icosahedral vertex projection</div>
          </div>
          <div className="w-full h-full min-h-[360px]">
            <SpinFoamCanvas />
          </div>
          <div className="p-4 bg-black/80 border-t border-amber-500/10 text-xs font-mono text-slate-400 flex justify-between">
            <span>U_q(sl₂) at q = e^(iπ/5)</span>
            <span className="text-amber-400">d_{'{1/2}'} = φ ≈ 1.618</span>
            <span>Zero Singularities</span>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-center">
          <QuantumGeometrySimulator />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-6 text-sm font-mono font-medium">
        <button
          onClick={() => setActiveTab('framework')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'framework'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Framework &amp; Motivation
        </button>
        <button
          onClick={() => setActiveTab('spinfoam')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'spinfoam'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Discrete Spin-Foams
        </button>
        <button
          onClick={() => setActiveTab('quasicrystal')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'quasicrystal'
              ? 'border-amber-400 text-amber-300 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Quasicrystalline Invariance
        </button>
      </div>

      {/* Tab 1: Framework */}
      {activeTab === 'framework' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="bg-amber-950/20 border-l-4 border-amber-500 p-6 rounded-r-xl space-y-3">
            <h3 className="text-xs font-mono tracking-widest text-amber-400 uppercase font-bold">Abstract Summary</h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              General relativity predicts gravitational singularities where curvature diverges to infinity, while perturbative quantum gravity is non-renormalizable. We resolve both dilemmas simultaneously by discretizing 4D spacetime into a <span className="text-amber-300 font-mono">φ-harmonic</span> spin-foam network governed by the quantum group <span className="text-amber-300 font-mono">U_q(𝔰𝔩₂)</span> at the fifth root of unity. The golden ratio emerges as the natural quantum dimension of physical geometry, bounding curvature and suppressing ultraviolet divergences automatically without hand-tuned cutoffs.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Spin-Foams */}
      {activeTab === 'spinfoam' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">
              The Deformed Spin-Foam State Sum
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              In standard loop quantum gravity, spin-network links are labeled by representations <span className="font-mono">j</span> of <span className="font-mono">SU(2)</span>. By q-deforming the gauge algebra to <span className="font-mono">U_q(𝔰𝔩₂)</span> at <span className="font-mono">q = e^(iπ/5)</span>, the number of admissible physical representations becomes strictly finite (<span className="font-mono">2j &lt; 4</span>). The spin-foam partition function:
            </p>
            <div className="bg-black/70 p-4 rounded-xl font-mono text-xs text-center text-amber-300 border border-amber-900/30">
              Z = ∑_{'{j_f}'} ∏_f dim_q(j_f) ∏_v A_v(j_f) &lt; ∞
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              The state sum is guaranteed to be strictly finite and free of divergences. Spacetime foam does not bubble uncontrollably into trans-Planckian foam, but settles into the golden ratio ground state.
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Quasicrystals */}
      {activeTab === 'quasicrystal' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">
              4D Quasicrystalline Penrose Manifold
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Unlike standard crystalline lattices which break rotational invariance, a quasicrystal with icosahedral symmetry possesses continuous diffraction patterns that protect spatial isotropy. The fundamental volume gap is bounded from below:
            </p>
            <div className="bg-black/70 p-4 rounded-xl font-mono text-xs text-center text-purple-300 border border-purple-900/30">
              V_min = ℓ_Pl³ · √(φ² - 1) &gt; 0
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Zero-volume singularities cannot form because volume eigenvalues cannot collapse to zero. Matter bounces elastically at the Planck scale, preventing black hole and big bang singularities.
            </p>
          </div>
        </div>
      )}

      {/* Full Peer-Reviewed Quantum Gravity Paper */}
      <FullPaperSection paper={quantumGravityPaper} colorScheme="amber" />
    </div>
  );
}
