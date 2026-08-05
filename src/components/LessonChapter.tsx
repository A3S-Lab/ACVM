import type { ReactNode } from 'react';
import { chapterForScreen, screens, screenIndex, type ScreenId } from '../deck';
import {
  TechnicalBackdrop,
  type TechnicalBackdropVariant,
} from './TechnicalBackdrop';
import { TechTerm, type TechKey } from './TechTerm';

const technicalBackdrops: Partial<Record<ScreenId, TechnicalBackdropVariant>> = {
  'product-thesis': 'flow',
  'product-snapshot': 'flow',
  'geo-verification': 'proof',
  simulation: 'network',
  'geo-poi-boundary': 'proof',
  'useful-work': 'proof',
  'execution-boundary': 'flow',
  'system-architecture': 'flow',
  ans: 'network',
  'agentic-contract': 'state',
  'fog-inference': 'fog',
  'poi-proof': 'proof',
  'poi-consensus': 'network',
  'verification-engine': 'proof',
  'deployment-modes': 'chains',
  'security-boundaries': 'proof',
  'economy-roles': 'network',
  'product-roadmap': 'state',
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
  id: ScreenId;
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
    <div
      className="mechanism-compare"
      aria-label={`${traditionalLabel}：${traditionalTitle}，${traditional}。${acvmLabel}：${acvmTitle}，${acvm}。`}
    >
      <section className="is-traditional">
        <header><b aria-hidden="true">×</b><small>{traditionalLabel}</small></header>
        <h3>{traditionalTitle}</h3>
      </section>
      <i aria-hidden="true" />
      <section className="is-acvm">
        <header><b aria-hidden="true">✓</b><small>{acvmLabel}</small></header>
        <h3>{acvmTitle}</h3>
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
        <span className="chapter-progress" aria-label={`第 ${index} 页，共 ${screens.length - 1} 页`}>
          SLIDE {String(index).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}
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
}: LessonChapterProps) {
  const index = screenIndex(id);
  const chapter = chapterForScreen(id);

  return (
    <section
      className={`screen technical-screen ${className}`}
      id={id}
      data-screen={index}
      data-chapter={chapter.key}
    >
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
        <div className="technical-visual lesson-stage">
          <div className="lesson-diagram">{visual}</div>
          <div className="figure-caption" aria-hidden="true">
            <span>FIG. {String(index).padStart(2, '0')}</span><i /><span>{figureLabel}</span>
          </div>
        </div>
      </div>
      <span className="screen-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
    </section>
  );
}
