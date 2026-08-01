import { useEffect, useRef, useState } from 'react';
import { DetailHint } from './DetailHint';
import { derivations } from './DerivationLibrary';
import { Icon, type IconName } from './Icons';

type AnsAgent = {
  name: string;
  role: string;
  capability: string;
  endpoint: string;
  price: string;
  reputation: string;
  validator: string;
  icon: IconName;
};

const agents: AnsAgent[] = [
  {
    name: 'geo.optimize.ans',
    role: 'GEO 结果优化',
    capability: 'geo.optimize/v1',
    endpoint: 'a2a+https://geo.edge/a2a',
    price: '¥10,000 / 已验证 pp',
    reputation: '0.94 · 128 verified tasks',
    validator: 'geo-validator-set · 3 / 5',
    icon: 'brain',
  },
  {
    name: 'quant.alpha.ans',
    role: '量化策略执行',
    capability: 'quant.execute/v2',
    endpoint: 'a2a+https://quant.bank/a2a',
    price: '20% / 已验证净收益',
    reputation: '0.91 · 76 verified tasks',
    validator: 'risk-validator-set · 4 / 7',
    icon: 'terminal',
  },
  {
    name: 'fog.infer.ans',
    role: '隐私边缘推理',
    capability: 'private.infer/v1',
    endpoint: 'a2a+https://fog.mesh/a2a',
    price: '0.08 CNYC / verified call',
    reputation: '0.97 · 24 regions online',
    validator: 'attestation-set · 2 / 3',
    icon: 'shield',
  },
];

const stages = [
  ['01', '名称查询', '调用方用可读名称描述要找的智能体，而不是手工保存地址。'],
  ['02', '解析能力', 'ANS 返回 DID、A2A 端点、能力版本、价格、有效期和 Validator 集。'],
  ['03', '核验证明', '调用方检查名称所有权、能力声明、历史回执和任务类型信誉。'],
  ['04', 'A2A 协商', '双方交换 Intent、预算、SLA、披露范围和验收谓词，形成签名任务。'],
  ['05', '执行验收', '服务 Agent 执行任务，独立 Validator 验收结果并提交回执。'],
  ['06', '奖励与更新', '链上按结果结算服务费和验证费，再更新对应能力域的信誉。'],
] as const;

const candidateY = [78, 158, 238];

