import type { ReactNode } from 'react';

export function LearningPanel({
  code,
  status,
  className = '',
  children,
}: {
  code: string;
  status: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`diagram-panel learning-panel ${className}`}>
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>{code}</code>
        <strong><i /> {status}</strong>
      </header>
      {children}
    </div>
  );
}

export function FlowArrow({ label }: { label?: string }) {
  return (
    <div className="learning-arrow" aria-hidden="true">
      {label ? <small>{label}</small> : null}
      <i />
      <b>›</b>
    </div>
  );
}

export function DataChip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'blue' | 'violet' | 'green' | 'amber' | 'red' }) {
  return <span className={`data-chip is-${tone}`}>{children}</span>;
}

export function StepBadge({ index, children }: { index: string; children: ReactNode }) {
  return (
    <span className="step-badge">
      <b>{index}</b>
      <span>{children}</span>
    </span>
  );
}
