import { useEffect, useState } from 'react';
import { Icon, LogoMark } from './components/Icons';
import { ScenarioGraph } from './components/ScenarioGraph';
import {
  ChainArchitectureSimple,
  IdentityArchitectureSimple,
  IntelligenceProofArchitecture,
  LongTaskArchitectureSimple,
  OffchainArchitectureSimple,
  PrivacyArchitecture,
  RuntimeArchitecture,
  SentryArchitectureSimple,
} from './components/SimplifiedArchitecture';
import { TechTerm, type TechKey } from './components/TechTerm';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

const screens = [
  ['top', 'ACVM'],
  ['runtime', '执行内核'],
  ['identity', '身份能力'],
  ['offchain', '链下计算'],
  ['privacy', '隐私执行'],
  ['sentry', '安全控制'],
  ['proof', '长期证明'],
  ['intelligence', '智能证明'],
  ['chains', '多链部署'],
  ['stories', '验证场景'],
] as const;

const navigation = [
  { id: 'runtime', label: '执行架构', screens: ['runtime', 'offchain'] },
  { id: 'identity', label: '身份能力', screens: ['identity'] },
  { id: 'privacy', label: '隐私与安全', screens: ['privacy', 'sentry'] },
  { id: 'proof', label: '证明机制', screens: ['proof', 'intelligence'] },
  { id: 'chains', label: '部署与场景', screens: ['chains', 'stories'] },
] as const;

function SectionHeading({
  eyebrow,
  title,
  accent,
  body,
  terms = [],
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  terms?: TechKey[];
}) {
  return (
    <header className="section-heading">
      <span className="section-eyebrow"><i /> {eyebrow}</span>
      <h2>{title}<br /><em>{accent}</em></h2>
      <p>{body}</p>
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
  terms,
  children,
}: {
  id: string;
  index: number;
  className: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  terms?: TechKey[];
  children: React.ReactNode;
}) {
  return (
    <section className={`screen technical-screen ${className}`} id={id} data-screen={index}>
      <div className="screen-inner technical-layout">
        <SectionHeading eyebrow={eyebrow} title={title} accent={accent} body={body} terms={terms} />
        <div className="technical-visual">{children}</div>
      </div>
      <span className="screen-number" aria-hidden="true">{String(index).padStart(2, '0')}</span>
    </section>
  );
}