export function AgentResolutionArchitecture() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState(0);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const selected = agents[selectedAgent];
  const selectedY = candidateY[selectedAgent];
  const routes = [
    'M128 158 C210 158 286 158 378 158',
    `M530 146 C620 116 690 ${selectedY} 758 ${selectedY}`,
    `M758 ${selectedY + 12} C670 ${selectedY + 42} 604 192 526 176`,
    `M128 146 C310 46 600 42 758 ${selectedY - 8}`,
    `M820 ${selectedY + 20} C768 272 618 286 510 268 C394 248 286 256 196 270`,
    `M196 282 C368 340 674 326 808 ${selectedY + 24}`,
  ];

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setActiveStage((stage) => (stage + 1) % stages.length), 2300);
    return () => window.clearInterval(timer);
  }, [playing, visible]);

  const selectStage = (index: number) => {
    setActiveStage(index);
    setPlaying(false);
  };

  return (
    <div className={`diagram-panel ans-panel ans-stage-${activeStage + 1} ${playing ? 'is-playing' : 'is-paused'}`} ref={panelRef}>
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ANS / AGENT NAME SERVICE / A2A</code>
        <button type="button" className="ans-play-control" onClick={() => setPlaying((value) => !value)} aria-label={playing ? '暂停 ANS 解析动画' : '继续 ANS 解析动画'}>
          <Icon name={playing ? 'pause' : 'play'} />{playing ? 'PAUSE' : 'PLAY'}
        </button>
      </header>

      <div className="ans-network" aria-label="ANS 名称解析、A2A 协作和奖励结算动画">
        <svg viewBox="0 0 1000 320" preserveAspectRatio="none" aria-hidden="true">
          {routes.map((route, index) => <path className={`ans-route ${activeStage === index ? 'is-active' : ''}`} d={route} key={`${index}-${route}`} />)}
          {playing ? (
            <circle className="ans-packet" r="5" key={`${activeStage}-${selectedAgent}`}>
              <animateMotion dur="1.7s" path={routes[activeStage]} repeatCount="indefinite" />
            </circle>
          ) : null}
        </svg>

        <div className="ans-current" aria-live="polite">
          <span>{stages[activeStage][0]}</span>
          <p><small>CURRENT STEP</small><strong>{stages[activeStage][1]}</strong>{stages[activeStage][2]}</p>
        </div>

        <div className="ans-caller">
          <Icon name="fingerprint" /><small>CALLER AGENT</small><strong>research.manager.ans</strong><code>resolve("{selected.name}")</code>
        </div>

        <section className="ans-resolver">
          <span><i /> ON-CHAIN REGISTRY</span>
          <strong>ANS</strong>
          <small>智能体解析服务</small>
          <dl>
            <div><dt>NAME</dt><dd>{selected.name}</dd></div>
            <div><dt>CAP</dt><dd>{selected.capability}</dd></div>
            <div><dt>REP</dt><dd>{selected.reputation.split(' · ')[0]}</dd></div>
          </dl>
        </section>

        <div className="ans-candidates" aria-label="可解析的智能体名称">
          {agents.map((agent, index) => (
            <button
              type="button"
              className={selectedAgent === index ? 'is-active' : ''}
              onClick={() => { setSelectedAgent(index); setPlaying(false); }}
              onMouseEnter={() => setSelectedAgent(index)}
              aria-pressed={selectedAgent === index}
              key={agent.name}
            >
              <Icon name={agent.icon} /><span><small>{agent.role}</small><strong>{agent.name}</strong><code>{agent.reputation}</code></span>
            </button>
          ))}
        </div>

        <div className="ans-ledger"><Icon name="chain" /><span><small>ACVM LEDGER</small><strong>奖励 · 回执 · 信誉</strong></span></div>
        <div className="ans-validator"><Icon name="shield" /><span><small>VALIDATOR SET</small><strong>{selected.validator}</strong></span></div>
      </div>

      <nav className="ans-stage-nav" aria-label="选择 ANS 协作步骤">
        {stages.map(([code, title], index) => (
          <button type="button" className={activeStage === index ? 'is-active' : ''} onClick={() => selectStage(index)} aria-pressed={activeStage === index} key={code}>
            <span>{code}</span><strong>{title}</strong>
          </button>
        ))}
      </nav>

      <div className="ans-design">
        <DetailHint
          className="ans-design-card"
          category="社会计算 · 奖励设计"
          label={<><Icon name="receipt" /><span><small>REWARD DESIGN</small><strong>为什么愿意服务</strong></span></>}
          title="奖励设计"
          summary="把服务费、Validator 费用、保证金和信誉增量绑定到通过验收的结果，而不是绑定到调用次数。"
          details={[
            { label: '正向奖励', value: '按结果付费、长期服务加权、稀缺能力溢价和可靠 Validator 奖励。' },
            { label: '失败成本', value: '超时、伪造回执、串谋和重复申报会扣减保证金与对应能力域信誉。' },
          ]}
          derivation={derivations.mechanismDesign}
        />
        <i aria-hidden="true" />
        <DetailHint
          className="ans-design-card"
          category="社会计算 · 信息设计"
          label={<><Icon name="eye" /><span><small>INFORMATION DESIGN</small><strong>凭什么相信服务</strong></span></>}
          title="信息设计"
          summary="ANS 只公开做决策需要的信号：签名能力、有效期、任务类型信誉、价格、Validator 和可验证历史。"
          details={[
            { label: '减少噪声', value: '信誉按能力、任务难度和时间衰减分桶，不能用大量低价值任务刷高所有能力评分。' },
            { label: '保护隐私', value: '敏感履历用选择性披露或证明表达，解析记录不公开原始业务数据。' },
          ]}
          derivation={derivations.informationDesign}
        />
        <section className="ans-answer">
          <small>RESOLVED A2A RECORD</small>
          <strong>{selected.endpoint}</strong>
          <span>{selected.price}</span>
        </section>
      </div>
    </div>
  );
}
