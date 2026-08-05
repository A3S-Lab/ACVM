import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const trustStages = [
  {
    index: '01',
    title: '冻结规则承诺',
    detail: '任务、输入、模型、策略、验收与分账在执行前固定',
    formula: 'C = H(taskId ∥ inputRoot ∥ modelRoot ∥ policyRoot ∥ verifyRule ∥ splitRoot)',
    icon: 'lock',
  },
  {
    index: '02',
    title: '验证链下执行',
    detail: '回执绑定同一承诺、输出根与本次 nonce',
    formula: 'ExecOK = VerifyExec(πexec, C, outputRoot, nonce)',
    icon: 'terminal',
  },
  {
    index: '03',
    title: '验证业务结果',
    detail: 'Validator 验签后按冻结谓词检查独立业务证据',
    formula: 'OutcomeOK ⇔ Σᵥ 𝟙[VerifySig(σᵥ) ∧ P(result,eᵥ)] ≥ q',
    icon: 'eye',
  },
  {
    index: '04',
    title: '生成终局裁决',
    detail: 'taskKey 绑定任务、输出与 nonce，保证只消费一次',
    formula: 'taskKey = H(taskId ∥ outputRoot ∥ nonce); Accepted = ExecOK ∧ OutcomeOK ∧ ¬Spent(taskKey)',
    icon: 'shield',
  },
] as const satisfies readonly {
  index: string;
  title: string;
  detail: string;
  formula: string;
  icon: IconName;
}[];

export function AcvmExecutionBoundaryArchitecture() {
  return (
    <LearningPanel code="Agentic Contract / 链下可信算法" status="执行证明与结果证明分别验证" className="agentic-trust-panel principle-panel">
      <div className="agentic-trust-flow" aria-label="链下计算先冻结规则承诺，再分别验证执行证明和业务结果，最后检查防重放并生成终局裁决">
        {trustStages.map((stage, stageIndex) => (
          <span className={`agentic-trust-fragment is-stage-${stageIndex + 1}`} key={stage.index}>
            <section>
              <header><b>{stage.index}</b><Icon name={stage.icon} /></header>
              <strong>{stage.title}</strong>
              <small>{stage.detail}</small>
              <code>{stage.formula}</code>
            </section>
            {stageIndex < trustStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <footer className="agentic-trust-rule">
        <code>Sₙ₊₁ = δACVM(Sₙ, AcceptedResult)</code>
        <span><Icon name="check" /><strong>节点重验公式与证据</strong><small>不在区块内重跑模型</small></span>
      </footer>
    </LearningPanel>
  );
}
