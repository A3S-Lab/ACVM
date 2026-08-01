import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { DetailHint, type ProofDerivation } from './DetailHint';
import { derivations } from './DerivationLibrary';
import { Icon, type IconName } from './Icons';

type Stage = {
  code: string;
  title: string;
  detail: string;
  record: string;
  icon: IconName;
  derivation: ProofDerivation;
};

function useStageCycle(length: number, interval: number) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveStage((stage) => (stage + 1) % length), interval);
    return () => window.clearInterval(timer);
  }, [interval, length, playing, visible]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setPlaying(false);
  };

  return { panelRef, activeStage, playing, setPlaying, selectStage };
}

function ProtocolChrome({ label, playing, onToggle }: { label: string; playing: boolean; onToggle: () => void }) {
  return (
    <header className="panel-chrome">
      <span><i /><i /><i /></span>
      <code>{label}</code>
      <button type="button" className="protocol-play-control" onClick={onToggle} aria-label={playing ? '暂停动画' : '继续动画'}>
        <Icon name={playing ? 'pause' : 'play'} />{playing ? 'PAUSE' : 'PLAY'}
      </button>
    </header>
  );
}

const disputeStages: Stage[] = [
  { code: '01', title: '暂定接受', detail: '原 Validator 集达到验收阈值，结果进入可挑战状态。', record: 'acceptedRoot · validatorQC', icon: 'check', derivation: derivations.validatorDecision },
  { code: '02', title: '挑战窗口', detail: '资金和 PoI 暂不最终释放，反证必须在期限内提交。', record: 'deadline · challengerBond', icon: 'receipt', derivation: derivations.disputeProtocol },
  { code: '03', title: '提交反证', detail: '挑战者绑定同一任务、规则、输入和前序状态。', record: 'counterEvidenceRoot', icon: 'eye', derivation: derivations.receiptVerification },
  { code: '04', title: '独立复核', detail: '新的 Validator 集复算争议点并形成门限证书。', record: 'appealQC · reasonCode', icon: 'shield', derivation: derivations.disputeProtocol },
  { code: '05', title: '终局结算', detail: '链上执行最终裁决、罚没和一次性状态提交。', record: 'finalityRoot · settlement', icon: 'chain', derivation: derivations.bftFinality },
];

const disputeOutcomes = {
  upheld: {
    label: '反证成立',
    state: 'REVERT · REVALIDATE',
    validatorBond: '− 30%',
    challengerBond: '+ 12%',
    result: '原结果撤销，任务返回验收阶段',
  },
  rejected: {
    label: '反证失败',
    state: 'FINALIZE · SETTLE',
    validatorBond: '释放',
    challengerBond: '− 20%',
    result: '原结果终局，释放服务费与贡献',
  },
} as const;

