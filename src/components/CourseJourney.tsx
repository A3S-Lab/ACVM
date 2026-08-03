import type { ReactNode } from 'react';
import { Icon, LogoMark } from './Icons';
import { DataChip, FlowArrow, LearningPanel } from './LearningPanel';

const eras = [
  {
    className: 'is-bitcoin',
    index: '01',
    name: 'Bitcoin',
    summary: '可信账本',
    icon: <Icon name="key" />,
    chips: ['UTXO', 'PoW', '确认'],
    tone: 'amber',
  },
  {
    className: 'is-ethereum',
    index: '02',
    name: 'Ethereum',
    summary: '可编程状态机',
    icon: <Icon name="terminal" />,
    chips: ['账户', 'EVM', 'Gas'],
    tone: 'blue',
  },
  {
    className: 'is-ai',
    index: '03',
    name: 'AI × Chain',
    summary: '可验证链下工作',
    icon: <Icon name="brain" />,
    chips: ['Intent', 'Worker', '证据'],
    tone: 'green',
  },
  {
    className: 'is-acvm',
    index: '04',
    name: 'ACVM',
    summary: '可验证智能执行',
    icon: <LogoMark />,
    chips: ['Agent', '回执', '证明'],
    tone: 'violet',
  },
] as const satisfies readonly {
  className: string;
  index: string;
  name: string;
  summary: string;
  icon: ReactNode;
  chips: readonly string[];
  tone?: 'amber' | 'blue' | 'green' | 'violet';
}[];

const transitions = ['账本 → 程序', '同步 → 链下', '证据 → 协议'] as const;

export function CourseJourney() {
  return (
    <LearningPanel code="COURSE / EVOLUTION OF VERIFIABLE COMPUTATION" status="34 CHAPTERS" className="course-journey">
      <div className="journey-question">
        <small>贯穿全课的问题</small>
        <strong>不信任执行者，网络为什么仍能接受结果？</strong>
      </div>
      <div className="journey-track" tabIndex={0} aria-label="四阶段课程地图；窄屏可横向滚动">
        {eras.map((era, index) => (
          <div className="journey-segment" key={era.name}>
            <article className={`journey-era ${era.className}`}>
              <header><span>{era.index}</span>{era.icon}</header>
              <small>{era.summary}</small>
              <strong>{era.name}</strong>
              <div>{era.chips.map((chip) => <DataChip tone={era.tone} key={chip}>{chip}</DataChip>)}</div>
            </article>
            {index < eras.length - 1 ? <FlowArrow label={transitions[index]} /> : null}
          </div>
        ))}
      </div>
      <footer className="journey-invariant">
        <Icon name="shield" />
        <span><small>始终不变</small><strong>链上共识只接受可确定验证的状态转换</strong></span>
        <code>VERIFY → COMMIT → SETTLE</code>
      </footer>
    </LearningPanel>
  );
}
