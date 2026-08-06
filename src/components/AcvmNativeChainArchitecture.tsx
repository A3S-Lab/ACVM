import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

const nativeServiceStages = [
  { index: '01', label: '链上发布任务', actor: 'ACVM Runtime / Agentic Contract', packet: 'InferenceRequested(T)', description: 'ACVM Runtime 执行 Agentic Contract，把任务承诺写入链上事件，并让合约进入等待推理状态；区块继续生成。', state: 'RUNNING → AWAITING_INFERENCE', icon: 'receipt' },
  { index: '02', label: '链下隐私计算', actor: 'a3s-box / a3s-use / a3s-power', packet: 'outputRoot + πpriv', description: 'PoI Worker 在 a3s-box 的 TEE 边界内解密 a3s-code 镜像，a3s-use 热插拔授权能力，a3s-power 按层加载模型参数；隐私数据不离开受保护域。', state: 'CLAIMED → INFERRED', icon: 'brain' },
  { index: '03', label: '链上智能体验证', actor: 'Agent PoI Validator Set', packet: 'AcceptedResult + QC', description: '链上注册的智能体 PoI 验证器分别核验隐私计算回执和独立业务证据，达到法定人数后形成 AcceptedResult。', state: 'INFERRED → ACCEPTED', icon: 'shield' },
  { index: '04', label: '恢复合约结算', actor: 'ACVM Runtime', packet: 'δACVM + payout + ValidPoI', description: '链上验证 QC 和 taskKey 后恢复合约，更新业务状态、执行付款，并把本次有效推理计入 PoI。', state: 'ACCEPTED → RESUMED / SETTLED', icon: 'check' },
] as const satisfies readonly { index: string; label: string; actor: string; packet: string; description: string; state: string; icon: IconName }[];

function nodeState(activeStep: number, nodeStep: number) {
  if (activeStep === nodeStep) return 'is-active';
  if (activeStep > nodeStep) return 'is-complete';
  return '';
}

export function AcvmNativeChainArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(nativeServiceStages.length, 3300);
  const current = nativeServiceStages[activeStep];

  return (
    <div className="native-ascii-shell" ref={rootRef}>
      <LearningPanel code="Rust 原生链 / ACVM Runtime" status="链下隐私计算 · 链上智能体验证" className="native-chain-panel native-ascii-panel principle-panel">
        <div className="native-ascii-controls">
          <nav aria-label="ACVM Runtime 调用链下隐私计算并由链上智能体 PoI 验证器裁决的四步流程">
            {nativeServiceStages.map((stage, index) => (
              <span key={stage.index}>
                <button type="button" className={`${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-complete' : ''}`} onClick={() => selectStep(index)}>
                  [{stage.index} {stage.label}]
                </button>
                {index < nativeServiceStages.length - 1 ? <i className={index < activeStep ? 'is-complete' : ''} aria-hidden="true">──▶</i> : null}
              </span>
            ))}
          </nav>
          <button type="button" onClick={togglePlayback} aria-label={isPlaying ? '暂停原生链流程动画' : '继续播放原生链流程动画'}><Icon name={isPlaying ? 'pause' : 'play'} />{isPlaying ? '暂停' : '播放'}</button>
        </div>

        <div className={`native-ascii-topology ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ ACVM / 链下隐私计算 × 链上智能体 PoI 验证 ───────────────────┐</code></header>
          <div className="native-ascii-map">
            <section className={`native-ascii-node ascii-workflow-node is-contract ${nodeState(activeStep, 0)}`}>
              <small>[ ACVM Runtime / <WorkflowTerm term="AgenticContract" label="链上 Agentic Contract" /> ]</small>
              <strong>发布推理请求</strong>
              <WorkflowFormula formula="T = H(taskId ∥ modelRoot ∥ inputRoot ∥ policyRoot)" title="链上推理任务承诺" summary="把唯一任务、模型、输入和策略版本压成同一个任务承诺 T，PoI Worker 和 Validator 都必须引用它。" details={[{ label: 'taskId', value: '唯一任务编号' }, { label: 'modelRoot', value: '模型版本承诺' }, { label: 'inputRoot', value: '输入承诺' }, { label: 'policyRoot', value: '执行与验收策略承诺' }]} />
            </section>

            <div className={`native-ascii-link is-request ${activeStep === 0 ? 'is-active' : ''} ${activeStep > 0 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>InferenceRequested(T)</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-poi ${nodeState(activeStep, 1)}`}>
              <small>[ 链下 / <WorkflowTerm term="PoI" label="PoI 模型推理服务池" /> ]</small>
              <strong>a3s-box 解密 · a3s-use 热插拔 · a3s-power 隐私推理</strong>
              <code>AgentImage.enc + capabilityRoot → TEE；只提交 outputRoot + πpriv</code>
            </section>

            <div className={`native-ascii-link is-receipt ${activeStep === 1 ? 'is-active' : ''} ${activeStep > 1 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>outputRoot + πpriv</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-validator ${nodeState(activeStep, 2)}`}>
              <small>[ 链上 / 智能体 PoI 验证器组 ]</small>
              <strong>Verifier-A · Verifier-B · Verifier-C</strong>
              <WorkflowFormula formula="AcceptedResult ⇔ ExecOK ∧ Σᵥ 𝟙[Voteᵥ = PASS] ≥ q" title="链上智能体验证算法" summary="隐私计算回执有效且验证智能体的合格票达到法定人数 q，链上才生成 AcceptedResult。" details={[{ label: 'ExecOK', value: '链下隐私计算回执通过验证' }, { label: 'Voteᵥ', value: '第 v 个验证智能体的签名判断' }, { label: 'q', value: '形成终局所需的法定人数' }]} />
            </section>

            <div className={`native-ascii-link is-result ${activeStep === 2 ? 'is-active' : ''} ${activeStep > 2 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>AcceptedResult + QC</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-resume ${nodeState(activeStep, 3)}`}>
              <small>[ ACVM 链上恢复 ]</small>
              <strong>合约继续执行 · 结果付款 · PoI 计量</strong>
              <WorkflowFormula formula="(Sₙ₊₁, PoIₙ₊₁) = (δACVM(Sₙ, AcceptedResult), UpdateBounded(PoIₙ, ValidPoI))" title="链上 ACVM 恢复算法" summary="AcceptedResult 通过后，ACVM 从等待状态恢复：更新业务状态、执行付款，并把本次有效推理计入有界 PoI。" />
            </section>
          </div>
          <footer><code>└─ 当前 / {current.actor} / {current.packet} / {current.state} ─────────┘</code></footer>
        </div>

        <footer className="native-ascii-explainer">
          <span><Icon name={current.icon} /><strong>{current.label}</strong><small>{current.description}</small></span>
          <b>ACVM 是链上 Agentic Contract 的 Runtime</b>
        </footer>
      </LearningPanel>
    </div>
  );
}
