import type { ReactNode } from 'react';
import { chapterForScreen, screenIndex, type ScreenId } from '../deck';
import {
  TechnicalBackdrop,
  type TechnicalBackdropVariant,
} from './TechnicalBackdrop';
import { TechTerm, type TechKey } from './TechTerm';

const technicalBackdrops: Partial<Record<ScreenId, TechnicalBackdropVariant>> = {
  'product-snapshot': 'flow',
  'geo-verification': 'proof',
  'data-space': 'network',
  simulation: 'network',
  'useful-work': 'proof',
  'poi-consensus': 'proof',
  ans: 'network',
  'fog-inference': 'fog',
  'execution-boundary': 'flow',
  'a3s-box': 'flow',
  'a3s-power': 'fog',
  'system-architecture': 'flow',
  'poi-proof': 'proof',
  'deployment-modes': 'chains',
  'native-chain': 'chains',
  'security-boundaries': 'proof',
  'economy-roles': 'network',
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
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms = [],
}: Omit<LessonChapterProps, 'id' | 'className' | 'figureLabel' | 'visual' | 'children'>) {
  return (
    <header className="section-heading">
      <div className="section-meta">
        <span className="section-eyebrow"><i /> {eyebrow}</span>
      </div>
      <h2>{title}</h2>
      <p className="section-accent">{accent}</p>
      <p className="section-summary">{body}</p>
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
          eyebrow={eyebrow}
          title={title}
          accent={accent}
          body={body}
          comparison={comparison}
          terms={terms}
        />
        <div className="technical-visual lesson-stage">
          <div className="lesson-diagram">{visual}</div>
        </div>
      </div>
    </section>
  );
}
