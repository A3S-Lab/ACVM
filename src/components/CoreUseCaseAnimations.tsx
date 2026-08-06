import type { CSSProperties } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { AsciiFlowControls, type BusinessProcessStage } from './BusinessProcessFlow';
import { WorkflowFormula, WorkflowTerm } from './WorkflowHint';

type ServiceStep = {
  label: string;
  title: string;
  actor: string;
  description: string;
  evidence: string;
  state: string;
  icon: IconName;
};

const geoFlowStages = [
  { index: '01', label: '冻结基线', actor: '品牌方 + 链上 ACVM 验证智能体', action: '把提升目标写成可以复测的链上验收条件', detail: '固定测试问题、当前引用率、观察周期和增量门槛，并将 querySetRoot 与 baselineRoot 写入订单。', input: '问题集 + 当前引用率 14.2%', output: '链上基线与 +8pp 门槛', state: 'CREATED → FUNDED', icon: 'lock', tone: 'violet' },
  { index: '02', label: '执行优化', actor: 'GEO Agent', action: '改进站点内容并提交发布记录', detail: '页面改动、可引用材料和站点快照绑定到同一个 taskId。', input: '已冻结的 GEO 订单', output: '新内容 + 发布回执', state: 'FUNDED → RUNNING', icon: 'brain', tone: 'violet' },
  { index: '03', label: '发起独立复测', actor: '链上 ACVM 验证智能体', action: '按冻结问题集发布复测任务并选择独立观察智能体', detail: '验证智能体通过 ANS 选择与 GEO 执行方无利益关联的观察节点，并把查询版本、窗口和排除规则写入任务。', input: 'querySetRoot + 新站点版本', output: '链上 ObservationTask', state: 'RUNNING → VERIFYING', icon: 'eye', tone: 'green' },
  { index: '04', label: '链上验证增量', actor: 'ACVM 验证智能体 + PoI 观察节点', action: '收集签名查询回执，并按固定公式计算真实增量', detail: '观察节点访问实际 AI 引擎并返回证据；链上智能体验签、检查法定人数，再计算 25.8% − 14.2% = 11.6pp。', input: 'SignedObservation[] + baselineRoot', output: 'AcceptedResult · +11.6pp', state: 'VERIFYING → ACCEPTED', icon: 'shield', tone: 'green' },
  { index: '05', label: '结果付费', actor: 'ACVM', action: '只对已经验证的引用提升释放费用', detail: '裁决终局后，按订单约定的每个百分点价格计算并支付结果费。', input: 'AcceptedResult + 计价规则', output: '结果费 ¥116,000', state: 'ACCEPTED → FINALIZED', icon: 'receipt', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

const simulationSteps: readonly ServiceStep[] = [
  {
    label: '冻结假设',
    title: '先固定问题，再运行沙盘',
    actor: '研究方 + Validator',
    description: '政策版本、模型清单、样本快照、抽样方法、随机种子和隐私预算共同签名。',
    evidence: 'policyRoot · modelRoot · vrfProof',
    state: 'CREATED → FUNDED',
    icon: 'lock',
  },
  {
    label: '隔离仿真',
    title: '各类 Agent 在私有域内响应',
    actor: 'Institution · Enterprise · Citizen',
    description: '政策密文只在获授权环境中解封；个体画像、判断和轨迹不离开隔离域。',
    evidence: 'attestation · trajectoryRoot',
    state: 'FUNDED → RUNNING',
    icon: 'brain',
  },
  {
    label: '安全聚合',
    title: '只让群体统计穿过边界',
    actor: 'MPC Aggregators',
    description: '多方聚合加密判断，公开总体指标和置信区间，不公开任何个体意见。',
    evidence: 'aggregationTranscriptRoot',
    state: 'RUNNING → SUBMITTED',
    icon: 'chain',
  },
  {
    label: '独立复核',
    title: '检查是否按声明的实验运行',
    actor: 'Independent Validators',
    description: '复核模型、样本、种子、重复实验与统计管线；不把模拟结论冒充现实真相。',
    evidence: 'replayRoot · validatorQC',
    state: 'SUBMITTED → ACCEPTED',
    icon: 'shield',
  },
  {
    label: '发布结论',
    title: '公开可审计的决策证据',
    actor: 'ACVM Settlement',
    description: '发布 48.0% ± 2.4pp 的群体结果及证据根；通过验收的仿真服务才结算。',
    evidence: 'resultRoot · receiptRoot',
    state: 'ACCEPTED → FINALIZED',
    icon: 'receipt',
  },
];

function PlaybackButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }) {
  return (
    <button className="service-play-control" type="button" onClick={onClick} aria-label={isPlaying ? '暂停流程动画' : '播放流程动画'}>
      <Icon name={isPlaying ? 'pause' : 'play'} />
      {isPlaying ? '暂停' : '播放'}
    </button>
  );
}

