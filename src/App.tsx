import { useEffect, useState } from 'react';
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
  ['spec-state', '状态模型'],
  ['spec-contract', '合约模型'],
  ['spec-receipt', '回执转换'],
  ['spec-poi', '智能证明链'],
  ['lifecycle', '完整生命周期'],
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
  { id: 'spec-state', label: '技术说明', screens: ['spec-state', 'spec-contract', 'spec-receipt', 'spec-poi'] },
  { id: 'lifecycle', label: '生命周期', screens: ['lifecycle'] },
  { id: 'runtime', label: '执行与身份', screens: ['runtime', 'onchain', 'identity', 'offchain'] },
  { id: 'privacy', label: '隐私与安全', screens: ['privacy', 'sentry'] },
  { id: 'proof', label: '证明与多链', screens: ['proof', 'intelligence', 'chains'] },
  { id: 'stories', label: '应用网络', screens: ['stories'] },
] as const;

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
        <header><b aria-hidden="true">×</b><small>传统区块链 · 痛点</small></header>
        <h3>{traditionalTitle}</h3>
        <p>{traditional}</p>
      </section>
      <i aria-hidden="true" />
      <section className="is-acvm">
        <header><b aria-hidden="true">✓</b><small>ACVM · 得到什么</small></header>
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
              <h1>ACVM<br /><em className="hero-full-name">Agentic Contract VM.</em></h1>
              <p>专门运行 Agentic Contract 的虚拟机：链上处理必须一致的判断，a3s-box 运行 Worker 与 Validator，每一步都留下可追溯回执。</p>
              <ul className="hero-benefits" aria-label="ACVM 核心价值">
                <li><Icon name="bolt" />复杂任务不堵链</li>
                <li><Icon name="fingerprint" />每一步可追责</li>
                <li><Icon name="shield" />结果自带证明</li>
              </ul>
              <div className="hero-actions">
                <a href="#lifecycle" className="button button--primary">看完整流程 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">浏览业务场景</a>
              </div>
            </div>
            <HeroConsole />
          </div>
          <span className="hero-footnote"><i /> DETERMINISTIC CORE / ASYNC EXTENSION / PROOF-CARRYING STATE</span>
          <span className="screen-number" aria-hidden="true">00</span>
        </section>

        <TechnicalSlide
          id="spec-state" index={1} className="formal-screen state-spec-screen"
          eyebrow="FORMAL SPEC 01 / 04 · STATE MACHINE"
          title="先定义状态，"
          accent="再定义执行。"
          body="沿用黄皮书的状态机写法，ACVM 把一次任务定义成可验证的状态转换。"
          comparison={{
            traditionalTitle: '只认识短交易',
            traditional: '任务跨几天后，链上状态说不清谁做到哪一步。',
            acvmTitle: '工作轨迹就是链上状态',
            acvm: '每一步写入状态或回执根，能连续核验与追责。',
          }}
          terms={['Receipt Root', 'Proof-carrying Execution']}
          figureLabel="FORMAL MODEL / DRAFT 0.1 · REF. ETHEREUM YELLOW PAPER"
        ><StateModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-contract" index={2} className="formal-screen contract-spec-screen"
          eyebrow="FORMAL SPEC 02 / 04 · AGENTIC CONTRACT"
          title="一份合约，"
          accent="两类工作负载。"
          body="部署必须同时提供 Worker 和 Validator；二者都是可由 a3s-box 运行的工作负载。"
          comparison={{
            traditionalTitle: '代码能执行，结果难验收',
            traditional: '合约只知道调用返回，链下谁执行、谁验收常靠另一个系统补齐。',
            acvmTitle: '执行与验收成对部署',
            acvm: 'Worker 负责工作，Validator 独立验收；两边都留下链上回执。',
          }}
          terms={['Intent-centric', 'UCAN / ZCAP']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ContractModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-receipt" index={3} className="formal-screen receipt-spec-screen"
          eyebrow="FORMAL SPEC 03 / 04 · RECEIPT TRANSITION"
          title="外部执行，"
          accent="凭回执改变状态。"
          body="任务先进入等待状态；只有回执通过验证，链上状态才继续推进。"
          comparison={{
            traditionalTitle: '外部数据只能信预言机',
            traditional: '预言机说“是真的”，链上通常看不到执行过程。',
            acvmTitle: '回执必须自带证据',
            acvm: '验证通过才改状态，失败则保持原状态。',
          }}
          terms={['Receipt Root', 'Remote Attestation']}
          figureLabel="ACVM FORMAL MODEL / DRAFT 0.1"
        ><ReceiptModelArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="spec-poi" index={4} className="formal-screen poi-spec-screen"
          eyebrow="FORMAL SPEC 04 / 04 · INTELLIGENCE-PROOF CHAIN"
          title="智能证明，"
          accent="只计算有效工作。"
          body="真实需求、验收结果和执行证据组成 PoI，再参与出块与奖励。"
          comparison={{
            traditionalTitle: '奖励资源，不奖励结果',
            traditional: 'PoW 奖励能耗，PoS 偏向资本，都不判断工作是否有用。',
            acvmTitle: '只奖励被验收的工作',
            acvm: '有需求、结果和执行证明，才生成 PoI。',
          }}
          terms={['Proof of Intelligence', 'VRF']}
          figureLabel="INTELLIGENCE-PROOF CHAIN / DRAFT 0.1"
        ><IntelligenceChainArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="lifecycle" index={5} className="lifecycle-screen"
          eyebrow="SYSTEM WALKTHROUGH · FULL LIFECYCLE"
          title="从部署到记账，"
          accent="每一步都看得见。"
          body="动画从双工作负载部署开始；每一步都生成链上状态或回执，可记录、可追溯。"
          comparison={{
            traditionalTitle: '交易结束，业务过程就断了',
            traditional: '部署、调用、链下执行和验收散在不同系统，出问题只能逐个查。',
            acvmTitle: '一条生命周期串到底',
            acvm: '从部署到全网确认，每一步的状态、责任人和回执都能在链上追溯。',
          }}
          terms={['Proof of Intelligence', 'BFT / HotStuff', 'Receipt Root']}
          figureLabel="ACVM FULL CONTRACT LIFECYCLE / AUTO LOOP"
        ><LifecycleArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="runtime" index={6} className="runtime-screen"
          eyebrow="01 / 09 · EXECUTION TOPOLOGY"
          title="规则写清楚，"
          accent="任务再开跑。"
          body="把执行者、权限和完成条件写进合约，ACVM 按状态推进任务。"
          comparison={{
            traditionalTitle: '接口越多，连接越乱',
            traditional: '合约、预言机和脚本两两对接，故障很难定位。',
            acvmTitle: '一个内核统一调度',
            acvm: '状态、权限和回执在同一处流转。',
          }}
          terms={['Intent-centric', 'Proof-carrying Execution']}
        ><RuntimeArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="onchain" index={7} className="onchain-screen"
          eyebrow="02 / 09 · CHAIN-NATIVE EXECUTION"
          title="像 EVM 一样，"
          accent="节点一起执行。"
          body="确定性逻辑由节点共同执行，外部计算带着证明回链。"
          comparison={{
            traditionalTitle: '所有节点重复做重计算',
            traditional: 'API、模型和长任务塞不进同步交易，成本也高。',
            acvmTitle: '确定性上链，重任务异步',
            acvm: '链上保留一致性，外部计算带证明回链。',
          }}
          terms={['BFT / HotStuff', 'Receipt Root']}
        ><OnchainExecutionArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="identity" index={8} className="identity-screen"
          eyebrow="03 / 09 · IDENTITY & CAPABILITY"
          title="每个操作，"
          accent="都能追到责任人。"
          body="企业、Agent、合约和临时权限逐层绑定，每次操作都能追责。"
          comparison={{
            traditionalTitle: '地址不等于责任主体',
            traditional: '私钥能签名，却看不出岗位、资质和授权边界。',
            acvmTitle: '每次操作都能追责',
            acvm: '企业、Agent、合约和临时权限逐层绑定。',
          }}
          terms={['DID / VC', 'UCAN / ZCAP']}
        ><IdentityArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="offchain" index={9} className="offchain-screen"
          eyebrow="04 / 09 · ORACLE & OFF-CHAIN COMPUTE"
          title="数据留在本地，"
          accent="结果交给链上。"
          body="原始数据留在业务系统，链上只收状态根、回执和证明。"
          comparison={{
            traditionalTitle: '上链泄密，预言机又要信任',
            traditional: '原始数据公开且昂贵，单点预言机还可以撒谎。',
            acvmTitle: '数据不出域，结果可验证',
            acvm: '就地核验，只提交状态根、回执和证明。',
          }}
          terms={['zkTLS / TLSNotary', 'Receipt Root']}
        ><OffchainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="privacy" index={10} className="privacy-screen"
          eyebrow="05 / 09 · PRIVATE EXECUTION"
          title="a3s-box 管隔离，"
          accent="a3s-power 管推理。"
          body="a3s-box 隔离任务，a3s-power 保护模型与输入。"
          comparison={{
            traditionalTitle: '所有节点都会复制数据',
            traditional: '商业数据和模型参数无法保密。',
            acvmTitle: '敏感计算留在隔离环境',
            acvm: '链上只看结果承诺和硬件证明。',
          }}
          terms={['TEE', 'Remote Attestation']}
        ><PrivacyArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="sentry" index={11} className="sentry-screen"
          eyebrow="06 / 09 · ANYSENTRY"
          title="先看清风险，"
          accent="再决定放不放行。"
          body="AnySentry 在执行前检查进程、网络和工具调用。"
          comparison={{
            traditionalTitle: '合约看不到链下行为',
            traditional: '恶意进程、越权工具和异常网络调用无法拦截。',
            acvmTitle: '执行前先做风险判断',
            acvm: '放行、审批和阻断都有记录。',
          }}
        ><SentryArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="proof" index={12} className="proof-screen"
          eyebrow="07 / 09 · LONG-RUNNING TASK PROOF"
          title="任务跑几个月，"
          accent="证明也不会变大。"
          body="里程碑连续记录状态，最后折叠成一份固定大小的证明。"
          comparison={{
            traditionalTitle: '长任务拆开后证据断裂',
            traditional: '暂停、重试和人工审批很难证明是同一任务。',
            acvmTitle: '里程碑连续，证明固定大小',
            acvm: '每一步继承状态，最终折叠为一份证明。',
          }}
          terms={['IVC', 'Folding']}
        ><LongTaskArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="intelligence" index={13} className="intelligence-screen"
          eyebrow="08 / 09 · PROOF OF INTELLIGENCE"
          title="有用的计算，"
          accent="才写进账本。"
          body="真实任务、验收结果和执行回执一起生成 PoI。"
          comparison={{
            traditionalTitle: '共识安全不等于计算有用',
            traditional: 'PoW / PoS 能选出块者，不能证明任务真的完成。',
            acvmTitle: '需求、结果、回执一起验',
            acvm: '通过验收的计算才记录贡献。',
          }}
          terms={['Proof of Intelligence', 'zkML']}
        ><IntelligenceProofArchitecture /></TechnicalSlide>

        <TechnicalSlide
          id="chains" index={14} className="chains-screen"
          eyebrow="09 / 09 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="保留原来的链，"
          accent="只替换执行层。"
          body="执行语义不变，通过适配器接入现有链或独立成链。"
          comparison={{
            traditionalTitle: '换链就要重写业务',
            traditional: '虚拟机、ABI 和最终性不同，迁移成本高。',
            acvmTitle: '业务语义不随链变化',
            acvm: '只换适配器，不改合约流程。',
          }}
          terms={['Light Client', 'Receipt Root']}
        ><ChainArchitectureSimple /></TechnicalSlide>

        <TechnicalSlide
          id="stories" index={15} className="stories-screen"
          eyebrow="APPLICATION NETWORK · INTERACTIVE GRAPH"
          title="一张运行中的"
          accent="ACVM 合约网络。"
          body="拖动网络，点击合约查看部署者、核验数据和链上回执。"
        ><ScenarioGraph /></TechnicalSlide>
      </main>
    </div>
  );
}
