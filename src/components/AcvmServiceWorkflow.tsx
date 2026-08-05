import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const workflowStages = [
  {
    code: '01',
    title: '签署授权',
    actor: 'AP2 / 需求方',
    solution: 'Intent 或 Cart Mandate 固定主体与支付授权；ACVM 再补充结果目标、验收门槛和截止时间。',
    record: 'mandateHash · SignedDemand',
    icon: 'key',
  },
  {
    code: '02',
    title: '找到服务',
    actor: 'ANS',
    solution: '按名称解析 Agent 的身份、能力、价格、信誉和 Validator 集。',
    record: 'ANSRecord',
    icon: 'fingerprint',
  },
  {
    code: '03',
    title: '冻结规则',
    actor: 'Agentic Contract',
    solution: '为任务生成 taskId，锁定权限、预算、验收办法、挑战期和结算条件。',
    record: 'contractRoot · taskId',
    icon: 'terminal',
  },
  {
    code: '04',
    title: '执行任务',
    actor: 'A3S',
    solution: 'Flow 持久化步骤，Runtime 管生命周期，Box / Power 执行并出具回执，Sentry 施加安全策略。',
    record: 'flowRoot · ExecReceipt',
    icon: 'brain',
  },
  {
    code: '05',
    title: '裁决结果',
    actor: 'ACVM Validator',
    solution: '把 A3S 运行回执与业务证据分开检查；按事前规则通过、拒绝或进入挑战期。',
    record: 'Verdict · Challenge',
    icon: 'shield',
  },
  {
    code: '06',
    title: '结算 / 可选记账',
    actor: '底层链 / AVS',
    solution: '终局裁决触发结果付款；只有开放网络需要跨任务贡献权重时，才从同一裁决派生 PoI。',
    record: 'Settlement · PoI?',
    icon: 'receipt',
  },
] as const satisfies readonly {
  code: string;
  title: string;
  actor: string;
  solution: string;
  record: string;
  icon: IconName;
}[];

const diagramLines = [
  { stage: 0, text: '[ AP2 / 需求方 ] ── Mandate + 结果条件' },
  { stage: 0, text: '    │  mandateHash + SignedDemand' },
  { stage: 1, text: '    ▼' },
  { stage: 1, text: '[  ANS  ] ── 能力 / 价格 / 信誉 ──▶ [ 服务 Agent ]' },
  { stage: 2, text: '    │' },
  { stage: 2, text: '    ▼' },
  { stage: 2, text: '[ Agentic Contract ] ── taskId / 权限 / 验收 / 结算' },
  { stage: 3, text: '    │' },
  { stage: 3, text: '    ▼' },
  { stage: 3, text: '[ A3S ]  Flow / Runtime / Box / Power / Sentry' },
  { stage: 3, text: '    └── 执行任务 ──▶ [ ExecReceipt + Evidence ]' },
  { stage: 4, text: '    │' },
  { stage: 4, text: '    ▼' },
  { stage: 4, text: '[ ACVM Validator ] ── 业务验收 / 挑战' },
  { stage: 5, text: '    ├──▶ [ 结果结算 ]  现有链 / 支付系统' },
  { stage: 5, text: '    └──▶ [ PoI? ]  仅开放贡献网络启用' },
] as const;

export function AcvmServiceWorkflowArchitecture() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const current = workflowStages[activeStage];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveStage((stage) => (stage + 1) % workflowStages.length), 2200);
    return () => window.clearInterval(timer);
  }, [playing, visible]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setPlaying(false);
  };

  return (
    <div ref={panelRef} className={`acvm-service-workflow ${playing ? 'is-playing' : 'is-paused'}`}>
      <LearningPanel code="ACVM / ONE ORDER, ONE TASK ID" status="RESULT FIRST" className="acvm-workflow-panel">
        <header className="acvm-workflow-current" aria-live="polite">
          <span><b>{current.code}</b><Icon name={current.icon} /></span>
          <div><small>{current.actor}</small><strong>{current.title}</strong></div>
          <p>{current.solution}</p>
          <code>{current.record}</code>
          <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? '暂停 ACVM 服务流程动画' : '继续 ACVM 服务流程动画'}>
            <Icon name={playing ? 'pause' : 'play'} />{playing ? '暂停' : '播放'}
          </button>
        </header>

        <div className="acvm-workflow-body">
          <pre aria-label="从需求、ANS 解析、智能体合约、雾计算、验收到结算和 PoI 的 ACVM 流程图">
            {diagramLines.map((line, index) => (
              <span className={line.stage === activeStage ? 'is-active' : line.stage < activeStage ? 'is-past' : ''} key={`${line.stage}-${index}`}>{line.text}{'\n'}</span>
            ))}
          </pre>
          <aside>
            <small>ACVM 当场解决什么</small>
            <strong>{current.solution}</strong>
            <span><Icon name="receipt" /> 链上记录：<code>{current.record}</code></span>
          </aside>
        </div>

        <nav className="acvm-workflow-nav" aria-label="选择 ACVM 服务流程步骤">
          {workflowStages.map((stage, index) => (
            <button type="button" className={activeStage === index ? 'is-active' : ''} aria-pressed={activeStage === index} onClick={() => selectStage(index)} key={stage.code}>
              <span>{stage.code}</span><strong>{stage.title}</strong>
            </button>
          ))}
        </nav>

        <footer><Icon name="spark" /><strong>AP2 管授权 · A3S 管执行 · ACVM 管裁决 · 现有基础设施管终局。</strong></footer>
      </LearningPanel>
    </div>
  );
}
