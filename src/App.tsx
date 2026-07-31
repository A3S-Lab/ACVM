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
  ['stories', '验证场景'],
] as const;

const navigation = [
  { id: 'runtime', label: '执行内核', screens: ['runtime'] },
  { id: 'identity', label: '可信身份', screens: ['identity'] },
  { id: 'offchain', label: '可信计算', screens: ['offchain'] },
  { id: 'box', label: 'A3S 安全', screens: ['box', 'power', 'sentry'] },
  { id: 'proof', label: '长期证明', screens: ['proof'] },
  { id: 'chains', label: '多链部署', screens: ['chains'] },
  { id: 'stories', label: '验证场景', screens: ['stories'] },
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
    <div className="hero-result-service" aria-label="ACVM 去中心化可信验证智能体运行架构">
      <header>
        <span><small>DECENTRALIZED VERIFICATION AGENT RUNTIME</small><strong>去中心化可信验证智能体虚拟机</strong></span>
        <em>MULTI-DOMAIN</em>
      </header>

      <div className="result-request-grid">
        <span><Icon name="receipt" /><small>结果服务方</small><strong>提交结果声明</strong></span>
        <span><Icon name="fingerprint" /><small>业务委托方</small><strong>签署验收谓词</strong></span>
        <span><Icon name="eye" /><small>独立事实源</small><strong>出具可验证证据</strong></span>
        <span><Icon name="chain" /><small>治理网络</small><strong>约定共识门限</strong></span>
      </div>

      <div className="result-acvm-bar">
        <LogoMark />
        <span><strong>ACVM · Agentic Contract VM</strong><small>运行带身份、受约束、可证明的验证 Agent</small></span>
        <i>RUNNING</i>
      </div>

      <div className="result-engine-grid">
        <section><small>V₁ · 委托方节点</small><strong>规则验收 Agent</strong><p>按签名谓词判断结果是否完成</p></section>
        <section><small>V₂ · 独立节点</small><strong>事实核验 Agent</strong><p>从多预言机与企业 API 主动取证</p></section>
        <section><small>V₃ · 隐私节点</small><strong>隐私验证 Agent</strong><p>通过 a3s-box / power 计算敏感事实</p></section>
        <section><small>V₄ · 审计节点</small><strong>安全审计 Agent</strong><p>依据 AnySentry 事件复核执行过程</p></section>
      </div>

      <div className="verified-result-package">
        <header><Icon name="check" /><span><small>DECENTRALIZED VERIFICATION OUTPUT</small><strong>多方可复验的验证结论</strong></span></header>
        <div>
          <span>结果声明</span><i>+</i>
          <span>事实证据</span><i>+</i>
          <span>验证签名</span><i>+</i>
          <span>完成证明</span><i>+</i>
          <span>终局指令</span>
        </div>
      </div>

      <footer>
        <span><Icon name="chain" /> 联盟链多节点确认</span>
        <span><Icon name="terminal" /> 企业系统执行终局</span>
        <span><Icon name="receipt" /> 审计与自动结算</span>
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
              <span className="hero-eyebrow"><i /> ACVM · FOR RESULT-AS-A-SERVICE</span>
              <h1>结果由服务方交付。<br /><em>可信由多方验证。</em></h1>
              <p>ACVM 是运行可信验证智能体的 Agentic Contract 虚拟机。带身份的验证 Agent 在零信任边界内从独立预言机、企业 API 与隐私计算环境取证，生成可审计证明，再由联盟链多节点确认结果是否成立。</p>
              <div className="hero-actions">
                <a href="#runtime" className="button button--primary">理解验证如何运行 <Icon name="arrow" /></a>
                <a href="#stories" className="button button--secondary">查看业务验证场景</a>
              </div>
              <div className="hero-facts">
                <span><Icon name="fingerprint" /><strong>验证者有身份</strong><small>DID · 能力证明 · 责任链</small></span>
                <span><Icon name="eye" /><strong>证据来自多方</strong><small>预言机 · 企业 API · 设备</small></span>
                <span><Icon name="chain" /><strong>结论共同确认</strong><small>门限签名 · 零知识证明 · 共识</small></span>
              </div>
            </div>
            <HeroArchitecture />
          </div>
          <div className="hero-positioning">
            <span>Result Claim</span>
            <i />
            <span>Independent Evidence</span>
            <i />
            <span>Verifier Attestation</span>
            <i />
            <span>Completion Proof</span>
            <i />
            <span>Finality Instruction</span>
          </div>
        </section>

        <TechnicalSlide
          id="runtime"
          index={1}
          className="architecture-screen runtime-screen"
          eyebrow="01 / 09 · ACVM EXECUTION KERNEL"
          title="可信验证 Agent 进入 ACVM，"
          accent="每次核验沿可证明状态机运行。"
          body="加载器固定验证合约、身份与验收谓词，状态机管理长期核验，工具桥接器从企业系统主动取证，策略执行器落实风险决定，凭证构造器生成链上可验证结论。"
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
          title="业务结果在链外发生，"
          accent="验证 Agent 从独立事实源主动取证。"
          body="企业数据预言机验证来源、签名与时效，ACVM 隔离运行工具调用和隐私推理；原始数据留在企业域内，联盟链只验证状态承诺、回执根与零知识证明。"
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
          eyebrow="09 / 09 · RESULT VERIFICATION SCENARIOS"
          title="服务方提交业务结果，"
          accent="验证 Agent 独立取证并共同确认。"
          body="推广渠道申报 2,184 个有效转化；委托方、独立归因与审计节点分别运行验证 Agent，从广告平台、归因服务和 CRM 取证，通过验收谓词后共同签署结算证明。"
        >
          <ScenarioPatterns />
        </TechnicalSlide>
      </main>
    </div>
  );
}
