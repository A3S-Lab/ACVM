import { Icon } from './Icons';

export function AgentResolutionArchitecture() {
  return (
    <div className="diagram-panel ans-panel ans-panel-simple">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ANS / SIGNED SERVICE DISCOVERY</code>
        <strong><i /> ILLUSTRATIVE RECORD</strong>
      </header>

      <div className="ans-simple-flow" aria-label="调用方解析 ANS 服务卡、核验记录并创建 ACVM 结果订单">
        <section className="ans-simple-query">
          <Icon name="fingerprint" />
          <small>CALLER AGENT</small>
          <strong>查询服务</strong>
          <code>fog.infer.ans</code>
        </section>

        <i aria-hidden="true">→</i>

        <section className="ans-simple-card">
          <header><Icon name="chain" /><span><small>SIGNED SERVICE CARD</small><strong>fog.infer.ans</strong></span></header>
          <div>
            <span><small>身份</small><b>did:a3s:fog-01</b></span>
            <span><small>能力</small><b>private.infer/v1</b></span>
            <span><small>交易条件</small><b>价格 · 有效期 · Validator</b></span>
          </div>
        </section>

        <i aria-hidden="true">→</i>

        <section className="ans-simple-verify">
          <Icon name="shield" />
          <small>CALLER VERIFICATION</small>
          <strong>核验后创建订单</strong>
          <span>签名 · 撤销状态 · 历史回执</span>
        </section>
      </div>

      <footer className="ans-simple-boundary">
        <span><b>ANS</b><small>发现并解析服务</small></span>
        <i aria-hidden="true">→</i>
        <span><b>ACVM</b><small>验收结果并触发结算</small></span>
      </footer>
    </div>
  );
}
