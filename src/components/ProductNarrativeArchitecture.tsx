import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';
import { AsciiFlowControls, BusinessProcessFlow, type BusinessProcessStage } from './BusinessProcessFlow';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowTerm } from './WorkflowHint';

const productDecisionStages = [
  { index: '01', label: '创建链上任务', actor: 'Agentic Contract', action: '写入目标、验收规则和预算', detail: 'ACVM Runtime 把任务目标、证据来源、通过门槛和付款规则保存为可执行状态。', input: '业务目标 + 预算', output: '等待执行的链上任务', state: 'CREATED → FUNDED', icon: 'key', tone: 'violet' },
  { index: '02', label: '链下隐私计算', actor: 'A3S Worker', action: '在受保护环境运行模型并生成回执', detail: 'a3s-box 隔离任务，a3s-power 保护数据与模型；链上只接收结果、承诺根和执行回执。', input: '已签名任务', output: '结果 + ExecReceipt', state: 'FUNDED → SUBMITTED', icon: 'brain', tone: 'violet' },
  { index: '03', label: '链上智能体验证', actor: '智能体 PoI 验证器', action: '分别检查执行过程和业务结果', detail: '验证器检查执行证据、独立业务证据和防重放状态，达到法定人数后形成终局裁决。', input: '结果 + 两类证据', output: 'Accepted / Rejected', state: 'SUBMITTED → DECIDED', icon: 'shield', tone: 'green' },
  { index: '04', label: '恢复合约结算', actor: 'ACVM Runtime', action: '恢复 Agentic Contract 并执行付款规则', detail: '结果通过就推进状态并按 splitRoot 分账；正常未达标则把结果费退回需求方。', input: '终局裁决', output: '状态更新 + 付款或退款', state: 'DECIDED → FINALIZED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function ProductDefinitionArchitecture() {
  return (
    <BusinessProcessFlow
      code="ACVM Runtime / Agentic Contract"
      status="链上发任务 → 链下计算 → 链上验证 → 恢复合约"
      className="product-definition-panel"
      stages={productDecisionStages}
      ariaLabel="ACVM Runtime 从创建链上任务到恢复 Agentic Contract 的四步业务流程"
      footer={<strong>验证结果直接驱动 Agentic Contract 状态机</strong>}
    />
  );
}

const agentRentalStages = [
  { index: '01', label: '构建智能体', actor: '企业 + a3s-code', action: '构建智能体逻辑、依赖、策略和能力声明', detail: 'a3s-code 生成可签名的 AgentBundle，使同一版本可以在不同雾节点复现。', input: 'Agent Source + agent.yaml', output: 'AgentBundle + imageRoot', state: 'SOURCE → BUILT', icon: 'terminal', tone: 'violet' },
  { index: '02', label: '声明能力', actor: 'a3s-use', action: '锁定可热插拔能力及最小权限', detail: '模型、工具和数据连接器只以签名引用进入能力清单，生产密钥不写入智能体镜像。', input: 'CapabilityRefs + Policy', output: 'capabilityRoot', state: 'BUILT → CAPABILITY_LOCKED', icon: 'key', tone: 'violet' },
  { index: '03', label: '发布服务', actor: '企业 + ACVM + ANS', action: '发布加密镜像和签名服务卡', detail: '服务卡绑定 DID、imageRoot、capabilityRoot、价格、验收规则和所需 TEE 等级。', input: 'AgentImage.enc + ServiceCard', output: '可发现的智能体服务', state: 'LOCKED → DISCOVERABLE', icon: 'fingerprint', tone: 'violet' },
  { index: '04', label: '用户调用', actor: '用户 + ANS', action: '解析服务卡并创建 Agentic Contract 任务', detail: '用户先核验身份、版本、价格和履历，再把任务目标、验收条件和预算写入 ACVM。', input: 'Task Query + Budget', output: 'FUNDED Agentic Task', state: 'DISCOVERED → FUNDED', icon: 'receipt', tone: 'violet' },
  { index: '05', label: '雾节点调度', actor: 'Fog Scheduler', action: '按 TEE、GPU、位置、负载和信誉选择节点', detail: '调度器生成只对本次 taskId 有效的 FogLease，远程证明失败时不会下发镜像密钥。', input: 'Task Policy + Node Offers', output: 'FogLease + Attestation', state: 'FUNDED → LEASED', icon: 'chain', tone: 'violet' },
  { index: '06', label: 'TEE 隐私执行', actor: 'a3s-box + a3s-use', action: '在 TEE 内解密镜像并远程加载授权能力', detail: 'a3s-box 核验 imageRoot 后解密镜像；a3s-use 核验 capabilityRoot，热插拔本次任务需要的模型、工具和数据连接器。', input: 'AgentImage.enc + FogLease', output: 'Result + πpriv', state: 'LEASED → SUBMITTED', icon: 'brain', tone: 'green' },
  { index: '07', label: '验证结算', actor: '链上 PoI 验证器 + ACVM Runtime', action: '验收结果、恢复合约并按贡献分账', detail: '智能体 PoI 验证器确认执行与业务结果，ACVM Runtime 恢复 Agentic Contract，生成 ValidPoI 并按 splitRoot 结算。', input: 'Result + πpriv + Evidence', output: 'AcceptedResult + ValidPoI + Payout', state: 'SUBMITTED → FINALIZED', icon: 'shield', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function AgentRentalArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(agentRentalStages.length, 3200);
  const current = agentRentalStages[activeStep];

  return (
    <div className="rental-ascii-shell" ref={rootRef}>
      <LearningPanel code="ACVM / 去中心化智能体即服务" status="构建 → 发布 → 调用 → 隐私执行 → 验证结算" className="agent-rental-panel rental-ascii-panel principle-panel">
        <AsciiFlowControls stages={agentRentalStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="企业构建并发布智能体，用户通过 ANS 调用，雾计算节点在 TEE 内执行并由 ACVM 验证结算的七步业务流程" />
        <div className={`rental-ascii-market ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ ANS://agent-service / <WorkflowTerm term="taskId" label="task-2048" /> / imageRoot + capabilityRoot ───────┐</code></header>
          <div className="rental-ascii-order">
            <span className="is-owner ascii-workflow-node">[企业 / <WorkflowTerm term="a3sCode" label="a3s-code" /> + <WorkflowTerm term="a3sUse" label="a3s-use" />]</span><i>── <WorkflowTerm term="AgentImage" label="AgentImage.enc" /> + ServiceCard ──▶</i>
            <strong className="is-market ascii-workflow-node">[ACVM / <WorkflowTerm term="ANS" />]</strong><i>◀── Resolve + Task + Budget ──</i>
            <span className="is-renter ascii-workflow-node">[用户]</span>
          </div>
          <div className="rental-ascii-boundary">
            <section className="is-runtime ascii-workflow-node">
              <small>[ 雾计算节点 / <WorkflowTerm term="FogLease" label="Node-TEE-07" /> ]</small>
              <code><WorkflowTerm term="AgentImage" label="加密镜像" /> ──证明通过──▶ TEE 内解密</code>
              <strong>[a3s-box] Agent Runtime + [<WorkflowTerm term="a3sUse" label="a3s-use" />] Remote Capabilities</strong>
            </section>
            <i>────◆ Result + πpriv ◆────▶</i>
            <section className="is-chain ascii-workflow-node">
              <small>[ 链上 / 智能体 PoI 验证器 + ACVM Runtime ]</small>
              <code><WorkflowTerm term="AcceptedResult" /> + <WorkflowTerm term="ValidPoI" /> + <WorkflowTerm term="splitRoot" /></code>
              <strong>验收通过 → 恢复 Agentic Contract → 分账</strong>
            </section>
          </div>
          <div className="rental-ascii-split" aria-label="结果费向企业、能力提供方、雾计算节点和 PoI 验证者分账">
            <strong className="ascii-workflow-node">[结果费 ¥100,000]</strong><i>── <WorkflowTerm term="splitRoot" /> ──▶</i>
            <span>企业 45%</span><span>能力方 20%</span><span>雾节点 25%</span><span>PoI 验证 10%</span>
          </div>
          <footer><code>└─ 当前 / {current.label} / {current.state} / {current.output} ───────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>当前产出</small><code>{current.output}</code></span><strong>同一 taskId 串联构建、调用、执行、验证和收益分配</strong></footer>
      </LearningPanel>
    </div>
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
