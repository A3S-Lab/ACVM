import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type TouchEvent,
} from 'react';
import { Icon, LogoMark } from './components/Icons';
import { SpeakerGuide } from './components/SpeakerGuide';
import ProductValueDeck from './content/01-product-value.mdx';
import ProductCoreDeck from './content/02-product-core.mdx';
import ProductTrustDeck from './content/03-product-trust.mdx';
import ProductEconomicsDeck from './content/04-product-economics.mdx';
import ProductDeliveryDeck from './content/06-product-delivery.mdx';
import { chapterForScreen, navigation, screens } from './deck';

const githubUrl = 'https://github.com/A3S-Lab/ACVM';
const speakerGuideStorageKey = 'acvm-speaker-guide-v2';

function initialSpeakerGuideState() {
  try {
    const stored = window.localStorage.getItem(speakerGuideStorageKey);
    if (stored) return stored === 'open';
    return false;
  } catch {
    return false;
  }
}

function initialScreenIndex() {
  const requestedId = window.location.hash.slice(1);
  const requestedIndex = screens.findIndex(([id]) => id === requestedId);
  return requestedIndex >= 0 ? requestedIndex : 0;
}

function BlockchainBackdrop() {
  const blocks = [
    ['#8,421,901', '0xa8…f1', 'blockchain-block--one'],
    ['#8,421,902', '0xcf…e4', 'blockchain-block--two'],
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

function ChapterRail({
  activeScreen,
  onNavigate,
  onClose,
}: {
  activeScreen: number;
  onNavigate: (index: number) => void;
  onClose: () => void;
}) {
  return (
    <aside className="chapter-rail" aria-label="幻灯片缩略图">
      <header>
        <span><b>SLIDES</b><small>{screens.length} 页</small></span>
        <button type="button" onClick={onClose} aria-label="收起幻灯片缩略图">×</button>
      </header>
      <nav>
        {screens.map(([id, label], index) => {
          const chapter = chapterForScreen(id);
          return (
            <a
              href={`#${id}`}
              className={activeScreen === index ? 'is-active' : ''}
              aria-label={`第 ${index + 1} 页：${label}`}
              aria-current={activeScreen === index ? 'page' : undefined}
              data-slide-thumb={index}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(index);
              }}
              key={id}
            >
              <span className="thumbnail-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="thumbnail-slide" data-chapter={chapter.key}>
                <i aria-hidden="true" />
                <small>{chapter.shortLabel}</small>
                <strong>{label}</strong>
                <b>{String(index + 1).padStart(2, '0')}</b>
              </span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

function DeckControls({
  activeScreen,
  outlineOpen,
  guideOpen,
  isFullscreen,
  onNavigate,
  onToggleOutline,
  onToggleGuide,
  onToggleFullscreen,
  onOpenHelp,
}: {
  activeScreen: number;
  outlineOpen: boolean;
  guideOpen: boolean;
  isFullscreen: boolean;
  onNavigate: (index: number) => void;
  onToggleOutline: () => void;
  onToggleGuide: () => void;
  onToggleFullscreen: () => void;
  onOpenHelp: () => void;
}) {
  return (
    <div className="deck-controls" aria-label="幻灯片播放控制">
      <button
        className="deck-outline-control"
        type="button"
        aria-pressed={outlineOpen}
        onClick={onToggleOutline}
        title="显示或隐藏缩略图（O）"
      >
        <span aria-hidden="true"><i /><i /><i /></span>
        <b>缩略页</b>
      </button>
      <i className="deck-control-divider" aria-hidden="true" />
      <button
        className="deck-arrow is-previous"
        type="button"
        disabled={activeScreen === 0}
        onClick={() => onNavigate(activeScreen - 1)}
        aria-label="上一页"
      ><Icon name="arrow" /></button>
      <span className="deck-counter" aria-live="polite">
        <b>{String(activeScreen + 1).padStart(2, '0')}</b>
        <i>/</i>
        <span>{String(screens.length).padStart(2, '0')}</span>
      </span>
      <button
        className="deck-arrow"
        type="button"
        disabled={activeScreen === screens.length - 1}
        onClick={() => onNavigate(activeScreen + 1)}
        aria-label="下一页"
      ><Icon name="arrow" /></button>
      <i className="deck-control-divider" aria-hidden="true" />
      <button
        className="deck-guide-control"
        type="button"
        aria-controls="speaker-guide"
        aria-pressed={guideOpen}
        onClick={onToggleGuide}
        title="显示或隐藏演讲导览（G）"
      >
        <Icon name="receipt" />
        <span>讲稿</span>
      </button>
      <button className="deck-help-control" type="button" onClick={onOpenHelp} aria-label="查看快捷键">?</button>
      <button className="deck-present-control" type="button" onClick={onToggleFullscreen}>
        <Icon name={isFullscreen ? 'pause' : 'play'} />
        <span>{isFullscreen ? '退出放映' : '放映'}</span>
      </button>
    </div>
  );
}

function DeckHelp({ onClose }: { onClose: () => void }) {
  return (
    <div className="deck-help-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="deck-help" role="dialog" aria-modal="true" aria-labelledby="deck-help-title" onMouseDown={(event) => event.stopPropagation()}>
        <header><span><small>ACVM DECK</small><strong id="deck-help-title">演示快捷键</strong></span><button type="button" onClick={onClose} aria-label="关闭快捷键说明">×</button></header>
        <dl>
          <div><dt><kbd>→</kbd><kbd>↓</kbd><kbd>Space</kbd></dt><dd>下一页</dd></div>
          <div><dt><kbd>←</kbd><kbd>↑</kbd><kbd>Shift</kbd> + <kbd>Space</kbd></dt><dd>上一页</dd></div>
          <div><dt><kbd>Home</kbd><kbd>End</kbd></dt><dd>封面 / 结论</dd></div>
          <div><dt><kbd>O</kbd></dt><dd>显示或隐藏缩略页</dd></div>
          <div><dt><kbd>G</kbd></dt><dd>显示或隐藏演讲导览</dd></div>
          <div><dt><kbd>F</kbd></dt><dd>进入或退出全屏放映</dd></div>
          <div><dt><kbd>Esc</kbd></dt><dd>关闭面板或退出全屏</dd></div>
        </dl>
      </section>
    </div>
  );
}

export function App() {
  const shellRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement>(null);
  const activeScreenRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const unlockTimerRef = useRef<number | undefined>(undefined);
  const touchStartRef = useRef<{ x: number; y: number; target: EventTarget | null } | null>(null);
  const [activeScreen, setActiveScreen] = useState(initialScreenIndex);
  const [menuOpen, setMenuOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(initialSpeakerGuideState);
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const activeId = screens[activeScreen]?.[0] ?? 'top';
  const activeTitle = screens[activeScreen]?.[1] ?? 'ACVM 产品定位';
  const activeChapter = chapterForScreen(activeId);

  useEffect(() => {
    try {
      window.localStorage.setItem(speakerGuideStorageKey, guideOpen ? 'open' : 'closed');
    } catch {
      // Storage can be unavailable in hardened or private browser contexts.
    }
  }, [guideOpen]);

  useEffect(() => {
    activeScreenRef.current = activeScreen;
    document.querySelectorAll<HTMLElement>('[data-screen]').forEach((screen, index) => {
      screen.classList.toggle('is-current', index === activeScreen);
    });
    document.querySelector<HTMLElement>(`[data-slide-thumb="${activeScreen}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    const nextHash = `#${activeId}`;
    if (window.location.hash !== nextHash) window.history.replaceState(null, '', nextHash);
  }, [activeId, activeScreen]);

  const goToScreen = useCallback((nextIndex: number, behavior: ScrollBehavior = 'smooth') => {
    const bounded = Math.max(0, Math.min(screens.length - 1, nextIndex));
    const target = document.querySelector<HTMLElement>(`[data-screen="${bounded}"]`);
    const scroller = scrollerRef.current;
    if (!target || !scroller) return;

    setActiveScreen(bounded);
    const desktop = window.matchMedia('(min-width: 961px)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (desktop) {
      const centeredTop = target.offsetTop - Math.max(0, (scroller.clientHeight - target.offsetHeight) / 2);
      const resolvedBehavior = Math.abs(bounded - activeScreenRef.current) > 1 ? 'auto' : behavior;
      wheelLockedRef.current = true;
      scroller.scrollTo({ top: centeredTop, behavior: reduceMotion ? 'auto' : resolvedBehavior });
      window.clearTimeout(unlockTimerRef.current);
      unlockTimerRef.current = window.setTimeout(() => { wheelLockedRef.current = false; }, resolvedBehavior === 'smooth' && !reduceMotion ? 620 : 80);
    } else {
      target.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : behavior });
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }
    if (shellRef.current?.requestFullscreen) void shellRef.current.requestFullscreen();
  }, []);

  const toggleOutline = useCallback(() => {
    const nextOpen = !outlineOpen;
    setOutlineOpen(nextOpen);
    if (nextOpen && window.matchMedia('(min-width: 1241px)').matches) setGuideOpen(false);
  }, [outlineOpen]);

  const toggleGuide = useCallback(() => {
    const nextOpen = !guideOpen;
    setGuideOpen(nextOpen);
    if (nextOpen && window.matchMedia('(min-width: 1241px)').matches) setOutlineOpen(false);
  }, [guideOpen]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-screen]'));
    const scroller = scrollerRef.current;
    let frame = 0;

    const updateActiveScreen = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        if (wheelLockedRef.current) return;
        const viewportHeight = window.innerHeight;
        const visible = sections
          .map((section) => {
            const rect = section.getBoundingClientRect();
            const intersection = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
            const score = intersection / Math.min(rect.height, viewportHeight);
            return { section, score };
          })
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)[0];

        if (visible) setActiveScreen(Number(visible.section.dataset.screen));
      });
    };

    updateActiveScreen();
    scroller?.addEventListener('scroll', updateActiveScreen, { passive: true });
    window.addEventListener('scroll', updateActiveScreen, { passive: true });
    window.addEventListener('resize', updateActiveScreen);
    return () => {
      window.cancelAnimationFrame(frame);
      scroller?.removeEventListener('scroll', updateActiveScreen);
      window.removeEventListener('scroll', updateActiveScreen);
      window.removeEventListener('resize', updateActiveScreen);
    };
  }, []);

  useEffect(() => {
    const navigateToHash = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      const screen = target?.matches('[data-screen]') ? target : target?.closest<HTMLElement>('[data-screen]');
      const index = Number(screen?.dataset.screen);
      if (screen && Number.isFinite(index)) window.requestAnimationFrame(() => goToScreen(index, 'auto'));
    };
    navigateToHash();
    window.addEventListener('hashchange', navigateToHash);
    return () => window.removeEventListener('hashchange', navigateToHash);
  }, [goToScreen]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const onWheel = (event: WheelEvent) => {
      if (!window.matchMedia('(min-width: 961px)').matches || event.ctrlKey || Math.abs(event.deltaY) < 12 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

      const localScroller = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-local-scroll]');
      if (localScroller) {
        const canScrollDown = localScroller.scrollTop + localScroller.clientHeight < localScroller.scrollHeight - 1;
        const canScrollUp = localScroller.scrollTop > 1;
        if ((event.deltaY > 0 && canScrollDown) || (event.deltaY < 0 && canScrollUp)) return;
      }

      event.preventDefault();
      if (wheelLockedRef.current) return;
      goToScreen(activeScreenRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => scroller.removeEventListener('wheel', onWheel);
  }, [goToScreen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target instanceof HTMLElement ? event.target : null;
      const isInteractive = target?.matches('input, textarea, select, button, a, [contenteditable="true"]')
        || Boolean(target?.closest('[data-local-scroll]'));

      if (event.key === 'Escape' && helpOpen) {
        event.preventDefault();
        setHelpOpen(false);
        return;
      }
      if (event.key === 'Escape' && guideOpen && !document.fullscreenElement) {
        event.preventDefault();
        setGuideOpen(false);
        return;
      }
      if (isInteractive || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'PageDown' || (event.key === ' ' && !event.shiftKey)) {
        event.preventDefault();
        if (!wheelLockedRef.current) goToScreen(activeScreenRef.current + 1);
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey)) {
        event.preventDefault();
        if (!wheelLockedRef.current) goToScreen(activeScreenRef.current - 1);
      } else if (event.key === 'Home') {
        event.preventDefault();
        goToScreen(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goToScreen(screens.length - 1);
      } else if (event.key.toLowerCase() === 'o') {
        event.preventDefault();
        toggleOutline();
      } else if (event.key.toLowerCase() === 'g') {
        event.preventDefault();
        toggleGuide();
      } else if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFullscreen();
      } else if (event.key === '?') {
        event.preventDefault();
        setHelpOpen(true);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [goToScreen, guideOpen, helpOpen, toggleFullscreen, toggleGuide, toggleOutline]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  useEffect(() => () => window.clearTimeout(unlockTimerRef.current), []);

  const handleTouchStart = (event: TouchEvent<HTMLElement>) => {
    const touch = event.changedTouches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, target: event.target };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    if (!start || !touch || (start.target as HTMLElement | null)?.closest('[data-local-scroll]')) return;
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 64 || Math.abs(deltaX) < Math.abs(deltaY) * 1.15) return;
    goToScreen(activeScreenRef.current + (deltaX < 0 ? 1 : -1));
  };

  return (
    <div className={`site-shell ${outlineOpen ? 'is-outline-open' : ''} ${guideOpen ? 'is-speaker-guide-open' : ''}`} ref={shellRef}>
      <a className="skip-link" href="#top">跳到主要内容</a>
      <header className="site-header">
        <div className="deck-brand-group">
          <button
            className="header-outline-toggle"
            type="button"
            aria-label={outlineOpen ? '隐藏幻灯片缩略图' : '显示幻灯片缩略图'}
            aria-pressed={outlineOpen}
            onClick={toggleOutline}
          ><span aria-hidden="true"><i /><i /><i /></span></button>
          <a className="brand" href="#top" aria-label="ACVM 产品演示封面" onClick={(event) => { event.preventDefault(); goToScreen(0); }}>
            <LogoMark />
            <span><strong>ACVM</strong><small>AGENTIC CONTRACT VM</small></span>
          </a>
        </div>
        <nav className={menuOpen ? 'is-open' : ''} aria-label="产品演示分组">
          {navigation.map((item) => {
            const active = item.screens.some((screen) => screen === activeId);
            return (
              <a
                href={`#${item.id}`}
                key={item.id}
                className={active ? 'is-active' : ''}
                aria-current={active ? 'page' : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  goToScreen(screens.findIndex(([id]) => id === item.id));
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <span className="deck-location"><small>{activeChapter.shortLabel}</small><strong>{activeTitle}</strong></span>
        <div className="header-actions">
          <a className="header-github" href={githubUrl} target="_blank" rel="noreferrer" aria-label="在 GitHub 查看 ACVM 仓库">
            <Icon name="github" /><span>GitHub</span>
          </a>
          <button className="header-present-button" type="button" onClick={toggleFullscreen}><Icon name="play" /><span>放映</span></button>
          <button
            className={`menu-toggle ${menuOpen ? 'is-open' : ''}`}
            type="button"
              aria-label={menuOpen ? '关闭分组菜单' : '打开分组菜单'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          ><span /><span /></button>
        </div>
        <span
          className="reading-progress"
          style={{ '--reading-progress': `${(activeScreen / (screens.length - 1)) * 100}%` } as CSSProperties}
          aria-hidden="true"
        />
      </header>

      <ChapterRail activeScreen={activeScreen} onNavigate={goToScreen} onClose={() => setOutlineOpen(false)} />

      <main className="page-scroller" ref={scrollerRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <section className="screen hero-screen hero-cover-screen is-current" id="top" data-screen="0" data-chapter="cover">
          <BlockchainBackdrop />
          <div className="screen-inner hero-cover-layout">
            <div className="hero-cover-lockup">
              <span className="hero-cover-product">
                <LogoMark />
                <span><strong>ACVM</strong><small>AGENTIC CONTRACT VIRTUAL MACHINE</small></span>
              </span>
              <h1>让有效推理成为链上价值</h1>
              <p className="hero-cover-scope">推理可证明 <i /> 结果可验收 <i /> 收益可分配</p>
            </div>
          </div>
        </section>

        <ProductValueDeck />
        <ProductCoreDeck />
        <ProductTrustDeck />
        <ProductEconomicsDeck />
        <ProductDeliveryDeck />
      </main>

      {guideOpen ? <SpeakerGuide activeScreen={activeScreen} onClose={() => setGuideOpen(false)} /> : null}

      <DeckControls
        activeScreen={activeScreen}
        outlineOpen={outlineOpen}
        guideOpen={guideOpen}
        isFullscreen={isFullscreen}
        onNavigate={goToScreen}
        onToggleOutline={toggleOutline}
        onToggleGuide={toggleGuide}
        onToggleFullscreen={toggleFullscreen}
        onOpenHelp={() => setHelpOpen(true)}
      />
      {helpOpen ? <DeckHelp onClose={() => setHelpOpen(false)} /> : null}
    </div>
  );
}
