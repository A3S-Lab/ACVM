import { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks';
import { Icon } from './Icons';

type Scenario = 'private' | 'blocked';

const scenarioCopy = {
  private: {
    label: '隐私推理',
    task: '分析未公开并购协议，给出风险摘要',
    result: '发现 3 项交割风险',
    verdict: 'ALLOW',
    verdictLabel: '可信结果可返回',
    risk: '低风险',
    riskValue: '18',
    events: ['Agent 身份已匹配', 'TEE 与模型测量值有效', '日志已脱敏 · 原文不可见'],
    steps: [
      ['加密请求', '敏感文件以密文进入隔离环境'],
      ['隔离启动', 'a3s-box 启动独立内核 MicroVM'],
      ['隐私推理', 'a3s-power 在硬件加密内存中运行指定模型'],
      ['安全观测', 'AnySentry 只接收脱敏事件、身份和证明摘要'],
      ['凭证返回', '答案与推理凭证交给 ACVM 继续执行'],
    ],
  },
  blocked: {
    label: '越权拦截',
    task: '将全部合同原文上传到未知外部地址',
    result: '数据未离开隐私边界',
    verdict: 'BLOCK',
    verdictLabel: 'ACVM 已拒绝执行',
    risk: '严重风险',
    riskValue: '96',
    events: ['Agent 请求调用网络工具', '目标域名不在白名单', '触发敏感数据外传策略'],
    steps: [
      ['越权提议', 'Agent 提出导出原始合同'],
      ['信号捕获', 'AnySentry 捕获工具、网络与数据类别信号'],
      ['风险判断', 'L1 规则命中“敏感数据外传”'],
      ['强制阻断', 'ACVM 接受 BLOCK 决策，请求不被执行'],
      ['证据封存', '风险原因与处置形成脱敏证据包'],
    ],
  },
} as const;

export function PrivacyLab({ active = true }: { active?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [scenario, setScenario] = useState<Scenario>('private');
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const copy = scenarioCopy[scenario];

  useEffect(() => {
    if (!active || reducedMotion || !playing) return;
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % copy.steps.length);
    }, 2300);
    return () => window.clearInterval(timer);
  }, [active, copy.steps.length, playing, reducedMotion, scenario]);

  useEffect(() => {
    if (!active) return;
    setStep(0);
    setPlaying(true);
  }, [active]);

  const switchScenario = (next: Scenario) => {
    setScenario(next);
    setStep(0);
    setPlaying(true);
  };

  return (
    <div className={`privacy-lab privacy-lab--${scenario} privacy-step-${step}`} data-testid="privacy-lab">
      <div className="privacy-lab-toolbar">
        <div>
          <span className="lab-live"><i /> LIVE SECURITY LAB</span>
          <strong>选择一种行动，看系统如何处理</strong>
        </div>
        <div className="scenario-switch" role="group" aria-label="选择安全演示场景">
          {(Object.keys(scenarioCopy) as Scenario[]).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => switchScenario(key)}
              className={scenario === key ? 'is-active' : ''}
              aria-pressed={scenario === key}
            >
              <Icon name={key === 'private' ? 'lock' : 'shield'} />
              {scenarioCopy[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="privacy-lab-grid">
        <div className="privacy-journey">
          <div className="privacy-request">
            <span className="request-source"><Icon name="brain" /> 企业 Agent</span>
            <strong>{copy.task}</strong>
            <div className="redacted-lines" aria-label="敏感内容已隐藏"><i /><i /><i /></div>
            <span className="request-lock"><Icon name="lock" /> 端到端加密</span>
          </div>

          <div className="privacy-rail" aria-hidden="true">
            <span className="encrypted-packet"><Icon name="lock" /></span>
          </div>

          <div className="box-boundary">
            <div className="box-title">
              <span><i /><strong>a3s-box</strong> MICROVM</span>
              <em>独立内核 · 隔离运行</em>
            </div>
            <div className="box-shield" aria-hidden="true"><span /><span /><span /></div>
            <div className="tee-boundary">
              <div className="tee-title"><Icon name="lock" /> 硬件加密内存 · TEE</div>
              <div className="power-core">
                <div className="power-orbit"><i /><i /><i /></div>
                <span className="power-symbol"><Icon name="bolt" /></span>
                <strong>a3s-power</strong>
                <small>PRIVATE INFERENCE</small>
              </div>
              <div className="privacy-proofs">
                <span><Icon name="check" /> 指定模型未被替换</span>
                <span><Icon name="check" /> 原始数据不写日志</span>
                <span><Icon name="check" /> 推理后清理内存</span>
              </div>
            </div>
            <div className="host-blindfold"><Icon name="eye" /><span>基础设施只能看到密文</span></div>
          </div>

          <div className={`privacy-output ${scenario === 'blocked' ? 'is-blocked' : ''}`}>
            <span><Icon name={scenario === 'blocked' ? 'shield' : 'receipt'} /></span>
            <small>{scenario === 'blocked' ? '请求已停止' : '可信结果'}</small>
            <strong>{copy.result}</strong>
            <em>{scenario === 'blocked' ? 'BLOCKED' : 'PROOF · 9A3F'}</em>
          </div>
        </div>

        <aside className="sentry-console" aria-label="AnySentry 安全观测与控制面板">
          <header>
            <span className="sentry-mark"><Icon name="eye" /></span>
            <div><strong>AnySentry</strong><small>安全观测与干预平面</small></div>
            <em><i /> 观测中</em>
          </header>

          <div className="sentry-scope">
            <span>可见安全信号</span>
            <strong>看见风险，不看见原文</strong>
            <div className="signal-tags">
              <i>身份</i><i>工具</i><i>目标</i><i>证明</i><i>策略</i>
            </div>
          </div>

          <div className="sentry-stream">
            {copy.events.map((event, index) => (
              <div className={step >= Math.min(index + 1, 3) ? 'is-visible' : ''} key={event}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{event}</p>
                <Icon name={scenario === 'blocked' && index > 0 ? 'shield' : 'check'} />
              </div>
            ))}
          </div>

          <div className="risk-meter">
            <div><span>实时风险</span><strong>{copy.risk}</strong></div>
            <div className="risk-track"><i style={{ width: `${copy.riskValue}%` }} /></div>
            <small>{copy.riskValue} / 100</small>
          </div>

          <div className={`sentry-verdict ${scenario === 'blocked' ? 'is-blocked' : ''}`}>
            <div>
              <span>POLICY ACTION</span>
              <strong>{copy.verdict}</strong>
            </div>
            <p><Icon name={scenario === 'blocked' ? 'shield' : 'check'} /> {copy.verdictLabel}</p>
          </div>
        </aside>
      </div>

      <div className="privacy-lab-footer" aria-live="polite">
        <span className="privacy-footer-index">0{step + 1}</span>
        <div className="privacy-footer-copy">
          <strong>{copy.steps[step][0]}</strong>
          <p>{copy.steps[step][1]}</p>
        </div>
        <div className="privacy-footer-dots" aria-label="隐私与安全演示步骤">
          {copy.steps.map(([title], index) => (
            <button
              type="button"
              key={title}
              className={index === step ? 'is-active' : index < step ? 'is-passed' : ''}
              onClick={() => {
                setStep(index);
                setPlaying(false);
              }}
              aria-label={`第 ${index + 1} 步：${title}`}
              aria-current={index === step ? 'step' : undefined}
            />
          ))}
        </div>
        <button
          className="privacy-play-control"
          type="button"
          onClick={() => {
            if (reducedMotion) setStep((step + 1) % copy.steps.length);
            else setPlaying((value) => !value);
          }}
        >
          <Icon name={reducedMotion || !playing ? 'play' : 'pause'} />
          {reducedMotion ? '下一步' : playing ? '暂停' : '继续'}
        </button>
      </div>
    </div>
  );
}