export function DisputeArchitecture() {
  const { panelRef, activeStage, playing, setPlaying, selectStage } = useStageCycle(disputeStages.length, 2200);
  const [outcomeKey, setOutcomeKey] = useState<keyof typeof disputeOutcomes>('upheld');
  const current = disputeStages[activeStage];
  const outcome = disputeOutcomes[outcomeKey];

  return (
    <div className={`diagram-panel dispute-panel dispute-stage-${activeStage + 1} ${playing ? 'is-playing' : 'is-paused'}`} ref={panelRef}>
      <ProtocolChrome label="ACVM / DISPUTE & CHALLENGE PROTOCOL" playing={playing} onToggle={() => setPlaying((value) => !value)} />

      <nav className="protocol-stage-nav" aria-label="选择争议处理步骤">
        {disputeStages.map((stage, index) => (
          <button type="button" className={activeStage === index ? 'is-active' : ''} onClick={() => selectStage(index)} aria-pressed={activeStage === index} key={stage.code}>
            <span>{stage.code}</span><strong>{stage.title}</strong>
          </button>
        ))}
      </nav>

      <div className="dispute-body">
        <section className="dispute-flow" aria-label="从暂定验收到争议终局的状态流">
          <svg viewBox="0 0 760 330" preserveAspectRatio="none" aria-hidden="true">
            <path className="dispute-route route-main" d="M92 88H286C336 88 342 164 392 164H670" />
            <path className="dispute-route route-challenge" d="M92 250H270C326 250 326 164 392 164" />
            {playing ? <circle className="protocol-packet" r="5"><animateMotion dur="2s" path={activeStage < 2 ? 'M92 88H286C336 88 342 164 392 164H670' : 'M92 250H270C326 250 326 164 392 164H670'} repeatCount="indefinite" /></circle> : null}
          </svg>
          <article className="dispute-node node-result"><Icon name="receipt" /><small>WORKER RESULT</small><strong>outputRoot</strong><code>0x91…ef</code></article>
          <article className="dispute-node node-validator"><Icon name="check" /><small>VALIDATOR QC</small><strong>3 / 5 ACCEPT</strong><code>acceptedRoot</code></article>
          <article className="dispute-node node-challenger"><Icon name="eye" /><small>CHALLENGER</small><strong>反证 + 保证金</strong><code>counterEvidenceRoot</code></article>
          <article className="dispute-node node-appeal"><Icon name="shield" /><small>APPEAL SET</small><strong>独立复核 4 / 7</strong><code>appealQC</code></article>
          <article className="dispute-node node-final"><Icon name="chain" /><small>ACVM FINALITY</small><strong>{outcome.state}</strong><code>finalityRoot</code></article>
        </section>

        <aside className="dispute-inspector">
          <header><span><small>CURRENT STEP</small><b>{current.code}</b></span><Icon name={current.icon} /></header>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
          <DetailHint
            className="protocol-record-hint"
            category="链上记录与成立条件"
            label={<code>{current.record}</code>}
            title={`${current.code} · ${current.title}`}
            summary="本步骤只接受与原任务、规则版本和前序状态一致的证据。"
            details={[{ label: '失败处理', value: '条件不满足时保持原状态，并记录可查询的拒绝原因。' }]}
            derivation={current.derivation}
          />
          <div className="dispute-outcome-toggle" aria-label="切换争议结果">
            {(Object.keys(disputeOutcomes) as Array<keyof typeof disputeOutcomes>).map((key) => (
              <button type="button" className={outcomeKey === key ? 'is-active' : ''} onClick={() => { setOutcomeKey(key); setPlaying(false); }} aria-pressed={outcomeKey === key} key={key}>{disputeOutcomes[key].label}</button>
            ))}
          </div>
          <dl>
            <div><dt>终局状态</dt><dd>{outcome.state}</dd></div>
            <div><dt>原 Validator 保证金</dt><dd>{outcome.validatorBond}</dd></div>
            <div><dt>挑战者保证金</dt><dd>{outcome.challengerBond}</dd></div>
          </dl>
          <footer>{outcome.result}</footer>
        </aside>
      </div>

      <footer className="protocol-boundary"><span><i /> PROVISIONAL ≠ FINAL</span><code>ACCEPT → CHALLENGE WINDOW → APPEAL QC → FINALITY</code></footer>
    </div>
  );
}

type AgentContractNode = {
  id: string;
  name: string;
  role: string;
  scope: string;
  budget: number;
  receipt: string;
  output: string;
  icon: IconName;
  x: number;
  y: number;
};

const contractNodes: AgentContractNode[] = [
  { id: 'data', name: 'data.source.ans', role: '数据采集合约', scope: 'oracle.read / signed-only', budget: 24, receipt: '0x18…a4', output: 'evidenceRoot', icon: 'eye', x: 36, y: 20 },
  { id: 'analysis', name: 'analysis.model.ans', role: '分析合约', scope: 'model.infer / dataset:R', budget: 32, receipt: '0x42…c8', output: 'findingRoot', icon: 'brain', x: 36, y: 50 },
  { id: 'compliance', name: 'policy.review.ans', role: '合规合约', scope: 'policy.check / report:R', budget: 22, receipt: '0x73…f1', output: 'verdictRoot', icon: 'shield', x: 36, y: 80 },
];

