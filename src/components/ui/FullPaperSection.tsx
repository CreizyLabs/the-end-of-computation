import React, { useState } from "react";
import { FullPaperData } from "../../data/papersData";
import { MathText } from "./MathText";

interface FullPaperSectionProps {
  paper: FullPaperData;
  colorScheme?: "purple" | "cyan" | "emerald" | "amber";
}

const colorMap = {
  purple: {
    accent: "text-purple-400",
    border: "border-purple-500/40",
    borderLeft: "border-purple-500",
    bgPill: "bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border-purple-500/30",
    heading: "text-purple-300",
    badge: "bg-purple-950/80 border-purple-500/50 text-purple-200",
  },
  cyan: {
    accent: "text-cyan-400",
    border: "border-cyan-500/40",
    borderLeft: "border-cyan-500",
    bgPill: "bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-500/30",
    heading: "text-cyan-300",
    badge: "bg-cyan-950/80 border-cyan-500/50 text-cyan-200",
  },
  emerald: {
    accent: "text-emerald-400",
    border: "border-emerald-500/40",
    borderLeft: "border-emerald-500",
    bgPill: "bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/30",
    heading: "text-emerald-300",
    badge: "bg-emerald-950/80 border-emerald-500/50 text-emerald-200",
  },
  amber: {
    accent: "text-amber-400",
    border: "border-amber-500/40",
    borderLeft: "border-amber-500",
    bgPill: "bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border-amber-500/30",
    heading: "text-amber-300",
    badge: "bg-amber-950/80 border-amber-500/50 text-amber-200",
  },
};

export const FullPaperSection: React.FC<FullPaperSectionProps> = ({
  paper,
  colorScheme = "purple",
}) => {
  const colors = colorMap[colorScheme];
  const [copied, setCopied] = useState(false);

  const copyCitation = () => {
    const citation = `${paper.author}. "${paper.title}." ${paper.affiliation}, ${paper.date}.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderParagraph = (text: string, pIdx: number) => {
    const isTheoremOrDef = /^(Theorem|Definition|Lemma|Proposition|Corollary)\s+[0-9]/i.test(text);
    const isProof = /^Proof[:\.]/i.test(text);
    const isFormulaBlock = text.includes("=") && (text.includes("int_") || text.includes("rho_") || text.includes("M_Pl") || text.includes("\\") || text.includes("phi^-2"));

    if (isTheoremOrDef) {
      return (
        <div
          key={pIdx}
          className={`my-4 p-4 rounded-xl bg-black/50 border ${colors.border} space-y-2`}
        >
          <div className={`font-mono text-xs font-bold uppercase tracking-wider ${colors.accent}`}>
            Formal Assertion
          </div>
          <div className="text-slate-100 font-medium text-sm leading-relaxed">
            {text}
          </div>
        </div>
      );
    }

    if (isProof) {
      return (
        <div
          key={pIdx}
          className="my-3 pl-4 border-l-2 border-slate-700 bg-black/30 py-2 pr-3 rounded-r-lg text-xs font-mono text-slate-300 leading-relaxed"
        >
          {text}
        </div>
      );
    }

    if (isFormulaBlock && text.length < 240) {
      return (
        <div
          key={pIdx}
          className="my-3 p-3 rounded-lg bg-black/60 border border-slate-800 text-center font-mono text-sm text-cyan-300 overflow-x-auto"
        >
          {text}
        </div>
      );
    }

    return (
      <p key={pIdx} className="text-slate-200 text-sm sm:text-base leading-relaxed">
        {text}
      </p>
    );
  };

  return (
    <article className="w-full mt-16 bg-slate-950/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 sm:p-12 shadow-2xl space-y-12">
      {/* Paper Header */}
      <header className="space-y-6 border-b border-slate-800/80 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${colors.badge}`}>
              Peer-Reviewed Preprint
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-slate-900/60 border border-slate-800">
              {paper.date}
            </span>
          </div>
          <button
            onClick={copyCitation}
            className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${colors.bgPill}`}
          >
            {copied ? "✓ Citation Copied" : "Copy Citation"}
          </button>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {paper.title}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-4xl">
            {paper.subtitle}
          </p>
        </div>

        {/* Authors and Affiliations */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-200 font-bold">{paper.author}</span>
          </div>
          <span>•</span>
          <div>
            <span className="text-slate-300">{paper.affiliation}</span>
          </div>
          <span>•</span>
          <div className="text-slate-400">
            <a href={`mailto:${paper.email}`} className="hover:text-white transition-colors">
              {paper.email}
            </a>
          </div>
        </div>
      </header>

      {/* Abstract Callout */}
      {paper.abstract && (
        <section className={`p-6 sm:p-8 rounded-2xl bg-black/50 border-l-4 ${colors.borderLeft} border-t border-r border-b border-slate-800/80 space-y-3`}>
          <h2 className={`text-xs font-mono uppercase tracking-widest font-bold ${colors.accent}`}>
            Abstract
          </h2>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-light">
            {paper.abstract}
          </p>
        </section>
      )}

      {/* Quick Navigation / Table of Contents */}
      {paper.sections.length > 1 && (
        <nav className="p-4 rounded-xl bg-black/40 border border-slate-800/80 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block">
            Contents ({paper.sections.length} Sections)
          </span>
          <div className="flex flex-wrap gap-2">
            {paper.sections.map((sec, idx) => (
              <a
                key={sec.id || idx}
                href={`#${sec.id}`}
                className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${colors.bgPill}`}
              >
                {sec.title}
              </a>
            ))}
            {paper.references.length > 0 && (
              <a
                href="#references"
                className={`text-xs font-mono px-3 py-1 rounded-lg border transition-all ${colors.bgPill}`}
              >
                References
              </a>
            )}
          </div>
        </nav>
      )}

      {/* Full Paper Body Sections */}
      <div className="space-y-12 divide-y divide-slate-900">
        {paper.sections.map((sec, idx) => (
          <section key={sec.id || idx} id={sec.id} className="pt-8 first:pt-0 space-y-4">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${colors.heading}`}>
              {sec.title}
            </h2>
            <div className="space-y-4 text-slate-200">
              {sec.content.map((pText, pIdx) => renderParagraph(pText, pIdx))}
            </div>
          </section>
        ))}
      </div>

      {/* References */}
      {paper.references && paper.references.length > 0 && (
        <footer id="references" className="border-t border-slate-800/80 pt-8 space-y-4">
          <h2 className={`text-lg sm:text-xl font-bold font-mono uppercase tracking-wider ${colors.accent}`}>
            References
          </h2>
          <ol className="space-y-2 text-xs font-mono text-slate-400">
            {paper.references.map((ref, idx) => (
              <li key={idx} className="leading-relaxed bg-black/30 p-2.5 rounded-lg border border-slate-900">
                {ref}
              </li>
            ))}
          </ol>
        </footer>
      )}
    </article>
  );
};

export default FullPaperSection;
