import { Icon } from './Icons';

export function FogInferenceArchitecture() {
  return (
    <div className="diagram-panel fog-inference-panel fog-panel-simple">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>FOG COMPUTING / LOCAL EXECUTION</code>
        <strong><i /> DATA STAYS LOCAL</strong>
      </header>

      <div className="fog-simple-flow" aria-label="原始数据在现场进入雾节点执行，ACVM 在外部验证签名回执">
        <section className="fog-simple-owner">
          <Icon name="lock" />
          <small>DATA OWNER</small>
          <strong>现场原始数据</strong>
          <span>工厂质检图像</span>
        </section>

        <i aria-hidden="true">→</i>

        <section className="fog-simple-worker">
          <Icon name="brain" />
          <small>ISOLATED FOG NODE</small>
          <strong>就近执行模型</strong>
          <span>模型与环境按任务固定</span>
        </section>

        <i aria-hidden="true">→</i>

        <section className="fog-simple-verifier">
          <Icon name="shield" />
          <small>ACVM VERIFICATION</small>
          <strong>验回执与业务结果</strong>
          <span>公共节点不接触原始数据</span>
        </section>
      </div>

      <footer className="fog-simple-receipt">
        <Icon name="receipt" />
        <span><small>SIGNED RECEIPT</small><strong>taskId · modelRoot · envRoot · outputRoot</strong></span>
      </footer>
    </div>
  );
}
