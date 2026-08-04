import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const workflowStages = [
  {
    code: '01',
    title: '写清结果',
    actor: '需求方',
    solution: '签名目标、验收门槛、预算和截止时间。调用量只用于限额，不触发付款。',
    record: 'SignedDemand',
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
    title: '就近推理',
    actor: 'Fog Worker',
    solution: '模型在靠近数据的节点运行；原始数据留在本地，只提交回执和证明。',
    record: 'ExecReceipt · Proof',
    icon: 'brain',
  },
  {
    code: '05',
    title: '独立验收',
    actor: 'Validator',
    solution: '按事前规则检查结果和证据；有异议就进入挑战期，不提前放款。',
    record: 'Verdict · Challenge',
    icon: 'shield',
  },
  {
    code: '06',
    title: '付款与记账',
    actor: 'ACVM',
    solution: '验收终局后释放结果费；同一份有效推理生成 PoI，进入有上限的提议权重。',
    record: 'Settlement · ValidPoI',
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
  { stage: 0, text: '[ 需求方 ]' },
  { stage: 0, text: '    │  结果门槛 + 预算 + 截止时间' },
  { stage: 1, text: '    ▼' },
  { stage: 1, text: '[  ANS  ] ── 能力 / 价格 / 信誉 ──▶ [ 服务 Agent ]' },
  { stage: 2, text: '    │' },
  { stage: 2, text: '    ▼' },
  { stage: 2, text: '[ Agentic Contract ] ── taskId / 权限 / 验收 / 结算' },
  { stage: 3, text: '    │' },
  { stage: 3, text: '    ▼' },
  { stage: 3, text: '[ Fog Worker ] ── 模型推理 ──▶ [ Receipt + Proof ]' },
  { stage: 4, text: '    │' },
  { stage: 4, text: '    ▼' },
  { stage: 4, text: '[ Validator ] ── 验收 / 挑战' },
  { stage: 5, text: '    ├──▶ [ 结果结算 ]  客户按已验证结果付费' },
  { stage: 5, text: '    └──▶ [ Valid PoI ] ─▶ 权重 ─▶ VRF ─▶ BFT 终局' },
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

        <footer><Icon name="spark" /><strong>一份推理先交付客户结果；验收通过后，才进入付款和 PoI。</strong></footer>
      </LearningPanel>
    </div>
  );
}
