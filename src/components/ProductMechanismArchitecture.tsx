import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';
import { ProgressiveTechnicalFlow } from './ProgressiveTechnicalFlow';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula } from './WorkflowHint';

const replacements = [
  {
    label: '共识工作',
    before: 'PoW',
    beforeDetail: '反复计算哈希，只产生安全成本',
    after: 'Proof of Intelligence',
    afterDetail: '真实需求 → 模型推理 → 结果验收',
    icon: 'spark',
  },
  {
    label: '应用合约',
    before: 'EVM Smart Contract',
    beforeDetail: '短、同步、确定性、全网重放',
    after: 'ACVM Agentic Contract',
    afterDetail: '长任务、外部工具、回执驱动状态',
    icon: 'brain',
  },
] as const satisfies readonly {
  label: string;
  before: string;
  beforeDetail: string;
  after: string;
  afterDetail: string;
  icon: IconName;
}[];

export function AcvmProductSnapshotArchitecture() {
  return (
    <LearningPanel code="ACVM / TWO REPLACEMENTS · ONE PRODUCT" status="USEFUL COMPUTE" className="acvm-product-snapshot">
      <div className="product-replacement-grid">
        {replacements.map((replacement, index) => (
          <article key={replacement.label}>
            <header><b>0{index + 1}</b><small>{replacement.label}</small></header>
            <section className="is-before">
              <span><Icon name={index === 0 ? 'bolt' : 'terminal'} /><small>BEFORE</small></span>
              <strong>{replacement.before}</strong>
              <p>{replacement.beforeDetail}</p>
            </section>
            <i aria-hidden="true">→</i>
            <section className="is-after">
              <span><Icon name={replacement.icon} /><small>ACVM</small></span>
              <strong>{replacement.after}</strong>
              <p>{replacement.afterDetail}</p>
            </section>
          </article>
        ))}
      </div>
      <footer className="product-snapshot-result">
        <span><Icon name="shield" /><small>PoI 回答</small><strong>谁完成了可验证的有效计算？</strong></span>
        <i aria-hidden="true">+</i>
        <span><Icon name="receipt" /><small>Agentic Contract 回答</small><strong>任务何时改变状态并触发结算？</strong></span>
        <i aria-hidden="true">=</i>
        <b>AI 服务价值<br />进入共识与结算</b>
      </footer>
    </LearningPanel>
  );
}

export function UsefulWorkOpportunityArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(4, 2800);
  const lanes = [
    { label: '传统 PoW', tone: 'pow', nodes: ['区块头 + nonce', '反复试算哈希', '检查 H < target', '获得记账权'] },
    { label: 'PoI 网络', tone: 'poi', nodes: ['签名 AI 任务', 'PoI Worker 推理', '验证智能体验收', '交付结果 + ValidPoI'] },
  ] as const;

  return (
    <div className="ascii-comparison-shell" ref={rootRef}>
      <LearningPanel code="传统 PoW / PoI 工作过程" status="同样消耗算力，不同直接产出" className="useful-work-opportunity useful-work-simple ascii-work-comparison">
        <div className="ascii-comparison-controls">
          <nav aria-label="传统 PoW 与 PoI 的四步工作过程">
            {['输入', '计算', '验证', '产出'].map((label, index) => (
              <span key={label}>
                <button type="button" className={activeStep === index ? 'is-active' : ''} onClick={() => selectStep(index)}>[0{index + 1} {label}]</button>
                {index < 3 ? <i aria-hidden="true">──▶</i> : null}
              </span>
            ))}
          </nav>
          <button type="button" onClick={togglePlayback} aria-label={isPlaying ? '暂停对比动画' : '继续播放对比动画'}><Icon name={isPlaying ? 'pause' : 'play'} />{isPlaying ? '暂停' : '播放'}</button>
        </div>

        <div className="ascii-comparison-lanes ascii-workflow-canvas">
          {lanes.map((lane) => (
            <section className={`is-${lane.tone}`} key={lane.label}>
              <header><code>{lane.tone === 'pow' ? 'POW://' : 'POI://'}</code><strong>{lane.label}</strong></header>
              <div>
                {lane.nodes.map((node, index) => (
                  <span className={`${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-past' : ''}`} key={node}>
                    <b className="ascii-workflow-node">[{node}]</b>{index < lane.nodes.length - 1 ? <i aria-hidden="true">──▶</i> : null}
                  </span>
                ))}
              </div>
              <footer>
                {lane.tone === 'pow'
                  ? <WorkflowFormula formula="H(blockHeader ∥ nonce) < target" title="PoW 有效哈希条件" summary="矿工持续更换 nonce，直到区块头哈希小于当前难度目标；它证明消耗了算力，但不直接交付业务结果。" />
                  : <WorkflowFormula formula="DemandOK ∧ ExecOK ∧ OutcomeOK ∧ UniqueOK" title="ValidPoI 有效条件" summary="真实需求、可信执行、结果达标和唯一消费同时成立，才把本次推理记为 ValidPoI。" />}
              </footer>
            </section>
          ))}
        </div>
        <footer className="ascii-comparison-result"><strong>PoW 的终点是记账权；PoI 的终点同时包含业务结果和可验证贡献</strong></footer>
      </LearningPanel>
    </div>
  );
}

