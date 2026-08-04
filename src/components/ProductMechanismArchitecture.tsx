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
    <LearningPanel code="FIRST PRINCIPLE / WHAT CONSENSUS ACTUALLY NEEDS" status="PROPOSAL ≠ FINALITY" className="useful-work-opportunity">
      <div className="consensus-requirements">
        <span><b>01</b><Icon name="fingerprint" /><strong>抗女巫成本</strong><small>身份不能无限低成本复制</small></span>
        <i>→</i>
        <span><b>02</b><Icon name="spark" /><strong>公开选提议者</strong><small>选择不可预先操纵且可验证</small></span>
        <i>→</i>
        <span><b>03</b><Icon name="check" /><strong>冲突后终局</strong><small>有效区块仍需多数确认</small></span>
      </div>
      <div className="work-source-compare">
        <section className="is-hash">
          <header><Icon name="bolt" /><span><small>HASH WORK</small><strong>哈希竞争</strong></span></header>
          <div><b>投入</b><span>电力 · 芯片 · nonce 尝试</span></div>
          <div><b>链外价值</b><span className="is-zero">≈ 0</span></div>
          <code>H(blockHeader ∥ nonce) &lt; target</code>
        </section>
        <i aria-hidden="true">替换工作来源</i>
        <section className="is-intelligence">
          <header><Icon name="brain" /><span><small>INTELLIGENCE WORK</small><strong>模型推理服务</strong></span></header>
          <div><b>投入</b><span>模型 · GPU · 工具 · 专业能力</span></div>
          <div><b>链外价值</b><span className="is-value">客户已验收的 AI 结果</span></div>
          <code>SignedDemand ∧ AcceptedResult ∧ ExecProof</code>
        </section>
      </div>
      <footer><Icon name="shield" /><strong>PoI 替换的是提议权的工作量来源</strong><span>VRF 负责随机选择；BFT 或底层链规则负责最终确认。</span></footer>
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
  { index: '01', title: '有效 PoI 池', detail: '需求 · 结果 · 执行 · 防重放', code: 'poiRoot', icon: 'shield' },
  { index: '02', title: '有界权重', detail: '按任务类型归一、封顶并衰减', code: 'weightᵢ', icon: 'brain' },
  { index: '03', title: 'VRF 抽签', detail: '权重影响概率，随机性可验证', code: 'yᵢ / weightᵢ', icon: 'spark' },
  { index: '04', title: 'BFT 终局', detail: '多数节点重验区块并签名确认', code: 'QC ≥ 2f+1', icon: 'check' },
] as const satisfies readonly { index: string; title: string; detail: string; code: string; icon: IconName }[];

export function PoiConsensusArchitecture() {
  return (
    <LearningPanel code="POI → PROPOSER → FINALITY" status="BOOKKEEPING RIGHT" className="poi-consensus-architecture">
      <div className="poi-consensus-flow">
        {consensusStages.map((stage, index) => (
          <span className="poi-consensus-fragment" key={stage.index}>
            <article><header><b>{stage.index}</b><Icon name={stage.icon} /></header><strong>{stage.title}</strong><p>{stage.detail}</p><code>{stage.code}</code></article>
            {index < consensusStages.length - 1 ? <i>→</i> : null}
          </span>
        ))}
      </div>
      <div className="poi-consensus-equation">
        <code>proposer = argmin(VRF(epoch ∥ poiRoot) / boundedWeight)</code>
        <span><DataChip tone="green">PROPOSAL</DataChip><b>PoI 影响被选概率</b></span>
        <i>≠</i>
        <span><DataChip tone="violet">FINALITY</DataChip><b>法定人数决定是否确认</b></span>
      </div>
      <footer><Icon name="eye" /><strong>获得记账权，不等于获得改规则的权力</strong><span>其他节点仍检查交易、PoI、状态转换与区块签名。</span></footer>
    </LearningPanel>
  );
}

const threats = [
  ['自造需求 / 刷单', '需求签名、预算托管、关联身份分析、权重封顶'],
  ['同一任务重复计分', 'taskKey 写入 Spent 集合；PoI 绑定 epoch 与输出根'],
  ['伪造执行或结果', '执行度量、抽样复算、业务验收与挑战窗口'],
  ['Worker 与 Validator 串谋', '随机委员会、利益冲突限制、保证金与罚没'],
  ['不同任务难度不可比', '按任务类型归一、质量系数、时间衰减与上限'],
] as const;

export function PoiSecurityArchitecture() {
  return (
    <LearningPanel code="FEASIBILITY / ATTACK SURFACE" status="CONTROLS EXPLICIT" className="poi-security-architecture">
      <div className="poi-security-head"><span><small>安全目标</small><strong>只有真实、有效、唯一的模型服务才能影响网络权重</strong></span><code>ValidPoI = Dsig ∧ Raccept ∧ VerifyExec ∧ Fresh</code></div>
      <div className="poi-threat-table">
        <header><span>攻击路径</span><span>协议控制</span></header>
        {threats.map(([threat, control], index) => (
          <article key={threat}><b>0{index + 1}</b><strong>{threat}</strong><i>→</i><p>{control}</p></article>
        ))}
      </div>
      <footer><Icon name="shield" /><span><strong>可行不等于风险归零</strong><small>需求价值归一、关联方识别和开放网络参数仍需通过真实试点校准。</small></span></footer>
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
