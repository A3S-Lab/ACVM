import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const workflowStages = [
  {
    code: '01',
    title: '签约与托管',
    detail: '锁定任务、结果池和验证费',
    icon: 'key',
  },
  {
    code: '02',
    title: '隔离执行',
    detail: 'Worker 在 a3s-box 中运行',
    icon: 'brain',
  },
  {
    code: '03',
    title: '独立验收',
    detail: 'Validator 核对执行和业务证据',
    icon: 'eye',
  },
  {
    code: '04',
    title: '挑战与终局',
    detail: '挑战期结束后形成最终结果',
    icon: 'shield',
  },
] as const satisfies readonly {
  code: string;
  title: string;
  detail: string;
  icon: IconName;
}[];

const settlementOutcomes = [
  {
    state: 'Accepted',
    title: '结果通过',
    money: '结果费按 splitRoot 分账',
    tone: 'accepted',
    icon: 'check',
  },
  {
    state: 'Rejected',
    title: '正常未达标',
    money: '结果费退回需求方',
    tone: 'rejected',
    icon: 'receipt',
  },
  {
    state: 'Fraud',
    title: '证据造假',
    money: '保证金补偿挑战者与安全储备',
    tone: 'fraud',
    icon: 'shield',
  },
] as const satisfies readonly {
  state: string;
  title: string;
  money: string;
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
            </article>
            {index < workflowStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>

      <div className="order-settlement-outcomes" aria-label="通过、未达标和造假三种终局资金结果">
        {settlementOutcomes.map((outcome) => (
          <section className={`is-${outcome.tone}`} key={outcome.state}>
            <header><Icon name={outcome.icon} /><strong>{outcome.title}</strong></header>
            <p>{outcome.money}</p>
          </section>
        ))}
      </div>

      <footer className="order-task-id">
        <strong>验证者按约获得费用；只有 FraudProof 才会罚没保证金</strong>
      </footer>
    </LearningPanel>
  );
}
