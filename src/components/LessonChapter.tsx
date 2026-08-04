import type { ReactNode } from 'react';
import { chapterForScreen, screens, screenIndex, type ScreenId } from '../course';
import { speakerGuides } from '../speakerGuide';
import {
  TechnicalBackdrop,
  type TechnicalBackdropVariant,
} from './TechnicalBackdrop';
import { TechTerm, type TechKey } from './TechTerm';

const technicalBackdrops: Partial<Record<ScreenId, TechnicalBackdropVariant>> = {
  'acvm-use-cases': 'flow',
  'geo-verification': 'proof',
  'btc-ledger': 'network',
  'btc-transaction': 'state',
  'btc-pow': 'proof',
  'btc-consensus': 'network',
  'consensus-anatomy': 'network',
  'consensus-pos': 'proof',
  'consensus-bft': 'network',
  'consensus-governance': 'identity',
  'eth-state': 'state',
  'eth-evm': 'flow',
  'eth-transaction': 'flow',
  'eth-boundary': 'identity',
  'ai-gap': 'fog',
  'acvm-execution-boundary': 'flow',
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
  connection,
  storyAct,
  storyQuestion,
}: Omit<LessonChapterProps, 'id' | 'className' | 'figureLabel' | 'visual' | 'children'> & {
  index: number;
  connection: string;
  storyAct: string;
  storyQuestion: string;
}) {
  return (
    <header className="section-heading">
      <div className="section-meta">
        <span className="section-eyebrow"><i /> {eyebrow}</span>
        <span className="chapter-progress" aria-label={`第 ${index} 章，共 ${screens.length - 1} 章`}>
          CH {String(index).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}
        </span>
      </div>
      <div className="story-question"><small>{storyAct}</small><span>{storyQuestion}</span></div>
      <h2>{title}<br /><em>{accent}</em></h2>
      <p>{body}</p>
      <div className="acvm-connection">
        <small>落到 ACVM</small>
        <span>{connection}</span>
      </div>
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
  const guide = speakerGuides[id];

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
          connection={guide.connection}
          storyAct={chapter.act}
          storyQuestion={chapter.question}
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
