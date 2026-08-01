import { useEffect, useState, type CSSProperties } from 'react';
import { AgentResolutionArchitecture } from './components/AgentResolutionArchitecture';
import { ContractCodeWalkthrough } from './components/ContractCodeWalkthrough';
import { FogInferenceArchitecture } from './components/FogInferenceArchitecture';
import { Icon, LogoMark } from './components/Icons';
import { ScenarioGraph } from './components/ScenarioGraph';
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
  ['lifecycle', '完整生命周期'],
  ['runtime', '执行流程'],
  ['onchain', '链上执行'],
  ['spec-contract', '合约模型'],
  ['code-walkthrough', '代码示例'],
  ['spec-state', '状态模型'],
  ['spec-receipt', '回执转换'],
  ['identity', '身份与权限'],
  ['ans', '智能体解析'],
  ['offchain', '链下核验'],
  ['privacy', '隐私环境'],
  ['fog', '雾推理网络'],
  ['sentry', '风险控制'],
  ['proof', '长任务证明'],
  ['intelligence', '有效计算'],
  ['spec-poi', '智能证明链'],
  ['chains', '链适配'],
  ['stories', '业务场景'],
] as const;

const navigation = [
  { id: 'lifecycle', label: '工作原理', screens: ['lifecycle', 'runtime', 'onchain'] },
  { id: 'spec-contract', label: '合约机制', screens: ['spec-contract', 'code-walkthrough', 'spec-state', 'spec-receipt'] },
  { id: 'identity', label: '身份与协作', screens: ['identity', 'ans', 'offchain', 'privacy', 'fog', 'sentry'] },
  { id: 'proof', label: '证明与共识', screens: ['proof', 'intelligence', 'spec-poi'] },
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
  identity: 'identity',
  ans: 'network',
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
              <p>ACVM 运行 Agentic Contract。链上处理状态与共识，a3s-box 分别启动 Worker 和 Validator，执行回执写回账本。</p>
              <ul className="hero-benefits" aria-label="ACVM 核心价值">
                <li><Icon name="bolt" />确定性逻辑在链上</li>
                <li><Icon name="fingerprint" />Worker 与 Validator 分开</li>
                <li><Icon name="shield" />执行轨迹可查询</li>
              </ul>
              <div className="hero-actions">
                <a href="#lifecycle" className="button button--primary">查看运行流程 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">查看部署场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> DETERMINISTIC CORE / ASYNC EXTENSION / PROOF-CARRYING STATE</span>
          <span className="screen-number" aria-hidden="true">00</span>
        </section>

        <TechnicalSlide
          id="lifecycle" index={1} className="lifecycle-screen"
          eyebrow="SYSTEM WALKTHROUGH · FULL LIFECYCLE"
          title="合约生命周期"
          accent="从部署到全网确认"
          body="右侧动画按顺序播放 10 个步骤。点击任一节点可查看本步操作和链上记录。"
          comparison={{
            traditionalTitle: '业务记录分散在多个系统',
            traditional: '部署、调用、Worker 日志和验收结果没有统一任务编号，排障时需要跨系统对账。',
            acvmTitle: '同一个 taskId 贯穿全程',
            acvm: '状态、执行人、回执和共识结果按顺序写入同一条任务轨迹。',
          }}
          terms={['Proof of Intelligence', 'BFT / HotStuff', 'Receipt Root']}
          figureLabel="ACVM FULL CONTRACT LIFECYCLE / AUTO LOOP"
        ><LifecycleArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="runtime" index={2} className="runtime-screen"
          eyebrow="01 / 10 · EXECUTION TOPOLOGY"
          title="ACVM 执行拓扑"
          accent="状态、权限和回执"
          body="合约声明调用方、Worker、Validator、权限和完成条件。ACVM 负责推进状态。"
          comparison={{
            traditionalTitle: '合约和链下服务各管一段',
            traditional: '预言机、脚本和业务接口各自保存状态，任务失败后很难确定停在哪一层。',
            acvmTitle: '所有步骤引用同一份状态',
            acvm: '权限检查、任务阶段和回执更新都经过 ACVM Core。',
          }}
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="onchain" index={3} className="onchain-screen"
          eyebrow="02 / 10 · CHAIN-NATIVE EXECUTION"
          title="链上执行边界"
          accent="只跑确定性逻辑"
          body="权限、Gas、回执验证和状态更新由每个节点执行。模型、API 和长任务放在链下。"
          comparison={{
            traditionalTitle: '重计算无法在所有节点同步复现',
            traditional: '模型推理和外部 API 有延迟、成本和环境差异，不适合直接放进共识执行。',
            acvmTitle: '节点验证证明，不重跑任务',
            acvm: '链下 Worker 提交结果和证明，链上只执行可重复的验证与状态更新。',
          }}
          terms={['BFT / HotStuff', 'Receipt Root']}
        ><OnchainExecutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-contract" index={4} className="formal-screen contract-spec-screen"
          eyebrow="FORMAL SPEC 01 / 04 · AGENTIC CONTRACT"
          title="合约结构"
          accent="一个目录，两份工作负载"
          body="开发者提交业务目录：Schema、Worker、Validator 和结算代码都在里面。a3s-box 的运行边界由系统固定。"
          comparison={{
            traditionalTitle: '代码和验收规则散落在不同服务',
            traditional: '部署脚本临时拼装文件，版本号相同也无法证明 Worker、Schema 和验收代码完全一致。',
            acvmTitle: '目录树就是版本边界',
            acvm: '整棵业务目录生成同一个 Contract Root，Worker 与 Validator 缺一不可，任一文件变化都会产生新版本。',
          }}
          terms={['Content-addressed Tree', 'Task File ABI']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ContractModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="code-walkthrough" index={5} className="code-screen"
          eyebrow="BUILD WALKTHROUGH · TYPESCRIPT SDK"
          title="用 a3s-code 构建"
          accent="目录就是合约"
          body="输入、证据、结果和裁决都走固定文件。点击文件或滚动步骤，查看 Worker 与 Validator 如何接力。"
          comparison={{
            traditionalTitle: '函数参数在服务之间层层转发',
            traditional: '输入、产物和验收结论散在接口、数据库和日志里，换一个服务就可能丢失上下文。',
            acvmTitle: '每个阶段只认固定文件',
            acvm: 'Worker 写结果，Validator 只读结果并写裁决；系统从任务文件生成回执根，运行配置不交给合约作者修改。',
          }}
          terms={['Task File ABI', 'Content-addressed Tree']}
          figureLabel="A3S-CODE TYPESCRIPT SDK / CONTRACT WALKTHROUGH"
        ><ContractCodeWalkthrough /></TechnicalSlide>

        <TechnicalSlide
          id="spec-state" index={6} className="formal-screen state-spec-screen"
          eyebrow="FORMAL SPEC 02 / 04 · STATE MACHINE"
          title="ACVM 状态模型"
          accent="文件根决定下一状态"
          body="任务输入根、当前状态和已验证回执共同计算下一状态。相同文件根必须得到相同结果。"
          comparison={{
            traditionalTitle: '链上只记录一次交易',
            traditional: '任务跨越多个区块后，账本无法直接说明执行进度和当前责任方。',
            acvmTitle: '每一步都有状态根和任务文件根',
            acvm: '等待、执行、验收、争议和完成都绑定具体文件版本，不靠进程内存猜当前进度。',
          }}
          terms={['Task File ABI', 'Receipt Root']}
          figureLabel="FORMAL MODEL / DRAFT 0.1 · ACVM STATE TRANSITION"
        ><StateModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-receipt" index={7} className="formal-screen receipt-spec-screen"
          eyebrow="FORMAL SPEC 03 / 04 · RECEIPT TRANSITION"
          title="回执验证"
          accent="先验文件根，再改状态"
          body="系统从 Worker 和 Validator 的任务文件生成回执。签名、目录根、任务编号和验收条件全部通过后才更新状态。"
          comparison={{
            traditionalTitle: '链上只收到一个返回值',
            traditional: '合约不知道这个值对应哪份输入、哪批产物和哪次验收，中间文件无法复核。',
            acvmTitle: '回执绑定整棵任务文件树',
            acvm: '链上检查签名、文件根、证明和前序状态；任一文件被替换，状态转换都会被拒绝。',
          }}
          terms={['Task File ABI', 'Receipt Root']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ReceiptModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={8} className="identity-screen"
          eyebrow="03 / 11 · IDENTITY & CAPABILITY"
          title="身份与权限"
          accent="操作对应责任主体"
          body="调用方、Agent、Worker 和 Validator 分别绑定身份、角色、能力凭证与有效期。"
          comparison={{
            traditionalTitle: '一个地址说明不了职责',
            traditional: '签名只能证明私钥持有者，不能说明岗位、资质和本次授权范围。',
            acvmTitle: '身份、角色和授权分别验证',
            acvm: '每条回执都绑定责任主体、凭证状态和实际使用的权限。',
          }}
          terms={['DID / VC', 'UCAN / ZCAP']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="ans" index={9} className="ans-screen"
          eyebrow="04 / 11 · AGENT NAME SERVICE"
          title="ANS 智能体解析服务"
          accent="让 Agent 找到并愿意服务 Agent"
          body="像 DNS 把域名解析成地址，ANS 把智能体名称解析成 DID、A2A 端点、能力、价格、信誉和 Validator。"
          comparison={{
            traditionalTitle: '地址簿只告诉你接口在哪里',
            traditional: '能力、价格、信誉和验收方散落在平台数据库里，Agent 无法独立判断该找谁合作。',
            acvmTitle: '一个名称返回可验证合作条件',
            acvm: '解析记录可核验、可过期、可更新；A2A 协商任务，链上按验收结果奖励服务与验证。',
          }}
          terms={['A2A Protocol', 'Mechanism Design', 'Information Design']}
          figureLabel="ANS / ON-CHAIN AGENT DISCOVERY & SOCIAL COMPUTING"
        ><AgentResolutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={10} className="offchain-screen"
          eyebrow="05 / 11 · ORACLE & OFF-CHAIN COMPUTE"
          title="链下核验"
          accent="数据留在原系统"
          body="业务系统保留原始数据。Worker 生成承诺和回执，链上验证后只保存摘要。"
          comparison={{
            traditionalTitle: '原始数据直接上链',
            traditional: '存储成本高，敏感字段会公开；改用单点预言机后又需要额外信任。',
            acvmTitle: '链上只接收可验证摘要',
            acvm: '原始数据留在业务域，状态根、回执和证明用于核对结果。',
          }}
          terms={['zkTLS / TLSNotary', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={11} className="privacy-screen"
          eyebrow="06 / 11 · PRIVATE EXECUTION"
          title="隐私执行"
          accent="隔离任务和模型"
          body="a3s-box 管理隔离工作负载，a3s-power 在隔离环境中加载模型并完成推理。"
          comparison={{
            traditionalTitle: '全节点复制不适合敏感数据',
            traditional: '输入、模型参数和中间结果会出现在多个节点或日志系统中。',
            acvmTitle: '明文只在隔离环境中处理',
            acvm: '链上核对结果承诺和远程证明，不读取模型与原始输入。',
          }}
          terms={['TEE', 'Remote Attestation']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="fog" index={12} className="fog-screen"
          eyebrow="07 / 11 · FOG PRIVACY INFERENCE"
          title="雾计算推理网络"
          accent="数据就近处理"
          body="区块链分配任务并记录回执。附近的 Worker 运行模型，独立 Validator 验收结果。"
          comparison={{
            traditionalTitle: '集中云推理要求上传数据',
            traditional: '原始输入离开本地，远距离传输增加延迟，中心服务故障会中断全部任务。',
            acvmTitle: 'Worker 就近推理，Validator 独立验收',
            acvm: '明文只到指定雾节点；链上记录承诺、证明、验收结果和结算。',
          }}
          terms={['TEE', 'Remote Attestation', 'Receipt Root']}
          figureLabel="BLOCKCHAIN FOG INFERENCE / PRIVACY-PRESERVING NETWORK"
        ><FogInferenceArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={13} className="sentry-screen"
          eyebrow="08 / 11 · ANYSENTRY"
          title="执行前风控"
          accent="进程、网络和工具"
          body="AnySentry 在 Worker 启动前检查镜像、权限和网络策略，运行中继续记录异常行为。"
          comparison={{
            traditionalTitle: '链上看不到工作负载行为',
            traditional: '合约无法直接发现恶意进程、越权工具和异常网络请求。',
            acvmTitle: '风险检查在 Worker 启动前完成',
            acvm: '放行、人工审批和阻断都生成安全回执。',
          }}
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={14} className="proof-screen"
          eyebrow="09 / 11 · LONG-RUNNING TASK PROOF"
          title="长任务证明"
          accent="按里程碑累计"
          body="每个里程碑引用上一步状态。任务结束时，多步记录折叠为一份最终证明。"
          comparison={{
            traditionalTitle: '多次交易之间没有证明连续性',
            traditional: '暂停、重试和人工审批分别留档，难以证明它们属于同一任务。',
            acvmTitle: '每一步继承上一个承诺',
            acvm: '状态承诺连续更新，最终只需验证聚合证明。',
          }}
          terms={['IVC', 'Folding']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={15} className="intelligence-screen"
          eyebrow="10 / 11 · PROOF OF INTELLIGENCE"
          title="有效计算"
          accent="验收后计入 PoI"
          body="PoI 把需求签名、执行证明、验收结果和防重放字段绑定到同一任务。"
          comparison={{
            traditionalTitle: 'PoW / PoS 不检查任务结果',
            traditional: '共识能选出区块提议者，但不知道某个业务任务是否按要求完成。',
            acvmTitle: 'PoI 检查任务是否完成',
            acvm: '需求真实、执行可证、结果通过验收后才记录贡献。',
          }}
          terms={['Proof of Intelligence', 'zkML']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-poi" index={16} className="formal-screen poi-spec-screen"
          eyebrow="FORMAL SPEC 04 / 04 · INTELLIGENCE-PROOF CHAIN"
          title="PoI 共识"
          accent="任务回执决定贡献"
          body="有效 PoI 进入贡献记录，并作为信誉、调度或区块提议者选择的输入。"
          comparison={{
            traditionalTitle: '投入资源不等于完成任务',
            traditional: '能耗或质押额不能说明业务结果是否满足验收条件。',
            acvmTitle: '贡献来自已验收任务',
            acvm: '需求、结果、执行证明和防重放检查缺一不可。',
          }}
          terms={['Proof of Intelligence', 'VRF']}
          figureLabel="INTELLIGENCE-PROOF CHAIN / DRAFT 0.1"
        ><IntelligenceChainArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={17} className="chains-screen"
          eyebrow="11 / 11 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="多链部署"
          accent="业务逻辑保持不变"
          body="适配器把 ACVM 的身份、事件、状态、证明和最终性映射到目标链。"
          comparison={{
            traditionalTitle: '更换底层链需要重新接接口',
            traditional: '账户、ABI、事件和最终性规则不同，业务流程容易跟着改动。',
            acvmTitle: '只替换链适配器',
            acvm: 'Agentic Contract 的调用、验收和回执流程保持不变。',
          }}
          terms={['Light Client', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={18} className="stories-screen"
          eyebrow="APPLICATION NETWORK · INTERACTIVE GRAPH"
          title="应用网络"
          accent="按结果验收与结算"
          body="拖动网络或点击节点，查看 GEO、量化交易、节能、采购等 Agentic Contract 怎么执行、验收和记账。"
          comparison={{
            traditionalTitle: '只能按调用次数或过程付费',
            traditional: '链上看得到转账，却很难判断 Agent 是否真正带来了业务结果。',
            acvmTitle: '结果通过独立验收后再结算',
            acvm: 'Worker 干活，Validator 按冻结口径核验，链上只为可追溯的有效结果记账。',
          }}
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
