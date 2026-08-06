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

export type DerivationStep = {
  expression: string;
  explanation: string;
};

export type ProofDerivation = {
  formula: string;
  symbols: readonly DetailRow[];
  steps: readonly DerivationStep[];
  verifier: string;
  validity: string;
  assumptions?: string;
};

type Placement = {
  top: number;
  left: number;
  arrowLeft: number;
  ready: boolean;
  side: 'top' | 'bottom' | 'sheet';
};

export function DetailHint({
  label,
  title,
  summary,
  details = [],
  derivation,
  category = '技术细节',
  className = '',
}: {
  label: ReactNode;
  title: string;
  summary: string;
  details?: readonly DetailRow[];
  derivation?: ProofDerivation;
  category?: string;
  className?: string;
}) {
  const tooltipId = useId();
  const targetRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [portalRoot, setPortalRoot] = useState<Element | null>(() => (
    typeof document !== 'undefined' ? (document.fullscreenElement ?? document.body) : null
  ));
  const [placement, setPlacement] = useState<Placement>({ top: -9999, left: -9999, arrowLeft: 0, ready: false, side: 'top' });

  useEffect(() => {
    const updatePortalRoot = () => setPortalRoot(document.fullscreenElement ?? document.body);
    updatePortalRoot();
    document.addEventListener('fullscreenchange', updatePortalRoot);
    return () => document.removeEventListener('fullscreenchange', updatePortalRoot);
  }, []);

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
          arrowLeft: 0,
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
      const arrowLeft = Math.min(
        tooltipRect.width - 16,
        Math.max(16, targetRect.left + targetRect.width / 2 - left),
      );

      setPlacement({ top: Math.max(topEdge, top), left, arrowLeft, ready: true, side: fitsAbove ? 'top' : 'bottom' });
    };

    const frame = window.requestAnimationFrame(place);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, portalRoot]);

  useEffect(() => {
    if (!pinned) return undefined;
    const closeOutside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!targetRef.current?.contains(target) && !tooltipRef.current?.contains(target)) {
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
    '--tooltip-arrow-left': `${placement.arrowLeft}px`,
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
      {open && portalRoot ? createPortal(
        <aside
          className="detail-tooltip"
          data-side={placement.side}
          data-pinned={pinned}
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
          {derivation ? (
            <section className="detail-derivation">
              <header><small>FIRST-PRINCIPLES DERIVATION</small><span>点击固定后可滚动</span></header>
              <code className="detail-formula">{derivation.formula}</code>
              <dl className="detail-symbols">
                {derivation.symbols.map((symbol) => (
                  <div key={symbol.label}><dt>{symbol.label}</dt><dd>{symbol.value}</dd></div>
                ))}
              </dl>
              <ol>
                {derivation.steps.map((step, index) => (
                  <li key={`${index}-${step.expression}`}>
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <div><code>{step.expression}</code><p>{step.explanation}</p></div>
                  </li>
                ))}
              </ol>
              <div className="detail-verifier">
                <small>VALID IFF</small>
                <code>{derivation.verifier}</code>
                <p>{derivation.validity}</p>
              </div>
              {derivation.assumptions ? <p className="detail-assumptions"><b>前提：</b>{derivation.assumptions}</p> : null}
            </section>
          ) : null}
          <i aria-hidden="true" />
        </aside>,
        portalRoot,
      ) : null}
    </>
  );
}
