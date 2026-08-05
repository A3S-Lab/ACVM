import { Icon, type IconName } from './Icons';
import { LearningPanel } from './LearningPanel';

const workflowStages = [
  {
    code: '01',
    title: '规则',
    actor: '需求方',
    record: 'SignedDemand',
    icon: 'key',
  },
  {
    code: '02',
    title: '执行',
    actor: 'Worker',
    record: 'ExecReceipt',
    icon: 'brain',
  },
  {
    code: '03',
    title: '证据',
    actor: 'Worker / 观察方',
    record: 'EvidenceRoot',
    icon: 'eye',
  },
  {
    code: '04',
    title: '裁决',
    actor: 'Validator',
    record: 'AcceptedResult',
    icon: 'shield',
  },
  {
    code: '05',
    title: '结算',
    actor: '支付 / 链',
    record: 'PaymentReceipt',
    icon: 'receipt',
  },
] as const satisfies readonly {
  code: string;
  title: string;
  actor: string;
  record: string;
  icon: IconName;
}[];

export function AcvmServiceWorkflowArchitecture() {
  return (
    <LearningPanel code="ONE ORDER / ONE TASK ID" status="FIVE SIGNED EVENTS" className="order-flow-simple">
      <div className="order-flow" aria-label="规则、执行、证据、裁决、结算五步闭环">
        {workflowStages.map((stage, index) => (
          <span className="order-flow-fragment" key={stage.code}>
            <article>
              <header><b>{stage.code}</b><Icon name={stage.icon} /></header>
              <strong>{stage.title}</strong>
              <small>{stage.actor}</small>
              <code>{stage.record}</code>
            </article>
            {index < workflowStages.length - 1 ? <i aria-hidden="true">→</i> : null}
          </span>
        ))}
      </div>
      <footer className="order-task-id">
        <span>taskId</span><strong>同一订单、同一证据链、一次结算</strong>
      </footer>
    </LearningPanel>
  );
}
