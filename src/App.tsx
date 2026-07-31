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
  ['runtime', '执行流程'],
  ['identity', '身份与权限'],
  ['offchain', '链下核验'],
  ['privacy', '隐私环境'],
  ['sentry', '风险控制'],
  ['proof', '长任务证明'],
  ['intelligence', '有效计算'],
  ['chains', '链适配'],
  ['stories', '业务场景'],
] as const;

const navigation = [
  { id: 'runtime', label: '执行流程', screens: ['runtime', 'offchain'] },
  { id: 'identity', label: '身份与权限', screens: ['identity'] },
  { id: 'privacy', label: '隐私与安全', screens: ['privacy', 'sentry'] },
  { id: 'proof', label: '回执与证明', screens: ['proof', 'intelligence'] },
  { id: 'chains', label: '多链与场景', screens: ['chains', 'stories'] },
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
    <div className="hero-console" aria-label="ACVM 从业务结果到链上确认的处理流程">
      <header className="panel-chrome">
        <span><i /><i /><i /></span>
        <code>ACVM / ON-CHAIN RECEIPT #00521</code>
        <strong><i /> VERIFYING</strong>
      </header>
      <div className="hero-console-flow">
        <section>
          <span>01</span>
          <Icon name="receipt" />
          <strong>业务结果</strong>
          <small>订单 · 设备 · API</small>
        </section>
        <i className="hero-connector"><b /></i>
        <section className="is-acvm">
          <LogoMark />
          <strong>ACVM</strong>
          <small>规则执行与回执</small>
          <div><span>IDENTITY</span><span>POLICY</span><span>STATE</span><span>PROOF</span></div>
        </section>
        <i className="hero-connector"><b /></i>
        <section>
          <span>03</span>
          <Icon name="chain" />
          <strong>提交链上</strong>
          <small>状态根 · 回执 · 证明</small>
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
          <BlockchainBackdrop />
          <div className="screen-inner hero-layout">
            <div className="hero-copy">
              <span className="hero-eyebrow"><i /> 链下执行 · 链上验证 · 多方确认</span>
              <h1>任务在链下完成，<br /><em>结果在链上说得清。</em></h1>
              <p>ACVM 把身份、权限、工具调用和验收记录串成一条可核验的执行链。原始数据留在企业内部，链上只接收状态根、回执和证明。</p>
              <div className="hero-actions">
                <a href="#runtime" className="button button--primary">看执行流程 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">浏览业务场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> BLOCK HEIGHT / STATE ROOT / RECEIPT / PROOF / FINALITY</span>
        </section>

        <TechnicalSlide
          id="runtime" index={1} className="runtime-screen"
          eyebrow="01 / 09 · EXECUTION KERNEL"
          title="先把规则说清楚，"
          accent="再让任务开跑。"
          body="谁来做、能用什么、做到什么算完成，都写进同一份合约。ACVM 按状态推进任务，并为每一步留下回执。"
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={2} className="identity-screen"
          eyebrow="02 / 09 · IDENTITY & CAPABILITY"
          title="每个操作，"
          accent="都能找到责任人。"
          body="企业、Agent、合约和临时工具权限逐层绑定。外部只核验资格是否有效，不必看到企业内部台账。"
          terms={['DID / VC', 'UCAN / ZCAP', 'Selective Disclosure']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={3} className="offchain-screen"
          eyebrow="03 / 09 · ORACLE & OFF-CHAIN COMPUTE"
          title="数据留在业务系统，"
          accent="验证结果交给链上。"
          body="ACVM 通过企业 API、设备和预言机核对事实。原始数据不出域，只把状态根、回执和证明提交到链上。"
          terms={['zkTLS / TLSNotary', 'TEE', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={4} className="privacy-screen"
          eyebrow="04 / 09 · PRIVATE EXECUTION"
          title="a3s-box 管隔离，"
          accent="a3s-power 管私密推理。"
          body="运行环境和模型推理分开负责：前者隔离工作负载，后者绑定模型、输入和硬件度量，边界更清楚。"
          terms={['TEE', 'Remote Attestation', 'FHE', 'MPC']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={5} className="sentry-screen"
          eyebrow="05 / 09 · ANYSENTRY"
          title="先看清风险，"
          accent="再决定放行还是阻断。"
          body="AnySentry 记录进程、工具、网络、文件和模型事件，按风险等级给出处理意见；真正的放行与阻断由执行边界完成。"
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={6} className="proof-screen"
          eyebrow="06 / 09 · LONG-RUNNING TASK PROOF"
          title="任务可以跑几个月，"
          accent="证明不用跟着变大。"
          body="每个里程碑都接着上一步的状态根继续记录。暂停、重试和人工审批不会断档，最后再压缩成一份固定大小的完成证明。"
          terms={['IVC', 'Folding', 'Recursive ZK']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={7} className="intelligence-screen"
          eyebrow="07 / 09 · PROOF OF INTELLIGENCE"
          title="有用的计算，"
          accent="才值得写进账本。"
          body="只有真实任务、验收通过的结果和完整执行回执，才会生成 PoI。空跑算力、重复提交和自造任务不计入贡献。"
          terms={['Proof of Intelligence', 'zkML', 'Remote Attestation', 'VRF']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={8} className="chains-screen"
          eyebrow="08 / 09 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="保留原来的链，"
          accent="换上更适合长任务的执行层。"
          body="ACVM 通过适配器接入现有联盟链，也可以作为原生执行器或独立应用链。共识、成员治理和账本仍由原链负责。"
          terms={['Light Client', 'BFT / HotStuff', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={9} className="stories-screen"
          eyebrow="09 / 09 · VERIFIED OUTCOME SCENARIOS"
          title="选一个场景，"
          accent="看结果怎么被确认。"
          body="拖动图谱查看行业和业务节点，点开场景即可看到谁发起、谁交付、哪些数据参与核验，以及结果如何上链。"
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