function StageNavigation({
  steps,
  activeStep,
  onSelect,
}: {
  steps: readonly ServiceStep[];
  activeStep: number;
  onSelect: (index: number) => void;
}) {
  const progress = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <nav className="service-stage-nav" aria-label="场景演示步骤" style={{ '--service-progress': `${progress}%` } as CSSProperties}>
      <i className="service-stage-track" aria-hidden="true"><b /></i>
      {steps.map((step, index) => (
        <button
          type="button"
          className={`${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-complete' : ''}`}
          aria-current={index === activeStep ? 'step' : undefined}
          onClick={() => onSelect(index)}
          key={step.label}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <i><Icon name={index < activeStep ? 'check' : step.icon} /></i>
          <strong>{step.label}</strong>
        </button>
      ))}
    </nav>
  );
}

function StepInspector({ step, index, total }: { step: ServiceStep; index: number; total: number }) {
  return (
    <aside className="service-step-inspector">
      <header>
        <span><small>CURRENT STEP</small><strong>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</strong></span>
        <Icon name={step.icon} />
      </header>
      <h3>{step.title}</h3>
      <p>{step.description}</p>
      <dl>
        <div><dt>当前责任方</dt><dd>{step.actor}</dd></div>
        <div><dt>新增证据</dt><dd><code>{step.evidence}</code></dd></div>
        <div><dt>任务状态</dt><dd><code>{step.state}</code></dd></div>
      </dl>
    </aside>
  );
}

