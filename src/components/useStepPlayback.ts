import { useEffect, useRef, useState } from 'react';

export function useStepPlayback(length: number, interval = 2400) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => (
    typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ));
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.28 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible) return undefined;
    const timer = window.setInterval(
      () => setActiveStep((current) => (current + 1) % length),
      interval,
    );
    return () => window.clearInterval(timer);
  }, [interval, isPlaying, isVisible, length]);

  function selectStep(index: number) {
    setActiveStep(index);
    setIsPlaying(false);
  }

  return {
    rootRef,
    activeStep,
    isPlaying,
    selectStep,
    togglePlayback: () => setIsPlaying((current) => !current),
  };
}
