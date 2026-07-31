import { useEffect, useState } from 'react';
import { AcvmArchitecture } from './components/AcvmArchitecture';
import { ChainArchitecture } from './components/ChainArchitecture';
import { Icon, LogoMark } from './components/Icons';
import { LongTaskArchitecture } from './components/LongTaskArchitecture';
import { SecurityArchitecture } from './components/SecurityArchitecture';
import { StoryGallery } from './components/SimpleStory';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

const screens = [
  ['top', '首页'],
  ['stories', '场景故事'],
  ['runtime', '执行架构'],
  ['security', 'A3S 安全栈'],
  ['proof', '长期证明'],
  ['chains', '多链部署'],
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

function HeroArchitecture() {
  return (
    <div className="hero-architecture" aria-label="AgenticContract 从发布到联盟链终局的执行架构">
      <div className="hero-contract">
        <header><Icon name="fingerprint" /><span><small>PUBLISHER</small><strong>个人 / 企业</strong></span></header>
        <section>
          <span>AGENTICCONTRACT</span>
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
        <span><small>ENTERPRISE TOOL PLANE</small><strong>企业能力不直接暴露给 Agent</strong></span>
        <div>
          <em>list</em><Icon name="arrow" /><em>describe</em><Icon name="arrow" /><em>dry-run</em><Icon name="arrow" /><em>execute</em>
        </div>
        <strong>每次调用：主体、工具、参数、时限、设备状态重新验证</strong>
      </div>
    </div>
  );
}

export function App() {
  const [activeScreen, setActiveScreen] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
          if (window.matchMedia('(min-width: 961px)').matches) scroller.scrollTop = target.offsetTop;
          else window.scrollTo(0, target.offsetTop);
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
          {screens.slice(1).map(([id, label], index) => (
            <a
              href={`#${id}`}
              key={id}
              className={activeScreen === index + 1 ? 'is-active' : ''}
              aria-current={activeScreen === index + 1 ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
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
              <span className="hero-eyebrow"><i /> AGENTIC CONTRACT VIRTUAL MACHINE</span>
              <h1>让链上规则真正理解<br /><em>链外工作如何完成。</em></h1>
              <p>个人或企业发布有身份的 AgenticContract。ACVM 通过渐进式 API 使用企业能力，在零信任边界内持续执行、核验事实、控制风险，并把结果变成联盟链可验证的业务终局。</p>
              <div className="hero-actions">
                <a href="#stories" className="button button--primary">看懂一个真实业务 <Icon name="arrow" /></a>
                <a href="#runtime" className="button button--secondary">查看技术架构</a>
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
            <span>不发行虚拟货币</span>
            <i />
            <span>不把原始业务数据搬上链</span>
            <i />
            <span>不替代联盟链共识</span>
          </div>
        </section>

        <StoryGallery />

        <section className="screen architecture-screen" id="runtime" data-screen="2">
          <div className="screen-inner technical-layout">
            <SectionHeading
              eyebrow="ACVM ARCHITECTURE"
              title="替换复杂链外任务的执行语义，"
              accent="保留区块链的共识与账本。"
              body="ACVM 装载的不只是字节码，而是带身份、能力范围、状态、工具类型、验收条件和结算分支的 AgenticContract Package。"
            />
            <AcvmArchitecture />
          </div>
        </section>

        <section className="screen security-screen" id="security" data-screen="3">
          <div className="screen-inner technical-layout">
            <SectionHeading
              eyebrow="A3S PRIVACY & SECURITY STACK"
              title="四个系统，四种状态，"
              accent="各自架构，不可混用。"
              body="ACVM 推进合约；a3s-box 管工作负载隔离；a3s-power 管可证明推理；AnySentry 管安全证据与风险决定。各自的输入、内部结构、输出和边界都不同。"
            />
            <SecurityArchitecture />
          </div>
        </section>

        <section className="screen proof-screen" id="proof" data-screen="4">
          <div className="screen-inner technical-layout">
            <SectionHeading
              eyebrow="LONG-RUNNING TASK PROOF"
              title="任务可以运行数月，"
              accent="链上只验证它确实按规则完成。"
              body="ACVM 把长期执行变成连续状态承诺，并生成零知识完成证明。联盟节点验证证明与公共输入，不读取企业文件、业务数据或完整推理轨迹。"
            />
            <LongTaskArchitecture />
          </div>
        </section>

        <section className="screen chains-screen" id="chains" data-screen="5">
          <div className="screen-inner technical-layout">
            <SectionHeading
              eyebrow="CHAIN-AGNOSTIC DEPLOYMENT"
              title="同一套 AgenticContract 语义，"
              accent="进入不同联盟链的治理边界。"
              body="ACVM 可以作为任意链的可验证协处理器，也可以成为可控联盟链的原生执行器。适配层处理身份、事件、证明与终局，不要求所有网络采用同一底层虚拟机。"
            />
            <ChainArchitecture />
            <footer className="site-footer">
              <span><LogoMark /><strong>ACVM</strong> · A3S-Lab</span>
              <a href={githubUrl} target="_blank" rel="noreferrer"><Icon name="github" /> github.com/A3S-Lab/ACVM <Icon name="arrow" /></a>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
