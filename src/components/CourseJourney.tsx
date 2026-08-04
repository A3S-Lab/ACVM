import type { ReactNode } from 'react';
import { Icon, LogoMark } from './Icons';
import { DataChip, FlowArrow, LearningPanel } from './LearningPanel';

const storyMoves = [
  {
    className: 'is-call',
    index: '00',
    name: '按调用付费',
    summary: '请求成功 → 产生账单',
    icon: <Icon name="receipt" />,
    chips: ['请求', 'Token', '算力'],
    tone: 'amber',
  },
  {
    className: 'is-gap',
    index: '01',
    name: '结果缺口',
    summary: '调用完成 ≠ 结果达标',
    icon: <Icon name="eye" />,
    chips: ['自报', '争议', '责任'],
    tone: 'red',
  },
  {
    className: 'is-trust',
    index: '02',
    name: '可验证条件',
    summary: '规则 + 证据 → 共同判定',
    icon: <Icon name="shield" />,
    chips: ['授权', '验收', '终局'],
    tone: 'blue',
  },
  {
    className: 'is-acvm',
    index: '03',
    name: 'ACVM',
    summary: '已验证结果 → 释放付款',
    icon: <LogoMark />,
    chips: ['Intent', '挑战', '结算'],
    tone: 'violet',
  },
] as const satisfies readonly {
  className: string;
  index: string;
  name: string;
  summary: string;
  icon: ReactNode;
  chips: readonly string[];
  tone?: 'amber' | 'blue' | 'green' | 'red' | 'violet';
}[];

const transitions = ['买方要的是结果', '需要共同判定', '把判定写成协议'] as const;

export function CourseJourney() {
  return (
    <LearningPanel code="CALL-BASED → OUTCOME-BASED" status="VERIFY BEFORE PAY" className="course-journey">
      <div className="journey-question">
        <small>结算单位发生变化</small>
        <strong>客户真正购买的是一次调用，还是一个达到标准的结果？</strong>
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
        <span><small>ACVM 的位置</small><strong>把链下结果变成可验证、可争议、可终局的付款条件</strong></span>
        <code>USAGE = COST METER · VERIFIED OUTCOME = PAYMENT TRIGGER</code>
      </footer>
    </LearningPanel>
  );
}