function HeroConsole() {
  return (
    <div className="hero-console" aria-label="ACVM 可信验证 Agent 执行流程">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ACVM / VERIFY RUN #00521</code>
        <strong><i /> ACTIVE</strong>
      </header>
      <div className="hero-console-flow">
        <section>
          <span>01</span>
          <Icon name="receipt" />
          <strong>验收契约</strong>
          <small>身份 · 规则 · 责任方</small>
        </section>
        <i className="hero-connector"><b /></i>
        <section className="is-acvm">
          <LogoMark />
          <strong>ACVM</strong>
          <small>可信验证 Agent Runtime</small>
          <div><span>IDENTITY</span><span>ORACLE</span><span>POLICY</span><span>PROOF</span></div>
        </section>
        <i className="hero-connector"><b /></i>
        <section>
          <span>03</span>
          <Icon name="chain" />
          <strong>可信终局</strong>
          <small>证明 · 共识 · 审计</small>
        </section>
      </div>
      <footer>
        <code>Verify(receiptRoot, proof, identityCommitment)</code>
        <strong><Icon name="check" /> RESULT ACCEPTED</strong>
      </footer>
    </div>
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
      </header>

      <main className="page-scroller">
        <section className="screen hero-screen" id="top" data-screen="0">
          <div className="ambient-network" aria-hidden="true"><i /><i /><i /><i /></div>
          <div className="screen-inner hero-layout">
            <div className="hero-copy">
              <span className="hero-eyebrow"><i /> OPEN · CHAIN-AGNOSTIC · VERIFIABLE</span>
              <h1>让智能服务，<br /><em>成为可信的合约事实。</em></h1>
              <p>ACVM 是运行“结果即服务”可信验证 Agent 的 Agentic Contract VM。它把身份、企业取证、隐私计算、安全控制与证明终局放进同一套执行语义。</p>
              <div className="hero-actions">
                <a href="#runtime" className="button button--primary">理解 ACVM <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">查看验证场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> AGENTIC CONTRACT / IDENTITY / EVIDENCE / POLICY / PROOF / FINALITY</span>
        </section>

        <TechnicalSlide
          id="runtime" index={1} className="runtime-screen"
          eyebrow="01 / 09 · EXECUTION KERNEL"
          title="Agentic Contract，"
          accent="沿同一状态机执行到底。"
          body="ACVM 固定身份、目标、权限与验收条件，再依次调度工具、落实策略并生成链上可验证回执。"
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={2} className="identity-screen"
          eyebrow="02 / 09 · IDENTITY & CAPABILITY"
          title="Agent 身份唯一，"
          accent="每次能力调用都可证明。"
          body="责任主体、Agent、合约实例与临时工具会话连续绑定；验证方只看到资格结论，看不到企业内部凭据。"
          terms={['DID / VC', 'UCAN / ZCAP', 'Selective Disclosure']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={3} className="offchain-screen"
          eyebrow="03 / 09 · ORACLE & OFF-CHAIN COMPUTE"
          title="链外事实，"
          accent="在链上形成可信终局。"
          body="验证 Agent 经零信任网关渐进发现企业 API，从设备和独立预言机取证；原始数据留在本地，只提交承诺与证明。"
          terms={['zkTLS / TLSNotary', 'TEE', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={4} className="privacy-screen"
          eyebrow="04 / 09 · PRIVATE EXECUTION"
          title="a3s-box 隔离执行，"
          accent="a3s-power 证明隐私推理。"
          body="两者职责不同：前者管理 MicroVM 与生命周期，后者管理模型加载、推理和模型—硬件度量绑定。"
          terms={['TEE', 'Remote Attestation', 'FHE', 'MPC']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={5} className="sentry-screen"
          eyebrow="05 / 09 · ANYSENTRY"
          title="安全信号先形成证据，"
          accent="风险决定再进入执行边界。"
          body="AnySentry 观测进程、工具、网络、文件和模型事件，分级判断风险；ACVM、零信任网关与内核 Guard 负责真正阻断。"
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={6} className="proof-screen"
          eyebrow="06 / 09 · LONG-RUNNING TASK PROOF"
          title="任务运行数月，"
          accent="链上仍只验证一个完成证明。"
          body="每个里程碑都继承状态根与上一步证明，暂停、重试和人工审批同样可追溯；递归证明把完整过程压缩为固定大小。"
          terms={['IVC', 'Folding', 'Recursive ZK']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={7} className="intelligence-screen"
          eyebrow="07 / 09 · PROOF OF INTELLIGENCE"
          title="智能服务完成，"
          accent="就是新的工作量证明。"
          body="智能证明只承认真实用户需求、通过质量验收的结果和可验证执行证据，把无意义 Hash 竞赛替换为对用户有价值的智能服务。"
          terms={['Proof of Intelligence', 'zkML', 'Remote Attestation', 'VRF']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={8} className="chains-screen"
          eyebrow="08 / 09 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="ACVM 不替换区块链，"
          accent="只替换复杂任务执行层。"
          body="同一套 Agentic Contract 语义可作为链外协处理器、联盟链原生执行器或专用应用链，接入国内与企业链治理边界。"
          terms={['Light Client', 'BFT / HotStuff', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={9} className="stories-screen"
          eyebrow="09 / 09 · VERIFIED OUTCOME SCENARIOS"
          title="选择场景，"
          accent="看清每一方如何协同。"
          body="拖拽图谱查看行业关系，点击场景即可看到委托、服务、事实取证、ACVM 验证和联盟链终局的完整流程。"
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
