import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';
import { useStepPlayback } from './useStepPlayback';
import { DetailHint } from './DetailHint';

export type BusinessProcessStage = {
  index: string;
  label: string;
  actor: string;
  action: string;
  detail: string;
  input: string;
  output: string;
  state: string;
  icon: IconName;
  tone?: 'violet' | 'green' | 'amber' | 'red';
};

export function AsciiFlowControls({
  stages,
  activeStep,
  isPlaying,
  onSelect,
  onToggle,
  ariaLabel,
  className = '',
}: {
  stages: readonly { index: string; label: string }[];
  activeStep: number;
  isPlaying: boolean;
  onSelect: (index: number) => void;
  onToggle: () => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div className={`business-process-controls ascii-flow-controls ${className}`}>
      <nav className="business-process-nav" aria-label={ariaLabel}>
        {stages.map((item, index) => (
          <span className="business-process-fragment" key={item.index}>
            <button
              type="button"
              className={`${index === activeStep ? 'is-active' : ''} ${index < activeStep ? 'is-complete' : ''}`}
              aria-current={index === activeStep ? 'step' : undefined}
              onClick={() => onSelect(index)}
            >
              <span aria-hidden="true">[</span>
              <b>{item.index}</b>
              <strong>{item.label}</strong>
              <span aria-hidden="true">]</span>
            </button>
            {index < stages.length - 1 ? <i className={index < activeStep ? 'is-complete' : ''} aria-hidden="true">──▶</i> : null}
          </span>
        ))}
      </nav>
      <button
        className="business-process-play"
        type="button"
        aria-label={isPlaying ? '暂停业务流程动画' : '继续播放业务流程动画'}
        onClick={onToggle}
      >
        <Icon name={isPlaying ? 'pause' : 'play'} />
        <span>{isPlaying ? '暂停' : '播放'}</span>
      </button>
    </div>
  );
}

export function BusinessProcessFlow({
  code,
  status,
  className,
  stages,
  ariaLabel,
  footer,
  interval = 3000,
}: {
  code: string;
  status: string;
  className: string;
  stages: readonly BusinessProcessStage[];
  ariaLabel: string;
  footer?: ReactNode;
  interval?: number;
}) {
  const { rootRef, activeStep, isPlaying, selectStep, togglePlayback } = useStepPlayback(stages.length, interval);
  const stage = stages[activeStep];

  return (
    <div className="business-process-shell" ref={rootRef}>
      <LearningPanel code={code} status={status} className={`business-process-panel ${className}`}>
        <AsciiFlowControls
          stages={stages}
          activeStep={activeStep}
          isPlaying={isPlaying}
          onSelect={selectStep}
          onToggle={togglePlayback}
          ariaLabel={ariaLabel}
        />

        <div className={`business-process-stage ascii-process-stage ascii-workflow-canvas is-${stage.tone ?? 'violet'}`} aria-label={`${stage.action}。${stage.detail}`} key={stage.index}>
          <header>
            <code>┌─ 当前步骤 / {stage.index} {stage.label}</code>
            <Icon name={stage.icon} />
          </header>
          <div className="ascii-process-body">
            <div className="is-input">
              <b>│ 输入</b><i aria-hidden="true">────◆────▶</i>
              <strong className="ascii-workflow-node">
                <DetailHint
                  className="workflow-node-hint"
                  category="输入说明"
                  label={stage.input}
                  title={`${stage.label} · 输入`}
                  summary={`这是“${stage.label}”开始前必须具备并可核验的输入。`}
                  details={[{ label: '执行方', value: stage.actor }, { label: '本步动作', value: stage.action }]}
                />
              </strong>
            </div>
            <div className="is-down" aria-hidden="true"><b>│</b><i>│</i><span>▼</span></div>
            <div className="is-action">
              <b>│ 执行</b><i aria-hidden="true">────◆────▶</i>
              <span className="ascii-workflow-node"><code>[{stage.actor}]</code><DetailHint className="workflow-action-hint" category="步骤说明" label={<strong>{stage.action}</strong>} title={`${stage.label} · ${stage.actor}`} summary={stage.detail} details={[{ label: '输入', value: stage.input }, { label: '输出', value: stage.output }, { label: '状态', value: stage.state }]} /></span>
            </div>
            <div className="is-down is-second" aria-hidden="true"><b>│</b><i>│</i><span>▼</span></div>
            <div className="is-output">
              <b>│ 输出</b><i aria-hidden="true">────◆────▶</i>
              <strong className="ascii-workflow-node">
                <DetailHint
                  className="workflow-node-hint"
                  category="输出说明"
                  label={stage.output}
                  title={`${stage.label} · 输出`}
                  summary="该输出会写入本任务的回执或状态，供下一步验证和结算使用。"
                  details={[{ label: '状态变化', value: stage.state }, { label: '来源', value: `${stage.actor} · ${stage.action}` }]}
                />
              </strong>
            </div>
          </div>
          <footer><code>└─ 状态 / {stage.state}</code></footer>
        </div>

        <footer className="business-process-footer">
          <span><small>正在流转</small><code>{stage.input} → {stage.output}</code></span>
          {footer}
        </footer>
      </LearningPanel>
    </div>
  );
}
