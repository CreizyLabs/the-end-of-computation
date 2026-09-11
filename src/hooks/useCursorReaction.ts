import { useEffect } from 'react';

/**
 * High-performance, zero-jitter cursor reaction hook.
 * Strictly active on fine pointer devices (mouse/trackpad).
 * Automatically suppressed during scroll and on touch screens to guarantee zero drift,
 * zero layout shaking, and zero scroll glitching.
 */
export function useCursorReaction() {
  useEffect(() => {
    // Only activate for devices with a fine pointer (mouse/trackpad) and hover capability
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!supportsHover) return;

    let currentElement: HTMLElement | null = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovering = false;
    let isScrolling = false;
    let scrollTimer: number | null = null;
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
        if (tagName === 'input' || tagName === 'textarea' || tagName === 'canvas') {
          el = el.parentElement;
          continue;
        }

        // Match only explicitly opted-in interactive cards or buttons
        if (
          el.dataset.cursorReactive === 'true' ||
          el.classList.contains('cursor-reactive') ||
          el.classList.contains('interactive-card')
        ) {
          if (el.offsetWidth >= 60 && el.offsetHeight >= 30) {
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
        currentElement.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
        currentElement = null;
      }
      isHovering = false;
    };

    const updateMotion = () => {
      if (!isHovering || !currentElement || isScrolling) return;

      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      // Subtle tilt: max ~2 degrees without translateY to keep bounding box invariant
      const tiltX = -currentY * 2.2;
      const tiltY = currentX * 2.2;

      currentElement.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
      currentElement.style.transformOrigin = 'center center';
      currentElement.style.boxShadow = '0 12px 28px -6px rgba(0, 212, 255, 0.22), 0 0 16px -2px rgba(56, 189, 248, 0.18)';
      currentElement.style.borderColor = 'rgba(56, 189, 248, 0.45)';
      currentElement.style.transition = 'transform 0.06s ease-out, box-shadow 0.2s ease, border-color 0.2s ease';

      rafId = requestAnimationFrame(updateMotion);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || isScrolling) return;

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

    const handleScroll = () => {
      isScrolling = true;
      if (currentElement) {
        resetCurrent();
      }
      if (scrollTimer) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        isScrolling = false;
      }, 120);
    };

    const handlePointerLeave = () => {
      resetCurrent();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('pointerup', handlePointerLeave, { passive: true });
    window.addEventListener('pointercancel', handlePointerLeave, { passive: true });
    window.addEventListener('blur', handlePointerLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimer) window.clearTimeout(scrollTimer);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerup', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('blur', handlePointerLeave);
      resetCurrent();
    };
  }, []);
}
