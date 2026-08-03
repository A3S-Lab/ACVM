import { useEffect, useState, type CSSProperties } from 'react';
import { CourseJourney } from './components/CourseJourney';
import { Icon, LogoMark } from './components/Icons';
import FoundationsCourse from './content/01-foundations.mdx';
import AcvmContractCourse from './content/02-acvm-contract.mdx';
import AcvmStateCourse from './content/03-acvm-state.mdx';
import AcvmTrustCourse from './content/04-acvm-trust.mdx';
import AcvmNetworkCourse from './content/05-acvm-network.mdx';
import { navigation, screens } from './course';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';

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
      <header>
        <span>CHAPTER</span>
        <strong>{String(activeScreen).padStart(2, '0')} / {String(screens.length - 1).padStart(2, '0')}</strong>
      </header>
      <nav>
        {screens.map(([id, label], index) => (
          <a
            href={`#${id}`}
            className={activeScreen === index ? 'is-active' : ''}
            aria-label={`${index === 0 ? '课程地图' : `第 ${index} 章`}：${label}`}
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
        const screen = target?.closest<HTMLElement>('[data-screen]')
          ?? (target?.matches('[data-screen]') ? target : null);
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

      const lesson = (event.target as HTMLElement | null)?.closest<HTMLElement>('.lesson-reading');
      if (lesson) {
        const canScrollDown = lesson.scrollTop + lesson.clientHeight < lesson.scrollHeight - 1;
        const canScrollUp = lesson.scrollTop > 1;
        if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) return;
      }

      event.preventDefault();
      if (locked) return;
      goToScreen(activeScreen + (event.deltaY > 0 ? 1 : -1));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!desktop()) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, button, a, [contenteditable="true"]') || target?.closest('.lesson-reading')) return;
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
              <span className="hero-eyebrow"><i /> 00 / COURSE MAP · BITCOIN → ETHEREUM → ACVM</span>
              <h1>从可信账本<br /><em className="hero-full-name">到可验证智能。</em></h1>
              <p>沿一笔交易的演化路线，先理解比特币如何统一所有权，再理解以太坊如何统一程序状态，最后推导 ACVM 如何让链下 Agent 的工作进入链上结算。</p>
              <ul className="hero-benefits" aria-label="课程三阶段">
                <li><Icon name="key" />Bitcoin：可信账本</li>
                <li><Icon name="terminal" />Ethereum：可编程状态</li>
                <li><Icon name="brain" />ACVM：可验证智能执行</li>
              </ul>
              <div className="hero-actions">
                <a href="#btc-ledger" className="button button--primary">从比特币开始 <Icon name="arrow" /></a>
                <a href="#spec-contract" className="button button--secondary">直接进入 ACVM</a>
              </div>
            </div>
            <CourseJourney />
          </div>
          <span className="hero-footnote"><i /> OWNERSHIP → PROGRAMMABILITY → VERIFIABLE AGENTIC COMPUTATION</span>
          <span className="screen-number" aria-hidden="true">00</span>
        </section>

        <FoundationsCourse />
        <AcvmContractCourse />
        <AcvmStateCourse />
        <AcvmTrustCourse />
        <AcvmNetworkCourse />
      </main>
    </div>
  );
}
