import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { screens, screenIndex } from '../course';
import {
  TechnicalBackdrop,
  type TechnicalBackdropVariant,
} from './TechnicalBackdrop';
import { TechTerm, type TechKey } from './TechTerm';

const technicalBackdrops: Record<string, TechnicalBackdropVariant> = {
  'btc-ledger': 'network',
  'btc-transaction': 'state',
  'btc-pow': 'proof',
  'btc-consensus': 'network',
  'eth-state': 'state',
  'eth-evm': 'flow',
  'eth-transaction': 'flow',
  'eth-boundary': 'identity',
  'ai-gap': 'fog',
  'ai-execution': 'flow',
  'ai-verification': 'proof',
  'agentic-bridge': 'state',
  lifecycle: 'flow',
  runtime: 'flow',
  onchain: 'flow',
  'spec-contract': 'state',
  'code-walkthrough': 'state',
  'spec-state': 'state',
  'spec-receipt': 'state',
  dispute: 'proof',
  properties: 'proof',
  identity: 'identity',
  ans: 'network',
  composition: 'network',
  simulation: 'network',
  offchain: 'identity',
  privacy: 'fog',
  fog: 'fog',
  sentry: 'fog',
  proof: 'proof',
  intelligence: 'proof',
  'spec-poi': 'proof',
  chains: 'chains',
  stories: 'network',
};

export type MechanismComparison = {
  traditionalTitle: string;
  traditional: string;
  acvmTitle: string;
  acvm: string;
  traditionalLabel?: string;
  acvmLabel?: string;
};

export type LessonChapterProps = {
  id: string;
  className: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  comparison?: MechanismComparison;
  terms?: TechKey[];
  figureLabel?: string;
  visual: ReactNode;
  children?: ReactNode;
};

function MechanismCompare({
  traditionalTitle,
  traditional,
  acvmTitle,
  acvm,
  traditionalLabel = '传统机制',
  acvmLabel = 'ACVM',
}: MechanismComparison) {
  return (
    <div className="mechanism-compare" aria-label={`${traditionalLabel}与${acvmLabel}对比`}>
      <section className="is-traditional">
        <header><b aria-hidden="true">×</b><small>{traditionalLabel}</small></header>
        <h3>{traditionalTitle}</h3>
        <p>{traditional}</p>
      </section>
      <i aria-hidden="true" />
      <section className="is-acvm">
        <header><b aria-hidden="true">✓</b><small>{acvmLabel}</small></header>
        <h3>{acvmTitle}</h3>
        <p>{acvm}</p>
      </section>
    </div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms = [],
}: Omit<LessonChapterProps, 'id' | 'className' | 'figureLabel' | 'visual' | 'children'> & { index: number }) {
  return (
    <header className="section-heading">
      <div className="section-meta">
        <span className="section-eyebrow"><i /> {eyebrow}</span>
        <span className="chapter-progress" aria-label={`第 ${index} 章，共 ${screens.length - 1} 章`}>
          CH {String(index).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}
        </span>
      </div>
      <h2>{title}<br /><em>{accent}</em></h2>
      <p>{body}</p>
      {comparison ? <MechanismCompare {...comparison} /> : null}
      {terms.length > 0 ? (
        <div className="section-terms">
          {terms.map((term) => <TechTerm term={term} key={term} />)}
        </div>
      ) : null}
    </header>
  );
}

export function LessonChapter({
  id,
  className,
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms,
  figureLabel = 'ACVM TECHNICAL ARCHITECTURE / REV. 01',
  visual,
  children,
}: LessonChapterProps) {
  const index = screenIndex(id);
  const [view, setView] = useState<'diagram' | 'lesson'>('diagram');
  const tabsId = useId();
  const hasLesson = Boolean(children);
  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const nextView = event.key === 'ArrowRight' ? 'lesson' : 'diagram';
    setView(nextView);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs?.[nextView === 'diagram' ? 0 : 1]?.focus();
  };

  return (
    <section className={`screen technical-screen ${className}`} id={id} data-screen={index}>
      <TechnicalBackdrop variant={technicalBackdrops[id] ?? 'flow'} />
      <div className="screen-inner technical-layout">
        <SectionHeading
          index={index}
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          body={body}
          comparison={comparison}
          terms={terms}
        />
        <div className={`technical-visual lesson-stage is-${view}`}>
          {hasLesson ? (
            <div className="lesson-view-switcher" role="tablist" aria-label={`${title}内容视图`}>
              <button
                id={`${tabsId}-diagram-tab`}
                type="button"
                role="tab"
                aria-selected={view === 'diagram'}
                aria-controls={`${tabsId}-diagram`}
                onClick={() => setView('diagram')}
                onKeyDown={handleTabKey}
              >图解</button>
              <button
                id={`${tabsId}-lesson-tab`}
                type="button"
                role="tab"
                aria-selected={view === 'lesson'}
                aria-controls={`${tabsId}-lesson`}
                onClick={() => setView('lesson')}
                onKeyDown={handleTabKey}
              >深读 · 代码</button>
            </div>
          ) : null}
          <div
            id={`${tabsId}-diagram`}
            className="lesson-diagram"
            role={hasLesson ? 'tabpanel' : undefined}
            aria-labelledby={hasLesson ? `${tabsId}-diagram-tab` : undefined}
            hidden={view !== 'diagram'}
          >
            {view === 'diagram' ? visual : null}
          </div>
          {hasLesson ? (
            <article
              id={`${tabsId}-lesson`}
              className="lesson-reading"
              role="tabpanel"
              aria-labelledby={`${tabsId}-lesson-tab`}
              hidden={view !== 'lesson'}
              tabIndex={view === 'lesson' ? 0 : -1}
            >
              <div className="lesson-reading__inner">{view === 'lesson' ? children : null}</div>
            </article>
          ) : null}
          <div className="figure-caption" aria-hidden="true">
            <span>FIG. {String(index).padStart(2, '0')}</span><i /><span>{figureLabel}</span>
          </div>
        </div>
      </div>
      <span className="screen-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
    </section>
  );
}