const systemSteps = [
  { index: '01', actor: '需求方', action: '签名真实需求', output: 'SignedDemand', icon: 'key' },
  { index: '02', actor: 'Agentic Contract', action: '冻结任务与预算', output: 'Task State', icon: 'terminal' },
  { index: '03', actor: 'Inference Worker', action: '执行模型与工具', output: 'ExecReceipt', icon: 'brain' },
  { index: '04', actor: 'Validator', action: '验收结果与证据', output: 'AcceptedResult', icon: 'shield' },
] as const satisfies readonly { index: string; actor: string; action: string; output: string; icon: IconName }[];

export function AcvmSystemArchitecture() {
  return (
    <LearningPanel code="ACVM / END-TO-END PRODUCT ARCHITECTURE" status="DUAL ENGINE" className="acvm-system-architecture">
      <div className="system-primary-flow">
        {systemSteps.map((step, index) => (
          <span className="system-flow-fragment" key={step.index}>
            <article><header><b>{step.index}</b><Icon name={step.icon} /></header><strong>{step.actor}</strong><p>{step.action}</p><code>{step.output}</code></article>
            {index < systemSteps.length - 1 ? <i>→</i> : null}
          </span>
        ))}
      </div>
      <div className="system-fork">
        <section className="is-contract">
          <header><Icon name="receipt" /><span><small>AGENTIC CONTRACT ENGINE</small><strong>结果结算支路</strong></span></header>
          <p>AcceptedResult 推进任务状态；挑战期结束后释放结果奖励。</p>
          <code>verdict → finalReceipt → payout</code>
        </section>
        <i aria-hidden="true">+</i>
        <section className="is-poi">
          <header><Icon name="spark" /><span><small>PROOF OF INTELLIGENCE ENGINE</small><strong>共识贡献支路</strong></span></header>
          <p>需求、执行、验收与防重放同时成立，才生成有效 PoI。</p>
          <code>validPoI → weight → proposer</code>
        </section>
      </div>
      <footer><span>一次模型推理</span><strong>先交付客户结果</strong><i>·</i><strong>再成为网络贡献</strong><span>不重复消耗同一份算力</span></footer>
    </LearningPanel>
  );
}

const consensusStages = [
  { index: '01', title: '贡献归一', detail: '只有已终局的 ValidPoI 参与计算，不同任务类别先换算为可比较贡献', code: 'qᵢ = 𝟙[ValidPoIᵢ] · Normalize_class(scoreᵢ)', input: 'ValidPoI + 任务类别 + 质量分', output: '归一化贡献 qᵢ', actor: 'PoI 计量模块', icon: 'receipt' },
  { index: '02', title: '有界权重', detail: '历史贡献随时间衰减，并通过 cap 限制单个参与方影响', code: 'wᵢ = min(cap, Σₖ qₖe⁻λΔtₖ)', input: '归一化贡献序列 qₖ', output: '有界候选权重 wᵢ', actor: '权重计算模块', icon: 'brain' },
  { index: '03', title: 'VRF 抽签', detail: '权重只影响成为候选提议者的概率，不改变验证规则', code: 'scoreᵢ = VRFᵢ(epoch ∥ poiRoot) / wᵢ', input: 'epoch + poiRoot + wᵢ', output: '候选提议者', actor: '共识候选节点', icon: 'spark' },
  { index: '04', title: 'BFT 终局', detail: '其他节点重新验证区块与证据，达到固定法定人数才终局', code: 'Final ⇔ ValidBlock ∧ QC ≥ 2f+1', input: '候选区块 + Validator 投票', output: '不可逆区块终局', actor: 'BFT Validator 集合', icon: 'check' },
] as const satisfies readonly { index: string; title: string; detail: string; code: string; input: string; output: string; actor: string; icon: IconName }[];

