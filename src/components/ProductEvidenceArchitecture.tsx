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

export function AcvmIntegrationArchitecture() {
  return (
    <LearningPanel code="CHAINADAPTER / DOMESTIC INFRASTRUCTURE" status="IDENTITY · EVENT · FINALITY" className="acvm-integration integration-simple">
      <div className="integration-simple-flow" aria-label="ACVM 标准任务状态通过 ChainAdapter 映射到国内区块链的身份、事件和终局接口">
        <section>
          <Icon name="receipt" />
          <small>ACVM CANONICAL STATE</small>
          <strong>ACVM 标准状态</strong>
          <span>taskRoot · verdictRoot · poiRoot</span>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-acvm">
          <Icon name="spark" />
          <small>CHAIN ADAPTER</small>
          <strong>ChainAdapter</strong>
          <span>身份映射 · 事件编码 · 终局回执</span>
        </section>
        <i aria-hidden="true">→</i>
        <section>
          <Icon name="chain" />
          <small>DOMESTIC INFRASTRUCTURE</small>
          <strong>国内区块链</strong>
          <span>BSN · 星火链网 · 长安链 · FISCO BCOS</span>
        </section>
      </div>

      <footer className="integration-simple-boundary">
        <span><b>统一 ACVM 接口</b><small>task · verdict · PoI · finality</small></span>
        <i />
        <span><b>目标链 Driver</b><small>身份 · 交易 · 事件 · 终局</small></span>
      </footer>
    </LearningPanel>
  );
}
