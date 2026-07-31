import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons';
import {
  storyOptions,
  storyParticipants,
  storyPlaybooks,
  type Story,
  type StoryId,
} from './StoryData';

const storyOrder: StoryId[] = [
  'ads',
  'sla',
  'royalty',
  'gov-subsidy',
  'gov-project',
  'supply',
  'factory-quality',
  'factory-energy',
  'finance-credit',
  'finance-insurance',
  'education-training',
  'education-research',
];

const stories = storyOrder
  .map((id) => storyOptions.find((story) => story.id === id))
  .filter((story): story is Story => Boolean(story));

const categoryKeys: Record<Story['category'], string> = {
  商业: 'business',
  政务: 'government',
  制造: 'manufacturing',
  金融: 'finance',
  教育: 'education',
};

const riskActions: Record<StoryId, { action: string; signal: string }> = {
  ads: {
    action: '渠道把机器人转化并入效果报表，同时把收款账户换成临时账户',
    signal: 'CRM 订单无法对应点击签名；渠道账户与已签 Manifest 不一致',
  },
  sla: {
    action: '服务商回写故障时段指标，并把未批准的停机标记成维护窗口',
    signal: '客户探针仍记录中断；工单审批时间晚于实际故障',
  },
  royalty: {
    action: '平台重复计入同一设备的播放记录，并尝试替换创作者收款账户',
    signal: '订单、设备与播放会话无法一一对应；权利人绑定发生漂移',
  },
  'gov-subsidy': {
    action: '申报企业复用另一批次发票，并请求读取无关企业的经营数据',
    signal: '发票已绑定其他项目；查询字段超出本次补贴的最小授权',
  },
  'gov-project': {
    action: '承建方复用上期现场影像、重复计量，并临时变更收款账户',
    signal: '影像定位时间与 BIM 版本不一致；同一工程量已在上期结算',
  },
  supply: {
    action: '供应商补录温控曲线、替换交付批次号，并申请全额付款',
    signal: '传感器证书在运输中途失效；仓储批次与运单批次不一致',
  },
  'factory-quality': {
    action: '供应商回填 QMS 检测记录，并把异常产线数据挂到合格批次',
    signal: '设备身份与批次谱系断裂；实验室报告早于样品送检时间',
  },
  'factory-energy': {
    action: '服务商替换电表后重算历史基线，让节能率看起来达到目标',
    signal: '计量设备身份改变；基线版本与合约锁定版本不一致',
  },
  'finance-credit': {
    action: '供应商用同一笔应收账款重复质押，并把放款账户换成关联账户',
    signal: '质押登记已存在；贸易受益人与本次已核验主体不一致',
  },
  'finance-insurance': {
    action: '报案方复用旧事故影像，并在赔付前临时更换收款账户',
    signal: '影像哈希已出现在历史案件；账户不属于保单绑定主体',
  },
  'education-training': {
    action: '培训机构批量代刷考勤、复用证书，并把短期挂靠当成稳定就业',
    signal: '学习、考试与就业凭证无法形成同一人的连续匿名链路',
  },
  'education-research': {
    action: '项目团队补写实验记录，并把已用于其他项目的成果再次申报',
    signal: '状态承诺时间线中断；成果哈希已绑定另一任务书',
  },
};

type StoryMode = 'normal' | 'risk';
type StoryActorKey = 'initiator' | 'operator' | 'evidence' | 'acvm' | 'ledger';

type StorySegment = {
  from: StoryActorKey;
  to: StoryActorKey;
  label: string;
  tone?: 'business' | 'proof' | 'settlement' | 'risk';
};

type StoryStep = {
  label: string;
  title: string;
  detail: string;
  artifact: string;
  segments: StorySegment[];
};

const actorPositions: Record<StoryActorKey, number> = {
  initiator: 0,
  operator: 1,
  evidence: 2,
  acvm: 3,
  ledger: 4,
};

const actorLabels: Record<StoryActorKey, string> = {
  initiator: '发布方',
  operator: '履约方',
  evidence: '事实系统',
  acvm: 'ACVM',
  ledger: '联盟链',
};

