import { useEffect, useRef } from 'react';

type Ripple = {
  bornAt: number;
  x: number;
  y: number;
};

export function AmbientGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const context = canvas?.getContext('2d');
    if (!canvas || !host || !context) return;
    const drawingContext = context;

    const cell = 42;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 1;
    let height = 1;
    let ratio = 1;
    let frame = 0;
    let visible = true;
    let pointer = { x: -200, y: -200 };
    let ripples: Ripple[] = [];

    const schedule = () => {
      if (!frame && visible) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const bounds = host.getBoundingClientRect();
      width = Math.max(bounds.width, 1);
      height = Math.max(bounds.height, 1);
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      schedule();
    };

    function draw(now: number) {
      frame = 0;
      drawingContext.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawingContext.clearRect(0, 0, width, height);
      ripples = reduceMotion.matches
        ? []
        : ripples.filter((ripple) => now - ripple.bornAt < 1700);

      const columns = Math.ceil(width / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const x = column * cell;
          const y = row * cell;
          const cx = x + cell / 2;
          const cy = y + cell / 2;
          const pointerGlow = Math.exp(-Math.hypot(cx - pointer.x, cy - pointer.y) / 92);
          let waveGlow = 0;

          for (const ripple of ripples) {
            const progress = (now - ripple.bornAt) / 1700;
            const ringRadius = progress * Math.max(width, height) * 0.48;
            const distance = Math.hypot(cx - ripple.x, cy - ripple.y);
            waveGlow = Math.max(
              waveGlow,
              Math.exp(-Math.pow((distance - ringRadius) / 48, 2)) *
                (1 - progress),
            );
          }

          const glow = Math.min(pointerGlow * 0.72 + waveGlow, 1);
          const inset = 5 - glow * 1.8;
          drawingContext.fillStyle = `rgba(111, 166, 255, ${0.006 + glow * 0.035})`;
          drawingContext.fillRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
          drawingContext.strokeStyle = `rgba(120, 175, 255, ${0.035 + glow * 0.16})`;
          drawingContext.lineWidth = 1;
          drawingContext.strokeRect(x + inset, y + inset, cell - inset * 2, cell - inset * 2);
        }
      }

      if (ripples.length) schedule();
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || reduceMotion.matches) return;
      const bounds = host.getBoundingClientRect();
      pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
      schedule();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (reduceMotion.matches) return;
      const bounds = host.getBoundingClientRect();
      ripples = [
        ...ripples.slice(-2),
        { bornAt: performance.now(), x: event.clientX - bounds.left, y: event.clientY - bounds.top },
      ];
      schedule();
    };

    const onPointerLeave = () => {
      pointer = { x: -200, y: -200 };
      schedule();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) schedule();
    });

    resizeObserver.observe(host);
    intersectionObserver.observe(canvas);
    host.addEventListener('pointermove', onPointerMove);
    host.addEventListener('pointerdown', onPointerDown);
    host.addEventListener('pointerleave', onPointerLeave);
    reduceMotion.addEventListener('change', schedule);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      host.removeEventListener('pointermove', onPointerMove);
      host.removeEventListener('pointerdown', onPointerDown);
      host.removeEventListener('pointerleave', onPointerLeave);
      reduceMotion.removeEventListener('change', schedule);
    };
  }, []);

  return <canvas aria-hidden="true" className="ambient-grid" ref={canvasRef} />;
}
