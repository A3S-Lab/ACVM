import { useEffect, useState } from 'react';
import { Icon, LogoMark } from './components/Icons';
import { ScenarioGraph } from './components/ScenarioGraph';
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
  ['runtime', '执行流程'],
  ['onchain', '链上执行'],
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
  { id: 'runtime', label: '执行架构', screens: ['runtime', 'onchain', 'offchain'] },
  { id: 'identity', label: '身份与权限', screens: ['identity'] },
  { id: 'privacy', label: '隐私与安全', screens: ['privacy', 'sentry'] },
  { id: 'proof', label: '回执与证明', screens: ['proof', 'intelligence'] },
  { id: 'chains', label: '多链与场景', screens: ['chains', 'stories'] },
] as const;

type MechanismComparison = {
  traditional: string;
  acvm: string;
};

function MechanismCompare({ traditional, acvm }: MechanismComparison) {
  return (
    <div className="mechanism-compare" aria-label="传统区块链机制与 ACVM 对比">
      <section>
        <small>TRADITIONAL CHAIN / LIMIT</small>
        <p>{traditional}</p>
      </section>
      <i aria-hidden="true" />
      <section>
        <small>ACVM / RESPONSE</small>
        <p>{acvm}</p>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  accent,
  body,
  comparison,
  terms = [],
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  comparison?: MechanismComparison;
  terms?: TechKey[];
}) {
  return (
    <header className="section-heading">
      <span className="section-eyebrow"><i /> {eyebrow}</span>
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
  children: React.ReactNode;
}) {
  return (
    <section className={`screen technical-screen ${className}`} id={id} data-screen={index}>
      <div className="screen-inner technical-layout">
        <SectionHeading eyebrow={eyebrow} title={title} accent={accent} body={body} comparison={comparison} terms={terms} />
        <div className="technical-visual">
          {children}
          <div className="figure-caption" aria-hidden="true">
            <span>FIG. {String(index).padStart(2, '0')}</span><i /><span>ACVM TECHNICAL ARCHITECTURE / REV. 01</span>
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
              <span className="hero-eyebrow"><i /> 00 / DEFINITION · AGENTIC CONTRACT VM</span>
              <h1>ACVM 是一套<br /><em>可验证执行环境。</em></h1>
              <p>确定性的 ACVM Core 可以由链上节点共同执行；企业 API、TEE、模型和长期任务则通过异步回执接入。两边沿同一套身份、权限、状态与证明规则推进。</p>
              <div className="hero-actions">
                <a href="#runtime" className="button button--primary">看执行流程 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">浏览业务场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> DETERMINISTIC CORE / ASYNC EXTENSION / PROOF-CARRYING STATE</span>
          <span className="screen-number" aria-hidden="true">00</span>
        </section>

        <TechnicalSlide
          id="runtime" index={1} className="runtime-screen"
          eyebrow="01 / 09 · EXECUTION TOPOLOGY"
          title="规则写清楚，"
          accent="任务再开跑。"
          body="谁来做、能用什么、做到什么算完成，都写进同一份合约。ACVM 按状态推进任务，并为每一步留下回执。"
          comparison={{
            traditional: '跨系统任务靠合约、预言机和脚本互相直连，接口一多就很难排错。',
            acvm: '所有职责接入同一个执行内核，状态、权限和回执按同一套规则流转。',
          }}
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="onchain" index={2} className="onchain-screen"
          eyebrow="02 / 09 · CHAIN-NATIVE EXECUTION"
          title="像 EVM 一样，"
          accent="节点一起执行。"
          body="确定性的 ACVM Core 可以集成进区块链节点。API、TEE 和模型计算完成后，再凭回执和证明恢复链上状态机。"
          comparison={{
            traditional: '所有节点同步重复计算；外部 API、模型和长任务无法直接塞进一笔交易。',
            acvm: '链上只跑确定性核心，重计算异步完成并带着证明回链。',
          }}
          terms={['BFT / HotStuff', 'Receipt Root', 'Remote Attestation']}
        ><OnchainExecutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={3} className="identity-screen"
          eyebrow="03 / 09 · IDENTITY & CAPABILITY"
          title="每个操作，"
          accent="都能追到责任人。"
          body="企业、Agent、合约和临时工具权限逐层绑定。外部只核验资格是否有效，不必看到企业内部台账。"
          comparison={{
            traditional: '钱包地址只能说明谁控制私钥，不能说明岗位、资质和本次授权范围。',
            acvm: '把企业身份、Agent、合约和短期权限绑在一起，出了问题能追到责任主体。',
          }}
          terms={['DID / VC', 'UCAN / ZCAP', 'Selective Disclosure']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={4} className="offchain-screen"
          eyebrow="04 / 09 · ORACLE & OFF-CHAIN COMPUTE"
          title="数据留在本地，"
          accent="结果交给链上。"
          body="ACVM 通过企业 API、设备和预言机核对事实。原始数据不出域，只把状态根、回执和证明提交到链上。"
          comparison={{
            traditional: '单一预言机容易变成信任点；原始数据直接上链又贵，还可能泄露隐私。',
            acvm: '在数据源附近核对事实，链上只接收承诺、回执和证明。',
          }}
          terms={['zkTLS / TLSNotary', 'TEE', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={5} className="privacy-screen"
          eyebrow="05 / 09 · PRIVATE EXECUTION"
          title="a3s-box 管隔离，"
          accent="a3s-power 管推理。"
          body="运行环境和模型推理分开负责：前者隔离工作负载，后者绑定模型、输入和硬件度量，边界更清楚。"
          comparison={{
            traditional: '链上数据会被节点复制，通用合约也无法保护企业数据和模型参数。',
            acvm: '敏感计算留在隔离环境，只公开结果承诺和硬件证明。',
          }}
          terms={['TEE', 'Remote Attestation', 'FHE', 'MPC']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={6} className="sentry-screen"
          eyebrow="06 / 09 · ANYSENTRY"
          title="先看清风险，"
          accent="再决定放不放行。"
          body="AnySentry 记录进程、工具、网络、文件和模型事件，按风险等级给出处理意见；真正的放行与阻断由执行边界完成。"
          comparison={{
            traditional: '合约只能看到交易输入，看不到链下进程、网络和工具调用发生了什么。',
            acvm: '执行前收集风险信号，放行、审批或阻断都会写进回执。',
          }}
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={7} className="proof-screen"
          eyebrow="07 / 09 · LONG-RUNNING TASK PROOF"
          title="任务跑几个月，"
          accent="证明也不会变大。"
          body="每个里程碑都接着上一步的状态根继续记录。暂停、重试和人工审批不会断档，最后再压缩成一份固定大小的完成证明。"
          comparison={{
            traditional: '交易适合短执行；长任务拆成许多笔后，暂停、重试和审批很难保持连续。',
            acvm: '每个里程碑继承上一状态，最后把整段过程折叠成一份证明。',
          }}
          terms={['IVC', 'Folding', 'Recursive ZK']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={8} className="intelligence-screen"
          eyebrow="08 / 09 · PROOF OF INTELLIGENCE"
          title="有用的计算，"
          accent="才写进账本。"
          body="只有真实任务、验收通过的结果和完整执行回执，才会生成 PoI。空跑算力、重复提交和自造任务不计入贡献。"
          comparison={{
            traditional: 'PoW 或 PoS 能保护共识，但不能说明某次计算是否解决了真实问题。',
            acvm: '把签名需求、验收结果和执行回执放在一起核对，再记录贡献。',
          }}
          terms={['Proof of Intelligence', 'zkML', 'Remote Attestation', 'VRF']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={9} className="chains-screen"
          eyebrow="09 / 09 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="保留原来的链，"
          accent="只替换执行层。"
          body="ACVM 通过适配器接入现有联盟链，也可以作为原生执行器或独立应用链。共识、成员治理和账本仍由原链负责。"
          comparison={{
            traditional: '每条链的虚拟机和接口不同，业务迁移时常常要重写合约和集成层。',
            acvm: '执行语义保持不变，只替换链适配器和最终确认方式。',
          }}
          terms={['Light Client', 'BFT / HotStuff', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={10} className="stories-screen"
          eyebrow="10 / DEPLOYED NETWORK · INTERACTIVE GRAPH"
          title="一张运行中的"
          accent="ACVM 合约网络。"
          body="机构、企业和个人都能部署 Agentic Contract。拖动网络查看节点，点击合约可看到部署者、参与方、核验数据和最后写入链上的回执。"
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
