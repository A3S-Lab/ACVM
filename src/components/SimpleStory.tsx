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

type StoryStep = {
  label: string;
  actor: string;
  title: string;
  detail: string;
  artifact: string;
};

function buildSteps(story: Story, mode: StoryMode): StoryStep[] {
  const playbook = storyPlaybooks[story.id];
  const participants = storyParticipants[story.id];
  const risk = riskActions[story.id];

  return [
    {
      label: '双方约定',
      actor: `${participants.initiator.name} ↔ ${participants.operator.name}`,
      title: playbook.agreement.object,
      detail: playbook.agreement.rule,
      artifact: playbook.agreement.result,
    },
    mode === 'normal'
      ? {
          label: '真实业务发生',
          actor: participants.operator.name,
          title: playbook.operation.action,
          detail: playbook.operation.object,
          artifact: playbook.operation.result,
        }
      : {
          label: '出现造假行为',
          actor: participants.operator.name,
          title: risk.action,
          detail: risk.signal,
          artifact: '业务系统仍可能向传统合约提交 result = true',
        },
    mode === 'normal'
      ? {
          label: 'ACVM 核验',
          actor: `${participants.evidence.name} → ACVM`,
          title: playbook.evidence.action,
          detail: playbook.evidence.items.join(' · '),
          artifact: playbook.privateRule,
        }
      : {
          label: 'ACVM 找到矛盾',
          actor: `${participants.evidence.name} → ACVM`,
          title: playbook.evidence.missing,
          detail: playbook.verifyFail,
          artifact: playbook.safety.signals.join(' · '),
        },
    mode === 'normal'
      ? {
          label: '确认并执行',
          actor: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`,
          title: story.receipt,
          detail: story.consensus,
          artifact: `${story.receiptLabel} · 执行凭证写入联盟链`,
        }
      : {
          label: '阻断并留证',
          actor: 'AnySentry 决策信号 → ACVM 状态机',
          title: playbook.verifyFail,
          detail: playbook.safety.block,
          artifact: 'BLOCK · 差异证据根写入审计账本 · 资金保持锁定',
        },
  ];
}

function SceneBackdrop({ storyId }: { storyId: StoryId }) {
  const common = (
    <>
      <path d="M34 350H726" />
      <path d="M90 350v-38h78v38M598 350v-54h86v54" />
      <circle cx="118" cy="282" r="11" />
      <circle cx="638" cy="270" r="11" />
      <path d="M118 293v35m-15-18h30M638 281v47m-15-20h30" />
    </>
  );

  const scenes: Record<StoryId, React.ReactNode> = {
    ads: (
      <>
        <rect x="260" y="102" width="240" height="150" rx="10" />
        <path d="M290 211V164l44 17 46-54 45 30 46-29M380 252v48m-53 0h106" />
        <circle cx="290" cy="211" r="5" /><circle cx="380" cy="127" r="5" /><circle cx="471" cy="128" r="5" />
      </>
    ),
    sla: (
      <>
        <rect x="264" y="92" width="232" height="210" rx="12" />
        <rect x="292" y="122" width="176" height="38" rx="4" />
        <rect x="292" y="178" width="176" height="38" rx="4" />
        <rect x="292" y="234" width="176" height="38" rx="4" />
        <path d="M310 141h76l14-9 18 18 32-9M310 197h90l14-7 36 7" />
      </>
    ),
    royalty: (
      <>
        <circle cx="380" cy="190" r="105" />
        <path d="m354 139 78 51-78 51V139Z" />
        <path d="M246 110c-43 43-43 117 0 160M514 110c43 43 43 117 0 160" />
      </>
    ),
    'gov-subsidy': (
      <>
        <path d="m380 82 148 67H232L380 82Z" />
        <path d="M258 164v126m56-126v126m66-126v126m66-126v126m56-126v126M218 302h324M198 328h364" />
        <rect x="320" y="203" width="120" height="92" rx="5" />
        <path d="m345 248 22 20 46-48" />
      </>
    ),
    'gov-project': (
      <>
        <path d="M250 325V105h18v220M268 127h250M420 127v52M482 127l-62 52" />
        <rect x="318" y="232" width="188" height="93" />
        <path d="M318 265h188M358 232v93m54-93v93m54-93v93" />
        <path d="M516 127v98m-18 0h36l-18 30-18-30Z" />
      </>
    ),
    supply: (
      <>
        <path d="M250 165h188v137H250zM250 165l94-56 94 56M284 210h52v92m30-92h42v42h-42z" />
        <path d="M448 247h100l40 43v12H448v-55Z" />
        <circle cx="482" cy="306" r="21" /><circle cx="558" cy="306" r="21" />
      </>
    ),
    'factory-quality': (
      <>
        <path d="M218 310h330M247 283h250M278 283v-68m0 0 51-42m0 0 47 35m-47-35v-48" />
        <circle cx="278" cy="215" r="18" /><circle cx="329" cy="173" r="18" /><circle cx="376" cy="208" r="18" />
        <path d="M376 208v38l35 18m-8-17 25 21-31 7" />
        <circle cx="297" cy="310" r="12" /><circle cx="372" cy="310" r="12" /><circle cx="447" cy="310" r="12" />
      </>
    ),
    'factory-energy': (
      <>
        <path d="M232 320V187l72 42v-42l72 42v-73h36v164M412 249h114v71" />
        <path d="m465 109-46 83h39l-18 72 72-98h-43l24-57h-28Z" />
        <circle cx="284" cy="273" r="15" /><circle cx="349" cy="273" r="15" />
      </>
    ),
    'finance-credit': (
      <>
        <path d="m380 91 128 58H252L380 91ZM278 166v128m52-128v128m50-128v128m50-128v128m52-128v128M238 307h284" />
        <rect x="512" y="205" width="112" height="88" rx="8" />
        <path d="M534 230h69m-69 24h48m-48 20h61" />
        <path d="M225 236h-82m0 0 22-22m-22 22 22 22" />
      </>
    ),
    'finance-insurance': (
      <>
        <path d="M274 249h116l48 46v21H274v-67Z" />
        <circle cx="312" cy="318" r="22" /><circle cx="405" cy="318" r="22" />
        <path d="M505 95 600 130v72c0 65-43 104-95 126-52-22-95-61-95-126v-72l95-35Z" />
        <path d="m462 206 28 28 60-70" />
      </>
    ),
    'education-training': (
      <>
        <rect x="242" y="95" width="276" height="146" rx="7" />
        <path d="M275 133h115m-115 31h176m-176 31h143M300 285h80v43h-80zm160 0h80v43h-80z" />
        <circle cx="274" cy="272" r="13" /><circle cx="434" cy="272" r="13" />
      </>
    ),
    'education-research': (
      <>
        <path d="M332 92v80l-73 123c-10 18 3 39 24 39h194c21 0 34-21 24-39l-73-123V92M305 92h150M294 255h172" />
        <circle cx="355" cy="278" r="11" /><circle cx="413" cy="300" r="8" /><circle cx="391" cy="258" r="6" />
        <path d="M542 137c0 38-62 38-62 0s62-38 62 0Zm-31-31v62m-31-31h62" />
      </>
    ),
  };

  return (
    <svg className="story-scene-backdrop" viewBox="0 0 760 420" aria-hidden="true">
      <g>{common}{scenes[storyId]}</g>
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
      }, (timerIndex + 1) * 1250));
    });
  };

  return (
    <article
      className={`story-panel story-panel--${categoryKeys[story.category]} story-panel--${mode}`}
      id={story.id}
      aria-label={`${story.title}案例`}
    >
      <SceneBackdrop storyId={story.id} />

      <div className="story-panel-content">
        <header className="story-panel-head">
          <div>
            <span className="case-index">CASE {String(index + 1).padStart(2, '0')} / {String(stories.length).padStart(2, '0')} · {story.category}</span>
            <h2>{story.title}</h2>
            <p>{playbook.oneLine}</p>
          </div>

          <div className="story-panel-actions">
            <div className="mode-switch" aria-label="切换履约情况">
              <button type="button" className={mode === 'normal' ? 'is-active' : ''} onClick={() => setMode('normal')}>
                <Icon name="check" /> 正常履约
              </button>
              <button type="button" className={mode === 'risk' ? 'is-active' : ''} onClick={() => setMode('risk')}>
                <Icon name="shield" /> 具体造假
              </button>
            </div>
            <button className="story-play" type="button" onClick={play} aria-label="播放四步业务流程">
              <Icon name={playing ? 'pause' : 'play'} /> {playing ? '演示中' : '播放流程'}
            </button>
          </div>
        </header>

        <div className="legacy-contrast">
          <span>传统智能合约</span>
          <p>{story.legacyExecution}</p>
          <code>result = true</code>
        </div>

        <div className="story-actors" aria-label="业务参与方">
          <span><i>{story.nodes[0]}</i><strong>{participants.initiator.name}</strong><small>{participants.initiator.role}</small></span>
          <em>协作</em>
          <span><i>{story.nodes[1]}</i><strong>{participants.operator.name}</strong><small>{participants.operator.role}</small></span>
          <em>取证</em>
          <span><i><Icon name="terminal" /></i><strong>{participants.evidence.name}</strong><small>{participants.evidence.role}</small></span>
          <em>裁决</em>
          <span className="is-acvm"><i>AC</i><strong>ACVM</strong><small>改变合约状态并生成凭证</small></span>
        </div>

        <div className="story-step-track" style={{ '--story-progress': `${phase * 33.333}%` } as React.CSSProperties}>
          {steps.map((step, stepIndex) => (
            <button
              type="button"
              key={step.label}
              className={stepIndex === phase ? 'is-active' : stepIndex < phase ? 'is-done' : ''}
              onClick={() => {
                stop();
                setPhase(stepIndex);
              }}
              aria-current={stepIndex === phase ? 'step' : undefined}
            >
              <span>{stepIndex < phase ? <Icon name="check" /> : `0${stepIndex + 1}`}</span>
              <small>{step.actor}</small>
              <strong>{step.label}</strong>
              <p>{step.title}</p>
            </button>
          ))}
        </div>

        <div className="story-step-detail" aria-live="polite">
          <div>
            <span>0{phase + 1}</span>
            <small>{current.actor}</small>
          </div>
          <section>
            <strong>{current.title}</strong>
            <p>{current.detail}</p>
          </section>
          <aside>
            <small>{mode === 'risk' && phase === 3 ? '控制结果' : '当前可验证产物'}</small>
            <p>{current.artifact}</p>
          </aside>
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
    const target = track.children.item(next) as HTMLElement | null;
    target?.scrollIntoView({ behavior, block: 'nearest', inline: 'start' });
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
    <section className="screen story-gallery-screen" id="stories" data-screen="1">
      <div
        className="story-gallery"
        ref={trackRef}
        tabIndex={0}
        aria-label="ACVM 行业场景横向展厅"
        onScroll={(event) => {
          window.cancelAnimationFrame(scrollFrame.current);
          const track = event.currentTarget;
          scrollFrame.current = window.requestAnimationFrame(() => {
            const centers = Array.from(track.children).map((child) => {
              const rect = (child as HTMLElement).getBoundingClientRect();
              return Math.abs(rect.left + rect.width / 2 - window.innerWidth / 2);
            });
            const index = centers.indexOf(Math.min(...centers));
            if (index !== activeStory) setActiveStory(index);
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