export function GeoVerificationArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(geoFlowStages.length, 3200);
  const current = geoFlowStages[activeStep];

  return (
    <div className="geo-ascii-shell" ref={rootRef}>
      <LearningPanel code="GEO / 链上 ACVM 效果验证" status="14.2% → 25.8% · +11.6pp" className="geo-proof-simple geo-ascii-panel principle-panel">
        <AsciiFlowControls stages={geoFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="GEO 链上验证的五个步骤" />
        <div className={`geo-ascii-verifier ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ ACVM::GEO_VERIFY_AGENT / taskId 0xGEO-2048 ───────────────┐</code></header>
          <div className="geo-ascii-metrics">
            <span className="is-baseline"><b>基线</b><i><em /></i><strong>14.2%</strong></span>
            <span className="is-threshold"><b>门槛</b><i><em /></i><strong>+8.0pp</strong></span>
            <span className="is-observed"><b>复测</b><i><em /></i><strong>25.8%</strong></span>
            <span className="is-delta"><b>增量</b><i aria-hidden="true">────────◆──────▶</i><strong>+11.6pp / ACCEPTED</strong></span>
          </div>
          <div className="geo-ascii-route" aria-label="GEO 执行智能体提交站点版本，链上 ACVM 验证智能体发布观察任务，PoI 观察节点返回签名回执，ACVM 计算增量并结算">
            <span className={`${activeStep === 1 ? 'is-active' : ''} ascii-workflow-node`}>[<WorkflowTerm term="GEO" label="GEO Agent" />]</span><i>── siteRoot ──▶</i>
            <span className={`${activeStep === 0 || activeStep === 2 || activeStep === 3 ? 'is-active' : ''} ascii-workflow-node`}>[链上 <WorkflowTerm term="AgenticContract" label="ACVM 验证智能体" />]</span><i>── ObservationTask ──▶</i>
            <span className={`${activeStep === 2 || activeStep === 3 ? 'is-active' : ''} ascii-workflow-node`}>[<WorkflowTerm term="PoI" label="PoI 观察节点" /> × q]</span><i>── SignedObservation[] ──▶</i>
            <span className={`${activeStep === 4 ? 'is-active' : ''} ascii-workflow-node`}>[结果费 ¥116,000]</span>
          </div>
          <footer><code>└─ 当前 / {current.label} / {current.state} / {current.output} ─────────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>链上判断</small><WorkflowFormula formula="25.8% − 14.2% = 11.6pp ≥ 8pp" title="GEO 引用增量验收" summary="独立复测引用率减去签约基线，增量达到订单门槛才形成 AcceptedResult。" details={[{ label: '基线', value: '14.2%' }, { label: '复测', value: '25.8%' }, { label: '门槛', value: '+8.0pp' }]} /></span><strong>只结算独立复测确认的增量</strong></footer>
      </LearningPanel>
    </div>
  );
}

const simulationFlowStages = [
  { index: '01', label: '冻结实验', actor: '研究方 + 参与机构', action: '共同固定模型、样本范围和随机规则', detail: '所有参与方在运行前确认同一实验版本，避免事后修改条件迎合结果。', input: '研究问题 + 多方数据范围', output: '已签名实验承诺', state: 'CREATED → FUNDED', icon: 'lock', tone: 'violet' },
  { index: '02', label: '本地仿真', actor: '各机构的 a3s-box', action: '在本地数据域运行同一社会模拟', detail: '画像、轨迹和个体判断留在各机构内部，只生成待聚合的加密统计。', input: '实验承诺 + 本地私有数据', output: '加密局部统计', state: 'FUNDED → RUNNING', icon: 'brain', tone: 'violet' },
  { index: '03', label: '安全汇总', actor: 'MPC 聚合节点', action: '合并多方统计但不还原个人记录', detail: '跨机构只流转总体指标、置信区间和聚合记录，原始数据始终不出域。', input: '多方加密局部统计', output: '群体结果 + 置信区间', state: 'RUNNING → SUBMITTED', icon: 'chain', tone: 'green' },
  { index: '04', label: '验收结算', actor: 'Validator + ACVM', action: '复核实验管线后发布结果并结算', detail: '验证模型、样本、随机种子和聚合过程；通过后向参与机构和执行方分账。', input: '汇总结果 + 执行证据', output: '可审计结果 + 多方收益', state: 'SUBMITTED → FINALIZED', icon: 'shield', tone: 'green' },
] as const satisfies readonly BusinessProcessStage[];

export function SocialSimulationSimpleArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(simulationFlowStages.length, 3100);
  const current = simulationFlowStages[activeStep];

  return (
    <div className="simulation-ascii-shell" ref={rootRef}>
      <LearningPanel code="社会模拟即服务 / 多机构并行实验" status="私有输入 · 可验证汇总" className="social-simulation-simple simulation-ascii-panel principle-panel">
        <AsciiFlowControls stages={simulationFlowStages} activeStep={activeStep} isPlaying={isPlaying} onSelect={selectStep} onToggle={togglePlayback} ariaLabel="多家机构从冻结社会模拟实验到本地运行、安全汇总和验收结算的四步业务流程" />
        <div className={`simulation-ascii-network ascii-workflow-canvas is-stage-${activeStep + 1}`} key={current.index}>
          <header><code>┌─ experimentRoot 0xSIM-2048 / 同一模型 · 样本规则 · VRF seed ───┐</code></header>
          <div className="simulation-ascii-parties">
            {[
              ['机构 A', '居民服务数据', 'Enc(stat_A)'],
              ['机构 B', '企业经营数据', 'Enc(stat_B)'],
              ['机构 C', '公共设施数据', 'Enc(stat_C)'],
            ].map(([party, data, output]) => (
              <section className="ascii-workflow-node" key={party}>
                <small>[{party} / 本地数据域]</small>
                <code>{data}</code>
                <i aria-hidden="true">│<br />▼</i>
                <strong>[a3s-box 社会模拟]</strong>
                <b>{output}</b>
              </section>
            ))}
          </div>
          <div className="simulation-ascii-converge"><i>╲</i><i>│</i><i>╱</i><code>只汇出加密局部统计</code></div>
          <div className="simulation-ascii-result">
            <span className="ascii-workflow-node">[<WorkflowTerm term="MPC" label="MPC 安全汇总" />]</span><i>── aggregationRoot ──▶</i><span className="ascii-workflow-node">[Validator 复核]</span><i>── <WorkflowTerm term="AcceptedResult" /> ──▶</i><strong className="ascii-workflow-node">48.0% ± 2.4pp</strong>
          </div>
          <footer><code>└─ 当前 / {current.label} / {current.state} / {current.output} ─────┘</code></footer>
        </div>
        <footer className="business-process-footer"><span><small>跨域流转</small><code>Enc(stat_A/B/C) → 群体统计</code></span><strong>验证实验按约运行，不把模拟结果冒充现实事实</strong></footer>
      </LearningPanel>
    </div>
  );
}

export function SocialSimulationArchitecture() {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(simulationSteps.length, 2600);
  const step = simulationSteps[activeStep];

  return (
    <div ref={rootRef} className={`diagram-panel service-demo-panel social-service-panel service-stage-${activeStep + 1} ${isPlaying ? 'is-playing' : ''}`}>
      <header className="panel-chrome service-demo-chrome">
        <span><i /><i /><i /></span>
        <code>SOCIAL SIMULATION AS A SERVICE</code>
        <PlaybackButton isPlaying={isPlaying} onClick={togglePlayback} />
      </header>

      <section className="service-demo-thesis">
        <span><small>研究方提交</small><strong>政策密文、冻结假设与隐私预算</strong></span>
        <b><Icon name="arrow" /> ACVM</b>
        <span><small>公开得到</small><strong>群体统计、置信区间与验证回执</strong></span>
      </section>

      <StageNavigation steps={simulationSteps} activeStep={activeStep} onSelect={selectStep} />

      <div className="service-demo-body">
        <section className="service-demo-scene social-service-scene" aria-label="私有 Agent 判断经过安全聚合和独立复核形成群体结论">
          <header><span><small>SEALED EXPERIMENT</small><strong>政策 P-2048 · 公共服务可达率</strong></span><code>VRF seed 0xa4…91</code></header>
          <div className="social-simulation-flow">
            <div className="social-private-zone">
              <header><Icon name="lock" /><span><small>PRIVATE · NEVER PUBLISHED</small><strong>2,400 个授权 Agent</strong></span></header>
              <div className="social-agent-list">
                {[
                  ['chain', '机构 Agent', 'Enc(trajectory A)'],
                  ['terminal', '企业 Agent', 'Enc(trajectory B)'],
                  ['fingerprint', '个人 Agent', 'Enc(trajectory C)'],
                ].map(([icon, label, record], index) => (
                  <article style={{ '--agent-delay': `${index * 180}ms` } as CSSProperties} key={label}>
                    <Icon name={icon as IconName} /><span><strong>{label}</strong><code>{record}</code></span><i aria-hidden="true" />
                  </article>
                ))}
              </div>
            </div>

            <div className="social-aggregate-node"><Icon name="chain" /><small>MPC AGGREGATE</small><strong>只汇总群体指标</strong><code>Σ Enc(yᵢ)</code></div>
            <div className="social-validator-node"><Icon name="shield" /><small>VALIDATOR QC</small><strong>4 / 7 复核通过</strong><code>replayRoot ✓</code></div>
            <div className="social-result-node"><small>VERIFIED FORECAST</small><strong>48.0%</strong><b>± 2.4pp · 95% CI</b></div>
          </div>
          <div className="service-evidence-chain" aria-label="社会模拟证据链">
            {['假设承诺', '私密轨迹', '聚合记录', '复核证书', '结果回执'].map((label, index) => (
              <span className={index <= activeStep ? 'is-ready' : ''} key={label}><i />{label}</span>
            ))}
          </div>
        </section>
        <StepInspector step={step} index={activeStep} total={simulationSteps.length} />
      </div>

      <footer className="service-demo-boundary">
        <span><Icon name="check" /><b>能证明</b> 实验按冻结的假设与统计管线运行</span>
        <i aria-hidden="true">≠</i>
        <span><Icon name="eye" /><b>不能证明</b> 模拟结果必然等于现实</span>
      </footer>
    </div>
  );
}
