import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import AuroraFlux from './components/ui/aurora-flux';
import StarsCanvas from './components/ui/StarsCanvas';
import { useCursorReaction } from './hooks/useCursorReaction';
import { MATHEMATICS_PAPERS, PHYSICS_PAPERS } from './data/allPapersData';

// Pages
import YangMillsMassGap from './pages/YangMillsMassGap';
import BlackHoleParadox from './pages/BlackHoleParadox';
import DarkEnergy from './pages/DarkEnergy';
import QuantumGravity from './pages/QuantumGravity';
import VerificationSuite from './pages/VerificationSuite';
import HodgeConjecture from './pages/HodgeConjecture';
import PaperReader from './pages/PaperReader';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMathOpen, setIsMathOpen] = useState(false);
  const [isPhysicsOpen, setIsPhysicsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'math' | 'physics'>('math');

  const mathRef = useRef<HTMLDivElement>(null);
  const physicsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mathRef.current && !mathRef.current.contains(e.target as Node)) {
        setIsMathOpen(false);
      }
      if (physicsRef.current && !physicsRef.current.contains(e.target as Node)) {
        setIsPhysicsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setIsMathOpen(false);
    setIsPhysicsOpen(false);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const getMathHref = (id: string) => {
    if (id === 'hodge-conjecture') return '/hodge-conjecture';
    return `/papers/${id}`;
  };

  const getPhysicsHref = (id: string) => {
    if (id === 'yang-mills' || id === 'yang_mills') return '/';
    if (id === 'black-hole-paradox' || id === 'black_hole') return '/black-hole-paradox';
    if (id === 'dark-energy') return '/dark-energy';
    if (id === 'quantum-gravity' || id === 'quantum_gravity') return '/quantum-gravity';
    return `/papers/${id}`;
  };

  const isMathActive =
    location.pathname === '/hodge-conjecture' ||
    MATHEMATICS_PAPERS.some((p) => location.pathname === `/papers/${p.id}`);

  const isPhysicsActive =
    location.pathname === '/' ||
    location.pathname === '/black-hole-paradox' ||
    location.pathname === '/dark-energy' ||
    location.pathname === '/quantum-gravity' ||
    PHYSICS_PAPERS.some((p) => location.pathname === `/papers/${p.id}`);

  const isVerificationActive = location.pathname === '/verification-suite';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0 shrink">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform shrink-0">
            <span className="font-mono font-black text-white text-sm">φ</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-xs sm:text-sm tracking-wider text-white uppercase font-mono truncate">
              The End of Computation
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-purple-400 tracking-widest uppercase truncate hidden sm:block">
              Unified Theoretical Physics
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2">
          {/* Mathematics Dropdown */}
          <div className="relative" ref={mathRef}>
            <button
              onClick={() => {
                setIsMathOpen(!isMathOpen);
                setIsPhysicsOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                isMathActive
                  ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-900/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-cyan-400">∑</span>
              <span>Mathematics ({MATHEMATICS_PAPERS.length})</span>
              <span className={`text-[10px] transition-transform duration-200 ${isMathOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isMathOpen && (
              <div className="absolute left-0 mt-2 w-96 max-h-[75vh] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl shadow-2xl p-2.5 z-50 divide-y divide-slate-800/60 animate-fadeIn">
                <div className="px-3 py-2 text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">
                  Mathematical Foundations &amp; Conjectures
                </div>
                {MATHEMATICS_PAPERS.map((paper) => {
                  const href = getMathHref(paper.id);
                  const isCur = location.pathname === href;
                  return (
                    <Link
                      key={paper.id}
                      to={href}
                      className={`block p-2.5 rounded-xl transition-all ${
                        isCur
                          ? 'bg-cyan-950/60 text-cyan-200 border border-cyan-500/40'
                          : 'hover:bg-slate-900/80 text-slate-200 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-mono font-bold">{paper.shortTitle}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{paper.subtitle}</div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Physics Dropdown */}
          <div className="relative" ref={physicsRef}>
            <button
              onClick={() => {
                setIsPhysicsOpen(!isPhysicsOpen);
                setIsMathOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
                isPhysicsActive
                  ? 'bg-purple-950/70 border-purple-500/60 text-purple-300 shadow-md shadow-purple-900/20'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <span className="text-purple-400">⚛</span>
              <span>Physics ({PHYSICS_PAPERS.length})</span>
              <span className={`text-[10px] transition-transform duration-200 ${isPhysicsOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isPhysicsOpen && (
              <div className="absolute left-0 mt-2 w-[540px] max-h-[75vh] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl p-2.5 z-50 animate-fadeIn">
                <div className="px-3 py-2 text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold border-b border-slate-800/60 mb-2">
                  Unified Theoretical Physics Library
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {PHYSICS_PAPERS.map((paper) => {
                    const href = getPhysicsHref(paper.id);
                    const isCur = location.pathname === href;
                    return (
                      <Link
                        key={paper.id}
                        to={href}
                        className={`block p-2.5 rounded-xl transition-all ${
                          isCur
                            ? 'bg-purple-950/60 text-purple-200 border border-purple-500/40'
                            : 'hover:bg-slate-900/80 text-slate-200 hover:text-white'
                        }`}
                      >
                        <div className="text-xs font-mono font-bold truncate">{paper.shortTitle}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{paper.subtitle}</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Verification Suite */}
          <Link
            to="/verification-suite"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all border cursor-pointer ${
              isVerificationActive
                ? 'bg-indigo-950/70 border-indigo-500/60 text-indigo-300 shadow-md shadow-indigo-900/20'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verification Suite</span>
          </Link>
        </nav>

        {/* Metric Badges (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
            SU(3) Δ &gt; 0
          </span>
          <span className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300">
            S†S = I
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300">
            Ω_Λ = 0.685
          </span>
        </div>

        {/* Mobile Action Controls */}
        <div className="lg:hidden flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-900 via-indigo-900 to-cyan-950 border border-purple-500/60 text-white hover:text-cyan-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-950/40 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Toggle Papers Menu"
          >
            <span className="text-cyan-400 font-black">{isMobileMenuOpen ? '✕' : '☰'}</span>
            <span>Papers</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-purple-500/50 text-purple-200 border border-purple-400/40">17</span>
          </button>

          <Link
            to="/verification-suite"
            className="px-2 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-[11px] font-mono font-bold flex items-center gap-1 shrink-0 active:scale-95"
            title="Verification Suite"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">Verify</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden max-h-[85vh] overflow-y-auto bg-black/95 backdrop-blur-2xl border-t border-slate-800 px-4 py-4 space-y-4 animate-fadeIn">
          {/* Quick Header in Mobile Menu */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Browse Monographs (17)
            </span>
            <Link
              to="/verification-suite"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/90 border border-indigo-500/50 text-indigo-300 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verification Suite
            </Link>
          </div>

          <div className="flex border-b border-slate-800 gap-2 pb-2">
            <button
              onClick={() => setMobileTab('math')}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'math'
                  ? 'bg-cyan-950 border border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-950/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Mathematics ({MATHEMATICS_PAPERS.length})
            </button>
            <button
              onClick={() => setMobileTab('physics')}
              className={`flex-1 py-2 rounded-lg font-mono text-xs font-bold transition-all cursor-pointer ${
                mobileTab === 'physics'
                  ? 'bg-purple-950 border border-purple-500/60 text-purple-300 shadow-md shadow-purple-950/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              Physics ({PHYSICS_PAPERS.length})
            </button>
          </div>

          <div className="space-y-2 pb-8">
            {mobileTab === 'math' &&
              MATHEMATICS_PAPERS.map((paper) => {
                const href = getMathHref(paper.id);
                const isCur = location.pathname === href;
                return (
                  <button
                    key={paper.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(href);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all block cursor-pointer active:scale-[0.98] ${
                      isCur
                        ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-200 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 active:bg-cyan-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-cyan-300 flex items-center justify-between">
                      <span>{paper.shortTitle}</span>
                      {isCur && <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">CURRENT</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{paper.subtitle}</div>
                  </button>
                );
              })}

            {mobileTab === 'physics' &&
              PHYSICS_PAPERS.map((paper) => {
                const href = getPhysicsHref(paper.id);
                const isCur = location.pathname === href;
                return (
                  <button
                    key={paper.id}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate(href);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all block cursor-pointer active:scale-[0.98] ${
                      isCur
                        ? 'bg-purple-950/80 border-purple-500/60 text-purple-200 shadow-md shadow-purple-950/40'
                        : 'bg-slate-900/80 border-slate-800 text-slate-200 active:bg-purple-950/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold text-purple-300 flex items-center justify-between">
                      <span>{paper.shortTitle}</span>
                      {isCur && <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">CURRENT</span>}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">{paper.subtitle}</div>
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </header>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Enable interactive cursor reactive float and soft glow across all site components
  useCursorReaction();

  useEffect(() => {
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

      {/* Background Dimming Layer */}
      <div className="fixed inset-0 pointer-events-none z-[2] bg-black/20" />

      {/* Fixed Navigation */}
      <Navigation />

      {/* Main Content Area: Smooth vertical scroll with responsive padding */}
      <main className="relative z-20 flex-1 w-full pt-20 sm:pt-24 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-black/90 backdrop-blur-sm py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            The End of Computation • Preprints by <strong className="text-slate-300">Jason Emerick</strong> (Creizy Labs)
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Clay Millennium Resolutions</span>
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
          <Route path="/yang-mills" element={<YangMillsMassGap />} />
          <Route path="/hodge-conjecture" element={<HodgeConjecture />} />
          <Route path="/black-hole-paradox" element={<BlackHoleParadox />} />
          <Route path="/dark-energy" element={<DarkEnergy />} />
          <Route path="/quantum-gravity" element={<QuantumGravity />} />
          <Route path="/verification-suite" element={<VerificationSuite />} />
          <Route path="/papers/:id" element={<PaperReader />} />
          <Route path="*" element={<YangMillsMassGap />} />
        </Routes>
      </Layout>
    </Router>
  );
}
