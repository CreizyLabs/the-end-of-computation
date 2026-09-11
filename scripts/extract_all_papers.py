import os
import sys
import re
import json
import fitz  # PyMuPDF

sys.stdout.reconfigure(encoding='utf-8')

EXTRACTED_PAPERS_DIR = r'c:\Users\User\Desktop\LUCA-EOC-master\extracted_papers'
OUTPUT_TS_PATH = r'c:\Users\User\Desktop\LUCA-EOC-master\src\data\allPapersData.ts'

PAPER_METADATA = {
    "Constructive Resolution of the Rational Hodge Conjecture.pdf": {
        "id": "hodge-conjecture",
        "category": "mathematics",
        "shortTitle": "Rational Hodge Conjecture",
        "title": "Constructive Resolution of the Rational Hodge Conjecture: Bridging Topological K-Theory to Algebraic Chow Cycles via Demailly Current Regularization and Giambelli-Thom-Porteous Degeneracy Loci",
        "subtitle": "Algebraic De-Virtualization via Coherent Sheaf Stabilization and Fulton Dimension-Deficiency Pushforward Invariance",
        "metrics": [
            {"label": "Galois Ring", "value": "ℤ[φ] (Unimodular)", "desc": "Maximal real quadratic order O_K = ℤ[φ] in ℚ(√5)"},
            {"label": "Rochlin Congruence", "value": "σ(M) ≡ 0 mod 16", "desc": "Intrinsic topological singularity obstruction"},
            {"label": "Defect Pushforward", "value": "π_*([γ_E]) ≡ 0", "desc": "Zero pushforward on Chow cycles CH^p(X) ⊗ ℚ"}
        ]
    },
    "Decidable Program Verification on Stratified Scott Domains and Bounded Complete Partial Orders.pdf": {
        "id": "scott-domains",
        "category": "mathematics",
        "shortTitle": "Decidable Program Verification",
        "title": "Decidable Program Verification on Stratified Scott Domains and Bounded Complete Partial Orders",
        "subtitle": "Constructive Kleene Ascending Chains, Monotone Transformers, and Finite Height Semantic Decidability",
        "metrics": [
            {"label": "Domain Height", "value": "h(D) ≤ H < ∞", "desc": "Finite stratification bound preventing undecidable loops"},
            {"label": "Fixed Point", "value": "lfp(F) = ⊔ F^n(⊥)", "desc": "Constructive Kleene ascending chain termination"},
            {"label": "Complexity", "value": "O(H · C_eval)", "desc": "Deterministic termination verification bound"}
        ]
    },
    "Diophantine Maximality and Greene Residue Scaling (1).pdf": {
        "id": "diophantine-maximality",
        "category": "mathematics",
        "shortTitle": "Diophantine Maximality & Greene Scaling",
        "title": "Diophantine Maximality and Greene Residue Scaling for Golden-Ratio Invariant Tori in Perturbed Hamiltonian Systems",
        "subtitle": "Analytic Continued Fractions, Noble Frequencies, and Critical Residue Invariance in Chirikov Standard Maps",
        "metrics": [
            {"label": "Noble Winding", "value": "ω_* = (√5 - 1) / 2 = 1/φ", "desc": "Maximal irrationality via continued fraction [0; 1, 1, 1...]"},
            {"label": "Critical Perturbation", "value": "K_c ≈ 0.971635406", "desc": "Last surviving KAM invariant barrier on the cylinder"},
            {"label": "Greene Residue", "value": "R_c ≈ 0.2500888", "desc": "Universal criticality indicator for golden torus breakup"}
        ]
    },
    "Topological Gate Synthesis and Solovay-Kitaev Braiding in the Fibonacci Anyon Modular Category.pdf": {
        "id": "topological-gate-synthesis",
        "category": "mathematics",
        "shortTitle": "Topological Gate Synthesis",
        "title": "Topological Gate Synthesis and Solovay-Kitaev Braiding in the Fibonacci Anyon Modular Category",
        "subtitle": "Universal Quantum Compilation via Braid Generators on the Four-Anyon Hilbert Space V_0^(ττττ)",
        "metrics": [
            {"label": "Quantum Dimension", "value": "d_τ = φ ≈ 1.6180339887", "desc": "Fibonacci anyon golden ratio quantum dimension"},
            {"label": "Solovay-Kitaev", "value": "L(ε) = O(log^c(1/ε))", "desc": "Polylogarithmic depth braid word compilation"},
            {"label": "Unitarity", "value": "||U^† U - I|| = 0", "desc": "Exact topological protection without active error correction"}
        ]
    },
    "Non-Perturbative Transfer Matrix Spectral Scaling.pdf": {
        "id": "transfer-matrix-spectral-scaling",
        "category": "mathematics",
        "shortTitle": "Transfer Matrix Spectral Scaling",
        "title": "Microscopic Derivation of the Transfer Matrix Spectral Gap from the Wilson Lattice Gauge Action: Resolving the Scaling Ansatz Circularity",
        "subtitle": "Exact Temporal Gauge Diagonalization, Clebsch-Gordan Recoupling, and Bałaban Boundary Invariance",
        "metrics": [
            {"label": "Transfer Operator", "value": "T = exp(-ε H_Kogut-Susskind)", "desc": "Microscopic transfer matrix derived from Wilson action"},
            {"label": "Spectral Gap", "value": "Δ̂(g) = -ln(λ_1 / λ_0) > 0", "desc": "Strict non-zero eigenvalue ratio in spatial loop basis"},
            {"label": "Continuum Scaling", "value": "lim_{ε→0} Δ̂(g)/ε = C_0 · Λ_QCD", "desc": "Elimination of circular scaling ansatz"}
        ]
    },
    "Exact Reversible State Transitions.pdf": {
        "id": "reversible-transitions",
        "category": "physics",
        "shortTitle": "Exact Reversible State Transitions",
        "title": "Exact Reversible State Transitions Over Real Quadratic Fields: Unitary Householder Reflection and Zero-Entropy Drift in ℚ(√5)",
        "subtitle": "Landauer Dissipation Elimination via Algebraic Integer Arithmetic and Galois Conjugate Invariance",
        "metrics": [
            {"label": "Landauer Bound", "value": "ΔS_logical = 0", "desc": "Zero thermodynamic bit erasure dissipation"},
            {"label": "Galois Norm", "value": "N(a + bφ) = a² + ab - b² = ±1", "desc": "Unimodular algebraic unit conservation"},
            {"label": "Entropy Drift", "value": "||S - S_0||_Frob = 0.00e+0", "desc": "Strict numerical machine zero entropy drift"}
        ]
    },
    "Fault-Tolerant Quasicrystalline Information Persistence.pdf": {
        "id": "quasicrystalline-persistence",
        "category": "physics",
        "shortTitle": "Quasicrystalline Information Persistence",
        "title": "Fault-Tolerant Information Persistence in Aperiodic Quasicrystalline Subsystems: Bounded von Neumann Sub-Algebras, Fibonacci Anyon Modular Categories, and Scale-Invariant C*-Isomorphisms",
        "subtitle": "Algebraic Split Property, Non-Local Horizon Holography, and Quasicrystalline Deflation Dynamics",
        "metrics": [
            {"label": "von Neumann Algebra", "value": "A(Ω) ⊂ B(H_A)", "desc": "Bounded, weakly closed sub-algebra with split property"},
            {"label": "Topological Entropy", "value": "γ = ln φ ≈ 0.4812118", "desc": "Universal Kitaev-Preskill topological entanglement offset"},
            {"label": "Decoherence Rate", "value": "Γ_dec ≤ exp(-c · L)", "desc": "Exponential topological error suppression"}
        ]
    },
    "Metastable Topological Persistence in LQG.pdf": {
        "id": "lqg-persistence",
        "category": "physics",
        "shortTitle": "Metastable Persistence in LQG",
        "title": "Metastable Topological Persistence and Measurement-Induced Metric Perturbations in Discretized Spacetime: Semiclassical Triad Back-Reaction and Coherent BEC Amplification in Loop Quantum Gravity",
        "subtitle": "Densitized Triad Holonomy Operators, Semiclassical Gravitational Perturbations, and Laboratory BEC Interferometry",
        "metrics": [
            {"label": "Triad Spectrum", "value": "Ê^a_i |s⟩ = 8πγ G ℏ j(j+1) |s⟩", "desc": "Discrete spatial geometry eigenvalues"},
            {"label": "Metric Perturbation", "value": "δg_μν ∼ ℓ_Pl / r", "desc": "Measurement-induced local metric back-reaction"},
            {"label": "BEC Phase Shift", "value": "ΔΦ_BEC ∼ 10^-5 rad", "desc": "Macroscopic quantum coherent interferometric signature"}
        ]
    },
    "Topological Information Protection and Coarse-Grained Spin Networks.pdf": {
        "id": "spin-networks",
        "category": "physics",
        "shortTitle": "Topological Information & Spin Networks",
        "title": "Topological Information Protection and Coarse-Grained Spin Networks: Conserved Non-Abelian Currents, Boundary BKT Transitions, and Densitized Triad Couplings in Loop Quantum Gravity",
        "subtitle": "Intrinsic Riemannian Karcher Averaging on Boundary SU(2) and Dissipationless Current Conservation",
        "metrics": [
            {"label": "Conserved Current", "value": "∂_μ J^μ_a = 0", "desc": "Exact topological non-Abelian current preservation"},
            {"label": "BKT Transition", "value": "T_c = (π / 2) ρ_s", "desc": "Vortex-antivortex unbinding threshold on boundary"},
            {"label": "Gribov Horizon", "value": "Det[M_FP] > 0", "desc": "Rigorous elimination of Gribov copies via Karcher mean"}
        ]
    },
    "Topological State Projection and Semiclassical Geometrodynamics.pdf": {
        "id": "topological-state-projection",
        "category": "physics",
        "shortTitle": "Topological State Projection",
        "title": "Deterministic State-Vector Projection, Semiclassical Metric Back-Reaction, and Hopf-Fibration Geometrodynamics Across Discrete ℤ[φ] Manifolds",
        "subtitle": "Geometric Measurement Quantization, Hopf Fibration S³ → S², and Real Quadratic Moduli Dynamics",
        "metrics": [
            {"label": "Hopf Fiber", "value": "S¹ ↪ S³ → S²", "desc": "Exact geometric fiber bundle realization of qubit state space"},
            {"label": "Galois Invariant", "value": "M_φ ⊂ ℝ^N over ℤ[φ]", "desc": "Discrete lattice invariant under field norm in ℚ(√5)"},
            {"label": "Eberhard Causality", "value": "Tr_A(|Φ+⟩⟨Φ+|) = ½ I", "desc": "No-signaling preserved under non-linear projection"}
        ]
    },
    "Singular Density of States and Flat-Band BCS Pairing in Aperiodic Quasicrystalline Lattices.pdf": {
        "id": "flat-band-bcs",
        "category": "physics",
        "shortTitle": "Flat-Band BCS Pairing",
        "title": "Singular Density of States and Flat-Band BCS Pairing in Aperiodic Quasicrystalline Lattices",
        "subtitle": "Aharonov-Bohm Caging, Compact Localized States, and Linear Superconducting Transition Temperature Scaling",
        "metrics": [
            {"label": "Dispersion Quench", "value": "v_g = ∇_k E = 0", "desc": "Macroscopic flat-band electronic kinetic quenching"},
            {"label": "BCS Critical Temp", "value": "k_B T_c ∝ V · D_flat", "desc": "Linear pairing coupling without exponential suppression"},
            {"label": "Quasicrystal Graph", "value": "Penrose / Ammann-Beenker", "desc": "Self-similar bipartite tight-binding network"}
        ]
    },
    "Non-Equilibrium Thermodynamic Bifurcations and Spontaneous Dissipative Structuring in Open Systems.pdf": {
        "id": "non-equilibrium-thermo",
        "category": "physics",
        "shortTitle": "Non-Equilibrium Bifurcations",
        "title": "Non-Equilibrium Thermodynamic Bifurcations and Spontaneous Dissipative Structuring in Open Systems",
        "subtitle": "Glansdorff-Prigogine Stability, Second Entropy Variation δ²S ≤ 0, and Far-From-Equilibrium Pattern Formation",
        "metrics": [
            {"label": "Entropy Balance", "value": "dS = d_i S + d_e S, d_i S ≥ 0", "desc": "Internal dissipation positive, boundary flux negative"},
            {"label": "Stability Criterion", "value": "(1/2) ∂_t(δ²S) = P[δX] ≥ 0", "desc": "Glansdorff-Prigogine excess entropy production threshold"},
            {"label": "Bifurcation Point", "value": "λ = λ_c (Marginal State)", "desc": "Spontaneous transition to self-organized macroscopic dissipative structure"}
        ]
    },
    "Spectral Relaxation and Kinetic Trap Elimination on Funneled Conformational Energy Landscapes.pdf": {
        "id": "funneled-landscapes",
        "category": "physics",
        "shortTitle": "Funneled Energy Landscapes",
        "title": "Spectral Relaxation and Kinetic Trap Elimination on Funneled Conformational Energy Landscapes",
        "subtitle": "Continuous-Time Markov Master Operators, Levinthal Paradox Resolution, and Non-Exponential Glassy Decay Suppression",
        "metrics": [
            {"label": "Spectral Gap", "value": "λ_2 - λ_1 ≥ Δ_min > 0", "desc": "Invariant relaxation threshold ensuring rapid microsecond folding"},
            {"label": "Levinthal Paradox", "value": "t_fold ≪ 10^95 steps", "desc": "Funneled global slope directing conformational search"},
            {"label": "Glassy Traps", "value": "N_traps ∼ O(1)", "desc": "Elimination of exponentially deep spin-glass energy basins"}
        ]
    }
}

