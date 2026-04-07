import { useState, useEffect, useMemo } from 'react';

interface ScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
}

export function useScrollSpy({ sectionIds, offset = 100 }: ScrollSpyOptions): string {
  const [activeId, setActiveId] = useState<string>('');

  const observer = useMemo(() => {
    if (typeof IntersectionObserver === 'undefined') {
      return null;
    }

    return new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => {
            const aTop = a.boundingClientRect.top;
            const bTop = b.boundingClientRect.top;
            return Math.abs(aTop) - Math.abs(bTop);
          });

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -50% 0px`,
        threshold: 0,
      }
    );
  }, [offset]);

  useEffect(() => {
    if (!observer) return;

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [observer, sectionIds]);

  return activeId;
}
