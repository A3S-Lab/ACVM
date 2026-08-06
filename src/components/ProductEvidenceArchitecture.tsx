import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';
import { AsciiFlowControls, type BusinessProcessStage } from './BusinessProcessFlow';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowTerm } from './WorkflowHint';

const proofLandscape = [
  {
    project: 'Bittensor / Allora',
    target: '服务或预测的相对质量',
    judge: 'Validator / Reputer 评分、损失与 stake 聚合',
    outcome: '分配网络激励',
  },
  {
    project: 'Gensyn Verde / EigenAI',
    target: '声明模型的执行忠实性',
    judge: '可复现重跑、挑战与争议定位',
    outcome: '验执行，不验业务目标',
  },
  {
    project: 'EigenLayer AVS',
    target: 'Operator 对 AVS 规则的响应',
    judge: 'Operator quorum、挑战与 slashing',
    outcome: '提供经济安全底座',
  },
  {
    project: 'ChainOpera PoI',
    target: '数据、计算、模型与 Agent 贡献',
    judge: '协议定义的贡献计量与验证',
    outcome: '面向生态的广义贡献账',
  },
  {
    project: 'ACVM',
    target: '签名订单约定的业务结果',
    judge: '事前验收策略、独立 Validator 与挑战',
    outcome: 'PoI 触发结算并计量贡献',
  },
] as const;

export function PoiLandscapeArchitecture() {
  return (
    <LearningPanel code="AI + BLOCKCHAIN / PROOF LANDSCAPE" status="COMPARE THE PREDICATE" className="poi-landscape">
      <header className="poi-landscape-question">
        <span><Icon name="fingerprint" /><small>TECHNICAL REVIEW</small></span>
        <strong>验证命题不同，经济结果也不同</strong>
      </header>
      <div className="poi-landscape-table" role="table" aria-label="AI 区块链工程机制比较">
        <div className="poi-landscape-row is-header" role="row">
          <span role="columnheader">工程</span>
          <span role="columnheader">证明对象</span>
          <span role="columnheader">裁决方法</span>
          <span role="columnheader">直接结果</span>
        </div>
        {proofLandscape.map((item) => (
          <div className={`poi-landscape-row ${item.project === 'ACVM' ? 'is-acvm' : ''}`} role="row" key={item.project}>
            <strong role="cell">{item.project}</strong>
            <span role="cell">{item.target}</span>
            <span role="cell">{item.judge}</span>
            <b role="cell">{item.outcome}</b>
          </div>
        ))}
      </div>
      <footer>
        <Icon name="shield" />
        <span><small>ACVM 补的空位</small><strong>把“执行过”推进到“结果达标，因此可以结算”</strong></span>
        <code>AcceptedResult → ValidPoI → Settlement / Weight</code>
      </footer>
    </LearningPanel>
  );
}

const integrationFlowStages = [
  { index: '01', label: '产生标准事件', actor: 'ACVM Core', action: '把任务、裁决和 PoI 变成统一状态事件', detail: '上层业务只使用 ACVM 的标准身份、任务状态和终局语义，不直接依赖某条链的接口。', input: 'Task + Verdict + ValidPoI', output: 'ACVM StandardEvent', state: 'ACVM STATE → STANDARD EVENT', icon: 'receipt', tone: 'violet' },
  { index: '02', label: '映射链上语义', actor: 'ChainAdapter', action: '把身份、事件、证明和终局映射为目标链接口', detail: 'Adapter 负责字段和调用语义转换，但不会修改 ACVM 的验收规则和业务状态机。', input: 'ACVM StandardEvent', output: 'TargetChain Transaction', state: 'STANDARD EVENT → ADAPTED TX', icon: 'spark', tone: 'violet' },
  { index: '03', label: '提交目标链', actor: '目标链 Driver', action: '调用对应 SDK 广播交易并跟踪回执', detail: '长安链、FISCO BCOS、星火链网或 BSN 分别实现自己的 Driver。', input: 'TargetChain Transaction', output: 'txHash + chain receipt', state: 'ADAPTED TX → PENDING', icon: 'chain', tone: 'green' },
  { index: '04', label: '回写终局', actor: 'ChainAdapter', action: '把目标链确认结果转换回 ACVM 标准终局', detail: '业务层只接收成功、失败和终局高度，不需要理解不同链的确认机制。', input: '目标链回执 + finality', output: 'ACVM FinalizedEvent', state: 'PENDING → FINALIZED', icon: 'check', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function AcvmIntegrationArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(integrationFlowStages.length, 3100);
  const current = integrationFlowStages[activeStep];

  return (
    <div className="adapter-ascii-shell" ref={rootRef}>
      <LearningPanel code="ChainAdapter / 协议翻译与终局回写" status="一个 ACVM 状态 · 多条目标链" className="acvm-integration integration-simple adapter-ascii-panel principle-panel">
        <AsciiFlowControls stages={integrationFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="ACVM 标准事件经过 ChainAdapter 映射、目标链 Driver 提交并回写终局的四步流程" />
        <div className={`adapter-ascii-bridge ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ ACVM StandardEvent → ChainAdapter → Target Finality ─────────┐</code></header>
          <div className="adapter-ascii-forward">
            <section className="is-event ascii-workflow-node">
              <small>[ ACVM 标准事件 ]</small>
              <code><WorkflowTerm term="taskId" />　verdict　validPoiRoot<br />subjectDID　state　proofRef</code>
            </section>
            <i aria-hidden="true">────◆────▶</i>
            <section className="is-map ascii-workflow-node">
              <small>[ <WorkflowTerm term="ChainAdapter" /> 映射 ]</small>
              <span><b>identity</b><code>→ account / cert</code></span>
              <span><b>event</b><code>→ tx / contract call</code></span>
              <span><b>finality</b><code>→ height / QC</code></span>
            </section>
            <i aria-hidden="true">────◆────▶</i>
            <section className="is-drivers ascii-workflow-node">
              <small>[ <WorkflowTerm term="Driver" /> ]</small>
              <code>长安链　FISCO BCOS<br />星火链网　BSN</code>
            </section>
          </div>
          <div className="adapter-ascii-return"><span className="ascii-workflow-node">[目标链 txHash + receipt + finality]</span><i>◀──────── 标准终局回写 ────────</i><strong className="ascii-workflow-node">[ACVM FinalizedEvent]</strong></div>
          <footer><code>└─ 当前 / {current.label} / {current.state} / {current.output} ─────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>当前产出</small><code>{current.output}</code></span><strong>每条链只实现 Driver，ACVM 验收规则保持不变</strong></footer>
      </LearningPanel>
    </div>
  );
}