def clean_text(text):
    text = text.replace('\r', '')
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def extract_paper(pdf_path, meta):
    doc = fitz.open(pdf_path)
    full_text = ""
    for page in doc:
        full_text += page.get_text() + "\n"
        
    lines = [clean_text(l) for l in full_text.split('\n')]
    
    # 1. Abstract extraction
    abs_lines = []
    in_abs = False
    for i, line in enumerate(lines):
        if line.lower() == 'abstract':
            in_abs = True
            continue
        if in_abs:
            # Check for start of section 1
            if line == '1' or re.match(r'^1\s+[A-Z]', line) or line.startswith('1.'):
                break
            abs_lines.append(line)
    abstract = " ".join(abs_lines)
    
    # 2. References extraction
    ref_idx = -1
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].lower() in ['references', '9. references', '10. references', '8. references', '7. references']:
            ref_idx = i
            break
            
    references = []
    if ref_idx != -1:
        ref_lines = lines[ref_idx + 1:]
        current_ref = []
        for l in ref_lines:
            if not l:
                continue
            if re.match(r'^\[\d+\]', l):
                if current_ref:
                    references.append(" ".join(current_ref))
                current_ref = [l]
            else:
                current_ref.append(l)
        if current_ref:
            references.append(" ".join(current_ref))
        body_lines = lines[:ref_idx]
    else:
        body_lines = lines

    # 3. Section extraction
    # Detect sections where line i is '1'..'9' and line i+1 is capitalized title, or line i starts with '1. ', '2. ', etc.
    section_breaks = []
    for i in range(len(body_lines) - 1):
        curr = body_lines[i]
        nxt = body_lines[i + 1]
        
        # Format A: standalone digit '1'..'9' followed by title
        if re.match(r'^[1-9]$', curr):
            if (nxt and nxt[0].isupper() and len(nxt) >= 4 and 
                not nxt.startswith(('Theorem', 'Definition', 'Lemma', 'Proposition', 'Corollary', 'Proof', 'Figure', 'Table', 'Step', 'Case')) and
                not any(nxt.startswith(f'[{j}]') for j in range(20))):
                section_breaks.append((i, f"{curr}. {nxt}", 2))
                continue
                
        # Format B: '1. Title' or '1 Title'
        m = re.match(r'^([1-9]\.?)\s+([A-Z][A-Za-z0-9\s\,\-\:\(\)\/]{4,70})$', curr)
        if m and not curr.endswith('.'):
            if not curr.startswith(('Theorem', 'Definition', 'Lemma', 'Proposition', 'Corollary', 'Proof', 'Figure', 'Table', 'Step', 'Case')):
                section_breaks.append((i, curr, 1))

    # Clean duplicate section breaks
    filtered_breaks = []
    last_idx = -999
    for idx, title, skip in section_breaks:
        if idx - last_idx > 3:
            filtered_breaks.append((idx, title, skip))
            last_idx = idx

    sections = []
    if not filtered_breaks:
        # Fallback single section
        sections.append({
            "id": "sec-full",
            "title": "1. Comprehensive Preprint",
            "content": ["\n\n".join([l for l in body_lines if l])]
        })
    else:
        for b_idx in range(len(filtered_breaks)):
            start_i, title, skip = filtered_breaks[b_idx]
            end_i = filtered_breaks[b_idx + 1][0] if b_idx + 1 < len(filtered_breaks) else len(body_lines)
            
            # Content between start_i + skip and end_i
            sec_lines = body_lines[start_i + skip : end_i]
            
            # Break into coherent paragraphs (group lines)
            paras = []
            cur_p = []
            for sl in sec_lines:
                if not sl:
                    if cur_p:
                        paras.append(" ".join(cur_p))
                        cur_p = []
                elif re.match(r'^(Theorem|Definition|Lemma|Proposition|Corollary)\s+\d', sl) or sl.startswith('Proof.') or sl.startswith('Proof:'):
                    if cur_p:
                        paras.append(" ".join(cur_p))
                        cur_p = []
                    cur_p.append(sl)
                else:
                    cur_p.append(sl)
            if cur_p:
                paras.append(" ".join(cur_p))
                
            sections.append({
                "id": f"sec-{b_idx + 1}",
                "title": title,
                "content": paras if paras else ["\n\n".join(sec_lines)]
            })

    return {
        "id": meta["id"],
        "category": meta["category"],
        "shortTitle": meta["shortTitle"],
        "title": meta["title"],
        "subtitle": meta["subtitle"],
        "author": "Jason Emerick",
        "affiliation": "Creizy Labs",
        "email": "creizylabs@gmail.com",
        "date": "September 2026",
        "abstract": abstract,
        "sections": sections,
        "references": references,
        "metrics": meta.get("metrics", [])
    }

