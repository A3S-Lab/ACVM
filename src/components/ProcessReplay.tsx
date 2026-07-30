import { useEffect, useState } from 'react';
import industryScenes from '../assets/acvm-industry-scenes.png';
import roleSprites from '../assets/acvm-role-sprites.png';
import { useReducedMotion } from '../hooks';
import { Icon, type IconName } from './Icons';
import {
  storyOptions,
  storyParticipants,
  storyPlaybooks,
  type Story,
  type StoryId,
} from './TrustFlow';

type ReplayMode = 'legacy' | 'acvm';
type ReplayBranch = 'success' | 'failure';
type ActorKey = 'initiator' | 'operator' | 'evidence' | 'acvm' | 'ledger';

export type ReplayState = {
  fund: string;
  evidence: string;
  authority: string;
  ledger: string;
};

export type ReplayStage = {
  key: string;
  label: string;
  phase: string;
  title: string;
  detail: string;
  artifact: string;
  from: ActorKey[];
  to: ActorKey[];
  actors: ActorKey[];
  capability: string;
  capabilityHint: string;
  inputs: string[];
  rule: string;
  success: string;
  failure: string;
  state: ReplayState;
};

type ReplayActor = {
  key: ActorKey;
  type: string;
  name: string;
  role: string;
  icon: IconName;
};

const stageIcons: Record<string, IconName> = {
  agreement: 'fingerprint',
  operation: 'bolt',
  evidence: 'terminal',
  private: 'lock',
  control: 'shield',
  consensus: 'chain',
  settlement: 'receipt',
  report: 'eye',
  wallet: 'key',
  transfer: 'terminal',
  hash: 'chain',
};

const spriteIndex: Record<ActorKey, number> = {
  initiator: 0,
  operator: 1,
  evidence: 1,
  acvm: 2,
  ledger: 3,
};

const industrySceneIndex: Record<StoryId, number> = {
  ads: 0,
  sla: 1,
  royalty: 2,
  'gov-subsidy': 3,
  'gov-project': 4,
  supply: 5,
  'factory-quality': 6,
  'factory-energy': 7,
  'finance-credit': 8,
  'finance-insurance': 9,
  'education-training': 10,
  'education-research': 11,
};

function RoleVisual({ actor, size = 'medium' }: { actor: ActorKey; size?: 'small' | 'medium' | 'large' | 'world' }) {
  return (
    <span
      className={`role-visual role-visual--${actor} role-visual--${size}`}
      style={{ '--sprite-offset': `${spriteIndex[actor] * -25}%` } as React.CSSProperties}
      aria-hidden="true"
    >
      <img src={roleSprites} alt="" draggable={false} />
    </span>
  );
}

