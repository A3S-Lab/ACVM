import { useEffect, useRef, useState } from 'react';
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
    name: 'social.simulate.ans',
    role: '社会模拟服务',
    capability: 'social.simulate/v1',
    endpoint: 'a2a+https://simulation.lab/a2a',
    price: '¥60,000 / 已验收实验',
    reputation: '0.91 · 76 verified tasks',
    validator: 'simulation-validator-set · 4 / 7',
    icon: 'brain',
  },
  {
    name: 'fog.infer.ans',
    role: '隐私边缘推理',
    capability: 'private.infer/v1',
    endpoint: 'a2a+https://fog.mesh/a2a',
    price: '¥0.08 / 已验收推理',
    reputation: '0.97 · 24 regions online',
    validator: 'attestation-set · 2 / 3',
    icon: 'shield',
  },
];

const stages = [
  ['01', '输入名称', '调用方按服务名称发起查询，不再手工保存地址。'],
  ['02', '返回服务卡', 'ANS 返回身份、端点、能力、价格、有效期和 Validator 集。'],
  ['03', '核验记录', '调用方检查签名、凭证状态和同类任务的历史回执。'],
  ['04', '签下订单', '双方通过 A2A 确认预算、SLA、披露范围和验收条件。'],
  ['05', '执行与验收', '服务 Agent 交付结果，独立 Validator 检查证据。'],
  ['06', '结算并更新', '结果终局后支付服务费和验证费，再更新该能力的信誉。'],
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
        <section className="ans-note"><Icon name="eye" /><span><small>能查到</small><strong>身份 · 能力 · 价格 · 有效期</strong></span></section>
        <section className="ans-note"><Icon name="shield" /><span><small>仍要核验</small><strong>记录签名 · 凭证状态 · 历史回执</strong></span></section>
        <section className="ans-answer">
          <small>RESOLVED A2A RECORD</small>
          <strong>{selected.endpoint}</strong>
          <span>{selected.price}</span>
        </section>
      </div>
    </div>
  );
}