const compositionStages: Stage[] = [
  { code: '01', title: 'ANS 解析', detail: '父合约按能力、价格和信誉解析三个服务合约。', record: 'ansRecordRoot', icon: 'chain', derivation: derivations.semanticAdapter },
  { code: '02', title: '委托任务', detail: '分别签发作用域、预算、期限和验收谓词。', record: 'delegationRoot', icon: 'key', derivation: derivations.taskDag },
  { code: '03', title: '并行执行', detail: '每个子合约独立运行 Worker 与 Validator。', record: 'subtaskReceipt[]', icon: 'bolt', derivation: derivations.workerExecution },
  { code: '04', title: '聚合回执', detail: '父合约检查依赖、预算和全部必需回执。', record: 'parentReceiptRoot', icon: 'receipt', derivation: derivations.taskDag },
  { code: '05', title: '父任务结算', detail: '聚合结果通过后一次性提交父状态和分账。', record: 'settlementRoot', icon: 'check', derivation: derivations.bftFinality },
];

export function AgentTaskGraphArchitecture() {
  const { panelRef, activeStage, playing, setPlaying, selectStage } = useStageCycle(compositionStages.length, 2300);
  const [selectedId, setSelectedId] = useState(contractNodes[0].id);
  const selected = contractNodes.find((node) => node.id === selectedId) ?? contractNodes[0];
  const allocated = contractNodes.reduce((sum, node) => sum + node.budget, 0);
  const reserve = 100 - allocated;
  const current = compositionStages[activeStage];
  const packetPaths = [
    'M100 180 C180 180 220 75 300 75',
    'M100 180 C190 180 220 285 300 285',
    'M300 75 C390 75 420 180 510 180',
    'M300 285 C390 285 420 180 510 180',
    'M510 180H670',
  ];

  return (
    <div className={`diagram-panel composition-panel composition-stage-${activeStage + 1} ${playing ? 'is-playing' : 'is-paused'}`} ref={panelRef}>
      <ProtocolChrome label="ACVM / AGENT CONTRACT COMPOSITION" playing={playing} onToggle={() => setPlaying((value) => !value)} />

      <nav className="protocol-stage-nav" aria-label="选择多 Agent 协作步骤">
        {compositionStages.map((stage, index) => (
          <button type="button" className={activeStage === index ? 'is-active' : ''} onClick={() => selectStage(index)} aria-pressed={activeStage === index} key={stage.code}>
            <span>{stage.code}</span><strong>{stage.title}</strong>
          </button>
        ))}
      </nav>

      <div className="composition-body">
        <section className="dag-canvas" aria-label="父合约委托三个子合约并聚合回执">
          <svg viewBox="0 0 760 360" preserveAspectRatio="none" aria-hidden="true">
            <path className="dag-route" d="M100 180 C180 180 220 75 300 75M100 180H300M100 180 C180 180 220 285 300 285M300 75 C390 75 420 180 510 180M300 180H510M300 285 C390 285 420 180 510 180M510 180H670" />
            {playing ? <circle className="protocol-packet" r="5" key={activeStage}><animateMotion dur="1.8s" path={packetPaths[activeStage]} repeatCount="indefinite" /></circle> : null}
          </svg>

          <article className="dag-node dag-parent"><Icon name="fingerprint" /><small>PARENT CONTRACT</small><strong>ResearchMission.ac</strong><code>B = 100 · scopeRoot</code></article>
          {contractNodes.map((node) => (
            <button
              type="button"
              className={`dag-node dag-child ${selectedId === node.id ? 'is-active' : ''}`}
              style={{ '--node-x': `${node.x}%`, '--node-y': `${node.y}%` } as CSSProperties}
              onClick={() => { setSelectedId(node.id); setPlaying(false); }}
              aria-pressed={selectedId === node.id}
              key={node.id}
            >
              <Icon name={node.icon} /><span><small>AGENTIC CONTRACT · W/V</small><strong>{node.role}</strong><code>{node.name}</code></span>
            </button>
          ))}
          <article className="dag-node dag-aggregate"><Icon name="receipt" /><small>RECEIPT AGGREGATOR</small><strong>parentReceiptRoot</strong><code>Merkle(R₁,R₂,R₃)</code></article>
          <article className="dag-node dag-final"><Icon name="chain" /><small>ACVM FINALITY</small><strong>父任务结算</strong><code>78 spent · 22 reserve</code></article>
        </section>

        <aside className="dag-inspector">
          <header><small>SELECTED SUB-CONTRACT</small><Icon name={selected.icon} /></header>
          <h3>{selected.role}</h3>
          <strong>{selected.name}</strong>
          <dl>
            <div><dt>委托范围</dt><dd>{selected.scope}</dd></div>
            <div><dt>预算上限</dt><dd>{selected.budget} / 100</dd></div>
            <div><dt>输出</dt><dd>{selected.output}</dd></div>
            <div><dt>回执</dt><dd>{selected.receipt}</dd></div>
          </dl>
          <p>该子合约包含独立 Worker 与 Validator。父合约只读取通过验收的回执。</p>
          <DetailHint
            className="protocol-record-hint"
            category="父子任务约束"
            label={<code>{current.record}</code>}
            title={`${current.code} · ${current.title}`}
            summary={current.detail}
            details={[{ label: '父任务状态', value: '任一必需子任务失败时，父任务保持等待或进入争议状态。' }]}
            derivation={current.derivation}
          />
        </aside>
      </div>

      <footer className="composition-formulas">
        <DetailHint className="composition-formula" category="预算守恒" label={<code>Bparent = ΣBi + Bres = {allocated} + {reserve}</code>} title="父任务预算守恒" summary="父任务不能向子合约超额委托，也不能把同一预算重复结算。" derivation={derivations.taskDag} />
        <DetailHint className="composition-formula" category="回执聚合" label={<code>Rparent = Merkle(taskIdi, Ri)</code>} title="子任务回执聚合" summary="每个必需子任务回执按 taskId 排序后进入父任务根。" derivation={derivations.taskDag} />
      </footer>
    </div>
  );
}

