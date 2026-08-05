import { Icon, LogoMark } from './Icons';
import { LearningPanel } from './LearningPanel';

export function ProductThesis() {
  return (
    <LearningPanel code="EXECUTION → VERDICT → SETTLEMENT" status="CLEAR PRODUCT BOUNDARY" className="product-thesis is-simple">
      <div className="boundary-lanes" aria-label="执行层、ACVM 与结算层的责任边界">
        <article>
          <Icon name="brain" />
          <small>执行层</small>
          <strong>完成任务</strong>
          <p>模型、工具、产物、运行回执</p>
        </article>
        <i aria-hidden="true">→</i>
        <article className="is-acvm">
          <LogoMark />
          <small>ACVM</small>
          <strong>裁决结果</strong>
          <p>验收规则、独立裁决、ValidPoI</p>
        </article>
        <i aria-hidden="true">→</i>
        <article>
          <Icon name="chain" />
          <small>现有基础设施</small>
          <strong>完成结算</strong>
          <p>资金托管、释放、退回、终局</p>
        </article>
      </div>
      <footer className="boundary-note">
        <strong>ACVM 连接执行回执、结果裁决与资金结算。</strong>
      </footer>
    </LearningPanel>
  );
}
