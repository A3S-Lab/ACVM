import { useEffect, useRef, useState } from 'react';
import { Icon, type IconName } from './Icons';

type LifecycleStep = {
  code: string;
  title: string;
  actor: string;
  detail: string;
  output: string;
  icon: IconName;
  column: number;
  row: number;
  network?: boolean;
};

const lifecycleSteps: LifecycleStep[] = [
  {
    code: '01',
    title: '部署合约',
    actor: 'Worker + Validator',
    detail: '开发者同时提交 Worker 与 Validator；两个工作负载都必须能由 a3s-box 启动。',
    output: 'Workload Pair Root',
    icon: 'terminal',
    column: 1,
    row: 1,
  },
  {
    code: '02',
    title: 'P2P 广播',
    actor: '传播合约包',
    detail: '合约包先在节点间传播；每个节点独立校验哈希、签名和协议版本。',
    output: 'Verified Proposal',
    icon: 'chain',
    column: 2,
    row: 1,
    network: true,
  },
  {
    code: '03',
    title: '共识激活',
    actor: '2f+1 确认',
    detail: '验证者对同一份代码和初始状态投票，达到 2f+1 后合约正式可用。',
    output: 'Contract Root',
    icon: 'check',
    column: 3,
    row: 1,
    network: true,
  },
  {
    code: '04',
    title: '用户调用',
    actor: '提交任务意图',
    detail: '用户签名任务意图，写明输入、预算、期限以及如何验收。',
    output: 'Task Intent',
    icon: 'fingerprint',
    column: 4,
    row: 1,
  },
  {
    code: '05',
    title: 'Worker 执行',
    actor: 'a3s-box 工作负载',
    detail: 'Worker 由 a3s-box 启动；确定性逻辑进 ACVM Core，模型、API 和 TEE 任务异步完成。',
    output: 'Worker Receipt Root',
    icon: 'bolt',
    column: 5,
    row: 1,
  },
  {
    code: '06',
    title: '智能证明',
    actor: '需求 · 结果 · 回执',
    detail: '真实需求、执行结果和过程回执被绑定成一份可核验的 PoI。',
    output: 'PoI Bundle',
    icon: 'shield',
    column: 5,
    row: 2,
  },
  {
    code: '07',
    title: 'Validator 验收',
    actor: 'a3s-box 工作负载',
    detail: '独立节点用 a3s-box 启动 Validator，复核回执和结果是否满足合约验收条件。',
    output: 'Validator Receipt Root',
    icon: 'brain',
    column: 4,
    row: 2,
    network: true,
  },
  {
    code: '08',
    title: '共识确认',
    actor: '状态转换投票',
    detail: '委员会对同一状态转换投票；达到阈值后，这次执行获得终局性。',
    output: 'Quorum Certificate',
    icon: 'check',
    column: 3,
    row: 2,
    network: true,
  },
  {
    code: '09',
    title: '写入账本',
    actor: '区块 · 状态 · 回执',
    detail: '新区块写入状态根、回执根和 PoI；原始敏感数据不进入链上。',
    output: 'Finalized Block',
    icon: 'receipt',
    column: 2,
    row: 2,
  },
  {
    code: '10',
    title: 'P2P 同步',
    actor: '全网更新状态',
    detail: '最终区块广播给机构、企业和个人节点，全网收敛到同一状态。',
    output: 'Network Convergence',
    icon: 'chain',
    column: 1,
    row: 2,
    network: true,
  },
];

const connectorPaths = [
  'M108 77 H304',
  'M304 77 H500',
  'M500 77 H696',
  'M696 77 H892',
  'M892 77 C970 77 970 245 892 245',
  'M892 245 H696',
  'M696 245 H500',
  'M500 245 H304',
  'M304 245 H108',
];

const traceRoots = ['0x12…a1', '0x24…b7', '0x39…d2', '0x48…e5', '0x57…c9', '0x63…f4', '0x76…a8', '0x81…d3', '0x94…b6', '0xaf…21'];

export function LifecycleArchitecture() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const current = lifecycleSteps[activeStep];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isPlaying || !isVisible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(
      () => setActiveStep((step) => (step + 1) % lifecycleSteps.length),
      1650,
    );
    return () => window.clearInterval(timer);
  }, [isPlaying, isVisible]);

  return (
    <div className="diagram-panel lifecycle-panel" ref={panelRef} aria-label="ACVM 合约从部署到全网记账的完整生命周期动画">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ACVM / CONTRACT LIFECYCLE</code>
        <button
          type="button"
          className="lifecycle-control"
          aria-label={isPlaying ? '暂停生命周期动画' : '继续播放生命周期动画'}
          onClick={() => setIsPlaying((playing) => !playing)}
        >
          <Icon name={isPlaying ? 'pause' : 'play'} />
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>
      </header>

      <section className="lifecycle-current" aria-live="off">
        <span className="lifecycle-current-index"><small>STEP</small>{current.code}</span>
        <div>
          <small>当前发生</small>
          <h3><Icon name={current.icon} />{current.title}</h3>
          <p>{current.detail}</p>
        </div>
        <strong><small>本步链上记录</small>{current.output}</strong>
      </section>

      <div className="lifecycle-flow">
        <svg className="lifecycle-connectors" viewBox="0 0 1000 322" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="lifecycle-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {connectorPaths.map((path, index) => (
            <path
              className={`${activeStep > index ? 'is-complete' : ''} ${activeStep === index + 1 ? 'is-active' : ''}`}
              d={path}
              key={path}
              markerEnd="url(#lifecycle-arrow)"
            />
          ))}
          {activeStep > 0 ? (
            <circle className="lifecycle-packet" r="4" key={activeStep}>
              <animateMotion dur="1.2s" repeatCount="indefinite" path={connectorPaths[activeStep - 1]} />
            </circle>
          ) : null}
        </svg>

        {lifecycleSteps.map((step, index) => (
          <button
            type="button"
            className={`lifecycle-step ${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-past' : ''}`}
            style={{ gridColumn: step.column, gridRow: step.row }}
            onClick={() => {
              setActiveStep(index);
              setIsPlaying(false);
            }}
            aria-label={`查看第 ${step.code} 步：${step.title}`}
            aria-pressed={index === activeStep}
            key={step.code}
          >
            <span><b>{step.code}</b><Icon name={step.icon} /></span>
            <strong>{step.title}</strong>
            <small>{step.actor}</small>
            {step.network ? <i className="lifecycle-mini-network" aria-hidden="true"><b /><b /><b /></i> : null}
          </button>
        ))}
      </div>

      <footer className="lifecycle-footer">
        <span className="lifecycle-trace-label"><Icon name="receipt" /> ON-CHAIN WORK TRACE</span>
        <div className="lifecycle-trace-progress" aria-hidden="true">
          {lifecycleSteps.map((step, index) => <i className={index <= activeStep ? 'is-recorded' : ''} key={step.code} />)}
        </div>
        <code>traceRoot {traceRoots[activeStep]}</code>
      </footer>
    </div>
  );
}