type SimulationPreset = {
  id: string;
  title: string;
  policy: string;
  outcome: string;
  baseline: number;
  effect: number;
  deviation: number;
  unit: string;
  secondary: string;
};

const simulationPresets: SimulationPreset[] = [
  { id: 'policy', title: '预发布政策', policy: '加密政策 P-2048', outcome: '公共服务可达率', baseline: 41.2, effect: 6.8, deviation: 12.4, unit: '%', secondary: '群体分歧 0.18' },
  { id: 'market', title: '市场规则', policy: '绿色补贴方案 M-17', outcome: '中小企业采用率', baseline: 34.6, effect: 8.1, deviation: 16.0, unit: '%', secondary: '财政敏感度 0.24' },
  { id: 'coordination', title: '协作机制', policy: '应急协作规则 C-09', outcome: '跨机构响应率', baseline: 58.2, effect: 12.4, deviation: 19.0, unit: '%', secondary: '资源冲突率 7.1%' },
];

const simulationRegions: Array<{ label: string; actor: string; icon: IconName; tone: string }> = [
  { label: '机构 Agent', actor: '公共服务机构 · 研究机构', icon: 'chain', tone: 'institution' },
  { label: '企业 Agent', actor: '平台企业 · 服务企业', icon: 'terminal', tone: 'enterprise' },
  { label: '个人 Agent', actor: '授权个人 · 社区代表', icon: 'fingerprint', tone: 'individual' },
  { label: '复现实验', actor: '独立研究节点', icon: 'shield', tone: 'replica' },
];

function SimulationDots({ offset }: { offset: number }) {
  return (
    <div className="simulation-dots" aria-hidden="true">
      {Array.from({ length: 18 }, (_, index) => <i style={{ '--dot-delay': `${((index + offset) % 9) * -0.18}s` } as CSSProperties} key={index} />)}
    </div>
  );
}

