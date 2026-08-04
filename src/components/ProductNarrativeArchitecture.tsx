import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const productModules = [
  { code: '01', name: 'Contract', detail: '冻结结果、证据与验收规则', icon: 'key' },
  { code: '02', name: 'Evidence', detail: '绑定产物、观测与执行回执', icon: 'eye' },
  { code: '03', name: 'Verdict', detail: '独立验收，保留挑战入口', icon: 'shield' },
  { code: '04', name: 'Settlement', detail: '裁决终局后释放托管资金', icon: 'receipt' },
] as const satisfies readonly { code: string; name: string; detail: string; icon: IconName }[];

export function ProductDefinitionArchitecture() {
  return (
    <LearningPanel code="ACVM / PRODUCT DEFINITION" status="OUTCOME SETTLEMENT" className="product-definition-panel">
      <div className="product-definition-flow">
        <section className="product-endpoint is-input">
          <small>BUYER COMMITS</small>
          <strong>OutcomeSpec</strong>
          <span>目标 · 门槛 · 预算</span>
        </section>
        <i aria-hidden="true">→</i>
        <section className="product-core">
          <header><Icon name="chain" /><span><small>THE MISSING TRANSACTION LAYER</small><strong>ACVM</strong></span></header>
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
          <small>CHAIN FINALIZES</small>
          <strong>FinalReceipt</strong>
          <span>裁决 · 终局 · 付款</span>
        </section>
      </div>

      <div className="product-responsibility-strip">
        <span><Icon name="brain" /><b>AI Runtime</b><small>模型、工具与业务执行</small></span>
        <span className="is-acvm"><Icon name="shield" /><b>ACVM</b><small>结果协议与可信验收</small></span>
        <span><Icon name="chain" /><b>Base Chain</b><small>托管、争议与最终性</small></span>
      </div>

      <footer>
        <DataChip tone="red">不是 Agent 框架</DataChip>
        <DataChip tone="red">不是新底层链</DataChip>
        <strong>是 AI 结果进入结算前缺失的协议层</strong>
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
    title: '协议与产品叙事',
    detail: 'PoI、智能体合约与经济闭环已形成概念规范',
    status: '当前',
    tone: 'current',
  },
  {
    stage: 'NEXT',
    title: '最小可运行内核',
    detail: 'Contract SDK、任务运行器与 PoI 验证器',
    status: '下一步',
    tone: 'next',
  },
  {
    stage: 'PILOT',
    title: '两个真实试点',
    detail: '接入 GEO 观测源与社会模拟数据所有方',
    status: '需共建',
    tone: 'future',
  },
  {
    stage: 'SCALE',
    title: 'PoI 共识网络',
    detail: '有界权重、VRF、BFT 与多链适配器',
    status: '规模化',
    tone: 'future',
  },
] as const;

export function ProductReadinessArchitecture() {
  return (
    <LearningPanel code="DELIVERY / PRODUCT READINESS" status="NO OVERCLAIM" className="product-readiness-panel">
      <header className="product-readiness-status">
        <span><Icon name="terminal" /><small>当前形态</small><strong>概念规范 + 产品演示</strong></span>
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
      <footer><Icon name="check" /><strong>下一项可验证里程碑</strong><span>让一个真实推理任务从 SignedDemand 走到 Finalized PoI</span></footer>
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
