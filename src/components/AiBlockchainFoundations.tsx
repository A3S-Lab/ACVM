import { useState } from 'react';
import { Icon, LogoMark } from './Icons';
import { DataChip, FlowArrow, LearningPanel, StepBadge } from './LearningPanel';

const mismatches = [
  ['输出', '共识要求确定', '模型可能采样、漂移'],
  ['成本', '每个节点都要重放', '模型大、推理昂贵'],
  ['数据', '链上输入公开', '提示词与数据可能私密'],
  ['时间', '区块执行受限', '任务可能运行数小时'],
] as const;

export function AiConsensusGapArchitecture() {
  return (
    <LearningPanel code="AI × BLOCKCHAIN / EXECUTION MISMATCH" status="MOVE WORK OFF-CHAIN" className="ai-gap-panel">
      <div className="mismatch-header">
        <section><Icon name="chain" /><span><small>BLOCKCHAIN</small><strong>复制验证</strong></span></section>
        <b>≠</b>
        <section><Icon name="brain" /><span><small>AI WORKLOAD</small><strong>概率计算</strong></span></section>
      </div>
      <div className="mismatch-table">
        <header><span>维度</span><span>链上共识</span><span>AI 执行</span></header>
        {mismatches.map(([dimension, chain, ai]) => (
          <div key={dimension}><strong>{dimension}</strong><span>{chain}</span><span>{ai}</span></div>
        ))}
      </div>
      <footer className="mismatch-conclusion">
        <Icon name="shield" />
        <span><small>CONSENSUS COST</small><strong>模型执行一次；验证者检查回执、证明或验收结果。</strong></span>
      </footer>
    </LearningPanel>
  );
}

export function VerifiableExecutionArchitecture() {
  const stages = [
    ['01', '签名任务', '目标 · 输入根 · 模型根 · 预算'],
    ['02', '锁定结算', '费用与保证金进入托管'],
    ['03', 'Worker 执行', '链下模型、API 与工具'],
    ['04', '提交回执', '输出根 · 轨迹 · 执行证据'],
    ['05', 'Validator 验收', '按冻结规则独立复核'],
    ['06', '链上结算', '验证证据并推进状态'],
  ] as const;

  return (
    <LearningPanel code="AI × BLOCKCHAIN / VERIFIABLE PIPELINE" status="EXECUTE ONCE · VERIFY MANY" className="ai-execution-panel">
      <div className="execution-pipeline">
        {stages.map(([index, title, detail], position) => (
          <div className="execution-stage" key={index}>
            <article className={position === 2 || position === 4 ? 'is-offchain' : 'is-onchain'}>
              <span>{index}</span>
              {position === 2 ? <Icon name="brain" /> : position === 4 ? <Icon name="eye" /> : position === 3 ? <Icon name="receipt" /> : <Icon name="chain" />}
              <strong>{title}</strong><small>{detail}</small>
            </article>
            {position < stages.length - 1 ? <FlowArrow /> : null}
          </div>
        ))}
      </div>
      <div className="execution-boundary">
        <span><b>链上</b> 权限 · 托管 · 证明验证 · 状态</span>
        <i />
        <span><b>链下</b> 模型 · 数据 · API · 长任务</span>
      </div>
      <footer className="execution-artifacts">
        <DataChip tone="blue">taskId</DataChip>
        <DataChip tone="violet">inputRoot</DataChip>
        <DataChip tone="violet">outputRoot</DataChip>
        <DataChip tone="green">workerReceipt</DataChip>
        <DataChip tone="green">validatorVerdict</DataChip>
        <DataChip tone="amber">antiReplayNonce</DataChip>
      </footer>
    </LearningPanel>
  );
}

const verificationMethods = [
  {
    id: 'replication',
    label: '重复执行',
    proof: '多个独立 Worker 得到一致结果',
    goodFor: '确定性、成本适中的任务',
    trust: '多数执行者不串谋',
    cost: '高计算成本',
    tone: 'blue',
  },
  {
    id: 'optimistic',
    label: '挑战机制',
    proof: '先暂定接受，发现错误时提交反证',
    goodFor: '可重放且错误可证明的任务',
    trust: '至少一名诚实监控者在线',
    cost: '低常态成本，终局较慢',
    tone: 'amber',
  },
  {
    id: 'tee',
    label: 'TEE 证明',
    proof: '硬件签名代码、模型与输入输出度量',
    goodFor: '隐私输入与低延迟推理',
    trust: '硬件厂商、固件与侧信道防护',
    cost: '中等，需证明服务',
    tone: 'green',
  },
  {
    id: 'zkml',
    label: 'zkML',
    proof: '零知识证明固定模型正确产生输出',
    goodFor: '模型和算子可电路化的任务',
    trust: '证明系统与电路正确',
    cost: '证明生成成本高',
    tone: 'violet',
  },
  {
    id: 'judgement',
    label: '结果验收',
    proof: 'Validator 按量化规则、样本或人工判断裁决',
    goodFor: '质量带主观性的开放任务',
    trust: '验收规则、激励和争议治理',
    cost: '取决于复核强度',
    tone: 'red',
  },
] as const;