export function SocialSimulationArchitecture() {
  const [presetId, setPresetId] = useState(simulationPresets[0].id);
  const [population, setPopulation] = useState(2400);
  const [runs, setRuns] = useState(100);
  const preset = simulationPresets.find((item) => item.id === presetId) ?? simulationPresets[0];

  const stats = useMemo(() => {
    const mean = preset.baseline + preset.effect;
    const error = 1.96 * preset.deviation / Math.sqrt(runs);
    return { mean, error, totalSteps: population * runs };
  }, [population, preset, runs]);

  return (
    <div className="diagram-panel simulation-panel">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>DECENTRALIZED SOCIAL SIMULATION AS A SERVICE</code>
        <strong><i /> PRIVACY SEALED</strong>
      </header>

      <nav className="simulation-tabs" aria-label="选择社会模拟场景">
        {simulationPresets.map((item) => <button type="button" className={presetId === item.id ? 'is-active' : ''} onClick={() => setPresetId(item.id)} aria-pressed={presetId === item.id} key={item.id}>{item.title}</button>)}
      </nav>

      <div className="simulation-body">
        <section className="simulation-input">
          <header><Icon name="lock" /><span><small>USER UPLOAD · ENCRYPTED INPUT</small><strong>{preset.policy}</strong></span></header>
          <p>政策正文只在获授权的隔离环境中解封。链上保存密文地址与内容承诺。</p>
          <code>policyRoot 0x84…2d</code>
          <code>accessQC 3 / 5</code>
          <label><span><b>P</b>每轮参与 Agent<strong>{population.toLocaleString()}</strong></span><input type="range" min="400" max="5000" step="200" value={population} onChange={(event) => setPopulation(Number(event.currentTarget.value))} /></label>
          <label><span><b>K</b>独立重复实验<strong>{runs}</strong></span><input type="range" min="20" max="240" step="20" value={runs} onChange={(event) => setRuns(Number(event.currentTarget.value))} /></label>
          <footer><Icon name="key" /><span><small>EPHEMERAL ACCESS</small><strong>临时密钥 · 到期撤销</strong></span></footer>
        </section>

        <section className="simulation-mesh" aria-label="机构、企业和个人 Agent 的分布式模拟网络">
          <svg viewBox="0 0 520 360" preserveAspectRatio="none" aria-hidden="true">
            <path d="M45 65C180 65 170 180 260 180S350 65 475 65M45 295C180 295 170 180 260 180S350 295 475 295M45 65C110 180 110 250 45 295M475 65C410 180 410 250 475 295" />
            <circle className="simulation-packet" r="5"><animateMotion dur="2.8s" path="M45 65C180 65 170 180 260 180S350 295 475 295" repeatCount="indefinite" /></circle>
          </svg>
          {simulationRegions.map((region, index) => (
            <article className={`simulation-region region-${region.tone}`} key={region.label}>
              <header><Icon name={region.icon} /><span><strong>{region.label}</strong><small>{region.actor}</small></span></header>
              <SimulationDots offset={index * 2} />
              <footer><code>Enc(judgement)</code><span>run {String(index + 1).padStart(2, '0')}</span></footer>
            </article>
          ))}
          <div className="simulation-aggregate"><Icon name="brain" /><small>SECURE AGGREGATION</small><strong>只汇总群体指标</strong><code>Σ Enc(yᵢ) → Aggregate</code></div>
        </section>

        <aside className="simulation-result">
          <header><small>VERIFIED FORECAST</small><Icon name="check" /></header>
          <span>{preset.outcome}</span>
          <strong>{stats.mean.toFixed(1)}{preset.unit}</strong>
          <b>± {stats.error.toFixed(1)} pp · 95% CI</b>
          <dl>
            <div><dt>基线</dt><dd>{preset.baseline.toFixed(1)}{preset.unit}</dd></div>
            <div><dt>预测变化</dt><dd>{preset.effect > 0 ? '+' : ''}{preset.effect.toFixed(1)} pp</dd></div>
            <div><dt>群体指标</dt><dd>{preset.secondary}</dd></div>
            <div><dt>Agent 步数</dt><dd>{stats.totalSteps.toLocaleString()}</dd></div>
            <div><dt>复核证书</dt><dd>4 / 7 · QC</dd></div>
          </dl>
          <DetailHint
            className="simulation-formula"
            category="统计结果与可复现性"
            label={<code>μ̂ = Σg(τₖ)/K · CI95 = μ̂ ± 1.96s/√K</code>}
            title="分布式重复实验"
            summary="每次实验都绑定模型、规则、数据版本和随机种子，Validator 只汇总通过复核的轨迹。"
            details={[{ label: '结论边界', value: '置信区间描述模型内的不确定性，不代表现实世界预测误差。' }]}
            derivation={derivations.socialSimulation}
          />
        </aside>
      </div>

      <footer className="simulation-boundary"><Icon name="shield" /><span><strong>可证明：按公开假设正确完成仿真</strong><small>不可证明：模型结论必然等于现实；上线前仍需回测、试点和公共程序。</small></span></footer>
    </div>
  );
}
