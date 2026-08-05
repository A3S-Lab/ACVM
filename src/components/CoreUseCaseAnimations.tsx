import type { CSSProperties } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';

type ServiceStep = {
  label: string;
  title: string;
  actor: string;
  description: string;
  evidence: string;
  state: string;
  icon: IconName;
};

const geoSteps: readonly ServiceStep[] = [
  {
    label: '冻结口径',
    title: '把“变好”写成可检查的条件',
    actor: '品牌方 + Validator',
    description: '签名固定问题集、观测引擎、站点版本、基线、30 天窗口和 8pp 门槛。',
    evidence: 'intentRoot · baselineRoot',
    state: 'CREATED → FUNDED',
    icon: 'lock',
  },
  {
    label: '执行优化',
    title: 'GEO Agent 在链下改内容',
    actor: 'GEO Worker',
    description: '改写页面、补充可引用材料并发布；站点快照和发布记录绑定同一 taskId。',
    evidence: 'artifactRoot · publishReceipt',
    state: 'FUNDED → RUNNING',
    icon: 'brain',
  },
  {
    label: '独立观测',
    title: '成绩不由执行者自己上报',
    actor: 'Observation Workers',
    description: '观察节点按冻结问题集重新查询，排除付费流量与合成查询，汇总引用份额。',
    evidence: 'querySetRoot · observationRoot',
    state: 'RUNNING → SUBMITTED',
    icon: 'eye',
  },
  {
    label: '验证增量',
    title: 'Validator 只判断约定谓词',
    actor: 'Independent Validators',
    description: '核对前后样本、数据来源和排除项；25.8% − 14.2% = 11.6pp，超过门槛。',
    evidence: 'verdictQC · delta = +11.6pp',
    state: 'SUBMITTED → ACCEPTED',
    icon: 'shield',
  },
  {
    label: '结果结算',
    title: '终局后按有效增量付款',
    actor: 'Settlement Contract',
    description: '裁决过挑战期并随区块终局后，合约按每个百分点 ¥10,000 释放服务费。',
    evidence: 'receiptRoot · ¥116,000',
    state: 'ACCEPTED → FINALIZED',
    icon: 'receipt',
  },
];

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
  return (
    <LearningPanel code="GEO / INDEPENDENT MEASUREMENT" status="ILLUSTRATIVE DATA" className="geo-proof-simple">
      <div className="geo-proof-rule">
        <span><small>冻结基线</small><strong>14.2%</strong></span>
        <span><small>验收门槛</small><strong>+8pp</strong></span>
        <span><small>观察窗口</small><strong>30 天</strong></span>
      </div>
      <div className="geo-proof-result" aria-label="引用份额从 14.2% 提升到 25.8%">
        <div className="geo-proof-bars">
          <span className="is-baseline"><b>14.2%</b><i /><small>签约基线</small></span>
          <span className="is-observed"><b>25.8%</b><i /><small>独立复测</small></span>
        </div>
        <div className="geo-proof-delta">
          <small>已验证增量</small>
          <strong>+11.6<em>pp</em></strong>
          <span><Icon name="check" /> 达标</span>
        </div>
      </div>
      <footer className="geo-proof-settlement">
        <span>独立复测超过门槛</span><i aria-hidden="true">→</i><strong>释放结果费</strong>
      </footer>
    </LearningPanel>
  );
}

export function SocialSimulationSimpleArchitecture() {
  return (
    <LearningPanel code="SOCIAL SIMULATION AS A SERVICE" status="PRIVATE INPUT · VERIFIED OUTPUT" className="social-simulation-simple">
      <div className="social-simulation-simple-flow" aria-label="私有数据经过本地社会模拟、安全聚合与 ACVM 验收形成可结算结果">
        <section>
          <Icon name="lock" />
          <small>PRIVATE INPUT</small>
          <strong>机构、企业与个人数据</strong>
          <span>原始画像与轨迹不出域</span>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-simulation">
          <Icon name="brain" />
          <small>SEALED SIMULATION</small>
          <strong>按冻结假设运行</strong>
          <span>模型 · 样本 · 随机种子</span>
        </section>
        <i aria-hidden="true">→</i>
        <section>
          <Icon name="chain" />
          <small>SECURE AGGREGATION</small>
          <strong>只汇总群体指标</strong>
          <span>统计值 · 置信区间</span>
        </section>
        <i aria-hidden="true">→</i>
        <section className="is-accepted">
          <Icon name="shield" />
          <small>ACVM VERDICT</small>
          <strong>验管线与结果回执</strong>
          <span>通过后结算服务费</span>
        </section>
      </div>
      <footer className="social-simulation-simple-boundary">
        <span><b>能够证明</b> 按冻结假设与统计管线运行</span>
        <i aria-hidden="true">≠</i>
        <span><b>不能证明</b> 模拟结论必然等于现实</span>
      </footer>
    </LearningPanel>
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
