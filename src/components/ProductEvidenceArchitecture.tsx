import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const geoMinimumLoop = [
  {
    code: '01',
    title: '冻结口径',
    detail: '问题集、基线、观察窗口与目标增量',
    record: 'querySetRoot · baselineRoot',
    icon: 'key',
  },
  {
    code: '02',
    title: '独立复测',
    detail: '多观察源、对照组与异常样本处理',
    record: 'observationRoot',
    icon: 'eye',
  },
  {
    code: '03',
    title: '裁决付款',
    detail: '达到门槛才释放结果费',
    record: 'verdictRoot · settlement',
    icon: 'receipt',
  },
] as const satisfies readonly {
  code: string;
  title: string;
  detail: string;
  record: string;
  icon: IconName;
}[];

const geoDeploymentChoices = [
  {
    title: '同一机构内部',
    detail: '签名报告 + 审计数据库',
    decision: '不需要链，也不需要 PoI',
    tone: 'plain',
  },
  {
    title: '跨机构托管结算',
    detail: 'ACVM 状态机 + 现有链终局',
    decision: '需要可审计裁决；PoI 关闭',
    tone: 'settlement',
  },
  {
    title: '开放供给与验证网络',
    detail: '开放 Worker / Validator / 网络激励',
    decision: '裁决通过后，可派生 PoI',
    tone: 'poi',
  },
] as const;

export function GeoPoiDecisionArchitecture() {
  return (
    <LearningPanel code="GEO / MINIMUM TRUST LOOP" status="POI OPTIONAL" className="geo-poi-decision">
      <section className="geo-minimum-loop" aria-label="GEO 按结果结算的最小闭环">
        <header><small>业务必须有</small><strong>验收与付款闭环</strong><span>与是否发行 PoI 无关</span></header>
        <div>
          {geoMinimumLoop.map((step, index) => (
            <span className="geo-loop-fragment" key={step.code}>
              <article>
                <header><b>{step.code}</b><Icon name={step.icon} /></header>
                <strong>{step.title}</strong>
                <p>{step.detail}</p>
                <code>{step.record}</code>
              </article>
              {index < geoMinimumLoop.length - 1 ? <i aria-hidden="true">→</i> : null}
            </span>
          ))}
        </div>
      </section>

      <section className="geo-poi-choices" aria-label="不同 GEO 协作范围下是否需要 PoI">
        <header><small>何时增加 PoI</small><strong>看协作边界，不看任务名字</strong></header>
        <div>
          {geoDeploymentChoices.map((choice, index) => (
            <article className={`is-${choice.tone}`} key={choice.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{choice.title}</strong>
              <p>{choice.detail}</p>
              <b>{choice.decision}</b>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <Icon name="check" />
        <strong>结论：GEO 需要可验证结果；只有跨任务累积贡献时，才需要 PoI。</strong>
      </footer>
    </LearningPanel>
  );
}

const proofLandscape = [
  {
    project: 'Bittensor / Allora',
    target: '服务或预测的相对质量',
    judge: 'Validator / Reputer 评分、损失与 stake 聚合',
    outcome: '分配网络激励',
  },
  {
    project: 'Gensyn Verde / EigenAI',
    target: '声明的模型是否忠实执行',
    judge: '可复现重跑、挑战与争议定位',
    outcome: '验执行，不验业务目标',
  },
  {
    project: 'EigenLayer AVS',
    target: 'Operator 是否按 AVS 规则响应',
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
    outcome: '先付结果费；PoI 可选',
  },
] as const;

export function PoiLandscapeArchitecture() {
  return (
    <LearningPanel code="AI + BLOCKCHAIN / PROOF LANDSCAPE" status="COMPARE THE PREDICATE" className="poi-landscape">
      <header className="poi-landscape-question">
        <span><Icon name="fingerprint" /><small>TECHNICAL REVIEW</small></span>
        <strong>先问“证明对象是什么”，再比较共识名称</strong>
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
        <code>AcceptedResult → Settlement → PoI?</code>
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
  'submitTaskRoot()',
  'submitVerdictRoot()',
  'finalityStatus()',
  'claimSettlement()',
] as const;

export function AcvmIntegrationArchitecture() {
  return (
    <LearningPanel code="ACVM / IMPLEMENTATION PORTS" status="EXISTING INFRASTRUCTURE" className="acvm-integration">
      <div className="integration-stack" aria-label="AP2、A3S、ACVM 和区块链基础设施的职责分层">
        <section className="is-protocol">
          <header><Icon name="key" /><span><small>AUTHORIZATION &amp; DISCOVERY</small><strong>AP2 · A2A · ANS</strong></span></header>
          <p>签名意图、交易授权、服务发现</p>
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
          <p>智能体合约 · 验收策略 · 裁决/挑战 · 结算 · 可选 PoI</p>
          <code>ExecReceipt + BusinessEvidence → Verdict</code>
        </section>
      </div>

      <div className="chain-adapter-abi">
        <header><Icon name="chain" /><span><small>CHAIN ADAPTER ABI</small><strong>底层链只接收确定状态</strong></span></header>
        <div>{chainAdapterCalls.map((call) => <code key={call}>{call}</code>)}</div>
      </div>

      <div className="trust-anchor-targets">
        <article className="is-domestic">
          <header><small>国家级 / 产业级基础设施</small><strong>BSN 网关 · 星火·链网 · 长安链 · FISCO BCOS</strong></header>
          <p>CA / BID / DID、国密与权限治理沿用现有体系；链上只存任务根、裁决根和资金状态。</p>
          <b>人民币托管或支付留在合规支付系统，不要求原生代币。</b>
        </article>
        <article className="is-public">
          <header><small>开放网络可选路径</small><strong>EigenLayer AVS Operator Set</strong></header>
          <p>ACVM Validator 可接 quorum、挑战与 slashing；AVS 提供经济安全，ACVM 仍定义业务判定。</p>
          <b>先复用终局与安全，再决定是否建设 PoI 网络。</b>
        </article>
      </div>
    </LearningPanel>
  );
}
