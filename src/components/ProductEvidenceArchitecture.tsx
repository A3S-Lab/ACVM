import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const proofLandscape = [
  {
    project: 'Bittensor / Allora',
    target: '服务或预测的相对质量',
    judge: 'Validator / Reputer 评分、损失与 stake 聚合',
    outcome: '分配网络激励',
  },
  {
    project: 'Gensyn Verde / EigenAI',
    target: '声明模型的执行忠实性',
    judge: '可复现重跑、挑战与争议定位',
    outcome: '验执行，不验业务目标',
  },
  {
    project: 'EigenLayer AVS',
    target: 'Operator 对 AVS 规则的响应',
    judge: 'Operator quorum、挑战与 slashing',
    outcome: '提供经济安全底座',
  },
  {
    project: 'ChainOpera PoI',
    target: '数据、计算、模型与 Agent 贡献',
    judge: '协议定义的贡献计量与验证',
    outcome: '面向生态的广义贡献账',
  },
  {
    project: 'ACVM',
    target: '签名订单约定的业务结果',
    judge: '事前验收策略、独立 Validator 与挑战',
    outcome: 'PoI 触发结算并计量贡献',
  },
] as const;

export function PoiLandscapeArchitecture() {
  return (
    <LearningPanel code="AI + BLOCKCHAIN / PROOF LANDSCAPE" status="COMPARE THE PREDICATE" className="poi-landscape">
      <header className="poi-landscape-question">
        <span><Icon name="fingerprint" /><small>TECHNICAL REVIEW</small></span>
        <strong>验证命题不同，经济结果也不同</strong>
      </header>
      <div className="poi-landscape-table" role="table" aria-label="AI 区块链工程机制比较">
        <div className="poi-landscape-row is-header" role="row">
          <span role="columnheader">工程</span>
          <span role="columnheader">证明对象</span>
          <span role="columnheader">裁决方法</span>
          <span role="columnheader">直接结果</span>
        </div>
        {proofLandscape.map((item) => (
          <div className={`poi-landscape-row ${item.project === 'ACVM' ? 'is-acvm' : ''}`} role="row" key={item.project}>
            <strong role="cell">{item.project}</strong>
            <span role="cell">{item.target}</span>
            <span role="cell">{item.judge}</span>
            <b role="cell">{item.outcome}</b>
          </div>
        ))}
      </div>
      <footer>
        <Icon name="shield" />
        <span><small>ACVM 补的空位</small><strong>把“执行过”推进到“结果达标，因此可以结算”</strong></span>
        <code>AcceptedResult → ValidPoI → Settlement / Weight</code>
      </footer>
    </LearningPanel>
  );
}

const a3sCapabilityGroups = [
  ['Code / Flow', 'Agent 编排与可重放工作流'],
  ['Runtime / Event', '生命周期、幂等请求与事件证据'],
  ['Box / Power', '隔离执行、模型推理与运行回执'],
  ['Gateway / Sentry', '协议入口与分级安全控制'],
] as const;

const chainAdapterCalls = [
  'submitTaskRoot',
  'submitPoIRoot',
  'finalityStatus',
  'claimSettlement',
] as const;

export function AcvmIntegrationArchitecture() {
  return (
    <LearningPanel code="ACVM / CANDIDATE IMPLEMENTATION PORTS" status="PROPOSED" className="acvm-integration">
      <div className="integration-stack" aria-label="AP2、A3S、ACVM 和区块链基础设施的职责分层">
        <section className="is-protocol">
          <header><Icon name="key" /><span><small>OPTIONAL AUTHORIZATION &amp; DISCOVERY</small><strong>AP2 · A2A · ANS</strong></span></header>
          <p>候选适配：签名意图、交易授权、服务发现</p>
          <code>Intent / Cart Mandate → SignedDemand</code>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-a3s">
          <header><Icon name="brain" /><span><small>OPEN-SOURCE EXECUTION FOUNDATION</small><strong>A3S 开源框架</strong></span></header>
          <div>
            {a3sCapabilityGroups.map(([name, detail]) => (
              <span key={name}><b>{name}</b><small>{detail}</small></span>
            ))}
          </div>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-acvm">
          <header><Icon name="receipt" /><span><small>OUTCOME CONTROL PLANE</small><strong>ACVM</strong></span></header>
          <p>智能体合约 · 验收策略 · 裁决/挑战 · PoI · 结算</p>
          <code>ExecReceipt + BusinessEvidence → ValidPoI</code>
        </section>
      </div>

      <div className="chain-adapter-abi">
        <header><Icon name="chain" /><span><small>CHAIN ADAPTER ABI</small><strong>底层链只接收确定状态</strong></span></header>
        <div>{chainAdapterCalls.map((call) => <code key={call}>{call}</code>)}</div>
      </div>

      <div className="trust-anchor-targets">
        <article className="is-domestic">
          <header><small>待选型的国内候选基础设施</small><strong>BSN 网关 · 星火·链网 · 长安链 · FISCO BCOS</strong></header>
          <p>CA / BID / DID、国密与权限治理沿用现有体系；链上只存任务根、裁决根和资金状态。</p>
          <b>人民币托管或支付留在合规支付系统，不要求原生代币。</b>
        </article>
        <article className="is-public">
          <header><small>待验证的开放网络候选路径</small><strong>EigenLayer AVS Operator Set</strong></header>
          <p>ACVM Validator 可接 quorum、挑战与 slashing；AVS 提供经济安全，ACVM 仍定义业务判定。</p>
          <b>复用现有终局与安全，PoI 仍由 ACVM 生成和解释。</b>
        </article>
      </div>
    </LearningPanel>
  );
}
