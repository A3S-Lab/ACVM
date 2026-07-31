import { createPortal } from 'react-dom';
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type DetailRow = {
  label: string;
  value: string;
};

type Placement = {
  top: number;
  left: number;
  ready: boolean;
  side: 'top' | 'bottom' | 'sheet';
};

export function DetailHint({
  label,
  title,
  summary,
  details = [],
  category = '技术细节',
  className = '',
}: {
  label: ReactNode;
  title: string;
  summary: string;
  details?: readonly DetailRow[];
  category?: string;
  className?: string;
}) {
  const tooltipId = useId();
  const targetRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [placement, setPlacement] = useState<Placement>({ top: -9999, left: -9999, ready: false, side: 'top' });

  useLayoutEffect(() => {
    if (!open) return undefined;

    const place = () => {
      const target = targetRef.current;
      const tooltip = tooltipRef.current;
      if (!target || !tooltip) return;

      const targetRect = target.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const edge = 12;
      const gap = 10;
      const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 0;
      const topEdge = headerHeight + 10;

      if (viewportWidth <= 520) {
        setPlacement({
          top: Math.max(16, viewportHeight - tooltipRect.height - 16),
          left: 16,
          ready: true,
          side: 'sheet',
        });
        return;
      }

      const left = Math.min(
        viewportWidth - tooltipRect.width - edge,
        Math.max(edge, targetRect.left + targetRect.width / 2 - tooltipRect.width / 2),
      );
      const fitsAbove = targetRect.top >= tooltipRect.height + gap + topEdge;
      const top = fitsAbove
        ? targetRect.top - tooltipRect.height - gap
        : Math.min(viewportHeight - tooltipRect.height - edge, targetRect.bottom + gap);

      setPlacement({ top: Math.max(topEdge, top), left, ready: true, side: fitsAbove ? 'top' : 'bottom' });
    };

    const frame = window.requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!pinned) return undefined;
    const closeOutside = (event: PointerEvent) => {
      if (!targetRef.current?.contains(event.target as Node)) {
        setPinned(false);
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', closeOutside);
    return () => document.removeEventListener('pointerdown', closeOutside);
  }, [pinned]);

  const closeIfTransient = () => {
    if (!pinned) setOpen(false);
  };

  const togglePinned = () => {
    setPinned((current) => {
      const next = !current;
      setOpen(next);
      return next;
    });
  };

  const tooltipStyle = {
    top: placement.top,
    left: placement.left,
    visibility: placement.ready ? 'visible' : 'hidden',
  } as CSSProperties;

  return (
    <>
      <span
        className={`detail-hint ${className}`.trim()}
        ref={targetRef}
        role="button"
        tabIndex={0}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={closeIfTransient}
        onFocus={() => setOpen(true)}
        onBlur={closeIfTransient}
        onClick={togglePinned}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setPinned(false);
            setOpen(false);
          } else if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            togglePinned();
          }
        }}
      >
        {label}
      </span>
      {open && typeof document !== 'undefined' ? createPortal(
        <span
          className="detail-tooltip"
          data-side={placement.side}
          id={tooltipId}
          ref={tooltipRef}
          role="tooltip"
          style={tooltipStyle}
        >
          <small>{category}</small>
          <strong>{title}</strong>
          <p>{summary}</p>
          {details.length > 0 ? (
            <dl>
              {details.map((detail) => (
                <div key={detail.label}>
                  <dt>{detail.label}</dt>
                  <dd>{detail.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <i aria-hidden="true" />
        </span>,
        document.body,
      ) : null}
    </>
  );
}
