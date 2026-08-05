import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const productModules = [
  { code: '01', name: '事前定规则', detail: '目标 · 证据 · 预算', icon: 'key' },
  { code: '02', name: '事后做验收', detail: '通过 · 拒绝 · 挑战', icon: 'shield' },
  { code: '03', name: '按裁决付款', detail: '释放 · 退回 · 罚没', icon: 'receipt' },
] as const satisfies readonly { code: string; name: string; detail: string; icon: IconName }[];

export function ProductDefinitionArchitecture() {
  return (
    <LearningPanel code="ACVM / 结果验收" status="一次裁决决定一次付款" className="product-definition-panel is-simple">
      <div className="decision-flow" aria-label="事前定规则、事后做验收、按裁决付款">
        {productModules.map((module, index) => (
          <span className="decision-flow-fragment" key={module.code}>
            <article>
              <header><b>{module.code}</b><Icon name={module.icon} /></header>
              <strong>{module.name}</strong>
              <small>{module.detail}</small>
            </article>
            {index < productModules.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>
      <footer className="decision-statement decision-statement-single">
        <Icon name="receipt" /><strong>ACVM 的结果裁决就是付款开关</strong>
      </footer>
    </LearningPanel>
  );
}

export function AgentRentalArchitecture() {
  return (
    <LearningPanel code="智能体服务租赁 / 按结果结算" status="所有权始终由服务方保留" className="trusted-data-space-panel agent-rental-panel principle-panel is-simple">
      <div className="multi-party-data-flow agent-rental-flow" aria-label="智能体所有者发布服务，租用方提交任务，ACVM 验收并分账">
        <section>
          <Icon name="fingerprint" />
          <small>01 / 发布</small>
          <strong>登记智能体服务</strong>
          <p>ANS 服务卡 · 能力 · 价格</p>
        </section>
        <i aria-hidden="true">→</i>
        <section>
          <Icon name="brain" />
          <small>02 / 使用</small>
          <strong>提交任务并隔离执行</strong>
          <p>租用方下单 · A3S 运行</p>
        </section>
        <i aria-hidden="true">→</i>
        <section className="accepted-outcome">
          <Icon name="shield" />
          <small>03 / 结算</small>
          <strong>结果通过后自动分账</strong>
          <p>ACVM 验收 · splitRoot 分配</p>
        </section>
      </div>
      <footer className="data-space-payees">
        <strong>splitRoot 自动分账</strong>
        <span>智能体所有者 · 模型方 · 算力方 · 数据贡献方</span>
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
        <small>一笔 AI 服务同时形成客户结果与网络贡献</small>
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
    stage: '01',
    title: '已有底座',
    detail: 'A3S 开源执行组件；ACVM 产品规范与演示',
    status: '已有',
    tone: 'current',
  },
  {
    stage: '02',
    title: '最小闭环',
    detail: '任务适配、回执绑定、裁决状态机、Shadow PoI',
    status: '下一步',
    tone: 'next',
  },
  {
    stage: '03',
    title: '真实订单',
    detail: '接入 GEO 或可信数据空间的小额结果付款',
    status: '验证',
    tone: 'future',
  },
] as const;

export function ProductReadinessArchitecture() {
  return (
    <LearningPanel code="DELIVERY / READINESS" status="FOUNDATION → BUILD → VALIDATE" className="product-readiness-panel is-simple">
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
      <footer><Icon name="check" /><strong>下一项可验收交付</strong><span>一笔真实订单跑到 Shadow PoI 与小额付款</span></footer>
    </LearningPanel>
  );
}
