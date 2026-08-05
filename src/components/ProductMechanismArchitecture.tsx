import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

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
  return (
    <LearningPanel code="TRADITIONAL CHAIN / POI CHAIN" status="INFERENCE AS PROOF" className="useful-work-opportunity useful-work-simple">
      <div className="work-source-compare">
        <section className="is-hash">
          <header><Icon name="bolt" /><span><small>传统区块链</small><strong>哈希即工作量</strong></span></header>
          <div><b>投入</b><span>电力 · 芯片 · nonce</span></div>
          <div><b>验证</b><span>哈希低于目标值</span></div>
          <div><b>链外结果</b><span className="is-zero">无可交付业务结果</span></div>
          <code>H(blockHeader ∥ nonce) &lt; target</code>
        </section>
        <i aria-hidden="true">替换工作来源 →</i>
        <section className="is-intelligence">
          <header><Icon name="brain" /><span><small>基于 PoI 的区块链</small><strong>推理即证明</strong></span></header>
          <div><b>投入</b><span>模型 · GPU · 工具 · 专业能力</span></div>
          <div><b>验证</b><span>任务约束 · 推理结果 · 执行证据</span></div>
          <div><b>可交付结果</b><span className="is-value">诊断 · 预测 · 分析等模型输出</span></div>
          <code>Demand ∧ Result ∧ ExecProof</code>
        </section>
      </div>
      <footer><Icon name="shield" /><strong>工作量来源由哈希搜索变为真实推理</strong><span>工作来源改变，共识安全机制仍须独立定义。</span></footer>
    </LearningPanel>
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
  { index: '01', title: '贡献归一', detail: '不同任务类别先换算为可比较贡献', code: 'qᵢ = 𝟙[ValidPoIᵢ] · Normalize_class(scoreᵢ)', icon: 'receipt' },
  { index: '02', title: '有界权重', detail: '贡献封顶并随时间衰减', code: 'wᵢ = min(cap, Σₖ qₖe⁻λΔtₖ)', icon: 'brain' },
  { index: '03', title: 'VRF 抽签', detail: '权重只影响成为候选提议者的概率', code: 'scoreᵢ = VRFᵢ(epoch ∥ poiRoot) / wᵢ', icon: 'spark' },
  { index: '04', title: 'BFT 终局', detail: '其他节点重验区块并达到法定人数', code: 'Final ⇔ ValidBlock ∧ QC ≥ 2f+1', icon: 'check' },
] as const satisfies readonly { index: string; title: string; detail: string; code: string; icon: IconName }[];

export function PoiConsensusArchitecture() {
  return (
    <LearningPanel code="ACVM / CORE ALGORITHM" status="NORMALIZE → CAP → DRAW → FINALIZE" className="poi-consensus-architecture poi-algorithm-simple">
      <div className="poi-consensus-flow">
        {consensusStages.map((stage, index) => (
          <span className="poi-consensus-fragment" key={stage.index}>
            <article><header><b>{stage.index}</b><Icon name={stage.icon} /></header><strong>{stage.title}</strong><p>{stage.detail}</p><code>{stage.code}</code></article>
            {index < consensusStages.length - 1 ? <i>→</i> : null}
          </span>
        ))}
      </div>
      <footer><Icon name="eye" /><strong>权重只决定提议机会</strong><span>验证规则和 BFT 法定人数不随权重改变。</span></footer>
    </LearningPanel>
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
