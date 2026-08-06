import { AsciiFlowControls, type BusinessProcessStage } from './BusinessProcessFlow';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

const ansFlowStages = [
  { index: '01', label: '唯一身份', actor: 'ANS Identity', action: '注册 Agent DID', detail: '密钥可轮换，履历不丢失。', input: 'DID + PublicKey', output: 'Agent ID', state: 'UNREGISTERED → IDENTIFIED', icon: 'fingerprint', tone: 'violet' },
  { index: '02', label: '发布服务', actor: '企业 + Agent', action: '签名发布镜像、能力和交易条件', detail: '服务卡绑定 imageRoot、capabilityRoot、价格、TEE 要求和有效期。', input: 'Agent ID + AgentImage + CapabilityRefs', output: 'SignedServiceCard', state: 'IDENTIFIED → DISCOVERABLE', icon: 'brain', tone: 'violet' },
  { index: '03', label: '用户发现', actor: '用户 + ANS Resolver', action: '按任务条件解析并验签服务卡', detail: 'ANS 返回身份、版本、能力、价格和执行要求，不返回智能体明文代码。', input: 'Task Query', output: 'Verified ServiceCard', state: 'QUERY → VERIFIED SERVICE', icon: 'eye', tone: 'violet' },
  { index: '04', label: '履历评分', actor: 'Reputation Index', action: '按已验收任务计算分能力信誉', detail: '完成率、质量、协作和争议分开计量。', input: 'ValidPoI History', output: 'Reputation Vector', state: 'VERIFIED SET → RANKED SET', icon: 'shield', tone: 'green' },
  { index: '05', label: '协作组队', actor: 'Coordinator Agent', action: '按能力互补组合任务团队', detail: '分工和收益比例事前公开。', input: 'Ranked Agents + TaskGraph', output: 'Signed Team Plan', state: 'RANKED SET → TEAM FUNDED', icon: 'chain', tone: 'green' },
  { index: '06', label: '奖励更新', actor: 'ACVM + ANS', action: '按结果分账并更新信誉', detail: '奖励真实贡献，造假影响保证金和信誉。', input: 'AcceptedResult + splitRoot', output: 'Rewards + New Reputation', state: 'TEAM FUNDED → REWARDED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function AgentResolutionArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(ansFlowStages.length, 3300);
  const current = ansFlowStages[activeStep];

  return (
    <div className="ans-ascii-shell" ref={rootRef}>
      <LearningPanel code="ANS / 智能体服务发现" status="身份 · 镜像 · 能力 · 履历可核验" className="ans-panel ans-ascii-panel principle-panel">
        <AsciiFlowControls stages={ansFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="ANS 智能体网络的六个步骤" />
        <div className={`ans-ascii-network ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ ANS://agent-service-network / imageRoot + capabilityRoot ───┐</code></header>
          <div className="ans-ascii-discovery">
            <span className="is-identity ascii-workflow-node">[<WorkflowTerm term="DID" label="did:agent:7f2" /> + <WorkflowTerm term="SignedServiceCard" label="服务卡" />]</span><i>── imageRoot + capabilityRoot ──▶</i>
            <span className="is-resolver ascii-workflow-node">[<WorkflowTerm term="ANS" label="ANS Resolver" />]</span><i>◀── capability + price + SLA ──</i>
            <span className="is-query ascii-workflow-node">[用户 / Task Query]</span>
          </div>
          <div className="ans-ascii-workspace">
            <section className="ans-ascii-scoreboard ascii-workflow-node">
              <header><code>[ 已验证履历 / 分能力评分 ]</code></header>
              <span><b>Agent-7f2</b><i>研究 ████████░ 86</i><em>协作 92</em></span>
              <span><b>Agent-a31</b><i>推理 █████████ 94</i><em>协作 88</em></span>
              <span><b>Agent-c08</b><i>复核 ███████░░ 79</i><em>协作 96</em></span>
              <footer><WorkflowFormula formula="score = 完成率 + 质量 + 协作 − 争议" title="ANS 分能力信誉评分" summary="评分只使用已经验收的历史任务，并按能力类别分别计算，避免把无关任务混成一个总分。" /></footer>
            </section>
            <section className="ans-ascii-team ascii-workflow-node">
              <header><code>[ TaskGraph / 协作团队 ]</code></header>
              <div><span>[研究 7f2]</span><i>╲</i><strong>[协调 Agent]</strong><i>╱</i><span>[推理 a31]</span></div>
              <div><b>└──────────▶ [复核 c08] ◀──────────┘</b></div>
              <footer><WorkflowFormula formula="splitRoot = 35% / 45% / 20%" title="协作团队分账承诺" summary="组队时先固定成员、任务分工和收益比例，AcceptedResult 形成后按同一 splitRoot 自动分账。" /></footer>
            </section>
          </div>
          <div className="ans-ascii-reward"><span className="ascii-workflow-node">[<WorkflowTerm term="AcceptedResult" />]</span><i>──▶</i><strong className="ascii-workflow-node">[按贡献分账]</strong><i>──▶</i><span className="ascii-workflow-node">[信誉更新]</span></div>
          <footer><code>└─ 当前 / {current.label} / {current.state} ─────────────────────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>当前产出</small><code>{current.output}</code></span><strong>ANS 找到智能体服务；雾计算网络继续选择执行节点</strong></footer>
      </LearningPanel>
    </div>
  );
}
