import React, { useEffect, useRef } from 'react';

interface MathTextProps {
  math: string;
  display?: boolean;
  inline?: boolean;
  className?: string;
}

export const MathText: React.FC<MathTextProps> = ({ math, display = false, inline, className = '' }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  const isDisplay = display || (inline === false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (containerRef.current && typeof w.katex?.render === 'function') {
      try {
        w.katex.render(math, containerRef.current, {
          displayMode: isDisplay,
          throwOnError: false,
        });
      } catch (err) {
        console.error('KaTeX render error:', err);
      }
    }
  }, [math, isDisplay]);

  return <span ref={containerRef} className={className}>{isDisplay ? '' + math + '' : '$' + math + '$'}</span>;
};

export default MathText;
