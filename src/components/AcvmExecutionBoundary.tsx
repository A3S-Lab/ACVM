import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';

const trustStages = [
  ['01', '规则冻结', 'Contract Root', '目标 · 权限 · 验收 · 分账', 'lock'],
  ['02', '可信执行', 'Exec Receipt', '镜像 · 模型 · 环境 · nonce', 'terminal'],
  ['03', '独立验收', 'Accepted Result', '技术证明 · 业务证据 · 法定人数', 'eye'],
  ['04', '链上终局', 'ValidPoI', '验签 · 状态机 · 防重放', 'shield'],
] as const;

export function AcvmExecutionBoundaryArchitecture() {
  return (
    <LearningPanel code="AGENTIC CONTRACT / TRUST CHAIN" status="EXECUTION PROOF + OUTCOME PROOF" className="agentic-trust-panel">
      <div className="agentic-trust-flow" aria-label="链下 Agentic Contract 从规则冻结、可信执行、独立验收到链上终局的证据链">
        {trustStages.map(([index, title, output, detail, icon], stageIndex) => (
          <span className={`agentic-trust-fragment is-stage-${stageIndex + 1}`} key={index}>
            <section>
              <header><b>{index}</b><Icon name={icon} /></header>
              <strong>{title}</strong>
              <small>{detail}</small>
              <code>{output}</code>
            </section>
            {stageIndex < trustStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <footer className="agentic-trust-rule">
        <span><Icon name="terminal" /><strong>执行可信</strong><small>a3s-box / TEE 回执</small></span>
        <i>∧</i>
        <span><Icon name="eye" /><strong>结果有效</strong><small>独立证据 / Validator</small></span>
        <i>→</i>
        <b>ValidPoI · 结算</b>
      </footer>
    </LearningPanel>
  );
}
