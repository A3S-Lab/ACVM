import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const productModules = [
  { code: '01', name: '任务规则', detail: '目标、预算、权限和验收办法', icon: 'key' },
  { code: '02', name: '执行证据', detail: '产物、观测和运行回执', icon: 'eye' },
  { code: '03', name: '独立裁决', detail: '通过、拒绝或进入挑战', icon: 'shield' },
  { code: '04', name: '结算', detail: '终局后只支付一次', icon: 'receipt' },
] as const satisfies readonly { code: string; name: string; detail: string; icon: IconName }[];

export function ProductDefinitionArchitecture() {
  return (
    <LearningPanel code="ACVM / WHAT TRIGGERS PAYMENT" status="VERIFIED RESULT" className="product-definition-panel">
      <div className="product-definition-flow">
        <section className="product-endpoint is-input">
          <small>客户先写清</small>
          <strong>什么算达标</strong>
          <span>目标 · 门槛 · 预算</span>
        </section>
        <i aria-hidden="true">→</i>
        <section className="product-core">
          <header><Icon name="chain" /><span><small>任务、证据、裁决、付款</small><strong>ACVM</strong></span></header>
          <div>
            {productModules.map((module) => (
              <article key={module.code}>
                <span><b>{module.code}</b><Icon name={module.icon} /></span>
                <strong>{module.name}</strong>
                <small>{module.detail}</small>
              </article>
            ))}
          </div>
        </section>
        <i aria-hidden="true">→</i>
        <section className="product-endpoint is-output">
          <small>协议最后确认</small>
          <strong>何时可以付款</strong>
          <span>裁决 · 终局 · 付款</span>
        </section>
      </div>

      <div className="product-responsibility-strip">
        <span><Icon name="brain" /><b>AI Runtime</b><small>运行模型与工具</small></span>
        <span className="is-acvm"><Icon name="shield" /><b>ACVM</b><small>记录约定与验收</small></span>
        <span><Icon name="chain" /><b>底层链</b><small>托管资金并给出终局</small></span>
      </div>

      <footer className="product-decision">
        <Icon name="shield" />
        <span><small>ACVM 只新增一个决定</small><strong>这份结果是否已经达到付款条件？</strong></span>
      </footer>
    </LearningPanel>
  );
}

const lifecycle = [
  { index: '01', title: '真实需求', detail: '签名目标、预算和 nonce', output: 'SignedDemand', icon: 'key' },
  { index: '02', title: '智能体合约', detail: '冻结任务状态与规则', output: 'Task', icon: 'terminal' },
  { index: '03', title: '模型推理', detail: 'Worker 执行并留证', output: 'ExecReceipt', icon: 'brain' },
  { index: '04', title: '结果验收', detail: 'Validator 检查证据', output: 'Verdict', icon: 'shield' },
  { index: '05', title: '生成 PoI', detail: '有效、唯一、可验证', output: 'ValidPoI', icon: 'spark' },
  { index: '06', title: '终局结算', detail: '确认状态与一次性付款', output: 'Finality', icon: 'receipt' },
] as const satisfies readonly { index: string; title: string; detail: string; output: string; icon: IconName }[];

export function ProductLifecycleArchitecture() {
  return (
    <LearningPanel code="ONE TASK / SERVICE → POI → FINALITY" status="6 PRODUCT EVENTS" className="product-lifecycle-panel">
      <div className="product-lifecycle-question">
        <small>一笔 AI 服务如何同时产生客户结果与网络贡献？</small>
        <strong>每一步都引用同一个 taskId</strong>
      </div>
      <div className="product-lifecycle-flow">
        {lifecycle.map((step, index) => (
          <span className="product-lifecycle-segment" key={step.index}>
            <article>
              <header><b>{step.index}</b><Icon name={step.icon} /></header>
              <strong>{step.title}</strong>
              <p>{step.detail}</p>
              <code>{step.output}</code>
            </article>
            {index < lifecycle.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>
      <footer>
        <span><Icon name="brain" /><b>一次推理</b><small>交付客户结果</small></span>
        <i aria-hidden="true">+</i>
        <span><Icon name="spark" /><b>有效 PoI</b><small>形成共识贡献</small></span>
      </footer>
    </LearningPanel>
  );
}

const readinessStages = [
  {
    stage: 'TODAY',
    title: '概念规范与演示',
    detail: 'PoI、智能体合约、ANS 和雾计算已有可讨论设计',
    status: '当前',
    tone: 'current',
  },
  {
    stage: 'NEXT',
    title: '跑通一笔任务',
    detail: 'Contract SDK、任务运行器和 PoI 验证器',
    status: '下一步',
    tone: 'next',
  },
  {
    stage: 'PILOT',
    title: '真实业务试点',
    detail: '接入 GEO 观测源或社会模拟数据方',
    status: '需共建',
    tone: 'future',
  },
  {
    stage: 'SCALE',
    title: '开放 PoI 网络',
    detail: '有界权重、VRF、BFT 和多链适配器',
    status: '规模化',
    tone: 'future',
  },
] as const;

export function ProductReadinessArchitecture() {
  return (
    <LearningPanel code="DELIVERY / FROM DEMO TO PILOT" status="NEXT MILESTONE" className="product-readiness-panel">
      <header className="product-readiness-status">
        <span><Icon name="terminal" /><small>现在</small><strong>概念规范 + 产品演示</strong></span>
        <DataChip tone="amber">CONCEPT</DataChip>
      </header>
      <div className="product-readiness-track">
        {readinessStages.map((item, index) => (
          <span className="product-readiness-stage" key={item.stage}>
            <article className={`is-${item.tone}`}>
              <header><b>{item.stage}</b><small>{item.status}</small></header>
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
            {index < readinessStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>
      <footer><Icon name="check" /><strong>下一项交付</strong><span>让一笔真实任务从签约、执行、验收走到付款和 Finalized PoI</span></footer>
    </LearningPanel>
  );
}

const pilotInputs = [
  ['01', '需求', '谁签名真实任务并托管预算？'],
  ['02', '推理', '哪项模型服务创造实际价值？'],
  ['03', '验收', '什么条件代表结果已达标？'],
  ['04', '证明', '怎样绑定模型、输入、输出与环境？'],
  ['05', '共识', 'PoI 权重如何封顶并进入提议？'],
  ['06', '结算', '终局后奖励、费用与罚没怎样分配？'],
] as const;

export function ProductClosingArchitecture() {
  return (
    <LearningPanel code="PILOT / SIX REQUIRED INPUTS" status="READY TO SPEC" className="product-closing-panel">
      <div className="product-closing-headline">
        <Icon name="receipt" />
        <span><small>ACVM PRODUCT THESIS</small><strong>真实推理 · 可信记账 · 按结果结算</strong></span>
      </div>
      <div className="product-closing-inputs">
        {pilotInputs.map(([index, name, question]) => (
          <article key={index}><b>{index}</b><strong>{name}</strong><p>{question}</p></article>
        ))}
      </div>
      <footer>
        <span><Icon name="spark" /><b>能回答这六个问题</b><small>就能把 AI 服务写成一份智能体合约</small></span>
        <i aria-hidden="true">→</i>
        <strong>SignedDemand → Inference → Verdict → PoI → Finality</strong>
      </footer>
    </LearningPanel>
  );
}