function buildSteps(story: Story, mode: StoryMode): StoryStep[] {
  const playbook = storyPlaybooks[story.id];
  const participants = storyParticipants[story.id];
  const risk = riskActions[story.id];

  return [
    {
      label: '签名发布',
      title: `${participants.initiator.name}发布有身份的 Agentic Contract`,
      detail: `${playbook.agreement.object}。${playbook.agreement.rule}`,
      artifact: `${playbook.agreement.result}；发布者、Agent、合约与资金状态完成签名绑定`,
      segments: [
        { from: 'initiator', to: 'acvm', label: '签名发布 · 身份 / 规则 / 资金', tone: 'business' },
        { from: 'acvm', to: 'ledger', label: '登记身份绑定与初始状态根', tone: 'proof' },
      ],
    },
    mode === 'normal'
      ? {
          label: '真实履约',
          title: playbook.operation.action,
          detail: `${playbook.operation.object}。${playbook.operation.result}`,
          artifact: '业务原始数据留在各责任系统；过程持续生成带来源、时间和主体签名的留痕',
          segments: [
            { from: 'initiator', to: 'operator', label: '任务与验收规则生效', tone: 'business' },
            { from: 'operator', to: 'evidence', label: '真实履约 · 业务系统持续留痕', tone: 'business' },
          ],
        }
      : {
          label: '异常履约',
          title: risk.action,
          detail: risk.signal,
          artifact: '对传统合约，执行方仍可能只提交 result = true；真实系统里的矛盾尚未被检查',
          segments: [
            { from: 'initiator', to: 'operator', label: '原验收规则仍然有效', tone: 'business' },
            { from: 'operator', to: 'evidence', label: '异常结果 · 原始系统留下矛盾', tone: 'risk' },
          ],
        },
    mode === 'normal'
      ? {
          label: '取证核验',
          title: 'ACVM Agent 通过渐进式 API 交叉核验',
          detail: `${playbook.evidence.action}。工具按 list → describe → dry-run → execute 渐进开放，每次调用都经过零信任重新授权。`,
          artifact: `${playbook.evidence.items.join(' · ')}；a3s-box 隔离任务，a3s-power 只返回可验证推理结果`,
          segments: [
            { from: 'acvm', to: 'evidence', label: '最小权限请求 · 只取本次证据', tone: 'proof' },
            { from: 'evidence', to: 'acvm', label: '签名凭证 / 零知识证明', tone: 'proof' },
          ],
        }
      : {
          label: '发现矛盾',
          title: 'ACVM 核验事实，AnySentry 输出风险决定',
          detail: `${risk.signal}。${playbook.verifyFail}`,
          artifact: `${playbook.safety.signals.join(' · ')}；AnySentry 负责观测与决定，ACVM 负责改变合约状态`,
          segments: [
            { from: 'acvm', to: 'evidence', label: '零信任取证 · 核对最小字段', tone: 'proof' },
            { from: 'evidence', to: 'acvm', label: '矛盾证据 + 风险信号', tone: 'risk' },
          ],
        },
    mode === 'normal'
      ? {
          label: '共识结算',
          title: story.receipt,
          detail: `${story.consensus}。联盟链验证状态与证明，不读取企业原始业务数据。`,
          artifact: `${story.receiptLabel} · 状态承诺、完成凭证与结算回执进入审计账本`,
          segments: [
            { from: 'acvm', to: 'ledger', label: '状态 + 证明 + 结算指令', tone: 'proof' },
            { from: 'ledger', to: 'operator', label: '多机构确认 · 款项到账', tone: 'settlement' },
          ],
        }
      : {
          label: '阻断留证',
          title: 'ACVM 执行 BLOCK，资金保持锁定',
          detail: `${playbook.safety.block}。联盟链记录阻断终局，执行方不能用单方 result = true 触发付款。`,
          artifact: 'BLOCK · 差异证据根 · 策略版本 · 责任主体进入审计账本；原始敏感数据不上链',
          segments: [
            { from: 'acvm', to: 'ledger', label: 'BLOCK · 提交差异证据根', tone: 'risk' },
            { from: 'ledger', to: 'operator', label: '拒绝结算 · 资金保持锁定', tone: 'risk' },
          ],
        },
  ];
}

function MessageSegment({
  segment,
  segmentIndex,
}: {
  segment: StorySegment;
  segmentIndex: number;
}) {
  const from = actorPositions[segment.from];
  const to = actorPositions[segment.to];
  const start = Math.min(from, to);
  const span = Math.max(1, Math.abs(to - from));
  const reverse = from > to;

  return (
    <span
      className={`case-message-line ${reverse ? 'is-reverse' : ''} case-message-line--${segment.tone ?? 'business'}`}
      style={{
        '--route-left': `${(start + 0.5) * 20}%`,
        '--route-width': `${span * 20}%`,
        '--route-row': segmentIndex,
      } as React.CSSProperties}
      aria-label={`${segment.from} 向 ${segment.to}：${segment.label}`}
    >
      <small>{actorLabels[segment.from]} → {actorLabels[segment.to]}</small>
      <strong>{segment.label}</strong>
    </span>
  );
}

