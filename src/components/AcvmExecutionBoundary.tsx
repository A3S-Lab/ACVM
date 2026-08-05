import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';

export function AcvmExecutionBoundaryArchitecture() {
  return (
    <LearningPanel code="EXECUTION BOUNDARY" status="EXECUTE ONCE · VERIFY MANY" className="acvm-boundary-panel boundary-panel-simple">
      <div className="boundary-simple-lanes" aria-label="EVM 重放确定性交易，ACVM 对链下任务只验证回执">
        <section className="boundary-simple-evm">
          <header><Icon name="terminal" /><span><small>EVM</small><strong>确定性交易由节点重放</strong></span></header>
          <div><span>封闭输入</span><i aria-hidden="true">→</i><span>N 个节点执行</span></div>
        </section>

        <section className="boundary-simple-acvm">
          <header><Icon name="receipt" /><span><small>ACVM</small><strong>外部任务一次执行，节点验回执</strong></span></header>
          <div>
            <span>链下任务</span>
            <i aria-hidden="true">→</i>
            <span className="is-worker">Worker 执行</span>
            <i aria-hidden="true">→</i>
            <span className="is-verify">节点验回执</span>
          </div>
        </section>
      </div>

      <footer className="boundary-simple-rule">
        <Icon name="shield" />
        <strong>共识只处理确定性状态变化</strong>
        <span>签名 · 证明 · 裁决 · 防重放</span>
      </footer>
    </LearningPanel>
  );
}
