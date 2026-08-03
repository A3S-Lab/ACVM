import { useState } from 'react';
import { Icon } from './Icons';
import { DataChip, LearningPanel } from './LearningPanel';

const workloadCases = [
  {
    id: 'pure',
    label: '整数计算',
    example: 'swap(x, y, reserves)',
    deterministic: '是',
    externalState: '无',
    repeatedSideEffect: '无',
    duration: '< 1 秒',
    placement: '适合 EVM 链上重放',
    tone: 'green',
  },
  {
    id: 'model',
    label: '模型推理',
    example: 'infer(model, privatePrompt)',
    deterministic: '不一定',
    externalState: '模型权重、GPU、私有输入',
    repeatedSideEffect: '通常无',
    duration: '秒至小时',
    placement: '链下执行；验证模型、输入与输出承诺',
    tone: 'violet',
  },
  {
    id: 'tools',
    label: 'Agent 工具调用',
    example: 'research() → approve() → pay()',
    deterministic: '否',
    externalState: '网页、API、人工审批',
    repeatedSideEffect: '邮件、订单、支付不可重复',
    duration: '跨多个区块',
    placement: 'ACVM 用回执推进异步状态',
    tone: 'amber',
  },
] as const;

export function AcvmExecutionBoundaryArchitecture() {
  const [activeId, setActiveId] = useState<(typeof workloadCases)[number]['id']>('model');
  const active = workloadCases.find((workload) => workload.id === activeId) ?? workloadCases[0];

  return (
    <LearningPanel code="EVM REPLAY vs ACVM RECEIPT VERIFICATION" status="CONSENSUS BOUNDARY" className="acvm-boundary-panel">
      <div className="boundary-workload-tabs" role="tablist" aria-label="执行负载示例">
        {workloadCases.map((workload) => (
          <button type="button" role="tab" aria-selected={workload.id === activeId} className={workload.id === activeId ? 'is-active' : ''} onClick={() => setActiveId(workload.id)} key={workload.id}>
            {workload.label}
          </button>
        ))}
      </div>
      <div className="boundary-comparison">
        <section className="is-evm">
          <header><Icon name="terminal" /><span><small>EVM</small><strong>每个验证者重放</strong></span></header>
          <code>S′ = EVM(S, tx, blockContext)</code>
          <p>输入封闭、执行确定、Gas 有上限，所有节点可独立得到同一后态。</p>
        </section>
        <div className="boundary-case">
          <DataChip tone={active.tone}>{active.label}</DataChip>
          <code>{active.example}</code>
          <dl>
            <div><dt>确定性</dt><dd>{active.deterministic}</dd></div>
            <div><dt>外部状态</dt><dd>{active.externalState}</dd></div>
            <div><dt>重复副作用</dt><dd>{active.repeatedSideEffect}</dd></div>
            <div><dt>耗时</dt><dd>{active.duration}</dd></div>
          </dl>
        </div>
        <section className="is-acvm">
          <header><Icon name="receipt" /><span><small>ACVM</small><strong>执行者工作，验证者验回执</strong></span></header>
          <code>S′ = Apply(S, Verify(receipt, proof))</code>
          <p>{active.placement}</p>
        </section>
      </div>
      <footer className="boundary-cost">
        <span><b>EVM 复制成本</b><code>N validators × C execution</code></span>
        <span><b>ACVM 验证成本</b><code>C execution + N × C verify</code></span>
      </footer>
    </LearningPanel>
  );
}
