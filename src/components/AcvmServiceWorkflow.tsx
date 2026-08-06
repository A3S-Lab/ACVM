import { BusinessProcessFlow, type BusinessProcessStage } from './BusinessProcessFlow';

const orderFlowStages = [
  { index: '01', label: '签约托管', actor: '需求方 + ACVM', action: '创建唯一订单并锁定结果费、验证费和保证金', detail: '任务内容、验收规则、分账比例和 nonce 共同生成 taskId，后续所有记录都引用它。', input: '任务目标 + 预算 + 验收规则', output: 'FUNDED taskId', state: 'CREATED → FUNDED', icon: 'key', tone: 'violet' },
  { index: '02', label: '隔离执行', actor: 'A3S Worker', action: '在受控环境完成任务并提交结果与执行回执', detail: '回执绑定模型、输入、环境和输出摘要，不能把另一项任务的结果移来结算。', input: 'FUNDED taskId', output: 'outputRoot + ExecReceipt', state: 'FUNDED → SUBMITTED', icon: 'brain', tone: 'violet' },
  { index: '03', label: '独立验收', actor: '链上智能体 PoI 验证器', action: '分别核验执行证据和业务结果', detail: '满足法定人数后形成裁决；挑战者仍可在窗口期提交 FraudProof。', input: '结果 + 执行证据 + 业务证据', output: 'Accepted / Rejected / Fraud', state: 'SUBMITTED → DECIDED', icon: 'shield', tone: 'green' },
  { index: '04', label: '资金终局', actor: 'ACVM Settlement', action: '根据终局结果执行分账、退款或罚没', detail: '通过就按 splitRoot 分账；正常未达标就退款；只有可证明造假才罚没保证金。', input: '终局裁决 + taskKey', output: '分账 / 退款 / Fraud 罚没', state: 'DECIDED → FINALIZED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function AcvmServiceWorkflowArchitecture() {
  return (
    <BusinessProcessFlow
      code="一笔订单 / 同一 taskId"
      status="签约 → 执行 → 验收 → 资金终局"
      className="order-flow-simple order-settlement-panel principle-panel"
      stages={orderFlowStages}
      ariaLabel="ACVM 订单从签约托管到隔离执行、独立验收和资金终局的四步流程"
      footer={<strong>验证智能体按约获得费用；只有 FraudProof 才触发罚没</strong>}
    />
  );
}
