import { chapterForScreen, screens, type ScreenId } from '../course';
import { speakerGuides } from '../speakerGuide';
import { Icon } from './Icons';

export function SpeakerGuide({
  activeScreen,
  onClose,
}: {
  activeScreen: number;
  onClose: () => void;
}) {
  const [screenId, title] = screens[activeScreen];
  const guide = speakerGuides[screenId as ScreenId];
  const chapter = chapterForScreen(screenId);
  const isChapterOpening = chapter.id === screenId;

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
          <small>这一页只讲清</small>
          <h2>{title}</h2>
          <p>{guide.focus}</p>
        </section>

        {isChapterOpening ? (
          <section className="speaker-guide__chapter-question">
            <small>章节问题</small>
            <p>{chapter.question}</p>
          </section>
        ) : null}

        <section className="speaker-guide__connection">
          <small>放回主线</small>
          <p>{guide.connection}</p>
        </section>

        <section className="speaker-guide__opening">
          <small>开场句</small>
          <blockquote>{guide.opening}</blockquote>
        </section>

        <section className="speaker-guide__beats">
          <small>口述展开</small>
          <ol>
            {guide.beats.map((beat, index) => (
              <li key={beat}><span>{index + 1}</span><p>{beat}</p></li>
            ))}
          </ol>
        </section>
      </div>

      <footer className="speaker-guide__transition">
        <span><Icon name="arrow" /></span>
        <p><small>自然转场</small>{guide.transition}</p>
      </footer>
    </aside>
  );
}
