import { AsciiFlowControls, type BusinessProcessStage } from './BusinessProcessFlow';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

const fogFlowStages = [
  { index: '01', label: '接收调用', actor: 'ACVM + Fog Scheduler', action: '接收 ANS 服务卡、任务策略和推理模式', detail: '任务携带 imageRoot、capabilityRoot、TEE 等级、GPU 需求、位置、截止时间以及 single 或 MoE 模式。', input: 'Verified ServiceCard + Agentic Task', output: 'Node / ExpertGroup Query', state: 'FUNDED → SCHEDULING', icon: 'receipt', tone: 'violet' },
  { index: '02', label: '选择执行组', actor: 'Fog Scheduler', action: '筛选单节点或同域低时延 MoE 专家组', detail: '安全与资源是硬约束；MoE 还需控制路由节点到 Top-k 专家的激活传输时延。', input: 'Node Offers + Task Policy + Network RTT', output: 'Ranked Node / ExpertGroup', state: 'SCHEDULING → RANKED', icon: 'eye', tone: 'violet' },
  { index: '03', label: '组内远程证明', actor: 'a3s-box + TEE', action: '逐节点核验硬件、代码度量和随机挑战', detail: '单节点签发 FogLease；MoE 专家组签发 ExpertGroupLease，任一必要节点证明失败都会重新调度。', input: 'Node Quotes + nonce + policyRoot', output: 'Lease + AttestationOK', state: 'RANKED → ATTESTED', icon: 'shield', tone: 'violet' },
  { index: '04', label: '分离式隐私推理', actor: 'Router + a3s-box + a3s-use + a3s-power', action: '路由 Top-k 专家并在各 TEE 内加载加密专家分片', detail: 'a3s-use 热插拔专家端点，a3s-power 只加载命中的专家参数；激活值通过加密低时延链路传输。', input: 'AgentImage.enc + Lease + Encrypted Activations', output: 'Merged Result + Σπexpert', state: 'ATTESTED → SUBMITTED', icon: 'brain', tone: 'green' },
  { index: '05', label: '返回组合证据', actor: 'Fog Expert Group + PoI Worker', action: '提交路由、专家和合并结果的组合回执', detail: '链上智能体 PoI 验证器核验 routeRoot、每个专家回执和最终 outputRoot，并据有效贡献分配收益。', input: 'routeRoot + Expert Receipts + Result', output: 'outputRoot + πgroup', state: 'SUBMITTED → EVIDENCE_READY', icon: 'key', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function FogInferenceArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(fogFlowStages.length, 3000);
  const current = fogFlowStages[activeStep];

  return (
    <div className="fog-ascii-shell" ref={rootRef}>
      <LearningPanel code="雾计算网络 / 单节点与 MoE 专家组调度" status="同域低时延 · TEE · Top-k 专家并行" className="fog-inference-panel fog-ascii-panel principle-panel">
        <AsciiFlowControls stages={fogFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="雾计算网络从接收 ANS 调用到选择单节点或 MoE 专家组、完成组内远程证明、分离式隐私推理并返回组合 PoI 证据的五个步骤" />
        <div className={`fog-ascii-boundary ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <section className="fog-ascii-local">
            <header><code>┌─ 上海雾计算域 / <WorkflowTerm term="MoE" /> Expert Offers ─────────┐</code></header>
            <div className="fog-ascii-raw ascii-workflow-node"><span>[ 候选角色 ]</span><code>SH-07　ROUTER+SHARED · TDX · A100 · Rep 92<br />SH-09　EXPERT-2 · TDX · L40S · RTT 1.8ms<br />SH-11　EXPERT-7 · TDX · L40S · RTT 2.1ms</code></div>
            <i aria-hidden="true">────────◆────────▶</i>
            <div className="fog-ascii-vm ascii-workflow-node">
              <strong>[ Fog Scheduler / 选择同域专家组 ]</strong>
              <code>ROUTER SH-07　TOP-K E2@SH-09 + E7@SH-11　TEE ✓</code>
              <WorkflowFormula formula="group* = argmax(ComputeMatch + ExpertHit − λ·NetworkLatency)" title="MoE 专家组匹配规则" summary="先满足 TEE、模型版本和显存等硬约束，再优先选择命中专家齐全且网络时延更低的同域执行组。" details={[{ label: 'ExpertHit', value: '所需专家已预热或可快速加载' }, { label: 'λ', value: '网络时延在任务中的惩罚系数' }]} />
            </div>
            <footer><code>└─ WAN EXPERT REJECTED / RTT BUDGET &gt; 8ms ───────────────┘</code></footer>
          </section>
          <div className="fog-ascii-egress"><b aria-hidden="true">────◆────▶</b><code><WorkflowTerm term="ExpertGroupLease" /> + Attestations</code></div>
          <section className="fog-ascii-external ascii-workflow-node"><small>[ TEE Expert Group / a3s-box ]</small><strong>Router → TopK(E2 ∥ E7) → Merge</strong><code>a3s-use endpoints · a3s-power active experts<br />OUT: outputRoot + πgroup</code></section>
          <footer><code>当前 / {current.label} / {current.state}</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>调度结果</small><code>{current.output}</code></span><strong>同域专家并行才加速；跨地域时网络成本可能抵消收益</strong></footer>
      </LearningPanel>
    </div>
  );
}
