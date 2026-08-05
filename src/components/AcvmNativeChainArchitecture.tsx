import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

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
    formula: 'taskKey = H(taskId ∥ outputRoot ∥ nonce); Accept ⇔ Verify(R) ∧ ¬Spent(taskKey)',
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
    <LearningPanel code="Rust 原生链 / ACVM 异步推理算法" status="推理不阻塞出块，裁决确定性终局" className="native-chain-panel native-chain-algorithm-panel principle-panel">
      <div className="native-chain-service-flow" aria-label="链上 ACVM 异步发布任务，PoI Worker 提供推理，Validator 形成门限裁决，ACVM 恢复合约并更新 PoI">
        {nativeAlgorithmStages.map((stage, stageIndex) => (
          <span className={`native-chain-service-fragment is-${stage.tone}`} key={stage.index}>
            <section>
              <header><b>{stage.index}</b><Icon name={stage.icon} /></header>
              <small>{stage.actor}</small>
              <strong>{stage.title}</strong>
              <p>{stage.detail}</p>
              <code>{stage.formula}</code>
            </section>
            {stageIndex < nativeAlgorithmStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <div className="native-chain-state-machine">
        <span><small>链上任务状态</small><code>Requested → AwaitingInference → Accepted → Resumed / Settled</code></span>
        <b>区块不等待模型</b>
      </div>

      <footer className="native-chain-service-result">
        <code>Sₙ₊₁ = δACVM(Sₙ, outputRoot, AcceptedResult)</code>
        <i aria-hidden="true">+</i>
        <code>PoIₙ₊₁ = UpdateBounded(PoIₙ, ValidPoI)</code>
      </footer>
    </LearningPanel>
  );
}