def main():
    papers_data = {}
    for filename, meta in PAPER_METADATA.items():
        pdf_path = os.path.join(EXTRACTED_PAPERS_DIR, filename)
        if not os.path.exists(pdf_path):
            print(f"Warning: {pdf_path} not found.")
            continue
        print(f"Extracting {filename}...")
        paper = extract_paper(pdf_path, meta)
        papers_data[paper["id"]] = paper
        print(f"  -> {paper['shortTitle']}: {len(paper['sections'])} sections, {len(paper['references'])} references")
        
    ts_code = """// Master Unified Registry of The End of Computation Preprints
// Authored by Jason Emerick (Creizy Labs, September 2026)

export interface PaperMetric {
  label: string;
  value: string;
  desc?: string;
}

export interface PaperSection {
  id: string;
  title: string;
  content: string[];
}

export interface FullPaperData {
  id: string;
  category: 'mathematics' | 'physics';
  shortTitle: string;
  title: string;
  subtitle: string;
  author: string;
  affiliation: string;
  email: string;
  date: string;
  abstract: string;
  sections: PaperSection[];
  references: string[];
  metrics: PaperMetric[];
}

export const ALL_PAPERS_DATA: Record<string, FullPaperData> = """ + json.dumps(papers_data, indent=2, ensure_ascii=False) + """;

export const MATHEMATICS_PAPERS: FullPaperData[] = Object.values(ALL_PAPERS_DATA).filter(
  (p) => p.category === 'mathematics'
);

export const PHYSICS_PAPERS: FullPaperData[] = Object.values(ALL_PAPERS_DATA).filter(
  (p) => p.category === 'physics'
);
"""
    with open(OUTPUT_TS_PATH, 'w', encoding='utf-8') as f:
        f.write(ts_code)
        
    print(f"\nSuccessfully wrote {len(papers_data)} complete papers to {OUTPUT_TS_PATH}!")

if __name__ == '__main__':
    main()