export function VerificationSpectrumArchitecture() {
  const [activeId, setActiveId] = useState<(typeof verificationMethods)[number]['id']>('tee');
  const active = verificationMethods.find((method) => method.id === activeId) ?? verificationMethods[0];

  return (
    <LearningPanel code="AI × BLOCKCHAIN / VERIFICATION SPECTRUM" status="SELECT A TRUST MODEL" className="verification-panel">
      <div className="verification-tabs" role="tablist" aria-label="AI 结果验证方法">
        {verificationMethods.map((method, index) => (
          <button className={method.id === activeId ? 'is-active' : ''} type="button" role="tab" aria-selected={method.id === activeId} onClick={() => setActiveId(method.id)} key={method.id}>
            <span>{String(index + 1).padStart(2, '0')}</span><strong>{method.label}</strong>
          </button>
        ))}
      </div>
      <div className="verification-detail" role="tabpanel">
        <section className={`verification-orb is-${active.tone}`}><Icon name={active.id === 'zkml' ? 'spark' : active.id === 'tee' ? 'lock' : active.id === 'judgement' ? 'eye' : 'shield'} /><span>{active.label}</span></section>
        <dl>
          <div><dt>它证明什么</dt><dd>{active.proof}</dd></div>
          <div><dt>适合什么</dt><dd>{active.goodFor}</dd></div>
          <div><dt>仍然信任</dt><dd>{active.trust}</dd></div>
          <div><dt>主要代价</dt><dd>{active.cost}</dd></div>
        </dl>
      </div>
      <footer className="verification-rule"><Icon name="shield" /><span><strong>各方法验证的命题不同</strong><small>程序执行、数据来源和业务质量需要分别验证。</small></span></footer>
    </LearningPanel>
  );
}

export function AgenticContractBridgeArchitecture() {
  const states = ['Requested', 'Assigned', 'Running', 'Submitted', 'Accepted', 'Settled'];

  return (
    <LearningPanel code="EVOLUTION / SMART CONTRACT → AGENTIC CONTRACT" status="READY FOR ACVM" className="agentic-bridge-panel">
      <div className="contract-evolution">
        <section className="contract-kind is-smart">
          <header><Icon name="terminal" /><span><small>ETHEREUM</small><strong>Smart Contract</strong></span></header>
          <p>一笔交易内执行确定性代码，成功后原子地更新状态。</p>
          <div><DataChip tone="blue">同步调用</DataChip><DataChip tone="blue">有限 Gas</DataChip><DataChip tone="blue">链上数据</DataChip></div>
        </section>
        <FlowArrow label="任务跨越区块与系统" />
        <section className="contract-kind is-agentic">
          <header><LogoMark /><span><small>ACVM</small><strong>Agentic Contract</strong></span></header>
          <p>把链下 Agent 的异步工作建模为带身份、预算、回执和验收的状态机。</p>
          <div><DataChip tone="violet">长任务</DataChip><DataChip tone="violet">能力授权</DataChip><DataChip tone="violet">按结果结算</DataChip></div>
        </section>
      </div>
      <div className="agentic-state-machine">
        <header><span>跨区块任务状态机</span><code>state′ = apply(state, verifiedReceipt)</code></header>
        <div>{states.map((state, index) => <span className={index === 2 ? 'is-active' : ''} key={state}><b>{state}</b>{index < states.length - 1 ? <i>→</i> : null}</span>)}</div>
      </div>
      <footer className="agentic-invariants">
        <StepBadge index="01">预算守恒</StepBadge>
        <StepBadge index="02">权限只能收窄</StepBadge>
        <StepBadge index="03">回执连续且防重放</StepBadge>
        <a href="#spec-contract">进入 ACVM 合约模型 <Icon name="arrow" /></a>
      </footer>
    </LearningPanel>
  );
}
