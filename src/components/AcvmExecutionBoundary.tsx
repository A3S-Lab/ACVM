import { Icon, type IconName } from './Icons';
import { ProgressiveTechnicalFlow } from './ProgressiveTechnicalFlow';

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
    formula: 'taskKey = H(taskId ∥ outputRoot ∥ nonce)\nAccepted = ExecOK ∧ OutcomeOK ∧ ¬Spent(taskKey)',
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
    <ProgressiveTechnicalFlow
      code="Agentic Contract / 链下可信算法"
      status="四步验证 · 逐步展示"
      className="agentic-trust-panel principle-panel"
      stages={trustStages}
      ariaLabel="可信链下执行的四个验证步骤"
      footer={(
        <footer className="progressive-flow-footer">
          <code>Sₙ₊₁ = δACVM(Sₙ, AcceptedResult)</code>
          <span><Icon name="check" /><strong>链上只重验证据和公式，不重跑模型</strong></span>
        </footer>
      )}
    />
  );
}
