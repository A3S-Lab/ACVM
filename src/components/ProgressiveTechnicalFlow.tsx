import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';

export type ProgressiveStage = {
  index: string;
  title: string;
  detail: string;
  formula: string;
  icon: IconName;
  actor?: string;
  tone?: string;
};

export function ProgressiveTechnicalFlow({
  code,
  status,
  className,
  stages,
  ariaLabel,
  footer,
  interval = 3200,
}: {
  code: string;
  status: string;
  className: string;
  stages: readonly ProgressiveStage[];
  ariaLabel: string;
  footer: ReactNode;
  interval?: number;
}) {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(stages.length, interval);
  const stage = stages[activeStep];

  return (
    <div className="progressive-flow-shell" ref={rootRef}>
      <LearningPanel code={code} status={status} className={`progressive-technical-flow ${className}`}>
        <div className="progressive-flow-controls">
          <nav className="progressive-flow-nav" aria-label={ariaLabel}>
            {stages.map((item, index) => (
              <button
                type="button"
                className={index === activeStep ? 'is-active' : ''}
                aria-current={index === activeStep ? 'step' : undefined}
                onClick={() => selectStep(index)}
                key={item.index}
              >
                <b>{item.index}</b>
                <Icon name={item.icon} />
                <strong>{item.title}</strong>
              </button>
            ))}
          </nav>
          <button
            className="progressive-flow-play"
            type="button"
            aria-label={isPlaying ? '暂停分步动画' : '继续播放分步动画'}
            onClick={togglePlayback}
          >
            <Icon name={isPlaying ? 'pause' : 'play'} />
            <span>{isPlaying ? '暂停' : '播放'}</span>
          </button>
        </div>

        <article className={`progressive-stage-card ${stage.tone ? `is-${stage.tone}` : ''}`} key={stage.index}>
          <header>
            <span><small>{stage.actor ?? `步骤 ${stage.index}`}</small><strong>{stage.title}</strong></span>
            <Icon name={stage.icon} />
          </header>
          <p>{stage.detail}</p>
          <code>{stage.formula}</code>
        </article>

        {footer}
      </LearningPanel>
    </div>
  );
}
