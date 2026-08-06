import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

const nativeServiceStages = [
  { index: '01', label: '链上发布任务', actor: 'ACVM Runtime / Agentic Contract', packet: 'InferenceRequested(C)', description: 'Runtime 把完整规则承诺 C 写入链上事件，让合约进入等待状态；区块继续生成。', state: 'RUNNING → AWAITING_INFERENCE', icon: 'receipt' },
  { index: '02', label: 'PoI Worker 推理', actor: 'a3s-box / a3s-use / a3s-power', packet: 'rPriv + outputRoot', description: 'PoI Worker 在隔离环境中加载智能体与授权能力，由 a3s-power 在 TEE 内完成隐私推理，只返回结果根和执行回执。', state: 'CLAIMED → INFERRED', icon: 'brain' },
  { index: '03', label: '验证智能体裁决', actor: 'Agent PoI Validator Set', packet: 'ResultCertificate R', description: '链上注册的验证智能体检查隐私回执和独立业务证据，达到法定人数后形成结果证书 R。', state: 'INFERRED → ACCEPTED', icon: 'shield' },
  { index: '04', label: 'Runtime 恢复合约', actor: 'ACVM Runtime', packet: 'δACVM + payout + ValidPoI', description: 'Runtime 验证 R 和 taskKey，恢复 Agentic Contract、执行结算，并记录 ValidPoI；BFT Validator 再确认区块终局。', state: 'ACCEPTED → RESUMED / SETTLED', icon: 'check' },
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
      <LearningPanel code="Rust 原生链 / ACVM Runtime" status="PoI Worker 推理 · Agent Validator 验收 · BFT Validator 终局" className="native-chain-panel native-ascii-panel principle-panel">
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
          <header><code>┌─ ACVM / Runtime 链上执行 × PoI Worker 链下推理 ───────────────┐</code></header>
          <div className="native-ascii-map">
            <section className={`native-ascii-node ascii-workflow-node is-contract ${nodeState(activeStep, 0)}`}>
              <small>[ ACVM Runtime / <WorkflowTerm term="AgenticContract" label="链上 Agentic Contract" /> ]</small>
              <strong>发布推理请求</strong>
              <WorkflowFormula formula="C = H(domain ∥ taskId ∥ inputRoot ∥ modelRoot ∥ policyRoot ∥ verifyRuleRoot ∥ splitRoot ∥ nonce)" title="统一规则承诺" summary="PoI Worker、验证智能体和 ACVM Runtime 都引用同一个承诺 C，防止执行途中替换模型、权限、验收或分账规则。" details={[{ label: 'domain', value: 'chainId、Runtime 版本和合约根' }, { label: 'taskId', value: '唯一任务编号' }, { label: 'nonce', value: '本次任务的新鲜随机值' }]} />
            </section>

            <div className={`native-ascii-link is-request ${activeStep === 0 ? 'is-active' : ''} ${activeStep > 0 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>InferenceRequested(C)</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-poi ${nodeState(activeStep, 1)}`}>
              <small>[ 链下 / <WorkflowTerm term="PoI" label="PoI Worker 服务池" /> ]</small>
              <strong>a3s-box 解密 · a3s-use 热插拔 · a3s-power 隐私推理</strong>
              <code>AgentImage.enc + capabilityRoot → TEE；只提交 outputRoot + πpriv</code>
            </section>

            <div className={`native-ascii-link is-receipt ${activeStep === 1 ? 'is-active' : ''} ${activeStep > 1 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>rPriv + outputRoot</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-validator ${nodeState(activeStep, 2)}`}>
              <small>[ 链上 / 智能体 PoI 验证器组 ]</small>
              <strong>Verifier-A · Verifier-B · Verifier-C</strong>
              <WorkflowFormula formula="R = QC(H(C ∥ rPriv ∥ verdictRoot))" title="链上结果证书" summary="验证智能体只有在执行回执与业务结果都通过时才签名；达到法定人数后，签名聚合为结果证书 R。" details={[{ label: 'rPriv', value: '与规则承诺 C 绑定的隐私执行回执' }, { label: 'verdictRoot', value: '独立业务验收结果根' }, { label: 'QC', value: '验证智能体的法定人数证书' }]} />
            </section>

            <div className={`native-ascii-link is-result ${activeStep === 2 ? 'is-active' : ''} ${activeStep > 2 ? 'is-complete' : ''}`}>
              <b aria-hidden="true">│<br />◆<br />▼</b><code>ResultCertificate R</code>
            </div>

            <section className={`native-ascii-node ascii-workflow-node is-resume ${nodeState(activeStep, 3)}`}>
              <small>[ ACVM 链上恢复 ]</small>
              <strong>合约继续执行 · 结果付款 · PoI 计量</strong>
              <WorkflowFormula formula="(Sₙ₊₁, PoIₙ₊₁) = (δACVM(Sₙ, R), UpdateBounded(PoIₙ, ValidPoI))" title="链上 ACVM 恢复算法" summary="结果证书 R 通过且 taskKey 未消费时，ACVM 从等待状态恢复：更新业务状态、执行付款，并记录本次 ValidPoI。" />
            </section>
          </div>
          <footer><code>└─ 当前 / {current.actor} / {current.packet} / {current.state} ─────────┘</code></footer>
        </div>

        <footer className="native-ascii-explainer">
          <span><Icon name={current.icon} /><strong>{current.label}</strong><small>{current.description}</small></span>
          <b>模型推理不进入区块重放；Runtime 只执行确定性状态转换</b>
        </footer>
      </LearningPanel>
    </div>
  );
}
