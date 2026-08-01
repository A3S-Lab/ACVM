import { useEffect, useState, type CSSProperties } from 'react';
import { AgentResolutionArchitecture } from './components/AgentResolutionArchitecture';
import { ContractCodeWalkthrough } from './components/ContractCodeWalkthrough';
import { FogInferenceArchitecture } from './components/FogInferenceArchitecture';
import { Icon, LogoMark } from './components/Icons';
import {
  AgentTaskGraphArchitecture,
  DisputeArchitecture,
  SocialSimulationArchitecture,
} from './components/ProtocolExpansionArchitecture';
import { ScenarioGraph } from './components/ScenarioGraph';
import { SystemPropertiesArchitecture } from './components/SystemPropertiesArchitecture';
import {
  ContractModelArchitecture,
  IntelligenceChainArchitecture,
  ReceiptModelArchitecture,
  StateModelArchitecture,
} from './components/FormalSpecArchitecture';
import { LifecycleArchitecture } from './components/LifecycleArchitecture';
import {
  TechnicalBackdrop,
  type TechnicalBackdropVariant,
} from './components/TechnicalBackdrop';
import {
  ChainArchitectureSimple,
  IdentityArchitectureSimple,
  IntelligenceProofArchitecture,
  LongTaskArchitectureSimple,
  OffchainArchitectureSimple,
  OnchainExecutionArchitecture,
  PrivacyArchitecture,
  RuntimeArchitecture,
  SentryArchitectureSimple,
} from './components/SimplifiedArchitecture';
import { TechTerm, type TechKey } from './components/TechTerm';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

const screens = [
  ['top', 'ACVM'],
  ['spec-contract', '合约模型'],
  ['code-walkthrough', '代码示例'],
  ['lifecycle', '完整生命周期'],
  ['runtime', '执行流程'],
  ['onchain', '链上执行'],
  ['spec-state', '状态模型'],
  ['spec-receipt', '回执转换'],
  ['dispute', '争议与终局'],
  ['properties', '系统性质'],
  ['identity', '身份与权限'],
  ['offchain', '链下核验'],
  ['privacy', '隐私环境'],
  ['fog', '雾推理网络'],
  ['sentry', '风险控制'],
  ['proof', '长任务证明'],
  ['intelligence', '有效计算'],
  ['spec-poi', '智能证明链'],
  ['ans', '智能体解析'],
  ['composition', '多 Agent 协作'],
  ['simulation', '社会模拟'],
  ['chains', '链适配'],
  ['stories', '业务场景'],
] as const;

const navigation = [
  { id: 'spec-contract', label: '合约与执行', screens: ['spec-contract', 'code-walkthrough', 'lifecycle', 'runtime', 'onchain'] },
  { id: 'spec-state', label: '状态与验证', screens: ['spec-state', 'spec-receipt', 'dispute', 'properties'] },
  { id: 'identity', label: '身份与隐私', screens: ['identity', 'offchain', 'privacy', 'fog', 'sentry'] },
  { id: 'proof', label: '证明与协作', screens: ['proof', 'intelligence', 'spec-poi', 'ans', 'composition', 'simulation'] },
  { id: 'chains', label: '多链部署', screens: ['chains'] },
  { id: 'stories', label: '应用网络', screens: ['stories'] },
] as const;

const technicalBackdrops: Record<string, TechnicalBackdropVariant> = {
  lifecycle: 'flow',
  runtime: 'flow',
  onchain: 'flow',
  'spec-contract': 'state',
  'code-walkthrough': 'state',
  'spec-state': 'state',
  'spec-receipt': 'state',
  dispute: 'proof',
  properties: 'proof',
  identity: 'identity',
  ans: 'network',
  composition: 'network',
  simulation: 'network',
  offchain: 'identity',
  privacy: 'fog',
  fog: 'fog',
  sentry: 'fog',
  proof: 'proof',
  intelligence: 'proof',
  'spec-poi': 'proof',
  chains: 'chains',
  stories: 'network',
};

type MechanismComparison = {
  traditionalTitle: string;
  traditional: string;
  acvmTitle: string;
  acvm: string;
};

