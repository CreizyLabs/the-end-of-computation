import { useEffect } from 'react';

export function useCursorReaction() {
  useEffect(() => {
    let currentElement: HTMLElement | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let rafId: number | null = null;

    const findInteractiveParent = (el: HTMLElement | null): HTMLElement | null => {
      while (el && el !== document.body && el.id !== 'root') {
        const tagName = el.tagName.toLowerCase();
        if (tagName === 'header' || tagName === 'main' || tagName === 'footer' || tagName === 'nav') {
          return null;
        }
        if (el.dataset.noReactive === 'true') {
          return null;
        }
        // Exclude range inputs and raw canvas (let canvas wrapper float instead)
        if (tagName === 'input' || tagName === 'canvas') {
          el = el.parentElement;
          continue;
        }
        // Match interactive elements: cards, badges, buttons, sections, rounded containers
        if (
          el.dataset.cursorReactive === 'true' ||
          el.classList.contains('cursor-reactive') ||
          el.classList.contains('interactive-card') ||
          tagName === 'button' ||
          (el.className && typeof el.className === 'string' && (
            el.className.includes('rounded-2xl') ||
            el.className.includes('rounded-xl') ||
            el.className.includes('rounded-lg') ||
            (el.className.includes('border') && el.className.includes('bg-'))
          ))
        ) {
          if (el.offsetWidth >= 50 && el.offsetHeight >= 24) {
            return el;
          }
        }
        el = el.parentElement;
      }
      return null;
    };

    const resetCurrent = () => {
      if (currentElement) {
        currentElement.style.transform = '';
        currentElement.style.boxShadow = '';
        currentElement.style.borderColor = '';
        currentElement.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease';
        currentElement = null;
      }
      isHovering = false;
    };

    const updateMotion = () => {
      if (!isHovering || !currentElement) return;

      currentX += (targetX - currentX) * 0.25;
      currentY += (targetY - currentY) * 0.25;

      const tiltX = -currentY * 3.5;
      const tiltY = currentX * 3.5;
      const liftZ = -5;

      currentElement.style.transform = `perspective(900px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(${liftZ}px) scale3d(1.012, 1.012, 1.012)`;
      currentElement.style.boxShadow = `0 14px 35px -8px rgba(0, 212, 255, 0.35), 0 0 25px -2px rgba(56, 189, 248, 0.25)`;
      currentElement.style.borderColor = 'rgba(56, 189, 248, 0.5)';
      currentElement.style.transition = 'transform 0.08s ease-out, box-shadow 0.2s ease, border-color 0.2s ease';

      rafId = requestAnimationFrame(updateMotion);
    };

    const handlePointerMove = (e: PointerEvent) => {
      const target = findInteractiveParent(e.target as HTMLElement);

      if (!target) {
        if (currentElement) {
          resetCurrent();
        }
        return;
      }

      if (target !== currentElement) {
        if (currentElement) {
          resetCurrent();
        }
        currentElement = target;
        currentElement.style.willChange = 'transform, box-shadow';
      }

      const rect = currentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      targetX = Math.max(-1, Math.min(1, (x - centerX) / (centerX || 1)));
      targetY = Math.max(-1, Math.min(1, (y - centerY) / (centerY || 1)));

      if (!isHovering) {
        isHovering = true;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(updateMotion);
      }
    };

    const handlePointerLeave = () => {
      resetCurrent();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerup', handlePointerLeave, { passive: true });
    window.addEventListener('pointercancel', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      resetCurrent();
    };
  }, []);
}
