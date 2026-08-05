import { chapterForScreen, screens, type ScreenId } from '../deck';
import { speakerGuides } from '../speakerGuide';
import { speakerGuideDetails } from '../speakerGuideDetails';
import { Icon } from './Icons';

export function SpeakerGuide({
  activeScreen,
  onClose,
}: {
  activeScreen: number;
  onClose: () => void;
}) {
  const [screenId] = screens[activeScreen];
  const guide = speakerGuides[screenId as ScreenId];
  const details = speakerGuideDetails[screenId as ScreenId];
  const chapter = chapterForScreen(screenId);

  return (
    <aside className="speaker-guide" id="speaker-guide" aria-labelledby="speaker-guide-title">
      <header className="speaker-guide__header">
        <span className="speaker-guide__identity">
          <i><Icon name="receipt" /></i>
          <span><small>SPEAKER GUIDE</small><strong id="speaker-guide-title">演讲导览</strong></span>
        </span>
        <button type="button" onClick={onClose} aria-label="关闭演讲导览">×</button>
      </header>

      <div className="speaker-guide__meta">
        <span><b>{String(activeScreen + 1).padStart(2, '0')}</b> / {String(screens.length).padStart(2, '0')}</span>
        <span>{chapter.shortLabel}</span>
        <span>约 {guide.duration}</span>
      </div>

      <div className="speaker-guide__body" key={screenId} data-local-scroll>
        <section className="speaker-guide__focus">
          <small>核心结论</small>
          <p>{guide.focus}</p>
        </section>

        <section className="speaker-guide__opening">
          <small>实际例子</small>
          <p className="speaker-guide__example">{guide.example}</p>
        </section>

        <section className="speaker-guide__beats">
          <small>讲述要点</small>
          <ol>
            {guide.beats.map((beat, index) => (
              <li key={beat}><span>{index + 1}</span><p>{beat}</p></li>
            ))}
          </ol>
        </section>

        <section className="speaker-guide__deep-dive">
          <small>按需展开</small>

          <details>
            <summary><span>技术实现</span><b>{details.implementation.length}</b></summary>
            <div className="speaker-guide__cards">
              {details.implementation.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p><em>怎么做</em>{item.mechanism}</p>
                  <p><em>怎么验</em>{item.acceptance}</p>
                </article>
              ))}
            </div>
          </details>

          <details>
            <summary><span>工程难点与解法</span><b>{details.challenges.length}</b></summary>
            <div className="speaker-guide__cards">
              {details.challenges.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p><em>难在哪</em>{item.failure}</p>
                  <p><em>解决</em>{item.solution}</p>
                  <p className="speaker-guide__residual"><em>仍需承认</em>{item.residual}</p>
                </article>
              ))}
            </div>
          </details>

          <details>
            <summary><span>链上安全与处置</span><b>{details.security.length}</b></summary>
            <div className="speaker-guide__cards">
              {details.security.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p><em>怎么失效</em>{item.failure}</p>
                  <p><em>解决</em>{item.solution}</p>
                  <p className="speaker-guide__residual"><em>剩余风险</em>{item.residual}</p>
                </article>
              ))}
            </div>
          </details>
          <details>
            <summary><span>资料依据</span><b>{details.sources.length}</b></summary>
            <div className="speaker-guide__source-list">
              {details.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer">
                  {source.label}<span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </details>
        </section>
      </div>

    </aside>
  );
}
