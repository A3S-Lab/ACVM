import { useEffect, useState } from 'react';
import {
  AcvmRuntimeArchitecture,
  IdentityArchitecture,
  OffchainArchitecture,
} from './components/AcvmArchitecture';
import { ChainArchitecture } from './components/ChainArchitecture';
import { Icon, LogoMark } from './components/Icons';
import { LongTaskArchitecture } from './components/LongTaskArchitecture';
import {
  A3sBoxArchitecture,
  A3sPowerArchitecture,
  AnySentryArchitecture,
} from './components/SecurityArchitecture';
import { ScenarioPatterns } from './components/SimpleStory';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

const screens = [
  ['top', 'ACVM'],
  ['runtime', '执行内核'],
  ['identity', '身份与能力'],
  ['offchain', '可信链下计算'],
  ['box', 'a3s-box'],
  ['power', 'a3s-power'],
  ['sentry', 'AnySentry'],
  ['proof', '长期证明'],
  ['chains', '多链部署'],
  ['stories', '场景模式'],
] as const;

const navigation = [
  { id: 'runtime', label: '执行内核', screens: ['runtime'] },
  { id: 'identity', label: '可信身份', screens: ['identity'] },
  { id: 'offchain', label: '可信计算', screens: ['offchain'] },
  { id: 'box', label: 'A3S 安全', screens: ['box', 'power', 'sentry'] },
  { id: 'proof', label: '长期证明', screens: ['proof'] },
  { id: 'chains', label: '多链部署', screens: ['chains'] },
  { id: 'stories', label: '场景模式', screens: ['stories'] },
] as const;

function SectionHeading({
  eyebrow,
  title,
  accent,
  body,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
}) {
  return (
    <header className="section-heading">
      <span><i /> {eyebrow}</span>
      <h2>{title}<br /><em>{accent}</em></h2>
      <p>{body}</p>
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
  children,
}: {
  id: string;
  index: number;
  className: string;
  eyebrow: string;
  title: string;
  accent: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`screen presentation-screen ${className}`} id={id} data-screen={index}>
      <div className="screen-inner technical-layout presentation-layout">
        <SectionHeading eyebrow={eyebrow} title={title} accent={accent} body={body} />
        {children}
      </div>
    </section>
  );
}