function IndustrySymbol({ storyId }: { storyId: StoryId }) {
  const symbols: Record<StoryId, React.ReactNode> = {
    ads: <><path d="M8 44V31h8v13M22 44V22h8v22M36 44V12h8v32" /><path d="m8 20 12-7 10 3L45 6" /></>,
    sla: <><rect x="7" y="8" width="38" height="11" /><rect x="7" y="24" width="38" height="11" /><path d="M12 13h12m7 0h1M12 29h17m7 0h1M26 44h18" /></>,
    royalty: <><circle cx="26" cy="25" r="19" /><path d="m22 16 14 9-14 9V16ZM4 25H0m56 0h-4" /></>,
    'gov-subsidy': <><path d="m26 6 22 10H4L26 6ZM8 41h36M12 18v19m10-19v19m10-19v19m10-19v19" /></>,
    'gov-project': <><path d="M8 44V7h5v37M13 11h36M36 11v13M48 11 36 24M24 44V29h25v15M46 11v17" /><path d="m42 28 4 7 4-7" /></>,
    supply: <><path d="M4 19h28v22H4zM4 19 18 10l14 9M34 29h12l7 8v4H34z" /><circle cx="40" cy="42" r="4" /><circle cx="49" cy="42" r="4" /></>,
    'factory-quality': <><path d="M3 42h50M8 36V18l12 7V14l13 8V8h7v28" /><circle cx="15" cy="31" r="3" /><circle cx="27" cy="31" r="3" /><path d="m41 20 5 5 8-11" /></>,
    'factory-energy': <><path d="M4 43V25l12 7v-7l13 7V18h7v25" /><path d="m43 5-9 18h8l-4 13 14-20h-8l5-11h-6Z" /></>,
    'finance-credit': <><path d="m26 6 22 10H4L26 6ZM9 40h34M13 18v18m9-18v18m9-18v18m9-18v18" /><path d="M47 26h9m-3-3 3 3-3 3" /></>,
    'finance-insurance': <><path d="M7 29h21l8 8v5H7z" /><circle cx="14" cy="43" r="4" /><circle cx="30" cy="43" r="4" /><path d="m43 6 11 4v9c0 9-5 15-11 18-7-3-12-9-12-18v-9l12-4Z" /><path d="m38 20 4 4 7-9" /></>,
    'education-training': <><path d="M5 10h18c5 0 7 3 7 7v27c0-4-2-7-7-7H5V10Zm50 0H37c-5 0-7 3-7 7v27c0-4 2-7 7-7h18V10Z" /><path d="M10 17h12m-12 6h9m26-6H34m11 6h-9" /></>,
    'education-research': <><path d="M20 5v14L8 40c-2 4 0 7 5 7h26c5 0 7-3 5-7L32 19V5M16 5h20M13 35h26" /><circle cx="23" cy="38" r="2" /><circle cx="31" cy="42" r="2" /></>,
  };

  return <g transform="translate(116 22)">{symbols[storyId]}</g>;
}

function CaseMotif({ story, index }: { story: Story; index: number }) {
  const nodes = [
    [48, 10],
    [82, 26],
    [82, 66],
    [48, 84],
    [14, 66],
    [14, 26],
  ];

  return (
    <svg className="case-motif" viewBox="0 0 180 96" aria-hidden="true">
      <g className="case-motif-network">
        <ellipse cx="48" cy="47" rx="38" ry="38" />
        {nodes.map(([x, y], nodeIndex) => (
          <g key={`${x}-${y}`}>
            <path d={`M48 47L${x} ${y}`} />
            <circle cx={x} cy={y} r="3.5" />
            {nodeIndex < nodes.length - 1 ? <path d={`M${x} ${y}L${nodes[nodeIndex + 1][0]} ${nodes[nodeIndex + 1][1]}`} /> : null}
          </g>
        ))}
        <path d={`M${nodes[nodes.length - 1][0]} ${nodes[nodes.length - 1][1]}L${nodes[0][0]} ${nodes[0][1]}`} />
        <rect x="37" y="38" width="22" height="18" />
        <text x="48" y="50">AC</text>
      </g>
      <path className="case-motif-link" d="M87 47h21" />
      <IndustrySymbol storyId={story.id} />
      <text className="case-motif-code" x="116" y="88">{story.category.toUpperCase()} / {String(index + 1).padStart(2, '0')}</text>
    </svg>
  );
}

