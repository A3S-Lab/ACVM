import { Icon, type IconName } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const scenarios = [
  {
    icon: 'receipt',
    name: '自主采购',
    request: '预算内采购一批合规设备',
    accepted: '报价、合同与到货条件通过验收',
    tone: 'amber',
  },
  {
    icon: 'lock',
    name: '私密研究',
    request: '在不公开原始数据的前提下生成报告',
    accepted: '数据根、模型版本与复核结果一致',
    tone: 'violet',
  },
  {
    icon: 'chain',
    name: '长任务协作',
    request: '多个 Agent 连续完成监测与处置',
    accepted: '里程碑回执连续，最终指标达标',
    tone: 'green',
  },
] as const satisfies readonly {
  icon: IconName;
  name: string;
  request: string;
  accepted: string;
  tone: 'amber' | 'violet' | 'green';
}[];

const procurementFlow = [
  { step: '01', role: '调用方', action: '签名目标与预算', evidence: 'Intent' },
  { step: '02', role: '采购 Agent', action: '拆解询价与下单', evidence: 'Task DAG' },
  { step: '03', role: 'Worker', action: '调用供应商与工具', evidence: 'Receipt' },
  { step: '04', role: 'Validator', action: '核对报价与合规', evidence: 'Verdict' },
  { step: '05', role: '结算合约', action: '按验收结果付款', evidence: 'Finality' },
] as const;

export function AcvmUseCasesArchitecture() {
  return (
    <LearningPanel code="ACVM / REAL-WORLD TASK SETTLEMENT" status="USE CASE FIRST" className="acvm-use-cases-panel">
      <div className="use-case-catalog" aria-label="ACVM 典型使用场景">
        {scenarios.map((scenario, index) => (
          <article className={index === 0 ? 'is-primary' : ''} key={scenario.name}>
            <header><span><Icon name={scenario.icon} /></span><strong>{scenario.name}</strong></header>
            <p>{scenario.request}</p>
            <footer><small>验收条件</small><b>{scenario.accepted}</b></footer>
          </article>
        ))}
      </div>

      <section className="procurement-walkthrough" aria-label="自主采购任务流程">
        <header>
          <span><small>ANCHOR CASE</small><strong>采购 Agent 不是替用户聊天，而是替用户完成一笔可结算任务</strong></span>
          <DataChip tone="amber">按结果付款</DataChip>
        </header>
        <div className="procurement-flow">
          {procurementFlow.map((node, index) => (
            <div className="procurement-segment" key={node.step}>
              <article>
                <span>{node.step}</span>
                <strong>{node.role}</strong>
                <p>{node.action}</p>
                <code>{node.evidence}</code>
              </article>
              {index < procurementFlow.length - 1 ? <i aria-hidden="true">→</i> : null}
            </div>
          ))}
        </div>
      </section>

      <footer className="use-case-invariant">
        <span><Icon name="brain" /><b>AI 执行</b><small>模型、API、工具与私有数据留在链下</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="receipt" /><b>证据上链</b><small>任务、产物、裁决与责任形成回执</small></span>
        <i aria-hidden="true">→</i>
        <span><Icon name="shield" /><b>结果结算</b><small>验收与终局完成后才更新状态和付款</small></span>
      </footer>
    </LearningPanel>
  );
}
