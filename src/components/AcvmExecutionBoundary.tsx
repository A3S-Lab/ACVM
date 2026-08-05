import { Icon } from './Icons';
import { LearningPanel } from './LearningPanel';

const trustStages = [
  ['01', '规则冻结', 'Contract Root', '目标 · 权限 · 验收 · 分账', 'lock'],
  ['02', '执行证明', 'Exec Receipt', '代码 · 模型 · 环境 · nonce', 'terminal'],
  ['03', '结果证明', 'Outcome Evidence', '业务观测 · 复测 · 签章', 'eye'],
  ['04', '确定性验收', 'Accepted Result', '验签 · 法定人数 · 防重放', 'shield'],
] as const;

export function AcvmExecutionBoundaryArchitecture() {
  return (
    <LearningPanel code="AGENTIC CONTRACT / TRUST CHAIN" status="EXECUTION PROOF ≠ OUTCOME PROOF" className="agentic-trust-panel">
      <div className="agentic-trust-flow" aria-label="链下 Agentic Contract 从规则冻结、执行证明、结果证明到确定性验收的证据链">
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
        <span><Icon name="terminal" /><strong>执行证明</strong><small>确认按约运行</small></span>
        <i>≠</i>
        <span><Icon name="eye" /><strong>结果证明</strong><small>确认业务目标达标</small></span>
        <i>→</i>
        <b>AcceptedResult</b>
      </footer>
    </LearningPanel>
  );
}