export function PoiConsensusArchitecture() {
  return (
    <ProgressiveTechnicalFlow
      code="PoI Consensus / 核心共识算法"
      status="ValidPoI → 归一 → 封顶 → 抽签 → 终局"
      className="poi-consensus-architecture poi-algorithm-simple"
      stages={consensusStages.map((stage) => ({ ...stage, formula: stage.code }))}
      ariaLabel="PoI 共识算法的四个计算步骤"
      footer={(
        <footer className="progressive-flow-footer">
          <span><Icon name="eye" /><strong>权重只决定提议机会</strong></span>
          <small>验证规则和 BFT 法定人数保持不变</small>
        </footer>
      )}
    />
  );
}

const threats = [
  ['虚假需求与重复结算', '签名订单 · 预算托管 · 唯一 taskKey'],
  ['伪造证据与验证串谋', '独立证据源 · 随机 Validator · 利益冲突限制'],
  ['争议与恶意挑战', '冻结规则 · 挑战窗口 · 保证金 · 可重建裁决链'],
] as const;

export function PoiSecurityArchitecture() {
  return (
    <LearningPanel code="THREAT → CONTROL" status="RESIDUAL RISK EXPLICIT" className="poi-security-architecture is-simple">
      <div className="security-control-list">
        {threats.map(([threat, control], index) => (
          <article key={threat}><b>0{index + 1}</b><strong>{threat}</strong><i aria-hidden="true">→</i><p>{control}</p></article>
        ))}
      </div>
      <footer><Icon name="shield" /><span><strong>不能靠协议消除的风险</strong><small>身份关联、Validator 独立性与挑战有效性，需要在试点中验证。</small></span></footer>
    </LearningPanel>
  );
}

export function UsefulComputeEconomyArchitecture() {
  return (
    <LearningPanel code="ECONOMY / TWO VALUE FLOWS" status="NO DOUBLE COUNTING" className="useful-compute-economy">
      <div className="economy-value-flow is-business">
        <header><b>01</b><span><small>BUSINESS MARKET</small><strong>客户为已验收结果付费</strong></span></header>
        <div>
          <span><Icon name="key" /><strong>需求方预算</strong></span><i>→</i>
          <span><Icon name="brain" /><strong>Worker 结果奖励</strong><small>仅 accepted + finalized</small></span><i>+</i>
          <span><Icon name="eye" /><strong>证据 / 验收费</strong><small>支付真实验证工作</small></span><i>+</i>
          <span><Icon name="chain" /><strong>协议费</strong><small>状态与最终性</small></span>
        </div>
      </div>
      <div className="economy-value-flow is-network">
        <header><b>02</b><span><small>NETWORK SECURITY</small><strong>有效计算形成有界共识贡献</strong></span></header>
        <div>
          <span><Icon name="spark" /><strong>Valid PoI</strong></span><i>→</i>
          <span><Icon name="shield" /><strong>候选权重</strong><small>归一 · 封顶 · 衰减</small></span><i>→</i>
          <span><Icon name="fingerprint" /><strong>VRF 提议者</strong><small>按概率获得机会</small></span><i>→</i>
          <span><Icon name="receipt" /><strong>网络奖励 / 费用</strong><small>只付给完成共识职责者</small></span>
        </div>
      </div>
      <footer><DataChip tone="red">FRAUD</DataChip><strong>罚没 → 有效挑战者 + 安全储备</strong><span>结果费率、网络奖励与是否发行原生资产仍是待定参数。</span></footer>
    </LearningPanel>
  );
}
