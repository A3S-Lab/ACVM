import { useEffect, useRef, useState } from 'react';
import { AmbientGrid } from './components/AmbientGrid';
import { CausalWorld } from './components/CausalWorld';
import { Icon, LogoMark } from './components/Icons';
import { LongTaskProof } from './components/LongTaskProof';
import { PrivacyLab } from './components/PrivacyLab';
import { ExecutionKernel, IdentityCapability } from './components/TechnicalFeatures';
import { storyOptions, storyPlaybooks, type Story, type StoryId } from './components/TrustFlow';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

const storyOrder: StoryId[] = [
  'ads',
  'sla',
  'royalty',
  'gov-subsidy',
  'gov-project',
  'supply',
  'factory-quality',
  'factory-energy',
  'finance-credit',
  'finance-insurance',
  'education-training',
  'education-research',
];

const storyChapters = storyOrder
  .map((id) => storyOptions.find((story) => story.id === id))
  .filter((story): story is Story => Boolean(story));

const screens = [
  { id: 'top', label: 'ACVM' },
  { id: 'stories', label: '场景展厅' },
  { id: 'runtime', label: '执行内核' },
  { id: 'identity', label: '身份与能力' },
  { id: 'privacy', label: '隐私与安全' },
  { id: 'architecture', label: '长期证明' },
  { id: 'chains', label: '多链部署' },
];

const primaryNav = [
  ['stories', '场景故事'],
  ['runtime', '执行内核'],
  ['identity', '身份与能力'],
  ['privacy', '隐私与安全'],
  ['architecture', '长期证明'],
  ['chains', '多链部署'],
] as const;

function ScreenHeading({
  eyebrow,
  title,
  accent,
  body,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  body: string;
}) {
  return (
    <div className="screen-heading" data-reveal>
      <span className="section-eyebrow"><i /> {eyebrow}</span>
      <h2>{title}{accent ? <><br /><span>{accent}</span></> : null}</h2>
      <p>{body}</p>
    </div>
  );
}

const categoryKeys: Record<Story['category'], string> = {
  商业: 'business',
  政务: 'government',
  制造: 'manufacturing',
  金融: 'finance',
  教育: 'education',
};

function StoryChapter({
  story,
  chapterIndex,
  selected,
  running,
}: {
  story: Story;
  chapterIndex: number;
  selected: boolean;
  running: boolean;
}) {
  const playbook = storyPlaybooks[story.id];

  return (
    <article
      className={`story-slide story-screen story-screen--${categoryKeys[story.category]}`}
      id={story.id}
      data-story-slide={chapterIndex}
      aria-label={`${story.title}案例`}
    >
      <div className="screen-inner story-screen-inner">
        <header className="story-chapter-head" data-reveal>
          <div className="story-chapter-title">
            <span className="story-chapter-index">CASE {String(chapterIndex + 1).padStart(2, '0')} / {String(storyChapters.length).padStart(2, '0')} · {story.category}</span>
            <h2>{story.title}</h2>
          </div>
          <div className="story-chapter-copy">
            <small>一笔真实业务，从承诺跑到结果</small>
            <p className="story-chapter-lead">{playbook.oneLine}</p>
          </div>
          <div className="story-chapter-outcome">
            <span><Icon name="receipt" /> 合约结果</span>
            <strong>{story.receipt}</strong>
            <small>{story.receiptLabel} · 多机构确认后执行</small>
          </div>
        </header>

        <div className="story-animation" data-reveal>
          {selected ? (
            <CausalWorld storyId={story.id} active={running} />
          ) : (
            <div className="story-idle-world" aria-hidden="true"><LogoMark /><span>{story.title}</span></div>
          )}
        </div>
      </div>
    </article>
  );
}

