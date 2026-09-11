import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AuroraFlux from './components/ui/aurora-flux';
import StarsCanvas from './components/ui/StarsCanvas';
import NavButton from './components/ui/NavButton';
import { useCursorReaction } from './hooks/useCursorReaction';

// Pages
import YangMillsMassGap from './pages/YangMillsMassGap';
import BlackHoleParadox from './pages/BlackHoleParadox';
import DarkEnergy from './pages/DarkEnergy';
import QuantumGravity from './pages/QuantumGravity';
import VerificationSuite from './pages/VerificationSuite';
import HodgeConjecture from './pages/HodgeConjecture';

function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Yang-Mills Solve', color: 'hover:text-purple-400', activeColor: 'text-purple-300 border-purple-500 bg-purple-950/40' },
    { path: '/hodge-conjecture', label: 'Hodge Conjecture', color: 'hover:text-cyan-400', activeColor: 'text-cyan-300 border-cyan-500 bg-cyan-950/40' },
    { path: '/black-hole-paradox', label: 'Black Hole Paradox', color: 'hover:text-cyan-400', activeColor: 'text-cyan-300 border-cyan-500 bg-cyan-950/40' },
    { path: '/dark-energy', label: 'Dark Energy', color: 'hover:text-emerald-400', activeColor: 'text-emerald-300 border-emerald-500 bg-emerald-950/40' },
    { path: '/quantum-gravity', label: 'Quantum Gravity', color: 'hover:text-amber-400', activeColor: 'text-amber-300 border-amber-500 bg-amber-950/40' },
    { path: '/verification-suite', label: 'Verification Suite', color: 'hover:text-indigo-400', activeColor: 'text-indigo-300 border-indigo-500 bg-indigo-950/40' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/85 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <span className="font-mono font-black text-white text-sm">φ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider text-white uppercase font-mono">
              The End of Computation
            </span>
            <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">
              Unified Theoretical Physics
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden lg:flex items-center gap-3">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <NavButton key={item.path} to={item.path} active={isActive}>
                {item.label}
              </NavButton>
            );
          })}
        </nav>

        {/* Metric Badges */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
            SU(3) Δ &gt; 0
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            S†S = 1
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
            Ω_Λ = 0.685
          </span>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 gap-2 border-t border-slate-900 bg-black/95">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavButton key={item.path} to={item.path} active={isActive}>
              {item.label}
            </NavButton>
          );
        })}
      </div>
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Enable interactive cursor reactive float and soft glow across all site components
  useCursorReaction();

  React.useEffect(() => {
    let debounceTimer: any = null;
    const renderMath = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      if (typeof w.renderMathInElement === 'function') {
        w.renderMathInElement(document.body, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
          ],
          throwOnError: false,
          ignoredTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'iframe'],
        });
      }
    };

    renderMath();
    const timer = setTimeout(renderMath, 150);

    const observer = new MutationObserver((mutations) => {
      const needsRender = mutations.some((m) => {
        if (m.target instanceof HTMLElement && m.target.closest('.katex')) return false;
        return true;
      });
      if (needsRender) {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(renderMath, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      clearTimeout(timer);
      if (debounceTimer) clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen w-full bg-black text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Background Layer 1: Aurora Flux Shader Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <AuroraFlux fullScreen={false} className="w-full h-full pointer-events-none" />
      </div>

      {/* Background Layer 2: Twinkling Stars Canvas (over top of Aurora Flux, completely transparent background) */}
      <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
        <StarsCanvas className="w-full h-full pointer-events-none" />
      </div>

      {/* Background Dimming Layer (Dims background 20% without touching Aurora Flux shader) */}
      <div className="fixed inset-0 pointer-events-none z-[2] bg-black/20" />

      {/* Fixed Navigation */}
      <Navigation />

      {/* Main Content Area: Smooth vertical scroll */}
      <main className="relative z-20 flex-1 w-full pt-20 lg:pt-20 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-black/90 backdrop-blur-sm py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            The End of Computation • Preprints by <strong className="text-slate-300">Jason Emerick</strong> (Creizy Labs)
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Clay Millennium Resolution</span>
            <span>•</span>
            <span>Non-Local Horizon Holography</span>
            <span>•</span>
            <span>Galois ℤ[φ] Barrier</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<YangMillsMassGap />} />
          <Route path="/hodge-conjecture" element={<HodgeConjecture />} />
          <Route path="/black-hole-paradox" element={<BlackHoleParadox />} />
          <Route path="/dark-energy" element={<DarkEnergy />} />
          <Route path="/quantum-gravity" element={<QuantumGravity />} />
          <Route path="/verification-suite" element={<VerificationSuite />} />
          <Route path="*" element={<YangMillsMassGap />} />
        </Routes>
      </Layout>
    </Router>
  );
}
