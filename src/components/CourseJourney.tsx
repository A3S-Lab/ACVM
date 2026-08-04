import type { ReactNode } from 'react';
import { screens } from '../course';
import { Icon, LogoMark } from './Icons';
import { DataChip, FlowArrow, LearningPanel } from './LearningPanel';

const eras = [
  {
    className: 'is-bitcoin',
    index: '01',
    name: 'Bitcoin',
    summary: '所有权历史',
    icon: <Icon name="key" />,
    chips: ['UTXO', 'PoW', '确认'],
    tone: 'amber',
  },
  {
    className: 'is-ethereum',
    index: '02',
    name: 'Ethereum',
    summary: '程序状态',
    icon: <Icon name="terminal" />,
    chips: ['账户', 'EVM', 'Gas'],
    tone: 'blue',
  },
  {
    className: 'is-ai',
    index: '03',
    name: 'AI × Chain',
    summary: '链下工作证据',
    icon: <Icon name="brain" />,
    chips: ['Intent', 'Worker', '证据'],
    tone: 'green',
  },
  {
    className: 'is-acvm',
    index: '04',
    name: 'ACVM',
    summary: '任务状态与结算',
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

const transitions = ['交易排序', '外部计算', '任务协议'] as const;

export function CourseJourney() {
  return (
    <LearningPanel code="COURSE / EVOLUTION OF VERIFIABLE COMPUTATION" status={`${screens.length - 1} SLIDES`} className="course-journey">
      <div className="journey-question">
        <small>共识检查</small>
        <strong>一条结果满足哪些条件，才能写入共享状态？</strong>
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
        <span><small>中心主旨</small><strong>区块链扩展的是可验证状态，不是把所有计算塞进共识</strong></span>
        <code>EVIDENCE → STATE → SETTLEMENT</code>
      </footer>
    </LearningPanel>
  );
}