function MechanismCompare({ traditionalTitle, traditional, acvmTitle, acvm }: MechanismComparison) {
  return (
    <div className="mechanism-compare" aria-label="传统区块链机制与 ACVM 对比">
      <section className="is-traditional">
        <header><b aria-hidden="true">×</b><small>传统机制</small></header>
        <h3>{traditionalTitle}</h3>
        <p>{traditional}</p>
      </section>
      <i aria-hidden="true" />
      <section className="is-acvm">
        <header><b aria-hidden="true">✓</b><small>ACVM</small></header>
        <h3>{acvmTitle}</h3>
        <p>{acvm}</p>
      </section>
    </div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms = [],
}: {
  index: number;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  comparison?: MechanismComparison;
  terms?: TechKey[];
}) {
  return (
    <header className="section-heading">
      <div className="section-meta">
        <span className="section-eyebrow"><i /> {eyebrow}</span>
        <span className="chapter-progress" aria-label={`第 ${index} 章，共 ${screens.length - 1} 章`}>
          CH {String(index).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}
        </span>
      </div>
      <h2>{title}<br /><em>{accent}</em></h2>
      <p>{body}</p>
      {comparison ? <MechanismCompare {...comparison} /> : null}
      {terms.length > 0 ? (
        <div className="section-terms">
          {terms.map((term) => <TechTerm term={term} key={term} />)}
        </div>
      ) : null}
    </header>
  );
}

function TechnicalSlide({
  id,
  index,
  className,
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms,
  figureLabel = 'ACVM TECHNICAL ARCHITECTURE / REV. 01',
  children,
}: {
  id: string;
  index: number;
  className: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  comparison?: MechanismComparison;
  terms?: TechKey[];
  figureLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`screen technical-screen ${className}`} id={id} data-screen={index}>
      <TechnicalBackdrop variant={technicalBackdrops[id] ?? 'flow'} />
      <div className="screen-inner technical-layout">
        <SectionHeading index={index} eyebrow={eyebrow} title={title} accent={accent} body={body} comparison={comparison} terms={terms} />
        <div className="technical-visual">
          {children}
          <div className="figure-caption" aria-hidden="true">
            <span>FIG. {String(index).padStart(2, '0')}</span><i /><span>{figureLabel}</span>
          </div>
        </div>
      </div>
      <span className="screen-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
    </section>
  );
}

function HeroConsole() {
  return (
    <div className="hero-console" aria-label="ACVM 链上核心与链下扩展的执行流程">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ACVM / ON-CHAIN RECEIPT #00521</code>
        <strong><i /> VERIFYING</strong>
      </header>
      <div className="hero-console-flow">
        <section>
          <span>01</span>
          <Icon name="receipt" />
          <strong>合约调用</strong>
          <small>交易 · 规则 · 输入</small>
        </section>
        <i className="hero-connector"><b /></i>
        <section className="is-acvm">
          <LogoMark />
          <strong>ACVM</strong>
          <small>执行与状态转换</small>
          <div><span>IDENTITY</span><span>POLICY</span><span>STATE</span><span>GAS</span></div>
        </section>
        <i className="hero-connector"><b /></i>
        <section>
          <span>03</span>
          <Icon name="chain" />
          <strong>区块确认</strong>
          <small>状态根 · 回执 · 终局</small>
        </section>
      </div>
      <div className="hero-chain-strip" aria-hidden="true">
        <span><small>BLOCK #8,421,903</small><code>0x8f…c2</code></span>
        <i />
        <span className="is-current"><small>BLOCK #8,421,904</small><code>0x71…a9</code></span>
        <i />
        <span><small>NEXT BLOCK</small><code>pending</code></span>
      </div>
      <footer>
        <code>stateRoot 0x71…ac9 · receiptRoot 0x3d…e4</code>
        <strong><Icon name="check" /> FINALIZED</strong>
      </footer>
    </div>
  );
}