function StoryGallery({ active }: { active: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeStory, setActiveStory] = useState(0);

  const goToStory = (index: number, behavior: ScrollBehavior = 'smooth') => {
    const track = trackRef.current;
    if (!track) return;
    const next = Math.max(0, Math.min(storyChapters.length - 1, index));
    track.scrollTo({ left: next * track.clientWidth, behavior });
    setActiveStory(next);
  };

  useEffect(() => {
    const handleHash = () => {
      const id = window.location.hash.slice(1) as StoryId;
      const index = storyChapters.findIndex((story) => story.id === id);
      if (index >= 0) window.requestAnimationFrame(() => goToStory(index, 'auto'));
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <section className="screen stories-screen" id="stories" data-screen="1">
      <div
        className="story-gallery-track"
        ref={trackRef}
        data-horizontal-gallery
        tabIndex={0}
        aria-label="ACVM 行业场景横向展厅"
        onScroll={(event) => {
          const track = event.currentTarget;
          const index = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
          if (index !== activeStory) setActiveStory(index);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goToStory(activeStory - 1);
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goToStory(activeStory + 1);
          }
        }}
      >
        {storyChapters.map((story, chapterIndex) => (
          <StoryChapter
            key={story.id}
            story={story}
            chapterIndex={chapterIndex}
            selected={activeStory === chapterIndex}
            running={active && activeStory === chapterIndex}
          />
        ))}
      </div>

      <div className="story-gallery-controls" data-reveal>
        <button type="button" className="story-gallery-arrow story-gallery-arrow--prev" onClick={() => goToStory(activeStory - 1)} disabled={activeStory === 0} aria-label="上一个场景"><Icon name="arrow" /></button>
        <label>
          <small>横向场景 · 可直接选择</small>
          <select value={storyChapters[activeStory].id} onChange={(event) => goToStory(storyChapters.findIndex((story) => story.id === event.target.value))} aria-label="选择行业场景">
            {storyChapters.map((story, index) => <option key={story.id} value={story.id}>{String(index + 1).padStart(2, '0')} · {story.category} · {story.title}</option>)}
          </select>
        </label>
        <div className="story-gallery-progress" aria-label="场景快速跳转">
          {storyChapters.map((story, index) => <button type="button" key={story.id} className={index === activeStory ? 'is-active' : ''} onClick={() => goToStory(index)} aria-label={`转到${story.title}`} tabIndex={-1} />)}
        </div>
        <strong>{String(activeStory + 1).padStart(2, '0')} / {String(storyChapters.length).padStart(2, '0')}</strong>
        <button type="button" className="story-gallery-arrow story-gallery-arrow--next" onClick={() => goToStory(activeStory + 1)} disabled={activeStory === storyChapters.length - 1} aria-label="下一个场景"><Icon name="arrow" /></button>
      </div>
    </section>
  );
}

function HeroMap() {
  return (
    <div className="hero-map" data-reveal aria-label="ACVM 位于智能体和区块链之间">
      <div className="hero-map-grid" aria-hidden="true" />
      <svg viewBox="0 0 620 520" preserveAspectRatio="none" aria-hidden="true">
        <path d="M114 260 C185 260 207 260 245 260" />
        <path d="M375 260 C420 260 445 260 510 260" />
        <path d="M310 96 C310 145 310 171 310 195" />
        <path d="M310 325 C310 358 310 382 310 424" />
      </svg>

      <div className="hero-map-core">
        <span className="map-orbit"><i /><i /><i /></span>
        <LogoMark />
        <strong>ACVM</strong>
        <small>TRUSTED EXECUTION</small>
      </div>

      <div className="map-node map-node--agent">
        <span><Icon name="brain" /></span><div><small>A3S AGENT</small><strong>提出行动</strong></div>
      </div>
      <div className="map-node map-node--proof">
        <span><Icon name="key" /></span><div><small>PROGRESSIVE API + ZERO TRUST</small><strong>逐级发现 · 每次验证</strong></div>
      </div>
      <div className="map-node map-node--sentry">
        <span><Icon name="eye" /></span><div><small>ANYSENTRY</small><strong>风险判断</strong></div>
      </div>
      <div className="map-node map-node--chain">
        <span><Icon name="chain" /></span><div><small>BLOCKCHAIN</small><strong>确认与留证</strong></div>
      </div>

      <div className="map-packet map-packet--left"><Icon name="spark" /></div>
      <div className="map-packet map-packet--right"><Icon name="receipt" /></div>
      <div className="hero-map-status"><i /><span>身份有效 · 能力匹配 · 策略通过</span><strong>EXECUTE</strong></div>
    </div>
  );
}

function ChainNetwork() {
  const chains = [
    ['bsn', 'BSN 网络环境', '国内基础设施'],
    ['fisco', 'FISCO BCOS', '国产联盟链'],
    ['chainmaker', '长安链', 'ChainMaker'],
    ['fabric', 'Hyperledger Fabric', '企业级账本'],
    ['evm', 'EVM 兼容环境', '企业链适配'],
  ] as const;

  return (
    <div className="chain-network" aria-label="ACVM 多链适配架构">
      <div className="chain-network-grid" aria-hidden="true" />
      <svg viewBox="0 0 760 470" preserveAspectRatio="none" aria-hidden="true">
        <path d="M380 235 C250 235 250 72 104 72" />
        <path d="M380 235 C250 235 240 176 104 176" />
        <path d="M380 235 C250 235 240 294 104 294" />
        <path d="M380 235 C510 235 520 120 656 120" />
        <path d="M380 235 C510 235 520 342 656 342" />
      </svg>
      <div className="chain-core">
        <span className="chain-core-orbit"><i /><i /><i /></span>
        <LogoMark />
        <strong>ACVM</strong>
        <small>统一执行语义</small>
      </div>
      {chains.map(([key, name, type], index) => (
        <div className={`chain-node chain-node--${key}`} key={key} style={{ '--node-order': index } as React.CSSProperties}>
          <span>{name.slice(0, 1)}</span>
          <div><strong>{name}</strong><small>{type}</small></div>
          <em>ADAPTER</em>
        </div>
      ))}
      <div className="chain-packet chain-packet--one" aria-hidden="true" />
      <div className="chain-packet chain-packet--two" aria-hidden="true" />
      <div className="chain-packet chain-packet--three" aria-hidden="true" />
      <div className="ledger-strip" aria-label="区块链审计账本">
        <span><small>BLOCK</small><strong>#18420</strong><i /></span>
        <em><Icon name="chain" /></em>
        <span className="is-current"><small>BLOCK</small><strong>#18421</strong><i /></span>
        <em><Icon name="chain" /></em>
        <span><small>NEXT</small><strong>共识中</strong><i /></span>
      </div>
    </div>
  );
}

export function App() {
  const scrollerRef = useRef<HTMLElement>(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const scrollToHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      window.requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const sections = Array.from(scroller.querySelectorAll<HTMLElement>('[data-screen]'));
    let frame = 0;
    const update = () => {
      frame = 0;
      const viewport = scroller.getBoundingClientRect();
      let visibleIndex = 0;
      let visiblePixels = -1;
      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        const pixels = Math.max(0, Math.min(bounds.bottom, viewport.bottom) - Math.max(bounds.top, viewport.top));
        if (pixels > visiblePixels) {
          visiblePixels = pixels;
          visibleIndex = Number(section.dataset.screen);
        }
      });
      setActiveScreen(visibleIndex);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    scroller.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      scroller.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const desktop = window.matchMedia('(min-width: 961px)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sections = Array.from(scroller.querySelectorAll<HTMLElement>('[data-screen]'));
    let locked = false;
    let wheelTotal = 0;
    let wheelReset = 0;

    const currentIndex = () => {
      let nearest = 0;
      let distance = Number.POSITIVE_INFINITY;
      sections.forEach((section, index) => {
        const nextDistance = Math.abs(section.offsetTop - scroller.scrollTop);
        if (nextDistance < distance) {
          nearest = index;
          distance = nextDistance;
        }
      });
      return nearest;
    };

    const move = (direction: number) => {
      if (locked) return;
      const next = Math.max(0, Math.min(sections.length - 1, currentIndex() + direction));
      if (next === currentIndex()) return;
      locked = true;
      sections[next].scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => { locked = false; }, reduced.matches ? 250 : 850);
    };

    const onWheel = (event: WheelEvent) => {
      if (!desktop.matches) return;
      const target = event.target instanceof Element ? event.target : null;
      const horizontalGallery = target?.closest<HTMLElement>('[data-horizontal-gallery]');
      const horizontalDelta = event.shiftKey ? event.deltaY : event.deltaX;
      const hasHorizontalIntent = Boolean(horizontalGallery) && (event.shiftKey || Math.abs(event.deltaX) > Math.max(8, Math.abs(event.deltaY) * .6));
      if (horizontalGallery && hasHorizontalIntent) {
        event.preventDefault();
        horizontalGallery.scrollLeft += horizontalDelta;
        wheelTotal = 0;
        return;
      }
      event.preventDefault();
      if (locked) return;
      window.clearTimeout(wheelReset);
      wheelTotal += event.deltaY;
      wheelReset = window.setTimeout(() => { wheelTotal = 0; }, 140);
      if (Math.abs(wheelTotal) < 38) return;
      move(wheelTotal > 0 ? 1 : -1);
      wheelTotal = 0;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop.matches || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault();
        move(1);
      }
      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault();
        move(-1);
      }
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(wheelReset);
      scroller.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) (entry.target as HTMLElement).classList.add('is-visible');
      }),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="site-shell site-shell--snap">
      <a className="skip-link" href="#top">跳到主要内容</a>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ACVM 首页">
          <LogoMark className="brand-mark" />
          <span><strong>ACVM</strong><small>AGENTIC CONTRACT VM</small></span>
        </a>
        <button className="menu-toggle" type="button" aria-label="打开导航菜单" aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}><span /><span /></button>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="主要导航">
          {primaryNav.map(([id, label]) => <a href={`#${id}`} key={id} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="header-github" href={githubUrl} target="_blank" rel="noreferrer"><Icon name="github" /><span>GitHub</span></a>
      </header>

      <aside className="screen-dots" aria-label="页面导航">
        {screens.map(({ id, label }, index) => (
          <a className={activeScreen === index ? 'is-active' : ''} href={`#${id}`} key={id} aria-label={label} aria-current={activeScreen === index ? 'page' : undefined}><i /><span>{label}</span></a>
        ))}
      </aside>

      <main className="page-scroller" ref={scrollerRef}>
        <section className="screen hero-screen" id="top" data-screen="0">
          <AmbientGrid />
          <div className="screen-inner hero-screen-inner">
            <div className="hero-copy" data-reveal>
              <div className="preview-pill"><span>ACVM</span><i /> AgenticContract Virtual Machine</div>
              <h1>面向智能体的<br /><span>可信执行虚拟机</span></h1>
              <p className="hero-subtitle">个人或企业发布带身份的 AgenticContract。合约通过渐进式 API 使用企业能力，每次调用都经过零信任校验，再由 ACVM 执行并留证。</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#stories">进入场景故事 <Icon name="arrow" /></a>
                <a className="button button--ghost" href={githubUrl} target="_blank" rel="noreferrer"><Icon name="github" /> GitHub</a>
              </div>
              <div className="hero-principle">
                <span><Icon name="fingerprint" /> 可信身份</span>
                <span><Icon name="terminal" /> 渐进式 API</span>
                <span><Icon name="shield" /> 零信任网络</span>
              </div>
            </div>
            <HeroMap />
          </div>
          <a className="screen-next" href="#stories"><span>下一屏</span><i /></a>
        </section>

        <StoryGallery active={activeScreen === 1} />

        <section className="screen runtime-screen" id="runtime" data-screen="2">
          <div className="screen-inner tech-screen-inner">
            <div className="tech-screen-head">
              <ScreenHeading eyebrow="ACVM EXECUTION KERNEL" title="不是把 EVM 换成模型，" accent="而是替换合约执行语义。" body="传统虚拟机读取交易与字节码；ACVM 读取带身份的目标、能力证明和策略，在受控工具环境完成链外任务，再输出可验证执行凭证。链继续负责共识和账本。" />
              <div className="tech-feature-notes" data-reveal>
                <span><small>INPUT</small><strong>Goal + Identity + Policy</strong></span>
                <span><small>STATE</small><strong>Event Commitment</strong></span>
                <span><small>OUTPUT</small><strong>Proof Receipt</strong></span>
                <span><small>FINALITY</small><strong>Consortium Ledger</strong></span>
              </div>
            </div>
            <div className="runtime-screen-demo" data-reveal><ExecutionKernel active={activeScreen === 2} /></div>
          </div>
        </section>

        <section className="screen identity-screen" id="identity" data-screen="3">
          <div className="screen-inner tech-screen-inner">
            <div className="tech-screen-head">
              <ScreenHeading eyebrow="TRUSTED IDENTITY + ZK CAPABILITY" title="身份能够唯一追责，" accent="能力无需公开底牌。" body="企业法定身份、Agent 实例、AgenticContract 与临时工具会话形成责任链。能力证明只回答“谁被允许以什么范围完成什么任务”，不暴露企业授权台账、模型细节和内部评价数据。" />
              <div className="tech-feature-notes" data-reveal>
                <span><small>SUBJECT</small><strong>Org → Agent → Contract</strong></span>
                <span><small>PROOF</small><strong>ZK Capability</strong></span>
                <span><small>SESSION</small><strong>Short-lived Grant</strong></span>
                <span><small>VERIFY</small><strong>Per Tool Call</strong></span>
              </div>
            </div>
            <div className="identity-screen-demo" data-reveal><IdentityCapability active={activeScreen === 3} /></div>
          </div>
        </section>

        <section className="screen privacy-screen" id="privacy" data-screen="4">
          <div className="screen-inner stacked-screen-inner">
            <div className="privacy-screen-head">
              <ScreenHeading eyebrow="PRIVATE INFERENCE + SECURITY CONTROL" title="原始数据留在隐私域，" accent="安全信号保持可见。" body="a3s-box 提供隔离环境，a3s-power 在 TEE 内推理，AnySentry 判断风险，ACVM 或 Runtime 落实控制。" />
              <div className="role-key" data-reveal>
                <span><i className="is-box" /> a3s-box · 隔离</span>
                <span><i className="is-power" /> a3s-power · 推理</span>
                <span><i className="is-sentry" /> AnySentry · 观测与判断</span>
                <span><i className="is-acvm" /> ACVM · 执行控制</span>
              </div>
            </div>
            <div className="privacy-screen-demo" data-reveal><PrivacyLab active={activeScreen === 4} /></div>
          </div>
        </section>

        <section className="screen proof-screen" id="architecture" data-screen="5">
          <AmbientGrid />
          <div className="screen-inner split-screen-inner proof-screen-inner">
            <div className="proof-copy">
              <ScreenHeading eyebrow="LONG-RUNNING TASK PROOF" title="任务可以持续数月，" accent="完成事实仍可验证。" body="AgenticContract 固定目标和验收规则，执行期间提交连续状态承诺，结束时生成零知识完成证明。链上验证完成结果，不读取中间文件、业务数据或推理轨迹。" />
              <div className="architecture-stack" data-reveal aria-label="ACVM 完整架构">
                <div><span>01</span><p><strong>身份与能力合约</strong><small>个人 / 企业身份 · ZK Capability</small></p></div>
                <i><Icon name="arrow" /></i>
                <div><span>02</span><p><strong>ACVM 可信执行</strong><small>Progressive API · Zero Trust · AnySentry</small></p></div>
                <i><Icon name="arrow" /></i>
                <div><span>03</span><p><strong>多链证明账本</strong><small>State Commitments · ZK Proof · Audit Blocks</small></p></div>
              </div>
              <a className="proof-github" href={githubUrl} target="_blank" rel="noreferrer"><Icon name="github" /> A3S-Lab / ACVM <Icon name="arrow" /></a>
            </div>
            <div data-reveal><LongTaskProof active={activeScreen === 5} /></div>
          </div>
        </section>

        <section className="screen chains-screen" id="chains" data-screen="6">
          <div className="screen-inner split-screen-inner chain-screen-inner">
            <div className="chain-copy" data-reveal>
              <span className="section-eyebrow"><i /> CHAIN-AGNOSTIC DEPLOYMENT</span>
              <h2>同一套 ACVM 执行语义，<br /><span>落到不同联盟链环境。</span></h2>
              <p>身份、工具证据、风险决定和完成证明形成统一凭证，再由适配器写入企业选择的联盟链账本。</p>
              <ul>
                <li><Icon name="check" /><span><strong>多机构共同确认</strong>企业、金融机构、监管与审计节点维护同一业务事实。</span></li>
                <li><Icon name="check" /><span><strong>兼容国内环境</strong>接入 BSN、FISCO BCOS、长安链等企业部署环境。</span></li>
                <li><Icon name="check" /><span><strong>链上最小披露</strong>只保存身份摘要、状态根、规则版本、执行结果和审计凭证。</span></li>
              </ul>
            </div>
            <div data-reveal><ChainNetwork /></div>
          </div>
        </section>
      </main>
    </div>
  );
}