function IndustryScene({ storyId }: { storyId: StoryId }) {
  const index = industrySceneIndex[storyId];
  const column = index % 4;
  const row = Math.floor(index / 4);
  return (
    <span
      className="industry-scene"
      style={{
        '--scene-offset-x': `${column * -25}%`,
        '--scene-offset-y': `${row * -(100 / 3)}%`,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      <img src={industryScenes} alt="" draggable={false} />
    </span>
  );
}

export function getAcvmStages(story: Story): ReplayStage[] {
  const participants = storyParticipants[story.id];
  const playbook = storyPlaybooks[story.id];

  return [
    {
      key: 'agreement',
      label: playbook.labels[0],
      phase: '01 · 共同约定',
      title: `${participants.initiator.name}与${participants.operator.name}共同确认规则，ACVM 核验身份后生效`,
      detail: `${participants.initiator.role}；${participants.operator.role}。任何一方都不能在执行途中单独改口径。`,
      artifact: playbook.agreement.object,
      from: ['initiator'],
      to: ['operator', 'acvm'],
      actors: ['initiator', 'operator', 'acvm'],
      capability: '身份与责任合约',
      capabilityHint: '组织身份 · Agent 身份 · 双方签章',
      inputs: [`${participants.initiator.name}组织凭证`, `${participants.operator.name}责任签章`, '规则版本与结算上限'],
      rule: playbook.agreement.rule,
      success: playbook.agreement.result,
      failure: '身份、签章或责任边界任一不完整，合约不发布，资金不进入执行。',
      state: {
        fund: `${story.amount} 已锁定`,
        evidence: '等待业务履约',
        authority: '双方身份已核验',
        ledger: '合约身份已登记',
      },
    },
    {
      key: 'operation',
      label: playbook.labels[1],
      phase: '02 · 真实履约',
      title: playbook.operation.action,
      detail: `${participants.operator.name}执行真实业务，${participants.evidence.name}同步产生过程记录；ACVM 只跟踪承诺状态，不替任何一方自报结果。`,
      artifact: playbook.operation.object,
      from: ['operator'],
      to: ['evidence', 'initiator'],
      actors: ['initiator', 'operator', 'evidence'],
      capability: '长期任务状态',
      capabilityHint: '过程事件 · 连续承诺 · 业务截止点',
      inputs: [participants.operator.role, playbook.subject, '过程状态承诺'],
      rule: '达到约定业务节点，且过程记录连续，才能发起下一步核验。',
      success: playbook.operation.result,
      failure: playbook.operation.hold,
      state: {
        fund: '额度保持锁定',
        evidence: '过程证据持续生成',
        authority: '执行权限未扩大',
        ledger: '履约状态持续承诺',
      },
    },
    {
      key: 'evidence',
      label: playbook.labels[2],
      phase: '03 · 多方出证',
      title: playbook.evidence.action,
      detail: `${story.zeroTrustTitle}。ACVM Agent 先理解接口，再申请本次任务所需的最小只读权限。`,
      artifact: `${playbook.evidence.items.length} 份签名证据 · 同一业务编号`,
      from: ['evidence'],
      to: ['acvm'],
      actors: ['evidence', 'acvm'],
      capability: '渐进式 API + 零信任',
      capabilityHint: 'list → describe → dry-run → execute',
      inputs: [...playbook.evidence.items],
      rule: '合约身份有效 ∧ 短期凭据有效 ∧ 只读范围属于本次业务。',
      success: playbook.evidence.result,
      failure: playbook.evidence.missing,
      state: {
        fund: '额度保持锁定',
        evidence: `${playbook.evidence.items.length}/${playbook.evidence.items.length} 来源已签名`,
        authority: '逐次授权 · 最小范围',
        ledger: '证据根待生成',
      },
    },
    {
      key: 'private',
      label: playbook.labels[3],
      phase: '04 · 隐私核验',
      title: story.privateTitle,
      detail: `${story.privateDetail} ACVM 只接收结论、证明和必要的差异摘要。`,
      artifact: '密文输入 → TEE 推理 → 可验证结论',
      from: ['evidence', 'acvm'],
      to: ['acvm'],
      actors: ['evidence', 'acvm'],
      capability: 'a3s-box × a3s-power',
      capabilityHint: '原始数据不出域 · 计算过程可证明',
      inputs: [...playbook.evidence.items],
      rule: playbook.privateRule,
      success: story.verification,
      failure: playbook.verifyFail,
      state: {
        fund: '核验期间保持锁定',
        evidence: '原始数据留在隐私域',
        authority: 'TEE 证明已验证',
        ledger: '核验摘要待提交',
      },
    },
    {
      key: 'control',
      label: playbook.labels[4],
      phase: '05 · 安全裁决',
      title: 'AnySentry 判断风险，ACVM 把决定落实为放行或阻断',
      detail: story.sentry,
      artifact: 'Policy v3.8 · ALLOW / BLOCK · 控制回执',
      from: ['acvm'],
      to: ['initiator', 'operator'],
      actors: ['initiator', 'operator', 'acvm'],
      capability: 'AnySentry × ACVM',
      capabilityHint: '持续观测 · 风险判断 · 强制控制',
      inputs: [...playbook.safety.signals],
      rule: playbook.safety.rule,
      success: `ALLOW · ${story.sentry}`,
      failure: playbook.safety.block,
      state: {
        fund: '等待安全放行',
        evidence: '风险信号已闭合',
        authority: 'ALLOW · 可进入共识',
        ledger: '策略决定已签名',
      },
    },
    {
      key: 'consensus',
      label: playbook.labels[5],
      phase: '06 · 联盟确认',
      title: story.consensus,
      detail: '各机构节点验证的是同一份身份、规则版本、证据根和安全决定；原始业务数据不上链。',
      artifact: `${story.nodes[0]}节点 + ${story.nodes[1]}节点 + 审计节点`,
      from: ['initiator', 'operator', 'acvm'],
      to: ['ledger'],
      actors: ['initiator', 'operator', 'acvm', 'ledger'],
      capability: '联盟链共识',
      capabilityHint: '业务节点 · 监管/审计节点 · 不可抵赖',
      inputs: ['身份与规则版本', '核验证明根', 'AnySentry 控制回执'],
      rule: '法定参与节点对同一执行事实完成签名，共识策略达到阈值。',
      success: `${story.consensus}，执行事实进入确认区块。`,
      failure: '任一必需节点拒绝或证明根不一致，结算指令不生成。',
      state: {
        fund: '满足结算条件',
        evidence: '证明根已共同确认',
        authority: '共识阈值已达到',
        ledger: '执行事实已入块',
      },
    },
    {
      key: 'settlement',
      label: playbook.labels[6],
      phase: '07 · 执行闭环',
      title: story.receipt,
      detail: 'ACVM 按已确认的金额和备案收款主体执行付款或拨付，并把身份、证据根、规则和控制决定封装成审计凭证。',
      artifact: `${story.receiptLabel} · ${story.amount}`,
      from: ['acvm', 'ledger'],
      to: ['operator'],
      actors: ['operator', 'acvm', 'ledger'],
      capability: '结算与审计凭证',
      capabilityHint: '业务执行 · 联盟账本 · 全程可追责',
      inputs: ['共识执行回执', '备案收款主体', story.receiptLabel],
      rule: `共识已通过 ∧ 金额不超过 ${story.amount} ∧ 收款主体为 ${participants.operator.name}。`,
      success: `${story.receipt}；${story.receiptLabel} 已封存。`,
      failure: '金额、账户或收款主体发生任何变化，重新授权并再次共识。',
      state: {
        fund: `${story.amount} 已执行`,
        evidence: '完整凭证已封存',
        authority: '执行闭环完成',
        ledger: story.receiptLabel,
      },
    },
  ];
}

function getLegacyStages(story: Story): ReplayStage[] {
  const participants = storyParticipants[story.id];
  const playbook = storyPlaybooks[story.id];

  return [
    {
      key: 'report',
      label: '单方上报',
      phase: '01 · 链外黑箱',
      title: story.legacyInference,
      detail: `${participants.operator.name}或业务系统汇总链外过程，再向链提交一个结果；其他参与方如何协同没有进入合约语义。`,
      artifact: 'result = true · source = unknown',
      from: ['operator', 'evidence'],
      to: ['acvm'],
      actors: ['operator', 'evidence', 'acvm'],
      capability: '链外系统上报',
      capabilityHint: '来源、工具过程和授权范围不可见',
      inputs: [playbook.evidence.items[0], playbook.evidence.items[1], '汇总结果字段'],
      rule: '上报方声称结果已通过。',
      success: '传统合约接收到 result = true。',
      failure: '即使证据缺失或被选择性汇总，链上也无法识别。',
      state: {
        fund: '等待交易调用',
        evidence: '仅收到结果字段',
        authority: '数据来源未知',
        ledger: '链外过程不可见',
      },
    },
    {
      key: 'wallet',
      label: '钱包签名',
      phase: '02 · 地址授权',
      title: `共享钱包地址为 ${story.amount} 交易签名`,
      detail: '钱包只能证明某个私钥签过名，不能证明具体 Agent、企业责任主体、工具能力和本次授权边界。',
      artifact: '0x8A…91F · shared key',
      from: ['acvm'],
      to: ['ledger'],
      actors: ['acvm', 'ledger'],
      capability: '私钥持有人',
      capabilityHint: 'KEY HOLDER ONLY',
      inputs: ['钱包地址', 'result = true', `amount = ${story.amount}`],
      rule: '交易签名有效，余额足够。',
      success: '交易进入传统虚拟机。',
      failure: '无法判断签名背后是谁、为何有权执行这笔业务。',
      state: {
        fund: '准备执行转账',
        evidence: '业务证据未随交易进入',
        authority: '仅验证私钥',
        ledger: '交易进入内存池',
      },
    },
    {
      key: 'transfer',
      label: '静态执行',
      phase: '03 · 字段触发',
      title: '传统虚拟机按传入字段执行 if / then 规则',
      detail: story.legacyExecution,
      artifact: 'if result == true → transfer(amount)',
      from: ['ledger'],
      to: ['operator'],
      actors: ['operator', 'ledger'],
      capability: '确定性状态机',
      capabilityHint: '能算字段，不能理解业务过程',
      inputs: ['result = true', `amount = ${story.amount}`, 'recipient address'],
      rule: 'result 等于 true 即转账。',
      success: `链按输入向地址执行 ${story.amount}。`,
      failure: '错误、伪造或缺少上下文的结果，也可能触发同样的转账。',
      state: {
        fund: `${story.amount} 已执行`,
        evidence: '真实性未验证',
        authority: '上下文未验证',
        ledger: '交易结果已写入',
      },
    },
    {
      key: 'hash',
      label: '只留哈希',
      phase: '04 · 事后断点',
      title: '链上留下交易哈希，却回答不了“为什么应该付款”',
      detail: '交易发生可以证明；参与方身份、工具调用、隐私计算、安全决定和异常处置都没有形成可审计闭环。',
      artifact: 'tx 0x7F21 · context unavailable',
      from: ['ledger'],
      to: ['ledger'],
      actors: ['ledger'],
      capability: '结果留痕',
      capabilityHint: 'CONTEXT MISSING',
      inputs: ['交易哈希', '区块高度', '转账结果'],
      rule: '验证交易已被区块包含。',
      success: '能够证明交易发生过。',
      failure: '无法证明链外业务真实发生，也无法追责黑箱过程。',
      state: {
        fund: '交易已结束',
        evidence: '业务依据不可审计',
        authority: '责任主体不可还原',
        ledger: '仅有 tx 0x7F21',
      },
    },
  ];
}

export function ProcessReplayDashboard({ storyId = 'ads', active = true }: { storyId?: StoryId; active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<ReplayMode>('acvm');
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [branch, setBranch] = useState<ReplayBranch>('success');
  const [focusedActor, setFocusedActor] = useState<ActorKey | null>(null);
  const story = storyOptions.find((item) => item.id === storyId) ?? storyOptions[0];
  const participants = storyParticipants[story.id];
  const playbook = storyPlaybooks[story.id];
  const isLegacy = mode === 'legacy';
  const stages = isLegacy ? getLegacyStages(story) : getAcvmStages(story);
  const current = stages[stage];
  const failureActive = !isLegacy && branch === 'failure';

  const actors: ReplayActor[] = [
    { key: 'initiator', type: '发起与付款方', ...participants.initiator, icon: 'fingerprint' },
    { key: 'operator', type: '业务执行方', ...participants.operator, icon: 'bolt' },
    { key: 'evidence', type: '独立证据方', ...participants.evidence, icon: 'terminal' },
    {
      key: 'acvm',
      type: isLegacy ? '链外黑箱' : '可信执行方',
      name: isLegacy ? '链外脚本 · 共享钱包' : 'ACVM Agent',
      role: isLegacy ? '汇总上报字段并持有交易私钥' : '调用工具、核验证据并落实控制决定',
      icon: isLegacy ? 'key' : 'shield',
    },
    {
      key: 'ledger',
      type: '共识与审计方',
      name: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`,
      role: isLegacy ? '只记录交易结果' : '共同确认执行事实并封存审计凭证',
      icon: 'chain',
    },
  ];

  const actorByKey = Object.fromEntries(actors.map((actor) => [actor.key, actor])) as Record<ActorKey, ReplayActor>;
  const focus = focusedActor ? actorByKey[focusedActor] : null;
  const fromActor = actorByKey[current.from[0]];
  const toActor = actorByKey[current.to[0]];
  const shownState: ReplayState = failureActive
    ? {
        fund: '已冻结 · 不执行',
        evidence: '异常差异已保全',
        authority: 'BLOCK · 控制已落实',
        ledger: '异常事件已留证',
      }
    : current.state;

  useEffect(() => {
    if (!active || reducedMotion || !playing || failureActive) return;
    const timer = window.setTimeout(() => {
      setStage((value) => (value + 1) % stages.length);
      setBranch('success');
      setFocusedActor(null);
    }, isLegacy ? 4700 : 5600);
    return () => window.clearTimeout(timer);
  }, [active, failureActive, isLegacy, playing, reducedMotion, stage, stages.length]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
    setBranch('success');
    setFocusedActor(null);
  }, [active, storyId]);

  const switchMode = (nextMode: ReplayMode) => {
    setMode(nextMode);
    setStage(0);
    setPlaying(true);
    setBranch('success');
    setFocusedActor(null);
  };

  const selectStage = (index: number) => {
    setStage(index);
    setPlaying(false);
    setBranch('success');
    setFocusedActor(null);
  };

  const chooseBranch = (nextBranch: ReplayBranch) => {
    setBranch(nextBranch);
    setPlaying(false);
  };

  return (
    <div
      className={`trust-demo process-replay process-replay--${current.key} ${isLegacy ? 'process-replay--legacy' : 'process-replay--acvm'} ${failureActive ? 'process-replay--failure' : ''}`}
      data-testid="process-replay"
      style={{ '--stage-count': stages.length } as React.CSSProperties}
    >
      <div className="demo-window-bar process-window-bar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="flow-mode-switch" role="group" aria-label="选择执行视角">
          <button type="button" className={isLegacy ? 'is-active' : ''} onClick={() => switchMode('legacy')} aria-pressed={isLegacy}>传统合约视角</button>
          <button type="button" className={!isLegacy ? 'is-active' : ''} onClick={() => switchMode('acvm')} aria-pressed={!isLegacy}>ACVM 全流程</button>
        </div>
        <button
          className="demo-control"
          type="button"
          onClick={() => {
            if (reducedMotion) selectStage((stage + 1) % stages.length);
            else setPlaying((value) => !value);
          }}
          aria-label={reducedMotion ? '播放下一步' : playing ? '暂停动画' : '继续动画'}
        >
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
          <span>{reducedMotion ? '下一步' : playing ? '暂停' : '继续'}</span>
        </button>
      </div>

      <div className="process-replay-body">
        <div className="process-context-strip">
          <div><small>业务实例</small><strong>{playbook.subject}</strong></div>
          <div><small>执行合约</small><strong>{story.contract}</strong></div>
          <div><small>当前进度</small><strong>{String(stage + 1).padStart(2, '0')} / {String(stages.length).padStart(2, '0')} · {current.label}</strong></div>
        </div>

        <section className="collaboration-stage" aria-label={`${story.title}全程参与方`}>
          <header><span>全程参与方</span><small>点击角色，查看它在当前步骤的责任</small></header>
          <div className="collaboration-actors">
            {actors.map((actor) => {
              const isCurrent = current.actors.includes(actor.key);
              const isFrom = current.from.includes(actor.key);
              const isTo = current.to.includes(actor.key);
              const hasActed = stages.slice(0, stage).some((item) => item.actors.includes(actor.key));
              return (
                <button
                  type="button"
                  key={actor.key}
                  className={`${isCurrent ? 'is-current' : ''} ${hasActed ? 'is-done' : ''} ${focusedActor === actor.key ? 'is-focused' : ''}`}
                  onClick={() => setFocusedActor((value) => value === actor.key ? null : actor.key)}
                  aria-pressed={focusedActor === actor.key}
                >
                  <RoleVisual actor={actor.key} size="small" />
                  <span><small>{actor.type}</small><strong>{actor.name}</strong></span>
                  <em>{isFrom ? '提交' : isTo ? '接收' : isCurrent ? '协同' : hasActed ? '已参与' : '待进入'}</em>
                </button>
              );
            })}
          </div>
          <div className={`actor-inspector ${focus ? 'is-open' : ''}`} aria-live="polite">
            <Icon name={focus?.icon ?? 'spark'} />
            {focus ? (
              <p><strong>{focus.name}</strong><span>{focus.role}。{current.actors.includes(focus.key) ? `当前参与“${current.label}”。` : '当前步骤由其他参与方执行。'}</span></p>
            ) : (
              <p><strong>本步协同</strong><span>{current.from.map((key) => actorByKey[key].name).join(' + ')} 将业务对象交给 {current.to.map((key) => actorByKey[key].name).join(' + ')}。</span></p>
            )}
          </div>
        </section>

        <div className="process-main-grid">
          <section className="process-cinema" aria-live="polite">
            <IndustryScene storyId={story.id} />
            <div className="cinema-light cinema-light--one" aria-hidden="true" />
            <div className="cinema-light cinema-light--two" aria-hidden="true" />
            <header><span>{current.phase}</span><small>{current.from.map((key) => actorByKey[key].name).join(' + ')} → {current.to.map((key) => actorByKey[key].name).join(' + ')}</small></header>
            <div className="cinema-handoff">
              <div className="cinema-figure cinema-figure--from">
                <RoleVisual actor={fromActor.key} size="large" />
                <span><small>提交方</small><strong>{current.from.map((key) => actorByKey[key].name).join(' + ')}</strong></span>
              </div>
              <div className="cinema-transfer">
                <i className="transfer-rail"><b /></i>
                <div className="transfer-capsule">
                  <Icon name={stageIcons[current.key] ?? 'spark'} />
                  <span><small>本步传递对象</small><strong>{current.artifact}</strong></span>
                </div>
              </div>
              <div className="cinema-figure cinema-figure--to">
                <RoleVisual actor={toActor.key} size="large" />
                <span><small>接收方</small><strong>{current.to.map((key) => actorByKey[key].name).join(' + ')}</strong></span>
              </div>
            </div>
            <div className="cinema-narrative">
              <span>{String(stage + 1).padStart(2, '0')}</span>
              <div><strong>{current.title}</strong><p>{current.detail}</p></div>
            </div>
          </section>

          <aside className="process-decision">
            <header>
              <span><Icon name={stageIcons[current.key] ?? 'shield'} /></span>
              <div><small>{isLegacy ? '链能看到什么' : 'ACVM 此刻在做什么'}</small><strong>{current.capability}</strong><p>{current.capabilityHint}</p></div>
            </header>
            <div className="decision-inputs">
              <small>进入本步的业务输入</small>
              <div>{current.inputs.map((input) => <span key={input}>{input}</span>)}</div>
            </div>
            <div className="decision-rule"><span>判断条件</span><p>{current.rule}</p></div>
            {isLegacy ? (
              <div className="legacy-blindspots">
                <span>身份责任未知</span><span>工具过程不可见</span><span>隐私计算不可证</span><span>安全决定未闭环</span>
              </div>
            ) : (
              <div className="decision-branches" role="group" aria-label="模拟本步判断结果">
                <button type="button" className={branch === 'success' ? 'is-active' : ''} onClick={() => chooseBranch('success')} aria-pressed={branch === 'success'}>
                  <span><Icon name="check" /> 条件通过</span><p>{current.success}</p>
                </button>
                <button type="button" className={branch === 'failure' ? 'is-active' : ''} onClick={() => chooseBranch('failure')} aria-pressed={branch === 'failure'}>
                  <span><Icon name="shield" /> 注入异常</span><p>{current.failure}</p>
                </button>
              </div>
            )}
          </aside>
        </div>

        <div className="process-state-strip" aria-label="本次业务实时状态">
          <div><Icon name="receipt" /><span><small>资金 / 拨付</small><strong>{shownState.fund}</strong></span></div>
          <div><Icon name="eye" /><span><small>业务证据</small><strong>{shownState.evidence}</strong></span></div>
          <div><Icon name="shield" /><span><small>授权与控制</small><strong>{shownState.authority}</strong></span></div>
          <div><Icon name="chain" /><span><small>联盟链账本</small><strong>{shownState.ledger}</strong></span></div>
        </div>

        <nav className="process-timeline" aria-label={isLegacy ? '传统合约执行步骤' : 'ACVM 端到端业务步骤'}>
          {stages.map((item, index) => (
            <button
              className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''}
              key={item.key}
              type="button"
              onClick={() => selectStage(index)}
              aria-current={index === stage ? 'step' : undefined}
            >
              <span>{index < stage ? <Icon name="check" /> : index + 1}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

const worldRoutes: Record<string, string> = {
  agreement: 'M88 235 C160 145 220 165 285 218 C420 105 575 110 700 210',
  operation: 'M285 218 C350 172 410 170 480 192',
  evidence: 'M480 192 C560 142 630 160 700 210',
  private: 'M480 192 C550 88 665 98 700 210 C646 290 540 286 480 192',
  control: 'M700 210 C605 120 420 128 285 218 M700 210 C500 72 245 92 88 235',
  consensus: 'M88 235 C280 78 615 78 905 210 M285 218 C480 130 670 132 905 210',
  settlement: 'M905 210 C760 94 512 120 285 218',
  report: 'M285 218 C430 130 570 140 700 210',
  wallet: 'M700 210 C765 150 835 158 905 210',
  transfer: 'M905 210 C720 92 500 120 285 218',
  hash: 'M870 210 C870 160 940 160 940 210 C940 260 870 260 870 210',
};

export function ProcessReplay({ storyId = 'ads', active = true }: { storyId?: StoryId; active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<ReplayMode>('acvm');
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [branch, setBranch] = useState<ReplayBranch>('success');
  const [focusedActor, setFocusedActor] = useState<ActorKey | null>(null);
  const story = storyOptions.find((item) => item.id === storyId) ?? storyOptions[0];
  const participants = storyParticipants[story.id];
  const playbook = storyPlaybooks[story.id];
  const isLegacy = mode === 'legacy';
  const stages = isLegacy ? getLegacyStages(story) : getAcvmStages(story);
  const current = stages[stage];
  const failureActive = !isLegacy && branch === 'failure';

  const actors: ReplayActor[] = [
    { key: 'initiator', type: '发起与付款方', ...participants.initiator, icon: 'fingerprint' },
    { key: 'operator', type: '业务执行方', ...participants.operator, icon: 'bolt' },
    { key: 'evidence', type: '行业证据现场', ...participants.evidence, icon: 'terminal' },
    {
      key: 'acvm',
      type: isLegacy ? '链外黑箱' : '可信执行方',
      name: isLegacy ? '链外脚本' : 'ACVM Agent',
      role: isLegacy ? '接收一个结果字段，再用共享钱包发交易' : '调用工具、核验证据、落实 AnySentry 决定',
      icon: isLegacy ? 'key' : 'shield',
    },
    {
      key: 'ledger',
      type: '共识与审计方',
      name: `${story.nodes[0]}节点 · ${story.nodes[1]}节点 · 审计节点`,
      role: isLegacy ? '只记录交易结果' : '多机构共同确认执行事实并封存凭证',
      icon: 'chain',
    },
  ];

  const actorByKey = Object.fromEntries(actors.map((actor) => [actor.key, actor])) as Record<ActorKey, ReplayActor>;
  const focus = focusedActor ? actorByKey[focusedActor] : null;
  const shownState: ReplayState = failureActive
    ? { fund: '已冻结 · 不执行', evidence: '异常差异已保全', authority: 'BLOCK · 已落实', ledger: '异常事件已留证' }
    : current.state;
  const outcome = failureActive ? current.failure : current.success;

  useEffect(() => {
    if (!active || reducedMotion || !playing || failureActive) return;
    const timer = window.setTimeout(() => {
      setStage((value) => (value + 1) % stages.length);
      setBranch('success');
      setFocusedActor(null);
    }, isLegacy ? 5200 : 6500);
    return () => window.clearTimeout(timer);
  }, [active, failureActive, isLegacy, playing, reducedMotion, stage, stages.length]);

  useEffect(() => {
    if (!active) return;
    setStage(0);
    setPlaying(true);
    setBranch('success');
    setFocusedActor(null);
  }, [active, storyId]);

  const switchMode = (nextMode: ReplayMode) => {
    setMode(nextMode);
    setStage(0);
    setPlaying(true);
    setBranch('success');
    setFocusedActor(null);
  };

  const selectStage = (index: number) => {
    setStage(index);
    setPlaying(false);
    setBranch('success');
    setFocusedActor(null);
  };

  const chooseBranch = (nextBranch: ReplayBranch) => {
    setBranch(nextBranch);
    setPlaying(false);
  };

  const worldActorKeys: ActorKey[] = ['initiator', 'operator', 'acvm', 'ledger'];

  return (
    <div
      className={`trust-demo cinematic-replay cinematic-replay--${current.key} ${isLegacy ? 'cinematic-replay--legacy' : 'cinematic-replay--acvm'} ${failureActive ? 'cinematic-replay--failure' : ''}`}
      data-testid="process-replay"
      style={{ '--stage-count': stages.length } as React.CSSProperties}
    >
      <header className="cinematic-toolbar">
        <div className="cinematic-case-id">
          <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
          <p><small>正在执行</small><strong>{playbook.subject}</strong></p>
        </div>
        <div className="flow-mode-switch" role="group" aria-label="选择执行视角">
          <button type="button" className={isLegacy ? 'is-active' : ''} onClick={() => switchMode('legacy')} aria-pressed={isLegacy}>传统合约</button>
          <button type="button" className={!isLegacy ? 'is-active' : ''} onClick={() => switchMode('acvm')} aria-pressed={!isLegacy}>ACVM 全流程</button>
        </div>
        <button
          className="cinematic-play"
          type="button"
          onClick={() => reducedMotion ? selectStage((stage + 1) % stages.length) : setPlaying((value) => !value)}
          aria-label={reducedMotion ? '播放下一幕' : playing ? '暂停动画' : '继续动画'}
        >
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
          <span>{reducedMotion ? '下一幕' : playing ? '暂停' : '继续'}</span>
        </button>
      </header>

      <section className="cinematic-world" aria-label={`${story.title}三维业务协同场景`}>
        <div className="world-sky" aria-hidden="true"><i /><i /><i /></div>
        <div className="world-floor" aria-hidden="true" />
        <svg className="world-route" viewBox="0 0 1000 330" preserveAspectRatio="none" aria-hidden="true">
          <path d={worldRoutes[current.key] ?? worldRoutes.evidence} pathLength="1" />
        </svg>

        {worldActorKeys.map((key) => {
          const actor = actorByKey[key];
          const isCurrent = current.actors.includes(key);
          const isFrom = current.from.includes(key);
          const isTo = current.to.includes(key);
          return (
            <button
              type="button"
              key={key}
              className={`world-actor world-actor--${key} ${isCurrent ? 'is-current' : ''} ${isFrom ? 'is-from' : ''} ${isTo ? 'is-to' : ''} ${focusedActor === key ? 'is-focused' : ''}`}
              onClick={() => setFocusedActor((value) => value === key ? null : key)}
              aria-label={`查看${actor.name}的责任`}
              aria-pressed={focusedActor === key}
            >
              <RoleVisual actor={key} size="world" />
              <span><small>{actor.type}</small><strong>{actor.name}</strong><em>{isFrom ? '正在提交' : isTo ? '正在接收' : isCurrent ? '参与本步' : '等待协同'}</em></span>
            </button>
          );
        })}

        <button
          type="button"
          className={`world-actor world-actor--evidence ${current.actors.includes('evidence') ? 'is-current' : ''} ${current.from.includes('evidence') ? 'is-from' : ''} ${current.to.includes('evidence') ? 'is-to' : ''} ${focusedActor === 'evidence' ? 'is-focused' : ''}`}
          onClick={() => setFocusedActor((value) => value === 'evidence' ? null : 'evidence')}
          aria-label={`查看${actorByKey.evidence.name}的责任`}
          aria-pressed={focusedActor === 'evidence'}
        >
          <IndustryScene storyId={story.id} />
          <span><small>{actorByKey.evidence.type}</small><strong>{actorByKey.evidence.name}</strong><em>{current.actors.includes('evidence') ? '现场正在出证' : '持续产生业务事实'}</em></span>
        </button>

        <div className="world-inputs" aria-label="当前业务输入">
          {current.inputs.slice(0, 3).map((input, index) => <span key={input} style={{ '--input-order': index } as React.CSSProperties}><i /><strong>{input}</strong></span>)}
        </div>

        <div className="world-artifact" aria-live="polite">
          <span><Icon name={stageIcons[current.key] ?? 'spark'} /></span>
          <p><small>正在流转</small><strong>{current.artifact}</strong></p>
        </div>

        <div className="privacy-dome" aria-hidden="true"><i /><i /><span>a3s-box</span><strong>a3s-power</strong></div>
        <div className="sentry-scan" aria-hidden="true"><i /><span>AnySentry</span></div>
        <div className="consensus-field" aria-hidden="true"><i /><i /><i /></div>
        <div className="settlement-receipt" aria-hidden="true"><Icon name="receipt" /><span>{story.amount}</span></div>
        <div className="legacy-blackbox" aria-hidden={!isLegacy}><Icon name="eye" /><strong>result = true</strong><small>source unknown</small></div>

        {focus ? (
          <aside className={`world-role-callout world-role-callout--${focus.key}`} aria-live="polite">
            <Icon name={focus.icon} />
            <p><small>{focus.type}</small><strong>{focus.name}</strong><span>{focus.role}。{current.actors.includes(focus.key) ? `当前参与“${current.label}”。` : '当前等待其他参与方完成动作。'}</span></p>
            <button type="button" onClick={() => setFocusedActor(null)} aria-label="关闭角色说明">×</button>
          </aside>
        ) : null}
      </section>

      <section className="cinematic-caption" aria-live="polite">
        <div className="caption-index"><small>SCENE</small><strong>{String(stage + 1).padStart(2, '0')}</strong><span>/ {String(stages.length).padStart(2, '0')}</span></div>
        <div className="caption-story">
          <span>{current.phase} · {current.from.map((key) => actorByKey[key].name).join(' + ')} → {current.to.map((key) => actorByKey[key].name).join(' + ')}</span>
          <h3>{current.title}</h3>
          <p>{current.detail}</p>
        </div>
        <div className="caption-decision">
          <div><small>{isLegacy ? '链上判断' : current.capability}</small><p>{current.rule}</p></div>
          <div className={failureActive ? 'is-failure' : 'is-success'}><Icon name={failureActive ? 'shield' : 'check'} /><p><small>{failureActive ? '已阻断' : isLegacy ? '执行结果' : '条件通过'}</small><strong>{outcome}</strong></p></div>
        </div>
      </section>

      <footer className="cinematic-footer">
        <div className="cinematic-state">
          <span><Icon name="receipt" /><small>资金</small><strong>{shownState.fund}</strong></span>
          <span><Icon name="chain" /><small>账本</small><strong>{shownState.ledger}</strong></span>
        </div>
        <nav className="cinematic-timeline" aria-label={isLegacy ? '传统合约执行场景' : 'ACVM 端到端业务场景'}>
          {stages.map((item, index) => (
            <button
              type="button"
              key={item.key}
              className={index === stage ? 'is-active' : index < stage ? 'is-passed' : ''}
              onClick={() => selectStage(index)}
              aria-current={index === stage ? 'step' : undefined}
            >
              <span>{index < stage ? <Icon name="check" /> : index + 1}</span>
              <small>{item.label}</small>
            </button>
          ))}
        </nav>
        {!isLegacy ? (
          <div className="cinematic-branch" role="group" aria-label="模拟业务判断结果">
            <button type="button" className={branch === 'success' ? 'is-active' : ''} onClick={() => chooseBranch('success')} aria-pressed={branch === 'success'}><Icon name="check" /> 正常</button>
            <button type="button" className={branch === 'failure' ? 'is-active' : ''} onClick={() => chooseBranch('failure')} aria-pressed={branch === 'failure'}><Icon name="shield" /> 注入异常</button>
          </div>
        ) : <div className="cinematic-legacy-note"><Icon name="eye" /> 只看见结果</div>}
      </footer>
    </div>
  );
}