function BlockchainBackdrop() {
  const blocks = [
    ['#8,421,901', '0xa8…21', 'blockchain-block--one'],
    ['#8,421,902', '0xcf…84', 'blockchain-block--two'],
    ['#8,421,903', '0x71…a9', 'blockchain-block--three'],
  ] as const;

  return (
    <div className="blockchain-backdrop" aria-hidden="true">
      <svg viewBox="0 0 1200 720" preserveAspectRatio="none">
        <path d="M720 138 854 230 1010 145" />
        <path d="M854 230 972 390 1114 322" />
        <path d="M638 412 806 520 972 390" />
        <circle cx="720" cy="138" r="4" />
        <circle cx="854" cy="230" r="5" />
        <circle cx="1010" cy="145" r="4" />
        <circle cx="972" cy="390" r="5" />
        <circle cx="1114" cy="322" r="4" />
        <circle cx="806" cy="520" r="4" />
      </svg>
      {blocks.map(([height, hash, className]) => (
        <span className={`blockchain-block ${className}`} key={height}>
          <small>BLOCK</small><strong>{height}</strong><code>{hash}</code>
        </span>
      ))}
    </div>
  );
}

function ChapterRail({ activeScreen }: { activeScreen: number }) {
  return (
    <aside className="chapter-rail" aria-label="章节快速导航">
      <header><span>CHAPTER</span><strong>{String(activeScreen).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}</strong></header>
      <nav>
        {screens.map(([id, label], index) => (
          <a
            href={`#${id}`}
            className={activeScreen === index ? 'is-active' : ''}
            aria-label={`${index === 0 ? '定义' : `第 ${index} 章`}：${label}`}
            aria-current={activeScreen === index ? 'step' : undefined}
            key={id}
          >
            <i /><span><b>{String(index).padStart(2, '0')}</b>{label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = screens[activeScreen]?.[0] ?? 'top';

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-screen]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveScreen(Number((visible.target as HTMLElement).dataset.screen));
      },
      { threshold: [0.35, 0.55, 0.75] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      window.requestAnimationFrame(() => {
        const target = document.getElementById(id);
        const scroller = document.querySelector<HTMLElement>('.page-scroller');
        const screen = target?.closest<HTMLElement>('[data-screen]') ?? (target?.matches('[data-screen]') ? target : null);
        if (!target || !scroller || !screen) return;
        if (window.matchMedia('(min-width: 961px)').matches) scroller.scrollTop = screen.offsetTop;
        else target.scrollIntoView({ block: 'start' });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  useEffect(() => {
    const scroller = document.querySelector<HTMLElement>('.page-scroller');
    if (!scroller) return undefined;

    let locked = false;
    let unlockTimer: number | undefined;
    const desktop = () => window.matchMedia('(min-width: 961px)').matches;
    const goToScreen = (nextIndex: number) => {
      const bounded = Math.max(0, Math.min(screens.length - 1, nextIndex));
      const target = document.querySelector<HTMLElement>(`[data-screen="${bounded}"]`);
      if (!target) return;
      locked = true;
      scroller.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => { locked = false; }, 680);
    };

    const onWheel = (event: WheelEvent) => {
      if (!desktop() || event.ctrlKey || Math.abs(event.deltaY) < 12 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (locked) return;
      goToScreen(activeScreen + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop()) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, button, a, [contenteditable="true"]')) return;
      if (event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        event.preventDefault();
        if (!locked) goToScreen(activeScreen + 1);
      } else if (event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        event.preventDefault();
        if (!locked) goToScreen(activeScreen - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goToScreen(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goToScreen(screens.length - 1);
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('keydown', onKeyDown);
      window.clearTimeout(unlockTimer);
    };
  }, [activeScreen]);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#top">跳到主要内容</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ACVM 首页">
          <LogoMark />
          <span><strong>ACVM</strong><small>AGENTIC CONTRACT VM</small></span>
        </a>
        <button
          className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
          type="button"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="主要导航">
          {navigation.map((item) => {
            const active = item.screens.some((screen) => screen === activeId);
            return (
              <a
                href={`#${item.id}`}
                key={item.id}
                className={active ? 'is-active' : ''}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <a className="header-github" href={githubUrl} target="_blank" rel="noreferrer" aria-label="在 GitHub 查看 ACVM 仓库">
          <Icon name="github" /><span>GitHub</span>
        </a>
        <span
          className="reading-progress"
          style={{ '--reading-progress': `${(activeScreen / (screens.length - 1)) * 100}%` } as CSSProperties}
          aria-hidden="true"
        />
      </header>

      <ChapterRail activeScreen={activeScreen} />

      <main className="page-scroller">
        <section className="screen hero-screen" id="top" data-screen="0">
          <BlockchainBackdrop />
          <div className="screen-inner hero-layout">
            <div className="hero-copy">
              <span className="hero-eyebrow"><i /> 00 / DEFINITION · AGENTIC CONTRACT VM</span>
              <h1>ACVM<br /><em className="hero-full-name">Agentic Contract VM.</em></h1>
              <p>ACVM 是 Agentic Contract VM。状态与结算在链上，Worker 执行和 Validator 验收由 a3s-box 承载，结果通过回执推进合约状态。</p>
              <ul className="hero-benefits" aria-label="ACVM 核心价值">
                <li><Icon name="bolt" />链上：状态与结算</li>
                <li><Icon name="fingerprint" />链下：Worker 执行</li>
                <li><Icon name="shield" />验证：独立验收</li>
              </ul>
              <div className="hero-actions">
                <a href="#spec-contract" className="button button--primary">查看合约结构 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">应用场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> DETERMINISTIC CORE / ASYNC EXTENSION / PROOF-CARRYING STATE</span>
          <span className="screen-number" aria-hidden="true">00</span>
        </section>

        <TechnicalSlide
          id="spec-contract" index={1} className="formal-screen contract-spec-screen"
          eyebrow="FORMAL SPEC 01 / 04 · AGENTIC CONTRACT"
          title="Agentic Contract"
          accent="文件结构"
          body="一个合约目录包含 Schema、Worker、Validator 和结算代码；目录根就是部署版本。"
          comparison={{
            traditionalTitle: '版本只覆盖链上代码',
            traditional: '链下执行器和验收规则另行部署。',
            acvmTitle: 'Contract Root 覆盖完整目录',
            acvm: '任一业务文件改变都会生成新根。',
          }}
          terms={['Content-addressed Tree', 'Task File ABI']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ContractModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="code-walkthrough" index={2} className="code-screen"
          eyebrow="BUILD WALKTHROUGH · TYPESCRIPT SDK"
          title="TypeScript SDK"
          accent="代码漫游"
          body="沿文件列表滚动，查看 Worker 写结果、Validator 写裁决、settle.ts 完成结算。"
          comparison={{
            traditionalTitle: '接口传值缺少统一证据',
            traditional: '输入、产物和裁决散在服务、数据库和日志中。',
            acvmTitle: '固定文件连接每个阶段',
            acvm: '每步只读前序文件并写入自己的结果。',
          }}
          terms={['Task File ABI', 'Content-addressed Tree']}
          figureLabel="A3S-CODE TYPESCRIPT SDK / CONTRACT WALKTHROUGH"
        ><ContractCodeWalkthrough /></TechnicalSlide>

        <TechnicalSlide
          id="lifecycle" index={3} className="lifecycle-screen"
          eyebrow="SYSTEM WALKTHROUGH · FULL LIFECYCLE"
          title="合约生命周期"
          accent="从部署到全网确认"
          body="动画依次展示部署、调用、执行、验收、证明、共识和结算。点击节点可查看链上记录。"
          comparison={{
            traditionalTitle: '任务轨迹被拆散',
            traditional: '多个系统各记一段，无法按任务连续查询。',
            acvmTitle: 'taskId 串起完整轨迹',
            acvm: '每一步记录状态根、责任方和回执。',
          }}
          terms={['Proof of Intelligence', 'BFT / HotStuff', 'Receipt Root']}
          figureLabel="ACVM FULL CONTRACT LIFECYCLE / AUTO LOOP"
        ><LifecycleArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="runtime" index={4} className="runtime-screen"
          eyebrow="EXECUTION MODEL · RUNTIME TOPOLOGY"
          title="ACVM 执行拓扑"
          accent="状态、权限和回执"
          body="合约定义调用方、Worker、Validator、权限和完成条件，ACVM 按回执推进状态。"
          comparison={{
            traditionalTitle: '状态分散在多个服务',
            traditional: '失败后难以确认任务停在哪一步。',
            acvmTitle: '统一状态机',
            acvm: '权限、阶段和回执都由 ACVM Core 处理。',
          }}
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="onchain" index={5} className="onchain-screen"
          eyebrow="EXECUTION MODEL · CONSENSUS BOUNDARY"
          title="链上执行边界"
          accent="只跑确定性逻辑"
          body="共识节点只执行权限、Gas、证明验证和状态更新；模型、API 与长任务在链下运行。"
          comparison={{
            traditionalTitle: '全节点重跑外部计算',
            traditional: '模型和 API 成本高，也无法保证环境一致。',
            acvmTitle: '执行一次，多节点验证',
            acvm: 'Worker 提交结果和证明，节点只做确定性验证。',
          }}
          terms={['BFT / HotStuff', 'Receipt Root']}
        ><OnchainExecutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-state" index={6} className="formal-screen state-spec-screen"
          eyebrow="FORMAL SPEC 02 / 04 · STATE MACHINE"
          title="状态模型"
          accent="确定性转换"
          body="当前状态、任务文件根和已验证回执共同计算下一状态。"
          comparison={{
            traditionalTitle: '交易记录不等于任务状态',
            traditional: '跨区块任务缺少连续阶段和责任方。',
            acvmTitle: '每一步都有状态根',
            acvm: '等待、执行、验收和完成均绑定文件版本。',
          }}
          terms={['Task File ABI', 'Receipt Root']}
          figureLabel="FORMAL MODEL / DRAFT 0.1 · ACVM STATE TRANSITION"
        ><StateModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-receipt" index={7} className="formal-screen receipt-spec-screen"
          eyebrow="FORMAL SPEC 03 / 04 · RECEIPT TRANSITION"
          title="回执验证"
          accent="验证后更新状态"
          body="回执绑定任务、目录、输入、输出和签名；全部通过后才更新状态。"
          comparison={{
            traditionalTitle: '返回值缺少上下文',
            traditional: '无法确认对应的输入、产物和验收版本。',
            acvmTitle: '回执绑定任务文件树',
            acvm: '文件被替换时，根变化并拒绝状态转换。',
          }}
          terms={['Task File ABI', 'Receipt Root']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ReceiptModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="dispute" index={8} className="dispute-screen"
          eyebrow="VALIDATION PROTOCOL · CHALLENGE & FINALITY"
          title="争议协议"
          accent="验收结果可以被挑战"
          body="结果先进入挑战期；反证、独立复核和保证金共同决定终局。"
          comparison={{
            traditionalTitle: '验收结果立即生效',
            traditional: '判断错误后只能依赖平台人工处理。',
            acvmTitle: '暂定接受，再进入终局',
            acvm: '反证绑定原任务，独立复核后执行罚没或结算。',
          }}
          terms={['Receipt Root', 'BFT / HotStuff', 'Mechanism Design']}
          figureLabel="ACVM DISPUTE PROTOCOL / PROVISIONAL → CHALLENGE → FINALITY"
        ><DisputeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="properties" index={9} className="properties-screen"
          eyebrow="SYSTEM MODEL · AVAILABILITY / STABILITY / EFFICIENCY"
          title="系统边界"
          accent="可用、稳定、效率"
          body="调整故障率、负载和成本，公式会重算结果与失效条件。"
          comparison={{
            traditionalTitle: '缺少统一计算口径',
            traditional: '只给性能结论，无法复核故障与成本假设。',
            acvmTitle: '参数、公式和边界同时给出',
            acvm: '可用性、队列稳定和计算成本按输入重算。',
          }}
          terms={['BFT / HotStuff', 'Proof-carrying Execution']}
          figureLabel="FIRST-PRINCIPLES MODEL / AVAILABILITY · STABILITY · EFFICIENCY"
        ><SystemPropertiesArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={10} className="identity-screen"
          eyebrow="SECURITY MODEL · IDENTITY & CAPABILITY"
          title="身份与权限"
          accent="责任与授权"
          body="调用方、Agent、Worker 和 Validator 分别绑定身份、角色、能力凭证与有效期。"
          comparison={{
            traditionalTitle: '地址不包含职责',
            traditional: '签名无法说明资质和本次授权范围。',
            acvmTitle: '身份、角色、能力分开验证',
            acvm: '回执绑定责任主体、凭证状态和实际权限。',
          }}
          terms={['DID / VC', 'UCAN / ZCAP']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={11} className="offchain-screen"
          eyebrow="EVIDENCE MODEL · OFF-CHAIN DATA"
          title="链下核验"
          accent="数据留在原系统"
          body="原始数据留在业务系统，链上只保存承诺、回执和证明。"
          comparison={{
            traditionalTitle: '上链泄露数据，预言机增加信任',
            traditional: '隐私、成本和单点风险无法同时解决。',
            acvmTitle: '数据留域，摘要上链',
            acvm: '状态根、回执和证明用于核验结果。',
          }}
          terms={['zkTLS / TLSNotary', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={12} className="privacy-screen"
          eyebrow="PRIVACY MODEL · ISOLATED EXECUTION"
          title="隐私执行"
          accent="明文不离开隔离域"
          body="a3s-box 管理隔离工作负载，a3s-power 在隔离环境中加载模型并完成推理。"
          comparison={{
            traditionalTitle: '复制执行扩大数据暴露面',
            traditional: '输入和中间结果会出现在多个节点。',
            acvmTitle: '隔离执行，公开验证',
            acvm: '链上核对承诺和远程证明，不读取明文。',
          }}
          terms={['TEE', 'Remote Attestation']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="fog" index={13} className="fog-screen"
          eyebrow="NETWORK MODEL · FOG INFERENCE"
          title="雾计算推理网络"
          accent="数据就近处理"
          body="任务分配到附近的 Worker，独立 Validator 验收，链上记录结果。"
          comparison={{
            traditionalTitle: '集中推理增加传输与单点风险',
            traditional: '数据远传，中心故障会影响全部任务。',
            acvmTitle: '就近推理，独立验收',
            acvm: '明文留在雾节点，证明和结果进入链上。',
          }}
          terms={['TEE', 'Remote Attestation', 'Receipt Root']}
          figureLabel="BLOCKCHAIN FOG INFERENCE / PRIVACY-PRESERVING NETWORK"
        ><FogInferenceArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={14} className="sentry-screen"
          eyebrow="SECURITY MODEL · RUNTIME POLICY"
          title="执行前风控"
          accent="进程、网络和工具"
          body="AnySentry 检查镜像、权限和网络策略，并记录运行期异常。"
          comparison={{
            traditionalTitle: '账本看不到运行期行为',
            traditional: '越权工具和异常网络请求留在链外。',
            acvmTitle: '运行策略生成安全回执',
            acvm: '放行、审批和阻断均可追溯。',
          }}
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={15} className="proof-screen"
          eyebrow="PROOF MODEL · LONG-RUNNING TASK"
          title="长任务证明"
          accent="按里程碑累计"
          body="每个里程碑引用前序承诺，任务结束时折叠为一份最终证明。"
          comparison={{
            traditionalTitle: '多次交易缺少连续性证明',
            traditional: '暂停、重试和审批各自留档。',
            acvmTitle: '承诺逐步继承',
            acvm: '最终验证一份聚合证明。',
          }}
          terms={['IVC', 'Folding']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={16} className="intelligence-screen"
          eyebrow="PROOF MODEL · PROOF OF INTELLIGENCE"
          title="有效计算"
          accent="有效工作证明"
          body="PoI 把需求签名、执行证明、验收结果和防重放字段绑定到同一任务。"
          comparison={{
            traditionalTitle: 'PoW / PoS 不验证业务结果',
            traditional: '共识完成不代表任务完成。',
            acvmTitle: 'PoI 只记录有效工作',
            acvm: '需求、执行和验收全部通过后才计入贡献。',
          }}
          terms={['Proof of Intelligence', 'zkML']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-poi" index={17} className="formal-screen poi-spec-screen"
          eyebrow="FORMAL SPEC 04 / 04 · INTELLIGENCE-PROOF CHAIN"
          title="PoI 共识"
          accent="贡献与提议权"
          body="有效 PoI 可用于信誉、任务调度和区块提议者选择。"
          comparison={{
            traditionalTitle: '资源投入不代表有效产出',
            traditional: '能耗和质押额不包含业务验收。',
            acvmTitle: '贡献来自已验收任务',
            acvm: '需求、结果、执行证明和防重放缺一不可。',
          }}
          terms={['Proof of Intelligence', 'VRF']}
          figureLabel="INTELLIGENCE-PROOF CHAIN / DRAFT 0.1"
        ><IntelligenceChainArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="ans" index={18} className="ans-screen"
          eyebrow="AGENT COORDINATION · ANS / A2A"
          title="ANS 智能体解析"
          accent="名称、能力与 A2A"
          body="ANS 把名称解析为 DID、A2A 端点、能力、报价、信誉和 Validator 集。"
          comparison={{
            traditionalTitle: '地址不包含服务可信度',
            traditional: '能力、价格和信誉依赖平台数据库。',
            acvmTitle: '解析结果可验证',
            acvm: 'A2A 协商任务，链上按验收结果结算。',
          }}
          terms={['A2A Protocol', 'Mechanism Design', 'Information Design']}
          figureLabel="ANS / ON-CHAIN AGENT DISCOVERY & SOCIAL COMPUTING"
        ><AgentResolutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="composition" index={19} className="composition-screen"
          eyebrow="AGENT COORDINATION · CONTRACT DAG"
          title="多 Agent 协作"
          accent="子任务、预算与回执"
          body="父合约通过 ANS 委托子合约；每个子合约独立执行和验收，最后聚合回执。"
          comparison={{
            traditionalTitle: 'Agent 调用链没有统一责任边界',
            traditional: '预算、权限和子任务结果散在多个服务中。',
            acvmTitle: '父任务聚合可验证子任务',
            acvm: '预算守恒、能力不扩张，必需回执齐全后才结算。',
          }}
          terms={['A2A Protocol', 'UCAN / ZCAP', 'Receipt Root']}
          figureLabel="AGENTIC CONTRACT COMPOSITION / TASK DAG & RECEIPT AGGREGATION"
        ><AgentTaskGraphArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="simulation" index={20} className="simulation-screen"
          eyebrow="DECENTRALIZED SOCIAL SIMULATION · PRIVACY SEALED"
          title="社会模拟即服务"
          accent="加密政策的群体预演"
          body="政策密文在隔离环境中解封；机构、企业和个人 Agent 私密评判，结果经安全聚合与独立复核。"
          comparison={{
            traditionalTitle: '中心化沙盘无法独立复现',
            traditional: '模型、数据、随机种子和个体意见都由单一平台掌握。',
            acvmTitle: '假设、轨迹和统计过程可核验',
            acvm: '政策与个体数据不公开，只输出通过复核的群体指标和置信区间。',
          }}
          terms={['TEE', 'MPC', 'VRF', 'Receipt Root']}
          figureLabel="DECENTRALIZED SOCIAL SIMULATION / ENCRYPTED POLICY & VERIFIED FORECAST"
        ><SocialSimulationArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={21} className="chains-screen"
          eyebrow="DEPLOYMENT MODEL · CHAIN ADAPTER"
          title="多链部署"
          accent="业务逻辑保持不变"
          body="适配器把身份、事件、状态、证明和最终性映射到目标链。"
          comparison={{
            traditionalTitle: '业务逻辑绑定底层链接口',
            traditional: '账户、事件和最终性变化会影响业务流程。',
            acvmTitle: '适配器隔离链差异',
            acvm: '调用、验收和回执语义保持不变。',
          }}
          terms={['Light Client', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={22} className="stories-screen"
          eyebrow="APPLICATION NETWORK · INTERACTIVE GRAPH"
          title="应用网络"
          accent="按结果验收与结算"
          body="拖动网络或点击节点，查看 GEO、量化交易、节能和采购等合约的执行与结算。"
          comparison={{
            traditionalTitle: '按调用或过程付费',
            traditional: '付款记录不能证明业务结果。',
            acvmTitle: '按已验收结果结算',
            acvm: 'Worker 执行，Validator 验收，链上记账。',
          }}
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
