import { Icon, type IconName } from './Icons';
import { ProgressiveTechnicalFlow } from './ProgressiveTechnicalFlow';
import { WorkflowFormula } from './WorkflowHint';

const trustStages = [
  {
    index: '01',
    title: '冻结规则承诺',
    detail: '任务、输入、模型、策略、验收与分账在执行前固定',
    formula: 'C = H(taskId ∥ inputRoot ∥ modelRoot ∥ policyRoot ∥ verifyRule ∥ splitRoot)',
    input: 'taskId + 输入、模型、权限和验收规则',
    output: '不可修改的规则承诺 C',
    actor: 'Agentic Contract + ACVM Runtime',
    icon: 'lock',
  },
  {
    index: '02',
    title: '核验链下隐私计算',
    detail: 'a3s 回执绑定同一承诺、输出根与本次 nonce',
    formula: 'ExecOK = VerifyAttestation(πpriv, C, outputRoot, nonce)',
    input: 'πpriv + C + outputRoot + nonce',
    output: '执行过程是否可信 ExecOK',
    actor: '智能体 PoI 验证器',
    icon: 'terminal',
  },
  {
    index: '03',
    title: '验证业务结果',
    detail: '验证智能体验签后按冻结谓词检查独立业务证据',
    formula: 'OutcomeOK ⇔ Σᵥ 𝟙[VerifySig(σᵥ) ∧ P(result,eᵥ)] ≥ q',
    input: '业务结果 + 独立证据 + Validator 签名',
    output: '业务结果是否达标 OutcomeOK',
    actor: '智能体 PoI 验证器组',
    icon: 'eye',
  },
  {
    index: '04',
    title: '生成终局裁决',
    detail: 'taskKey 绑定任务、输出与 nonce，保证只消费一次',
    formula: 'taskKey = H(taskId ∥ outputRoot ∥ nonce)\nAccepted = ExecOK ∧ OutcomeOK ∧ ¬Spent(taskKey)',
    input: 'ExecOK + OutcomeOK + 未使用 taskKey',
    output: 'AcceptedResult + 链上状态更新',
    actor: 'ACVM Runtime',
    icon: 'shield',
  },
] as const satisfies readonly {
  index: string;
  title: string;
  detail: string;
  formula: string;
  input: string;
  output: string;
  actor: string;
  icon: IconName;
}[];

export function AcvmExecutionBoundaryArchitecture() {
  return (
    <ProgressiveTechnicalFlow
      code="ACVM Runtime / 可信执行算法"
      status="链下隐私计算 · 链上智能体验证"
      className="agentic-trust-panel principle-panel"
      stages={trustStages}
      ariaLabel="可信链下执行的四个验证步骤"
      footer={(
        <footer className="progressive-flow-footer">
          <WorkflowFormula formula="Sₙ₊₁ = δACVM(Sₙ, AcceptedResult)" title="ACVM 状态更新" summary="只有 AcceptedResult 通过验证，确定性状态转换函数 δACVM 才从当前状态 Sₙ 计算下一状态 Sₙ₊₁。" />
          <span><Icon name="check" /><strong>链下只做隐私计算；链上智能体 PoI 验证器负责裁决</strong></span>
        </footer>
      )}
    />
  );
}
