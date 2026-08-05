import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const workflowStages = [
  {
    code: '01',
    title: '签约与托管',
    detail: '需求方签名任务，锁定结果池与验证费',
    record: 'SignedDemand + Escrow',
    icon: 'key',
  },
  {
    code: '02',
    title: '隔离执行',
    detail: 'Worker 在 a3s-box 中运行并提交回执',
    record: 'ExecReceipt',
    icon: 'brain',
  },
  {
    code: '03',
    title: '独立验收',
    detail: 'Validator 分别检查执行证明与业务证据',
    record: 'AcceptedResult',
    icon: 'eye',
  },
  {
    code: '04',
    title: '挑战与终局',
    detail: '挑战窗口结束，检查 quorum 与 taskKey',
    record: 'FinalVerdict',
    icon: 'shield',
  },
] as const satisfies readonly {
  code: string;
  title: string;
  detail: string;
  record: string;
  icon: IconName;
}[];

const settlementOutcomes = [
  {
    state: 'Accepted',
    title: '结果通过',
    money: 'ResultPool → splitRoot 分账',
    proof: 'ValidPoI = 1',
    tone: 'accepted',
    icon: 'check',
  },
  {
    state: 'Rejected',
    title: '正常未达标',
    money: 'ResultPool → 退回需求方',
    proof: 'ValidPoI = 0',
    tone: 'rejected',
    icon: 'receipt',
  },
  {
    state: 'Fraud',
    title: '证据造假',
    money: 'Bond → 挑战者 + 安全储备',
    proof: 'Slash > 0',
    tone: 'fraud',
    icon: 'shield',
  },
] as const satisfies readonly {
  state: string;
  title: string;
  money: string;
  proof: string;
  tone: 'accepted' | 'rejected' | 'fraud';
  icon: IconName;
}[];

export function AcvmServiceWorkflowArchitecture() {
  return (
    <LearningPanel code="一笔订单 / 同一 taskId" status="验收、结算与风控一次终局" className="order-flow-simple order-settlement-panel principle-panel">
      <div className="order-flow" aria-label="订单依次完成签约托管、隔离执行、独立验收和挑战终局">
        {workflowStages.map((stage, index) => (
          <span className="order-flow-fragment" key={stage.code}>
            <article>
              <header><b>{stage.code}</b><Icon name={stage.icon} /></header>
              <strong>{stage.title}</strong>
              <small>{stage.detail}</small>
              <code>{stage.record}</code>
            </article>
            {index < workflowStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <div className="order-settlement-outcomes" aria-label="通过、未达标和造假三种终局资金结果">
        {settlementOutcomes.map((outcome) => (
          <section className={`is-${outcome.tone}`} key={outcome.state}>
            <header><Icon name={outcome.icon} /><span><small>{outcome.state}</small><strong>{outcome.title}</strong></span></header>
            <p>{outcome.money}</p>
            <code>{outcome.proof}</code>
          </section>
        ))}
      </div>

      <footer className="order-task-id">
        <code>VerificationPool → Evidence / Validator / Protocol</code>
        <strong>验证成本按约支付；罚没只由 FraudProof 触发</strong>
      </footer>
    </LearningPanel>
  );
}