function StoryPanel({ story, index }: { story: Story; index: number }) {
  const [mode, setMode] = useState<StoryMode>('normal');
  const [phase, setPhase] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<number[]>([]);
  const playbook = storyPlaybooks[story.id];
  const participants = storyParticipants[story.id];
  const steps = buildSteps(story, mode);
  const current = steps[phase];
  const activeActors = new Set(current.segments.flatMap((segment) => [segment.from, segment.to]));

  const actors: Array<{
    key: StoryActorKey;
    label: string;
    name: string;
    role: string;
    mark: React.ReactNode;
  }> = [
    {
      key: 'initiator',
      label: '发布方',
      name: participants.initiator.name,
      role: participants.initiator.role,
      mark: story.nodes[0],
    },
    {
      key: 'operator',
      label: '履约方',
      name: participants.operator.name,
      role: participants.operator.role,
      mark: story.nodes[1],
    },
    {
      key: 'evidence',
      label: '事实来源',
      name: participants.evidence.name,
      role: participants.evidence.role,
      mark: <Icon name="terminal" />,
    },
    {
      key: 'acvm',
      label: '可信执行',
      name: 'ACVM Agent',
      role: '取证、核验、推进状态与生成凭证',
      mark: 'AC',
    },
    {
      key: 'ledger',
      label: '共识终局',
      name: '联盟链 / 结算节点',
      role: '多机构确认、结算与审计',
      mark: <Icon name="chain" />,
    },
  ];

  const stop = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPlaying(false);
  };

  useEffect(() => stop, []);
  useEffect(() => {
    stop();
    setPhase(0);
  }, [mode]);

  const play = () => {
    stop();
    setPhase(0);
    setPlaying(true);
    [1, 2, 3].forEach((next, timerIndex) => {
      timers.current.push(window.setTimeout(() => {
        setPhase(next);
        if (next === 3) setPlaying(false);
      }, (timerIndex + 1) * 1500));
    });
  };

  return (
    <article
      className={`story-panel story-panel--${categoryKeys[story.category]} story-panel--${mode}`}
      id={story.id}
      aria-label={`${story.title}案例`}
    >
      <div className="story-panel-content">
        <header className="case-heading">
          <div className="case-heading-copy">
            <span className="case-index">CASE {String(index + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')} · {story.category}</span>
            <h2>{story.title}</h2>
            <p>{playbook.oneLine}</p>
          </div>

          <CaseMotif story={story} index={index} />

          <div className="case-controls">
            <div className="mode-switch" aria-label="切换履约情况">
              <button type="button" className={mode === 'normal' ? 'is-active' : ''} aria-pressed={mode === 'normal'} onClick={() => setMode('normal')}>
                <Icon name="check" /> 正常履约
              </button>
              <button type="button" className={mode === 'risk' ? 'is-active' : ''} aria-pressed={mode === 'risk'} onClick={() => setMode('risk')}>
                <Icon name="shield" /> 具体造假
              </button>
            </div>
            <button className="story-play" type="button" onClick={play} aria-label="播放四步业务流程" aria-pressed={playing}>
              <Icon name={playing ? 'pause' : 'play'} /> {playing ? '演示中' : '播放流程'}
            </button>
          </div>
        </header>

        <div className="case-contrast" aria-label="传统智能合约与 ACVM 的区别">
          <span><b>传统智能合约</b><code>result = true</code><small>{story.legacyExecution}</small></span>
          <i><Icon name="arrow" /></i>
          <span><b>ACVM</b><strong>验证谁做了什么、证据从哪里来，再决定结算或阻断</strong></span>
        </div>

        <div className={`case-theatre case-theatre--phase-${phase + 1}`}>
          <div className="case-theatre-bar">
            <span><i /> AGENTIC CONTRACT LIVE</span>
            <strong>{playbook.subject}</strong>
            <small>{story.contract} · {story.amount}</small>
          </div>

          <div className="case-theatre-body">
            <section className="case-sequence" aria-label={`${story.title}参与方交互时序`}>
              <div className="case-actors">
                {actors.map((actor) => (
                  <div className={`${activeActors.has(actor.key) ? 'is-active' : ''} is-${actor.key}`} key={actor.key}>
                    <span>{actor.mark}</span>
                    <section>
                      <small>{actor.label}</small>
                      <strong>{actor.name}</strong>
                      <p>{actor.role}</p>
                    </section>
                  </div>
                ))}
              </div>

              <div className="case-flow">
                <div className="case-lanes" aria-hidden="true">{actors.map((actor) => <i key={actor.key} />)}</div>
                {steps.map((step, stepIndex) => (
                  <button
                    className={`case-sequence-row ${stepIndex === phase ? 'is-active' : ''} ${stepIndex < phase ? 'is-done' : ''}`}
                    type="button"
                    key={step.label}
                    onClick={() => {
                      stop();
                      setPhase(stepIndex);
                    }}
                    aria-current={stepIndex === phase ? 'step' : undefined}
                    aria-label={`第${stepIndex + 1}步：${step.label}。${step.title}`}
                  >
                    <span className="case-step-label">
                      <b>{stepIndex < phase ? <Icon name="check" /> : `0${stepIndex + 1}`}</b>
                      <i>{step.label}</i>
                    </span>
                    <span className="case-routes">
                      {step.segments.map((segment, segmentIndex) => (
                        <MessageSegment segment={segment} segmentIndex={segmentIndex} key={`${segment.from}-${segment.to}-${segment.label}`} />
                      ))}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <aside className="case-detail" aria-live="polite">
              <header>
                <span>STEP 0{phase + 1}</span>
                <small>{current.label}</small>
              </header>
              <section>
                <small>本步发生什么</small>
                <h3>{current.title}</h3>
                <p>{current.detail}</p>
              </section>
              <section className="case-artifact">
                <small>留下什么可验证产物</small>
                <p>{current.artifact}</p>
              </section>
              <footer className={mode === 'risk' ? 'is-risk' : ''}>
                <Icon name={mode === 'risk' ? 'shield' : 'receipt'} />
                <span>
                  <small>最终业务结果</small>
                  <strong>{mode === 'normal' ? story.receipt : '结算被阻断，资金保持锁定'}</strong>
                </span>
              </footer>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}

export function StoryGallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState(0);
  const scrollFrame = useRef(0);

  const goToStory = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(stories.length - 1, index));
    track.scrollTo({ left: next * track.clientWidth, behavior });
    setActiveStory(next);
  };

  useEffect(() => {
    const handleHash = () => {
      const index = stories.findIndex((story) => story.id === window.location.hash.slice(1));
      if (index >= 0) window.requestAnimationFrame(() => goToStory(index, 'auto'));
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => () => window.cancelAnimationFrame(scrollFrame.current), []);

  return (
    <section className="screen story-gallery-screen" id="stories" data-screen="5">
      <div
        className="story-gallery"
        ref={trackRef}
        tabIndex={0}
        aria-label="ACVM 行业场景横向展厅"
        onScroll={(event) => {
          window.cancelAnimationFrame(scrollFrame.current);
          const track = event.currentTarget;
          scrollFrame.current = window.requestAnimationFrame(() => {
            const next = Math.max(0, Math.min(stories.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
            if (next !== activeStory) setActiveStory(next);
          });
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToStory(activeStory - 1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToStory(activeStory + 1);
          }
        }}
      >
        {stories.map((story, index) => <StoryPanel story={story} index={index} key={story.id} />)}
      </div>

      <div className="story-gallery-nav">
        <button type="button" onClick={() => goToStory(activeStory - 1)} disabled={activeStory === 0} aria-label="上一个案例"><Icon name="arrow" /></button>
        <label>
          <span>{stories[activeStory].category}</span>
          <select
            value={stories[activeStory].id}
            onChange={(event) => goToStory(stories.findIndex((story) => story.id === event.target.value))}
            aria-label="选择行业案例"
          >
            {stories.map((story, index) => <option key={story.id} value={story.id}>{String(index + 1).padStart(2, '0')} · {story.category} · {story.title}</option>)}
          </select>
        </label>
        <div>
          {stories.map((story, index) => (
            <button
              type="button"
              key={story.id}
              className={activeStory === index ? 'is-active' : ''}
              onClick={() => goToStory(index)}
              aria-label={`转到${story.title}`}
            />
          ))}
        </div>
        <strong>{String(activeStory + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')}</strong>
        <button type="button" onClick={() => goToStory(activeStory + 1)} disabled={activeStory === stories.length - 1} aria-label="下一个案例"><Icon name="arrow" /></button>
      </div>
    </section>
  );
}
