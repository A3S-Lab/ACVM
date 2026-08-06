import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { WorkflowFormula } from './WorkflowHint';
import { DetailHint } from './DetailHint';

export type ProgressiveStage = {
  index: string;
  title: string;
  detail: string;
  formula: string;
  input: string;
  output: string;
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
              <span className="progressive-flow-fragment" key={item.index}>
                <button
                  type="button"
                  className={`${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-complete' : ''}`}
                  aria-current={index === activeStep ? 'step' : undefined}
                  onClick={() => selectStep(index)}
                >
                  <span aria-hidden="true">[</span><b>{item.index}</b><strong>{item.title}</strong><span aria-hidden="true">]</span>
                </button>
                {index < stages.length - 1 ? <i className={index < activeStep ? 'is-complete' : ''} aria-hidden="true">──▶</i> : null}
              </span>
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

        <article className={`progressive-stage-card ascii-algorithm-stage ascii-workflow-canvas ${stage.tone ? `is-${stage.tone}` : ''}`} key={stage.index}>
          <header>
            <code>┌─ 算法步骤 / {stage.index} {stage.title}</code>
            <span><small>执行方</small><strong>{stage.actor ?? 'ACVM 节点'}</strong></span>
            <Icon name={stage.icon} />
          </header>
          <div className="ascii-algorithm-body">
            <div className="is-input">
              <b>│ 输入</b><i aria-hidden="true">────◆────▶</i>
              <strong className="ascii-workflow-node">
                <DetailHint
                  className="workflow-node-hint"
                  category="输入说明"
                  label={stage.input}
                  title={`${stage.title} · 输入`}
                  summary="这些值必须先通过来源、签名或状态检查，才进入本步计算。"
                  details={[{ label: '执行方', value: stage.actor ?? 'ACVM 节点' }, { label: '计算目标', value: stage.detail }]}
                />
              </strong>
            </div>
            <div className="is-formula"><b>│ 计算</b><i aria-hidden="true">────◆────▶</i><WorkflowFormula formula={stage.formula} title={`${stage.title}公式`} summary={stage.detail} details={[{ label: '执行方', value: stage.actor ?? 'ACVM 节点' }, { label: '输入', value: stage.input }, { label: '输出', value: stage.output }]} /></div>
            <div className="is-output">
              <b>│ 输出</b><i aria-hidden="true">────◆────▶</i>
              <strong className="ascii-workflow-node">
                <DetailHint
                  className="workflow-node-hint"
                  category="输出说明"
                  label={stage.output}
                  title={`${stage.title} · 输出`}
                  summary="这是本步通过公式和规则得到的可验证输出，将作为下一步输入或终局判断依据。"
                  details={[{ label: '计算公式', value: stage.formula }, { label: '执行方', value: stage.actor ?? 'ACVM 节点' }]}
                />
              </strong>
            </div>
          </div>
          <footer><code>└─ {stage.input} → {stage.output}</code></footer>
        </article>

        {footer}
      </LearningPanel>
    </div>
  );
}
