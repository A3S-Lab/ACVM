import type { ReactNode } from 'react';
import { screens } from '../course';
import { Icon, LogoMark } from './Icons';
import { DataChip, FlowArrow, LearningPanel } from './LearningPanel';

const storyMoves = [
  {
    className: 'is-case',
    index: '00',
    name: '两个案件',
    summary: '先问：凭什么付款',
    icon: <Icon name="receipt" />,
    chips: ['GEO', '社会模拟'],
    tone: 'green',
  },
  {
    className: 'is-ledger',
    index: '01',
    name: '共享账本',
    summary: '合法记录 → 共同历史',
    icon: <Icon name="key" />,
    chips: ['授权', '排序', '终局'],
    tone: 'amber',
  },
  {
    className: 'is-vm',
    index: '02',
    name: '合约虚拟机',
    summary: '程序 → 可验证状态',
    icon: <Icon name="terminal" />,
    chips: ['重放', 'Gas', '边界'],
    tone: 'blue',
  },
  {
    className: 'is-acvm',
    index: '03',
    name: 'ACVM',
    summary: '链下任务 → 最终回执',
    icon: <LogoMark />,
    chips: ['验收', '争议', '结算'],
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

const transitions = ['需要共同事实', '从记录扩展到程序', 'AI 无法重放'] as const;

export function CourseJourney() {
  return (
    <LearningPanel code="STORY / FROM A PAYMENT QUESTION TO ACVM" status={`${screens.length - 1} SLIDES`} className="course-journey">
      <div className="journey-question">
        <small>全场只追问这一件事</small>
        <strong>Agent 完成链外工作后，凭什么改变共享状态并获得付款？</strong>
      </div>
      <div className="journey-track" tabIndex={0} aria-label="从业务案件到 ACVM 解法的四幕故事；窄屏可横向滚动">
        {storyMoves.map((move, index) => (
          <div className="journey-segment" key={move.name}>
            <article className={`journey-era ${move.className}`}>
              <header><span>{move.index}</span>{move.icon}</header>
              <small>{move.summary}</small>
              <strong>{move.name}</strong>
              <div>{move.chips.map((chip) => <DataChip tone={move.tone} key={chip}>{chip}</DataChip>)}</div>
            </article>
            {index < storyMoves.length - 1 ? <FlowArrow label={transitions[index]} /> : null}
          </div>
        ))}
      </div>
      <footer className="journey-invariant">
        <Icon name="shield" />
        <span><small>最后得到的答案</small><strong>不重放 AI 的全部工作；冻结验收规则，验证证据，再结算责任</strong></span>
        <code>RULE → WORK → EVIDENCE → FINALITY → PAY</code>
      </footer>
    </LearningPanel>
  );
}