function HeroArchitecture() {
  return (
    <div className="hero-architecture" aria-label="Agentic Contract 从发布到联盟链终局的执行架构">
      <div className="hero-contract">
        <header><Icon name="fingerprint" /><span><small>PUBLISHER</small><strong>个人 / 企业</strong></span></header>
        <section>
          <span>AGENTIC CONTRACT</span>
          <strong>有身份的任务合约</strong>
          <p>目标 · 策略 · 能力证明<br />验收规则 · 结算分支</p>
        </section>
        <footer><i /> 身份与规则已签名</footer>
      </div>

      <div className="hero-link">
        <span>LOAD</span>
        <i><Icon name="arrow" /></i>
      </div>

      <div className="hero-acvm">
        <header>
          <LogoMark />
          <span><strong>ACVM</strong><small>AGENTIC CONTRACT VM</small></span>
          <em>RUNNING</em>
        </header>
        <div>
          <span><i>01</i><strong>状态机</strong></span>
          <span><i>02</i><strong>长期调度</strong></span>
          <span><i>03</i><strong>工具桥接</strong></span>
          <span><i>04</i><strong>策略落实</strong></span>
          <span><i>05</i><strong>凭证生成</strong></span>
        </div>
        <footer>
          <span><Icon name="key" /> Progressive API</span>
          <span><Icon name="shield" /> Zero Trust</span>
        </footer>
      </div>

      <div className="hero-link">
        <span>PROVE</span>
        <i><Icon name="arrow" /></i>
      </div>

      <div className="hero-ledger">
        <header><Icon name="chain" /><span><small>CONSORTIUM CHAIN</small><strong>多机构共同确认</strong></span></header>
        <div>
          <span><small>BLOCK</small><strong>#18420</strong></span>
          <i><Icon name="chain" /></i>
          <span className="is-current"><small>BLOCK</small><strong>#18421</strong></span>
          <i><Icon name="chain" /></i>
          <span><small>FINAL</small><strong>已审计</strong></span>
        </div>
        <footer>状态承诺 · 完成证明 · 业务终局</footer>
      </div>

      <div className="hero-enterprise-tools">
        <span><small>ORACLE & TOOL PLANE</small><strong>可信事实进入，企业能力受控执行</strong></span>
        <div>
          <em>list</em><Icon name="arrow" /><em>describe</em><Icon name="arrow" /><em>dry-run</em><Icon name="arrow" /><em>execute</em>
        </div>
        <strong>预言机凭证校验来源；工具调用重新验证主体、参数、时限与设备状态</strong>
      </div>
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
      { threshold: [0.25, 0.5, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const target = document.getElementById(id);
          const scroller = document.querySelector<HTMLElement>('.page-scroller');
          if (!target || !scroller) return;
          const screen = target.matches('[data-screen]')
            ? target
            : target.closest<HTMLElement>('[data-screen]');
          if (!screen) return;
          if (window.matchMedia('(min-width: 961px)').matches) scroller.scrollTop = screen.offsetTop;
          else window.scrollTo(0, screen.offsetTop);
        });
      });
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="site-shell site-shell--calm">
      <a className="skip-link" href="#top">跳到主要内容</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="ACVM 首页">
          <LogoMark />
          <span><strong>ACVM</strong><small>AGENTIC CONTRACT VM</small></span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span /><span />
        </button>

        <nav className={menuOpen ? 'is-open' : ''} aria-label="主要导航">
          {navigation.map((item) => (
            <a
              href={`#${item.id}`}
              key={item.id}
              className={item.screens.some((screen) => screen === activeId) ? 'is-active' : ''}
              aria-current={item.screens.some((screen) => screen === activeId) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a className="header-github" href={githubUrl} target="_blank" rel="noreferrer" aria-label="在 GitHub 查看 ACVM 仓库">
          <Icon name="github" /><span>GitHub</span>
        </a>
      </header>

      <aside className="screen-dots" aria-label="章节导航">
        {screens.map(([id, label], index) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeScreen === index ? 'is-active' : ''}
            aria-current={activeScreen === index ? 'page' : undefined}
          >
            <i /><span>{label}</span>
          </a>
        ))}
      </aside>

      <main className="page-scroller">
        <section className="screen hero-screen" id="top" data-screen="0">
          <div className="hero-backdrop" aria-hidden="true"><i /><i /><i /></div>
          <div className="screen-inner hero-layout">
            <div className="hero-copy">
              <span className="hero-eyebrow"><i /> ACVM · AGENTIC CONTRACT VM</span>
              <h1>让 Agentic Contract<br /><em>可信执行真实业务。</em></h1>
              <p>ACVM 是 Agentic Contract 的可信执行环境。企业数据预言机提供可验证事实，Agent 在零信任边界内完成链下计算、隐私推理与工具执行，再把状态承诺和证明交给联盟链确认业务终局。</p>
              <div className="hero-actions">
                <a href="#runtime" className="button button--primary">理解 ACVM 如何执行 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">查看行业场景</a>
              </div>
              <div className="hero-facts">
                <span><Icon name="fingerprint" /><strong>身份可追责</strong><small>组织 → Agent → 合约 → 会话</small></span>
                <span><Icon name="key" /><strong>能力最小开放</strong><small>发现、预演、短期授权</small></span>
                <span><Icon name="chain" /><strong>结果可验证</strong><small>证明、共识、审计终局</small></span>
              </div>
            </div>
            <HeroArchitecture />
          </div>
          <div className="hero-positioning">
            <span>不是一条新链</span>
            <i />
            <span>不是 EVM 换皮</span>
            <i />
            <span>不发行虚拟货币</span>
            <i />
            <span>不替代联盟链共识</span>
          </div>
        </section>

        <TechnicalSlide
          id="runtime"
          index={1}
          className="architecture-screen runtime-screen"
          eyebrow="01 / 09 · ACVM EXECUTION KERNEL"
          title="Agentic Contract 进入 ACVM，"
          accent="由五个内核职责推进状态。"
          body="加载器固定合约实例，状态机管理长期执行，工具桥接器连接企业能力，策略执行器落实风险决定，凭证构造器生成链上可验证结果。"
        >
          <AcvmRuntimeArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="identity"
          index={2}
          className="architecture-screen identity-screen"
          eyebrow="02 / 09 · IDENTITY & CAPABILITY"
          title="身份从责任主体延伸到每次工具会话，"
          accent="能力可证明、可缩小、可撤销。"
          body="组织、Agent、合约实例和临时会话形成连续责任链。验证方获得主体、能力范围和有效期证明，企业内部凭据与能力评分保持私密。"
        >
          <IdentityArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="offchain"
          index={3}
          className="architecture-screen offchain-screen"
          eyebrow="03 / 09 · ORACLE & OFF-CHAIN COMPUTE"
          title="企业事实在链外产生，"
          accent="以可验证凭证进入合约状态。"
          body="企业数据预言机验证来源与时效，ACVM 运行长期任务、工具调用和隐私推理，联盟链验证状态承诺、回执根与零知识证明。"
        >
          <OffchainArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="box"
          index={4}
          className="security-screen box-screen"
          eyebrow="04 / 09 · A3S-BOX"
          title="工作负载运行在明确的隔离等级，"
          accent="生命周期由唯一管理器持有。"
          body="a3s-box 统一接收 SDK、CRI 与容器入口，根据硬件能力和策略选择 MicroVM 或显式 Sandbox，并生成可审计的执行租约与安全回执。"
        >
          <A3sBoxArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="power"
          index={5}
          className="security-screen power-screen"
          eyebrow="05 / 09 · A3S-POWER"
          title="模型、代码与硬件度量绑定，"
          accent="隐私推理结果可独立验证。"
          body="加密模型与私密 Prompt 在隔离环境中加载，推理完成后输出模型哈希、平台度量和硬件签名，原始数据与模型明文不进入联盟链。"
        >
          <A3sPowerArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="sentry"
          index={6}
          className="security-screen sentry-screen"
          eyebrow="06 / 09 · ANYSENTRY"
          title="运行时信号形成安全证据，"
          accent="风险决定进入强制执行边界。"
          body="AnySentry 采集进程、工具、网络、文件与模型事件，完成规范化和分级判断；ACVM、零信任网关与内核 Guard 执行放行、审批或阻断。"
        >
          <AnySentryArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="proof"
          index={7}
          className="proof-screen"
          eyebrow="07 / 09 · LONG-RUNNING TASK PROOF"
          title="任务可以运行数月，"
          accent="链上验证它是否按规则完成。"
          body="连续状态承诺记录里程碑、暂停、重试与审批，IVC 和递归零知识证明将完整执行压缩为固定大小的完成证明。"
        >
          <LongTaskArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="chains"
          index={8}
          className="chains-screen"
          eyebrow="08 / 09 · CHAIN-AGNOSTIC DEPLOYMENT"
          title="同一套 Agentic Contract 语义，"
          accent="进入不同联盟链的治理边界。"
          body="链外协处理器、原生执行器与 ACVM 应用链对应不同部署条件；身份、事件、证明和终局通过统一适配 ABI 映射到 BSN、FISCO BCOS、长安链、Fabric 与企业 EVM。"
        >
          <ChainArchitecture />
        </TechnicalSlide>

        <TechnicalSlide
          id="stories"
          index={9}
          className="stories-screen"
          eyebrow="09 / 09 · SCENARIO ONTOLOGY"
          title="真实业务由多方协作完成，"
          accent="责任、事实与终局必须一致。"
          body="广告转化由平台、独立归因与 CRM 交叉核验；工程、制造、金融和教育任务由法定事实源、零信任控制与联盟链节点共同确认。"
        >
          <ScenarioPatterns />
        </TechnicalSlide>
      </main>
    </div>
  );
}
