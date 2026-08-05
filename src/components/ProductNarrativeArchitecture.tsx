import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const productModules = [
  { code: '01', name: '事前定规则', detail: '目标 · 证据 · 预算', icon: 'key' },
  { code: '02', name: '事后做验收', detail: '通过 · 拒绝 · 挑战', icon: 'shield' },
  { code: '03', name: '按裁决付款', detail: '释放 · 退回 · 罚没', icon: 'receipt' },
] as const satisfies readonly { code: string; name: string; detail: string; icon: IconName }[];

export function ProductDefinitionArchitecture() {
  return (
    <LearningPanel code="ACVM / VERIFIED OUTCOME" status="ONE PAYMENT DECISION" className="product-definition-panel is-simple">
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
      <footer className="decision-statement">
        <span><small>执行层提交</small><strong>任务回执</strong></span>
        <i aria-hidden="true">→</i>
        <span className="is-acvm"><small>ACVM 生成</small><strong>结果裁决</strong></span>
        <i aria-hidden="true">→</i>
        <span><small>支付 / 链执行</small><strong>资金结算</strong></span>
      </footer>
    </LearningPanel>
  );
}

export function TrustedDataSpaceArchitecture() {
  return (
    <LearningPanel code="MULTI-PARTY DATA / SPLIT" status="TRUSTED DATA SPACE + ACVM" className="trusted-data-space-panel is-simple">
      <div className="multi-party-data-flow" aria-label="多方数据形成联合数据产品并按有效结果分配收益">
        <section className="data-contributors">
          <small>多方数据贡献</small>
          <div><span>设备厂</span><span>工厂</span><span>维保商</span></div>
        </section>
        <i aria-hidden="true">→</i>
        <section className="trusted-data-product">
          <Icon name="lock" />
          <small>可信数据空间</small>
          <strong>联合数据产品</strong>
          <p>授权 · 用数 · 谱系可核对</p>
        </section>
        <i aria-hidden="true">→</i>
        <section className="accepted-outcome">
          <Icon name="shield" />
          <small>ACVM</small>
          <strong>验收结果并分账</strong>
          <p>AcceptedResult · splitRoot</p>
        </section>
      </div>
      <div className="data-space-gate">
        <span>UsageProof</span><b>+</b><span>AcceptedResult</span><i aria-hidden="true">→</i><strong>释放结果池</strong>
      </div>
      <footer className="data-space-payees">
        <small>按签约时冻结的 splitRoot 分配</small>
        <span>设备厂</span><span>工厂</span><span>维保商</span><span>其他约定参与方</span>
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
