import { Icon, type IconName } from './Icons';
import { ProgressiveTechnicalFlow } from './ProgressiveTechnicalFlow';

const nativeAlgorithmStages = [
  {
    index: '01',
    actor: '链上 ACVM',
    title: '发布推理任务',
    detail: '合约进入 AwaitingInference，区块继续出块',
    formula: 'T = H(taskId ∥ modelRoot ∥ inputRoot ∥ policyRoot)',
    icon: 'receipt',
    tone: 'chain',
  },
  {
    index: '02',
    actor: 'PoI Worker',
    title: '异步提供推理',
    detail: 'a3s-box 固定边界，a3s-power 保护模型与数据',
    formula: 'rExec = SignW(T ∥ outputRoot ∥ πexec ∥ nonce)',
    icon: 'brain',
    tone: 'compute',
  },
  {
    index: '03',
    actor: 'Validator',
    title: '形成门限裁决',
    detail: '分别验证执行证明与业务结果',
    formula: 'R = QC(H(T ∥ rExec ∥ verdictRoot))',
    icon: 'eye',
    tone: 'verify',
  },
  {
    index: '04',
    actor: '链上 ACVM',
    title: '恢复合约并结算',
    detail: '先验证门限裁决，再用 taskKey 防止重复恢复合约',
    formula: 'taskKey = H(taskId ∥ outputRoot ∥ nonce)\nAccept ⇔ Verify(R) ∧ ¬Spent(taskKey)\n(Sₙ₊₁, PoIₙ₊₁) = (δACVM(Sₙ, AcceptedResult), UpdateBounded(PoIₙ, ValidPoI))',
    icon: 'shield',
    tone: 'chain',
  },
] as const satisfies readonly {
  index: string;
  actor: string;
  title: string;
  detail: string;
  formula: string;
  icon: IconName;
  tone: 'chain' | 'compute' | 'verify';
}[];

export function AcvmNativeChainArchitecture() {
  return (
    <ProgressiveTechnicalFlow
      code="Rust 原生链 / ACVM 异步推理算法"
      status="推理不阻塞出块"
      className="native-chain-panel native-chain-algorithm-panel principle-panel"
      stages={nativeAlgorithmStages}
      ariaLabel="Rust 原生 ACVM 链的四个执行步骤"
      footer={(
        <footer className="progressive-flow-footer is-native">
          <span><small>链上任务状态</small><strong>发布任务 → 等待推理 → 验收通过 → 合约继续</strong></span>
          <b>区块不等待模型</b>
        </footer>
      )}
    />
  );
}
