import { Icon, type IconName } from './Icons';
import { ProgressiveTechnicalFlow } from './ProgressiveTechnicalFlow';
import { WorkflowFormula } from './WorkflowHint';

const trustStages = [
  {
    index: '01',
    title: '形成统一规则承诺',
    detail: '链、Runtime、任务、模型、权限、验收和分账在执行前固定',
    formula: 'C = H(domain ∥ taskId ∥ inputRoot ∥ modelRoot ∥ policyRoot ∥ verifyRuleRoot ∥ splitRoot ∥ nonce)',
    input: '完整任务规则 + domain + nonce',
    output: '统一规则承诺 C',
    actor: 'Agentic Contract + ACVM Runtime',
    icon: 'lock',
  },
  {
    index: '02',
    title: '签发隐私执行回执',
    detail: 'PoI Worker 把环境、输出和隐私证明绑定到同一承诺 C',
    formula: 'rPriv = SignWorker(C ∥ envRoot ∥ outputRoot ∥ πpriv)',
    input: 'C + 环境证明 + 输出根',
    output: '隐私执行回执 rPriv',
    actor: 'PoI Worker / a3s-box / a3s-power',
    icon: 'terminal',
  },
  {
    index: '03',
    title: '生成链上结果证书',
    detail: '验证智能体检查执行回执和独立业务证据，再形成法定人数证书',
    formula: 'R = QC(H(C ∥ rPriv ∥ verdictRoot))',
    input: 'C + rPriv + 业务证据',
    output: '结果证书 R',
    actor: '智能体 PoI 验证器组',
    icon: 'eye',
  },
  {
    index: '04',
    title: '确定性恢复合约',
    detail: 'Runtime 验证结果证书和防重放键后，所有节点执行同一状态转换',
    formula: 'taskKey = H(C ∥ outputRoot ∥ verdictRoot ∥ workerDID ∥ taskClass)\nVerify(R) ∧ ¬Spent(taskKey) ⇒ Sₙ₊₁ = δACVM(Sₙ, R)',
    input: 'R + 未消费 taskKey + 当前状态',
    output: '新状态 + 结算 + ValidPoI',
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
      ariaLabel="可信链下执行从统一规则承诺、隐私执行回执、链上结果证书到确定性恢复合约的四个步骤"
      footer={(
        <footer className="progressive-flow-footer">
          <WorkflowFormula formula="C → rPriv → R → δACVM" title="可信链下执行证据链" summary="同一规则承诺依次绑定隐私执行回执、链上结果证书和状态恢复，任何环节换件都会导致验证失败。" />
          <span><Icon name="check" /><strong>链下生成回执；链上验证证书并恢复状态</strong></span>
        </footer>
      )}
    />
  );
}
